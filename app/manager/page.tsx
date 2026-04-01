"use client";

import React, { useState } from 'react';
import { 
  Bed, AlertTriangle, Clock, Users, TrendingUp, ChevronRight, 
  Crown, Star, MessageSquare, Eye, X, Send, Search, Activity, Shield, Zap
} from 'lucide-react';

/* ── Dummy Data ── */
const floorData = [
  { floor: 2, ready: 18, inProgress: 2, flagged: 1, notStarted: 1, total: 22 },
  { floor: 3, ready: 14, inProgress: 4, flagged: 2, notStarted: 2, total: 22 },
  { floor: 4, ready: 19, inProgress: 2, flagged: 0, notStarted: 1, total: 22 },
  { floor: 5, ready: 12, inProgress: 4, flagged: 2, notStarted: 2, total: 20 },
  { floor: 6, ready: 16, inProgress: 2, flagged: 1, notStarted: 1, total: 20 },
  { floor: 7, ready: 8, inProgress: 4, flagged: 3, notStarted: 3, total: 18 },
  { floor: 8, ready: 0, inProgress: 0, flagged: 0, notStarted: 18, total: 18 },
];

const criticalAlerts = [
  { room: "512", issue: "Bathroom amenities missing", time: "42 min ago", severity: "high" as const },
  { room: "718", issue: "Bed linen stain detected", time: "28 min ago", severity: "medium" as const },
  { room: "305", issue: "Minibar inventory mismatch", time: "55 min ago", severity: "critical" as const },
];

const vipArrivals = [
  { name: "Mr. Rajesh Kapoor", room: "612", type: "Presidential Suite", time: "1:00 PM", status: "in-progress" as const },
  { name: "Ms. Elena Fischer", room: "415", type: "Deluxe", time: "2:00 PM", status: "ready" as const },
  { name: "Mr. & Mrs. Tanaka", room: "820", type: "Heritage Suite", time: "3:30 PM", status: "not-started" as const },
];

const readinessTotal = 142;
const readinessBreakdown = [
  {
    label: 'Ready',
    count: 87,
    color: '#10b981',
    dotClass: 'bg-emerald-500',
    textClass: 'text-emerald-600',
    surfaceClass: 'from-emerald-50/95 to-emerald-100/60',
    borderClass: 'border-emerald-100/80',
  },
  {
    label: 'In Progress',
    count: 32,
    color: '#f59e0b',
    dotClass: 'bg-amber-400',
    textClass: 'text-amber-600',
    surfaceClass: 'from-amber-50/95 to-amber-100/60',
    borderClass: 'border-amber-100/80',
  },
  {
    label: 'Flagged',
    count: 8,
    color: '#f43f5e',
    dotClass: 'bg-rose-500',
    textClass: 'text-rose-600',
    surfaceClass: 'from-rose-50/95 to-rose-100/60',
    borderClass: 'border-rose-100/80',
  },
  {
    label: 'Not Started',
    count: 15,
    color: '#cbd5e1',
    dotClass: 'bg-slate-300',
    textClass: 'text-slate-500',
    surfaceClass: 'from-slate-50/95 to-slate-100/70',
    borderClass: 'border-slate-200/80',
  },
] as const;

const dashboardPanelBaseClass =
  'group relative overflow-hidden rounded-[2rem] border border-white/80 backdrop-blur-sm shadow-[0_24px_60px_-30px_rgba(15,23,42,0.18)] transition-all duration-500 hover:-translate-y-1 hover:border-white/95 hover:shadow-[0_38px_95px_-38px_rgba(15,23,42,0.26)]';

