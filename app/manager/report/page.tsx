"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Bed, CheckCircle, Clock, IndianRupee, TrendingUp, TrendingDown, 
  AlertTriangle, Download, Mail, Printer, Star, Sparkles, Users, Shield, Zap, Eye, ChevronDown
} from 'lucide-react';

/* ── Dummy Data ── */
const kpis = [
  { label: "Rooms Inspected", value: "142", icon: Bed, trend: "+8 vs last Wed", trendUp: true, gradient: 'from-blue-50/90 to-blue-100/50', border: 'border-blue-200', iconBg: 'bg-gradient-to-br from-blue-400 to-blue-600 shadow-lg shadow-blue-200' },
  { label: "Pass Rate", value: "76.1%", icon: CheckCircle, trend: "↑ from 68.4%", trendUp: true, gradient: 'from-emerald-50/90 to-emerald-100/50', border: 'border-emerald-200', iconBg: 'bg-gradient-to-br from-emerald-400 to-emerald-600 shadow-lg shadow-emerald-200' },
  { label: "Avg Resolution", value: "14m", icon: Clock, trend: "↓ from 22m", trendUp: true, gradient: 'from-indigo-50/90 to-indigo-100/50', border: 'border-indigo-200', iconBg: 'bg-gradient-to-br from-indigo-400 to-indigo-600 shadow-lg shadow-indigo-200' },
  { label: "Issues Found", value: "34", icon: AlertTriangle, trend: "24 minor · 8 major · 2 critical", trendUp: false, gradient: 'from-rose-50/90 to-rose-100/50', border: 'border-rose-200', iconBg: 'bg-gradient-to-br from-rose-400 to-rose-600 shadow-lg shadow-rose-200' },
  { label: "Hours Saved", value: "6.2h", icon: Users, trend: "vs manual inspection", trendUp: true, gradient: 'from-amber-50/90 to-amber-100/50', border: 'border-amber-200', iconBg: 'bg-gradient-to-br from-amber-400 to-amber-600 shadow-lg shadow-amber-200' },
];

const catchesOfTheDay = [
  { room: "718", title: "Pillowcase stain detected", description: "Invisible at arm's length, caught by AI zoom comparison. Linen replaced in 8 minutes.", impact: "This would have been a 1-star review.", severity: "Critical" as const },
  { room: "305", title: "Minibar completely unstocked", description: "6 items missing after long-stay checkout. Caught before VIP arrival.", impact: "Prevented a guest complaint and service recovery escalation.", severity: "Major" as const },
  { room: "612", title: "Curtain tie-back asymmetry", description: "One curtain tie-back on the wrong side — subtle but exactly the detail a luxury guest notices.", impact: "Presidential Suite presentation preserved for ₹45,000/night rate.", severity: "Minor" as const },
];

/* ── Room Inspection Data by Floor ── */
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
    return {
      room: String(roomNum),
      floor,
      time: `${hour}:${min < 10 ? '0' : ''}${min} AM`,
      status,
      passed,
      total: 12,
      issues,
      housekeeper: housekeepers[(roomNum + floor) % housekeepers.length],
      roomType: roomTypes[i % roomTypes.length],
    };
  });
};

