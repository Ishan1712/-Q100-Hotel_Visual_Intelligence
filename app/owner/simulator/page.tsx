"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Calculator, 
  TrendingUp, 
  Building2, 
  Wallet, 
  Clock, 
  Smile, 
  ArrowRight,
  ChevronRight,
  Plus,
  Minus,
  Sparkles,
  Target,
  Users
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  Cell
} from 'recharts';
import OwnerDashboardLayout from '@/app/components/OwnerDashboardLayout';

export default function ExpansionSimulator() {
  const [rooms, setRooms] = useState(86);
  const [occupancy, setOccupancy] = useState(72);
  const [complaintRate, setComplaintRate] = useState(4.2);
  const [inspectors, setInspectors] = useState(2);

  // Derived projections (simulated logic)
  const monthlySavings = (rooms * (occupancy / 100) * 120) + (inspectors * 45000); // Rough logic
  const annualSavings = monthlySavings * 12;
  const breakEvenWeeks = 5;
  const gsiLift = 8.5;

  const projectionData = [
    { month: 'M0', passRate: 40, savings: 0 },
    { month: 'M1', passRate: 58, savings: monthlySavings * 0.4 },
    { month: 'M2', passRate: 65, savings: monthlySavings * 0.7 },
    { month: 'M3', passRate: 70, savings: monthlySavings * 0.85 },
    { month: 'M4', passRate: 74, savings: monthlySavings * 0.92 },
    { month: 'M5', passRate: 77, savings: monthlySavings * 0.98 },
    { month: 'M6', passRate: 78, savings: monthlySavings },
  ];

  return (
    <OwnerDashboardLayout 
      title="Expansion Simulator" 
      subtitle="Projecting ROI and quality outcomes for new property acquisitions"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Input Panel (Left) */}
        <div className="lg:col-span-4 space-y-8">
          <div className="bg-white border border-slate-100 p-8 rounded-3xl shadow-sm relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-8 opacity-5">
                <Calculator size={120} className="text-slate-900" />
            </div>
            
            <div className="flex items-center gap-3 mb-10 relative">
                <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl">
                    <Calculator size={20} />
                </div>
                <h4 className="text-xl font-bold text-slate-900 tracking-tight leading-none">Scenario Inputs</h4>
            </div>

            <div className="space-y-8 relative">
                {/* Number of Rooms */}
                <div className="space-y-4">
                    <div className="flex justify-between items-center text-[10px] font-black text-slate-400 uppercase tracking-widest">
                        <span>Number of Rooms</span>
                        <span className="text-blue-600 font-black">{rooms}</span>
                    </div>
                    <div className="flex items-center gap-4">
                        <button onClick={() => setRooms(r => Math.max(10, r - 5))} className="p-2.5 bg-slate-50 border border-slate-100 rounded-xl text-slate-500 hover:bg-slate-100"><Minus size={16} /></button>
                        <div className="flex-1 h-1.5 bg-slate-100 rounded-full relative overflow-hidden">
                            <div className="h-full bg-blue-600 transition-all duration-300" style={{ width: `${(rooms/300)*100}%` }} />
                        </div>
                        <button onClick={() => setRooms(r => Math.min(300, r + 5))} className="p-2.5 bg-slate-50 border border-slate-100 rounded-xl text-slate-500 hover:bg-slate-100"><Plus size={16} /></button>
                    </div>
                </div>

                {/* Occupancy Rate */}
                <div className="space-y-4">
                    <div className="flex justify-between items-center text-[10px] font-black text-slate-400 uppercase tracking-widest">
                        <span>Avg. Occupancy</span>
                        <span className="text-blue-600 font-black">{occupancy}%</span>
                    </div>
                    <div className="flex items-center gap-4">
                        <button onClick={() => setOccupancy(o => Math.max(0, o - 5))} className="p-2.5 bg-slate-50 border border-slate-100 rounded-xl text-slate-500 hover:bg-slate-100"><Minus size={16} /></button>
                        <div className="flex-1 h-1.5 bg-slate-100 rounded-full relative overflow-hidden">
                            <div className="h-full bg-blue-600 transition-all duration-300" style={{ width: `${occupancy}%` }} />
                        </div>
                        <button onClick={() => setOccupancy(o => Math.min(100, o + 5))} className="p-2.5 bg-slate-50 border border-slate-100 rounded-xl text-slate-500 hover:bg-slate-100"><Plus size={16} /></button>
                    </div>
                </div>

                {/* Complaint Rate */}
                <div className="space-y-4">
                    <div className="flex justify-between items-center text-[10px] font-black text-slate-400 uppercase tracking-widest">
                        <span>Pre-AI Complaint Rate</span>
                        <span className="text-rose-600 font-black">{complaintRate} / 100</span>
                    </div>
                    <div className="flex items-center gap-4">
                        <button onClick={() => setComplaintRate(c => Math.max(0, c - 0.2))} className="p-2.5 bg-slate-50 border border-slate-100 rounded-xl text-slate-500 hover:bg-slate-100"><Minus size={16} /></button>
                        <div className="flex-1 h-1.5 bg-slate-100 rounded-full relative overflow-hidden">
                            <div className="h-full bg-rose-500 transition-all duration-300" style={{ width: `${(complaintRate/10)*100}%` }} />
                        </div>
                        <button onClick={() => setComplaintRate(c => Math.min(10, c + 0.2))} className="p-2.5 bg-slate-50 border border-slate-100 rounded-xl text-slate-500 hover:bg-slate-100"><Plus size={16} /></button>
                    </div>
                </div>

                {/* Inspection Headcount */}
                <div className="space-y-4">
                    <div className="flex justify-between items-center text-[10px] font-black text-slate-400 uppercase tracking-widest">
                        <span>Current Inspection Staff</span>
                        <span className="text-blue-600 font-black">{inspectors} FTE</span>
                    </div>
                    <div className="flex items-center gap-4">
                        <button onClick={() => setInspectors(i => Math.max(0, i - 1))} className="p-2.5 bg-slate-50 border border-slate-100 rounded-xl text-slate-500 hover:bg-slate-100"><Minus size={16} /></button>
                        <div className="flex-1 h-1.5 bg-slate-100 rounded-full relative overflow-hidden">
                            <div className="h-full bg-blue-600 transition-all duration-300" style={{ width: `${(inspectors/5)*100}%` }} />
                        </div>
                        <button onClick={() => setInspectors(i => Math.min(5, i + 1))} className="p-2.5 bg-slate-50 border border-slate-100 rounded-xl text-slate-500 hover:bg-slate-100"><Plus size={16} /></button>
                    </div>
                </div>
            </div>

            <div className="mt-12 p-4 bg-blue-50 rounded-2xl border border-blue-100">
                <p className="text-[11px] text-slate-500 leading-relaxed italic font-medium">
                   "Calculations are based on portfolio averages and benchmark data from Monarch Gateway (Aurangabad)."
                </p>
            </div>
          </div>
        </div>

        {/* Projections & Comparison (Right) */}
        <div className="lg:col-span-8 space-y-8 flex flex-col">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white border border-slate-100 p-6 rounded-3xl shadow-sm space-y-1">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Monthly Savings</p>
                    <h3 className="text-2xl font-black text-emerald-600">₹{(monthlySavings/1000).toFixed(0)}K</h3>
                </div>
                <div className="bg-white border border-slate-100 p-6 rounded-3xl shadow-sm space-y-1">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Break-Even</p>
                    <h3 className="text-2xl font-black text-slate-900">Week {breakEvenWeeks}</h3>
                </div>
                <div className="bg-white border border-slate-100 p-6 rounded-3xl shadow-sm space-y-1">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">GSI Uplift</p>
                    <h3 className="text-2xl font-black text-slate-900">+{gsiLift} pts</h3>
                </div>
                <div className="bg-white border border-slate-100 p-6 rounded-3xl shadow-sm space-y-1">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Annual ROI</p>
                    <h3 className="text-2xl font-black text-blue-600">₹{(annualSavings/100000).toFixed(1)}L</h3>
                </div>
          </div>

          {/* Projection Chart */}
          <div className="bg-white border border-slate-100 p-8 rounded-3xl shadow-sm flex-1 flex flex-col">
                <div className="flex justify-between items-center mb-8">
                    <div className="space-y-1">
                        <h4 className="text-xl font-bold text-slate-900 tracking-tight">Onboarding Trajectory</h4>
                        <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest leading-none">Projected Pass Rate & Cumulative Savings (6 MO)</p>
                    </div>
                    <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl">
                        <TrendingUp size={20} />
                    </div>
                </div>

                <div className="flex-1 min-h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={projectionData}>
                            <defs>
                                <linearGradient id="colorPass" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1}/>
                                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                            <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 'bold' }} />
                            <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 'bold' }} />
                            <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                            <Area 
                                type="monotone" 
                                dataKey="passRate" 
                                stroke="#3b82f6" 
                                strokeWidth={3} 
                                fillOpacity={1} 
                                fill="url(#colorPass)" 
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>

                <div className="mt-8 flex gap-8 items-center p-6 bg-slate-50 border border-slate-100 rounded-3xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-8 opacity-10">
                        <Sparkles size={80} className="text-amber-500" />
                    </div>
                    <div className="space-y-4 flex-1 relative">
                        <h5 className="text-sm font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
                           <Target size={16} className="text-amber-500" />
                           Optimization Insight
                        </h5>
                        <p className="text-slate-500 text-sm leading-relaxed max-w-lg font-medium">
                            Aurangabad (closest comparable) reached 72% pass rate at Month 6. We project <span className="text-blue-600 font-bold">Monarch Lakeside</span> will reach <span className="text-emerald-600 font-bold">78%</span> due to the refined onboarding playbook now embedded in Q100 AI.
                        </p>
                    </div>
                    <button className="flex items-center gap-3 px-8 py-4 bg-blue-600 hover:bg-blue-700 rounded-2xl text-white text-[11px] font-black uppercase tracking-[0.2em] shadow-lg shadow-blue-100 transition-all relative group overflow-hidden">
                        <span className="relative z-10 flex items-center gap-2">
                            Request Onboarding
                            <ArrowRight size={16} />
                        </span>
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </button>
                </div>
          </div>
        </div>
      </div>
    </OwnerDashboardLayout>
  );
}
