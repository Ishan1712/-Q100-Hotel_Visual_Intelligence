"use client";

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { Search, Bell, User, ChevronDown, Moon, Menu, Calendar, TrendingUp, Activity, Shield } from 'lucide-react';

export type UserRole = 'housekeeper' | 'manager' | 'owner';

interface HeaderProps {
  onMenuClick: () => void;
}

const roleData = {
  housekeeper: {
    name: 'Priya Tyagi',
    title: 'Housekeeping Team',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=priya',
    stat: {
      label: 'Morning Shift',
      value: 'Floor 4',
      icon: Activity,
      color: 'orange'
    }
  },
  manager: {
    name: 'Sameer Khan',
    title: 'Property Manager',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sameer',
    stat: {
      label: 'Occupancy',
      value: '84%',
      icon: Shield,
      color: 'emerald'
    }
  },
  owner: {
    name: 'Arjun Mehra',
    title: 'JW Portfolio Owner',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=arjun',
    stat: {
      label: 'Portfolio Yield',
      value: '+18.4%',
      icon: TrendingUp,
      color: 'blue'
    }
  }
};

export default function Header({ onMenuClick }: HeaderProps) {
  const [currentDate, setCurrentDate] = useState("");
  const pathname = usePathname();

  useEffect(() => {
    // Using the date format requested by the user/shown in dashboards
    const d = new Date();
    const options: Intl.DateTimeFormatOptions = { weekday: 'long', day: 'numeric', month: 'long' };
    setCurrentDate(d.toLocaleDateString('en-US', options));
  }, []);

  const getRole = (): UserRole => {
    if (pathname.startsWith('/owner')) return 'owner';
    if (pathname.startsWith('/manager')) return 'manager';
    return 'housekeeper';
  };

  const role = getRole();
  const currentRole = roleData[role];
  const StatIcon = currentRole.stat.icon;

  const colorStyles = {
    orange: "bg-orange-50 border-orange-100 text-orange-600",
    emerald: "bg-emerald-50 border-emerald-100 text-emerald-600",
    blue: "bg-blue-50 border-blue-100 text-blue-600"
  }[currentRole.stat.color];

  const dotStyles = {
    orange: "bg-orange-500",
    emerald: "bg-emerald-500",
    blue: "bg-blue-500"
  }[currentRole.stat.color];

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

        <div className="flex items-center gap-2.5 md:gap-3.5">
          <div className="w-9 h-9 md:w-12 md:h-12 rounded-xl bg-slate-900 flex items-center justify-center text-white border border-slate-800 shadow-2xl shadow-slate-900/20 shrink-0 transition-transform hover:scale-105">
            <span className="font-black text-xl md:text-2xl">H</span>
          </div>
          <div className="flex flex-col">
            <span className="text-sm md:text-lg font-black text-slate-900 leading-none truncate max-w-[140px] md:max-w-none tracking-tight">JW Marriott</span>
            <span className="text-[10px] md:text-[11px] font-extrabold text-slate-400 truncate max-w-[120px] md:max-w-none mt-1.5 uppercase tracking-widest opacity-80">Hospitality Group</span>
          </div>
        </div>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-3 md:gap-6">
        {/* Role Related Date & Stat */}
        <div className="hidden sm:flex items-center gap-3">
           <div className="flex flex-col items-end">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{currentDate}</span>
              <div className="flex items-center gap-1.5 mt-0.5">
                 <div className={`w-1 h-1 rounded-full ${dotStyles} animate-pulse`} />
                 <span className={`text-[9px] font-black uppercase tracking-widest transition-all duration-500`}>
                    {currentRole.stat.label}: <span className="text-slate-900">{currentRole.stat.value}</span>
                 </span>
              </div>
           </div>
           
           <div className="h-8 w-px bg-slate-100 mx-1" />

           <div className={`p-2 rounded-xl border transition-all duration-500 ${colorStyles}`}>
              <StatIcon size={18} strokeWidth={2.5} />
           </div>
        </div>

        <div className="h-6 md:h-8 w-px bg-slate-100 mx-0.5 md:mx-1 hidden xs:block" />

        <button className="p-2 rounded-lg hover:bg-slate-50 transition-colors text-slate-400 hover:text-slate-900 group relative">
          <Bell className="w-[20px] h-[20px]" strokeWidth={2.5} />
          <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-rose-500 rounded-full border-2 border-white" />
        </button>

        <div className="flex items-center gap-2 md:gap-3 cursor-pointer group">
          <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-slate-50 flex items-center justify-center text-white shadow-inner border-2 border-slate-100 transition-transform group-hover:scale-105 shrink-0 overflow-hidden">
            <img src={currentRole.avatar} className="w-full h-full object-cover grayscale-[0.2] group-hover:grayscale-0 transition-all" alt="User" />
          </div>
          <div className="hidden md:flex flex-col">
            <span className="text-[11px] md:text-sm font-black text-slate-900 leading-none group-hover:text-blue-600 transition-colors truncate max-w-[100px]">{currentRole.name}</span>
            <span className="text-[8px] md:text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-widest">{currentRole.title}</span>
          </div>
          <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden xs:block" />
        </div>
      </div>
    </header>
  );
}




