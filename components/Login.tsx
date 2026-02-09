import React, { useState } from 'react';
import { supabase } from '../services/supabaseClient';
import { Mail, Lock, Wand2, RefreshCw, Loader2, Plus, Terminal } from 'lucide-react';

const SKILL_CATEGORIES = {
  "Web Development": ["React", "Next.js", "Vue", "Angular", "FastAPI", "Django", "Node.js", "Express", "TailwindCSS", "Bootstrap", "TypeScript", "Redux", "GraphQL"],
  "Hardware & IoT": ["ESP-32", "Arduino", "Raspberry Pi", "Sensors", "PCB Design", "MQTT", "Embedded C", "C++", "Circuit Simulation"],
  "Data Science & AI": ["Python", "TensorFlow", "PyTorch", "Scikit-Learn", "Pandas", "NumPy", "OpenCV", "Machine Learning", "Deep Learning", "R"],
  "Cloud & DevOps": ["Docker", "Kubernetes", "AWS", "Google Cloud", "Azure", "CI/CD", "GitHub Actions", "Terraform", "Nginx"],
  "Other Technical": ["Data Structures", "Algorithms", "PostgreSQL", "MongoDB", "Supabase", "Firebase", "Git", "Linux", "Bash Scripting"]
};

export const Login = () => {
  const [step, setStep] = useState(1); // 1: Auth, 2: Skills Setup
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [useMagicLink, setUseMagicLink] = useState(false);
  
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [customSkill, setCustomSkill] = useState("");

  // --- Handlers ---
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) alert(error.message);
    else window.location.reload();
    setLoading(false);
  };

  const handleMagicLink = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return alert("Please enter your email!");
    setLoading(true);
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: window.location.origin }
    });
    setLoading(false);
    if (error) alert(error.message);
    else alert("Check your email for the magic login link!");
  };

  const handleForgotPassword = async () => {
    if (!email) return alert("Please enter your email address.");
    setLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    setLoading(false);
    if (error) alert(error.message);
    else alert("Password reset link sent!");
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signUp({ 
      email, 
      password,
      options: { data: { skills: selectedSkills } } 
    });
    setLoading(false);
    if (error) alert(error.message);
    else {
      alert("Success! Check your email for a confirmation link.");
      setStep(1);
    }
  };

  const toggleSkill = (skill: string) => {
    setSelectedSkills(prev => 
      prev.includes(skill) ? prev.filter(s => s !== skill) : [...prev, skill]
    );
  };

  const addCustomSkill = () => {
    if (customSkill.trim() && !selectedSkills.includes(customSkill)) {
      setSelectedSkills([...selectedSkills, customSkill.trim()]);
      setCustomSkill("");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 p-6">
      <div className={`w-full ${step === 2 ? 'max-w-2xl' : 'max-w-md'} p-10 bg-slate-900 rounded-[2.5rem] border border-slate-800 shadow-2xl relative overflow-hidden transition-all duration-500`}>
        
        <div className="relative z-10">
          <header className="text-center space-y-2 mb-10">
            <h2 className="text-3xl font-black text-white tracking-tight uppercase italic">Career<span className="text-indigo-500 not-italic">Ladder</span></h2>
            <p className="text-slate-400 text-sm font-medium">
              {step === 1 ? "Secure access to your professional journey" : "Refine your technical stack"}
            </p>
          </header>

          {step === 1 ? (
            <div className="space-y-4 animate-fadeIn">
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4" />
                <input 
                  type="email" placeholder="name@domain.com" 
                  className="w-full pl-12 pr-4 py-4 rounded-2xl bg-slate-800 border border-slate-700 text-white outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                  value={email} onChange={(e) => setEmail(e.target.value)} 
                />
              </div>

              {!useMagicLink && (
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4" />
                  <input 
                    type="password" placeholder="••••••••" 
                    className="w-full pl-12 pr-4 py-4 rounded-2xl bg-slate-800 border border-slate-700 text-white outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                    value={password} onChange={(e) => setPassword(e.target.value)} 
                  />
                </div>
              )}

              <div className="space-y-3 pt-4">
                {useMagicLink ? (
                  <button onClick={handleMagicLink} disabled={loading} className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-black uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-500/20 flex items-center justify-center gap-2">
                    {loading ? <Loader2 className="animate-spin w-4 h-4" /> : <Wand2 className="w-4 h-4" />}
                    Send Magic Link
                  </button>
                ) : (
                  <div className="flex flex-col gap-3">
                    <button onClick={handleLogin} disabled={loading} className="w-full bg-white text-slate-950 py-4 rounded-2xl font-black uppercase tracking-widest hover:bg-slate-100 transition-all flex items-center justify-center gap-2">
                      {loading && <Loader2 className="animate-spin w-4 h-4" />} Login
                    </button>
                    <button onClick={() => setStep(2)} className="w-full bg-slate-800 text-white py-4 rounded-2xl font-black uppercase tracking-widest hover:bg-slate-700 transition-all border border-slate-700">
                      Create Account
                    </button>
                  </div>
                )}
              </div>

              <div className="mt-8 pt-6 border-t border-slate-800 flex flex-col gap-4 text-center">
                <button onClick={() => setUseMagicLink(!useMagicLink)} className="text-indigo-400 text-xs font-bold hover:text-indigo-300 transition-colors flex items-center justify-center gap-2">
                  <RefreshCw className="w-3 h-3" />
                  {useMagicLink ? "Switch to Password Login" : "Use Magic Link"}
                </button>
                {!useMagicLink && (
                  <button onClick={handleForgotPassword} className="text-slate-500 text-xs font-bold hover:text-slate-400">
                    Forgot password?
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="space-y-6 animate-slideIn">
              {/* Massive Skills Box */}
              <div className="space-y-6 max-h-[400px] overflow-y-auto p-4 border border-slate-800 rounded-3xl bg-slate-900/50 custom-scrollbar">
                {Object.entries(SKILL_CATEGORIES).map(([category, skills]) => (
                  <div key={category} className="space-y-2">
                    <h4 className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.2em] mb-2">{category}</h4>
                    <div className="flex flex-wrap gap-2">
                      {skills.map(skill => (
                        <button
                          key={skill}
                          type="button"
                          onClick={() => toggleSkill(skill)}
                          className={`px-3 py-1.5 rounded-xl text-[10px] font-bold transition-all border ${
                            selectedSkills.includes(skill) 
                            ? 'bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-500/20' 
                            : 'bg-slate-800 text-slate-400 border-slate-700 hover:border-slate-500'
                          }`}
                        >
                          {skill}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Custom Skill Bar */}
              <div className="mt-4 flex gap-2">
                <div className="relative flex-1">
                  <Terminal className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4" />
                  <input 
                    type="text" 
                    placeholder="Add a unique skill (e.g. PCB Design)"
                    className="w-full pl-12 pr-4 py-3 bg-slate-800 border border-slate-700 rounded-2xl text-white text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                    value={customSkill}
                    onChange={(e) => setCustomSkill(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && addCustomSkill()}
                  />
                </div>
                <button 
                  type="button"
                  onClick={addCustomSkill}
                  className="px-6 py-3 bg-white text-slate-950 text-xs font-black uppercase tracking-widest rounded-2xl hover:bg-slate-100 transition-all"
                >
                  Add
                </button>
              </div>

              <div className="flex gap-3 pt-4">
                <button onClick={() => setStep(1)} className="flex-1 bg-slate-800 text-white py-4 rounded-2xl font-black uppercase tracking-widest border border-slate-700">
                  Back
                </button>
                <button onClick={handleSignUp} disabled={loading} className="flex-[2] bg-indigo-600 text-white py-4 rounded-2xl font-black uppercase tracking-widest flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/20">
                  {loading && <Loader2 className="animate-spin w-4 h-4" />} Complete Signup
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};