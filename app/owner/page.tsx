"use client";

import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {
    ArrowUpRight,
    ArrowDownRight,
    Star,
    Hotel,
    Bed,
    Megaphone,
    TrendingDown,
    Search,
    ThumbsUp,
    AlertCircle,
    Zap,
    ShieldCheck,
    Download,
    TrendingUp
} from 'lucide-react';
import {
    ResponsiveContainer,
    LineChart,
    Line
} from 'recharts';
import OwnerDashboardLayout from '@/app/components/OwnerDashboardLayout';

const portfolioKPIs = [
    {
        label: "My Hotels",
        value: "5 Hotels",
        subText: "612 Total Rooms",
        icon: Hotel,
        color: "blue",
        trend: "Institutional Grade",
        icon2: Bed
    },
    {
        label: "Customer Reviews",
        value: "4.64 Stars",
        subText: "↑ 0.44 points since Q100",
        icon: Star,
        color: "amber",
        trend: "+12% Yield",
        showStars: true
    },
    {
        label: "Complaints Reduced",
        value: "70.2% RED",
        subText: "Sector-leading complaint reduction",
        icon: Megaphone,
        color: "rose",
        trend: "Critical Gain",
        isDownward: true
    },
    {
        label: "Revenue Growth",
        value: "+₹18.42L",
        subText: "Monthly alpha from better reviews",
        icon: TrendingUp,
        color: "emerald",
        trend: "+12.4% MoM"
    }
];

const propertyLeaderboard = [
    {
        property: "JW Marriott Grand, Pune",
        rooms: 148,
        googleRating: 4.8,
        otaScore: 4.7,
        totalReviews: 240,
        bookings: 2340,
        complaints: 4,
        revenue: "₹48.2L",
        trend: [40, 42, 45, 44, 46, 48],
        performance: "best"
    },
    {
        property: "JW Marriott Palace, Mumbai",
        rooms: 142,
        googleRating: 4.5,
        otaScore: 4.4,
        totalReviews: 198,
        bookings: 1890,
        complaints: 12,
        revenue: "₹38.5L",
        trend: [35, 36, 34, 37, 38, 38.5]
    },
    {
        property: "JW Marriott Heritage, Nashik",
        rooms: 98,
        googleRating: 4.3,
        otaScore: 4.2,
        totalReviews: 124,
        bookings: 1120,
        complaints: 18,
        revenue: "₹24.7L",
        trend: [22, 23, 22, 24, 25, 24.7]
    },
    {
        property: "JW Marriott Gateway, Aurangabad",
        rooms: 112,
        googleRating: 4.1,
        otaScore: 4.0,
        totalReviews: 88,
        bookings: 940,
        complaints: 22,
        revenue: "₹21.4L",
        trend: [18, 19, 20, 19, 21, 21.4]
    },
    {
        property: "JW Marriott Central, Nagpur",
        rooms: 112,
        googleRating: 3.8,
        otaScore: 3.6,
        totalReviews: 64,
        bookings: 890,
        complaints: 28,
        revenue: "₹18.2L",
        trend: [22, 21, 19, 20, 18, 18.2],
        performance: "worst"
    },
];

const financialImpactData = [
    { name: 'Increased Bookings', value: 820000, color: '#3b82f6' },
    { name: 'Repeat Guests', value: 410000, color: '#10b981' },
    { name: 'Reduced Refunds', value: 245000, color: '#8b5cf6' },
    { name: 'Higher Room Rates', value: 365000, color: '#fbbf24' },
];

