"use client";

import React, { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  AlertTriangle,
  CheckCircle2,
  Bell,
  Info,
  RotateCcw,
  MessageSquare,
  Search,
} from "lucide-react";
import OwnerDashboardLayout from "@/app/components/OwnerDashboardLayout";

const roomTypes = ["Standard", "Executive", "Suite", "VIP Suite", "Penthouse"];

const properties = [
  "JW Marriott Grand, Pune",
  "JW Marriott Palace, Mumbai",
  "JW Marriott Heritage, Nashik",
  "JW Marriott Gateway, Aurangabad",
  "JW Marriott Central, Nagpur",
];

const heatmapData: Record<string, number[]> = {
  "JW Marriott Grand, Pune": [92, 88, 95, 90, 94],
  "JW Marriott Palace, Mumbai": [85, 82, 88, 86, 91],
  "JW Marriott Heritage, Nashik": [78, 75, 80, 82, 85],
  "JW Marriott Gateway, Aurangabad": [74, 70, 76, 78, 80],
  "JW Marriott Central, Nagpur": [68, 65, 72, 74, 76],
};

const drilldownData: Record<
  string,
  Record<
    string,
    {
      totalRooms: number;
      issueCount: number;
      complaints: { reason: string; count: number }[];
      reviews: string[];
    }
  >