/* ── Donut Chart ── */
const DonutChart = ({
  ready,
  inProgress,
  flagged,
  notStarted,
  total,
  size = 176,
}: {
  ready: number;
  inProgress: number;
  flagged: number;
  notStarted: number;
  total: number;
  size?: number;
}) => {
  const strokeWidth = size > 160 ? 18 : 16;
  const center = size / 2;
  const radius = center - strokeWidth;
  const circumference = 2 * Math.PI * radius;
  const segments = [
    { value: ready, color: '#10b981' },
    { value: inProgress, color: '#f59e0b' },
    { value: flagged, color: '#f43f5e' },
    { value: notStarted, color: '#e2e8f0' },
  ];
  let offset = 0;
  return (
    <div
      className="relative flex items-center justify-center shrink-0 rounded-full border border-white/90 bg-white/80 p-3 shadow-[0_24px_50px_-30px_rgba(37,99,235,0.35)] backdrop-blur-sm"
      style={{ width: size + 24, height: size + 24 }}
    >
      <svg className="w-full h-full transform -rotate-90" viewBox={`0 0 ${size} ${size}`}>
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="transparent"
          stroke="#e2e8f0"
          strokeWidth={strokeWidth}
          className="opacity-50"
        />
        {segments.map((seg, i) => {
          const dashLength = (seg.value / total) * circumference;
          const dashOffset = -offset;
          offset += dashLength;
          return (
            <circle
              key={i}
              cx={center}
              cy={center}
              r={radius}
              fill="transparent"
              stroke={seg.color}
              strokeWidth={strokeWidth}
              strokeDasharray={`${dashLength} ${circumference - dashLength}`}
              strokeDashoffset={dashOffset}
              className="transition-all duration-700"
            />
          );
        })}
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className="text-4xl font-black tracking-tight text-slate-900 leading-none">{ready}</span>
        <span className="mt-2 text-[10px] uppercase tracking-[0.24em] text-slate-400 font-black">of {total} ready</span>
      </div>
    </div>
  );
};

/* ── Floor Bar ── */
const FloorBar = ({ data }: { data: typeof floorData[0] }) => {
  const pct = (v: number) => `${(v / data.total) * 100}%`;
  const readyPct = Math.round((data.ready / data.total) * 100);
  return (
    <div className="flex items-center gap-4 group p-2.5 -mx-2.5 rounded-2xl hover:bg-white/70 hover:-translate-y-0.5 hover:shadow-[0_18px_36px_-32px_rgba(59,130,246,0.35)] transition-all duration-300">
      <span className="text-sm font-bold text-slate-600 w-16 shrink-0">Floor {data.floor}</span>
      <div className="flex-1 h-7 bg-slate-100 rounded-lg overflow-hidden flex shadow-inner">
        <div className="bg-emerald-500 h-full transition-all duration-500" style={{ width: pct(data.ready) }} />
        <div className="bg-amber-400 h-full transition-all duration-500" style={{ width: pct(data.inProgress) }} />
        <div className="bg-rose-500 h-full transition-all duration-500" style={{ width: pct(data.flagged) }} />
        <div className="bg-slate-200 h-full transition-all duration-500" style={{ width: pct(data.notStarted) }} />
      </div>
      <span className={`text-sm font-black w-14 text-right ${readyPct >= 80 ? 'text-emerald-600' : readyPct >= 50 ? 'text-amber-600' : 'text-rose-600'}`}>{data.ready}/{data.total}</span>
    </div>
  );
};

