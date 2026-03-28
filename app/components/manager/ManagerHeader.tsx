"use client";

import React from 'react';
import { Search, Bell, User, ChevronDown, AlertTriangle, Clock } from 'lucide-react';

export default function ManagerHeader() {
  return (
    <header className="h-20 bg-white border-b border-slate-100 px-8 flex items-center justify-between sticky top-0 z-40 shadow-sm shadow-slate-200/50">
      {/* Search */}
      <div className="flex-1 max-w-lg hidden md:block">
        <div className="relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={18} />
          <input 
            type="text" 
            placeholder="Search rooms, staff, alerts..." 
            className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-2 pl-12 pr-4 outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500/50 transition-all text-sm font-medium"
          />
        </div>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-6">
        {/* Check-in Countdown */}
        <div className="hidden lg:flex items-center gap-2 px-4 py-2 bg-amber-50 border border-amber-100 rounded-xl">
          <Clock size={16} className="text-amber-600" />
          <span className="text-sm font-bold text-amber-700">2h 14m to check-in</span>
        </div>

        <button className="bg-rose-500 text-white h-11 px-6 rounded-xl flex items-center gap-2 shadow-lg shadow-rose-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all font-bold text-sm uppercase tracking-wider">
           <AlertTriangle size={18} />
           Critical Alerts
        </button>

        <button className="relative p-2.5 rounded-xl hover:bg-slate-50 transition-all group">
          <Bell size={20} className="text-slate-500 group-hover:text-slate-900" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full border-2 border-white" />
        </button>
        
        <div className="h-10 w-[1px] bg-slate-100 mx-1" />
        
        <div className="flex items-center gap-4 cursor-pointer hover:opacity-80 transition-all">
          <div className="flex flex-col items-end">
            <span className="text-sm font-black text-slate-900 leading-none">Arjun Mehta</span>
            <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest mt-1">Hotel Manager</span>
          </div>
          <div className="w-10 h-10 rounded-2xl bg-white border border-slate-200 p-0.5 shadow-md overflow-hidden">
            <div className="w-full h-full rounded-[14px] bg-slate-50 flex items-center justify-center text-slate-400">
              <User size={20} />
            </div>
          </div>
          <ChevronDown size={14} className="text-slate-400" />
        </div>
      </div>
    </header>
  );
}
