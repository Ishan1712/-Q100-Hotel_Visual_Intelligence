"use client";

import React, { useState } from 'react';
import { 
  Bed, AlertTriangle, Clock, Users, TrendingUp, ChevronRight, 
  Crown, Star, MessageSquare, Eye, X, Send, Search
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
            <circle
              key={i}
              cx="70" cy="70" r={radius}
              fill="transparent"
              stroke={seg.color}
              strokeWidth="16"
              strokeDasharray={`${dashLength} ${circumference - dashLength}`}
              strokeDashoffset={dashOffset}
              className="transition-all duration-700"
            />
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
  return (
    <div className="flex items-center gap-3 group">
      <span className="text-sm font-bold text-slate-500 w-16 shrink-0">Floor {data.floor}</span>
      <div className="flex-1 h-6 bg-slate-100 rounded-lg overflow-hidden flex">
        <div className="bg-emerald-500 h-full transition-all duration-500" style={{ width: pct(data.ready) }} />
        <div className="bg-amber-400 h-full transition-all duration-500" style={{ width: pct(data.inProgress) }} />
        <div className="bg-rose-500 h-full transition-all duration-500" style={{ width: pct(data.flagged) }} />
        <div className="bg-slate-200 h-full transition-all duration-500" style={{ width: pct(data.notStarted) }} />
      </div>
      <span className="text-sm font-black text-slate-700 w-14 text-right">{data.ready}/{data.total}</span>
    </div>
  );
};

/* ── Alert Card ── */
const AlertCard = ({ alert }: { alert: typeof criticalAlerts[0] }) => {
  const severityStyles = {
    critical: 'border-rose-200 bg-rose-50',
    high: 'border-amber-200 bg-amber-50',
    medium: 'border-yellow-200 bg-yellow-50',
  };
  const badgeStyles = {
    critical: 'bg-rose-500 text-white',
    high: 'bg-amber-500 text-white',
    medium: 'bg-yellow-500 text-white',
  };

  return (
    <div className={`p-4 rounded-xl border ${severityStyles[alert.severity]} transition-all hover:shadow-md`}>
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-white rounded-lg shadow-sm">
            <AlertTriangle size={16} className="text-rose-500" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-900">Room {alert.room}</h4>
            <p className="text-xs text-slate-500 mt-0.5">{alert.issue}</p>
          </div>
        </div>
        <span className={`px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-wider ${badgeStyles[alert.severity]}`}>
          {alert.severity}
        </span>
      </div>
      <div className="flex items-center justify-between mt-3">
        <span className="text-xs text-slate-400 font-medium">{alert.time}</span>
        <button className="text-xs font-bold text-blue-600 hover:text-blue-700">View Details →</button>
      </div>
    </div>
  );
};

