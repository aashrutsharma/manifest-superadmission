'use client';

import React, { useState, useEffect, useCallback, useTransition } from 'react';
import { College } from '@/lib/types';
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Search,
  Database,
  Award,
  Crosshair,
  X,
  ChevronLeft,
  ChevronRight,
  Loader2,
} from 'lucide-react';
import InstitutionLogo from '@/components/InstitutionLogo';

interface DatabaseSpreadsheetModalProps {
  isOpen: boolean;
  onClose: () => void;
  colleges: College[];
  onSelectAndFocus: (college: College) => void;
  comparedIds?: string[];
  onToggleCompare?: (college: College) => void;
}

const CATEGORIES = ['All', 'IIT', 'Central University', 'NIT', 'Private Deemed', 'State Govt', 'College'];

export default function DatabaseSpreadsheetModal({
  isOpen,
  onClose,
  colleges: initialFallbackColleges,
  onSelectAndFocus,
  comparedIds = [],
  onToggleCompare,
}: DatabaseSpreadsheetModalProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [page, setPage] = useState<number>(1);
  const pageSize = 50;

  // Live Database State
  const [colleges, setColleges] = useState<College[]>(initialFallbackColleges);
  const [totalCount, setTotalCount] = useState<number>(70623);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [, startTransition] = useTransition();

  // Query API whenever modal opens, search changes, category changes, or page changes
  const fetchColleges = useCallback(async (query: string, category: string, pageNum: number) => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (query.trim()) params.set('q', query.trim());
      if (category !== 'All') params.set('type', category);
      params.set('page', String(pageNum));
      params.set('pageSize', String(pageSize));

      const res = await fetch(`/api/colleges?${params.toString()}`);
      if (!res.ok) throw new Error('Query failed');
      const data = await res.json();

      if (data && data.colleges) {
        startTransition(() => {
          setColleges(data.colleges);
          if (typeof data.totalCount === 'number') {
            setTotalCount(data.totalCount);
          }
        });
      }
    } catch {
      // Keep existing data or initial list on error
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Effect: triggered on open, search, category, or page
  useEffect(() => {
    if (!isOpen) return;

    const timer = setTimeout(() => {
      fetchColleges(searchTerm, activeCategory, page);
    }, searchTerm ? 300 : 0);

    return () => clearTimeout(timer);
  }, [isOpen, searchTerm, activeCategory, page, fetchColleges]);

  // Reset page to 1 when search or category changes
  const handleSearchChange = (val: string) => {
    setSearchTerm(val);
    setPage(1);
  };

  const handleCategoryChange = (cat: string) => {
    setActiveCategory(cat);
    setPage(1);
  };

  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="w-[96vw] max-w-[1380px] h-[92vh] max-h-[92vh] flex flex-col p-0 overflow-hidden bg-white rounded-2xl border border-slate-200/90 shadow-2xl">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 bg-slate-50/80 shrink-0">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#0b53c3] flex items-center justify-center text-white shadow-sm shrink-0">
                <Database className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <DialogTitle className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
                    Institution Registry Database
                  </DialogTitle>
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    Live Supabase
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  70,623+ verified degree-granting higher education institutions across 36 Indian states &amp; UTs
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs">
              <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-lg border border-slate-200 shadow-xs">
                {isLoading ? (
                  <Loader2 className="w-3.5 h-3.5 text-[#0b53c3] animate-spin" />
                ) : (
                  <span className="w-2 h-2 rounded-full bg-blue-600" />
                )}
                <span className="font-bold text-slate-900">{totalCount.toLocaleString()}</span>
                <span className="text-slate-500">institutions discovered</span>
              </div>
            </div>
          </div>

          {/* Search and Quick Filters */}
          <div className="mt-3.5 flex flex-col sm:flex-row items-center gap-2.5">
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <Input
                value={searchTerm}
                onChange={(e) => handleSearchChange(e.target.value)}
                placeholder="Search any of 70,623 colleges by name, AISHE code (e.g. U-0456), city, or state..."
                className="pl-9 pr-8 h-10 text-xs bg-white border-slate-200 rounded-xl font-medium focus-visible:ring-2 focus-visible:ring-[#0b53c3]"
              />
              {searchTerm && (
                <button
                  type="button"
                  onClick={() => handleSearchChange('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Category tabs */}
            <div className="flex items-center gap-1 overflow-x-auto w-full sm:w-auto p-1 bg-slate-200/70 rounded-xl shrink-0">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => handleCategoryChange(cat)}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap ${
                    activeCategory === cat
                      ? 'bg-white text-[#0b53c3] shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Table View */}
        <div className="flex-1 overflow-y-auto overflow-x-auto min-h-[300px] relative">
          <table className="w-full text-left text-xs border-collapse min-w-[800px]">
            <thead className="sticky top-0 bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px] z-10 shadow-xs">
              <tr>
                <th className="py-2.5 px-4 w-[38%]">Institution</th>
                <th className="py-2.5 px-3 w-[12%]">AISHE Code</th>
                <th className="py-2.5 px-3 w-[15%]">Location</th>
                <th className="py-2.5 px-3 w-[13%]">Category</th>
                <th className="py-2.5 px-3 w-[8%]">NIRF</th>
                <th className="py-2.5 px-3 w-[8%]">NAAC</th>
                <th className="py-2.5 px-4 text-right w-[14%]">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-normal">
              {isLoading && colleges.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-20 text-center text-slate-400">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <Loader2 className="w-6 h-6 text-[#0b53c3] animate-spin" />
                      <span className="text-xs font-medium text-slate-600">Querying 70,623 institution registry...</span>
                    </div>
                  </td>
                </tr>
              ) : colleges.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-16 text-center text-slate-400 text-xs">
                    <div className="max-w-md mx-auto space-y-1">
                      <p className="font-semibold text-slate-700">No institutions found matching &quot;{searchTerm}&quot;</p>
                      <p className="text-[11px] text-slate-400">Try searching for state names, city names, or AISHE codes.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                colleges.map((college) => {
                  const isCompared = comparedIds.includes(college.id);

                  return (
                    <tr
                      key={college.id}
                      className="hover:bg-blue-50/50 transition-colors group cursor-pointer"
                      onClick={() => onSelectAndFocus(college)}
                    >
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <InstitutionLogo
                            name={college.name}
                            shortName={college.shortName}
                            slug={college.slug}
                            code={college.code}
                            size="md"
                          />
                          <div className="min-w-0 flex-1">
                            <div className="font-bold text-slate-900 group-hover:text-[#0b53c3] transition-colors line-clamp-1 text-xs sm:text-sm">
                              {college.name}
                            </div>
                            <div className="text-[11px] text-slate-400 font-mono flex items-center gap-2 mt-0.5">
                              {college.shortName && <span>{college.shortName}</span>}
                              {college.establishedYear && (
                                <span>Est. {college.establishedYear}</span>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="py-3 px-3">
                        <span className="font-mono text-[11px] text-slate-700 bg-slate-100 px-2 py-0.5 rounded-md font-semibold border border-slate-200/80">
                          {college.aisheCode || college.code || 'U-INDEX'}
                        </span>
                      </td>

                      <td className="py-3 px-3 text-slate-600">
                        <div className="font-semibold text-slate-800 line-clamp-1">{college.city || 'India'}</div>
                        <div className="text-[11px] text-slate-400">{college.state}</div>
                      </td>

                      <td className="py-3 px-3">
                        <Badge variant="outline" className="text-[10px] font-semibold text-slate-600 border-slate-200 bg-slate-50/60">
                          {college.universityType || 'University'}
                        </Badge>
                      </td>

                      <td className="py-3 px-3">
                        {college.nirfOverallRank ? (
                          <span className="inline-flex items-center gap-1 font-bold text-[#0b53c3] bg-blue-50 border border-blue-100 px-2 py-0.5 rounded text-[11px]">
                            <Award className="w-3 h-3" />
                            #{college.nirfOverallRank}
                          </span>
                        ) : (
                          <span className="text-slate-300">&mdash;</span>
                        )}
                      </td>

                      <td className="py-3 px-3">
                        {college.naacGrade && college.naacGrade !== 'NA' ? (
                          <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 text-[10px]">
                            {college.naacGrade}
                          </span>
                        ) : (
                          <span className="text-slate-300">&mdash;</span>
                        )}
                      </td>

                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5" onClick={(e) => e.stopPropagation()}>
                          {onToggleCompare && (
                            <Button
                              size="sm"
                              variant={isCompared ? 'default' : 'outline'}
                              className={`h-7 px-2.5 text-[11px] font-semibold rounded-lg transition-all ${
                                isCompared
                                  ? 'bg-[#0b53c3] text-white hover:bg-[#09429e]'
                                  : 'text-slate-700 border-slate-200 hover:text-[#0b53c3] hover:border-[#0b53c3]'
                              }`}
                              onClick={() => onToggleCompare(college)}
                            >
                              {isCompared ? 'In Compare' : '+ Compare'}
                            </Button>
                          )}
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-7 px-2.5 text-[11px] font-semibold gap-1 text-[#0b53c3] hover:text-white hover:bg-[#0b53c3] rounded-lg"
                            onClick={() => {
                              onSelectAndFocus(college);
                              onClose();
                            }}
                          >
                            <Crosshair className="w-3 h-3" />
                            Focus
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Footer with Pagination */}
        <div className="p-3.5 sm:p-4 bg-slate-50 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500 shrink-0">
          <div className="flex items-center gap-2">
            <span>
              Showing {colleges.length > 0 ? (page - 1) * pageSize + 1 : 0} &ndash;{' '}
              {Math.min(page * pageSize, totalCount)} of {totalCount.toLocaleString()} verified institutions
            </span>
            {isLoading && <Loader2 className="w-3.5 h-3.5 text-[#0b53c3] animate-spin" />}
          </div>

          {/* Pagination Controls */}
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              disabled={page <= 1 || isLoading}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="h-8 px-2.5 text-xs font-semibold text-slate-700 disabled:opacity-40"
            >
              <ChevronLeft className="w-3.5 h-3.5 mr-1" />
              Previous
            </Button>

            <span className="text-xs font-semibold text-slate-800 px-2 font-mono">
              Page {page} of {totalPages.toLocaleString()}
            </span>

            <Button
              size="sm"
              variant="outline"
              disabled={page >= totalPages || isLoading}
              onClick={() => setPage((p) => p + 1)}
              className="h-8 px-2.5 text-xs font-semibold text-slate-700 disabled:opacity-40"
            >
              Next
              <ChevronRight className="w-3.5 h-3.5 ml-1" />
            </Button>

            <Button
              size="sm"
              variant="default"
              onClick={onClose}
              className="h-8 px-3.5 text-xs font-semibold bg-[#0b53c3] text-white hover:bg-[#09429e] rounded-lg ml-2"
            >
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
