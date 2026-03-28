"use client";

import React, { useState } from 'react';
import { 
  Trophy, TrendingUp, TrendingDown, Minus, Clock, Flame, 
  User, ChevronDown, ChevronUp, AlertTriangle, Lightbulb
} from 'lucide-react';

/* ── Dummy Data ── */
const staffData = [
  { name: "Priya S.", rooms: "14/14", passRate: 78.6, avgTime: "18m", streak: 7, trend: "up" as const, color: "amber" as const },
  { name: "Amit K.", rooms: "11/14", passRate: 63.6, avgTime: "24m", streak: 2, trend: "flat" as const, color: "red" as const },
  { name: "Meena R.", rooms: "13/14", passRate: 92.3, avgTime: "16m", streak: 13, trend: "up" as const, color: "green" as const },
  { name: "Deepak J.", rooms: "9/12", passRate: 66.7, avgTime: "22m", streak: 3, trend: "down" as const, color: "red" as const },
  { name: "Sunita P.", rooms: "12/14", passRate: 83.3, avgTime: "19m", streak: 5, trend: "up" as const, color: "amber" as const },
  { name: "Ravi M.", rooms: "7/14", passRate: 71.4, avgTime: "26m", streak: 1, trend: "flat" as const, color: "amber" as const },
  { name: "Kavita D.", rooms: "14/14", passRate: 85.7, avgTime: "17m", streak: 9, trend: "up" as const, color: "green" as const },
  { name: "Farhan A.", rooms: "10/14", passRate: 70.0, avgTime: "21m", streak: 4, trend: "up" as const, color: "amber" as const },
];

const topPerformer = staffData.find(s => s.passRate === Math.max(...staffData.map(s => s.passRate)))!;

const trainingOpportunities = [
  { issue: "Minibar arrangement", count: 12, staff: 4, recommendation: "Visual refresher card for minibar layout" },
  { issue: "Towel folding pattern", count: 7, staff: 3, recommendation: "Quick demo video to all housekeepers" },
];

/* ── Sparkline Component ── */
const Sparkline = ({ trend }: { trend: "up" | "down" | "flat" }) => {
  const bars = trend === "up" ? [30, 40, 35, 50, 55, 65, 75] 
    : trend === "down" ? [70, 65, 60, 55, 50, 45, 40] 
    : [50, 48, 52, 50, 51, 49, 50];
  const color = trend === "up" ? "bg-emerald-400" : trend === "down" ? "bg-rose-400" : "bg-slate-300";

  return (
    <div className="flex items-end gap-0.5 h-6">
      {bars.map((h, i) => (
        <div key={i} className={`w-1 rounded-full ${color} transition-all`} style={{ height: `${h}%` }} />
      ))}
    </div>
  );
};

/* ── Trend Icon ── */
const TrendIcon = ({ trend }: { trend: "up" | "down" | "flat" }) => {
  if (trend === "up") return <TrendingUp size={14} className="text-emerald-500" />;
  if (trend === "down") return <TrendingDown size={14} className="text-rose-500" />;
  return <Minus size={14} className="text-slate-400" />;
};

