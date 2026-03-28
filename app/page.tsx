"use client";

import React from 'react';
import { Search, Bed, Crown, Star, ChevronRight, Camera, Wifi, Flame, User, Sun, XCircle } from 'lucide-react';
import Link from 'next/link';

// --- Housekeeper Specific Components ---

const ProgressRing = ({ completed, total, size = 200 }: { completed: number, total: number, size?: number }) => {
  const percentage = (completed / total) * 100;
  const radius = (size / 2) - 10;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;
  const strokeWidth = size > 150 ? 8 : 6;

  return (
    <div className={`relative flex items-center justify-center animate-fade-in-up stagger-1`} style={{ width: size, height: size }}>
      <svg className="w-full h-full transform -rotate-90" viewBox={`0 0 ${size} ${size}`}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="transparent"
          className="text-blue-100/40"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="url(#blueGradientDashboard)"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          fill="transparent"
          className="transition-all duration-1000 ease-out"
        />
        <defs>
          <linearGradient id="blueGradientDashboard" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#3b82f6" />
            <stop offset="100%" stopColor="#2563eb" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className={`${size > 150 ? 'text-5xl' : 'text-3xl'} font-bold tracking-tight text-slate-900 leading-none`}>
          {completed}<span className="text-slate-300 mx-1">/</span>{total}
        </span>
        <span className={`${size > 150 ? 'text-[8px]' : 'text-[6px]'} uppercase tracking-[0.3em] text-slate-400 font-bold mt-2 md:mt-4`}>Remaining Task</span>
      </div>
    </div>
  );
};

const RoomCard = ({ number, type, status, index }: { number: string, type: 'Standard' | 'Suite' | 'VIP', status: 'not-started' | 'in-progress' | 'done' | 'flagged', index: number }) => {
  const TypeIcon = type === 'Suite' ? Crown : type === 'VIP' ? Star : Bed;
  
  const statusColors: Record<string, string> = {
    'not-started': 'bg-slate-200',
    'in-progress': 'bg-amber-500 shadow-md',
    'done': 'bg-emerald-500 shadow-md',
    'flagged': 'bg-rose-500 shadow-md'
  };

  const typeColorMap = {
    Standard: "border-blue-100 text-blue-600 bg-blue-50/50 hover:border-blue-300 hover:shadow-blue-200/20",
    Suite: "border-indigo-100 text-indigo-600 bg-indigo-50/50 hover:border-indigo-300 hover:shadow-indigo-200/20",
    VIP: "border-amber-100 text-amber-600 bg-amber-50/50 hover:border-amber-300 hover:shadow-amber-200/20",
  }[type];

  const iconBgMap = {
    Standard: "bg-blue-50 text-blue-600",
    Suite: "bg-indigo-50 text-indigo-600",
    VIP: "bg-amber-50 text-amber-600",
  }[type];

  const href = status === 'done' ? `/inspection/report?room=${number}` : `/inspection?room=${number}`;

  return (
    <Link href={href} className={`p-5 md:p-6 rounded-[1.75rem] md:rounded-[2rem] border flex items-center justify-between animate-fade-in-up stagger-${(index % 5) + 3} transition-all duration-300 group ${typeColorMap} bg-white shadow-sm hover:shadow-md hover:scale-[1.01] active:scale-95`}>
      <div className="flex items-center gap-5 md:gap-6">
        <div className={`w-12 h-12 md:w-14 md:h-14 rounded-2xl md:rounded-3xl flex items-center justify-center transition-all ${iconBgMap}`}>
          <TypeIcon className="w-6 h-6 md:w-8 md:h-8" />
        </div>
        <div>
          <h3 className="text-base md:text-xl font-black text-slate-900 tracking-tight leading-none uppercase">Room {number}</h3>
          <p className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-1.5 md:mt-2">{type}</p>
        </div>
      </div>
      <div className="flex items-center gap-5">
        <div className={`w-2 h-2 md:w-2.5 md:h-2.5 rounded-full ${statusColors[status]} shadow-sm transition-transform group-hover:scale-125`} />
        <div className="text-slate-200 group-hover:text-blue-500 transition-colors">
          <ChevronRight size={20} strokeWidth={2.5} />
        </div>
      </div>
    </Link>
  );
};

