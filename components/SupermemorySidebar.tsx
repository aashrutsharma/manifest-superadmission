'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import {
  Search,
  Plus,
  Terminal,
  FileText,
  Tag,
  Share2,
  Activity,
  LineChart,
  Database,
  CheckCircle2,
  MoreHorizontal,
  GraduationCap,
} from 'lucide-react';

interface SupermemorySidebarProps {
  onOpenSearch?: () => void;
}

export default function SupermemorySidebar({ onOpenSearch }: SupermemorySidebarProps) {
  const pathname = usePathname();

  const mainNav = [
    { label: 'Playground', href: '/stream', icon: Terminal, match: ['/stream', '/'] },
    { label: 'Institutions', href: '/colleges', icon: GraduationCap, match: ['/colleges'] },
    { label: 'Shortlist', href: '/basket', icon: Tag, match: ['/basket'] },
    { label: 'Memory Graph', href: '/canvas', icon: Share2, match: ['/canvas'] },
    { label: 'Analytics', href: '/metrics', icon: Activity, match: ['/metrics'] },
  ];

  return (
    <aside className="w-[230px] border-r border-slate-200/90 bg-[#FBFBFC] flex flex-col h-screen fixed top-0 left-0 z-40 select-none">
      {/* 1. Header Logo with console-logo.png */}
      <div className="h-[52px] flex items-center justify-between px-4 border-b border-slate-200/80 bg-white">
        <Link href="/stream" className="flex items-center gap-2">
          <div className="h-[24px] flex items-center">
            <Image
              src="/console-logo.png"
              alt="Manifest Console"
              width={110}
              height={24}
              className="object-contain"
              priority
            />
          </div>
        </Link>
        <span className="text-[10px] font-semibold text-blue-700 bg-blue-50 border border-blue-200/60 px-1.5 py-0.5 rounded-full">
          70k+
        </span>
      </div>

      {/* 2. Top search trigger & action */}
      <div className="p-3 pb-1 flex flex-col gap-2">
        <button
          type="button"
          onClick={onOpenSearch}
          className="w-full flex items-center justify-between px-3 py-2 rounded-lg border border-slate-200/90 bg-white text-slate-500 hover:text-slate-800 hover:border-slate-300 transition-all text-[12.5px] shadow-2xs group"
        >
          <div className="flex items-center gap-2">
            <Search className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-600 transition-colors" />
            <span>Search...</span>
          </div>
          <kbd className="px-1.5 py-0.5 text-[10px] font-mono bg-slate-100 border border-slate-200 rounded text-slate-400 group-hover:text-slate-600">
            ⌘K
          </kbd>
        </button>

        <Link
          href="/stream"
          className="w-full flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-200/60 bg-white hover:bg-slate-50 text-slate-700 font-medium text-[12.5px] transition-colors shadow-2xs"
        >
          <Plus className="w-3.5 h-3.5 text-slate-500" />
          <span>New Query</span>
        </Link>
      </div>

      {/* 3. Navigation Sections */}
      <div className="flex-1 overflow-y-auto px-2 py-2 flex flex-col gap-5">
        {/* Main section */}
        <div className="flex flex-col gap-0.5">
          {mainNav.map((item) => {
            const Icon = item.icon;
            const isActive = item.match.some((m) =>
              m === '/' ? pathname === '/' : pathname.startsWith(m)
            );
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13px] font-medium transition-all ${
                  isActive
                    ? 'bg-[#EFF6FF] text-[#1E40AF] font-semibold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                }`}
              >
                <Icon
                  className={`w-4 h-4 ${
                    isActive ? 'text-[#2563EB]' : 'text-slate-400'
                  }`}
                  strokeWidth={isActive ? 2 : 1.75}
                />
                <span className="flex-1">{item.label}</span>
                {item.label === 'Institutions' && (
                  <span className="text-[10px] text-slate-400 font-mono">70k</span>
                )}
              </Link>
            );
          })}
        </div>

        {/* Analytics Section */}
        <div>
          <div className="px-3 mb-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Analytics
          </div>
          <div className="flex flex-col gap-0.5">
            <Link
              href="/metrics"
              className="flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-[12.5px] text-slate-600 hover:text-slate-900 hover:bg-slate-100/70 transition-colors"
            >
              <LineChart className="w-3.5 h-3.5 text-slate-400" />
              <span>User Insights</span>
            </Link>
          </div>
        </div>

        {/* Database Section */}
        <div>
          <div className="px-3 mb-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Database
          </div>
          <div className="flex flex-col gap-0.5">
            <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-[12px] text-slate-600">
              <Database className="w-3.5 h-3.5 text-blue-600" />
              <span className="flex-1">Supabase DB</span>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            </div>
            <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-[12px] text-slate-600">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>AISHE Verified</span>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Bottom "What's new" card */}
      <div className="p-2 border-t border-slate-200/70 bg-white">
        <div className="p-3 rounded-lg border border-slate-200/80 bg-slate-50/70 text-[11.5px]">
          <div className="flex items-center justify-between text-slate-400 mb-1 text-[10.5px]">
            <span className="font-semibold text-slate-700">What&apos;s new</span>
            <span>19 Sept</span>
          </div>
          <p className="text-slate-600 font-medium leading-relaxed">
            70,623 colleges indexed in India higher education database.
          </p>
        </div>

        {/* 5. User profile bar */}
        <div className="flex items-center justify-between mt-2 pt-2 px-1">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center font-bold text-[10px]">
              AS
            </div>
            <span className="text-[12px] font-semibold text-slate-800 truncate max-w-[120px]">
              Aashrut Sharma
            </span>
          </div>
          <button className="text-slate-400 hover:text-slate-700 p-1 rounded" title="Settings">
            <MoreHorizontal className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </aside>
  );
}
