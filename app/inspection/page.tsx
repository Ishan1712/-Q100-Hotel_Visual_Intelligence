"use client";

import React, { useState, useEffect, useRef } from 'react';
import { 
  Camera, 
  Video, 
  Grid3X3, 
  X, 
  Check, 
  ChevronRight, 
  Bed, 
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ChevronLeft,
  Circle,
  Play,
  Square,
  AlertCircle,
  RefreshCw,
  FastForward,
  Maximize2,
  Crown,
  Star,
  Search,
  XCircle
} from 'lucide-react';
import Link from 'next/link';

// --- Types & Dummy Data ---

type Phase = 'select' | 'scan' | 'photo' | 'video' | 'report';

interface Room {
  number: string;
  type: 'Standard' | 'Suite' | 'VIP';
  floor: string;
  status: 'not-started' | 'in-progress' | 'done';
}

const rooms: Room[] = [
  { number: "412", type: "Standard", floor: "4", status: "not-started" },
  { number: "415", type: "Suite", floor: "4", status: "not-started" },
  { number: "428", type: "Standard", floor: "4", status: "not-started" },
  { number: "430", type: "Suite", floor: "4", status: "not-started" },
  { number: "432", type: "VIP", floor: "4", status: "not-started" },
];

const checkpoints = [
  { id: 1, name: "Dustbin", icon: "🗑", ref: "Empty dustbin with fresh liner, positioned left of desk" },
  { id: 2, name: "Bed & Pillows", icon: "🛏", ref: "King bed, 4 pillows in diamond pattern, bed runner centred" },
  { id: 3, name: "Bed Linen", icon: "🧺", ref: "Crisp white sheets, hospital corners, no wrinkles visible" },
  { id: 4, name: "Towels (Bathroom)", icon: "🛁", ref: "2 bath towels fan-folded on rack, 2 hand towels on ring, 1 bath mat flat" },
  { id: 5, name: "Towels (Bedroom)", icon: "🏨", ref: "1 folded bathrobe on bed foot, 1 towel swan decoration" },
  { id: 6, name: "Coffee/Tea Tray", icon: "☕", ref: "Kettle, 2 cups on saucers, 4 tea bags, 4 coffee sachets, 4 sugar, 2 milk pods" },
  { id: 7, name: "Minibar / Water Bottles", icon: "🧴", ref: "2 Bisleri 500ml bottles on tray, 1 Coca-Cola, 1 Sprite" },
  { id: 8, name: "Bathroom Amenities", icon: "🧼", ref: "2 wrapped soaps, 1 shampoo, 1 conditioner, 1 lotion, 2 dental kits in arc" },
  { id: 9, name: "TV Remote & Menu Card", icon: "📺", ref: "Remote at 45° on nightstand, menu card propped against lamp base" },
  { id: 10, name: "Curtains & Lighting", icon: "🪟", ref: "Both curtains tied back symmetrically, sheer curtains drawn, both lamps ON" },
  { id: 11, name: "Wardrobe/Closet", icon: "🚪", ref: "6 hangers evenly spaced, 1 laundry bag, 1 shoe mitt, iron + board present" },
  { id: 12, name: "Welcome Items & Stationery", icon: "✉️", ref: "Welcome card centred on desk, pen on notepad, Wi-Fi card beside phone" },
];

