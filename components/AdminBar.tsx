import React from 'react';
import { ShieldCheck, Zap, Users, Database } from 'lucide-react';

interface AdminBarProps {
  userEmail: string | undefined;
}

/**
 * 🛡️ THE GATEKEEPER LIST
 * Only emails in this list will ever see or interact with the Admin Bar.
 * Replace these with your actual hackathon account emails.
 */
const AUTHORIZED_ADMINS = [
  'Bhargavreddy9t@gmail.com', 
  'aadarshcmishra@gmail.com',
  'AmeenaMahekk@gmail.com',
  'inderjeetkaranjaiswal@gmail.com',
  'luckyreddy829@gmail.com'
];

const AdminBar: React.FC<AdminBarProps> = ({ userEmail }) => {
  // 1. Check if user is logged in and if their email is authorized (Case-insensitive)
  const isAdmin = userEmail && AUTHORIZED_ADMINS.includes(userEmail.toLowerCase().trim());

  // 2. If NOT an admin, return null (Zero-footprint security)
  if (!isAdmin) return null;

  return (
    <div className="w-full bg-slate-950 border-b border-indigo-500/30 px-6 py-2 flex items-center justify-between sticky top-0 z-[100] animate-slideDown">
      <div className="flex items-center gap-6">
        {/* Title Section */}
        <div className="flex items-center gap-2">
          <div className="bg-indigo-600 p-1 rounded shadow-lg shadow-indigo-500/20">
            <ShieldCheck size={14} className="text-white" />
          </div>
          <span className="text-[10px] font-black text-white uppercase tracking-[0.2em]">
            Admin Control Panel
          </span>
        </div>
        
        <div className="h-4 w-[1px] bg-slate-800"></div>

        {/* Action Buttons */}
        <div className="flex gap-4">
          <button className="flex items-center gap-1.5 text-slate-400 hover:text-indigo-400 transition-all text-[10px] font-bold uppercase tracking-wider">
            <Zap size={12} />
            Run Scrapers
          </button>
          <button className="flex items-center gap-1.5 text-slate-400 hover:text-indigo-400 transition-all text-[10px] font-bold uppercase tracking-wider">
            <Users size={12} />
            User Stats
          </button>
          <button className="flex items-center gap-1.5 text-slate-400 hover:text-indigo-400 transition-all text-[10px] font-bold uppercase tracking-wider">
            <Database size={12} />
            DB Health
          </button>
        </div>
      </div>

      {/* Auth Status Section */}
      <div className="flex items-center gap-3">
        <div className="px-2 py-0.5 bg-indigo-500/10 border border-indigo-500/20 rounded-full">
          <span className="text-[9px] font-bold text-indigo-300 uppercase tracking-tighter">
            Root Auth: {userEmail?.split('@')[0]}
          </span>
        </div>
      </div>
    </div>
  );
};

export default AdminBar;