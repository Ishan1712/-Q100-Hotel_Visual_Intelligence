"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  Wallet, 
  Coins, 
  Clock, 
  ShieldCheck,
  Users,
  ArrowUpRight,
  TrendingDown,
  Info,
  Calendar
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Cell,
  ComposedChart,
  Area,
  Line,
  ReferenceArea
} from 'recharts';
import OwnerDashboardLayout from '@/app/components/OwnerDashboardLayout';

const waterfallData = [
  { name: 'Subscription', value: -350000, color: '#f43f5e' },
  { name: 'Labour', value: 480000, color: '#3b82f6' },
  { name: 'Complaints', value: 245000, color: '#10b981' },
  { name: 'Retention', value: 110000, color: '#8b5cf6' },
  { name: 'OTA Uplift', value: 485000, color: '#fbbf24' },
  { name: 'Net Profit', value: 970000, color: '#10b981', isTotal: true },
];

const paybackData = [
  { day: 0, investment: -350000, savings: 0, balance: -350000 },
  { day: 10, investment: 0, savings: 80000, balance: -270000 },
  { day: 20, investment: 0, savings: 150000, balance: -120000 },
  { day: 30, investment: 0, savings: 280000, balance: 10000 },
  { day: 38, investment: 0, savings: 350000, balance: 80000 },
  { day: 50, investment: 0, savings: 500000, balance: 350000 },
  { day: 60, investment: 0, savings: 750000, balance: 720000 },
];