// --- Main Page ---

export default function HousekeeperDashboard() {
  const [searchQuery, setSearchQuery] = React.useState("");

  const rooms = [
    { number: "412", type: "Standard", status: "done" },
    { number: "415", type: "Suite", status: "done" },
    { number: "418", type: "Standard", status: "done" },
    { number: "420", type: "VIP", status: "done" },
    { number: "422", type: "Standard", status: "done" },
    { number: "425", type: "Standard", status: "done" },
    { number: "428", type: "Standard", status: "not-started" },
    { number: "430", type: "Suite", status: "not-started" },
    { number: "432", type: "VIP", status: "not-started" },
  ] as const;

  const filteredRooms = rooms.filter(room => 
    room.number.toLowerCase().includes(searchQuery.toLowerCase()) ||
    room.type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-[1440px] mx-auto space-y-6 pb-10 px-4 md:px-6">
      
      {/* 1. Progress Centerpiece (Premium Light Blue Theme) */}
      <section className="bg-[#F4F8FF] rounded-3xl p-6 md:p-8 relative overflow-hidden animate-fade-in-up border border-blue-100/50 shadow-sm">
        {/* Background Decor */}
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-400/5 to-transparent pointer-events-none" />
        
        {/* Floating Badges */}
        <div className="absolute top-4 right-4 md:top-6 md:right-6 flex items-center gap-2 md:gap-3 z-30 scale-90 md:scale-100 origin-right">
           <div className="flex items-center gap-2 md:gap-2.5 px-3 py-1.5 md:px-4 md:py-2 bg-white/80 backdrop-blur-md border border-blue-50 rounded-xl shadow-sm hover:scale-105 transition-all group">
              <div className="p-1 md:p-1.5 bg-orange-50 rounded-lg group-hover:bg-orange-100 transition-colors">
                <Flame size={16} className="text-orange-500 fill-orange-500/10" />
              </div>
              <div className="flex flex-col">
                <span className="text-xs md:text-sm font-bold text-slate-900 leading-none">7 Days</span>
                <span className="text-[8px] md:text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5 md:mt-1">Streak</span>
              </div>
           </div>

           <div className="flex items-center gap-2 md:gap-2.5 px-3 py-1.5 md:px-4 md:py-2 bg-white/80 backdrop-blur-md border border-blue-50 rounded-xl shadow-sm">
              <div className="p-1 md:p-1.5 bg-emerald-50 rounded-lg">
                <Wifi size={16} className="text-emerald-500" />
              </div>
              <div className="flex flex-col text-right sm:text-left">
                <span className="text-xs md:text-sm font-bold text-slate-900 leading-none">Active</span>
                <span className="text-[8px] md:text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5 md:mt-1">Sync</span>
              </div>
           </div>
        </div>

        {/* Center Content */}
        <div className="flex flex-col md:flex-row items-center gap-6 md:gap-10 pt-12 md:pt-0">
          <div className="relative shrink-0 p-3 md:p-4 bg-blue-100/30 rounded-full">
            <div className="hidden md:block">
              <ProgressRing completed={6} total={14} size={200} />
            </div>
            <div className="md:hidden">
              <ProgressRing completed={6} total={14} size={150} />
            </div>
          </div>
          
          <div className="space-y-4 md:space-y-6 z-10 text-center md:text-left">
            <div className="space-y-2">
              <p className="text-slate-500 font-bold text-[10px] md:text-sm uppercase tracking-widest">Shift Completion</p>
              <h2 className="text-2xl md:text-4xl font-black text-slate-900 tracking-tight leading-tight">
                You've completed <span className="text-blue-600">64%</span> of your shift!
              </h2>
              <p className="text-slate-400 font-medium text-sm md:text-base">6 of 14 rooms verified. Keep it up!</p>
            </div>
            
            <Link 
              href="/inspection"
              className="group inline-flex items-center gap-3 px-8 py-4 md:px-10 md:py-5 bg-slate-900 text-white rounded-2xl font-bold text-sm md:text-base shadow-xl shadow-slate-900/10 hover:bg-slate-800 hover:scale-105 active:scale-95 transition-all duration-300 w-full md:w-auto justify-center"
            >
              <Camera size={20} className="group-hover:rotate-[15deg] transition-transform md:w-6 md:h-6" />
              <span>Go Scan a Room</span>
              <div className="w-5 h-5 md:w-6 md:h-6 rounded-full bg-white/10 flex items-center justify-center -mr-1">
                <ChevronRight size={14} className="md:w-4 md:h-4" />
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* 2. Room List Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between border-b border-slate-100 pb-4 animate-fade-in-up stagger-2 gap-4">
        <div className="flex flex-col">
          <h2 className="text-[8px] md:text-[9px] font-bold text-slate-400 uppercase tracking-[0.4em]">Floor 4 • Operational List</h2>
          <p className="text-lg md:text-xl font-black text-slate-900 tracking-tight mt-1">Room Status Grid</p>
        </div>
        
        <div className="flex items-center gap-3 md:gap-4 flex-1 max-w-full lg:max-w-md">
           <div className="relative group w-full">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={14} />
              <input 
                 type="text" 
                 placeholder="Find a room..." 
                 value={searchQuery}
                 onChange={(e) => setSearchQuery(e.target.value)}
                 className="w-full bg-white border border-slate-200 rounded-2xl py-2 pl-10 pr-10 outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500/50 transition-all text-xs md:text-sm font-medium shadow-sm"
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-500 transition-colors"
                >
                  <XCircle size={16} />
                </button>
              )}
           </div>
           <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 bg-blue-50 text-blue-600 rounded-lg text-[8px] md:text-[9px] font-bold uppercase tracking-widest border border-blue-100 whitespace-nowrap">
                {filteredRooms.length} <span className="hidden xs:inline">of {rooms.length}</span> Rooms
              </span>
           </div>
        </div>
      </div>

      {/* 4. Room Grid (Compact) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-5 md:gap-6 min-h-[300px] items-start">
        {filteredRooms.length > 0 ? (
          filteredRooms.map((room, i) => (
            <RoomCard key={room.number} number={room.number} type={room.type as any} status={room.status as any} index={i} />
          ))
        ) : (
          <div className="col-span-full flex flex-col items-center justify-center py-12 md:py-20 bg-slate-50 rounded-[2rem] md:rounded-[3rem] border border-dashed border-slate-200 animate-fade-in">
             <div className="w-12 h-12 md:w-16 md:h-16 bg-white rounded-2xl flex items-center justify-center text-slate-300 shadow-sm mb-4">
                <Search size={28} />
             </div>
             <p className="text-slate-500 font-bold text-sm">No rooms match "{searchQuery}"</p>
             <button onClick={() => setSearchQuery("")} className="mt-4 text-blue-600 text-[10px] font-bold uppercase tracking-widest hover:underline">Clear Search</button>
          </div>
        )}
      </div>

      {/* 5. Footer Info (Offline Indicator / Branding) */}
      <div className="pt-6 flex flex-col sm:flex-row items-center justify-between border-t border-slate-100 gap-4">
        <p className="text-[8px] font-bold text-slate-400 uppercase tracking-[0.4em] italic text-center sm:text-left">
          Floor 4 • Morning Shift
        </p>
        <div className="flex items-center gap-2 px-3 py-1 bg-emerald-50 rounded-full border border-emerald-100">
           <div className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse" />
           <span className="text-[8px] font-bold text-emerald-600 uppercase tracking-widest">Real-time Sync Active</span>
        </div>
      </div>

    </div>
  );
}