export default function DailyReport() {
  const router = useRouter();
  const [inspectionFloor, setInspectionFloor] = useState(2);
  const floorInspections = generateFloorInspections(inspectionFloor);
  const floorPassed = floorInspections.filter(r => r.status === 'pass').length;
  const floorIssues = floorInspections.reduce((sum, r) => sum + r.issues, 0);

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
          <button onClick={() => { window.location.href = `mailto:?subject=${encodeURIComponent('Daily Operations Report – ' + new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }))}&body=${encodeURIComponent('Hi,\n\nPlease find the Daily Operations Report summary:\n\n• Rooms Inspected: 142\n• Pass Rate: 76.1%\n• Avg Resolution: 14m\n• Issues Found: 34\n• Hours Saved: 6.2h\n• Estimated Savings: ₹18,600\n\nFor the full report, please log in to the Q100.ai dashboard.\n\nBest regards,\nQ100.ai Hotel Visual Intelligence')}`; }} className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-2xl text-sm font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 active:scale-95 hover:-translate-y-0.5">
            <Mail size={15} /> Email Report
          </button>
        </div>
      </div>

      {/* KPI Strip */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 animate-fade-in-up stagger-1">
        {kpis.map((kpi) => (
          <div key={kpi.label} className={`p-5 rounded-[1.5rem] border bg-gradient-to-br ${kpi.gradient} ${kpi.border} transition-all duration-300 hover:shadow-xl hover:-translate-y-1 cursor-pointer group shadow-sm`}>
            <div className="flex items-center justify-between mb-4">
              <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${kpi.iconBg} transition-transform group-hover:scale-110`}>
                <kpi.icon size={16} className="text-white" />
              </div>
              {kpi.trendUp ? <TrendingUp size={14} className="text-emerald-500" /> : <TrendingDown size={14} className="text-amber-500" />}
            </div>
            <h3 className="text-2xl font-black text-slate-900">{kpi.value}</h3>
            <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.15em] mt-1.5">{kpi.label}</p>
            <p className="text-xs text-slate-400 mt-0.5">{kpi.trend}</p>
          </div>
        ))}
      </div>

      {/* Room Inspection Detail Report */}
      <div className="bg-white rounded-[1.5rem] p-4 sm:p-7 border border-slate-200/60 shadow-sm animate-fade-in-up stagger-2 hover:shadow-lg transition-all duration-300">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-5">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-indigo-100 flex items-center justify-center">
              <Shield size={16} className="text-indigo-600" />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">Room Inspection Detail</p>
              <p className="text-xs text-slate-400 mt-0.5">Comprehensive room-by-room breakdown for today</p>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <div className="relative">
              <select
                value={inspectionFloor}
                onChange={(e) => setInspectionFloor(Number(e.target.value))}
                className="appearance-none pl-3 pr-8 py-1.5 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-700 cursor-pointer hover:border-slate-300 transition-all focus:outline-none focus:ring-2 focus:ring-blue-200"
              >
                {[2, 3, 4, 5, 6, 7, 8].map(f => (
                  <option key={f} value={f}>Floor {f}</option>
                ))}
              </select>
              <ChevronDown size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            </div>
            <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-emerald-200 bg-emerald-50/80 text-xs font-bold text-emerald-600"><CheckCircle size={12} /> {floorPassed} passed</span>
            <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-rose-200 bg-rose-50/80 text-xs font-bold text-rose-600"><AlertTriangle size={12} /> {floorIssues} issues</span>
          </div>
        </div>

        {/* ── Scrollable Table — all screen sizes ── */}
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
                  <td className="py-3.5 pl-4 pr-3 sticky left-0 bg-white/95 backdrop-blur-sm z-10">
                    <span className="text-sm font-black text-slate-900">{r.room}</span>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center shadow-sm shadow-blue-200">
                      <span className="text-[9px] font-black text-white">F{r.floor}</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-1.5 text-sm text-slate-500">
                      <Clock size={13} className="text-slate-400" />
                      <span className="font-medium">{r.time}</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider ${
                      r.status === 'pass' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                      r.status === 'fail' ? 'bg-rose-50 text-rose-700 border border-rose-200' :
                      'bg-blue-50 text-blue-700 border border-blue-200'
                    }`}>
                      {r.status === 'pass' ? <CheckCircle size={11} /> : r.status === 'fail' ? <AlertTriangle size={11} /> : <Clock size={11} />}
                      {r.status === 'pass' ? 'Passed' : r.status === 'fail' ? 'Failed' : 'Pending'}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="text-xs font-semibold text-slate-600">{r.roomType}</span>
                  </td>
                  <td className="py-3.5 px-4">
                    {r.issues > 0 ? (
                      <span className="px-2 py-0.5 rounded-full bg-rose-50 border border-rose-200 text-xs font-bold text-rose-600">{r.issues}</span>
                    ) : (
                      <span className="text-xs text-slate-300 font-medium">—</span>
                    )}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="text-sm font-medium text-slate-600">{r.housekeeper}</span>
                  </td>
                  <td className="py-3.5 px-4">
                    <button
                      onClick={() => router.push(`/manager/inspection?floor=${r.floor}&room=${r.room}`)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-50 border border-blue-200 text-xs font-bold text-blue-600 hover:bg-blue-100 hover:shadow-sm transition-all active:scale-95 cursor-pointer"
                    >
                      <Eye size={12} />
                      <span>{r.passed}/{r.total}</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Floor-wise Room Ratings */}
      <div className="bg-white rounded-[1.5rem] p-4 sm:p-7 border border-slate-200/60 relative overflow-hidden animate-fade-in-up stagger-2 shadow-sm hover:shadow-lg transition-all duration-300">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-5">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-blue-100 flex items-center justify-center">
              <Bed size={16} className="text-blue-600" />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">Floor-wise Room Ratings</p>
              <p className="text-xs text-slate-400 mt-0.5">Today&apos;s inspection scores by floor and room</p>
            </div>
          </div>
        </div>
        <div className="overflow-x-auto -mx-4 sm:mx-0 px-4 sm:px-0">
          <table className="w-full" style={{ minWidth: '500px' }}>
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/30">
                <th className="text-left text-[10px] font-black uppercase tracking-widest text-slate-400 py-3 px-4 sticky left-0 bg-slate-50/80 backdrop-blur-sm z-10">Floor</th>
                {Array.from({ length: 6 }, (_, i) => (
                  <th key={i} className="text-center text-[10px] font-black uppercase tracking-widest text-slate-400 py-3 px-3">Room {i + 1}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[2, 3, 4, 5, 6, 7, 8].map((floor) => (
                <tr key={floor} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                  <td className="py-3.5 px-4 sticky left-0 bg-white/80 backdrop-blur-sm z-10">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center shadow-sm shadow-blue-200">
                        <span className="text-[10px] font-black text-white">F{floor}</span>
                      </div>
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
                            {Array.from({ length: 5 }, (_, s) => (
                              <Star key={s} size={12} className={s < rating ? 'text-amber-400 fill-amber-400 drop-shadow-[0_0_2px_rgba(251,191,36,0.5)]' : 'text-slate-200 fill-slate-100'} />
                            ))}
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


      {/* Catches of the Day */}
      <div className="bg-gradient-to-br from-white to-amber-50/20 rounded-[1.5rem] p-7 border border-slate-200/60 shadow-sm animate-fade-in-up stagger-6 hover:shadow-lg transition-all duration-300">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-8 h-8 rounded-xl bg-amber-100 flex items-center justify-center">
            <Sparkles size={16} className="text-amber-600" />
          </div>
          <h2 className="text-xs font-black text-slate-400 uppercase tracking-[0.3em]">Catches of the Day</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {catchesOfTheDay.map((c, i) => {
            const styles = {
              Critical: { card: 'from-rose-50/90 to-rose-100/40 border-rose-200', badge: 'bg-rose-500 text-white shadow-sm shadow-rose-300', icon: 'bg-rose-100' },
              Major: { card: 'from-amber-50/90 to-amber-100/40 border-amber-200', badge: 'bg-amber-500 text-white shadow-sm shadow-amber-300', icon: 'bg-amber-100' },
              Minor: { card: 'from-blue-50/90 to-blue-100/40 border-blue-200', badge: 'bg-blue-500 text-white shadow-sm shadow-blue-300', icon: 'bg-blue-100' },
            }[c.severity];

            return (
              <div key={i} className={`p-6 rounded-[1.25rem] border bg-gradient-to-br ${styles.card} shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer group`}>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-lg font-black text-slate-900">Room {c.room}</span>
                  <span className={`px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-wider ${styles.badge}`}>{c.severity}</span>
                </div>
                <h4 className="text-sm font-bold text-slate-800 mb-2 group-hover:text-blue-600 transition-colors">{c.title}</h4>
                <p className="text-sm text-slate-500 mb-4">{c.description}</p>
                <div className="pt-3 border-t border-black/5">
                  <p className="text-xs text-slate-600 italic">&ldquo;{c.impact}&rdquo;</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
