"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  Target, 
  Zap, 
  AlertTriangle,
  Lightbulb,
  ArrowUpRight,
  ChevronDown,
  Info
} from 'lucide-react';
import { 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  Radar, 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend 
} from 'recharts';
import OwnerDashboardLayout from '@/app/components/OwnerDashboardLayout';

const radarData = [
  { metric: 'Pass Rate', Mumbai: 76, Pune: 82, Nashik: 74, Aurangabad: 72, Nagpur: 68 },
  { metric: 'Resolution Speed', Mumbai: 78, Pune: 88, Nashik: 74, Aurangabad: 70, Nagpur: 62 },
  { metric: 'Staff Efficiency', Mumbai: 80, Pune: 85, Nashik: 78, Aurangabad: 75, Nagpur: 72 },
  { metric: 'Guest Satisfaction', Mumbai: 91, Pune: 93, Nashik: 89, Aurangabad: 87, Nagpur: 83 },
  { metric: 'Brand Consistency', Mumbai: 82, Pune: 88, Nashik: 79, Aurangabad: 76, Nagpur: 71 },
  { metric: 'Issue Recurrence', Mumbai: 72, Pune: 80, Nashik: 68, Aurangabad: 65, Nagpur: 58 },
];

const trendData = [
  { name: 'Oct', Mumbai: 58, Pune: 62, Nashik: 55, Aurangabad: 52, Nagpur: 51 },
  { name: 'Nov', Mumbai: 63, Pune: 68, Nashik: 60, Aurangabad: 57, Nagpur: 54 },
  { name: 'Dec', Mumbai: 68, Pune: 74, Nashik: 66, Aurangabad: 63, Nagpur: 59 },
  { name: 'Jan', Mumbai: 71, Pune: 77, Nashik: 70, Aurangabad: 67, Nagpur: 63 },
  { name: 'Feb', Mumbai: 74, Pune: 80, Nashik: 72, Aurangabad: 70, Nagpur: 66 },
  { name: 'Mar', Mumbai: 76, Pune: 82, Nashik: 74, Aurangabad: 72, Nagpur: 68 },
];

const properties = [
  { name: 'Mumbai', color: '#3b82f6' },
  { name: 'Pune', color: '#10b981' },
  { name: 'Nashik', color: '#fbbf24' },
  { name: 'Aurangabad', color: '#8b5cf6' },
  { name: 'Nagpur', color: '#f43f5e' },
];

