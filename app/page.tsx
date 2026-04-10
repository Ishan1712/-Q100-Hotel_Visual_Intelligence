"use client";

import React from 'react';
import { Search, Bed, Crown, Star, ChevronRight, Camera, Wifi, Flame, User, Sun, XCircle, CheckCircle2, AlertCircle, FlaskConical } from 'lucide-react';
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
          className="text-blue-100/60"
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
  const statusInfo = {
    'not-started': { label: 'Pending', color: 'slate', icon: Wifi },
    'in-progress': { label: 'In Progress', color: 'amber', icon: Sun },
    'done': { label: 'Inspected', color: 'emerald', icon: CheckCircle2 },
    'flagged': { label: 'Issue Found', color: 'rose', icon: AlertCircle }
  }[status];

  const statusStyles = {
    emerald: "bg-gradient-to-br from-emerald-50/90 to-emerald-100/50 border-emerald-200 text-emerald-900 shadow-emerald-100/20",
    amber: "bg-gradient-to-br from-amber-50/90 to-amber-100/50 border-amber-200 text-amber-900 shadow-amber-100/20",
    rose: "bg-gradient-to-br from-rose-50/90 to-rose-100/50 border-rose-200 text-rose-900 shadow-rose-100/20",
    slate: "bg-gradient-to-br from-rose-50/70 to-rose-100/40 border-rose-100 text-rose-900 hover:border-rose-300 hover:shadow-rose-100/30"
  }[statusInfo.color];

  const iconBgStyles = {
    emerald: "bg-emerald-500 text-white shadow-emerald-200",
    amber: "bg-amber-500 text-white shadow-amber-200",
    rose: "bg-rose-500 text-white shadow-rose-200",
    slate: "bg-rose-400 text-white shadow-rose-100"
  }[statusInfo.color];

  const badgeStyles = {
    emerald: "bg-emerald-100 text-emerald-700 border-emerald-200",
    amber: "bg-amber-100 text-amber-700 border-amber-200",
    rose: "bg-rose-100 text-rose-700 border-rose-200",
    slate: "bg-rose-100/80 text-rose-700 border-rose-200"
  }[statusInfo.color];

  const href = status === 'done' ? `/inspection/report?room=${number}` : `/inspection?room=${number}`;

  return (
    <Link href={href} className={`p-5 md:p-6 rounded-[2rem] border flex items-center justify-between animate-fade-in-up stagger-${(index % 5) + 3} transition-all duration-300 group ${statusStyles} shadow-sm hover:shadow-lg hover:-translate-y-1 active:scale-95`}>
      <div className="flex items-center gap-5 md:gap-6">
        <div className={`w-12 h-12 md:w-14 md:h-14 rounded-2xl md:rounded-3xl flex items-center justify-center transition-all shadow-lg ${iconBgStyles} group-hover:scale-110`}>
          <TypeIcon className="w-6 h-6 md:w-8 md:h-8" />
        </div>
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <h3 className="text-base md:text-xl font-black tracking-tight leading-none uppercase">Room {number}</h3>
          </div>
          <div className="flex items-center gap-2 mt-2">
            <span className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] italic">{type}</span>
            <span className="w-1 h-1 rounded-full bg-slate-300" />
            <div className={`flex items-center gap-1 px-2 py-0.5 rounded-full border text-[8px] font-bold uppercase tracking-wider ${badgeStyles}`}>
              {statusInfo.label}
            </div>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-white/50 flex items-center justify-center text-slate-400 group-hover:text-blue-600 group-hover:bg-white transition-all shadow-sm">
          <ChevronRight size={18} strokeWidth={3} />
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
    { number: "418", type: "Standard", status: "flagged" },
    { number: "420", type: "VIP", status: "done" },
    { number: "422", type: "Standard", status: "in-progress" },
    { number: "425", type: "Standard", status: "done" },
    { number: "428", type: "Standard", status: "not-started" },
    { number: "430", type: "Suite", status: "not-started" },
    { number: "432", type: "VIP", status: "not-started" },
  ] as const;

  const statusOrder = { 'not-started': 0, 'in-progress': 1, 'flagged': 2, 'done': 3 } as const;

  const filteredRooms = rooms
    .filter(room =>
      room.number.toLowerCase().includes(searchQuery.toLowerCase()) ||
      room.type.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .slice()
    .sort((a, b) => statusOrder[a.status] - statusOrder[b.status]);

  return (
    <div className="max-w-[1440px] mx-auto space-y-6 pb-10 px-4 md:px-6">
      
      {/* 1. Progress Centerpiece (Premium Light Gradient Theme) */}
      <section className="bg-gradient-to-br from-[#f8faff] via-[#eef4ff] to-[#f0f4ff] rounded-[2.5rem] p-6 md:p-10 relative overflow-hidden animate-fade-in-up border border-blue-100/50 shadow-xl shadow-blue-500/5">
        {/* Background Decor: Soft Glows */}
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_20%_30%,rgba(59,130,246,0.1)_0,transparent_50%)] pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(circle_at_80%_70%,rgba(37,99,235,0.05)_0,transparent_50%)] pointer-events-none" />
        
        
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
              <p className="text-blue-500 font-bold text-[10px] md:text-sm uppercase tracking-widest">Shift Completion</p>
              <h2 className="text-2xl md:text-4xl font-black text-slate-900 tracking-tight leading-tight">
                You've completed <span className="text-blue-600">64%</span> of your shift!
              </h2>
              <p className="text-slate-500 font-medium text-sm md:text-base">6 of 14 rooms verified. Keep it up!</p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
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
              <Link
                href="/demo"
                className="md:hidden group inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl font-bold text-sm shadow-lg shadow-blue-500/20 hover:from-blue-700 hover:to-indigo-700 active:scale-95 transition-all duration-300 w-full justify-center"
              >
                <FlaskConical size={20} className="group-hover:rotate-[-15deg] transition-transform" />
                <span>Demo Mode</span>
                <div className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center -mr-1">
                  <ChevronRight size={14} />
                </div>
              </Link>
            </div>
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
