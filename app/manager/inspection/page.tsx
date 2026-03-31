"use client";

import React, { useState } from 'react';
import { 
  ChevronLeft, ChevronRight, AlertTriangle, CheckCircle, 
  XCircle, Eye, Clock, IndianRupee, RotateCcw, Ban, User, ScanSearch,
  Camera, Shield, Sparkles, ArrowRight
} from 'lucide-react';

/* ── Dummy Data ── */
const flaggedRooms = [
  { room: "512", floor: 5, type: "Standard Double", housekeeper: "Amit K.", time: "9:47 AM", issues: 2, passRate: 83 },
  { room: "718", floor: 7, type: "Deluxe King", housekeeper: "Ravi M.", time: "10:15 AM", issues: 1, passRate: 92 },
  { room: "305", floor: 3, type: "Standard Double", housekeeper: "Deepak J.", time: "8:32 AM", issues: 3, passRate: 75 },
];

const discrepancies = [
  {
    id: 1, category: "Amenity", item: "Missing Item — Dental Kit", severity: "Major" as const,
    flaggedAt: "9:47 AM", resolvedAt: "10:12 AM", resolutionTime: "25 min",
    description: "Dental kit absent from position 5 in the vanity arc arrangement.",
    zone: "Bathroom",
  },
  {
    id: 2, category: "Arrangement", item: "Incorrect Position — Body Lotion", severity: "Minor" as const,
    flaggedAt: "9:47 AM", resolvedAt: "10:12 AM", resolutionTime: "25 min",
    description: "Body lotion placed behind shampoo instead of its designated position in the arc.",
    zone: "Bathroom",
  },
];

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

/* ── Progress Ring ── */
const ProgressRing = ({ percent, size = 56, stroke = 5 }: { percent: number; size?: number; stroke?: number }) => {
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percent / 100) * circumference;
  const color = percent >= 90 ? '#10b981' : percent >= 75 ? '#f59e0b' : '#f43f5e';
  return (
    <svg width={size} height={size} className="transform -rotate-90">
      <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="#f1f5f9" strokeWidth={stroke} />
      <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke={color} strokeWidth={stroke} strokeDasharray={circumference} strokeDashoffset={offset} strokeLinecap="round" className="transition-all duration-700" />
    </svg>
  );
};

