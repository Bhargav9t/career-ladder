import { createClient } from '@supabase/supabase-js';
import { chromium } from 'playwright';
import dotenv from "dotenv";

dotenv.config();

// Ensure env vars exist before proceeding
if (!process.env.SUPABASE_URL || !process.env.SUPABASE_ANON_KEY) {
  console.error("❌ Error: Missing Supabase environment variables.");
  process.exit(1);
}

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

async function scrapeOpportunities() {
  console.log("🚀 Starting scraper...");
  
  // FIX: Added '--disable-dev-shm-usage' to prevent crashes in Docker/CI
  const browser = await chromium.launch({
    headless: true,
    args: [
      "--no-sandbox", 
      "--disable-setuid-sandbox", 
      "--disable-dev-shm-usage" 
    ]
  });

  const context = await browser.newContext({
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36",
    viewport: { width: 1280, height: 800 }
  });

  const page = await context.newPage();

  // ---------- 1. RESEARCH PAPERS (arXiv) ----------
  try {
    console.log("🔍 Searching arXiv...");
    await page.goto("https://arxiv.org/list/cs/new", { waitUntil: "domcontentloaded" });
    
    const researchData = await page.evaluate(() => {
      const entries = document.querySelectorAll("dt");
      const metas = document.querySelectorAll("dd");
      return Array.from(entries).slice(0, 10).map((dt, i) => ({
        title: metas[i]?.querySelector(".list-title")?.innerText.replace("Title:", "").trim(),
        organization: metas[i]?.querySelector(".list-authors")?.innerText.replace("Authors:", "").trim() || "arXiv",
        description: "New Research Publication",
        type: "RESEARCH",
        education_level: "GRADUATE",
        link: "https://arxiv.org" + dt.querySelector('a[title="Abstract"]')?.getAttribute('href'), // Ensure full URL
        requirements: ["Literature Review", "Academic Writing"]
      }));
    });

    await insertToSupabase(researchData);
  } catch (e) {
    console.error("⚠️ arXiv Scrape Failed:", e.message);
  }

  // ---------- 2. HACKATHONS (Devpost) ----------
  try {
    console.log("🔍 Searching Devpost...");
    await page.goto("https://devpost.com/hackathons", { waitUntil: "domcontentloaded" });
    
    // Increased timeout for stability
    try { await page.waitForSelector(".hackathon-tile", { timeout: 10000 }); } catch(e) {}

    const devpostData = await page.evaluate(() =>
      Array.from(document.querySelectorAll(".hackathon-tile")).map(tile => ({
        title: tile.querySelector("h3")?.innerText.trim(),
        organization: tile.querySelector(".organizer")?.innerText.trim() || "Devpost",
        description: tile.querySelector(".tagline")?.innerText.trim(),
        type: "HACKATHON",
        education_level: "UNDERGRADUATE",
        link: tile.querySelector("a")?.href
      }))
    );

    await insertToSupabase(devpostData);
  } catch (e) {
    console.error("⚠️ Devpost Failed:", e.message);
  }

  // ---------- 3. COMPETITIONS (Unstop) ----------
  try {
    console.log("🔍 Searching Unstop...");
    await page.goto("https://unstop.com/competitions", { waitUntil: "networkidle" }); // Networkidle helps with lazy loading
    
    // Scroll to trigger lazy load
    await page.mouse.wheel(0, 3000);
    await page.waitForTimeout(3000);

    const unstopData = await page.evaluate(() =>
      Array.from(document.querySelectorAll(".competitions_card, .c-card")).map(card => ({
        title: card.querySelector("h2, h3")?.innerText.trim(),
        organization: card.querySelector(".company_name, .org-name")?.innerText.trim() || "Unstop",
        type: "COMPETITION",
        education_level: "UNDERGRADUATE",
        link: card.querySelector("a")?.href,
        description: "Skills-based career challenge"
      }))
    );

    await insertToSupabase(unstopData);
  } catch (e) {
    console.error("⚠️ Unstop Failed:", e.message);
  }

  await browser.close();
  console.log("✅ Scraper finished.");
}

async function insertToSupabase(data) {
  // Filter out empty items
  const validData = data.filter(d => d.title && d.link);

  if (!validData.length) return;

  // FIX: Using 'link' as the conflict target prevents duplicates of common titles
  const { error } = await supabase
    .from("opportunities")
    .upsert(validData, { onConflict: "link" }); 

  if (error) console.error("❌ Supabase Error:", error.message);
  else console.log(`   Saved ${validData.length} items to DB.`);
}

// Run main function
scrapeOpportunities();
