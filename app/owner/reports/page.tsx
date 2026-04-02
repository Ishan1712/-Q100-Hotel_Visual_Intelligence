"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileText,
  Mail,
  Download,
  Building2,
  Sparkles,
  Calendar,
  CheckCircle2,
  ChevronRight,
  Settings,
  Clock,
  Printer,
  Share2,
} from "lucide-react";
import OwnerDashboardLayout from "@/app/components/OwnerDashboardLayout";

const reportTypes = [
  "Portfolio Revenue Impact",
  "Operational Excellence Ledger",
  "Quarterly Board Presentation",
  "Manager Productivity Audit",
];

const includedMetrics = [
  "Verified Review Lift (GMB/OTA)",
  "Revenue Velocity Matrix",
  "Standard Compliance Scorecard",
  "Labor Efficiency Index",
  "Intervention Impact Ledger",
];

export default function ReportGenerator() {
  const [selectedType, setSelectedType] = useState(reportTypes[0]);
  const [hotel, setHotel] = useState("All Hotels");

  return (
    <OwnerDashboardLayout
      title="Intelligence Reports"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">

        {/* LEFT CONFIG */}
        <div className="lg:col-span-4 space-y-5">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-6"
          >
            <div className="flex items-center gap-3 mb-2">
                <div className="h-10 w-10 rounded-xl bg-slate-900 flex items-center justify-center text-white shadow-lg shadow-slate-900/10">
                    <Settings size={18} />
                </div>
                <div>
                    <h3 className="text-sm font-black text-slate-900 uppercase tracking-tight">Report Configuration</h3>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Define your intelligence scope</p>
                </div>
            </div>

            {/* Property */}
            <div>
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 block">
                Portfolio Entity
              </label>
              <select
                className="w-full h-12 rounded-xl border border-slate-100 bg-slate-50 px-4 text-xs font-bold text-slate-900 focus:ring-2 focus:ring-slate-900 transition-all outline-none"
                value={hotel}
                onChange={(e) => setHotel(e.target.value)}
              >
                <option>All Assets (Consolidated)</option>
                <option>JW Marriott Grand, Pune</option>
                <option>JW Marriott Palace, Mumbai</option>
                <option>JW Marriott Heritage, Nashik</option>
              </select>
            </div>

            {/* Report Type */}
            <div>
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3 block">
                Intelligence Template
              </label>
              <div className="grid gap-2">
                {reportTypes.map((type) => (
                  <button
                    key={type}
                    onClick={() => setSelectedType(type)}
                    className={`text-left px-4 py-3.5 rounded-xl border text-[11px] font-black uppercase tracking-widest transition-all relative overflow-hidden group ${
                      selectedType === type
                        ? "bg-slate-900 text-white border-slate-900 shadow-lg shadow-slate-900/10"
                        : "bg-white border-slate-100 text-slate-500 hover:border-slate-300"
                    }`}
                  >
                    <span className="relative z-10">{type}</span>
                    <ChevronRight size={14} className={`absolute right-4 top-1/2 -translate-y-1/2 transition-transform ${selectedType === type ? 'translate-x-0' : 'translate-x-4 opacity-0'}`} />
                  </button>
                ))}
              </div>
            </div>

            {/* Included Metrics */}
            <div>
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3 block">
                Standard Inclusions
              </label>
              <div className="space-y-3 px-1">
                {includedMetrics.map((m) => (
                  <div key={m} className="flex items-center gap-3 text-[10px] font-bold text-slate-600">
                    <div className="h-4 w-4 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center">
                        <CheckCircle2 size={10} className="text-emerald-500" />
                    </div>
                    {m}
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-3 pt-4 border-t border-slate-50">
              <button className="w-full h-14 rounded-2xl bg-slate-900 text-white text-[10px] font-black uppercase tracking-[0.2em] hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/10 active:scale-95">
                Generate Analytics
              </button>
              <div className="flex gap-3">
                <button className="flex-1 h-12 rounded-xl border border-slate-200 text-[9px] font-black uppercase tracking-widest hover:bg-slate-50 transition-all">
                  Schedule
                </button>
                <button className="flex-1 h-12 rounded-xl border border-slate-200 text-[9px] font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-slate-50 transition-all">
                  <Mail size={14} /> Send Email
                </button>
              </div>
            </div>
          </motion.div>
        </div>

        {/* RIGHT PREVIEW */}
        <div className="lg:col-span-8 space-y-5">

          {/* Preview Toolbar */}
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white border border-slate-200 rounded-2xl p-5 flex flex-col md:flex-row justify-between items-center gap-4"
          >
            <div className="flex items-center gap-4">
                <div className="h-10 w-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 border border-blue-100">
                    <FileText size={20} />
                </div>
                <div>
                   <p className="text-xs font-black text-slate-900 uppercase tracking-widest">
                     {selectedType}
                   </p>
                   <p className="text-[10px] font-bold text-slate-400">PDF RENDER PREVIEW · UPDATED 2M AGO</p>
                </div>
            </div>

            <div className="flex gap-3 w-full md:w-auto">
              <button className="flex-1 md:flex-none px-5 py-3 rounded-xl border border-slate-200 text-[9px] font-black uppercase tracking-widest flex gap-2 items-center justify-center hover:bg-slate-50 transition-all">
                <Share2 size={14} /> Circulate
              </button>
              <button className="flex-1 md:flex-none px-5 py-3 rounded-xl bg-blue-600 text-white text-[9px] font-black uppercase tracking-widest flex gap-2 items-center justify-center shadow-lg shadow-blue-600/10 hover:bg-blue-700 transition-all">
                <Download size={14} /> Export PDF
              </button>
            </div>
          </motion.div>

          {/* PDF Preview */}
          <motion.div 
             initial={{ opacity: 0, scale: 0.98 }}
             animate={{ opacity: 1, scale: 1 }}
             className="bg-slate-900/5 rounded-3xl p-8 flex justify-center border border-slate-200/50 shadow-inner"
          >
            <div className="w-full max-w-2xl bg-white rounded-lg shadow-2xl p-10 space-y-10 relative overflow-hidden">
               {/* Watermark/Texture */}
               <div className="absolute inset-0 opacity-[0.03] pointer-events-none select-none overflow-hidden">
                   <div className="absolute top-10 left-10 text-[100px] font-black -rotate-12">JW Marriott</div>
                   <div className="absolute bottom-10 right-10 text-[100px] font-black -rotate-12">JW Marriott</div>
               </div>

              {/* PDF Header */}
              <div className="flex justify-between items-start relative translate-z-0">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 bg-slate-900 rounded-lg flex items-center justify-center text-white">
                    <Building2 size={16} />
                  </div>
                  <div>
                      <span className="text-[10px] font-black uppercase tracking-widest text-slate-900">
                        Portfolio Ledger
                      </span>
                      <p className="text-[8px] font-black text-slate-400 tracking-[0.3em] uppercase">JW Marriott Hospitality Group</p>
                  </div>
                </div>
                <div className="text-right">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Confidential / Proprietary</span>
                    <p className="text-[8px] text-slate-300 font-bold mt-1">TS-ID: 884-29-Q100</p>
                </div>
              </div>

              <div className="h-px bg-slate-100" />

              {/* AI Summary */}
              <div className="bg-gradient-to-br from-blue-50/50 to-white border border-blue-100 p-6 rounded-2xl relative">
                <div className="flex items-center gap-2 text-blue-600 text-[10px] font-black uppercase tracking-[0.2em] mb-3">
                  <Sparkles size={14} className="animate-pulse" /> Intelligence Summary
                </div>
                <p className="text-sm font-medium text-slate-700 leading-relaxed italic">
                  "Institutional alpha detected across Pune and Mumbai assets. Portfolio revenue velocity increased by <span className="text-emerald-600 font-bold">₹18.4L</span> this period, strongly correlated with a 12% lift in Guest Retention following Q100 standard deployment."
                </p>
              </div>

              {/* Metrics Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <PreviewMetric label="Monthly Yield" value="₹2.44Cr" delta="+8.2%" status="up" />
                <PreviewMetric label="Qual Score" value="4.64★" delta="+0.4" status="up" />
                <PreviewMetric label="Incident Rate" value="12.4" delta="-18%" status="down" />
                <PreviewMetric label="Resolution" value="94.2%" delta="+12%" status="up" />
              </div>

              {/* Data Table */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <p className="text-[10px] font-black text-slate-900 uppercase tracking-widest">
                      Asset Revenue Delta
                    </p>
                    <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">Month-over-Month</p>
                </div>
                <div className="overflow-hidden border border-slate-100 rounded-xl">
                    <table className="w-full text-[11px] font-medium">
                      <thead className="bg-slate-50 border-b border-slate-100">
                          <tr>
                              <th className="px-4 py-3 text-left font-black uppercase tracking-widest text-slate-400 text-[9px]">Property</th>
                              <th className="px-4 py-3 text-right font-black uppercase tracking-widest text-slate-400 text-[9px]">Revenue</th>
                              <th className="px-4 py-3 text-right font-black uppercase tracking-widest text-slate-400 text-[9px]">Δ Impact</th>
                          </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-50">
                        <tr>
                          <td className="px-4 py-3 font-bold">Pune JW Marriott Grand</td>
                          <td className="px-4 py-3 text-right font-bold">₹72,40,000</td>
                          <td className="px-4 py-3 text-right text-emerald-600 font-black">+₹8.4L</td>
                        </tr>
                        <tr>
                          <td className="px-4 py-3 font-bold">Mumbai JW Marriott Palace</td>
                          <td className="px-4 py-3 text-right font-bold">₹86,10,000</td>
                          <td className="px-4 py-3 text-right text-emerald-600 font-black">+₹6.2L</td>
                        </tr>
                      </tbody>
                    </table>
                </div>
              </div>

              <div className="pt-10 flex justify-center grayscale opacity-30 italic">
                  <div className="flex items-center gap-2">
                       <Building2 size={12} />
                       <span className="text-[8px] font-black uppercase tracking-[0.4em]">JW Marriott Group Legal Ledger</span>
                  </div>
              </div>
            </div>
          </motion.div>

          {/* Templates */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h3 className="text-sm font-black text-slate-900 uppercase tracking-tight">Recurring Automations</h3>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Scheduled executive intelligence delivery</p>
                </div>
                <button className="px-4 py-2 bg-slate-900 text-white rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-slate-800 transition-all active:scale-95">New Schedule</button>
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              {[
                { name: "Executive Monthly", icon: Calendar, color: "blue" },
                { name: "Portfolio Weekly", icon: Clock, color: "indigo" },
                { name: "Board Quarterly", icon: Printer, color: "slate" },
              ].map((t) => (
                <motion.div
                  key={t.name}
                  whileHover={{ y: -4, borderColor: '#cbd5e1' }}
                  className="rounded-2xl border border-slate-100 p-5 cursor-pointer bg-slate-50/30 transition-all group"
                >
                  <div className="h-24 bg-gradient-to-br from-slate-200/50 to-white rounded-xl mb-4 border border-slate-100 shadow-inner flex items-center justify-center">
                      <t.icon size={24} className="text-slate-300 group-hover:text-slate-600 transition-colors" />
                  </div>
                  <p className="text-[11px] font-black text-slate-900 uppercase tracking-tight">{t.name}</p>
                  <div className="mt-3 space-y-1">
                      <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Next Run: 01 APR</p>
                      <p className="text-[9px] font-black text-blue-600 uppercase tracking-widest">Recipients: 3 Executives</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </OwnerDashboardLayout>
  );
}

function PreviewMetric({ label, value, delta, status }: { label: string; value: string; delta: string; status: 'up' | 'down' }) {
    return (
        <div className="p-4 rounded-2xl border border-slate-50 bg-slate-50/50">
            <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">{label}</p>
            <p className="text-sm font-black text-slate-900 tracking-tight">{value}</p>
            <p className={`text-[9px] font-black mt-1 ${status === 'up' ? 'text-emerald-600' : 'text-rose-600'}`}>
                {delta}
            </p>
        </div>
    )
}
