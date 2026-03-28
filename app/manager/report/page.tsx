"use client";

import React from 'react';
import { 
  Bed, CheckCircle, Clock, IndianRupee, TrendingUp, TrendingDown, 
  AlertTriangle, Download, Mail, Printer, Star, Sparkles, Users
} from 'lucide-react';

/* ── Dummy Data ── */
const kpis = [
  { label: "Rooms Inspected", value: "142", icon: Bed, trend: "+8 vs last Wed", trendUp: true },
  { label: "Pass Rate", value: "76.1%", icon: CheckCircle, trend: "↑ from 68.4%", trendUp: true },
  { label: "Avg Resolution", value: "14m", icon: Clock, trend: "↓ from 22m", trendUp: true },
  { label: "Issues Found", value: "34", icon: AlertTriangle, trend: "24 minor · 8 major · 2 critical", trendUp: false },
  { label: "Hours Saved", value: "6.2h", icon: Users, trend: "vs manual inspection", trendUp: true },
];

const catchesOfTheDay = [
  {
    room: "718",
    title: "Pillowcase stain detected",
    description: "Invisible at arm's length, caught by AI zoom comparison. Linen replaced in 8 minutes.",
    impact: "This would have been a 1-star review.",
    severity: "Critical" as const,
  },
  {
    room: "305",
    title: "Minibar completely unstocked",
    description: "6 items missing after long-stay checkout. Caught before VIP arrival.",
    impact: "Prevented a guest complaint and service recovery escalation.",
    severity: "Major" as const,
  },
  {
    room: "612",
    title: "Curtain tie-back asymmetry",
    description: "One curtain tie-back on the wrong side — subtle but exactly the detail a luxury guest notices.",
    impact: "Presidential Suite presentation preserved for ₹45,000/night rate.",
    severity: "Minor" as const,
  },
];

