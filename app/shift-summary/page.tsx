"use client";

import React, { useState, useEffect } from 'react';
import { 
  CheckCircle2, 
  Sparkles, 
  Bed, 
  Clock, 
  Flame, 
  Trophy, 
  ChevronRight, 
  History,
  TrendingUp,
  Star,
  ThumbsUp,
  Search,
  XCircle
} from 'lucide-react';
import Link from 'next/link';

// --- Data ---
const shiftData = {
  housekeeper: "Priya",
  roomsCompleted: 14,
  totalRooms: 14,
  firstAttemptPasses: 11,
  fixesNeeded: [
    { room: "428", details: "Remote + Towel" },
    { room: "430", details: "Minibar restocking" },
    { room: "435", details: "Curtain tie-back" },
  ],
  totalTime: "4h 12m",
  longestStreak: 7,
  personalBest: "New record! Your fastest room today was 2m 48s (Room 422)",
};

export default function ShiftSummaryPage() {
  const [showConfetti, setShowConfetti] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [fixSearch, setFixSearch] = useState("");

  const filteredFixes = shiftData.fixesNeeded.filter(fix => 
    fix.room.toLowerCase().includes(fixSearch.toLowerCase()) ||
    fix.details.toLowerCase().includes(fixSearch.toLowerCase())
  );

  useEffect(() => {
    setMounted(true);
    // Trigger "confetti" animation on mount
    const timer = setTimeout(() => setShowConfetti(true), 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="max-w-[1440px] mx-auto space-y-8 animate-fade-in pb-20 px-4 relative overflow-hidden">
      
      {/* 1. Celebration Banner */}
      <section className="relative bg-slate-900 rounded-[3rem] p-10 md:p-16 text-center overflow-hidden shadow-2xl shadow-slate-900/40">
        {/* Subtle Sparkle Background Elements */}
        {mounted && (
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
             {[...Array(20)].map((_, i) => (
               <div 
                 key={i}
                 className="absolute animate-float-sparkle"
                 style={{
                   left: `${Math.random() * 100}%`,
                   top: `${Math.random() * 100}%`,
                   animationDelay: `${Math.random() * 5}s`,
                   opacity: 0.15
                 }}
               >
                  <Sparkles size={Math.random() * 24 + 12} className="text-amber-400" />
               </div>
             ))}
          </div>
        )}

        <div className="relative z-10 space-y-6">
           <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-amber-400/10 border border-amber-400/20 mb-2 relative">
              <Trophy size={48} className="text-amber-400 animate-bounce-soft" />
              <div className="absolute -top-2 -right-2 bg-emerald-500 text-white p-1.5 rounded-full shadow-lg">
                 <CheckCircle2 size={18} />
              </div>
           </div>
           
           <div className="space-y-2">
              <h1 className="text-5xl md:text-6xl font-black text-white tracking-tighter leading-none">
                 Shift Complete!
              </h1>
              <p className="text-slate-400 text-lg md:text-xl font-medium max-w-lg mx-auto leading-relaxed">
                 Amazing work today, {shiftData.housekeeper}. Every room is verified and guest-ready.
              </p>
           </div>

           <div className="flex justify-center gap-4 pt-4">
              <button className="px-8 py-3 bg-white text-slate-900 rounded-2xl font-bold text-sm tracking-widest uppercase hover:scale-105 transition-all shadow-xl shadow-white/10 active:scale-95">
                 Sign Out
              </button>
              <Link href="/" className="px-8 py-3 bg-slate-800 text-white rounded-2xl font-bold text-sm tracking-widest uppercase border border-slate-700 hover:bg-slate-700 transition-all flex items-center gap-2">
                 <span>Review Shifts</span>
                 <ChevronRight size={18} />
              </Link>
           </div>
        </div>

        {/* Confetti Animation Layer (Subtle Gold Sparkles) */}
        {showConfetti && mounted && (
           <div className="absolute inset-x-0 bottom-0 top-0 overflow-hidden pointer-events-none">
              {[...Array(40)].map((_, i) => (
                <div 
                  key={i}
                  className="absolute animate-sparkle-droplet"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `-10px`,
                    animationDuration: `${Math.random() * 3 + 2}s`,
                    animationDelay: `${Math.random() * 2}s`
                  }}
                >
                   <div className={`w-${Math.round(Math.random() * 2 + 1)} h-${Math.round(Math.random() * 2 + 1)} bg-amber-400 rounded-full blur-[1px]`} />
                </div>
              ))}
           </div>
        )}
      </section>

      {/* 2. Key Metrics & Progress */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Progress Centerpiece */}
        <div className="lg:col-span-5 bg-white rounded-[3rem] p-10 border border-slate-100 shadow-xl shadow-slate-200/40 flex flex-col items-center justify-center text-center space-y-6 min-h-[500px]">
           <h3 className="text-sm font-black text-slate-800 uppercase tracking-[0.2em] mb-4">Final Task Progress</h3>
           
           <div className="relative w-64 h-64 flex items-center justify-center">
              {/* SVG Ring */}
              <svg className="w-full h-full transform -rotate-90 drop-shadow-2xl">
                <circle
                  cx="128"
                  cy="128"
                  r="110"
                  stroke="currentColor"
                  strokeWidth="16"
                  fill="transparent"
                  className="text-slate-50"
                />
                <circle
                  cx="128"
                  cy="128"
                  r="110"
                  stroke="currentColor"
                  strokeWidth="16"
                  fill="transparent"
                  strokeDasharray={2 * Math.PI * 110}
                  strokeDashoffset={0}
                  strokeLinecap="round"
                  className="text-emerald-500 transition-all duration-1000 ease-out"
                />
              </svg>
              {/* Inner Text */}
              <div className="absolute inset-0 flex flex-col items-center justify-center space-y-1">
                 <span className="text-5xl font-black text-slate-900 tracking-tighter">100%</span>
                 <span className="text-xs font-bold text-slate-400 uppercase tracking-widest leading-none">Complete</span>
              </div>
           </div>

           <div className="space-y-4 pt-6">
              <div className="flex items-center gap-3 bg-emerald-50 px-6 py-4 rounded-3xl border border-emerald-100 text-emerald-700">
                 <div className="w-10 h-10 rounded-2xl bg-emerald-500 flex items-center justify-center text-white shadow-lg shadow-emerald-500/20">
                    <ThumbsUp size={20} className="animate-tada" />
                 </div>
                 <div className="text-left font-bold text-sm">
                    No pending rooms. All checklists finalized.
                 </div>
              </div>
           </div>
        </div>

        {/* Stats Grid */}
        <div className="lg:col-span-7 grid grid-cols-2 gap-6 h-full">
           {[
             { icon: Bed, value: "14", color: "blue", label: "Rooms" },
             { icon: CheckCircle2, value: "11", color: "emerald", label: "Pre-verified" },
             { icon: Clock, value: "4h 12m", color: "indigo", label: "Shift Duration" },
             { icon: Flame, value: "7", color: "orange", label: "Streak" }
           ].map((stat, i) => {
             const Icon = stat.icon;
             return (
               <div key={i} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-lg shadow-slate-200/30 flex flex-col items-center justify-center space-y-4 group hover:border-blue-200 transition-all hover:scale-105">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all ${
                    stat.color === 'blue' ? 'bg-blue-50 text-blue-600' : 
                    stat.color === 'emerald' ? 'bg-emerald-50 text-emerald-600' : 
                    stat.color === 'indigo' ? 'bg-indigo-50 text-indigo-600' : 
                    'bg-orange-100 text-orange-600 animate-pulse'
                  }`}>
                     <Icon size={28} strokeWidth={2.5} />
                  </div>
                  <div className="text-center">
                     <p className="text-3xl font-black text-slate-900 leading-none">{stat.value}</p>
                     {/* Labels intentionally minimized as per request, but keeping small text for accessibility */}
                     <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-2 opacity-0 group-hover:opacity-100 transition-opacity">{stat.label}</p>
                  </div>
               </div>
             )
           })}

           {/* Personal Best Callout - Full Width */}
           <div className="col-span-2 bg-gradient-to-br from-indigo-600 to-violet-700 p-8 rounded-[2.5rem] text-white overflow-hidden relative group">
              {/* Background Glow */}
              <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl group-hover:scale-150 transition-transform duration-700" />
              
              <div className="flex items-center gap-6 relative z-10">
                 <div className="w-16 h-16 rounded-3xl bg-white/20 backdrop-blur-md flex items-center justify-center shrink-0 shadow-xl">
                    <Star size={32} className="fill-white" />
                 </div>
                 <div className="space-y-1">
                    <p className="text-indigo-200 text-[10px] font-black uppercase tracking-[0.2em]">Personal Achievement</p>
                    <p className="text-lg md:text-xl font-bold tracking-tight leading-snug">
                       {shiftData.personalBest}
                    </p>
                 </div>
              </div>
           </div>
        </div>
      </div>

      {/* 3. Detailed Breakdown & Streak */}
      <section className="bg-white rounded-[3rem] p-10 border border-slate-100 shadow-xl shadow-slate-200/40">
         <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <h3 className="text-xl font-bold text-slate-900 flex items-center gap-3">
             <History className="text-blue-500" />
             Today's Detailed Feedback
          </h3>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
            <div className="relative group w-full sm:w-64">
               <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={14} />
               <input 
                  type="text" 
                  placeholder="Filter fixes..." 
                  value={fixSearch}
                  onChange={(e) => setFixSearch(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-100 rounded-xl py-1.5 pl-9 pr-8 outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500/50 transition-all text-[10px] font-medium shadow-sm"
               />
               {fixSearch && (
                 <button 
                   onClick={() => setFixSearch("")}
                   className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-500 transition-colors"
                 >
                   <XCircle size={14} />
                 </button>
               )}
            </div>
            <div className="flex items-center gap-2 bg-slate-50 px-4 py-2 rounded-2xl">
               <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Quality Score</span>
               <span className="text-lg font-black text-slate-900 tracking-tighter">98.4</span>
            </div>
          </div>
         </div>

         <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {/* Fixes List */}
            <div className="space-y-4">
               <h4 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Visual Fixes Provided</h4>
               <div className="space-y-3">
                  {filteredFixes.length > 0 ? (
                    filteredFixes.map((fix, i) => (
                      <div key={i} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100 hover:bg-white hover:shadow-md transition-all group animate-fade-in">
                         <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center font-bold text-slate-900 border border-slate-100 group-hover:border-blue-200 group-hover:text-blue-600 transition-all">
                               {fix.room}
                            </div>
                            <div>
                               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Discrepancy</p>
                               <p className="text-sm font-bold text-slate-800">{fix.details}</p>
                            </div>
                         </div>
                         <ChevronRight size={18} className="text-slate-300" />
                      </div>
                    ))
                  ) : (
                    <div className="py-10 text-center bg-slate-50 rounded-3xl border border-dashed border-slate-200">
                       <p className="text-xs font-bold text-slate-400">No fixes match "{fixSearch}"</p>
                    </div>
                  )}
               </div>
            </div>

            {/* Streak Callout */}
            <div className="bg-slate-900 rounded-[3rem] p-8 text-center flex flex-col items-center justify-center space-y-4 relative overflow-hidden">
               {/* Decorative ring */}
               <div className="absolute inset-x-0 bottom-0 top-0 opacity-10 pointer-events-none">
                  <div className="w-[150%] aspect-square border-4 border-white/20 rounded-full -translate-x-1/4 translate-y-1/2" />
               </div>

               <div className="relative">
                  <Flame size={64} className="text-orange-500 animate-pulse fill-orange-500/20" />
                  <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-black text-xs">
                     7
                  </div>
               </div>
               <div className="space-y-1 relative z-10">
                  <p className="text-white text-2xl font-black tracking-tighter leading-none">Streak Maintained</p>
                  <p className="text-slate-400 text-sm font-medium">Keep it up! 3 more days for a Monthly Medal.</p>
               </div>
            </div>
         </div>
      </section>

      {/* Global & Page Specific CSS */}
      <style jsx global>{`
        @keyframes float-sparkle {
          0%, 100% { transform: translateY(0) scale(1); opacity: 0.15; }
          50% { transform: translateY(-20px) scale(1.2); opacity: 0.3; }
        }
        .animate-float-sparkle {
          animation: float-sparkle 4s infinite ease-in-out;
        }
        @keyframes sparkle-droplet {
          0% { transform: translateY(-10px) scale(0); opacity: 0; }
          20% { transform: translateY(0) scale(1); opacity: 1; }
          100% { transform: translateY(400px) scale(0.5); opacity: 0; }
        }
        .animate-sparkle-droplet {
          animation: sparkle-droplet linear infinite;
        }
        @keyframes tada {
          0% { transform: scale(1); }
          10%, 20% { transform: scale(0.9) rotate(-3deg); }
          30%, 50%, 70%, 90% { transform: scale(1.1) rotate(3deg); }
          40%, 60%, 80% { transform: scale(1.1) rotate(-3deg); }
          100% { transform: scale(1) rotate(0); }
        }
        .animate-tada {
          animation: tada 1.5s infinite;
        }
        @keyframes bounce-soft {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        .animate-bounce-soft {
          animation: bounce-soft 3s infinite ease-in-out;
        }
      `}</style>

    </div>
  );
}
