"use client";

import React, { useState, useMemo, useRef, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { 
  AlertTriangle, CheckCircle, 
  XCircle, Eye, Clock, IndianRupee, RotateCcw, Ban, User, ScanSearch,
  Camera, Shield, Sparkles, ArrowRight, Upload, X, Image, Play,
  Building2, ChevronDown, Search
} from 'lucide-react';

/* ── Floor/Room Data ── */
const floorNumbers = [2, 3, 4, 5, 6, 7, 8];

const roomTypeForNumber = (num: number): string => {
  if (num % 15 === 0) return "Presidential Suite";
  if (num % 10 === 0) return "Deluxe Suite";
  if (num % 7 === 0) return "Deluxe King";
  if (num % 11 === 0) return "Accessible Room";
  if (num % 5 === 0) return "Standard Twin";
  return "Standard Double";
};

const generateFloorRooms = (floor: number) => {
  const base = floor * 100;
  const count = floor === 8 ? 18 : floor <= 4 ? 22 : 20;
  return Array.from({ length: count }, (_, i) => {
    const num = base + i + 1;
    const rng = (num * 31 + 17) % 100;
    const status = rng < 60 ? 'pass' : rng < 80 ? 'fail' : 'pending';
    const issues = status === 'fail' ? ((num % 3) + 1) : 0;
    const hour = 8 + Math.floor(i / 4);
    const min = (i * 7) % 60;
    return {
      number: `${num}`,
      type: roomTypeForNumber(num),
      floor,
      lastScan: status !== 'pending' ? `${hour}:${min.toString().padStart(2, '0')} AM` : '—',
      status: status as 'pass' | 'fail' | 'pending',
      issues,
      housekeeper: status !== 'pending' ? ['Priya S.', 'Amit K.', 'Meena R.', 'Deepak J.', 'Sunita P.'][i % 5] : undefined,
      passRate: status === 'pass' ? 85 + (num % 15) : status === 'fail' ? 55 + (num % 25) : 0,
    };
  });
};

const checkpoints = [
  { name: "Dustbin", status: "pass", zone: "Entrance", masterImg: "/master/01_Dustbin_master.png", inspImg: "/master/01_Dustbin_inspection.png" },
  { name: "Bed & Pillows", status: "pass", zone: "Bed Area", masterImg: "/master/02_Bed_Pillows_master.png", inspImg: "/master/02_Bed_Line_Red_Pillow_Missing.png" },
  { name: "Bed Linen", status: "pass", zone: "Bed Area", masterImg: "/master/03_Bed_Linen_master.png", inspImg: "/master/03_Bed_Linen_inspection.png" },
  { name: "Towels (Bath)", status: "pass", zone: "Bathroom", masterImg: "/master/04_Towels_Bathroom_master.png", inspImg: "/master/04_Towels_Bathroom_inspection.png" },
  { name: "Towels (Bed)", status: "pass", zone: "Bed Area", masterImg: "/master/05_Towels_Bedroom_master.png", inspImg: "/master/05_Towels_Bedroom_inspection.png" },
  { name: "Coffee/Tea", status: "pass", zone: "Desk Area", masterImg: "/master/06_Coffee_Tea_Tray_master.png", inspImg: "/master/06_Coffee_Tea_Tray_inspection.png" },
  { name: "Minibar", status: "pass", zone: "Minibar", masterImg: "/master/07_Minibar_Water_master.png", inspImg: "/master/07_Minibar_Water_inspection.png" },
  { name: "Amenities", status: "fail", zone: "Bathroom", masterImg: "/master/08_Bathroom_Amenities_master.png", inspImg: "/master/08_Bathroom_Ammenties_Missing.png" },
  { name: "TV Remote", status: "pass", zone: "Desk Area", masterImg: "/master/09_TV_Remote_Menu_master.png", inspImg: "/master/09_TV_Remote_Menu_inspection.png" },
  { name: "Curtains", status: "pass", zone: "Bed Area", masterImg: "/master/10_Curtains_Lighting_master.png", inspImg: "/master/10_Curtains_Lighting_inspection.png" },
  { name: "Wardrobe", status: "pass", zone: "Entrance", masterImg: "/master/11_Wardrobe_Closet_master.png", inspImg: "/master/11_Wardrobe_Closet_inspection.png" },
  { name: "Welcome Items", status: "pass", zone: "Desk Area", masterImg: "/master/12_Welcome_Stationery_master.png", inspImg: "/master/12_Welcome_Stationery_inspection.png" },
];

const generateDiscrepancies = (roomNum: string) => {
  const seed = parseInt(roomNum) || 0;
  const items = [
    { category: "Amenity", item: "Missing Item — Dental Kit", severity: "Major" as const, zone: "Bathroom", description: "Dental kit absent from position 5 in the vanity arc arrangement." },
    { category: "Arrangement", item: "Incorrect Position — Body Lotion", severity: "Minor" as const, zone: "Bathroom", description: "Body lotion placed behind shampoo instead of its designated position." },
    { category: "Linen", item: "Stain Detected — Pillowcase", severity: "Critical" as const, zone: "Bed Area", description: "Small discolouration detected on left pillowcase, invisible at arm's length." },
  ];
  return items.filter((_, i) => ((seed + i) * 37) % 100 < 60).map((item, id) => ({
    ...item, id: id + 1,
    flaggedAt: `${8 + (seed % 3)}:${(seed * 7 + id * 12) % 60 < 10 ? '0' : ''}${(seed * 7 + id * 12) % 60} AM`,
    resolvedAt: `${9 + (seed % 3)}:${(seed * 11 + id * 8) % 60 < 10 ? '0' : ''}${(seed * 11 + id * 8) % 60} AM`,
    resolutionTime: `${15 + (seed + id) % 20} min`,
  }));
};

/* ── Progress Ring ── */
const ProgressRing = ({ percent, size = 64, stroke = 5 }: { percent: number; size?: number; stroke?: number }) => {
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percent / 100) * circumference;
  const color = percent >= 90 ? '#10b981' : percent >= 75 ? '#f59e0b' : '#f43f5e';
  return (
    <svg width={size} height={size} className="transform -rotate-90">
      <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="#f1f5f9" strokeWidth={stroke} />
      <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke={color} strokeWidth={stroke} strokeDasharray={circumference} strokeDashoffset={offset} strokeLinecap="round" className="transition-all duration-1000 ease-out" />
    </svg>
  );
};

