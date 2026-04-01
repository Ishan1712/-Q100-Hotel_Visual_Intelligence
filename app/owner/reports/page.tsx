"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FileText, 
  Settings2, 
  Eye, 
  Download, 
  Mail, 
  Clock, 
  Calendar, 
  CheckCircle2, 
  Plus, 
  ChevronRight,
  TrendingUp,
  PieChart,
  LayoutGrid,
  Building2,
  Users,
  Copy
} from 'lucide-react';
import OwnerDashboardLayout from '@/app/components/OwnerDashboardLayout';

const templates = [
  { id: 'board', name: 'Monthly Board Update', icon: Building2, desc: 'High-level performance, ROI, and property rankings.' },
  { id: 'roi', name: 'Quarterly ROI Summary', icon: TrendingUp, desc: 'Deep dive into financial savings and labor reallocation.' },
  { id: 'audit', name: 'Brand Audit Report', icon: LayoutGrid, desc: 'Heatmaps and compliance scores by category/property.' },
  { id: 'onboarding', name: 'Expansion Proposal', icon: Plus, desc: 'Projected ROI for hypothetical 6th property.' },
];

const metricsList = [
  { id: 'roi_ratio', name: 'ROI Ratio', icon: TrendingUp },
  { id: 'waterfall', name: 'Savings Waterfall', icon: PieChart },
  { id: 'heatmap', name: 'Brand Heatmap', icon: LayoutGrid },
  { id: 'leaderboard', name: 'Property Leaderboard', icon: Building2 },
  { id: 'staff', name: 'Staff Efficiency', icon: Users },
  { id: 'gsi', name: 'Guest Satisfaction', icon: CheckCircle2 },
];

