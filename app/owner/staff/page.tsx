"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  TrendingUp, 
  UserPlus, 
  Award,
  Zap,
  AlertTriangle,
  ArrowRight,
  Target,
  Trophy,
  ChevronDown,
  Sparkles
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Legend,
  AreaChart,
  Area
} from 'recharts';
import OwnerDashboardLayout from '@/app/components/OwnerDashboardLayout';

const rampData = [
  { week: 0, pre: 40, post: 40 },
  { week: 1, pre: 45, post: 52 },
  { week: 2, pre: 52, post: 63 },
  { week: 3, pre: 58, post: 71 },
  { week: 4, pre: 64, post: 75 },
  { week: 5, pre: 68, post: 78 },
  { week: 6, pre: 71, post: 81 },
  { week: 7, pre: 73, post: 84 },
  { week: 8, pre: 75, post: 86 },
];

const staffTable = [
  { property: "Mumbai", count: 22, vacancy: "9%", tenure: "2.1 yrs", passRate: "76.1%", velocity: "4.4/hr" },
  { property: "Pune", count: 18, vacancy: "0%", tenure: "3.4 yrs", passRate: "82.1%", velocity: "4.8/hr" },
  { property: "Nashik", count: 14, vacancy: "7%", tenure: "1.8 yrs", passRate: "74.3%", velocity: "4.1/hr" },
  { property: "Aurangabad", count: 16, vacancy: "13%", tenure: "1.4 yrs", passRate: "71.8%", velocity: "3.8/hr" },
  { property: "Nagpur", count: 14, vacancy: "21%", tenure: "0.9 yrs", passRate: "68.2%", velocity: "3.4/hr" },
];

const topPerformers = [
  { name: "Meena R.", property: "Pune", score: "91.8%", rank: 1 },
  { name: "Sunita K.", property: "Pune", score: "89.2%", rank: 2 },
  { name: "Arun P.", property: "Mumbai", score: "87.6%", rank: 3 },
  { name: "Kavita D.", property: "Mumbai", score: "85.7%", rank: 4 },
  { name: "Priya S.", property: "Mumbai", score: "84.2%", rank: 5 },
  { name: "Leela M.", property: "Nashik", score: "83.9%", rank: 6 },
  { name: "Pooja V.", property: "Aurangabad", score: "82.4%", rank: 7 },
  { name: "Rekha T.", property: "Pune", score: "81.8%", rank: 8 },
  { name: "Manoj S.", property: "Nashik", score: "80.5%", rank: 9 },
  { name: "Geeta B.", property: "Aurangabad", score: "79.8%", rank: 10 },
];