const panelShellClass =
  'group relative overflow-hidden rounded-[2rem] border border-white/80 backdrop-blur-sm shadow-[0_24px_60px_-34px_rgba(15,23,42,0.18)] transition-all duration-500 hover:-translate-y-0.5 hover:shadow-[0_34px_90px_-38px_rgba(15,23,42,0.24)]';

const getInspectionTone = (status: 'pass' | 'fail' | 'pending') => {
  if (status === 'fail') {
    return {
      heroBg: 'from-[#fff2f5] via-[#fffdfa] to-[#eef6ff]',
      heroOverlay: 'bg-[radial-gradient(circle_at_top_left,rgba(244,63,94,0.22)_0,transparent_34%),radial-gradient(circle_at_bottom_right,rgba(59,130,246,0.14)_0,transparent_44%)]',
      selectorBg: 'from-[#fff5f7] via-[#ffffff] to-[#f2f8ff]',
      selectorOverlay: 'bg-[radial-gradient(circle_at_top_right,rgba(244,63,94,0.14)_0,transparent_34%),radial-gradient(circle_at_bottom_left,rgba(59,130,246,0.09)_0,transparent_42%)]',
      infoBg: 'from-[#fff4f6] via-[#ffffff] to-[#fff6f8]',
      infoOverlay: 'bg-[radial-gradient(circle_at_top_left,rgba(244,63,94,0.16)_0,transparent_34%),radial-gradient(circle_at_bottom_right,rgba(251,191,36,0.10)_0,transparent_42%)]',
      summaryBg: 'from-[#fff6f8] via-[#ffffff] to-[#f4f8ff]',
      summaryOverlay: 'bg-[radial-gradient(circle_at_top_left,rgba(244,63,94,0.10)_0,transparent_34%),radial-gradient(circle_at_bottom_right,rgba(59,130,246,0.08)_0,transparent_42%)]',
      discrepancyBg: 'from-[#fff7f8] via-[#ffffff] to-[#f5f9ff]',
      discrepancyOverlay: 'bg-[radial-gradient(circle_at_top_left,rgba(244,63,94,0.10)_0,transparent_34%),radial-gradient(circle_at_bottom_right,rgba(59,130,246,0.07)_0,transparent_42%)]',
      sideBg: 'from-[#fff7f8] via-[#ffffff] to-[#fffaf3]',
      sideOverlay: 'bg-[radial-gradient(circle_at_top_right,rgba(244,63,94,0.10)_0,transparent_34%),radial-gradient(circle_at_bottom_left,rgba(245,158,11,0.08)_0,transparent_40%)]',
      glowPrimary: 'bg-rose-200/28',
      glowSecondary: 'bg-sky-200/18',
      accentSurface: 'border-rose-200/80 bg-rose-50/90 text-rose-700',
      accentText: 'text-rose-600',
      comparisonScanBg: 'from-[#fff3f5] via-[#ffffff] to-[#fff6f8]',
    };
  }

  if (status === 'pending') {
    return {
      heroBg: 'from-[#f3f8ff] via-[#ffffff] to-[#f6fbff]',
      heroOverlay: 'bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.18)_0,transparent_34%),radial-gradient(circle_at_bottom_right,rgba(148,163,184,0.10)_0,transparent_44%)]',
      selectorBg: 'from-[#f4f8ff] via-[#ffffff] to-[#f6fbff]',
      selectorOverlay: 'bg-[radial-gradient(circle_at_top_right,rgba(59,130,246,0.12)_0,transparent_34%),radial-gradient(circle_at_bottom_left,rgba(148,163,184,0.08)_0,transparent_42%)]',
      infoBg: 'from-[#f4f8ff] via-[#ffffff] to-[#f7fbff]',
      infoOverlay: 'bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.12)_0,transparent_34%),radial-gradient(circle_at_bottom_right,rgba(148,163,184,0.08)_0,transparent_42%)]',
      summaryBg: 'from-[#f5f9ff] via-[#ffffff] to-[#f8fbff]',
      summaryOverlay: 'bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.08)_0,transparent_34%),radial-gradient(circle_at_bottom_right,rgba(148,163,184,0.06)_0,transparent_42%)]',
      discrepancyBg: 'from-[#f7faff] via-[#ffffff] to-[#f9fbff]',
      discrepancyOverlay: 'bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.08)_0,transparent_34%),radial-gradient(circle_at_bottom_right,rgba(148,163,184,0.06)_0,transparent_42%)]',
      sideBg: 'from-[#f5f9ff] via-[#ffffff] to-[#f7fbff]',
      sideOverlay: 'bg-[radial-gradient(circle_at_top_right,rgba(59,130,246,0.08)_0,transparent_34%),radial-gradient(circle_at_bottom_left,rgba(148,163,184,0.06)_0,transparent_40%)]',
      glowPrimary: 'bg-blue-200/24',
      glowSecondary: 'bg-slate-200/18',
      accentSurface: 'border-blue-200/80 bg-blue-50/90 text-blue-700',
      accentText: 'text-blue-600',
      comparisonScanBg: 'from-[#f4f8ff] via-[#ffffff] to-[#f7fbff]',
    };
  }

  return {
    heroBg: 'from-[#eefcf5] via-[#fbfffd] to-[#eef8ff]',
    heroOverlay: 'bg-[radial-gradient(circle_at_top_left,rgba(16,185,129,0.22)_0,transparent_34%),radial-gradient(circle_at_bottom_right,rgba(59,130,246,0.14)_0,transparent_44%)]',
    selectorBg: 'from-[#f2fdf7] via-[#ffffff] to-[#eef8ff]',
    selectorOverlay: 'bg-[radial-gradient(circle_at_top_right,rgba(16,185,129,0.14)_0,transparent_34%),radial-gradient(circle_at_bottom_left,rgba(59,130,246,0.09)_0,transparent_42%)]',
    infoBg: 'from-[#f2fdf8] via-[#ffffff] to-[#effbf6]',
    infoOverlay: 'bg-[radial-gradient(circle_at_top_left,rgba(16,185,129,0.16)_0,transparent_34%),radial-gradient(circle_at_bottom_right,rgba(14,165,233,0.10)_0,transparent_42%)]',
    summaryBg: 'from-[#f4fffa] via-[#ffffff] to-[#eef8ff]',
    summaryOverlay: 'bg-[radial-gradient(circle_at_top_left,rgba(16,185,129,0.10)_0,transparent_34%),radial-gradient(circle_at_bottom_right,rgba(59,130,246,0.08)_0,transparent_42%)]',
    discrepancyBg: 'from-[#f6fffb] via-[#ffffff] to-[#f4f9ff]',
    discrepancyOverlay: 'bg-[radial-gradient(circle_at_top_left,rgba(16,185,129,0.10)_0,transparent_34%),radial-gradient(circle_at_bottom_right,rgba(59,130,246,0.07)_0,transparent_42%)]',
    sideBg: 'from-[#f2fbff] via-[#ffffff] to-[#eefcf6]',
    sideOverlay: 'bg-[radial-gradient(circle_at_top_right,rgba(59,130,246,0.10)_0,transparent_34%),radial-gradient(circle_at_bottom_left,rgba(16,185,129,0.08)_0,transparent_40%)]',
    glowPrimary: 'bg-emerald-200/26',
    glowSecondary: 'bg-sky-200/18',
    accentSurface: 'border-emerald-200/80 bg-emerald-50/90 text-emerald-700',
    accentText: 'text-emerald-600',
    comparisonScanBg: 'from-[#f2fdf8] via-[#ffffff] to-[#eefcf6]',
  };
};

