import React from 'react';
import { 
  Home, 
  MessageSquare, 
  LogOut,
  Rocket,
  ShieldCheck,
  TrendingUp
} from 'lucide-react';
import { supabase } from '../services/supabaseClient';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  const menuItems = [
    { id: 'discover', label: 'Home', icon: Home },
    { id: 'ladder', label: 'My Ladder', icon: TrendingUp },
    { id: 'mentor', label: 'AI Coach', icon: MessageSquare },
  ];

  const adminItems = [
    { id: 'admin', label: 'Admin Panel', icon: ShieldCheck },
  ];

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Error logging out:", error.message);
    } else {
      // The onAuthStateChange listener in App.tsx will handle the UI reset
      window.location.reload(); 
    }
  };

  return (
    <aside className="w-64 bg-slate-50/50 border-r border-slate-200/60 h-screen sticky top-0 flex flex-col z-30">
      <div className="p-8 flex items-center gap-3">
        <div className="bg-indigo-600 p-2 rounded-xl shadow-lg shadow-indigo-200/50 ring-4 ring-indigo-50">
          <Rocket className="text-white w-5 h-5" />
        </div>
        <h1 className="text-lg font-bold text-slate-900 tracking-tight leading-none uppercase italic font-black">
          Career<br/><span className="text-indigo-600 not-italic">Ladder</span>
        </h1>
      </div>

      <div className="flex-1 px-4 py-4 space-y-8">
        <section>
          <p className="px-5 mb-3 text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Navigation</p>
          <nav className="space-y-1">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-5 py-3 rounded-xl transition-all duration-200 group ${
                  activeTab === item.id 
                    ? 'bg-white text-indigo-600 font-semibold shadow-sm border border-slate-200/50' 
                    : 'text-slate-500 hover:bg-slate-200/50 hover:text-slate-900'
                }`}
              >
                <item.icon className={`w-4 h-4 transition-colors ${activeTab === item.id ? 'text-indigo-600' : 'text-slate-400 group-hover:text-slate-600'}`} />
                <span className="text-sm">{item.label}</span>
              </button>
            ))}
          </nav>
        </section>

        <section>
          <p className="px-5 mb-3 text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Management</p>
          <nav className="space-y-1">
            {adminItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-5 py-3 rounded-xl transition-all duration-200 group ${
                  activeTab === item.id 
                    ? 'bg-white text-indigo-600 font-semibold shadow-sm border border-slate-200/50' 
                    : 'text-slate-500 hover:bg-slate-200/50 hover:text-slate-900'
                }`}
              >
                <item.icon className={`w-4 h-4 transition-colors ${activeTab === item.id ? 'text-indigo-600' : 'text-slate-400 group-hover:text-slate-600'}`} />
                <span className="text-sm">{item.label}</span>
              </button>
            ))}
          </nav>
        </section>
      </div>

      {/* Premium Upgrade section removed for a cleaner, free-tier focused experience */}

      <div className="p-4 border-t border-slate-200/60">
        <button 
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-5 py-3 text-slate-400 hover:text-red-500 rounded-xl transition-all hover:bg-red-50 group"
        >
          <LogOut className="w-4 h-4 transition-colors group-hover:text-red-500" />
          <span className="text-sm font-medium">Log Out</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;