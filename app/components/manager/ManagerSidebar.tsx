"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  LogOut, 
  ChevronLeft, 
  ChevronRight,
  Users,
  FileBarChart,
  Images,
  Map,
  ScanSearch,
  Zap
} from 'lucide-react';

const menuItems = [
  { name: "Morning Readiness", href: "/manager", icon: LayoutDashboard },
  { name: "AI Inspection Detail", href: "/manager/inspection", icon: ScanSearch },
  { name: "Staff Performance", href: "/manager/performance", icon: Users },
  { name: "Daily Report", href: "/manager/report", icon: FileBarChart },
  { name: "Master Gallery", href: "/manager/gallery", icon: Images },
  { name: "Live Floor Map", href: "/manager/floormap", icon: Map },
];

export default function ManagerSidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();

  return (
    <aside 
      className={`fixed top-0 left-0 h-screen bg-gradient-to-b from-[#0b1220] to-[#1a2335] text-slate-100 border-r border-slate-800 shadow-2xl flex flex-col transition-all duration-300 ease-in-out z-50 ${collapsed ? 'w-20' : 'w-64'}`}
    >
      {/* Sidebar Header */}
      <div className={`p-6 flex items-center justify-between border-b border-slate-800/50 ${collapsed ? 'justify-center px-0' : ''}`}>
        {!collapsed && (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
              <Zap size={18} className="text-white fill-white" />
            </div>
            <span className="font-black text-xl tracking-tighter text-white">
              Q100<span className="text-blue-400">.AI</span>
            </span>
          </div>
        )}
        {collapsed && (
          <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
            <Zap size={22} className="text-white fill-white" />
          </div>
        )}
      </div>

      {/* Role Badge */}
      {!collapsed && (
        <div className="px-6 py-4">
          <span className="px-3 py-1.5 bg-blue-500/10 text-blue-400 rounded-lg text-[10px] font-black uppercase tracking-widest border border-blue-500/20">
            Manager Dashboard
          </span>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto no-scrollbar">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-all group ${
                isActive 
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' 
                  : 'text-slate-400 hover:bg-slate-800/50 hover:text-white'
              } ${collapsed ? 'justify-center px-0 mx-2' : ''}`}
            >
              <Icon size={20} className={`${isActive ? 'text-white' : 'group-hover:text-blue-400'}`} />
              {!collapsed && <span className="font-semibold text-sm">{item.name}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Sidebar Footer */}
      <div className="p-4 border-t border-slate-800/50 space-y-2">
        <Link
          href="/"
          className={`flex items-center gap-4 w-full px-4 py-3 rounded-xl text-slate-400 hover:bg-slate-800/50 hover:text-white transition-all ${collapsed ? 'justify-center px-0' : ''}`}
        >
          <LayoutDashboard size={20} />
          {!collapsed && <span className="font-semibold text-sm">User App</span>}
        </Link>
        <button 
          onClick={() => setCollapsed(!collapsed)}
          className={`flex items-center gap-4 w-full px-4 py-3 rounded-xl text-slate-400 hover:bg-slate-800/50 hover:text-white transition-all ${collapsed ? 'justify-center px-0' : ''}`}
        >
          {collapsed ? <ChevronRight size={20} /> : (
            <>
              <ChevronLeft size={20} />
              <span className="font-semibold text-sm">Collapse</span>
            </>
          )}
        </button>
        <button className={`flex items-center gap-4 w-full px-4 py-3 rounded-xl text-rose-400 hover:bg-rose-500/10 transition-all ${collapsed ? 'justify-center px-0' : ''}`}>
          <LogOut size={20} />
          {!collapsed && <span className="font-semibold text-sm">Logout</span>}
        </button>
      </div>
    </aside>
  );
}
