"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowUpRight,
  AlertCircle,
  History,
  Target,
  ThumbsUp,
  TrendingDown,
  TrendingUp,
  ChevronRight,
  Zap,
} from "lucide-react";
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine,
  ComposedChart,
  Line,
  BarChart,
  Bar,
  Cell,
} from "recharts";
import OwnerDashboardLayout from "@/app/components/OwnerDashboardLayout";

const radarData = [
  { metric: "Customer Reviews", Mumbai: 76, Pune: 92, Nashik: 74, Aurangabad: 72, Nagpur: 68, Average: 75 },
  { metric: "Complaint Rate", Mumbai: 78, Pune: 88, Nashik: 74, Aurangabad: 70, Nagpur: 62, Average: 70 },
  { metric: "Revenue per Room", Mumbai: 80, Pune: 85, Nashik: 78, Aurangabad: 75, Nagpur: 72, Average: 75 },
  { metric: "Guest Retention", Mumbai: 91, Pune: 93, Nashik: 89, Aurangabad: 87, Nagpur: 83, Average: 80 },
  { metric: "Staff Efficiency", Mumbai: 82, Pune: 88, Nashik: 79, Aurangabad: 76, Nagpur: 71, Average: 78 },
  { metric: "Occupancy Rate", Mumbai: 72, Pune: 80, Nashik: 68, Aurangabad: 65, Nagpur: 58, Average: 72 },
];

const impactTrendData = [
  { month: "Oct", reviews: 4.1, complaints: 88 },
  { month: "Nov", reviews: 4.0, complaints: 92 },
  { month: "Dec", reviews: 4.1, complaints: 90 },
  { month: "Jan", reviews: 4.2, complaints: 85 },
  { month: "Feb", reviews: 4.1, complaints: 89 },
  { month: "Mar", reviews: 4.2, complaints: 86 },
  { month: "Apr", reviews: 4.3, complaints: 64 },
  { month: "May", reviews: 4.4, complaints: 48 },
  { month: "Jun", reviews: 4.5, complaints: 38 },
  { month: "Jul", reviews: 4.5, complaints: 32 },
  { month: "Aug", reviews: 4.6, complaints: 28 },
  { month: "Sep", reviews: 4.6, complaints: 26 },
];

const properties = [
  { name: "Portfolio", color: "#64748b" },
  { name: "JW Marriott Palace, Mumbai", color: "#3b82f6" },
  { name: "JW Marriott Grand, Pune", color: "#10b981" },
  { name: "JW Marriott Heritage, Nashik", color: "#f59e0b" },
  { name: "JW Marriott Gateway, Aurangabad", color: "#8b5cf6" },
  { name: "JW Marriott Central, Nagpur", color: "#f43f5e" },
];

