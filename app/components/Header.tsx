"use client";

import React from 'react';
import { Search, Bell, User, ChevronDown, Moon } from 'lucide-react';

export default function Header() {
  return (
    <header className="h-20 bg-white border-b border-slate-200 px-8 flex items-center justify-between sticky top-0 z-40">
      {/* Left: Branding */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-blue-600 border border-slate-100 shadow-sm transition-transform hover:scale-105">
           <span className="font-black text-xl">H</span>
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-bold text-slate-900 leading-none">Hotel Yash Palace</span>
          <span className="text-[10px] font-bold text-blue-500 mt-1 uppercase tracking-widest">Premium Estate</span>
        </div>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-6">
        
        {/* Morning Shift Badge */}
        <div className="flex items-center gap-2 px-3 py-1.5 bg-orange-50 border border-orange-100 rounded-full shadow-sm">
          <div className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse" />
          <span className="text-[10px] font-bold text-orange-600 uppercase tracking-widest">Morning Shift</span>
        </div>

        <button className="p-2 rounded-lg hover:bg-slate-50 transition-colors text-slate-500 hover:text-slate-900 group relative">
          <Bell size={20} strokeWidth={2} />
          <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full border-2 border-white" />
        </button>

        <div className="h-8 w-px bg-slate-100 mx-1" />
        
        <div className="flex items-center gap-3 cursor-pointer group">
          <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white shadow-sm overflow-hidden border-2 border-slate-100 transition-transform group-hover:scale-105">
             <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=priya" className="w-full h-full object-cover" alt="User" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-bold text-slate-900 leading-none group-hover:text-blue-600 transition-colors">Priya Tyagi</span>
            <span className="text-[10px] font-semibold text-slate-400 mt-1 uppercase tracking-wider">Housekeeper</span>
          </div>
          <ChevronDown size={14} className="text-slate-400 ml-1" />
        </div>
      </div>
    </header>
  );
}
