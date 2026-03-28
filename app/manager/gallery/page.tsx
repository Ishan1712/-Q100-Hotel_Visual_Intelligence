"use client";

import React, { useState } from 'react';
import { 
  Bed, Crown, Star, Eye, Clock, CheckCircle, 
  Layers, History, RotateCcw, ChevronRight, Accessibility
} from 'lucide-react';

/* ── Dummy Data ── */
const roomTypes = [
  { 
    name: "Standard Double", count: 78, icon: Bed, 
    lastUpdated: "12 Jan 2026", detectionPoints: 14,
    color: "blue",
    zones: ["Bed Area", "Bathroom", "Desk Area", "Minibar", "Entrance"],
    checkpoints: ["Pillow count (4)", "Pillow arrangement (diamond)", "Bed runner position", "Remote angle", "Lamp alignment (L)", "Lamp alignment (R)", "Towel fold type", "Towel count", "Soap count", "Shampoo position", "Dental kit count", "Minibar bottles", "Curtain symmetry", "Welcome card"]
  },
  { 
    name: "Standard Twin", count: 22, icon: Bed, 
    lastUpdated: "12 Jan 2026", detectionPoints: 14,
    color: "slate",
    zones: ["Bed Area", "Bathroom", "Desk Area", "Minibar", "Entrance"],
    checkpoints: []
  },
  { 
    name: "Deluxe King", count: 20, icon: Crown, 
    lastUpdated: "5 Feb 2026", detectionPoints: 18,
    color: "amber",
    zones: ["Bed Area", "Bathroom", "Living Area", "Desk Area", "Minibar", "Entrance"],
    checkpoints: []
  },
  { 
    name: "Deluxe Suite", count: 12, icon: Crown, 
    lastUpdated: "5 Feb 2026", detectionPoints: 22,
    color: "purple",
    zones: ["Bedroom", "Bathroom", "Living Room", "Dining Area", "Minibar", "Entrance", "Balcony"],
    checkpoints: []
  },
  { 
    name: "Presidential Suite", count: 4, icon: Star, 
    lastUpdated: "20 Feb 2026", detectionPoints: 28,
    color: "amber",
    zones: ["Master Bedroom", "Master Bathroom", "Guest Bathroom", "Living Room", "Dining Room", "Study", "Minibar", "Entrance", "Balcony"],
    checkpoints: []
  },
  { 
    name: "Accessible Room", count: 6, icon: Accessibility, 
    lastUpdated: "12 Jan 2026", detectionPoints: 16,
    color: "emerald",
    zones: ["Bed Area", "Accessible Bathroom", "Desk Area", "Minibar", "Entrance"],
    checkpoints: []
  },
];

const colorMap: Record<string, { bg: string; border: string; text: string; iconBg: string }> = {
  blue: { bg: 'bg-blue-50', border: 'border-blue-100', text: 'text-blue-600', iconBg: 'bg-blue-100' },
  slate: { bg: 'bg-slate-50', border: 'border-slate-200', text: 'text-slate-600', iconBg: 'bg-slate-100' },
  amber: { bg: 'bg-amber-50', border: 'border-amber-100', text: 'text-amber-600', iconBg: 'bg-amber-100' },
  purple: { bg: 'bg-purple-50', border: 'border-purple-100', text: 'text-purple-600', iconBg: 'bg-purple-100' },
  emerald: { bg: 'bg-emerald-50', border: 'border-emerald-100', text: 'text-emerald-600', iconBg: 'bg-emerald-100' },
};

