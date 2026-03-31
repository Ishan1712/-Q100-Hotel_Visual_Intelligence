"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  AlertTriangle, 
  CheckCircle2, 
  TrendingUp, 
  TrendingDown, 
  ArrowRight,
  Sparkles,
  Camera,
  ChevronRight,
  Info,
  RotateCcw
} from 'lucide-react';
import OwnerDashboardLayout from '@/app/components/OwnerDashboardLayout';

const categories = [
  "Bed", "Bathroom", "Minibar", "Towels", "Curtains", "Desk", "Entrance", "Welcome"
];

const properties = [
  "Mumbai", "Pune", "Nashik", "Aurangabad", "Nagpur"
];

const heatmapData: Record<string, number[]> = {
  "Mumbai": [84, 72, 68, 78, 88, 82, 90, 86],
  "Pune": [90, 88, 82, 86, 92, 84, 88, 90],
  "Nashik": [82, 76, 64, 72, 84, 78, 86, 80],
  "Aurangabad": [78, 70, 62, 74, 80, 76, 82, 78],
  "Nagpur": [72, 64, 56, 66, 74, 68, 78, 70],
};

const categoryTrends: Record<string, 'up' | 'down' | 'neutral'> = {
  "Bed": 'up',
  "Bathroom": 'down',
  "Minibar": 'down',
  "Towels": 'up',
  "Curtains": 'up',
  "Desk": 'neutral',
  "Entrance": 'neutral',
  "Welcome": 'up',
};

const getCellColor = (val: number) => {
  if (val >= 90) return 'bg-emerald-500 text-white';
  if (val >= 80) return 'bg-emerald-400/30 text-emerald-400 border-emerald-500/20';
  if (val >= 70) return 'bg-amber-400/20 text-amber-500 border-amber-500/20';
  if (val >= 60) return 'bg-orange-500/20 text-orange-500 border-orange-500/20';
  return 'bg-rose-500/20 text-rose-500 border-rose-500/20';
};

