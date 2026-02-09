
import React from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell
} from 'recharts';
import { CheckCircle2, Clock, XCircle, TrendingUp } from 'lucide-react';

const data = [
  { name: 'Saved', count: 12, color: '#6366f1' },
  { name: 'Applied', count: 5, color: '#f59e0b' },
  { name: 'Interviews', count: 2, color: '#10b981' },
  { name: 'Offers', count: 1, color: '#8b5cf6' },
];

const Dashboard: React.FC = () => {
  const stats = [
    { label: 'Total Applications', value: '20', icon: TrendingUp, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Upcoming Deadlines', value: '4', icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50' },
    { label: 'Accepted', value: '1', icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'Waitlisted', value: '2', icon: XCircle, color: 'text-slate-600', bg: 'bg-slate-100' },
  ];

  return (
    <div className="space-y-8 animate-fadeIn">
      <header>
        <h2 className="text-3xl font-bold text-slate-900">Your Progress</h2>
        <p className="text-slate-500 mt-1">Welcome back! Here's how your academic search is going.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <div className={`w-12 h-12 ${stat.bg} rounded-xl flex items-center justify-center mb-4`}>
              <stat.icon className={`w-6 h-6 ${stat.color}`} />
            </div>
            <p className="text-slate-500 text-sm font-medium">{stat.label}</p>
            <p className="text-2xl font-bold text-slate-900 mt-1">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <h3 className="text-lg font-bold text-slate-900 mb-6">Application Pipeline</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                <Tooltip 
                  cursor={{fill: '#f8fafc'}}
                  contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)'}}
                />
                <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-indigo-900 p-6 rounded-2xl text-white shadow-xl relative overflow-hidden flex flex-col justify-between">
          <div className="relative z-10">
            <div className="bg-indigo-800/50 w-fit p-2 rounded-lg mb-4">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold mb-2">Weekly Goal</h3>
            <p className="text-indigo-100 text-sm leading-relaxed">
              Complete 3 application essays for the Fulbright Grant.
            </p>
          </div>
          <div className="mt-8 relative z-10">
            <div className="w-full bg-indigo-800 rounded-full h-2 mb-3">
              <div className="bg-indigo-400 h-2 rounded-full w-[66%]"></div>
            </div>
            <div className="flex justify-between text-xs font-medium text-indigo-200">
              <span>Progress</span>
              <span>2/3 Done</span>
            </div>
          </div>
          {/* Decorative pattern */}
          <div className="absolute -right-12 -top-12 w-48 h-48 bg-indigo-800 rounded-full blur-3xl opacity-40"></div>
          <div className="absolute -left-12 -bottom-12 w-48 h-48 bg-indigo-700 rounded-full blur-3xl opacity-20"></div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
