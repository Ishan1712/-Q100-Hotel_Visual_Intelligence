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
  "Monarch Grand, Pune",
  "Monarch Palace, Mumbai",
  "Monarch Heritage, Nashik",
  "Monarch Gateway, Aurangabad",
  "Monarch Central, Nagpur",
];

const heatmapData: Record<string, (number | null)[]> = {
  "Monarch Grand, Pune": [92, 88, 95, 90, null],
  "Monarch Palace, Mumbai": [85, 82, 88, 86, 91],
  "Monarch Heritage, Nashik": [78, 75, 80, null, null],
  "Monarch Gateway, Aurangabad": [74, 70, 76, null, null],
  "Monarch Central, Nagpur": [68, 65, 72, null, null],
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
  "Monarch Grand, Pune": {
    Standard: {
      totalRooms: 24,
      issueCount: 1,
      complaints: [{ reason: "Bathroom drain issue", count: 1 }],
      reviews: [
        "Room was spotless and very comfortable for a short business stay.",
        "Good housekeeping overall, though the bathroom drainage was slow.",
      ],
    },
    Executive: {
      totalRooms: 18,
      issueCount: 2,
      complaints: [
        { reason: "AC not cooling enough", count: 1 },
        { reason: "Lighting issue", count: 1 },
      ],
      reviews: [],
    },
    Suite: {
      totalRooms: 8,
      issueCount: 0,
      complaints: [],
      reviews: [],
    },
  },
  "Monarch Palace, Mumbai": {
    Standard: {
      totalRooms: 36,
      issueCount: 3,
      complaints: [{ reason: "Room not clean", count: 2 }],
      reviews: [],
    },
  },
};

const actionItems = [
  {
    hotel: "Monarch Central, Nagpur",
    roomType: "Standard",
    issue: "Consistent AC issues",
    age: "2 days",
    status: "Critical",
  },
  {
    hotel: "Monarch Gateway, Aurangabad",
    roomType: "Executive",
    issue: "Damaged welcome kits",
    age: "1 day",
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
      subtitle="Protocol compliance heatmap across your portfolio"
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
                className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6"
              >
                <div className="flex items-start justify-between mb-8">
                  <div className="flex items-center gap-4">
                     <div className="h-12 w-12 rounded-2xl bg-slate-900 text-white flex items-center justify-center shadow-lg">
                        <Search size={22} />
                     </div>
                     <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Property Analysis</p>
                        <h3 className="text-xl font-black text-slate-900 tracking-tight">
                           {selectedCell.property.split(',')[0]} · {selectedCell.roomType}
                        </h3>
                     </div>
                  </div>
                  <button onClick={() => setSelectedCell(null)} className="p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-400 hover:text-slate-900 hover:bg-white transition-all active:scale-90">
                    <RotateCcw size={18} />
                  </button>
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                   <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                         <StatCard label="Inventory" value={`${selectedDetails?.totalRooms ?? 0}`} suffix="units" />
                         <StatCard label="Failures" value={`${selectedDetails?.issueCount ?? 0}`} suffix="rooms" danger />
                      </div>
                      <div className="rounded-2xl border border-slate-100 bg-slate-50/50 p-5">
                         <h4 className="text-[10px] font-black text-slate-900 uppercase tracking-widest mb-4">Failures by Category</h4>
                         <div className="space-y-2">
                            {selectedDetails?.complaints?.map((c, i) => (
                               <div key={i} className="flex items-center justify-between p-3 bg-white border border-slate-100 rounded-xl shadow-sm">
                                  <span className="text-xs font-bold text-slate-700">{c.reason}</span>
                                  <span className="text-[10px] font-black text-slate-400 bg-slate-50 px-2 py-1 rounded-md">{c.count}</span>
                               </div>
                            ))}
                            {!selectedDetails?.complaints?.length && <p className="text-xs font-bold text-emerald-600 uppercase tracking-widest text-center py-4">No Failures Detected</p>}
                         </div>
                      </div>
                   </div>
                   <div className="space-y-5">
                      <div className="rounded-2xl border border-slate-100 bg-slate-50/50 p-5">
                         <h4 className="text-[10px] font-black text-slate-900 uppercase tracking-widest mb-4">Guest Feedback</h4>
                         <div className="space-y-3">
                            {selectedDetails?.reviews?.map((r, i) => (
                               <div key={i} className="p-4 bg-white border border-slate-100 rounded-xl shadow-sm italic text-xs text-slate-600 leading-relaxed">"{r}"</div>
                            ))}
                            {!selectedDetails?.reviews?.length && <p className="text-xs font-bold text-slate-400 uppercase tracking-widest text-center py-4 opacity-50">No recent reviews</p>}
                         </div>
                      </div>
                      <button className="w-full py-4 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-lg shadow-slate-900/10 hover:bg-slate-800 transition-all active:scale-95">Notify Manager</button>
                   </div>
                </div>
              </motion.div>
            ) : (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white border border-dashed border-slate-200 rounded-2xl p-10 text-center">
                <div className="mx-auto mb-4 h-16 w-16 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-300 shadow-inner">
                  <Info size={28} />
                </div>
                <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight">Granular Intelligence</h3>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-2 max-w-sm mx-auto leading-loose">Select a cell mapping in the matrix above to initiate a deep-dive analysis</p>
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

function StatCard({ label, value, suffix, danger = false }: { label: string; value: string; suffix: string; danger?: boolean }) {
  return (
    <motion.div whileHover={{ y: -4 }} className={`rounded-2xl border p-5 shadow-sm bg-gradient-to-br from-white to-slate-50/50 ${danger ? "border-rose-100" : "border-slate-100"}`}>
      <p className={`text-[10px] font-black uppercase tracking-widest mb-1 ${danger ? "text-rose-500" : "text-slate-400"}`}>{label}</p>
      <p className={`text-2xl font-black tracking-tight ${danger ? "text-rose-700" : "text-slate-900"}`}>
        {value} <span className="text-[10px] font-bold text-slate-400 ml-1 uppercase">{suffix}</span>
      </p>
    </motion.div>
  );
}