export default function MasterGallery() {
  const [selectedType, setSelectedType] = useState<number | null>(null);
  const [showOverlay, setShowOverlay] = useState(false);

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-20">
      {/* Header */}
      <div className="flex items-center justify-between animate-fade-in-up">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900">Master Gallery</h1>
          <p className="text-slate-400 font-medium mt-1">Room type reference images — the standard for &ldquo;perfect&rdquo;</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-4 py-2 bg-blue-50 text-blue-600 rounded-xl text-sm font-bold border border-blue-100">
            6 Room Types · 142 Total Rooms
          </span>
        </div>
      </div>

      {/* Room Type Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in-up stagger-1">
        {roomTypes.map((type, i) => {
          const colors = colorMap[type.color] || colorMap.blue;
          const Icon = type.icon;

          return (
            <div 
              key={type.name} 
              className={`glass-card rounded-3xl overflow-hidden cursor-pointer transition-all hover:shadow-lg ${selectedType === i ? 'ring-2 ring-blue-500' : ''}`}
              onClick={() => setSelectedType(selectedType === i ? null : i)}
            >
              {/* Hero Image Placeholder */}
              <div className={`aspect-[16/9] ${colors.bg} flex items-center justify-center relative`}>
                <div className="text-center">
                  <div className={`w-16 h-16 rounded-2xl ${colors.iconBg} flex items-center justify-center mx-auto shadow-lg`}>
                    <Icon size={32} className={colors.text} />
                  </div>
                  <p className="text-sm font-bold text-slate-400 mt-3">Master Reference</p>
                </div>
                <div className="absolute top-4 right-4 px-3 py-1.5 bg-white/90 backdrop-blur-sm rounded-xl">
                  <span className="text-xs font-black text-slate-700">{type.detectionPoints} detection points</span>
                </div>
              </div>

              {/* Info */}
              <div className="p-5">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-bold text-slate-900">{type.name}</h3>
                  <ChevronRight size={18} className="text-slate-300" />
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

      {/* Expanded View */}
      {selectedType !== null && (
        <div className="glass-card rounded-3xl p-8 animate-fade-in-up">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-black text-slate-900">{roomTypes[selectedType].name}</h2>
              <p className="text-sm text-slate-400 mt-1">{roomTypes[selectedType].zones.length} zones · {roomTypes[selectedType].detectionPoints} detection points</p>
            </div>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setShowOverlay(!showOverlay)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                  showOverlay ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <Layers size={14} />
                Checklist Overlay
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-600 rounded-xl text-sm font-bold hover:bg-slate-200 transition-all">
                <History size={14} />
                Version History
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-amber-50 text-amber-600 rounded-xl text-sm font-bold border border-amber-200 hover:bg-amber-100 transition-all">
                <RotateCcw size={14} />
                Request Update
              </button>
            </div>
          </div>

          {/* Zone Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {roomTypes[selectedType].zones.map((zone) => (
              <div key={zone} className="aspect-square bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-center flex-col gap-2 hover:bg-slate-100 transition-all cursor-pointer relative">
                <Eye size={24} className="text-slate-300" />
                <span className="text-xs font-bold text-slate-500">{zone}</span>
                {showOverlay && (
                  <div className="absolute top-2 right-2 w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center">
                    <span className="text-[8px] font-black text-white">{Math.floor(Math.random() * 5) + 1}</span>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Checkpoints List (if has data) */}
          {roomTypes[selectedType].checkpoints.length > 0 && showOverlay && (
            <div className="mt-6 pt-6 border-t border-slate-100">
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.3em] mb-4">Detection Points</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {roomTypes[selectedType].checkpoints.map((cp, j) => (
                  <div key={j} className="flex items-center gap-2 px-3 py-2 bg-blue-50 rounded-lg border border-blue-100">
                    <div className="w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center shrink-0">
                      <span className="text-[8px] font-black text-white">{j + 1}</span>
                    </div>
                    <span className="text-xs font-medium text-blue-700">{cp}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Version History Timeline */}
          <div className="mt-6 pt-6 border-t border-slate-100">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.3em] mb-4">Version History</h3>
            <div className="flex items-center gap-4">
              {[
                { date: roomTypes[selectedType].lastUpdated, label: "Current Version", active: true },
                { date: "15 Sep 2025", label: "Post-Renovation", active: false },
                { date: "1 Jun 2025", label: "Initial Setup", active: false },
              ].map((v, j) => (
                <div key={j} className={`flex items-center gap-3 px-4 py-3 rounded-xl ${v.active ? 'bg-blue-50 border border-blue-200' : 'bg-slate-50 border border-slate-200'}`}>
                  <div className={`w-2.5 h-2.5 rounded-full ${v.active ? 'bg-blue-500' : 'bg-slate-300'}`} />
                  <div>
                    <span className={`text-xs font-bold ${v.active ? 'text-blue-700' : 'text-slate-500'}`}>{v.date}</span>
                    <p className="text-[10px] text-slate-400">{v.label}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
