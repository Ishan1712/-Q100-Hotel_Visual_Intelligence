"use client";

import React, { useState, useEffect } from 'react';
import { 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  Camera, 
  RefreshCw, 
  Flag, 
  ChevronRight, 
  ClipboardCheck,
  User,
  Clock,
  Video,
  ExternalLink,
  ArrowLeft,
  ArrowRight,
  Maximize2,
  Plus,
  LayoutGrid,
  Search
} from 'lucide-react';
import Link from 'next/link';

// --- Types ---
interface Checkpoint {
  id: number;
  name: string;
  status: 'pass' | 'fail' | 'flagged';
  detail?: string;
  icon: string;
  fixHint?: string;
}

// --- Dummy Data ---
const initialCheckpoints: Checkpoint[] = [
  { id: 1, name: "Dustbin", status: 'pass', icon: "🗑️" },
  { id: 2, name: "Bed & Pillows", status: 'pass', icon: "🛏️" },
  { id: 3, name: "Bed Linen", status: 'pass', icon: "🛌" },
  { id: 4, name: "Towels (Bathroom)", status: 'fail', icon: "🛀", detail: "Flat fold detected; Master requires fan fold.", fixHint: "fan-fold" },
  { id: 5, name: "Towels (Bedroom)", status: 'pass', icon: "🧺" },
  { id: 6, name: "Coffee/Tea Tray", status: 'fail', icon: "☕", detail: "2 sugar packets present; Master requires 4.", fixHint: "add-sugar" },
  { id: 7, name: "Minibar / Water", status: 'pass', icon: "🧊" },
  { id: 8, name: "Bathroom Amenities", status: 'fail', icon: "🧴", detail: "1 dental kit missing from the 6-item arc.", fixHint: "add-dental" },
  { id: 9, name: "TV Remote & Menu Card", status: 'pass', icon: "📺" },
  { id: 10, name: "Curtains & Lighting", status: 'pass', icon: "💡" },
  { id: 11, name: "Wardrobe/Closet", status: 'pass', icon: "👕" },
  { id: 12, name: "Welcome Items", status: 'pass', icon: "🎁" },
];

const reportRooms = [
  { number: "428", type: "Standard Double", floor: "4", status: "needs_fix", issues: 3, time: "10:22 AM" },
  { number: "412", type: "Standard", floor: "4", status: "ready", issues: 0, time: "09:45 AM" },
  { number: "415", type: "Suite", floor: "4", status: "ready", issues: 0, time: "10:05 AM" },
  { number: "430", type: "Suite", floor: "4", status: "needs_fix", issues: 1, time: "11:15 AM" },
  { number: "432", type: "VIP", floor: "4", status: "needs_fix", issues: 4, time: "11:45 AM" },
];

const checkpointImages: Record<string, string> = {
  "Dustbin": "/images/report/dustbin.png",
  "Bed & Pillows": "/images/report/bed.png",
  "Bed Linen": "/images/report/linen.png",
  "Towels (Bathroom)": "/images/report/towels.png",
  "Towels (Bedroom)": "/images/report/towels.png",
  "Coffee/Tea Tray": "/images/report/tea_tray.png",
  "Minibar / Water": "/images/report/minibar.png",
  "Bathroom Amenities": "/images/report/amenities.png",
  "TV Remote & Menu Card": "/images/report/tv_remote.png",
  "Curtains & Lighting": "/images/report/curtains.png",
  "Wardrobe/Closet": "/images/report/wardrobe.png",
  "Welcome Items": "/images/report/welcome.png",
};

