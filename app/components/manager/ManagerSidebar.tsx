"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LogOut, 
  ChevronLeft, 
  ChevronRight,
  LayoutDashboard,
  Users,
  FileBarChart,
  Images,
  Map,
  ScanSearch,
  Menu,
  X
} from 'lucide-react';

const menuItems = [
  { name: "Dashboard", href: "/manager", icon: LayoutDashboard },
  { name: "Master Gallery", href: "/manager/gallery", icon: Images },
  { name: "Live Floor Map", href: "/manager/floormap", icon: Map },
  { name: "AI Inspection Detail", href: "/manager/inspection", icon: ScanSearch },
  { name: "Staff Performance", href: "/manager/performance", icon: Users },
  { name: "Daily Report", href: "/manager/report", icon: FileBarChart },
];

interface ManagerSidebarProps {
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
  isMobileOpen: boolean;
  setIsMobileOpen: (open: boolean) => void;
}

export default function ManagerSidebar({ collapsed, setCollapsed, isMobileOpen, setIsMobileOpen }: ManagerSidebarProps) {
  const [hovered, setHovered] = useState<string | null>(null);
  const pathname = usePathname();

  return (
    <>
      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[45] lg:hidden animate-fade-in"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      <aside 
        className={`fixed top-0 left-0 h-screen bg-[#0b1220] text-slate-300 transition-all duration-300 ease-in-out z-50 flex flex-col 
          ${collapsed ? 'w-20' : 'w-64'} 
          ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        {/* Sidebar Header */}
        <div className={`flex flex-col items-center py-6 border-b border-white/5 transition-all duration-300 ${collapsed ? 'px-0' : 'px-6'}`}>
          <div className={`flex items-center w-full ${collapsed ? 'flex-col gap-1' : 'justify-between'}`}>
            <div className="flex flex-col">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 flex items-center justify-center shrink-0 overflow-hidden">
                   <img src="/auglelogo.png" alt="Augle Logo" className="w-full h-full object-contain" />
                </div>
                {(!collapsed || isMobileOpen) && (
                  <span className="font-bold text-xl tracking-tight text-white flex items-baseline leading-none">
                    Q100<span className="text-blue-400 font-medium lowercase">.ai</span>
                  </span>
                )}
              </div>
              {(!collapsed || isMobileOpen) && (
                <span className="text-[8px] font-bold text-blue-500/80 uppercase tracking-[0.2em] leading-none mt-2">
                  Hotel Visual Intelligence
                </span>
              )}
            </div>
            
            <button 
              onClick={() => isMobileOpen ? setIsMobileOpen(false) : setCollapsed(!collapsed)}
              className={`text-slate-500 hover:text-white transition-colors p-2 rounded-lg hover:bg-white/5`}
            >
              {isMobileOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-6 px-3 space-y-1 overflow-y-auto no-scrollbar">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsMobileOpen(false)}
                onMouseEnter={() => setHovered(item.name)}
                onMouseLeave={() => setHovered(null)}
                className={`flex items-center gap-3.5 px-4 py-3 rounded-xl transition-all duration-200 group ${
                  isActive 
                    ? 'bg-[#1e293b] text-white' 
                    : 'text-slate-400 hover:bg-white/5 hover:text-white'
                } ${collapsed && !isMobileOpen ? 'justify-center px-0 mx-auto w-12 h-12' : ''}`}
              >
                <div className={`flex items-center justify-center transition-all ${isActive ? 'text-blue-400' : 'group-hover:text-white'}`}>
                  <Icon size={18} strokeWidth={isActive ? 2.5 : 2} />
                </div>
                {(!collapsed || isMobileOpen) && <span className={`font-bold text-[13px] tracking-wide ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-white'}`}>{item.name}</span>}
                {isActive && (!collapsed || isMobileOpen) && (
                  <div className="ml-auto w-1 h-4 bg-blue-600 rounded-full shadow-[0_0_8px_rgba(37,99,235,0.6)]" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-3 border-t border-white/5 space-y-2">
          <Link 
            href="/logout"
            onClick={() => setIsMobileOpen(false)}
            className={`flex items-center gap-3.5 w-full px-4 py-3 rounded-xl text-slate-400 hover:bg-[#1e293b] transition-all ${collapsed && !isMobileOpen ? 'justify-center px-0 mx-auto w-12 h-12' : ''}`}
          >
            <div className="flex items-center justify-center">
              <LogOut size={18} className="text-rose-500" />
            </div>
            {(!collapsed || isMobileOpen) && <span className="font-bold text-[13px] tracking-wide">Logout</span>}
          </Link>
          <div className="pt-2 text-center opacity-30">
             {(!collapsed || isMobileOpen) && <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-slate-500">© 2025 Q100.AI</span>}
          </div>
        </div>
      </aside>
    </>
  );
}