/* ── Alert Card ── */
const AlertCard = ({ alert }: { alert: typeof criticalAlerts[0] }) => {
  const styles = {
    critical: {
      card: 'border-rose-200/80 bg-gradient-to-br from-white via-rose-50/95 to-rose-100/80 shadow-[0_24px_50px_-32px_rgba(244,63,94,0.4)] hover:shadow-[0_30px_65px_-30px_rgba(244,63,94,0.45)]',
      badge: 'bg-rose-500 text-white shadow-sm shadow-rose-300',
      icon: 'bg-rose-100 shadow-sm shadow-rose-200',
      glow: 'bg-rose-300/35',
      accent: 'bg-amber-200/25',
    },
    high: {
      card: 'border-amber-200/80 bg-gradient-to-br from-white via-amber-50/95 to-amber-100/80 shadow-[0_24px_50px_-32px_rgba(245,158,11,0.38)] hover:shadow-[0_30px_65px_-30px_rgba(245,158,11,0.42)]',
      badge: 'bg-amber-500 text-white shadow-sm shadow-amber-300',
      icon: 'bg-amber-100 shadow-sm shadow-amber-200',
      glow: 'bg-amber-300/35',
      accent: 'bg-yellow-200/25',
    },
    medium: {
      card: 'border-yellow-200/80 bg-gradient-to-br from-white via-yellow-50/95 to-yellow-100/80 shadow-[0_24px_50px_-32px_rgba(234,179,8,0.35)] hover:shadow-[0_30px_65px_-30px_rgba(234,179,8,0.4)]',
      badge: 'bg-yellow-500 text-white shadow-sm shadow-yellow-300',
      icon: 'bg-yellow-100 shadow-sm shadow-yellow-200',
      glow: 'bg-yellow-300/35',
      accent: 'bg-orange-200/20',
    },
  }[alert.severity];

  return (
    <div className={`group relative cursor-pointer overflow-hidden rounded-[1.35rem] border p-5 transition-all duration-500 hover:-translate-y-1 ${styles.card}`}>
      <div className={`pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full blur-2xl transition-transform duration-500 group-hover:scale-125 group-hover:-translate-y-2 ${styles.glow}`} />
      <div className={`pointer-events-none absolute -left-6 bottom-0 h-20 w-20 rounded-full blur-2xl transition-transform duration-500 group-hover:translate-y-[-6px] ${styles.accent}`} />
      <div className="pointer-events-none absolute inset-x-5 top-0 h-px bg-gradient-to-r from-transparent via-white/90 to-transparent" />
      <div className="relative flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className={`p-2.5 rounded-xl ${styles.icon} transition-transform group-hover:scale-110`}>
            <AlertTriangle size={16} className="text-rose-500" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-900">Room {alert.room}</h4>
            <p className="text-xs text-slate-500 mt-0.5">{alert.issue}</p>
          </div>
        </div>
        <span className={`px-2.5 py-1 rounded-full text-[8px] font-black uppercase tracking-wider ${styles.badge}`}>
          {alert.severity}
        </span>
      </div>
      <div className="relative flex items-center justify-between mt-4 pt-3 border-t border-white/60">
        <span className="text-xs text-slate-400 font-medium">{alert.time}</span>
        <span className="text-xs font-bold text-blue-600 flex items-center gap-1 opacity-0 translate-x-1 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300">View Details <ChevronRight size={12} /></span>
      </div>
    </div>
  );
};

/* ── VIP Card ── */
const VIPCard = ({ guest }: { guest: typeof vipArrivals[0] }) => {
  const statusStyle = {
    'ready': {
      bg: 'border-emerald-200/80 bg-gradient-to-br from-white via-emerald-50/95 to-emerald-100/80 shadow-[0_24px_48px_-34px_rgba(16,185,129,0.4)] hover:shadow-[0_30px_62px_-30px_rgba(16,185,129,0.45)]',
      badge: 'bg-emerald-100 text-emerald-700 border-emerald-200',
      icon: 'bg-emerald-500 shadow-emerald-200',
      glow: 'bg-emerald-300/35',
      accent: 'bg-cyan-200/22',
    },
    'in-progress': {
      bg: 'border-amber-200/80 bg-gradient-to-br from-white via-amber-50/95 to-amber-100/80 shadow-[0_24px_48px_-34px_rgba(245,158,11,0.38)] hover:shadow-[0_30px_62px_-30px_rgba(245,158,11,0.42)]',
      badge: 'bg-amber-100 text-amber-700 border-amber-200',
      icon: 'bg-amber-500 shadow-amber-200',
      glow: 'bg-amber-300/35',
      accent: 'bg-yellow-200/22',
    },
    'not-started': {
      bg: 'border-slate-200/80 bg-gradient-to-br from-white via-slate-50/95 to-slate-100/85 shadow-[0_24px_48px_-34px_rgba(148,163,184,0.32)] hover:shadow-[0_30px_62px_-30px_rgba(148,163,184,0.4)]',
      badge: 'bg-slate-100 text-slate-500 border-slate-200',
      icon: 'bg-slate-400 shadow-slate-200',
      glow: 'bg-slate-300/35',
      accent: 'bg-blue-200/18',
    },
  }[guest.status];
  const statusLabel = { 'ready': 'Ready ✓', 'in-progress': 'In Progress', 'not-started': 'Not Started' }[guest.status];
  const GuestIcon = guest.type.includes('Presidential') ? Crown : guest.type.includes('Heritage') ? Star : Bed;

  return (
    <div className={`group relative cursor-pointer overflow-hidden rounded-[1.35rem] border p-5 transition-all duration-500 hover:-translate-y-1 ${statusStyle.bg}`}>
      <div className={`pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full blur-2xl transition-transform duration-500 group-hover:scale-125 group-hover:-translate-y-2 ${statusStyle.glow}`} />
      <div className={`pointer-events-none absolute -left-6 bottom-0 h-20 w-20 rounded-full blur-2xl transition-transform duration-500 group-hover:translate-y-[-6px] ${statusStyle.accent}`} />
      <div className="pointer-events-none absolute inset-x-5 top-0 h-px bg-gradient-to-r from-transparent via-white/90 to-transparent" />
      <div className="relative flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className={`w-11 h-11 rounded-2xl flex items-center justify-center text-white shadow-lg ${statusStyle.icon} transition-transform group-hover:scale-110`}>
            <GuestIcon size={18} />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-900">{guest.name}</h4>
            <p className="text-xs text-slate-400 mt-0.5">Room {guest.room} · {guest.type}</p>
          </div>
        </div>
        <div className="flex flex-col items-end gap-1.5 relative">
          <span className="text-xs font-bold text-slate-500">{guest.time}</span>
          <span className={`px-2.5 py-1 rounded-full text-[8px] font-black uppercase tracking-wider border ${statusStyle.badge}`}>
            {statusLabel}
          </span>
        </div>
      </div>
    </div>
  );
};

