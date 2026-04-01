"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { 
  Calendar, 
  Download, 
  Share2, 
  Filter,
  ChevronRight,
  Bell
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
    <div className="min-h-screen bg-[#f8fafc] p-4 lg:p-8 pt-20 lg:pt-8 text-slate-900">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-blue-600 mb-1">
            <span className="text-[10px] font-bold uppercase tracking-widest">Enterprise Portfolio</span>
            <ChevronRight size={10} />
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Maharashtra Region</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight leading-none group flex items-center gap-3">
            {title}
            <div className="h-1.5 w-1.5 rounded-full bg-blue-500 animate-pulse mt-2 shadow-[0_0_8px_#3b82f6]" />
          </h1>
          {subtitle && (
            <p className="text-slate-500 text-sm font-medium">{subtitle}</p>
          )}
        </div>

        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl text-slate-600 text-[13px] font-bold shadow-sm transition-all">
            <Calendar size={16} className="text-blue-600" />
            <span>March 2026</span>
          </button>
          
          <div className="h-8 w-px bg-slate-200 mx-1" />

          {actions ? actions : (
            <>
              <button className="p-2.5 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl text-slate-500 transition-all group shadow-sm">
                <Filter size={18} className="group-hover:text-blue-600 transition-colors" />
              </button>
              <button className="p-2.5 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl text-slate-500 transition-all group relative shadow-sm">
                <Bell size={18} className="group-hover:text-amber-500 transition-colors" />
                <div className="absolute top-2.5 right-2.5 w-2 h-2 bg-rose-500 rounded-full border-2 border-white" />
              </button>
              <button className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 rounded-xl text-white text-[13px] font-bold shadow-lg shadow-blue-200 transition-all active:scale-95">
                <Download size={16} />
                <span>Export Report</span>
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

      {/* Footer Branding */}
      <div className="mt-12 pt-8 border-t border-slate-200 flex flex-col md:flex-row items-center justify-between gap-4">
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