const hotelTrendData: Record<string, typeof impactTrendData> = {
  Portfolio: impactTrendData,
  "JW Marriott Palace, Mumbai": [
    { month: "Oct", reviews: 4.0, complaints: 92 },
    { month: "Nov", reviews: 3.9, complaints: 95 },
    { month: "Dec", reviews: 4.0, complaints: 93 },
    { month: "Jan", reviews: 4.1, complaints: 88 },
    { month: "Feb", reviews: 4.0, complaints: 91 },
    { month: "Mar", reviews: 4.1, complaints: 89 },
    { month: "Apr", reviews: 4.2, complaints: 72 },
    { month: "May", reviews: 4.3, complaints: 55 },
    { month: "Jun", reviews: 4.4, complaints: 42 },
    { month: "Jul", reviews: 4.4, complaints: 38 },
    { month: "Aug", reviews: 4.5, complaints: 32 },
    { month: "Sep", reviews: 4.5, complaints: 30 },
  ],
  "JW Marriott Grand, Pune": [
    { month: "Oct", reviews: 4.3, complaints: 78 },
    { month: "Nov", reviews: 4.2, complaints: 82 },
    { month: "Dec", reviews: 4.3, complaints: 80 },
    { month: "Jan", reviews: 4.4, complaints: 75 },
    { month: "Feb", reviews: 4.3, complaints: 79 },
    { month: "Mar", reviews: 4.4, complaints: 70 },
    { month: "Apr", reviews: 4.5, complaints: 52 },
    { month: "May", reviews: 4.6, complaints: 38 },
    { month: "Jun", reviews: 4.7, complaints: 28 },
    { month: "Jul", reviews: 4.8, complaints: 22 },
    { month: "Aug", reviews: 4.8, complaints: 18 },
    { month: "Sep", reviews: 4.9, complaints: 15 },
  ],
  "JW Marriott Heritage, Nashik": [
    { month: "Oct", reviews: 3.8, complaints: 96 },
    { month: "Nov", reviews: 3.7, complaints: 98 },
    { month: "Dec", reviews: 3.8, complaints: 95 },
    { month: "Jan", reviews: 3.9, complaints: 92 },
    { month: "Feb", reviews: 3.8, complaints: 94 },
    { month: "Mar", reviews: 3.9, complaints: 90 },
    { month: "Apr", reviews: 4.0, complaints: 78 },
    { month: "May", reviews: 4.1, complaints: 65 },
    { month: "Jun", reviews: 4.2, complaints: 52 },
    { month: "Jul", reviews: 4.2, complaints: 48 },
    { month: "Aug", reviews: 4.3, complaints: 42 },
    { month: "Sep", reviews: 4.3, complaints: 38 },
  ],
  "JW Marriott Gateway, Aurangabad": [
    { month: "Oct", reviews: 3.7, complaints: 98 },
    { month: "Nov", reviews: 3.6, complaints: 100 },
    { month: "Dec", reviews: 3.7, complaints: 97 },
    { month: "Jan", reviews: 3.8, complaints: 94 },
    { month: "Feb", reviews: 3.7, complaints: 96 },
    { month: "Mar", reviews: 3.8, complaints: 92 },
    { month: "Apr", reviews: 3.9, complaints: 82 },
    { month: "May", reviews: 4.0, complaints: 70 },
    { month: "Jun", reviews: 4.1, complaints: 58 },
    { month: "Jul", reviews: 4.1, complaints: 54 },
    { month: "Aug", reviews: 4.2, complaints: 48 },
    { month: "Sep", reviews: 4.2, complaints: 44 },
  ],
  "JW Marriott Central, Nagpur": [
    { month: "Oct", reviews: 3.5, complaints: 110 },
    { month: "Nov", reviews: 3.4, complaints: 115 },
    { month: "Dec", reviews: 3.5, complaints: 112 },
    { month: "Jan", reviews: 3.6, complaints: 108 },
    { month: "Feb", reviews: 3.5, complaints: 110 },
    { month: "Mar", reviews: 3.6, complaints: 105 },
    { month: "Apr", reviews: 3.7, complaints: 95 },
    { month: "May", reviews: 3.8, complaints: 85 },
    { month: "Jun", reviews: 3.9, complaints: 75 },
    { month: "Jul", reviews: 3.9, complaints: 72 },
    { month: "Aug", reviews: 4.0, complaints: 68 },
    { month: "Sep", reviews: 4.0, complaints: 65 },
  ],
};

const hotelKpiStats: Record<string, Array<{ label: string; val: string; icon: any; color: string }>> = {
  Portfolio: [
    { label: "Reviews", val: "+0.4 stars", icon: ArrowUpRight, color: "emerald" },
    { label: "Complaints", val: "-70%", icon: TrendingDown, color: "emerald" },
    { label: "Monthly Revenue", val: "₹18.4L", icon: TrendingUp, color: "emerald" },
  ],
  "JW Marriott Palace, Mumbai": [
    { label: "Reviews", val: "+0.3 stars", icon: ArrowUpRight, color: "emerald" },
    { label: "Complaints", val: "-62%", icon: TrendingDown, color: "emerald" },
    { label: "Monthly Revenue", val: "₹12.2L", icon: TrendingUp, color: "emerald" },
  ],
  "JW Marriott Grand, Pune": [
    { label: "Reviews", val: "+0.6 stars", icon: ArrowUpRight, color: "emerald" },
    { label: "Complaints", val: "-85%", icon: TrendingDown, color: "emerald" },
    { label: "Monthly Revenue", val: "₹24.8L", icon: TrendingUp, color: "emerald" },
  ],
  "JW Marriott Heritage, Nashik": [
    { label: "Reviews", val: "+0.5 stars", icon: ArrowUpRight, color: "emerald" },
    { label: "Complaints", val: "-58%", icon: TrendingDown, color: "emerald" },
    { label: "Monthly Revenue", val: "₹9.4L", icon: TrendingUp, color: "emerald" },
  ],
  "JW Marriott Gateway, Aurangabad": [
    { label: "Reviews", val: "+0.4 stars", icon: ArrowUpRight, color: "emerald" },
    { label: "Complaints", val: "-52%", icon: TrendingDown, color: "emerald" },
    { label: "Monthly Revenue", val: "₹7.8L", icon: TrendingUp, color: "emerald" },
  ],
  "JW Marriott Central, Nagpur": [
    { label: "Reviews", val: "+0.5 stars", icon: ArrowUpRight, color: "emerald" },
    { label: "Complaints", val: "-45%", icon: TrendingDown, color: "emerald" },
    { label: "Monthly Revenue", val: "₹6.2L", icon: TrendingUp, color: "emerald" },
  ],
};

