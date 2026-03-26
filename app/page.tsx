"use client";

import React from 'react';
import { Bed, Crown, Star, ChevronRight, Camera, Wifi, Flame, User, Sun } from 'lucide-react';

// --- Housekeeper Specific Components ---

const ProgressRing = ({ completed, total }: { completed: number, total: number }) => {
  const percentage = (completed / total) * 100;
  const radius = 80;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative flex items-center justify-center w-[240px] h-[240px] animate-fade-in-up stagger-1">
      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 200 200">
        <circle
          cx="100"
          cy="100"
          r={radius}
          stroke="currentColor"
          strokeWidth="10"
          fill="transparent"
          className="text-slate-100"
        />
        <circle
          cx="100"
          cy="100"
          r={radius}
          stroke="url(#blueGradient)"
          strokeWidth="10"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          fill="transparent"
          className="transition-all duration-1000 ease-out"
        />
        <defs>
          <linearGradient id="blueGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#3b82f6" />
            <stop offset="100%" stopColor="#2563eb" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className="text-6xl font-black tracking-tight text-slate-900">{completed}<span className="text-slate-300 mx-2">/</span>{total}</span>
        <span className="text-[10px] uppercase tracking-[0.3em] text-slate-400 font-bold mt-4">Rooms Completed</span>
      </div>
    </div>
  );
};

const RoomCard = ({ number, type, status, index }: { number: string, type: 'Standard' | 'Suite' | 'VIP', status: 'not-started' | 'in-progress' | 'done' | 'flagged', index: number }) => {
  const TypeIcon = type === 'Suite' ? Crown : type === 'VIP' ? Star : Bed;
  
  const statusColors: Record<string, string> = {
    'not-started': 'bg-slate-300',
    'in-progress': 'bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.4)]',
    'done': 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]',
    'flagged': 'bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.4)]'
  };

  return (
    <div className={`kpi-card p-5 rounded-2xl flex items-center justify-between animate-fade-in-up stagger-${(index % 5) + 3}`}>
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400">
          <TypeIcon size={24} />
        </div>
        <div>
          <h3 className="text-lg font-bold text-slate-900 tracking-tight leading-none">Room {number}</h3>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1.5">{type}</p>
        </div>
      </div>
      <div className="flex items-center gap-6">
        <div className={`w-3 h-3 rounded-full ${statusColors[status]}`} />
        <div className="text-slate-300 group-hover:text-blue-500 transition-colors">
          <ChevronRight size={20} />
        </div>
      </div>
    </div>
  );
};

// --- Main Page ---

export default function HousekeeperDashboard() {
  return (
    <div className="max-w-5xl mx-auto space-y-12 pb-20">
      
      {/* 1. Progress Centerpiece */}
      <section className="glass-card rounded-[3rem] p-16 relative overflow-hidden animate-fade-in-up">
        {/* Background Decor */}
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-500/10 to-transparent pointer-events-none" />
        
        {/* Floating Badges - Top Right corner of the box */}
        <div className="absolute top-10 right-10 flex items-center gap-4 z-30">
           <div className="flex items-center gap-3 px-5 py-2.5 bg-white/90 backdrop-blur-xl border border-slate-100 rounded-2xl shadow-xl shadow-slate-200/40 hover:scale-105 transition-all cursor-default group">
              <div className="p-2 bg-orange-50 rounded-xl group-hover:bg-orange-100 transition-colors">
                <Flame size={20} className="text-orange-500 fill-orange-500/10" />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-black text-slate-900 leading-none">7 Days</span>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Perfect Streak</span>
              </div>
           </div>

           <div className="flex items-center gap-3 px-5 py-2.5 bg-white/90 backdrop-blur-xl border border-slate-100 rounded-2xl shadow-xl shadow-slate-200/40">
              <div className="p-2 bg-emerald-50 rounded-xl">
                <Wifi size={20} className="text-emerald-500" />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-black text-slate-900 leading-none">Live</span>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Cloud Sync</span>
              </div>
           </div>
        </div>

        {/* Center Content */}
        <div className="flex flex-col items-center justify-center">
          <div className="relative">
            <ProgressRing completed={6} total={14} />
          </div>
          
          <div className="text-center mt-12 space-y-3 z-10">
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">6 of 14 rooms completed</h2>
            <p className="text-slate-400 font-medium text-lg">You're making great progress! <span className="text-blue-600 font-black">Almost halfway there.</span></p>
          </div>
        </div>
      </section>

      {/* 2. Room List Header */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-6 animate-fade-in-up stagger-2">
        <h2 className="text-xs font-black text-slate-400 uppercase tracking-[0.4em]">Floor 4 • Active Worklist</h2>
        <div className="flex items-center gap-3">
           <span className="px-4 py-1.5 bg-blue-50 text-blue-600 rounded-xl text-xs font-black uppercase tracking-widest border border-blue-100">8 Rooms Remaining</span>
        </div>
      </div>

      {/* 4. Room Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <RoomCard number="412" type="Standard" status="done" index={0} />
        <RoomCard number="415" type="Suite" status="done" index={1} />
        <RoomCard number="418" type="Standard" status="done" index={2} />
        <RoomCard number="420" type="VIP" status="done" index={3} />
        <RoomCard number="422" type="Standard" status="done" index={4} />
        <RoomCard number="425" type="Standard" status="done" index={5} />
        <RoomCard number="428" type="Standard" status="not-started" index={6} />
        <RoomCard number="430" type="Suite" status="not-started" index={7} />
        <RoomCard number="432" type="Standard" status="not-started" index={8} />
      </div>

      {/* 5. Footer Info (Offline Indicator / Branding) */}
      <div className="pt-10 flex items-center justify-between opacity-40">
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.5em]">
          Morning Shift • Floor 4 • Taj Mahal Palace, Mumbai
        </p>
        <div className="flex items-center gap-2">
           <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
           <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">All Photos Synced</span>
        </div>
      </div>

    </div>
  );
}