export default function AIInspectionDetail() {
  const [showAfter, setShowAfter] = useState(false);
  const [currentRoom, setCurrentRoom] = useState(0);
  const [hoveredCheckpoint, setHoveredCheckpoint] = useState<number | null>(null);
  const room = flaggedRooms[currentRoom];
  const passCount = checkpoints.filter(c => c.status === 'pass').length;
  const failCount = checkpoints.filter(c => c.status === 'fail').length;

  return (
    <div className="space-y-5 pb-12">
      {/* Page Header */}
      <div className="flex items-center justify-between animate-fade-in-up">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-slate-900">AI Inspection Detail</h1>
          <p className="text-sm text-slate-400 font-medium mt-0.5">Side-by-side comparison of Master vs. Captured scans</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setCurrentRoom(Math.max(0, currentRoom - 1))}
            className="p-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 hover:shadow-md transition-all duration-200 disabled:opacity-30"
            disabled={currentRoom === 0}
          >
            <ChevronLeft size={16} className="text-slate-600" />
          </button>
          <span className="text-sm font-bold text-slate-500 tabular-nums">{currentRoom + 1} / {flaggedRooms.length}</span>
          <button 
            onClick={() => setCurrentRoom(Math.min(flaggedRooms.length - 1, currentRoom + 1))}
            className="p-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 hover:shadow-md transition-all duration-200 disabled:opacity-30"
            disabled={currentRoom === flaggedRooms.length - 1}
          >
            <ChevronRight size={16} className="text-slate-600" />
          </button>
        </div>
      </div>

      {/* Room Info Card */}
      <div className="glass-card rounded-2xl overflow-hidden animate-fade-in-up stagger-1">
        <div className="flex items-center">
          {/* Room Identity */}
          <div className="flex items-center gap-5 px-6 py-4 flex-1">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg shadow-blue-200">
                <span className="text-lg font-black text-white">{room.room}</span>
              </div>
              <div>
                <h2 className="text-lg font-black text-slate-900">Room {room.room}</h2>
                <p className="text-xs text-slate-400">{room.type} · Floor {room.floor}</p>
              </div>
            </div>
            <div className="h-8 w-px bg-slate-100" />
            <div className="flex items-center gap-1.5 text-sm text-slate-500">
              <User size={14} className="text-slate-400" />
              <strong className="text-slate-700">{room.housekeeper}</strong>
            </div>
            <div className="h-8 w-px bg-slate-100" />
            <div className="flex items-center gap-1.5 text-sm text-slate-500">
              <Clock size={14} className="text-slate-400" />
              Scanned at <strong className="text-slate-700">{room.time}</strong>
            </div>
          </div>
          {/* Status Badge */}
          <div className="px-6 py-4 bg-rose-50 border-l border-rose-100 flex items-center gap-3">
            <AlertTriangle size={18} className="text-rose-500" />
            <div>
              <span className="text-lg font-black text-rose-600">{room.issues}</span>
              <p className="text-[10px] text-rose-400 font-bold uppercase tracking-wider">Issues</p>
            </div>
          </div>
        </div>
      </div>

      {/* Checkpoint Progress Strip */}
      <div className="glass-card rounded-2xl p-5 animate-fade-in-up stagger-2">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <Shield size={16} className="text-blue-500" />
            <h2 className="text-xs font-black text-slate-400 uppercase tracking-[0.3em]">Checkpoint Summary</h2>
          </div>
          <div className="flex items-center gap-4 text-xs">
            <span className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-emerald-500" /> <strong className="text-emerald-600">{passCount}</strong> <span className="text-slate-400">passed</span></span>
            <span className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-rose-500" /> <strong className="text-rose-600">{failCount}</strong> <span className="text-slate-400">failed</span></span>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          {checkpoints.map((cp, i) => (
            <div 
              key={i} 
              className="flex-1 group relative"
              onMouseEnter={() => setHoveredCheckpoint(i)}
              onMouseLeave={() => setHoveredCheckpoint(null)}
            >
              <div className={`h-9 rounded-lg flex items-center justify-center cursor-pointer transition-all duration-200 ${
                cp.status === 'pass' 
                  ? 'bg-emerald-100 border border-emerald-200 hover:bg-emerald-200 hover:shadow-md hover:-translate-y-0.5' 
                  : 'bg-rose-100 border border-rose-200 hover:bg-rose-200 hover:shadow-md hover:-translate-y-0.5'
              } ${hoveredCheckpoint === i ? 'shadow-lg -translate-y-1 scale-110 z-20' : ''}`}>
                {cp.status === 'pass' 
                  ? <CheckCircle size={14} className="text-emerald-600" />
                  : <XCircle size={14} className="text-rose-600" />
                }
              </div>
              {/* Tooltip */}
              <div className={`absolute bottom-full mb-2 left-1/2 -translate-x-1/2 z-50 transition-all duration-200 ${hoveredCheckpoint === i ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-1 pointer-events-none'}`}>
                <div className="px-3 py-2 bg-slate-900 text-white rounded-xl text-center shadow-xl whitespace-nowrap">
                  <p className="text-[10px] font-bold">{cp.name}</p>
                  <p className="text-[8px] text-slate-400">{cp.zone}</p>
                </div>
                <div className="w-2 h-2 bg-slate-900 rotate-45 mx-auto -mt-1" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Split-Screen Comparison */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 animate-fade-in-up stagger-3">
        {/* Master Photo */}
        <div className="glass-card rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300">
          <div className="px-5 py-3.5 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-amber-50 to-white">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center">
                <ScanSearch size={16} className="text-amber-600" />
              </div>
              <div>
                <h3 className="text-sm font-black text-slate-900">Master Reference</h3>
                <p className="text-[10px] text-slate-400">{room.type} — Bathroom Vanity</p>
              </div>
            </div>
            <span className="px-2.5 py-1 bg-amber-100 text-amber-700 rounded-lg text-[9px] font-black uppercase">Baseline</span>
          </div>
          <div className="aspect-[16/10] bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center relative">
            <div className="text-center space-y-3">
              <div className="w-16 h-16 rounded-2xl bg-white shadow-lg border border-slate-200 flex items-center justify-center mx-auto">
                <Camera size={28} className="text-slate-300" />
              </div>
              <p className="text-sm font-bold text-slate-400">Master Reference Photo</p>
              <p className="text-xs text-slate-300">2 soaps · 1 shampoo · 1 conditioner · 1 lotion · 2 dental kits</p>
            </div>
            {/* Annotated positions */}
            <div className="absolute bottom-5 right-5 px-3 py-2 rounded-xl border-2 border-dashed border-emerald-400 bg-emerald-50/50 flex items-center gap-2">
              <CheckCircle size={12} className="text-emerald-500" />
              <span className="text-[9px] font-bold text-emerald-600">Dental Kit</span>
            </div>
            <div className="absolute bottom-5 left-5 px-3 py-2 rounded-xl border-2 border-dashed border-emerald-400 bg-emerald-50/50 flex items-center gap-2">
              <CheckCircle size={12} className="text-emerald-500" />
              <span className="text-[9px] font-bold text-emerald-600">Body Lotion</span>
            </div>
          </div>
        </div>

        {/* Housekeeper's Photo */}
        <div className="glass-card rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300">
          <div className={`px-5 py-3.5 border-b border-slate-100 flex items-center justify-between ${showAfter ? 'bg-gradient-to-r from-emerald-50 to-white' : 'bg-gradient-to-r from-rose-50 to-white'}`}>
            <div className="flex items-center gap-3">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${showAfter ? 'bg-emerald-100' : 'bg-rose-100'}`}>
                <Eye size={16} className={showAfter ? 'text-emerald-600' : 'text-rose-600'} />
              </div>
              <div>
                <h3 className="text-sm font-black text-slate-900">{showAfter ? 'Re-Scan (After Fix)' : 'Housekeeper\'s Scan'}</h3>
                <p className="text-[10px] text-slate-400">Captured by {room.housekeeper}</p>
              </div>
            </div>
            <button 
              onClick={() => setShowAfter(!showAfter)}
              className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-bold hover:bg-blue-700 transition-all shadow-sm"
            >
              <RotateCcw size={12} />
              {showAfter ? 'Show Before' : 'Show After'}
            </button>
          </div>
          <div className="aspect-[16/10] bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center relative">
            {showAfter ? (
              <div className="text-center space-y-3">
                <div className="w-16 h-16 rounded-2xl bg-emerald-50 shadow-lg border border-emerald-200 flex items-center justify-center mx-auto">
                  <CheckCircle size={28} className="text-emerald-500" />
                </div>
                <p className="text-sm font-bold text-emerald-600">All Items Corrected ✓</p>
                <p className="text-xs text-slate-400">Re-scanned at 10:12 AM — All checks passed</p>
              </div>
            ) : (
              <div className="text-center space-y-3">
                <div className="w-16 h-16 rounded-2xl bg-white shadow-lg border border-slate-200 flex items-center justify-center mx-auto">
                  <Camera size={28} className="text-slate-300" />
                </div>
                <p className="text-sm font-bold text-slate-400">Housekeeper&apos;s Captured Photo</p>
                <p className="text-xs text-slate-300">1 dental kit missing · lotion misplaced</p>
              </div>
            )}
            {/* Red annotations on discrepancies */}
            {!showAfter && (
              <>
                <div className="absolute bottom-5 right-5 px-3 py-2 rounded-xl border-2 border-rose-500 bg-rose-50/80 flex items-center gap-2 animate-pulse">
                  <XCircle size={12} className="text-rose-500" />
                  <span className="text-[9px] font-bold text-rose-600">Missing</span>
                </div>
                <div className="absolute bottom-5 left-5 px-3 py-2 rounded-xl border-2 border-rose-500 bg-rose-50/80 flex items-center gap-2 animate-pulse">
                  <XCircle size={12} className="text-rose-500" />
                  <span className="text-[9px] font-bold text-rose-600">Wrong Pos</span>
                </div>
              </>
            )}
            {showAfter && (
              <>
                <div className="absolute bottom-5 right-5 px-3 py-2 rounded-xl border-2 border-emerald-400 bg-emerald-50/80 flex items-center gap-2">
                  <CheckCircle size={12} className="text-emerald-500" />
                  <span className="text-[9px] font-bold text-emerald-600">Restored</span>
                </div>
                <div className="absolute bottom-5 left-5 px-3 py-2 rounded-xl border-2 border-emerald-400 bg-emerald-50/80 flex items-center gap-2">
                  <CheckCircle size={12} className="text-emerald-500" />
                  <span className="text-[9px] font-bold text-emerald-600">Corrected</span>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Discrepancy List + Impact Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Discrepancy List */}
        <div className="lg:col-span-2 glass-card rounded-2xl p-6 animate-fade-in-up stagger-4">
          <div className="flex items-center gap-3 mb-5">
            <Sparkles size={16} className="text-amber-500" />
            <h2 className="text-xs font-black text-slate-400 uppercase tracking-[0.3em]">AI-Detected Discrepancies</h2>
          </div>
          <div className="space-y-3">
            {discrepancies.map((d) => (
              <div 
                key={d.id} 
                className="p-5 rounded-2xl border border-slate-100 hover:border-slate-200 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 cursor-pointer group"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                      d.severity === 'Major' ? 'bg-rose-100' : 'bg-amber-100'
                    }`}>
                      <AlertTriangle size={18} className={d.severity === 'Major' ? 'text-rose-500' : 'text-amber-500'} />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{d.item}</h4>
                      <p className="text-xs text-slate-400 mt-0.5">{d.zone} zone</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-1 bg-slate-100 text-slate-500 rounded-lg text-[10px] font-bold uppercase">{d.category}</span>
                    <span className={`px-2 py-1 rounded-lg text-[10px] font-bold uppercase ${
                      d.severity === 'Major' ? 'bg-rose-50 text-rose-600 border border-rose-200' : 'bg-amber-50 text-amber-600 border border-amber-200'
                    }`}>{d.severity}</span>
                  </div>
                </div>
                <p className="text-sm text-slate-500 mb-3">{d.description}</p>
                <div className="flex items-center gap-6 pt-3 border-t border-slate-100">
                  <div className="flex items-center gap-1.5 text-xs text-slate-400">
                    <Clock size={12} />
                    Flagged: <strong className="text-slate-600">{d.flaggedAt}</strong>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-slate-400">
                    <CheckCircle size={12} className="text-emerald-500" />
                    Resolved: <strong className="text-emerald-600">{d.resolvedAt}</strong>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs">
                    <span className="px-2 py-0.5 bg-emerald-50 text-emerald-600 rounded-md text-[10px] font-bold border border-emerald-200">✓ Fixed in {d.resolutionTime}</span>
                  </div>
                  <ArrowRight size={14} className="text-slate-300 ml-auto opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Panel — Impact + Actions */}
        <div className="space-y-4 animate-fade-in-up stagger-5">
          {/* Score Ring */}
          <div className="glass-card rounded-2xl p-6 hover:shadow-xl transition-all duration-300">
            <h2 className="text-xs font-black text-slate-400 uppercase tracking-[0.3em] mb-4">Room Score</h2>
            <div className="flex items-center gap-5">
              <div className="relative">
                <ProgressRing percent={room.passRate} />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-base font-black text-slate-900">{room.passRate}%</span>
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
          <div className="glass-card rounded-2xl p-6 hover:shadow-xl transition-all duration-300">
            <h2 className="text-xs font-black text-slate-400 uppercase tracking-[0.3em] mb-4">Impact Estimate</h2>
            <div className="space-y-3">
              <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-100 hover:shadow-md transition-all duration-200">
                <div className="flex items-center gap-2 mb-1">
                  <IndianRupee size={14} className="text-emerald-600" />
                  <span className="text-[10px] font-bold uppercase text-emerald-600 tracking-wider">Cost Avoided</span>
                </div>
                <span className="text-2xl font-black text-emerald-700">₹1,800</span>
                <p className="text-xs text-emerald-600 mt-0.5">Replacement + service recovery</p>
              </div>
              <div className="p-4 bg-blue-50 rounded-xl border border-blue-100 hover:shadow-md transition-all duration-200">
                <span className="text-[10px] font-bold uppercase text-blue-600 tracking-wider">Resolution Time</span>
                <span className="text-2xl font-black text-blue-700 block mt-1">25 min</span>
                <p className="text-xs text-blue-500 mt-0.5">From detection to re-scan</p>
              </div>
            </div>
          </div>

          {/* Manager Actions */}
          <div className="glass-card rounded-2xl p-6 hover:shadow-xl transition-all duration-300">
            <h2 className="text-xs font-black text-slate-400 uppercase tracking-[0.3em] mb-4">Manager Actions</h2>
            <div className="space-y-3">
              <button className="w-full flex items-center gap-3 px-4 py-3 bg-amber-50 text-amber-700 rounded-xl text-sm font-bold border border-amber-200 hover:bg-amber-100 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
                <Ban size={16} />
                Approve Override
              </button>
              <p className="text-xs text-slate-400">Dismiss this flag if the AI detection was incorrect. The system learns from overrides.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