export default function ComparisonDashboard() {
  const [selectedMetric, setSelectedMetric] = useState('Pass Rate');
  const [activeProperties, setActiveProperties] = useState(properties.map(p => p.name));

  const toggleProperty = (name: string) => {
    setActiveProperties(prev => 
      prev.includes(name) ? prev.filter(p => p !== name) : [...prev, name]
    );
  };

  return (
    <OwnerDashboardLayout 
      title="Property Benchmarking" 
      subtitle="Cross-property performance analysis and comparative metrics"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Radar Chart (Left Column) */}
        <div className="lg:col-span-6">
          <div className="bg-slate-900/60 backdrop-blur-md rounded-3xl border border-white/5 p-8 shadow-xl h-full flex flex-col">
            <div className="flex justify-between items-start mb-8">
              <div className="space-y-1">
                <h4 className="text-xl font-bold text-white tracking-tight">Portfolio Profile</h4>
                <p className="text-slate-500 text-[11px] font-medium uppercase tracking-widest leading-none">6-Axis Performance Distribution</p>
              </div>
              <div className="bg-blue-500/10 text-blue-400 p-2.5 rounded-xl">
                <Target size={20} />
              </div>
            </div>

            <div className="flex-1 min-h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                  <PolarGrid stroke="#334155" strokeWidth={0.5} />
                  <PolarAngleAxis 
                    dataKey="metric" 
                    tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 'bold' }} 
                  />
                  <PolarRadiusAxis 
                    angle={30} 
                    domain={[0, 100]} 
                    tick={false} 
                    axisLine={false} 
                  />
                  {properties.map((prop) => (
                    activeProperties.includes(prop.name) && (
                      <Radar
                        key={prop.name}
                        name={prop.name}
                        dataKey={prop.name}
                        stroke={prop.color}
                        fill={prop.color}
                        fillOpacity={0.1}
                        strokeWidth={2}
                      />
                    )
                  ))}
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '12px' }}
                    itemStyle={{ fontSize: '10px', fontWeight: 'bold' }}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>

            <div className="grid grid-cols-5 gap-2 mt-8">
              {properties.map((prop) => (
                <button
                  key={prop.name}
                  onClick={() => toggleProperty(prop.name)}
                  className={`flex items-center gap-1.5 px-2 py-2 rounded-xl border transition-all ${
                    activeProperties.includes(prop.name)
                      ? 'bg-white/10 border-white/10 text-white'
                      : 'bg-transparent border-transparent text-slate-500 opacity-40'
                  }`}
                >
                  <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: prop.color }} />
                  <span className="text-[10px] font-bold uppercase truncate">{prop.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Drill-Down & Insights (Right Column) */}
        <div className="lg:col-span-6 space-y-8 flex flex-col">
          {/* Line Chart Drill-Down */}
          <div className="bg-slate-900/60 backdrop-blur-md rounded-3xl border border-white/5 p-8 shadow-xl flex-1 flex flex-col">
            <div className="flex justify-between items-center mb-10">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h4 className="text-xl font-bold text-white tracking-tight">Timeline Drill-Down</h4>
                  <div className="px-2 py-0.5 rounded-lg bg-blue-500/10 border border-blue-500/20 text-[9px] font-bold text-blue-400 uppercase tracking-widest">Live Integration</div>
                </div>
                <p className="text-slate-500 text-[11px] font-medium uppercase tracking-widest leading-none">Trend Convergence (6 MO)</p>
              </div>
              <div className="relative group">
                <button className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white text-[11px] font-bold hover:bg-white/10 transition-all">
                  {selectedMetric}
                  <ChevronDown size={14} className="text-blue-500" />
                </button>
              </div>
            </div>

            <div className="flex-1 min-h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={trendData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                  <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#64748b', fontSize: 11, fontWeight: 'bold' }} 
                    dy={10}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#64748b', fontSize: 11, fontWeight: 'bold' }} 
                    dx={-10}
                    domain={['auto', 'auto']}
                  />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '12px' }}
                    itemStyle={{ fontSize: '11px', fontWeight: 'bold' }}
                  />
                  {properties.map((prop) => (
                    activeProperties.includes(prop.name) && (
                      <Line
                        key={prop.name}
                        type="monotone"
                        dataKey={prop.name}
                        stroke={prop.color}
                        strokeWidth={3}
                        dot={{ r: 4, strokeWidth: 2, fill: '#0f172a' }}
                        activeDot={{ r: 6, strokeWidth: 0 }}
                      />
                    )
                  ))}
                </LineChart>
              </ResponsiveContainer>
            </div>
            
            <div className="mt-8 flex items-center gap-3 p-4 bg-blue-500/5 border border-blue-500/10 rounded-2xl">
                <Info size={18} className="text-blue-400 shrink-0" />
                <p className="text-[11px] text-slate-400 leading-relaxed">
                   <strong className="text-white">Analysis:</strong> All properties trending upward, but 
                   <span className="text-rose-400 font-bold ml-1">Nagpur's</span> slope is flattening — intervention recommended for Q2.
                </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Best Practice Spotlight */}
            <div className="bg-slate-900/60 backdrop-blur-md rounded-3xl border border-white/5 p-6 shadow-xl relative overflow-hidden group">
                <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:opacity-10 transition-opacity">
                    <Lightbulb size={120} className="text-amber-500" />
                </div>
                <div className="flex items-center gap-3 mb-4">
                    <div className="p-2.5 bg-amber-500/10 text-amber-500 rounded-xl">
                        <Lightbulb size={18} />
                    </div>
                    <h5 className="text-sm font-bold text-white uppercase tracking-wider">Best Practice</h5>
                </div>
                <p className="text-slate-200 text-sm font-bold mb-3 leading-snug">Pune's Amenity Compliance: 94.1%</p>
                <div className="text-slate-500 text-[11px] leading-relaxed mb-4">
                    Pune outstrips portfolio average by 18 points. Secret: Laminated 'amenity maps' in carts.
                </div>
                <button className="flex items-center gap-2 text-amber-400 text-[10px] font-black uppercase tracking-[0.2em] hover:gap-3 transition-all">
                    Deploy Portfolio-Wide
                    <ArrowUpRight size={14} />
                </button>
            </div>

            {/* Red Flag Alert */}
            <div className="bg-slate-900/60 backdrop-blur-md rounded-3xl border border-white/5 p-6 shadow-xl relative overflow-hidden group border-rose-500/10">
                <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:opacity-10 transition-opacity">
                    <AlertTriangle size={120} className="text-rose-500" />
                </div>
                <div className="flex items-center gap-3 mb-4">
                    <div className="p-2.5 bg-rose-500/10 text-rose-500 rounded-xl">
                        <AlertTriangle size={18} />
                    </div>
                    <h5 className="text-sm font-bold text-white uppercase tracking-wider">Red Flag</h5>
                </div>
                <p className="text-slate-200 text-sm font-bold mb-3 leading-snug">Nagpur Quality Drop-Off</p>
                <div className="text-slate-500 text-[11px] leading-relaxed mb-4">
                    Issue recurrence increased for 4 weeks (38% → 48%). Linked to 3 new hires in February.
                </div>
                <button className="flex items-center gap-2 text-rose-400 text-[10px] font-black uppercase tracking-[0.2em] hover:gap-3 transition-all">
                    Initiate Audit
                    <Zap size={14} />
                </button>
            </div>
          </div>
        </div>
      </div>
    </OwnerDashboardLayout>
  );
}
