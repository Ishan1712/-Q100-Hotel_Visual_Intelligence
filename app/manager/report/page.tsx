"use client";

import React from 'react';
import { 
  Bed, CheckCircle, Clock, IndianRupee, TrendingUp, TrendingDown, 
  AlertTriangle, Download, Mail, Printer, Star, Sparkles, Users, Shield, Zap
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

export default function DailyReport() {
  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 animate-fade-in-up">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-slate-900">Daily Operations Report</h1>
          <p className="text-sm text-slate-400 font-medium mt-0.5">Wednesday, 25 March 2026 · Taj Mahal Palace, Mumbai</p>
        </div>
        <div className="flex items-center gap-2.5 flex-wrap">
          <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-2xl text-sm font-bold text-slate-600 hover:bg-slate-50 hover:shadow-md hover:-translate-y-0.5 transition-all active:scale-95 shadow-sm">
            <Printer size={15} /> Print
          </button>
          <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-2xl text-sm font-bold text-slate-600 hover:bg-slate-50 hover:shadow-md hover:-translate-y-0.5 transition-all active:scale-95 shadow-sm">
            <Download size={15} /> PDF
          </button>
          <button className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-2xl text-sm font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 active:scale-95 hover:-translate-y-0.5">
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

      {/* Cost Savings Card */}
      <div className="bg-gradient-to-br from-white via-emerald-50/30 to-emerald-100/20 rounded-[1.5rem] p-7 border border-emerald-200/60 relative overflow-hidden animate-fade-in-up stagger-2 shadow-sm hover:shadow-lg transition-all duration-300">
        <div className="absolute top-0 right-0 w-72 h-72 bg-[radial-gradient(circle_at_80%_20%,rgba(16,185,129,0.12)_0,transparent_60%)] pointer-events-none" />
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-xl bg-emerald-100 flex items-center justify-center">
              <Zap size={16} className="text-emerald-600" />
            </div>
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-emerald-600">Estimated Savings Today</p>
          </div>
          <div className="flex items-center gap-8">
            <div className="shrink-0">
              <div className="flex items-baseline gap-1.5">
                <IndianRupee size={24} className="text-emerald-600" />
                <span className="text-5xl font-black text-slate-900">18,600</span>
              </div>
              <p className="text-sm text-slate-400 mt-1">Labour reallocation + complaint avoidance</p>
            </div>
            <div className="flex items-center gap-4 ml-auto">
              <div className="flex items-center gap-3 px-5 py-3.5 bg-gradient-to-br from-emerald-50 to-emerald-100/50 rounded-2xl border border-emerald-200 shadow-sm">
                <CheckCircle size={16} className="text-emerald-600 shrink-0" />
                <div>
                  <span className="text-sm font-bold text-slate-700 whitespace-nowrap">33 of 34</span>
                  <p className="text-xs text-slate-400 whitespace-nowrap">Issues resolved before check-in</p>
                </div>
              </div>
              <div className="flex items-center gap-3 px-5 py-3.5 bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-2xl border border-blue-200 shadow-sm">
                <Star size={16} className="text-blue-600 shrink-0" />
                <div>
                  <span className="text-sm font-bold text-slate-700">97.1%</span>
                  <p className="text-xs text-slate-400 whitespace-nowrap">Resolution rate</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Catches of the Day */}
      <div className="bg-gradient-to-br from-white to-amber-50/20 rounded-[1.5rem] p-7 border border-slate-200/60 shadow-sm animate-fade-in-up stagger-3 hover:shadow-lg transition-all duration-300">
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

      {/* Trend vs Last Week + Guest Satisfaction */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Trend Comparison */}
        <div className="bg-gradient-to-br from-white to-slate-50/80 rounded-[1.5rem] p-7 border border-slate-200/60 shadow-sm animate-fade-in-up stagger-4 hover:shadow-lg transition-all duration-300">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 rounded-xl bg-indigo-100 flex items-center justify-center">
              <TrendingUp size={16} className="text-indigo-600" />
            </div>
            <h2 className="text-xs font-black text-slate-400 uppercase tracking-[0.3em]">Trend vs. Last Week</h2>
          </div>
          <div className="space-y-6">
            {[
              { label: "Pass Rate", current: 76.1, previous: 68.4 },
              { label: "Avg Resolution Time", current: 14, previous: 22, unit: "min", lower: true },
              { label: "Issues Detected", current: 34, previous: 38 },
            ].map((item) => {
              const improved = item.lower ? item.current < item.previous : item.current > item.previous;
              return (
                <div key={item.label}>
                  <div className="flex items-center justify-between mb-2.5">
                    <span className="text-sm font-bold text-slate-700">{item.label}</span>
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${improved ? 'bg-emerald-50 text-emerald-600 border border-emerald-200' : 'bg-rose-50 text-rose-600 border border-rose-200'}`}>
                      {improved ? '↑ Improved' : '↓ Declined'}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex-1 h-3.5 bg-slate-100 rounded-full overflow-hidden shadow-inner">
                      <div className="h-full bg-slate-300 rounded-full" style={{ width: `${(item.previous / Math.max(item.current, item.previous)) * 100}%` }} />
                    </div>
                    <span className="text-xs text-slate-400 w-16 text-right font-medium">{item.previous}{item.unit || '%'}</span>
                  </div>
                  <div className="flex items-center gap-3 mt-1.5">
                    <div className="flex-1 h-3.5 bg-slate-100 rounded-full overflow-hidden shadow-inner">
                      <div className={`h-full rounded-full transition-all duration-700 ${improved ? 'bg-emerald-500' : 'bg-rose-500'}`} style={{ width: `${(item.current / Math.max(item.current, item.previous)) * 100}%` }} />
                    </div>
                    <span className="text-xs font-bold text-slate-700 w-16 text-right">{item.current}{item.unit || '%'}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Guest Satisfaction */}
        <div className="bg-gradient-to-br from-white to-blue-50/30 rounded-[1.5rem] p-7 border border-slate-200/60 shadow-sm animate-fade-in-up stagger-5 hover:shadow-lg transition-all duration-300">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 rounded-xl bg-blue-100 flex items-center justify-center">
              <Shield size={16} className="text-blue-600" />
            </div>
            <h2 className="text-xs font-black text-slate-400 uppercase tracking-[0.3em]">Guest Satisfaction Correlation</h2>
          </div>
          <div className="space-y-4">
            <div className="p-6 bg-gradient-to-br from-emerald-50/90 to-emerald-100/50 rounded-2xl border border-emerald-200 shadow-sm hover:shadow-md transition-all">
              <p className="text-[10px] font-black uppercase tracking-widest text-emerald-600 mb-1.5">Q100-Scanned Rooms</p>
              <span className="text-4xl font-black text-emerald-700">2.1</span>
              <p className="text-xs text-emerald-600 mt-1.5">complaints per 100 check-ins</p>
            </div>
            <div className="p-6 bg-gradient-to-br from-slate-50/90 to-slate-100/50 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all">
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1.5">Non-Scanned Rooms</p>
              <span className="text-4xl font-black text-slate-700">3.2</span>
              <p className="text-xs text-slate-500 mt-1.5">complaints per 100 check-ins</p>
            </div>
            <div className="flex items-center justify-center gap-3 p-5 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border border-blue-200 shadow-sm hover:shadow-md transition-all">
              <TrendingDown size={22} className="text-blue-600" />
              <span className="text-xl font-black text-blue-700">34.4% reduction</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
