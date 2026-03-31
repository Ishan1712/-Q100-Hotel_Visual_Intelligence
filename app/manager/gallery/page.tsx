"use client";

import React, { useState, useMemo, useRef, useCallback } from 'react';
import { 
  Bed, Crown, Star, Eye, Clock, CheckCircle, 
  Layers, History, RotateCcw, ChevronRight, Accessibility,
  Search, XCircle, ScanSearch, ArrowRight, X, User,
  AlertTriangle, IndianRupee, RotateCw, Download, FileText, 
  Camera, Check, Plus, Upload, Image, Package, Pencil
} from 'lucide-react';

/* ── Room Types Data ── */
const roomTypes = [
  { name: "Standard Double", count: 78, icon: Bed, lastUpdated: "12 Jan 2026", detectionPoints: 14, color: "blue",
    zones: ["Bed Area", "Bathroom", "Desk Area", "Minibar", "Entrance"],
    products: ["Pillow Set (4)", "Bed Runner", "Bath Towels (4)", "Hand Towels (2)", "Soap Bar (2)", "Shampoo", "Conditioner", "Body Lotion", "Dental Kit (2)", "Coffee/Tea Tray", "Minibar Bottles (6)", "Welcome Card", "TV Remote", "Curtain Tie-backs"],
    checkpoints: ["Pillow count (4)", "Pillow arrangement (diamond)", "Bed runner position", "Remote angle", "Lamp alignment (L)", "Lamp alignment (R)", "Towel fold type", "Towel count", "Soap count", "Shampoo position", "Dental kit count", "Minibar bottles", "Curtain symmetry", "Welcome card"],
    versionHistory: [
      { date: "12 Jan 2026", label: "Current Version", note: "Updated after Q1 brand refresh", active: true },
      { date: "15 Sep 2025", label: "Post-Renovation", note: "New bed linen and amenity arrangement", active: false },
      { date: "1 Jun 2025", label: "Initial Setup", note: "First master photos captured", active: false },
    ]
  },
  { name: "Standard Twin", count: 22, icon: Bed, lastUpdated: "12 Jan 2026", detectionPoints: 14, color: "slate",
    zones: ["Bed Area", "Bathroom", "Desk Area", "Minibar", "Entrance"],
    products: ["Pillow Set (4)", "Bed Runner (2)", "Bath Towels (4)", "Hand Towels (2)", "Soap Bar (2)", "Shampoo", "Conditioner", "Body Lotion", "Dental Kit (2)", "Coffee/Tea Tray", "Minibar Bottles (6)", "Welcome Card", "TV Remote", "Curtain Tie-backs"],
    checkpoints: ["Pillow count (4)", "Pillow arrangement (parallel)", "Bed runner position", "Remote angle", "Lamp alignment (L)", "Lamp alignment (R)", "Towel fold type", "Towel count", "Soap count", "Shampoo position", "Dental kit count", "Minibar bottles", "Curtain symmetry", "Welcome card"],
    versionHistory: [
      { date: "12 Jan 2026", label: "Current Version", note: "Aligned with Standard Double update", active: true },
      { date: "1 Jun 2025", label: "Initial Setup", note: "First master photos captured", active: false },
    ]
  },
  { name: "Deluxe King", count: 20, icon: Crown, lastUpdated: "5 Feb 2026", detectionPoints: 18, color: "amber",
    zones: ["Bed Area", "Bathroom", "Living Area", "Desk Area", "Minibar", "Entrance"],
    products: ["Pillow Set (6)", "Throw Cushions (2)", "Bed Runner", "Bathrobe (2)", "Bath Towels (6)", "Hand Towels (4)", "Soap Bar (3)", "Shampoo", "Conditioner", "Body Lotion", "Dental Kit (2)", "Coffee/Tea Tray", "Minibar Bottles (8)", "Living Cushions (4)", "Welcome Card", "Fruit Basket", "TV Remote", "Curtain Tie-backs"],
    checkpoints: ["Pillow count (6)", "Pillow arrangement (fan)", "Bed runner position", "Throw cushions", "Remote angle", "Lamp alignment (L)", "Lamp alignment (R)", "Towel fold type", "Towel count", "Bathrobe placement", "Soap count", "Shampoo position", "Dental kit count", "Minibar bottles", "Living area cushions", "Curtain symmetry", "Welcome card", "Fruit basket"],
    versionHistory: [
      { date: "5 Feb 2026", label: "Current Version", note: "Added fruit basket checkpoint", active: true },
      { date: "12 Jan 2026", label: "Previous Version", note: "Standard detection points", active: false },
      { date: "1 Jun 2025", label: "Initial Setup", note: "First master photos captured", active: false },
    ]
  },
  { name: "Deluxe Suite", count: 12, icon: Crown, lastUpdated: "5 Feb 2026", detectionPoints: 22, color: "purple",
    zones: ["Bedroom", "Bathroom", "Living Room", "Dining Area", "Minibar", "Entrance", "Balcony"],
    products: ["King Pillow Set (6)", "Throw Cushions (4)", "Bed Runner", "Bathrobe (2)", "Bath Towels (8)", "Hand Towels (4)", "Amenity Arc Set", "Dental Kit (2)", "Dining Setting (2)", "Coffee Table Set", "Minibar Bottles (10)", "Minibar Snacks", "Living Cushions (6)", "Balcony Cushions (2)", "Fresh Flowers", "Welcome Card", "Menu Card", "TV Remote (2)", "Curtain Tie-backs (3)"],
    checkpoints: ["King bed setup", "Pillow arrangement (luxury)", "Bed runner", "Throw cushions (bedroom)", "Bathrobe (L)", "Bathrobe (R)", "Towel count", "Towel fold type", "Amenity arc", "Dental kits", "Remote + menu card", "Lamp alignment (L)", "Lamp alignment (R)", "Living room cushions", "Coffee table arrangement", "Dining table setting", "Minibar bottles", "Minibar snacks", "Curtain symmetry", "Balcony furniture", "Welcome card", "Flower arrangement"],
    versionHistory: [
      { date: "5 Feb 2026", label: "Current Version", note: "Post-suite renovation", active: true },
      { date: "15 Sep 2025", label: "Previous Version", note: "Standard suite layout", active: false },
    ]
  },
  { name: "Presidential Suite", count: 4, icon: Star, lastUpdated: "20 Feb 2026", detectionPoints: 28, color: "amber",
    zones: ["Master Bedroom", "Master Bathroom", "Guest Bathroom", "Living Room", "Dining Room", "Study", "Minibar", "Entrance", "Balcony"],
    products: ["King Pillow Set (8)", "Throw Cushions (6)", "Silk Bed Runner", "Bathrobe (3)", "Bath Towels (12)", "Hand Towels (6)", "Premium Amenity Set", "Dental Kit (3)", "Dining Setting (6)", "Crystal Glassware", "Premium Minibar", "Gourmet Snacks", "Fresh Flowers (3)", "Welcome Hamper", "Art Coffee Table Book", "TV Remote (3)"],
    checkpoints: Array.from({ length: 28 }, (_, i) => `Detection Point ${i + 1}`),
    versionHistory: [
      { date: "20 Feb 2026", label: "Current Version", note: "VIP-level detail update", active: true },
      { date: "5 Feb 2026", label: "Previous Version", note: "Standard presidential layout", active: false },
    ]
  },
  { name: "Accessible Room", count: 6, icon: Accessibility, lastUpdated: "12 Jan 2026", detectionPoints: 16, color: "emerald",
    zones: ["Bed Area", "Accessible Bathroom", "Desk Area", "Minibar", "Entrance"],
    products: ["Pillow Set (4)", "Bed Runner", "Grab Bar Towels (4)", "Non-slip Mat (2)", "Soap Bar (2)", "Shampoo", "Conditioner", "Body Lotion", "Dental Kit (2)", "Lowered Coffee Tray", "Minibar Bottles (6)", "Welcome Card", "Large Remote", "Curtain Tie-backs"],
    checkpoints: Array.from({ length: 16 }, (_, i) => `Detection Point ${i + 1}`),
    versionHistory: [
      { date: "12 Jan 2026", label: "Current Version", note: "ADA compliance update", active: true },
      { date: "1 Jun 2025", label: "Initial Setup", note: "First master photos captured", active: false },
    ]
  },
];

/* ── Floor-based Room Data ── */
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
    };
  });
};

const floorNumbers = [2, 3, 4, 5, 6, 7, 8];

/* ── Room checklist ── */
const generateChecklist = (roomNum: string) => {
  const seed = parseInt(roomNum) || 0;
  const items = [
    "Dustbin", "Bed & Pillows", "Bed Linen", "Towels (Bathroom)",
    "Towels (Bedroom)", "Coffee/Tea Tray", "Minibar", "Bathroom Amenities",
    "TV Remote", "Curtains", "Wardrobe", "Welcome Items",
  ];
  return items.map((name, i) => ({
    name,
    status: ((seed + i) * 37) % 100 < 75 ? 'pass' : 'fail',
  }));
};

const colorMap: Record<string, { bg: string; border: string; text: string; iconBg: string; gradient: string; accent: string }> = {
  blue: { bg: 'from-blue-50/90 to-blue-100/50', border: 'border-blue-200', text: 'text-white', iconBg: 'bg-gradient-to-br from-blue-400 to-blue-600 shadow-lg shadow-blue-200', gradient: 'from-blue-500 to-blue-600', accent: 'bg-blue-500' },
  slate: { bg: 'from-slate-50/90 to-slate-100/50', border: 'border-slate-200', text: 'text-white', iconBg: 'bg-gradient-to-br from-slate-400 to-slate-600 shadow-lg shadow-slate-200', gradient: 'from-slate-500 to-slate-600', accent: 'bg-slate-500' },
  amber: { bg: 'from-amber-50/90 to-amber-100/50', border: 'border-amber-200', text: 'text-white', iconBg: 'bg-gradient-to-br from-amber-400 to-amber-600 shadow-lg shadow-amber-200', gradient: 'from-amber-500 to-amber-600', accent: 'bg-amber-500' },
  purple: { bg: 'from-purple-50/90 to-purple-100/50', border: 'border-purple-200', text: 'text-white', iconBg: 'bg-gradient-to-br from-purple-400 to-purple-600 shadow-lg shadow-purple-200', gradient: 'from-purple-500 to-purple-600', accent: 'bg-purple-500' },
  emerald: { bg: 'from-emerald-50/90 to-emerald-100/50', border: 'border-emerald-200', text: 'text-white', iconBg: 'bg-gradient-to-br from-emerald-400 to-emerald-600 shadow-lg shadow-emerald-200', gradient: 'from-emerald-500 to-emerald-600', accent: 'bg-emerald-500' },
};

const iconForType = (type: string) => {
  if (type.includes('Presidential')) return Star;
  if (type.includes('Suite') || type.includes('Deluxe')) return Crown;
  if (type.includes('Accessible')) return Accessibility;
  return Bed;
};

type ViewMode = 'types' | 'rooms';