/* ── VIP Card ── */
const VIPCard = ({ guest }: { guest: typeof vipArrivals[0] }) => {
  const statusStyle = {
    'ready': 'bg-emerald-50 text-emerald-700 border-emerald-200',
    'in-progress': 'bg-amber-50 text-amber-700 border-amber-200',
    'not-started': 'bg-slate-50 text-slate-500 border-slate-200',
  };
  const statusLabel = {
    'ready': 'Ready ✓',
    'in-progress': 'In Progress',
    'not-started': 'Not Started',
  };
  const GuestIcon = guest.type.includes('Presidential') ? Crown : guest.type.includes('Heritage') ? Star : Bed;

  return (
    <div className="kpi-card p-4 rounded-xl flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-400">
          <GuestIcon size={18} />
        </div>
        <div>
          <h4 className="text-sm font-bold text-slate-900">{guest.name}</h4>
          <p className="text-xs text-slate-400 mt-0.5">Room {guest.room} · {guest.type}</p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-xs font-bold text-slate-500">{guest.time}</span>
        <span className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-wider border ${statusStyle[guest.status]}`}>
          {statusLabel[guest.status]}
        </span>
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

  const handleSend = () => {
    if (!selectedFloor || !message.trim()) return;
    setSent(true);
    setTimeout(() => {
      setSent(false);
      setMessage('');
      setSelectedFloor(null);
      onClose();
    }, 2000);
  };

  const handleClose = () => {
    setMessage('');
    setSelectedFloor(null);
    setSent(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={handleClose} />
      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-lg mx-4 overflow-hidden animate-fade-in-up">
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-blue-50 rounded-xl">
              <MessageSquare size={20} className="text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-black text-slate-900">Message Floor Team</h3>
              <p className="text-xs text-slate-400 mt-0.5">Send a push notification to all housekeepers on a floor</p>
            </div>
          </div>
          <button onClick={handleClose} className="p-2 rounded-xl hover:bg-slate-100 transition-all">
            <X size={20} className="text-slate-400" />
          </button>
        </div>

        {sent ? (
          <div className="px-6 py-12 text-center">
            <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Send size={28} className="text-emerald-500" />
            </div>
            <h4 className="text-lg font-black text-slate-900">Message Sent!</h4>
            <p className="text-sm text-slate-400 mt-1">Notification delivered to Floor {selectedFloor} team</p>
          </div>
        ) : (
          <div className="px-6 py-5 space-y-5">
            <div>
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] block mb-3">Select Floor</label>
              <div className="flex items-center gap-2 flex-wrap">
                {floorData.map((f) => (
                  <button
                    key={f.floor}
                    onClick={() => setSelectedFloor(f.floor)}
                    className={`px-4 py-2.5 rounded-xl text-sm font-bold transition-all ${
                      selectedFloor === f.floor
                        ? 'bg-blue-600 text-white shadow-lg shadow-blue-200'
                        : 'bg-slate-50 text-slate-600 border border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    Floor {f.floor}
                  </button>
                ))}
              </div>
              {selectedFloor && (
                <p className="text-xs text-slate-400 mt-2">
                  {floorData.find(f => f.floor === selectedFloor)?.ready}/{floorData.find(f => f.floor === selectedFloor)?.total} rooms ready · 
                  Notifies all housekeepers on Floor {selectedFloor}
                </p>
              )}
            </div>
            <div>
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] block mb-3">Message</label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="e.g. Please prioritise VIP rooms 612 and 615 — guests arriving at 1 PM"
                className="w-full h-28 bg-slate-50 border border-slate-200 rounded-2xl p-4 outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500/50 transition-all text-sm font-medium resize-none"
              />
            </div>
            <div>
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] block mb-2">Quick Messages</label>
              <div className="flex flex-wrap gap-2">
                {[
                  'Prioritise VIP rooms',
                  'Speed up — check-in wave soon',
                  'Great work, keep it up!',
                  'Re-check flagged rooms',
                ].map((q) => (
                  <button
                    key={q}
                    onClick={() => setMessage(q)}
                    className="px-3 py-1.5 bg-slate-50 text-slate-500 rounded-xl text-xs font-bold border border-slate-200 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 transition-all"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {!sent && (
          <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-end gap-3">
            <button onClick={handleClose} className="px-5 py-2.5 text-sm font-bold text-slate-500 hover:text-slate-700 transition-all">
              Cancel
            </button>
            <button
              onClick={handleSend}
              disabled={!selectedFloor || !message.trim()}
              className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none"
            >
              <Send size={16} />
              Send to Floor {selectedFloor || '...'}
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

  return (
    <div className="space-y-6 pb-12">
      <MessageFloorModal open={messageModalOpen} onClose={() => setMessageModalOpen(false)} />

      {/* Page Title + Search */}
      <div className="flex items-center justify-between animate-fade-in-up">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-slate-900">Dashboard</h1>
          <p className="text-sm text-slate-400 font-medium mt-0.5">Wednesday, 25 March 2026</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search rooms, staff..." 
              className="pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-300 transition-all w-52"
            />
          </div>
          <button 
            onClick={() => setMessageModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2.5 bg-blue-50 text-blue-600 rounded-xl text-sm font-bold border border-blue-100 hover:bg-blue-100 transition-all"
          >
            <MessageSquare size={15} />
            Message Floor Team
          </button>
          <button className="flex items-center gap-1.5 px-4 py-2.5 bg-slate-900 text-white rounded-xl text-sm font-bold hover:bg-slate-800 transition-all">
            <Eye size={15} />
            View All Flagged
          </button>
        </div>
      </div>

      {/* KPI Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 animate-fade-in-up stagger-1">
        {[
          { label: 'Guest-Ready', value: '87', sub: 'of 142 rooms', color: 'emerald', icon: Bed },
          { label: 'In Progress', value: '32', sub: 'rooms being cleaned', color: 'amber', icon: Clock },
          { label: 'Flagged', value: '8', sub: 'need attention', color: 'rose', icon: AlertTriangle },
          { label: "Today's Staff", value: '8', sub: 'housekeepers on shift', color: 'blue', icon: Users },
        ].map((kpi) => (
          <div key={kpi.label} className="kpi-card p-5 rounded-2xl">
            <div className="flex items-center justify-between mb-3">
              <div className={`p-2 rounded-lg bg-${kpi.color === 'blue' ? 'blue' : kpi.color}-50`}>
                <kpi.icon size={18} className={`text-${kpi.color === 'blue' ? 'blue' : kpi.color}-500`} />
              </div>
              <TrendingUp size={15} className="text-emerald-500" />
            </div>
            <h3 className="text-3xl font-black text-slate-900">{kpi.value}</h3>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">{kpi.label}</p>
            <p className="text-xs text-slate-400 mt-0.5">{kpi.sub}</p>
          </div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Left: Donut + Floor Bars */}
        <div className="lg:col-span-2 space-y-5">
          {/* Readiness Donut */}
          <div className="glass-card rounded-2xl p-6 animate-fade-in-up stagger-2">
            <h2 className="text-xs font-black text-slate-400 uppercase tracking-[0.3em] mb-5">Property Readiness</h2>
            <div className="flex items-center gap-10">
              <DonutChart ready={87} inProgress={32} flagged={8} notStarted={15} total={142} />
              <div className="flex-1 space-y-2.5">
                {[
                  { label: 'Ready', count: 87, color: 'bg-emerald-500' },
                  { label: 'In Progress', count: 32, color: 'bg-amber-400' },
                  { label: 'Flagged', count: 8, color: 'bg-rose-500' },
                  { label: 'Not Started', count: 15, color: 'bg-slate-300' },
                ].map((item) => (
                  <div key={item.label} className="flex items-center gap-2.5">
                    <div className={`w-3 h-3 rounded-full ${item.color}`} />
                    <span className="text-sm text-slate-600 font-medium flex-1">{item.label}</span>
                    <span className="text-sm font-bold text-slate-900">{item.count}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Floor-by-Floor Bars */}
          <div className="glass-card rounded-2xl p-6 animate-fade-in-up stagger-3">
            <h2 className="text-xs font-black text-slate-400 uppercase tracking-[0.3em] mb-5">Floor-by-Floor Readiness</h2>
            <div className="space-y-3">
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
                <div key={item.label} className="flex items-center gap-1.5">
                  <div className={`w-2.5 h-2.5 rounded-full ${item.color}`} />
                  <span className="text-xs text-slate-400 font-medium">{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Alerts + VIP */}
        <div className="space-y-5">
          {/* Critical Alerts */}
          <div className="glass-card rounded-2xl p-5 animate-fade-in-up stagger-2">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xs font-black text-slate-400 uppercase tracking-[0.3em]">Critical Alerts</h2>
              <span className="w-6 h-6 bg-rose-500 text-white rounded-full flex items-center justify-center text-xs font-black">3</span>
            </div>
            <div className="space-y-3">
              {criticalAlerts.map((alert) => (
                <AlertCard key={alert.room} alert={alert} />
              ))}
            </div>
          </div>

          {/* VIP Arrivals */}
          <div className="glass-card rounded-2xl p-5 animate-fade-in-up stagger-3">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xs font-black text-slate-400 uppercase tracking-[0.3em]">VIP Arrivals Today</h2>
              <Crown size={18} className="text-amber-400" />
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
