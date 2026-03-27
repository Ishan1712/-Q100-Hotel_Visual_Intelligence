"use client";

import React, { useState } from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
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

  return (
    <html lang="en">
      <body className={`${inter.variable} antialiased bg-[#f8fafc] text-slate-900 min-h-screen font-sans flex`}>
        <Sidebar collapsed={isSidebarCollapsed} setCollapsed={setIsSidebarCollapsed} />
        <div className={`flex-1 flex flex-col min-h-screen transition-all duration-300 ${isSidebarCollapsed ? 'lg:ml-20' : 'lg:ml-64'}`}>
           <Header />
           <main className="flex-1 p-8">
              {children}
           </main>
        </div>
      </body>
    </html>
  );
}
