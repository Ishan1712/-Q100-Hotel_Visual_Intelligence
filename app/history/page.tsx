"use client";

import React, { useState, useRef } from "react";
import {
  ChevronRight,
  ChevronLeft,
  Calendar,
  CheckCircle2,
  AlertCircle,
  Clock,
  History,
  TrendingUp,
  LayoutGrid,
  Maximize2,
  ArrowRight,
  Video,
  Camera,
  Search,
  ChevronDown,
  Star,
  XCircle,
} from "lucide-react";
import Link from "next/link";

// --- Types ---
interface RoomRecord {
  id: string;
  number: string;
  time: string;
  status: "pass" | "fixed";
  type: string;
  floor: string;
  date: string;
  image: string;
}

// --- Dummy Data ---
const roomHistory: RoomRecord[] = [
  {
    id: "1",
    number: "401",
    time: "09:05 AM",
    status: "pass",
    type: "Standard",
    floor: "4",
    date: "2026-03-27",
    image: "/images/report/bed.png",
  },
  {
    id: "2",
    number: "402",
    time: "09:20 AM",
    status: "pass",
    type: "Standard",
    floor: "4",
    date: "2026-03-27",
    image: "/images/report/linen.png",
  },
  {
    id: "3",
    number: "405",
    time: "09:35 AM",
    status: "pass",
    type: "Suite",
    floor: "4",
    date: "2026-03-27",
    image: "/images/report/towels.png",
  },
  {
    id: "4",
    number: "408",
    time: "09:55 AM",
    status: "pass",
    type: "Standard",
    floor: "4",
    date: "2026-03-27",
    image: "/images/report/dustbin.png",
  },
  {
    id: "5",
    number: "410",
    time: "10:10 AM",
    status: "pass",
    type: "Standard",
    floor: "4",
    date: "2026-03-27",
    image: "/images/report/tea_tray.png",
  },
  {
    id: "6",
    number: "412",
    time: "10:25 AM",
    status: "pass",
    type: "Standard",
    floor: "4",
    date: "2026-03-27",
    image: "/images/report/minibar.png",
  },
  {
    id: "7",
    number: "415",
    time: "10:45 AM",
    status: "pass",
    type: "Suite",
    floor: "4",
    date: "2026-03-27",
    image: "/images/report/amenities.png",
  },
  {
    id: "8",
    number: "420",
    time: "11:05 AM",
    status: "pass",
    type: "Standard",
    floor: "4",
    date: "2026-03-27",
    image: "/images/report/tv_remote.png",
  },
  {
    id: "9",
    number: "422",
    time: "11:20 AM",
    status: "pass",
    type: "VIP",
    floor: "4",
    date: "2026-03-27",
    image: "/images/report/curtains.png",
  },
  {
    id: "10",
    number: "425",
    time: "11:40 AM",
    status: "pass",
    type: "Standard",
    floor: "4",
    date: "2026-03-27",
    image: "/images/report/wardrobe.png",
  },
  {
    id: "11",
    number: "428",
    time: "12:00 PM",
    status: "fixed",
    type: "Standard Double",
    floor: "4",
    date: "2026-03-27",
    image: "/images/report/towels.png",
  },
  {
    id: "12",
    number: "430",
    time: "12:20 PM",
    status: "fixed",
    type: "Suite",
    floor: "4",
    date: "2026-03-27",
    image: "/images/report/minibar.png",
  },
  {
    id: "13",
    number: "432",
    time: "12:45 PM",
    status: "pass",
    type: "VIP",
    floor: "4",
    date: "2026-03-27",
    image: "/images/report/welcome.png",
  },
  {
    id: "14",
    number: "435",
    time: "01:05 PM",
    status: "fixed",
    type: "Standard",
    floor: "4",
    date: "2026-03-27",
    image: "/images/report/curtains.png",
  },
  // Historical data for testing
  {
    id: "15",
    number: "301",
    time: "10:00 AM",
    status: "pass",
    type: "Standard",
    floor: "3",
    date: "2026-03-26",
    image: "/images/report/bed.png",
  },
  {
    id: "16",
    number: "305",
    time: "11:30 AM",
    status: "pass",
    type: "Suite",
    floor: "3",
    date: "2026-03-26",
    image: "/images/report/towels.png",
  },
];

