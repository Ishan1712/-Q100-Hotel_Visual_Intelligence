"use client";

import React, { useState } from 'react';
import { 
  User, AlertTriangle, Clock, MapPin, XCircle, CheckCircle,
  Building2, ArrowUpDown, Wifi
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

const statusConfig: Record<string, { color: string; hoverColor: string; label: string; dot: string }> = {
  'ready': { color: 'bg-emerald-400', hoverColor: 'hover:bg-emerald-500', label: 'Guest Ready', dot: 'bg-emerald-500' },
  'in-progress': { color: 'bg-amber-400', hoverColor: 'hover:bg-amber-500', label: 'In Progress', dot: 'bg-amber-500' },
  'flagged': { color: 'bg-rose-400', hoverColor: 'hover:bg-rose-500', label: 'Flagged', dot: 'bg-rose-500' },
  'not-started': { color: 'bg-slate-200', hoverColor: 'hover:bg-slate-300', label: 'Not Started', dot: 'bg-slate-400' },
};

/* ── Progress Ring ── */
const ProgressRing = ({ percent, size = 52, stroke = 5 }: { percent: number; size?: number; stroke?: number }) => {
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percent / 100) * circumference;
  
  return (
    <svg width={size} height={size} className="transform -rotate-90">
      <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="#f1f5f9" strokeWidth={stroke} />
      <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke={percent >= 80 ? '#10b981' : percent >= 50 ? '#f59e0b' : '#f43f5e'} strokeWidth={stroke} strokeDasharray={circumference} strokeDashoffset={offset} strokeLinecap="round" className="transition-all duration-700" />
    </svg>
  );
};

