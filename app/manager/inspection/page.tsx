"use client";

import React, { useState } from 'react';
import { 
  ChevronLeft, ChevronRight, AlertTriangle, CheckCircle, 
  XCircle, Eye, Clock, IndianRupee, RotateCcw, Ban
} from 'lucide-react';

/* ── Dummy Data ── */
const discrepancies = [
  {
    id: 1,
    category: "Amenity",
    item: "Missing Item — Dental Kit",
    severity: "Major" as const,
    flaggedAt: "9:47 AM",
    resolvedAt: "10:12 AM",
    description: "Dental kit absent from position 5 in the vanity arc arrangement."
  },
  {
    id: 2,
    category: "Arrangement",
    item: "Incorrect Position — Body Lotion",
    severity: "Minor" as const,
    flaggedAt: "9:47 AM",
    resolvedAt: "10:12 AM",
    description: "Body lotion placed behind shampoo instead of its designated position in the arc."
  },
];

const flaggedRooms = [
  { room: "512", floor: 5, type: "Standard Double", housekeeper: "Amit K.", time: "9:47 AM", issues: 2 },
  { room: "718", floor: 7, type: "Deluxe King", housekeeper: "Ravi M.", time: "10:15 AM", issues: 1 },
  { room: "305", floor: 3, type: "Standard Double", housekeeper: "Deepak J.", time: "8:32 AM", issues: 3 },
];

