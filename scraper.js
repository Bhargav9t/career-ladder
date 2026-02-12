import { createClient } from '@supabase/supabase-js';
import { chromium } from 'playwright';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

async function scrapeOpportunities() {
  const browser = await chromium.launch({ headless: true }); 
  const context = await browser.newContext({
    userAgent: 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
    viewport: { width: 1280, height: 800 }
  });
  const page = await context.newPage();

  // --- 1. RESEARCH PAPERS & CFPs (arXiv / Targeted Search) ---
  try {
    console.log("Searching Research Opportunities...");
    // Searching for recent Computer Science papers related to your hardware/web interests
    await page.goto('https://arxiv.org/list/cs/new', { waitUntil: 'domcontentloaded' });
    
    const researchData = await page.evaluate(() => {
      const entries = document.querySelectorAll('dt');
      const metas = document.querySelectorAll('dd');
      return Array.from(entries).slice(0, 10).map((dt, i) => {
        const title = metas[i].querySelector('.list-title')?.innerText.replace('Title:', '').trim();
        return {
          title: title,
          organization: metas[i].querySelector('.list-authors')?.innerText.replace('Authors:', '').trim() || 'arXiv',
          description: 'New Research Publication: Explore for literature review or project inspiration.',
          type: 'RESEARCH',
          education_level: 'GRADUATE',
          link: dt.querySelector('a[title="Abstract"]')?.href,
          requirements: ['Literature Review', 'Academic Writing']
        };
      });
    });
    await insertToSupabase(researchData.filter(d => d.title));
  } catch (e) { console.error("Research Scrape Failed:", e.message); }

  // --- 2. HACKATHONS (Devpost) ---
  try {
    console.log("Searching Devpost...");
    await page.goto('https://devpost.com/hackathons', { waitUntil: 'domcontentloaded' });
    await page.waitForSelector('.hackathon-tile', { timeout: 15000 });
    const devpostData = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('.hackathon-tile')).map(tile => ({
        title: tile.querySelector('h3')?.innerText.trim(),
        organization: tile.querySelector('.organizer')?.innerText.trim() || 'Devpost',
        description: tile.querySelector('.tagline')?.innerText.trim(),
        type: 'HACKATHON',
        education_level: 'UNDERGRADUATE',
        link: tile.querySelector('a')?.href
      }));
    });
    await insertToSupabase(devpostData.filter(d => d.title));
  } catch (e) { console.error("Devpost Failed:", e.message); }

  // --- 3. INTERNSHIPS (LinkedIn Simplified) ---
  try {
    console.log("Searching LinkedIn Internships...");
    await page.goto('https://www.linkedin.com/jobs/search/?keywords=Internship&location=India&f_TPR=r86400', { waitUntil: 'domcontentloaded' });
    await page.waitForSelector('.base-search-card', { timeout: 15000 });
    const linkedInData = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('.base-search-card')).map(card => ({
        title: card.querySelector('.base-search-card__title')?.innerText.trim(),
        organization: card.querySelector('.base-search-card__subtitle')?.innerText.trim(),
        link: card.querySelector('a.base-card__full-link')?.href,
        type: 'INTERNSHIP',
        education_level: 'UNDERGRADUATE',
        description: 'New Internship Opportunity'
      }));
    });
    await insertToSupabase(linkedInData.filter(d => d.title));
  } catch (e) { console.error("LinkedIn Failed:", e.message); }

  // --- 4. CAREER TASKS (Unstop Competitions) ---
  try {
    console.log("Searching Unstop Tasks...");
    await page.goto('https://unstop.com/competitions', { waitUntil: 'domcontentloaded' });
    await page.mouse.wheel(0, 2000);
    await page.waitForTimeout(2000);
    const unstopData = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('.competitions_card')).map(card => ({
        title: card.querySelector('h2')?.innerText.trim(),
        organization: card.querySelector('.company_name')?.innerText.trim() || 'Unstop',
        type: 'COMPETITION',
        education_level: 'UNDERGRADUATE',
        link: card.querySelector('a')?.href,
        description: 'Skills-based career challenge'
      }));
    });
    await insertToSupabase(unstopData.filter(d => d.title));
  } catch (e) { console.error("Unstop Failed:", e.message); }

  await browser.close();
  console.log("🚀 All career-related tasks synchronized!");
}

async function insertToSupabase(data) {
  if (!data.length) return;
  const { error } = await supabase.from('opportunities').upsert(data, { onConflict: 'title' });
  if (error) console.error("Sync Error:", error.message);
  else console.log(`✅ Synced ${data.length} items.`);
}

scrapeOpportunities();
