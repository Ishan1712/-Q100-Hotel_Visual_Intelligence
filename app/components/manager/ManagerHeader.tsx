"use client";

import React from 'react';
import { Bell, ChevronDown, Menu, Building2 } from 'lucide-react';

interface ManagerHeaderProps {
  onMenuClick: () => void;
}

export default function ManagerHeader({ onMenuClick }: ManagerHeaderProps) {
  return (
    <header className="h-16 md:h-20 bg-white border-b border-slate-200 px-4 md:px-8 flex items-center justify-between sticky top-0 z-40">
      {/* Left: Branding & Mobile Menu */}
      <div className="flex items-center gap-3 md:gap-4">
        <button 
          onClick={onMenuClick}
          className="lg:hidden p-2 -ml-2 text-slate-500 hover:bg-slate-50 rounded-lg transition-colors"
        >
          <Menu size={24} />
        </button>

        <div className="flex items-center gap-2.5 md:gap-3">
          <div className="w-8 h-8 md:w-10 md:h-10 rounded-xl bg-slate-50 flex items-center justify-center text-blue-600 border border-slate-100 shadow-sm transition-transform hover:scale-105 shrink-0">
             <Building2 size={18} className="text-blue-600" />
          </div>
          <div className="flex flex-col">
            <span className="text-xs md:text-sm font-bold text-slate-900 leading-none truncate max-w-[120px] md:max-w-none">Taj Mahal Palace</span>
            <span className="text-[8px] md:text-[10px] font-bold text-blue-500 mt-0.5 md:mt-1 uppercase tracking-widest hidden xs:block">Premium Estate</span>
          </div>
        </div>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-3 md:gap-6">
        
        {/* Manager Badge */}
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-blue-50 border border-blue-100 rounded-full shadow-sm">
          <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
          <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest whitespace-nowrap">Manager</span>
        </div>

        <button className="p-2 rounded-lg hover:bg-slate-50 transition-colors text-slate-500 hover:text-slate-900 group relative">
          <Bell className="w-[18px] h-[18px] md:w-[20px] md:h-[20px]" strokeWidth={2} />
          <span className="absolute top-2 right-2 w-1.5 h-1.5 md:w-2 md:h-2 bg-rose-500 rounded-full border-2 border-white" />
        </button>

        <div className="h-6 md:h-8 w-px bg-slate-100 mx-0.5 md:mx-1" />
        
        <div className="flex items-center gap-2 md:gap-3 cursor-pointer group">
          <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-blue-500 flex items-center justify-center text-white shadow-sm overflow-hidden border-2 border-slate-100 transition-transform group-hover:scale-105 shrink-0">
             <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=arjun" className="w-full h-full object-cover" alt="User" />
          </div>
          <div className="hidden xs:flex flex-col">
            <span className="text-[11px] md:text-sm font-bold text-slate-900 leading-none group-hover:text-blue-600 transition-colors truncate max-w-[60px] md:max-w-none">Arjun Mehta</span>
            <span className="text-[8px] md:text-[10px] font-semibold text-slate-400 mt-0.5 md:mt-1 uppercase tracking-wider">Hotel Manager</span>
          </div>
          <ChevronDown className="w-3 h-3 md:w-3.5 md:h-3.5 text-slate-400 ml-0.5" />
        </div>
      </div>
    </header>
  );
}