/* ═══ Zone Photo Names for Modal ═══ */
const zoneDetails: Record<string, string[]> = {
  "Bed Area": ["Bed front view", "Pillow arrangement", "Bed runner detail"],
  "Bathroom": ["Vanity setup", "Towel rack", "Shower area"],
  "Desk Area": ["Desk overview", "Welcome items", "Remote placement"],
  "Minibar": ["Drinks arrangement", "Snack tray", "Water bottles"],
  "Entrance": ["Door view", "Wardrobe", "Closet interior"],
};

/* ═══ Full Report Modal ═══ */
const ReportModal = ({ room, onClose }: { room: ReturnType<typeof generateFloorRooms>[0]; onClose: () => void }) => {
  const checklist = generateChecklist(room.number);
  const passCount = checklist.filter(c => c.status === 'pass').length;
  const failCount = checklist.filter(c => c.status === 'fail').length;
  const passRate = Math.round((passCount / checklist.length) * 100);
  const zones = ["Bed Area", "Bathroom", "Desk Area", "Minibar", "Entrance"];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-4xl mx-4 max-h-[92vh] overflow-hidden animate-fade-in-up">
        {/* Header */}
        <div className="flex items-center justify-between px-8 py-5 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white sticky top-0 z-10">
          <div className="flex items-center gap-4">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-md ${
              room.status === 'pass' ? 'bg-emerald-100' : room.status === 'fail' ? 'bg-rose-100' : 'bg-slate-100'
            }`}>
              {React.createElement(iconForType(room.type), { size: 22, className: room.status === 'pass' ? 'text-emerald-600' : room.status === 'fail' ? 'text-rose-600' : 'text-slate-400' })}
            </div>
            <div>
              <h2 className="text-xl font-black text-slate-900">Room {room.number} — Full Inspection Report</h2>
              <p className="text-sm text-slate-400">{room.type} · Floor {room.floor}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2.5 rounded-xl hover:bg-slate-100 transition-all">
            <X size={20} className="text-slate-400" />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(92vh-80px)] p-8 space-y-7">
          {/* Summary Strip */}
          <div className="grid grid-cols-4 gap-4">
            {[
              { label: 'Pass Rate', value: `${passRate}%`, color: passRate >= 80 ? 'text-emerald-600' : passRate >= 60 ? 'text-amber-600' : 'text-rose-600' },
              { label: 'Passed', value: `${passCount}`, color: 'text-emerald-600' },
              { label: 'Failed', value: `${failCount}`, color: failCount > 0 ? 'text-rose-600' : 'text-emerald-600' },
              { label: 'Scan Time', value: room.lastScan, color: 'text-blue-600' },
            ].map((kpi) => (
              <div key={kpi.label} className="bg-slate-50 rounded-2xl p-5 text-center border border-slate-100">
                <span className={`text-3xl font-black ${kpi.color}`}>{kpi.value}</span>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-1">{kpi.label}</p>
              </div>
            ))}
          </div>

          {/* Info Bar */}
          <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl text-sm text-slate-500 border border-slate-100">
            <span className="flex items-center gap-1.5"><User size={14} /> <strong className="text-slate-700">{room.housekeeper || 'Unassigned'}</strong></span>
            <div className="h-4 w-px bg-slate-200" />
            <span className="flex items-center gap-1.5"><Clock size={14} /> Scanned at {room.lastScan}</span>
            <div className="h-4 w-px bg-slate-200" />
            <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase ${
              room.status === 'pass' ? 'bg-emerald-50 text-emerald-600 border border-emerald-200' :
              room.status === 'fail' ? 'bg-rose-50 text-rose-600 border border-rose-200' :
              'bg-slate-100 text-slate-400'
            }`}>
              {room.status === 'pass' ? 'Passed' : room.status === 'fail' ? 'Issues Found' : 'Pending'}
            </span>
          </div>

          {/* ── Zone Photos ── */}
          <div>
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.3em] mb-4">Zone Photos — Captured vs Master</h3>
            <div className="grid grid-cols-5 gap-4">
              {zones.map((zone) => (
                <div key={zone} className="space-y-2">
                  <div className="aspect-[4/3] bg-slate-50 rounded-xl border border-slate-100 flex flex-col items-center justify-center gap-2 hover:bg-slate-100 hover:shadow-md transition-all cursor-pointer">
                    <Camera size={22} className="text-slate-300" />
                    <span className="text-[10px] font-bold text-slate-400">Captured</span>
                  </div>
                  <div className="aspect-[4/3] bg-blue-50/50 rounded-xl border border-blue-100 flex flex-col items-center justify-center gap-2 hover:bg-blue-50 hover:shadow-md transition-all cursor-pointer">
                    <ScanSearch size={22} className="text-blue-300" />
                    <span className="text-[10px] font-bold text-blue-400">Master</span>
                  </div>
                  <p className="text-[10px] font-bold text-slate-500 text-center">{zone}</p>
                </div>
              ))}
            </div>
          </div>

          {/* ── Component Checklist ── */}
          <div>
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.3em] mb-4">Component-Level Results</h3>
            <div className="space-y-2">
              {checklist.map((item, j) => (
                <div key={j} className={`flex items-center gap-3 p-3.5 rounded-xl transition-all ${
                  item.status === 'pass' ? 'bg-emerald-50/60 hover:bg-emerald-50' : 'bg-rose-50/60 hover:bg-rose-50'
                }`}>
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                    item.status === 'pass' ? 'bg-emerald-100' : 'bg-rose-100'
                  }`}>
                    {item.status === 'pass' ? <CheckCircle size={16} className="text-emerald-600" /> : <XCircle size={16} className="text-rose-600" />}
                  </div>
                  <span className="text-sm font-medium text-slate-700 flex-1">{item.name}</span>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1">
                      <div className="w-8 h-8 rounded bg-slate-100 border border-slate-200 flex items-center justify-center"><Eye size={10} className="text-slate-300" /></div>
                      <div className={`w-8 h-8 rounded border flex items-center justify-center ${item.status === 'pass' ? 'bg-emerald-50 border-emerald-200' : 'bg-rose-50 border-rose-200'}`}>
                        {item.status === 'pass' ? <CheckCircle size={10} className="text-emerald-500" /> : <XCircle size={10} className="text-rose-500" />}
                      </div>
                    </div>
                    <span className={`text-xs font-black uppercase w-8 ${item.status === 'pass' ? 'text-emerald-600' : 'text-rose-600'}`}>{item.status === 'pass' ? 'Pass' : 'Fail'}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Impact */}
          {failCount > 0 && (
            <div className="grid grid-cols-2 gap-4">
              <div className="p-5 bg-emerald-50 rounded-2xl border border-emerald-100">
                <div className="flex items-center gap-2 mb-1"><IndianRupee size={14} className="text-emerald-600" /><span className="text-[10px] font-black uppercase text-emerald-600 tracking-wider">Cost Avoided</span></div>
                <span className="text-2xl font-black text-emerald-700">₹{(failCount * 600).toLocaleString()}</span>
              </div>
              <div className="p-5 bg-blue-50 rounded-2xl border border-blue-100">
                <div className="flex items-center gap-2 mb-1"><RotateCw size={14} className="text-blue-600" /><span className="text-[10px] font-black uppercase text-blue-600 tracking-wider">Resolution Time</span></div>
                <span className="text-2xl font-black text-blue-700">{failCount * 8} min</span>
              </div>
            </div>
          )}

          {/* Footer Buttons */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-100">
            <button className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200">
              <Download size={16} />
              Download PDF Report
            </button>
            <button onClick={onClose} className="flex items-center gap-2 px-6 py-3 bg-slate-100 text-slate-600 rounded-xl text-sm font-bold hover:bg-slate-200 transition-all">
              <X size={16} />
              Close Report
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ═══ Image Categories ═══ */
const imageCategories = ["Absence / Presence Check", "Defect Detection", "Orientation / Alignment Check", "Barcode / QR Code Verification"];

/* ═══ Custom Image Type ═══ */
type CustomImage = { name: string; code: string; image: string; categories: string[] };

/* ═══ Add Image Modal (2-step) ═══ */
const AddImageModal = ({ sectionType, onClose, onSave }: { sectionType: 'zone' | 'product'; onClose: () => void; onSave: (data: CustomImage) => void }) => {
  const [step, setStep] = useState(1);
  const [itemName, setItemName] = useState('');
  const [itemCode, setItemCode] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<Set<string>>(new Set());
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [savedDraft, setSavedDraft] = useState(false);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const toggleCategory = (cat: string) => {
    setSelectedCategories(prev => {
      const next = new Set(prev);
      if (next.has(cat)) next.delete(cat); else next.add(cat);
      return next;
    });
  };

  const startCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' }, audio: false });
      streamRef.current = stream;
      setIsCameraOpen(true);
      setTimeout(() => { if (videoRef.current) { videoRef.current.srcObject = stream; videoRef.current.play(); } }, 100);
    } catch { alert('Camera access denied or not available.'); }
  }, []);

  const capturePhoto = useCallback(() => {
    if (!videoRef.current) return;
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth || 640;
    canvas.height = videoRef.current.videoHeight || 480;
    const ctx = canvas.getContext('2d');
    if (ctx) ctx.drawImage(videoRef.current, 0, 0);
    setImagePreview(canvas.toDataURL('image/jpeg', 0.85));
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
    reader.onload = (ev) => { if (ev.target?.result) setImagePreview(ev.target.result as string); };
    reader.readAsDataURL(file);
  };

  const removeImage = () => { setImagePreview(null); stopCamera(); };

  // Cleanup camera on close
  const handleClose = () => { stopCamera(); onClose(); };

  const hasImage = !!imagePreview;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={handleClose} />
      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-hidden animate-fade-in-up">
        {/* Header */}
        <div className="flex items-center justify-between px-7 py-5 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white">
          <h2 className="text-lg font-black text-slate-900">
            {sectionType === 'zone' ? 'Add Zone Image' : 'Add Product Image'}
          </h2>
          <button onClick={handleClose} className="p-2 rounded-xl hover:bg-slate-100 transition-all"><X size={20} className="text-slate-400" /></button>
        </div>

        {/* Step Indicator */}
        <div className="px-7 py-4 flex items-center gap-3 border-b border-slate-50">
          <div className={`flex items-center gap-2 ${step === 1 ? 'text-blue-600' : 'text-slate-400'}`}>
            <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${step === 1 ? 'bg-blue-600 text-white' : 'bg-emerald-500 text-white'}`}>{step > 1 ? <Check size={14} /> : '1'}</div>
            <span className={`text-sm font-bold ${step === 1 ? 'text-blue-600' : 'text-slate-400'}`}>
              {sectionType === 'zone' ? 'Zone' : 'Product'} & Inspection
            </span>
          </div>
          <div className="w-8 h-px bg-slate-200" />
          <div className={`flex items-center gap-2 ${step === 2 ? 'text-blue-600' : 'text-slate-400'}`}>
            <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${step === 2 ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-500'}`}>2</div>
            <span className={`text-sm font-bold ${step === 2 ? 'text-blue-600' : 'text-slate-400'}`}>Review & Save</span>
          </div>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-200px)] p-7">
          {step === 1 ? (
            <div className="space-y-6">
              {/* Name + Code */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-600 block mb-1.5">
                    {sectionType === 'zone' ? 'Zone Name' : 'Product Name'} <span className="text-slate-300">(e.g., {sectionType === 'zone' ? 'Bed Area' : 'Engine Block V8'})</span>
                  </label>
                  <input type="text" value={itemName} onChange={e => setItemName(e.target.value)} placeholder={sectionType === 'zone' ? 'e.g., Bed Area' : 'e.g., Pillow Set'} className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-300 transition-all" />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-600 block mb-1.5">Code (Unique ID)</label>
                  <input type="text" value={itemCode} onChange={e => setItemCode(e.target.value)} placeholder="e.g., EBV8-2025" className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-300 transition-all" />
                </div>
              </div>

              <div className="h-px bg-slate-100" />

              {/* Inspection Images */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-bold text-slate-900">Inspection Images & Categories</h3>
                  <button className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 text-slate-600 rounded-lg text-xs font-bold hover:bg-slate-200 transition-all">
                    <Plus size={12} /> Add Image
                  </button>
                </div>

                <div className="border border-slate-200 rounded-2xl p-5">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm font-bold text-blue-600">New Inspection Image</span>
                    <div className="flex items-center gap-2">
                      <button className="px-3 py-1 bg-slate-100 text-slate-500 rounded-lg text-xs font-bold hover:bg-slate-200 transition-all">Hide</button>
                      <button onClick={removeImage} className="px-3 py-1 bg-rose-500 text-white rounded-lg text-xs font-bold hover:bg-rose-600 transition-all">Remove</button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold text-slate-600">Upload or Capture Image</span>
                    <div className="flex items-center gap-2">
                      <button onClick={startCamera} className={`p-2 rounded-lg transition-all ${isCameraOpen ? 'bg-blue-100 text-blue-600' : 'bg-slate-100 hover:bg-blue-100 hover:text-blue-600'}`} title="Open Camera">
                        <Camera size={16} className={isCameraOpen ? 'text-blue-600' : 'text-slate-500'} />
                      </button>
                      {isCameraOpen && <div className="w-3 h-3 rounded-full bg-rose-500 animate-pulse" title="Camera active" />}
                    </div>
                  </div>

                  {/* Camera / Upload / Preview Area */}
                  <div className="mb-5">
                    {isCameraOpen ? (
                      <div className="space-y-3">
                        <div className="relative w-full aspect-[4/3] max-w-sm rounded-xl overflow-hidden border-2 border-blue-200 bg-black">
                          <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
                        </div>
                        <div className="flex items-center gap-2">
                          <button onClick={capturePhoto} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold hover:bg-blue-700 transition-all shadow-sm">
                            <Camera size={14} /> Capture Photo
                          </button>
                          <button onClick={stopCamera} className="px-4 py-2 bg-slate-100 text-slate-600 rounded-xl text-xs font-bold hover:bg-slate-200 transition-all">
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : imagePreview ? (
                      <div className="relative w-52 h-40 rounded-xl overflow-hidden border-2 border-emerald-200">
                        <img src={imagePreview} alt="Captured" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 hover:opacity-100 transition-all">
                          <button onClick={removeImage} className="px-3 py-1.5 bg-white text-rose-600 rounded-lg text-xs font-bold shadow-lg">Remove</button>
                        </div>
                        <div className="absolute top-2 right-2 w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center shadow-md">
                          <Check size={14} className="text-white" />
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center gap-3">
                        <label className="w-44 h-36 rounded-xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-blue-300 hover:bg-blue-50/30 transition-all">
                          <Upload size={22} className="text-slate-300" />
                          <span className="text-xs text-slate-400 font-bold">Select from Gallery</span>
                          <input type="file" accept="image/*" className="hidden" onChange={handleFileUpload} />
                        </label>
                        <button onClick={startCamera} className="w-44 h-36 rounded-xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center gap-2 hover:border-blue-300 hover:bg-blue-50/30 transition-all">
                          <Camera size={22} className="text-slate-300" />
                          <span className="text-xs text-slate-400 font-bold">Capture with Camera</span>
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Categories */}
                  <div>
                    <span className="text-xs font-bold text-slate-600 block mb-3">Select one or more categories for this Image</span>
                    <div className="flex flex-wrap gap-2">
                      {imageCategories.map(cat => (
                        <button key={cat} onClick={() => toggleCategory(cat)}
                          className={`px-3.5 py-2 rounded-xl border text-xs font-medium transition-all duration-200 ${
                            selectedCategories.has(cat)
                              ? 'bg-blue-600 border-blue-600 text-white shadow-sm'
                              : 'bg-white border-slate-200 text-slate-600 hover:border-blue-300 hover:text-blue-600'
                          }`}>
                          {cat}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* Step 2: Review & Save */
            <div className="space-y-5">
              <h3 className="text-base font-bold text-slate-900">Review & Save</h3>

              <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200">
                <h4 className="text-sm font-bold text-blue-600 mb-2">
                  {sectionType === 'zone' ? 'Zone' : 'Product'} Details
                </h4>
                <p className="text-sm text-slate-600"><strong>Name:</strong> {itemName || '—'}</p>
                <p className="text-sm text-slate-600"><strong>Code:</strong> {itemCode || '—'}</p>
              </div>

              <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200">
                <h4 className="text-sm font-bold text-blue-600 mb-2">Inspection Areas</h4>
                {hasImage ? (
                  <div className="flex items-center gap-4 p-3 bg-white rounded-xl border border-slate-200">
                    {imagePreview && <img src={imagePreview} alt="Preview" className="w-16 h-16 rounded-lg object-cover border border-slate-200" />}
                    <div>
                      <p className="text-sm font-bold text-blue-600">Inspection 1</p>
                      <p className="text-xs text-slate-500">Categories: {selectedCategories.size > 0 ? Array.from(selectedCategories).join(', ') : 'None selected'}</p>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-slate-400">No inspection images added</p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-7 py-4 border-t border-slate-100 flex items-center justify-between">
          {step === 1 ? (
            <>
              <button onClick={handleClose} className="px-5 py-2.5 bg-white border border-slate-200 text-slate-600 rounded-xl text-sm font-bold hover:bg-slate-50 transition-all">Cancel</button>
              <button onClick={() => setStep(2)} className="px-6 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700 transition-all shadow-sm">Next</button>
            </>
          ) : (
            <>
              <button onClick={() => setStep(1)} className="px-5 py-2.5 bg-white border border-slate-200 text-slate-600 rounded-xl text-sm font-bold hover:bg-slate-50 transition-all">Back</button>
              <div className="flex items-center gap-2">
                <button onClick={() => { setSavedDraft(true); setTimeout(handleClose, 800); }} className="px-5 py-2.5 bg-white border border-slate-200 text-slate-600 rounded-xl text-sm font-bold hover:bg-slate-50 transition-all">
                  {savedDraft ? '✓ Saved' : 'Save Draft'}
                </button>
                <button onClick={() => { onSave({ name: itemName, code: itemCode, image: imagePreview || '', categories: Array.from(selectedCategories) }); handleClose(); }} className="px-6 py-2.5 bg-slate-900 text-white rounded-xl text-sm font-bold hover:bg-slate-800 transition-all shadow-sm">Approve & Submit</button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

/* ═══ Version History Modal ═══ */
const VersionHistoryModal = ({ roomType, onClose }: { roomType: typeof roomTypes[0]; onClose: () => void }) => {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-lg mx-4 overflow-hidden animate-fade-in-up">
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-blue-50 rounded-xl"><History size={20} className="text-blue-600" /></div>
            <div>
              <h3 className="text-lg font-black text-slate-900">Version History</h3>
              <p className="text-xs text-slate-400">{roomType.name} — Master Reference</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-slate-100 transition-all"><X size={20} className="text-slate-400" /></button>
        </div>
        <div className="p-6 space-y-4">
          {roomType.versionHistory.map((v, j) => (
            <div key={j} className={`relative flex gap-4 ${j < roomType.versionHistory.length - 1 ? '' : ''}`}>
              {/* Timeline line */}
              {j < roomType.versionHistory.length - 1 && (
                <div className="absolute left-[13px] top-8 w-0.5 h-full bg-slate-100" />
              )}
              {/* Dot */}
              <div className={`relative z-10 w-7 h-7 rounded-full flex items-center justify-center shrink-0 mt-1 ${
                v.active ? 'bg-blue-600 shadow-md shadow-blue-200' : 'bg-slate-200'
              }`}>
                {v.active ? <Check size={14} className="text-white" /> : <div className="w-2 h-2 rounded-full bg-slate-400" />}
              </div>
              {/* Content */}
              <div className={`flex-1 p-4 rounded-2xl border ${v.active ? 'bg-blue-50/50 border-blue-200' : 'bg-slate-50 border-slate-200'}`}>
                <div className="flex items-center justify-between mb-1">
                  <span className={`text-sm font-bold ${v.active ? 'text-blue-700' : 'text-slate-600'}`}>{v.label}</span>
                  <span className="text-xs text-slate-400">{v.date}</span>
                </div>
                <p className="text-xs text-slate-500">{v.note}</p>
                {v.active && <span className="inline-block mt-2 px-2 py-0.5 bg-blue-600 text-white rounded-md text-[9px] font-black uppercase">Active</span>}
              </div>
            </div>
          ))}
        </div>
        <div className="px-6 py-4 border-t border-slate-100 flex justify-end">
          <button onClick={onClose} className="px-5 py-2.5 bg-slate-100 text-slate-600 rounded-xl text-sm font-bold hover:bg-slate-200 transition-all">Close</button>
        </div>
      </div>
    </div>
  );
};

/* ═══ Custom Room Type ═══ */
type CustomRoom = { number: string; type: string; floor: number; status: 'pass' | 'fail' | 'pending'; lastScan: string; issues: number; housekeeper?: string; notes?: string };

/* ═══ Add Room Modal (2-step) ═══ */
const AddRoomModal = ({ floor, onClose, onSave }: { floor: number; onClose: () => void; onSave: (room: CustomRoom) => void }) => {
  const [step, setStep] = useState(1);
  const [roomNumber, setRoomNumber] = useState(`${floor}50`);
  const [roomType, setRoomType] = useState('Standard Double');
  const [housekeeper, setHousekeeper] = useState('');
  const [notes, setNotes] = useState('');

  const roomTypeOptions = ['Standard Double', 'Standard Twin', 'Deluxe King', 'Deluxe Suite', 'Presidential Suite', 'Accessible Room'];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-lg mx-4 max-h-[90vh] overflow-hidden animate-fade-in-up">
        <div className="flex items-center justify-between px-7 py-5 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white">
          <h2 className="text-lg font-black text-slate-900">Add Room to Floor {floor}</h2>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-slate-100 transition-all"><X size={20} className="text-slate-400" /></button>
        </div>

        <div className="px-7 py-4 flex items-center gap-3 border-b border-slate-50">
          <div className={`flex items-center gap-2 ${step === 1 ? 'text-blue-600' : 'text-slate-400'}`}>
            <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${step === 1 ? 'bg-blue-600 text-white' : 'bg-emerald-500 text-white'}`}>{step > 1 ? <Check size={14} /> : '1'}</div>
            <span className={`text-sm font-bold ${step === 1 ? 'text-blue-600' : 'text-slate-400'}`}>Room Details</span>
          </div>
          <div className="w-8 h-px bg-slate-200" />
          <div className={`flex items-center gap-2 ${step === 2 ? 'text-blue-600' : 'text-slate-400'}`}>
            <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${step === 2 ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-500'}`}>2</div>
            <span className={`text-sm font-bold ${step === 2 ? 'text-blue-600' : 'text-slate-400'}`}>Review & Add</span>
          </div>
        </div>

        <div className="overflow-y-auto max-h-[calc(90vh-220px)] p-7">
          {step === 1 ? (
            <div className="space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-600 block mb-1.5">Room Number</label>
                  <input type="text" value={roomNumber} onChange={e => setRoomNumber(e.target.value)} placeholder="e.g., 205" className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-300 transition-all" />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-600 block mb-1.5">Floor</label>
                  <div className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-500 font-medium">Floor {floor}</div>
                </div>
              </div>
              <div>
                <label className="text-xs font-bold text-slate-600 block mb-1.5">Room Type</label>
                <div className="grid grid-cols-2 gap-2">
                  {roomTypeOptions.map(t => (
                    <button key={t} onClick={() => setRoomType(t)} className={`px-3 py-2.5 rounded-xl border text-xs font-bold transition-all ${roomType === t ? 'bg-blue-600 border-blue-600 text-white shadow-sm' : 'bg-white border-slate-200 text-slate-600 hover:border-blue-300'}`}>
                      {t}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-xs font-bold text-slate-600 block mb-1.5">Assigned Housekeeper <span className="text-slate-300">(optional)</span></label>
                <input type="text" value={housekeeper} onChange={e => setHousekeeper(e.target.value)} placeholder="e.g., Priya S." className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-300 transition-all" />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-600 block mb-1.5">Notes <span className="text-slate-300">(optional)</span></label>
                <textarea value={notes} onChange={e => setNotes(e.target.value)} placeholder="Any special instructions..." rows={2} className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-300 transition-all resize-none" />
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <h3 className="text-base font-bold text-slate-900">Review & Approve</h3>
              <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                <p className="text-sm text-slate-600"><strong>Room:</strong> {roomNumber}</p>
                <p className="text-sm text-slate-600"><strong>Floor:</strong> {floor}</p>
                <p className="text-sm text-slate-600"><strong>Type:</strong> {roomType}</p>
                {housekeeper && <p className="text-sm text-slate-600"><strong>Housekeeper:</strong> {housekeeper}</p>}
                {notes && <p className="text-sm text-slate-600"><strong>Notes:</strong> {notes}</p>}
              </div>
              <div className="p-4 bg-blue-50 rounded-xl border border-blue-100">
                <p className="text-xs text-blue-700 font-medium">This room will be added to Floor {floor} with <strong>Pending</strong> status until inspected.</p>
              </div>
            </div>
          )}
        </div>

        <div className="px-7 py-4 border-t border-slate-100 flex items-center justify-between">
          {step === 1 ? (
            <>
              <button onClick={onClose} className="px-5 py-2.5 bg-white border border-slate-200 text-slate-600 rounded-xl text-sm font-bold hover:bg-slate-50 transition-all">Cancel</button>
              <button onClick={() => setStep(2)} className="px-6 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700 transition-all shadow-sm">Next</button>
            </>
          ) : (
            <>
              <button onClick={() => setStep(1)} className="px-5 py-2.5 bg-white border border-slate-200 text-slate-600 rounded-xl text-sm font-bold hover:bg-slate-50 transition-all">Back</button>
              <button onClick={() => { onSave({ number: roomNumber, type: roomType, floor, status: 'pending', lastScan: '—', issues: 0, housekeeper: housekeeper || undefined, notes: notes || undefined }); onClose(); }} className="px-6 py-2.5 bg-slate-900 text-white rounded-xl text-sm font-bold hover:bg-slate-800 transition-all shadow-sm">Approve & Add Room</button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};


/* ═══════ Main Component ═══════ */
export default function MasterGallery() {
  const [selectedType, setSelectedType] = useState<number | null>(null);
  const [showOverlay, setShowOverlay] = useState(false);
  const [selectedCheckpoints, setSelectedCheckpoints] = useState<Set<number>>(new Set());
  const [viewMode, setViewMode] = useState<ViewMode>('types');
  const [roomSearch, setRoomSearch] = useState('');
  const [selectedFloor, setSelectedFloor] = useState(2);
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null);
  const [reportRoom, setReportRoom] = useState<ReturnType<typeof generateFloorRooms>[0] | null>(null);
  const [showVersionHistory, setShowVersionHistory] = useState(false);
  const [updateRequested, setUpdateRequested] = useState(false);
  const [addImageModal, setAddImageModal] = useState<'zone' | 'product' | null>(null);
  const [selectedProducts, setSelectedProducts] = useState<Set<number>>(new Set());
  const [overlaySection, setOverlaySection] = useState<'zones' | 'products'>('zones');
  const [customZoneImages, setCustomZoneImages] = useState<CustomImage[]>([]);
  const [customProductImages, setCustomProductImages] = useState<CustomImage[]>([]);
  const [removedZones, setRemovedZones] = useState<Set<number>>(new Set());
  const [removedProducts, setRemovedProducts] = useState<Set<number>>(new Set());
  const [showAddRoomModal, setShowAddRoomModal] = useState(false);
  const [customRooms, setCustomRooms] = useState<CustomRoom[]>([]);
  const [removedRoomZones, setRemovedRoomZones] = useState<Set<string>>(new Set());
  const [customRoomZones, setCustomRoomZones] = useState<CustomImage[]>([]);
  const [customRoomProducts, setCustomRoomProducts] = useState<CustomImage[]>([]);
  const [removedRoomProducts, setRemovedRoomProducts] = useState<Set<string>>(new Set());
  const [addRoomItemModal, setAddRoomItemModal] = useState<'zone' | 'product' | null>(null);
  const [roomDetailTab, setRoomDetailTab] = useState<'zones' | 'products'>('zones');
  const [editingCard, setEditingCard] = useState<{ section: 'zone' | 'product' | 'room-zone' | 'room-product'; index: number; isCustom: boolean } | null>(null);
  const [editCardName, setEditCardName] = useState('');
  const [editCardImage, setEditCardImage] = useState<string | null>(null);
  const [expandedChecklistItem, setExpandedChecklistItem] = useState<number | null>(null);

  const defaultZones = ["Bed Area", "Bathroom", "Desk Area", "Minibar", "Entrance"];
  const defaultProducts = ["Pillow Set", "Bath Towels", "Soap Bar", "Shampoo", "Dental Kit", "Minibar Bottles", "Welcome Card", "TV Remote"];

  const floorRooms = useMemo(() => generateFloorRooms(selectedFloor), [selectedFloor]);
  const allFloorRooms = useMemo(() => {
    const custom = customRooms.filter(r => r.floor === selectedFloor);
    return [...floorRooms, ...custom];
  }, [floorRooms, customRooms, selectedFloor]);
  const filteredRooms = allFloorRooms.filter(r =>
    r.number.includes(roomSearch) || r.type.toLowerCase().includes(roomSearch.toLowerCase())
  );
  const activeRoom = allFloorRooms.find(r => r.number === selectedRoom);
  const activeChecklist = selectedRoom ? generateChecklist(selectedRoom) : [];


  const handleToggleCheckpoint = (idx: number) => {
    setSelectedCheckpoints(prev => {
      const next = new Set(prev);
      if (next.has(idx)) next.delete(idx);
      else next.add(idx);
      return next;
    });
  };

  const handleSelectAllCheckpoints = (total: number) => {
    if (selectedCheckpoints.size === total) {
      setSelectedCheckpoints(new Set());
    } else {
      setSelectedCheckpoints(new Set(Array.from({ length: total }, (_, i) => i)));
    }
  };

  const handleRequestUpdate = () => {
    setUpdateRequested(true);
    setTimeout(() => setUpdateRequested(false), 3000);
  };

  const handleToggleProduct = (idx: number) => {
    setSelectedProducts(prev => {
      const next = new Set(prev);
      if (next.has(idx)) next.delete(idx); else next.add(idx);
      return next;
    });
  };

  const handleSelectAllProducts = (total: number) => {
    if (selectedProducts.size === total) setSelectedProducts(new Set());
    else setSelectedProducts(new Set(Array.from({ length: total }, (_, i) => i)));
  };

  // Reset checkpoint selection when changing room type
  const handleSelectType = (i: number) => {
    if (selectedType === i) {
      setSelectedType(null);
    } else {
      setSelectedType(i);
      setSelectedCheckpoints(new Set());
      setSelectedProducts(new Set());
      setShowOverlay(false);
    }
  };

  const handleSaveImage = (type: 'zone' | 'product', data: CustomImage) => {
    if (type === 'zone') setCustomZoneImages(prev => [...prev, data]);
    else setCustomProductImages(prev => [...prev, data]);
  };

  const handleRemoveZone = (idx: number) => {
    setRemovedZones(prev => { const next = new Set(prev); next.add(idx); return next; });
    setSelectedCheckpoints(prev => { const next = new Set(prev); next.delete(idx); return next; });
  };

  const handleRemoveProduct = (idx: number) => {
    setRemovedProducts(prev => { const next = new Set(prev); next.add(idx); return next; });
    setSelectedProducts(prev => { const next = new Set(prev); next.delete(idx); return next; });
  };

  const handleRemoveCustomZone = (idx: number) => setCustomZoneImages(prev => prev.filter((_, i) => i !== idx));
  const handleRemoveCustomProduct = (idx: number) => setCustomProductImages(prev => prev.filter((_, i) => i !== idx));

  const handleAddRoom = (room: CustomRoom) => setCustomRooms(prev => [...prev, room]);

  const handleRemoveRoomZone = (roomNum: string, zone: string) => {
    setRemovedRoomZones(prev => { const next = new Set(prev); next.add(`${roomNum}::${zone}`); return next; });
  };

  const handleSaveRoomItem = (type: 'zone' | 'product', data: CustomImage) => {
    if (type === 'zone') setCustomRoomZones(prev => [...prev, data]);
    else setCustomRoomProducts(prev => [...prev, data]);
  };

  const handleRemoveCustomRoomZone = (idx: number) => setCustomRoomZones(prev => prev.filter((_, i) => i !== idx));
  const handleRemoveCustomRoomProduct = (idx: number) => setCustomRoomProducts(prev => prev.filter((_, i) => i !== idx));
  const handleRemoveRoomProduct = (roomNum: string, product: string) => {
    setRemovedRoomProducts(prev => { const next = new Set(prev); next.add(`${roomNum}::${product}`); return next; });
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Report Modal */}
      {reportRoom && <ReportModal room={reportRoom} onClose={() => setReportRoom(null)} />}
      
      {/* Add Room Modal */}
      {showAddRoomModal && <AddRoomModal floor={selectedFloor} onClose={() => setShowAddRoomModal(false)} onSave={handleAddRoom} />}

      
      {/* Add Image Modal */}
      {addImageModal && <AddImageModal sectionType={addImageModal} onClose={() => setAddImageModal(null)} onSave={(data) => handleSaveImage(addImageModal, data)} />}

      {/* Add Room Item Modal (Zone/Product for individual room) */}
      {addRoomItemModal && <AddImageModal sectionType={addRoomItemModal} onClose={() => setAddRoomItemModal(null)} onSave={(data) => handleSaveRoomItem(addRoomItemModal, data)} />}
      
      {/* Version History Modal */}
      {showVersionHistory && selectedType !== null && (
        <VersionHistoryModal roomType={roomTypes[selectedType]} onClose={() => setShowVersionHistory(false)} />
      )}

      {/* Update Requested Toast */}
      {updateRequested && (
        <div className="fixed top-6 right-6 z-[200] animate-fade-in-up">
          <div className="flex items-center gap-3 px-5 py-4 bg-emerald-600 text-white rounded-2xl shadow-2xl shadow-emerald-300">
            <CheckCircle size={20} />
            <div>
              <p className="text-sm font-bold">Update Requested!</p>
              <p className="text-xs text-emerald-100">A new master photo shoot has been scheduled for review.</p>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between animate-fade-in-up">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-slate-900">Master Gallery</h1>
          <p className="text-sm text-slate-400 font-medium mt-0.5">Room type references & room-level checklist gallery</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 bg-slate-100 rounded-xl p-1">
            <button onClick={() => { setViewMode('types'); setSelectedRoom(null); }} className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${viewMode === 'types' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}>Room Types</button>
            <button onClick={() => { setViewMode('rooms'); setSelectedType(null); }} className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${viewMode === 'rooms' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}>Room Tracker</button>
          </div>
          <span className="px-4 py-2 bg-blue-50 text-blue-600 rounded-xl text-sm font-bold border border-blue-100">6 Room Types · 142 Total Rooms</span>
        </div>
      </div>

      {viewMode === 'types' ? (
        /* ═══════ ROOM TYPES VIEW ═══════ */
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 animate-fade-in-up stagger-1">
            {roomTypes.map((type, i) => {
              const colors = colorMap[type.color] || colorMap.blue;
              const Icon = type.icon;
              return (
                <div key={type.name} className={`rounded-[1.5rem] overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-1 active:scale-[0.98] border relative group ${selectedType === i ? 'ring-2 ring-blue-500 shadow-xl -translate-y-1' : 'shadow-sm'} bg-gradient-to-br ${colors.bg} ${colors.border || 'border-slate-200'}`} onClick={() => handleSelectType(i)}>
                  {/* Accent bar */}
                  <div className={`absolute top-0 left-0 right-0 h-1.5 ${colors.accent} z-10`} />
                  <div className={`aspect-[16/9] flex items-center justify-center relative`}>
                    <div className="text-center">
                      <div className={`w-14 h-14 rounded-2xl ${colors.iconBg} flex items-center justify-center mx-auto shadow-lg transition-transform group-hover:scale-110 group-hover:rotate-[8deg]`}><Icon size={28} className={colors.text} /></div>
                      <p className="text-sm font-bold text-slate-400 mt-3">Master Reference</p>
                    </div>
                    <div className="absolute top-3 right-3 px-3 py-1.5 bg-white/90 backdrop-blur-sm rounded-xl shadow-sm">
                      <span className="text-xs font-black text-slate-700">{type.detectionPoints} detection points</span>
                    </div>
                  </div>
                  <div className="p-5 bg-white/60 backdrop-blur-sm">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-base font-bold text-slate-900">{type.name}</h3>
                      <div className="w-7 h-7 rounded-full bg-white/80 flex items-center justify-center shadow-sm group-hover:bg-blue-600 group-hover:text-white transition-all">
                        <ChevronRight size={14} className={`transition-transform ${selectedType === i ? 'rotate-90 text-blue-500 group-hover:text-white' : 'text-slate-300 group-hover:text-white'}`} />
                      </div>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-slate-400">
                      <span className="flex items-center gap-1.5 px-2 py-1 bg-white/60 rounded-lg"><Bed size={12} /> {type.count} rooms</span>
                      <span className="flex items-center gap-1.5 px-2 py-1 bg-white/60 rounded-lg"><Clock size={12} /> Updated {type.lastUpdated}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* ═══ Expanded Type Card — Polished ═══ */}
          {selectedType !== null && (
            <div className="rounded-3xl overflow-hidden animate-fade-in-up border border-slate-200 shadow-xl">
              {/* Gradient header */}
              <div className={`bg-gradient-to-r ${colorMap[roomTypes[selectedType].color]?.gradient || 'from-blue-500 to-blue-600'} px-8 py-6`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                      {React.createElement(roomTypes[selectedType].icon, { size: 28, className: 'text-white' })}
                    </div>
                    <div>
                      <h2 className="text-xl font-black text-white">{roomTypes[selectedType].name}</h2>
                      <p className="text-sm text-white/70 mt-0.5">{roomTypes[selectedType].zones.length} zones · {roomTypes[selectedType].detectionPoints} detection points · {roomTypes[selectedType].count} rooms</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => { setShowOverlay(!showOverlay); if (!showOverlay) setSelectedCheckpoints(new Set()); }}
                      className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all ${showOverlay ? 'bg-white text-slate-900' : 'bg-white/20 text-white hover:bg-white/30 backdrop-blur-sm'}`}
                    >
                      <Layers size={14} /> Checklist Overlay
                    </button>
                    <button onClick={() => setShowVersionHistory(true)} className="flex items-center gap-2 px-4 py-2.5 bg-white/20 text-white rounded-xl text-sm font-bold hover:bg-white/30 transition-all backdrop-blur-sm">
                      <History size={14} /> Version History
                    </button>
                    <button onClick={handleRequestUpdate} className="flex items-center gap-2 px-4 py-2.5 bg-white text-amber-600 rounded-xl text-sm font-bold hover:bg-amber-50 transition-all shadow-sm">
                      <RotateCcw size={14} /> Request Update
                    </button>
                  </div>
                </div>
              </div>

              {/* Body content */}
              <div className="bg-white p-8 space-y-6">
                {/* ═══ Toggle: Master Zones / Products ═══ */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 bg-slate-100 rounded-xl p-1">
                    <button onClick={() => setOverlaySection('zones')}
                      className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-base font-bold transition-all ${overlaySection === 'zones' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}>
                      <Eye size={16} /> Master Zones <span className="text-xs text-slate-400 font-medium ml-1">({roomTypes[selectedType].zones.length})</span>
                    </button>
                    <button onClick={() => setOverlaySection('products')}
                      className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-base font-bold transition-all ${overlaySection === 'products' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}>
                      <Package size={16} /> Products <span className="text-xs text-slate-400 font-medium ml-1">({roomTypes[selectedType].products.length})</span>
                    </button>
                  </div>
                  <div className="flex items-center gap-3">
                    {showOverlay && overlaySection === 'zones' && (
                      <>
                        <button onClick={() => handleSelectAllCheckpoints(roomTypes[selectedType].zones.length)} className="text-sm font-bold text-blue-600 hover:text-blue-700 transition-all">
                          {selectedCheckpoints.size === roomTypes[selectedType].zones.length ? 'Deselect All' : 'Select All'}
                        </button>
                        <button onClick={() => setAddImageModal('zone')} className="flex items-center gap-1.5 px-4 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700 transition-all shadow-sm">
                          <Plus size={14} /> Add Zone Images
                        </button>
                      </>
                    )}
                    {showOverlay && overlaySection === 'products' && (
                      <>
                        <button onClick={() => handleSelectAllProducts(roomTypes[selectedType].products.length)} className="text-sm font-bold text-purple-600 hover:text-purple-700 transition-all">
                          {selectedProducts.size === roomTypes[selectedType].products.length ? 'Deselect All' : 'Select All'}
                        </button>
                        <button onClick={() => setAddImageModal('product')} className="flex items-center gap-1.5 px-4 py-2.5 bg-purple-600 text-white rounded-xl text-sm font-bold hover:bg-purple-700 transition-all shadow-sm">
                          <Plus size={14} /> Add Product Images
                        </button>
                      </>
                    )}
                  </div>
                </div>

                {/* ═══ Zones Tab Content ═══ */}
                {overlaySection === 'zones' && (
                  <div>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                      {roomTypes[selectedType].zones.map((zone, zoneIdx) => {
                        if (removedZones.has(zoneIdx)) return null;
                        const isSelected = showOverlay && selectedCheckpoints.has(zoneIdx);
                        const isEditing = editingCard?.section === 'zone' && editingCard.index === zoneIdx && !editingCard.isCustom;
                        return (
                          <div key={zone} onClick={() => showOverlay && handleToggleCheckpoint(zoneIdx)}
                            className={`aspect-square rounded-2xl flex items-center justify-center flex-col gap-2 transition-all duration-300 cursor-pointer relative group ${
                              isSelected ? 'bg-blue-600 border-2 border-blue-500 shadow-xl shadow-blue-200 -translate-y-1'
                                : showOverlay ? 'bg-slate-50 border-2 border-dashed border-slate-200 hover:border-blue-300 hover:bg-blue-50 hover:-translate-y-0.5'
                                : 'bg-slate-50 border border-slate-100 hover:bg-slate-100 hover:shadow-lg hover:border-slate-200 hover:-translate-y-0.5'
                            }`}>
                            {isSelected && (<div className="absolute top-3 right-3 w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-md"><Check size={14} className="text-blue-600" /></div>)}
                            <button onClick={(e) => { e.stopPropagation(); handleRemoveZone(zoneIdx); }} className="absolute top-2 left-2 w-6 h-6 bg-rose-500 rounded-full flex items-center justify-center shadow-md opacity-0 group-hover:opacity-100 transition-all z-20 hover:bg-rose-600" title="Remove">
                              <X size={12} className="text-white" />
                            </button>
                            {!isSelected && (
                              <button onClick={(e) => { e.stopPropagation(); setEditingCard({ section: 'zone', index: zoneIdx, isCustom: false }); setEditCardName(zone); setEditCardImage(null); }} className="absolute top-2 right-2 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center shadow-md opacity-0 group-hover:opacity-100 transition-all z-20 hover:bg-blue-600" title="Edit">
                                <Pencil size={11} className="text-white" />
                              </button>
                            )}
                            {isEditing ? (
                              <div className="absolute inset-0 bg-white rounded-2xl border-2 border-blue-400 p-3 flex flex-col gap-2 z-30" onClick={(e) => e.stopPropagation()}>
                                <input type="text" value={editCardName} onChange={(e) => setEditCardName(e.target.value)} className="w-full px-2 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium outline-none focus:ring-1 focus:ring-blue-300" placeholder="Zone name" />
                                <label className="flex-1 flex items-center justify-center border border-dashed border-slate-200 rounded-lg cursor-pointer hover:bg-blue-50/50 transition-all">
                                  <div className="text-center">
                                    <Upload size={16} className="text-slate-300 mx-auto" />
                                    <span className="text-[9px] text-slate-400 block mt-1">Change Image</span>
                                  </div>
                                  <input type="file" accept="image/*" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) { const r = new FileReader(); r.onload = (ev) => { if (ev.target?.result) setEditCardImage(ev.target.result as string); }; r.readAsDataURL(f); }}} />
                                </label>
                                <div className="flex gap-1.5">
                                  <button onClick={() => setEditingCard(null)} className="flex-1 py-1.5 bg-slate-100 text-slate-500 rounded-lg text-[10px] font-bold hover:bg-slate-200 transition-all">Cancel</button>
                                  <button onClick={() => { setEditingCard(null); }} className="flex-1 py-1.5 bg-blue-600 text-white rounded-lg text-[10px] font-bold hover:bg-blue-700 transition-all">Save</button>
                                </div>
                              </div>
                            ) : (
                              <>
                                <Eye size={28} className={isSelected ? 'text-white/80' : 'text-slate-300 group-hover:text-slate-400 transition-colors'} />
                                <span className={`text-sm font-bold ${isSelected ? 'text-white' : 'text-slate-600'}`}>{zone}</span>
                                {showOverlay && !isSelected && <span className="text-xs text-slate-400 font-medium">Click to select</span>}
                              </>
                            )}
                          </div>
                        );
                      })}
                      {/* Custom added zone images */}
                      {customZoneImages.map((ci, ciIdx) => (
                        <div key={`custom-zone-${ciIdx}`} className="aspect-square rounded-2xl flex items-center justify-center flex-col gap-1.5 transition-all duration-300 relative group overflow-hidden border-2 border-emerald-200 bg-emerald-50 hover:shadow-lg hover:-translate-y-0.5 cursor-default">
                          {ci.image ? (
                            <img src={ci.image} alt={ci.name} className="absolute inset-0 w-full h-full object-cover rounded-2xl" />
                          ) : (
                            <Eye size={28} className="text-emerald-300" />
                          )}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent rounded-2xl" />
                          <div className="absolute bottom-2.5 left-3 right-3 z-10">
                            <span className="text-sm font-bold text-white drop-shadow-md block">{ci.name || 'Custom Zone'}</span>
                            {ci.code && <span className="text-[10px] text-white/70 font-medium">{ci.code}</span>}
                          </div>
                          <button onClick={() => handleRemoveCustomZone(ciIdx)} className="absolute top-2 left-2 w-6 h-6 bg-rose-500 rounded-full flex items-center justify-center shadow-md opacity-0 group-hover:opacity-100 transition-all z-20 hover:bg-rose-600" title="Remove">
                            <X size={12} className="text-white" />
                          </button>
                          <button onClick={() => { setEditingCard({ section: 'zone', index: ciIdx, isCustom: true }); setEditCardName(ci.name); setEditCardImage(ci.image); }} className="absolute top-2 right-2 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center shadow-md opacity-0 group-hover:opacity-100 transition-all z-20 hover:bg-blue-600" title="Edit">
                            <Pencil size={11} className="text-white" />
                          </button>
                        </div>
                      ))}
                    </div>
                    {showOverlay && selectedCheckpoints.size > 0 && (
                      <p className="text-sm text-blue-600 font-medium mt-3">{selectedCheckpoints.size} of {roomTypes[selectedType].zones.length} zones selected</p>
                    )}
                    {showOverlay && (
                      <div className="mt-5 pt-5 border-t border-slate-100">
                        <h4 className="text-sm font-black text-slate-400 uppercase tracking-[0.2em] mb-3">Zone Inspection Checklist</h4>
                        <div className="grid grid-cols-2 gap-2.5">
                          {roomTypes[selectedType].checkpoints.map((cp, j) => {
                            const pass = (j * 37 + 11) % 100 < 80;
                            return (
                              <div key={j} className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all hover:shadow-sm ${pass ? 'bg-emerald-50/60' : 'bg-rose-50/60'}`}>
                                <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${pass ? 'bg-emerald-100' : 'bg-rose-100'}`}>
                                  {pass ? <CheckCircle size={14} className="text-emerald-600" /> : <XCircle size={14} className="text-rose-600" />}
                                </div>
                                <span className="text-sm font-medium text-slate-700 flex-1">{cp}</span>
                                <span className={`text-xs font-black uppercase ${pass ? 'text-emerald-600' : 'text-rose-600'}`}>{pass ? 'Pass' : 'Fail'}</span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* ═══ Products Tab Content ═══ */}
                {overlaySection === 'products' && (
                  <div>
                    <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3">
                      {roomTypes[selectedType].products.map((product, pIdx) => {
                        if (removedProducts.has(pIdx)) return null;
                        const isSelected = showOverlay && selectedProducts.has(pIdx);
                        return (
                          <div key={pIdx} onClick={() => showOverlay && handleToggleProduct(pIdx)}
                            className={`aspect-square rounded-xl flex items-center justify-center flex-col gap-1.5 transition-all duration-300 cursor-pointer relative group ${
                              isSelected ? 'bg-purple-600 border-2 border-purple-500 shadow-lg shadow-purple-200 -translate-y-1'
                                : showOverlay ? 'bg-slate-50 border-2 border-dashed border-slate-200 hover:border-purple-300 hover:bg-purple-50 hover:-translate-y-0.5'
                                : 'bg-slate-50 border border-slate-100 hover:bg-slate-100 hover:shadow-md hover:border-slate-200 hover:-translate-y-0.5'
                            }`}>
                            {isSelected && (<div className="absolute top-2 right-2 w-5 h-5 bg-white rounded-full flex items-center justify-center shadow-md"><Check size={12} className="text-purple-600" /></div>)}
                            <button onClick={(e) => { e.stopPropagation(); handleRemoveProduct(pIdx); }} className="absolute top-1.5 left-1.5 w-5 h-5 bg-rose-500 rounded-full flex items-center justify-center shadow-md opacity-0 group-hover:opacity-100 transition-all z-20 hover:bg-rose-600" title="Remove">
                              <X size={10} className="text-white" />
                            </button>
                            {!isSelected && (
                              <button onClick={(e) => { e.stopPropagation(); setEditingCard({ section: 'product', index: pIdx, isCustom: false }); setEditCardName(product); setEditCardImage(null); }} className="absolute top-1.5 right-1.5 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center shadow-md opacity-0 group-hover:opacity-100 transition-all z-20 hover:bg-blue-600" title="Edit">
                                <Pencil size={9} className="text-white" />
                              </button>
                            )}
                            <Package size={20} className={isSelected ? 'text-white/80' : 'text-slate-300 group-hover:text-slate-400 transition-colors'} />
                            <span className={`text-xs font-bold text-center leading-tight px-1 ${isSelected ? 'text-white' : 'text-slate-600'}`}>{product}</span>
                          </div>
                        );
                      })}
                      {/* Custom added product images */}
                      {customProductImages.map((ci, ciIdx) => (
                        <div key={`custom-prod-${ciIdx}`} className="aspect-square rounded-xl flex items-center justify-center flex-col gap-1 transition-all duration-300 relative group overflow-hidden border-2 border-emerald-200 bg-emerald-50 hover:shadow-lg hover:-translate-y-0.5 cursor-default">
                          {ci.image ? (
                            <img src={ci.image} alt={ci.name} className="absolute inset-0 w-full h-full object-cover rounded-xl" />
                          ) : (
                            <Package size={20} className="text-emerald-300" />
                          )}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent rounded-xl" />
                          <div className="absolute bottom-1.5 left-2 right-2 z-10">
                            <span className="text-xs font-bold text-white drop-shadow-md block leading-tight">{ci.name || 'Custom Product'}</span>
                          </div>
                          <button onClick={() => handleRemoveCustomProduct(ciIdx)} className="absolute top-1.5 left-1.5 w-5 h-5 bg-rose-500 rounded-full flex items-center justify-center shadow-md opacity-0 group-hover:opacity-100 transition-all z-20 hover:bg-rose-600" title="Remove">
                            <X size={10} className="text-white" />
                          </button>
                          <button onClick={() => { setEditingCard({ section: 'product', index: ciIdx, isCustom: true }); setEditCardName(ci.name); setEditCardImage(ci.image); }} className="absolute top-1.5 right-1.5 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center shadow-md opacity-0 group-hover:opacity-100 transition-all z-20 hover:bg-blue-600" title="Edit">
                            <Pencil size={9} className="text-white" />
                          </button>
                        </div>
                      ))}
                    </div>
                    {showOverlay && selectedProducts.size > 0 && (
                      <p className="text-sm text-purple-600 font-medium mt-3">{selectedProducts.size} of {roomTypes[selectedType].products.length} products selected</p>
                    )}
                    {showOverlay && (
                      <div className="mt-5 pt-5 border-t border-slate-100">
                        <h4 className="text-sm font-black text-slate-400 uppercase tracking-[0.2em] mb-3">Product Inspection Checklist</h4>
                        <div className="grid grid-cols-2 gap-2.5">
                          {roomTypes[selectedType].products.map((prod, j) => {
                            const pass = (j * 41 + 7) % 100 < 85;
                            return (
                              <div key={j} className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all hover:shadow-sm ${pass ? 'bg-emerald-50/60' : 'bg-rose-50/60'}`}>
                                <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${pass ? 'bg-emerald-100' : 'bg-rose-100'}`}>
                                  {pass ? <CheckCircle size={14} className="text-emerald-600" /> : <XCircle size={14} className="text-rose-600" />}
                                </div>
                                <span className="text-sm font-medium text-slate-700 flex-1">{prod}</span>
                                <span className={`text-xs font-black uppercase ${pass ? 'text-emerald-600' : 'text-rose-600'}`}>{pass ? 'Pass' : 'Fail'}</span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Version History Timeline */}
                <div className="pt-6 border-t border-slate-100">
                  <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.3em] mb-4">Version History</h3>
                  <div className="flex items-center gap-4">
                    {roomTypes[selectedType].versionHistory.map((v, j) => (
                      <div key={j} className={`flex items-center gap-3 px-5 py-3.5 rounded-2xl cursor-pointer transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 ${v.active ? 'bg-blue-50 border-2 border-blue-200' : 'bg-slate-50 border border-slate-200 hover:bg-slate-100'}`}>
                        <div className={`w-3 h-3 rounded-full ${v.active ? 'bg-blue-500 shadow-sm shadow-blue-300' : 'bg-slate-300'}`} />
                        <div>
                          <span className={`text-xs font-bold ${v.active ? 'text-blue-700' : 'text-slate-500'}`}>{v.date}</span>
                          <p className="text-[10px] text-slate-400">{v.label}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      ) : (
        /* ═══════ ROOM TRACKER VIEW ═══════ */
        <>
          {/* Search + Floor Filter Bar */}
          <div className="flex items-center gap-4 animate-fade-in-up stagger-1 flex-wrap">
            <div className="relative w-56">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input type="text" placeholder="Find a room..." value={roomSearch} onChange={(e) => setRoomSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-medium outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-300 transition-all" />
            </div>
            <div className="flex items-center gap-1.5 bg-slate-100 rounded-xl p-1">
              {floorNumbers.map((floor) => (
                <button key={floor} onClick={() => { setSelectedFloor(floor); setSelectedRoom(null); setRoomSearch(''); }}
                  className={`px-3.5 py-1.5 rounded-lg text-sm font-bold transition-all ${selectedFloor === floor ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-600 hover:bg-white/50'}`}>
                  F{floor}{floor === 8 && <span className="ml-0.5 text-[9px] opacity-70">★</span>}
                </button>
              ))}
            </div>
            <span className="text-sm font-bold text-blue-600">{filteredRooms.length} Rooms</span>
            <button onClick={() => setShowAddRoomModal(true)} className="flex items-center gap-1.5 px-4 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700 transition-all shadow-sm ml-auto">
              <Plus size={14} /> Add Room
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            <div className={`${selectedRoom ? 'lg:col-span-2' : 'lg:col-span-3'}`}>
              <div className={`grid ${selectedRoom ? 'grid-cols-2 md:grid-cols-3' : 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4'} gap-4 animate-fade-in-up stagger-2`}>
                {filteredRooms.map((room) => {
                  const Icon = iconForType(room.type);
                  const isActive = selectedRoom === room.number;
                  
                  // Status-based styling inspired by user pages
                  const statusStyles = {
                    pass: 'bg-gradient-to-br from-emerald-50/90 to-emerald-100/50 border-emerald-200 shadow-emerald-100/30',
                    fail: 'bg-gradient-to-br from-rose-50/90 to-rose-100/50 border-rose-200 shadow-rose-100/30',
                    pending: 'bg-gradient-to-br from-blue-50/70 to-indigo-50/40 border-blue-100 shadow-blue-100/20',
                  }[room.status] || 'bg-gradient-to-br from-slate-50/70 to-slate-100/40 border-slate-200';

                  const iconBgStyles = {
                    pass: 'bg-gradient-to-br from-emerald-400 to-emerald-600 text-white shadow-lg shadow-emerald-200',
                    fail: 'bg-gradient-to-br from-rose-400 to-rose-600 text-white shadow-lg shadow-rose-200',
                    pending: 'bg-gradient-to-br from-blue-400 to-blue-600 text-white shadow-lg shadow-blue-200',
                  }[room.status] || 'bg-gradient-to-br from-slate-300 to-slate-400 text-white shadow-lg shadow-slate-200';

                  const accentBar = {
                    pass: 'bg-emerald-500',
                    fail: 'bg-rose-500',
                    pending: 'bg-blue-500',
                  }[room.status] || 'bg-slate-400';

                  const dotColor = {
                    pass: 'bg-emerald-400',
                    fail: 'bg-rose-400',
                    pending: 'bg-blue-400',
                  }[room.status] || 'bg-slate-300';

                  return (
                    <div key={room.number} onClick={() => setSelectedRoom(isActive ? null : room.number)}
                      className={`rounded-[1.5rem] p-5 cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-1 active:scale-[0.98] border relative overflow-hidden group ${statusStyles} ${isActive ? 'ring-2 ring-blue-500 shadow-xl -translate-y-1 scale-[1.02]' : 'shadow-sm'}`}>
                      {/* Colored top accent bar */}
                      <div className={`absolute top-0 left-0 right-0 h-1.5 ${accentBar}`} />
                      
                      <div className="flex items-start justify-between mb-3 mt-1">
                        <div className={`w-11 h-11 rounded-2xl flex items-center justify-center transition-all group-hover:scale-110 group-hover:rotate-[8deg] ${iconBgStyles}`}>
                          <Icon size={20} />
                        </div>
                        {room.status === 'fail' && <span className="px-2.5 py-1 bg-rose-500 text-white rounded-lg text-[10px] font-black uppercase shadow-md">{room.issues} Issues</span>}
                        {room.status === 'pass' && <span className="px-2.5 py-1 bg-emerald-100 text-emerald-700 rounded-lg text-[10px] font-black uppercase border border-emerald-200">Room Ready</span>}
                        {room.status === 'pending' && <span className="px-2.5 py-1 bg-blue-100/80 text-blue-600 rounded-lg text-[10px] font-black uppercase border border-blue-200">Pending</span>}
                      </div>
                      <h3 className="text-lg font-black text-slate-900 tracking-tight">{room.number}</h3>
                      <div className="flex items-center gap-2 mt-1.5">
                        <div className={`w-2 h-2 rounded-full transition-all group-hover:scale-125 ${dotColor}`} />
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{room.type}</span>
                        <span className="w-1 h-1 rounded-full bg-slate-200" />
                        <span className="text-[10px] font-bold text-slate-400">F{room.floor}</span>
                      </div>
                      <div className="flex items-center justify-between mt-4 pt-3 border-t border-black/5">
                        <span className="text-[10px] text-slate-400 font-medium">{room.lastScan}</span>
                        <div className="w-7 h-7 rounded-full bg-white/50 flex items-center justify-center text-slate-400 group-hover:bg-blue-600 group-hover:text-white transition-all shadow-sm">
                          <ChevronRight size={14} />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Room Detail Panel */}
            {selectedRoom && activeRoom && (
              <div className="lg:col-span-1 space-y-5 animate-fade-in-up">
                {/* Room Header — Vibrant */}
                <div className={`rounded-[1.5rem] p-6 border relative overflow-hidden ${
                  activeRoom.status === 'pass' ? 'bg-gradient-to-br from-emerald-50/80 via-white to-emerald-50/30 border-emerald-200/60' :
                  activeRoom.status === 'fail' ? 'bg-gradient-to-br from-rose-50/80 via-white to-rose-50/30 border-rose-200/60' :
                  'bg-gradient-to-br from-blue-50/60 via-white to-blue-50/30 border-blue-100/60'
                } shadow-sm`}>
                  <div className={`absolute top-0 left-0 right-0 h-1.5 ${
                    activeRoom.status === 'pass' ? 'bg-emerald-500' :
                    activeRoom.status === 'fail' ? 'bg-rose-500' : 'bg-blue-500'
                  }`} />
                  <div className="flex items-center justify-between mb-4 mt-1">
                    <div className="flex items-center gap-3">
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg ${
                        activeRoom.status === 'pass' ? 'bg-gradient-to-br from-emerald-400 to-emerald-600 shadow-emerald-200' :
                        activeRoom.status === 'fail' ? 'bg-gradient-to-br from-rose-400 to-rose-600 shadow-rose-200' :
                        'bg-gradient-to-br from-blue-400 to-blue-600 shadow-blue-200'
                      }`}>
                        <span className="text-sm font-black text-white">{activeRoom.number}</span>
                      </div>
                      <div>
                        <h2 className="text-xl font-black text-slate-900">Room {activeRoom.number}</h2>
                        <div className="flex items-center gap-2 mt-0.5">
                          <div className={`w-1.5 h-1.5 rounded-full ${
                            activeRoom.status === 'pass' ? 'bg-emerald-400' :
                            activeRoom.status === 'fail' ? 'bg-rose-400' : 'bg-blue-400'
                          }`} />
                          <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">{activeRoom.type} · F{activeRoom.floor}</p>
                        </div>
                      </div>
                    </div>
                    <button onClick={() => setSelectedRoom(null)} className="p-2 rounded-lg hover:bg-white/60 transition-all"><XCircle size={18} className="text-slate-400" /></button>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-slate-400">
                    <span className="flex items-center gap-1 px-2.5 py-1 bg-white/60 rounded-lg border border-slate-100"><Clock size={12} /> {activeRoom.lastScan}</span>
                    <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase border ${
                      activeRoom.status === 'pass' ? 'bg-emerald-100 text-emerald-700 border-emerald-200' :
                      activeRoom.status === 'fail' ? 'bg-rose-100 text-rose-700 border-rose-200' :
                      'bg-blue-100 text-blue-600 border-blue-200'
                    }`}>
                      {activeRoom.status === 'pass' ? 'Passed' : activeRoom.status === 'fail' ? `${activeRoom.issues} Issues` : 'Pending'}
                    </span>
                  </div>
                </div>

                {/* ═══ Zone / Product Images Toggle ═══ */}
                <div className="bg-gradient-to-br from-white to-slate-50/80 rounded-[1.5rem] p-6 border border-slate-200/60 shadow-sm">
                  {/* Pill-style toggle */}
                  <div className="flex items-center justify-between mb-5">
                    <div className="flex items-center gap-1 bg-slate-100 rounded-xl p-1">
                      <button onClick={() => setRoomDetailTab('zones')}
                        className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-bold transition-all ${roomDetailTab === 'zones' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}>
                        <Eye size={14} /> Zone Images
                      </button>
                      <button onClick={() => setRoomDetailTab('products')}
                        className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-bold transition-all ${roomDetailTab === 'products' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}>
                        <Package size={14} /> Product Images
                      </button>
                    </div>
                    <span className="text-xs text-slate-400 font-medium">
                      {roomDetailTab === 'zones'
                        ? `${defaultZones.filter(z => !removedRoomZones.has(`${activeRoom.number}::${z}`)).length + customRoomZones.length} items`
                        : `${defaultProducts.filter(p => !removedRoomProducts.has(`${activeRoom.number}::${p}`)).length + customRoomProducts.length} items`
                      }
                    </span>
                  </div>

                  {/* ── Zone Images Tab ── */}
                  {roomDetailTab === 'zones' && (
                    <>
                      <div className="grid grid-cols-2 gap-3">
                        {defaultZones.map((zone, zIdx) => {
                          if (removedRoomZones.has(`${activeRoom.number}::${zone}`)) return null;
                          const isEditingThis = editingCard?.section === 'room-zone' && editingCard.index === zIdx && !editingCard.isCustom;
                          return (
                            <div key={zone} className="aspect-square bg-gradient-to-br from-slate-50 to-slate-100/50 rounded-xl border border-slate-200 flex items-center justify-center flex-col gap-1.5 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 cursor-pointer relative group">
                              <button onClick={(e) => { e.stopPropagation(); handleRemoveRoomZone(activeRoom.number, zone); }} className="absolute top-1.5 left-1.5 w-5 h-5 bg-rose-500 rounded-full flex items-center justify-center shadow-md opacity-0 group-hover:opacity-100 transition-all z-20 hover:bg-rose-600" title="Remove">
                                <X size={10} className="text-white" />
                              </button>
                              <button onClick={(e) => { e.stopPropagation(); setEditingCard({ section: 'room-zone', index: zIdx, isCustom: false }); setEditCardName(zone); setEditCardImage(null); }} className="absolute top-1.5 right-1.5 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center shadow-md opacity-0 group-hover:opacity-100 transition-all z-20 hover:bg-blue-600" title="Edit">
                                <Pencil size={9} className="text-white" />
                              </button>
                              {isEditingThis ? (
                                <div className="absolute inset-0 bg-white rounded-xl border-2 border-blue-400 p-2.5 flex flex-col gap-1.5 z-30" onClick={(e) => e.stopPropagation()}>
                                  <input type="text" value={editCardName} onChange={(e) => setEditCardName(e.target.value)} className="w-full px-2 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-[11px] font-medium outline-none focus:ring-1 focus:ring-blue-300" placeholder="Zone name" />
                                  <label className="flex-1 flex items-center justify-center border border-dashed border-slate-200 rounded-lg cursor-pointer hover:bg-blue-50/50 transition-all">
                                    <div className="text-center">
                                      <Upload size={14} className="text-slate-300 mx-auto" />
                                      <span className="text-[8px] text-slate-400 block mt-0.5">Change Image</span>
                                    </div>
                                    <input type="file" accept="image/*" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) { const r = new FileReader(); r.onload = (ev) => { if (ev.target?.result) setEditCardImage(ev.target.result as string); }; r.readAsDataURL(f); }}} />
                                  </label>
                                  <div className="flex gap-1.5">
                                    <button onClick={() => setEditingCard(null)} className="flex-1 py-1 bg-slate-100 text-slate-500 rounded-lg text-[9px] font-bold">Cancel</button>
                                    <button onClick={() => setEditingCard(null)} className="flex-1 py-1 bg-blue-600 text-white rounded-lg text-[9px] font-bold">Save</button>
                                  </div>
                                </div>
                              ) : (
                                <>
                                  <ScanSearch size={20} className="text-slate-300" />
                                  <span className="text-xs font-bold text-slate-500">{zone}</span>
                                </>
                              )}
                            </div>
                          );
                        })}
                        {customRoomZones.map((item, idx) => (
                          <div key={`custom-rz-${idx}`} className="aspect-square rounded-xl border-2 border-emerald-200 overflow-hidden hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 cursor-pointer relative group">
                            <button onClick={() => handleRemoveCustomRoomZone(idx)} className="absolute top-1.5 left-1.5 w-5 h-5 bg-rose-500 rounded-full flex items-center justify-center shadow-md opacity-0 group-hover:opacity-100 transition-all z-20 hover:bg-rose-600" title="Remove">
                              <X size={10} className="text-white" />
                            </button>
                            <button onClick={() => { setEditingCard({ section: 'room-zone', index: idx, isCustom: true }); setEditCardName(item.name); setEditCardImage(item.image); }} className="absolute top-1.5 right-1.5 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center shadow-md opacity-0 group-hover:opacity-100 transition-all z-20 hover:bg-blue-600" title="Edit">
                              <Pencil size={9} className="text-white" />
                            </button>
                            {item.image ? (
                              <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full bg-emerald-50 flex items-center justify-center flex-col gap-1">
                                <ScanSearch size={20} className="text-emerald-400" />
                              </div>
                            )}
                            <div className="absolute bottom-0 left-0 right-0 bg-black/50 backdrop-blur-sm px-2 py-1.5">
                              <span className="text-[10px] font-bold text-white">{item.name}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                      <button onClick={() => setAddRoomItemModal('zone')} className="w-full mt-4 flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 text-blue-600 rounded-xl text-xs font-bold hover:shadow-md hover:-translate-y-0.5 transition-all active:scale-95">
                        <Plus size={14} /> Add Zone with Image
                      </button>
                    </>
                  )}

                  {/* ── Product Images Tab ── */}
                  {roomDetailTab === 'products' && (
                    <>
                      <div className="grid grid-cols-2 gap-3">
                        {defaultProducts.map((product, pIdx) => {
                          if (removedRoomProducts.has(`${activeRoom.number}::${product}`)) return null;
                          const isEditingThis = editingCard?.section === 'room-product' && editingCard.index === pIdx && !editingCard.isCustom;
                          return (
                            <div key={product} className="aspect-square bg-gradient-to-br from-amber-50/50 to-slate-50 rounded-xl border border-slate-200 flex items-center justify-center flex-col gap-1.5 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 cursor-pointer relative group">
                              <button onClick={(e) => { e.stopPropagation(); handleRemoveRoomProduct(activeRoom.number, product); }} className="absolute top-1.5 left-1.5 w-5 h-5 bg-rose-500 rounded-full flex items-center justify-center shadow-md opacity-0 group-hover:opacity-100 transition-all z-20 hover:bg-rose-600" title="Remove">
                                <X size={10} className="text-white" />
                              </button>
                              <button onClick={(e) => { e.stopPropagation(); setEditingCard({ section: 'room-product', index: pIdx, isCustom: false }); setEditCardName(product); setEditCardImage(null); }} className="absolute top-1.5 right-1.5 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center shadow-md opacity-0 group-hover:opacity-100 transition-all z-20 hover:bg-blue-600" title="Edit">
                                <Pencil size={9} className="text-white" />
                              </button>
                              {isEditingThis ? (
                                <div className="absolute inset-0 bg-white rounded-xl border-2 border-blue-400 p-2.5 flex flex-col gap-1.5 z-30" onClick={(e) => e.stopPropagation()}>
                                  <input type="text" value={editCardName} onChange={(e) => setEditCardName(e.target.value)} className="w-full px-2 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-[11px] font-medium outline-none focus:ring-1 focus:ring-blue-300" placeholder="Product name" />
                                  <label className="flex-1 flex items-center justify-center border border-dashed border-slate-200 rounded-lg cursor-pointer hover:bg-amber-50/50 transition-all">
                                    <div className="text-center">
                                      <Upload size={14} className="text-slate-300 mx-auto" />
                                      <span className="text-[8px] text-slate-400 block mt-0.5">Change Image</span>
                                    </div>
                                    <input type="file" accept="image/*" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) { const r = new FileReader(); r.onload = (ev) => { if (ev.target?.result) setEditCardImage(ev.target.result as string); }; r.readAsDataURL(f); }}} />
                                  </label>
                                  <div className="flex gap-1.5">
                                    <button onClick={() => setEditingCard(null)} className="flex-1 py-1 bg-slate-100 text-slate-500 rounded-lg text-[9px] font-bold">Cancel</button>
                                    <button onClick={() => setEditingCard(null)} className="flex-1 py-1 bg-amber-600 text-white rounded-lg text-[9px] font-bold">Save</button>
                                  </div>
                                </div>
                              ) : (
                                <>
                                  <Package size={20} className="text-amber-300" />
                                  <span className="text-xs font-bold text-slate-500 text-center leading-tight px-1">{product}</span>
                                </>
                              )}
                            </div>
                          );
                        })}
                        {customRoomProducts.map((item, idx) => (
                          <div key={`custom-rp-${idx}`} className="aspect-square rounded-xl border-2 border-emerald-200 overflow-hidden hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 cursor-pointer relative group">
                            <button onClick={() => handleRemoveCustomRoomProduct(idx)} className="absolute top-1.5 left-1.5 w-5 h-5 bg-rose-500 rounded-full flex items-center justify-center shadow-md opacity-0 group-hover:opacity-100 transition-all z-20 hover:bg-rose-600" title="Remove">
                              <X size={10} className="text-white" />
                            </button>
                            <button onClick={() => { setEditingCard({ section: 'room-product', index: idx, isCustom: true }); setEditCardName(item.name); setEditCardImage(item.image); }} className="absolute top-1.5 right-1.5 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center shadow-md opacity-0 group-hover:opacity-100 transition-all z-20 hover:bg-blue-600" title="Edit">
                              <Pencil size={9} className="text-white" />
                            </button>
                            {item.image ? (
                              <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full bg-emerald-50 flex items-center justify-center flex-col gap-1">
                                <Package size={20} className="text-emerald-400" />
                              </div>
                            )}
                            <div className="absolute bottom-0 left-0 right-0 bg-black/50 backdrop-blur-sm px-2 py-1.5">
                              <span className="text-[10px] font-bold text-white">{item.name}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                      <button onClick={() => setAddRoomItemModal('product')} className="w-full mt-4 flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 text-amber-700 rounded-xl text-xs font-bold hover:shadow-md hover:-translate-y-0.5 transition-all active:scale-95">
                        <Plus size={14} /> Add Product with Image
                      </button>
                    </>
                  )}
                </div>

                {/* ═══ Inspection Checklist (Interactive) ═══ */}
                <div className="glass-card rounded-2xl p-6">
                  <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.3em] mb-4">Inspection Checklist</h3>
                  <div className="space-y-2">
                    {activeChecklist.map((item, j) => {
                      const isExpanded = expandedChecklistItem === j;
                      const alreadyInProducts = defaultProducts.some(p => p.toLowerCase() === item.name.toLowerCase() && !removedRoomProducts.has(`${activeRoom.number}::${p}`)) || customRoomProducts.some(p => p.name.toLowerCase() === item.name.toLowerCase());
                      return (
                        <div key={j}>
                          <div
                            onClick={() => setExpandedChecklistItem(isExpanded ? null : j)}
                            className={`flex items-center gap-3 p-3 rounded-xl transition-all cursor-pointer ${item.status === 'pass' ? 'bg-emerald-50/50 hover:bg-emerald-50' : 'bg-rose-50/50 hover:bg-rose-50'}`}
                          >
                            <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${item.status === 'pass' ? 'bg-emerald-100' : 'bg-rose-100'}`}>
                              {item.status === 'pass' ? <CheckCircle size={14} className="text-emerald-600" /> : <XCircle size={14} className="text-rose-600" />}
                            </div>
                            <span className="text-sm font-medium text-slate-700 flex-1">{item.name}</span>
                            <span className={`text-[10px] font-black uppercase ${item.status === 'pass' ? 'text-emerald-600' : 'text-rose-600'}`}>{item.status === 'pass' ? 'Pass' : 'Fail'}</span>
                            <ChevronRight size={14} className={`text-slate-300 transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
                          </div>
                          {isExpanded && (
                            <div className="ml-10 mt-1 mb-2 flex items-center gap-2">
                              {alreadyInProducts ? (
                                <button
                                  onClick={() => {
                                    // Remove from products
                                    const defaultMatch = defaultProducts.find(p => p.toLowerCase() === item.name.toLowerCase());
                                    if (defaultMatch) {
                                      handleRemoveRoomProduct(activeRoom.number, defaultMatch);
                                    } else {
                                      const customIdx = customRoomProducts.findIndex(p => p.name.toLowerCase() === item.name.toLowerCase());
                                      if (customIdx >= 0) handleRemoveCustomRoomProduct(customIdx);
                                    }
                                    setExpandedChecklistItem(null);
                                  }}
                                  className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-50 text-rose-600 border border-rose-200 rounded-lg text-xs font-bold hover:bg-rose-100 transition-all active:scale-95"
                                >
                                  <X size={12} /> Remove from Products
                                </button>
                              ) : (
                                <button
                                  onClick={() => {
                                    setCustomRoomProducts(prev => [...prev, { name: item.name, code: `CHK-${j}`, image: '', categories: [] }]);
                                    setExpandedChecklistItem(null);
                                    setRoomDetailTab('products');
                                  }}
                                  className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-600 border border-blue-200 rounded-lg text-xs font-bold hover:bg-blue-100 transition-all active:scale-95"
                                >
                                  <Plus size={12} /> Add to Products
                                </button>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                  <div className="mt-4 pt-4 border-t border-slate-100 text-sm text-slate-400">
                    <strong className="text-slate-700">{activeChecklist.filter(c => c.status === 'pass').length}</strong> of {activeChecklist.length} passed
                  </div>
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
