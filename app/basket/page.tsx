'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Shell from '@/components/Shell';
import InstitutionLogo from '@/components/InstitutionLogo';
import {
  Tag,
  GitCompare,
  Trash2,
  ExternalLink,
  MapPin,
  Building,
  Award,
  ArrowRight,
  BookmarkX,
  Search,
  CheckCircle2,
} from 'lucide-react';
import { College } from '@/lib/types';
import { toast } from 'sonner';

const COMPARE_ROWS = [
  { label: 'State & City', get: (c: College) => `${c.city}, ${c.state}` },
  { label: 'Institution Type', get: (c: College) => c.universityType },
  { label: 'Management / Ownership', get: (c: College) => c.ownership },
  { label: 'Established Year', get: (c: College) => c.establishedYear || '—' },
  { label: 'NIRF Overall Rank', get: (c: College) => (c.nirfOverallRank ? `#${c.nirfOverallRank}` : 'Unranked') },
  { label: 'NAAC Accreditation', get: (c: College) => (c.naacGrade ? `Grade ${c.naacGrade}` : 'Not accredited') },
  {
    label: 'Median Salary Package',
    get: (c: College) => (c.medianPackageLpa > 0 ? `${c.medianPackageLpa.toFixed(1)} LPA` : '—'),
  },
  {
    label: 'Highest Salary Package',
    get: (c: College) => (c.highestPackageLpa > 0 ? `${c.highestPackageLpa.toFixed(1)} LPA` : '—'),
  },
  {
    label: 'Entrance Exams Accepted',
    get: (c: College) => (c.examsAccepted?.length ? c.examsAccepted.slice(0, 3).join(', ') : 'Merit based'),
  },
  {
    label: 'Campus Size',
    get: (c: College) => (c.campusAreaAcres ? `${c.campusAreaAcres} Acres` : '—'),
  },
];