export default function ReportGenerator() {
  const [selectedTemplate, setSelectedTemplate] = useState('board');
  const [selectedProperties, setSelectedProperties] = useState(['All Properties']);
  const [selectedMetrics, setSelectedMetrics] = useState(['roi_ratio', 'waterfall', 'heatmap']);
  const [isGenerating, setIsGenerating] = useState(false);

  const toggleMetric = (id: string) => {
    setSelectedMetrics(prev => 
      prev.includes(id) ? prev.filter(m => m !== id) : [...prev, id]
    );
  };

  const handleGenerate = () => {
    setIsGenerating(true);
    setTimeout(() => setIsGenerating(false), 2000);
  };

  return (
    <OwnerDashboardLayout 
      title="Executive Report Generator" 
      subtitle="One-click boardroom-ready reports for stakeholders and investors"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Configuration Panel (Left) */}
        <div className="lg:col-span-4 space-y-8 flex flex-col">
          <div className="bg-white border border-slate-100 p-8 rounded-3xl shadow-sm flex-1 flex flex-col">
            <div className="flex items-center gap-3 mb-8">
                <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl">
                    <Settings2 size={20} />
                </div>
                <h4 className="text-xl font-bold text-slate-900 tracking-tight leading-none">Configuration</h4>
            </div>

            <div className="space-y-8 flex-1">
                {/* Period Selection */}
                <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Select Period</label>
                    <div className="grid grid-cols-3 gap-2">
                        {['Week', 'Month', 'Quarter'].map((p) => (
                            <button key={p} className={`py-2 px-3 rounded-xl border text-[11px] font-bold transition-all ${
                                p === 'Month' ? 'bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-100' : 'bg-slate-50 border-slate-100 text-slate-400 hover:bg-slate-100'
                            }`}>
                                {p}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Property Selection */}
                <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Properties</label>
                    <div className="relative">
                        <button className="w-full flex items-center justify-between px-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-[13px] font-bold text-slate-900 group">
                            <span>{selectedProperties.join(', ')}</span>
                            <ChevronRight size={16} className="text-slate-400 group-hover:translate-x-0.5 transition-transform" />
                        </button>
                    </div>
                </div>

                {/* Metrics Selection */}
                <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Included Metrics</label>
                    <div className="grid grid-cols-1 gap-2">
                        {metricsList.map((m) => (
                            <button 
                                key={m.id} 
                                onClick={() => toggleMetric(m.id)}
                                className={`flex items-center justify-between px-4 py-3 rounded-2xl border transition-all ${
                                    selectedMetrics.includes(m.id) 
                                        ? 'bg-blue-50 border-blue-100 text-blue-600' 
                                        : 'bg-transparent border-slate-100 text-slate-400 hover:bg-slate-50'
                                }`}
                            >
                                <div className="flex items-center gap-3">
                                    <m.icon size={16} className={selectedMetrics.includes(m.id) ? 'text-blue-400' : 'text-slate-600'} />
                                    <span className="text-[13px] font-bold">{m.name}</span>
                                </div>
                                {selectedMetrics.includes(m.id) && <CheckCircle2 size={16} className="text-blue-400" />}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <div className="mt-12 space-y-3">
                <button 
                    onClick={handleGenerate}
                    disabled={isGenerating}
                    className="w-full py-4 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 rounded-2xl text-white text-[11px] font-black uppercase tracking-[0.2em] shadow-lg shadow-blue-100 transition-all flex items-center justify-center gap-3"
                >
                    {isGenerating ? (
                        <>
                            <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                            <span>Compiling Data...</span>
                        </>
                    ) : (
                        <>
                            <FileText size={18} />
                            <span>Generate Report</span>
                        </>
                    )}
                </button>
                <div className="flex gap-2">
                    <button className="flex-1 py-3 bg-slate-50 border border-slate-100 hover:bg-slate-100 rounded-2xl text-slate-500 text-[9px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 group">
                        <Mail size={14} className="group-hover:text-blue-600" />
                        Schedule
                    </button>
                    <button className="flex-1 py-3 bg-slate-50 border border-slate-100 hover:bg-slate-100 rounded-2xl text-slate-500 text-[9px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 group">
                        <Copy size={14} className="group-hover:text-blue-600" />
                        Template
                    </button>
                </div>
            </div>
          </div>
        </div>

        {/* Live Preview (Right) */}
        <div className="lg:col-span-8 space-y-8">
          <div className="bg-slate-50 border border-slate-200 rounded-3xl shadow-sm flex flex-col h-[800px] overflow-hidden relative group">
            <div className="absolute top-0 inset-x-0 h-1 bg-blue-100">
                <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: isGenerating ? '100%' : '0%' }}
                    transition={{ duration: 2 }}
                    className="h-full bg-blue-600 shadow-[0_0_15px_rgba(59,130,246,0.2)]"
                />
            </div>

            {/* Preview Header */}
            <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-white/80 backdrop-blur-md">
                <div className="flex items-center gap-4">
                    <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
                        <Eye size={16} />
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Live Preview</p>
                      <p className="text-xs font-bold text-slate-900">{templates.find(t => t.id === selectedTemplate)?.name}.pdf</p>
                    </div>
                </div>
                <div className="flex gap-2">
                    <button className="px-3 py-1.5 bg-slate-100 border border-slate-200 rounded-lg text-slate-600 text-[10px] font-bold hover:bg-slate-200">1 / 6 Pages</button>
                    <button className="p-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white transition-all shadow-lg shadow-blue-100">
                        <Download size={16} />
                    </button>
                </div>
            </div>

            {/* Preview Document Content */}
            <div className="flex-1 bg-[#1e293b]/50 overflow-y-auto no-scrollbar p-12 flex justify-center">
                <motion.div 
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="w-full max-w-2xl bg-white aspect-[1/1.414] shadow-2xl rounded-sm p-16 flex flex-col text-slate-900 relative"
                >
                    {/* Simulated PDF Header */}
                    <div className="flex justify-between items-start mb-20">
                        <div className="space-y-4">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center">
                                    <span className="text-white font-black text-sm">Q</span>
                                </div>
                                <span className="font-bold text-xl tracking-tight text-slate-900">Q100<span className="text-blue-600 lowercase font-medium">.ai</span></span>
                            </div>
                            <h3 className="text-3xl font-black tracking-tighter max-w-xs leading-none">Monthly Board Performance Update</h3>
                        </div>
                        <div className="text-right">
                            <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-1">Fiscal Year 2026</p>
                            <p className="text-xl font-bold text-slate-400 uppercase tracking-tighter">Quarter 1</p>
                        </div>
                    </div>

                    {/* Simulated Content Blocks */}
                    <div className="space-y-12 flex-1">
                        <div className="grid grid-cols-3 gap-8">
                            <div className="space-y-1">
                                <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-1 mb-2">Rooms Managed</p>
                                <p className="text-2xl font-black text-slate-900">612</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-1 mb-2">Pass Rate</p>
                                <p className="text-2xl font-black text-slate-900">74.8%</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-1 mb-2">Net Savings</p>
                                <p className="text-2xl font-black text-emerald-600">₹24.7L</p>
                            </div>
                        </div>

                        <div className="bg-slate-50 p-6 rounded-lg space-y-4">
                            <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Portfolio Executive Summary</h5>
                            <div className="space-y-3">
                                <div className="h-2 w-full bg-slate-200 rounded-full" />
                                <div className="h-2 w-full bg-slate-200 rounded-full" />
                                <div className="h-2 w-3/4 bg-slate-200 rounded-full" />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-8 h-48">
                            <div className="bg-slate-50 rounded-lg p-6 flex items-center justify-center border-2 border-dashed border-slate-200">
                                <PieChart size={40} className="text-slate-300" />
                            </div>
                            <div className="bg-slate-50 rounded-lg p-6 flex items-center justify-center border-2 border-dashed border-slate-200">
                                <TrendingUp size={40} className="text-slate-300" />
                            </div>
                        </div>
                    </div>

                    {/* PDF Footer */}
                    <div className="mt-auto pt-8 border-t border-slate-100 flex justify-between items-center opacity-40">
                        <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">© 2026 Monarch Hospitality Group</p>
                        <p className="text-[8px] font-bold text-blue-600 uppercase tracking-widest">Confidential — Page 1 of 6</p>
                    </div>

                    {isGenerating && (
                        <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] flex items-center justify-center p-20 text-center">
                            <motion.div 
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="space-y-4"
                            >
                                <div className="w-12 h-12 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin mx-auto" />
                                <p className="text-sm font-black text-slate-900 uppercase tracking-widest">Encrypting Metadata...</p>
                            </motion.div>
                        </div>
                    )}
                </motion.div>
            </div>
          </div>
          
          {/* Recent Reports Area */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {templates.map((t) => (
                  <button 
                    key={t.id}
                    onClick={() => setSelectedTemplate(t.id)}
                    className={`p-4 rounded-3xl border transition-all text-left flex flex-col relative overflow-hidden group ${
                        selectedTemplate === t.id 
                            ? 'bg-blue-50 border-blue-200 shadow-sm' 
                            : 'bg-white border-slate-100 hover:border-slate-200'
                    }`}
                  >
                    <div className={`p-2.5 rounded-xl mb-3 w-fit ${
                        selectedTemplate === t.id ? 'bg-blue-600 text-white' : 'bg-slate-50 text-slate-400'
                    }`}>
                        <t.icon size={16} />
                    </div>
                    <span className={`text-xs font-bold leading-tight ${selectedTemplate === t.id ? 'text-slate-900' : 'text-slate-500'}`}>{t.name}</span>
                    <div className={`absolute bottom-0 right-0 p-2 opacity-5 scale-150 transition-transform ${selectedTemplate === t.id ? 'text-blue-600' : 'text-slate-200'}`}>
                        <t.icon size={48} />
                    </div>
                  </button>
              ))}
          </div>
        </div>
      </div>
    </OwnerDashboardLayout>
  );
}