const trendData = [64, 71, 71, 79, 79, 85, 79];

export default function RoomHistoryPage() {
  const [activeTab, setActiveTab] = useState<"timeline" | "stats">("timeline");
  const [expandedRoom, setExpandedRoom] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDate, setSelectedDate] = useState("2026-03-27");
  const [showCalendar, setShowCalendar] = useState(false);
  const [viewDate, setViewDate] = useState(new Date("2026-03-27"));
  const calendarRef = useRef<HTMLDivElement>(null);

  const filteredHistory = roomHistory.filter(
    (room) =>
      room.date === selectedDate &&
      (room.number.toLowerCase().includes(searchQuery.toLowerCase()) ||
        room.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
        room.status.toLowerCase().includes(searchQuery.toLowerCase())),
  );

  const formattedDate = new Date(selectedDate).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    // Adjust first day to start from Monday (0: Sun, 1: Mon...) -> (0: Mon, 6: Sun)
    const startOffset = firstDay === 0 ? 6 : firstDay - 1;

    const days = [];
    // Previous month filler
    const prevMonthDays = new Date(year, month, 0).getDate();
    for (let i = startOffset - 1; i >= 0; i--) {
      days.push({
        day: prevMonthDays - i,
        currentMonth: false,
        date: new Date(year, month - 1, prevMonthDays - i),
      });
    }
    // Current month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push({ day: i, currentMonth: true, date: new Date(year, month, i) });
    }
    // Next month filler
    const remaining = 42 - days.length;
    for (let i = 1; i <= remaining; i++) {
      days.push({
        day: i,
        currentMonth: false,
        date: new Date(year, month + 1, i),
      });
    }
    return days;
  };

  const calendarDays = getDaysInMonth(viewDate);
  const monthName = viewDate.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  const handlePrevMonth = (e: React.MouseEvent) => {
    e.stopPropagation();
    setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1));
  };

  const handleNextMonth = (e: React.MouseEvent) => {
    e.stopPropagation();
    setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1));
  };

  const formatDateForState = (date: Date) => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
  };

  const handleDateSelect = (date: Date) => {
    setSelectedDate(formatDateForState(date));
    setShowCalendar(false);
  };

  return (
    <div className="min-h-screen bg-[var(--bg-gradient)] animate-fade-in pb-20 px-4 pt-4">
      <div className="max-w-[1440px] mx-auto space-y-6">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white p-5 rounded-3xl border border-slate-200 shadow-2xl shadow-slate-300">
          <div className="space-y-0.5">
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              Room History
            </h1>
            <p className="text-slate-400 font-medium text-xs">
              Review past inspections and track quality.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 flex-1 max-w-3xl justify-end">
            <div className="relative group flex-1 max-w-md">
              <Search
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors"
                size={16}
              />
              <input
                type="text"
                placeholder="Search history..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-100/50 border border-slate-200 rounded-2xl py-2 pl-12 pr-10 outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500/50 transition-all text-sm font-medium shadow-inner"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-500 transition-colors"
                >
                  <XCircle size={18} />
                </button>
              )}
            </div>

            <div className="flex items-center gap-4 bg-slate-50 p-1.5 rounded-2xl border border-slate-100 relative">
              <div className="relative">
                <button
                  onClick={() => setShowCalendar(!showCalendar)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-xl font-bold text-[10px] shadow-sm transition-all border ${showCalendar ? "bg-blue-50 border-blue-200 text-blue-700" : "bg-white text-slate-800 border-slate-200 hover:bg-slate-50"}`}
                >
                  <Calendar
                    size={12}
                    className={showCalendar ? "text-blue-600" : "text-blue-500"}
                  />
                  <span>{formattedDate}</span>
                  <ChevronDown
                    size={12}
                    className={`text-slate-400 transition-transform duration-200 ${showCalendar ? "rotate-180" : ""}`}
                  />
                </button>

                {showCalendar && (
                  <>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setShowCalendar(false)}
                    />
                    <div
                      ref={calendarRef}
                      className="absolute top-full left-0 sm:left-auto sm:right-0 mt-2 w-72 bg-white rounded-3xl shadow-2xl border border-slate-100 z-50 p-5 animate-in fade-in zoom-in duration-200 origin-top-left sm:origin-top-right"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-bold text-slate-900 text-xs">
                          {monthName}
                        </h3>
                        <div className="flex gap-1">
                          <button
                            onClick={handlePrevMonth}
                            className="p-1.5 hover:bg-slate-50 rounded-lg transition-colors"
                          >
                            <ChevronLeft size={16} className="text-slate-400" />
                          </button>
                          <button
                            onClick={handleNextMonth}
                            className="p-1.5 hover:bg-slate-50 rounded-lg transition-colors"
                          >
                            <ChevronRight
                              size={16}
                              className="text-slate-400"
                            />
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-7 gap-1 mb-2">
                        {["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"].map((d) => (
                          <div
                            key={d}
                            className="text-[10px] font-bold text-slate-400 text-center py-1"
                          >
                            {d}
                          </div>
                        ))}
                      </div>

                      <div className="grid grid-cols-7 gap-1">
                        {calendarDays.map((d, i) => {
                          const isSelected =
                            formatDateForState(d.date) === selectedDate;
                          const isToday =
                            d.date.toDateString() === new Date().toDateString();

                          return (
                            <button
                              key={i}
                              onClick={() => handleDateSelect(d.date)}
                              className={`
                                  aspect-square rounded-xl text-[11px] font-bold transition-all flex items-center justify-center
                                  ${!d.currentMonth ? "text-slate-200" : isSelected ? "bg-blue-600 text-white shadow-lg shadow-blue-500/30" : "text-slate-600 hover:bg-blue-50 hover:text-blue-600"}
                                  ${isToday && !isSelected ? "ring-2 ring-blue-500 ring-offset-2" : ""}
                                `}
                            >
                              {d.day}
                            </button>
                          );
                        })}
                      </div>

                      <div className="mt-4 pt-4 border-t border-slate-50 flex justify-between items-center">
                        <button
                          onClick={() => handleDateSelect(new Date())}
                          className="text-[10px] font-bold text-blue-600 hover:underline"
                        >
                          Today
                        </button>
                        <button
                          onClick={() => setShowCalendar(false)}
                          className="text-[10px] font-bold text-slate-400 hover:text-slate-600"
                        >
                          Close
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
              <div className="w-px h-5 bg-slate-200" />
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setActiveTab("timeline")}
                  className={`px-4 py-1.5 rounded-xl text-[10px] font-bold transition-all ${activeTab === "timeline" ? "bg-slate-900 text-white shadow-lg" : "text-slate-400 hover:text-slate-900"}`}
                >
                  Timeline
                </button>
                <button
                  onClick={() => setActiveTab("stats")}
                  className={`px-4 py-1.5 rounded-xl text-[10px] font-bold transition-all ${activeTab === "stats" ? "bg-slate-900 text-white shadow-lg" : "text-slate-400 hover:text-slate-900"}`}
                >
                  My Stats
                </button>
              </div>
            </div>
          </div>
        </header>

        <div className="space-y-6 min-h-[600px]">
          {activeTab === "timeline" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 min-h-[400px]">
              {filteredHistory.length > 0 ? (
                filteredHistory.map((room) => {
                  const isFixed = room.status === "fixed";
                  const isExpanded = expandedRoom === room.id;

                  return (
                    <div
                      key={room.id}
                      className={`group kpi-card rounded-3xl transition-all duration-300 overflow-hidden relative shadow-lg ${
                        isExpanded
                          ? "col-span-full border-blue-300 ring-4 ring-blue-500/5"
                          : isFixed
                            ? "bg-amber-50/80 border-amber-200"
                            : "bg-emerald-50/80 border-emerald-200"
                      }`}
                    >
                      <div
                        className={`absolute top-0 left-0 right-0 h-1 ${isFixed ? "bg-amber-400" : "bg-emerald-400"}`}
                      />

                      <div
                        className={`p-5 ${isExpanded ? "border-b border-slate-50" : ""}`}
                      >
                        <div className="flex justify-between items-start mb-4">
                          <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300 shadow-sm">
                            <LayoutGrid size={20} />
                          </div>
                          <div
                            className={`px-2.5 py-1 rounded-lg text-[9px] font-extrabold uppercase tracking-wider shadow-sm ${
                              isFixed
                                ? "bg-amber-500 text-white"
                                : "bg-emerald-500 text-white"
                            }`}
                          >
                            {isFixed ? "Fixed" : "Passed"}
                          </div>
                        </div>

                        <div className="flex justify-between items-end">
                          <div className="space-y-0.5">
                            <h3 className="text-xl font-black text-slate-900 tracking-tight">
                              Room {room.number}
                            </h3>
                            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                              {room.type} • Floor {room.floor}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">
                              Time
                            </p>
                            <p className="text-[11px] font-extrabold text-slate-900">
                              {room.time}
                            </p>
                          </div>
                        </div>

                        <div className="mt-5 flex items-center justify-between">
                          <div className="w-10 h-10 rounded-xl overflow-hidden border border-slate-100 shadow-inner group-hover:scale-110 transition-transform duration-500">
                            <img
                              src={room.image}
                              className="w-full h-full object-cover"
                              alt="Preview"
                            />
                          </div>
                          <button
                            onClick={() =>
                              setExpandedRoom(isExpanded ? null : room.id)
                            }
                            className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${
                              isExpanded
                                ? "bg-slate-900 text-white"
                                : "bg-slate-50 text-slate-500 hover:text-blue-600 hover:bg-white border border-transparent hover:border-blue-100 hover:shadow-sm"
                            }`}
                          >
                            {isExpanded ? "Close" : "Review"}
                          </button>
                        </div>
                      </div>

                      {isExpanded && isFixed && (
                        <div className="p-8 bg-slate-50/50 animate-expand-vertical">
                          <div className="flex flex-col lg:flex-row gap-10 items-center">
                            <div className="flex-1 space-y-6">
                              <div className="space-y-2">
                                <h4 className="text-lg font-bold text-slate-900 tracking-tight">
                                  Issue Resolution Log
                                </h4>
                                <p className="text-sm text-slate-500 max-w-md">
                                  Visual discrepancies were detected during the initial scan. Issues were flagged and successfully resolved by the housekeeper before finalizing.
                                </p>
                              </div>

                              <div className="grid grid-cols-2 gap-4">
                                <div className="p-4 bg-emerald-50 rounded-[2rem] border border-emerald-100 shadow-sm">
                                  <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-2">
                                    Final State
                                  </p>
                                  <ul className="text-xs font-bold text-emerald-900 space-y-1">
                                    <li>✓ Items correctly positioned</li>
                                    <li>✓ Met brand standard</li>
                                  </ul>
                                </div>
                                <div className="p-4 bg-rose-50 rounded-[2rem] border border-rose-100 shadow-sm">
                                  <p className="text-[10px] font-black text-rose-600 uppercase tracking-widest mb-2">
                                    Initial Scan
                                  </p>
                                  <ul className="text-xs font-bold text-rose-900 space-y-1">
                                    <li>✗ Incorrect item alignment</li>
                                    <li>✗ Missing component</li>
                                  </ul>
                                </div>
                              </div>

                              <div className="pt-4">
                                <button className="px-6 py-3 bg-blue-600 text-white rounded-2xl font-bold text-xs tracking-widest uppercase shadow-lg shadow-blue-500/20 flex items-center gap-2 hover:bg-blue-700 hover:scale-105 transition-all">
                                  <TrendingUp size={16} />
                                  Lesson: Standard Layout
                                </button>
                              </div>
                            </div>

                            <div className="flex-1 flex items-center justify-center gap-4">
                              <div className="relative group rounded-3xl overflow-hidden border-2 border-slate-200">
                                <div className="absolute top-3 left-3 bg-slate-900/80 text-white px-2 py-1 rounded-lg text-[8px] font-black uppercase tracking-widest border border-white/20">
                                  Master
                                </div>
                                <img
                                  src={room.image}
                                  className="w-[300px] h-40 object-cover grayscale-[30%]"
                                  alt="Master"
                                />
                              </div>
                              <ArrowRight
                                size={24}
                                className="text-slate-300"
                              />
                              <div className="relative group rounded-3xl overflow-hidden border-4 border-rose-500/50 shadow-xl shadow-rose-200">
                                <div className="absolute top-3 left-3 bg-rose-600 text-white px-2 py-1 rounded-lg text-[8px] font-black uppercase tracking-widest border border-white/20 z-10">
                                  Initial Scan
                                </div>
                                <img
                                  src={room.image}
                                  className="w-[300px] h-40 object-cover opacity-80"
                                  alt="Captured"
                                />
                                <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-8 h-8 border-4 border-rose-500 rounded-full animate-ping" />
                                <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-10 h-6 border-4 border-rose-500 rounded-lg animate-pulse" />
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {isExpanded && !isFixed && (
                        <div className="p-8 bg-slate-50/50 animate-expand-vertical flex items-center justify-center text-center">
                          <div className="space-y-4 max-w-sm">
                            <CheckCircle2
                              size={48}
                              className="text-emerald-500 mx-auto"
                            />
                            <h4 className="text-lg font-bold text-slate-900">
                              Verified Perfect Match
                            </h4>
                            <p className="text-sm text-slate-500">
                              This room met all visual standards on the first
                              attempt. Keep following this gold standard!
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })
              ) : (
                <div className="col-span-full flex flex-col items-center justify-center py-20 bg-slate-50 rounded-[3rem] border border-dashed border-slate-200 animate-fade-in">
                  <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-slate-300 shadow-sm mb-4">
                    <Search size={32} />
                  </div>
                  <p className="text-slate-500 font-bold">
                    No history found for "{searchQuery}"
                  </p>
                  <button
                    onClick={() => setSearchQuery("")}
                    className="mt-4 text-blue-600 text-xs font-bold uppercase tracking-widest hover:underline"
                  >
                    Clear Search
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-fade-in">
              <div className="lg:col-span-8 bg-white rounded-3xl p-8 border border-slate-200 shadow-2xl shadow-slate-300 space-y-8">
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <h3 className="text-2xl font-black text-slate-900 tracking-tighter">
                      7-Day Progress
                    </h3>
                    <p className="text-slate-400 font-medium text-sm">
                      First-attempt pass rate trend.
                    </p>
                  </div>
                  <div className="flex items-center gap-2 bg-emerald-50 text-emerald-600 px-4 py-2 rounded-2xl border border-emerald-100 font-bold text-xs">
                    <TrendingUp size={16} />
                    <span>+14% Improvement</span>
                  </div>
                </div>

                <div className="relative h-64 w-full flex items-end justify-between px-10 pb-6 border-b border-l border-slate-50">
                  {[...Array(5)].map((_, i) => (
                    <div
                      key={i}
                      className="absolute left-0 right-0 border-t border-slate-50"
                      style={{ bottom: `${i * 25}%` }}
                    />
                  ))}

                  <svg
                    viewBox="0 0 700 200"
                    className="absolute left-10 right-10 bottom-6 w-[calc(100%-80px)] h-48 overflow-visible"
                  >
                    <defs>
                      <linearGradient
                        id="gradientLine"
                        x1="0%"
                        y1="0%"
                        x2="100%"
                        y2="0%"
                      >
                        <stop offset="0%" stopColor="#3b82f6" />
                        <stop offset="100%" stopColor="#10b981" />
                      </linearGradient>
                      <filter
                        id="shadow"
                        x="-20%"
                        y="-20%"
                        width="140%"
                        height="140%"
                      >
                        <feGaussianBlur in="SourceAlpha" stdDeviation="4" />
                        <feOffset dx="0" dy="8" result="offsetblur" />
                        <feComponentTransfer>
                          <feFuncA type="linear" slope="0.2" />
                        </feComponentTransfer>
                        <feMerge>
                          <feMergeNode />
                          <feMergeNode in="SourceGraphic" />
                        </feMerge>
                      </filter>
                    </defs>
                    <path
                      d="M 50 150 L 150 120 L 250 120 L 350 90 L 450 90 L 550 50 L 650 90"
                      fill="none"
                      stroke="url(#gradientLine)"
                      strokeWidth="8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      filter="url(#shadow)"
                      className="animate-draw-line"
                    />
                    {trendData.map((val, i) => {
                      const points = [150, 120, 120, 90, 90, 50, 90];
                      return (
                        <circle
                          key={i}
                          cx={50 + i * 100}
                          cy={points[i]}
                          r="6"
                          className="fill-white stroke-slate-900 stroke-[3px] hover:stroke-blue-500 hover:r-8 transition-all duration-300 cursor-pointer"
                        />
                      );
                    })}
                  </svg>

                  {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Today"].map(
                    (day, i) => (
                      <div
                        key={day}
                        className="text-[10px] font-black text-slate-400 uppercase tracking-widest"
                      >
                        {day}
                      </div>
                    ),
                  )}
                </div>

                <div className="p-5 bg-blue-50/50 backdrop-blur-sm rounded-3xl border border-blue-100/50 flex items-center justify-between gap-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-amber-500 shadow-sm">
                      <Star size={20} className="fill-amber-500" />
                    </div>
                    <div>
                      <p className="text-xs font-black text-slate-900">
                        Career Trajectory: Outstanding
                      </p>
                      <p className="text-[10px] text-slate-500">
                        80%+ pass rate for 4 consecutive days.
                      </p>
                    </div>
                  </div>
                  <button className="px-4 py-2 bg-slate-900 text-white rounded-xl font-bold text-[9px] tracking-widest uppercase shadow-lg shadow-slate-900/20 hover:scale-105 transition-transform">
                    Coaching Tips
                  </button>
                </div>
              </div>

              <div className="lg:col-span-4 space-y-6">
                <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xl shadow-slate-300 text-center space-y-4">
                  <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 shadow-inner">
                    <TrendingUp size={28} />
                  </div>
                  <div>
                    <h4 className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">
                      Weekly Improvement
                    </h4>
                    <p className="text-3xl font-black text-slate-900 leading-none">
                      +12.2%
                    </p>
                  </div>
                  <div className="bg-white/90 backdrop-blur-xl p-6 rounded-3xl shadow-2xl shadow-slate-200/40 border border-slate-100 text-center space-y-4 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full -mr-16 -mt-16 transition-transform duration-700 group-hover:scale-150" />
                    <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-amber-50 text-amber-500 relative z-10 shadow-sm border border-amber-100">
                      <Star size={28} className="fill-amber-400" />
                    </div>
                    <div className="relative z-10">
                      <h4 className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">
                        Performance Tier
                      </h4>
                      <p className="text-xl font-black text-slate-900 leading-none">
                        Elite Housekeeper
                      </p>
                    </div>
                    <p className="text-[9px] font-bold text-slate-500 max-w-[140px] mx-auto uppercase tracking-widest leading-relaxed relative z-10">
                      Top 5% for accuracy
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <style jsx global>{`
        @keyframes expand-vertical {
          from {
            height: 0;
            opacity: 0;
          }
          to {
            height: auto;
            opacity: 1;
          }
        }
        .animate-expand-vertical {
          animation: expand-vertical 0.5s cubic-bezier(0.16, 1, 0.3, 1);
        }
        @keyframes draw-line {
          from {
            stroke-dasharray: 800;
            stroke-dashoffset: 800;
          }
          to {
            stroke-dasharray: 800;
            stroke-dashoffset: 0;
          }
        }
        .animate-draw-line {
          animation: draw-line 2s ease-out forwards;
        }
      `}</style>
    </div>
  );
}