export default function StaffPerformance() {
  const [timePeriod, setTimePeriod] = useState<"today" | "week" | "month">("today");
  const [expandedRow, setExpandedRow] = useState<number | null>(null);

  const rowColor = (color: string) => {
    if (color === "green") return "bg-emerald-50/50 hover:bg-emerald-50";
    if (color === "amber") return "bg-white hover:bg-slate-50";
    return "bg-rose-50/50 hover:bg-rose-50";
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-20">
      {/* Header */}
      <div className="flex items-center justify-between animate-fade-in-up">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900">Staff Performance</h1>
          <p className="text-slate-400 font-medium mt-1">Taj Mahal Palace, Mumbai — 8 housekeepers on shift</p>
        </div>
        <div className="flex items-center gap-1 bg-slate-100 rounded-xl p-1">
          {(["today", "week", "month"] as const).map((period) => (
            <button
              key={period}
              onClick={() => setTimePeriod(period)}
              className={`px-4 py-2 rounded-lg text-sm font-bold transition-all capitalize ${
                timePeriod === period ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              {period === "today" ? "Today" : period === "week" ? "This Week" : "This Month"}
            </button>
          ))}
        </div>
      </div>

      {/* Top Performer Spotlight */}
      <div className="glass-card rounded-3xl p-8 relative overflow-hidden animate-fade-in-up stagger-1">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-amber-100/50 to-transparent pointer-events-none" />
        <div className="flex items-center gap-8 relative z-10">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-500 flex items-center justify-center shadow-xl shadow-amber-200">
            <Trophy size={36} className="text-white" />
          </div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-amber-600 mb-1">⭐ Top Performer Today</p>
            <h2 className="text-2xl font-black text-slate-900">{topPerformer.name}</h2>
            <div className="flex items-center gap-6 mt-2">
              <span className="text-sm text-slate-500"><strong className="text-emerald-600">{topPerformer.passRate}%</strong> pass rate</span>
              <span className="text-sm text-slate-500"><strong className="text-blue-600">{topPerformer.streak}</strong>-room streak</span>
              <span className="text-sm text-slate-500">Fastest avg at <strong className="text-slate-900">{topPerformer.avgTime}</strong></span>
            </div>
          </div>
        </div>
      </div>

      {/* Staff Table */}
      <div className="glass-card rounded-3xl overflow-hidden animate-fade-in-up stagger-2">
        <div className="px-6 py-4 border-b border-slate-100">
          <h2 className="text-xs font-black text-slate-400 uppercase tracking-[0.3em]">Today&apos;s Roster</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-100">
                <th className="text-left text-[10px] font-black uppercase tracking-widest text-slate-400 py-4 px-6">Name</th>
                <th className="text-left text-[10px] font-black uppercase tracking-widest text-slate-400 py-4 px-4">Rooms</th>
                <th className="text-left text-[10px] font-black uppercase tracking-widest text-slate-400 py-4 px-4">Pass Rate</th>
                <th className="text-left text-[10px] font-black uppercase tracking-widest text-slate-400 py-4 px-4">Avg Time</th>
                <th className="text-left text-[10px] font-black uppercase tracking-widest text-slate-400 py-4 px-4">Streak</th>
                <th className="text-left text-[10px] font-black uppercase tracking-widest text-slate-400 py-4 px-4">7-Day Trend</th>
                <th className="text-left text-[10px] font-black uppercase tracking-widest text-slate-400 py-4 px-4"></th>
              </tr>
            </thead>
            <tbody>
              {staffData.map((staff, i) => (
                <React.Fragment key={staff.name}>
                  <tr 
                    className={`border-b border-slate-50 cursor-pointer transition-all ${rowColor(staff.color)}`}
                    onClick={() => setExpandedRow(expandedRow === i ? null : i)}
                  >
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center">
                          <User size={16} className="text-slate-400" />
                        </div>
                        <span className="text-sm font-bold text-slate-900">{staff.name}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-sm font-bold text-slate-700">{staff.rooms}</td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        <span className={`text-sm font-black ${
                          staff.passRate >= 85 ? 'text-emerald-600' : staff.passRate >= 70 ? 'text-amber-600' : 'text-rose-600'
                        }`}>{staff.passRate}%</span>
                        <TrendIcon trend={staff.trend} />
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-1.5 text-sm text-slate-500">
                        <Clock size={14} />
                        <span className="font-bold">{staff.avgTime}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-1.5">
                        <Flame size={14} className="text-orange-400" />
                        <span className="text-sm font-black text-slate-700">{staff.streak}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <Sparkline trend={staff.trend} />
                    </td>
                    <td className="py-4 px-4">
                      {expandedRow === i ? <ChevronUp size={16} className="text-slate-400" /> : <ChevronDown size={16} className="text-slate-400" />}
                    </td>
                  </tr>
                  {expandedRow === i && (
                    <tr className="bg-slate-50/50">
                      <td colSpan={7} className="px-6 py-5">
                        <div className="text-sm text-slate-500 space-y-2">
                          <p className="font-bold text-slate-700">Room-by-room breakdown for {staff.name}</p>
                          <div className="grid grid-cols-4 gap-3 mt-3">
                            {Array.from({ length: parseInt(staff.rooms.split('/')[0]) }, (_, j) => (
                              <div key={j} className="flex items-center gap-2 px-3 py-2 bg-white rounded-lg border border-slate-100">
                                <div className={`w-2 h-2 rounded-full ${j < parseInt(staff.rooms.split('/')[0]) * (staff.passRate / 100) ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                                <span className="text-xs font-medium text-slate-600">Room {400 + j * 3}</span>
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

      {/* Training Opportunities */}
      <div className="glass-card rounded-3xl p-8 animate-fade-in-up stagger-3">
        <div className="flex items-center gap-3 mb-6">
          <Lightbulb size={20} className="text-amber-500" />
          <h2 className="text-xs font-black text-slate-400 uppercase tracking-[0.3em]">Training Opportunities</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {trainingOpportunities.map((t) => (
            <div key={t.issue} className="p-5 rounded-2xl border border-amber-100 bg-amber-50/50">
              <div className="flex items-center gap-3 mb-3">
                <AlertTriangle size={16} className="text-amber-600" />
                <h4 className="text-sm font-bold text-slate-900">{t.issue}</h4>
              </div>
              <p className="text-sm text-slate-500 mb-2">Flagged in <strong className="text-slate-700">{t.count} rooms</strong> today across {t.staff} staff members</p>
              <p className="text-xs text-amber-700 font-medium">💡 Recommendation: {t.recommendation}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
