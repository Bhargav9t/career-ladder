import React, { useState, useEffect } from 'react';
import { X, MapPin, Calendar, Building, Target, CheckCircle2, ArrowRight, Sparkles, Loader2, Lightbulb, AlertCircle } from 'lucide-react';
import { Opportunity, AIAnalysisResult, UserProfile } from '../types';
import { getWhyFitsSummary } from '../services/geminiService';

interface OpportunityDetailProps {
  opportunity: Opportunity;
  user: UserProfile;
  analysis?: AIAnalysisResult;
  onClose: () => void;
}

const OpportunityDetail: React.FC<OpportunityDetailProps> = ({ opportunity, user, analysis, onClose }) => {
  const [whyFits, setWhyFits] = useState<string[] | null>(null);
  const [loadingWhy, setLoadingWhy] = useState(false);

  useEffect(() => {
    const fetchSummary = async () => {
      setLoadingWhy(true);
      const summary = await getWhyFitsSummary(user, opportunity);
      setWhyFits(summary);
      setLoadingWhy(false);
    };
    fetchSummary();
  }, [opportunity, user]);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onClose} />
      
      <div className="absolute inset-y-0 right-0 max-w-2xl w-full bg-white shadow-2xl flex flex-col animate-slideInRight">
        <header className="px-6 py-6 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white z-10">
          <div className="flex items-center gap-4">
            <div className="bg-indigo-600 p-2.5 rounded-xl shadow-lg shadow-indigo-100">
              <Building className="text-white w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">{opportunity.title}</h2>
              <p className="text-slate-500 font-medium text-sm uppercase tracking-wider">{opportunity.organization}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400">
            <X className="w-6 h-6" />
          </button>
        </header>

        <div className="flex-1 overflow-y-auto p-8 space-y-10">
          {/* AI Insights Section */}
          <section className="bg-slate-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden">
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-6 text-indigo-400">
                <Sparkles className="w-5 h-5" />
                <h3 className="font-black text-sm uppercase tracking-[0.2em]">Profile Alignment</h3>
              </div>
              
              {loadingWhy ? (
                <div className="flex flex-col items-center justify-center py-4 space-y-4">
                  <Loader2 className="w-6 h-6 animate-spin text-indigo-400" />
                  <p className="text-xs text-slate-400 font-medium">Generating compatibility report...</p>
                </div>
              ) : (
                <ul className="space-y-4">
                  {whyFits?.map((bullet, i) => (
                    <li key={i} className="flex items-start gap-4">
                      <div className="w-6 h-6 bg-indigo-600/30 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 border border-indigo-500/20">
                        <CheckCircle2 className="w-4 h-4 text-indigo-400" />
                      </div>
                      <p className="text-slate-300 text-sm leading-relaxed font-medium">{bullet}</p>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </section>

          {/* Analysis Result (Roadmap & Pivot) */}
          {analysis && (
            <section className="space-y-8">
              <div className="bg-indigo-50 border border-indigo-100 rounded-[2.5rem] p-8 shadow-sm">
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-lg font-bold text-indigo-900 flex items-center gap-2">
                    <Target className="w-5 h-5" /> Strategic Analysis
                  </h3>
                  <span className="bg-white px-4 py-1.5 rounded-full text-indigo-700 font-black text-xs border border-indigo-200">
                    {analysis.fitScore}% MATCH SCORE
                  </span>
                </div>
                
                <div className="space-y-8">
                  {/* Strategic Pivot */}
                  <div className="bg-white/80 p-6 rounded-3xl border border-indigo-100 shadow-sm">
                    <h4 className="flex items-center gap-2 text-[10px] font-black text-indigo-900 uppercase tracking-widest mb-3">
                      <Lightbulb className="w-3.5 h-3.5" /> Recommended Project Pivot
                    </h4>
                    <p className="text-sm text-slate-700 font-medium leading-relaxed">
                      {analysis.projectPivot || "Align existing technical projects with the core themes of this opportunity."}
                    </p>
                  </div>

                  {/* Skill Gaps */}
                  {analysis.skillGaps && (
                    <div>
                      <h4 className="flex items-center gap-2 text-[10px] font-black text-rose-900 uppercase tracking-widest mb-4 opacity-60">
                        <AlertCircle className="w-3.5 h-3.5" /> Technical Skill Gaps
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {analysis.skillGaps.map((gap, i) => (
                          <span key={i} className="px-3 py-1.5 bg-rose-50 text-rose-700 text-[10px] font-bold rounded-xl border border-rose-100">
                            {gap}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Roadmap Section */}
                  <div className="mt-8 space-y-4">
                    <h4 className="font-black text-slate-900 uppercase tracking-widest text-[10px] flex items-center gap-2">
                      <Target className="w-4 h-4 text-indigo-600" />
                      Preparation Roadmap
                    </h4>
                    
                    <div className="relative pl-8 space-y-6 before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
                      {analysis.roadmap?.map((step, index) => (
                        <div key={index} className="relative">
                          <div className="absolute -left-[27px] w-4 h-4 rounded-full bg-white border-4 border-indigo-600 shadow-sm z-10" />
                          <p className="text-sm font-bold text-slate-800">{step}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* Program Details */}
          <div className="space-y-10">
            <section className="space-y-4">
              <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight">Program Description</h3>
              <p className="text-slate-600 leading-relaxed text-sm font-medium">{opportunity.description}</p>
            </section>

            <section className="space-y-4 pb-12">
              <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight">Key Requirements</h3>
              <div className="flex flex-wrap gap-2">
                {opportunity.requirements.map((req, i) => (
                  <span key={i} className="px-5 py-2.5 bg-white text-slate-700 text-xs font-bold rounded-2xl border border-slate-200 shadow-sm">
                    {req}
                  </span>
                ))}
              </div>
            </section>
          </div>
        </div>

        <footer className="p-8 border-t border-slate-100 bg-white/80 backdrop-blur-md sticky bottom-0 z-10">
          <button 
            onClick={() => window.open((opportunity as any).link, '_blank')}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-black uppercase tracking-widest py-5 px-8 rounded-3xl flex items-center justify-center gap-3 transition-all shadow-2xl"
          >
            Access Application
            <ArrowRight className="w-5 h-5" />
          </button>
        </footer>
      </div>
    </div>
  );
};

export default OpportunityDetail;