/* ── Message Floor Modal ── */
const MessageFloorModal = ({ open, onClose }: { open: boolean; onClose: () => void }) => {
  const [selectedFloor, setSelectedFloor] = useState<number | null>(null);
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);
  if (!open) return null;
  const handleSend = () => { if (!selectedFloor || !message.trim()) return; setSent(true); setTimeout(() => { setSent(false); setMessage(''); setSelectedFloor(null); onClose(); }, 2000); };
  const handleClose = () => { setMessage(''); setSelectedFloor(null); setSent(false); onClose(); };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={handleClose} />
      <div className="relative bg-white rounded-[2rem] shadow-2xl w-full max-w-lg mx-4 overflow-hidden animate-fade-in-up">
        <div className="flex items-center justify-between px-7 py-5 border-b border-slate-100 bg-gradient-to-r from-blue-50/50 to-white">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-blue-100 rounded-2xl shadow-sm shadow-blue-200">
              <MessageSquare size={20} className="text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-black text-slate-900">Message Floor Team</h3>
              <p className="text-xs text-slate-400 mt-0.5">Send a push notification to all housekeepers</p>
            </div>
          </div>
          <button onClick={handleClose} className="p-2 rounded-xl hover:bg-slate-100 transition-all"><X size={20} className="text-slate-400" /></button>
        </div>
        {sent ? (
          <div className="px-6 py-12 text-center">
            <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-emerald-100"><Send size={28} className="text-emerald-500" /></div>
            <h4 className="text-lg font-black text-slate-900">Message Sent!</h4>
            <p className="text-sm text-slate-400 mt-1">Notification delivered to Floor {selectedFloor} team</p>
          </div>
        ) : (
          <div className="px-7 py-6 space-y-5">
            <div>
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] block mb-3">Select Floor</label>
              <div className="flex items-center gap-2 flex-wrap">
                {floorData.map((f) => (
                  <button key={f.floor} onClick={() => setSelectedFloor(f.floor)}
                    className={`px-4 py-2.5 rounded-xl text-sm font-bold transition-all ${selectedFloor === f.floor ? 'bg-blue-600 text-white shadow-lg shadow-blue-200 scale-105' : 'bg-slate-50 text-slate-600 border border-slate-200 hover:bg-slate-100 hover:border-slate-300'}`}>
                    Floor {f.floor}
                  </button>
                ))}
              </div>
              {selectedFloor && (
                <p className="text-xs text-slate-400 mt-2">
                  {floorData.find(f => f.floor === selectedFloor)?.ready}/{floorData.find(f => f.floor === selectedFloor)?.total} rooms ready · Notifies all housekeepers on Floor {selectedFloor}
                </p>
              )}
            </div>
            <div>
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] block mb-3">Message</label>
              <textarea value={message} onChange={(e) => setMessage(e.target.value)}
                placeholder="e.g. Please prioritise VIP rooms 612 and 615 — guests arriving at 1 PM"
                className="w-full h-28 bg-slate-50 border border-slate-200 rounded-2xl p-4 outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-300 transition-all text-sm font-medium resize-none" />
            </div>
            <div>
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] block mb-2">Quick Messages</label>
              <div className="flex flex-wrap gap-2">
                {['Prioritise VIP rooms', 'Speed up — check-in wave soon', 'Great work, keep it up!', 'Re-check flagged rooms'].map((q) => (
                  <button key={q} onClick={() => setMessage(q)}
                    className="px-3.5 py-2 bg-slate-50 text-slate-500 rounded-xl text-xs font-bold border border-slate-200 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 transition-all active:scale-95">
                    {q}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
        {!sent && (
          <div className="px-7 py-4 border-t border-slate-100 flex items-center justify-end gap-3">
            <button onClick={handleClose} className="px-5 py-2.5 text-sm font-bold text-slate-500 hover:text-slate-700 transition-all">Cancel</button>
            <button onClick={handleSend} disabled={!selectedFloor || !message.trim()}
              className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none active:scale-95">
              <Send size={16} /> Send to Floor {selectedFloor || '...'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

/* ── Main Page ── */
export default function ManagerDashboard() {
  const [messageModalOpen, setMessageModalOpen] = useState(false);

  const kpiConfig = [
    { label: 'Guest-Ready', value: '87', sub: 'of 142 rooms', gradient: 'from-emerald-50/90 to-emerald-100/50', border: 'border-emerald-200', iconBg: 'bg-gradient-to-br from-emerald-400 to-emerald-600 shadow-lg shadow-emerald-200', iconColor: 'text-white', trend: '+12%', icon: Bed },
    { label: 'In Progress', value: '32', sub: 'rooms being cleaned', gradient: 'from-amber-50/90 to-amber-100/50', border: 'border-amber-200', iconBg: 'bg-gradient-to-br from-amber-400 to-amber-600 shadow-lg shadow-amber-200', iconColor: 'text-white', trend: '-3%', icon: Activity },
    { label: 'Flagged', value: '8', sub: 'need attention', gradient: 'from-rose-50/90 to-rose-100/50', border: 'border-rose-200', iconBg: 'bg-gradient-to-br from-rose-400 to-rose-600 shadow-lg shadow-rose-200', iconColor: 'text-white', trend: '-2', icon: AlertTriangle },
    { label: "Today's Staff", value: '8', sub: 'housekeepers on shift', gradient: 'from-blue-50/90 to-blue-100/50', border: 'border-blue-200', iconBg: 'bg-gradient-to-br from-blue-400 to-blue-600 shadow-lg shadow-blue-200', iconColor: 'text-white', trend: 'Full', icon: Users },
  ];
  const readyPct = Math.round((readinessBreakdown[0].count / readinessTotal) * 100);

  return (
    <div className="space-y-6 pb-12">
      <MessageFloorModal open={messageModalOpen} onClose={() => setMessageModalOpen(false)} />

      {/* Page Title + Search */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 animate-fade-in-up">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-slate-900">Dashboard</h1>
          <p className="text-sm text-slate-400 font-medium mt-0.5">Wednesday, 25 March 2026</p>
        </div>
        <div className="flex items-center gap-2.5 flex-wrap">
          <div className="relative group">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
            <input type="text" placeholder="Search rooms, staff..." 
              className="pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-2xl text-sm font-medium outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-300 transition-all w-48 md:w-56 shadow-sm" />
          </div>
          <button onClick={() => setMessageModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-br from-blue-50 to-indigo-50 text-blue-600 rounded-2xl text-sm font-bold border border-blue-100 hover:shadow-md hover:-translate-y-0.5 transition-all active:scale-95">
            <MessageSquare size={15} /> Message Floor
          </button>
          <button className="flex items-center gap-2 px-4 py-2.5 bg-slate-900 text-white rounded-2xl text-sm font-bold hover:bg-slate-800 hover:shadow-lg hover:-translate-y-0.5 transition-all active:scale-95 shadow-lg shadow-slate-900/10">
            <Eye size={15} /> View All Flagged
          </button>
        </div>
      </div>

      {/* KPI Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-5 animate-fade-in-up stagger-1">
        {kpiConfig.map((kpi) => (
          <div key={kpi.label} className={`p-5 rounded-[1.5rem] border bg-gradient-to-br ${kpi.gradient} ${kpi.border} transition-all duration-300 hover:shadow-xl hover:-translate-y-1 cursor-pointer group shadow-sm`}>
            <div className="flex items-center justify-between mb-4">
              <div className={`w-11 h-11 rounded-2xl flex items-center justify-center ${kpi.iconBg} transition-transform group-hover:scale-110`}>
                <kpi.icon size={18} className={kpi.iconColor} />
              </div>
              <div className="flex items-center gap-1.5 px-2.5 py-1 bg-white/60 backdrop-blur-sm rounded-full">
                <TrendingUp size={12} className="text-emerald-500" />
                <span className="text-[10px] font-bold text-emerald-600">{kpi.trend}</span>
              </div>
            </div>
            <h3 className="text-3xl font-black text-slate-900">{kpi.value}</h3>
            <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.2em] mt-1.5">{kpi.label}</p>
            <p className="text-xs text-slate-400 mt-0.5">{kpi.sub}</p>
          </div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Left: Donut + Floor Bars */}
        <div className="lg:col-span-2 space-y-5">
          {/* Readiness + Shift Overview Row */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-5">
            {/* Readiness Donut */}
            <div className={`${dashboardPanelBaseClass} md:col-span-3 bg-white p-6 animate-fade-in-up stagger-2 flex flex-col`}>
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.95)_0,transparent_42%),radial-gradient(circle_at_bottom_right,rgba(148,163,184,0.08)_0,transparent_34%)] opacity-100" />
              <div className="pointer-events-none absolute -right-12 -top-4 h-40 w-40 rounded-full bg-slate-100/70 blur-3xl transition-transform duration-500 group-hover:scale-110 group-hover:-translate-x-2" />
              <div className="pointer-events-none absolute -left-10 bottom-0 h-32 w-32 rounded-full bg-slate-100/60 blur-3xl transition-transform duration-500 group-hover:scale-105 group-hover:-translate-y-1" />
              <div className="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-slate-100 to-transparent opacity-100" />
              <div className="relative flex items-start justify-between gap-3 mb-5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-[1.1rem] bg-gradient-to-br from-blue-100 to-cyan-100 flex items-center justify-center shadow-sm shadow-blue-200/70">
                    <Shield size={17} className="text-blue-600" />
                  </div>
                  <div>
                    <h2 className="text-xs font-black text-slate-400 uppercase tracking-[0.3em]">Property Readiness</h2>
                    <p className="mt-1 text-xs text-slate-400 font-medium">Live room turnover snapshot</p>
                  </div>
                </div>
                <div className="shrink-0 rounded-full border border-blue-100/80 bg-white/80 px-3 py-1.5 shadow-sm shadow-blue-100/70 backdrop-blur-sm">
                  <span className="text-[10px] font-black uppercase tracking-[0.22em] text-blue-600">{readyPct}% Ready</span>
                </div>
              </div>
              <div className="relative flex flex-1 flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
                <div className="flex justify-center xl:justify-start">
                  <DonutChart
                    ready={readinessBreakdown[0].count}
                    inProgress={readinessBreakdown[1].count}
                    flagged={readinessBreakdown[2].count}
                    notStarted={readinessBreakdown[3].count}
                    total={readinessTotal}
                    size={176}
                  />
                </div>
                <div className="grid flex-1 grid-cols-2 gap-3 xl:max-w-[360px]">
                  {readinessBreakdown.map((item) => (
                    <div
                      key={item.label}
                      className={`rounded-[1.4rem] border bg-gradient-to-br ${item.surfaceClass} ${item.borderClass} px-4 py-3.5 shadow-[0_20px_40px_-30px_rgba(15,23,42,0.32)] transition-all duration-300 hover:-translate-y-1 hover:border-white/90 hover:shadow-[0_28px_56px_-30px_rgba(15,23,42,0.34)]`}
                    >
                      <div className="flex items-center gap-2.5">
                        <div className={`h-2.5 w-2.5 rounded-full ${item.dotClass} shadow-sm`} />
                        <span className="text-[10px] font-black uppercase tracking-[0.16em] text-slate-400">{item.label}</span>
                      </div>
                      <div className="mt-3 flex items-end gap-2.5">
                        <span className={`text-3xl font-black leading-none ${item.textClass}`}>{item.count}</span>
                        <span className="mb-0.5 text-xs font-bold text-slate-400">
                          {Math.round((item.count / readinessTotal) * 100)}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Shift Overview — fills right side */}
            <div className={`${dashboardPanelBaseClass} md:col-span-2 bg-white p-5 animate-fade-in-up stagger-2`}>
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.96)_0,transparent_38%),radial-gradient(circle_at_bottom_left,rgba(148,163,184,0.08)_0,transparent_42%)] opacity-100" />
              <div className="pointer-events-none absolute -right-10 -top-6 h-36 w-36 rounded-full bg-slate-100/70 blur-3xl transition-transform duration-500 group-hover:scale-110 group-hover:-translate-x-2" />
              <div className="pointer-events-none absolute -left-10 bottom-0 h-28 w-28 rounded-full bg-slate-100/55 blur-3xl transition-transform duration-500 group-hover:scale-110" />
              <div className="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-slate-100 to-transparent opacity-100" />
              <div className="relative flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-xl bg-indigo-100 flex items-center justify-center shadow-sm shadow-indigo-200/70">
                  <Activity size={16} className="text-indigo-600" />
                </div>
                <h2 className="text-xs font-black text-slate-400 uppercase tracking-[0.3em]">Shift Overview</h2>
              </div>
              <div className="relative space-y-3">
                {/* Efficiency Score */}
                <div className="p-4 bg-gradient-to-br from-emerald-50/80 to-emerald-100/40 rounded-[1.5rem] border border-emerald-100/80 shadow-[0_18px_40px_-32px_rgba(16,185,129,0.6)]">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-slate-500">Efficiency Score</span>
                    <span className="text-xs font-black text-emerald-600 bg-emerald-100 px-2 py-0.5 rounded-lg">↑ 5%</span>
                  </div>
                  <span className="text-2xl font-black text-emerald-600">91.3%</span>
                  <div className="w-full h-2 rounded-full bg-emerald-200/50 mt-2">
                    <div className="h-full rounded-full bg-emerald-500 transition-all duration-700" style={{ width: '91.3%' }} />
                  </div>
                </div>
                {/* Avg Room Time */}
                <div className="p-4 bg-gradient-to-br from-blue-50/80 to-blue-100/40 rounded-[1.5rem] border border-blue-100/80 shadow-[0_18px_40px_-32px_rgba(59,130,246,0.55)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_26px_54px_-34px_rgba(59,130,246,0.55)]">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-slate-500">Avg. Room Time</span>
                    <Clock size={14} className="text-blue-400" />
                  </div>
                  <span className="text-2xl font-black text-blue-600">18<span className="text-base font-bold text-blue-400">&thinsp;min</span></span>
                </div>
                {/* Peak Activity */}
                <div className="p-4 bg-gradient-to-br from-amber-50/80 to-amber-100/40 rounded-[1.5rem] border border-amber-100/80 shadow-[0_18px_40px_-32px_rgba(245,158,11,0.5)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_26px_54px_-34px_rgba(245,158,11,0.52)]">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-slate-500">Peak Hour</span>
                    <Zap size={14} className="text-amber-400" />
                  </div>
                  <span className="text-xl font-black text-amber-600">9:00 – 11:00 AM</span>
                </div>
              </div>
            </div>
          </div>

          {/* Floor-by-Floor Bars */}
          <div className={`${dashboardPanelBaseClass} bg-white p-7 animate-fade-in-up stagger-3`}>
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.96)_0,transparent_38%),radial-gradient(circle_at_bottom_right,rgba(148,163,184,0.08)_0,transparent_40%)] opacity-100" />
            <div className="pointer-events-none absolute -right-8 -top-6 h-36 w-36 rounded-full bg-slate-100/70 blur-3xl transition-transform duration-500 group-hover:scale-110" />
            <div className="pointer-events-none absolute -left-10 bottom-0 h-28 w-28 rounded-full bg-slate-100/55 blur-3xl transition-transform duration-500 group-hover:-translate-y-1" />
            <div className="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-slate-100 to-transparent opacity-100" />
            <div className="relative flex items-center gap-3 mb-5">
              <div className="w-8 h-8 rounded-xl bg-indigo-100 flex items-center justify-center shadow-sm shadow-indigo-200/70">
                <Zap size={16} className="text-indigo-600" />
              </div>
              <h2 className="text-xs font-black text-slate-400 uppercase tracking-[0.3em]">Floor-by-Floor Readiness</h2>
            </div>
            <div className="relative space-y-1">
              {floorData.map((floor) => (
                <FloorBar key={floor.floor} data={floor} />
              ))}
            </div>
            <div className="relative flex items-center gap-5 mt-5 pt-4 border-t border-slate-100">
              {[
                { label: 'Ready', color: 'bg-emerald-500' },
                { label: 'In Progress', color: 'bg-amber-400' },
                { label: 'Flagged', color: 'bg-rose-500' },
                { label: 'Not Started', color: 'bg-slate-200' },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-md ${item.color} shadow-sm`} />
                  <span className="text-xs text-slate-400 font-medium">{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Alerts + VIP */}
        <div className="space-y-5">
          {/* Critical Alerts */}
          <div className={`${dashboardPanelBaseClass} bg-white p-6 animate-fade-in-up stagger-2`}>
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.96)_0,transparent_34%),radial-gradient(circle_at_bottom_left,rgba(148,163,184,0.08)_0,transparent_44%)] opacity-100" />
            <div className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-slate-100/70 blur-3xl transition-transform duration-500 group-hover:scale-110" />
            <div className="pointer-events-none absolute -left-8 bottom-0 h-24 w-24 rounded-full bg-slate-100/55 blur-3xl transition-transform duration-500 group-hover:-translate-y-1" />
            <div className="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-slate-100 to-transparent opacity-100" />
            <div className="relative flex items-center justify-between mb-5">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-rose-100 flex items-center justify-center shadow-sm shadow-rose-200/70">
                  <AlertTriangle size={16} className="text-rose-600" />
                </div>
                <h2 className="text-xs font-black text-slate-400 uppercase tracking-[0.3em]">Critical Alerts</h2>
              </div>
              <span className="w-7 h-7 bg-rose-500 text-white rounded-full flex items-center justify-center text-xs font-black shadow-lg shadow-rose-200">3</span>
            </div>
            <div className="relative space-y-3">
              {criticalAlerts.map((alert) => (
                <AlertCard key={alert.room} alert={alert} />
              ))}
            </div>
          </div>

          {/* VIP Arrivals */}
          <div className={`${dashboardPanelBaseClass} bg-white p-6 animate-fade-in-up stagger-3`}>
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.96)_0,transparent_34%),radial-gradient(circle_at_bottom_right,rgba(148,163,184,0.08)_0,transparent_42%)] opacity-100" />
            <div className="pointer-events-none absolute -left-8 -top-6 h-28 w-28 rounded-full bg-slate-100/70 blur-3xl transition-transform duration-500 group-hover:scale-110" />
            <div className="pointer-events-none absolute -right-8 bottom-0 h-24 w-24 rounded-full bg-slate-100/55 blur-3xl transition-transform duration-500 group-hover:-translate-y-1" />
            <div className="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-slate-100 to-transparent opacity-100" />
            <div className="relative flex items-center justify-between mb-5">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-amber-100 flex items-center justify-center shadow-sm shadow-amber-200/70">
                  <Crown size={16} className="text-amber-600" />
                </div>
                <h2 className="text-xs font-black text-slate-400 uppercase tracking-[0.3em]">VIP Arrivals Today</h2>
              </div>
              <div className="px-2.5 py-1 bg-amber-50 border border-amber-200 rounded-full">
                <span className="text-[9px] font-black text-amber-600 uppercase">3 Guests</span>
              </div>
            </div>
            <div className="relative space-y-3">
              {vipArrivals.map((guest) => (
                <VIPCard key={guest.room} guest={guest} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
