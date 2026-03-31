"use client";

import React, { useState } from "react";
import ManagerSidebar from "../components/manager/ManagerSidebar";
import ManagerHeader from "../components/manager/ManagerHeader";

export default function ManagerLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="fixed inset-0 z-50 flex bg-[#f8fafc] overflow-x-hidden">
      <ManagerSidebar 
        collapsed={isSidebarCollapsed} 
        setCollapsed={setIsSidebarCollapsed} 
        isMobileOpen={isMobileMenuOpen}
        setIsMobileOpen={setIsMobileMenuOpen}
      />
      <div className={`flex-1 flex flex-col min-h-screen transition-all duration-300 w-full ${isSidebarCollapsed ? 'lg:ml-20' : 'lg:ml-64'}`}>
        <ManagerHeader onMenuClick={() => setIsMobileMenuOpen(true)} />
        <main className="flex-1 p-4 md:p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
