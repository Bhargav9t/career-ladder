import React, { useState, useMemo } from 'react';
import { Search, Filter, Sparkles, MapPin, Calendar, Loader2, Target, Building, Heart, ExternalLink, BookOpen, Briefcase, Trophy, Code } from 'lucide-react';
import { EDUCATION_LEVEL_LABELS } from '../constants';
import { Opportunity, UserProfile, AIAnalysisResult, EducationLevel } from '../types';
import { analyzeOpportunityFit } from '../services/geminiService';
import OpportunityDetail from './OpportunityDetail';

interface OpportunityFeedProps {
  user: UserProfile;
  opportunities: Opportunity[];
}

const OpportunityFeed: React.FC<OpportunityFeedProps> = ({ user, opportunities }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLevel, setSelectedLevel] = useState<EducationLevel | 'ALL'>(user.educationLevel);
  const [selectedType, setSelectedType] = useState('ALL');
  const [analyzingId, setAnalyzingId] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<{ [key: string]: AIAnalysisResult }>({});
  const [selectedOpp, setSelectedOpp] = useState<Opportunity | null>(null);

  // Helper to get dynamic icons based on type
  const getTypeIcon = (type: string) => {
    switch (type?.toUpperCase()) {
      case 'RESEARCH': return <BookOpen className="w-6 h-6 text-emerald-600" />;
      case 'INTERNSHIP': return <Briefcase className="w-6 h-6 text-amber-600" />;
      case 'COMPETITION': return <Trophy className="w-6 h-6 text-purple-600" />;
      default: return <Code className="w-6 h-6 text-indigo-600" />;
    }
  };

  const filteredOpps = useMemo(() => {
    if (!opportunities) return [];

    return opportunities.filter(opp => {
      const matchesSearch = (opp.title?.toLowerCase() || '').includes(searchTerm.toLowerCase()) || 
                          (opp.organization?.toLowerCase() || '').includes(searchTerm.toLowerCase());
      
      const oppType = opp.type || 'HACKATHON'; 
      const matchesType = selectedType === 'ALL' || oppType.toUpperCase() === selectedType.toUpperCase();
      
      const currentLevel = (opp as any).educationLevel || (opp as any).level || (opp as any).education_level || "";
      const matchesLevel = selectedLevel === 'ALL' || currentLevel.includes(selectedLevel);
      
      return matchesSearch && matchesType && matchesLevel;
    });
  }, [searchTerm, selectedType, selectedLevel, opportunities]);

  const handleAnalyze = async (e: React.MouseEvent, opp: Opportunity) => {
    e.stopPropagation();
    setAnalyzingId(opp.id);
    const result = await analyzeOpportunityFit(user, opp);
    setAnalysisResult(prev => ({ ...prev, [opp.id]: result }));
    setAnalyzingId(null);
  };

  const handleApply = (e: React.MouseEvent, link: string | undefined) => {
    e.stopPropagation(); 
    if (link && link !== '#') {
      window.open(link, '_blank', 'noopener,noreferrer');
    } else {
      alert("Application link is coming soon or not available for this event.");
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Personalized Feed</h2>
          <p className="text-slate-500 mt-1 font-medium">Curated tasks for your career ladder.</p>
        </div>
        
        {/* Education Level Pills */}
        <div className="flex bg-slate-200/50 p-1.5 rounded-2xl border border-slate-200/50 backdrop-blur-sm overflow-x-auto no-scrollbar shadow-inner">
          {['ALL', ...Object.values(EducationLevel)].map((level) => (
            <button
              key={level}
              onClick={() => setSelectedLevel(level as any)}
              className={`px-5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                selectedLevel === level 
                  ? 'bg-white text-indigo-600 shadow-sm' 
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              {level === 'ALL' ? 'Everything' : EDUCATION_LEVEL_LABELS[level as EducationLevel]}
            </button>
          ))}
        </div>
      </header>

      {/* Sticky Search and Filter Bar */}
      <div className="flex flex-col md:flex-row gap-4 sticky top-[5rem] z-20 py-4 bg-slate-50/80 backdrop-blur-md -mx-4 px-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
          <input 
            type="text" 
            placeholder="Search Research, Internships, Hackathons..."
            className="w-full pl-11 pr-4 py-3.5 bg-white/70 border border-slate-200/60 rounded-2xl focus:ring-4 focus:ring-indigo-500/5 outline-none transition-all text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        {/* UPDATED CATEGORY DROPDOWN */}
        <div className="relative">
          <select 
            className="appearance-none px-6 pr-10 py-3.5 bg-white/70 border border-slate-200/60 rounded-2xl outline-none font-bold text-xs text-slate-700 cursor-pointer hover:bg-white transition-all backdrop-blur-sm uppercase tracking-wider"
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
          >
            <option value="ALL">All Tasks</option>
            <option value="HACKATHON">Hackathons</option>
            <option value="INTERNSHIP">Internships</option>
            <option value="RESEARCH">Research Papers</option>
            <option value="COMPETITION">Competitions</option>
          </select>
          <Filter className="absolute right-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredOpps.map(opp => (
          <div 
            key={opp.id} 
            onClick={() => setSelectedOpp(opp)}
            className="group relative bg-white/40 backdrop-blur-xl border border-white/20 rounded-[2.5rem] overflow-hidden hover:bg-white/60 transition-all duration-500 cursor-pointer flex flex-col shadow-xl shadow-slate-200/40"
          >
            <div className="p-8 pb-4 flex items-start justify-between">
              <div className="w-14 h-14 bg-white rounded-2xl shadow-sm border border-slate-100 flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                {getTypeIcon(opp.type)}
              </div>
              <button onClick={(e) => e.stopPropagation()} className="p-2.5 bg-white/50 rounded-xl text-slate-400 hover:text-red-500 border border-slate-100 shadow-sm">
                <Heart className="w-4 h-4" />
              </button>
            </div>

            <div className="px-8 pb-8 flex-1 flex flex-col">
              <div className="flex items-center gap-2 mb-3">
                <span className={`text-[10px] font-black uppercase tracking-[0.2em] px-2 py-1 rounded-md ring-1 ${
                  opp.type === 'RESEARCH' ? 'text-emerald-600 bg-emerald-50/50 ring-emerald-100' : 
                  opp.type === 'INTERNSHIP' ? 'text-amber-600 bg-amber-50/50 ring-amber-100' : 'text-indigo-600 bg-indigo-50/50 ring-indigo-100'
                }`}>
                  {opp.type || 'Task'}
                </span>
                {analysisResult[opp.id] && (
                  <span className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.2em] bg-emerald-50/50 px-2 py-1 rounded-md ring-1 ring-emerald-100 flex items-center gap-1">
                    <Target className="w-3 h-3" />
                    {analysisResult[opp.id].fitScore}% Match
                  </span>
                )}
              </div>
              
              <h3 className="text-xl font-bold text-slate-900 group-hover:text-indigo-600 transition-colors mb-2 line-clamp-1">
                {opp.title}
              </h3>
              <p className="text-slate-500 text-xs font-bold mb-4">{opp.organization}</p>

              <div className="space-y-2 mb-6">
                <div className="flex items-center gap-2 text-[11px] text-slate-400 font-medium">
                  <MapPin className="w-3.5 h-3.5" />
                  {opp.location || 'Remote'}
                </div>
              </div>

              <p className="text-slate-600 text-sm leading-relaxed line-clamp-2 mb-8 font-medium italic">
                {opp.description}
              </p>

              <div className="mt-auto pt-6 border-t border-slate-200/50 flex items-center justify-between">
                <button 
                  onClick={(e) => handleAnalyze(e, opp)}
                  disabled={analyzingId === opp.id}
                  className="p-2.5 bg-slate-900 text-white rounded-xl hover:bg-slate-800 disabled:opacity-50"
                >
                  {analyzingId === opp.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                </button>
                
                <button 
                  onClick={(e) => handleApply(e, (opp as any).link)}
                  className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-indigo-700 shadow-lg shadow-indigo-100 ring-4 ring-indigo-50"
                >
                  Apply
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {selectedOpp && (
        <OpportunityDetail 
          opportunity={selectedOpp} 
          user={user}
          analysis={analysisResult[selectedOpp.id]}
          onClose={() => setSelectedOpp(null)}
        />
      )}
    </div>
  );
};

export default OpportunityFeed;