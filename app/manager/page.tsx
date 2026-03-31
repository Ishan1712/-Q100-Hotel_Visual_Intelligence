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

/* ── Donut Chart ── */
const DonutChart = ({ ready, inProgress, flagged, notStarted, total }: { ready: number; inProgress: number; flagged: number; notStarted: number; total: number }) => {
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const segments = [
    { value: ready, color: '#10b981' },
    { value: inProgress, color: '#f59e0b' },
    { value: flagged, color: '#f43f5e' },
    { value: notStarted, color: '#e2e8f0' },
  ];
  let offset = 0;
  return (
    <div className="relative flex items-center justify-center w-[160px] h-[160px]">
      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 140 140">
        {segments.map((seg, i) => {
          const dashLength = (seg.value / total) * circumference;
          const dashOffset = -offset;
          offset += dashLength;
          return (
            <circle key={i} cx="70" cy="70" r={radius} fill="transparent" stroke={seg.color} strokeWidth="16" strokeDasharray={`${dashLength} ${circumference - dashLength}`} strokeDashoffset={dashOffset} className="transition-all duration-700" />
          );
        })}
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className="text-3xl font-black text-slate-900">{ready}</span>
        <span className="text-[9px] uppercase tracking-[0.2em] text-slate-400 font-bold mt-0.5">of {total} Ready</span>
      </div>
    </div>
  );
};

/* ── Floor Bar ── */
const FloorBar = ({ data }: { data: typeof floorData[0] }) => {
  const pct = (v: number) => `${(v / data.total) * 100}%`;
  const readyPct = Math.round((data.ready / data.total) * 100);
  return (
    <div className="flex items-center gap-4 group p-2.5 -mx-2.5 rounded-xl hover:bg-slate-50 transition-all">
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
    critical: { card: 'bg-gradient-to-br from-rose-50/90 to-rose-100/50 border-rose-200 shadow-rose-100/30', badge: 'bg-rose-500 text-white shadow-sm shadow-rose-300', icon: 'bg-rose-100 shadow-sm shadow-rose-200' },
    high: { card: 'bg-gradient-to-br from-amber-50/90 to-amber-100/50 border-amber-200 shadow-amber-100/30', badge: 'bg-amber-500 text-white shadow-sm shadow-amber-300', icon: 'bg-amber-100 shadow-sm shadow-amber-200' },
    medium: { card: 'bg-gradient-to-br from-yellow-50/90 to-yellow-100/50 border-yellow-200 shadow-yellow-100/30', badge: 'bg-yellow-500 text-white shadow-sm shadow-yellow-300', icon: 'bg-yellow-100 shadow-sm shadow-yellow-200' },
  }[alert.severity];

  return (
    <div className={`p-5 rounded-[1.25rem] border ${styles.card} transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 cursor-pointer group`}>
      <div className="flex items-start justify-between">
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
      <div className="flex items-center justify-between mt-4 pt-3 border-t border-black/5">
        <span className="text-xs text-slate-400 font-medium">{alert.time}</span>
        <span className="text-xs font-bold text-blue-600 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all">View Details <ChevronRight size={12} /></span>
      </div>
    </div>
  );
};

