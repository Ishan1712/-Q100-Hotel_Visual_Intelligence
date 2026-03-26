import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "Q100 Hospitality AI | Dashboard",
  description: "Next-gen hospitality inspection and management",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} antialiased bg-[#f8fafc] text-slate-900 min-h-screen font-sans flex`}>
        <Sidebar />
        <div className="flex-1 flex flex-col min-h-screen lg:ml-64 transition-all duration-300">
           <Header />
           <main className="flex-1 p-8">
              {children}
           </main>
        </div>
      </body>
    </html>
  );
}
