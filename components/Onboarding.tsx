import React, { useState } from 'react';
import { Code, GraduationCap, Rocket, ChevronRight, Sparkles, Layers } from 'lucide-react';
import { UserProfile, EducationLevel } from '../types';

interface OnboardingProps {
  onComplete: (profile: any) => void;
}

export const Onboarding: React.FC<OnboardingProps> = ({ onComplete }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    educationLevel: EducationLevel.UNDERGRADUATE,
    major: '',
    skills: [] as string[],
    projectDesc: ''
  });

  const skillsList = ['React', 'Node.js', 'Python', 'C++', 'ESP-32', 'Arduino', 'Linux', 'Tailwind CSS', 'TypeScript'];

  const toggleSkill = (skill: string) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.includes(skill) 
        ? prev.skills.filter(s => s !== skill) 
        : [...prev.skills, skill]
    }));
  };

  const handleFinish = () => {
    console.log("Onboarding Attempting to Finish with data:", formData);

    // Basic Validation to prevent silent failures
    if (!formData.name.trim()) {
      alert("Please enter your name in Step 1");
      setStep(1);
      return;
    }
    if (!formData.projectDesc.trim()) {
      alert("Please describe your project (like the bus engine system)!");
      return;
    }

    // Wrap in a try-catch just in case the parent onComplete fails
    try {
      onComplete({
        name: formData.name,
        educationLevel: formData.educationLevel,
        major: formData.major,
        skills: formData.skills,
        interests: [formData.projectDesc] 
      });
    } catch (error) {
      console.error("Onboarding Component Error:", error);
      alert("There was an error saving your profile. Check the console (F12).");
    }
  };

  return (
    <div className="fixed inset-0 z-[110] bg-slate-900/90 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-xl rounded-[2.5rem] overflow-hidden shadow-2xl animate-fadeIn">
        
        {/* Progress Bar */}
        <div className="h-2 bg-slate-100 w-full">
          <div 
            className="h-full bg-indigo-600 transition-all duration-500" 
            style={{ width: `${(step / 3) * 100}%` }}
          />
        </div>

        <div className="p-10">
          {step === 1 && (
            <div className="space-y-6">
              <div className="inline-flex p-3 bg-indigo-50 rounded-2xl text-indigo-600">
                <GraduationCap className="w-8 h-8" />
              </div>
              <h2 className="text-3xl font-black text-slate-900">Education First</h2>
              <p className="text-slate-500 font-medium">Tell us what you're currently studying.</p>
              
              <input 
                className="w-full p-4 bg-slate-50 border-2 border-transparent focus:border-indigo-500 rounded-2xl outline-none transition-all font-bold text-slate-900"
                placeholder="Full Name"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
              />
              <input 
                className="w-full p-4 bg-slate-50 border-2 border-transparent focus:border-indigo-500 rounded-2xl outline-none transition-all font-bold text-slate-900"
                placeholder="Major (e.g. Computer Science)"
                value={formData.major}
                onChange={(e) => setFormData({...formData, major: e.target.value})}
              />
              
              <button 
                onClick={() => setStep(2)}
                className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-slate-800 transition-all"
              >
                Continue <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <div className="inline-flex p-3 bg-emerald-50 rounded-2xl text-emerald-600">
                <Code className="w-8 h-8" />
              </div>
              <h2 className="text-3xl font-black text-slate-900">Your Toolkit</h2>
              <p className="text-slate-500 font-medium">Select the technologies you're comfortable with.</p>
              
              <div className="flex flex-wrap gap-2">
                {skillsList.map(skill => (
                  <button 
                    key={skill}
                    type="button"
                    onClick={() => toggleSkill(skill)}
                    className={`px-4 py-2 rounded-xl font-bold text-xs transition-all border-2 ${
                      formData.skills.includes(skill) 
                        ? 'bg-indigo-600 border-indigo-600 text-white' 
                        : 'bg-white border-slate-100 text-slate-500 hover:border-indigo-200'
                    }`}
                  >
                    {skill}
                  </button>
                ))}
              </div>

              <button 
                onClick={() => setStep(3)}
                className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold flex items-center justify-center gap-2"
              >
                Almost Done <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <div className="inline-flex p-3 bg-amber-50 rounded-2xl text-amber-600">
                <Layers className="w-8 h-8" />
              </div>
              <h2 className="text-3xl font-black text-slate-900">Featured Project</h2>
              <p className="text-slate-500 font-medium">Describe your best project (e.g., your bus engine fire prevention system).</p>
              
              <textarea 
                className="w-full p-4 bg-slate-50 border-2 border-transparent focus:border-indigo-500 rounded-2xl outline-none transition-all font-medium h-32 text-slate-900"
                placeholder="e.g. Developed an ESP-32 based fire prevention system for bus engines..."
                value={formData.projectDesc}
                onChange={(e) => setFormData({...formData, projectDesc: e.target.value})}
              />

              <button 
                onClick={handleFinish}
                className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-indigo-200 hover:bg-indigo-700 active:scale-[0.98] transition-all"
              >
                Complete Profile <Rocket className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};