export default function BrandHeatmap() {
  const [selectedCell, setSelectedCell] = useState<{property: string, catIndex: number} | null>(null);

  const avgByCategory = categories.map((_, i) => {
    const total = Object.values(heatmapData).reduce((acc, current) => acc + current[i], 0);
    return Math.round(total / properties.length);
  });

  return (
    <OwnerDashboardLayout 
      title="Brand Standards Heatmap" 
      subtitle="Granular quality analysis and brand compliance tracking"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Main Heatmap Grid */}
        <div className="lg:col-span-12">
          <div className="bg-slate-900/60 backdrop-blur-md rounded-3xl border border-white/5 p-8 shadow-xl overflow-hidden">
            <div className="flex justify-between items-center mb-8">
                <div className="space-y-1">
                    <h4 className="text-xl font-bold text-white tracking-tight">Compliance Matrix</h4>
                    <p className="text-slate-500 text-[11px] font-medium uppercase tracking-widest leading-none">Property × Quality Category Analysis</p>
                </div>
                <div className="flex items-center gap-6 bg-white/5 px-4 py-2 rounded-2xl border border-white/10">
                    <div className="flex items-center gap-2">
                        <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">90%+</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">75-89%</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{'<'}75%</span>
                    </div>
                </div>
            </div>

            <div className="overflow-x-auto no-scrollbar">
                <div className="min-w-[1000px]">
                    <div className="grid grid-cols-9 gap-4 mb-4">
                        <div className="col-span-1" />
                        {categories.map((cat, i) => (
                            <div key={cat} className="flex flex-col items-center justify-end h-16 pb-2 border-b border-white/10">
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{cat}</span>
                                {categoryTrends[i] === 'up' && <TrendingUp size={12} className="text-emerald-500 mt-1" />}
                                {categoryTrends[i] === 'down' && <TrendingDown size={12} className="text-rose-500 mt-1" />}
                            </div>
                        ))}
                    </div>

                    <div className="space-y-4">
                        {properties.map((prop) => (
                            <div key={prop} className="grid grid-cols-9 gap-4 items-center">
                                <div className="col-span-1 py-4">
                                    <span className="text-sm font-bold text-white tracking-tight">{prop}</span>
                                </div>
                                {heatmapData[prop].map((val, catIdx) => (
                                    <motion.button
                                        key={catIdx}
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => setSelectedCell({property: prop, catIndex: catIdx})}
                                        className={`h-16 rounded-2xl flex flex-col items-center justify-center border transition-all duration-300 relative group/cell ${getCellColor(val)}`}
                                    >
                                        <span className="text-lg font-black tracking-tighter">{val}%</span>
                                        <div className="absolute inset-0 bg-white/20 opacity-0 group-hover/cell:opacity-100 transition-opacity rounded-2xl" />
                                    </motion.button>
                                ))}
                            </div>
                        ))}
                    </div>

                    {/* Footer Row - Averages */}
                    <div className="grid grid-cols-9 gap-4 mt-12 pt-8 border-t border-white/10">
                        <div className="col-span-1">
                            <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">Cat. Risk Score</span>
                        </div>
                        {avgByCategory.map((avg, i) => (
                            <div key={i} className="flex flex-col items-center justify-center p-4 rounded-3xl bg-white/5 border border-white/5 shadow-inner">
                                <span className={`text-base font-black tracking-tighter ${
                                    avg < 75 ? 'text-rose-500' : 'text-slate-300'
                                }`}>{avg}%</span>
                                {avg < 75 && (
                                    <AlertTriangle size={12} className="text-rose-500 mt-1 animate-pulse" />
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
          </div>
        </div>

        {/* Drill-Down Info (Left Half) */}
        <div className="lg:col-span-8">
            <AnimatePresence mode="wait">
                {selectedCell ? (
                    <motion.div
                        key="drilldown"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="bg-slate-900/60 backdrop-blur-md rounded-3xl border border-blue-500/20 p-8 shadow-2xl h-full flex flex-col"
                    >
                        <div className="flex justify-between items-start mb-8">
                            <div className="space-y-1">
                                <span className="text-blue-500 text-[10px] font-black uppercase tracking-[0.2em]">Evidence Drill-Down</span>
                                <h4 className="text-2xl font-black text-white tracking-tight leading-none uppercase">
                                    {properties[properties.indexOf(selectedCell.property)]} — {categories[selectedCell.catIndex]}
                                </h4>
                            </div>
                            <button 
                                onClick={() => setSelectedCell(null)}
                                className="p-2 bg-white/5 hover:bg-white/10 rounded-xl text-slate-500 hover:text-white"
                            >
                                <RotateCcw size={18} />
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 flex-1">
                            {/* Failed Rooms List */}
                            <div className="space-y-3">
                                <h5 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-4">Reported Failures (Last 30 Days)</h5>
                                {[402, 315, 208, 112].map((room) => (
                                    <div key={room} className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5 group/room hover:bg-rose-500/5 hover:border-rose-500/20 transition-all cursor-pointer">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-500 font-bold border border-orange-500/20">
                                                {room}
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-white leading-none mb-1">Standard Violation</p>
                                                <p className="text-[10px] text-slate-500 font-medium">Captured 2h ago</p>
                                            </div>
                                        </div>
                                        <Camera size={16} className="text-slate-600 group-hover/room:text-rose-400" />
                                    </div>
                                ))}
                            </div>

                            {/* Captured Evidence Section */}
                            <div className="bg-slate-950/50 rounded-3xl border border-white/5 p-6 flex flex-col">
                                <div className="flex justify-between items-center mb-6">
                                    <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Image Evidence</span>
                                    <div className="flex gap-1">
                                        <span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-500 text-[8px] font-bold uppercase tracking-widest">Failed</span>
                                    </div>
                                </div>
                                <div className="flex-1 rounded-2xl bg-white/5 border border-dashed border-white/10 flex items-center justify-center overflow-hidden relative group">
                                    <img 
                                        src={`https://images.unsplash.com/photo-1544124499-58912cbddaad?w=500&auto=format&fit=crop&q=60`} 
                                        alt="Evidence" 
                                        className="w-full h-full object-cover opacity-60 grayscale group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700"
                                    />
                                    <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                                        <p className="text-white text-[10px] font-bold leading-tight">Property: Monarch {selectedCell.property}</p>
                                        <p className="text-slate-400 text-[9px] font-medium italic">Detection: Improper Arrangement</p>
                                    </div>
                                </div>
                                <button className="mt-6 w-full py-3 bg-blue-600 rounded-xl text-white text-[11px] font-black uppercase tracking-widest hover:bg-blue-700 transition-all shadow-lg shadow-blue-900/30">
                                    Open Detailed AI Report
                                </button>
                            </div>
                        </div>
                    </motion.div>
                ) : (
                    <motion.div
                        key="placeholder"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="bg-slate-900/40 border border-dashed border-white/10 rounded-3xl h-full flex flex-col items-center justify-center p-12 text-center"
                    >
                        <div className="w-16 h-16 rounded-3xl bg-white/5 flex items-center justify-center text-slate-600 mb-6">
                            <Info size={32} />
                        </div>
                        <h4 className="text-lg font-bold text-slate-400 mb-2 tracking-tight">Interactive Insight Panel</h4>
                        <p className="text-sm text-slate-500 max-w-[300px] leading-relaxed font-medium">Click on any property category cell above to drill down into specific room failures and photo evidence capture by Q100 AI.</p>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>

        {/* Alerts & Risk row (Right Half) */}
        <div className="lg:col-span-4 space-y-8">
            <div className="bg-slate-900/60 backdrop-blur-md rounded-3xl border border-rose-500/20 p-8 shadow-xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-8 opacity-5">
                    <Sparkles size={80} className="text-rose-500" />
                </div>
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-2.5 bg-rose-500/10 text-rose-500 rounded-xl">
                        <AlertTriangle size={20} />
                    </div>
                    <div className="space-y-0.5">
                        <h5 className="text-sm font-black text-white uppercase tracking-wider">Standard Refresh Alert</h5>
                        <p className="text-rose-400/60 text-[9px] font-bold uppercase tracking-widest">Urgent Intervention</p>
                    </div>
                </div>
                <div className="space-y-4">
                    <p className="text-slate-300 text-[13px] leading-relaxed">
                        <strong className="text-rose-400">Minibar placement</strong> has fallen below 75% target at 4 of 5 properties for 3 consecutive months.
                    </p>
                    <div className="p-4 bg-white/5 border border-white/5 rounded-2xl">
                        <p className="text-white text-[11px] font-bold mb-2 uppercase tracking-widest">Recommendation:</p>
                        <p className="text-slate-500 text-[11px] leading-relaxed italic">
                           Update the Minibar Master image to reflect the Thums Up agreement. Current images still feature legacy inventory.
                        </p>
                    </div>
                    <button className="flex items-center gap-2 group text-blue-400 text-[11px] font-black uppercase tracking-widest hover:gap-3 transition-all pt-2">
                        Update Brand Guideline
                        <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                </div>
            </div>

            <div className="bg-slate-900/60 backdrop-blur-md rounded-3xl border border-white/5 p-8 shadow-xl overflow-hidden relative">
                <div className="flex justify-between items-center mb-6">
                    <h5 className="text-sm font-black text-white uppercase tracking-wider">Strengths & Risks</h5>
                </div>
                <div className="space-y-4">
                    <div className="p-4 bg-emerald-500/5 border border-emerald-500/10 rounded-2xl">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Brand Strength</span>
                            <CheckCircle2 size={14} className="text-emerald-500" />
                        </div>
                        <p className="text-white text-xs font-bold leading-none mb-1">Entrance & Closet Accuracy</p>
                        <p className="text-slate-500 text-[10px] leading-relaxed">84.8% avg. efficiency across portfolio. Pune leading at 90%.</p>
                    </div>
                    <div className="p-4 bg-rose-500/5 border border-rose-500/10 rounded-2xl">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-[10px] font-black text-rose-500 uppercase tracking-widest">Brand Risk</span>
                            <AlertTriangle size={14} className="text-rose-500" />
                        </div>
                        <p className="text-white text-xs font-bold leading-none mb-1">Minibar Inventory Audit</p>
                        <p className="text-slate-500 text-[10px] leading-relaxed">66.4% average compliance. Flagged for immediate retraining.</p>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </OwnerDashboardLayout>
  );
}
