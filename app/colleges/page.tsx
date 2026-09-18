'use client';

import React, { useState, useEffect, useCallback, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import Shell from '@/components/Shell';
import InstitutionLogo from '@/components/InstitutionLogo';
import {
  Search,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  ArrowRight,
  MapPin,
  Building,
  BookmarkPlus,
  SlidersHorizontal,
  GraduationCap,
  Award,
} from 'lucide-react';
import { queryCollegesFromDatabase, FetchCollegesResult } from '@/lib/collegeService';
import { College } from '@/lib/types';
import { toast } from 'sonner';

const STATES_LIST = [
  'All states',
  'Maharashtra',
  'Tamil Nadu',
  'Karnataka',
  'Uttar Pradesh',
  'Delhi',
  'Rajasthan',
  'Gujarat',
  'Telangana',
  'Kerala',
  'West Bengal',
  'Andhra Pradesh',
  'Madhya Pradesh',
  'Punjab',
  'Haryana',
  'Bihar',
];

const TYPES_LIST = [
  'All types',
  'Central University',
  'State University',
  'Deemed University',
  'Institute of National Importance',
  'Affiliated College',
  'Standalone',
];

const SORT_OPTIONS = [
  { value: 'nirf', label: 'NIRF Rank' },
  { value: 'package_desc', label: 'Highest Package' },
  { value: 'established', label: 'Established Year' },
  { value: 'name', label: 'Name A–Z' },
];

function CollegesDirectoryContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('q') || '';

  const [query, setQuery] = useState(initialQuery);
  const [selectedState, setSelectedState] = useState('All states');
  const [selectedType, setSelectedType] = useState('All types');
  const [sortBy, setSortBy] = useState<any>('nirf');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [dataResult, setDataResult] = useState<FetchCollegesResult>({
    colleges: [],
    totalCount: 70623,
    isLiveDatabase: true,
    page: 1,
    pageSize: 20,
    totalPages: 3532,
  });

  const loadColleges = useCallback(async () => {
    setLoading(true);
    try {
      const res = await queryCollegesFromDatabase({
        searchQuery: query.trim(),
        selectedStates: selectedState !== 'All states' ? [selectedState] : [],
        selectedStreams: [],
        selectedTypes: selectedType !== 'All types' ? [selectedType] : [],
        selectedOwnership: [],
        selectedNaac: [],
        sortBy,
        page,
        pageSize: 20,
      });
      setDataResult(res);
    } catch (err) {
      console.error('Error fetching colleges:', err);
    } finally {
      setLoading(false);
    }
  }, [query, selectedState, selectedType, sortBy, page]);

  useEffect(() => {
    loadColleges();
  }, [loadColleges]);

  const handleSaveToShortlist = (college: College) => {
    try {
      const saved: College[] = JSON.parse(localStorage.getItem('manifest-basket') || '[]');
      if (saved.find((s) => s.id === college.id)) {
        toast.info('Already in your shortlist');
      } else {
        localStorage.setItem('manifest-basket', JSON.stringify([...saved, college]));
        toast.success(`${college.name.slice(0, 28)}... added to shortlist!`);
      }
    } catch {
      toast.error('Could not save to shortlist');
    }
  };

  return (
    <div className="p-6 max-w-[1400px] mx-auto w-full flex flex-col gap-5">
      {/* 1. Header */}
      <div>
        <h1 className="text-[22px] font-bold tracking-tight text-slate-900">
          Institutions Directory
        </h1>
        <p className="text-[13px] text-slate-500 mt-0.5">
          Browse and filter across 70,623 higher education institutions in India.
        </p>
      </div>

      {/* 2. Filter Bar */}
      <div className="bg-white border border-slate-200/90 rounded-xl p-3 shadow-2xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 flex-1 min-w-[280px]">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setPage(1);
              }}
              placeholder="Search by name, city, state, or AISHE code..."
              className="w-full pl-9 pr-4 py-1.5 text-[13px] text-slate-800 bg-slate-50/50 border border-slate-200 rounded-lg outline-none hover:border-slate-300 focus:border-blue-500 focus:bg-white transition-all"
            />
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap text-[12.5px]">
          <select
            value={selectedState}
            onChange={(e) => {
              setSelectedState(e.target.value);
              setPage(1);
            }}
            className="px-2.5 py-1.5 border border-slate-200 rounded-lg bg-white text-slate-700 outline-none hover:border-slate-300"
          >
            {STATES_LIST.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>

          <select
            value={selectedType}
            onChange={(e) => {
              setSelectedType(e.target.value);
              setPage(1);
            }}
            className="px-2.5 py-1.5 border border-slate-200 rounded-lg bg-white text-slate-700 outline-none hover:border-slate-300"
          >
            {TYPES_LIST.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>

          <select
            value={sortBy}
            onChange={(e) => {
              setSortBy(e.target.value);
              setPage(1);
            }}
            className="px-2.5 py-1.5 border border-slate-200 rounded-lg bg-white text-slate-700 outline-none hover:border-slate-300"
          >
            {SORT_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                Sort: {o.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* 3. High-Fidelity Table */}
      <div className="bg-white border border-slate-200/90 rounded-2xl overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-[13px]">
            <thead>
              <tr className="border-b border-slate-200/80 bg-slate-50/75 text-[11px] font-bold uppercase tracking-wider text-slate-500 select-none">
                <th className="py-3 px-4 w-[42%]">Institution</th>
                <th className="py-3 px-4 w-[18%]">Location</th>
                <th className="py-3 px-4 w-[16%]">Type & Category</th>
                <th className="py-3 px-4 w-[10%]">Accreditation</th>
                <th className="py-3 px-4 w-[14%] text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                Array.from({ length: 10 }).map((_, idx) => (
                  <tr key={idx} className="animate-pulse">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-slate-200" />
                        <div className="space-y-1.5 flex-1">
                          <div className="h-3.5 bg-slate-200 rounded w-3/4" />
                          <div className="h-2.5 bg-slate-200 rounded w-1/3" />
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="h-3 bg-slate-200 rounded w-1/2" />
                    </td>
                    <td className="py-3 px-4">
                      <div className="h-3 bg-slate-200 rounded w-2/3" />
                    </td>
                    <td className="py-3 px-4">
                      <div className="h-3 bg-slate-200 rounded w-1/3" />
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="h-3 bg-slate-200 rounded w-1/2 ml-auto" />
                    </td>
                  </tr>
                ))
              ) : dataResult.colleges.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-16 text-center text-slate-500">
                    <Building className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                    <p className="font-semibold text-slate-700">No institutions found</p>
                    <p className="text-xs text-slate-400 mt-1">
                      Try clearing search terms or changing state filters.
                    </p>
                  </td>
                </tr>
              ) : (
                dataResult.colleges.map((col) => (
                  <tr
                    key={col.id}
                    className="hover:bg-slate-50/70 transition-colors group"
                  >
                    {/* Institution Column */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <InstitutionLogo name={col.name} size={36} />
                        <div className="min-w-0 pr-2">
                          <Link
                            href={`/colleges/${col.id}`}
                            className="font-semibold text-slate-900 hover:text-blue-600 transition-colors leading-snug line-clamp-1"
                          >
                            {col.name}
                          </Link>
                          <div className="flex items-center gap-2 text-[11.5px] text-slate-400 mt-0.5">
                            {col.code && (
                              <span className="font-mono text-[10.5px] text-slate-500 bg-slate-100 px-1.5 py-0.2 rounded">
                                {col.code}
                              </span>
                            )}
                            {col.establishedYear > 1800 && (
                              <span>Est. {col.establishedYear}</span>
                            )}
                            {col.nirfOverallRank && (
                              <span className="font-bold text-blue-700 bg-blue-50 border border-blue-200/60 px-1.5 py-0.2 rounded text-[10.5px]">
                                NIRF #{col.nirfOverallRank}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Location Column */}
                    <td className="py-3 px-4 text-slate-600">
                      <div className="flex items-center gap-1.5 truncate">
                        <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="truncate">
                          {col.city}, {col.state}
                        </span>
                      </div>
                    </td>

                    {/* Category Column */}
                    <td className="py-3 px-4">
                      <div className="flex flex-col gap-0.5 text-[12px]">
                        <span className="font-medium text-slate-800 truncate">
                          {col.universityType}
                        </span>
                        <span className="text-slate-400 text-[11px] truncate">
                          {col.ownership}
                        </span>
                      </div>
                    </td>

                    {/* Accreditation Column */}
                    <td className="py-3 px-4">
                      {col.naacGrade ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200/80 px-2 py-0.5 rounded-md">
                          <Award className="w-3 h-3" />
                          NAAC {col.naacGrade}
                        </span>
                      ) : (
                        <span className="text-slate-400 text-[11px]">—</span>
                      )}
                    </td>

                    {/* Actions Column */}
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleSaveToShortlist(col)}
                          className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                          title="Save to shortlist"
                        >
                          <BookmarkPlus className="w-4 h-4" />
                        </button>
                        <Link
                          href={`/colleges/${col.id}`}
                          className="inline-flex items-center gap-1 text-[12px] font-semibold text-blue-600 hover:text-blue-800 bg-blue-50/80 hover:bg-blue-100/80 px-2.5 py-1 rounded-md transition-colors"
                        >
                          <span>Dossier</span>
                          <ArrowRight className="w-3 h-3" />
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* 4. Pagination Footer */}
        <div className="flex items-center justify-between px-5 py-3 border-t border-slate-200/80 bg-slate-50/50 text-[12.5px] text-slate-600">
          <div>
            Showing{' '}
            <span className="font-semibold text-slate-800">
              {((page - 1) * 20 + 1).toLocaleString()}
            </span>{' '}
            to{' '}
            <span className="font-semibold text-slate-800">
              {Math.min(page * 20, dataResult.totalCount).toLocaleString()}
            </span>{' '}
            of{' '}
            <span className="font-semibold text-slate-800">
              {dataResult.totalCount.toLocaleString()}
            </span>{' '}
            institutions
          </div>

          <div className="flex items-center gap-2">
            <button
              disabled={page <= 1 || loading}
              onClick={() => {
                setPage((p) => p - 1);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="flex items-center gap-1 px-3 py-1 rounded-md border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed font-medium shadow-2xs"
            >
              <ChevronLeft className="w-3.5 h-3.5" /> Previous
            </button>

            <span className="font-mono text-xs px-2 text-slate-500">
              {page} / {dataResult.totalPages}
            </span>

            <button
              disabled={page >= dataResult.totalPages || loading}
              onClick={() => {
                setPage((p) => p - 1);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="flex items-center gap-1 px-3 py-1 rounded-md border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed font-medium shadow-2xs"
            >
              Next <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CollegesPage() {
  return (
    <Shell title="Institutions Directory" badgeText="70,623 Colleges">
      <Suspense fallback={<div className="p-8 text-slate-400 text-sm">Loading Directory...</div>}>
        <CollegesDirectoryContent />
      </Suspense>
    </Shell>
  );
}
