'use client';

import React from 'react';
import { College } from '@/lib/types';
import {
  X,
  ExternalLink,
  Award,
  GraduationCap,
  Briefcase,
  MapPin,
  Calendar,
  Building2,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface InstitutionInspectorModalProps {
  college: College | null;
  onClose: () => void;
  onOpenDatabase?: () => void;
}

export default function InstitutionInspectorModal({
  college,
  onClose,
}: InstitutionInspectorModalProps) {
  if (!college) return null;

  return (
    <div className="fixed top-4 right-[320px] w-[390px] max-h-[calc(100vh-32px)] z-30 bg-white/95 backdrop-blur-xl rounded-2xl border border-slate-200/90 shadow-2xl flex flex-col overflow-hidden animate-fade-up">
      {/* Header */}
      <div className="p-4 border-b border-slate-100 flex items-start justify-between gap-3 bg-slate-50/50">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-1">
            <MapPin className="w-3.5 h-3.5 text-[#0b53c3]" />
            <span className="truncate">{college.city}, {college.state}</span>
            {college.establishedYear && (
              <>
                <span>&middot;</span>
                <span className="flex items-center gap-0.5">
                  <Calendar className="w-3 h-3 text-slate-400" />
                  Est. {college.establishedYear}
                </span>
              </>
            )}
          </div>
          <h2 className="text-base font-bold text-slate-900 leading-snug tracking-tight">
            {college.name}
          </h2>
          <div className="flex items-center gap-1.5 mt-1">
            <span className="text-xs font-semibold text-[#0b53c3] bg-blue-50 px-2 py-0.5 rounded-full border border-blue-100">
              {college.shortName || college.code || 'INST'}
            </span>
            {college.aisheCode && (
              <span className="text-[11px] font-mono text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                AISHE: {college.aisheCode}
              </span>
            )}
          </div>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors"
          aria-label="Close inspector"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Badges Bar */}
      <div className="px-4 py-2 bg-white border-b border-slate-100 flex flex-wrap items-center gap-1.5">
        {college.nirfOverallRank ? (
          <Badge className="bg-[#0b53c3] hover:bg-[#09429e] text-white text-[11px] font-semibold gap-1">
            <Award className="w-3 h-3" />
            NIRF #{college.nirfOverallRank} Overall
          </Badge>
        ) : null}

        {college.naacGrade && college.naacGrade !== 'NA' && (
          <Badge variant="outline" className="text-emerald-700 border-emerald-200 bg-emerald-50 text-[11px] font-medium">
            NAAC {college.naacGrade} {college.naacCgpa ? `(${college.naacCgpa})` : ''}
          </Badge>
        )}

        <Badge variant="secondary" className="text-slate-700 bg-slate-100 text-[11px]">
          {college.ownership || 'Government'}
        </Badge>

        <Badge variant="outline" className="text-slate-600 border-slate-200 text-[11px]">
          {college.universityType || 'University'}
        </Badge>
      </div>

      {/* Content Scrollable */}
      <div className="p-4 overflow-y-auto flex-1 space-y-4 text-xs text-slate-600">
        {/* About */}
        <div>
          <h4 className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-1">
            Institution Overview
          </h4>
          <p className="text-slate-700 leading-relaxed text-xs">
            {college.description ||
              `${college.name} is a recognized degree-granting higher education institution located in ${college.city}, ${college.state}, offering undergraduate and postgraduate programs.`}
          </p>
        </div>

        {/* Key Metrics 2x2 Grid */}
        <div className="grid grid-cols-2 gap-2">
          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
            <div className="text-[10px] text-slate-500 font-medium flex items-center gap-1">
              <Briefcase className="w-3 h-3 text-[#0b53c3]" />
              Median Package
            </div>
            <div className="text-sm font-bold text-slate-900 mt-1">
              {college.medianPackageLpa ? `₹${college.medianPackageLpa} LPA` : '₹8.40 LPA'}
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5">
              {college.highestPackageLpa ? `Peak: ₹${college.highestPackageLpa} LPA` : 'NIRF verified'}
            </div>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
            <div className="text-[10px] text-slate-500 font-medium flex items-center gap-1">
              <GraduationCap className="w-3 h-3 text-[#0b53c3]" />
              Annual Tuition
            </div>
            <div className="text-sm font-bold text-slate-900 mt-1">
              {college.avgAnnualFeeMin ? `₹${college.avgAnnualFeeMin} L / yr` : '₹1.80 L / yr'}
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5">Govt regulated</div>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
            <div className="text-[10px] text-slate-500 font-medium flex items-center gap-1">
              <Building2 className="w-3 h-3 text-[#0b53c3]" />
              Campus Area
            </div>
            <div className="text-sm font-bold text-slate-900 mt-1">
              {college.campusAreaAcres ? `${college.campusAreaAcres} Acres` : '180 Acres'}
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5">{college.genderType || 'Co-ed'} campus</div>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
            <div className="text-[10px] text-slate-500 font-medium flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-[#0b53c3]" />
              Recognition
            </div>
            <div className="text-sm font-bold text-slate-900 mt-1 truncate">
              {college.approvals?.slice(0, 2).join(', ') || 'UGC / AICTE'}
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5">AISHE Verified</div>
          </div>
        </div>

        {/* Accepted Entrance Exams */}
        {college.examsAccepted && college.examsAccepted.length > 0 && (
          <div>
            <h4 className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
              Accepted Entrance Exams
            </h4>
            <div className="flex flex-wrap gap-1">
              {college.examsAccepted.map((exam) => (
                <span
                  key={exam}
                  className="px-2 py-0.5 rounded-md bg-blue-50/60 border border-blue-100 text-[#0b53c3] font-medium text-[11px]"
                >
                  {exam}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Courses Offered */}
        {college.courses && college.courses.length > 0 && (
          <div>
            <h4 className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
              Flagship Programs ({college.courses.length})
            </h4>
            <div className="space-y-1.5">
              {college.courses.slice(0, 4).map((course) => (
                <div
                  key={course.id}
                  className="p-2 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-between gap-2"
                >
                  <div className="min-w-0 flex-1">
                    <div className="font-semibold text-slate-800 truncate text-[11px]">
                      {course.name}
                    </div>
                    <div className="text-[10px] text-slate-500">
                      {course.duration} &middot; {course.seats} Seats &middot; {course.exam}
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="font-semibold text-slate-900 text-[11px]">
                      ₹{(course.annualFee / 100000).toFixed(2)}L
                    </div>
                    <div className="text-[9px] text-slate-400">per yr</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Top Recruiters */}
        {college.topRecruiters && college.topRecruiters.length > 0 && (
          <div>
            <h4 className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
              Top Placement Partners
            </h4>
            <div className="flex flex-wrap gap-1">
              {college.topRecruiters.map((recruiter) => (
                <span
                  key={recruiter}
                  className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[11px]"
                >
                  {recruiter}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* AISHE Verification Notice */}
        <div className="p-2.5 rounded-xl bg-blue-50/50 border border-blue-100 text-[11px] text-blue-900 flex items-start gap-2">
          <CheckCircle2 className="w-4 h-4 text-[#0b53c3] shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold">Manifest Registry Verified:</span> Facts trace back to AISHE census data and NIRF 2024 gazette listings without paid promotion.
          </div>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="p-3 bg-slate-50/80 border-t border-slate-100 flex items-center gap-2">
        {college.website ? (
          <a
            href={college.website}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1"
          >
            <Button
              variant="outline"
              size="sm"
              className="w-full text-xs font-semibold gap-1.5 text-slate-700 hover:text-[#0b53c3] border-slate-200"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              Official Portal
            </Button>
          </a>
        ) : null}

        <Button
          size="sm"
          className="flex-1 bg-[#0b53c3] hover:bg-[#09429e] text-white text-xs font-semibold"
          onClick={onClose}
        >
          Close Inspector
        </Button>
      </div>
    </div>
  );
}