/* ── VIP Card ── */
const VIPCard = ({ guest }: { guest: typeof vipArrivals[0] }) => {
  const statusStyle = {
    'ready': { bg: 'bg-gradient-to-br from-emerald-50/90 to-emerald-100/50', badge: 'bg-emerald-100 text-emerald-700 border-emerald-200', icon: 'bg-emerald-500 shadow-emerald-200' },
    'in-progress': { bg: 'bg-gradient-to-br from-amber-50/90 to-amber-100/50', badge: 'bg-amber-100 text-amber-700 border-amber-200', icon: 'bg-amber-500 shadow-amber-200' },
    'not-started': { bg: 'bg-gradient-to-br from-slate-50/90 to-slate-100/50', badge: 'bg-slate-100 text-slate-500 border-slate-200', icon: 'bg-slate-400 shadow-slate-200' },
  }[guest.status];
  const statusLabel = { 'ready': 'Ready ✓', 'in-progress': 'In Progress', 'not-started': 'Not Started' }[guest.status];
  const GuestIcon = guest.type.includes('Presidential') ? Crown : guest.type.includes('Heritage') ? Star : Bed;

  return (
    <div className={`p-5 rounded-[1.25rem] border border-slate-100 ${statusStyle.bg} transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 cursor-pointer group shadow-sm`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className={`w-11 h-11 rounded-2xl flex items-center justify-center text-white shadow-lg ${statusStyle.icon} transition-transform group-hover:scale-110`}>
            <GuestIcon size={18} />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-900">{guest.name}</h4>
            <p className="text-xs text-slate-400 mt-0.5">Room {guest.room} · {guest.type}</p>
          </div>
        </div>
        <div className="flex flex-col items-end gap-1.5">
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

  return (
    <div className="space-y-6 pb-12">
      <MessageFloorModal open={messageModalOpen} onClose={() => setMessageModalOpen(false)} />

      {/* Page Title + Search */}
      <div className="flex items-center justify-between animate-fade-in-up">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-slate-900">Dashboard</h1>
          <p className="text-sm text-slate-400 font-medium mt-0.5">Wednesday, 25 March 2026</p>
        </div>
        <div className="flex items-center gap-2.5">
          <div className="relative group">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
            <input type="text" placeholder="Search rooms, staff..." 
              className="pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-2xl text-sm font-medium outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-300 transition-all w-56 shadow-sm" />
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
          {/* Readiness Donut */}
          <div className="bg-gradient-to-br from-white to-slate-50/80 rounded-[1.5rem] p-7 border border-slate-200/60 shadow-sm animate-fade-in-up stagger-2 hover:shadow-lg transition-all duration-300">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 rounded-xl bg-blue-100 flex items-center justify-center">
                <Shield size={16} className="text-blue-600" />
              </div>
              <h2 className="text-xs font-black text-slate-400 uppercase tracking-[0.3em]">Property Readiness</h2>
            </div>
            <div className="flex items-center gap-10">
              <DonutChart ready={87} inProgress={32} flagged={8} notStarted={15} total={142} />
              <div className="flex-1 space-y-3">
                {[
                  { label: 'Ready', count: 87, color: 'bg-emerald-500', textColor: 'text-emerald-600' },
                  { label: 'In Progress', count: 32, color: 'bg-amber-400', textColor: 'text-amber-600' },
                  { label: 'Flagged', count: 8, color: 'bg-rose-500', textColor: 'text-rose-600' },
                  { label: 'Not Started', count: 15, color: 'bg-slate-300', textColor: 'text-slate-500' },
                ].map((item) => (
                  <div key={item.label} className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-white transition-all">
                    <div className={`w-3.5 h-3.5 rounded-md ${item.color} shadow-sm`} />
                    <span className="text-sm text-slate-600 font-medium flex-1">{item.label}</span>
                    <span className={`text-sm font-black ${item.textColor}`}>{item.count}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Floor-by-Floor Bars */}
          <div className="bg-gradient-to-br from-white to-slate-50/80 rounded-[1.5rem] p-7 border border-slate-200/60 shadow-sm animate-fade-in-up stagger-3 hover:shadow-lg transition-all duration-300">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-8 h-8 rounded-xl bg-indigo-100 flex items-center justify-center">
                <Zap size={16} className="text-indigo-600" />
              </div>
              <h2 className="text-xs font-black text-slate-400 uppercase tracking-[0.3em]">Floor-by-Floor Readiness</h2>
            </div>
            <div className="space-y-1">
              {floorData.map((floor) => (
                <FloorBar key={floor.floor} data={floor} />
              ))}
            </div>
            <div className="flex items-center gap-5 mt-5 pt-4 border-t border-slate-100">
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
          <div className="bg-gradient-to-br from-white to-rose-50/30 rounded-[1.5rem] p-6 border border-slate-200/60 shadow-sm animate-fade-in-up stagger-2 hover:shadow-lg transition-all duration-300">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-rose-100 flex items-center justify-center">
                  <AlertTriangle size={16} className="text-rose-600" />
                </div>
                <h2 className="text-xs font-black text-slate-400 uppercase tracking-[0.3em]">Critical Alerts</h2>
              </div>
              <span className="w-7 h-7 bg-rose-500 text-white rounded-full flex items-center justify-center text-xs font-black shadow-lg shadow-rose-200">3</span>
            </div>
            <div className="space-y-3">
              {criticalAlerts.map((alert) => (
                <AlertCard key={alert.room} alert={alert} />
              ))}
            </div>
          </div>

          {/* VIP Arrivals */}
          <div className="bg-gradient-to-br from-white to-amber-50/30 rounded-[1.5rem] p-6 border border-slate-200/60 shadow-sm animate-fade-in-up stagger-3 hover:shadow-lg transition-all duration-300">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-amber-100 flex items-center justify-center">
                  <Crown size={16} className="text-amber-600" />
                </div>
                <h2 className="text-xs font-black text-slate-400 uppercase tracking-[0.3em]">VIP Arrivals Today</h2>
              </div>
              <div className="px-2.5 py-1 bg-amber-50 border border-amber-200 rounded-full">
                <span className="text-[9px] font-black text-amber-600 uppercase">3 Guests</span>
              </div>
            </div>
            <div className="space-y-3">
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
