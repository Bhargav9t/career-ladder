
import React, { useState, useMemo } from 'react';
import { Search, Filter, Sparkles, MapPin, Calendar, ArrowRight, Loader2 } from 'lucide-react';
import { MOCK_OPPORTUNITIES } from '../constants';
import { Opportunity, UserProfile, AIAnalysisResult } from '../types';
import { analyzeOpportunityFit } from '../services/geminiService';

interface DiscoveryProps {
  user: UserProfile;
}

const Discovery: React.FC<DiscoveryProps> = ({ user }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [analyzingId, setAnalyzingId] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<{ [key: string]: AIAnalysisResult }>({});

  const filteredOpps = useMemo(() => {
    return MOCK_OPPORTUNITIES.filter(opp => {
      const matchesSearch = opp.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          opp.organization.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = selectedType === 'all' || opp.type.toLowerCase() === selectedType.toLowerCase();
      const matchesLevel = opp.level.includes(user.educationLevel);
      return matchesSearch && matchesType && matchesLevel;
    });
  }, [searchTerm, selectedType, user.educationLevel]);

  const handleAnalyze = async (opp: Opportunity) => {
    setAnalyzingId(opp.id);
    const result = await analyzeOpportunityFit(user, opp);
    setAnalysisResult(prev => ({ ...prev, [opp.id]: result }));
    setAnalyzingId(null);
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      <header>
        <h2 className="text-3xl font-bold text-slate-900">Discover Opportunities</h2>
        <p className="text-slate-500 mt-1">Showing personalized results for {user.educationLevel.toLowerCase()} level.</p>
      </header>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
          <input 
            type="text" 
            placeholder="Search internships, scholarships..."
            className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <select 
            className="px-4 py-3 bg-white border border-slate-200 rounded-xl outline-none"
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
          >
            <option value="all">All Types</option>
            <option value="internship">Internships</option>
            <option value="scholarship">Scholarships</option>
            <option value="research">Research</option>
          </select>
          <button className="p-3 bg-white border border-slate-200 rounded-xl hover:bg-slate-50">
            <Filter className="w-5 h-5 text-slate-600" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredOpps.map(opp => (
          <div key={opp.id} className="bg-white border border-slate-200 rounded-2xl overflow-hidden hover:shadow-lg transition-all border-l-4 border-l-indigo-600">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider bg-indigo-50 px-2 py-1 rounded">
                    {opp.type}
                  </span>
                  <h3 className="text-xl font-bold text-slate-900 mt-2">{opp.title}</h3>
                  <p className="text-slate-600 font-medium">{opp.organization}</p>
                </div>
                {opp.amount && <div className="text-lg font-bold text-emerald-600">{opp.amount}</div>}
              </div>

              <div className="flex flex-wrap gap-4 text-sm text-slate-500 mb-6">
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4" />
                  {opp.location}
                </div>
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4" />
                  Deadline: {new Date(opp.deadline).toLocaleDateString()}
                </div>
              </div>

              <p className="text-slate-600 text-sm line-clamp-2 mb-6">{opp.description}</p>

              {analysisResult[opp.id] && (
                <div className="mb-6 p-4 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2 font-bold text-slate-900">
                      <Sparkles className="w-4 h-4 text-amber-500" />
                      AI Match Analysis
                    </div>
                    <span className={`px-2 py-0.5 rounded text-xs font-bold ${
                      analysisResult[opp.id].fitScore > 80 ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                    }`}>
                      {analysisResult[opp.id].fitScore}% Match
                    </span>
                  </div>
                  <div className="space-y-2">
                    <p className="text-xs text-slate-600"><span className="font-semibold">Strength:</span> {analysisResult[opp.id].strengths[0]}</p>
                    <p className="text-xs text-slate-600"><span className="font-semibold">Action:</span> {analysisResult[opp.id].actionPlan[0]}</p>
                  </div>
                </div>
              )}

              <div className="flex gap-3">
                <button 
                  onClick={() => handleAnalyze(opp)}
                  disabled={analyzingId === opp.id}
                  className="flex-1 flex items-center justify-center gap-2 bg-indigo-50 text-indigo-700 px-4 py-2.5 rounded-xl font-semibold hover:bg-indigo-100 transition-colors"
                >
                  {analyzingId === opp.id ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Sparkles className="w-4 h-4" />
                  )}
                  AI Analyze
                </button>
                <button className="flex-1 flex items-center justify-center gap-2 bg-indigo-600 text-white px-4 py-2.5 rounded-xl font-semibold hover:bg-indigo-700 transition-colors shadow-sm">
                  Apply Now
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Discovery;
