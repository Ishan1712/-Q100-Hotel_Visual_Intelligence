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
    <div className="max-w-[1440px] mx-auto space-y-6 animate-fade-in py-8 px-4 relative overflow-hidden">
      
      {/* 1. Celebration Banner */}
      <section className="relative bg-slate-900 rounded-[2rem] p-8 md:p-10 text-center overflow-hidden shadow-2xl shadow-slate-900/30">
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
                  <Sparkles size={Math.random() * 16 + 8} className="text-amber-400" />
               </div>
             ))}
          </div>
        )}

        <div className="relative z-10 space-y-4">
           <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-amber-400/10 border border-amber-400/20 mb-1 relative">
              <Trophy size={36} className="text-amber-400 animate-bounce-soft" />
              <div className="absolute -top-1 -right-1 bg-emerald-500 text-white p-1 rounded-full shadow-lg">
                 <CheckCircle2 size={16} />
              </div>
           </div>
           
           <div className="space-y-2">
              <h1 className="text-3xl md:text-4xl font-black text-white tracking-tighter leading-none">
                 Shift Complete!
              </h1>
              <p className="text-slate-400 text-sm md:text-base font-medium max-w-md mx-auto leading-relaxed">
                 Amazing work today, {shiftData.housekeeper}. Every room is verified and guest-ready.
              </p>
           </div>

           <div className="flex justify-center gap-3 pt-3">
              <button className="px-6 py-2.5 bg-white text-slate-900 rounded-xl font-bold text-xs tracking-widest uppercase hover:scale-105 transition-all shadow-xl shadow-white/10 active:scale-95">
                 Sign Out
              </button>
              <Link href="/" className="px-6 py-2.5 bg-slate-800 text-white rounded-xl font-bold text-xs tracking-widest uppercase border border-slate-700 hover:bg-slate-700 transition-all flex items-center gap-2">
                 <span>Review Shifts</span>
                 <ChevronRight size={16} />
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
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Progress Centerpiece */}
        <div className="lg:col-span-5 bg-gradient-to-b from-emerald-50 to-emerald-100/50 rounded-[2rem] p-6 lg:p-8 border border-emerald-200 shadow-xl shadow-emerald-500/10 flex flex-col items-center justify-center text-center space-y-5 min-h-[350px]">
           <h3 className="text-xs font-black text-emerald-900 uppercase tracking-[0.2em]">Final Task Progress</h3>
           
           <div className="relative w-48 h-48 flex items-center justify-center">
              {/* SVG Ring */}
              <svg className="w-full h-full transform -rotate-90 drop-shadow-xl">
                <circle
                  cx="96"
                  cy="96"
                  r="80"
                  stroke="currentColor"
                  strokeWidth="12"
                  fill="transparent"
                  className="text-emerald-200/50"
                />
                <circle
                  cx="96"
                  cy="96"
                  r="80"
                  stroke="currentColor"
                  strokeWidth="12"
                  fill="transparent"
                  strokeDasharray={2 * Math.PI * 80}
                  strokeDashoffset={0}
                  strokeLinecap="round"
                  className="text-emerald-500 transition-all duration-1000 ease-out"
                />
              </svg>
              {/* Inner Text */}
              <div className="absolute inset-0 flex flex-col items-center justify-center space-y-1">
                 <span className="text-4xl font-black text-emerald-950 tracking-tighter">100%</span>
                 <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest leading-none">Complete</span>
              </div>
           </div>

           <div className="space-y-3 pt-4 w-full">
              <div className="flex items-center justify-center gap-3 bg-emerald-50 px-5 py-3 rounded-2xl border border-emerald-100 text-emerald-700 w-full">
                 <div className="w-8 h-8 rounded-xl bg-emerald-500 flex items-center justify-center text-white shadow-md shadow-emerald-500/20 shrink-0">
                    <ThumbsUp size={16} className="animate-tada" />
                 </div>
                 <div className="text-left font-bold text-xs leading-snug">
                    No pending rooms. All checklists finalized.
                 </div>
              </div>
           </div>
        </div>

        {/* Stats Grid */}
        <div className="lg:col-span-7 grid grid-cols-2 gap-4 h-full">
           {[
             { icon: Bed, value: "14", color: "blue", label: "Rooms" },
             { icon: CheckCircle2, value: "11", color: "emerald", label: "Pre-verified" },
             { icon: Clock, value: "4h 12m", color: "indigo", label: "Duration" },
             { icon: Flame, value: "7", color: "orange", label: "Streak" }
           ].map((stat, i) => {
             const Icon = stat.icon;
             return (
               <div key={i} className={`p-5 md:p-6 rounded-2xl md:rounded-3xl border shadow-md flex flex-col items-center justify-center space-y-3 group transition-all hover:scale-105 ${
                    stat.color === 'blue' ? 'bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200 shadow-blue-500/10 hover:border-blue-300' : 
                    stat.color === 'emerald' ? 'bg-gradient-to-br from-emerald-50 to-teal-50 border-emerald-200 shadow-emerald-500/10 hover:border-emerald-300' : 
                    stat.color === 'indigo' ? 'bg-gradient-to-br from-indigo-50 to-purple-50 border-indigo-200 shadow-indigo-500/10 hover:border-indigo-300' : 
                    'bg-gradient-to-br from-orange-50 to-amber-50 border-orange-200 shadow-orange-500/10 hover:border-orange-300'
               }`}>
                  <div className={`w-12 h-12 rounded-[1rem] flex items-center justify-center transition-all bg-white shadow-sm duration-500 group-hover:rotate-6 ${
                    stat.color === 'blue' ? 'text-blue-600' : 
                    stat.color === 'emerald' ? 'text-emerald-600' : 
                    stat.color === 'indigo' ? 'text-indigo-600' : 
                    'text-orange-600 animate-pulse'
                  }`}>
                     <Icon size={24} strokeWidth={2.5} />
                  </div>
                  <div className="text-center">
                     <p className={`text-2xl font-black leading-none ${
                        stat.color === 'blue' ? 'text-blue-950' : 
                        stat.color === 'emerald' ? 'text-emerald-950' : 
                        stat.color === 'indigo' ? 'text-indigo-950' : 
                        'text-orange-950'
                     }`}>{stat.value}</p>
                     <p className={`text-[9px] font-bold uppercase tracking-widest mt-1 opacity-80 group-hover:opacity-100 transition-opacity ${
                        stat.color === 'blue' ? 'text-blue-600' : 
                        stat.color === 'emerald' ? 'text-emerald-600' : 
                        stat.color === 'indigo' ? 'text-indigo-600' : 
                        'text-orange-600'
                     }`}>{stat.label}</p>
                  </div>
               </div>
             )
           })}

           {/* Personal Best Callout - Full Width */}
           <div className="col-span-2 bg-gradient-to-br from-indigo-600 to-violet-700 p-6 rounded-2xl md:rounded-3xl text-white overflow-hidden relative group shadow-indigo-500/20 shadow-lg">
              {/* Background Glow */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl group-hover:scale-150 transition-transform duration-700" />
              
              <div className="flex items-center gap-4 relative z-10">
                 <div className="w-12 h-12 rounded-[1rem] bg-white/20 backdrop-blur-md flex items-center justify-center shrink-0 shadow-lg border border-white/20">
                    <Star size={20} className="fill-white" />
                 </div>
                 <div className="space-y-0.5">
                    <p className="text-indigo-200 text-[9px] font-black uppercase tracking-[0.2em] mb-1">Personal Achievement</p>
                    <p className="text-sm md:text-base font-bold tracking-tight leading-snug">
                       {shiftData.personalBest}
                    </p>
                 </div>
              </div>
           </div>
        </div>
      </div>

      {/* 3. Detailed Breakdown & Streak */}
      <section className="bg-white rounded-[2rem] md:rounded-[2.5rem] p-6 md:p-8 border border-slate-100 shadow-xl shadow-slate-200/40">
         <div className="flex flex-col md:flex-row md:items-center justify-between gap-5 mb-8">
          <h3 className="text-lg md:text-xl font-bold text-slate-900 flex items-center gap-2">
             <History className="text-blue-500" size={20} />
             Today's Detailed Feedback
          </h3>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="relative group w-full sm:w-56">
               <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={14} />
               <input 
                  type="text" 
                  placeholder="Filter fixes..." 
                  value={fixSearch}
                  onChange={(e) => setFixSearch(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-100 rounded-xl py-1.5 pl-9 pr-8 outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500/50 transition-all text-[10px] sm:text-xs font-medium shadow-sm"
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
            <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-100">
               <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Quality Score</span>
               <span className="text-base font-black text-slate-900 tracking-tighter">98.4</span>
            </div>
          </div>
         </div>

         <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            {/* Fixes List */}
            <div className="space-y-3">
               <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3">Visual Fixes Provided</h4>
               <div className="space-y-2">
                  {filteredFixes.length > 0 ? (
                    filteredFixes.map((fix, i) => (
                      <div key={i} className="flex items-center justify-between p-3.5 bg-slate-50 rounded-xl border border-slate-100 hover:bg-white hover:shadow-md transition-all group animate-fade-in">
                         <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center font-bold text-slate-900 border border-slate-100 group-hover:border-blue-200 group-hover:text-blue-600 transition-all shadow-sm">
                               {fix.room}
                            </div>
                            <div>
                               <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-[1px]">Discrepancy</p>
                               <p className="text-xs font-bold text-slate-800">{fix.details}</p>
                            </div>
                         </div>
                         <ChevronRight size={16} className="text-slate-300 group-hover:text-blue-500 transition-colors" />
                      </div>
                    ))
                  ) : (
                    <div className="py-8 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                       <p className="text-[10px] font-bold text-slate-400">No fixes match "{fixSearch}"</p>
                    </div>
                  )}
               </div>
            </div>

            {/* Streak Callout */}
            <div className="bg-slate-900 rounded-[2rem] p-6 text-center flex flex-col items-center justify-center space-y-3 relative overflow-hidden shadow-xl shadow-slate-900/20">
               {/* Decorative ring */}
               <div className="absolute inset-x-0 bottom-0 top-0 opacity-10 pointer-events-none">
                  <div className="w-[150%] aspect-square border-4 border-white/20 rounded-full -translate-x-1/4 translate-y-1/2" />
               </div>

               <div className="relative">
                  <Flame size={48} className="text-orange-500 animate-pulse fill-orange-500/20" />
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-white font-black text-[10px] border-2 border-slate-900">
                     7
                  </div>
               </div>
               <div className="space-y-1 relative z-10 max-w-[200px] mt-2">
                  <p className="text-white text-xl font-black tracking-tighter leading-none">Streak Maintained</p>
                  <p className="text-slate-400 text-xs font-medium">Keep it up! 3 more days for a Monthly Medal.</p>
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
