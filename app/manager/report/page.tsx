"use client";

import React, { useState, useId } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Bed, CheckCircle, Clock, TrendingUp, TrendingDown, Minus,
  AlertTriangle, Download, Mail, Printer, Star, Users, Shield, Eye, ChevronDown, ChevronUp,
  Trophy, Flame, User, X, BarChart3
} from 'lucide-react';

/* ══════════════════════════════════════════════════════
   Staff Performance Data (migrated from performance page)
   ══════════════════════════════════════════════════════ */
const staffData = [
  { name: "Priya S.", rooms: "14/14", passRate: 78.6, avgTime: "18m", streak: 7, trend: "up" as const, color: "amber" as const, weekData: [64, 71, 71, 79, 79, 85, 79], rating: 4 },
  { name: "Amit K.", rooms: "11/14", passRate: 63.6, avgTime: "24m", streak: 2, trend: "flat" as const, color: "red" as const, weekData: [60, 58, 62, 61, 63, 60, 64], rating: 2 },
  { name: "Meena R.", rooms: "13/14", passRate: 92.3, avgTime: "16m", streak: 13, trend: "up" as const, color: "green" as const, weekData: [78, 82, 85, 88, 90, 91, 92], rating: 5 },
  { name: "Deepak J.", rooms: "9/12", passRate: 66.7, avgTime: "22m", streak: 3, trend: "down" as const, color: "red" as const, weekData: [74, 72, 70, 68, 67, 68, 67], rating: 3 },
  { name: "Sunita P.", rooms: "12/14", passRate: 83.3, avgTime: "19m", streak: 5, trend: "up" as const, color: "amber" as const, weekData: [70, 73, 75, 78, 80, 82, 83], rating: 4 },
  { name: "Ravi M.", rooms: "7/14", passRate: 71.4, avgTime: "26m", streak: 1, trend: "flat" as const, color: "amber" as const, weekData: [70, 68, 72, 71, 70, 72, 71], rating: 3 },
  { name: "Kavita D.", rooms: "14/14", passRate: 85.7, avgTime: "17m", streak: 9, trend: "up" as const, color: "green" as const, weekData: [72, 76, 78, 80, 82, 84, 86], rating: 4 },
  { name: "Farhan A.", rooms: "10/14", passRate: 70.0, avgTime: "21m", streak: 4, trend: "up" as const, color: "amber" as const, weekData: [62, 64, 65, 66, 68, 69, 70], rating: 3 },
];
const topPerformer = staffData.find(s => s.passRate === Math.max(...staffData.map(s => s.passRate)))!;
const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const TrendIcon = ({ trend }: { trend: "up" | "down" | "flat" }) => {
  if (trend === "up") return <TrendingUp size={14} className="text-emerald-500" />;
  if (trend === "down") return <TrendingDown size={14} className="text-rose-500" />;
  return <Minus size={14} className="text-slate-400" />;
};

