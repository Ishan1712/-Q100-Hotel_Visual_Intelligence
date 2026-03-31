"use client";

import React, { useState, useMemo } from 'react';
import { 
  Bed, Crown, Star, Eye, Clock, CheckCircle, 
  Layers, History, RotateCcw, ChevronRight, Accessibility,
  Search, XCircle, ScanSearch, ArrowRight, X, User,
  AlertTriangle, IndianRupee, RotateCw, Download, FileText, 
  Camera, Check
} from 'lucide-react';

/* ── Room Types Data ── */
const roomTypes = [
  { name: "Standard Double", count: 78, icon: Bed, lastUpdated: "12 Jan 2026", detectionPoints: 14, color: "blue",
    zones: ["Bed Area", "Bathroom", "Desk Area", "Minibar", "Entrance"],
    checkpoints: ["Pillow count (4)", "Pillow arrangement (diamond)", "Bed runner position", "Remote angle", "Lamp alignment (L)", "Lamp alignment (R)", "Towel fold type", "Towel count", "Soap count", "Shampoo position", "Dental kit count", "Minibar bottles", "Curtain symmetry", "Welcome card"],
    versionHistory: [
      { date: "12 Jan 2026", label: "Current Version", note: "Updated after Q1 brand refresh", active: true },
      { date: "15 Sep 2025", label: "Post-Renovation", note: "New bed linen and amenity arrangement", active: false },
      { date: "1 Jun 2025", label: "Initial Setup", note: "First master photos captured", active: false },
    ]
  },
  { name: "Standard Twin", count: 22, icon: Bed, lastUpdated: "12 Jan 2026", detectionPoints: 14, color: "slate",
    zones: ["Bed Area", "Bathroom", "Desk Area", "Minibar", "Entrance"],
    checkpoints: ["Pillow count (4)", "Pillow arrangement (parallel)", "Bed runner position", "Remote angle", "Lamp alignment (L)", "Lamp alignment (R)", "Towel fold type", "Towel count", "Soap count", "Shampoo position", "Dental kit count", "Minibar bottles", "Curtain symmetry", "Welcome card"],
    versionHistory: [
      { date: "12 Jan 2026", label: "Current Version", note: "Aligned with Standard Double update", active: true },
      { date: "1 Jun 2025", label: "Initial Setup", note: "First master photos captured", active: false },
    ]
  },
  { name: "Deluxe King", count: 20, icon: Crown, lastUpdated: "5 Feb 2026", detectionPoints: 18, color: "amber",
    zones: ["Bed Area", "Bathroom", "Living Area", "Desk Area", "Minibar", "Entrance"],
    checkpoints: ["Pillow count (6)", "Pillow arrangement (fan)", "Bed runner position", "Throw cushions", "Remote angle", "Lamp alignment (L)", "Lamp alignment (R)", "Towel fold type", "Towel count", "Bathrobe placement", "Soap count", "Shampoo position", "Dental kit count", "Minibar bottles", "Living area cushions", "Curtain symmetry", "Welcome card", "Fruit basket"],
    versionHistory: [
      { date: "5 Feb 2026", label: "Current Version", note: "Added fruit basket checkpoint", active: true },
      { date: "12 Jan 2026", label: "Previous Version", note: "Standard detection points", active: false },
      { date: "1 Jun 2025", label: "Initial Setup", note: "First master photos captured", active: false },
    ]
  },
  { name: "Deluxe Suite", count: 12, icon: Crown, lastUpdated: "5 Feb 2026", detectionPoints: 22, color: "purple",
    zones: ["Bedroom", "Bathroom", "Living Room", "Dining Area", "Minibar", "Entrance", "Balcony"],
    checkpoints: ["King bed setup", "Pillow arrangement (luxury)", "Bed runner", "Throw cushions (bedroom)", "Bathrobe (L)", "Bathrobe (R)", "Towel count", "Towel fold type", "Amenity arc", "Dental kits", "Remote + menu card", "Lamp alignment (L)", "Lamp alignment (R)", "Living room cushions", "Coffee table arrangement", "Dining table setting", "Minibar bottles", "Minibar snacks", "Curtain symmetry", "Balcony furniture", "Welcome card", "Flower arrangement"],
    versionHistory: [
      { date: "5 Feb 2026", label: "Current Version", note: "Post-suite renovation", active: true },
      { date: "15 Sep 2025", label: "Previous Version", note: "Standard suite layout", active: false },
    ]
  },
  { name: "Presidential Suite", count: 4, icon: Star, lastUpdated: "20 Feb 2026", detectionPoints: 28, color: "amber",
    zones: ["Master Bedroom", "Master Bathroom", "Guest Bathroom", "Living Room", "Dining Room", "Study", "Minibar", "Entrance", "Balcony"],
    checkpoints: Array.from({ length: 28 }, (_, i) => `Detection Point ${i + 1}`),
    versionHistory: [
      { date: "20 Feb 2026", label: "Current Version", note: "VIP-level detail update", active: true },
      { date: "5 Feb 2026", label: "Previous Version", note: "Standard presidential layout", active: false },
    ]
  },
  { name: "Accessible Room", count: 6, icon: Accessibility, lastUpdated: "12 Jan 2026", detectionPoints: 16, color: "emerald",
    zones: ["Bed Area", "Accessible Bathroom", "Desk Area", "Minibar", "Entrance"],
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

const colorMap: Record<string, { bg: string; border: string; text: string; iconBg: string; gradient: string }> = {
  blue: { bg: 'bg-blue-50', border: 'border-blue-100', text: 'text-blue-600', iconBg: 'bg-blue-100', gradient: 'from-blue-500 to-blue-600' },
  slate: { bg: 'bg-slate-50', border: 'border-slate-200', text: 'text-slate-600', iconBg: 'bg-slate-100', gradient: 'from-slate-500 to-slate-600' },
  amber: { bg: 'bg-amber-50', border: 'border-amber-100', text: 'text-amber-600', iconBg: 'bg-amber-100', gradient: 'from-amber-500 to-amber-600' },
  purple: { bg: 'bg-purple-50', border: 'border-purple-100', text: 'text-purple-600', iconBg: 'bg-purple-100', gradient: 'from-purple-500 to-purple-600' },
  emerald: { bg: 'bg-emerald-50', border: 'border-emerald-100', text: 'text-emerald-600', iconBg: 'bg-emerald-100', gradient: 'from-emerald-500 to-emerald-600' },
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

  const floorRooms = useMemo(() => generateFloorRooms(selectedFloor), [selectedFloor]);
  const filteredRooms = floorRooms.filter(r =>
    r.number.includes(roomSearch) || r.type.toLowerCase().includes(roomSearch.toLowerCase())
  );
  const activeRoom = floorRooms.find(r => r.number === selectedRoom);
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

  // Reset checkpoint selection when changing room type
  const handleSelectType = (i: number) => {
    if (selectedType === i) {
      setSelectedType(null);
    } else {
      setSelectedType(i);
      setSelectedCheckpoints(new Set());
      setShowOverlay(false);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Report Modal */}
      {reportRoom && <ReportModal room={reportRoom} onClose={() => setReportRoom(null)} />}
      
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
                <div key={type.name} className={`glass-card rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-xl hover:shadow-slate-200/60 hover:-translate-y-1 ${selectedType === i ? 'ring-2 ring-blue-500 shadow-xl' : ''}`} onClick={() => handleSelectType(i)}>
                  <div className={`aspect-[16/9] ${colors.bg} flex items-center justify-center relative`}>
                    <div className="text-center">
                      <div className={`w-14 h-14 rounded-2xl ${colors.iconBg} flex items-center justify-center mx-auto shadow-lg`}><Icon size={28} className={colors.text} /></div>
                      <p className="text-sm font-bold text-slate-400 mt-3">Master Reference</p>
                    </div>
                    <div className="absolute top-3 right-3 px-3 py-1.5 bg-white/90 backdrop-blur-sm rounded-xl">
                      <span className="text-xs font-black text-slate-700">{type.detectionPoints} detection points</span>
                    </div>
                  </div>
                  <div className="p-5">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-base font-bold text-slate-900">{type.name}</h3>
                      <ChevronRight size={18} className={`transition-transform ${selectedType === i ? 'rotate-90 text-blue-500' : 'text-slate-300'}`} />
                    </div>
                    <div className="flex items-center gap-4 text-xs text-slate-400">
                      <span className="flex items-center gap-1"><Bed size={12} /> {type.count} rooms</span>
                      <span className="flex items-center gap-1"><Clock size={12} /> Updated {type.lastUpdated}</span>
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
              <div className="bg-white p-8">
                {/* Zone Grid — selectable when overlay is active */}
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.3em]">Master Zones</h3>
                    {showOverlay && (
                      <button 
                        onClick={() => handleSelectAllCheckpoints(roomTypes[selectedType].zones.length)}
                        className="text-xs font-bold text-blue-600 hover:text-blue-700 transition-all"
                      >
                        {selectedCheckpoints.size === roomTypes[selectedType].zones.length ? 'Deselect All' : 'Select All'}
                      </button>
                    )}
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                    {roomTypes[selectedType].zones.map((zone, zoneIdx) => {
                      const isSelected = showOverlay && selectedCheckpoints.has(zoneIdx);
                      return (
                        <div 
                          key={zone} 
                          onClick={() => showOverlay && handleToggleCheckpoint(zoneIdx)}
                          className={`aspect-square rounded-2xl flex items-center justify-center flex-col gap-2 transition-all duration-300 cursor-pointer relative group ${
                            isSelected
                              ? 'bg-blue-600 border-2 border-blue-500 shadow-xl shadow-blue-200 -translate-y-1'
                              : showOverlay
                                ? 'bg-slate-50 border-2 border-dashed border-slate-200 hover:border-blue-300 hover:bg-blue-50 hover:-translate-y-0.5'
                                : 'bg-slate-50 border border-slate-100 hover:bg-slate-100 hover:shadow-lg hover:border-slate-200 hover:-translate-y-0.5'
                          }`}
                        >
                          {isSelected && (
                            <div className="absolute top-3 right-3 w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-md">
                              <Check size={14} className="text-blue-600" />
                            </div>
                          )}
                          <Eye size={24} className={isSelected ? 'text-white/80' : 'text-slate-300 group-hover:text-slate-400 transition-colors'} />
                          <span className={`text-xs font-bold ${isSelected ? 'text-white' : 'text-slate-500'}`}>{zone}</span>
                          {showOverlay && !isSelected && (
                            <span className="text-[10px] text-slate-400 font-medium">Click to select</span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                  {showOverlay && selectedCheckpoints.size > 0 && (
                    <p className="text-xs text-blue-600 font-medium mt-3">
                      {selectedCheckpoints.size} of {roomTypes[selectedType].zones.length} zones selected
                    </p>
                  )}
                </div>

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
            <span className="text-sm font-bold text-blue-600 ml-auto">{filteredRooms.length} Rooms</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            <div className={`${selectedRoom ? 'lg:col-span-2' : 'lg:col-span-3'}`}>
              <div className={`grid ${selectedRoom ? 'grid-cols-2 md:grid-cols-3' : 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4'} gap-4 animate-fade-in-up stagger-2`}>
                {filteredRooms.map((room) => {
                  const Icon = iconForType(room.type);
                  const isActive = selectedRoom === room.number;
                  return (
                    <div key={room.number} onClick={() => setSelectedRoom(isActive ? null : room.number)}
                      className={`glass-card rounded-2xl p-5 cursor-pointer transition-all duration-300 hover:shadow-xl hover:shadow-slate-200/60 hover:-translate-y-1 ${isActive ? 'ring-2 ring-blue-500 shadow-xl -translate-y-1' : ''}`}>
                      <div className="flex items-start justify-between mb-3">
                        <div className={`w-10 h-10 rounded-xl ${room.status === 'pass' ? 'bg-blue-50' : room.status === 'fail' ? 'bg-rose-50' : 'bg-slate-50'} flex items-center justify-center`}>
                          <Icon size={20} className={room.status === 'pass' ? 'text-blue-500' : room.status === 'fail' ? 'text-rose-500' : 'text-slate-400'} />
                        </div>
                        {room.status === 'fail' && <span className="px-2.5 py-1 bg-rose-500 text-white rounded-lg text-[10px] font-black uppercase">{room.issues} Issues</span>}
                        {room.status === 'pass' && <span className="px-2.5 py-1 bg-emerald-50 text-emerald-600 rounded-lg text-[10px] font-black uppercase border border-emerald-200">Room Ready</span>}
                        {room.status === 'pending' && <span className="px-2.5 py-1 bg-slate-100 text-slate-400 rounded-lg text-[10px] font-black uppercase">Pending</span>}
                      </div>
                      <h3 className="text-lg font-black text-slate-900">Room {room.number}</h3>
                      <p className="text-xs text-slate-400 mt-0.5">{room.type} · Floor {room.floor}</p>
                      <div className="flex items-center justify-between mt-3">
                        <span className="text-xs text-slate-400">{room.lastScan}</span>
                        <span className="text-xs font-bold text-blue-600 flex items-center gap-1">View Report <ChevronRight size={12} /></span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Room Detail Panel */}
            {selectedRoom && activeRoom && (
              <div className="lg:col-span-1 space-y-5 animate-fade-in-up">
                {/* Room Header */}
                <div className="glass-card rounded-2xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h2 className="text-xl font-black text-slate-900">Room {activeRoom.number}</h2>
                      <p className="text-sm text-slate-400">{activeRoom.type} · Floor {activeRoom.floor}</p>
                    </div>
                    <button onClick={() => setSelectedRoom(null)} className="p-2 rounded-lg hover:bg-slate-100 transition-all"><XCircle size={18} className="text-slate-400" /></button>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-slate-400">
                    <span className="flex items-center gap-1"><Clock size={12} /> {activeRoom.lastScan}</span>
                    <span className={`px-2 py-0.5 rounded-md text-[10px] font-black uppercase ${activeRoom.status === 'pass' ? 'bg-emerald-50 text-emerald-600' : activeRoom.status === 'fail' ? 'bg-rose-50 text-rose-600' : 'bg-slate-100 text-slate-400'}`}>
                      {activeRoom.status === 'pass' ? 'Passed' : activeRoom.status === 'fail' ? `${activeRoom.issues} Issues` : 'Pending'}
                    </span>
                  </div>
                </div>

                {/* 1. Zone Photos */}
                <div className="glass-card rounded-2xl p-6">
                  <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.3em] mb-4">Zone Photos</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {["Bed Area", "Bathroom", "Desk Area", "Minibar", "Entrance"].map((zone) => (
                      <div key={zone} className="aspect-square bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-center flex-col gap-1.5 hover:bg-slate-100 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 cursor-pointer">
                        <ScanSearch size={20} className="text-slate-300" />
                        <span className="text-[10px] font-bold text-slate-500">{zone}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 2. View Full Report */}
                <button onClick={() => setReportRoom(activeRoom)}
                  className="w-full glass-card rounded-2xl p-5 flex items-center justify-between hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200 cursor-pointer group">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center group-hover:bg-blue-100 transition-all"><FileText size={18} className="text-blue-600" /></div>
                    <div className="text-left">
                      <span className="text-sm font-bold text-slate-900">View Full Report</span>
                      <p className="text-xs text-slate-400">Detailed inspection with comparisons</p>
                    </div>
                  </div>
                  <ArrowRight size={18} className="text-blue-500 group-hover:translate-x-1 transition-transform" />
                </button>

                {/* 3. Inspection Checklist */}
                <div className="glass-card rounded-2xl p-6">
                  <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.3em] mb-4">Inspection Checklist</h3>
                  <div className="space-y-2">
                    {activeChecklist.map((item, j) => (
                      <div key={j} className={`flex items-center gap-3 p-3 rounded-xl transition-all ${item.status === 'pass' ? 'bg-emerald-50/50 hover:bg-emerald-50' : 'bg-rose-50/50 hover:bg-rose-50'}`}>
                        <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${item.status === 'pass' ? 'bg-emerald-100' : 'bg-rose-100'}`}>
                          {item.status === 'pass' ? <CheckCircle size={14} className="text-emerald-600" /> : <XCircle size={14} className="text-rose-600" />}
                        </div>
                        <span className="text-sm font-medium text-slate-700 flex-1">{item.name}</span>
                        <span className={`text-[10px] font-black uppercase ${item.status === 'pass' ? 'text-emerald-600' : 'text-rose-600'}`}>{item.status === 'pass' ? 'Pass' : 'Fail'}</span>
                      </div>
                    ))}
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
