"use client";

import React, { useState } from 'react';
import { User, Shield, Crown, KeyRound, ArrowRight, CheckCircle2, Building2 } from 'lucide-react';
import Link from 'next/link';

export default function LoginPage() {
  const [selectedRole, setSelectedRole] = useState<'worker' | 'manager' | 'owner'>('worker');

  const roles = [
    {
      id: 'worker',
      title: 'Housekeeper',
      icon: User,
      color: 'blue',
      credentials: { email: 'worker@q100.ai', password: 'password123' },
      description: 'Access room task lists and scan reports.'
    },
    {
      id: 'manager',
      title: 'Manager',
      icon: Shield,
      color: 'indigo',
      credentials: { email: 'manager@q100.ai', password: 'adminpassword' },
      description: 'Overview operations and manage staff.'
    },
    {
      id: 'owner',
      title: 'Owner',
      icon: Crown,
      color: 'amber',
      credentials: { email: 'owner@q100.ai', password: 'supersecret' },
      description: 'High-level analytics and property management.'
    }
  ] as const;

  const activeRole = roles.find(r => r.id === selectedRole)!;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row font-sans">
      
      {/* Left side: Branding / Graphic */}
      <div className="hidden md:flex flex-col justify-between w-1/2 p-12 bg-slate-900 border-r border-slate-800 relative overflow-hidden">
        {/* Abstract Background Element */}
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-gradient-to-br from-blue-500/20 to-indigo-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-gradient-to-tr from-sky-500/10 to-blue-500/10 rounded-full blur-3xl translate-y-1/3 -translate-x-1/4 pointer-events-none" />

        <div className="relative z-10 flex flex-col">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 flex items-center justify-center overflow-hidden">
              <img src="/auglelogo.png" alt="Augle Logo" className="w-full h-full object-contain" />
            </div>
            <span className="text-white text-2xl font-black tracking-tight leading-none">Q100.AI</span>
          </div>
          <span className="text-[8px] font-bold text-blue-400 uppercase tracking-[0.2em] mt-2">
            Hotel Visual Intelligence
          </span>
        </div>

        <div className="relative z-10 space-y-6">
          <h1 className="text-5xl font-black text-white leading-[1.1] tracking-tight">
            Elevate Your <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">
              Hospitality Standards
            </span>
          </h1>
          <p className="text-slate-400 text-lg max-w-md font-medium leading-relaxed">
            The intelligent platform for modern hotel operations. Streamline inspections, manage teams, and delight your guests with unparalleled efficiency.
          </p>
        </div>

        <div className="relative z-10">
          <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">
            © 2026 Q100 AI Technologies
          </p>
        </div>
      </div>

      {/* Right side: Login Form */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-6 md:p-12 relative">
        <div className="max-w-md w-full space-y-10">
          
          <div className="text-center md:text-left space-y-3">
            <div className="md:hidden flex flex-col items-center justify-center mb-8">
              <div className="flex items-center justify-center gap-3">
                <div className="w-8 h-8 flex items-center justify-center overflow-hidden">
                  <img src="/auglelogo.png" alt="Augle Logo" className="w-full h-full object-contain" />
                </div>
                <span className="text-slate-900 text-xl font-black tracking-tight leading-none">Q100.AI</span>
              </div>
              <span className="text-[7px] font-bold text-blue-600 uppercase tracking-[0.15em] mt-2">
                Hotel Visual Intelligence
              </span>
            </div>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">Welcome back</h2>
            <p className="text-slate-500 font-medium">Select your role to access the dashboard.</p>
          </div>

          {/* Role Selector */}
          <div className="grid grid-cols-3 gap-3">
            {roles.map((role) => {
              const Icon = role.icon;
              const isSelected = selectedRole === role.id;
              
              const colorClasses = {
                blue: isSelected ? 'bg-blue-50 border-blue-500 text-blue-700 shadow-blue-500/20' : 'border-slate-200 text-slate-500 hover:border-blue-200 hover:bg-blue-50/50',
                indigo: isSelected ? 'bg-indigo-50 border-indigo-500 text-indigo-700 shadow-indigo-500/20' : 'border-slate-200 text-slate-500 hover:border-indigo-200 hover:bg-indigo-50/50',
                amber: isSelected ? 'bg-amber-50 border-amber-500 text-amber-700 shadow-amber-500/20' : 'border-slate-200 text-slate-500 hover:border-amber-200 hover:bg-amber-50/50',
              }[role.color];

              const iconColors = {
                blue: isSelected ? 'text-blue-600' : 'text-slate-400 group-hover:text-blue-500',
                indigo: isSelected ? 'text-indigo-600' : 'text-slate-400 group-hover:text-indigo-500',
                amber: isSelected ? 'text-amber-600' : 'text-slate-400 group-hover:text-amber-500',
              }[role.color];

              return (
                <button
                  key={role.id}
                  onClick={() => setSelectedRole(role.id as any)}
                  className={`group relative flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all duration-300 shadow-sm ${colorClasses} ${isSelected ? 'scale-[1.02] shadow-lg' : 'hover:scale-105'}`}
                >
                  {isSelected && (
                    <div className="absolute top-2 right-2">
                       <CheckCircle2 size={14} className={iconColors} />
                    </div>
                  )}
                  <Icon size={24} className={`mb-2 transition-colors duration-300 ${iconColors}`} />
                  <span className="text-xs font-bold leading-none">{role.title}</span>
                </button>
              );
            })}
          </div>

          {/* Credentials Display & Form */}
          <div className="space-y-6">
            <div className="space-y-4">
              <div className="relative group">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5 group-focus-within:text-blue-500 transition-colors" />
                <input 
                  type="email" 
                  readOnly 
                  value={activeRole.credentials.email}
                  className="w-full bg-white border-2 border-slate-200 rounded-2xl py-3.5 pl-12 pr-4 outline-none focus:border-blue-500 text-slate-900 font-semibold transition-colors shadow-sm"
                />
              </div>
              <div className="relative group">
                <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5 group-focus-within:text-blue-500 transition-colors" />
                <input 
                  type="password" 
                  readOnly 
                  value={activeRole.credentials.password}
                  className="w-full bg-white border-2 border-slate-200 rounded-2xl py-3.5 pl-12 pr-4 outline-none focus:border-blue-500 text-slate-900 font-semibold transition-colors shadow-sm"
                />
              </div>
            </div>

            <div className="bg-slate-100 rounded-xl p-4 border border-slate-200/60 flex gap-3 text-sm">
              <div className="mt-0.5">
                 <Shield className="w-4 h-4 text-slate-400" />
              </div>
              <p className="text-slate-600 font-medium leading-relaxed">
                Test mode active. Logging in as <span className="font-bold text-slate-900">{activeRole.title}</span>.<br/> {activeRole.description}
              </p>
            </div>

            <Link 
              href="/"
              className={`w-full flex items-center justify-center gap-2 py-4 rounded-2xl text-white font-bold text-lg shadow-xl hover:-translate-y-1 transition-all duration-300 ${
                activeRole.color === 'blue' ? 'bg-blue-600 hover:bg-blue-700 hover:shadow-blue-600/20' :
                activeRole.color === 'indigo' ? 'bg-indigo-600 hover:bg-indigo-700 hover:shadow-indigo-600/20' :
                'bg-amber-600 hover:bg-amber-700 hover:shadow-amber-600/20'
              }`}
            >
              Log In to Dashboard
              <ArrowRight size={20} />
            </Link>
          </div>

        </div>
      </div>

    </div>
  );
}