export default function DailyReport() {
  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-20">
      {/* Header */}
      <div className="flex items-center justify-between animate-fade-in-up">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900">Daily Operations Report</h1>
          <p className="text-slate-400 font-medium mt-1">Wednesday, 25 March 2026 · Taj Mahal Palace, Mumbai</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-50 transition-all">
            <Printer size={16} />
            Print
          </button>
          <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-50 transition-all">
            <Download size={16} />
            PDF
          </button>
          <button className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200">
            <Mail size={16} />
            Email Report
          </button>
        </div>
      </div>

      {/* KPI Strip */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 animate-fade-in-up stagger-1">
        {kpis.map((kpi) => (
          <div key={kpi.label} className="kpi-card p-5 rounded-2xl">
            <div className="flex items-center justify-between mb-3">
              <div className="p-2 bg-slate-50 rounded-xl">
                <kpi.icon size={18} className="text-slate-400" />
              </div>
              {kpi.trendUp ? (
                <TrendingUp size={14} className="text-emerald-500" />
              ) : (
                <TrendingDown size={14} className="text-amber-500" />
              )}
            </div>
            <h3 className="text-2xl font-black text-slate-900">{kpi.value}</h3>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">{kpi.label}</p>
            <p className="text-xs text-slate-400 mt-1">{kpi.trend}</p>
          </div>
        ))}
      </div>

      {/* Cost Savings Card */}
      <div className="glass-card rounded-3xl p-8 relative overflow-hidden animate-fade-in-up stagger-2">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-emerald-100/50 to-transparent pointer-events-none" />
        <div className="flex items-center justify-between relative z-10">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-emerald-600 mb-2">Estimated Savings Today</p>
            <div className="flex items-baseline gap-2">
              <IndianRupee size={28} className="text-emerald-600" />
              <span className="text-5xl font-black text-slate-900">18,600</span>
            </div>
            <p className="text-sm text-slate-400 mt-2">Labour reallocation + complaint avoidance</p>
          </div>
          <div className="space-y-3">
            <div className="flex items-center gap-3 px-5 py-3 bg-emerald-50 rounded-xl border border-emerald-100">
              <CheckCircle size={16} className="text-emerald-600" />
              <div>
                <span className="text-sm font-bold text-slate-700">33 of 34</span>
                <p className="text-xs text-slate-400">Issues resolved before check-in</p>
              </div>
            </div>
            <div className="flex items-center gap-3 px-5 py-3 bg-blue-50 rounded-xl border border-blue-100">
              <Star size={16} className="text-blue-600" />
              <div>
                <span className="text-sm font-bold text-slate-700">97.1%</span>
                <p className="text-xs text-slate-400">Resolution rate</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Catches of the Day */}
      <div className="glass-card rounded-3xl p-8 animate-fade-in-up stagger-3">
        <div className="flex items-center gap-3 mb-6">
          <Sparkles size={20} className="text-amber-500" />
          <h2 className="text-xs font-black text-slate-400 uppercase tracking-[0.3em]">Catches of the Day</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {catchesOfTheDay.map((c, i) => {
            const severityStyle = {
              Critical: 'border-rose-200 bg-rose-50/50',
              Major: 'border-amber-200 bg-amber-50/50',
              Minor: 'border-blue-200 bg-blue-50/50',
            };
            const badgeStyle = {
              Critical: 'bg-rose-500 text-white',
              Major: 'bg-amber-500 text-white',
              Minor: 'bg-blue-500 text-white',
            };

            return (
              <div key={i} className={`p-6 rounded-2xl border ${severityStyle[c.severity]}`}>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-lg font-black text-slate-900">Room {c.room}</span>
                  <span className={`px-2 py-1 rounded-lg text-[10px] font-black uppercase ${badgeStyle[c.severity]}`}>{c.severity}</span>
                </div>
                <h4 className="text-sm font-bold text-slate-800 mb-2">{c.title}</h4>
                <p className="text-sm text-slate-500 mb-3">{c.description}</p>
                <div className="pt-3 border-t border-slate-200/50">
                  <p className="text-xs text-slate-600 italic">&ldquo;{c.impact}&rdquo;</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Trend vs Last Week + Guest Satisfaction */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Trend Comparison */}
        <div className="glass-card rounded-3xl p-6 animate-fade-in-up stagger-4">
          <h2 className="text-xs font-black text-slate-400 uppercase tracking-[0.3em] mb-6">Trend vs. Last Week</h2>
          <div className="space-y-5">
            {[
              { label: "Pass Rate", current: 76.1, previous: 68.4 },
              { label: "Avg Resolution Time", current: 14, previous: 22, unit: "min", lower: true },
              { label: "Issues Detected", current: 34, previous: 38 },
            ].map((item) => {
              const improved = item.lower ? item.current < item.previous : item.current > item.previous;
              return (
                <div key={item.label}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-slate-600">{item.label}</span>
                    <span className={`text-xs font-bold ${improved ? 'text-emerald-600' : 'text-rose-600'}`}>
                      {improved ? '↑ Improved' : '↓ Declined'}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex-1 h-3 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-slate-300 rounded-full" style={{ width: `${(item.previous / Math.max(item.current, item.previous)) * 100}%` }} />
                    </div>
                    <span className="text-xs text-slate-400 w-16 text-right">{item.previous}{item.unit || '%'}</span>
                  </div>
                  <div className="flex items-center gap-3 mt-1">
                    <div className="flex-1 h-3 bg-slate-100 rounded-full overflow-hidden">
                      <div className={`h-full rounded-full ${improved ? 'bg-emerald-500' : 'bg-rose-500'}`} style={{ width: `${(item.current / Math.max(item.current, item.previous)) * 100}%` }} />
                    </div>
                    <span className="text-xs font-bold text-slate-700 w-16 text-right">{item.current}{item.unit || '%'}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Guest Satisfaction Correlation */}
        <div className="glass-card rounded-3xl p-6 animate-fade-in-up stagger-5">
          <h2 className="text-xs font-black text-slate-400 uppercase tracking-[0.3em] mb-6">Guest Satisfaction Correlation</h2>
          <div className="space-y-6">
            <div className="p-5 bg-emerald-50 rounded-2xl border border-emerald-100">
              <p className="text-[10px] font-black uppercase tracking-widest text-emerald-600 mb-1">Q100-Scanned Rooms</p>
              <span className="text-3xl font-black text-emerald-700">2.1</span>
              <p className="text-xs text-emerald-600 mt-1">complaints per 100 check-ins</p>
            </div>
            <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200">
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">Non-Scanned Rooms</p>
              <span className="text-3xl font-black text-slate-700">3.2</span>
              <p className="text-xs text-slate-500 mt-1">complaints per 100 check-ins</p>
            </div>
            <div className="flex items-center justify-center gap-3 p-4 bg-blue-50 rounded-2xl border border-blue-100">
              <TrendingDown size={20} className="text-blue-600" />
              <span className="text-lg font-black text-blue-700">34.4% reduction</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
