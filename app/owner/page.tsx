"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { 
  Building2, 
  TrendingUp, 
  Wallet, 
  Smile, 
  ChevronRight,
  ArrowUpRight,
  ArrowDownRight,
  Minus
} from 'lucide-react';
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip,
  Legend,
  ReferenceLine
} from 'recharts';
import OwnerDashboardLayout from '@/app/components/OwnerDashboardLayout';
import MaharashtraMap from '@/app/components/MaharashtraMap';

const portfolioKPIs = [
  { 
    label: "Total Rooms Managed", 
    value: "612", 
    subText: "Across 5 Properties", 
    icon: Building2, 
    color: "blue",
    trend: "+24 this month"
  },
  { 
    label: "Portfolio-Wide Pass Rate", 
    value: "74.8%", 
    subText: "Up from 61.2% at deployment", 
    icon: TrendingUp, 
    color: "emerald",
    trend: "+13.6% improvement"
  },
  { 
    label: "Total Monthly Savings", 
    value: "₹8.2L", 
    subText: "₹24.7L quarterly total", 
    icon: Wallet, 
    color: "amber",
    trend: "+₹1.2L vs Feb"
  },
  { 
    label: "Guest Satisfaction (GSI)", 
    value: "90.6", 
    subText: "From 78.2 at deployment", 
    icon: Smile, 
    color: "purple",
    trend: "+12.4 points"
  }
];

const propertyLeaderboard = [
  { rank: 1, property: "Monarch Grand", city: "Pune", rooms: 148, passRate: "82.1%", avgResolution: "11m", gsi: 93.2, trend: "up" },
  { rank: 2, property: "Monarch Palace", city: "Mumbai", rooms: 142, passRate: "76.1%", avgResolution: "14m", gsi: 90.8, trend: "up" },
  { rank: 3, property: "Monarch Heritage", city: "Nashik", rooms: 98, passRate: "74.3%", avgResolution: "16m", gsi: 89.1, trend: "neutral" },
  { rank: 4, property: "Monarch Gateway", city: "Aurangabad", rooms: 112, passRate: "71.8%", avgResolution: "18m", gsi: 87.4, trend: "up" },
  { rank: 5, property: "Monarch Central", city: "Nagpur", rooms: 112, passRate: "68.2%", avgResolution: "22m", gsi: 82.6, trend: "down" },
];

const brandStandardsData = [
  { city: "Pune", score: 88, color: "#10b981" },
  { city: "Mumbai", score: 82, color: "#fbbf24" },
  { city: "Nashik", score: 79, color: "#fbbf24" },
  { city: "Aurangabad", score: 76, color: "#fbbf24" },
  { city: "Nagpur", score: 71, color: "#f43f5e" },
];

const financialImpactData = [
  { name: 'Labour Savings', value: 480000, color: '#3b82f6' },
  { name: 'Complaint Avoidance', value: 245000, color: '#10b981' },
  { name: 'Repeat Retention', value: 110000, color: '#8b5cf6' },
  { name: 'OTA Uplift', value: 485000, color: '#fbbf24' },
];

