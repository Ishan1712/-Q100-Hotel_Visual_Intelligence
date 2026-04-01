"use client";

import React, { useState, useEffect, useRef, useCallback } from 'react';
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
  XCircle,
  Upload
} from 'lucide-react';
import Link from 'next/link';
import { analyzeWithGPT4v, fileToBase64, masterToBase64, compressImage } from '../lib/comparison';

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
  { id: 1, name: "Dustbin", icon: "\u{1F5D1}", ref: "Empty dustbin with fresh liner, positioned left of desk", masterImg: "/master/01_Dustbin_master.png" },
  { id: 2, name: "Bed & Pillows", icon: "\u{1F6CF}", ref: "King bed, 4 pillows in diamond pattern, bed runner centred", masterImg: "/master/02_Bed_Pillows_master.png" },
  { id: 3, name: "Bed Linen", icon: "\u{1F9FA}", ref: "Crisp white sheets, hospital corners, no wrinkles visible", masterImg: "/master/03_Bed_Linen_master.png" },
  { id: 4, name: "Towels (Bathroom)", icon: "\u{1F6C1}", ref: "2 bath towels fan-folded on rack, 2 hand towels on ring, 1 bath mat flat", masterImg: "/master/04_Towels_Bathroom_master.png" },
  { id: 5, name: "Towels (Bedroom)", icon: "\u{1F3E8}", ref: "1 folded bathrobe on bed foot, 1 towel swan decoration", masterImg: "/master/05_Towels_Bedroom_master.png" },
  { id: 6, name: "Coffee/Tea Tray", icon: "\u2615", ref: "Kettle, 2 cups on saucers, 4 tea bags, 4 coffee sachets, 4 sugar, 2 milk pods", masterImg: "/master/06_Coffee_Tea_Tray_master.png" },
  { id: 7, name: "Minibar / Water Bottles", icon: "\u{1F9F4}", ref: "2 Bisleri 500ml bottles on tray, 1 Coca-Cola, 1 Sprite", masterImg: "/master/07_Minibar_Water_master.png" },
  { id: 8, name: "Bathroom Amenities", icon: "\u{1F9FC}", ref: "2 wrapped soaps, 1 shampoo, 1 conditioner, 1 lotion, 2 dental kits in arc", masterImg: "/master/08_Bathroom_Amenities_master.png" },
  { id: 9, name: "TV Remote & Menu Card", icon: "\u{1F4FA}", ref: "Remote at 45\u00B0 on nightstand, menu card propped against lamp base", masterImg: "/master/09_TV_Remote_Menu_master.png" },
  { id: 10, name: "Curtains & Lighting", icon: "\u{1FA9F}", ref: "Both curtains tied back symmetrically, sheer curtains drawn, both lamps ON", masterImg: "/master/10_Curtains_Lighting_master.png" },
  { id: 11, name: "Wardrobe/Closet", icon: "\u{1F6AA}", ref: "6 hangers evenly spaced, 1 laundry bag, 1 shoe mitt, iron + board present", masterImg: "/master/11_Wardrobe_Closet_master.png" },
  { id: 12, name: "Welcome Items & Stationery", icon: "\u2709\uFE0F", ref: "Welcome card centred on desk, pen on notepad, Wi-Fi card beside phone", masterImg: "/master/12_Welcome_Stationery_master.png" },
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
  const [videoTimer, setVideoTimer] = useState(0);
  const [captureStrip, setCaptureStrip] = useState<{ id: number; status: 'pass' | 'fail' | 'unknown' }[]>([]);
  const videoInterval = useRef<NodeJS.Timeout | null>(null);
  const cameraVideoRef = useRef<HTMLVideoElement | null>(null);
  const cameraStreamRef = useRef<MediaStream | null>(null);
  const [cameraReady, setCameraReady] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [analysisReason, setAnalysisReason] = useState<string | null>(null);

  // --- Helpers (comparison logic imported from lib/comparison.ts) ---

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

  const runAnalysis = React.useCallback(async (insB64: string) => {
    setComparing(true);
    setAnalysisReason(null);
    
    try {
      const cp = checkpoints[currentStep];
      const masB64 = await masterToBase64(cp.masterImg || "");
      
      if (!insB64) {
        throw new Error("No inspection image captured. Please try again.");
      }
      if (!masB64) {
        throw new Error("Reference image not loaded. Please contact support.");
      }

      const result = await analyzeWithGPT4v(insB64, masB64, cp.name, cp.ref);
      
      setComparing(false);
      setAnalysisReason(result.reason);

      if (result.status === 'fail') {
        setResults(prev => ({ ...prev, [cp.id]: 'fail' }));
      } else {
        setResults(prev => ({ ...prev, [cp.id]: 'pass' }));
        setTimeout(() => {
          if (currentStep < checkpoints.length - 1) {
            setCurrentStep(prev => prev + 1);
          } else {
            setPhase('report');
          }
        }, 1500);
      }
    } catch (err: any) {
      setComparing(false);
      setAnalysisReason(err.message || "Error processing image.");
      setResults(prev => ({ ...prev, [checkpoints[currentStep].id]: 'fail' }));
    }
  }, [currentStep, checkpoints]);

  const handlePhotoModeCapture = React.useCallback(async () => {
    let insB64 = "";

    if (uploadedImage) {
      insB64 = await fileToBase64(uploadedImage);
    } else if (cameraVideoRef.current) {
       // Capture from video to canvas
       const canvas = document.createElement("canvas");
       canvas.width = cameraVideoRef.current.videoWidth;
       canvas.height = cameraVideoRef.current.videoHeight;
       const ctx = canvas.getContext("2d");
       ctx?.drawImage(cameraVideoRef.current, 0, 0);
       const dataURL = canvas.toDataURL("image/jpeg", 0.8);
       // Compress to max 1024px
       insB64 = await compressImage(dataURL);
    }

    if (insB64) {
      await runAnalysis(insB64);
    }
  }, [uploadedImage, runAnalysis]);

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

  // --- Camera Effect ---

  useEffect(() => {
    if (phase === 'photo' || phase === 'video') {
      setCameraReady(false);
      setCameraError(null);
      const startCamera = async () => {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } },
            audio: false,
          });
          cameraStreamRef.current = stream;
          if (cameraVideoRef.current) {
            cameraVideoRef.current.srcObject = stream;
            await cameraVideoRef.current.play();
          }
          setCameraReady(true);
        } catch (err: any) {
          console.error('Camera error:', err);
          setCameraError(err?.message || 'Could not access camera');
        }
      };
      startCamera();
    }
    return () => {
      if (cameraStreamRef.current) {
        cameraStreamRef.current.getTracks().forEach(t => t.stop());
        cameraStreamRef.current = null;
        setCameraReady(false);
      }
    };
  }, [phase]);

  // --- Effects ---

  useEffect(() => {
    setUploadedImage(null);
  }, [currentStep, phase]);

  useEffect(() => {
    if (selectedRoom && Object.keys(results).length > 0) {
      localStorage.setItem(`q100_room_results_${selectedRoom.number}`, JSON.stringify(results));
    }
  }, [results, selectedRoom]);

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
    <div className="p-4 md:p-6 space-y-6 md:space-y-8 animate-fade-in h-full overflow-y-auto no-scrollbar bg-[var(--bg-gradient)] rounded-2xl md:rounded-[2rem]">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-0.5">
          <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">
            Unit Inspection
          </h1>
          <p className="text-slate-400 font-bold uppercase tracking-widest text-[8px] md:text-[9px]">
            Floor 4 &bull; Active Worklist
          </p>
        </div>

        <div className="relative group flex-1 max-w-md">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors"
            size={18}
          />
          <input
            type="text"
            placeholder="Search by Room ID..."
            value={roomSearchQuery}
            onChange={(e) => setRoomSearchQuery(e.target.value)}
            className="w-full bg-white border border-slate-200 rounded-2xl py-3 pl-12 pr-10 outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500/50 transition-all text-sm font-medium shadow-md shadow-slate-200/50"
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
            Standard: "bg-blue-50/60 border-blue-200/60 shadow-blue-200/20",
            Suite: "bg-indigo-50/60 border-indigo-200/60 shadow-indigo-200/20",
            VIP: "bg-amber-50/60 border-amber-200/60 shadow-amber-200/20",
          }[room.type] || "bg-white border-slate-200 shadow-slate-200/20";

          const accentStyles = {
            Standard: "bg-white text-blue-600 group-hover:bg-blue-600 group-hover:text-white",
            Suite: "bg-white text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white",
            VIP: "bg-white text-amber-600 group-hover:bg-amber-600 group-hover:text-white",
          }[room.type] || "bg-white text-blue-600";

          const badgeStyles = {
            Standard: "bg-blue-600/10 text-blue-700",
            Suite: "bg-indigo-600/10 text-indigo-700",
            VIP: "bg-amber-600/10 text-amber-700",
          }[room.type] || "bg-slate-100 text-slate-600";

          return (
            <button
              key={room.number}
              onClick={() => {
                setSelectedRoom(room);
                const savedResults = localStorage.getItem(`q100_room_results_${room.number}`);
                if (savedResults) {
                  setResults(JSON.parse(savedResults));
                  setPhase("report");
                } else {
                  setResults({});
                  setPhase("scan");
                  setIsScanning(true);
                }
              }}
              className={`group border p-5 rounded-[2rem] transition-all duration-300 text-left shadow-2xl hover:scale-[1.02] active:scale-95 relative overflow-hidden flex flex-col items-stretch ${styles}`}
            >
              {/* Solid top border accent */}
              <div className={`absolute top-0 left-0 right-0 h-1 ${
                room.type === 'Standard' ? 'bg-blue-500' : 
                room.type === 'Suite' ? 'bg-indigo-500' : 'bg-amber-500'
              }`} />

              <div className="flex justify-between items-start mb-6">
                <div
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-500 shadow-sm border border-transparent group-hover:border-white/50 group-hover:rotate-[10deg] ${accentStyles}`}
                >
                  <Icon size={24} />
                </div>
                <div
                  className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest shadow-sm ${badgeStyles}`}
                >
                  {room.type}
                </div>
              </div>

              <div className="flex justify-between items-end">
                 <div>
                    <h3 className="text-2xl font-black text-slate-900 tracking-tight">Room {room.number}</h3>
                    <div className="flex items-center gap-2 mt-2">
                       <div className={`w-2 h-2 rounded-full transition-all duration-500 group-hover:scale-125 ${
                          room.type === 'Standard' ? "bg-blue-400" :
                          room.type === 'Suite' ? "bg-indigo-400" : "bg-amber-400"
                        }`} />
                       <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Awaiting Inspection</span>
                    </div>
                 </div>
                 <div className="w-10 h-10 rounded-full bg-white/40 flex items-center justify-center text-slate-400 group-hover:bg-blue-600 group-hover:text-white transition-all transform translate-x-1 translate-y-1">
                    <ChevronRight size={20} />
                 </div>
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
      <div className="relative h-full animate-fade-in flex flex-col bg-slate-50 rounded-2xl md:rounded-3xl overflow-hidden">
        {/* Header: Guided Checkpoint */}
        <div className="p-3 md:p-4 bg-white border-b border-slate-100 flex flex-col items-center gap-2 md:gap-3 z-20">
           <div className="flex items-center gap-2 md:gap-3">
              <span className="text-2xl md:text-3xl">{cp.icon}</span>
              <div className="flex flex-col text-center sm:text-left">
                 <h2 className="text-base md:text-lg font-bold text-slate-900 tracking-tight leading-none">{cp.name}</h2>
                 <span className="text-[7px] md:text-[8px] font-bold text-blue-600 uppercase tracking-widest mt-0.5 md:mt-1">Item {currentStep + 1} of 12</span>
              </div>
           </div>
           {/* Progress Tracker */}
           <div className="flex gap-1.5 md:gap-2">
              {checkpoints.map((step, idx) => (
                <button 
                  key={step.id} 
                  onClick={() => setCurrentStep(idx)}
                  className={`w-2 md:w-2.5 h-2 md:h-2.5 rounded-full transition-all duration-300 ${
                    idx === currentStep ? "bg-blue-600 scale-110 ring-2 ring-blue-600/20" : 
                    results[step.id] === 'pass' ? "bg-emerald-500" :
                    results[step.id] === 'fail' ? "bg-rose-500" : "bg-slate-200"
                  }`}
                />
              ))}
           </div>
        </div>

        {/* Photography Layout (Top: Live Camera, Bottom: Master Info) */}
        <div className="flex-1 flex flex-col p-3 md:p-4 gap-3 md:gap-4 overflow-hidden">
           {/* 1. TOP: LIVE CAMERA VIEW */}
           <div className="flex-[1.2] relative bg-slate-950 rounded-2xl md:rounded-[2rem] overflow-hidden shadow-2xl border border-slate-900/50 group">
              {/* Live Camera Feed */}
              {uploadedImage ? (
                 <img src={uploadedImage} alt="Uploaded" className="absolute inset-0 w-full h-full object-cover z-20" />
              ) : (
                 <video
                   ref={cameraVideoRef}
                   autoPlay
                   playsInline
                   muted
                   className="absolute inset-0 w-full h-full object-cover"
                 />
              )}

              {/* Camera loading state */}
              {!cameraReady && !cameraError && (
                <div className="absolute inset-0 flex flex-col items-center justify-center z-10 gap-3">
                   <div className="w-12 h-12 border-4 border-blue-600/10 border-t-blue-500 rounded-full animate-spin" />
                   <p className="text-white/60 text-xs font-bold uppercase tracking-widest">Opening Camera...</p>
                </div>
              )}

              {/* Camera error state */}
              {cameraError && (
                <div className="absolute inset-0 flex flex-col items-center justify-center z-10 gap-3 p-6">
                   <div className="w-16 h-16 bg-rose-500/20 rounded-full flex items-center justify-center">
                      <AlertCircle size={32} className="text-rose-400" />
                   </div>
                   <p className="text-white/80 text-sm font-bold text-center">Camera Access Denied</p>
                   <p className="text-white/40 text-xs text-center max-w-[250px]">{cameraError}</p>
                </div>
              )}

              {/* Viewfinder corners overlay */}
              {cameraReady && !comparing && !itemStatus && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
                   <div className="w-[80%] h-[70%] relative">
                      <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-white/60 rounded-tl-2xl" />
                      <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-white/60 rounded-tr-2xl" />
                      <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-white/60 rounded-bl-2xl" />
                      <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-white/60 rounded-br-2xl" />
                   </div>
                </div>
              )}

              {comparing && (
                <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-md z-50 flex flex-col items-center justify-center gap-4 animate-fade-in">
                   <div className="w-12 h-12 md:w-16 md:h-16 border-4 border-blue-600/10 border-t-blue-500 rounded-full animate-spin" />
                   <h2 className="text-base md:text-lg font-bold text-white tracking-widest uppercase">Verifying...</h2>
                </div>
              )}

              {itemStatus === 'pass' && !comparing && (
                <div className="absolute inset-0 bg-emerald-500 z-[60] flex flex-col items-center justify-center animate-fade-out pointer-events-none">
                  <div className="w-20 h-20 md:w-24 md:h-24 bg-white rounded-full flex items-center justify-center shadow-2xl animate-scale-in">
                    <Check className="text-emerald-500 w-10 h-10 md:w-12 md:h-12" strokeWidth={4} />
                  </div>
                  <h2 className="text-xl md:text-2xl font-black text-white tracking-tighter mt-6">PERFECT</h2>
                </div>
              )}
           </div>

           {/* 2. BOTTOM: MASTER REFERENCE BOX (Simplified with Inline Failure) */}
           <div className={`flex-1 bg-white rounded-2xl md:rounded-[2rem] p-4 md:p-6 shadow-xl border flex flex-col animate-slide-up transition-all duration-300 ${
              itemStatus === 'fail' ? 'border-rose-400 bg-rose-50/20' : 'border-blue-50'
           }`}>
              {/* Failure Reason Banner */}
              {itemStatus === 'fail' && (
                <div className="mb-4 p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-3 animate-fade-in">
                   <AlertCircle size={18} className="text-rose-500 shrink-0" />
                   <p className="text-[10px] md:text-xs font-bold text-rose-600 uppercase tracking-widest leading-none">
                      {analysisReason || "Discrepancy Detected"}
                   </p>
                </div>
              )}

              <div className="flex-1 flex gap-4 md:gap-6">
                 {/* Item Details */}
                 <div className="flex-1 flex flex-col">
                    <div className="flex items-center gap-2 mb-3">
                       <span className={`w-8 h-8 rounded-lg flex items-center justify-center text-lg text-white ${itemStatus === 'fail' ? 'bg-rose-500' : 'bg-blue-600'}`}>
                          {cp.icon}
                       </span>
                       <h2 className="text-lg md:text-xl font-bold text-slate-900 tracking-tight">{cp.name}</h2>
                    </div>
                    
                    <div className="space-y-3">
                       <div className="flex items-start gap-2 group">
                          <CheckCircle2 size={16} className={`${itemStatus === 'fail' ? 'text-rose-400' : 'text-emerald-500'} mt-0.5 shrink-0`} />
                          <p className="text-[10px] md:text-xs font-semibold text-slate-600 leading-relaxed">
                             &quot;{cp.ref}&quot;
                          </p>
                       </div>
                    </div>
                 </div>

                 {/* Master Image Thumbnail (Right side) */}
                 <div className={`w-24 h-24 md:w-32 md:h-32 bg-slate-50 rounded-2xl border flex items-center justify-center relative overflow-hidden group shadow-inner shrink-0 ${itemStatus === 'fail' ? 'border-rose-400' : 'border-slate-100'}`}>
                    <div className="absolute inset-0 bg-slate-900/5 group-hover:bg-transparent transition-colors z-10" />
                    {cp.masterImg ? (
                      <img src={cp.masterImg} alt={cp.name} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-4xl md:text-5xl opacity-20">{cp.icon}</span>
                    )}
                    <div className={`absolute top-2 left-2 text-white px-2 py-0.5 rounded-full text-[8px] font-bold uppercase tracking-widest z-20 shadow-sm leading-none ${itemStatus === 'fail' ? 'bg-rose-500' : 'bg-emerald-500'}`}>
                       {itemStatus === 'fail' ? 'Fail' : 'Master'}
                    </div>
                 </div>
              </div>

              {/* Actions */}
              {!comparing && itemStatus !== 'pass' && (
                <div className="mt-4 grid grid-cols-2 gap-3">
                  {itemStatus === 'fail' ? (
                    <>
                      <button 
                        onClick={() => {
                          setUploadedImage(null);
                          setResults(prev => {
                            const newResults = { ...prev };
                            delete newResults[cp.id];
                            return newResults;
                          });
                          setAnalysisReason(null);
                        }}
                        className="w-full h-12 md:h-14 bg-blue-600 text-white rounded-xl md:rounded-[1.25rem] font-black text-xs md:text-sm uppercase tracking-[0.15em] shadow-lg shadow-blue-500/20 transition-all active:scale-[0.98] flex items-center justify-center gap-2 group"
                      >
                         <Camera size={18} className="group-hover:rotate-[15deg] transition-transform shrink-0" />
                         <span className="truncate">Recapture</span>
                      </button>
                      <button 
                        onClick={() => {
                          if (currentStep < checkpoints.length - 1) setCurrentStep(prev => prev + 1);
                          else setPhase('report');
                        }}
                        className="w-full h-12 md:h-14 bg-slate-900 text-white rounded-xl md:rounded-[1.25rem] font-black text-xs md:text-sm uppercase tracking-[0.15em] shadow-lg shadow-slate-900/20 transition-all active:scale-[0.98] flex items-center justify-center gap-2 group"
                      >
                         <FastForward size={18} className="group-hover:translate-x-1 transition-transform shrink-0" />
                         <span className="truncate">Next</span>
                      </button>
                    </>
                  ) : (
                    <>
                      <button 
                        onClick={handlePhotoModeCapture}
                        className="w-full h-12 md:h-14 bg-blue-600 hover:bg-blue-700 text-white rounded-xl md:rounded-[1.25rem] font-black text-xs md:text-sm uppercase tracking-[0.15em] shadow-lg shadow-blue-500/20 transition-all active:scale-[0.98] flex items-center justify-center gap-2 group"
                      >
                         <Camera size={18} className="group-hover:rotate-[15deg] transition-transform shrink-0" />
                         <span className="truncate">Capture</span>
                      </button>
                      <label className="w-full h-12 md:h-14 bg-white border-2 border-slate-200 text-slate-700 hover:bg-slate-50 rounded-xl md:rounded-[1.25rem] font-black text-xs md:text-sm uppercase tracking-[0.15em] shadow-sm transition-all active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer group">
                         <Upload size={18} className="group-hover:-translate-y-1 transition-transform text-slate-400 shrink-0" />
                         <span className="truncate">Upload</span>
                         <input 
                           type="file" 
                           accept="image/*" 
                           className="hidden" 
                           onChange={async (e) => {
                             if (e.target.files && e.target.files.length > 0) {
                               const file = e.target.files[0];
                               const blobUrl = URL.createObjectURL(file);
                               setUploadedImage(blobUrl);
                               
                               // Immediately trigger analysis
                               try {
                                 const insB64 = await fileToBase64(blobUrl);
                                 if (insB64) {
                                   await runAnalysis(insB64);
                                 }
                               } catch (err) {
                                 console.error("Upload analysis error:", err);
                               }
                             }
                           }}
                         />
                      </label>
                    </>
                  )}
                </div>
              )}
           </div>
        </div>
      </div>
    );
  };

  const renderVideoMode = () => {
    const nextCp = checkpoints.find(c => !captureStrip.some(cap => cap.id === c.id));

    return (
      <div className="relative h-full animate-fade-in flex flex-col bg-slate-950 rounded-2xl md:rounded-3xl overflow-hidden shadow-2xl">
       <div className="flex-1 relative overflow-hidden">
          {/* Live Camera Feed */}
          <video
            ref={cameraVideoRef}
            autoPlay
            playsInline
            muted
            className="absolute inset-0 w-full h-full object-cover"
          />
          {/* Camera loading state */}
          {!cameraReady && !cameraError && (
             <div className="absolute inset-0 flex flex-col items-center justify-center z-10 gap-3 bg-slate-950/80 backdrop-blur-sm">
                <div className="w-12 h-12 border-4 border-rose-600/10 border-t-rose-500 rounded-full animate-spin" />
                <p className="text-white/60 text-xs font-bold uppercase tracking-widest">Opening Camera...</p>
             </div>
          )}
          <div className="absolute inset-0 border-4 border-rose-600/20 animate-pulse pointer-events-none z-10" />
          
          <div className="absolute top-4 left-4 md:top-6 md:left-6 flex items-center gap-2 md:gap-3 z-20">
             <div className="px-2.5 py-1 bg-rose-600 text-white rounded-lg md:rounded-xl flex items-center gap-1.5 md:gap-2 shadow-xl border border-white/10">
                <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-white rounded-full animate-pulse" />
                <span className="font-bold text-[8px] md:text-[9px] uppercase tracking-widest">REC</span>
             </div>
             <span className="text-xl md:text-2xl font-bold text-white tracking-tight drop-shadow-lg leading-none">{formatTime(videoTimer)}</span>
          </div>

          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 text-center">
             <div className="w-20 h-20 bg-white/10 backdrop-blur-3xl border border-white/20 rounded-full flex items-center justify-center shadow-2xl animate-bounce-slow">
                <span className="text-4xl">{nextCp?.icon || "\u2705"}</span>
             </div>
             <p className="mt-4 text-white/80 font-bold uppercase tracking-widest text-[8px] bg-black/40 px-3 py-1 rounded-full inline-block backdrop-blur-md">
                Align: {nextCp?.name || "Complete"}
             </p>
          </div>

          <div className="absolute bottom-28 left-0 right-0 z-20 px-4">
             <div className="bg-white/10 backdrop-blur-2xl border border-white/10 rounded-2xl p-4 shadow-2xl">
                <div className="flex gap-3 overflow-x-auto no-scrollbar">
                   {captureStrip.map((cap, i) => (
                     <div key={i} className="flex-shrink-0 relative">
                        <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center text-3xl border border-white/10 grayscale hover:grayscale-0 transition-all">
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

          <div className="absolute bottom-6 left-0 right-0 z-20 flex items-center justify-between px-8 md:px-10">
             <div className="flex flex-col">
                <span className="text-[9px] font-bold text-white/50 uppercase tracking-widest">Progress</span>
                <span className="text-2xl font-bold text-white tracking-tight">{captureStrip.length}<span className="text-white/20 mx-1">/</span>12</span>
             </div>
             <button 
               onClick={() => setPhase('report')}
               className="w-16 h-16 md:w-20 md:h-20 bg-white text-slate-900 rounded-full flex items-center justify-center shadow-xl active:scale-90 transition-all hover:bg-rose-50"
             >
                <div className="w-6 h-6 md:w-8 md:h-8 bg-slate-900 rounded-sm" />
             </button>
             <div className="flex flex-col items-end">
                <span className="text-[9px] font-bold text-white/50 uppercase tracking-widest">Storage</span>
                <span className="text-xs font-bold text-emerald-400">92% FREE</span>
             </div>
          </div>
       </div>
    </div>
  );
  };

  const renderReport = () => (
    <div className="p-4 md:p-6 space-y-6 md:space-y-8 animate-fade-in h-full overflow-y-auto no-scrollbar bg-white rounded-2xl md:rounded-3xl shadow-2xl border border-slate-100">
       <div className="flex flex-col sm:flex-row justify-between items-center bg-gradient-to-r from-blue-50/80 to-indigo-50/80 p-4 md:p-6 rounded-2xl md:rounded-[2rem] border border-blue-100/30 gap-4 shadow-sm">
          <div className="text-center sm:text-left">
            <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tighter leading-none">Verified</h1>
            <div className="flex items-center justify-center sm:justify-start gap-2 mt-2">
               <span className="bg-slate-900 text-white px-2.5 py-1 rounded-lg text-[8px] md:text-[9px] font-bold uppercase tracking-widest shadow-sm">Room {selectedRoom?.number}</span>
            </div>
          </div>
          <button 
             onClick={() => {
               localStorage.removeItem(`q100_room_results_${selectedRoom?.number}`);
               window.location.href = "/";
             }}
             className="bg-blue-600 text-white h-12 md:h-14 px-6 md:px-8 rounded-xl md:rounded-2xl font-black text-xs md:text-sm uppercase tracking-widest flex items-center justify-center gap-3 shadow-lg hover:bg-blue-700 hover:scale-105 transition-all w-full sm:w-auto"
          >
             Submit Data
             <ArrowRight size={18} />
          </button>
       </div>

       <div className="grid grid-cols-3 gap-2 md:gap-4">
          <div className="bg-blue-50/50 p-3 md:p-5 rounded-2xl md:rounded-3xl shadow-sm border border-blue-100 text-center group hover:bg-blue-50 hover:border-blue-200 transition-all">
             <span className="text-2xl md:text-4xl font-black text-blue-900 tracking-tighter">
                {Math.round((Object.values(results).filter(v => v === 'pass').length / checkpoints.length) * 100)}%
             </span>
             <p className="text-[7px] md:text-[8px] font-bold text-blue-800/60 uppercase tracking-widest mt-1">Score</p>
          </div>
          <div className="bg-emerald-50/50 p-3 md:p-5 rounded-2xl md:rounded-3xl shadow-sm border border-emerald-100 text-center group hover:bg-emerald-50 hover:border-emerald-200 transition-all">
             <span className="text-2xl md:text-4xl font-black text-emerald-900 tracking-tighter">
                {Object.values(results).filter(v => v === 'pass').length}/{checkpoints.length}
             </span>
             <p className="text-[7px] md:text-[8px] font-bold text-emerald-800/60 uppercase tracking-widest mt-1">Passed</p>
          </div>
          <div className="bg-rose-50/50 p-3 md:p-5 rounded-2xl md:rounded-3xl shadow-sm border border-rose-100 text-center group hover:bg-rose-50 hover:border-rose-200 transition-all">
             <span className="text-2xl md:text-4xl font-black text-rose-600 tracking-tighter">
                {Object.values(results).filter(v => v === 'fail').length}
             </span>
             <p className="text-[7px] md:text-[8px] font-bold text-rose-800/60 uppercase tracking-widest mt-1">Flagged</p>
          </div>
       </div>

       <div className="space-y-4 pb-8">
          <h3 className="text-[8px] md:text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em] border-b border-slate-100 pb-2">Checkpoint Analysis</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
             {checkpoints.map((cp, idx) => {
               const status = results[cp.id] || (captureStrip.find(c => c.id === cp.id)?.status);
               const isFailed = status === 'fail';
               return (
                 <button 
                   key={cp.id} 
                   onClick={() => {
                      if (isFailed) {
                         setCurrentStep(idx);
                         setPhase('photo');

                      }
                   }}
                   disabled={!isFailed}
                   className={`bg-white p-4 md:p-5 lg:p-6 rounded-2xl md:rounded-3xl border shadow-sm flex flex-col items-center justify-between gap-3 md:gap-4 transition-all group ${
                     status === 'fail' 
                       ? 'border-rose-400 hover:border-rose-500 hover:shadow-lg hover:shadow-rose-500/20 hover:-translate-y-1 cursor-pointer' 
                       : status === 'pass'
                         ? 'border-emerald-400 border-[1.5px] shadow-emerald-500/10 cursor-default'
                         : 'border-slate-100 cursor-default hover:shadow-md'
                   }`}
                 >
                    <span className={`text-4xl md:text-5xl transition-transform ${isFailed ? 'group-hover:scale-110 group-hover:rotate-6' : ''}`}>{cp.icon}</span>
                    <span className="text-[9px] md:text-[10px] font-black text-slate-900 uppercase tracking-widest text-center w-full">{cp.name}</span>
                     <div className="w-full mt-auto">
                       {status === 'fail' ? (
                         <div className="flex items-center gap-2 w-full">
                           <div className="px-3 py-2.5 bg-rose-50 text-[#ff1b51] border border-rose-200 rounded-xl font-bold text-[8px] md:text-[9px] uppercase tracking-widest flex items-center justify-center shadow-sm">
                             Failed
                           </div>
                           <div className="flex-1 py-2.5 bg-[#ff1b51] text-white border border-[#ff1b51] rounded-xl shadow-md shadow-rose-500/30 font-bold text-[8px] md:text-[9px] uppercase tracking-widest flex items-center justify-center">
                             Re-Capture
                           </div>
                         </div>
                       ) : (
                         <div className={`w-full py-2.5 rounded-xl text-[8px] md:text-[9px] font-bold uppercase tracking-widest text-center border transition-colors ${
                           status === 'pass' ? "bg-emerald-50 text-emerald-600 border-emerald-100" :
                           "bg-slate-50 text-slate-400 border-slate-200"
                         }`}>
                           {status === 'pass' ? "Pass" : "Queued"}
                         </div>
                       )}
                     </div>
                 </button>
               );
             })}
          </div>
       </div>
    </div>
  );

  return (
    <div className="relative w-full h-[calc(100vh-8rem)] md:h-[calc(100vh-10rem)] min-h-[500px] md:min-h-[600px] bg-slate-50 rounded-2xl md:rounded-3xl overflow-hidden shadow-2xl font-sans border border-slate-100">
       
       {phase === 'select' && renderRoomSelection()}
       {phase === 'scan' && renderScanScreen()}
       {phase === 'photo' && renderPhotoMode()}
       {phase === 'video' && renderVideoMode()}
       {phase === 'report' && renderReport()}

       {flash && <div className="absolute inset-0 bg-emerald-500 z-[200] animate-fade-out" />}

       {showKeypad && (
         <div className="absolute inset-0 bg-white/95 backdrop-blur-3xl z-[300] flex flex-col justify-end animate-fade-in p-4 md:p-6">
            <div className="max-w-xs mx-auto w-full pb-4 md:pb-6">
               <div className="flex justify-between items-center mb-4 md:mb-6 px-2">
                  <h2 className="text-lg md:text-xl font-bold text-slate-900 tracking-tight">Manual Entry</h2>
                  <button onClick={() => setShowKeypad(false)} className="bg-slate-100 p-2 md:p-3 rounded-xl text-slate-400 hover:text-slate-900 leading-none shadow-sm"><X size={20} /></button>
               </div>
               <div className="bg-slate-50 border border-slate-200 rounded-2xl md:rounded-3xl p-4 md:p-6 mb-4 md:mb-6 text-center shadow-inner">
                  <span className="text-3xl md:text-4xl font-black text-slate-900 tracking-[0.2em]">{keyValue || "____"}</span>
               </div>
               <div className="grid grid-cols-3 gap-2 md:gap-3">
                  {[1,2,3,4,5,6,7,8,9,"C",0,"OK"].map(d => (
                    <button 
                      key={d} 
                      onClick={() => {
                        if (d === 'C') setKeyValue("");
                        else if (d === 'OK') { handleScanCapture(keyValue); setKeyValue(""); setShowKeypad(false); }
                        else if (keyValue.length < 4) setKeyValue(prev => prev + d);
                      }}
                      className={`h-14 md:h-16 rounded-xl md:rounded-2xl text-lg md:text-xl font-black transition-all active:scale-95 shadow-sm ${
                        d === 'OK' ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20" : 
                        d === 'C' ? "bg-rose-50 text-rose-500 border border-rose-100" : "bg-white text-slate-900 border border-slate-100 hover:bg-slate-50"
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