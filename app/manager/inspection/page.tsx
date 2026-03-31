"use client";

import React, { useState, useMemo, useRef, useCallback, useEffect } from 'react';
import { 
  ChevronLeft, ChevronRight, AlertTriangle, CheckCircle, 
  XCircle, Eye, Clock, IndianRupee, RotateCcw, Ban, User, ScanSearch,
  Camera, Shield, Sparkles, ArrowRight, Upload, X, Image, Play,
  Building2, ChevronDown
} from 'lucide-react';

/* ── Floor/Room Data ── */
const floorNumbers = [2, 3, 4, 5, 6, 7, 8];

const roomTypeForNumber = (num: number): string => {
  if (num % 15 === 0) return "Presidential Suite";
  if (num % 10 === 0) return "Deluxe Suite";
  if (num % 7 === 0) return "Deluxe King";
  if (num % 11 === 0) return "Accessible Room";
  if (num % 5 === 0) return "Standard Twin";
  return "Standard Double";
};

const generateFloorRooms = (floor: number) => {
  const base = floor * 100;
  const count = floor === 8 ? 18 : floor <= 4 ? 22 : 20;
  return Array.from({ length: count }, (_, i) => {
    const num = base + i + 1;
    const rng = (num * 31 + 17) % 100;
    const status = rng < 60 ? 'pass' : rng < 80 ? 'fail' : 'pending';
    const issues = status === 'fail' ? ((num % 3) + 1) : 0;
    const hour = 8 + Math.floor(i / 4);
    const min = (i * 7) % 60;
    return {
      number: `${num}`,
      type: roomTypeForNumber(num),
      floor,
      lastScan: status !== 'pending' ? `${hour}:${min.toString().padStart(2, '0')} AM` : '—',
      status: status as 'pass' | 'fail' | 'pending',
      issues,
      housekeeper: status !== 'pending' ? ['Priya S.', 'Amit K.', 'Meena R.', 'Deepak J.', 'Sunita P.'][i % 5] : undefined,
      passRate: status === 'pass' ? 85 + (num % 15) : status === 'fail' ? 55 + (num % 25) : 0,
    };
  });
};

const checkpoints = [
  { name: "Dustbin", status: "pass", zone: "Entrance" },
  { name: "Bed & Pillows", status: "pass", zone: "Bed Area" },
  { name: "Bed Linen", status: "pass", zone: "Bed Area" },
  { name: "Towels (Bath)", status: "pass", zone: "Bathroom" },
  { name: "Towels (Bed)", status: "pass", zone: "Bed Area" },
  { name: "Coffee/Tea", status: "pass", zone: "Desk Area" },
  { name: "Minibar", status: "pass", zone: "Minibar" },
  { name: "Amenities", status: "fail", zone: "Bathroom" },
  { name: "TV Remote", status: "pass", zone: "Desk Area" },
  { name: "Curtains", status: "pass", zone: "Bed Area" },
  { name: "Wardrobe", status: "pass", zone: "Entrance" },
  { name: "Welcome Items", status: "pass", zone: "Desk Area" },
];

const generateDiscrepancies = (roomNum: string) => {
  const seed = parseInt(roomNum) || 0;
  const items = [
    { category: "Amenity", item: "Missing Item — Dental Kit", severity: "Major" as const, zone: "Bathroom", description: "Dental kit absent from position 5 in the vanity arc arrangement." },
    { category: "Arrangement", item: "Incorrect Position — Body Lotion", severity: "Minor" as const, zone: "Bathroom", description: "Body lotion placed behind shampoo instead of its designated position." },
    { category: "Linen", item: "Stain Detected — Pillowcase", severity: "Critical" as const, zone: "Bed Area", description: "Small discolouration detected on left pillowcase, invisible at arm's length." },
  ];
  return items.filter((_, i) => ((seed + i) * 37) % 100 < 60).map((item, id) => ({
    ...item, id: id + 1,
    flaggedAt: `${8 + (seed % 3)}:${(seed * 7 + id * 12) % 60 < 10 ? '0' : ''}${(seed * 7 + id * 12) % 60} AM`,
    resolvedAt: `${9 + (seed % 3)}:${(seed * 11 + id * 8) % 60 < 10 ? '0' : ''}${(seed * 11 + id * 8) % 60} AM`,
    resolutionTime: `${15 + (seed + id) % 20} min`,
  }));
};

