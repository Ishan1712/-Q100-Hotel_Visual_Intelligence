"use client";

import React, { useState } from 'react';
import { 
  Trophy, TrendingUp, TrendingDown, Minus, Clock, Flame, 
  User, ChevronDown, ChevronUp, AlertTriangle, Lightbulb, Shield, Star
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
  const color = trend === "up" ? { stroke: '#10b981', fill: '#10b98120' } : trend === "down" ? { stroke: '#f43f5e', fill: '#f43f5e15' } : { stroke: '#94a3b8', fill: '#94a3b815' };
  return (
    <svg width={width} height={height} className="overflow-visible">
      <polygon points={fillPoints} fill={color.fill} />
      <polyline points={points} fill="none" stroke={color.stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      {data.length > 0 && (
        <circle cx={(data.length - 1) / (data.length - 1) * width} cy={height - ((data[data.length - 1] - min) / range) * height} r="3" fill={color.stroke} />
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
    if (color === "green") return "bg-gradient-to-r from-emerald-50/50 to-transparent hover:from-emerald-50";
    if (color === "amber") return "bg-white/50 hover:bg-slate-50/80";
    return "bg-gradient-to-r from-rose-50/50 to-transparent hover:from-rose-50";
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 animate-fade-in-up">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-slate-900">Staff Performance</h1>
          <p className="text-sm text-slate-400 font-medium mt-0.5">Taj Mahal Palace, Mumbai — 8 housekeepers on shift</p>
        </div>
        <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-2xl p-1 shadow-sm">
          {(["today", "week", "month"] as const).map((period) => (
            <button key={period} onClick={() => setTimePeriod(period)}
              className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all capitalize active:scale-95 ${
                timePeriod === period ? 'bg-slate-900 text-white shadow-md' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'
              }`}>
              {period === "today" ? "Today" : period === "week" ? "This Week" : "This Month"}
            </button>
          ))}
        </div>
      </div>

      {/* Top Performer Spotlight */}
      <div className="bg-gradient-to-br from-amber-50/60 via-white to-orange-50/30 rounded-[1.5rem] p-7 border border-amber-200/60 relative overflow-hidden animate-fade-in-up stagger-1 shadow-sm hover:shadow-lg transition-all duration-300">
        <div className="absolute top-0 right-0 w-72 h-72 bg-[radial-gradient(circle_at_80%_20%,rgba(245,158,11,0.12)_0,transparent_60%)] pointer-events-none" />
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 md:gap-7 relative z-10">
          <div className="w-18 h-18 rounded-[1.25rem] bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-xl shadow-amber-200/60 p-5">
            <Trophy size={32} className="text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Star size={14} className="text-amber-500 fill-amber-500" />
              <p className="text-[10px] font-black uppercase tracking-[0.4em] text-amber-600">Top Performer Today</p>
            </div>
            <h2 className="text-2xl font-black text-slate-900">{topPerformer.name}</h2>
            <div className="flex items-center gap-6 mt-2.5">
              <span className="flex items-center gap-2 text-sm text-slate-500 px-3 py-1.5 bg-white/60 rounded-xl border border-emerald-100">
                <strong className="text-emerald-600">{topPerformer.passRate}%</strong> pass rate
              </span>
              <span className="flex items-center gap-2 text-sm text-slate-500 px-3 py-1.5 bg-white/60 rounded-xl border border-blue-100">
                <Flame size={14} className="text-orange-400" /> <strong className="text-blue-600">{topPerformer.streak}</strong>-room streak
              </span>
              <span className="flex items-center gap-2 text-sm text-slate-500 px-3 py-1.5 bg-white/60 rounded-xl border border-slate-100">
                <Clock size={14} className="text-slate-400" /> Avg <strong className="text-slate-900">{topPerformer.avgTime}</strong>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Staff Table */}
      <div className="bg-gradient-to-br from-white to-slate-50/80 rounded-[1.5rem] border border-slate-200/60 shadow-sm overflow-hidden animate-fade-in-up stagger-2 hover:shadow-lg transition-all duration-300">
        <div className="px-7 py-5 border-b border-slate-100 flex items-center gap-3 bg-gradient-to-r from-slate-50/50 to-white">
          <div className="w-8 h-8 rounded-xl bg-blue-100 flex items-center justify-center">
            <Shield size={16} className="text-blue-600" />
          </div>
          <h2 className="text-xs font-black text-slate-400 uppercase tracking-[0.3em]">Today&apos;s Roster</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/30">
                <th className="text-left text-[10px] font-black uppercase tracking-widest text-slate-400 py-4 px-7">Name</th>
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
                  <tr className={`border-b border-slate-50 cursor-pointer transition-all duration-200 ${rowColor(staff.color)}`}
                    onClick={() => setExpandedRow(expandedRow === i ? null : i)}>
                    <td className="py-4 px-7">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shadow-sm ${
                          staff.color === 'green' ? 'bg-gradient-to-br from-emerald-100 to-emerald-200/50' :
                          staff.color === 'red' ? 'bg-gradient-to-br from-rose-100 to-rose-200/50' :
                          'bg-gradient-to-br from-slate-100 to-slate-200/50'
                        }`}>
                          <User size={16} className={
                            staff.color === 'green' ? 'text-emerald-600' :
                            staff.color === 'red' ? 'text-rose-600' : 'text-slate-500'
                          } />
                        </div>
                        <span className="text-sm font-bold text-slate-900">{staff.name}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-sm font-bold text-slate-700">{staff.rooms}</td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        <span className={`text-sm font-black px-2 py-0.5 rounded-lg ${
                          staff.passRate >= 85 ? 'text-emerald-700 bg-emerald-50' : staff.passRate >= 70 ? 'text-amber-700 bg-amber-50' : 'text-rose-700 bg-rose-50'
                        }`}>{staff.passRate}%</span>
                        <TrendIcon trend={staff.trend} />
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-1.5 text-sm text-slate-500">
                        <Clock size={14} className="text-slate-400" />
                        <span className="font-bold">{staff.avgTime}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-1.5 px-2.5 py-1 bg-orange-50/60 rounded-lg w-fit">
                        <Flame size={14} className="text-orange-400" />
                        <span className="text-sm font-black text-slate-700">{staff.streak}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <LargeTrendChart data={staff.weekData} trend={staff.trend} />
                    </td>
                    <td className="py-4 px-4">
                      <div className={`w-7 h-7 rounded-full flex items-center justify-center transition-all ${expandedRow === i ? 'bg-blue-100' : 'bg-slate-100'}`}>
                        {expandedRow === i ? <ChevronUp size={14} className="text-blue-600" /> : <ChevronDown size={14} className="text-slate-400" />}
                      </div>
                    </td>
                  </tr>
                  {expandedRow === i && (
                    <tr className="bg-gradient-to-r from-slate-50/80 to-white">
                      <td colSpan={7} className="px-7 py-6">
                        <div className="text-sm text-slate-500 space-y-4">
                          <p className="font-bold text-slate-700">Room-by-room breakdown for {staff.name}</p>
                          <div className="flex items-center gap-4 mb-2">
                            {days.map((day, j) => (
                              <div key={day} className="flex flex-col items-center gap-1.5">
                                <span className={`text-sm font-black ${
                                  staff.weekData[j] >= 85 ? 'text-emerald-600' : staff.weekData[j] >= 70 ? 'text-amber-600' : 'text-rose-600'
                                }`}>{staff.weekData[j]}%</span>
                                <div className="w-9 bg-slate-100 rounded-lg overflow-hidden shadow-inner" style={{ height: '48px' }}>
                                  <div className={`w-full rounded-lg transition-all ${
                                    staff.weekData[j] >= 85 ? 'bg-emerald-400' : staff.weekData[j] >= 70 ? 'bg-amber-400' : 'bg-rose-400'
                                  }`} style={{ height: `${staff.weekData[j]}%`, marginTop: `${100 - staff.weekData[j]}%` }} />
                                </div>
                                <span className="text-[10px] font-bold text-slate-400">{day}</span>
                              </div>
                            ))}
                          </div>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                            {Array.from({ length: parseInt(staff.rooms.split('/')[0]) }, (_, j) => (
                              <div key={j} className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl border transition-all hover:shadow-sm ${
                                j < parseInt(staff.rooms.split('/')[0]) * (staff.passRate / 100) 
                                  ? 'bg-emerald-50/50 border-emerald-100' 
                                  : 'bg-rose-50/50 border-rose-100'
                              }`}>
                                <div className={`w-2.5 h-2.5 rounded-full ${j < parseInt(staff.rooms.split('/')[0]) * (staff.passRate / 100) ? 'bg-emerald-500' : 'bg-rose-500'}`} />
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
      <div className="bg-gradient-to-br from-white to-amber-50/20 rounded-[1.5rem] p-7 border border-slate-200/60 shadow-sm animate-fade-in-up stagger-3 hover:shadow-lg transition-all duration-300">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-8 h-8 rounded-xl bg-amber-100 flex items-center justify-center">
            <Lightbulb size={16} className="text-amber-600" />
          </div>
          <h2 className="text-xs font-black text-slate-400 uppercase tracking-[0.3em]">Training Opportunities</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {trainingOpportunities.map((t) => (
            <div key={t.issue} className="p-6 rounded-[1.25rem] border border-amber-200 bg-gradient-to-br from-amber-50/90 to-amber-100/40 shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 cursor-pointer group">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-amber-100 rounded-xl shadow-sm shadow-amber-200 transition-transform group-hover:scale-110">
                  <AlertTriangle size={16} className="text-amber-600" />
                </div>
                <h4 className="text-sm font-bold text-slate-900 group-hover:text-amber-700 transition-colors">{t.issue}</h4>
              </div>
              <p className="text-sm text-slate-500 mb-3">Flagged in <strong className="text-slate-700">{t.count} rooms</strong> today across {t.staff} staff members</p>
              <div className="pt-3 border-t border-amber-200/50">
                <p className="text-xs text-amber-700 font-medium">💡 Recommendation: {t.recommendation}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