export default function AIInspectionDetail() {
  const [showAfter, setShowAfter] = useState(false);
  const [currentRoom, setCurrentRoom] = useState(0);
  const room = flaggedRooms[currentRoom];

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-20">
      {/* Page Header */}
      <div className="flex items-center justify-between animate-fade-in-up">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900">AI Inspection Detail</h1>
          <p className="text-slate-400 font-medium mt-1">Side-by-side comparison of Master vs. Captured scans</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setCurrentRoom(Math.max(0, currentRoom - 1))}
            className="p-3 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 transition-all disabled:opacity-30"
            disabled={currentRoom === 0}
          >
            <ChevronLeft size={20} className="text-slate-600" />
          </button>
          <span className="text-sm font-bold text-slate-500">{currentRoom + 1} of {flaggedRooms.length}</span>
          <button 
            onClick={() => setCurrentRoom(Math.min(flaggedRooms.length - 1, currentRoom + 1))}
            className="p-3 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 transition-all disabled:opacity-30"
            disabled={currentRoom === flaggedRooms.length - 1}
          >
            <ChevronRight size={20} className="text-slate-600" />
          </button>
        </div>
      </div>

      {/* Room Info Bar */}
      <div className="glass-card rounded-2xl p-5 flex items-center justify-between animate-fade-in-up stagger-1">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3">
            <span className="text-2xl font-black text-slate-900">Room {room.room}</span>
            <span className="px-3 py-1 bg-slate-100 text-slate-500 rounded-lg text-xs font-bold uppercase tracking-wider">{room.type}</span>
          </div>
          <div className="h-6 w-px bg-slate-200" />
          <span className="text-sm text-slate-400">Floor {room.floor}</span>
          <div className="h-6 w-px bg-slate-200" />
          <span className="text-sm text-slate-400">Housekeeper: <strong className="text-slate-700">{room.housekeeper}</strong></span>
          <div className="h-6 w-px bg-slate-200" />
          <span className="text-sm text-slate-400 flex items-center gap-1.5"><Clock size={14} /> Scanned at {room.time}</span>
        </div>
        <span className="px-3 py-1.5 bg-rose-50 text-rose-600 rounded-xl text-xs font-black uppercase tracking-wider border border-rose-200">
          {room.issues} Issues Found
        </span>
      </div>

      {/* Split-Screen Comparison */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-fade-in-up stagger-2">
        {/* Master Photo */}
        <div className="glass-card rounded-3xl overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-amber-400 shadow-sm shadow-amber-300" />
              <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider">Master Reference</h3>
            </div>
            <span className="text-xs text-slate-400 font-medium">Standard Double — Bathroom Vanity</span>
          </div>
          <div className="aspect-[4/3] bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center relative">
            <div className="text-center space-y-3">
              <div className="w-20 h-20 rounded-2xl bg-white shadow-lg border border-slate-200 flex items-center justify-center mx-auto">
                <Eye size={32} className="text-slate-300" />
              </div>
              <p className="text-sm font-bold text-slate-400">Master Reference Photo</p>
              <p className="text-xs text-slate-300">2 soaps · 1 shampoo · 1 conditioner · 1 lotion · 2 dental kits</p>
            </div>
            {/* Green dotted circles showing correct positions */}
            <div className="absolute bottom-8 right-8 w-16 h-16 rounded-full border-2 border-dashed border-emerald-400 flex items-center justify-center">
              <span className="text-[10px] font-bold text-emerald-500">Dental Kit</span>
            </div>
            <div className="absolute bottom-8 left-8 w-16 h-16 rounded-full border-2 border-dashed border-emerald-400 flex items-center justify-center">
              <span className="text-[10px] font-bold text-emerald-500">Lotion</span>
            </div>
          </div>
        </div>

        {/* Housekeeper's Photo */}
        <div className="glass-card rounded-3xl overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`w-3 h-3 rounded-full ${showAfter ? 'bg-emerald-500 shadow-sm shadow-emerald-300' : 'bg-rose-500 shadow-sm shadow-rose-300 animate-pulse'}`} />
              <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider">
                {showAfter ? 'Re-Scan (After Fix)' : 'Housekeeper\'s Scan'}
              </h3>
            </div>
            <button 
              onClick={() => setShowAfter(!showAfter)}
              className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg text-xs font-bold border border-blue-100 hover:bg-blue-100 transition-all"
            >
              <RotateCcw size={12} />
              {showAfter ? 'Show Before' : 'Show After'}
            </button>
          </div>
          <div className="aspect-[4/3] bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center relative">
            {showAfter ? (
              <div className="text-center space-y-3">
                <div className="w-20 h-20 rounded-2xl bg-emerald-50 shadow-lg border border-emerald-200 flex items-center justify-center mx-auto">
                  <CheckCircle size={32} className="text-emerald-500" />
                </div>
                <p className="text-sm font-bold text-emerald-600">All Items Corrected</p>
                <p className="text-xs text-slate-400">Re-scanned at 10:12 AM — All checks passed</p>
              </div>
            ) : (
              <div className="text-center space-y-3">
                <div className="w-20 h-20 rounded-2xl bg-white shadow-lg border border-slate-200 flex items-center justify-center mx-auto">
                  <Eye size={32} className="text-slate-300" />
                </div>
                <p className="text-sm font-bold text-slate-400">Housekeeper&apos;s Captured Photo</p>
                <p className="text-xs text-slate-300">1 dental kit missing · lotion misplaced</p>
              </div>
            )}
            {/* Red bounding boxes on discrepancies */}
            {!showAfter && (
              <>
                <div className="absolute bottom-8 right-8 w-16 h-16 rounded-lg border-2 border-rose-500 flex items-center justify-center animate-pulse">
                  <XCircle size={16} className="text-rose-500" />
                </div>
                <div className="absolute bottom-8 left-8 w-16 h-16 rounded-lg border-2 border-rose-500 flex items-center justify-center animate-pulse">
                  <XCircle size={16} className="text-rose-500" />
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Discrepancy List + Impact */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Discrepancy List */}
        <div className="lg:col-span-2 glass-card rounded-3xl p-6 animate-fade-in-up stagger-3">
          <h2 className="text-xs font-black text-slate-400 uppercase tracking-[0.3em] mb-5">Discrepancies Found</h2>
          <div className="space-y-4">
            {discrepancies.map((d) => (
              <div key={d.id} className="p-5 rounded-2xl border border-slate-100 hover:border-slate-200 transition-all">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <AlertTriangle size={18} className={d.severity === 'Major' ? 'text-rose-500' : 'text-amber-500'} />
                    <h4 className="text-sm font-bold text-slate-900">{d.item}</h4>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-1 bg-slate-100 text-slate-500 rounded-lg text-[10px] font-bold uppercase">{d.category}</span>
                    <span className={`px-2 py-1 rounded-lg text-[10px] font-bold uppercase ${
                      d.severity === 'Major' ? 'bg-rose-50 text-rose-600' : 'bg-amber-50 text-amber-600'
                    }`}>{d.severity}</span>
                  </div>
                </div>
                <p className="text-sm text-slate-500">{d.description}</p>
                <div className="flex items-center gap-4 mt-3 text-xs text-slate-400">
                  <span>Flagged: {d.flaggedAt}</span>
                  <span>Resolved: {d.resolvedAt}</span>
                  <span className="text-emerald-600 font-bold">✓ Fixed</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Impact Panel */}
        <div className="space-y-6">
          <div className="glass-card rounded-3xl p-6 animate-fade-in-up stagger-4">
            <h2 className="text-xs font-black text-slate-400 uppercase tracking-[0.3em] mb-5">Impact Estimate</h2>
            <div className="space-y-4">
              <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100">
                <div className="flex items-center gap-2 mb-2">
                  <IndianRupee size={16} className="text-emerald-600" />
                  <span className="text-xs font-bold uppercase text-emerald-600 tracking-wider">Cost Avoided</span>
                </div>
                <span className="text-2xl font-black text-emerald-700">₹1,800</span>
                <p className="text-xs text-emerald-600 mt-1">Replacement delivery + service recovery gesture</p>
              </div>
              <div className="p-4 bg-blue-50 rounded-2xl border border-blue-100">
                <span className="text-xs font-bold uppercase text-blue-600 tracking-wider">Resolution Time</span>
                <span className="text-2xl font-black text-blue-700 block mt-1">25 min</span>
              </div>
            </div>
          </div>

          <div className="glass-card rounded-3xl p-6 animate-fade-in-up stagger-5">
            <h2 className="text-xs font-black text-slate-400 uppercase tracking-[0.3em] mb-4">Manager Actions</h2>
            <div className="space-y-3">
              <button className="w-full flex items-center gap-3 px-4 py-3 bg-amber-50 text-amber-700 rounded-xl text-sm font-bold border border-amber-200 hover:bg-amber-100 transition-all">
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
