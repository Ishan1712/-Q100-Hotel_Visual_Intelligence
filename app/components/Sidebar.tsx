"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  LogOut, 
  ChevronDown, 
  LayoutGrid,
  Zap,
  ClipboardList,
  Sparkles,
  History,
  Menu,
  X,
  User,
  Shield,
  Crown,
  LayoutDashboard,
  Images,
  Map,
  ScanSearch,
  Users,
  FileBarChart,
  CheckCircle2,
  TrendingUp,
  IndianRupee,
  FileText,
  Calculator,
  Building2,
  FlaskConical
} from 'lucide-react';

type RoleId = 'worker' | 'manager' | 'owner';

interface MenuItem {
  name: string;
  href: string;
  icon: any;
}

const roleConfigs = {
  worker: {
    title: 'Housekeeper',
    icon: User,
    color: 'blue',
    dashboard: '/',
    menuItems: [
      { name: "My Rooms", href: "/", icon: LayoutGrid },
      { name: "AI Inspection Module", href: "/inspection", icon: Zap },
      { name: "Inspection Report", href: "/inspection/report", icon: ClipboardList },
      { name: "Shift Summary", href: "/shift-summary", icon: Sparkles },
      { name: "Room History", href: "/history", icon: History },
      { name: "AI Demo", href: "/demo", icon: FlaskConical }
    ]
  },
  manager: {
    title: 'Manager',
    icon: Shield,
    color: 'indigo',
    dashboard: '/manager',
    menuItems: [
      { name: "Dashboard", href: "/manager", icon: LayoutDashboard },
      { name: "Master Gallery", href: "/manager/gallery", icon: Images },
      { name: "Live Floor Map", href: "/manager/floormap", icon: Map },
      { name: "AI Inspection Detail", href: "/manager/inspection", icon: ScanSearch },
      { name: "Daily Report", href: "/manager/report", icon: FileBarChart },
    ]
  },
  owner: {
    title: 'Owner',
    icon: Crown,
    color: 'amber',
    dashboard: '/owner',
    menuItems: [
      { name: "Portfolio Dashboard", href: "/owner", icon: LayoutDashboard },
      { name: "Hotel Performance", href: "/owner/comparison", icon: TrendingUp },
      { name: "Room Quality Overview", href: "/owner/brand-standards", icon: LayoutGrid },
      { name: "Staff Analytics", href: "/owner/staff", icon: Users },
      { name: "Report Generator", href: "/owner/reports", icon: FileText },
    ]
  }
};

interface SidebarProps {
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
  isMobileOpen: boolean;
  setIsMobileOpen: (open: boolean) => void;
}

