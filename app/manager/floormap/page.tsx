"use client";

import React, { useState } from 'react';
import { 
  User, AlertTriangle, Clock, MapPin, ChevronDown,
  Eye, XCircle
} from 'lucide-react';

/* ── Dummy Data ── */
const floors: Record<number, { rooms: { number: string; status: 'ready' | 'in-progress' | 'flagged' | 'not-started' | 'occupied'; housekeeper?: string }[] }> = {
  4: {
    rooms: [
      { number: "401", status: "ready" }, { number: "402", status: "ready" }, { number: "403", status: "ready" },
      { number: "404", status: "ready" }, { number: "405", status: "ready" }, { number: "406", status: "ready" },
      { number: "407", status: "ready" }, { number: "408", status: "ready" }, { number: "409", status: "ready" },
      { number: "410", status: "ready" }, { number: "412", status: "ready" }, { number: "415", status: "ready" },
      { number: "418", status: "ready" }, { number: "420", status: "ready" }, { number: "422", status: "ready" },
      { number: "425", status: "ready" }, { number: "428", status: "ready" }, { number: "430", status: "ready" },
      { number: "432", status: "ready" },
      { number: "438", status: "in-progress", housekeeper: "Priya S." },
      { number: "440", status: "in-progress" },
      { number: "442", status: "not-started" },
    ],
  },
  7: {
    rooms: [
      { number: "701", status: "ready" }, { number: "702", status: "ready" }, { number: "703", status: "ready" },
      { number: "704", status: "ready" }, { number: "705", status: "ready" }, { number: "706", status: "ready" },
      { number: "707", status: "ready" }, { number: "708", status: "ready", housekeeper: "Deepak J." },
      { number: "710", status: "in-progress" }, { number: "712", status: "in-progress" }, { number: "714", status: "in-progress" },
      { number: "715", status: "in-progress", housekeeper: "Ravi M." },
      { number: "716", status: "flagged" }, { number: "718", status: "flagged" },
      { number: "720", status: "not-started" }, { number: "722", status: "not-started" }, { number: "724", status: "not-started" },
      { number: "726", status: "not-started" },
    ],
  },
  2: {
    rooms: Array.from({ length: 22 }, (_, i) => ({
      number: `${200 + i + 1}`,
      status: (i < 18 ? 'ready' : i < 20 ? 'in-progress' : i < 21 ? 'flagged' : 'not-started') as 'ready' | 'in-progress' | 'flagged' | 'not-started',
    })),
  },
  3: {
    rooms: Array.from({ length: 22 }, (_, i) => ({
      number: `${300 + i + 1}`,
      status: (i < 14 ? 'ready' : i < 18 ? 'in-progress' : i < 20 ? 'flagged' : 'not-started') as 'ready' | 'in-progress' | 'flagged' | 'not-started',
    })),
  },
  5: {
    rooms: Array.from({ length: 20 }, (_, i) => ({
      number: `${500 + i + 1}`,
      status: (i < 12 ? 'ready' : i < 16 ? 'in-progress' : i < 18 ? 'flagged' : 'not-started') as 'ready' | 'in-progress' | 'flagged' | 'not-started',
    })),
  },
  6: {
    rooms: Array.from({ length: 20 }, (_, i) => ({
      number: `${600 + i + 1}`,
      status: (i < 16 ? 'ready' : i < 18 ? 'in-progress' : i < 19 ? 'flagged' : 'not-started') as 'ready' | 'in-progress' | 'flagged' | 'not-started',
    })),
  },
  8: {
    rooms: Array.from({ length: 18 }, (_, i) => ({
      number: `${800 + i + 1}`,
      status: 'not-started' as const,
    })),
  },
};

const floorList = [2, 3, 4, 5, 6, 7, 8];

const statusColors: Record<string, string> = {
  'ready': 'bg-emerald-400 hover:bg-emerald-500',
  'in-progress': 'bg-amber-400 hover:bg-amber-500',
  'flagged': 'bg-rose-400 hover:bg-rose-500 animate-pulse',
  'not-started': 'bg-slate-200 hover:bg-slate-300',
  'occupied': 'bg-blue-300 hover:bg-blue-400',
};

const statusLabels: Record<string, string> = {
  'ready': 'Guest Ready',
  'in-progress': 'In Progress',
  'flagged': 'Flagged',
  'not-started': 'Not Started',
  'occupied': 'Occupied / DND',
};

