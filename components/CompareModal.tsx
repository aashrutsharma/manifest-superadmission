'use client';

import React from 'react';
import { College } from '@/lib/types';
import InstitutionLogo from '@/components/InstitutionLogo';
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  X,
  Award,
  Trash2,
  Layers,
} from 'lucide-react';


interface CompareModalProps {
  comparedColleges: College[];
  isOpen: boolean;
  onClose: () => void;
  onRemoveCollege: (collegeId: string) => void;
  onClearAll: () => void;
}

export default function CompareModal({
  comparedColleges,
  isOpen,
  onClose,
  onRemoveCollege,
  onClearAll,
}: CompareModalProps) {

  if (!isOpen || comparedColleges.length === 0) return null;

  // Compute best package and lowest fee
  const maxMedianPackage = Math.max(...comparedColleges.map((c) => c.medianPackageLpa || 0));
  const minAnnualFee = Math.min(...comparedColleges.map((c) => c.avgAnnualFeeMin || 999));

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="w-[96vw] max-w-[1360px] max-h-[92vh] flex flex-col p-0 overflow-hidden bg-white rounded-2xl border border-slate-200/90 shadow-2xl">
        {/* Header */}
        <div className="p-5 border-b border-slate-100 bg-slate-50/80 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#0b53c3] flex items-center justify-center text-white shadow-xs">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <DialogTitle className="text-base font-bold text-slate-900 tracking-tight">
                Dynamic Benchmark Comparison Matrix ({comparedColleges.length}/4)
              </DialogTitle>
              <p className="text-xs text-slate-500 mt-0.5">
                Side-by-side comparative evaluation for student decision-making
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onClearAll}
              className="text-xs text-rose-600 hover:text-rose-700 hover:bg-rose-50 border-rose-200 gap-1"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Clear All
            </Button>
          </div>
        </div>

        {/* Matrix Table */}
        <div className="flex-1 overflow-x-auto overflow-y-auto p-5 text-xs">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="py-3 px-3 w-[160px] text-[11px] font-bold uppercase tracking-wider text-slate-400 bg-slate-50/50">
                  Metric
                </th>
                {comparedColleges.map((college) => (
                  <th key={college.id} className="py-3 px-4 min-w-[210px] align-top">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <InstitutionLogo
                          name={college.name}
                          shortName={college.shortName}
                          slug={college.slug}
                          code={college.code}
                          size="sm"
                        />
                        <div>
                          <div className="font-bold text-slate-900 text-xs line-clamp-1">
                            {college.shortName || college.name}
                          </div>
                          <div className="text-[10px] text-slate-400">
                            {college.city}, {college.state}
                          </div>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => onRemoveCollege(college.id)}
                        className="text-slate-300 hover:text-rose-600 p-1 rounded transition-colors"
                        aria-label={`Remove ${college.name}`}
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {/* NIRF Rank */}
              <tr>
                <td className="py-3 px-3 font-semibold text-slate-700 bg-slate-50/50">NIRF Overall Rank</td>
                {comparedColleges.map((c) => (
                  <td key={c.id} className="py-3 px-4">
                    {c.nirfOverallRank ? (
                      <Badge className="bg-[#0b53c3] text-white font-bold text-[11px] gap-1">
                        <Award className="w-3 h-3" />
                        #{c.nirfOverallRank}
                      </Badge>
                    ) : (
                      <span className="text-slate-400">Unranked</span>
                    )}
                  </td>
                ))}
              </tr>

              {/* NAAC Grade */}
              <tr>
                <td className="py-3 px-3 font-semibold text-slate-700 bg-slate-50/50">NAAC Grade</td>
                {comparedColleges.map((c) => (
                  <td key={c.id} className="py-3 px-4">
                    {c.naacGrade && c.naacGrade !== 'NA' ? (
                      <Badge variant="outline" className="text-emerald-700 bg-emerald-50 border-emerald-200 font-semibold text-[11px]">
                        NAAC {c.naacGrade} {c.naacCgpa ? `(${c.naacCgpa})` : ''}
                      </Badge>
                    ) : (
                      <span className="text-slate-400">Not Assessed</span>
                    )}
                  </td>
                ))}
              </tr>

              {/* Median Package */}
              <tr>
                <td className="py-3 px-3 font-semibold text-slate-700 bg-slate-50/50">Median CTC (LPA)</td>
                {comparedColleges.map((c) => {
                  const isTop = c.medianPackageLpa && c.medianPackageLpa === maxMedianPackage && comparedColleges.length > 1;
                  return (
                    <td key={c.id} className="py-3 px-4">
                      <div className="font-bold text-slate-900 text-sm">
                        {c.medianPackageLpa ? `₹${c.medianPackageLpa} LPA` : '—'}
                      </div>
                      {isTop && (
                        <span className="inline-block mt-0.5 text-[9px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                          Highest CTC in Selection
                        </span>
                      )}
                    </td>
                  );
                })}
              </tr>

              {/* Annual Tuition */}
              <tr>
                <td className="py-3 px-3 font-semibold text-slate-700 bg-slate-50/50">Annual Tuition</td>
                {comparedColleges.map((c) => {
                  const isLowest = c.avgAnnualFeeMin && c.avgAnnualFeeMin === minAnnualFee && comparedColleges.length > 1;
                  return (
                    <td key={c.id} className="py-3 px-4">
                      <div className="font-bold text-slate-900">
                        {c.avgAnnualFeeMin ? `₹${c.avgAnnualFeeMin} L / yr` : '—'}
                      </div>
                      {isLowest && (
                        <span className="inline-block mt-0.5 text-[9px] font-bold text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-200">
                          Lowest Fee
                        </span>
                      )}
                    </td>
                  );
                })}
              </tr>

              {/* Accepted Entrance Exams */}
              <tr>
                <td className="py-3 px-3 font-semibold text-slate-700 bg-slate-50/50">Accepted Exams</td>
                {comparedColleges.map((c) => (
                  <td key={c.id} className="py-3 px-4">
                    <div className="flex flex-wrap gap-1">
                      {(c.examsAccepted || ['Merit Based']).map((exam) => (
                        <span key={exam} className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 text-[10px] font-medium">
                          {exam}
                        </span>
                      ))}
                    </div>
                  </td>
                ))}
              </tr>

              {/* Ownership & Category */}
              <tr>
                <td className="py-3 px-3 font-semibold text-slate-700 bg-slate-50/50">Category</td>
                {comparedColleges.map((c) => (
                  <td key={c.id} className="py-3 px-4 text-slate-600">
                    <div>{c.ownership || 'Public'}</div>
                    <div className="text-[10px] text-slate-400">{c.universityType || 'University'}</div>
                  </td>
                ))}
              </tr>

              {/* Campus Size */}
              <tr>
                <td className="py-3 px-3 font-semibold text-slate-700 bg-slate-50/50">Campus Area</td>
                {comparedColleges.map((c) => (
                  <td key={c.id} className="py-3 px-4 text-slate-700">
                    {c.campusAreaAcres ? `${c.campusAreaAcres} Acres` : '—'}
                  </td>
                ))}
              </tr>

              {/* Top Recruiters */}
              <tr>
                <td className="py-3 px-3 font-semibold text-slate-700 bg-slate-50/50">Top Recruiters</td>
                {comparedColleges.map((c) => (
                  <td key={c.id} className="py-3 px-4">
                    <div className="text-[11px] text-slate-600 line-clamp-2">
                      {c.topRecruiters?.join(', ') || 'Global & National corporate partners'}
                    </div>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
          <div className="text-xs text-slate-500">
            Compare data synchronized with official AISHE 2024-25 and NIRF registers.
          </div>
          <Button size="sm" onClick={onClose} className="bg-[#0b53c3] hover:bg-[#09429e] text-white text-xs">
            Close Matrix
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
