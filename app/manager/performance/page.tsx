"use client";

import React, { useState } from 'react';
import { 
  Trophy, TrendingUp, TrendingDown, Minus, Clock, Flame, 
  User, ChevronDown, ChevronUp, AlertTriangle, Lightbulb
} from 'lucide-react';

/* ── Dummy Data ── */
const staffData = [
  { name: "Priya S.", rooms: "14/14", passRate: 78.6, avgTime: "18m", streak: 7, trend: "up" as const, color: "amber" as const, weekData: [64, 71, 71, 79, 79, 85, 79] },
  { name: "Amit K.", rooms: "11/14", passRate: 63.6, avgTime: "24m", streak: 2, trend: "flat" as const, color: "red" as const, weekData: [60, 58, 62, 61, 63, 60, 64] },
  { name: "Meena R.", rooms: "13/14", passRate: 92.3, avgTime: "16m", streak: 13, trend: "up" as const, color: "green" as const, weekData: [78, 82, 85, 88, 90, 91, 92] },
  { name: "Deepak J.", rooms: "9/12", passRate: 66.7, avgTime: "22m", streak: 3, trend: "down" as const, color: "red" as const, weekData: [74, 72, 70, 68, 67, 68, 67] },
  { name: "Sunita P.", rooms: "12/14", passRate: 83.3, avgTime: "19m", streak: 5, trend: "up" as const, color: "amber" as const, weekData: [70, 73, 75, 78, 80, 82, 83] },
  { name: "Ravi M.", rooms: "7/14", passRate: 71.4, avgTime: "26m", streak: 1, trend: "flat" as const, color: "amber" as const, weekData: [70, 68, 72, 71, 70, 72, 71] },
  { name: "Kavita D.", rooms: "14/14", passRate: 85.7, avgTime: "17m", streak: 9, trend: "up" as const, color: "green" as const, weekData: [72, 76, 78, 80, 82, 84, 86] },
  { name: "Farhan A.", rooms: "10/14", passRate: 70.0, avgTime: "21m", streak: 4, trend: "up" as const, color: "amber" as const, weekData: [62, 64, 65, 66, 68, 69, 70] },
];

const topPerformer = staffData.find(s => s.passRate === Math.max(...staffData.map(s => s.passRate)))!;

const trainingOpportunities = [
  { issue: "Minibar arrangement", count: 12, staff: 4, recommendation: "Visual refresher card for minibar layout" },
  { issue: "Towel folding pattern", count: 7, staff: 3, recommendation: "Quick demo video to all housekeepers" },
];

const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

/* ── Large Sparkline Chart ── */
const LargeTrendChart = ({ data, trend }: { data: number[]; trend: "up" | "down" | "flat" }) => {
  const min = Math.min(...data) - 5;
  const max = Math.max(...data) + 5;
  const range = max - min;
  const width = 120;
  const height = 36;
  
  const points = data.map((v, i) => {
    const x = (i / (data.length - 1)) * width;
    const y = height - ((v - min) / range) * height;
    return `${x},${y}`;
  }).join(' ');

  const fillPoints = `0,${height} ${points} ${width},${height}`;
  
  const color = trend === "up" ? { stroke: '#10b981', fill: '#10b98120' } 
    : trend === "down" ? { stroke: '#f43f5e', fill: '#f43f5e15' } 
    : { stroke: '#94a3b8', fill: '#94a3b815' };

  return (
    <svg width={width} height={height} className="overflow-visible">
      <polygon points={fillPoints} fill={color.fill} />
      <polyline points={points} fill="none" stroke={color.stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      {/* End dot */}
      {data.length > 0 && (
        <circle 
          cx={(data.length - 1) / (data.length - 1) * width} 
          cy={height - ((data[data.length - 1] - min) / range) * height} 
          r="3" 
          fill={color.stroke} 
        />
      )}
    </svg>
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
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex items-center justify-between animate-fade-in-up">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-slate-900">Staff Performance</h1>
          <p className="text-sm text-slate-400 font-medium mt-0.5">Taj Mahal Palace, Mumbai — 8 housekeepers on shift</p>
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
      <div className="glass-card rounded-2xl p-6 relative overflow-hidden animate-fade-in-up stagger-1">
        <div className="absolute top-0 right-0 w-56 h-56 bg-gradient-to-bl from-amber-100/50 to-transparent pointer-events-none" />
        <div className="flex items-center gap-6 relative z-10">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-500 flex items-center justify-center shadow-xl shadow-amber-200">
            <Trophy size={28} className="text-white" />
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
      <div className="glass-card rounded-2xl overflow-hidden animate-fade-in-up stagger-2">
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
                      <LargeTrendChart data={staff.weekData} trend={staff.trend} />
                    </td>
                    <td className="py-4 px-4">
                      {expandedRow === i ? <ChevronUp size={16} className="text-slate-400" /> : <ChevronDown size={16} className="text-slate-400" />}
                    </td>
                  </tr>
                  {expandedRow === i && (
                    <tr className="bg-slate-50/50">
                      <td colSpan={7} className="px-6 py-5">
                        <div className="text-sm text-slate-500 space-y-3">
                          <p className="font-bold text-slate-700">Room-by-room breakdown for {staff.name}</p>
                          {/* 7-day trend detail */}
                          <div className="flex items-center gap-4 mb-2">
                            {days.map((day, j) => (
                              <div key={day} className="flex flex-col items-center gap-1">
                                <span className={`text-sm font-black ${
                                  staff.weekData[j] >= 85 ? 'text-emerald-600' : staff.weekData[j] >= 70 ? 'text-amber-600' : 'text-rose-600'
                                }`}>{staff.weekData[j]}%</span>
                                <div className="w-8 bg-slate-100 rounded-full overflow-hidden" style={{ height: '48px' }}>
                                  <div 
                                    className={`w-full rounded-full transition-all ${
                                      staff.weekData[j] >= 85 ? 'bg-emerald-400' : staff.weekData[j] >= 70 ? 'bg-amber-400' : 'bg-rose-400'
                                    }`} 
                                    style={{ height: `${staff.weekData[j]}%`, marginTop: `${100 - staff.weekData[j]}%` }} 
                                  />
                                </div>
                                <span className="text-[10px] font-bold text-slate-400">{day}</span>
                              </div>
                            ))}
                          </div>
                          <div className="grid grid-cols-4 gap-3">
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
      <div className="glass-card rounded-2xl p-6 animate-fade-in-up stagger-3">
        <div className="flex items-center gap-3 mb-5">
          <Lightbulb size={18} className="text-amber-500" />
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