export default function InspectionReportPage() {
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null);
  const [reportSearchQuery, setReportSearchQuery] = useState("");
  const [checkpoints, setCheckpoints] = useState<Checkpoint[]>(initialCheckpoints);
  const [fixingId, setFixingId] = useState<number | null>(null);
  const [isFinishing, setIsFinishing] = useState(false);
  const [flash, setFlash] = useState(false);

  // If no room is selected, show the selection list
  if (!selectedRoom) {
    return (
      <div className="max-w-[1440px] mx-auto space-y-6 animate-fade-in px-4">
        {/* Header Card — Title + Search */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white p-5 rounded-2xl border border-slate-200 shadow-2xl shadow-slate-300">
           <div className="space-y-0.5">
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">Inspection Reports</h1>
              <p className="text-slate-400 font-medium text-xs">Select a room to view its detailed AI inspection report and resolve any issues.</p>
           </div>
           
           <div className="relative group flex-1 max-w-md">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={16} />
              <input 
                 type="text" 
                 placeholder="Search by Room ID..." 
                 value={reportSearchQuery}
                 onChange={(e) => setReportSearchQuery(e.target.value)}
                 className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-2.5 pl-12 pr-10 outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500/50 transition-all text-sm font-medium shadow-inner"
              />
              {reportSearchQuery && (
                <button 
                  onClick={() => setReportSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-500 transition-colors"
                >
                  <XCircle size={18} />
                </button>
              )}
           </div>
        </header>

        {/* Room Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-start">
           {reportRooms.filter(r => r.number.toLowerCase().includes(reportSearchQuery.toLowerCase()) || r.type.toLowerCase().includes(reportSearchQuery.toLowerCase())).map((room) => {
             const isReady = room.status === 'ready';
             return (
               <button
                 key={room.number}
                 onClick={() => setSelectedRoom(room.number)}
                 className={`group p-5 rounded-2xl border transition-all duration-300 cursor-pointer text-left relative overflow-hidden shadow-2xl hover:scale-[1.02] active:scale-95 ${
                   isReady
                     ? 'bg-emerald-50/50 border-emerald-200 hover:border-emerald-300'
                     : 'bg-amber-50/50 border-amber-200 hover:border-amber-300'
                 }`}
               >

                 <div className="flex justify-between items-start mb-5">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-500 shadow-sm ${
                      isReady
                        ? 'bg-white text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white'
                        : 'bg-white text-amber-600 group-hover:bg-amber-600 group-hover:text-white'
                    }`}>
                       <LayoutGrid size={24} />
                    </div>
                    <div className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest shadow-sm ${
                      isReady ? 'bg-emerald-600/10 text-emerald-700' : 'bg-amber-600/10 text-amber-700'
                    }`}>
                      {isReady ? 'Room Ready' : `${room.issues} Issues`}
                    </div>
                 </div>

                 <div className="space-y-0.5">
                    <h3 className="text-2xl font-black text-slate-900 tracking-tight">Room {room.number}</h3>
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{room.type} • Floor {room.floor}</p>
                 </div>

                 <div className="mt-5 pt-4 border-t border-slate-200/50 flex justify-between items-center">
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{room.time}</span>
                    <div className="flex items-center gap-1 text-[9px] font-black text-blue-600 uppercase tracking-widest group-hover:gap-2 transition-all">
                       <span>View Report</span>
                       <ChevronRight size={14} />
                    </div>
                 </div>
               </button>
             );
           })}
        </div>
      </div>
    );
  }

  // Statistics
  const passedCount = checkpoints.filter(c => c.status === 'pass' || c.status === 'flagged').length;
  const totalCount = checkpoints.length;
  const failedCount = checkpoints.filter(c => c.status === 'fail').length;
  const isComplete = passedCount === totalCount;

  // Handlers
  const handleFix = (id: number) => {
    setFixingId(id);
  };

  const handleCaptureResult = () => {
    setFlash(true);
    setTimeout(() => {
      setFlash(false);
      setCheckpoints(prev => prev.map(c => 
        c.id === fixingId ? { ...c, status: 'pass' } : c
      ));
      setFixingId(null);
    }, 1500);
  };

  const handleFlag = (id: number) => {
    setCheckpoints(prev => prev.map(c => 
      c.id === id ? { ...c, status: 'flagged' } : c
    ));
  };

  return (
    <div className="max-w-[1440px] mx-auto space-y-6 animate-fade-in pb-20 px-4">
      
      {/* 1. Header Section */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-100 shadow-sm shadow-slate-200/40">
        <div className="flex items-start gap-4">
          <button 
            onClick={() => setSelectedRoom(null)}
            className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-slate-100 hover:text-slate-900 transition-all mt-1"
          >
            <ArrowLeft size={20} />
          </button>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Room {selectedRoom}</h1>
              <span className="px-2 py-0.5 bg-slate-50 text-slate-500 rounded-md text-[10px] font-bold uppercase tracking-wider border border-slate-100 italic">Standard Double</span>
            </div>
            <div className="flex items-center gap-4 text-xs font-semibold text-slate-400">
              <div className="flex items-center gap-1.5">
                <User size={14} className="text-slate-300" />
                <span>Priya S.</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock size={14} className="text-slate-300" />
                <span>10:22 AM - 10:27 AM</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Camera size={14} className="text-blue-500" />
                <span className="text-blue-600">Camera Mode</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="text-right">
             <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Compliance Score</p>
             <p className="text-2xl font-bold text-slate-900 leading-none">{Math.round((passedCount / totalCount) * 100)}%</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-slate-900 text-white flex items-center justify-center font-bold text-lg">
             A+
          </div>
        </div>
      </header>

      {/* 2. Status Banner */}
      <section className={`w-full p-6 rounded-3xl border transition-all duration-500 flex items-center justify-between ${
        isComplete 
          ? 'bg-emerald-50 border-emerald-100 text-emerald-900 shadow-lg shadow-emerald-500/10' 
          : failedCount > 0 
            ? 'bg-amber-50 border-amber-100 text-amber-900 shadow-lg shadow-amber-500/10' 
            : 'bg-blue-50 border-blue-100 text-blue-900 shadow-lg shadow-blue-500/10'
      }`}>
        <div className="flex items-center gap-4">
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all animate-pulse ${
            isComplete ? 'bg-emerald-500 text-white' : 'bg-amber-500 text-white'
          }`}>
            {isComplete ? <ClipboardCheck size={28} /> : <AlertCircle size={28} />}
          </div>
          <div>
            <h2 className="text-xl font-bold tracking-tight">
              {isComplete ? "Room Ready — Inspection Complete" : `${failedCount} of 12 Items Need Attention`}
            </h2>
            <p className="text-sm font-semibold opacity-60">
              {isComplete ? "Room is verified and marked ready for occupancy." : "Correct visual discrepancies to finalize the report."}
            </p>
          </div>
        </div>
        
        {isComplete && (
          <Link href="/" className="px-6 py-3 bg-emerald-600 text-white rounded-2xl font-bold text-sm shadow-lg shadow-emerald-600/30 hover:scale-105 active:scale-95 transition-all flex items-center gap-2">
            <span>Next Room</span>
            <ArrowRight size={18} />
          </Link>
        )}
      </section>

      {/* 3. Component Checklist Grid */}
      <div className="space-y-4 pb-10">
        {checkpoints.map((cp) => {
          const isFailed = cp.status === 'fail';
          const isFlagged = cp.status === 'flagged';
          
          return (
            <div 
              key={cp.id}
              className={`bg-white rounded-3xl border transition-all duration-300 overflow-hidden ${
                isFailed 
                  ? 'border-rose-100 shadow-lg shadow-rose-200/20 ring-1 ring-rose-50' 
                  : isFlagged 
                    ? 'border-blue-100 shadow-lg shadow-blue-200/10'
                    : 'border-slate-50 hover:border-slate-200'
              }`}
            >
              <div className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-6">
                {/* Left: Info */}
                <div className="flex items-center gap-4 min-w-[180px]">
                  <div className={`w-12 h-12 rounded-2xl flex flex-col items-center justify-center transition-all ${
                    isFailed ? 'bg-rose-50 text-rose-600' : isFlagged ? 'bg-blue-50 text-blue-600' : 'bg-slate-50 text-slate-400'
                  }`}>
                    <span className="text-xl">{cp.icon}</span>
                    <span className="text-[7px] font-bold uppercase tracking-[0.05em] leading-tight text-center mt-1">{cp.name.split(' ')[0]}</span>
                  </div>
                  <div className="space-y-0.5">
                    <h3 className="text-sm font-bold text-slate-800 tracking-tight leading-none">{cp.name}</h3>
                    <p className={`text-[10px] font-bold uppercase tracking-widest ${
                      isFailed ? 'text-rose-500' : isFlagged ? 'text-blue-500' : 'text-emerald-500'
                    }`}>
                      {cp.status === 'pass' ? 'Verified Match' : isFlagged ? 'Pending Review' : 'Discrepancy Found'}
                    </p>
                  </div>
                </div>

                {/* Center: Thumbnail Pair */}
                <div className="flex items-center gap-2">
                   {/* Master */}
                   <div className="relative group overflow-hidden rounded-xl border-2 border-amber-200/50">
                      <div className="w-16 h-12 bg-slate-900 overflow-hidden flex items-center justify-center">
                         <img src={checkpointImages[cp.name] || checkpointImages["Dustbin"]} alt="Master" className="w-full h-full object-cover shadow-inner" />
                         <div className="absolute inset-0 bg-amber-500/10 flex items-center justify-center">
                            <span className="text-[7px] font-bold text-amber-600 bg-white/90 px-1 py-0.5 rounded shadow-sm scale-75">MASTER</span>
                         </div>
                      </div>
                   </div>
                   
                   <ArrowRight size={14} className="text-slate-200" />

                   {/* Captured */}
                   <div className={`relative group overflow-hidden rounded-xl border-2 transition-all ${
                     isFailed ? 'border-rose-400 shadow-md shadow-rose-200/40' : 'border-emerald-400'
                   }`}>
                      <div className="w-16 h-12 bg-slate-900 overflow-hidden flex items-center justify-center">
                         <img src={checkpointImages[cp.name] || checkpointImages["Dustbin"]} alt="Captured" className="w-full h-full object-cover" />
                         {isFailed && <div className="absolute top-1 right-1 w-2.5 h-2.5 bg-rose-500 rounded-full animate-ping" />}
                      </div>
                   </div>
                </div>

                {/* Right: Status Icon & Actions */}
                <div className="flex items-center gap-4 ml-auto">
                    {!isFailed && !isFlagged ? (
                      <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-500 flex items-center justify-center border border-emerald-100">
                        <CheckCircle2 size={22} />
                      </div>
                    ) : isFlagged ? (
                      <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center border border-blue-100">
                        <Flag size={20} className="fill-blue-500/10" />
                      </div>
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-rose-50 text-rose-500 flex items-center justify-center border border-rose-100">
                        <XCircle size={22} />
                      </div>
                    )}
                    
                    {isFailed && (
                      <button 
                        onClick={() => handleFix(cp.id)}
                        className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-xl text-[10px] font-bold uppercase tracking-wider hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/10"
                      >
                         <Camera size={14} className="mr-1" />
                         Fix & Re-capture
                      </button>
                    )}

                    <button 
                      onClick={() => handleFlag(cp.id)}
                      className={`p-2.5 rounded-xl transition-all ${
                        isFlagged ? 'bg-blue-600 text-white' : 'bg-slate-50 text-slate-300 hover:text-slate-900'
                      }`}
                      title="Flag as Incorrect"
                    >
                      <Flag size={18} />
                    </button>
                </div>
              </div>

              {/* Expansion Area for Failed Items */}
              {isFailed && (
                <div className="px-5 pb-6 pt-2 border-t border-rose-50 bg-rose-50/20 animate-expand-vertical">
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                      <div className="bg-white rounded-2xl p-3 border border-rose-100 flex flex-col items-center gap-2 relative">
                         <div className="w-full h-40 bg-slate-950 rounded-xl overflow-hidden relative">
                            <img src={checkpointImages[cp.name] || checkpointImages["Dustbin"]} className="w-full h-full object-cover" />
                            {/* Visual divergence highlight */}
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 border-4 border-rose-500 rounded-full animate-pulse-ring" />
                            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-t from-rose-900/40 to-transparent flex items-end p-3">
                               <p className="text-[9px] font-bold text-white uppercase tracking-wider truncate bg-rose-600 px-2 py-1 rounded-lg shadow-lg">{cp.detail}</p>
                            </div>
                         </div>
                         <div className="flex items-center gap-2 mt-1">
                            <div className="w-8 h-8 rounded-lg bg-rose-50 flex items-center justify-center text-rose-500">
                               <Plus size={16} />
                            </div>
                            <span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest leading-none">AI Divergence Found</span>
                         </div>
                      </div>

                      <div className="space-y-4">
                         <div className="p-4 bg-white rounded-2xl border border-slate-100 shadow-sm">
                            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-widest mb-3 flex items-center gap-2">
                               <RefreshCw size={14} className="text-blue-500" />
                               Visual Fix Guide
                            </h4>
                            <div className="flex items-center gap-4">
                               <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 border border-blue-100 shadow-inner">
                                  {cp.icon}
                               </div>
                               <div>
                                  <p className="text-sm font-bold text-slate-800 tracking-tight">Requires Fix: {cp.name}</p>
                                  <p className="text-[10px] font-medium text-slate-400 mt-1 max-w-[240px] leading-relaxed">
                                     Re-arrange this component to match the Master Reference and re-capture using standard Camera Mode.
                                  </p>
                               </div>
                            </div>
                         </div>
                         
                         <div className="flex gap-2">
                           <button className="flex-1 py-3 bg-white border border-slate-200 text-slate-600 rounded-2xl font-bold text-xs hover:bg-slate-50 transition-all flex items-center justify-center gap-2">
                              <Maximize2 size={16} />
                              View Master Detail
                           </button>
                           <button className="flex-1 py-3 bg-white border border-slate-200 text-slate-400 rounded-2xl font-bold text-xs cursor-not-allowed flex items-center justify-center gap-2">
                              Skip (Requires Note)
                           </button>
                         </div>
                      </div>
                   </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* 4. Bottom Progress Bar */}
      <footer className="sticky bottom-0 -mx-4 px-6 md:px-10 py-5 bg-white/90 backdrop-blur-xl border-t border-slate-100 z-40 animate-slide-up shadow-[0_-10px_30px_rgba(0,0,0,0.05)] mt-10">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-10">
           <div className="flex-1 space-y-2">
              <div className="flex justify-between items-end">
                 <p className="text-xs font-bold text-slate-800 uppercase tracking-widest">Inspection Progress</p>
                 <p className="text-[10px] font-black">{passedCount} of 12 ✓ <span className="text-slate-300 mx-1">—</span> {isComplete ? "Completed" : `Fix ${failedCount} remaining items`}</p>
              </div>
              <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden shadow-inner">
                 <div 
                   className={`h-full transition-all duration-1000 ease-out shadow-lg ${isComplete ? 'bg-emerald-500' : 'bg-blue-500 shadow-blue-500/20'}`} 
                   style={{ width: `${(passedCount / totalCount) * 100}%` }} 
                 />
              </div>
           </div>

           <button 
             disabled={!isComplete}
             onClick={() => { setIsFinishing(true); setTimeout(() => window.location.href = "/", 2000); }}
             className={`px-10 py-4 rounded-2xl font-bold text-sm tracking-widest uppercase transition-all flex items-center gap-3 ${
               isComplete 
                 ? 'bg-slate-900 text-white hover:bg-slate-800 hover:scale-105 shadow-xl shadow-slate-900/20 active:scale-95' 
                 : 'bg-slate-100 text-slate-300 cursor-not-allowed'
             }`}
           >
              {isFinishing ? (
                <>
                  <RefreshCw className="animate-spin" size={18} />
                  Saving...
                </>
              ) : (
                <>
                  <ArrowRight size={18} />
                  Complete Inspection
                </>
              )}
           </button>
        </div>
      </footer>

      {/* Fix Recovery UI (Mini-Camera Simulation) */}
      {fixingId && (
        <div className="fixed inset-0 bg-slate-900/90 z-[100] flex items-center justify-center backdrop-blur-sm animate-fade-in">
           <div className={`relative w-[90%] max-w-4xl aspect-video bg-black rounded-3xl overflow-hidden border-4 border-white/20 shadow-2xl transition-all duration-300 ${flash ? 'animate-camera-flash' : ''}`}>
              {/* Viewfinder Overlay */}
              <div className="absolute inset-0 z-10 pointers-events-none">
                 <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 border-2 border-white/30 rounded-3xl" />
                 <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] border border-white/10 rounded-full animate-ping" />
                 
                 {/* Ghost Overlay (Master image) */}
                 <div className="absolute inset-0 opacity-20 transition-opacity">
                    <img src={checkpointImages[checkpoints.find(c => c.id === fixingId)?.name || 'Dustbin'] || checkpointImages["Dustbin"]} className="w-full h-full object-cover" />
                 </div>
              </div>

              {/* Camera Header */}
              <div className="absolute top-0 inset-x-0 p-6 flex justify-between items-center z-20">
                 <div className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-xl border border-white/10 text-white">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-white/60 mb-1">Fixing Discrepancy</p>
                    <p className="text-sm font-bold tracking-tight">Re-capturing: {checkpoints.find(c => c.id === fixingId)?.name}</p>
                 </div>
                 <button 
                   onClick={() => setFixingId(null)}
                   className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors"
                 >
                   <XCircle size={24} />
                 </button>
              </div>

              {/* Camera Controls */}
              <div className="absolute bottom-10 inset-x-0 flex flex-col items-center gap-6 z-20">
                 <div className="px-6 py-3 bg-black/60 backdrop-blur-xl border border-white/10 rounded-2xl text-white text-center">
                    <p className="text-[10px] font-bold uppercase tracking-widest">Alignment Guide Active</p>
                    <p className="text-sm">Align towels with the <span className="text-blue-400 font-bold">Ghost Pattern</span> and capture.</p>
                 </div>
                 <button 
                   onClick={handleCaptureResult}
                   className="w-20 h-20 rounded-full border-4 border-white flex items-center justify-center group hover:scale-105 active:scale-95 transition-all"
                 >
                    <div className="w-16 h-16 rounded-full bg-white group-hover:scale-90 transition-transform" />
                 </button>
              </div>
           </div>
        </div>
      )}

      {/* Global CSS for some advanced animations */}
      <style jsx global>{`
        @keyframes expand-vertical {
          from { height: 0; opacity: 0; }
          to { height: auto; opacity: 1; }
        }
        .animate-expand-vertical {
          animation: expand-vertical 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }
        @keyframes pulse-ring {
          0% { transform: translate(-50%, -50%) scale(0.8); opacity: 0.8; }
          50% { transform: translate(-50%, -50%) scale(1.1); opacity: 0.4; }
          100% { transform: translate(-50%, -50%) scale(0.8); opacity: 0.8; }
        }
        .animate-pulse-ring {
          animation: pulse-ring 2s infinite;
        }
        @keyframes camera-flash {
          0% { filter: brightness(1); }
          50% { filter: brightness(3); }
          100% { filter: brightness(1); }
        }
        .animate-camera-flash {
          animation: camera-flash 0.3s ease-out;
        }
      `}</style>

    </div>
  );
}
