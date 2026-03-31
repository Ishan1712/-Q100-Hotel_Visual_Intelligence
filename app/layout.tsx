"use client";

import React, { useState } from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { usePathname } from "next/navigation";
import "./globals.css";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const isLoginPage = pathname === "/login";

  return (
    <html lang="en">
      <body className={`${inter.variable} antialiased bg-[#f8fafc] text-slate-900 min-h-screen font-sans flex overflow-x-hidden ${isLoginPage ? 'bg-slate-50' : ''}`}>
        {!isLoginPage && (
          <Sidebar 
            collapsed={isSidebarCollapsed} 
            setCollapsed={setIsSidebarCollapsed} 
            isMobileOpen={isMobileMenuOpen}
            setIsMobileOpen={setIsMobileMenuOpen}
          />
        )}
        <div className={`flex-1 flex flex-col min-h-screen transition-all duration-300 w-full ${!isLoginPage && isSidebarCollapsed ? 'lg:ml-20' : !isLoginPage ? 'lg:ml-64' : ''}`}>
           {!isLoginPage && <Header onMenuClick={() => setIsMobileMenuOpen(true)} />}
           <main className={`flex-1 ${!isLoginPage ? 'p-4 md:p-8' : ''}`}>
              {children}
           </main>
        </div>
      </body>
    </html>
  );
}