> = {
  "JW Marriott Grand, Pune": {
    Standard: {
      totalRooms: 24,
      issueCount: 1,
      complaints: [{ reason: "Slow bathroom drainage", count: 1 }],
      reviews: ["Clean and comfortable.", "Slightly dated but very clean."],
    },
    Executive: {
      totalRooms: 18,
      issueCount: 2,
      complaints: [{ reason: "AC cooling inconsistent", count: 2 }],
      reviews: ["Great view, but AC was loud.", "Perfect stay for business."],
    },
    Suite: {
      totalRooms: 8,
      issueCount: 0,
      complaints: [],
      reviews: ["Absolutely stunning room.", "Best suite in the city."],
    },
    "VIP Suite": {
      totalRooms: 4,
      issueCount: 0,
      complaints: [],
      reviews: ["Exceptional service.", "True luxury experience."],
    },
    Penthouse: {
      totalRooms: 2,
      issueCount: 0,
      complaints: [],
      reviews: ["Breathtaking views.", "Unmatched quality standards."],
    },
  },
  "JW Marriott Palace, Mumbai": {
    Standard: {
      totalRooms: 36,
      issueCount: 3,
      complaints: [{ reason: "Inconsistent linen quality", count: 3 }],
      reviews: ["Busy hotel but clean.", "Room service was slow."],
    },
    Executive: {
      totalRooms: 22,
      issueCount: 1,
      complaints: [{ reason: "Wifi signal weak", count: 1 }],
      reviews: ["Good executive lounge.", "Comfortable bedding."],
    },
    Suite: {
      totalRooms: 12,
      issueCount: 0,
      complaints: [],
      reviews: ["Very spacious and clean.", "Elegant design."],
    },
    "VIP Suite": {
      totalRooms: 6,
      issueCount: 1,
      complaints: [{ reason: "Minibar restock delay", count: 1 }],
      reviews: ["Prestige service.", "A bit noisy near the lifts."],
    },
    Penthouse: {
      totalRooms: 2,
      issueCount: 0,
      complaints: [],
      reviews: ["Top tier luxury.", "Private pool was spotless."],
    },
  },
  "JW Marriott Heritage, Nashik": {
    Standard: {
      totalRooms: 20,
      issueCount: 4,
      complaints: [{ reason: "Carpet stains", count: 2 }],
      reviews: ["Nice garden view.", "Room needs fresh paint."],
    },
    Executive: {
      totalRooms: 15,
      issueCount: 2,
      complaints: [{ reason: "Balcony door lock", count: 1 }],
      reviews: ["Good amenities.", "Staff were very helpful."],
    },
    Suite: {
      totalRooms: 6,
      issueCount: 1,
      complaints: [{ reason: "Tapestry wear", count: 1 }],
      reviews: ["Large living area.", "Beautiful furniture."],
    },
    "VIP Suite": {
      totalRooms: 2,
      issueCount: 0,
      complaints: [],
      reviews: ["Quiet and peaceful.", "Great heritage feel."],
    },
    Penthouse: {
      totalRooms: 1,
      issueCount: 0,
      complaints: [],
      reviews: ["Exclusive and grand.", "Perfect heritage preservation."],
    },
  },
  "JW Marriott Gateway, Aurangabad": {
    Standard: {
      totalRooms: 28,
      issueCount: 5,
      complaints: [{ reason: "Dust on headboard", count: 3 }],
      reviews: ["Good location.", "Housekeeping could be better."],
    },
    Executive: {
      totalRooms: 12,
      issueCount: 2,
      complaints: [{ reason: "Noisy corridor", count: 2 }],
      reviews: ["Business ready.", "Adequate lighting."],
    },
    Suite: {
      totalRooms: 4,
      issueCount: 1,
      complaints: [{ reason: "Upholstery cleaning", count: 1 }],
      reviews: ["Impressive suites.", "Modern touch."],
    },
    "VIP Suite": {
      totalRooms: 2,
      issueCount: 0,
      complaints: [],
      reviews: ["Great for VIPs.", "Private check-in was smooth."],
    },
    Penthouse: {
      totalRooms: 1,
      issueCount: 0,
      complaints: [],
      reviews: ["Superb luxury.", "Detail oriented."],
    },
  },
  "JW Marriott Central, Nagpur": {
    Standard: {
      totalRooms: 30,
      issueCount: 8,
      complaints: [{ reason: "Old AC rattling", count: 5 }],
      reviews: ["Central location.", "Old rooms need upgrade.", "Functional but tired."],
    },
    Executive: {
      totalRooms: 10,
      issueCount: 3,
      complaints: [{ reason: "Damp smell in bathroom", count: 3 }],
      reviews: ["Practical for work.", "Okay stay but not great."],
    },
    Suite: {
      totalRooms: 4,
      issueCount: 2,
      complaints: [{ reason: "Curtain hooks missing", count: 2 }],
      reviews: ["Large rooms.", "Needs better lighting."],
    },
    "VIP Suite": {
      totalRooms: 2,
      issueCount: 1,
      complaints: [{ reason: "Mirror tarnishing", count: 1 }],
      reviews: ["Good space.", "Premium feel is fading."],
    },
    Penthouse: {
      totalRooms: 1,
      issueCount: 0,
      complaints: [],
      reviews: ["Surprising luxury.", "Well maintained compared to standard rooms."],
    },
  },
};

const actionItems = [
  {
    hotel: "JW Marriott Central, Nagpur",
    roomType: "Standard",
    issue: "Consistent AC issues",
    age: "2 days",
    status: "Critical",
  },
  {
    hotel: "JW Marriott Gateway, Aurangabad",
    roomType: "Executive",
    issue: "Damaged welcome kits",
    age: "1 day",
    status: "Warning",
  },
  {
    hotel: "JW Marriott Heritage, Nashik",
    roomType: "Suite",
    issue: "Tapestry wear detected",
    age: "3 days",
    status: "Warning",
  },
  {
    hotel: "JW Marriott Palace, Mumbai",
    roomType: "Standard",
    issue: "Linen quality audit failed",
    age: "5 hours",
    status: "Critical",
  },
  {
    hotel: "JW Marriott Grand, Pune",
    roomType: "Executive",
    issue: "AC unit loud noise report",
    age: "8 hours",
    status: "Warning",
  },
];

