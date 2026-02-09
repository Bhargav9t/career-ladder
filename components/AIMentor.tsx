import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Sparkles, Loader2, AlertCircle } from 'lucide-react';
import { UserProfile } from '../types';
import { getAcademicAdvice } from '../services/geminiService';

interface AIMentorProps {
  user: UserProfile;
}

interface Message {
  id: string;
  role: 'assistant' | 'user' | 'error';
  text: string;
  timestamp: Date;
}

const AIMentor: React.FC<AIMentorProps> = ({ user }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      text: `Hello ${user.name}! I'm your AI Academic Mentor. How can I help you today with your ${user.educationLevel.toLowerCase()} journey?`,
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [messages, isLoading]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      text: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    const currentInput = input;
    setInput('');
    setIsLoading(true);

    try {
      const response = await getAcademicAdvice(user, currentInput);
      
      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: response.includes("offline") || response.includes("Error") ? 'error' : 'assistant',
        text: response,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, aiMsg]);
    } catch (err) {
      const errorMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'error',
        text: "I encountered a technical glitch. Please check your API key connection.",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-[calc(100vh-12rem)] flex flex-col bg-white border border-slate-200 rounded-[2rem] shadow-xl shadow-slate-200/50 overflow-hidden animate-fadeIn">
      {/* Header */}
      <div className="p-6 border-b border-slate-100 bg-white flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="bg-slate-900 p-2.5 rounded-2xl shadow-lg shadow-slate-200">
            <Bot className="text-white w-5 h-5" />
          </div>
          <div>
            <h3 className="font-black text-slate-900 tracking-tight uppercase text-xs">AI Academic Coach</h3>
            <div className="flex items-center gap-1.5 text-[10px] text-emerald-600 font-bold uppercase tracking-widest mt-0.5">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
              Strategic Mode Active
            </div>
          </div>
        </div>
      </div>

      {/* Chat Area */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-8 space-y-6 bg-slate-50/30"
      >
        {messages.map(msg => (
          <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`flex gap-4 max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
              <div className={`w-9 h-9 rounded-xl flex-shrink-0 flex items-center justify-center border ${
                msg.role === 'user' 
                  ? 'bg-indigo-50 border-indigo-100 text-indigo-600' 
                  : msg.role === 'error' 
                  ? 'bg-rose-50 border-rose-100 text-rose-600'
                  : 'bg-slate-900 border-slate-800 text-white'
              }`}>
                {msg.role === 'user' ? <User size={18} /> : <Bot size={18} />}
              </div>
              
              <div className={`p-5 rounded-[1.5rem] text-sm leading-relaxed shadow-sm ${
                msg.role === 'user' 
                  ? 'bg-indigo-600 text-white rounded-tr-none font-medium' 
                  : msg.role === 'error'
                  ? 'bg-rose-50 text-rose-700 border border-rose-100 rounded-tl-none font-bold'
                  : 'bg-white text-slate-700 border border-slate-100 rounded-tl-none font-medium'
              }`}>
                {msg.role === 'error' && <AlertCircle className="w-4 h-4 mb-2" />}
                {msg.text}
                <div className={`text-[10px] mt-3 opacity-40 font-bold ${msg.role === 'user' ? 'text-right' : 'text-left'}`}>
                  {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="flex justify-start animate-pulse">
            <div className="flex gap-4">
              <div className="w-9 h-9 rounded-xl bg-slate-900 text-white flex items-center justify-center">
                <Bot size={18} />
              </div>
              <div className="bg-white border border-slate-100 p-5 rounded-[1.5rem] rounded-tl-none shadow-sm">
                <div className="flex gap-1">
                  <span className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                  <span className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                  <span className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce"></span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="p-6 bg-white border-t border-slate-100">
        <div className="relative group">
          <input 
            type="text" 
            placeholder="How can I align my hardware project with a web internship?"
            className="w-full pl-6 pr-14 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500/50 focus:bg-white outline-none transition-all text-sm font-medium"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            disabled={isLoading}
          />
          <button 
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 p-2.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 disabled:opacity-30 disabled:hover:bg-indigo-600 transition-all shadow-lg shadow-indigo-100 active:scale-95"
          >
            {isLoading ? <Loader2 size={20} className="animate-spin" /> : <Send size={20} />}
          </button>
        </div>
        <p className="text-[10px] text-slate-400 text-center mt-4 font-bold uppercase tracking-widest">
          Powered by Gemini AI • Strategy Session
        </p>
      </div>
    </div>
  );
};

export default AIMentor;