"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { 
  ChevronRight,
  Plus,
  Phone,
  FileText,
  AlertTriangle
} from 'lucide-react';

interface OwnerDashboardLayoutProps {
  children: React.ReactNode;
  title: string;
}

export default function OwnerDashboardLayout({ 
  children, 
  title
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
          JW Marriott Hospitality Group © 2026
        </div>
      </div>
    </div>
  );
}
