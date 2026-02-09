
import React, { useState } from 'react';
import { Terminal, Globe, Play, Loader2, CheckCircle, AlertCircle, Code } from 'lucide-react';
import { triggerScrapeService } from '../services/scraperService';
import { Opportunity } from '../types';

interface AdminDashboardProps {
  onAddOpportunity: (opp: Opportunity) => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ onAddOpportunity }) => {
  const [url, setUrl] = useState('');
  const [isScraping, setIsScraping] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [showCode, setShowCode] = useState(false);

  const handleScrape = async () => {
    if (!url) return;
    setIsScraping(true);
    setStatus('idle');
    try {
      const scrapedData = await triggerScrapeService(url);
      onAddOpportunity(scrapedData as Opportunity);
      setStatus('success');
      setUrl('');
    } catch (error) {
      console.error(error);
      setStatus('error');
    } finally {
      setIsScraping(false);
    }
  };

  const playwrightTemplate = `
// backend/services/scrapers/opportunityScraper.js
const { chromium } = require('playwright');

export async function scrape(url) {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();
  
  try {
    await page.goto(url, { waitUntil: 'networkidle' });
    
    // Custom logic to find opportunity details
    const result = await page.evaluate(() => ({
      title: document.title,
      description: document.querySelector('meta[name="description"]')?.content || '',
      // ... more selectors
    }));
    
    return result;
  } finally {
    await browser.close();
  }
}
  `;

  return (
    <div className="space-y-8 animate-fadeIn">
      <header>
        <h2 className="text-3xl font-bold text-slate-900 tracking-tight italic uppercase">Admin Control Panel</h2>
        <p className="text-slate-500 mt-1">Manage platform data and trigger automated scrapers.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Scraper Control */}
        <div className="bg-white border border-slate-200 rounded-[2.5rem] p-8 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-emerald-100 p-2.5 rounded-2xl">
              <Terminal className="w-6 h-6 text-emerald-600" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">Opportunity Scraper</h3>
          </div>

          <p className="text-slate-600 text-sm mb-6 leading-relaxed">
            Enter a URL to trigger the Playwright-based scraping engine. The system will attempt to extract titles, deadlines, and eligibility criteria automatically.
          </p>

          <div className="space-y-4">
            <div className="relative">
              <Globe className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input 
                type="url" 
                placeholder="https://careers.google.com/..."
                className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
              />
            </div>

            <button 
              onClick={handleScrape}
              disabled={isScraping || !url}
              className="w-full bg-slate-900 text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-3 hover:bg-slate-800 transition-all disabled:opacity-50 shadow-lg shadow-slate-200"
            >
              {isScraping ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Running Playwright...
                </>
              ) : (
                <>
                  <Play className="w-5 h-5 fill-current" />
                  Trigger Scrape
                </>
              )}
            </button>

            {status === 'success' && (
              <div className="flex items-center gap-2 text-emerald-600 bg-emerald-50 p-4 rounded-xl border border-emerald-100 animate-fadeIn">
                <CheckCircle className="w-5 h-5" />
                <span className="text-sm font-bold">Successfully scraped and added to feed!</span>
              </div>
            )}

            {status === 'error' && (
              <div className="flex items-center gap-2 text-red-600 bg-red-50 p-4 rounded-xl border border-red-100 animate-fadeIn">
                <AlertCircle className="w-5 h-5" />
                <span className="text-sm font-bold">Scraper failed. Check backend logs.</span>
              </div>
            )}
          </div>
        </div>

        {/* System Info / Code Preview */}
        <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden flex flex-col">
          <div className="relative z-10 h-full flex flex-col">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="bg-indigo-500/20 p-2.5 rounded-2xl">
                  <Code className="w-6 h-6 text-indigo-400" />
                </div>
                <h3 className="text-xl font-bold">Scraper Template</h3>
              </div>
              <button 
                onClick={() => setShowCode(!showCode)}
                className="text-xs font-bold uppercase tracking-widest text-indigo-400 hover:text-white transition-colors"
              >
                {showCode ? 'Hide Code' : 'View Playwright Template'}
              </button>
            </div>

            {showCode ? (
              <pre className="bg-slate-800 p-4 rounded-2xl text-[10px] font-mono overflow-x-auto text-indigo-200 leading-relaxed border border-slate-700 flex-1">
                <code>{playwrightTemplate}</code>
              </pre>
            ) : (
              <div className="flex-1 flex flex-col justify-center text-center space-y-4">
                <div className="bg-slate-800/50 p-6 rounded-3xl border border-slate-700/50">
                  <p className="text-indigo-300 text-sm italic">"The scraping engine uses headless Chromium instances to render JavaScript-heavy job boards and extraction logic powered by Gemini vision in the backend."</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-800/50 p-4 rounded-2xl border border-slate-700/50 text-left">
                    <p className="text-xs text-slate-500 font-bold uppercase mb-1">Engine Status</p>
                    <p className="text-emerald-400 font-bold">Ready</p>
                  </div>
                  <div className="bg-slate-800/50 p-4 rounded-2xl border border-slate-700/50 text-left">
                    <p className="text-xs text-slate-500 font-bold uppercase mb-1">Last Job</p>
                    <p className="text-slate-300 font-bold">2 mins ago</p>
                  </div>
                </div>
              </div>
            )}
          </div>
          <div className="absolute -right-20 -bottom-20 w-64 h-64 bg-indigo-600/10 rounded-full blur-[80px]"></div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