export default function LiveFloorMap() {
  const [selectedFloor, setSelectedFloor] = useState(2);
  const [hoveredRoom, setHoveredRoom] = useState<string | null>(null);
  
  const rooms = generateFloorData(selectedFloor);

  const counts = {
    ready: rooms.filter(r => r.status === 'ready').length,
    inProgress: rooms.filter(r => r.status === 'in-progress').length,
    flagged: rooms.filter(r => r.status === 'flagged').length,
    notStarted: rooms.filter(r => r.status === 'not-started').length,
  };
  const total = rooms.length;
  const readyPercent = Math.round((counts.ready / total) * 100);
  const isBottleneck = readyPercent < 50 && counts.flagged > 1;

  // Split rooms into left/right corridor 
  const halfCount = Math.ceil(rooms.length / 2);
  const leftRooms = rooms.slice(0, halfCount);
  const rightRooms = rooms.slice(halfCount);

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex items-center justify-between animate-fade-in-up">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-slate-900">Live Floor Map</h1>
          <p className="text-sm text-slate-400 font-medium mt-0.5">Real-time spatial view of room readiness</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-600 rounded-lg border border-emerald-200">
            <Wifi size={12} />
            <span className="text-xs font-bold">Live</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl">
            <MapPin size={14} className="text-blue-500" />
            <span className="text-sm font-bold text-slate-600">Floor {selectedFloor} · {total} rooms</span>
          </div>
        </div>
      </div>

      {/* Floor Tabs — Vertical Building View */}
      <div className="flex gap-5 animate-fade-in-up stagger-1">
        {/* Floor Selector as Building Column */}
        <div className="flex flex-col gap-1.5 shrink-0">
          <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-center mb-1">Floor</div>
          {[...floorList].reverse().map((floor) => {
            const floorRooms = generateFloorData(floor);
            const floorReady = floorRooms.filter(r => r.status === 'ready').length;
            const floorPercent = Math.round((floorReady / floorRooms.length) * 100);
            const hasFlagged = floorRooms.some(r => r.status === 'flagged');
            
            return (
              <button
                key={floor}
                onClick={() => setSelectedFloor(floor)}
                className={`relative w-16 py-2.5 rounded-xl text-sm font-bold transition-all duration-200 ${
                  selectedFloor === floor
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-200 scale-105'
                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-slate-300'
                }`}
              >
                {floor === 8 ? '8 ★' : floor}
                {hasFlagged && selectedFloor !== floor && (
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-rose-500 rounded-full border-2 border-white" />
                )}

              </button>
            );
          })}
          <div className="mt-1 flex items-center justify-center">
            <Building2 size={16} className="text-slate-300" />
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 space-y-5">
          {/* Stats Row */}
          <div className="grid grid-cols-5 gap-4">
            {/* Progress Ring */}
            <div className="kpi-card p-4 rounded-2xl flex items-center gap-4">
              <div className="relative">
                <ProgressRing percent={readyPercent} />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-sm font-black text-slate-900">{readyPercent}%</span>
                </div>
              </div>
              <div>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Floor Ready</p>
                <p className="text-xs text-slate-500 mt-0.5">{counts.ready} of {total}</p>
              </div>
            </div>
            {/* Status Cards */}
            {[
              { label: 'Ready', count: counts.ready, config: statusConfig['ready'] },
              { label: 'In Progress', count: counts.inProgress, config: statusConfig['in-progress'] },
              { label: 'Flagged', count: counts.flagged, config: statusConfig['flagged'] },
              { label: 'Not Started', count: counts.notStarted, config: statusConfig['not-started'] },
            ].map((stat) => (
              <div key={stat.label} className="kpi-card p-4 rounded-2xl flex items-center gap-3">
                <div className={`w-3.5 h-3.5 rounded-full ${stat.config.dot} shadow-sm`} />
                <div>
                  <span className="text-xl font-black text-slate-900">{stat.count}</span>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{stat.label}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Bottleneck Alert */}
          {isBottleneck && (
            <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl flex items-center gap-4 animate-fade-in-up">
              <div className="p-2.5 bg-rose-100 rounded-xl shrink-0">
                <AlertTriangle size={18} className="text-rose-600" />
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-bold text-rose-800">Bottleneck Detected — Floor {selectedFloor}</h4>
                <p className="text-xs text-rose-600 mt-0.5">Only {readyPercent}% ready with {counts.flagged} flagged rooms. Consider reassigning staff.</p>
              </div>
              <button className="px-4 py-2 bg-rose-600 text-white rounded-xl text-xs font-bold hover:bg-rose-700 transition-all shadow-sm shrink-0">
                Reassign Staff
              </button>
            </div>
          )}

          {/* Vertical Corridor Layout */}
          <div className="glass-card rounded-2xl p-6 animate-fade-in-up stagger-2">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-xs font-black text-slate-400 uppercase tracking-[0.3em]">Floor {selectedFloor} — Room Layout</h2>
              <div className="flex items-center gap-5">
                {Object.entries(statusConfig).map(([key, cfg]) => (
                  <div key={key} className="flex items-center gap-1.5">
                    <div className={`w-2.5 h-2.5 rounded-sm ${cfg.color}`} />
                    <span className="text-[10px] text-slate-400 font-medium">{cfg.label}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-0">
              {/* Left Wing */}
              <div className="flex-1 space-y-1 pr-2">
                <div className="text-[9px] font-black text-slate-300 uppercase tracking-widest text-center mb-1.5">West Wing</div>
                {leftRooms.map((room) => {
                  const cfg = statusConfig[room.status];
                  const isHovered = hoveredRoom === room.number;
                  return (
                    <div

                      key={room.number}
                      className={`relative h-9 rounded-lg ${cfg.color} ${cfg.hoverColor} cursor-pointer transition-all duration-200 flex items-center justify-between px-3 ${isHovered ? 'shadow-lg scale-[1.02] z-10' : ''}`}
                      onMouseEnter={() => setHoveredRoom(room.number)}
                      onMouseLeave={() => setHoveredRoom(null)}
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-black text-white drop-shadow-sm">{room.number}</span>
                        {room.type !== 'Standard' && (
                          <span className="text-[8px] font-bold text-white/60 uppercase">{room.type}</span>
                        )}
                      </div>
                      <div className="flex items-center gap-1.5">
                        {room.housekeeper && (
                          <div className="w-5 h-5 bg-white/30 backdrop-blur-sm rounded-full flex items-center justify-center">
                            <User size={9} className="text-white" />
                          </div>
                        )}
                        {room.status === 'flagged' && (
                          <div className="w-5 h-5 bg-white/30 backdrop-blur-sm rounded-full flex items-center justify-center animate-pulse">
                            <XCircle size={9} className="text-white" />
                          </div>
                        )}
                        {room.status === 'ready' && (
                          <div className="w-5 h-5 bg-white/20 rounded-full flex items-center justify-center">
                            <CheckCircle size={9} className="text-white/70" />
                          </div>
                        )}
                      </div>

                      {/* Hover Popover */}
                      {isHovered && (
                        <div className="absolute left-full ml-4 top-1/2 -translate-y-1/2 z-50 bg-white rounded-2xl shadow-2xl border border-slate-200 p-4 w-56 pointer-events-none">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="text-sm font-black text-slate-900">Room {room.number}</h4>
                            <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase ${
                              room.status === 'ready' ? 'bg-emerald-50 text-emerald-600' :
                              room.status === 'in-progress' ? 'bg-amber-50 text-amber-600' :
                              room.status === 'flagged' ? 'bg-rose-50 text-rose-600' : 'bg-slate-100 text-slate-400'
                            }`}>{cfg.label}</span>
                          </div>
                          <div className="space-y-1.5 text-xs text-slate-500">
                            <p>{room.type} · Floor {selectedFloor}</p>
                            {room.housekeeper && <p className="flex items-center gap-1"><User size={10} /> <strong className="text-slate-700">{room.housekeeper}</strong></p>}
                            {room.lastScan && <p className="flex items-center gap-1"><Clock size={10} /> Scanned at {room.lastScan}</p>}
                            {room.issues > 0 && <p className="flex items-center gap-1 text-rose-600"><AlertTriangle size={10} /> {room.issues} issue{room.issues > 1 ? 's' : ''} found</p>}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Corridor */}
              <div className="flex flex-col items-center w-16 shrink-0 mx-1">
                <div className="w-full h-8 bg-slate-100 rounded-t-xl border border-slate-200 border-b-0 flex items-center justify-center">
                  <span className="text-[7px] font-black text-slate-400 uppercase tracking-wider">Stairs</span>
                </div>
                <div className="w-full flex-1 bg-gradient-to-b from-slate-50 to-slate-100 border-x border-slate-200 flex items-center justify-center relative">
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
                    {Array.from({ length: 8 }, (_, i) => (
                      <div key={i} className="w-8 h-px bg-slate-200" />
                    ))}
                  </div>
                  <span className="text-[8px] font-black text-slate-300 uppercase tracking-widest relative z-10" style={{ writingMode: 'vertical-rl', textOrientation: 'mixed' }}>
                    Corridor
                  </span>
                </div>
                <div className="w-full flex flex-col">
                  <div className="w-full py-3 bg-blue-50 border border-blue-200 flex flex-col items-center justify-center gap-0.5">
                    <ArrowUpDown size={12} className="text-blue-400" />
                    <span className="text-[7px] font-black text-blue-500 uppercase">Lift</span>
                  </div>
                </div>
                <div className="w-full flex-1 bg-gradient-to-b from-slate-100 to-slate-50 border-x border-slate-200 flex items-center justify-center relative">
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
                    {Array.from({ length: 4 }, (_, i) => (
                      <div key={i} className="w-8 h-px bg-slate-200" />
                    ))}
                  </div>
                </div>
                <div className="w-full h-8 bg-slate-100 rounded-b-xl border border-slate-200 border-t-0 flex items-center justify-center">
                  <span className="text-[7px] font-black text-slate-400 uppercase tracking-wider">Exit</span>
                </div>
              </div>

              {/* Right Wing */}
              <div className="flex-1 space-y-1 pl-2">
                <div className="text-[9px] font-black text-slate-300 uppercase tracking-widest text-center mb-1.5">East Wing</div>
                {rightRooms.map((room) => {
                  const cfg = statusConfig[room.status];
                  const isHovered = hoveredRoom === room.number;
                  return (
                    <div
                      key={room.number}
                      className={`relative h-9 rounded-lg ${cfg.color} ${cfg.hoverColor} cursor-pointer transition-all duration-200 flex items-center justify-between px-3 ${isHovered ? 'shadow-lg scale-[1.02] z-10' : ''}`}
                      onMouseEnter={() => setHoveredRoom(room.number)}
                      onMouseLeave={() => setHoveredRoom(null)}
                    >
                      <div className="flex items-center gap-1.5">
                        {room.status === 'ready' && (
                          <div className="w-5 h-5 bg-white/20 rounded-full flex items-center justify-center">
                            <CheckCircle size={9} className="text-white/70" />
                          </div>
                        )}
                        {room.housekeeper && (
                          <div className="w-5 h-5 bg-white/30 backdrop-blur-sm rounded-full flex items-center justify-center">
                            <User size={9} className="text-white" />
                          </div>
                        )}
                        {room.status === 'flagged' && (
                          <div className="w-5 h-5 bg-white/30 backdrop-blur-sm rounded-full flex items-center justify-center animate-pulse">
                            <XCircle size={9} className="text-white" />
                          </div>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        {room.type !== 'Standard' && (
                          <span className="text-[8px] font-bold text-white/60 uppercase">{room.type}</span>
                        )}
                        <span className="text-sm font-black text-white drop-shadow-sm">{room.number}</span>
                      </div>

                      {/* Hover Popover */}
                      {isHovered && (
                        <div className="absolute right-full mr-4 top-1/2 -translate-y-1/2 z-50 bg-white rounded-2xl shadow-2xl border border-slate-200 p-4 w-56 pointer-events-none">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="text-sm font-black text-slate-900">Room {room.number}</h4>
                            <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase ${
                              room.status === 'ready' ? 'bg-emerald-50 text-emerald-600' :
                              room.status === 'in-progress' ? 'bg-amber-50 text-amber-600' :
                              room.status === 'flagged' ? 'bg-rose-50 text-rose-600' : 'bg-slate-100 text-slate-400'
                            }`}>{cfg.label}</span>
                          </div>
                          <div className="space-y-1.5 text-xs text-slate-500">
                            <p>{room.type} · Floor {selectedFloor}</p>
                            {room.housekeeper && <p className="flex items-center gap-1"><User size={10} /> <strong className="text-slate-700">{room.housekeeper}</strong></p>}
                            {room.lastScan && <p className="flex items-center gap-1"><Clock size={10} /> Scanned at {room.lastScan}</p>}
                            {room.issues > 0 && <p className="flex items-center gap-1 text-rose-600"><AlertTriangle size={10} /> {room.issues} issue{room.issues > 1 ? 's' : ''} found</p>}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Active Housekeepers */}
          <div className="glass-card rounded-2xl p-5 animate-fade-in-up stagger-3">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.3em] mb-4">Active Housekeepers — Floor {selectedFloor}</h3>
            <div className="flex flex-wrap items-center gap-3">
              {rooms.filter(r => r.housekeeper).length > 0 ? (
                rooms.filter(r => r.housekeeper).map((room) => (
                  <div key={room.number} className="flex items-center gap-3 px-4 py-2.5 bg-blue-50 border border-blue-100 rounded-xl hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-pointer">
                    <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center shadow-sm shadow-blue-200">
                      <User size={14} className="text-white" />
                    </div>
                    <div>
                      <span className="text-sm font-bold text-blue-700">{room.housekeeper}</span>
                      <p className="text-[10px] text-blue-400">Room {room.number}</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-slate-400">No housekeepers currently active on this floor</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
