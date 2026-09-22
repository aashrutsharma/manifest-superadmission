'use client';

import React from 'react';
import { College } from '@/lib/types';
import InstitutionLogo from '@/components/InstitutionLogo';
import { Layers, X, ArrowRight, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ComparisonFloatingBarProps {
  comparedColleges: College[];
  onOpenCompareModal: () => void;
  onRemoveCollege: (collegeId: string) => void;
  onClearAll: () => void;
}

export default function ComparisonFloatingBar({
  comparedColleges,
  onOpenCompareModal,
  onRemoveCollege,
  onClearAll,
}: ComparisonFloatingBarProps) {
  if (comparedColleges.length === 0) return null;

  return (
    <div className="fixed top-16 left-1/2 -translate-x-1/2 z-30 bg-slate-900/95 text-white backdrop-blur-xl px-3 sm:px-4 py-1.5 sm:py-2 rounded-full border border-slate-700/80 shadow-2xl flex items-center gap-2 sm:gap-3 animate-fade-up select-none max-w-[calc(100vw-24px)] overflow-x-auto">
      <div className="flex items-center gap-2">
        <div className="w-6 h-6 rounded-full bg-[#0b53c3] flex items-center justify-center text-white text-xs font-bold shadow-xs">
          <Layers className="w-3.5 h-3.5" />
        </div>
        <span className="text-xs font-bold tracking-tight">
          Comparing ({comparedColleges.length}/4)
        </span>
      </div>

      {/* College mini pills */}
      <div className="flex items-center gap-1.5">
        {comparedColleges.map((college) => (
          <div
            key={college.id}
            className="flex items-center gap-1.5 bg-slate-800/90 hover:bg-slate-800 border border-slate-700/60 rounded-full pl-1.5 pr-2 py-0.5 text-xs text-slate-200"
          >
            <InstitutionLogo
              name={college.name}
              shortName={college.shortName}
              slug={college.slug}
              code={college.code}
              size="xs"
            />
            <span className="font-medium text-[11px] truncate max-w-[100px]">
              {college.shortName || college.name}
            </span>
            <button
              type="button"
              onClick={() => onRemoveCollege(college.id)}
              className="text-slate-400 hover:text-white transition-colors"
              aria-label={`Remove ${college.name}`}
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        ))}
      </div>

      <div className="h-4 w-[1px] bg-slate-700 mx-1" />

      {/* View Matrix button */}
      <Button
        size="sm"
        onClick={onOpenCompareModal}
        className="h-7 px-3 bg-[#0b53c3] hover:bg-[#09429e] text-white text-xs font-bold rounded-full gap-1 shadow-xs"
      >
        <span>Compare Matrix</span>
        <ArrowRight className="w-3 h-3" />
      </Button>

      <button
        type="button"
        onClick={onClearAll}
        className="text-slate-400 hover:text-rose-400 p-1 rounded-full transition-colors"
        title="Clear all"
      >
        <Trash2 className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}

