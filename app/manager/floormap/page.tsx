"use client";

import React, { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { 
  User, AlertTriangle, Clock, MapPin, XCircle, CheckCircle,
  Building2, ArrowUpDown, Wifi, Eye, Shield, Activity,
  Zap, TrendingUp, Layers
} from 'lucide-react';

/* ── Dummy Data ── */
const generateFloorData = (floor: number) => {
  const base = floor * 100;
  const count = floor === 8 ? 18 : floor <= 4 ? 22 : 20;
  // Per-floor thresholds so each floor has distinct percentages
  const thresholds: Record<number, [number, number, number]> = {
    2: [82, 90, 96],   // 82% ready, 8% in-progress, 6% flagged, 4% not-started
    3: [64, 82, 91],   // 64% ready, 18% in-progress, 9% flagged
    4: [86, 95, 98],   // 86% ready — nearly done
    5: [55, 75, 88],   // 55% ready — mid-morning
    6: [73, 85, 93],   // 73% ready
    7: [40, 62, 80],   // 40% ready — early stage
    8: [0, 0, 0],      // all not-started
  };
  const [readyT, ipT, flagT] = thresholds[floor] || [55, 75, 90];
  const rooms = Array.from({ length: count }, (_, i) => {
    const num = base + i + 1;
    const rng = ((num * 37 + floor * 13 + 7) * 53) % 100;
    const status = floor === 8 ? 'not-started' as const
      : rng < readyT ? 'ready' as const
      : rng < ipT ? 'in-progress' as const
      : rng < flagT ? 'flagged' as const
      : 'not-started' as const;
    
    const typeRng = num % 15;
    const type = typeRng === 0 ? 'Presidential' : typeRng % 10 === 0 ? 'Suite' : typeRng % 7 === 0 ? 'Deluxe' : 'Standard';
    
    const housekeepers = ['Priya S.', 'Amit K.', 'Meena R.', 'Deepak J.', 'Sunita P.', 'Ravi M.', 'Kavita D.'];
    
    return {
      number: `${num}`,
      status,
      type,
      housekeeper: status === 'in-progress' ? housekeepers[i % housekeepers.length] : undefined,
      lastScan: status === 'ready' ? `${8 + Math.floor(i / 4)}:${((i * 7) % 60).toString().padStart(2, '0')} AM` : undefined,
      issues: status === 'flagged' ? (num % 3) + 1 : 0,
    };
  });
  return rooms;
};

const floorList = [2, 3, 4, 5, 6, 7, 8];

const statusConfig: Record<string, { bg: string; border: string; text: string; label: string; dot: string; glow: string; cardBg: string }> = {
  'ready':       { bg: 'bg-emerald-500', border: 'border-emerald-300', text: 'text-emerald-700', label: 'Guest Ready', dot: 'bg-emerald-500', glow: 'shadow-emerald-200', cardBg: 'from-emerald-50 to-emerald-100/50' },
  'in-progress': { bg: 'bg-amber-500',   border: 'border-amber-300',   text: 'text-amber-700',   label: 'In Progress', dot: 'bg-amber-500',   glow: 'shadow-amber-200',   cardBg: 'from-amber-50 to-amber-100/50' },
  'flagged':     { bg: 'bg-rose-500',     border: 'border-rose-300',     text: 'text-rose-700',     label: 'Flagged',     dot: 'bg-rose-500',     glow: 'shadow-rose-200',     cardBg: 'from-rose-50 to-rose-100/50' },
  'not-started': { bg: 'bg-slate-300',    border: 'border-slate-200',    text: 'text-slate-500',    label: 'Not Started', dot: 'bg-slate-400',    glow: 'shadow-slate-100',    cardBg: 'from-slate-50 to-slate-100/50' },
};

const panelShellClass =
  'group relative overflow-hidden rounded-[2rem] border border-white/80 backdrop-blur-sm shadow-[0_24px_60px_-34px_rgba(15,23,42,0.18)] transition-all duration-500 hover:-translate-y-0.5 hover:shadow-[0_34px_90px_-38px_rgba(15,23,42,0.24)]';

const statCardStyles: Record<string, { surface: string; border: string; iconSurface: string; shadow: string }> = {
  'ready': {
    surface: 'from-[#eefcf5] via-white to-[#effbf7]',
    border: 'border-emerald-200/80',
    iconSurface: 'from-emerald-100 to-emerald-50 text-emerald-600',
    shadow: 'shadow-emerald-200/55',
  },
  'in-progress': {
    surface: 'from-[#fff8eb] via-white to-[#fff4de]',
    border: 'border-amber-200/80',
    iconSurface: 'from-amber-100 to-amber-50 text-amber-600',
    shadow: 'shadow-amber-200/55',
  },
  'flagged': {
    surface: 'from-[#fff1f4] via-white to-[#ffecef]',
    border: 'border-rose-200/80',
    iconSurface: 'from-rose-100 to-rose-50 text-rose-600',
    shadow: 'shadow-rose-200/55',
  },
  'not-started': {
    surface: 'from-[#f5f9ff] via-white to-[#f2f6fb]',
    border: 'border-slate-200/85',
    iconSurface: 'from-slate-100 to-slate-50 text-slate-500',
    shadow: 'shadow-slate-200/55',
  },
};

const getPageTone = (percent: number) => {
  if (percent >= 80) {
    return {
      heroBg: 'from-[#ecfdf5] via-[#f9fcff] to-[#edf8ff]',
      heroOverlay: 'bg-[radial-gradient(circle_at_top_left,rgba(16,185,129,0.22)_0,transparent_34%),radial-gradient(circle_at_bottom_right,rgba(59,130,246,0.16)_0,transparent_44%)]',
      selectorBg: 'from-[#f2fdf7] via-[#fcfffe] to-[#eef8ff]',
      selectorOverlay: 'bg-[radial-gradient(circle_at_top_right,rgba(16,185,129,0.14)_0,transparent_34%),radial-gradient(circle_at_bottom_left,rgba(59,130,246,0.10)_0,transparent_42%)]',
      layoutBg: 'from-[#f4fffa] via-[#ffffff] to-[#eef8ff]',
      layoutOverlay: 'bg-[radial-gradient(circle_at_top_left,rgba(16,185,129,0.10)_0,transparent_34%),radial-gradient(circle_at_bottom_right,rgba(59,130,246,0.08)_0,transparent_42%)]',
      staffBg: 'from-[#f2fbff] via-[#ffffff] to-[#eefcf6]',
      staffOverlay: 'bg-[radial-gradient(circle_at_top_right,rgba(59,130,246,0.12)_0,transparent_34%),radial-gradient(circle_at_bottom_left,rgba(16,185,129,0.08)_0,transparent_40%)]',
      glowPrimary: 'bg-emerald-200/28',
      glowSecondary: 'bg-sky-200/20',
      accentSurface: 'border-emerald-200/80 bg-emerald-50/90 text-emerald-700',
      accentText: 'text-emerald-600',
    };
  }

  if (percent >= 50) {
    return {
      heroBg: 'from-[#fff8eb] via-[#fffdf8] to-[#edf8ff]',
      heroOverlay: 'bg-[radial-gradient(circle_at_top_left,rgba(245,158,11,0.22)_0,transparent_34%),radial-gradient(circle_at_bottom_right,rgba(59,130,246,0.14)_0,transparent_44%)]',
      selectorBg: 'from-[#fff9ef] via-[#ffffff] to-[#eef6ff]',
      selectorOverlay: 'bg-[radial-gradient(circle_at_top_right,rgba(245,158,11,0.14)_0,transparent_34%),radial-gradient(circle_at_bottom_left,rgba(59,130,246,0.09)_0,transparent_42%)]',
      layoutBg: 'from-[#fffbf1] via-[#ffffff] to-[#f3f8ff]',
      layoutOverlay: 'bg-[radial-gradient(circle_at_top_left,rgba(245,158,11,0.10)_0,transparent_34%),radial-gradient(circle_at_bottom_right,rgba(59,130,246,0.07)_0,transparent_42%)]',
      staffBg: 'from-[#f8fbff] via-[#ffffff] to-[#fff9ef]',
      staffOverlay: 'bg-[radial-gradient(circle_at_top_right,rgba(59,130,246,0.11)_0,transparent_34%),radial-gradient(circle_at_bottom_left,rgba(245,158,11,0.08)_0,transparent_40%)]',
      glowPrimary: 'bg-amber-200/30',
      glowSecondary: 'bg-sky-200/18',
      accentSurface: 'border-amber-200/80 bg-amber-50/90 text-amber-700',
      accentText: 'text-amber-600',
    };
  }

  return {
    heroBg: 'from-[#fff1f4] via-[#fffdf8] to-[#f1f7ff]',
    heroOverlay: 'bg-[radial-gradient(circle_at_top_left,rgba(244,63,94,0.22)_0,transparent_34%),radial-gradient(circle_at_bottom_right,rgba(59,130,246,0.14)_0,transparent_44%)]',
    selectorBg: 'from-[#fff4f6] via-[#ffffff] to-[#eef6ff]',
    selectorOverlay: 'bg-[radial-gradient(circle_at_top_right,rgba(244,63,94,0.14)_0,transparent_34%),radial-gradient(circle_at_bottom_left,rgba(59,130,246,0.09)_0,transparent_42%)]',
    layoutBg: 'from-[#fff7f8] via-[#ffffff] to-[#f3f8ff]',
    layoutOverlay: 'bg-[radial-gradient(circle_at_top_left,rgba(244,63,94,0.10)_0,transparent_34%),radial-gradient(circle_at_bottom_right,rgba(59,130,246,0.07)_0,transparent_42%)]',
    staffBg: 'from-[#fff7fa] via-[#ffffff] to-[#f3f8ff]',
    staffOverlay: 'bg-[radial-gradient(circle_at_top_right,rgba(244,63,94,0.10)_0,transparent_34%),radial-gradient(circle_at_bottom_left,rgba(59,130,246,0.08)_0,transparent_40%)]',
    glowPrimary: 'bg-rose-200/26',
    glowSecondary: 'bg-sky-200/18',
    accentSurface: 'border-rose-200/80 bg-rose-50/90 text-rose-700',
    accentText: 'text-rose-600',
  };
};

const getFloorCardTone = (percent: number) => {
  if (percent >= 80) {
    return {
      active: 'from-emerald-500 to-cyan-600 shadow-emerald-200/80',
      rail: 'bg-emerald-400',
      badge: 'border-emerald-200 bg-emerald-50 text-emerald-700',
      mutedText: 'text-emerald-600',
    };
  }

  if (percent >= 50) {
    return {
      active: 'from-amber-500 to-orange-600 shadow-amber-200/80',
      rail: 'bg-amber-400',
      badge: 'border-amber-200 bg-amber-50 text-amber-700',
      mutedText: 'text-amber-600',
    };
  }

  if (percent > 0) {
    return {
      active: 'from-rose-500 to-pink-600 shadow-rose-200/80',
      rail: 'bg-rose-400',
      badge: 'border-rose-200 bg-rose-50 text-rose-700',
      mutedText: 'text-rose-600',
    };
  }

  return {
    active: 'from-slate-400 to-slate-600 shadow-slate-200/80',
    rail: 'bg-slate-300',
    badge: 'border-slate-200 bg-slate-50 text-slate-600',
    mutedText: 'text-slate-500',
  };
};

/* ── Progress Ring ── */
const ProgressRing = ({ percent, size = 64, stroke = 6 }: { percent: number; size?: number; stroke?: number }) => {
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percent / 100) * circumference;
  const color = percent >= 80 ? '#10b981' : percent >= 50 ? '#f59e0b' : '#f43f5e';
  
  return (
    <svg width={size} height={size} className="transform -rotate-90">
      <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="#f1f5f9" strokeWidth={stroke} />
      <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke={color} strokeWidth={stroke} strokeDasharray={circumference} strokeDashoffset={offset} strokeLinecap="round" className="transition-all duration-1000 ease-out" />
    </svg>
  );
};