export default function PortfolioDashboard() {
    const [searchQuery, setSearchQuery] = useState("");

    const filteredLeaderboard = useMemo(() => {
        const query = searchQuery.trim().toLowerCase();

        if (!query) return propertyLeaderboard;

        return propertyLeaderboard.filter((item) => {
            const city = item.property.split(",")[1]?.trim() || "";

            return [
                item.property,
                city,
                String(item.rooms),
                String(item.googleRating),
                String(item.otaScore),
                String(item.totalReviews),
                String(item.bookings),
                String(item.complaints),
                item.revenue,
                item.performance || ""
            ]
                .join(" ")
                .toLowerCase()
                .includes(query);
        });
    }, [searchQuery]);

    return (
        <OwnerDashboardLayout title="Portfolio Command Centre">
            <div className="space-y-8 pb-12">

                {/* KPI BANNER */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {portfolioKPIs.map((kpi, idx) => {
                        const Icon = kpi.icon;
                        const themes = {
                            blue: {
                                bg: "bg-blue-50/40",
                                border: "border-blue-100",
                                text: "text-blue-900",
                                sub: "text-blue-600/70",
                                iconBg: "bg-slate-900",
                                accentGlow: "bg-blue-500"
                            },
                            amber: {
                                bg: "bg-amber-50/40",
                                border: "border-amber-100",
                                text: "text-amber-900",
                                sub: "text-amber-600/70",
                                iconBg: "bg-amber-500",
                                accentGlow: "bg-amber-500"
                            },
                            rose: {
                                bg: "bg-rose-50/40",
                                border: "border-rose-100",
                                text: "text-rose-900",
                                sub: "text-rose-600/70",
                                iconBg: "bg-rose-600",
                                accentGlow: "bg-rose-500"
                            },
                            emerald: {
                                bg: "bg-emerald-50/40",
                                border: "border-emerald-100",
                                text: "text-emerald-900",
                                sub: "text-emerald-600/70",
                                iconBg: "bg-emerald-600",
                                accentGlow: "bg-emerald-500"
                            },
                        };

                        const theme = themes[kpi.color as keyof typeof themes];

                        return (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 15 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.1, type: "spring", stiffness: 100 }}
                                whileHover={{
                                    y: -8,
                                    scale: 1.02,
                                    boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)"
                                }}
                                className={`rounded-[2rem] border p-6 shadow-sm transition-all relative overflow-hidden group cursor-default ${theme.bg} ${theme.border}`}
                            >
                                <div
                                    className={`absolute -right-4 -top-4 w-24 h-24 blur-[40px] opacity-[0.08] transition-opacity group-hover:opacity-15 rounded-full ${theme.accentGlow}`}
                                />

                                <div className="flex justify-between items-start mb-6 relative z-10">
                                    <div className={`h-12 w-12 rounded-2xl flex items-center justify-center text-white shadow-lg transition-transform group-hover:scale-110 ${theme.iconBg}`}>
                                        <Icon size={22} strokeWidth={2.5} fill={kpi.showStars ? "currentColor" : "none"} />
                                    </div>
                                    <div
                                        className={`px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-wider border flex items-center gap-1.5 ${kpi.isDownward
                                                ? 'bg-rose-50 text-rose-600 border-rose-100'
                                                : 'bg-emerald-50 text-emerald-600 border-emerald-100'
                                            }`}
                                    >
                                        {kpi.isDownward ? <ArrowDownRight size={10} /> : <ArrowUpRight size={10} />}
                                        {kpi.trend}
                                    </div>
                                </div>

                                <div className="space-y-1 relative z-10">
                                    <p className={`text-[10px] font-black uppercase tracking-widest ${theme.sub}`}>
                                        {kpi.label}
                                    </p>

                                    <h3 className={`text-3xl font-black tracking-tighter ${theme.text}`}>
                                        {kpi.value.includes('₹') ? kpi.value : kpi.value.split(' ')[0]}
                                        {!kpi.value.includes('₹') && kpi.value.split(' ').slice(1).length > 0 && (
                                            <span className={`text-[10px] font-bold uppercase ml-2 tracking-widest ${theme.sub}`}>
                                                {kpi.value.split(' ').slice(1).join(' ')}
                                            </span>
                                        )}
                                    </h3>

                                    {kpi.showStars && (
                                        <div className="flex items-center gap-0.5 text-amber-500 my-1.5">
                                            {[1, 2, 3, 4, 5].map((s) => (
                                                <Star key={s} size={12} fill={s <= 4 ? "currentColor" : "none"} />
                                            ))}
                                        </div>
                                    )}

                                    {kpi.icon2 && (
                                        <div className={`flex items-center gap-2 mt-1 ${theme.sub}`}>
                                            <kpi.icon2 size={12} />
                                            <span className="text-[10px] font-bold uppercase tracking-tighter opacity-70">
                                                Total Inventory Managed
                                            </span>
                                        </div>
                                    )}

                                    <p className={`text-[11px] font-bold mt-4 uppercase tracking-tight opacity-70 ${theme.text}`}>
                                        {kpi.subText}
                                    </p>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>

                {/* PROPERTY LEADERBOARD TABLE */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden"
                >
                    <div className="p-6 md:p-8 border-b border-slate-50 flex flex-col md:flex-row md:items-center justify-between bg-slate-50/50 gap-4">
                        <div>
                            <h4 className="text-lg font-black text-slate-900 uppercase tracking-tight">
                                Performance Ledger
                            </h4>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1 italic">
                                Highest reviews leading the portfolio delta
                            </p>
                        </div>

                        <div className="flex items-center gap-3 bg-white px-4 py-2.5 md:py-2 rounded-xl border border-slate-100 shadow-sm w-full md:w-auto">
                            <Search size={14} className="text-slate-400" />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="FILTER ENTITIES..."
                                className="bg-transparent border-none outline-none text-[10px] font-black focus:ring-0 w-full md:w-32 uppercase tracking-widest text-slate-700 placeholder:text-slate-400"
                            />
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left min-w-[1000px]">
                            <thead>
                                <tr className="text-slate-400 text-[9px] uppercase font-black tracking-[0.2em] border-b border-slate-50">
                                    <th className="px-8 py-5">Hotel Entity</th>
                                    <th className="px-8 py-5 text-center">Room Count</th>
                                    <th className="px-8 py-5">Google Rating</th>
                                    <th className="px-8 py-5 text-center">OTA Score</th>
                                    <th className="px-8 py-5 text-center text-emerald-600">Total Reviews</th>
                                    <th className="px-8 py-5 text-center">Bookings</th>
                                    <th className="px-8 py-5 text-center">Complaints</th>
                                    <th className="px-8 py-5 text-right pr-12">Revenue Yield</th>
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-slate-50">
                                {filteredLeaderboard.length > 0 ? (
                                    filteredLeaderboard.map((item, i) => (
                                        <motion.tr
                                            key={`${item.property}-${i}`}
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: i * 0.05 }}
                                            className={`group cursor-pointer transition-all hover:bg-slate-50/70 ${item.performance === 'best'
                                                    ? 'bg-emerald-50/30'
                                                    : item.performance === 'worst'
                                                        ? 'bg-rose-50/30'
                                                        : ''
                                                }`}
                                        >
                                            <td className="px-8 py-5">
                                                <div className="flex items-center gap-4">
                                                    <div
                                                        className={`w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-sm ${item.performance === 'best'
                                                                ? 'bg-emerald-500'
                                                                : item.performance === 'worst'
                                                                    ? 'bg-rose-500'
                                                                    : 'bg-slate-900'
                                                            }`}
                                                    >
                                                        <Hotel size={18} />
                                                    </div>
                                                    <div>
                                                        <span className="text-slate-900 text-sm font-black tracking-tight">
                                                            {item.property.split(',')[0]}
                                                        </span>
                                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                                            {item.property.split(',')[1]?.trim()}
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>

                                            <td className="px-8 py-5 text-center text-slate-600 text-xs font-bold">
                                                {item.rooms}
                                            </td>

                                            <td className="px-8 py-5">
                                                <div className="flex flex-col gap-1">
                                                    <div className="flex items-center gap-1.5">
                                                        <span className="text-xs font-black text-slate-900">
                                                            {item.googleRating}
                                                        </span>
                                                        <div className="flex text-amber-500">
                                                            {[1, 2, 3, 4, 5].map((s) => (
                                                                <Star
                                                                    key={s}
                                                                    size={8}
                                                                    fill={s <= Math.floor(item.googleRating) ? "currentColor" : "none"}
                                                                />
                                                            ))}
                                                        </div>
                                                    </div>
                                                    <div className="w-16 h-1 bg-slate-100 rounded-full overflow-hidden">
                                                        <div
                                                            className="h-full bg-amber-500"
                                                            style={{ width: `${(item.googleRating / 5) * 100}%` }}
                                                        />
                                                    </div>
                                                </div>
                                            </td>

                                            <td className="px-8 py-5 text-center text-xs font-bold text-slate-800">
                                                {item.otaScore}
                                            </td>

                                            <td className="px-8 py-5 text-center">
                                                <span
                                                    className={`px-2 py-1 rounded text-[10px] font-black ${item.totalReviews > 150
                                                            ? 'bg-emerald-100 text-emerald-700'
                                                            : 'bg-amber-100 text-amber-700'
                                                        }`}
                                                >
                                                    {item.totalReviews}
                                                </span>
                                            </td>

                                            <td className="px-8 py-5 text-center text-xs font-black text-slate-900">
                                                {item.bookings.toLocaleString()}
                                            </td>

                                            <td className="px-8 py-5 text-center">
                                                <span
                                                    className={`text-xs font-black ${item.complaints < 10 ? 'text-emerald-600' : 'text-rose-600'
                                                        }`}
                                                >
                                                    {item.complaints}
                                                </span>
                                            </td>

                                            <td className="px-8 py-5 text-right pr-12">
                                                <div className="flex flex-col items-end">
                                                    <span className="text-sm font-black text-slate-900">
                                                        {item.revenue}
                                                    </span>
                                                    <div className="w-16 h-6 mt-1">
                                                        <ResponsiveContainer width="100%" height="100%">
                                                            <LineChart data={item.trend.map((v, idx) => ({ v, idx }))}>
                                                                <Line
                                                                    type="monotone"
                                                                    dataKey="v"
                                                                    stroke={
                                                                        item.performance === 'best'
                                                                            ? '#10b981'
                                                                            : item.performance === 'worst'
                                                                                ? '#f43f5e'
                                                                                : '#3b82f6'
                                                                    }
                                                                    strokeWidth={2}
                                                                    dot={false}
                                                                />
                                                            </LineChart>
                                                        </ResponsiveContainer>
                                                    </div>
                                                </div>
                                            </td>
                                        </motion.tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={8} className="px-8 py-10 text-center">
                                            <div className="flex flex-col items-center gap-2 text-slate-400">
                                                <Search size={18} />
                                                <p className="text-sm font-bold uppercase tracking-widest">
                                                    No matching entities found
                                                </p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </motion.div>

                {/* HOTEL COMPARISON HIGHLIGHT CARDS */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <motion.div
                        whileHover={{ scale: 1.01 }}
                        className="bg-white border border-slate-200 rounded-[2.5rem] p-10 shadow-sm relative overflow-hidden group"
                    >
                        <div className="absolute -right-10 -top-10 h-64 w-64 bg-emerald-500/5 blur-[80px] rounded-full" />
                        <div className="flex items-center gap-4 mb-8">
                            <div className="p-3 bg-emerald-500 text-white rounded-2xl shadow-lg ring-4 ring-emerald-50">
                                <Zap size={22} fill="currentColor" />
                            </div>
                            <div>
                                <h5 className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.2em]">
                                    Alpha Performer
                                </h5>
                                <h3 className="text-2xl font-black text-slate-900 tracking-tight">
                                    JW Marriott Grand, Pune
                                </h3>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-8 mb-8">
                            <div className="space-y-1">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                    Market Standing
                                </p>
                                <p className="text-xl font-black text-slate-900">4.8 ⭐ Rating</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                    Volume Hub
                                </p>
                                <p className="text-xl font-black text-slate-900">2,340 Bookings</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 p-4 bg-emerald-50 border border-emerald-100 rounded-2xl mb-8">
                            <ThumbsUp size={16} className="text-emerald-600" />
                            <p className="text-[11px] font-bold text-emerald-700 tracking-tight uppercase">
                                "Highest reviews, most customers across portfolio"
                            </p>
                        </div>
                    </motion.div>

                    <motion.div
                        whileHover={{ scale: 1.01 }}
                        className="bg-white border border-slate-200 rounded-[2.5rem] p-10 shadow-sm relative overflow-hidden group"
                    >
                        <div className="absolute -right-10 -top-10 h-64 w-64 bg-rose-500/5 blur-[80px] rounded-full" />
                        <div className="flex items-center gap-4 mb-8">
                            <div className="p-3 bg-rose-600 text-white rounded-2xl shadow-lg ring-4 ring-rose-50">
                                <AlertCircle size={22} />
                            </div>
                            <div>
                                <h5 className="text-[10px] font-black text-rose-600 uppercase tracking-[0.2em]">
                                    Intervention Required
                                </h5>
                                <h3 className="text-2xl font-black text-slate-900 tracking-tight">
                                    JW Marriott Central, Nagpur
                                </h3>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-8 mb-8">
                            <div className="space-y-1">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                    Revenue Leak
                                </p>
                                <p className="text-xl font-black text-rose-600">₹3.2L Lost/mo</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                    Review Floor
                                </p>
                                <p className="text-xl font-black text-slate-900">3.8 ⭐ Rating</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3 p-4 bg-rose-50 border border-rose-100 rounded-2xl mb-8">
                            <TrendingDown size={16} className="text-rose-600 mt-0.5 shrink-0" />
                            <p className="text-[11px] font-bold text-rose-700 tracking-tight uppercase leading-relaxed">
                                Lowest reviews, fewest customers — review drop costing ~₹3.2L/month in lost bookings
                            </p>
                        </div>
                    </motion.div>
                </div>

                {/* FINANCIAL IMPACT REVENUE MATRIX */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.98 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    className="bg-slate-900 rounded-[3rem] p-6 sm:p-12 shadow-[0_40px_80px_-15px_rgba(0,0,0,0.3)] relative overflow-hidden border border-slate-800"
                >
                    <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-500/10 blur-[150px] -translate-y-1/2 translate-x-1/2 rounded-full" />

                    <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-8 mb-8 sm:mb-16">
                        <div>
                            <div className="flex items-center gap-2 text-blue-400 font-black text-[12px] uppercase tracking-[0.4em] mb-4">
                                <ShieldCheck size={18} /> Quality-to-Revenue Matrix
                            </div>
                            <h2 className="text-3xl min-[400px]:text-4xl sm:text-6xl font-black text-white tracking-tighter leading-none mb-3">
                                ₹18.42L{" "}
                                <span className="text-blue-500 text-lg min-[400px]:text-xl sm:text-3xl align-top mt-2 inline-block">
                                    / Monthly Uplift
                                </span>
                            </h2>
                            <p className="text-slate-400 text-sm sm:text-xl font-bold tracking-tight uppercase">
                                Increased Bookings (Reviews) → Portfolio Growth
                            </p>
                        </div>
                        <div className="bg-white/5 border border-white/10 p-5 sm:p-8 rounded-3xl text-right backdrop-blur-xl">
                            <p className="text-blue-400 text-[9px] font-black uppercase tracking-widest mb-2">
                                Portfolio ROI Alpha
                            </p>
                            <h4 className="text-2xl font-black text-white">
                                ₹3,010 <span className="text-[10px] uppercase text-white/40 ml-1">/ room / month</span>
                            </h4>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10 relative z-10">
                        {financialImpactData.map((item, i) => (
                            <div key={i} className="space-y-3">
                                <div className="flex justify-between items-end">
                                    <span className="text-white text-[10px] font-black uppercase tracking-[0.2em]">
                                        {item.name}
                                    </span>
                                    <span className="text-base font-black" style={{ color: item.color }}>
                                        +₹{(item.value / 100000).toFixed(2)}L
                                    </span>
                                </div>
                                <div className="h-2 bg-white/5 rounded-full overflow-hidden p-[1px]">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        whileInView={{ width: `${(item.value / 820000) * 100}%` }}
                                        transition={{ duration: 1.5, delay: 0.2 + (i * 0.1) }}
                                        className="h-full rounded-full"
                                        style={{ backgroundColor: item.color }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-10 sm:mt-16 pt-8 border-t border-white/5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 relative z-10">
                        <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest italic whitespace-nowrap overflow-hidden text-ellipsis w-full sm:w-auto">
                            * Proprietary Q100 Yield Attribution Analysis (Reviews → Bookings Engine)
                        </p>
                        <button className="w-full sm:w-auto flex items-center justify-center gap-3 px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/10 text-white text-[10px] font-black uppercase tracking-widest rounded-2xl transition-all">
                            <Download size={16} /> Asset Growth Ledger
                        </button>
                    </div>
                </motion.div>

            </div>
        </OwnerDashboardLayout>
    );
}