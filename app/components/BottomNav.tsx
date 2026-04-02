"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Sparkles,
  Clock,
  Scan,
  Bell,
  Trophy,
  LayoutGrid,
  Zap,
  ClipboardList,
  TrendingUp,
  CheckCircle2,
  History as LucideHistory,
  LayoutDashboard,
  Images,
  Map,
  ScanSearch,
  Users,
  FileBarChart,
  FileText
} from 'lucide-react';

interface NavItem {
  name: string;
  href: string;
  icon: any;
  isCenter?: boolean;
}

export default function BottomNav() {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const getRole = () => {
    if (pathname.startsWith('/owner')) return 'owner';
    if (pathname.startsWith('/manager')) return 'manager';
    return 'housekeeper';
  };

  const role = getRole();

  // Define navigation based on role, mapping sidebar screens to bottom nav
  const navItems: NavItem[] = {
    housekeeper: [
      { name: 'Rooms', href: '/', icon: LayoutGrid },
      { name: 'Reports', href: '/inspection/report', icon: ClipboardList },
      { name: 'Scan', href: '/inspection', icon: Zap, isCenter: true },
      { name: 'Shift', href: '/shift-summary', icon: Sparkles },
      { name: 'History', href: '/history', icon: LucideHistory },
    ],
    manager: [
      { name: 'Gallery', href: '/manager/gallery', icon: Images },
      { name: 'Floor Map', href: '/manager/floormap', icon: Map },
      { name: 'Dashboard', href: '/manager', icon: LayoutGrid, isCenter: true },
      { name: 'Inspection', href: '/manager/inspection', icon: ScanSearch },
      { name: 'Report', href: '/manager/report', icon: FileBarChart },
    ],
    owner: [
      { name: 'Performance', href: '/owner/comparison', icon: TrendingUp },
      { name: 'Quality', href: '/owner/brand-standards', icon: LayoutGrid },
      { name: 'Portfolio', href: '/owner', icon: LayoutDashboard, isCenter: true },
      { name: 'Staff', href: '/owner/staff', icon: Users },
      { name: 'Reports', href: '/owner/reports', icon: FileText },
    ]
  }[role];

  if (!mounted) return null;

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-[100]">
      <div className="bg-white border-t border-slate-100 shadow-[0_-1px_10px_rgba(0,0,0,0.05)] h-[76px] flex items-center justify-around px-1 relative transition-all duration-300">
        {navItems.map((item, idx) => {
          const Icon = item.icon;
          const isActive = item.href ? (
            pathname === item.href || 
            (item.href !== '/' && item.href !== '/owner' && item.href !== '/manager' && pathname.startsWith(item.href))
          ) : false;

          // Premium Blue color for icons and labels
          const themeColor = "#3b82f6";

          if (item.isCenter) {
            return (
              <Link
                key={idx}
                href={item.href || '#'}
                className="relative -top-5 flex flex-col items-center gap-1 group"
              >
                <div 
                  className="w-14 h-14 rounded-full flex items-center justify-center text-white shadow-lg shadow-blue-500/20 active:scale-95 transition-all"
                  style={{ backgroundColor: themeColor }}
                >
                  <Icon size={24} strokeWidth={2.5} />
                </div>
                <span className="text-[9px] font-bold uppercase tracking-widest mt-0.5" style={{ color: themeColor }}>
                  {item.name}
                </span>
              </Link>
            );
          }

          return (
            <Link key={idx} href={item.href || '#'} className="flex-1 flex flex-col items-center gap-1 py-2 transition-all group min-w-0">
              <div className={`transition-all duration-300 ${isActive ? 'scale-110' : 'opacity-40 group-hover:opacity-100'}`} style={{ color: isActive ? themeColor : '#64748b' }}>
                <Icon size={role === 'manager' ? 18 : 20} strokeWidth={isActive ? 2.5 : 2} />
              </div>
              <span 
                className={`font-bold uppercase tracking-widest transition-all duration-300 text-center px-0.5 whitespace-nowrap overflow-hidden text-ellipsis w-full ${isActive ? 'opacity-100' : 'opacity-40'} ${role === 'manager' ? 'text-[7.5px]' : 'text-[8.5px] sm:text-[9px]'}`}
                style={{ color: isActive ? themeColor : '#64748b' }}
              >
                {item.name}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