export default function LiveFloorMap() {
  const [selectedFloor, setSelectedFloor] = useState(4);
  const [hoveredRoom, setHoveredRoom] = useState<string | null>(null);
  const currentFloor = floors[selectedFloor];

  const counts = {
    ready: currentFloor.rooms.filter(r => r.status === 'ready').length,
    inProgress: currentFloor.rooms.filter(r => r.status === 'in-progress').length,
    flagged: currentFloor.rooms.filter(r => r.status === 'flagged').length,
    notStarted: currentFloor.rooms.filter(r => r.status === 'not-started').length,
  };

  const isBottleneck = selectedFloor === 7;

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-20">
      {/* Header */}
      <div className="flex items-center justify-between animate-fade-in-up">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900">Live Floor Map</h1>
          <p className="text-slate-400 font-medium mt-1">Real-time spatial view — Taj Mahal Palace, Mumbai</p>
        </div>
        <div className="flex items-center gap-2">
          <MapPin size={16} className="text-blue-500" />
          <span className="text-sm font-bold text-slate-600">Floor {selectedFloor} · {currentFloor.rooms.length} rooms</span>
        </div>
      </div>

      {/* Floor Tabs */}
      <div className="flex items-center gap-2 animate-fade-in-up stagger-1">
        {floorList.map((floor) => (
          <button
            key={floor}
            onClick={() => setSelectedFloor(floor)}
            className={`px-5 py-3 rounded-xl text-sm font-bold transition-all ${
              selectedFloor === floor 
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' 
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            } ${floor === 7 ? 'ring-2 ring-rose-300' : ''}`}
          >
            Floor {floor}
            {floor === 8 && <span className="ml-1 text-[10px] opacity-70">(Suites)</span>}
          </button>
        ))}
      </div>

      {/* Bottleneck Alert */}
      {isBottleneck && (
        <div className="p-5 bg-rose-50 border border-rose-200 rounded-2xl flex items-center gap-4 animate-fade-in-up">
          <div className="p-2.5 bg-rose-100 rounded-xl">
            <AlertTriangle size={20} className="text-rose-600" />
          </div>
          <div className="flex-1">
            <h4 className="text-sm font-bold text-rose-800">Bottleneck Detected — Floor 7</h4>
            <p className="text-xs text-rose-600 mt-0.5">Floor 7 is 44% ready. Check-in wave in 2h 14m. Recommend reassigning 1 housekeeper from Floor 4 (95% complete).</p>
          </div>
          <button className="px-4 py-2 bg-rose-600 text-white rounded-xl text-xs font-bold hover:bg-rose-700 transition-all">
            Reassign Staff
          </button>
        </div>
      )}

      {/* Floor Stats */}
      <div className="grid grid-cols-4 gap-4 animate-fade-in-up stagger-2">
        <div className="kpi-card p-4 rounded-2xl flex items-center gap-3">
          <div className="w-4 h-4 rounded-full bg-emerald-400" />
          <div>
            <span className="text-lg font-black text-slate-900">{counts.ready}</span>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Ready</p>
          </div>
        </div>
        <div className="kpi-card p-4 rounded-2xl flex items-center gap-3">
          <div className="w-4 h-4 rounded-full bg-amber-400" />
          <div>
            <span className="text-lg font-black text-slate-900">{counts.inProgress}</span>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">In Progress</p>
          </div>
        </div>
        <div className="kpi-card p-4 rounded-2xl flex items-center gap-3">
          <div className="w-4 h-4 rounded-full bg-rose-400" />
          <div>
            <span className="text-lg font-black text-slate-900">{counts.flagged}</span>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Flagged</p>
          </div>
        </div>
        <div className="kpi-card p-4 rounded-2xl flex items-center gap-3">
          <div className="w-4 h-4 rounded-full bg-slate-300" />
          <div>
            <span className="text-lg font-black text-slate-900">{counts.notStarted}</span>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Not Started</p>
          </div>
        </div>
      </div>

      {/* Floor Map */}
      <div className="glass-card rounded-3xl p-8 animate-fade-in-up stagger-3">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xs font-black text-slate-400 uppercase tracking-[0.3em]">Floor {selectedFloor} — Room Layout</h2>
          <div className="flex items-center gap-4">
            {Object.entries(statusLabels).slice(0, 4).map(([key, label]) => (
              <div key={key} className="flex items-center gap-1.5">
                <div className={`w-3 h-3 rounded ${statusColors[key].split(' ')[0]}`} />
                <span className="text-[10px] text-slate-400 font-medium">{label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Room Grid (simulated floor plan) */}
        <div className="relative">
          {/* Top corridor */}
          <div className="flex items-center justify-center mb-2">
            <div className="h-1 bg-slate-200 rounded-full flex-1" />
            <span className="px-4 text-[10px] text-slate-300 font-bold uppercase tracking-widest">Corridor</span>
            <div className="h-1 bg-slate-200 rounded-full flex-1" />
          </div>

          {/* Rooms - Top row */}
          <div className="grid gap-2 mb-6" style={{ gridTemplateColumns: `repeat(${Math.ceil(currentFloor.rooms.length / 2)}, minmax(0, 1fr))` }}>
            {currentFloor.rooms.slice(0, Math.ceil(currentFloor.rooms.length / 2)).map((room) => (
              <div
                key={room.number}
                className={`relative h-20 rounded-xl ${statusColors[room.status]} cursor-pointer transition-all flex flex-col items-center justify-center gap-1`}
                onMouseEnter={() => setHoveredRoom(room.number)}
                onMouseLeave={() => setHoveredRoom(null)}
              >
                <span className="text-[11px] font-black text-white drop-shadow-sm">{room.number}</span>
                {room.housekeeper && (
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-blue-600 rounded-full border-2 border-white flex items-center justify-center shadow-md">
                    <User size={10} className="text-white" />
                  </div>
                )}
                {room.status === 'flagged' && (
                  <XCircle size={12} className="text-white/80" />
                )}
                
                {/* Hover Popover */}
                {hoveredRoom === room.number && (
                  <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 z-50 bg-white rounded-xl shadow-xl border border-slate-200 p-4 w-48 pointer-events-none">
                    <h4 className="text-sm font-bold text-slate-900 mb-1">Room {room.number}</h4>
                    <div className="space-y-1 text-xs text-slate-500">
                      <p>Status: <strong className="text-slate-700">{statusLabels[room.status]}</strong></p>
                      {room.housekeeper && <p>Assigned: <strong className="text-slate-700">{room.housekeeper}</strong></p>}
                      <p>Type: Standard Double</p>
                      <p className="flex items-center gap-1"><Clock size={10} /> Last scan: 10:22 AM</p>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Bottom corridor */}
          <div className="flex items-center justify-center mb-2">
            <div className="h-1 bg-slate-200 rounded-full flex-1" />
            <span className="px-4 text-[10px] text-slate-300 font-bold uppercase tracking-widest">Elevator</span>
            <div className="h-1 bg-slate-200 rounded-full flex-1" />
          </div>

          {/* Rooms - Bottom row */}
          <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${Math.floor(currentFloor.rooms.length / 2)}, minmax(0, 1fr))` }}>
            {currentFloor.rooms.slice(Math.ceil(currentFloor.rooms.length / 2)).map((room) => (
              <div
                key={room.number}
                className={`relative h-20 rounded-xl ${statusColors[room.status]} cursor-pointer transition-all flex flex-col items-center justify-center gap-1`}
                onMouseEnter={() => setHoveredRoom(room.number)}
                onMouseLeave={() => setHoveredRoom(null)}
              >
                <span className="text-[11px] font-black text-white drop-shadow-sm">{room.number}</span>
                {room.housekeeper && (
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-blue-600 rounded-full border-2 border-white flex items-center justify-center shadow-md">
                    <User size={10} className="text-white" />
                  </div>
                )}
                {room.status === 'flagged' && (
                  <XCircle size={12} className="text-white/80" />
                )}

                {/* Hover Popover */}
                {hoveredRoom === room.number && (
                  <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 z-50 bg-white rounded-xl shadow-xl border border-slate-200 p-4 w-48 pointer-events-none">
                    <h4 className="text-sm font-bold text-slate-900 mb-1">Room {room.number}</h4>
                    <div className="space-y-1 text-xs text-slate-500">
                      <p>Status: <strong className="text-slate-700">{statusLabels[room.status]}</strong></p>
                      {room.housekeeper && <p>Assigned: <strong className="text-slate-700">{room.housekeeper}</strong></p>}
                      <p>Type: Standard Double</p>
                      <p className="flex items-center gap-1"><Clock size={10} /> Last scan: —</p>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Housekeeper Positions Legend */}
        <div className="mt-8 pt-6 border-t border-slate-100">
          <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.3em] mb-4">Active Housekeepers on Floor {selectedFloor}</h3>
          <div className="flex items-center gap-4">
            {currentFloor.rooms.filter(r => r.housekeeper).map((room) => (
              <div key={room.number} className="flex items-center gap-2 px-4 py-2 bg-blue-50 border border-blue-100 rounded-xl">
                <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                  <User size={12} className="text-white" />
                </div>
                <span className="text-sm font-bold text-blue-700">{room.housekeeper}</span>
                <span className="text-xs text-blue-400">@ Room {room.number}</span>
              </div>
            ))}
            {currentFloor.rooms.filter(r => r.housekeeper).length === 0 && (
              <p className="text-sm text-slate-400">No housekeepers currently active on this floor</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