/* ── Bar Chart Component ── */
const PerformanceChart = ({ mobile = false }: { mobile?: boolean }) => {
  const chartId = useId().replace(/:/g, "");
  const barIndigoId = `${chartId}-bar-indigo`;
  const barEmeraldId = `${chartId}-bar-emerald`;
  const barAmberId = `${chartId}-bar-amber`;
  const barShadowId = `${chartId}-bar-shadow`;
  const n = staffData.length;
  const barW = mobile ? 18 : 20;
  const barGap = mobile ? 4 : 5;
  const groupW = barW * 3 + barGap * 2;
  const groupGap = mobile ? 18 : 50;
  const chartH = mobile ? 272 : 300;
  const padT = mobile ? 20 : 24;
  const padB = mobile ? 46 : 52;
  const padL = mobile ? 36 : 44;
  const padR = mobile ? 12 : 16;
  const leftInset = mobile ? 18 : 24;
  const chartW = padL + leftInset + n * groupW + Math.max(0, n - 1) * groupGap + padR + (mobile ? 22 : 28);
  const innerH = chartH - padT - padB;

  const passRateData = staffData.map(s => s.passRate);
  const efficiencyData = staffData.map(s => {
    const t = parseInt(s.avgTime, 10);
    return Math.round(Math.max(40, Math.min(100, 120 - t * 2.8)));
  });
  const streakData = staffData.map(s => Math.min(100, s.streak * 7.5 + 20));

  const maxVal = 100;
  const gridVals = [0, 20, 40, 60, 80, 100];
  const getBarH = (v: number) => (v / maxVal) * innerH;
  const getBarY = (v: number) => padT + innerH - getBarH(v);
  const getGroupX = (i: number) => padL + leftInset + i * (groupW + groupGap);
  const fs = mobile ? 8 : 9;
  const lfs = mobile ? 9 : 10;
  const sfs = mobile ? 7 : 8;
  const cr = mobile ? 3.5 : 4;

  return (
    <svg viewBox={`0 0 ${chartW} ${chartH}`} className={`w-full ${mobile ? "min-w-[500px]" : "min-w-[650px]"}`}>
      <defs>
        <linearGradient id={barIndigoId} x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#818cf8" /><stop offset="100%" stopColor="#4f46e5" /></linearGradient>
        <linearGradient id={barEmeraldId} x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#6ee7b7" /><stop offset="100%" stopColor="#059669" /></linearGradient>
        <linearGradient id={barAmberId} x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#fcd34d" /><stop offset="100%" stopColor="#d97706" /></linearGradient>
        <filter id={barShadowId}><feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.1" /></filter>
      </defs>
      {gridVals.map(v => { const y = padT + innerH - (v / maxVal) * innerH; return (
        <g key={v}><line x1={padL} y1={y} x2={chartW - padR} y2={y} stroke={v === 0 ? '#e2e8f0' : '#f1f5f9'} strokeWidth={v === 0 ? 1.5 : 1} strokeDasharray={v === 0 ? '0' : '3 6'} /><text x={padL - 8} y={y + 4} textAnchor="end" fontSize={fs} fontWeight="600" fill="#94a3b8">{v}%</text></g>
      ); })}
      <line x1={padL} y1={getBarY(75)} x2={chartW - padR} y2={getBarY(75)} stroke="#6366f1" strokeWidth="1" strokeDasharray="6 3" opacity="0.25" />
      <text x={chartW - padR - 4} y={getBarY(75) + 3} textAnchor="end" fontSize={mobile ? 7 : 8} fontWeight="700" fill="#6366f1" opacity="0.5">Target</text>
      <text x={10} y={chartH / 2} textAnchor="middle" fontSize={mobile ? 7 : 8} fontWeight="700" fill="#94a3b8" transform={`rotate(-90, 10, ${chartH / 2})`}>SCORE (%)</text>
      <line x1={padL} y1={padT} x2={padL} y2={padT + innerH} stroke="#e2e8f0" strokeWidth="1.5" />
      {staffData.map((s, i) => {
        const gx = getGroupX(i); const pr = passRateData[i]; const ef = efficiencyData[i]; const sk = streakData[i];
        return (
          <g key={s.name}>
            <rect x={gx} y={getBarY(pr)} width={barW} height={getBarH(pr)} rx={cr} fill={`url(#${barIndigoId})`} filter={`url(#${barShadowId})`} />
            <text x={gx + barW / 2} y={getBarY(pr) - 5} textAnchor="middle" fontSize={8} fontWeight="800" fill="#4f46e5">{pr.toFixed(0)}%</text>
            <rect x={gx + barW + barGap} y={getBarY(ef)} width={barW} height={getBarH(ef)} rx={cr} fill={`url(#${barEmeraldId})`} filter={`url(#${barShadowId})`} />
            <text x={gx + barW + barGap + barW / 2} y={getBarY(ef) - 5} textAnchor="middle" fontSize={8} fontWeight="800" fill="#059669">{ef}</text>
            <rect x={gx + (barW + barGap) * 2} y={getBarY(sk)} width={barW} height={getBarH(sk)} rx={cr} fill={`url(#${barAmberId})`} filter={`url(#${barShadowId})`} />
            <text x={gx + (barW + barGap) * 2 + barW / 2} y={getBarY(sk) - 5} textAnchor="middle" fontSize={8} fontWeight="800" fill="#b45309">{sk.toFixed(0)}</text>
            <text x={gx + groupW / 2} y={chartH - padB + 16} textAnchor="middle" fontSize={lfs} fontWeight="700" fill="#475569">{s.name.split(' ')[0]}</text>
            <text x={gx + groupW / 2} y={chartH - padB + 27} textAnchor="middle" fontSize={sfs} fontWeight="500" fill="#94a3b8">{s.name.split(' ')[1]}</text>
          </g>
        );
      })}
    </svg>
  );
};

/* ══════════════════════════════════════════
   Daily Report Data
   ══════════════════════════════════════════ */
const catchesOfTheDay = [
  { room: "718", title: "Pillowcase stain detected", description: "Invisible at arm's length, caught by AI zoom comparison. Linen replaced in 8 minutes.", impact: "This would have been a 1-star review.", severity: "Critical" as const },
  { room: "305", title: "Minibar completely unstocked", description: "6 items missing after long-stay checkout. Caught before VIP arrival.", impact: "Prevented a guest complaint and service recovery escalation.", severity: "Major" as const },
  { room: "612", title: "Curtain tie-back asymmetry", description: "One curtain tie-back on the wrong side — subtle but exactly the detail a luxury guest notices.", impact: "Presidential Suite presentation preserved for ₹45,000/night rate.", severity: "Minor" as const },
];

