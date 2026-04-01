"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  TrendingUp,
  IndianRupee,
  Calendar,
  MessageSquareWarning,
  Star,
  Building2,
  Users,
  CheckCircle2,
  Activity,
  Zap
} from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  BarChart,
  Bar,
  Cell,
} from "recharts";
import OwnerDashboardLayout from "@/app/components/OwnerDashboardLayout";

const heroStats = [
  { label: "Q100 Subscription", value: "₹3.5L/month" },
  { label: "Additional Revenue", value: "₹18.4L/month" },
  { label: "Net Gain", value: "₹14.9L/month", highlight: true },
];

const kpis = [
  {
    title: "Payback Period",
    value: "38 Days",
    note: "Q100 paid for itself in 38 days",
    icon: Calendar,
    color: "indigo",
  },
  {
    title: "Complaint Reduction",
    value: "70% fewer",
    note: "From 120/month to 36/month across all hotels",
    icon: MessageSquareWarning,
    color: "rose",
  },
  {
    title: "Review Improvement",
    value: "+0.4 stars",
    note: "4.2 → 4.6 average across Google & OTAs",
    icon: Star,
    color: "amber",
  },
  {
    title: "Annual Revenue Projection",
    value: "₹2.2 Cr",
    note: "Projected additional revenue by Q1 2027",
    icon: TrendingUp,
    color: "emerald",
    highlight: true,
  },
];

const waterfallData = [
  { name: "Better Reviews", value: 4.85 },
  { name: "More Repeat Guests", value: 4.1 },
  { name: "Fewer Refunds/Comps", value: 2.45 },
  { name: "Higher Room Rates", value: 3.65 },
  { name: "Reduced Rework", value: 3.35 },
];

const monthlyRevenueData = [
  { month: "Oct", withoutQ100: 167, withQ100: 167 },
  { month: "Nov", withoutQ100: 166, withQ100: 170 },
  { month: "Dec", withoutQ100: 165, withQ100: 173 },
  { month: "Jan", withoutQ100: 164, withQ100: 178 },
  { month: "Feb", withoutQ100: 163, withQ100: 183 },
  { month: "Mar", withoutQ100: 162, withQ100: 188 },
  { month: "Apr", withoutQ100: 161, withQ100: 194 },
  { month: "May", withoutQ100: 161, withQ100: 201 },
  { month: "Jun", withoutQ100: 160, withQ100: 208 },
  { month: "Jul", withoutQ100: 160, withQ100: 216 },
  { month: "Aug", withoutQ100: 159, withQ100: 224 },
  { month: "Sep", withoutQ100: 158, withQ100: 232 },
];

const hotelRevenueRows = [
  {
    hotel: "Monarch Grand, Pune",
    before: "₹45L",
    after: "₹52L",
    gain: "+₹7L",
    score: "4.8 ⭐",
  },
  {
    hotel: "Monarch Palace, Mumbai",
    before: "₹62L",
    after: "₹68L",
    gain: "+₹6L",
    score: "4.6 ⭐",
  },
  {
    hotel: "Monarch Heritage, Nashik",
    before: "₹38L",
    after: "₹41L",
    gain: "+₹3L",
    score: "4.4 ⭐",
  },
  {
    hotel: "Monarch Gateway, Aurangabad",
    before: "₹34L",
    after: "₹37L",
    gain: "+₹3L",
    score: "4.3 ⭐",
  },
  {
    hotel: "Monarch Central, Nagpur",
    before: "₹29L",
    after: "₹31.4L",
    gain: "+₹2.4L",
    score: "4.2 ⭐",
  },
];

