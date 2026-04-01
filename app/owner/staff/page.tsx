"use client";

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, 
  TrendingUp, 
  Award,
  AlertTriangle,
  Trophy,
  ChevronRight,
  ShieldCheck,
  Star,
  Hotel,
  ThumbsUp,
  Clock,
  Sparkles,
  CheckCircle2,
  Activity,
  ArrowUpRight,
  Zap,
  Target
} from 'lucide-react';
import { 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  ScatterChart, 
  Scatter,
  ZAxis,
  Cell
} from 'recharts';
import OwnerDashboardLayout from '@/app/components/OwnerDashboardLayout';

const trainingImpactData = [
  { hours: 1, improvement: 2.3 },
  { hours: 2, improvement: 4.6 },
  { hours: 3, improvement: 6.9 },
  { hours: 5, improvement: 11.5 },
  { hours: 8, improvement: 18.4 },
  { hours: 10, improvement: 23.0 },
  { hours: 12, improvement: 27.6 },
  { hours: 15, improvement: 34.5 },
];

const staffTable = [
  { 
    hotel: "Monarch Grand, Pune", 
    count: 18, vacancy: 0, status: "Excellent", rooms: 14.8, issue: "All Personnel Certified",
    staff: [{ name: "Meena R.", score: "92%", status: "Elite", trend: "+2.1%" }, { name: "Sunita K.", score: "89%", status: "Senior", trend: "+4.8%" }]
  },
  { hotel: "Monarch Palace, Mumbai", count: 22, vacancy: 3, status: "Excellent", rooms: 14.6, issue: "Minor Checklist Delay" },
  { hotel: "Monarch Heritage, Nashik", count: 14, vacancy: 12, status: "Training", rooms: 13.9, issue: "3 Staff in Training" },
  { 
    hotel: "Monarch Gateway, Aurangabad", 
    count: 16, vacancy: 18, status: "Critical", rooms: 12.8, issue: "Needs Retraining (Minibar)",
    impact: "₹1.8L", fix: "Minibar Retraining Loop", timeline: "48h",
    staff: [{ name: "Sanjay M.", score: "74%", status: "Needs Review", trend: "+12.1%" }]
  },
  { 
    hotel: "Monarch Central, Nagpur", 
    count: 14, vacancy: 21, status: "Critical", rooms: 11.2, issue: "Standard Onboarding Gap",
    impact: "₹2.1L", fix: "Onboarding Express Loop", timeline: "24h",
    staff: [{ name: "Rahul V.", score: "68%", status: "At Risk", trend: "+0.5%" }]
  }
];

const topPerformers = [
  { name: "Meena R.", property: "Pune", score: "92.4%", growth: "+2.1%", rank: 1 },
  { name: "Sunita K.", property: "Pune", score: "90.2%", growth: "+4.8%", rank: 2 },
  { name: "Arun P.", property: "Mumbai", score: "88.6%", growth: "+1.2%", rank: 3 },
  { name: "Sanjay V.", property: "Indore", score: "87.8%", growth: "+3.2%", rank: 4 },
  { name: "Kiran S.", property: "Nashik", score: "86.5%", growth: "+0.8%", rank: 5 },
  { name: "Mehul L.", property: "Mumbai", score: "85.2%", growth: "+1.5%", rank: 6 },
  { name: "Priya M.", property: "Pune", score: "84.9%", growth: "+2.2%", rank: 7 },
  { name: "Rahul D.", property: "Bhopal", score: "83.8%", growth: "+1.1%", rank: 8 },
  { name: "Anita G.", property: "Indore", score: "82.5%", growth: "+0.5%", rank: 9 },
  { name: "Amit B.", property: "Nashik", score: "81.4%", growth: "+2.4%", rank: 10 },
];

const mostImproved = [
  { name: "Sanjay M.", property: "Aurangabad", score: "74.8%", growth: "+18.4%" },
  { name: "Kiran S.", property: "Nashik", score: "78.2%", growth: "+12.2%" },
  { name: "Rahul V.", property: "Nagpur", score: "68.5%", growth: "+10.5%" },
  { name: "Pooja K.", property: "Raipur", score: "71.2%", growth: "+9.8%" },
  { name: "Vishal P.", property: "Indore", score: "75.4%", growth: "+8.2%" },
];

