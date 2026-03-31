"use client";

import React, { useState, useMemo } from 'react';
import { 
  User, AlertTriangle, Clock, MapPin, XCircle, CheckCircle,
  Building2, ArrowUpDown, Wifi, Eye, Shield, Activity,
  Zap, TrendingUp, Layers
} from 'lucide-react';

/* ── Dummy Data ── */
const generateFloorData = (floor: number) => {
  const base = floor * 100;
  const count = floor === 8 ? 18 : floor <= 4 ? 22 : 20;
  const rooms = Array.from({ length: count }, (_, i) => {
    const num = base + i + 1;
    const rng = (num * 31 + 17) % 100;
    const status = floor === 8 ? 'not-started' as const
      : rng < 55 ? 'ready' as const
      : rng < 75 ? 'in-progress' as const
      : rng < 90 ? 'flagged' as const
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
const RoomCard = ({ room, selectedFloor, hoveredRoom, setHoveredRoom, roomIndex, colCount = 3 }: { 
  room: ReturnType<typeof generateFloorData>[0]; 
  selectedFloor: number;
  hoveredRoom: string | null; 
  setHoveredRoom: (r: string | null) => void;
  roomIndex: number;
  colCount?: number;
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
  const [selectedFloor, setSelectedFloor] = useState(2);
  const [hoveredRoom, setHoveredRoom] = useState<string | null>(null);
  
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

  return (
    <div className="space-y-6 pb-12">
      {/* ═══ Header ═══ */}
      <div className="flex items-center justify-between animate-fade-in-up">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-slate-900">Live Floor Map</h1>
          <p className="text-sm text-slate-400 font-medium mt-0.5">Real-time spatial view of room readiness</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3.5 py-2 bg-emerald-50 text-emerald-600 rounded-xl border border-emerald-200">
            <div className="relative">
              <Wifi size={13} />
              <div className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-emerald-500 rounded-full animate-ping" />
            </div>
            <span className="text-xs font-bold">Live</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl shadow-sm">
            <MapPin size={14} className="text-blue-500" />
            <span className="text-sm font-bold text-slate-600">Floor {selectedFloor} · {total} rooms</span>
          </div>
        </div>
      </div>

      {/* ═══ Floor Selector - Horizontal with Progress ═══ */}
      <div className="glass-card rounded-2xl p-5 animate-fade-in-up stagger-1">
        <div className="flex items-center gap-3 mb-4">
          <Building2 size={15} className="text-slate-400" />
          <span className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Select Floor</span>
        </div>
        <div className="grid grid-cols-8 gap-2.5">
          {floorProgress.map((fp) => (
            <button
              key={fp.floor}
              onClick={() => setSelectedFloor(fp.floor)}
              className={`relative rounded-xl p-3 transition-all duration-300 ${
                selectedFloor === fp.floor
                  ? 'bg-gradient-to-br from-blue-600 to-blue-700 text-white shadow-lg shadow-blue-200 scale-[1.03]'
                  : 'bg-slate-50 border border-slate-200 text-slate-600 hover:bg-white hover:shadow-md hover:-translate-y-0.5'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-lg font-black">F{fp.floor}</span>
                {fp.floor === 8 && <span className="text-[10px] opacity-70">★</span>}
                {fp.flagged > 0 && selectedFloor !== fp.floor && (
                  <div className="w-2.5 h-2.5 bg-rose-500 rounded-full animate-pulse" />
                )}
              </div>
              {/* Mini Progress Bar */}
              <div className={`w-full h-1.5 rounded-full ${selectedFloor === fp.floor ? 'bg-white/20' : 'bg-slate-200'}`}>
                <div 
                  className={`h-full rounded-full transition-all duration-500 ${
                    selectedFloor === fp.floor ? 'bg-white/80' 
                    : fp.percent >= 80 ? 'bg-emerald-400' 
                    : fp.percent >= 50 ? 'bg-amber-400' 
                    : 'bg-rose-400'
                  }`} 
                  style={{ width: `${fp.percent}%` }} 
                />
              </div>
              <span className={`text-[10px] font-bold mt-1.5 block ${selectedFloor === fp.floor ? 'text-white/70' : 'text-slate-400'}`}>
                {fp.percent}% ready
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* ═══ Stats Row ═══ */}
      <div className="grid grid-cols-5 gap-4 animate-fade-in-up stagger-2">
        {/* Progress Ring Card */}
        <div className="glass-card rounded-2xl p-5 flex items-center gap-5">
          <div className="relative shrink-0">
            <ProgressRing percent={readyPercent} />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-base font-black text-slate-900">{readyPercent}%</span>
            </div>
          </div>
          <div>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Floor Ready</p>
            <p className="text-lg font-black text-slate-900 mt-0.5">{counts.ready}<span className="text-sm text-slate-400 font-medium"> / {total}</span></p>
          </div>
        </div>
        
        {/* Status Cards */}
        {[
          { label: 'Ready', count: counts.ready, config: statusConfig['ready'], icon: CheckCircle },
          { label: 'In Progress', count: counts.inProgress, config: statusConfig['in-progress'], icon: Activity },
          { label: 'Flagged', count: counts.flagged, config: statusConfig['flagged'], icon: AlertTriangle },
          { label: 'Not Started', count: counts.notStarted, config: statusConfig['not-started'], icon: Clock },
        ].map((stat) => (
          <div key={stat.label} className={`glass-card rounded-2xl p-5 flex items-center gap-4 border-l-4 ${stat.config.border} hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5`}>
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.config.cardBg} flex items-center justify-center shrink-0`}>
              <stat.icon size={18} className={stat.config.text} />
            </div>
            <div>
              <span className="text-2xl font-black text-slate-900">{stat.count}</span>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ═══ Bottleneck Alert ═══ */}
      {isBottleneck && (
        <div className="p-5 bg-gradient-to-r from-rose-50 to-orange-50 border border-rose-200 rounded-2xl flex items-center gap-5 animate-fade-in-up shadow-sm">
          <div className="p-3 bg-rose-100 rounded-2xl shrink-0">
            <Zap size={20} className="text-rose-600" />
          </div>
          <div className="flex-1">
            <h4 className="text-sm font-bold text-rose-800">Bottleneck Detected — Floor {selectedFloor}</h4>
            <p className="text-xs text-rose-600 mt-0.5">Only {readyPercent}% ready with {counts.flagged} flagged rooms. Consider reassigning housekeepers.</p>
          </div>
          <button className="px-5 py-2.5 bg-rose-600 text-white rounded-xl text-xs font-bold hover:bg-rose-700 transition-all shadow-md hover:shadow-lg shrink-0">
            Reassign Staff
          </button>
        </div>
      )}

      {/* ═══ Room Layout ═══ */}
      <div className="glass-card rounded-2xl overflow-hidden animate-fade-in-up stagger-3">
        {/* Layout Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-slate-50 to-white border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
              <Eye size={16} className="text-blue-600" />
            </div>
            <div>
              <h2 className="text-sm font-black text-slate-900">Floor {selectedFloor} — Room Layout</h2>
              <p className="text-[10px] text-slate-400 font-medium">Hover rooms for details</p>
            </div>
          </div>
          <div className="flex items-center gap-5">
            {Object.entries(statusConfig).map(([key, cfg]) => (
              <div key={key} className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-md ${cfg.bg} shadow-sm`} />
                <span className="text-xs text-slate-500 font-medium">{cfg.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Room Grid Layout */}
        <div className="p-6">
          <div className="flex gap-4">
            {/* West Wing */}
            <div className="flex-1">
              <div className="text-[10px] font-black text-slate-300 uppercase tracking-[0.3em] text-center mb-3 flex items-center gap-2 justify-center">
                <div className="flex-1 h-px bg-slate-100" />
                <span>West Wing</span>
                <div className="flex-1 h-px bg-slate-100" />
              </div>
              <div className="grid grid-cols-3 gap-2.5 overflow-visible">
                {leftRooms.map((room, idx) => (
                  <RoomCard key={room.number} room={room} selectedFloor={selectedFloor} hoveredRoom={hoveredRoom} setHoveredRoom={setHoveredRoom} roomIndex={idx} colCount={3} />
                ))}
              </div>
            </div>

            {/* Corridor */}
            <div className="flex flex-col items-center w-14 shrink-0">
              <div className="w-full px-2 py-2 bg-slate-100 rounded-t-xl border border-slate-200 border-b-0 flex items-center justify-center">
                <span className="text-[7px] font-black text-slate-400 uppercase tracking-wider">Stairs</span>
              </div>
              <div className="w-full flex-1 bg-gradient-to-b from-slate-50 via-slate-100/50 to-slate-50 border-x border-slate-200 flex items-center justify-center relative min-h-[200px]">
                <div className="absolute inset-0 flex flex-col items-center justify-evenly py-4 opacity-30">
                  {Array.from({ length: 6 }, (_, i) => (
                    <div key={i} className="w-6 h-px bg-slate-300" />
                  ))}
                </div>
                <span className="text-[8px] font-black text-slate-300 uppercase tracking-[0.2em] relative z-10" style={{ writingMode: 'vertical-rl', textOrientation: 'mixed' }}>
                  Corridor
                </span>
              </div>
              <div className="w-full py-3 bg-blue-50 border border-blue-200 flex flex-col items-center justify-center gap-0.5">
                <ArrowUpDown size={12} className="text-blue-400" />
                <span className="text-[7px] font-black text-blue-500 uppercase">Lift</span>
              </div>
              <div className="w-full flex-1 bg-gradient-to-b from-slate-50 via-slate-100/50 to-slate-50 border-x border-slate-200 min-h-[80px]" />
              <div className="w-full px-2 py-2 bg-slate-100 rounded-b-xl border border-slate-200 border-t-0 flex items-center justify-center">
                <span className="text-[7px] font-black text-slate-400 uppercase tracking-wider">Exit</span>
              </div>
            </div>

            {/* East Wing */}
            <div className="flex-1">
              <div className="text-[10px] font-black text-slate-300 uppercase tracking-[0.3em] text-center mb-3 flex items-center gap-2 justify-center">
                <div className="flex-1 h-px bg-slate-100" />
                <span>East Wing</span>
                <div className="flex-1 h-px bg-slate-100" />
              </div>
              <div className="grid grid-cols-3 gap-2.5 overflow-visible">
                {rightRooms.map((room, idx) => (
                  <RoomCard key={room.number} room={room} selectedFloor={selectedFloor} hoveredRoom={hoveredRoom} setHoveredRoom={setHoveredRoom} roomIndex={idx} colCount={3} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ═══ Active Housekeepers ═══ */}
      <div className="glass-card rounded-2xl overflow-hidden animate-fade-in-up stagger-4">
        <div className="px-6 py-4 bg-gradient-to-r from-slate-50 to-white border-b border-slate-100 flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
            <Shield size={16} className="text-blue-600" />
          </div>
          <div>
            <h3 className="text-sm font-black text-slate-900">Active Housekeepers — Floor {selectedFloor}</h3>
            <p className="text-[10px] text-slate-400 font-medium">{activeHousekeepers.length} currently assigned</p>
          </div>
          {activeHousekeepers.length > 0 && (
            <div className="ml-auto flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg border border-blue-100">
              <TrendingUp size={12} />
              <span className="text-xs font-bold">{activeHousekeepers.length} Active</span>
            </div>
          )}
        </div>
        <div className="p-6">
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