const getFloorPillTone = (pct: number) => {
  if (pct >= 80) return { active: 'from-emerald-500 to-cyan-600 shadow-emerald-200/80', rail: 'bg-emerald-400', muted: 'text-emerald-600' };
  if (pct >= 50) return { active: 'from-amber-500 to-orange-600 shadow-amber-200/80', rail: 'bg-amber-400', muted: 'text-amber-600' };
  return { active: 'from-rose-500 to-pink-600 shadow-rose-200/80', rail: 'bg-rose-400', muted: 'text-rose-600' };
};

function AIInspectionDetailContent() {
  const searchParams = useSearchParams();
  const initialFloor = (() => {
    const floorParam = Number(searchParams.get('floor'));
    return floorParam >= 2 && floorParam <= 8 ? floorParam : 2;
  })();
  const initialFloorRooms = generateFloorRooms(initialFloor);
  const requestedRoomNum = searchParams.get('room');
  const initialRoomNum =
    requestedRoomNum && initialFloorRooms.some((room) => room.number === requestedRoomNum)
      ? requestedRoomNum
      : initialFloorRooms[0]?.number || null;
  const [selectedFloor, setSelectedFloor] = useState(initialFloor);
  const [selectedRoomNum, setSelectedRoomNum] = useState<string | null>(initialRoomNum);
  const [showAfter, setShowAfter] = useState(false);
  const [hoveredCheckpoint, setHoveredCheckpoint] = useState<number | null>(null);
  const [selectedCheckpointIdx, setSelectedCheckpointIdx] = useState(7);
  const [isRoomDropdownOpen, setIsRoomDropdownOpen] = useState(false);
  const [roomSearchQuery, setRoomSearchQuery] = useState(initialRoomNum || '');
  const roomDropdownRef = useRef<HTMLDivElement>(null);

  // Close room dropdown on click outside
  useEffect(() => {
    if (!isRoomDropdownOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (roomDropdownRef.current && !roomDropdownRef.current.contains(e.target as Node)) {
        setIsRoomDropdownOpen(false);
        setRoomSearchQuery(selectedRoomNum || initialRoomNum || '');
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [initialRoomNum, isRoomDropdownOpen, selectedRoomNum]);

  const floorRooms = useMemo(() => generateFloorRooms(selectedFloor), [selectedFloor]);
  
  // Default to first room if none selected
  const activeRoomNum = selectedRoomNum && floorRooms.some(r => r.number === selectedRoomNum) 
    ? selectedRoomNum 
    : floorRooms[0]?.number;
  const room = floorRooms.find(r => r.number === activeRoomNum) || floorRooms[0];
  const discrepancies = useMemo(() => generateDiscrepancies(room.number), [room.number]);

  const passCount = checkpoints.filter(c => c.status === 'pass').length;
  const failCount = checkpoints.filter(c => c.status === 'fail').length;
  const floorStats = useMemo(() => floorNumbers.map(f => {
    const rooms = generateFloorRooms(f);
    const ready = rooms.filter(r => r.status === 'pass').length;
    return { floor: f, total: rooms.length, ready, pct: Math.round((ready / rooms.length) * 100) };
  }), []);
  const selectedFloorStats = floorStats.find((fp) => fp.floor === selectedFloor) || floorStats[0];
  const roomScore = room.passRate || Math.round((passCount / checkpoints.length) * 100);
  const pageTone = getInspectionTone(room.status);
  const roomStatusLabel = room.status === 'pass' ? 'Passed' : room.status === 'fail' ? 'Flagged' : 'Pending';
  const roomStatusCopy =
    room.status === 'pass'
      ? 'All checkpoints aligned with the master reference.'
      : room.status === 'fail'
        ? `${room.issues} discrepancy${room.issues === 1 ? '' : 'ies'} detected and ready for review.`
        : 'Awaiting a fresh scan to complete the comparison.';
  const activeCheckpoint = checkpoints[selectedCheckpointIdx] || checkpoints[7];
  const masterImageSrc = activeCheckpoint.masterImg;
  const scanImageSrc = showAfter ? activeCheckpoint.masterImg : activeCheckpoint.inspImg;
  const scanTitle = showAfter ? 'Re-Scan (After Fix)' : "Housekeeper's Scan";
  const scanSubtitle = showAfter
    ? 'Corrected scan with all visible issues resolved.'
    : 'Original flagged scan from housekeeping.';
  const normalizedRoomSearch = roomSearchQuery.trim().toLowerCase();
  const filteredRooms = useMemo(() => {
    if (!normalizedRoomSearch || normalizedRoomSearch === room.number.toLowerCase()) return floorRooms;

    return floorRooms.filter((floorRoom) =>
      [
        floorRoom.number,
        floorRoom.type,
        floorRoom.housekeeper || '',
        floorRoom.status,
      ].some((value) => value.toLowerCase().includes(normalizedRoomSearch))
    );
  }, [floorRooms, normalizedRoomSearch, room.number]);

  const handleFloorChange = (floor: number) => {
    const firstRoom = generateFloorRooms(floor)[0]?.number || null;
    setSelectedFloor(floor);
    setSelectedRoomNum(firstRoom);
    setRoomSearchQuery(firstRoom || '');
    setShowAfter(false);
    setIsRoomDropdownOpen(false);
  };

  const handleRoomChange = (roomNum: string) => {
    setSelectedRoomNum(roomNum);
    setRoomSearchQuery(roomNum);
    setShowAfter(false);
    setIsRoomDropdownOpen(false);
  };

  return (
    <div className="relative space-y-6 pb-12">
      <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[1080px] bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.08)_0,transparent_38%),radial-gradient(circle_at_top_right,rgba(16,185,129,0.07)_0,transparent_34%),linear-gradient(180deg,rgba(255,255,255,0.86)_0%,rgba(248,250,252,0)_78%)]" />

      {/* Inspection Header */}
      <div className={`${panelShellClass} isolate animate-fade-in-up border-slate-200/70 bg-gradient-to-br ${pageTone.heroBg} p-5 lg:p-6 ${isRoomDropdownOpen ? 'z-50 overflow-visible' : ''}`}>
        <div className={`absolute inset-0 ${pageTone.heroOverlay} opacity-95`} />
        <div className={`absolute -left-16 top-8 h-40 w-40 rounded-full blur-3xl ${pageTone.glowPrimary}`} />
        <div className={`absolute right-10 top-0 h-48 w-48 rounded-full blur-3xl ${pageTone.glowSecondary}`} />
        <div className="relative z-10 space-y-6">
          <div className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
            <div className="max-w-3xl space-y-3">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/80 bg-white/72 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.28em] text-slate-500 shadow-sm backdrop-blur-md">
                <Sparkles size={12} className={pageTone.accentText} />
                Inspection intelligence
              </div>
              <div>
                <h1 className="text-[2rem] font-black tracking-tight text-slate-900 sm:text-[2.2rem]">AI Inspection Detail</h1>
                <p className="mt-2 max-w-2xl text-sm font-medium leading-6 text-slate-500">
                  Side-by-side comparison between the master setup and the live captured scan, with floor controls and room search kept upfront.
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2.5">
                <span className={`rounded-full border px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.24em] shadow-sm backdrop-blur-md ${pageTone.accentSurface}`}>
                  {roomStatusLabel}
                </span>
                <span className="rounded-full border border-white/80 bg-white/74 px-3 py-1.5 text-xs font-semibold text-slate-600 shadow-sm">
                  Room {room.number} · Floor {room.floor}
                </span>
                <span className="rounded-full border border-white/80 bg-white/74 px-3 py-1.5 text-xs font-semibold text-slate-600 shadow-sm">
                  {room.type}
                </span>
                <span className="rounded-full border border-white/80 bg-white/74 px-3 py-1.5 text-xs font-semibold text-slate-500 shadow-sm">
                  Confidence {roomScore}%
                </span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2.5 xl:justify-end">
              <div className="rounded-[1.15rem] border border-white/80 bg-white/78 px-4 py-3 shadow-sm backdrop-blur-md">
                <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-slate-400">Live Status</p>
                <p className="mt-1 text-lg font-black text-slate-900">{room.status === 'fail' ? `${room.issues} issues` : room.status === 'pending' ? 'Awaiting scan' : 'On track'}</p>
              </div>
              <div className="rounded-[1.15rem] border border-white/80 bg-white/78 px-4 py-3 shadow-sm backdrop-blur-md">
                <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-slate-400">Floor Readiness</p>
                <p className="mt-1 text-lg font-black text-slate-900">{selectedFloorStats.ready}/{selectedFloorStats.total}</p>
              </div>
              <div className="rounded-[1.15rem] border border-white/80 bg-white/78 px-4 py-3 shadow-sm backdrop-blur-md">
                <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-slate-400">Latest Scan</p>
                <p className="mt-1 text-lg font-black text-slate-900">{room.lastScan}</p>
              </div>
            </div>
          </div>

          <div className={`mt-1 rounded-[1.6rem] border border-white/80 bg-gradient-to-br ${pageTone.selectorBg} p-4 shadow-[0_24px_55px_-36px_rgba(15,23,42,0.22)] backdrop-blur-md`}>
            <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/80 bg-white/84 shadow-sm">
                  <Building2 size={15} className={pageTone.accentText} />
                </div>
                <p className="text-xs font-black uppercase tracking-[0.26em] text-slate-400">Select Floor</p>
              </div>
              <span className="rounded-full border border-white/80 bg-white/82 px-3 py-1 text-xs font-semibold text-slate-600 shadow-sm">
                Floor {selectedFloor} · {selectedFloorStats.pct}% ready
              </span>
            </div>

            <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-3">
              <div className="flex gap-3 sm:gap-2.5 overflow-x-auto flex-1 pb-1 -mx-1 px-1 snap-x snap-mandatory">
                {floorStats.map((fp) => {
                  const tone = getFloorPillTone(fp.pct);
                  const isSelected = selectedFloor === fp.floor;

                  return (
                    <button
                      key={fp.floor}
                      onClick={() => handleFloorChange(fp.floor)}
                      className={`min-w-[100px] sm:min-w-[90px] shrink-0 snap-start rounded-[1.1rem] border px-3.5 py-2.5 text-left transition-all duration-300 active:scale-[0.98] ${
                        isSelected
                          ? `border-transparent bg-gradient-to-br ${tone.active} text-white shadow-[0_22px_45px_-28px_rgba(15,23,42,0.35)]`
                          : 'border-white/80 bg-white/82 text-slate-700 shadow-sm hover:-translate-y-0.5 hover:shadow-lg'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-lg sm:text-xl font-black leading-none">F{fp.floor}</span>
                        <span className={`text-[9px] font-bold ${isSelected ? 'text-white/80' : tone.muted}`}>{fp.pct}%</span>
                      </div>
                      <div className={`mt-2 h-1 rounded-full ${isSelected ? 'bg-white/20' : 'bg-slate-100'}`}>
                        <div className={`h-1 rounded-full ${isSelected ? 'bg-white' : tone.rail}`} style={{ width: `${fp.pct}%` }} />
                      </div>
                      <p className={`mt-1.5 text-[10px] font-semibold ${isSelected ? 'text-white/80' : 'text-slate-500'}`}>{fp.ready}/{fp.total} ready</p>
                    </button>
                  );
                })}
              </div>

              {/* Inline Room Search */}
              <div className="relative shrink-0 w-full lg:w-64" ref={roomDropdownRef}>
                <p className="text-[9px] font-black uppercase tracking-[0.22em] text-slate-400/70 mb-1.5 text-right">Room</p>
                <div
                  className="flex items-center gap-2 rounded-xl border border-slate-200/80 bg-white/92 px-3.5 py-2.5 shadow-sm cursor-text transition-all focus-within:border-slate-300 focus-within:shadow-md"
                  onClick={() => setIsRoomDropdownOpen(true)}
                >
                  <Search size={14} className="text-slate-400 shrink-0" />
                  <input
                    value={roomSearchQuery}
                    onChange={(e) => {
                      setRoomSearchQuery(e.target.value);
                      setIsRoomDropdownOpen(true);
                    }}
                    onFocus={() => setIsRoomDropdownOpen(true)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && filteredRooms[0]) {
                        handleRoomChange(filteredRooms[0].number);
                      }
                    }}
                    placeholder="Find a room"
                    className="min-w-0 flex-1 bg-transparent text-sm font-semibold text-slate-700 outline-none placeholder:text-slate-400"
                  />
                  <ChevronDown size={14} className="text-slate-300 shrink-0" />
                </div>

                {isRoomDropdownOpen && (
                  <div className="absolute left-0 right-0 top-full z-[100] mt-2 max-h-64 overflow-y-auto rounded-[1.2rem] border border-white/80 bg-white/96 p-1.5 shadow-[0_36px_90px_-40px_rgba(15,23,42,0.35)] backdrop-blur-xl">
                    {filteredRooms.length > 0 ? (
                      filteredRooms.map((r) => (
                        <button
                          key={r.number}
                          onClick={() => handleRoomChange(r.number)}
                          className={`flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-left transition-all hover:bg-slate-50/90 ${
                            r.number === activeRoomNum ? 'bg-slate-50 shadow-sm' : ''
                          }`}
                        >
                          <div className={`h-2 w-2 rounded-full ${
                            r.status === 'pass' ? 'bg-emerald-500' : r.status === 'fail' ? 'bg-rose-500' : 'bg-slate-300'
                          }`} />
                          <span className="text-sm font-black text-slate-900">{r.number}</span>
                          <span className="text-xs font-medium text-slate-400">{r.type}</span>
                          {r.issues > 0 && (
                            <span className="ml-auto rounded-full border border-rose-200 bg-rose-50 px-1.5 py-0.5 text-[8px] font-bold text-rose-600">
                              {r.issues}
                            </span>
                          )}
                        </button>
                      ))
                    ) : (
                      <div className="rounded-xl px-3 py-4 text-sm font-medium text-slate-500">No rooms match.</div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Split-Screen Comparison */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 animate-fade-in-up stagger-3">
        {/* Master Photo */}
        <div className={`${panelShellClass} isolate border-slate-200/70 bg-gradient-to-br from-[#fffaf0] via-white to-[#fff3da]`}>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(251,191,36,0.18)_0,transparent_36%),radial-gradient(circle_at_bottom_right,rgba(16,185,129,0.10)_0,transparent_42%)] opacity-95" />
          <div className="relative z-10">
            <div className="flex items-center justify-between border-b border-white/70 bg-white/62 px-6 py-4 backdrop-blur-md">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 shadow-md shadow-amber-200 transition-transform duration-300 group-hover:scale-110">
                  <ScanSearch size={17} className="text-white" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-slate-900">Master Reference</h3>
                  <p className="text-[11px] font-medium text-slate-400">{room.type} · {activeCheckpoint.name} — {activeCheckpoint.zone}</p>
                </div>
              </div>
              <span className="rounded-full border border-amber-200 bg-amber-50/95 px-3 py-1 text-[10px] font-black uppercase tracking-[0.22em] text-amber-700">Baseline</span>
            </div>
            <div className="relative aspect-[16/10] overflow-hidden">
              <img
                src={masterImageSrc}
                alt="Master Reference — Bathroom Amenities"
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/35 via-black/10 to-transparent" />
              <div className="absolute bottom-5 right-5 flex items-center gap-2 rounded-xl border-2 border-dashed border-emerald-400 bg-emerald-50/75 px-3 py-2 backdrop-blur-sm">
                <CheckCircle size={12} className="text-emerald-500" />
                <span className="text-[9px] font-bold uppercase tracking-[0.18em] text-emerald-600">Dental Kit</span>
              </div>
              <div className="absolute bottom-5 left-5 flex items-center gap-2 rounded-xl border-2 border-dashed border-emerald-400 bg-emerald-50/75 px-3 py-2 backdrop-blur-sm">
                <CheckCircle size={12} className="text-emerald-500" />
                <span className="text-[9px] font-bold uppercase tracking-[0.18em] text-emerald-600">Body Lotion</span>
              </div>
            </div>
          </div>
        </div>

        {/* Housekeeper's Scan — Before / After Toggle */}
        <div className={`${panelShellClass} isolate border-slate-200/70 bg-gradient-to-br ${showAfter ? 'from-[#f2fdf8] via-white to-[#eefbf4]' : pageTone.comparisonScanBg}`}>
          <div className={`absolute inset-0 ${showAfter ? 'bg-[radial-gradient(circle_at_top_right,rgba(16,185,129,0.16)_0,transparent_36%),radial-gradient(circle_at_bottom_left,rgba(59,130,246,0.08)_0,transparent_42%)]' : pageTone.infoOverlay} opacity-95`} />
          <div className="relative z-10">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/70 bg-white/62 px-6 py-4 backdrop-blur-md">
              <div className="flex items-center gap-3">
                <div className={`flex h-10 w-10 items-center justify-center rounded-2xl shadow-md transition-transform duration-300 group-hover:scale-110 ${
                  showAfter ? 'bg-gradient-to-br from-emerald-400 to-emerald-500 shadow-emerald-200' : 'bg-gradient-to-br from-rose-400 to-pink-600 shadow-rose-200'
                }`}>
                  <Eye size={17} className="text-white" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-slate-900">{scanTitle}</h3>
                  <p className="text-[11px] font-medium text-slate-400">{scanSubtitle}</p>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => setShowAfter(!showAfter)}
                  className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold text-white shadow-sm transition-all active:scale-95 ${
                    showAfter
                      ? 'bg-gradient-to-r from-rose-500 to-rose-600 shadow-rose-200 hover:shadow-md'
                      : 'bg-gradient-to-r from-emerald-500 to-emerald-600 shadow-emerald-200 hover:shadow-md'
                  }`}
                >
                  <RotateCcw size={12} />
                  {showAfter ? '← Before' : 'After →'}
                </button>
              </div>
            </div>
            <div className="relative aspect-[16/10] overflow-hidden">
            {!showAfter ? (
              /* Before — flagged scan */
              <div className="w-full h-full relative overflow-hidden">
                <img
                  src={scanImageSrc}
                  alt="Housekeeper's Scan — Issues Detected"
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/35 via-black/10 to-transparent" />
                {/* Discrepancy annotations */}
                {discrepancies.length > 0 && (
                  <>
                    <div className="absolute bottom-12 right-5 flex items-center gap-2 rounded-xl border-2 border-rose-500 bg-rose-50/85 px-3 py-2 animate-pulse backdrop-blur-sm">
                      <XCircle size={12} className="text-rose-500" />
                      <span className="text-[9px] font-bold uppercase tracking-[0.18em] text-rose-600">{discrepancies[0]?.item.split('—')[1]?.trim() || 'Issue'}</span>
                    </div>
                    {discrepancies.length > 1 && (
                      <div className="absolute top-12 left-5 flex items-center gap-2 rounded-xl border-2 border-amber-500 bg-amber-50/85 px-3 py-2 backdrop-blur-sm">
                        <AlertTriangle size={12} className="text-amber-500" />
                        <span className="text-[9px] font-bold uppercase tracking-[0.18em] text-amber-600">{discrepancies[1]?.item.split('—')[1]?.trim() || 'Issue'}</span>
                      </div>
                    )}
                  </>
                )}
                <div className="absolute bottom-3 left-3 flex items-center gap-1.5 rounded-xl bg-rose-500/90 px-3 py-1.5 backdrop-blur-sm">
                  <AlertTriangle size={10} className="text-white" />
                  <span className="text-[10px] font-bold text-white">{discrepancies.length} issue{discrepancies.length !== 1 ? 's' : ''} flagged</span>
                </div>
              </div>
            ) : (
              /* After — corrected re-scan */
              <div className="w-full h-full relative overflow-hidden">
                <img
                  src="/master/08_Bathroom_Amenities_master.png"
                  alt="Re-Scan — All Issues Corrected"
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/30 via-black/10 to-transparent" />
                <div className="absolute bottom-5 right-5 flex items-center gap-2 rounded-xl border-2 border-dashed border-emerald-400 bg-emerald-50/75 px-3 py-2 backdrop-blur-sm">
                  <CheckCircle size={12} className="text-emerald-500" />
                  <span className="text-[9px] font-bold uppercase tracking-[0.18em] text-emerald-600">Dental Kit ✓</span>
                </div>
                <div className="absolute bottom-5 left-5 flex items-center gap-2 rounded-xl border-2 border-dashed border-emerald-400 bg-emerald-50/75 px-3 py-2 backdrop-blur-sm">
                  <CheckCircle size={12} className="text-emerald-500" />
                  <span className="text-[9px] font-bold uppercase tracking-[0.18em] text-emerald-600">Body Lotion ✓</span>
                </div>
                <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 items-center gap-1.5 rounded-xl bg-emerald-500/90 px-4 py-1.5 backdrop-blur-sm">
                  <CheckCircle size={10} className="text-white" />
                  <span className="text-[10px] font-bold text-white">Resolved by {room.housekeeper || 'Housekeeper'}</span>
                </div>
              </div>
            )}
          </div>
        </div>
        </div>
      </div>

      {/* Checkpoint Progress Strip — moved below comparison */}
      <div className={`${panelShellClass} isolate animate-fade-in-up stagger-3 border-slate-200/70 bg-gradient-to-br ${pageTone.summaryBg} p-6 !overflow-visible`}>
        <div className={`absolute inset-0 ${pageTone.summaryOverlay} opacity-95`} />
        <div className="relative z-10">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-2xl border border-white/80 bg-white/78 shadow-sm">
                <Shield size={16} className="text-blue-600" />
              </div>
              <div>
                <h2 className="text-xs font-black uppercase tracking-[0.3em] text-slate-400">Checkpoint Summary</h2>
                <p className="mt-1 text-sm font-medium text-slate-500">Click a checkpoint to compare its master & scan images above.</p>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-3 text-xs">
              <span className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50/90 px-3 py-1.5 shadow-sm"><div className="h-2 w-2 rounded-full bg-emerald-500" /> <strong className="text-emerald-600">{passCount}</strong> <span className="text-slate-400">passed</span></span>
              <span className="flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50/90 px-3 py-1.5 shadow-sm"><div className="h-2 w-2 rounded-full bg-rose-500" /> <strong className="text-rose-600">{failCount}</strong> <span className="text-slate-400">failed</span></span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2 md:grid-cols-4 xl:grid-cols-12">
          {checkpoints.map((cp, i) => (
            <div key={i} className="flex-1 group relative"
              onMouseEnter={() => setHoveredCheckpoint(i)}
              onMouseLeave={() => setHoveredCheckpoint(null)}
              onClick={() => setSelectedCheckpointIdx(i)}>
              <div className={`h-12 rounded-[1rem] flex items-center justify-center cursor-pointer transition-all duration-200 ${
                cp.status === 'pass' 
                  ? 'bg-gradient-to-br from-emerald-100 to-emerald-200/70 border border-emerald-200 hover:shadow-md hover:-translate-y-0.5' 
                  : 'bg-gradient-to-br from-rose-100 to-rose-200/70 border border-rose-200 hover:shadow-md hover:-translate-y-0.5'
              } ${selectedCheckpointIdx === i ? 'ring-2 ring-blue-500 ring-offset-1 shadow-lg -translate-y-1 scale-[1.04] z-20' : ''} ${hoveredCheckpoint === i && selectedCheckpointIdx !== i ? 'shadow-lg -translate-y-1.5 scale-[1.04] z-20' : ''}`}>
                {cp.status === 'pass' ? <CheckCircle size={14} className="text-emerald-600" /> : <XCircle size={14} className="text-rose-600" />}
              </div>
              <div className={`absolute bottom-full mb-3 left-1/2 -translate-x-1/2 z-50 transition-all duration-200 ${hoveredCheckpoint === i ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-1 pointer-events-none'}`}>
                <div className="px-3 py-2.5 bg-slate-900 text-white rounded-xl text-center shadow-2xl whitespace-nowrap">
                  <img src={cp.masterImg} alt={cp.name} className="w-32 h-20 object-contain rounded-lg mb-1.5 mx-auto bg-slate-800" />
                  <p className="text-[10px] font-bold">{cp.name}</p>
                  <p className="text-[8px] text-slate-400 mt-0.5">{cp.zone}</p>
                </div>
                <div className="w-2.5 h-2.5 bg-slate-900 rotate-45 mx-auto -mt-1.5" />
              </div>
            </div>
          ))}
          </div>
        </div>
      </div>

      {/* Discrepancy List + Impact Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Discrepancy List */}
        <div className={`${panelShellClass} isolate lg:col-span-2 animate-fade-in-up stagger-4 border-slate-200/70 bg-gradient-to-br ${pageTone.discrepancyBg} p-7`}>
          <div className={`absolute inset-0 ${pageTone.discrepancyOverlay} opacity-95`} />
          <div className="relative z-10">
            <div className="mb-6 flex flex-wrap items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-2xl border border-white/80 bg-white/78 shadow-sm">
                <Sparkles size={16} className="text-amber-600" />
              </div>
              <div>
                <h2 className="text-xs font-black uppercase tracking-[0.3em] text-slate-400">AI-Detected Discrepancies</h2>
                <p className="mt-1 text-sm font-medium text-slate-500">Actionable exceptions pulled from the live scan against the master standard.</p>
              </div>
              {discrepancies.length === 0 && <span className="ml-auto rounded-full border border-emerald-200 bg-emerald-50/90 px-3 py-1.5 text-xs font-bold text-emerald-500 shadow-sm">None detected ✓</span>}
            </div>
            {discrepancies.length > 0 ? (
            <div className="space-y-4">
              {discrepancies.map((d) => {
                const styles = d.severity === 'Critical'
                  ? { card: 'from-rose-50/95 via-white/70 to-white/40 border-rose-200 hover:border-rose-300', icon: 'bg-rose-100 shadow-rose-200', badge: 'bg-rose-500 text-white' }
                  : d.severity === 'Major'
                  ? { card: 'from-amber-50/95 via-white/70 to-white/40 border-amber-100 hover:border-amber-200', icon: 'bg-amber-100 shadow-amber-200', badge: 'bg-amber-500 text-white' }
                  : { card: 'from-blue-50/95 via-white/70 to-white/40 border-blue-100 hover:border-blue-200', icon: 'bg-blue-100 shadow-blue-200', badge: 'bg-blue-500 text-white' };

                return (
                  <div key={d.id} className={`p-6 rounded-[1.35rem] border bg-gradient-to-r ${styles.card} hover:shadow-[0_28px_60px_-38px_rgba(15,23,42,0.28)] hover:-translate-y-0.5 transition-all duration-300 cursor-pointer group backdrop-blur-sm`}>
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-11 h-11 rounded-2xl flex items-center justify-center shadow-sm ${styles.icon} transition-transform group-hover:scale-110`}>
                          <AlertTriangle size={18} className={d.severity === 'Critical' ? 'text-rose-500' : d.severity === 'Major' ? 'text-amber-500' : 'text-blue-500'} />
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{d.item}</h4>
                          <p className="text-xs text-slate-400 mt-0.5">{d.zone} zone</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-1 bg-slate-100 text-slate-500 rounded-full text-[9px] font-bold uppercase">{d.category}</span>
                        <span className={`px-2.5 py-1 rounded-full text-[9px] font-bold uppercase shadow-sm ${styles.badge}`}>{d.severity}</span>
                      </div>
                    </div>
                    <p className="text-sm leading-6 text-slate-500 mb-4">{d.description}</p>
                    <div className="flex flex-wrap items-center gap-4 pt-4 border-t border-black/5">
                      <div className="flex items-center gap-1.5 text-xs text-slate-400">
                        <Clock size={12} /> Flagged: <strong className="text-slate-600">{d.flaggedAt}</strong>
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-slate-400">
                        <CheckCircle size={12} className="text-emerald-500" /> Resolved: <strong className="text-emerald-600">{d.resolvedAt}</strong>
                      </div>
                      <span className="px-2.5 py-1 bg-emerald-50 text-emerald-600 rounded-full text-[9px] font-bold border border-emerald-200">✓ Fixed in {d.resolutionTime}</span>
                      <ArrowRight size={14} className="text-slate-300 ml-auto opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
              <div className="py-12 text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl border border-emerald-200 bg-emerald-50 shadow-lg">
                  <CheckCircle size={28} className="text-emerald-500" />
                </div>
                <p className="text-sm font-bold text-emerald-600">No discrepancies detected</p>
                <p className="mt-1 text-xs text-slate-400">This room passed all AI checkpoints</p>
              </div>
            )}

            <div className="mt-6 rounded-[1.45rem] border border-white/80 bg-white/80 p-5 shadow-[0_22px_50px_-34px_rgba(15,23,42,0.16)] backdrop-blur-md">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-white/80 bg-slate-50 shadow-sm">
                    <User size={16} className="text-slate-500" />
                  </div>
                  <div>
                    <h3 className="text-xs font-black uppercase tracking-[0.28em] text-slate-400">Room Details</h3>
                    <p className="mt-1 text-sm font-medium text-slate-500">Moved lower so the comparison stays visible as soon as the page opens.</p>
                  </div>
                </div>
                <span className={`rounded-full border px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.22em] ${pageTone.accentSurface}`}>
                  Room {room.number}
                </span>
              </div>

              <div className="mt-5 grid gap-3 lg:grid-cols-[minmax(0,1.08fr)_260px]">
                <div className="grid gap-3 lg:h-full lg:grid-rows-3">
                  <div className="flex h-full flex-col rounded-[1.25rem] border border-slate-200/70 bg-slate-50/80 p-4">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={`rounded-full border px-2.5 py-1 text-[9px] font-black uppercase tracking-[0.24em] ${pageTone.accentSurface}`}>
                        {roomStatusLabel}
                      </span>
                      <span className="text-xs font-bold uppercase tracking-[0.22em] text-slate-400">{room.type}</span>
                      <span className="text-xs font-semibold text-slate-400">Floor {room.floor}</span>
                    </div>
                    <p className="mt-3 text-lg font-black text-slate-900">Room {room.number}</p>
                    <p className="mt-2 max-w-xl text-sm leading-6 text-slate-500">{roomStatusCopy}</p>
                  </div>

                  <div className="flex h-full flex-col rounded-[1.25rem] border border-slate-200/70 bg-slate-50/80 p-4">
                    <div className="flex items-center gap-2 text-sm font-semibold text-slate-500">
                      <User size={14} className="text-slate-400" />
                      Assigned Housekeeper
                    </div>
                    <p className="mt-3 text-lg font-black text-slate-900">{room.housekeeper || 'Unassigned'}</p>
                    <p className="mt-1 text-xs text-slate-400">Latest owner of this inspection cycle.</p>
                  </div>

                  <div className="flex h-full flex-col rounded-[1.25rem] border border-slate-200/70 bg-slate-50/80 p-4">
                    <div className="flex items-center gap-2 text-sm font-semibold text-slate-500">
                      <Clock size={14} className="text-slate-400" />
                      Latest Scan
                    </div>
                    <p className="mt-3 text-lg font-black text-slate-900">{room.lastScan}</p>
                    <p className="mt-1 text-xs text-slate-400">Current scan in manager review queue.</p>
                  </div>
                </div>

                <div className="grid gap-3 lg:h-full lg:grid-rows-3">
                  <div className="flex h-full items-center rounded-[1.15rem] bg-emerald-50/90 px-4 py-3.5">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-emerald-500">Checklist Passed</p>
                        <p className="mt-2 text-2xl font-black text-emerald-600">{passCount}</p>
                      </div>
                      <CheckCircle size={18} className="text-emerald-500" />
                    </div>
                  </div>

                  <div className="flex h-full items-center rounded-[1.15rem] bg-rose-50/90 px-4 py-3.5">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-rose-500">Open Issues</p>
                        <p className="mt-2 text-2xl font-black text-rose-600">{room.status === 'fail' ? room.issues : 0}</p>
                      </div>
                      <AlertTriangle size={18} className="text-rose-500" />
                    </div>
                  </div>

                  <div className="flex h-full items-center rounded-[1.15rem] bg-sky-50/90 px-4 py-3.5">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-sky-500">Floor Ready</p>
                        <p className="mt-2 text-2xl font-black text-sky-600">{selectedFloorStats.pct}%</p>
                      </div>
                      <Building2 size={18} className="text-sky-500" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel — Impact + Actions */}
        <div className="space-y-5 animate-fade-in-up stagger-5">
          {/* Score Ring */}
          <div className={`${panelShellClass} isolate border-slate-200/70 bg-gradient-to-br ${pageTone.sideBg} p-6`}>
            <div className={`absolute inset-0 ${pageTone.sideOverlay} opacity-95`} />
            <div className="relative z-10">
              <div className="mb-5 flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl border border-white/80 bg-white/78 shadow-sm">
                  <Shield size={16} className="text-blue-600" />
                </div>
                <h2 className="text-xs font-black uppercase tracking-[0.3em] text-slate-400">Room Score</h2>
              </div>
              <div className="flex items-center gap-5">
                <div className="relative">
                  <ProgressRing percent={roomScore} />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-base font-black text-slate-900">{roomScore}%</span>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-slate-500"><strong className="text-emerald-600">{passCount}</strong> passed</p>
                  <p className="text-sm text-slate-500"><strong className="text-rose-600">{failCount}</strong> failed</p>
                  <p className="mt-1 text-xs text-slate-400">{checkpoints.length} total checkpoints</p>
                </div>
              </div>
            </div>
          </div>

          {/* Impact */}
          <div className={`${panelShellClass} isolate border-slate-200/70 bg-gradient-to-br ${pageTone.sideBg} p-6`}>
            <div className={`absolute inset-0 ${pageTone.sideOverlay} opacity-95`} />
            <div className="relative z-10">
              <div className="mb-5 flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl border border-white/80 bg-white/78 shadow-sm">
                  <IndianRupee size={16} className="text-emerald-600" />
                </div>
                <h2 className="text-xs font-black uppercase tracking-[0.3em] text-slate-400">Impact Estimate</h2>
              </div>
              <div className="space-y-3">
                <div className="rounded-2xl border border-emerald-200 bg-gradient-to-br from-emerald-50/95 to-emerald-100/60 p-4 shadow-sm transition-all hover:shadow-md">
                  <div className="mb-1 flex items-center gap-2">
                    <IndianRupee size={14} className="text-emerald-600" />
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600">Cost Avoided</span>
                  </div>
                  <span className="text-2xl font-black text-emerald-700">₹{1200 + (parseInt(room.number) % 10) * 300}</span>
                  <p className="mt-0.5 text-xs text-emerald-600">Replacement + service recovery</p>
                </div>
                <div className="rounded-2xl border border-blue-200 bg-gradient-to-br from-blue-50/95 to-blue-100/60 p-4 shadow-sm transition-all hover:shadow-md">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600">Resolution Time</span>
                  <span className="mt-1 block text-2xl font-black text-blue-700">{15 + (parseInt(room.number) % 15)} min</span>
                  <p className="mt-0.5 text-xs text-blue-500">From detection to re-scan</p>
                </div>
              </div>
            </div>
          </div>

          {/* Manager Actions */}
          <div className={`${panelShellClass} isolate border-slate-200/70 bg-gradient-to-br ${pageTone.sideBg} p-6`}>
            <div className={`absolute inset-0 ${pageTone.sideOverlay} opacity-95`} />
            <div className="relative z-10">
              <div className="mb-5 flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl border border-white/80 bg-white/78 shadow-sm">
                  <Ban size={16} className="text-amber-600" />
                </div>
                <h2 className="text-xs font-black uppercase tracking-[0.3em] text-slate-400">Manager Actions</h2>
              </div>
              <div className="space-y-3">
                <button className="group flex w-full items-center gap-3 rounded-2xl border border-amber-200 bg-gradient-to-r from-amber-50/95 to-orange-50/95 px-5 py-4 text-sm font-bold text-amber-700 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_26px_60px_-36px_rgba(245,158,11,0.55)] active:scale-[0.98]">
                  <div className="rounded-xl bg-amber-100 p-1.5 transition-transform group-hover:scale-110">
                    <Ban size={14} />
                  </div>
                  Approve Override
                </button>
                <p className="px-1 text-xs leading-6 text-slate-400">Dismiss this flag if the AI detection was incorrect. The system learns from overrides and reduces repeated false positives.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AIInspectionDetail() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center h-64"><div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" /></div>}>
      <AIInspectionDetailContent />
    </Suspense>
  );
}
