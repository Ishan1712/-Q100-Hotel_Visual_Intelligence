"use client";

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Bell, User, ChevronDown, Moon, Menu, Calendar, TrendingUp, Activity, Shield, X, Star, Sparkles } from 'lucide-react';

export type UserRole = 'housekeeper' | 'manager' | 'owner';

interface NavItem {
  name: string;
  href: string;
  icon: any;
  isCenter?: boolean;
}

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
  const [showRoleSwitcher, setShowRoleSwitcher] = useState(false);
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
    <header className="h-16 md:h-20 bg-white border-b border-slate-200 px-3 md:px-8 flex items-center justify-between sticky top-0 z-40">
      {/* Left Branding (Menu button removed as requested) */}
      <div className="flex items-center gap-2 md:gap-4 font-sans">
        <div className="flex items-center gap-2 md:gap-3.5">
          <div className="w-9 h-9 md:w-11 md:h-11 rounded-[14px] bg-slate-50 flex items-center justify-center text-blue-600 border border-slate-100 shadow-sm shrink-0 transition-transform hover:scale-105">
            <span className="font-black text-xl md:text-2xl">H</span>
          </div>
          <div className="flex flex-col">
            <span className="text-sm md:text-[17px] font-black text-slate-900 leading-none truncate max-w-[120px] xs:max-w-[160px] md:max-w-none tracking-tight">JW Marriott</span>
            <span className="text-[10px] md:text-[12px] font-bold text-slate-900 truncate max-w-[100px] xs:max-w-[140px] md:max-w-none mt-1 tracking-tight">Pune, Maharashtra</span>
          </div>
        </div>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-2 md:gap-6">
        {/* Role Related Date & Stat */}
        <div className="flex items-center gap-2 md:gap-3 lg:mr-2">
          <div className="hidden sm:flex flex-col items-end">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">{currentDate}</span>
            <div className="flex items-center gap-1.5 mt-1">
              <div className={`w-1 h-1 rounded-full ${dotStyles} animate-pulse`} />
              <span className={`text-[9px] font-black uppercase tracking-widest transition-all duration-500`}>
                {currentRole.stat.label}: <span className="text-slate-900">{currentRole.stat.value}</span>
              </span>
            </div>
          </div>

          <div className="h-8 w-px bg-slate-100 mx-1 hidden sm:block" />

          <div className={`px-2.5 py-1.5 md:p-2 rounded-xl border transition-all duration-500 ${colorStyles} flex items-center gap-2`}>
            <StatIcon size={16} strokeWidth={2.5} className="md:w-[18px] md:h-[18px]" />
            <span className="text-[10px] font-bold sm:hidden tracking-tight">{currentRole.stat.value}</span>
          </div>
        </div>

        <div className="h-6 md:h-8 w-px bg-slate-100 mx-0.5 md:mx-1" />

        <button className="p-2 rounded-lg hover:bg-slate-50 transition-colors text-slate-400 hover:text-slate-900 group relative">
          <Bell className="w-[20px] h-[20px]" strokeWidth={2} />
          <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-rose-500 rounded-full border-2 border-white" />
        </button>

        {/* User Account Trigger */}
        <div 
          onClick={() => {
            if (window.innerWidth < 1024) setShowRoleSwitcher(true);
          }}
          className="flex items-center gap-2 md:gap-3 cursor-pointer group"
        >
          <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-slate-50 flex items-center justify-center text-white shadow-inner border-2 border-slate-100 transition-transform group-hover:scale-105 shrink-0 overflow-hidden">
            <img src={currentRole.avatar} className="w-full h-full object-cover grayscale-[0.2] group-hover:grayscale-0 transition-all" alt="User" />
          </div>
          <div className="hidden md:flex flex-col">
            <span className="text-[11px] md:text-sm font-black text-slate-900 leading-none group-hover:text-blue-600 transition-colors truncate max-w-[100px]">{currentRole.name}</span>
            <span className="text-[8px] md:text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-widest">{currentRole.title}</span>
          </div>
        </div>
      </div>

      {/* Mobile Role Switcher Bottom Sheet - Compact UI Style */}
      <AnimatePresence>
        {showRoleSwitcher && (
          <div className="fixed inset-0 z-[100] lg:hidden">
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px]"
              onClick={() => setShowRoleSwitcher(false)}
            />
            
            {/* Bottom Sheet */}
            <motion.div 
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: "spring", damping: 25, stiffness: 350 }}
              className="absolute bottom-0 left-0 right-0 bg-white rounded-t-[2.5rem] p-6 pb-8 shadow-[0_-20px_50px_-12px_rgba(0,0,0,0.15)] border-t border-slate-100"
            >
              <div className="w-12 h-1 bg-slate-200 rounded-full mx-auto mb-6" />
              
              <h3 className="text-lg font-black text-slate-800 text-center mb-6 tracking-tight">Select Account Role</h3>
              
              <div className="flex flex-col gap-2.5">
                {(['housekeeper', 'manager', 'owner'] as UserRole[]).map((r) => (
                  <button
                    key={r}
                    onClick={() => {
                      const paths: Record<UserRole, string> = { housekeeper: '/', manager: '/manager', owner: '/owner' };
                      window.location.href = paths[r];
                      setShowRoleSwitcher(false);
                    }}
                    className={`w-full p-3.5 rounded-xl border flex items-center justify-between transition-all active:scale-[0.98] ${
                      role === r 
                        ? 'border-blue-500 bg-blue-50/10 text-blue-700 shadow-sm' 
                        : 'border-slate-50 bg-slate-50/40 text-slate-600 hover:border-slate-200'
                    }`}
                  >
                    <div className="flex items-center gap-3.5">
                      <div className={`p-2.5 rounded-xl transition-all ${role === r ? 'bg-blue-600 text-white shadow-md' : 'bg-white text-slate-400 border border-slate-100'}`}>
                        {r === 'housekeeper' ? <Activity size={18} /> : r === 'manager' ? <Shield size={18} /> : <TrendingUp size={18} />}
                      </div>
                      <div className="flex flex-col items-start text-left">
                        <span className={`text-[11px] font-black uppercase tracking-widest leading-none ${role === r ? 'text-blue-700' : 'text-slate-700'}`}>{r}</span>
                        <span className="text-[9px] font-bold text-slate-400 mt-1 uppercase tracking-tight">
                          {r === 'housekeeper' ? 'Operations' : r === 'manager' ? 'Management' : 'Portfolio'}
                        </span>
                      </div>
                    </div>
                    {role === r && (
                      <div className="w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center shadow-lg shadow-blue-200">
                        <div className="w-1.5 h-1.5 bg-white rounded-full" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
              
              <button 
                onClick={() => setShowRoleSwitcher(false)}
                className="w-full mt-8 py-2 text-[11px] font-black text-slate-400 uppercase tracking-[0.4em] hover:text-slate-900 transition-colors"
              >
                CANCEL
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </header>
  );
}