export default function StaffAnalytics() {
  return (
    <OwnerDashboardLayout 
      title="Staff Analytics" 
      subtitle="Workforce capability and training efficiency across portfolio"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
        <div className="bg-slate-900/60 backdrop-blur-md rounded-3xl border border-white/5 p-6 shadow-xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10">
                <Users size={40} className="text-blue-400" />
            </div>
            <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] mb-2">Total Workforce</p>
            <h3 className="text-2xl font-black text-white mb-1">84</h3>
            <p className="text-slate-400 text-[11px] font-medium leading-none mt-2">Active Housekeepers</p>
        </div>

        <div className="bg-slate-900/60 backdrop-blur-md rounded-3xl border border-white/5 p-6 shadow-xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10">
                <Target size={40} className="text-emerald-400" />
            </div>
            <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] mb-2">Avg. Workload</p>
            <h3 className="text-2xl font-black text-white mb-1">14.6</h3>
            <p className="text-slate-400 text-[11px] font-medium leading-none mt-2">Rooms / Shift / Person</p>
        </div>

        <div className="bg-slate-900/60 backdrop-blur-md rounded-3xl border border-white/5 p-6 shadow-xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10">
                <Zap size={40} className="text-amber-400" />
            </div>
            <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] mb-2">Quality Velocity</p>
            <h3 className="text-2xl font-black text-white mb-1">4.2</h3>
            <p className="text-slate-400 text-[11px] font-medium leading-none mt-2">Quality Rooms / Hour</p>
        </div>

        <div className="bg-slate-900/60 backdrop-blur-md rounded-3xl border border-white/5 p-6 shadow-xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10">
                <UserPlus size={40} className="text-purple-400" />
            </div>
            <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] mb-2">Training Efficiency</p>
            <h3 className="text-2xl font-black text-emerald-400 mb-1">+40%</h3>
            <p className="text-slate-400 text-[11px] font-medium leading-none mt-2">Faster Ramp (Post-Q100)</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-8">
        {/* Staff Efficiency Table */}
        <div className="lg:col-span-8 space-y-8 flex flex-col">
          <div className="bg-slate-900/60 backdrop-blur-md rounded-3xl border border-white/5 shadow-xl flex flex-col items-stretch overflow-hidden flex-1">
            <div className="p-6 border-b border-white/5 flex justify-between items-center">
                <div className="space-y-1">
                    <h4 className="text-xl font-bold text-white tracking-tight">Workforce Capacity</h4>
                    <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest leading-none">Property-Level Staffing Metrics</p>
                </div>
            </div>
            <div className="flex-1 overflow-x-auto no-scrollbar">
                <table className="w-full text-left">
                    <thead>
                        <tr className="text-slate-600 text-[10px] uppercase font-black tracking-widest border-b border-white/5">
                            <th className="px-6 py-6">Property</th>
                            <th className="px-6 py-6">Headcount</th>
                            <th className="px-6 py-6">Vacancy</th>
                            <th className="px-6 py-6">Tenure</th>
                            <th className="px-6 py-6">Pass Rate</th>
                            <th className="px-6 py-6">Velocity</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {staffTable.map((item) => (
                            <tr key={item.property} className="group hover:bg-white/5 transition-all">
                                <td className="px-6 py-5 font-bold text-slate-200">{item.property}</td>
                                <td className="px-6 py-5 text-slate-400 font-bold">{item.count}</td>
                                <td className={`px-6 py-5 font-bold ${parseInt(item.vacancy) > 15 ? 'text-rose-500' : 'text-slate-400'}`}>{item.vacancy}</td>
                                <td className="px-6 py-5 text-slate-500 font-bold">{item.tenure}</td>
                                <td className="px-6 py-5 font-black text-white">{item.passRate}</td>
                                <td className="px-6 py-5">
                                    <div className="flex items-center gap-2">
                                        <div className="w-16 h-1 bg-white/5 rounded-full overflow-hidden">
                                            <div className="bg-blue-600 h-full" style={{ width: `${(parseFloat(item.velocity)/5)*100}%` }} />
                                        </div>
                                        <span className="text-[11px] font-bold text-blue-400">{item.velocity}</span>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
          </div>

          {/* Nagpur Risk Radar (Specific Case) */}
          <div className="bg-slate-900/60 backdrop-blur-md rounded-3xl border border-rose-500/10 p-8 shadow-xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-8 opacity-5">
                <AlertTriangle size={120} className="text-rose-500" />
            </div>
            
            <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 bg-rose-500/10 border border-rose-500/20 rounded-2xl flex items-center justify-center text-rose-500">
                    <AlertTriangle size={24} />
                </div>
                <div>
                   <h5 className="text-xl font-bold text-white leading-none mb-1">Risk Radar: Nagpur</h5>
                   <p className="text-[10px] text-rose-400 font-black uppercase tracking-widest">High Staff Turnover Impact</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-4">
                    <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                        <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-1">Vacancy Rate</p>
                        <p className="text-2xl font-black text-rose-500">21%</p>
                        <p className="text-[9px] text-slate-600 font-bold mt-1">Portfolio Highest</p>
                    </div>
                </div>
                <div className="md:col-span-2 space-y-4">
                    <p className="text-slate-400 text-sm leading-relaxed">
                        Nagpur's <strong className="text-white">pass rate</strong> has declined for 4 consecutive weeks. Root cause: 3 new hires in Feb without Q100 onboarding.
                    </p>
                    <div className="flex items-center gap-4">
                        <div className="px-4 py-2 bg-blue-600 rounded-xl text-white text-[10px] font-black uppercase tracking-widest hover:bg-blue-700 transition-all cursor-pointer">
                            Deploy Pune Trainer
                        </div>
                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Target Resolution: 2 Weeks</p>
                    </div>
                </div>
            </div>
          </div>
        </div>

        {/* New Hire Ramp (Right Column) */}
        <div className="lg:col-span-4 space-y-8 flex flex-col">
            <div className="bg-slate-900/60 backdrop-blur-md rounded-3xl border border-white/5 p-8 shadow-xl flex-1 flex flex-col">
                <div className="flex justify-between items-center mb-8">
                    <div className="space-y-1">
                        <h4 className="text-lg font-bold text-white tracking-tight">New Hire Ramp-Up</h4>
                        <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest leading-none">Learning Curve: Pre vs Post Q100</p>
                    </div>
                    <div className="p-2.5 bg-emerald-500/10 text-emerald-500 rounded-xl">
                        <TrendingUp size={18} />
                    </div>
                </div>

                <div className="flex-1 py-4">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={rampData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff03" vertical={false} />
                            <XAxis 
                                dataKey="week" 
                                axisLine={false} 
                                tickLine={false} 
                                tick={{ fill: '#64748b', fontSize: 10, fontWeight: 'bold' }}
                                tickFormatter={(week) => `W${week}`}
                            />
                            <YAxis 
                                domain={[0, 100]} 
                                axisLine={false} 
                                tickLine={false} 
                                tick={{ fill: '#64748b', fontSize: 10, fontWeight: 'bold' }}
                                tickFormatter={(val) => `${val}%`}
                            />
                            <Tooltip 
                                contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '12px' }}
                            />
                            <Legend align="right" verticalAlign="top" iconType="circle" wrapperStyle={{ paddingBottom: 20 }} />
                            <Line 
                                name="Post-Q100 Implementation" 
                                type="monotone" 
                                dataKey="post" 
                                stroke="#10b981" 
                                strokeWidth={4} 
                                dot={false}
                                activeDot={{ r: 6 }}
                            />
                            <Line 
                                name="Legacy Training (Pre-Q100)" 
                                type="monotone" 
                                dataKey="pre" 
                                stroke="#64748b" 
                                strokeWidth={2} 
                                strokeDasharray="5 5" 
                                dot={false}
                                opacity={0.6}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
                
                <div className="mt-8 p-4 bg-emerald-500/5 border border-emerald-500/10 rounded-2xl flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                        <Sparkles size={20} />
                    </div>
                    <p className="text-xs text-slate-400 font-medium">
                       Q100 interface accelerates onboarding by <strong className="text-emerald-400">3.2 weeks</strong> on average—a 40% reduction in training lag.
                    </p>
                </div>
            </div>

            {/* Top Performers Leaderboard */}
            <div className="bg-slate-900/60 backdrop-blur-md rounded-3xl border border-white/5 shadow-xl flex flex-col h-[500px]">
                <div className="p-6 border-b border-white/5 flex items-center gap-3">
                    <Trophy size={18} className="text-amber-500" />
                    <h4 className="text-sm font-black text-white uppercase tracking-[0.2em]">Portfolio Top 10</h4>
                </div>
                <div className="flex-1 overflow-y-auto no-scrollbar px-2 py-4 space-y-1">
                    {topPerformers.map((person) => (
                        <div key={person.name} className="flex items-center justify-between p-3 rounded-2xl hover:bg-white/5 transition-all group cursor-pointer">
                            <div className="flex items-center gap-3">
                                <span className={`w-6 h-6 flex items-center justify-center rounded-lg text-[9px] font-black ${
                                    person.rank === 1 ? 'bg-amber-500/20 text-amber-500' :
                                    person.rank === 2 ? 'bg-slate-300/20 text-slate-300' :
                                    person.rank === 3 ? 'bg-orange-500/20 text-orange-500' :
                                    'bg-white/5 text-slate-600'
                                }`}>
                                    {person.rank}
                                </span>
                                <div>
                                    <p className="text-[13px] font-bold text-white group-hover:text-blue-400 transition-colors">{person.name}</p>
                                    <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest">{person.property}</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-[13px] font-black text-emerald-400">{person.score}</p>
                                <p className="text-[8px] text-slate-600 font-bold uppercase tracking-widest">Monthly Pass</p>
                            </div>
                        </div>
                    ))}
                </div>
                <button className="p-4 flex items-center justify-center gap-2 text-blue-400 text-[10px] font-black uppercase tracking-[0.3em] bg-white/5 hover:bg-white/10 transition-all">
                    Recognition Dashboard
                    <ArrowRight size={14} />
                </button>
            </div>
        </div>
      </div>
    </OwnerDashboardLayout>
  );
}