export default function StaffAnalytics() {
  const [expandedProperty, setExpandedProperty] = useState<string | null>(null);
  const [recognizing, setRecognizing] = useState<string | null>(null);
  const [activeEliteTab, setActiveEliteTab] = useState<'elites' | 'improved'>('elites');

  const riskAlerts = useMemo(() => {
    return staffTable
      .filter(h => h.vacancy > 15 || h.status === "Critical")
      .map(h => ({
        hotel: h.hotel,
        problem: h.issue,
        impact: h.impact || "₹0.8L",
        fix: h.fix || "Standard Recertification",
        timeline: h.timeline || "48h",
      }));
  }, []);

  const handleRecognition = (name: string) => {
    setRecognizing(name);
    setTimeout(() => setRecognizing(null), 3000);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Excellent':
        return <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 text-[9px] font-bold rounded-md border border-emerald-100 uppercase tracking-widest">Certified</span>;
      case 'Training':
        return <span className="px-2 py-0.5 bg-amber-50 text-amber-700 text-[9px] font-bold rounded-md border border-amber-100 uppercase tracking-widest">Training</span>;
      case 'Critical':
        return <span className="px-2 py-0.5 bg-rose-50 text-rose-700 text-[9px] font-bold rounded-md border border-rose-100 uppercase tracking-widest">Action</span>;
      default:
        return null;
    }
  };

  // Tab-based Theme Palette
  const excellenceThemes = {
    elites: {
      bg: "bg-amber-50/50",
      border: "border-amber-100",
      accent: "text-amber-600",
      sub: "text-amber-500",
      main: "text-amber-950",
      button: "bg-amber-600",
      icon: <Trophy size={18} className="text-amber-600" />
    },
    improved: {
      bg: "bg-emerald-50/50",
      border: "border-emerald-100",
      accent: "text-emerald-600",
      sub: "text-emerald-500",
      main: "text-emerald-950",
      button: "bg-emerald-600",
      icon: <TrendingUp size={18} className="text-emerald-600" />
    }
  };
  const ui = excellenceThemes[activeEliteTab];

  return (
    <OwnerDashboardLayout 
      title="Staff Analytics" 
      subtitle="Workforce yield intelligence and portfolio personnel matrix"
    >
      {/* HIDE SCROLLBAR CSS */}
      <style jsx global>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>

      <div className="flex flex-col gap-4 pb-8">
        
        {/* KPI ROW */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <KPIItem label="Total Staff" value="84" unit="Personnel" icon={Users} color="blue" delay={0.1} />
            <KPIItem label="Avg Rooms/Shift" value="14.6" unit="Rooms" icon={Hotel} color="emerald" delay={0.2} />
            <KPIItem label="Verification Rate" value="4.2" unit="R/Hr" icon={ShieldCheck} color="amber" delay={0.3} />
            <KPIItem label="Onboarding Time" value="40%" unit="Reduction" icon={Clock} color="indigo" delay={0.4} />
        </div>

        {/* WORKFORCE LEDGER */}
        <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden flex flex-col">
            <div className="px-5 py-3 border-b border-slate-100 flex justify-between items-center bg-slate-50/30">
                <div className="flex items-center gap-2.5">
                    <Users size={16} className="text-slate-500" />
                    <h4 className="text-xs font-bold text-slate-800">Workforce Ledger</h4>
                </div>
                <div className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 mr-0.5" />
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest leading-none">Operational Live</span>
                </div>
            </div>

            <div className="overflow-x-auto hide-scrollbar">
                <table className="w-full text-left min-w-[900px]">
                    <thead>
                        <tr className="bg-white border-b border-slate-100">
                            <th className="px-6 py-2.5 text-[9px] font-bold text-slate-400 uppercase tracking-widest">Hotel Entity</th>
                            <th className="px-6 py-2.5 text-center text-[9px] font-bold text-slate-400 uppercase tracking-widest">Staff</th>
                            <th className="px-6 py-2.5 text-center text-[9px] font-bold text-slate-400 uppercase tracking-widest">Vacancy</th>
                            <th className="px-6 py-2.5 text-center text-[9px] font-bold text-slate-400 uppercase tracking-widest">Status</th>
                            <th className="px-6 py-2.5 text-[9px] font-bold text-slate-400 uppercase tracking-widest">Task Velocity</th>
                            <th className="px-6 py-2.5 pr-8 text-[9px] font-bold text-slate-400 uppercase tracking-widest text-right">Flag</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50 text-[11px] font-medium text-slate-700">
                        {staffTable.map((row) => (
                            <React.Fragment key={row.hotel}>
                                <tr 
                                    onClick={() => setExpandedProperty(expandedProperty === row.hotel ? null : row.hotel)}
                                    className={`group cursor-pointer transition-colors hover:bg-slate-50/50 ${expandedProperty === row.hotel ? 'bg-slate-50/50' : ''}`}
                                >
                                    <td className="px-6 py-2.5">
                                        <div className="flex items-center gap-3">
                                            <ChevronRight size={14} className={`text-slate-300 transition-transform duration-300 ${expandedProperty === row.hotel ? 'rotate-90 text-slate-700 font-bold' : ''}`} />
                                            <p className="font-bold text-slate-800">{row.hotel.split(',')[0]}</p>
                                        </div>
                                    </td>
                                    <td className="px-6 py-2.5 text-center">{row.count}</td>
                                    <td className="px-6 py-2.5 text-center">
                                        <span className={row.vacancy > 15 ? 'text-rose-600 font-bold' : ''}>{row.vacancy}%</span>
                                    </td>
                                    <td className="px-6 py-2.5 text-center">{getStatusBadge(row.status)}</td>
                                    <td className="px-6 py-2.5">
                                        <div className="flex items-center gap-3">
                                            <span className="font-bold text-slate-800">{row.rooms}</span>
                                            <div className="w-16 h-1 bg-slate-100 rounded-full overflow-hidden">
                                                <div style={{ width: `${Math.min((row.rooms / 16) * 100, 100)}%` }} className={`h-full rounded-full ${row.rooms > 14 ? 'bg-emerald-500' : row.rooms > 12 ? 'bg-amber-500' : 'bg-rose-500'}`} />
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-2.5 pr-8 text-right font-bold text-[9px] uppercase">
                                        <span className={row.issue.includes('All') ? 'text-emerald-700' : 'text-rose-600'}>{row.issue.split(' ')[0]}</span>
                                    </td>
                                </tr>
                                <AnimatePresence>
                                    {expandedProperty === row.hotel && row.staff && (
                                        <tr>
                                            <td colSpan={6} className="bg-slate-50/20 p-0 border-b border-slate-100">
                                                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="p-5 grid grid-cols-1 md:grid-cols-2 gap-6">
                                                    <div className="space-y-3">
                                                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest pl-1">Personnel Ledger</p>
                                                        <div className="flex flex-col gap-2">
                                                            {row.staff.map((s, idx) => (
                                                                <div key={idx} className="bg-white border border-slate-100 rounded-lg p-2.5 flex items-center justify-between shadow-sm">
                                                                    <div className="flex items-center gap-3">
                                                                        <div className="h-8 w-8 bg-slate-900 text-white rounded flex items-center justify-center text-[10px] font-bold">{s.name.charAt(0)}</div>
                                                                        <div><p className="text-xs font-bold text-slate-800">{s.name}</p><p className="text-[9px] font-semibold text-slate-400 uppercase">{s.status}</p></div>
                                                                    </div>
                                                                    <div className="text-right"><p className="text-xs font-bold text-slate-800">{s.score}</p><p className="text-[9px] font-bold text-emerald-600 uppercase">{s.trend}</p></div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                    <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-100 flex flex-col justify-between">
                                                        <div>
                                                            <div className="flex items-center gap-2 text-amber-600 mb-2"><ShieldCheck size={14} /><span className="text-[9px] font-bold uppercase tracking-widest">HQ Insight</span></div>
                                                            <h5 className="text-[11px] font-bold text-slate-800 leading-tight">Deployment Action Required</h5>
                                                            <p className="text-[10px] text-slate-500 mt-1 italic">Retraining loop can recover an estimated ₹22,000 / mo in property alpha.</p>
                                                        </div>
                                                        <button className="mt-4 w-full py-2 bg-slate-900 text-white rounded-md text-[9px] font-bold uppercase tracking-widest">Start Loop</button>
                                                    </div>
                                                </motion.div>
                                            </td>
                                        </tr>
                                    )}
                                </AnimatePresence>
                            </React.Fragment>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>

        {/* 2x2 ACTION GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* 1. RISK MITIGATION (ROSE THEME) */}
            <motion.div 
                whileHover={{ y: -8, scale: 1.01 }}
                className="bg-rose-50/50 border border-rose-100 rounded-xl p-6 shadow-sm flex flex-col h-[420px]"
            >
                <div className="flex items-center justify-between mb-5">
                    <div className="flex items-center gap-2">
                        <AlertTriangle size={16} className="text-rose-600" />
                        <h4 className="text-[11px] font-bold text-rose-900 uppercase tracking-widest">Risk Mitigation Insights</h4>
                    </div>
                    {riskAlerts.length > 0 && <span className="bg-rose-600 text-white text-[9px] font-bold px-2.5 py-1 rounded-full uppercase tracking-tighter shadow-sm">{riskAlerts.length} Critical Risks</span>}
                </div>
                
                <div className="flex-1 overflow-auto space-y-4 pr-1 hide-scrollbar">
                    {riskAlerts.length > 0 ? riskAlerts.map((alert, i) => (
                        <div key={i} className="border border-rose-200/50 rounded-xl p-4 bg-white/60 hover:bg-white transition-all space-y-4 shadow-sm group">
                            <div className="flex justify-between items-start">
                                <div><p className="text-sm font-bold text-rose-950 leading-tight">{alert.hotel.split(',')[0]}</p><p className="text-[10px] font-bold text-rose-600 mt-1 uppercase italic">{alert.problem}</p></div>
                                <div className="text-right"><p className="text-[9px] font-bold text-rose-400 uppercase tracking-widest mb-1">Impact</p><p className="text-base font-bold text-rose-700 leading-none">{alert.impact}</p></div>
                            </div>
                            <div className="flex items-center gap-2 p-2 bg-rose-50/50 border border-rose-100 rounded-lg"><Sparkles size={12} className="text-rose-500" /><p className="text-[10px] font-medium text-rose-900 leading-tight"><span className="font-bold">Recommended:</span> {alert.fix} · <span className="font-bold">{alert.timeline}</span></p></div>
                            <button className="w-full py-2.5 bg-rose-700 text-white rounded-lg text-[10px] font-bold uppercase tracking-widest hover:bg-rose-800 transition-colors shadow-lg shadow-rose-200/50">Assign to Manager</button>
                        </div>
                    )) : (
                        <div className="h-full flex flex-col items-center justify-center text-center p-8 bg-emerald-50 rounded-2xl border-2 border-dashed border-emerald-100"><CheckCircle2 className="text-emerald-500 mb-3" size={32} /><h5 className="text-xs font-bold text-emerald-900 uppercase">All Teams Clear</h5></div>
                    )}
                </div>
            </motion.div>

            {/* 2. TRAINING IMPACT PERFORMANCE (INDIGO THEME) */}
            <motion.div 
                whileHover={{ y: -8, scale: 1.01 }}
                className="bg-indigo-50/50 border border-indigo-100 rounded-xl p-0 shadow-sm flex flex-col h-[420px] overflow-hidden"
            >
                <div className="bg-indigo-600 p-4 border-b border-indigo-500/20 flex items-center justify-between text-white shadow-md shadow-indigo-100">
                    <div className="flex items-center gap-3"><Activity size={18} className="text-indigo-200" /><p className="text-[11px] font-bold uppercase tracking-widest">1h Q100 Training = <span className="text-emerald-400 font-black">+2.3% Quality Gain</span></p></div>
                    <ArrowUpRight size={14} className="opacity-40" />
                </div>
                <div className="p-6 flex-1 flex flex-col">
                    <div className="mb-4"><h4 className="text-[11px] font-bold text-indigo-900 uppercase tracking-widest opacity-60">Impact Analytics</h4><p className="text-[10px] text-indigo-800 font-medium mt-1">Correlation: More Training = Better Quality</p></div>
                    <div className="flex-1 min-h-0"><ResponsiveContainer width="100%" height="100%"><ScatterChart margin={{ top: 0, right: 30, bottom: 20, left: -20 }}><CartesianGrid strokeDasharray="3 3" stroke="#e0e7ff" vertical={false} /><XAxis type="number" dataKey="hours" name="Hours" unit="h" axisLine={false} tickLine={false} tick={{ fill: '#6366f1', fontSize: 10, fontWeight: '700' }} /><YAxis type="number" dataKey="improvement" name="Improvement" unit="%" axisLine={false} tickLine={false} tick={{ fill: '#6366f1', fontSize: 10, fontWeight: '700' }} /><Tooltip cursor={{ strokeDasharray: '3 3' }} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} /><Scatter data={trainingImpactData} fill="#4f46e5" fillOpacity={0.6}>{trainingImpactData.map((entry, index) => <Cell key={`cell-${index}`} fill={index > 5 ? "#10b981" : "#4f46e5"} />)}</Scatter></ScatterChart></ResponsiveContainer></div>
                </div>
            </motion.div>

            {/* 3 & 4. PERSONNEL EXCELLENCE (DYNAMIC THEMES) */}
            <motion.div 
                whileHover={{ y: -8, scale: 1.005 }}
                className={`${ui.bg} border ${ui.border} rounded-xl shadow-sm flex flex-col h-[400px] md:col-span-2 overflow-hidden transition-colors duration-500`}
            >
                <div className="px-6 py-4 border-b border-slate-200/50 flex items-center justify-between bg-white/60">
                    <div className="flex items-center gap-2">
                        {ui.icon}
                        <h4 className={`text-[11px] font-bold ${ui.main} uppercase tracking-widest`}>Personnel Excellence Hub</h4>
                    </div>
                    
                    <div className="flex items-center bg-white border border-slate-200 rounded-lg p-1 shadow-sm">
                        <button 
                            onClick={() => setActiveEliteTab('elites')} 
                            className={`px-5 py-1.5 text-[10px] font-bold uppercase tracking-widest rounded-md transition-all ${activeEliteTab === 'elites' ? 'bg-amber-600 text-white shadow-md' : 'text-slate-400 hover:text-amber-700'}`}
                        >
                            <div className="flex items-center gap-2"><Star size={12} fill={activeEliteTab === 'elites' ? "white" : "none"} /> Top Performers</div>
                        </button>
                        <button 
                            onClick={() => setActiveEliteTab('improved')} 
                            className={`px-5 py-1.5 text-[10px] font-bold uppercase tracking-widest rounded-md transition-all ${activeEliteTab === 'improved' ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-400 hover:text-emerald-700'}`}
                        >
                            <div className="flex items-center gap-2"><ArrowUpRight size={12} /> Most Improved</div>
                        </button>
                    </div>
                </div>

                <div className="flex-1 overflow-auto p-6 hide-scrollbar relative">
                    <AnimatePresence>
                        {recognizing && (
                            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="absolute bottom-6 left-1/2 -translate-x-1/2 z-50 bg-slate-950 text-white px-6 py-2.5 rounded-full shadow-2xl flex items-center gap-3 border border-white/10 uppercase font-bold text-[10px] tracking-widest">
                                <Sparkles size={14} className="text-amber-400 animate-pulse" /> Recognition Broadcasted to {recognizing.split(' ')[0]}
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-12 gap-y-1">
                        {(activeEliteTab === 'elites' ? topPerformers : mostImproved).map((person, idx) => (
                            <div key={person.name} className="flex items-center justify-between p-3.5 rounded-xl hover:bg-white transition-all border border-transparent hover:border-slate-100 hover:shadow-md group">
                                <div className="flex items-center gap-4">
                                    <span className={`text-[11px] font-bold ${ui.sub} w-6`}>{(person as any).rank ? `#0${(person as any).rank}` : `+${(person as any).growth}`}</span>
                                    <div>
                                        <p className={`text-sm font-bold ${ui.main} leading-tight`}>{person.name}</p>
                                        <p className={`text-[9px] ${ui.accent} font-black uppercase tracking-tighter mt-1`}>{person.property}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-8">
                                    <div className="text-right">
                                        <p className={`text-sm font-bold ${ui.main} leading-none`}>{person.score}</p>
                                        <p className={`text-[9px] font-bold mt-1.5 uppercase ${activeEliteTab === 'improved' ? 'text-emerald-600' : 'text-amber-600'}`}>↑ {person.growth} Yield</p>
                                    </div>
                                    <button 
                                        onClick={() => handleRecognition(person.name)} 
                                        className={`h-10 w-10 bg-white border ${ui.border} rounded-xl flex items-center justify-center ${ui.sub} hover:${ui.accent} hover:border-slate-300 shadow-sm transition-all active:scale-95 group-hover:scale-105`}
                                    >
                                        <ThumbsUp size={18} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                
                <div className={`p-3.5 border-t ${ui.border} ${ui.button} text-white flex justify-between items-center transition-colors duration-500`}>
                    <p className="text-[9px] font-bold uppercase tracking-[0.2em] flex items-center gap-2 leading-none"><Zap size={14} /> Global Personnel Recognition Protocol</p>
                    <p className="text-[9px] font-bold uppercase italic opacity-70 leading-none">Motivated staff show +14% property retention alpha</p>
                </div>
            </motion.div>
        </div>

      </div>
    </OwnerDashboardLayout>
  );
}

function KPIItem({ label, value, unit, icon: Icon, delay, color }: any) {
  const themes: any = {
    blue: { bg: "bg-blue-50/60", border: "border-blue-100", text: "text-blue-700", unit: "text-blue-500/60", icon: "bg-blue-600 text-white" },
    emerald: { bg: "bg-emerald-50/60", border: "border-emerald-100", text: "text-emerald-700", unit: "text-emerald-500/60", icon: "bg-emerald-600 text-white" },
    amber: { bg: "bg-amber-50/60", border: "border-amber-100", text: "text-amber-700", unit: "text-amber-500/60", icon: "bg-amber-500 text-white" },
    indigo: { bg: "bg-indigo-50/60", border: "border-indigo-100", text: "text-indigo-700", unit: "text-indigo-500/60", icon: "bg-indigo-600 text-white" },
  };
  const theme = themes[color] || themes.blue;

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay, type: "spring", stiffness: 100 }}
      whileHover={{ y: -8, scale: 1.02, boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)" }}
      className={`rounded-xl border p-5 shadow-sm relative overflow-hidden group transition-all duration-300 hover:shadow-md cursor-default ${theme.bg} ${theme.border}`}
    >
      <div className="flex justify-between items-start mb-4">
        <div className={`h-9 w-9 rounded-lg flex items-center justify-center transition-transform group-hover:scale-110 shadow-sm ${theme.icon}`}>
          <Icon size={18} />
        </div>
        <TrendingUp size={14} className={`${theme.unit} opacity-40`} />
      </div>

      <div className="space-y-0.5">
        <p className={`text-[9px] font-bold uppercase tracking-widest opacity-60 ${theme.text}`}>{label}</p>
        <div className="flex items-baseline gap-1.5 leading-none">
            <h3 className={`text-2xl font-bold tracking-tighter ${theme.text}`}>{value}</h3>
            <span className={`text-[10px] font-bold tracking-widest uppercase mb-0.5 ${theme.unit}`}>{unit}</span>
        </div>
      </div>
      <div className="absolute top-0 right-0 h-16 w-16 bg-white/10 rounded-full -translate-y-8 translate-x-8 blur-2xl pointer-events-none" />
    </motion.div>
  );
}