export default function Sidebar({ collapsed, setCollapsed, isMobileOpen, setIsMobileOpen }: SidebarProps) {
  const [hovered, setHovered] = useState<string | null>(null);
  const [selectedRole, setSelectedRole] = useState<RoleId>('worker');
  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  // Initialize role based on current path
  useEffect(() => {
    if (pathname.startsWith('/owner')) {
      setSelectedRole('owner');
    } else if (pathname.startsWith('/manager')) {
      setSelectedRole('manager');
    } else {
      setSelectedRole('worker');
    }
  }, [pathname]);

  const handleRoleChange = (roleId: RoleId) => {
    setSelectedRole(roleId);
    setIsRoleDropdownOpen(false);
    
    // Redirect to respective dashboard if not already there
    const newDashboard = roleConfigs[roleId].dashboard;
    if (pathname !== newDashboard) {
      router.push(newDashboard);
    }
  };

  const currentConfig = roleConfigs[selectedRole];
  const ActiveIcon = currentConfig.icon;

  return (
    <>
      <aside 
        className={`fixed top-0 left-0 h-screen bg-[#0b1220] text-slate-300 transition-all duration-300 ease-in-out z-50 hidden lg:flex flex-col 
          ${collapsed ? 'w-20' : 'w-64'} 
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
        <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto no-scrollbar">
          {currentConfig.menuItems.map((item) => {
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
                    ? 'bg-[#1e293b] text-white shadow-sm' 
                    : 'text-slate-400 hover:bg-white/5 hover:text-white'
                } ${collapsed && !isMobileOpen ? 'justify-center px-0 mx-auto w-12 h-12' : ''}`}
              >
                <div className={`flex items-center justify-center transition-all ${isActive ? (
                  selectedRole === 'worker' ? 'text-blue-400' :
                  selectedRole === 'manager' ? 'text-indigo-400' :
                  'text-amber-400'
                ) : 'group-hover:text-white'}`}>
                  <Icon size={18} strokeWidth={isActive ? 2.5 : 2} />
                </div>
                {(!collapsed || isMobileOpen) && <span className={`font-bold text-[13px] tracking-wide ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-white'}`}>{item.name}</span>}
                {isActive && (!collapsed || isMobileOpen) && (
                  <div className={`ml-auto w-1 h-4 rounded-full shadow-[0_0_8px_rgba(37,99,235,0.6)] ${
                    selectedRole === 'worker' ? 'bg-blue-600' :
                    selectedRole === 'manager' ? 'bg-indigo-600' :
                    'bg-amber-600'
                  }`} />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-3 border-t border-white/5 space-y-2">
          {/* Role Selector */}
          <div className={`relative ${collapsed && !isMobileOpen ? 'flex justify-center mb-2' : 'mb-2'}`}>
            <button
              onClick={() => setIsRoleDropdownOpen(!isRoleDropdownOpen)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 hover:bg-white/5 ${collapsed && !isMobileOpen ? 'justify-center w-12 h-12 p-0' : ''}`}
            >
              <div className={`flex items-center justify-center w-6 h-6 rounded-lg ${
                selectedRole === 'worker' ? 'bg-blue-500/20 text-blue-400' :
                selectedRole === 'manager' ? 'bg-indigo-500/20 text-indigo-400' :
                'bg-amber-500/20 text-amber-400'
              }`}>
                <ActiveIcon size={14} strokeWidth={2.5} />
              </div>
              {(!collapsed || isMobileOpen) && (
                <>
                  <span className="text-[13px] font-bold text-slate-300 group-hover:text-white leading-none">{currentConfig.title}</span>
                  <ChevronDown size={14} className={`ml-auto text-slate-500 transition-transform duration-200 ${isRoleDropdownOpen ? 'rotate-180' : ''}`} />
                </>
              )}
            </button>

            {/* Role Dropdown Menu */}
            {isRoleDropdownOpen && (
              <div className={`absolute left-0 right-0 bottom-full mb-2 bg-[#1e293b] border border-white/10 rounded-2xl shadow-2xl z-[60] overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-200 ${collapsed && !isMobileOpen ? 'w-48 left-full ml-2 bottom-0 mb-0' : ''}`}>
                {(Object.keys(roleConfigs) as RoleId[]).map((roleId) => {
                  const config = roleConfigs[roleId];
                  const Icon = config.icon;
                  const isSelected = selectedRole === roleId;
                  
                  return (
                    <button
                      key={roleId}
                      onClick={() => handleRoleChange(roleId)}
                      className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-all hover:bg-white/5 group ${isSelected ? 'bg-white/10' : ''}`}
                    >
                      <div className={`flex items-center justify-center w-8 h-8 rounded-lg ${
                        roleId === 'worker' ? 'bg-blue-500/10 text-blue-400' :
                        roleId === 'manager' ? 'bg-indigo-500/10 text-indigo-400' :
                        'bg-amber-500/10 text-amber-400'
                      }`}>
                        <Icon size={16} />
                      </div>
                      <div className="flex flex-col">
                        <span className={`text-[13px] font-bold ${isSelected ? 'text-white' : 'text-slate-300 group-hover:text-white'}`}>{config.title}</span>
                        <span className="text-[10px] text-slate-500 font-medium">Switch to {config.title} view</span>
                      </div>
                      {isSelected && <CheckCircle2 size={12} className="ml-auto text-blue-400" />}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
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

        <style jsx>{`
          .active-glow {
            box-shadow: inset 0 0 20px rgba(59, 130, 246, 0.1);
          }
        `}</style>
      </aside>
    </>
  );
}