/* ── Room Card Component ── */
const RoomCard = ({ room, selectedFloor, hoveredRoom, setHoveredRoom, roomIndex, colCount = 3, onRoomClick }: { 
  room: ReturnType<typeof generateFloorData>[0]; 
  selectedFloor: number;
  hoveredRoom: string | null; 
  setHoveredRoom: (r: string | null) => void;
  roomIndex: number;
  colCount?: number;
  onRoomClick: (roomNumber: string, floor: number) => void;
}) => {
  const cfg = statusConfig[room.status];
  const isHovered = hoveredRoom === room.number;
  const isTopRow = roomIndex < colCount;

  // Icon for room type
  const TypeIcon = room.type === 'Presidential' ? Shield : room.type === 'Suite' ? Zap : room.type === 'Deluxe' ? TrendingUp : Building2;

  // Status-based icon bg (matching Room Tracker style)
  const iconBgStyles: Record<string, string> = {
    'ready': 'bg-gradient-to-br from-emerald-400 to-emerald-600 text-white shadow-lg shadow-emerald-200',
    'in-progress': 'bg-gradient-to-br from-amber-400 to-amber-600 text-white shadow-lg shadow-amber-200',
    'flagged': 'bg-gradient-to-br from-rose-400 to-rose-600 text-white shadow-lg shadow-rose-200',
    'not-started': 'bg-gradient-to-br from-blue-300 to-blue-500 text-white shadow-lg shadow-blue-200',
  };

  return (
    <div
      className={`relative group cursor-pointer transition-all duration-300 ${isHovered ? 'z-30 scale-105' : 'hover:scale-[1.03]'}`}
      onMouseEnter={() => setHoveredRoom(room.number)}
      onMouseLeave={() => setHoveredRoom(null)}
      onClick={() => onRoomClick(room.number, selectedFloor)}
    >
      {/* Card */}
      <div className={`relative overflow-hidden rounded-[1.25rem] border ${cfg.border} bg-gradient-to-br ${cfg.cardBg} p-3 aspect-square transition-all duration-300 flex flex-col ${isHovered ? `shadow-xl ${cfg.glow}` : 'shadow-sm hover:shadow-md'}`}>
        {/* Status Indicator Bar */}
        <div className={`absolute top-0 left-0 right-0 h-1.5 ${cfg.bg}`} />
        
        {/* Top row: icon badge + status icon */}
        <div className="flex items-center justify-between mt-1.5">
          <div className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all group-hover:scale-110 group-hover:rotate-[8deg] ${iconBgStyles[room.status]}`}>
            <TypeIcon size={14} />
          </div>
          {room.status === 'ready' && <CheckCircle size={15} className="text-emerald-500" />}
          {room.status === 'in-progress' && <Activity size={15} className="text-amber-500 animate-pulse" />}
          {room.status === 'flagged' && <AlertTriangle size={15} className="text-rose-500 animate-pulse" />}
          {room.status === 'not-started' && <Clock size={15} className="text-slate-300" />}
        </div>
        
        {/* Room number */}
        <div className="flex-1 flex flex-col justify-center">
          <span className="text-lg font-black text-slate-900 leading-none tracking-tight">{room.number}</span>
          <div className="flex items-center gap-1.5 mt-1.5">
            <div className={`w-1.5 h-1.5 rounded-full ${cfg.dot} transition-all group-hover:scale-125`} />
            <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">{room.type === 'Standard' ? 'STD' : room.type}</span>
          </div>
        </div>

        {/* Bottom row: housekeeper/issues + status */}
        <div className="flex items-center justify-between mt-auto pt-2 border-t border-black/5">
          {room.housekeeper ? (
            <span className="text-[8px] font-bold text-blue-500 truncate max-w-[60px]">{room.housekeeper.split(' ')[0]}</span>
          ) : room.issues > 0 ? (
            <div className="flex items-center gap-1 px-1.5 py-0.5 bg-rose-100 rounded-md">
              <XCircle size={8} className="text-rose-500" />
              <span className="text-[8px] font-bold text-rose-600">{room.issues}</span>
            </div>
          ) : (
            <span className="text-[8px] font-bold text-slate-300">{cfg.label.split(' ')[0]}</span>
          )}
          <div className="w-5 h-5 rounded-full bg-white/50 flex items-center justify-center text-slate-300 group-hover:bg-blue-600 group-hover:text-white transition-all">
            <Eye size={10} />
          </div>
        </div>
      </div>

      {/* Hover Popover */}
      {isHovered && (
        <div className={`absolute left-1/2 -translate-x-1/2 z-50 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-slate-200/80 p-5 w-64 pointer-events-none animate-fade-in-up ${
          isTopRow ? 'top-full mt-3' : 'bottom-full mb-3'
        }`}>
          {/* Arrow - points up for below popover, points down for above popover */}
          {isTopRow ? (
            <div className="absolute left-1/2 -translate-x-1/2 -top-2 w-4 h-4 bg-white border-l border-t border-slate-200/80 transform rotate-45" />
          ) : (
            <div className="absolute left-1/2 -translate-x-1/2 -bottom-2 w-4 h-4 bg-white border-r border-b border-slate-200/80 transform rotate-45" />
          )}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2.5">
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${iconBgStyles[room.status]}`}>
                <TypeIcon size={16} />
              </div>
              <h4 className="text-base font-black text-slate-900">Room {room.number}</h4>
            </div>
            <span className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase ${
              room.status === 'ready' ? 'bg-emerald-100 text-emerald-700 border border-emerald-200' :
              room.status === 'in-progress' ? 'bg-amber-100 text-amber-700 border border-amber-200' :
              room.status === 'flagged' ? 'bg-rose-100 text-rose-700 border border-rose-200' : 
              'bg-slate-100 text-slate-500 border border-slate-200'
            }`}>{cfg.label}</span>
          </div>
          <div className="space-y-2 text-sm text-slate-500">
            <p className="flex items-center gap-2"><Layers size={12} className="text-slate-400" /> {room.type} · Floor {selectedFloor}</p>
            {room.housekeeper && <p className="flex items-center gap-2"><User size={12} className="text-blue-500" /> <strong className="text-slate-700">{room.housekeeper}</strong></p>}
            {room.lastScan && <p className="flex items-center gap-2"><Clock size={12} className="text-slate-400" /> Scanned {room.lastScan}</p>}
            {room.issues > 0 && <p className="flex items-center gap-2 text-rose-600"><AlertTriangle size={12} /> <strong>{room.issues} issue{room.issues > 1 ? 's' : ''}</strong> found</p>}
          </div>
        </div>
      )}
    </div>
  );
};


export default function LiveFloorMap() {
  const router = useRouter();
  const [selectedFloor, setSelectedFloor] = useState(2);
  const [hoveredRoom, setHoveredRoom] = useState<string | null>(null);

  const handleRoomClick = (roomNumber: string, floor: number) => {
    router.push(`/manager/inspection?floor=${floor}&room=${roomNumber}`);
  };
  
  const rooms = useMemo(() => generateFloorData(selectedFloor), [selectedFloor]);

  const counts = {
    ready: rooms.filter(r => r.status === 'ready').length,
    inProgress: rooms.filter(r => r.status === 'in-progress').length,
    flagged: rooms.filter(r => r.status === 'flagged').length,
    notStarted: rooms.filter(r => r.status === 'not-started').length,
  };
  const total = rooms.length;
  const readyPercent = Math.round((counts.ready / total) * 100);
  const isBottleneck = readyPercent < 50 && counts.flagged > 1;

  // Split rooms into wings
  const halfCount = Math.ceil(rooms.length / 2);
  const leftRooms = rooms.slice(0, halfCount);
  const rightRooms = rooms.slice(halfCount);

  // Floor progress data for selector
  const floorProgress = useMemo(() => floorList.map(f => {
    const data = generateFloorData(f);
    const ready = data.filter(r => r.status === 'ready').length;
    const flagged = data.filter(r => r.status === 'flagged').length;
    return { floor: f, percent: Math.round((ready / data.length) * 100), flagged, total: data.length };
  }), []);

  const activeHousekeepers = rooms.filter(r => r.housekeeper);
  const pageTone = getPageTone(readyPercent);

  return (
    <div className="space-y-6 pb-12">
      {/* ═══ Header Hero ═══ */}
      <div className={`${panelShellClass} animate-fade-in-up bg-gradient-to-br ${pageTone.heroBg}`}>
        <div className={`pointer-events-none absolute inset-0 ${pageTone.heroOverlay}`} />
        <div className={`pointer-events-none absolute -right-14 -top-4 h-44 w-44 rounded-full blur-3xl transition-transform duration-500 group-hover:scale-110 group-hover:-translate-x-2 ${pageTone.glowPrimary}`} />
        <div className={`pointer-events-none absolute -left-10 bottom-0 h-36 w-36 rounded-full blur-3xl transition-transform duration-500 group-hover:scale-105 group-hover:-translate-y-1 ${pageTone.glowSecondary}`} />
        <div className="pointer-events-none absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-white to-transparent opacity-90" />

        <div className="relative p-6 md:p-7">
          <div className="flex flex-col xl:flex-row xl:items-start xl:justify-between gap-6">
            <div className="space-y-5">
              <div className="flex items-center gap-2.5 flex-wrap">
                <div className={`px-3.5 py-1.5 rounded-full border text-[10px] font-black uppercase tracking-[0.24em] shadow-sm ${pageTone.accentSurface}`}>
                  Live Operations
                </div>
                <div className="px-3.5 py-1.5 rounded-full border border-white/80 bg-white/70 text-[10px] font-black uppercase tracking-[0.24em] text-slate-500 shadow-sm">
                  Spatial Readiness View
                </div>
              </div>

              <div>
                <h1 className="text-3xl md:text-[2.2rem] font-black tracking-tight text-slate-900">Live Floor Map</h1>
                <p className="mt-2 max-w-2xl text-sm md:text-base text-slate-500 font-medium">
                  Real-time room readiness, issue pressure, and active housekeeping movement across Floor {selectedFloor}.
                </p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                  { label: 'Guest Ready', value: `${counts.ready}/${total}`, icon: CheckCircle, chip: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
                  { label: 'In Progress', value: `${counts.inProgress}`, icon: Activity, chip: 'bg-amber-50 text-amber-700 border-amber-200' },
                  { label: 'Flagged', value: `${counts.flagged}`, icon: AlertTriangle, chip: 'bg-rose-50 text-rose-700 border-rose-200' },
                  { label: 'Active Team', value: `${activeHousekeepers.length}`, icon: User, chip: 'bg-blue-50 text-blue-700 border-blue-200' },
                ].map((metric) => (
                  <div key={metric.label} className="rounded-[1.35rem] border border-white/75 bg-white/68 p-4 shadow-[0_20px_55px_-38px_rgba(15,23,42,0.2)] backdrop-blur-sm">
                    <div className="flex items-center justify-between">
                      <div className={`w-10 h-10 rounded-2xl border bg-white/80 flex items-center justify-center shadow-sm ${metric.chip}`}>
                        <metric.icon size={16} />
                      </div>
                      <div className={`px-2.5 py-1 rounded-full border text-[10px] font-black uppercase tracking-[0.18em] ${metric.chip}`}>
                        {metric.label}
                      </div>
                    </div>
                    <p className="mt-4 text-2xl font-black tracking-tight text-slate-900">{metric.value}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-wrap xl:flex-col gap-3 xl:items-end">
              <div className="flex items-center gap-2 px-4 py-2.5 bg-white/75 border border-white/80 rounded-2xl shadow-sm backdrop-blur-sm">
                <div className="relative">
                  <Wifi size={14} className="text-emerald-600" />
                  <div className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-emerald-500 rounded-full animate-ping" />
                </div>
                <span className="text-xs font-black uppercase tracking-[0.18em] text-emerald-700">Live Feed</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2.5 bg-white/75 border border-white/80 rounded-2xl shadow-sm backdrop-blur-sm">
                <MapPin size={14} className="text-blue-500" />
                <span className="text-sm font-bold text-slate-700">Floor {selectedFloor} · {total} rooms</span>
              </div>
              <div className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl border shadow-sm backdrop-blur-sm ${pageTone.accentSurface}`}>
                <TrendingUp size={14} />
                <span className="text-sm font-black">{readyPercent}% Ready</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ═══ Floor Selector - Horizontal with Progress ═══ */}
      <div className={`${panelShellClass} animate-fade-in-up stagger-1 bg-gradient-to-br ${pageTone.selectorBg} p-5`}>
        <div className={`pointer-events-none absolute inset-0 ${pageTone.selectorOverlay}`} />
        <div className="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-white to-transparent opacity-90" />

        <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-2xl bg-white/80 border border-white/80 flex items-center justify-center shadow-sm">
              <Building2 size={16} className="text-slate-500" />
            </div>
            <div>
              <span className="text-xs font-black text-slate-400 uppercase tracking-[0.24em]">Select Floor</span>
              <p className="text-xs text-slate-400 font-medium mt-1">Swap between live readiness states and bottlenecks</p>
            </div>
          </div>
          <div className="px-3.5 py-1.5 rounded-full border border-white/80 bg-white/70 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 shadow-sm">
            Live Floor Routing
          </div>
        </div>

        <div className="relative grid grid-cols-2 sm:grid-cols-4 xl:grid-cols-7 gap-3">
          {floorProgress.map((fp) => {
            const tone = getFloorCardTone(fp.percent);
            return (
              <button
                key={fp.floor}
                onClick={() => setSelectedFloor(fp.floor)}
                className={`relative overflow-hidden rounded-[1.35rem] p-3.5 transition-all duration-300 ${
                  selectedFloor === fp.floor
                    ? `bg-gradient-to-br ${tone.active} text-white shadow-xl scale-[1.02]`
                    : 'bg-white/72 border border-white/80 text-slate-600 shadow-sm hover:bg-white hover:shadow-lg hover:-translate-y-0.5'
                }`}
              >
                <div className="flex items-center justify-between mb-2.5">
                  <span className="text-lg font-black">F{fp.floor}</span>
                  <div className="flex items-center gap-1.5">
                    {fp.floor === 8 && <span className={`text-[10px] ${selectedFloor === fp.floor ? 'text-white/70' : 'text-slate-300'}`}>★</span>}
                    {fp.flagged > 0 && (
                      <div className={`rounded-full px-1.5 py-0.5 text-[9px] font-black ${selectedFloor === fp.floor ? 'bg-white/15 text-white' : `border ${tone.badge}`}`}>
                        {fp.flagged}
                      </div>
                    )}
                  </div>
                </div>
                <div className={`w-full h-1.5 rounded-full ${selectedFloor === fp.floor ? 'bg-white/18' : 'bg-slate-200/80'}`}>
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${selectedFloor === fp.floor ? 'bg-white/85' : tone.rail}`}
                    style={{ width: `${fp.percent}%` }}
                  />
                </div>
                <div className="mt-2.5 flex items-center justify-between">
                  <span className={`text-[10px] font-black uppercase tracking-[0.14em] ${selectedFloor === fp.floor ? 'text-white/70' : tone.mutedText}`}>
                    {fp.percent}% ready
                  </span>
                  <span className={`text-[10px] font-bold ${selectedFloor === fp.floor ? 'text-white/60' : 'text-slate-400'}`}>
                    {fp.total} rooms
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* ═══ Stats Row ═══ */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-4 animate-fade-in-up stagger-2">
        {/* Progress Ring Card */}
        <div className={`${panelShellClass} bg-gradient-to-br from-[#eefcf5] via-[#ffffff] to-[#eef8ff] p-5`}>
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(16,185,129,0.14)_0,transparent_34%),radial-gradient(circle_at_bottom_right,rgba(59,130,246,0.08)_0,transparent_42%)]" />
          <div className="relative flex items-center gap-5">
            <div className="relative shrink-0">
              <ProgressRing percent={readyPercent} />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-base font-black text-slate-900">{readyPercent}%</span>
              </div>
            </div>
            <div>
              <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.24em]">Floor Ready</p>
              <p className="text-[1.6rem] font-black tracking-tight text-slate-900 mt-1">{counts.ready}<span className="text-sm text-slate-400 font-medium"> / {total}</span></p>
              <div className={`inline-flex items-center gap-1.5 mt-3 px-2.5 py-1 rounded-full border text-[10px] font-black uppercase tracking-[0.16em] ${pageTone.accentSurface}`}>
                <TrendingUp size={12} />
                Live Snapshot
              </div>
            </div>
          </div>
        </div>

        {/* Status Cards */}
        {[
          { key: 'ready', label: 'Ready', count: counts.ready, config: statusConfig['ready'], icon: CheckCircle },
          { key: 'in-progress', label: 'In Progress', count: counts.inProgress, config: statusConfig['in-progress'], icon: Activity },
          { key: 'flagged', label: 'Flagged', count: counts.flagged, config: statusConfig['flagged'], icon: AlertTriangle },
          { key: 'not-started', label: 'Not Started', count: counts.notStarted, config: statusConfig['not-started'], icon: Clock },
        ].map((stat) => {
          const style = statCardStyles[stat.key];
          return (
            <div key={stat.label} className={`${panelShellClass} border ${style.border} bg-gradient-to-br ${style.surface} p-5`}>
              <div className="pointer-events-none absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-white to-transparent opacity-90" />
              <div className="relative flex items-center gap-4">
                <div className={`w-11 h-11 rounded-2xl bg-gradient-to-br ${style.iconSurface} flex items-center justify-center shrink-0 shadow-lg ${style.shadow}`}>
                  <stat.icon size={18} className={stat.config.text} />
                </div>
                <div className="flex-1">
                  <span className="text-3xl font-black tracking-tight text-slate-900">{stat.count}</span>
                  <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.22em] mt-1">{stat.label}</p>
                </div>
                <div className="rounded-full border border-white/80 bg-white/70 px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.15em] text-slate-400 shadow-sm">
                  {Math.round((stat.count / total) * 100)}%
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ═══ Bottleneck Alert ═══ */}
      {isBottleneck && (
        <div className={`${panelShellClass} bg-gradient-to-r from-rose-50 via-orange-50 to-amber-50 p-5 flex items-center gap-5 animate-fade-in-up border border-rose-200/80`}>
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(244,63,94,0.14)_0,transparent_34%),radial-gradient(circle_at_bottom_right,rgba(245,158,11,0.10)_0,transparent_42%)]" />
          <div className="p-3 bg-rose-100 rounded-2xl shrink-0">
            <Zap size={20} className="text-rose-600" />
          </div>
          <div className="relative flex-1">
            <h4 className="text-sm font-bold text-rose-800">Bottleneck Detected — Floor {selectedFloor}</h4>
            <p className="text-xs text-rose-600 mt-0.5">Only {readyPercent}% ready with {counts.flagged} flagged rooms. Consider reassigning housekeepers.</p>
          </div>
          <button className="relative px-5 py-2.5 bg-rose-600 text-white rounded-xl text-xs font-bold hover:bg-rose-700 transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 shrink-0">
            Reassign Staff
          </button>
        </div>
      )}

      {/* ═══ Room Layout ═══ */}
      <div className={`${panelShellClass} overflow-hidden animate-fade-in-up stagger-3 bg-gradient-to-br ${pageTone.layoutBg}`}>
        <div className={`pointer-events-none absolute inset-0 ${pageTone.layoutOverlay}`} />
        <div className="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-white to-transparent opacity-90" />
        {/* Layout Header */}
        <div className="relative px-6 py-5 bg-white/72 border-b border-white/80 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-white/85 border border-white/90 rounded-2xl flex items-center justify-center shadow-sm">
              <Eye size={16} className="text-blue-600" />
            </div>
            <div>
              <h2 className="text-sm font-black text-slate-900">Floor {selectedFloor} — Room Layout</h2>
              <p className="text-[10px] text-slate-400 font-medium">Hover rooms for details</p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3 md:gap-5">
            {Object.entries(statusConfig).map(([key, cfg]) => (
              <div key={key} className="flex items-center gap-2 rounded-full border border-white/80 bg-white/70 px-3 py-1.5 shadow-sm">
                <div className={`w-3 h-3 rounded-md ${cfg.bg} shadow-sm`} />
                <span className="text-xs text-slate-500 font-medium">{cfg.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Room Grid Layout */}
        <div className="relative p-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* West Wing */}
            <div className="flex-1">
              <div className="text-[10px] font-black text-slate-300 uppercase tracking-[0.3em] text-center mb-3 flex items-center gap-2 justify-center">
                <div className="flex-1 h-px bg-white/80" />
                <span>West Wing</span>
                <div className="flex-1 h-px bg-white/80" />
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2.5 overflow-visible">
                {leftRooms.map((room, idx) => (
                  <RoomCard key={room.number} room={room} selectedFloor={selectedFloor} hoveredRoom={hoveredRoom} setHoveredRoom={setHoveredRoom} roomIndex={idx} colCount={3} onRoomClick={handleRoomClick} />
                ))}
              </div>
            </div>

            {/* Corridor */}
            <div className="hidden md:flex flex-col items-center w-14 shrink-0">
              <div className="w-full px-2 py-2 bg-white/85 rounded-t-xl border border-white/90 border-b-0 flex items-center justify-center shadow-sm">
                <span className="text-[7px] font-black text-slate-400 uppercase tracking-wider">Stairs</span>
              </div>
              <div className="w-full flex-1 bg-gradient-to-b from-white/90 via-slate-100/55 to-white/90 border-x border-white/90 flex items-center justify-center relative min-h-[200px]">
                <div className="absolute inset-0 flex flex-col items-center justify-evenly py-4 opacity-30">
                  {Array.from({ length: 6 }, (_, i) => (
                    <div key={i} className="w-6 h-px bg-slate-300" />
                  ))}
                </div>
                <span className="text-[8px] font-black text-slate-300 uppercase tracking-[0.2em] relative z-10" style={{ writingMode: 'vertical-rl', textOrientation: 'mixed' }}>
                  Corridor
                </span>
              </div>
              <div className="w-full py-3 bg-blue-50/95 border border-blue-200/80 flex flex-col items-center justify-center gap-0.5 shadow-sm">
                <ArrowUpDown size={12} className="text-blue-400" />
                <span className="text-[7px] font-black text-blue-500 uppercase">Lift</span>
              </div>
              <div className="w-full flex-1 bg-gradient-to-b from-white/90 via-slate-100/55 to-white/90 border-x border-white/90 min-h-[80px]" />
              <div className="w-full px-2 py-2 bg-white/85 rounded-b-xl border border-white/90 border-t-0 flex items-center justify-center shadow-sm">
                <span className="text-[7px] font-black text-slate-400 uppercase tracking-wider">Exit</span>
              </div>
            </div>

            {/* East Wing */}
            <div className="flex-1">
              <div className="text-[10px] font-black text-slate-300 uppercase tracking-[0.3em] text-center mb-3 flex items-center gap-2 justify-center">
                <div className="flex-1 h-px bg-white/80" />
                <span>East Wing</span>
                <div className="flex-1 h-px bg-white/80" />
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2.5 overflow-visible">
                {rightRooms.map((room, idx) => (
                  <RoomCard key={room.number} room={room} selectedFloor={selectedFloor} hoveredRoom={hoveredRoom} setHoveredRoom={setHoveredRoom} roomIndex={idx} colCount={3} onRoomClick={handleRoomClick} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ═══ Active Housekeepers ═══ */}
      <div className={`${panelShellClass} overflow-hidden animate-fade-in-up stagger-4 bg-gradient-to-br ${pageTone.staffBg}`}>
        <div className={`pointer-events-none absolute inset-0 ${pageTone.staffOverlay}`} />
        <div className="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-white to-transparent opacity-90" />
        <div className="relative px-6 py-5 bg-white/72 border-b border-white/80 flex items-center gap-3">
          <div className="w-9 h-9 bg-white/85 border border-white/90 rounded-2xl flex items-center justify-center shadow-sm">
            <Shield size={16} className="text-blue-600" />
          </div>
          <div>
            <h3 className="text-sm font-black text-slate-900">Active Housekeepers — Floor {selectedFloor}</h3>
            <p className="text-[10px] text-slate-400 font-medium">{activeHousekeepers.length} currently assigned</p>
          </div>
          {activeHousekeepers.length > 0 && (
            <div className="ml-auto flex items-center gap-1.5 px-3 py-1.5 bg-white/80 text-blue-600 rounded-full border border-white/90 shadow-sm">
              <TrendingUp size={12} />
              <span className="text-xs font-bold">{activeHousekeepers.length} Active</span>
            </div>
          )}
        </div>
        <div className="relative p-6">
          {activeHousekeepers.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {activeHousekeepers.map((room) => (
                <div key={room.number} className="flex items-center gap-3 px-4 py-3.5 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-xl hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 cursor-pointer group">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-md shadow-blue-200 group-hover:shadow-lg group-hover:shadow-blue-300 transition-all">
                    <User size={16} className="text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-sm font-bold text-slate-800 block truncate">{room.housekeeper}</span>
                    <p className="text-[10px] text-blue-500 font-medium">Room {room.number} · {room.type}</p>
                  </div>
                  <div className="w-2.5 h-2.5 bg-amber-400 rounded-full animate-pulse shrink-0" title="In Progress" />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-10">
              <div className="w-14 h-14 mx-auto bg-slate-100 rounded-2xl flex items-center justify-center mb-3">
                <User size={24} className="text-slate-300" />
              </div>
              <p className="text-sm text-slate-400 font-medium">No housekeepers currently active on this floor</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