export default function ROIDashboard() {
  return (
    <OwnerDashboardLayout 
      title="Financial ROI Dashboard" 
      subtitle="Direct and indirect financial impact analysis across all properties"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-8">
        {/* ROI Hero Card */}
        <div className="lg:col-span-4">
          <div className="bg-slate-900/60 backdrop-blur-md rounded-3xl border border-white/5 p-8 shadow-xl h-full flex flex-col items-center justify-center text-center relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative mb-6">
                <motion.div 
                    initial={{ rotate: 0 }}
                    animate={{ rotate: 360 }}
                    transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
                    className="p-6 rounded-full bg-blue-500/10 border-2 border-blue-500/20 text-blue-400"
                >
                    <Coins size={48} />
                </motion.div>
                <div className="absolute -bottom-2 -right-2 bg-emerald-500 text-white p-2 rounded-xl shadow-lg ring-4 ring-[#0b1220]">
                    <TrendingUp size={20} />
                </div>
            </div>
            
            <h4 className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] mb-2">Portfolio ROI Ratio</h4>
            <h2 className="text-6xl font-black text-white tracking-tighter mb-4">4.20<span className="text-blue-500">:1</span></h2>
            <p className="text-slate-400 text-sm font-medium max-w-[200px] leading-relaxed">
              For every <span className="text-white font-bold">₹1 spent</span> on Q100, you save <span className="text-emerald-400 font-bold">₹4.20</span>
            </p>

            <div className="mt-8 w-full space-y-3">
                <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-wider p-3 bg-white/5 rounded-xl border border-white/10">
                    <span className="text-slate-500">Monthly Yield</span>
                    <span className="text-emerald-400">+₹9.7L Net</span>
                </div>
                <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-wider p-3 bg-white/5 rounded-xl border border-white/10">
                    <span className="text-slate-500">Subscription Cost</span>
                    <span className="text-rose-400">-₹3.5L Gross</span>
                </div>
            </div>
          </div>
        </div>

        {/* Waterfall Chart */}
        <div className="lg:col-span-8">
          <div className="bg-slate-900/60 backdrop-blur-md rounded-3xl border border-white/5 p-8 shadow-xl h-full flex flex-col">
            <div className="flex justify-between items-center mb-10">
              <div className="space-y-1">
                <h4 className="text-xl font-bold text-white tracking-tight">Monthly Savings Waterfall</h4>
                <p className="text-slate-500 text-[11px] font-medium uppercase tracking-widest leading-none">Net Benefit Calculation — March 2026</p>
              </div>
              <Calendar size={20} className="text-blue-400" />
            </div>

            <div className="flex-1 min-h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={waterfallData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                  <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#64748b', fontSize: 10, fontWeight: 'bold' }} 
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#64748b', fontSize: 10, fontWeight: 'bold' }}
                    tickFormatter={(value) => `₹${Math.abs(value/1000).toFixed(0)}K`}
                  />
                  <Tooltip 
                    cursor={{ fill: '#ffffff05' }}
                    contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '12px' }}
                    formatter={(value: any) => [`₹${(Math.abs(Number(value))/1000).toFixed(0)}K`, 'Value']}
                  />
                  <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                    {waterfallData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
        {/* KPI Cards */}
        <div className="bg-slate-900/60 backdrop-blur-md rounded-3xl border border-white/5 p-6 shadow-xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10">
                <Clock size={40} className="text-blue-400" />
            </div>
            <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] mb-2">Payback Period</p>
            <h3 className="text-2xl font-black text-white mb-1">38 Days</h3>
            <p className="text-emerald-400 text-[11px] font-bold">Invested Reclaimed in Month 2</p>
        </div>

        <div className="bg-slate-900/60 backdrop-blur-md rounded-3xl border border-white/5 p-6 shadow-xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10">
                <ShieldCheck size={40} className="text-emerald-400" />
            </div>
            <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] mb-2">Complaints Avoided</p>
            <h3 className="text-2xl font-black text-white mb-1">70 <span className="text-sm font-medium text-slate-500">/mo</span></h3>
            <p className="text-emerald-400 text-[11px] font-bold">56.3% reduction since Sep 2025</p>
        </div>

        <div className="bg-slate-900/60 backdrop-blur-md rounded-3xl border border-white/5 p-6 shadow-xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10">
                <Users size={40} className="text-purple-400" />
            </div>
            <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] mb-2">Labour Saved</p>
            <h3 className="text-2xl font-black text-white mb-1">480 hrs <span className="text-sm font-medium text-slate-500">/mo</span></h3>
            <p className="text-emerald-400 text-[11px] font-bold">Redirected to deep cleaning</p>
        </div>

        <div className="bg-slate-900/60 backdrop-blur-md rounded-3xl border border-white/5 p-6 shadow-xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10">
                <ArrowUpRight size={40} className="text-amber-400" />
            </div>
            <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] mb-2">Annual Projection</p>
            <h3 className="text-2xl font-black text-white mb-1">₹1.02 Cr</h3>
            <p className="text-amber-400 text-[11px] font-bold">Net benefit by Q1 2027</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Cumulative Savings Line Chart */}
        <div className="lg:col-span-12">
            <div className="bg-slate-900/60 backdrop-blur-md rounded-3xl border border-white/5 p-8 shadow-xl">
                <div className="flex justify-between items-center mb-8">
                    <div className="space-y-1">
                        <h4 className="text-xl font-bold text-white tracking-tight">Cumulative Portfolio Balance</h4>
                        <p className="text-slate-500 text-[11px] font-medium uppercase tracking-widest leading-none">Net Profit Timeline (First 60 Days)</p>
                    </div>
                </div>

                <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <ComposedChart data={paybackData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff03" vertical={false} />
                            <XAxis 
                                dataKey="day" 
                                axisLine={false} 
                                tickLine={false} 
                                tick={{ fill: '#64748b', fontSize: 10, fontWeight: 'bold' }}
                                tickFormatter={(day) => `Day ${day}`}
                            />
                            <YAxis 
                                axisLine={false} 
                                tickLine={false} 
                                tick={{ fill: '#64748b', fontSize: 10, fontWeight: 'bold' }}
                                tickFormatter={(val) => `₹${(val/1000).toFixed(0)}K`}
                            />
                            <Tooltip 
                                contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '12px' }}
                            />
                            <Area type="monotone" dataKey="balance" fill="rgba(16, 185, 129, 0.1)" stroke="none" />
                            <Line 
                                type="monotone" 
                                dataKey="balance" 
                                stroke="#10b981" 
                                strokeWidth={3} 
                                dot={{ r: 4, fill: '#10b981' }} 
                            />
                            <ReferenceArea y1={-350000} y2={0} fill="rgba(244, 63, 94, 0.05)" />
                        </ComposedChart>
                    </ResponsiveContainer>
                </div>
                
                <div className="flex justify-center gap-12 mt-6">
                    <div className="flex items-center gap-2">
                        <div className="w-10 h-2 bg-rose-500/20 rounded-full" />
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Investment Zone</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-10 h-2 bg-emerald-500 rounded-full" />
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Profit Zone (Day 38+)</span>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </OwnerDashboardLayout>
  );
}