const propertyRevenueData = [
  { name: "Mumbai", revenue: 48.2, color: "#3b82f6" },
  { name: "Pune", revenue: 52.4, color: "#10b981" },
  { name: "Nashik", revenue: 24.7, color: "#f59e0b" },
  { name: "Aurangabad", revenue: 21.4, color: "#8b5cf6" },
  { name: "Nagpur", revenue: 18.2, color: "#f43f5e" },
];

const workingItems = [
  {
    hotel: "JW Marriott Grand, Pune",
    metric: "Turnaround Time",
    value: "14.2 min",
  },
  {
    hotel: "JW Marriott Palace, Mumbai",
    metric: "Staff Retention",
    value: "94.2%",
  },
  {
    hotel: "JW Marriott Heritage, Nashik",
    metric: "Breakfast Quality Score",
    value: "4.9/5",
  },
];

const attentionItems = [
  {
    hotel: "JW Marriott Central, Nagpur",
    issue: "Reviews dropped 0.2 stars",
    impact: "₹3.2L/mo loss",
    detail: "12 complaints about room cleanliness this week",
  },
  {
    hotel: "JW Marriott Gateway, Aurangabad",
    issue: "Guest retention fell 12%",
    impact: "₹1.8L/mo risk",
    detail: "Issues with VIP check-in consistency",
  },
  {
    hotel: "JW Marriott Heritage, Nashik",
    issue: "Complaint rate spike (8%)",
    impact: "₹1.1L/mo loss",
    detail: "Bathroom amenity image misalignment",
  },
];

function SectionCard({
  title,
  subtitle,
  icon,
  action,
  children,
  className = "",
}: {
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <motion.div 
      whileHover={{ y: -5 }}
      className={`rounded-2xl border border-slate-200 bg-white shadow-sm transition-shadow hover:shadow-md ${className}`}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 px-5 py-4">
        <div className="flex items-start gap-3">
          {icon ? <div className="rounded-xl bg-slate-50 border border-slate-100 p-2 text-slate-600 shadow-inner shrink-0">{icon}</div> : null}
          <div className="min-w-0">
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-tight whitespace-nowrap overflow-hidden text-ellipsis">{title}</h3>
            {subtitle ? <p className="mt-1 text-[10px] font-bold text-slate-400 uppercase tracking-widest">{subtitle}</p> : null}
          </div>
        </div>
        {action ? <div className="w-full sm:w-auto">{action}</div> : null}
      </div>
      <div className="p-5">{children}</div>
    </motion.div>
  );
}