export default function BasketShortlistPage() {
  const [basket, setBasket] = useState<College[]>([]);
  const [compareMode, setCompareMode] = useState(false);
  const [toRemove, setToRemove] = useState<string | null>(null);

  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem('manifest-basket') || '[]');
      setBasket(stored);
    } catch {
      setBasket([]);
    }
  }, []);

  const saveBasket = (updated: College[]) => {
    setBasket(updated);
    localStorage.setItem('manifest-basket', JSON.stringify(updated));
  };

  const handleRemove = (id: string) => {
    const updated = basket.filter((c) => String(c.id) !== String(id));
    saveBasket(updated);
    setToRemove(null);
    toast.info('Institution removed from shortlist');
  };

  return (
    <Shell title="Shortlist" badgeText={`${basket.length} Saved`}>
      <div className="p-6 max-w-[1400px] mx-auto w-full flex flex-col gap-5">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-[22px] font-bold tracking-tight text-slate-900">
              Shortlist & Comparison
            </h1>
            <p className="text-[13px] text-slate-500 mt-0.5">
              Compare shortlisted colleges side-by-side or manage your application portfolio.
            </p>
          </div>

          {basket.length >= 2 && (
            <button
              onClick={() => setCompareMode((v) => !v)}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-[13px] font-semibold transition-all shadow-2xs ${
                compareMode
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              <GitCompare className="w-4 h-4" />
              <span>{compareMode ? 'Exit Matrix' : 'Compare Side-by-Side'}</span>
            </button>
          )}
        </div>

        {/* Content */}
        {basket.length === 0 ? (
          <div className="bg-white border border-slate-200/90 rounded-2xl p-16 text-center flex flex-col items-center justify-center shadow-2xs">
            <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400 mb-4 border border-slate-200/80">
              <BookmarkX className="w-7 h-7" />
            </div>
            <h3 className="text-[16px] font-bold text-slate-800">Your shortlist is empty</h3>
            <p className="text-[13px] text-slate-500 mt-1 max-w-sm">
              Explore institutions from the Playground or Directory and click the bookmark button to save them here.
            </p>
            <Link
              href="/colleges"
              className="mt-5 inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white font-semibold text-[13px] hover:bg-blue-700 transition-colors shadow-xs"
            >
              <Search className="w-4 h-4" />
              <span>Browse 70,623 Colleges</span>
            </Link>
          </div>
        ) : compareMode ? (
          /* Multi-College Comparison Table Matrix */
          <div className="bg-white border border-slate-200/90 rounded-2xl overflow-hidden shadow-2xs">
            <div className="p-4 border-b border-slate-200/80 bg-slate-50/50 flex items-center justify-between">
              <div className="text-[13px] font-semibold text-slate-800">
                Comparing {Math.min(4, basket.length)} shortlisted institutions
              </div>
              <button
                onClick={() => setCompareMode(false)}
                className="text-[12px] text-blue-600 hover:underline font-medium"
              >
                Back to cards
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-[13px]">
                <thead>
                  <tr className="border-b border-slate-200 bg-white">
                    <th className="py-4 px-4 w-[200px] text-slate-400 text-[11px] font-bold uppercase tracking-wider">
                      Metric
                    </th>
                    {basket.slice(0, 4).map((col) => (
                      <th key={col.id} className="py-4 px-4 min-w-[240px]">
                        <div className="flex items-start gap-3">
                          <InstitutionLogo name={col.name} size={38} />
                          <div className="min-w-0 pr-2">
                            <h4 className="font-bold text-[13.5px] text-slate-900 leading-snug truncate">
                              {col.name}
                            </h4>
                            <div className="text-[11.5px] text-slate-400">
                              {col.city}, {col.state}
                            </div>
                          </div>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {COMPARE_ROWS.map((row) => (
                    <tr key={row.label} className="hover:bg-slate-50/50">
                      <td className="py-3.5 px-4 font-semibold text-slate-500 text-[12px] bg-slate-50/40">
                        {row.label}
                      </td>
                      {basket.slice(0, 4).map((col) => (
                        <td key={col.id} className="py-3.5 px-4 font-medium text-slate-800">
                          {row.get(col)}
                        </td>
                      ))}
                    </tr>
                  ))}
                  {/* Action Row */}
                  <tr className="bg-slate-50/30">
                    <td className="py-4 px-4 font-semibold text-slate-500 text-[12px]">Actions</td>
                    {basket.slice(0, 4).map((col) => (
                      <td key={col.id} className="py-4 px-4">
                        <div className="flex items-center gap-2">
                          <Link
                            href={`/colleges/${col.id}`}
                            className="inline-flex items-center gap-1 text-[12px] font-semibold text-blue-600 hover:text-blue-800 bg-blue-50 px-2.5 py-1 rounded-md"
                          >
                            <span>Dossier</span>
                            <ArrowRight className="w-3 h-3" />
                          </Link>
                          <button
                            onClick={() => handleRemove(col.id)}
                            className="text-slate-400 hover:text-red-600 p-1 rounded"
                            title="Remove"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          /* Cards Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {basket.map((col) => (
              <div
                key={col.id}
                className="bg-white border border-slate-200/90 rounded-2xl p-5 hover:border-blue-300 hover:shadow-xs transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-start gap-3 min-w-0">
                      <InstitutionLogo name={col.name} size={44} />
                      <div className="min-w-0">
                        <h3 className="font-bold text-[14px] text-slate-900 leading-snug line-clamp-2">
                          {col.name}
                        </h3>
                        <div className="flex items-center gap-1 text-[12px] text-slate-500 mt-1">
                          <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span className="truncate">
                            {col.city}, {col.state}
                          </span>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => setToRemove(col.id)}
                      className="text-slate-400 hover:text-red-600 p-1.5 rounded-lg hover:bg-red-50 transition-colors shrink-0"
                      title="Remove from shortlist"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="flex flex-wrap gap-1.5 mb-3">
                    <span className="text-[11px] font-medium bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md">
                      {col.universityType}
                    </span>
                    {col.nirfOverallRank && (
                      <span className="text-[11px] font-bold bg-blue-50 text-blue-700 border border-blue-200/60 px-2 py-0.5 rounded-md">
                        NIRF #{col.nirfOverallRank}
                      </span>
                    )}
                    {col.naacGrade && (
                      <span className="text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200/60 px-2 py-0.5 rounded-md">
                        NAAC {col.naacGrade}
                      </span>
                    )}
                  </div>

                  <div className="bg-slate-50/80 rounded-xl p-3 mb-3 grid grid-cols-2 gap-2 text-[12px]">
                    <div>
                      <span className="text-slate-400 text-[10px] uppercase font-bold block">
                        Median Salary
                      </span>
                      <span className="font-bold text-slate-800 font-mono">
                        {col.medianPackageLpa > 0 ? `${col.medianPackageLpa.toFixed(1)} LPA` : '—'}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400 text-[10px] uppercase font-bold block">
                        Established
                      </span>
                      <span className="font-bold text-slate-800 font-mono">
                        {col.establishedYear || 1995}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <Link
                    href={`/colleges/${col.id}`}
                    className="text-[12.5px] font-semibold text-blue-600 hover:text-blue-800 inline-flex items-center gap-1"
                  >
                    <span>View complete dossier</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                  <span className="text-[11px] text-slate-400 font-mono">
                    AISHE: {col.code || 'Indexed'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {toRemove && (
          <div
            className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4"
            onClick={() => setToRemove(null)}
          >
            <div
              className="bg-white border border-slate-200 rounded-2xl p-6 max-w-[400px] w-full shadow-2xl animate-in fade-in zoom-in-95 duration-150"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-[16px] font-bold text-slate-900">Remove from shortlist?</h3>
              <p className="text-[13px] text-slate-500 mt-2 leading-relaxed">
                This will remove the selected institution from your shortlist and comparison matrix.
              </p>

              <div className="flex items-center justify-end gap-2.5 mt-6">
                <button
                  onClick={() => setToRemove(null)}
                  className="px-4 py-2 rounded-lg border border-slate-200 text-slate-700 text-[13px] font-semibold hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleRemove(toRemove)}
                  className="px-4 py-2 rounded-lg bg-red-600 text-white text-[13px] font-semibold hover:bg-red-700 transition-colors shadow-xs"
                >
                  Remove
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Shell>
  );
}