/* ── Progress Ring ── */
const ProgressRing = ({ percent, size = 64, stroke = 5 }: { percent: number; size?: number; stroke?: number }) => {
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percent / 100) * circumference;
  const color = percent >= 90 ? '#10b981' : percent >= 75 ? '#f59e0b' : '#f43f5e';
  return (
    <svg width={size} height={size} className="transform -rotate-90">
      <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="#f1f5f9" strokeWidth={stroke} />
      <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke={color} strokeWidth={stroke} strokeDasharray={circumference} strokeDashoffset={offset} strokeLinecap="round" className="transition-all duration-1000 ease-out" />
    </svg>
  );
};

export default function AIInspectionDetail() {
  const [selectedFloor, setSelectedFloor] = useState(2);
  const [selectedRoomNum, setSelectedRoomNum] = useState<string | null>(null);
  const [showAfter, setShowAfter] = useState(false);
  const [hoveredCheckpoint, setHoveredCheckpoint] = useState<number | null>(null);
  const [isFloorDropdownOpen, setIsFloorDropdownOpen] = useState(false);
  const [isRoomDropdownOpen, setIsRoomDropdownOpen] = useState(false);
  const roomDropdownRef = useRef<HTMLDivElement>(null);

  // Close room dropdown on click outside
  useEffect(() => {
    if (!isRoomDropdownOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (roomDropdownRef.current && !roomDropdownRef.current.contains(e.target as Node)) {
        setIsRoomDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isRoomDropdownOpen]);

  // Image capture state
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const floorRooms = useMemo(() => generateFloorRooms(selectedFloor), [selectedFloor]);
  
  // Default to first room if none selected
  const activeRoomNum = selectedRoomNum && floorRooms.some(r => r.number === selectedRoomNum) 
    ? selectedRoomNum 
    : floorRooms[0]?.number;
  const room = floorRooms.find(r => r.number === activeRoomNum) || floorRooms[0];
  const discrepancies = useMemo(() => generateDiscrepancies(room.number), [room.number]);

  const passCount = checkpoints.filter(c => c.status === 'pass').length;
  const failCount = checkpoints.filter(c => c.status === 'fail').length;

  const handleFloorChange = (floor: number) => {
    setSelectedFloor(floor);
    setSelectedRoomNum(null);
    setShowAfter(false);
    setCapturedImage(null);
    stopCamera();
    setIsFloorDropdownOpen(false);
  };

  const handleRoomChange = (roomNum: string) => {
    setSelectedRoomNum(roomNum);
    setShowAfter(false);
    setCapturedImage(null);
    stopCamera();
    setIsRoomDropdownOpen(false);
  };

  // Camera controls
  const startCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' }, audio: false });
      streamRef.current = stream;
      setIsCameraOpen(true);
      setTimeout(() => { if (videoRef.current) { videoRef.current.srcObject = stream; videoRef.current.play(); } }, 100);
    } catch { alert('Camera access denied. Use HTTPS or localhost.'); }
  }, []);

  const capturePhoto = useCallback(() => {
    if (!videoRef.current) return;
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth || 640;
    canvas.height = videoRef.current.videoHeight || 480;
    const ctx = canvas.getContext('2d');
    if (ctx) ctx.drawImage(videoRef.current, 0, 0);
    setCapturedImage(canvas.toDataURL('image/jpeg', 0.85));
    stopCamera();
  }, []);

  const stopCamera = useCallback(() => {
    if (streamRef.current) { streamRef.current.getTracks().forEach(t => t.stop()); streamRef.current = null; }
    setIsCameraOpen(false);
  }, []);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => { if (ev.target?.result) setCapturedImage(ev.target.result as string); };
    reader.readAsDataURL(file);
  };

  const removeImage = () => { setCapturedImage(null); stopCamera(); };

  // Floor stats
  const floorStats = useMemo(() => floorNumbers.map(f => {
    const rooms = generateFloorRooms(f);
    const ready = rooms.filter(r => r.status === 'pass').length;
    return { floor: f, total: rooms.length, ready, pct: Math.round((ready / rooms.length) * 100) };
  }), []);

  return (
    <div className="space-y-5 pb-12">
      {/* Hidden file input */}
      <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileUpload} />

      {/* Page Header */}
      <div className="flex items-center justify-between animate-fade-in-up">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-slate-900">AI Inspection Detail</h1>
          <p className="text-sm text-slate-400 font-medium mt-0.5">Side-by-side comparison of Master vs. Captured scans</p>
        </div>
      </div>

      {/* Floor Selector + Room Picker */}
      <div className={`bg-gradient-to-br from-[#f8faff] via-[#eef4ff] to-[#f0f4ff] rounded-[1.5rem] p-5 border border-blue-100/50 shadow-sm animate-fade-in-up stagger-1 relative ${isRoomDropdownOpen ? 'z-50 overflow-visible' : 'overflow-hidden'}`}>
        <div className="absolute top-0 right-0 w-48 h-48 bg-[radial-gradient(circle_at_80%_20%,rgba(59,130,246,0.08)_0,transparent_60%)] pointer-events-none" />
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 rounded-xl bg-indigo-100 flex items-center justify-center">
            <Building2 size={16} className="text-indigo-600" />
          </div>
          <span className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Select Floor & Room</span>
        </div>
        
        <div className="flex items-center gap-4">
          {/* Floor Pills */}
          <div className="flex items-center gap-2">
            {floorStats.map((fp) => (
              <button key={fp.floor} onClick={() => handleFloorChange(fp.floor)}
                className={`relative px-5 py-3 rounded-2xl text-sm font-bold transition-all duration-300 active:scale-95 ${
                  selectedFloor === fp.floor 
                    ? 'bg-slate-900 text-white shadow-lg shadow-slate-900/20 scale-105' 
                    : 'bg-white text-slate-600 border border-slate-200 hover:border-slate-300 hover:shadow-md'
                }`}>
                F{fp.floor}
                <div className={`absolute -bottom-1 left-1/2 -translate-x-1/2 w-6 h-1 rounded-full ${
                  fp.pct >= 80 ? 'bg-emerald-400' : fp.pct >= 50 ? 'bg-amber-400' : 'bg-rose-400'
                } ${selectedFloor === fp.floor ? 'opacity-100' : 'opacity-40'}`} />
              </button>
            ))}
          </div>
          
          <div className="h-8 w-px bg-slate-200" />
          
          {/* Room Dropdown */}
          <div className="relative flex-1" ref={roomDropdownRef}>
            <button onClick={() => setIsRoomDropdownOpen(!isRoomDropdownOpen)}
              className="w-full flex items-center justify-between px-5 py-3 bg-white border border-slate-200 rounded-2xl text-sm font-bold text-slate-700 hover:border-blue-300 hover:shadow-md transition-all">
              <span className="flex items-center gap-2">
                <span className="text-slate-400">Room:</span>
                <span className="text-lg font-black text-slate-900">{room.number}</span>
                <span className={`px-2 py-0.5 rounded-full text-[8px] font-black uppercase ${
                  room.status === 'pass' ? 'bg-emerald-50 text-emerald-600 border border-emerald-200' :
                  room.status === 'fail' ? 'bg-rose-50 text-rose-600 border border-rose-200' :
                  'bg-slate-50 text-slate-500 border border-slate-200'
                }`}>{room.status === 'pass' ? 'Passed' : room.status === 'fail' ? 'Flagged' : 'Pending'}</span>
              </span>
              <ChevronDown size={16} className={`text-slate-400 transition-transform ${isRoomDropdownOpen ? 'rotate-180' : ''}`} />
            </button>
            
            {isRoomDropdownOpen && (
              <div className="absolute top-full mt-2 left-0 right-0 bg-white rounded-2xl border border-slate-200 shadow-2xl z-[100] max-h-64 overflow-y-auto">
                {floorRooms.map((r) => (
                  <button key={r.number} onClick={() => handleRoomChange(r.number)}
                    className={`w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-slate-50 transition-all ${
                      r.number === activeRoomNum ? 'bg-blue-50' : ''
                    }`}>
                    <div className={`w-2.5 h-2.5 rounded-full ${
                      r.status === 'pass' ? 'bg-emerald-500' : r.status === 'fail' ? 'bg-rose-500' : 'bg-slate-300'
                    }`} />
                    <span className="text-sm font-bold text-slate-900">{r.number}</span>
                    <span className="text-xs text-slate-400">{r.type}</span>
                    {r.housekeeper && <span className="text-xs text-blue-500 ml-auto">{r.housekeeper}</span>}
                    {r.issues > 0 && (
                      <span className="px-2 py-0.5 bg-rose-50 text-rose-600 rounded-full text-[9px] font-bold border border-rose-200">{r.issues} issues</span>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Room Info Card — Vibrant Status-Based */}
      <div className={`rounded-[1.5rem] border shadow-sm overflow-hidden animate-fade-in-up stagger-1 hover:shadow-lg transition-all duration-300 relative ${
        room.issues > 0 
          ? 'bg-gradient-to-br from-rose-50/60 via-white to-rose-50/30 border-rose-200/60' 
          : 'bg-gradient-to-br from-emerald-50/60 via-white to-emerald-50/30 border-emerald-200/60'
      }`}>
        {/* Accent bar */}
        <div className={`absolute top-0 left-0 right-0 h-1.5 ${room.issues > 0 ? 'bg-rose-500' : 'bg-emerald-500'}`} />
        <div className="flex items-center">
          <div className="flex items-center gap-5 px-7 py-5 flex-1">
            <div className="flex items-center gap-4">
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-xl p-3 ${
                room.issues > 0 
                  ? 'bg-gradient-to-br from-rose-400 to-rose-600 shadow-rose-200' 
                  : 'bg-gradient-to-br from-emerald-400 to-emerald-600 shadow-emerald-200'
              }`}>
                <span className="text-lg font-black text-white">{room.number}</span>
              </div>
              <div>
                <h2 className="text-lg font-black text-slate-900">Room {room.number}</h2>
                <div className="flex items-center gap-2 mt-1">
                  <div className={`w-2 h-2 rounded-full ${room.issues > 0 ? 'bg-rose-400' : 'bg-emerald-400'}`} />
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">{room.type} · Floor {room.floor}</p>
                </div>
              </div>
            </div>
            <div className="h-10 w-px bg-slate-200/60" />
            <div className="flex items-center gap-2 text-sm text-slate-500 px-3 py-1.5 bg-white/60 rounded-xl border border-slate-100 shadow-sm">
              <User size={14} className="text-slate-400" />
              <strong className="text-slate-700">{room.housekeeper || 'Unassigned'}</strong>
            </div>
            <div className="h-10 w-px bg-slate-200/60" />
            <div className="flex items-center gap-2 text-sm text-slate-500 px-3 py-1.5 bg-white/60 rounded-xl border border-slate-100 shadow-sm">
              <Clock size={14} className="text-slate-400" />
              Scanned <strong className="text-slate-700">{room.lastScan}</strong>
            </div>
          </div>
          <div className={`px-7 py-5 border-l flex items-center gap-3 ${
            room.issues > 0
              ? 'bg-gradient-to-br from-rose-50 to-rose-100/50 border-rose-200/60'
              : 'bg-gradient-to-br from-emerald-50 to-emerald-100/50 border-emerald-200/60'
          }`}>
            <div className={`p-2.5 rounded-xl shadow-sm ${room.issues > 0 ? 'bg-rose-100 shadow-rose-200' : 'bg-emerald-100 shadow-emerald-200'}`}>
              {room.issues > 0 ? <AlertTriangle size={18} className="text-rose-500" /> : <CheckCircle size={18} className="text-emerald-500" />}
            </div>
            <div>
              <span className={`text-lg font-black ${room.issues > 0 ? 'text-rose-600' : 'text-emerald-600'}`}>
                {room.issues > 0 ? room.issues : '✓'}
              </span>
              <p className={`text-[10px] font-bold uppercase tracking-wider ${room.issues > 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
                {room.issues > 0 ? 'Issues' : 'All Clear'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Split-Screen Comparison */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 animate-fade-in-up stagger-3">
        {/* Master Photo */}
        <div className="bg-gradient-to-br from-white to-amber-50/20 rounded-[1.5rem] border border-slate-200/60 shadow-sm overflow-hidden hover:shadow-xl transition-all duration-300 group">
          <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-amber-50/80 to-white">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-400 to-amber-500 flex items-center justify-center shadow-md shadow-amber-200 transition-transform group-hover:scale-110">
                <ScanSearch size={16} className="text-white" />
              </div>
              <div>
                <h3 className="text-sm font-black text-slate-900">Master Reference</h3>
                <p className="text-[10px] text-slate-400">{room.type} — Bathroom Vanity</p>
              </div>
            </div>
            <span className="px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-[9px] font-black uppercase border border-amber-200">Baseline</span>
          </div>
          <div className="aspect-[16/10] bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center relative">
            <div className="text-center space-y-3">
              <div className="w-16 h-16 rounded-2xl bg-white shadow-xl border border-slate-200 flex items-center justify-center mx-auto">
                <Camera size={28} className="text-slate-300" />
              </div>
              <p className="text-sm font-bold text-slate-400">Master Reference Photo</p>
              <p className="text-xs text-slate-300">2 soaps · 1 shampoo · 1 conditioner · 1 lotion · 2 dental kits</p>
            </div>
            <div className="absolute bottom-5 right-5 px-3 py-2 rounded-xl border-2 border-dashed border-emerald-400 bg-emerald-50/70 flex items-center gap-2 backdrop-blur-sm">
              <CheckCircle size={12} className="text-emerald-500" />
              <span className="text-[9px] font-bold text-emerald-600">Dental Kit</span>
            </div>
            <div className="absolute bottom-5 left-5 px-3 py-2 rounded-xl border-2 border-dashed border-emerald-400 bg-emerald-50/70 flex items-center gap-2 backdrop-blur-sm">
              <CheckCircle size={12} className="text-emerald-500" />
              <span className="text-[9px] font-bold text-emerald-600">Body Lotion</span>
            </div>
          </div>
        </div>

        {/* Housekeeper's Scan with Upload/Capture */}
        <div className={`rounded-[1.5rem] border border-slate-200/60 shadow-sm overflow-hidden hover:shadow-xl transition-all duration-300 group ${
          showAfter ? 'bg-gradient-to-br from-white to-emerald-50/20' : 'bg-gradient-to-br from-white to-blue-50/20'
        }`}>
          <div className={`px-6 py-4 border-b border-slate-100 flex items-center justify-between ${
            showAfter ? 'bg-gradient-to-r from-emerald-50/80 to-white' : 'bg-gradient-to-r from-blue-50/80 to-white'
          }`}>
            <div className="flex items-center gap-3">
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center shadow-md transition-transform group-hover:scale-110 ${
                showAfter ? 'bg-gradient-to-br from-emerald-400 to-emerald-500 shadow-emerald-200' : 'bg-gradient-to-br from-blue-400 to-blue-500 shadow-blue-200'
              }`}>
                <Eye size={16} className="text-white" />
              </div>
              <div>
                <h3 className="text-sm font-black text-slate-900">{showAfter ? 'Re-Scan (After Fix)' : 'Housekeeper\'s Scan'}</h3>
                <p className="text-[10px] text-slate-400">{capturedImage ? 'Image loaded' : 'Upload or capture an image'}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {capturedImage && (
                <button onClick={() => setShowAfter(!showAfter)}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold hover:bg-blue-700 transition-all shadow-md shadow-blue-200 active:scale-95">
                  <RotateCcw size={12} /> {showAfter ? 'Show Before' : 'Show After'}
                </button>
              )}
            </div>
          </div>
          <div className="aspect-[16/10] bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center relative">
            {isCameraOpen ? (
              /* Camera View */
              <div className="w-full h-full relative">
                <video ref={videoRef} className="w-full h-full object-cover" autoPlay playsInline muted />
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-3">
                  <button onClick={capturePhoto}
                    className="w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-xl border-4 border-blue-500 hover:scale-110 transition-transform active:scale-95">
                    <div className="w-10 h-10 bg-blue-500 rounded-full" />
                  </button>
                  <button onClick={stopCamera}
                    className="w-10 h-10 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-all">
                    <X size={18} className="text-slate-600" />
                  </button>
                </div>
              </div>
            ) : capturedImage && !showAfter ? (
              /* Captured Image View */
              <div className="w-full h-full relative">
                <img src={capturedImage} alt="Captured" className="w-full h-full object-cover" />
                <button onClick={removeImage}
                  className="absolute top-3 right-3 w-8 h-8 bg-rose-500 rounded-full flex items-center justify-center shadow-lg hover:bg-rose-600 transition-all z-10">
                  <X size={14} className="text-white" />
                </button>
                <div className="absolute bottom-3 left-3 px-3 py-1.5 bg-black/50 backdrop-blur-sm rounded-xl">
                  <span className="text-[10px] font-bold text-white">Housekeeper&apos;s captured image</span>
                </div>
                {/* Discrepancy annotations on captured image */}
                {discrepancies.length > 0 && (
                  <>
                    <div className="absolute bottom-12 right-5 px-3 py-2 rounded-xl border-2 border-rose-500 bg-rose-50/80 flex items-center gap-2 animate-pulse backdrop-blur-sm">
                      <XCircle size={12} className="text-rose-500" />
                      <span className="text-[9px] font-bold text-rose-600">{discrepancies[0]?.item.split('—')[1]?.trim() || 'Issue'}</span>
                    </div>
                  </>
                )}
              </div>
            ) : capturedImage && showAfter ? (
              /* After Fix View */
              <div className="text-center space-y-3">
                <div className="w-16 h-16 rounded-2xl bg-emerald-50 shadow-xl border border-emerald-200 flex items-center justify-center mx-auto">
                  <CheckCircle size={28} className="text-emerald-500" />
                </div>
                <p className="text-sm font-bold text-emerald-600">All Items Corrected ✓</p>
                <p className="text-xs text-slate-400">Re-scanned — All checks passed</p>
              </div>
            ) : (
              /* Upload / Capture Placeholder */
              <div className="text-center space-y-5 px-8">
                <div className="w-16 h-16 rounded-2xl bg-blue-50 shadow-lg border border-blue-200 flex items-center justify-center mx-auto">
                  <Camera size={28} className="text-blue-400" />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-600">Capture / Upload Image</p>
                  <p className="text-xs text-slate-400 mt-1">Select below options</p>
                </div>
                <div className="flex items-center justify-center gap-4">
                  <button onClick={() => fileInputRef.current?.click()}
                    className="flex flex-col items-center gap-2 px-6 py-4 bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl hover:shadow-lg hover:-translate-y-0.5 transition-all active:scale-95 cursor-pointer group/btn">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl flex items-center justify-center shadow-md shadow-blue-200 transition-transform group-hover/btn:scale-110">
                      <Upload size={18} className="text-white" />
                    </div>
                    <span className="text-xs font-bold text-blue-600">Upload</span>
                  </button>
                  <div className="text-xs text-slate-300 font-bold">or</div>
                  <button onClick={startCamera}
                    className="flex flex-col items-center gap-2 px-6 py-4 bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-200 rounded-2xl hover:shadow-lg hover:-translate-y-0.5 transition-all active:scale-95 cursor-pointer group/btn">
                    <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-xl flex items-center justify-center shadow-md shadow-emerald-200 transition-transform group-hover/btn:scale-110">
                      <Camera size={18} className="text-white" />
                    </div>
                    <span className="text-xs font-bold text-emerald-600">Capture</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Checkpoint Progress Strip — moved below comparison */}
      <div className="bg-gradient-to-br from-white to-slate-50/80 rounded-[1.5rem] p-6 border border-slate-200/60 shadow-sm animate-fade-in-up stagger-3 hover:shadow-lg transition-all duration-300">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-blue-100 flex items-center justify-center">
              <Shield size={16} className="text-blue-600" />
            </div>
            <h2 className="text-xs font-black text-slate-400 uppercase tracking-[0.3em]">Checkpoint Summary</h2>
          </div>
          <div className="flex items-center gap-4 text-xs">
            <span className="flex items-center gap-2 px-2.5 py-1 bg-emerald-50 rounded-lg border border-emerald-200"><div className="w-2 h-2 rounded-full bg-emerald-500" /> <strong className="text-emerald-600">{passCount}</strong> <span className="text-slate-400">passed</span></span>
            <span className="flex items-center gap-2 px-2.5 py-1 bg-rose-50 rounded-lg border border-rose-200"><div className="w-2 h-2 rounded-full bg-rose-500" /> <strong className="text-rose-600">{failCount}</strong> <span className="text-slate-400">failed</span></span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {checkpoints.map((cp, i) => (
            <div key={i} className="flex-1 group relative"
              onMouseEnter={() => setHoveredCheckpoint(i)}
              onMouseLeave={() => setHoveredCheckpoint(null)}>
              <div className={`h-10 rounded-xl flex items-center justify-center cursor-pointer transition-all duration-200 ${
                cp.status === 'pass' 
                  ? 'bg-gradient-to-br from-emerald-100 to-emerald-200/60 border border-emerald-200 hover:shadow-md hover:-translate-y-0.5' 
                  : 'bg-gradient-to-br from-rose-100 to-rose-200/60 border border-rose-200 hover:shadow-md hover:-translate-y-0.5'
              } ${hoveredCheckpoint === i ? 'shadow-lg -translate-y-1.5 scale-110 z-20' : ''}`}>
                {cp.status === 'pass' ? <CheckCircle size={14} className="text-emerald-600" /> : <XCircle size={14} className="text-rose-600" />}
              </div>
              <div className={`absolute bottom-full mb-3 left-1/2 -translate-x-1/2 z-50 transition-all duration-200 ${hoveredCheckpoint === i ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-1 pointer-events-none'}`}>
                <div className="px-3.5 py-2.5 bg-slate-900 text-white rounded-xl text-center shadow-2xl whitespace-nowrap">
                  <p className="text-[10px] font-bold">{cp.name}</p>
                  <p className="text-[8px] text-slate-400 mt-0.5">{cp.zone}</p>
                </div>
                <div className="w-2.5 h-2.5 bg-slate-900 rotate-45 mx-auto -mt-1.5" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Start Analysis Button */}
      {capturedImage && !showAfter && (
        <div className="flex justify-center animate-fade-in-up">
          <button className="flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl text-sm font-bold hover:shadow-xl hover:-translate-y-0.5 transition-all active:scale-95 shadow-lg shadow-blue-200">
            <Play size={18} /> Start Analysis
          </button>
        </div>
      )}

      {/* Discrepancy List + Impact Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Discrepancy List */}
        <div className="lg:col-span-2 bg-gradient-to-br from-white to-slate-50/80 rounded-[1.5rem] p-7 border border-slate-200/60 shadow-sm animate-fade-in-up stagger-4 hover:shadow-lg transition-all duration-300">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 rounded-xl bg-amber-100 flex items-center justify-center">
              <Sparkles size={16} className="text-amber-600" />
            </div>
            <h2 className="text-xs font-black text-slate-400 uppercase tracking-[0.3em]">AI-Detected Discrepancies</h2>
            {discrepancies.length === 0 && <span className="ml-auto text-xs text-emerald-500 font-bold">None detected ✓</span>}
          </div>
          {discrepancies.length > 0 ? (
            <div className="space-y-4">
              {discrepancies.map((d) => {
                const styles = d.severity === 'Critical'
                  ? { card: 'from-rose-50/60 to-transparent border-rose-200 hover:border-rose-300', icon: 'bg-rose-100 shadow-rose-200', badge: 'bg-rose-500 text-white' }
                  : d.severity === 'Major'
                  ? { card: 'from-amber-50/50 to-transparent border-amber-100 hover:border-amber-200', icon: 'bg-amber-100 shadow-amber-200', badge: 'bg-amber-500 text-white' }
                  : { card: 'from-blue-50/50 to-transparent border-blue-100 hover:border-blue-200', icon: 'bg-blue-100 shadow-blue-200', badge: 'bg-blue-500 text-white' };

                return (
                  <div key={d.id} className={`p-6 rounded-[1.25rem] border bg-gradient-to-r ${styles.card} hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 cursor-pointer group`}>
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-11 h-11 rounded-2xl flex items-center justify-center shadow-sm ${styles.icon} transition-transform group-hover:scale-110`}>
                          <AlertTriangle size={18} className={d.severity === 'Critical' ? 'text-rose-500' : d.severity === 'Major' ? 'text-amber-500' : 'text-blue-500'} />
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{d.item}</h4>
                          <p className="text-xs text-slate-400 mt-0.5">{d.zone} zone</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-1 bg-slate-100 text-slate-500 rounded-full text-[9px] font-bold uppercase">{d.category}</span>
                        <span className={`px-2.5 py-1 rounded-full text-[9px] font-bold uppercase shadow-sm ${styles.badge}`}>{d.severity}</span>
                      </div>
                    </div>
                    <p className="text-sm text-slate-500 mb-4">{d.description}</p>
                    <div className="flex items-center gap-6 pt-4 border-t border-black/5">
                      <div className="flex items-center gap-1.5 text-xs text-slate-400">
                        <Clock size={12} /> Flagged: <strong className="text-slate-600">{d.flaggedAt}</strong>
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-slate-400">
                        <CheckCircle size={12} className="text-emerald-500" /> Resolved: <strong className="text-emerald-600">{d.resolvedAt}</strong>
                      </div>
                      <span className="px-2.5 py-1 bg-emerald-50 text-emerald-600 rounded-full text-[9px] font-bold border border-emerald-200">✓ Fixed in {d.resolutionTime}</span>
                      <ArrowRight size={14} className="text-slate-300 ml-auto opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-16 h-16 rounded-2xl bg-emerald-50 shadow-lg border border-emerald-200 flex items-center justify-center mx-auto mb-4">
                <CheckCircle size={28} className="text-emerald-500" />
              </div>
              <p className="text-sm font-bold text-emerald-600">No discrepancies detected</p>
              <p className="text-xs text-slate-400 mt-1">This room passed all AI checkpoints</p>
            </div>
          )}
        </div>

        {/* Right Panel — Impact + Actions */}
        <div className="space-y-5 animate-fade-in-up stagger-5">
          {/* Score Ring */}
          <div className="bg-gradient-to-br from-white to-blue-50/30 rounded-[1.5rem] p-6 border border-slate-200/60 shadow-sm hover:shadow-xl transition-all duration-300">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-8 h-8 rounded-xl bg-blue-100 flex items-center justify-center">
                <Shield size={16} className="text-blue-600" />
              </div>
              <h2 className="text-xs font-black text-slate-400 uppercase tracking-[0.3em]">Room Score</h2>
            </div>
            <div className="flex items-center gap-5">
              <div className="relative">
                <ProgressRing percent={room.passRate || 83} />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-base font-black text-slate-900">{room.passRate || 83}%</span>
                </div>
              </div>
              <div>
                <p className="text-sm text-slate-500"><strong className="text-emerald-600">{passCount}</strong> passed</p>
                <p className="text-sm text-slate-500"><strong className="text-rose-600">{failCount}</strong> failed</p>
                <p className="text-xs text-slate-400 mt-1">{checkpoints.length} total checkpoints</p>
              </div>
            </div>
          </div>

          {/* Impact */}
          <div className="bg-gradient-to-br from-white to-emerald-50/20 rounded-[1.5rem] p-6 border border-slate-200/60 shadow-sm hover:shadow-xl transition-all duration-300">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-8 h-8 rounded-xl bg-emerald-100 flex items-center justify-center">
                <IndianRupee size={16} className="text-emerald-600" />
              </div>
              <h2 className="text-xs font-black text-slate-400 uppercase tracking-[0.3em]">Impact Estimate</h2>
            </div>
            <div className="space-y-3">
              <div className="p-4 bg-gradient-to-br from-emerald-50/90 to-emerald-100/50 rounded-2xl border border-emerald-200 shadow-sm hover:shadow-md transition-all">
                <div className="flex items-center gap-2 mb-1">
                  <IndianRupee size={14} className="text-emerald-600" />
                  <span className="text-[10px] font-bold uppercase text-emerald-600 tracking-wider">Cost Avoided</span>
                </div>
                <span className="text-2xl font-black text-emerald-700">₹{1200 + (parseInt(room.number) % 10) * 300}</span>
                <p className="text-xs text-emerald-600 mt-0.5">Replacement + service recovery</p>
              </div>
              <div className="p-4 bg-gradient-to-br from-blue-50/90 to-blue-100/50 rounded-2xl border border-blue-200 shadow-sm hover:shadow-md transition-all">
                <span className="text-[10px] font-bold uppercase text-blue-600 tracking-wider">Resolution Time</span>
                <span className="text-2xl font-black text-blue-700 block mt-1">{15 + (parseInt(room.number) % 15)} min</span>
                <p className="text-xs text-blue-500 mt-0.5">From detection to re-scan</p>
              </div>
            </div>
          </div>

          {/* Manager Actions */}
          <div className="bg-gradient-to-br from-white to-amber-50/20 rounded-[1.5rem] p-6 border border-slate-200/60 shadow-sm hover:shadow-xl transition-all duration-300">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-8 h-8 rounded-xl bg-amber-100 flex items-center justify-center">
                <Ban size={16} className="text-amber-600" />
              </div>
              <h2 className="text-xs font-black text-slate-400 uppercase tracking-[0.3em]">Manager Actions</h2>
            </div>
            <div className="space-y-3">
              <button className="w-full flex items-center gap-3 px-5 py-3.5 bg-gradient-to-br from-amber-50/90 to-amber-100/50 text-amber-700 rounded-2xl text-sm font-bold border border-amber-200 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 active:scale-95 group">
                <div className="p-1.5 bg-amber-100 rounded-lg transition-transform group-hover:scale-110">
                  <Ban size={14} />
                </div>
                Approve Override
              </button>
              <p className="text-xs text-slate-400 px-1">Dismiss this flag if the AI detection was incorrect. The system learns from overrides.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
