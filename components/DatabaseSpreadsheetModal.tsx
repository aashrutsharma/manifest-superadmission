'use client';

import React, { useState, useMemo } from 'react';
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


export default function DatabaseSpreadsheetModal({
  isOpen,
  onClose,
  colleges,
  onSelectAndFocus,
  comparedIds,
  onToggleCompare,
}: DatabaseSpreadsheetModalProps) {

  const [searchTerm, setSearchTerm] = useState('');
  const [activeStream, setActiveStream] = useState<string>('All');
  const [activeType, setActiveType] = useState<string>('All');

  const streams = ['All', 'Engineering', 'Management', 'Medical', 'Arts & Science', 'Law'];
  const types = ['All', 'IIT', 'Central University', 'NIT', 'Private Deemed', 'State Govt'];

  const filteredColleges = useMemo(() => {
    return colleges.filter((c) => {
      const matchesSearch =
        !searchTerm.trim() ||
        c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.state.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (c.aisheCode && c.aisheCode.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (c.shortName && c.shortName.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesStream =
        activeStream === 'All' ||
        (c.streams && c.streams.some((s) => s.toLowerCase().includes(activeStream.toLowerCase())));

      const matchesType =
        activeType === 'All' ||
        (c.universityType && c.universityType.toLowerCase().includes(activeType.toLowerCase()));

      return matchesSearch && matchesStream && matchesType;
    });
  }, [colleges, searchTerm, activeStream, activeType]);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-5xl max-h-[88vh] flex flex-col p-0 overflow-hidden bg-white rounded-2xl border border-slate-200/90 shadow-2xl">
        {/* Header */}
        <div className="p-5 border-b border-slate-100 bg-slate-50/70">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#0b53c3] flex items-center justify-center text-white shadow-sm">
                <Database className="w-4 h-4" />
              </div>
              <div>
                <DialogTitle className="text-lg font-bold text-slate-900 tracking-tight">
                  Institution Registry Database
                </DialogTitle>
                <p className="text-xs text-slate-500 mt-0.5">
                  72,000+ verified degree-granting higher education institutions across 36 Indian states &amp; UTs
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs text-slate-500 bg-white px-3 py-1.5 rounded-lg border border-slate-200">
              <span className="font-semibold text-slate-900">{filteredColleges.length}</span>
              <span>records listed</span>
            </div>
          </div>

          {/* Search and Quick Filters */}
          <div className="mt-4 flex flex-col sm:flex-row items-center gap-2.5">
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <Input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by institution name, AISHE code (e.g. U-0456), city, or state..."
                className="pl-9 h-9 text-xs bg-white border-slate-200 rounded-lg focus-visible:ring-[#0b53c3]"
              />
              {searchTerm && (
                <button
                  type="button"
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Stream tabs */}
            <div className="flex items-center gap-1 overflow-x-auto w-full sm:w-auto p-1 bg-slate-200/60 rounded-lg shrink-0">
              {streams.map((stream) => (
                <button
                  key={stream}
                  type="button"
                  onClick={() => setActiveStream(stream)}
                  className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-all whitespace-nowrap ${
                    activeStream === stream
                      ? 'bg-white text-[#0b53c3] shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {stream}
                </button>
              ))}
            </div>
          </div>

          {/* Type tabs */}
          <div className="mt-2.5 flex items-center gap-1.5 overflow-x-auto text-[11px]">
            <span className="text-slate-400 font-medium mr-1">Category:</span>
            {types.map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setActiveType(t)}
                className={`px-2 py-0.5 rounded-md border text-xs font-medium transition-colors ${
                  activeType === t
                    ? 'bg-[#0b53c3] text-white border-[#0b53c3]'
                    : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>


        {/* Table View */}
        <div className="flex-1 overflow-y-auto min-h-[350px]">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="sticky top-0 bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider text-[10px] z-10">
              <tr>
                <th className="py-2.5 px-4">Institution</th>
                <th className="py-2.5 px-3">AISHE</th>
                <th className="py-2.5 px-3">Location</th>
                <th className="py-2.5 px-3">Category</th>
                <th className="py-2.5 px-3">NIRF</th>
                <th className="py-2.5 px-3">NAAC</th>
                <th className="py-2.5 px-3">Median CTC</th>
                <th className="py-2.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-normal">
              {filteredColleges.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400 text-xs">
                    No institutions found matching your search parameters.
                  </td>
                </tr>
              ) : (
                filteredColleges.map((college) => (
                  <tr
                    key={college.id}
                    className="hover:bg-blue-50/40 transition-colors group cursor-pointer"
                    onClick={() => onSelectAndFocus(college)}
                  >
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2.5">
                        <InstitutionLogo
                          name={college.name}
                          shortName={college.shortName}
                          slug={college.slug}
                          code={college.code}
                          size="sm"
                        />
                        <div className="min-w-0">
                          <div className="font-bold text-slate-900 group-hover:text-[#0b53c3] transition-colors line-clamp-1">
                            {college.name}
                          </div>
                          <div className="text-[11px] text-slate-400 font-mono">
                            {college.shortName || college.code}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-3">
                      <span className="font-mono text-[11px] text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded font-semibold">
                        {college.aisheCode || 'U-INDEX'}
                      </span>
                    </td>

                    <td className="py-3 px-3 text-slate-600">
                      <div className="font-medium text-slate-800">{college.city}</div>
                      <div className="text-[10px] text-slate-400">{college.state}</div>
                    </td>

                    <td className="py-3 px-3">
                      <Badge variant="outline" className="text-[10px] font-medium text-slate-600 border-slate-200">
                        {college.universityType || 'University'}
                      </Badge>
                    </td>

                    <td className="py-3 px-3">
                      {college.nirfOverallRank ? (
                        <span className="inline-flex items-center gap-1 font-bold text-[#0b53c3] bg-blue-50 border border-blue-100 px-1.5 py-0.5 rounded text-[11px]">
                          <Award className="w-3 h-3" />
                          #{college.nirfOverallRank}
                        </span>
                      ) : (
                        <span className="text-slate-400">&mdash;</span>
                      )}
                    </td>

                    <td className="py-3 px-3">
                      {college.naacGrade && college.naacGrade !== 'NA' ? (
                        <span className="font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200 text-[10px]">
                          {college.naacGrade}
                        </span>
                      ) : (
                        <span className="text-slate-400">&mdash;</span>
                      )}
                    </td>

                    <td className="py-3 px-3 font-bold text-slate-900">
                      {college.medianPackageLpa ? `₹${college.medianPackageLpa} LPA` : '—'}
                    </td>

                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {onToggleCompare && (
                          <Button
                            size="sm"
                            variant={comparedIds?.includes(college.id) ? 'default' : 'outline'}
                            className={`h-7 px-2 text-[11px] font-semibold rounded-lg ${
                              comparedIds?.includes(college.id)
                                ? 'bg-[#0b53c3] text-white'
                                : 'text-slate-600 border-slate-200 hover:text-[#0b53c3]'
                            }`}
                            onClick={(e) => {
                              e.stopPropagation();
                              onToggleCompare(college);
                            }}
                          >
                            {comparedIds?.includes(college.id) ? 'In Compare' : '+ Compare'}
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-7 text-xs font-semibold gap-1 text-[#0b53c3] hover:text-white hover:bg-[#0b53c3]"
                          onClick={(e) => {
                            e.stopPropagation();
                            onSelectAndFocus(college);
                          }}
                        >
                          <Crosshair className="w-3.5 h-3.5" />
                          Focus
                        </Button>
                      </div>
                    </td>
                  </tr>

                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <div>
            Data sourced from official AISHE census tables and NIRF 2024 Gazette listings.
          </div>
          <Button
            size="sm"
            variant="outline"
            onClick={onClose}
            className="text-xs text-slate-700"
          >
            Close Database
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