export default function PortfolioDashboard() {
  return (
    <OwnerDashboardLayout 
      title="Portfolio Command Centre" 
      subtitle="Overview of Monarch Hospitality Group Performance — Maharashtra Region"
    >
      {/* KPI Banner */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {portfolioKPIs.map((kpi, idx) => (
          <motion.div
            key={kpi.label}
            className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm relative overflow-hidden group hover:border-blue-100 hover:shadow-md transition-all transition-duration-300"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: idx * 0.1 }}
          >
            <div className={`absolute top-0 right-0 w-32 h-32 blur-[60px] opacity-5 transition-opacity group-hover:opacity-10 -translate-y-1/2 translate-x-1/2 ${
              kpi.color === 'blue' ? 'bg-blue-500' :
              kpi.color === 'emerald' ? 'bg-emerald-500' :
              kpi.color === 'amber' ? 'bg-amber-500' : 'bg-purple-500'
            }`} />
            
            <div className="flex justify-between items-start mb-4">
              <div className={`p-3 rounded-2xl ${
                kpi.color === 'blue' ? 'bg-blue-50/80 text-blue-600' :
                kpi.color === 'emerald' ? 'bg-emerald-50/80 text-emerald-600' :
                kpi.color === 'amber' ? 'bg-amber-50/80 text-amber-600' : 'bg-purple-50/80 text-purple-600'
              }`}>
                <kpi.icon size={20} />
              </div>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                kpi.trend.includes('+') ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-500'
              }`}>
                {kpi.trend}
              </span>
            </div>
            
            <div className="space-y-1">
              <p className="text-slate-400 text-[11px] font-bold uppercase tracking-wider">{kpi.label}</p>
              <h3 className="text-3xl font-black text-slate-900">{kpi.value}</h3>
              <p className="text-slate-500 text-[11px] font-medium leading-tight">{kpi.subText}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Map & Leaderboard Section */}
        <div className="lg:col-span-8 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 h-full">
             <div className="flex flex-col h-full bg-white rounded-3xl border border-slate-100 p-6 shadow-sm space-y-4">
                <div className="flex justify-between items-center">
                    <h4 className="text-lg font-bold text-slate-900 tracking-tight">Regional Distribution</h4>
                    <span className="text-[10px] text-slate-400 font-bold uppercase">5 Locations Active</span>
                </div>
                <div className="flex-1">
                    <MaharashtraMap />
                </div>
             </div>

             <div className="bg-white rounded-3xl border border-slate-100 shadow-sm flex flex-col items-stretch overflow-hidden">
                <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                    <h4 className="text-lg font-bold text-slate-900 tracking-tight">Property Leaderboard</h4>
                    <button className="text-[10px] text-blue-600 font-bold uppercase tracking-widest hover:text-blue-700">View All</button>
                </div>
                <div className="flex-1 overflow-x-auto no-scrollbar">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="text-slate-400 text-[10px] uppercase font-bold tracking-widest border-b border-slate-100">
                                <th className="px-6 py-4">Rank</th>
                                <th className="px-6 py-4">Property</th>
                                <th className="px-6 py-4">Rooms</th>
                                <th className="px-6 py-4">Pass Rate</th>
                                <th className="px-6 py-4 text-center">GSI</th>
                                <th className="px-6 py-4">Trend</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {propertyLeaderboard.map((item) => (
                                <tr key={item.property} className="group hover:bg-slate-50 transition-colors cursor-pointer">
                                    <td className="px-6 py-4">
                                        <span className={`w-6 h-6 flex items-center justify-center rounded-lg text-[10px] font-black ${
                                            item.rank === 1 ? 'bg-amber-100 text-amber-600 shadow-[0_0_15px_rgba(245,158,11,0.1)]' :
                                            item.rank === 2 ? 'bg-slate-100 text-slate-500' :
                                            'bg-slate-50 text-slate-400'
                                        }`}>
                                            {item.rank}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col">
                                            <span className="text-slate-900 text-sm font-bold group-hover:text-blue-600 transition-colors">{item.property}</span>
                                            <span className="text-slate-400 text-[10px] font-medium uppercase tracking-wider">{item.city}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-slate-600 text-sm font-bold">{item.rooms}</td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <span className={`text-sm font-bold ${
                                                parseFloat(item.passRate) > 80 ? 'text-emerald-600' :
                                                parseFloat(item.passRate) > 70 ? 'text-amber-600' : 'text-rose-600'
                                            }`}>{item.passRate}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col items-center">
                                            <span className="text-slate-900 text-sm font-bold">{item.gsi}</span>
                                            <div className="w-12 bg-slate-100 h-0.5 rounded-full mt-1 overflow-hidden">
                                                <div className="bg-emerald-500 h-full" style={{ width: `${item.gsi}%` }} />
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        {item.trend === 'up' && <ArrowUpRight size={16} className="text-emerald-500" />}
                                        {item.trend === 'neutral' && <Minus size={16} className="text-slate-400" />}
                                        {item.trend === 'down' && <ArrowDownRight size={16} className="text-rose-500" />}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
             </div>
          </div>
        </div>

        {/* Brand Index & Financial Donut */}
        <div className="lg:col-span-4 space-y-8">
            {/* Brand Standardisation Index */}
            <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm flex flex-col h-[400px]">
                <div className="flex justify-between items-center mb-6">
                    <div className="space-y-1">
                        <h4 className="text-lg font-bold text-slate-900 tracking-tight">Brand Index</h4>
                        <p className="text-slate-400 text-[11px] font-medium uppercase tracking-wider">Property Consistency Score</p>
                    </div>
                    <div className="bg-blue-50 text-blue-600 p-2.5 rounded-xl">
                        <TrendingUp size={20} />
                    </div>
                </div>

                <div className="flex-1 -mx-4">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                            layout="vertical"
                            data={brandStandardsData}
                            margin={{ top: 5, right: 30, left: 0, bottom: 5 }}
                        >
                            <XAxis type="number" hide domain={[0, 100]} />
                            <YAxis 
                                dataKey="city" 
                                type="category" 
                                tick={{ fill: '#64748b', fontSize: 11, fontWeight: 'bold' }} 
                                axisLine={false}
                                tickLine={false}
                                width={80}
                            />
                            <Tooltip 
                                cursor={{ fill: '#f1f5f9', opacity: 0.5 }}
                                contentStyle={{ backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                itemStyle={{ color: '#0f172a', fontSize: '12px', fontWeight: 'bold' }}
                            />
                            <Bar 
                                dataKey="score" 
                                radius={[0, 10, 10, 0]} 
                                barSize={16}
                            >
                                {brandStandardsData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Bar>
                            <ReferenceLine x={85} stroke="#3b82f6" strokeDasharray="3 3" label={{ value: 'Target (85)', position: 'top', fill: '#3b82f6', fontSize: 10, offset: 10, fontWeight: 'bold' }} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Financial Impact */}
            <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm h-[400px] flex flex-col relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                    <Wallet size={120} className="text-slate-900" />
                </div>
                
                <h4 className="text-lg font-bold text-slate-900 tracking-tight mb-1">Financial Impact</h4>
                <p className="text-slate-400 text-[11px] font-medium uppercase tracking-wider mb-6">₹24.7L Saved This Quarter</p>

                <div className="flex-1">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={financialImpactData}
                                cx="50%"
                                cy="50%"
                                innerRadius={70}
                                outerRadius={90}
                                paddingAngle={8}
                                dataKey="value"
                            >
                                {financialImpactData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                                ))}
                            </Pie>
                            <Tooltip 
                                contentStyle={{ backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                itemStyle={{ fontSize: '12px', fontWeight: 'bold' }}
                                formatter={(value: any) => [`₹${(Number(value)/100000).toFixed(1)}L`, 'Savings']}
                            />
                        </PieChart>
                    </ResponsiveContainer>
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[10%] text-center">
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-none mb-1">Total Savings</p>
                        <h4 className="text-xl font-black text-slate-900 leading-none">₹8.2L</h4>
                        <p className="text-[10px] text-emerald-600 font-bold mt-1">MTD</p>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-x-6 gap-y-4 pt-4 border-t border-slate-100 mt-4">
                    {financialImpactData.map((item) => (
                        <div key={item.name} className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: item.color }} />
                            <div className="flex flex-col">
                                <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">{item.name}</span>
                                <span className="text-slate-900 text-[11px] font-bold">₹{(item.value/100000).toFixed(1)}L</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
      </div>
    </OwnerDashboardLayout>
  );
}
