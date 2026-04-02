"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { 
  MapPin, 
  TrendingUp, 
  TrendingDown, 
  Minus 
} from 'lucide-react';

interface PropertyPin {
  id: string;
  name: string;
  city: string;
  x: number; // Percentage
  y: number; // Percentage
  performance: 'green' | 'amber' | 'red';
  stats: {
    rooms: number;
    passRate: string;
    resolution: string;
    gsi: number;
  };
}

const properties: PropertyPin[] = [
  {
    id: '1',
    name: 'JW Marriott Grand',
    city: 'Pune',
    x: 42,
    y: 58,
    performance: 'green',
    stats: { rooms: 148, passRate: '82.1%', resolution: '11m', gsi: 93.2 }
  },
  {
    id: '2',
    name: 'JW Marriott Palace',
    city: 'Mumbai',
    x: 35,
    y: 52,
    performance: 'green',
    stats: { rooms: 142, passRate: '76.1%', resolution: '14m', gsi: 90.8 }
  },
  {
    id: '3',
    name: 'JW Marriott Heritage',
    city: 'Nashik',
    x: 44,
    y: 40,
    performance: 'amber',
    stats: { rooms: 98, passRate: '74.3%', resolution: '16m', gsi: 89.1 }
  },
  {
    id: '4',
    name: 'JW Marriott Gateway',
    city: 'Aurangabad',
    x: 55,
    y: 45,
    performance: 'amber',
    stats: { rooms: 112, passRate: '71.8%', resolution: '18m', gsi: 87.4 }
  },
  {
    id: '5',
    name: 'JW Marriott Central',
    city: 'Nagpur',
    x: 82,
    y: 35,
    performance: 'red',
    stats: { rooms: 112, passRate: '68.2%', resolution: '22m', gsi: 82.6 }
  }
];

export default function MaharashtraMap() {
  const [hoveredProperty, setHoveredProperty] = React.useState<PropertyPin | null>(null);

  return (
    <div className="relative w-full aspect-[4/3] bg-slate-50 rounded-3xl border border-slate-200 overflow-hidden group/map backdrop-blur-sm">
      {/* Abstract Maharashtra SVG Path */}
      <svg 
        viewBox="0 0 100 100" 
        className="w-full h-full opacity-20 transition-opacity group-hover/map:opacity-30 duration-700" 
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="mapGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#6366f1" stopOpacity="0.1" />
          </linearGradient>
        </defs>
        <path 
          d="M20,40 L35,30 L55,25 L75,20 L90,30 L95,50 L85,70 L70,85 L50,80 L30,85 L15,75 L10,55 Z" 
          fill="url(#mapGradient)"
          stroke="#cbd5e1"
          strokeWidth="0.5"
        />
        {/* Grid Lines */}
        <path d="M0,25 L100,25" stroke="#00000005" strokeWidth="0.1" />
        <path d="M0,50 L100,50" stroke="#00000005" strokeWidth="0.1" />
        <path d="M0,75 L100,75" stroke="#00000005" strokeWidth="0.1" />
        <path d="M25,0 L25,100" stroke="#00000005" strokeWidth="0.1" />
        <path d="M50,0 L50,100" stroke="#00000005" strokeWidth="0.1" />
        <path d="M75,0 L75,100" stroke="#00000005" strokeWidth="0.1" />
      </svg>

      {/* Property Pins */}
      {properties.map((prop) => (
        <motion.div
          key={prop.id}
          className="absolute cursor-pointer z-10"
          style={{ left: `${prop.x}%`, top: `${prop.y}%` }}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.1 * parseInt(prop.id), type: 'spring' }}
          onMouseEnter={() => setHoveredProperty(prop)}
          onMouseLeave={() => setHoveredProperty(null)}
        >
          <div className="relative group">
            {/* Ping animation for active pins */}
            <div className={`absolute -inset-2 rounded-full blur-sm animate-ping opacity-20 ${
              prop.performance === 'green' ? 'bg-emerald-400' :
              prop.performance === 'amber' ? 'bg-amber-400' : 'bg-rose-400'
            }`} />
            
            <div className={`relative p-2 rounded-full shadow-lg border-2 transition-transform duration-300 group-hover:scale-125 ${
              prop.performance === 'green' ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400' :
              prop.performance === 'amber' ? 'bg-amber-500/20 border-amber-500 text-amber-400' :
              'bg-rose-500/20 border-rose-500 text-rose-400'
            }`}>
              <MapPin size={18} fill="currentColor" fillOpacity={0.4} />
            </div>

            {/* Label */}
            <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 whitespace-nowrap bg-white/95 backdrop-blur-md px-2 py-0.5 rounded border border-slate-200 text-[10px] font-bold text-slate-900 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity">
              {prop.city}
            </div>
          </div>
        </motion.div>
      ))}

      {/* Tooltip */}
      {hoveredProperty && (
        <motion.div
          className="absolute bottom-6 right-6 w-64 bg-white/95 backdrop-blur-xl border border-slate-200 rounded-2xl shadow-xl p-4 z-20 pointer-events-none"
          initial={{ opacity: 0, y: 10, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
        >
          <div className="flex justify-between items-start mb-3">
            <div>
              <h4 className="text-slate-900 font-bold text-sm">{hoveredProperty.name}</h4>
              <p className="text-slate-500 text-[10px] uppercase tracking-wider font-semibold">{hoveredProperty.city}</p>
            </div>
            <div className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
              hoveredProperty.performance === 'green' ? 'bg-emerald-500/20 text-emerald-400' :
              hoveredProperty.performance === 'amber' ? 'bg-amber-500/20 text-amber-400' :
              'bg-rose-500/20 text-rose-400'
            }`}>
              {hoveredProperty.performance === 'green' ? 'Excellent' :
               hoveredProperty.performance === 'amber' ? 'At Risk' : 'Critical'}
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-slate-50 rounded-lg p-2 border border-slate-100">
              <p className="text-slate-500 text-[9px] uppercase font-bold mb-0.5">Pass Rate</p>
              <p className="text-slate-900 text-sm font-bold">{hoveredProperty.stats.passRate}</p>
            </div>
            <div className="bg-slate-50 rounded-lg p-2 border border-slate-100">
              <p className="text-slate-500 text-[9px] uppercase font-bold mb-0.5">Res. Time</p>
              <p className="text-slate-900 text-sm font-bold">{hoveredProperty.stats.resolution}</p>
            </div>
            <div className="bg-slate-50 rounded-lg p-2 border border-slate-100">
              <p className="text-slate-500 text-[9px] uppercase font-bold mb-0.5">Rooms</p>
              <p className="text-slate-900 text-sm font-bold">{hoveredProperty.stats.rooms}</p>
            </div>
            <div className="bg-slate-50 rounded-lg p-2 border border-slate-100">
              <p className="text-slate-500 text-[9px] uppercase font-bold mb-0.5">GSI Score</p>
              <p className="text-emerald-600 text-sm font-bold">{hoveredProperty.stats.gsi}</p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Map Legend */}
      <div className="absolute bottom-4 left-4 p-3 bg-white/80 backdrop-blur-md rounded-xl border border-slate-200 shadow-sm space-y-2">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-500" />
          <span className="text-[10px] font-bold text-slate-600">Target Met ({'>'}85)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-amber-500" />
          <span className="text-[10px] font-bold text-slate-600">Nearing Target (75-85)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-rose-500" />
          <span className="text-[10px] font-bold text-slate-600">Intervention Needed ({'<'}75)</span>
        </div>
      </div>
    </div>
  );
}
