"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { 
  Calendar, 
  Download, 
  Share2, 
  Filter,
  ChevronRight,
  Bell,
  Plus,
  Phone,
  FileText,
  AlertTriangle
} from 'lucide-react';

interface OwnerDashboardLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
}

export default function OwnerDashboardLayout({ 
  children, 
  title, 
  subtitle,
  actions 
}: OwnerDashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-[#f8fafc] p-4 lg:p-8 pt-16 md:pt-20 lg:pt-8 text-slate-900">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-6 md:mb-8 gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-blue-600 mb-1">
            <span className="text-[10px] font-bold uppercase tracking-widest">Enterprise Portfolio</span>
            <div className="hidden sm:flex items-center gap-2">
              <ChevronRight size={10} />
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Maharashtra Region</span>
            </div>
          </div>
          <h1 className="text-xl md:text-3xl font-extrabold text-slate-900 tracking-tight leading-none group flex items-center gap-3">
            {title}
            <div className="h-1.5 w-1.5 rounded-full bg-blue-500 animate-pulse mt-1 md:mt-2 shadow-[0_0_8px_#3b82f6]" />
          </h1>
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1 font-bold uppercase tracking-widest text-[10px]">
            {subtitle && (
              <p className="text-slate-500 font-medium normal-case text-sm">{subtitle}</p>
            )}
            <div className="h-3 w-px bg-slate-200 hidden md:block" />
            <p className="text-slate-400 hidden sm:block">Data as of: 1 Apr 2026, 9:42 AM</p>
          </div>
        </div>

        <div className="flex items-center gap-2 md:gap-3">
          <button className="flex items-center gap-2 px-3 md:px-4 py-2 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl text-slate-600 text-[13px] font-bold shadow-sm transition-all active:scale-95">
            <Calendar size={16} className="text-blue-600" />
            <span className="hidden sm:inline">March 2026</span>
          </button>
          
          <div className="h-8 w-px bg-slate-200 mx-0.5 md:mx-1" />

          {actions ? actions : (
            <>
              <button className="p-2.5 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl text-slate-500 transition-all group shadow-sm active:scale-95">
                <Filter size={18} className="group-hover:text-blue-600 transition-colors" />
              </button>
              
              {/* Smart Notifications */}
              <div className="relative group/notif">
                <button className="p-2.5 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl text-slate-500 transition-all group relative shadow-sm active:scale-95">
                  <Bell size={18} className="group-hover:text-amber-500 transition-colors" />
                  <div className="absolute top-2.5 right-2.5 w-2 h-2 bg-rose-500 rounded-full border-2 border-white" />
                </button>
                
                {/* Popover */}
                <div className="absolute right-0 mt-2 w-80 bg-white border border-slate-100 rounded-2xl shadow-2xl opacity-0 translate-y-2 pointer-events-none group-hover/notif:opacity-100 group-hover/notif:translate-y-0 group-hover/notif:pointer-events-auto transition-all duration-300 z-[100] overflow-hidden">
                    <div className="p-4 border-b border-slate-50 bg-slate-50/50">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Smart Business Alerts</p>
                    </div>
                    <div className="divide-y divide-slate-50">
                        <div className="p-4 hover:bg-slate-50 transition-colors cursor-pointer">
                            <p className="text-[11px] font-bold text-slate-900 mb-1">Nagpur reviews dropped to 3.8 ★</p>
                            <p className="text-[10px] text-rose-600 font-medium tracking-tight">5 complaints about cleanliness this week</p>
                        </div>
                        <div className="p-4 hover:bg-slate-50 transition-colors cursor-pointer">
                            <p className="text-[11px] font-bold text-slate-900 mb-1">Pune hit 4.8 ★ record high!</p>
                            <p className="text-[10px] text-emerald-600 font-medium tracking-tight">Revenue spike of 12% projected</p>
                        </div>
                        <div className="p-4 hover:bg-slate-50 transition-colors cursor-pointer text-center">
                            <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest">View All Insights</p>
                        </div>
                    </div>
                </div>
              </div>

              <button className="flex items-center gap-2 px-3 md:px-5 py-2.5 bg-blue-600 hover:bg-blue-700 rounded-xl text-white text-[13px] font-bold shadow-lg shadow-blue-200 transition-all active:scale-95">
                <Download size={16} />
                <span className="hidden sm:inline">Export Report</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* Content Area */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {children}
      </motion.div>

      {/* Floating Action Button (FAB) */}
      <div className="fixed bottom-8 right-8 z-[200]">
        <div className="relative group/fab">
            <button className="w-14 h-14 bg-slate-900 border border-slate-800 text-white rounded-full flex items-center justify-center shadow-2xl hover:scale-110 active:scale-95 transition-all duration-300">
                <Plus size={28} className="group-hover/fab:rotate-45 transition-transform duration-300" />
            </button>
            
            {/* FAB Actions */}
            <div className="absolute bottom-full right-0 mb-4 flex flex-col items-end gap-3 opacity-0 translate-y-4 pointer-events-none group-hover/fab:opacity-100 group-hover/fab:translate-y-0 group-hover/fab:pointer-events-auto transition-all duration-300">
                <button className="flex items-center gap-3 px-4 py-2 bg-white border border-slate-100 rounded-2xl shadow-xl hover:bg-slate-50 transition-all whitespace-nowrap">
                    <span className="text-[11px] font-bold text-slate-700">Call Property Manager</span>
                    <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                        <Phone size={16} />
                    </div>
                </button>
                <button className="flex items-center gap-3 px-4 py-2 bg-white border border-slate-100 rounded-2xl shadow-xl hover:bg-slate-50 transition-all whitespace-nowrap">
                    <span className="text-[11px] font-bold text-slate-700">Generate Report</span>
                    <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                        <FileText size={16} />
                    </div>
                </button>
                <button className="flex items-center gap-3 px-4 py-2 bg-white border border-slate-100 rounded-2xl shadow-xl hover:bg-slate-50 transition-all whitespace-nowrap">
                    <span className="text-[11px] font-bold text-slate-700">Flag for Review</span>
                    <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
                        <AlertTriangle size={16} />
                    </div>
                </button>
            </div>
        </div>
      </div>

      {/* Footer Branding */}
      <div className="mt-12 pt-8 border-t border-slate-200 flex flex-col md:flex-row items-center justify-between gap-4 pb-12 md:pb-8">
        <div className="flex items-center gap-2 scale-90 md:scale-100 opacity-60">
          <div className="w-6 h-6 bg-blue-600 rounded flex items-center justify-center border border-blue-500 shadow-sm">
            <span className="text-white text-[10px] font-black">Q</span>
          </div>
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em]">Q100.AI Portfolio Intelligence v2.4</span>
        </div>
        <div className="text-[10px] text-slate-300 font-bold uppercase tracking-widest">
          Monarch Hospitality Group © 2026
        </div>
      </div>
    </div>
  );
}