export default function RevenueImpact() {
  return (
    <OwnerDashboardLayout
      title="Revenue Impact"
      subtitle="How Q100 is growing your revenue"
    >
      <div className="space-y-5">
        {/* Hero Banner */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          whileHover={{ y: -4, transition: { duration: 0.2 } }}
          className="rounded-2xl border border-slate-800 bg-gradient-to-br from-slate-950 to-slate-900 text-white shadow-xl overflow-hidden cursor-default"
        >
          <div className="p-6 md:p-7 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-12 opacity-10 rotate-12 transition-transform hover:rotate-0 duration-700">
               <TrendingUp size={200} className="text-emerald-500" />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-end relative z-10">
              <div className="lg:col-span-8">
                <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-300">
                  <Star size={14} className="fill-emerald-300" />
                  Revenue growth since deployment
                </div>

                <h1 className="mt-4 text-4xl md:text-5xl font-black tracking-tight text-white">
                  ₹18.4L<span className="text-emerald-400">/month</span> additional revenue
                </h1>

                <p className="mt-2 text-sm md:text-base text-slate-400 max-w-2xl font-medium">
                  Your hotels earn ₹18.4L more every month since deploying Q100
                </p>

                <div className="mt-6 flex items-center gap-4">
                    <div className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl">
                        <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest leading-none mb-1">Total Impact</p>
                        <p className="text-xl font-black text-white leading-none">₹1.10 Cr</p>
                    </div>
                    <div className="px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
                        <p className="text-[10px] text-emerald-500/60 font-black uppercase tracking-widest leading-none mb-1">Forecast</p>
                        <p className="text-xl font-black text-emerald-400 leading-none">₹2.2 Cr</p>
                    </div>
                </div>
              </div>

              <div className="lg:col-span-4">
                <div className="rounded-xl border border-white/10 bg-white/5 backdrop-blur-md p-4">
                  <div className="flex items-center gap-2 text-slate-300 text-[10px] font-black uppercase tracking-widest mb-3">
                    <IndianRupee size={15} />
                    Yield Analysis summary
                  </div>
                  <div className="space-y-2">
                    {heroStats.map((item) => (
                      <div
                        key={item.label}
                        className={`rounded-lg px-3 py-3 border transition-colors ${
                          item.highlight
                            ? "border-emerald-400/20 bg-emerald-500/10 hover:bg-emerald-500/20"
                            : "border-white/10 bg-white/5 hover:bg-white/10"
                        }`}
                      >
                        <div className="text-[9px] text-white/40 font-black uppercase tracking-widest">{item.label}</div>
                        <div
                          className={`mt-1 text-lg font-black ${
                            item.highlight ? "text-emerald-400" : "text-white"
                          }`}
                        >
                          {item.value}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Waterfall + Chain */}
        <section className="grid grid-cols-1 xl:grid-cols-12 gap-5">
            <motion.div 
               whileHover={{ y: -6 }}
               className="xl:col-span-8 rounded-2xl border border-slate-200 bg-gradient-to-br from-white to-slate-50 shadow-sm p-6"
            >
              <div className="flex flex-col gap-2 mb-6">
                <h2 className="text-lg font-black text-slate-900 uppercase tracking-tight">
                  How Revenue Increased
                </h2>
                <div className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                        Standardization Chain Reaction
                    </p>
                </div>
              </div>

              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={waterfallData}
                    margin={{ top: 10, right: 10, left: 5, bottom: 20 }}
                  >
                    <defs>
                        <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#10b981" />
                            <stop offset="100%" stopColor="#059669" />
                        </linearGradient>
                    </defs>
                    <CartesianGrid vertical={false} stroke="#f1f5f9" />
                    <XAxis
                      dataKey="name"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: "#64748b", fontSize: 10, fontWeight: "bold" }}
                      interval={0}
                    />
                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: "#64748b", fontSize: 10, fontWeight: "bold" }}
                      tickFormatter={(v) => `₹${v}L`}
                    />
                    <Tooltip
                      formatter={(value: any) => [`+₹${value}L`, "Revenue Impact"]}
                      contentStyle={{
                        borderRadius: 16,
                        border: "none",
                        boxShadow: "0 25px 50px -12px rgb(0 0 0 / 0.15)",
                      }}
                      itemStyle={{ fontWeight: "bold", fontSize: "11px" }}
                    />
                    <Bar 
                        dataKey="value" 
                        radius={[8, 8, 8, 8]} 
                        animationBegin={200}
                        animationDuration={1500}
                    >
                      {waterfallData.map((entry) => (
                        <Cell
                          key={entry.name}
                          fill="url(#barGradient)"
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </motion.div>

            <motion.div 
               whileHover={{ y: -6 }}
               className="xl:col-span-4 rounded-2xl border border-slate-200 bg-slate-900 p-6 flex flex-col justify-between"
            >
              <h3 className="text-sm font-black text-white uppercase tracking-widest mb-4">
                Revenue Breakdown
              </h3>
              <div className="space-y-3">
                {[
                  { label: "Better Reviews", val: "+₹4.85L", icon: Star, color: "text-amber-400" },
                  { label: "More Repeat Guests", val: "+₹4.1L", icon: Users, color: "text-blue-400" },
                  { label: "Fewer Refunds", val: "+₹2.45L", icon: CheckCircle2, color: "text-emerald-400" },
                  { label: "Higher Room Rates", val: "+₹3.65L", icon: Activity, color: "text-fuchsia-400" },
                  { label: "Reduced Rework", val: "+₹3.35L", icon: Zap, color: "text-orange-400" },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="flex justify-between items-center rounded-xl bg-white/5 border border-white/5 px-4 py-3 group hover:bg-white/10 transition-all cursor-default"
                  >
                    <div className="flex items-center gap-3">
                        <item.icon size={14} className={item.color} />
                        <span className="text-xs font-bold text-slate-400 group-hover:text-white transition-colors">{item.label}</span>
                    </div>
                    <span className="text-sm font-black text-white">{item.val}</span>
                  </div>
                ))}
              </div>

              <div className="mt-6 rounded-2xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-4 text-center">
                <div className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.2em] mb-1">Portfolio Uplift</div>
                <div className="text-2xl font-black text-emerald-400">
                  +₹18.4L<span className="text-xs opacity-50 ml-1">/mo</span>
                </div>
              </div>
            </motion.div>
        </section>

        {/* KPI Cards */}
        <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
          {kpis.map((kpi, idx) => {
            const Icon = kpi.icon;
            const themes = {
              indigo: { bg: "bg-indigo-50/40", border: "border-indigo-100", text: "text-indigo-900", sub: "text-indigo-600/70", iconBg: "bg-indigo-600", accent: "indigo" },
              rose: { bg: "bg-rose-50/40", border: "border-rose-100", text: "text-rose-900", sub: "text-rose-600/70", iconBg: "bg-rose-600", accent: "rose" },
              amber: { bg: "bg-amber-50/40", border: "border-amber-100", text: "text-amber-900", sub: "text-amber-600/70", iconBg: "bg-amber-500", accent: "amber" },
              emerald: { bg: "bg-emerald-50/40", border: "border-emerald-100", text: "text-emerald-900", sub: "text-emerald-600/70", iconBg: "bg-emerald-600", accent: "emerald" },
            };
            const theme = themes[kpi.color as keyof typeof themes];

            return (
              <motion.div
                key={kpi.title}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1, type: "spring", stiffness: 100 }}
                whileHover={{ y: -8, scale: 1.02, boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)" }}
                className={`rounded-2xl border p-6 shadow-sm transition-all relative overflow-hidden group cursor-default ${theme.bg} ${theme.border}`}
              >
                {/* Glow effect */}
                <div className={`absolute -right-4 -top-4 w-24 h-24 blur-[40px] opacity-[0.08] transition-opacity group-hover:opacity-15 rounded-full bg-${theme.accent}-500`} />

                <div className="flex items-center justify-between gap-4 relative z-10">
                  <div>
                    <p className={`text-[10px] font-black uppercase tracking-widest ${theme.sub}`}>{kpi.title}</p>
                    <h3 className={`mt-2 text-2xl font-black tracking-tighter ${theme.text}`}>
                      {kpi.value}
                    </h3>
                  </div>
                  <div className={`h-11 w-11 rounded-xl flex items-center justify-center text-white shadow-lg shrink-0 transition-transform group-hover:scale-110 ${theme.iconBg}`}>
                    <Icon size={20} strokeWidth={2.5} />
                  </div>
                </div>
                <p className={`mt-4 text-[11px] font-bold leading-relaxed opacity-80 ${theme.text}`}>
                  {kpi.note}
                </p>
              </motion.div>
            );
          })}
        </section>

        {/* Revenue Growth Chart */}
        <motion.section 
           whileHover={{ y: -6 }}
           className="rounded-2xl border border-slate-200 bg-white shadow-sm p-6"
        >
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
            <div>
                <h2 className="text-lg font-black text-slate-900 uppercase tracking-tight">
                  Revenue Growth velocity
                </h2>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">
                  12-month performance delta tracking
                </p>
            </div>
            <div className="flex flex-wrap items-center gap-4 bg-slate-50 border border-slate-100 px-4 py-2 rounded-xl">
                <Legend label="Portfolio with Q100" colorClass="bg-emerald-500" />
                <Legend label="Baseline Performance" colorClass="bg-slate-300" />
            </div>
          </div>

          <div className="h-[340px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={monthlyRevenueData}
                margin={{ top: 20, right: 15, left: 5, bottom: 10 }}
              >
                <defs>
                    <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.15}/>
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                </defs>
                <CartesianGrid stroke="#f1f5f9" vertical={false} />
                <XAxis
                  dataKey="month"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#94a3b8", fontSize: 10, fontWeight: "bold" }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#94a3b8", fontSize: 10, fontWeight: "bold" }}
                  tickFormatter={(v) => `₹${v}L`}
                />
                <Tooltip
                  formatter={(value: number, name: string) => [
                    `₹${value}L`,
                    name === "withQ100" ? "Current Performance" : "Baseline",
                  ]}
                  contentStyle={{
                    borderRadius: 16,
                    border: "none",
                    boxShadow: "0 25px 50px -12px rgb(0 0 0 / 0.15)",
                  }}
                  itemStyle={{ fontWeight: "bold", fontSize: "11px" }}
                />

                <ReferenceLine
                  x="Jan"
                  stroke="#94a3b8"
                  strokeDasharray="4 4"
                  label={{
                    value: "Deployment Hub",
                    position: "top",
                    fill: "#64748b",
                    fontSize: 9,
                    fontWeight: "bold"
                  }}
                />

                <Area
                  type="monotone"
                  dataKey="withQ100"
                  stroke="none"
                  fill="url(#areaGradient)"
                  animationDuration={1800}
                />
                <Line
                  type="monotone"
                  dataKey="withoutQ100"
                  stroke="#94a3b8"
                  strokeWidth={2}
                  strokeDasharray="6 6"
                  dot={false}
                  animationDuration={1500}
                />
                <Line
                  type="monotone"
                  dataKey="withQ100"
                  stroke="#10b981"
                  strokeWidth={4}
                  dot={{ r: 4, fill: "#fff", stroke: "#10b981", strokeWidth: 2 }}
                  activeDot={{ r: 6, stroke: "#10b981", strokeWidth: 3 }}
                  animationDuration={2000}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.section>

        {/* Per-Hotel Breakdown */}
        <motion.section 
           whileHover={{ y: -6 }}
           className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden"
        >
          <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
            <div>
                <h2 className="text-sm font-black text-slate-900 uppercase tracking-widest">
                  Per-Hotel Yield Ledger
                </h2>
                <p className="text-[10px] text-slate-400 font-bold uppercase mt-1">Monthly Delta Analysis</p>
            </div>
            <button className="text-[10px] font-black text-blue-600 uppercase tracking-widest hover:underline">View Portfolio Heatmap</button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[860px]">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400 text-[10px] font-black uppercase tracking-widest">
                  <th className="text-left px-8 py-5">Property</th>
                  <th className="text-left px-8 py-5">Revenue Before</th>
                  <th className="text-left px-8 py-5">Current Revenue</th>
                  <th className="text-left px-8 py-5">Profit Gain</th>
                  <th className="text-left px-8 py-5">Review Score</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 text-sm">
                {hotelRevenueRows.map((row) => (
                  <tr key={row.hotel} className="hover:bg-slate-50 transition-all group cursor-default">
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-4">
                        <div className="h-10 w-10 rounded-xl bg-slate-100 text-slate-500 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors">
                          <Building2 size={18} />
                        </div>
                        <span className="font-bold text-slate-900">
                          {row.hotel}
                        </span>
                      </div>
                    </td>
                    <td className="px-8 py-5 font-bold text-slate-400">{row.before}</td>
                    <td className="px-8 py-5 font-black text-slate-900">
                      {row.after}
                    </td>
                    <td className="px-8 py-5">
                        <span className="inline-flex items-center gap-1.5 font-black text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full text-xs">
                           <TrendingUp size={12} /> {row.gain}
                        </span>
                    </td>
                    <td className="px-8 py-5 font-bold text-slate-900">
                        <div className="flex items-center gap-1">
                            <Star size={14} className="text-amber-500 fill-amber-500" />
                            {row.score.replace(' ⭐', '')}
                        </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.section>
      </div>
    </OwnerDashboardLayout>
  );
}

function Legend({
  label,
  colorClass,
}: {
  label: string;
  colorClass: string;
}) {
  return (
    <div className="flex items-center gap-2">
      <div className={`h-2.5 w-2.5 rounded-full ${colorClass}`} />
      <span className="text-sm text-slate-600">{label}</span>
    </div>
  );
}