export default function HotelPerformance() {
  const [selectedHotel, setSelectedHotel] = React.useState("Portfolio");

  return (
    <OwnerDashboardLayout
      title="Hotel Performance"
    >
      <div className="space-y-5">
        {/* Row 1 */}
        <SectionCard
          title="Portfolio Impact Velocity"
          subtitle={selectedHotel === "Portfolio" ? "12-month performance trend delta tracking" : `${selectedHotel} property performance trend`}
          icon={<History size={18} />}
          action={
            <div className="relative w-full sm:w-auto">
              <select 
                value={selectedHotel}
                onChange={(e) => setSelectedHotel(e.target.value)}
                className="w-full sm:w-auto appearance-none bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 pr-10 text-[11px] font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all cursor-pointer shadow-sm hover:bg-white"
              >
                {properties.map(p => (
                  <option key={p.name} value={p.name}>{p.name}</option>
                ))}
              </select>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                <ChevronRight size={14} className="rotate-90" />
              </div>
            </div>
          }
          className="overflow-hidden bg-gradient-to-br from-white via-white to-slate-50/50"
        >
          <div className="mb-6 flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 border border-blue-100">
              <div className="h-2 w-2 rounded-full bg-blue-600 animate-pulse" />
              <span className="text-[10px] font-black text-blue-700 uppercase tracking-widest">Review Score</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-rose-50 border border-rose-100">
              <div className="h-2 w-2 rounded-full bg-rose-500" />
              <span className="text-[10px] font-black text-rose-700 uppercase tracking-widest">Complaints</span>
            </div>
          </div>

          <div className="h-[320px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={hotelTrendData[selectedHotel]} margin={{ top: 16, right: 12, left: 0, bottom: 6 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis
                  dataKey="month"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#94a3b8", fontSize: 10, fontWeight: "bold" }}
                />
                <YAxis
                  yAxisId="left"
                  domain={[3.5, 5]}
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#2563eb", fontSize: 10, fontWeight: "bold" }}
                  tickFormatter={(val) => `${val}★`}
                />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  domain={[0, 100]}
                  reversed
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#e11d48", fontSize: 10, fontWeight: "bold" }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#fff",
                    border: "none",
                    borderRadius: "16px",
                    boxShadow: "0 25px 50px -12px rgb(0 0 0 / 0.15)",
                  }}
                  itemStyle={{ fontWeight: "bold", fontSize: "11px" }}
                />
                <ReferenceLine
                  x="Mar"
                  stroke="#0f172a"
                  strokeDasharray="5 5"
                  label={{ value: "Q100 Deployed", position: "top", fill: "#0f172a", fontSize: 10, fontWeight: "bold" }}
                />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="reviews"
                  stroke="#2563eb"
                  strokeWidth={4}
                  dot={{ r: 4, fill: "#fff", stroke: "#2563eb", strokeWidth: 2 }}
                  activeDot={{ r: 6 }}
                  animationDuration={2000}
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="complaints"
                  stroke="#e11d48"
                  strokeWidth={4}
                  dot={{ r: 4, fill: "#fff", stroke: "#e11d48", strokeWidth: 2 }}
                  activeDot={{ r: 6 }}
                  animationDuration={1500}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-5 grid grid-cols-1 gap-4 border-t border-slate-100 pt-5 md:grid-cols-4">
            {hotelKpiStats[selectedHotel].map((stat, i) => (
                <div key={i} className="rounded-2xl border border-emerald-100 bg-gradient-to-br from-emerald-50 to-white px-5 py-3 shadow-sm">
                  <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">{stat.label}</p>
                  <div className="mt-1 flex items-center gap-2 text-xl font-black text-emerald-800 tracking-tighter">
                    <stat.icon size={18} /> {stat.val}
                  </div>
                </div>
            ))}

            <div className="flex items-center">
              <button className="w-full py-4 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/10 active:scale-95">
                Download Impact Ledger
              </button>
            </div>
          </div>
        </SectionCard>

        {/* Row 2 */}
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
          {/* Radar Chart */}
          <SectionCard
            title="Portfolio Yield Radar"
            subtitle="Comparative metrics across all properties"
            icon={<Target size={18} />}
          >
            <div className="h-[340px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart 
                  cx="50%" 
                  cy="50%" 
                  outerRadius={typeof window !== 'undefined' && window.innerWidth < 640 ? "55%" : "70%"} 
                  data={radarData}
                  margin={{ top: 10, right: 10, bottom: 10, left: 10 }}
                >
                  <PolarGrid stroke="#f1f5f9" />
                  <PolarAngleAxis 
                    dataKey="metric" 
                    tick={{ fill: "#64748b", fontSize: typeof window !== 'undefined' && window.innerWidth < 640 ? 8 : 10, fontWeight: "bold" }} 
                  />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                  <Radar
                    name="Aurangabad"
                    dataKey="Aurangabad"
                    stroke="#8b5cf6"
                    fill="#8b5cf6"
                    fillOpacity={0.05}
                    strokeWidth={3}
                    animationDuration={1500}
                  />
                  <Radar
                    name="Industry Average"
                    dataKey="Average"
                    stroke="#94a3b8"
                    fill="transparent"
                    strokeWidth={2}
                    strokeDasharray="6 6"
                  />
                  <Radar
                    name="Mumbai"
                    dataKey="Mumbai"
                    stroke="#3b82f6"
                    fill="#3b82f6"
                    fillOpacity={0.05}
                    strokeWidth={3}
                    animationDuration={1500}
                  />
                  <Radar
                    name="Nagpur"
                    dataKey="Nagpur"
                    stroke="#f43f5e"
                    fill="#f43f5e"
                    fillOpacity={0.05}
                    strokeWidth={3}
                    animationDuration={1500}
                  />
                  <Radar
                    name="Nashik"
                    dataKey="Nashik"
                    stroke="#f59e0b"
                    fill="#f59e0b"
                    fillOpacity={0.05}
                    strokeWidth={3}
                    animationDuration={1500}
                  />
                  <Radar
                    name="Pune"
                    dataKey="Pune"
                    stroke="#10b981"
                    fill="#10b981"
                    fillOpacity={0.05}
                    strokeWidth={3}
                    animationDuration={1500}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#fff",
                      border: "none",
                      borderRadius: "16px",
                      boxShadow: "0 25px 50px -12px rgb(0 0 0 / 0.15)",
                    }}
                    itemStyle={{ fontWeight: "bold", fontSize: "11px" }}
                  />
                  <Legend iconType="circle" wrapperStyle={{ paddingTop: "20px", fontSize: "10px", fontWeight: "bold", textTransform: "uppercase", letterSpacing: "0.1em" }} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </SectionCard>

          {/* Revenue Bar Chart */}
          <SectionCard
            title="Property Revenue Matrix"
            subtitle="Total monthly yield per asset (in Lakhs)"
            icon={<TrendingUp size={18} />}
          >
            <div className="h-[340px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={propertyRevenueData} margin={{ top: 20, right: 30, left: 0, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                  <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: "#64748b", fontSize: 10, fontWeight: "bold" }} 
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: "#64748b", fontSize: 10, fontWeight: "bold" }}
                    tickFormatter={(val) => `₹${val}L`}
                  />
                  <Tooltip
                    cursor={{ fill: '#f8fafc' }}
                    contentStyle={{
                      backgroundColor: "#fff",
                      border: "none",
                      borderRadius: "16px",
                      boxShadow: "0 25px 50px -12px rgb(0 0 0 / 0.15)",
                    }}
                    itemStyle={{ fontWeight: "bold", fontSize: "11px" }}
                    formatter={(val) => [`₹${val} Lakhs`, "Monthly Revenue"]}
                  />
                  <Bar 
                    dataKey="revenue" 
                    radius={[8, 8, 0, 0]} 
                    animationDuration={2000}
                    animationBegin={200}
                  >
                    {propertyRevenueData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </SectionCard>
        </div>

        {/* Row 3 */}
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">

          {/* LEFT: What’s Working */}
          <SectionCard
            title="Portfolio Breakthroughs"
            subtitle="Benchmark performance to replicate"
            icon={<ThumbsUp size={18} />}
          >
            <div className="space-y-3">
              {workingItems.map((item, i) => (
                <motion.div
                  key={item.hotel}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  whileHover={{ x: 5 }}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-5 rounded-2xl border border-slate-200 bg-gradient-to-br from-white to-slate-50/50 p-5 shadow-sm group hover:border-emerald-200 transition-colors"
                >
                  <div className="flex-1">
                    <div className="flex flex-col">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{item.hotel}</p>
                        <p className="mt-1 text-sm font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">{item.metric}</p>
                        <div className="mt-2 text-[10px] font-black uppercase tracking-[0.15em] text-emerald-600 bg-emerald-50 self-start px-2 py-1 rounded-md">
                          {item.value}
                        </div>
                    </div>
                  </div>

                  <button className="w-full sm:w-auto whitespace-nowrap px-4 py-2.5 bg-emerald-600 text-white rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-600/10 active:scale-95">
                    Roll Out Global
                  </button>
                </motion.div>
              ))}
            </div>
          </SectionCard>

          {/* RIGHT: Needs Attention */}
          <SectionCard
            title="Portfolio Yield Risks"
            subtitle="Critical revenue interventions required"
            icon={<AlertCircle size={18} />}
          >
            <div className="space-y-3">
              {attentionItems.map((item, i) => (
                <motion.div
                  key={item.hotel}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  whileHover={{ x: -5 }}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-5 rounded-2xl border border-rose-100 bg-gradient-to-br from-rose-50/30 to-white p-5 shadow-sm group hover:border-rose-300 transition-colors"
                >
                  <div className="flex-1">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{item.hotel}</p>
                    <p className="mt-1 text-sm font-bold text-slate-900 group-hover:text-rose-700 transition-colors">{item.issue}</p>
                    <div className="mt-2 flex flex-col gap-1">
                       <span className="text-[10px] font-black text-rose-600 uppercase tracking-widest">
                         Revenue Leak: {item.impact}
                       </span>
                       <p className="text-[11px] font-medium italic text-slate-500 line-clamp-1">"{item.detail}"</p>
                    </div>
                  </div>

                  <button className="w-full sm:w-auto whitespace-nowrap px-4 py-2.5 bg-rose-600 text-white rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-rose-700 transition-all shadow-lg shadow-rose-600/10 active:scale-95">
                    Notify Manager
                  </button>
                </motion.div>
              ))}
            </div>
          </SectionCard>

        </div>
      </div>
    </OwnerDashboardLayout>
  );
}