export default function InspectionFlowPage() {
  const [phase, setPhase] = useState<Phase>('select');
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [roomSearchQuery, setRoomSearchQuery] = useState("");
  const [isScanning, setIsScanning] = useState(false);
  const [flash, setFlash] = useState(false);
  const [showKeypad, setShowKeypad] = useState(false);
  const [keyValue, setKeyValue] = useState("");
  const [isUnassigned, setIsUnassigned] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [results, setResults] = useState<Record<number, 'pass' | 'fail' | 'skip' | null>>({});
  const [comparing, setComparing] = useState(false);
  const [showFailureDetail, setShowFailureDetail] = useState(false);
  const [videoTimer, setVideoTimer] = useState(0);
  const [captureStrip, setCaptureStrip] = useState<{ id: number; status: 'pass' | 'fail' | 'unknown' }[]>([]);
  const videoInterval = useRef<NodeJS.Timeout | null>(null);

  // --- Handlers ---

  const handleScanCapture = React.useCallback((roomNum: string) => {
    setFlash(true);
    if (typeof window !== 'undefined' && 'vibrate' in navigator) navigator.vibrate(100);
    setTimeout(() => {
      setFlash(false);
      setIsScanning(false);
      if (roomNum !== selectedRoom?.number && roomNum === "101") {
        setIsUnassigned(true);
      }
    }, 500);
  }, [selectedRoom]);

  const handlePhotoModeCapture = React.useCallback(() => {
    setComparing(true);
    setTimeout(() => {
      setComparing(false);
      const isFail = checkpoints[currentStep].id === 4 || checkpoints[currentStep].id === 6 || checkpoints[currentStep].id === 8;
      
      if (isFail) {
        setResults(prev => ({ ...prev, [checkpoints[currentStep].id]: 'fail' }));
        setShowFailureDetail(true);
      } else {
        setResults(prev => ({ ...prev, [checkpoints[currentStep].id]: 'pass' }));
        setTimeout(() => {
          if (currentStep < checkpoints.length - 1) {
            setCurrentStep(prev => prev + 1);
          } else {
            setPhase('report');
          }
        }, 1500);
      }
    }, 1200);
  }, [currentStep, checkpoints]);

  const triggerVideoCapture = React.useCallback((id: number, status: 'pass' | 'fail') => {
    setFlash(true);
    setTimeout(() => setFlash(false), 200);
    if (typeof window !== 'undefined' && 'vibrate' in navigator) navigator.vibrate(50);
    setCaptureStrip(prev => [...prev, { id, status }]);
  }, []);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  // --- Effects ---

  useEffect(() => {
    if (phase === 'scan' && isScanning && !showKeypad) {
      const timer = setTimeout(() => {
        handleScanCapture(selectedRoom?.number || "428");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [phase, isScanning, showKeypad, selectedRoom, handleScanCapture]);

  useEffect(() => {
    if (phase === 'video') {
      videoInterval.current = setInterval(() => {
        setVideoTimer(prev => prev + 1);
      }, 1000);
      
      const captureTimers = [
        { time: 4, id: 1, status: 'pass' },
        { time: 12, id: 2, status: 'pass' },
        { time: 26, id: 4, status: 'fail' },
      ].map(c => {
        return setTimeout(() => {
          triggerVideoCapture(c.id, c.status as any);
        }, c.time * 1000);
      });

      return () => {
        if (videoInterval.current) clearInterval(videoInterval.current);
        captureTimers.forEach(t => clearTimeout(t));
      };
    }
  }, [phase, triggerVideoCapture]);

  // --- Render Sections ---

  const renderRoomSelection = () => (
    <div className="p-6 space-y-6 animate-fade-in h-full overflow-y-auto no-scrollbar bg-slate-50 rounded-3xl">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Unit Inspection</h1>
          <p className="text-slate-400 font-semibold uppercase tracking-widest text-[9px]">Floor 4 • Active Worklist</p>
        </div>

        <div className="relative group min-w-[320px]">
           <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={18} />
           <input 
              type="text" 
              placeholder="Search by Room ID..." 
              value={roomSearchQuery}
              onChange={(e) => setRoomSearchQuery(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-2xl py-3 pl-12 pr-10 outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500/50 transition-all text-sm font-medium shadow-sm"
           />
           {roomSearchQuery && (
             <button 
               onClick={() => setRoomSearchQuery("")}
               className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-500 transition-colors"
             >
               <XCircle size={18} />
             </button>
           )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 pb-10 items-start">
        {rooms.filter(r => r.number.toLowerCase().includes(roomSearchQuery.toLowerCase()) || r.type.toLowerCase().includes(roomSearchQuery.toLowerCase())).map((room) => {
          const Icon = room.type === 'Suite' ? Crown : room.type === 'VIP' ? Star : Bed;
          const styles = {
            Standard: "border-blue-100 bg-blue-50/10 text-blue-600 hover:border-blue-500/30 shadow-blue-200/20",
            Suite: "border-indigo-100 bg-indigo-50/10 text-indigo-600 hover:border-indigo-500/30 shadow-indigo-200/20",
            VIP: "border-amber-100 bg-amber-50/10 text-amber-600 hover:border-amber-500/30 shadow-amber-200/20",
          }[room.type] || "border-slate-100 bg-white text-blue-600 shadow-slate-200/20";

          const accentStyles = {
            Standard: "bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white",
            Suite: "bg-indigo-50 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white",
            VIP: "bg-amber-50 text-amber-600 group-hover:bg-amber-600 group-hover:text-white",
          }[room.type] || "bg-blue-50 text-blue-600";
          
          return (
            <button 
              key={room.number}
              onClick={() => { setSelectedRoom(room); setPhase('scan'); setIsScanning(true); }}
              className={`group border p-5 rounded-3xl transition-all text-left shadow-lg hover:scale-[1.01] active:scale-95 bg-white ${styles}`}
            >
              <div className="flex justify-between items-start mb-4">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300 ${accentStyles}`}>
                  <Icon size={24} />
                </div>
                <div className={`px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest ${accentStyles}`}>
                  {room.type}
                </div>
              </div>
              <h3 className="text-xl font-bold text-slate-900 tracking-tight">Room {room.number}</h3>
              <div className="flex items-center gap-2 mt-2">
                <div className={`w-1.5 h-1.5 rounded-full transition-colors ${
                  room.type === 'Standard' ? "bg-blue-200 group-hover:bg-blue-400" :
                  room.type === 'Suite' ? "bg-indigo-200 group-hover:bg-indigo-400" :
                  "bg-amber-200 group-hover:bg-amber-400"
                }`} />
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Awaiting Inspection</span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );

  const renderScanScreen = () => (
    <div className="relative h-full animate-fade-in flex flex-col bg-white rounded-3xl overflow-hidden">
       {/* Camera Viewfinder */}
       <div className="flex-1 relative overflow-hidden bg-slate-950">
          <div className="absolute inset-x-0 top-8 text-center z-10">
             <p className="text-white/60 font-semibold tracking-widest uppercase text-[9px] bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full inline-block border border-white/10">Align room plate with frame</p>
          </div>

          <div className="absolute inset-0 flex items-center justify-center">
             <div className="w-40 h-28 bg-white rounded flex items-center justify-center border-4 border-slate-200 shadow-2xl translate-y-[-10%]">
                <span className="text-5xl font-bold text-slate-800 tracking-tight italic">{selectedRoom?.number}</span>
             </div>

             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-48 pointer-events-none">
                <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-white rounded-tl-2xl animate-pulse" />
                <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-white rounded-tr-2xl animate-pulse" />
                <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-white rounded-bl-2xl animate-pulse" />
                <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-white rounded-br-2xl animate-pulse" />
                <div className="absolute top-0 left-6 right-6 h-[1.5px] bg-blue-400 shadow-[0_0_15px_#60a5fa] animate-scan-line" />
             </div>
          </div>

          <button 
            onClick={() => setShowKeypad(true)}
            className="absolute bottom-8 left-1/2 -translate-x-1/2 w-16 h-16 bg-white/10 backdrop-blur-2xl border border-white/20 rounded-full flex flex-col items-center justify-center text-white hover:bg-white/20 transition-all active:scale-95 z-20"
          >
            <Grid3X3 size={24} />
            <span className="text-[8px] font-bold uppercase tracking-widest mt-1">Manual</span>
          </button>
       </div>

       {/* Confirm UI */}
       {!isScanning && (
         <div className="absolute inset-x-0 bottom-0 z-30 animate-slide-up-card p-4">
            <div className="bg-white rounded-[2rem] p-6 shadow-2xl border border-slate-100">
               <div className="w-10 h-1 bg-slate-100 rounded-full mx-auto mb-6" />
               <div className="flex items-start justify-between mb-6 px-2">
                  <div>
                    <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Room {selectedRoom?.number}</h2>
                    <div className="flex items-center gap-2 mt-2">
                       <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest inline-flex items-center gap-1.5">
                          <Bed size={12} /> {selectedRoom?.type}
                       </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-emerald-500 font-bold text-xl flex items-center justify-end gap-1">
                       <CheckCircle2 size={20} /> 12 Items
                    </div>
                  </div>
               </div>

               <div className="grid grid-cols-2 gap-4">
                  <button 
                    onClick={() => setPhase('photo')}
                    className="h-28 bg-slate-900 text-white rounded-3xl flex flex-col items-center justify-center gap-2 hover:bg-slate-800 transition-all group shadow-lg"
                  >
                    <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform">
                       <Camera size={24} />
                    </div>
                    <span className="font-bold text-xs uppercase tracking-widest">Photo Mode</span>
                  </button>
                  <button 
                    onClick={() => setPhase('video')}
                    className="h-28 bg-blue-600 text-white rounded-3xl flex flex-col items-center justify-center gap-2 hover:bg-blue-500 transition-all group shadow-lg shadow-blue-600/20"
                  >
                    <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform">
                       <Video size={24} />
                    </div>
                    <span className="font-bold text-xs uppercase tracking-widest">Video Mode</span>
                  </button>
               </div>
            </div>
         </div>
       )}
    </div>
  );

  const renderPhotoMode = () => {
    const cp = checkpoints[currentStep];
    if (!cp) return null;
    const itemStatus = results[cp.id];

    return (
      <div className="relative h-full animate-fade-in flex flex-col bg-slate-50 rounded-3xl overflow-hidden">
        {/* Header: Guided Checkpoint */}
        <div className="p-4 bg-white border-b border-slate-100 flex flex-col items-center gap-3 z-20">
           <div className="flex items-center gap-3">
              <span className="text-3xl">{cp.icon}</span>
              <div className="flex flex-col">
                 <h2 className="text-lg font-bold text-slate-900 tracking-tight leading-none">{cp.name}</h2>
                 <span className="text-[8px] font-bold text-blue-600 uppercase tracking-widest mt-1">Item {currentStep + 1} of 12</span>
              </div>
           </div>
           {/* Progress Tracker */}
           <div className="flex gap-2">
              {checkpoints.map((step, idx) => (
                <button 
                  key={step.id} 
                  onClick={() => setCurrentStep(idx)}
                  className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                    idx === currentStep ? "bg-blue-600 scale-110 ring-2 ring-blue-600/20" : 
                    results[step.id] === 'pass' ? "bg-emerald-500" :
                    results[step.id] === 'fail' ? "bg-rose-500" : "bg-slate-200"
                  }`}
                />
              ))}
           </div>
        </div>

        {/* Split View */}
        <div className="flex-1 flex flex-col p-3 gap-3">
           <div className="flex-1 relative overflow-hidden bg-white rounded-2xl border border-slate-100 shadow-sm">
              <div className="absolute inset-0 bg-slate-50/50 flex items-center justify-center">
                 <span className="text-8xl opacity-5">{cp.icon}</span>
              </div>
              <div className="absolute top-4 left-4 flex flex-col gap-2">
                 <div className="bg-emerald-500 text-white px-3 py-1 rounded-full flex items-center gap-1.5 shadow-md">
                    <CheckCircle2 size={12} />
                    <span className="text-[8px] font-bold uppercase tracking-widest">Master</span>
                 </div>
                 <p className="max-w-[200px] bg-white/95 p-3 rounded-2xl shadow-lg border border-slate-100 text-[10px] font-medium text-slate-700 leading-relaxed italic">
                    "{cp.ref}"
                 </p>
              </div>
           </div>

           <div className="flex-1 relative bg-slate-950 rounded-2xl overflow-hidden">
              <div className="absolute inset-0 flex items-center justify-center opacity-20 pointer-events-none">
                 <div className="w-[80%] h-[70%] border-2 border-blue-400/20 border-dashed rounded-[2rem] animate-pulse flex items-center justify-center">
                    <span className="text-9xl text-blue-400/5">{cp.icon}</span>
                 </div>
              </div>

              {!comparing && !showFailureDetail && (
                <button 
                  onClick={handlePhotoModeCapture}
                  className="absolute bottom-6 left-1/2 -translate-x-1/2 w-16 h-16 bg-white/10 backdrop-blur-2xl border-2 border-white/20 rounded-full p-1.5 group active:scale-95 transition-all z-20"
                >
                  <div className="w-full h-full bg-white rounded-full shadow-2xl" />
                </button>
              )}

              {comparing && (
                <div className="absolute inset-0 bg-white/90 backdrop-blur-md z-50 flex flex-col items-center justify-center gap-4 animate-fade-in">
                   <div className="w-16 h-16 border-4 border-blue-600/10 border-t-blue-600 rounded-full animate-spin" />
                   <h3 className="text-lg font-bold text-slate-900 tracking-tight">Verifying...</h3>
                </div>
              )}

              {itemStatus === 'pass' && !comparing && (
                <div className="absolute inset-0 bg-emerald-500 z-[60] flex flex-col items-center justify-center animate-fade-out pointer-events-none">
                  <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-2xl animate-scale-in">
                    <Check size={48} className="text-emerald-500" strokeWidth={4} />
                  </div>
                  <h2 className="text-2xl font-bold text-white tracking-tight mt-6">PERFECT</h2>
                </div>
              )}
           </div>
        </div>

        {/* Failure Detail Overly */}
        {showFailureDetail && (
          <div className="absolute inset-0 bg-slate-50/98 backdrop-blur-2xl z-[100] p-6 flex flex-col animate-slide-up">
             <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-4">
                   <div className="w-12 h-12 bg-rose-500 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-rose-500/20">
                      <AlertCircle size={24} />
                   </div>
                   <div>
                      <h2 className="text-xl font-bold text-slate-900 tracking-tight leading-none">Issue Detected</h2>
                      <span className="text-[10px] font-bold text-rose-600 uppercase tracking-widest mt-1 block">{cp.name} Needed</span>
                   </div>
                </div>
                <button onClick={() => setShowFailureDetail(false)} className="bg-white p-3 rounded-xl text-slate-300 border border-slate-100"><X size={20} /></button>
             </div>

             <div className="flex-1 grid grid-cols-2 gap-4 mb-6">
                <div className="bg-white rounded-3xl p-4 shadow-sm border border-slate-100 flex flex-col gap-3">
                   <div className="flex-1 bg-slate-50 rounded-2xl flex items-center justify-center relative overflow-hidden">
                      <span className="text-6xl opacity-10">{cp.icon}</span>
                      <div className="absolute top-3 left-3 bg-emerald-500 text-white px-2 py-0.5 rounded-full text-[7px] font-bold uppercase tracking-widest">Master</div>
                   </div>
                </div>
                <div className="bg-white rounded-3xl p-4 shadow-md border-2 border-rose-500/10 flex flex-col gap-3">
                   <div className="flex-1 bg-slate-50 rounded-2xl flex items-center justify-center relative overflow-hidden">
                      <span className="text-6xl opacity-10">{cp.icon}</span>
                      <div className="absolute top-3 left-3 bg-rose-500 text-white px-2 py-0.5 rounded-full text-[7px] font-bold uppercase tracking-widest">Captured</div>
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 border-2 border-rose-500 rounded-full flex items-center justify-center animate-pulse">
                         <div className="w-2 h-2 bg-rose-500 rounded-full" />
                      </div>
                   </div>
                   <div className="bg-rose-50 py-2 rounded-xl text-center border border-rose-100">
                      <p className="text-[9px] text-rose-600 font-bold uppercase tracking-widest">
                         {cp.id === 4 ? "Towel Mismatch" : 
                          cp.id === 6 ? "Missing Sugar" : 
                          cp.id === 8 ? "Dental Kit Missing" : "Discrepancy"}
                      </p>
                   </div>
                </div>
             </div>

             <div className="grid grid-cols-2 gap-4">
                <button onClick={() => setShowFailureDetail(false)} className="h-16 bg-white border border-slate-100 text-slate-900 rounded-2xl font-bold flex items-center justify-center gap-2 shadow-sm hover:shadow-md transition-all active:scale-95">
                   <RefreshCw size={20} className="text-blue-600" />
                   <span className="text-sm">Re-capture</span>
                </button>
                <button 
                  onClick={() => {
                    setShowFailureDetail(false);
                    if (currentStep < checkpoints.length - 1) setCurrentStep(prev => prev + 1);
                    else setPhase('report');
                  }}
                  className="h-16 bg-rose-600 text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-rose-500 shadow-lg shadow-rose-600/10 transition-all active:scale-95"
                >
                   <span className="text-sm">Skip</span>
                   <FastForward size={20} />
                </button>
             </div>
          </div>
        )}
      </div>
    );
  };

  const renderVideoMode = () => (
    <div className="relative h-full animate-fade-in flex flex-col bg-slate-950 rounded-3xl overflow-hidden">
       <div className="flex-1 relative overflow-hidden">
          <div className="absolute inset-0 border-4 border-rose-600/20 animate-pulse pointer-events-none z-10" />
          
          <div className="absolute top-6 left-6 flex items-center gap-3 z-20">
             <div className="px-3 py-1 bg-rose-600 text-white rounded-xl flex items-center gap-2 shadow-xl border border-white/10">
                <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                <span className="font-bold text-[9px] uppercase tracking-widest">REC</span>
             </div>
             <span className="text-2xl font-bold text-white tracking-tight drop-shadow-lg">{formatTime(videoTimer)}</span>
          </div>

          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 text-center">
             <div className="w-20 h-20 bg-white/10 backdrop-blur-3xl border border-white/20 rounded-full flex items-center justify-center shadow-2xl animate-bounce-slow">
                <span className="text-4xl">{checkpoints[captureStrip.length]?.icon || "✅"}</span>
             </div>
             <p className="mt-4 text-white/80 font-bold uppercase tracking-widest text-[8px] bg-black/40 px-3 py-1 rounded-full inline-block backdrop-blur-md">
                Align: {checkpoints[captureStrip.length]?.name || "Complete"}
             </p>
          </div>

          <div className="absolute bottom-28 left-0 right-0 z-20 px-4">
             <div className="bg-white/10 backdrop-blur-2xl border border-white/10 rounded-2xl p-4 shadow-2xl">
                <div className="flex gap-3 overflow-x-auto no-scrollbar">
                   {captureStrip.map((cap, i) => (
                     <div key={i} className="flex-shrink-0 relative">
                        <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center text-3xl border border-white/10">
                           {checkpoints.find(c => c.id === cap.id)?.icon}
                        </div>
                        <div className={`absolute -top-2 -right-2 w-6 h-6 rounded-full flex items-center justify-center shadow-lg border-2 border-slate-900 ${
                           cap.status === 'pass' ? "bg-emerald-500" : "bg-rose-500"
                        }`}>
                           {cap.status === 'pass' ? <Check size={12} className="text-white" strokeWidth={3} /> : <X size={12} className="text-white" strokeWidth={3} />}
                        </div>
                     </div>
                   ))}
                </div>
             </div>
          </div>

          <div className="absolute bottom-8 left-0 right-0 z-20 flex items-center justify-between px-10">
             <div className="flex flex-col">
                <span className="text-[9px] font-bold text-white/50 uppercase tracking-widest">Progress</span>
                <span className="text-2xl font-bold text-white tracking-tight">{captureStrip.length}<span className="text-white/20 mx-1">/</span>12</span>
             </div>
             <button 
               onClick={() => setPhase('report')}
               className="w-16 h-16 bg-white text-slate-900 rounded-full flex items-center justify-center shadow-xl active:scale-90 transition-all hover:bg-rose-50"
             >
                <Square size={24} className="fill-slate-900" />
             </button>
             <div className="w-12 h-1.5 bg-white/10 rounded-full overflow-hidden">
                <div className="h-full bg-blue-500 animate-[progress_30s_linear_infinite]" />
             </div>
          </div>
       </div>
    </div>
  );

  const renderReport = () => (
    <div className="p-6 space-y-8 animate-fade-in h-full overflow-y-auto no-scrollbar bg-white rounded-3xl shadow-2xl">
       <div className="flex justify-between items-center bg-slate-50 p-6 rounded-[2rem] border border-slate-100">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight leading-none italic">Verified</h1>
            <div className="flex items-center gap-2 mt-2">
               <span className="bg-slate-900 text-white px-3 py-1 rounded-lg text-[9px] font-bold uppercase tracking-widest">Room {selectedRoom?.number}</span>
            </div>
          </div>
          <Link href="/" className="bg-blue-600 text-white h-14 px-8 rounded-2xl font-bold text-base flex items-center gap-3 shadow-lg hover:bg-blue-700 hover:scale-105 transition-all">
             Submit
             <ArrowRight size={20} />
          </Link>
       </div>

       <div className="grid grid-cols-3 gap-4">
          <div className="bg-white p-5 rounded-3xl shadow-sm border border-slate-100 text-center">
             <span className="text-3xl font-bold text-slate-900 tracking-tight">75%</span>
             <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mt-1">Score</p>
          </div>
          <div className="bg-white p-5 rounded-3xl shadow-sm border border-slate-100 text-center">
             <span className="text-3xl font-bold text-slate-900 tracking-tight">9/12</span>
             <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mt-1">Passed</p>
          </div>
          <div className="bg-white p-5 rounded-3xl shadow-sm border border-slate-100 text-center">
             <span className="text-3xl font-bold text-rose-600 tracking-tight">3</span>
             <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mt-1">Flagged</p>
          </div>
       </div>

       <div className="space-y-4 pb-8">
          <h3 className="text-[9px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-2">Results</h3>
          <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
             {checkpoints.map((cp) => {
               const status = results[cp.id] || (captureStrip.find(c => c.id === cp.id)?.status);
               return (
                 <div key={cp.id} className="bg-white p-3 rounded-2xl border border-slate-100 shadow-sm flex flex-col items-center gap-2 hover:shadow-md transition-all">
                    <span className="text-3xl">{cp.icon}</span>
                    <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest text-center truncate w-full">{cp.name}</span>
                    <div className={`w-full py-1 rounded-lg text-[7px] font-bold uppercase tracking-widest text-center ${
                      status === 'pass' ? "bg-emerald-50 text-emerald-600" :
                      status === 'fail' ? "bg-rose-50 text-rose-600" : "bg-slate-50 text-slate-300"
                    }`}>
                      {status || "Queued"}
                    </div>
                 </div>
               );
             })}
          </div>
       </div>
    </div>
  );

  return (
    <div className="relative w-full h-[calc(100vh-10rem)] min-h-[600px] bg-slate-50 rounded-3xl overflow-hidden shadow-2xl font-sans border border-slate-100">
       
       {phase === 'select' && renderRoomSelection()}
       {phase === 'scan' && renderScanScreen()}
       {phase === 'photo' && renderPhotoMode()}
       {phase === 'video' && renderVideoMode()}
       {phase === 'report' && renderReport()}

       {flash && <div className="absolute inset-0 bg-emerald-500 z-[200] animate-fade-out" />}

       {showKeypad && (
         <div className="absolute inset-0 bg-white/95 backdrop-blur-3xl z-[300] flex flex-col justify-end animate-fade-in p-6">
            <div className="max-w-xs mx-auto w-full pb-6">
               <div className="flex justify-between items-center mb-6 px-2">
                  <h2 className="text-xl font-bold text-slate-900 tracking-tight italic">Manual Entry</h2>
                  <button onClick={() => setShowKeypad(false)} className="bg-slate-100 p-3 rounded-xl text-slate-400 hover:text-slate-900"><X size={24} /></button>
               </div>
               <div className="bg-slate-50 border border-slate-200 rounded-3xl p-6 mb-6 text-center shadow-inner">
                  <span className="text-4xl font-bold text-slate-900 tracking-[0.2em] italic">{keyValue || "____"}</span>
               </div>
               <div className="grid grid-cols-3 gap-3">
                  {[1,2,3,4,5,6,7,8,9,"C",0,"OK"].map(d => (
                    <button 
                      key={d} 
                      onClick={() => {
                        if (d === 'C') setKeyValue("");
                        else if (d === 'OK') { handleScanCapture(keyValue); setKeyValue(""); setShowKeypad(false); }
                        else if (keyValue.length < 4) setKeyValue(prev => prev + d);
                      }}
                      className={`h-16 rounded-2xl text-xl font-bold transition-all active:scale-95 ${
                        d === 'OK' ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20" : 
                        d === 'C' ? "bg-rose-50 text-rose-500" : "bg-white text-slate-900 border border-slate-100 shadow-sm"
                      }`}
                    >
                      {d}
                    </button>
                  ))}
               </div>
            </div>
         </div>
       )}

       <style jsx global>{`
         @keyframes scanLine {
           0% { top: 0; opacity: 0; }
           10% { opacity: 1; }
           90% { opacity: 1; }
           100% { top: 100%; opacity: 0; }
         }
         .animate-scan-line { animation: scanLine 2.5s linear infinite; }
         
         @keyframes fadeOut {
           0% { opacity: 1; }
           100% { opacity: 0; }
         }
         .animate-fade-out { animation: fadeOut 0.6s ease-out forwards; }

         @keyframes slideUp {
           from { transform: translateY(100px); opacity: 0; }
           to { transform: translateY(0); opacity: 1; }
         }
         .animate-slide-up { animation: slideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards; }

         @keyframes slideUpCard {
           from { transform: translateY(100%); }
           to { transform: translateY(0); }
         }
         .animate-slide-up-card { animation: slideUpCard 0.8s cubic-bezier(0.19, 1, 0.22, 1) forwards; }

         @keyframes bounceSlow {
           0%, 100% { transform: translateY(0) scale(1); }
           50% { transform: translateY(-8px) scale(1.02); }
         }
         .animate-bounce-slow { animation: bounceSlow 4s ease-in-out infinite; }

         @keyframes scaleIn {
            from { transform: scale(0.9); opacity: 0; }
            to { transform: scale(1); opacity: 1; }
         }
         .animate-scale-in { animation: scaleIn 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.2) forwards; }

         .no-scrollbar::-webkit-scrollbar { display: none; }
         .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
       `}</style>
    </div>
  );
}
