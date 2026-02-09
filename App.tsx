import React, { useState, useEffect } from 'react';
import { UserProfile, EducationLevel, Opportunity } from './types';
import Sidebar from './components/Sidebar';
import OpportunityFeed from './components/OpportunityFeed';
import AIMentor from './components/AIMentor';
import AdminDashboard from './components/AdminDashboard';
import MyLadder from './components/MyLadder'; 
import AdminBar from './components/AdminBar'; // New Component
import { Login } from './components/Login'; 
import { Onboarding } from './components/Onboarding'; 
import { supabase } from './services/supabaseClient';
import { ChevronDown } from 'lucide-react';
import { EDUCATION_LEVEL_LABELS } from './constants';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('discover');
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [savedOpportunities, setSavedOpportunities] = useState<any[]>([]);
  const [session, setSession] = useState<any>(null);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  
  const [isOnboarding, setIsOnboarding] = useState(false);
  const [hasCompletedProfile, setHasCompletedProfile] = useState(false);

  const [user, setUser] = useState<UserProfile>({
    name: 'Guest User',
    email: '',
    educationLevel: EducationLevel.UNDERGRADUATE,
    major: 'Exploring',
    interests: [],
    skills: []
  });

  // Fetch Saved Opportunities
  const fetchSavedOpportunities = async (userId: string) => {
    const { data, error } = await supabase
      .from('user_opportunities')
      .select(`*, opportunities (*)`)
      .eq('user_id', userId);

    if (error) console.error("Error fetching saved opportunities:", error);
    else setSavedOpportunities(data || []);
  };

  // Auth Effect
  useEffect(() => {
    const checkProfile = async (supabaseUser: any) => {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', supabaseUser.id)
        .single();

      if (!profile || error) {
        setIsOnboarding(true);
      } else {
        setUser({
          ...profile,
          email: supabaseUser.email, // Ensure email is in user state
          educationLevel: profile.education_level as EducationLevel
        });
        setHasCompletedProfile(true);
        fetchSavedOpportunities(supabaseUser.id);
      }
    };

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) checkProfile(session.user);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) {
        checkProfile(session.user);
        setIsLoginOpen(false);
      } else {
        setUser({ name: 'Guest User', email: '', educationLevel: EducationLevel.UNDERGRADUATE, major: 'Exploring', interests: [], skills: [] });
        setIsOnboarding(false);
        setHasCompletedProfile(false);
        setSavedOpportunities([]);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // Real-time Opportunities Fetching
  useEffect(() => {
    const fetchOpportunities = async () => {
      const { data, error } = await supabase
        .from('opportunities')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) console.error("Error fetching data:", error);
      else {
        const mappedData = data.map((opp: any) => ({
          ...opp,
          educationLevel: opp.education_level, 
        })) as unknown as Opportunity[];
        setOpportunities(mappedData);
      }
    };

    fetchOpportunities();

    const channel = supabase
      .channel('realtime-opps')
      .on('postgres_changes', 
          { event: 'INSERT', schema: 'public', table: 'opportunities' }, 
          (payload) => {
            const newOpp = {
              ...payload.new,
              educationLevel: (payload.new as any).education_level
            } as unknown as Opportunity;
            setOpportunities((prev) => [newOpp, ...prev]);
          }
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  const renderContent = () => {
    switch (activeTab) {
      case 'discover': return <OpportunityFeed user={user} opportunities={opportunities} onSave={() => session && fetchSavedOpportunities(session.user.id)} />;
      case 'ladder': return session ? <MyLadder savedItems={savedOpportunities} refresh={() => fetchSavedOpportunities(session.user.id)} /> : <div className="text-center p-20 font-bold text-slate-400">Login to track your ladder.</div>;
      case 'mentor': return session ? <AIMentor user={user} /> : <div className="text-center p-20 font-bold text-slate-400">Please login to use the AI Mentor.</div>;
      case 'admin': return <AdminDashboard onAddOpportunity={(opp) => setOpportunities(prev => [opp, ...prev])} />;
      default: return null;
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 overflow-x-hidden selection:bg-indigo-100">
      {/* ADMIN BAR - Hidden if not authorized admin email */}
      <AdminBar userEmail={session?.user?.email} />

      <div className="flex flex-1">
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        
        {/* ONBOARDING OVERLAY */}
        {isOnboarding && (
          <Onboarding 
            onComplete={async (newProfile) => {
              const profileToSave = {
                id: session.user.id,
                name: newProfile.name,
                email: session.user.email,
                education_level: newProfile.educationLevel,
                major: newProfile.major,
                skills: newProfile.skills,
                interests: newProfile.interests
              };

              const { error } = await supabase.from('profiles').upsert(profileToSave);

              if (!error) {
                setUser({ ...newProfile, email: session.user.email });
                setIsOnboarding(false);
                setHasCompletedProfile(true);
              } else {
                alert(`Save Failed: ${error.message}`);
              }
            }} 
          />
        )}

        {isLoginOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="relative w-full max-w-md animate-zoomIn">
              <button onClick={() => setIsLoginOpen(false)} className="absolute -top-12 right-0 text-white font-black uppercase text-xs tracking-widest hover:text-indigo-400 transition-colors">Close ✕</button>
              <Login />
            </div>
          </div>
        )}

        <main className="flex-1 min-w-0 flex flex-col">
          <header className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-200/60 flex items-center justify-between px-10 sticky top-0 z-40">
            <div className="flex items-center gap-6">
              <h2 className="font-black text-slate-900 text-xs tracking-[0.3em] uppercase">{activeTab}</h2>
            </div>

            <div className="flex items-center gap-6">
              {session ? (
                <div className="flex items-center gap-3 group cursor-pointer hover:bg-slate-50 p-1.5 rounded-2xl transition-all border border-transparent hover:border-slate-200/50"
                     onClick={() => supabase.auth.signOut()}>
                  <div className="text-right hidden sm:block">
                    <p className="text-xs font-black text-slate-900 leading-tight tracking-tight">{user.name}</p>
                    <p className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest mt-0.5">
                      {EDUCATION_LEVEL_LABELS[user.educationLevel] || 'Student'}
                    </p>
                  </div>
                  <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`} className="w-9 h-9 rounded-xl bg-indigo-50 border border-slate-200 shadow-sm" alt="Avatar" />
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </div>
              ) : (
                <button 
                  onClick={() => setIsLoginOpen(true)}
                  className="bg-indigo-600 text-white px-6 py-2.5 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100"
                >
                  Sign In
                </button>
              )}
            </div>
          </header>

          <div className="p-10 max-w-7xl mx-auto w-full flex-1">
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;