const roomTypes = ['Standard Double', 'Deluxe King', 'Suite', 'Premium Twin', 'Executive', 'Superior'];
const housekeepers = ['Priya S.', 'Amit K.', 'Meena R.', 'Deepak J.', 'Sunita P.', 'Ravi M.', 'Kavita D.', 'Farhan A.'];

const generateFloorInspections = (floor: number) => {
  return Array.from({ length: 6 }, (_, i) => {
    const roomNum = floor * 100 + i + 1;
    const seed = (roomNum * 37 + floor * 13) % 100;
    const status = seed < 15 ? 'pending' as const : seed < 40 ? 'fail' as const : 'pass' as const;
    const passed = status === 'pending' ? 0 : status === 'pass' ? 12 : 12 - ((seed % 4) + 1);
    const issues = status === 'pass' ? (seed < 55 ? 0 : 1) : status === 'fail' ? (seed % 4) + 1 : 0;
    const hour = 7 + Math.floor((i + (floor - 2) * 6) / 4);
    const min = ((i * 13 + floor * 7) % 60);
    return { room: String(roomNum), floor, time: `${hour}:${min < 10 ? '0' : ''}${min} AM`, status, passed, total: 12, issues, housekeeper: housekeepers[(roomNum + floor) % housekeepers.length], roomType: roomTypes[i % roomTypes.length] };
  });
};

/* ══════════════════════════════════════════
   Main Component
   ══════════════════════════════════════════ */
