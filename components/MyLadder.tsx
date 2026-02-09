import React from 'react';
import { Opportunity } from '../types';
import { Layout, CheckCircle2, Clock, Send, Trophy, ExternalLink } from 'lucide-react';
import { supabase } from '../services/supabaseClient';

interface MyLadderProps {
  savedItems: any[];
  refresh: () => void;
}

const MyLadder: React.FC<MyLadderProps> = ({ savedItems, refresh }) => {
  const columns = [
    { id: 'SAVED', title: 'Saved', icon: <Clock className="w-4 h-4 text-slate-400" />, color: 'bg-slate-100' },
    { id: 'APPLIED', title: 'Applied', icon: <Send className="w-4 h-4 text-indigo-500" />, color: 'bg-indigo-50' },
    { id: 'INTERVIEWING', title: 'Interviewing', icon: <Layout className="w-4 h-4 text-amber-500" />, color: 'bg-amber-50' },
    { id: 'OFFERED', title: 'Winner', icon: <Trophy className="w-4 h-4 text-emerald-500" />, color: 'bg-emerald-50' },
  ];

  const updateStatus = async (trackingId: string, newStatus: string) => {
    const { error } = await supabase
      .from('user_opportunities')
      .update({ status: newStatus })
      .eq('id', trackingId);

    if (!error) refresh();
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      <header>
        <h2 className="text-3xl font-black text-slate-900 tracking-tight">My Career Ladder</h2>
        <p className="text-slate-500 mt-1 font-medium">Track your application journey and project pivots.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 overflow-x-auto pb-4">
        {columns.map((col) => (
          <div key={col.id} className={`p-4 rounded-[2rem] ${col.color} min-h-[500px] flex flex-col`}>
            <div className="flex items-center gap-2 mb-6 px-2">
              {col.icon}
              <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest">{col.title}</h3>
              <span className="ml-auto bg-white/50 px-2 py-0.5 rounded-lg text-[10px] font-bold text-slate-500">
                {savedItems.filter(i => i.status === col.id).length}
              </span>
            </div>

            <div className="space-y-4">
              {savedItems
                .filter((item) => item.status === col.id)
                .map((item) => (
                  <div key={item.id} className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200/50 group hover:border-indigo-200 transition-all">
                    <h4 className="font-bold text-slate-900 text-sm mb-1 line-clamp-1">{item.opportunities.title}</h4>
                    <p className="text-[10px] font-bold text-slate-400 uppercase mb-4">{item.opportunities.organization}</p>
                    
                    <div className="flex flex-col gap-2">
                      <select 
                        value={item.status}
                        onChange={(e) => updateStatus(item.id, e.target.value)}
                        className="text-[10px] font-black uppercase bg-slate-50 border-none rounded-lg p-2 outline-none cursor-pointer hover:bg-slate-100 transition-colors"
                      >
                        {columns.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
                      </select>
                      
                      <button 
                        onClick={() => window.open(item.opportunities.link, '_blank')}
                        className="flex items-center justify-center gap-1.5 py-2 bg-indigo-600 text-white rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-indigo-700 transition-all"
                      >
                        Portal <ExternalLink className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyLadder;