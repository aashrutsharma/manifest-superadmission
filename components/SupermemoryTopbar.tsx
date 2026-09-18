'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ExternalLink, ChevronDown, Sparkles, HelpCircle, Layers } from 'lucide-react';

interface SupermemoryTopbarProps {
  currentTitle?: string;
  badgeText?: string;
  onOpenSearch?: () => void;
}

export default function SupermemoryTopbar({
  currentTitle = 'Playground',
  badgeText = '70,623 Institutions',
  onOpenSearch,
}: SupermemoryTopbarProps) {
  return (
    <header className="h-[52px] border-b border-slate-200/80 bg-white/95 backdrop-blur-xs sticky top-0 z-30 flex items-center justify-between px-5 select-none">
      {/* Left side: Context Pills */}
      <div className="flex items-center gap-3">
        {/* User Workspace Pill */}
        <div className="flex items-center gap-1.5 bg-slate-100/90 hover:bg-slate-200/80 transition-colors px-2.5 py-1 rounded-full text-[12.5px] font-medium text-slate-800 cursor-pointer border border-slate-200/60">
          <div className="w-4 h-4 rounded-full bg-blue-600 text-white flex items-center justify-center text-[9px] font-bold">
            A
          </div>
          <span>Aashrut Sharma</span>
          <span className="text-[10.5px] font-semibold text-slate-400 bg-white/80 px-1.5 py-0.2 rounded-full border border-slate-200/40">
            Free
          </span>
          <ChevronDown className="w-3.5 h-3.5 text-slate-400 -ml-0.5" />
        </div>

        {/* Database Scope Pill */}
        <div className="hidden sm:flex items-center gap-1.5 bg-slate-50 hover:bg-slate-100 transition-colors px-2.5 py-1 rounded-full text-[12px] font-medium text-slate-600 border border-slate-200/60">
          <Layers className="w-3.5 h-3.5 text-blue-600" />
          <span>All Institutions ({badgeText})</span>
          <ChevronDown className="w-3 h-3 text-slate-400" />
        </div>
      </div>

      {/* Right side: Navigation & Actions */}
      <div className="flex items-center gap-3 text-[12.5px]">
        <button
          onClick={onOpenSearch}
          className="hidden md:flex items-center gap-2 px-2.5 py-1 rounded-lg border border-slate-200 text-slate-500 hover:text-slate-800 hover:bg-slate-50 text-[12px] font-medium transition-colors"
        >
          <span>Search database...</span>
          <kbd className="px-1.5 py-0.5 text-[10px] font-mono bg-slate-100 border border-slate-200 rounded text-slate-500">⌘K</kbd>
        </button>

        <a
          href="https://superadmission.com"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 text-slate-500 hover:text-slate-900 transition-colors px-2 py-1 rounded-md"
        >
          <HelpCircle className="w-3.5 h-3.5 text-slate-400" />
          <span>Help</span>
        </a>

        <a
          href="https://superadmission.com"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 text-slate-500 hover:text-slate-900 transition-colors px-2 py-1 rounded-md"
        >
          <span>Docs</span>
          <ExternalLink className="w-3 h-3 text-slate-400" />
        </a>
      </div>
    </header>
  );
}