const getCellColor = (val: number | null) => {
  if (val === null) return "bg-slate-50 text-slate-300 border-slate-100";
  if (val >= 85) return "bg-emerald-500 text-white border-emerald-500 shadow-emerald-500/10";
  if (val >= 70) return "bg-amber-50 text-amber-700 border-amber-200 shadow-amber-500/5";
  return "bg-rose-50 text-rose-700 border-rose-100 shadow-rose-500/5";
};

export default function RoomQualityOverview() {
  const [selectedCell, setSelectedCell] = useState<{
    property: string;
    roomType: string;
    score: number;
  } | null>(null);

  const selectedDetails = useMemo(() => {
    if (!selectedCell) return null;
    return drilldownData[selectedCell.property]?.[selectedCell.roomType] ?? null;
  }, [selectedCell]);

  return (
    <OwnerDashboardLayout
      title="Brand Standards"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        <div className="lg:col-span-8 space-y-5">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6"
          >
            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between mb-8">
              <div>
                <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight">
                  Compliance Matrix
                </h3>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                  Quality scores by room type
                </p>
              </div>

              <div className="flex items-center gap-4 px-4 py-2 bg-slate-50 border border-slate-100 rounded-xl shadow-inner">
                <LegendDot label="85%+" dotClass="bg-emerald-500" />
                <LegendDot label="70%+" dotClass="bg-amber-500" />
                <LegendDot label="<70%" dotClass="bg-rose-500" />
              </div>
            </div>

            <div className="overflow-x-auto">
              <div className="min-w-[720px]">
                <div className="grid grid-cols-6 gap-3 pb-4 mb-4 border-b border-slate-100">
                  <div />
                  {roomTypes.map((type) => (
                    <div key={type} className="text-center text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      {type}
                    </div>
                  ))}
                </div>

                <div className="space-y-3">
                  {properties.map((prop, pIdx) => {
                    const [hotel, city] = prop.split(",");
                    return (
                      <div key={prop} className="grid grid-cols-6 gap-3 items-center">
                        <div className="pr-4">
                          <p className="text-sm font-bold text-slate-900 leading-tight">{hotel}</p>
                          <p className="text-[10px] font-medium text-slate-400 uppercase tracking-wider mt-0.5">{city?.trim()}</p>
                        </div>

                        {heatmapData[prop].map((val, idx) => (
                          <motion.button
                            key={`${prop}-${roomTypes[idx]}`}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: (pIdx * 0.05) + (idx * 0.03) }}
                            whileHover={val !== null ? { scale: 1.1, zIndex: 10, boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.1)" } : {}}
                            whileTap={val !== null ? { scale: 0.95 } : {}}
                            onClick={() => val !== null && setSelectedCell({ property: prop, roomType: roomTypes[idx], score: val })}
                            className={[
                              "h-14 rounded-2xl border text-sm font-black transition-all flex items-center justify-center relative",
                              val === null ? "opacity-20 cursor-default" : "cursor-pointer shadow-sm",
                              getCellColor(val),
                            ].join(" ")}
                          >
                            {val !== null ? `${val}%` : "—"}
                            {selectedCell?.property === prop && selectedCell?.roomType === roomTypes[idx] && (
                                <motion.div layoutId="cell-highlight" className="absolute inset-0 border-2 border-slate-900 rounded-2xl pointer-events-none" />
                            )}
                          </motion.button>
                        ))}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </motion.div>

          <AnimatePresence mode="wait">
            {selectedCell ? (
              <motion.div
                key="details"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 15 }}
                className="bg-white border border-slate-200 rounded-2xl shadow-xl p-7"
              >
                <div className="flex items-start justify-between mb-8">
                  <div className="flex items-center gap-4">
                     <div className="h-14 w-14 rounded-2xl bg-slate-950 text-white flex items-center justify-center shadow-2xl shadow-slate-900/20">
                        <Search size={24} />
                     </div>
                     <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Property Analysis</p>
                        <h3 className="text-2xl font-black text-slate-900 tracking-tight">
                           {selectedCell.property.split(',')[0]} <span className="mx-2 text-slate-300">·</span> <span className="text-slate-800">{selectedCell.roomType}</span>
                        </h3>
                     </div>
                  </div>
                  <button 
                    onClick={() => setSelectedCell(null)} 
                    className="p-3 rounded-2xl border border-slate-100 bg-slate-50 text-slate-400 hover:text-slate-900 hover:bg-white transition-all active:scale-90 shadow-sm"
                  >
                    <RotateCcw size={20} />
                  </button>
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                   <div className="space-y-6">
                      <div className="grid grid-cols-2 gap-5">
                         <StatCard label="Inventory" value={`${selectedDetails?.totalRooms ?? 0}`} suffix="rooms" color="slate" />
                         <StatCard label="Failures" value={`${selectedDetails?.issueCount ?? 0}`} suffix="rooms" color="rose" />
                      </div>
                      <div className="rounded-[2rem] border border-slate-100 bg-slate-50/30 p-6">
                         <h4 className="text-[10px] font-black text-slate-900 uppercase tracking-[0.2em] mb-5">Failures by Category</h4>
                         <div className="space-y-2.5">
                            {selectedDetails?.complaints?.map((c, i) => (
                               <div key={i} className="flex items-center justify-between p-4 bg-white border border-slate-100 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                                  <span className="text-sm font-bold text-slate-700">{c.reason}</span>
                                  <span className="text-[11px] font-black text-slate-400 bg-slate-50 px-3 py-1 rounded-lg border border-slate-100">{c.count}</span>
                               </div>
                            ))}
                            {!selectedDetails?.complaints?.length && <p className="text-xs font-bold text-emerald-600 uppercase tracking-widest text-center py-6">All Standards Maintained</p>}
                         </div>
                      </div>
                   </div>
                   <div className="space-y-6">
                      <div className="rounded-[2rem] border border-slate-100 bg-slate-50/30 p-6">
                         <h4 className="text-[10px] font-black text-slate-900 uppercase tracking-[0.2em] mb-5">Guest Feedback</h4>
                         <div className="space-y-4">
                            {selectedDetails?.reviews?.map((r, i) => (
                               <div key={i} className="p-5 bg-white border border-slate-100 rounded-2xl shadow-sm italic text-sm text-slate-600 leading-relaxed relative group">
                                  <div className="absolute -left-2 top-1/2 -translate-y-1/2 w-1 h-8 bg-slate-100 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                                  "{r}"
                               </div>
                            ))}
                            {!selectedDetails?.reviews?.length && <p className="text-xs font-bold text-slate-400 uppercase tracking-widest text-center py-6 opacity-50">No data for selection</p>}
                         </div>
                      </div>
                      <button className="w-full py-5 bg-slate-950 text-white rounded-3xl text-[11px] font-black uppercase tracking-[0.3em] shadow-xl shadow-slate-900/10 hover:bg-slate-900 hover:shadow-2xl transition-all active:scale-[0.98]">
                        Notify Manager
                      </button>
                   </div>
                </div>
              </motion.div>
            ) : (
              <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                className="bg-white border border-slate-100 rounded-[2.5rem] p-16 text-center shadow-inner relative overflow-hidden group"
              >
                <div className="absolute inset-0 bg-gradient-to-b from-slate-50/0 via-slate-50/0 to-slate-50/40 pointer-events-none" />
                <div className="relative z-10">
                  <div className="mx-auto mb-6 h-20 w-20 rounded-[2rem] bg-white border border-slate-100 flex items-center justify-center text-slate-200 shadow-xl group-hover:scale-110 transition-transform duration-500">
                    <Info size={36} strokeWidth={1} />
                  </div>
                  <h3 className="text-2xl font-black text-slate-950 uppercase tracking-tight">Granular Intelligence</h3>
                  <p className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em] mt-4 max-w-sm mx-auto leading-relaxed opacity-70">
                    Select a cell mapping in the matrix above to initiate a deep-dive analysis
                  </p>
                  <div className="mt-10 flex justify-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-slate-200" />
                    <div className="w-1.5 h-1.5 rounded-full bg-slate-100" />
                    <div className="w-1.5 h-1.5 rounded-full bg-slate-50" />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="lg:col-span-4">
          <motion.div whileHover={{ y: -4 }} className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 h-full">
            <div className="flex items-start justify-between mb-6">
              <div>
                <div className="flex items-center gap-2 text-rose-500 mb-1">
                  <Bell size={14} className="animate-bounce" />
                  <span className="text-[10px] font-black uppercase tracking-widest">Compliance Alerts</span>
                </div>
                <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight">Priority Interventions</h3>
              </div>
              <span className="rounded-full bg-rose-500 text-white px-2.5 py-1 text-[9px] font-black uppercase tracking-widest shadow-md">
                {actionItems.length} ACTIVE
              </span>
            </div>

            <div className="space-y-4">
              {actionItems.map((item, idx) => (
                <motion.div key={idx} whileHover={{ x: 4 }} className="rounded-2xl border border-slate-100 p-5 bg-gradient-to-br from-white to-slate-50 shadow-sm relative overflow-hidden group">
                   <div className={`absolute left-0 top-0 w-1.5 h-full ${item.status === 'Critical' ? 'bg-rose-500' : 'bg-amber-500'}`} />
                   <div className="flex justify-between items-center mb-3">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{item.age} OLD</span>
                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest border ${item.status === 'Critical' ? 'bg-rose-50 border-rose-100 text-rose-600' : 'bg-amber-50 border-amber-100 text-amber-600'}`}>{item.status}</span>
                   </div>
                   <p className="text-sm font-black text-slate-900 group-hover:text-rose-600 transition-colors uppercase tracking-tight">{item.hotel.split(',')[0]}</p>
                   <p className="text-xs font-bold text-slate-600 mt-1 uppercase tracking-wider">{item.roomType} · {item.issue}</p>
                   <button className="mt-4 w-full py-2.5 bg-white border border-slate-200 rounded-xl text-[9px] font-black uppercase tracking-widest text-slate-900 hover:bg-slate-900 hover:text-white transition-all active:scale-95 shadow-sm">Assign Intervention</button>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </OwnerDashboardLayout>
  );
}

function LegendDot({ label, dotClass }: { label: string; dotClass: string }) {
  return (
    <div className="flex items-center gap-2">
      <div className={`h-2.5 w-2.5 rounded-full ${dotClass} shadow-sm`} />
      <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{label}</span>
    </div>
  );
}

function StatCard({ label, value, suffix, color = "slate" }: { label: string; value: string; suffix: string; color?: "slate" | "rose" }) {
  const styles = {
    slate: {
      border: "border-slate-100",
      bg: "from-white to-slate-50/50",
      label: "text-slate-400",
      value: "text-slate-900",
      line: "bg-slate-100"
    },
    rose: {
      border: "border-rose-100",
      bg: "from-white to-rose-50/30",
      label: "text-rose-500",
      value: "text-rose-700",
      line: "bg-rose-100"
    }
  };

  const theme = styles[color];

  return (
    <motion.div 
      whileHover={{ y: -5, boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.05)" }} 
      className={`rounded-2xl border p-6 transition-all bg-gradient-to-br ${theme.border} ${theme.bg}`}
    >
      <p className={`text-[10px] font-black uppercase tracking-[0.2em] mb-4 ${theme.label}`}>{label}</p>
      <div className="flex items-baseline gap-2">
        <p className={`text-4xl font-black tracking-tighter ${theme.value}`}>
          {value}
        </p>
        <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest">{suffix}</span>
      </div>
      <div className={`mt-4 h-1 w-8 rounded-full ${theme.line}`} />
    </motion.div>
  );
}