export default function DailyReport() {
  const router = useRouter();
  const [inspectionFloor, setInspectionFloor] = useState(2);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [showGraph, setShowGraph] = useState(false);
  const [expandedRow, setExpandedRow] = useState<number | null>(null);

  const floorInspections = generateFloorInspections(inspectionFloor);
  const floorPassed = floorInspections.filter(r => r.status === 'pass').length;
  const floorIssues = floorInspections.reduce((sum, r) => sum + r.issues, 0);

  const rowColor = (color: string) => {
    if (color === "green") return "bg-gradient-to-r from-emerald-50/50 to-transparent hover:from-emerald-50";
    if (color === "amber") return "bg-white/50 hover:bg-slate-50/80";
    return "bg-gradient-to-r from-rose-50/50 to-transparent hover:from-rose-50";
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 animate-fade-in-up">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-slate-900">Daily Operations Report</h1>
          <p className="text-sm text-slate-400 font-medium mt-0.5">Wednesday, 25 March 2026 · Taj Mahal Palace, Mumbai</p>
        </div>
        <div className="flex items-center gap-2.5 flex-wrap">
          <button onClick={() => window.print()} className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-2xl text-sm font-bold text-slate-600 hover:bg-slate-50 hover:shadow-md hover:-translate-y-0.5 transition-all active:scale-95 shadow-sm">
            <Printer size={15} /> Print
          </button>
          <button onClick={() => window.print()} className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-2xl text-sm font-bold text-slate-600 hover:bg-slate-50 hover:shadow-md hover:-translate-y-0.5 transition-all active:scale-95 shadow-sm">
            <Download size={15} /> PDF
          </button>
          <button onClick={() => { window.location.href = `mailto:?subject=${encodeURIComponent('Daily Operations Report – ' + new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }))}&body=${encodeURIComponent('Hi,\n\nPlease find the Daily Operations Report summary:\n\n• Rooms Inspected: 142\n• Pass Rate: 76.1%\n• Issues Found: 34\n\nFor the full report, please log in to the Q100.ai dashboard.\n\nBest regards,\nQ100.ai Hotel Visual Intelligence')}`; }} className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-2xl text-sm font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 active:scale-95 hover:-translate-y-0.5">
            <Mail size={15} /> Email Report
          </button>
        </div>
      </div>

      {/* ═══ KPI Strip — Reordered ═══ */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 animate-fade-in-up stagger-1">
        {/* Card 1 — Staff Performance Leaderboard (clickable) */}
        <div
          onClick={() => setShowLeaderboard(true)}
          className="p-5 rounded-[1.5rem] border bg-gradient-to-br from-amber-50/90 to-amber-100/50 border-amber-200 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 cursor-pointer group shadow-sm relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-20 h-20 bg-[radial-gradient(circle_at_80%_20%,rgba(245,158,11,0.15)_0,transparent_60%)] pointer-events-none" />
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 rounded-2xl flex items-center justify-center bg-gradient-to-br from-amber-400 to-amber-600 shadow-lg shadow-amber-200 transition-transform group-hover:scale-110">
              <Trophy size={16} className="text-white" />
            </div>
            <TrendingUp size={14} className="text-emerald-500" />
          </div>
          <h3 className="text-lg font-black text-slate-900">{topPerformer.name}</h3>
          <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.15em] mt-1.5">Staff Leaderboard</p>
          <p className="text-xs text-amber-600 font-bold mt-0.5">Tap to view roster →</p>
        </div>

        {/* Card 2 — Visual Analysis (clickable) */}
        <div
          onClick={() => setShowGraph(true)}
          className="p-5 rounded-[1.5rem] border bg-gradient-to-br from-indigo-50/90 to-indigo-100/50 border-indigo-200 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 cursor-pointer group shadow-sm relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-20 h-20 bg-[radial-gradient(circle_at_80%_20%,rgba(99,102,241,0.12)_0,transparent_60%)] pointer-events-none" />
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 rounded-2xl flex items-center justify-center bg-gradient-to-br from-indigo-400 to-indigo-600 shadow-lg shadow-indigo-200 transition-transform group-hover:scale-110">
              <BarChart3 size={16} className="text-white" />
            </div>
            <TrendingUp size={14} className="text-emerald-500" />
          </div>
          <h3 className="text-lg font-black text-slate-900">Visual Analysis</h3>
          <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.15em] mt-1.5">Performance Graph</p>
          <p className="text-xs text-indigo-600 font-bold mt-0.5">Tap to view chart →</p>
        </div>

        {/* Card 3 — Rooms Inspected */}
        <div className="p-5 rounded-[1.5rem] border bg-gradient-to-br from-blue-50/90 to-blue-100/50 border-blue-200 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 cursor-pointer group shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 rounded-2xl flex items-center justify-center bg-gradient-to-br from-blue-400 to-blue-600 shadow-lg shadow-blue-200 transition-transform group-hover:scale-110"><Bed size={16} className="text-white" /></div>
            <TrendingUp size={14} className="text-emerald-500" />
          </div>
          <h3 className="text-2xl font-black text-slate-900">142</h3>
          <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.15em] mt-1.5">Rooms Inspected</p>
          <p className="text-xs text-slate-400 mt-0.5">+8 vs last Wed</p>
        </div>

        {/* Card 4 — Pass Rate */}
        <div className="p-5 rounded-[1.5rem] border bg-gradient-to-br from-emerald-50/90 to-emerald-100/50 border-emerald-200 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 cursor-pointer group shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 rounded-2xl flex items-center justify-center bg-gradient-to-br from-emerald-400 to-emerald-600 shadow-lg shadow-emerald-200 transition-transform group-hover:scale-110"><CheckCircle size={16} className="text-white" /></div>
            <TrendingUp size={14} className="text-emerald-500" />
          </div>
          <h3 className="text-2xl font-black text-slate-900">76.1%</h3>
          <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.15em] mt-1.5">Pass Rate</p>
          <p className="text-xs text-slate-400 mt-0.5">↑ from 68.4%</p>
        </div>

        {/* Card 5 — Issues Found */}
        <div className="p-5 rounded-[1.5rem] border bg-gradient-to-br from-rose-50/90 to-rose-100/50 border-rose-200 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 cursor-pointer group shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 rounded-2xl flex items-center justify-center bg-gradient-to-br from-rose-400 to-rose-600 shadow-lg shadow-rose-200 transition-transform group-hover:scale-110"><AlertTriangle size={16} className="text-white" /></div>
            <TrendingDown size={14} className="text-amber-500" />
          </div>
          <h3 className="text-2xl font-black text-slate-900">34</h3>
          <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.15em] mt-1.5">Issues Found</p>
          <p className="text-xs text-slate-400 mt-0.5">24 minor · 8 major · 2 critical</p>
        </div>
      </div>

      {/* ═══ Room Inspection Detail Report ═══ */}
      <div className="bg-white rounded-[1.5rem] p-4 sm:p-7 border border-slate-200/60 shadow-sm animate-fade-in-up stagger-2 hover:shadow-lg transition-all duration-300">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-5">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-indigo-100 flex items-center justify-center"><Shield size={16} className="text-indigo-600" /></div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">Room Inspection Detail</p>
              <p className="text-xs text-slate-400 mt-0.5">Comprehensive room-by-room breakdown for today</p>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <div className="relative">
              <select value={inspectionFloor} onChange={(e) => setInspectionFloor(Number(e.target.value))} className="appearance-none pl-3 pr-8 py-1.5 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-700 cursor-pointer hover:border-slate-300 transition-all focus:outline-none focus:ring-2 focus:ring-blue-200">
                {[2, 3, 4, 5, 6, 7, 8].map(f => (<option key={f} value={f}>Floor {f}</option>))}
              </select>
              <ChevronDown size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            </div>
            <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-emerald-200 bg-emerald-50/80 text-xs font-bold text-emerald-600"><CheckCircle size={12} /> {floorPassed} passed</span>
            <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-rose-200 bg-rose-50/80 text-xs font-bold text-rose-600"><AlertTriangle size={12} /> {floorIssues} issues</span>
          </div>
        </div>
        <div className="overflow-x-auto relative">
          <table className="w-full" style={{ minWidth: '780px' }}>
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/30">
                <th className="text-left text-[10px] font-black uppercase tracking-widest text-slate-400 py-3 pl-4 pr-3 sticky left-0 bg-slate-50/95 backdrop-blur-sm z-10 min-w-[60px]">Room</th>
                <th className="text-left text-[10px] font-black uppercase tracking-widest text-slate-400 py-3 px-4 min-w-[60px]">Floor</th>
                <th className="text-left text-[10px] font-black uppercase tracking-widest text-slate-400 py-3 px-4 min-w-[100px]">Inspected At</th>
                <th className="text-left text-[10px] font-black uppercase tracking-widest text-slate-400 py-3 px-4 min-w-[90px]">Status</th>
                <th className="text-left text-[10px] font-black uppercase tracking-widest text-slate-400 py-3 px-4 min-w-[110px]">Room Type</th>
                <th className="text-left text-[10px] font-black uppercase tracking-widest text-slate-400 py-3 px-4 min-w-[60px]">Issues</th>
                <th className="text-left text-[10px] font-black uppercase tracking-widest text-slate-400 py-3 px-4 min-w-[100px]">Housekeeper</th>
                <th className="text-left text-[10px] font-black uppercase tracking-widest text-slate-400 py-3 px-4 min-w-[120px]">View AI Inspection</th>
              </tr>
            </thead>
            <tbody>
              {floorInspections.map((r, i) => (
                <tr key={i} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                  <td className="py-3.5 pl-4 pr-3 sticky left-0 bg-white/95 backdrop-blur-sm z-10"><span className="text-sm font-black text-slate-900">{r.room}</span></td>
                  <td className="py-3.5 px-4"><div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center shadow-sm shadow-blue-200"><span className="text-[9px] font-black text-white">F{r.floor}</span></div></td>
                  <td className="py-3.5 px-4"><div className="flex items-center gap-1.5 text-sm text-slate-500"><Clock size={13} className="text-slate-400" /><span className="font-medium">{r.time}</span></div></td>
                  <td className="py-3.5 px-4">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider ${r.status === 'pass' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : r.status === 'fail' ? 'bg-rose-50 text-rose-700 border border-rose-200' : 'bg-blue-50 text-blue-700 border border-blue-200'}`}>
                      {r.status === 'pass' ? <CheckCircle size={11} /> : r.status === 'fail' ? <AlertTriangle size={11} /> : <Clock size={11} />}
                      {r.status === 'pass' ? 'Passed' : r.status === 'fail' ? 'Failed' : 'Pending'}
                    </span>
                  </td>
                  <td className="py-3.5 px-4"><span className="text-xs font-semibold text-slate-600">{r.roomType}</span></td>
                  <td className="py-3.5 px-4">{r.issues > 0 ? <span className="px-2 py-0.5 rounded-full bg-rose-50 border border-rose-200 text-xs font-bold text-rose-600">{r.issues}</span> : <span className="text-xs text-slate-300 font-medium">—</span>}</td>
                  <td className="py-3.5 px-4"><span className="text-sm font-medium text-slate-600">{r.housekeeper}</span></td>
                  <td className="py-3.5 px-4">
                    <button onClick={() => router.push(`/manager/inspection?floor=${r.floor}&room=${r.room}`)} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-50 border border-blue-200 text-xs font-bold text-blue-600 hover:bg-blue-100 hover:shadow-sm transition-all active:scale-95 cursor-pointer">
                      <Eye size={12} /><span>{r.passed}/{r.total}</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ═══ Floor-wise Room Ratings ═══ */}
      <div className="bg-white rounded-[1.5rem] p-4 sm:p-7 border border-slate-200/60 shadow-sm animate-fade-in-up stagger-3 hover:shadow-lg transition-all duration-300">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-8 h-8 rounded-xl bg-amber-100 flex items-center justify-center"><Star size={16} className="text-amber-600" /></div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">Floor-wise Room Ratings</p>
            <p className="text-xs text-slate-400 mt-0.5">Today&apos;s inspection scores by floor and room</p>
          </div>
        </div>
        <div className="overflow-x-auto -mx-4 sm:mx-0 px-4 sm:px-0">
          <table className="w-full" style={{ minWidth: '500px' }}>
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/30">
                <th className="text-left text-[10px] font-black uppercase tracking-widest text-slate-400 py-3 px-4 sticky left-0 bg-slate-50/80 backdrop-blur-sm z-10">Floor</th>
                {Array.from({ length: 6 }, (_, i) => (<th key={i} className="text-center text-[10px] font-black uppercase tracking-widest text-slate-400 py-3 px-3">Room {i + 1}</th>))}
              </tr>
            </thead>
            <tbody>
              {[2, 3, 4, 5, 6, 7, 8].map((floor) => (
                <tr key={floor} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                  <td className="py-3.5 px-4 sticky left-0 bg-white/80 backdrop-blur-sm z-10">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center shadow-sm shadow-blue-200"><span className="text-[10px] font-black text-white">F{floor}</span></div>
                      <span className="text-xs font-bold text-slate-600">Floor {floor}</span>
                    </div>
                  </td>
                  {Array.from({ length: 6 }, (_, roomIdx) => {
                    const roomNum = floor * 100 + roomIdx + 1;
                    const rating = ((roomNum * 37 + floor * 13) % 5) + 1;
                    return (
                      <td key={roomIdx} className="py-3.5 px-3">
                        <div className="flex flex-col items-center gap-1">
                          <span className="text-[10px] font-bold text-slate-500">{roomNum}</span>
                          <div className="flex items-center gap-px">
                            {Array.from({ length: 5 }, (_, s) => (<Star key={s} size={12} className={s < rating ? 'text-amber-400 fill-amber-400 drop-shadow-[0_0_2px_rgba(251,191,36,0.5)]' : 'text-slate-200 fill-slate-100'} />))}
                          </div>
                        </div>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ═══ Catches of the Day ═══ */}
      <div className="bg-white rounded-[1.5rem] p-7 border border-slate-200/60 shadow-sm animate-fade-in-up stagger-4 hover:shadow-lg transition-all duration-300">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-8 h-8 rounded-xl bg-violet-100 flex items-center justify-center"><Eye size={16} className="text-violet-600" /></div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">Catches of the Day</p>
            <p className="text-xs text-slate-400 mt-0.5">Issues caught by AI that human inspection would likely miss</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {catchesOfTheDay.map((c) => (
            <div key={c.room} className={`p-5 rounded-[1.25rem] border transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 cursor-pointer group ${c.severity === 'Critical' ? 'border-rose-200 bg-gradient-to-br from-rose-50/50 to-white' : c.severity === 'Major' ? 'border-amber-200 bg-gradient-to-br from-amber-50/50 to-white' : 'border-blue-200 bg-gradient-to-br from-blue-50/50 to-white'}`}>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-black text-slate-400">Room {c.room}</span>
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${c.severity === 'Critical' ? 'bg-rose-100 text-rose-700 border border-rose-200' : c.severity === 'Major' ? 'bg-amber-100 text-amber-700 border border-amber-200' : 'bg-blue-100 text-blue-700 border border-blue-200'}`}>{c.severity}</span>
              </div>
              <h4 className="text-sm font-bold text-slate-900 mb-2 group-hover:text-blue-700 transition-colors">{c.title}</h4>
              <p className="text-xs text-slate-500 mb-3 leading-relaxed">{c.description}</p>
              <div className="pt-3 border-t border-slate-100"><p className="text-xs text-slate-600 font-medium italic">💡 {c.impact}</p></div>
            </div>
          ))}
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════
          OVERLAY: Staff Leaderboard (Today's Roster)
         ═══════════════════════════════════════════════════ */}
      {showLeaderboard && (
        <div className="fixed inset-0 z-[200] flex items-start justify-center bg-slate-900/60 backdrop-blur-sm animate-fade-in overflow-y-auto p-4 sm:p-8" onClick={() => setShowLeaderboard(false)}>
          <div className="w-full max-w-5xl bg-white rounded-[1.5rem] shadow-2xl border border-slate-200/60 my-4" onClick={e => e.stopPropagation()}>
            {/* Header */}
            <div className="flex items-center justify-between px-5 sm:px-7 py-5 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-lg shadow-amber-200"><Trophy size={16} className="text-white" /></div>
                <div>
                  <h2 className="text-sm font-black text-slate-900 uppercase tracking-wide">Staff Performance Leaderboard</h2>
                  <p className="text-xs text-slate-400 mt-0.5">8 housekeepers on shift today</p>
                </div>
              </div>
              <button onClick={() => setShowLeaderboard(false)} className="w-9 h-9 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-all"><X size={18} className="text-slate-500" /></button>
            </div>

            {/* Top Performer */}
            <div className="px-5 sm:px-7 py-5 bg-gradient-to-r from-amber-50/60 via-white to-orange-50/30 border-b border-slate-100">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-xl shadow-amber-200/60"><Trophy size={24} className="text-white" /></div>
                <div>
                  <div className="flex items-center gap-2 mb-0.5"><Star size={12} className="text-amber-500 fill-amber-500" /><span className="text-[9px] font-black uppercase tracking-[0.3em] text-amber-600">Top Performer Today</span></div>
                  <h3 className="text-xl font-black text-slate-900">{topPerformer.name}</h3>
                  <div className="flex items-center gap-3 mt-2 flex-wrap">
                    <span className="flex items-center gap-1.5 text-xs text-slate-500 px-2.5 py-1 bg-white/60 rounded-lg border border-emerald-100"><strong className="text-emerald-600">{topPerformer.passRate}%</strong> pass</span>
                    <span className="flex items-center gap-1.5 text-xs text-slate-500 px-2.5 py-1 bg-white/60 rounded-lg border border-blue-100"><Flame size={12} className="text-orange-400" /><strong className="text-blue-600">{topPerformer.streak}</strong> streak</span>
                    <span className="flex items-center gap-1.5 text-xs text-slate-500 px-2.5 py-1 bg-white/60 rounded-lg border border-slate-100"><Clock size={12} className="text-slate-400" /> Avg <strong className="text-slate-900">{topPerformer.avgTime}</strong></span>
                  </div>
                </div>
              </div>
            </div>

            {/* Roster Table */}
            <div className="overflow-x-auto relative">
              <table className="w-full" style={{ minWidth: '780px' }}>
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50/30">
                    <th className="text-left text-[10px] font-black uppercase tracking-widest text-slate-400 py-4 pl-5 sm:pl-7 pr-4 sticky left-0 bg-slate-50/95 backdrop-blur-sm z-10 min-w-[140px]">Name</th>
                    <th className="text-left text-[10px] font-black uppercase tracking-widest text-slate-400 py-4 px-5 min-w-[70px]">Rooms</th>
                    <th className="text-left text-[10px] font-black uppercase tracking-widest text-slate-400 py-4 px-5 min-w-[100px]">Pass Rate</th>
                    <th className="text-left text-[10px] font-black uppercase tracking-widest text-slate-400 py-4 px-5 min-w-[90px]">Avg Time</th>
                    <th className="text-left text-[10px] font-black uppercase tracking-widest text-slate-400 py-4 px-5 min-w-[70px]">Streak</th>
                    <th className="text-left text-[10px] font-black uppercase tracking-widest text-slate-400 py-4 px-5 min-w-[100px]">Review</th>
                    <th className="text-left text-[10px] font-black uppercase tracking-widest text-slate-400 py-4 px-4 min-w-[40px]"></th>
                  </tr>
                </thead>
                <tbody>
                  {staffData.map((staff, i) => (
                    <React.Fragment key={staff.name}>
                      <tr className={`border-b border-slate-50 cursor-pointer transition-all duration-200 ${rowColor(staff.color)}`} onClick={() => setExpandedRow(expandedRow === i ? null : i)}>
                        <td className="py-4 pl-5 sm:pl-7 pr-4 sticky left-0 bg-white/95 backdrop-blur-sm z-10">
                          <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shadow-sm ${staff.color === 'green' ? 'bg-gradient-to-br from-emerald-100 to-emerald-200/50' : staff.color === 'red' ? 'bg-gradient-to-br from-rose-100 to-rose-200/50' : 'bg-gradient-to-br from-slate-100 to-slate-200/50'}`}>
                              <User size={16} className={staff.color === 'green' ? 'text-emerald-600' : staff.color === 'red' ? 'text-rose-600' : 'text-slate-500'} />
                            </div>
                            <span className="text-sm font-bold text-slate-900">{staff.name}</span>
                          </div>
                        </td>
                        <td className="py-4 px-5 text-sm font-bold text-slate-700">{staff.rooms}</td>
                        <td className="py-4 px-5"><div className="flex items-center gap-2"><span className={`text-sm font-black px-2 py-0.5 rounded-lg ${staff.passRate >= 85 ? 'text-emerald-700 bg-emerald-50' : staff.passRate >= 70 ? 'text-amber-700 bg-amber-50' : 'text-rose-700 bg-rose-50'}`}>{staff.passRate}%</span><TrendIcon trend={staff.trend} /></div></td>
                        <td className="py-4 px-5"><div className="flex items-center gap-1.5 text-sm text-slate-500"><Clock size={14} className="text-slate-400" /><span className="font-bold">{staff.avgTime}</span></div></td>
                        <td className="py-4 px-5"><div className="flex items-center gap-1.5 px-2.5 py-1 bg-orange-50/60 rounded-lg w-fit"><Flame size={14} className="text-orange-400" /><span className="text-sm font-black text-slate-700">{staff.streak}</span></div></td>
                        <td className="py-4 px-5"><div className="flex items-center gap-0.5">{Array.from({ length: 5 }, (_, s) => (<Star key={s} size={15} className={s < staff.rating ? 'text-amber-400 fill-amber-400 drop-shadow-[0_0_3px_rgba(251,191,36,0.6)]' : 'text-slate-200 fill-slate-100'} />))}</div></td>
                        <td className="py-4 px-4"><div className={`w-7 h-7 rounded-full flex items-center justify-center transition-all ${expandedRow === i ? 'bg-blue-100' : 'bg-slate-100'}`}>{expandedRow === i ? <ChevronUp size={14} className="text-blue-600" /> : <ChevronDown size={14} className="text-slate-400" />}</div></td>
                      </tr>
                      {expandedRow === i && (
                        <tr className="bg-gradient-to-r from-slate-50/80 to-white">
                          <td colSpan={7} className="px-4 sm:px-7 py-4">
                            <div className="text-sm text-slate-500 space-y-3">
                              <p className="font-bold text-slate-700 text-xs">Room-by-room breakdown for {staff.name}</p>
                              <div className="flex items-center gap-2 sm:gap-4 mb-2 flex-wrap">
                                {days.map((day, j) => (
                                  <div key={day} className="flex flex-col items-center gap-1">
                                    <span className={`text-xs font-black ${staff.weekData[j] >= 85 ? 'text-emerald-600' : staff.weekData[j] >= 70 ? 'text-amber-600' : 'text-rose-600'}`}>{staff.weekData[j]}%</span>
                                    <div className="w-7 sm:w-9 bg-slate-100 rounded-lg overflow-hidden shadow-inner" style={{ height: '36px' }}><div className={`w-full rounded-lg transition-all ${staff.weekData[j] >= 85 ? 'bg-emerald-400' : staff.weekData[j] >= 70 ? 'bg-amber-400' : 'bg-rose-400'}`} style={{ height: `${staff.weekData[j]}%`, marginTop: `${100 - staff.weekData[j]}%` }} /></div>
                                    <span className="text-[9px] font-bold text-slate-400">{day}</span>
                                  </div>
                                ))}
                              </div>
                              <div className="grid grid-cols-3 sm:grid-cols-4 gap-1.5 sm:gap-2">
                                {Array.from({ length: parseInt(staff.rooms.split('/')[0]) }, (_, j) => (
                                  <div key={j} className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-[11px] ${j < parseInt(staff.rooms.split('/')[0]) * (staff.passRate / 100) ? 'bg-emerald-50/50 border-emerald-100' : 'bg-rose-50/50 border-rose-100'}`}>
                                    <div className={`w-2 h-2 rounded-full shrink-0 ${j < parseInt(staff.rooms.split('/')[0]) * (staff.passRate / 100) ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                                    <span className="font-medium text-slate-600">Room {400 + j * 3}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════
          OVERLAY: Staff Performance Bar Chart
         ═══════════════════════════════════════════════════ */}
      {showGraph && (
        <div className="fixed inset-0 z-[200] flex items-start justify-center bg-slate-900/60 backdrop-blur-sm animate-fade-in overflow-y-auto p-4 sm:p-8" onClick={() => setShowGraph(false)}>
          <div className="w-full max-w-5xl bg-white rounded-[1.5rem] shadow-2xl border border-slate-200/60 p-5 sm:p-7 my-4" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-400 to-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-200"><BarChart3 size={16} className="text-white" /></div>
                <div>
                  <h2 className="text-sm font-black text-slate-900 uppercase tracking-wide">Staff Performance Comparison</h2>
                  <p className="text-xs text-slate-400 mt-0.5">Key metrics compared across all employees</p>
                </div>
              </div>
              <button onClick={() => setShowGraph(false)} className="w-9 h-9 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-all"><X size={18} className="text-slate-500" /></button>
            </div>

            <div className="flex items-center gap-3 flex-wrap text-[10px] mb-4">
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-indigo-50 border border-indigo-100"><div className="w-2.5 h-2.5 rounded-sm bg-indigo-500" /><span className="font-bold text-indigo-600">Pass Rate</span></div>
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-50 border border-emerald-100"><div className="w-2.5 h-2.5 rounded-sm bg-emerald-500" /><span className="font-bold text-emerald-600">Efficiency</span></div>
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-50 border border-amber-100"><div className="w-2.5 h-2.5 rounded-sm bg-amber-500" /><span className="font-bold text-amber-600">Streak</span></div>
            </div>

            <div className="overflow-x-auto -mx-5 px-5 sm:mx-0 sm:px-0">
              <div className="sm:hidden"><PerformanceChart mobile /></div>
              <div className="hidden sm:block"><PerformanceChart /></div>
            </div>

            <div className="grid grid-cols-3 gap-3 mt-5">
              <div className="text-center p-3 rounded-xl bg-indigo-50/80 border border-indigo-100">
                <p className="text-lg font-black text-indigo-600">{(staffData.reduce((s, d) => s + d.passRate, 0) / staffData.length).toFixed(1)}%</p>
                <p className="text-[9px] font-bold text-indigo-400 uppercase tracking-wider mt-0.5">Avg Pass Rate</p>
              </div>
              <div className="text-center p-3 rounded-xl bg-emerald-50/80 border border-emerald-100">
                <p className="text-lg font-black text-emerald-600">{(staffData.reduce((s, d) => s + parseInt(d.avgTime), 0) / staffData.length).toFixed(0)}m</p>
                <p className="text-[9px] font-bold text-emerald-400 uppercase tracking-wider mt-0.5">Avg Time</p>
              </div>
              <div className="text-center p-3 rounded-xl bg-amber-50/80 border border-amber-100">
                <p className="text-lg font-black text-amber-600">{Math.max(...staffData.map(s => s.streak))}</p>
                <p className="text-[9px] font-bold text-amber-400 uppercase tracking-wider mt-0.5">Best Streak</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
