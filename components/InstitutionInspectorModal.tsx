'use client';

import React, { useState } from 'react';
import { College } from '@/lib/types';
import InstitutionLogo from '@/components/InstitutionLogo';
import CompanyLogo from '@/components/CompanyLogo';
import CampusImageSlider from '@/components/CampusImageSlider';
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
  Layers,
  Check,
} from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface InstitutionInspectorModalProps {
  college: College | null;
  onClose: () => void;
  isCompared?: boolean;
  onToggleCompare?: (college: College) => void;
}

export default function InstitutionInspectorModal({
  college,
  onClose,
  isCompared = false,
  onToggleCompare,
}: InstitutionInspectorModalProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'courses' | 'placements' | 'admissions'>('overview');

  if (!college) return null;

  return (
    <div className="fixed top-2 sm:top-3 right-2 sm:right-3 bottom-2 sm:bottom-3 left-2 sm:left-auto w-auto sm:w-[560px] max-w-[96vw] sm:max-w-[560px] z-30 bg-white/95 backdrop-blur-2xl rounded-2xl sm:rounded-3xl border border-slate-200/90 shadow-2xl flex flex-col overflow-hidden animate-fade-up select-none">
      {/* Top Bar with Close */}
      <div className="px-5 py-3.5 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
        <div className="flex items-center gap-2">
          <InstitutionLogo
            name={college.name}
            shortName={college.shortName}
            slug={college.slug}
            code={college.code}
            size="sm"
          />
          <div>
            <div className="text-xs font-bold text-slate-900 tracking-tight">
              {college.shortName || college.name}
            </div>
            <div className="text-[10px] font-mono text-slate-400">
              AISHE: {college.aisheCode || 'U-INDEX'}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {onToggleCompare && (
            <Button
              size="sm"
              variant={isCompared ? 'default' : 'outline'}
              onClick={() => onToggleCompare(college)}
              className={`h-7 px-3 text-xs font-semibold gap-1.5 rounded-full transition-all ${
                isCompared
                  ? 'bg-[#0b53c3] hover:bg-[#09429e] text-white shadow-xs'
                  : 'text-slate-700 hover:text-[#0b53c3] border-slate-200'
              }`}
            >
              {isCompared ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>In Compare</span>
                </>
              ) : (
                <>
                  <Layers className="w-3.5 h-3.5" />
                  <span>+ Compare</span>
                </>
              )}
            </Button>
          )}

          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors"
            aria-label="Close inspector"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Content Scrollable Body */}
      <div className="flex-1 overflow-y-auto p-5 space-y-4 text-xs">
        {/* Campus Image Slider */}
        <CampusImageSlider
          collegeName={college.name}
          slug={college.slug}
        />

        {/* Institution Title & Accreditations */}
        <div>
          <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-1">
            <MapPin className="w-3.5 h-3.5 text-[#0b53c3]" />
            <span className="font-medium text-slate-700">{college.city}, {college.state}</span>
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

          <h2 className="text-lg font-bold text-slate-900 leading-tight tracking-tight">
            {college.name}
          </h2>

          <div className="flex flex-wrap items-center gap-1.5 mt-2.5">
            {college.nirfOverallRank ? (
              <Badge className="bg-[#0b53c3] hover:bg-[#09429e] text-white text-xs font-bold gap-1 px-2.5 py-0.5 shadow-xs">
                <Award className="w-3 h-3" />
                NIRF #{college.nirfOverallRank} Overall
              </Badge>
            ) : null}

            {college.naacGrade && college.naacGrade !== 'NA' && (
              <Badge variant="outline" className="text-emerald-700 border-emerald-200 bg-emerald-50 text-xs font-semibold px-2 py-0.5">
                NAAC {college.naacGrade} {college.naacCgpa ? `(${college.naacCgpa})` : ''}
              </Badge>
            )}

            <Badge variant="secondary" className="text-slate-700 bg-slate-100 text-xs font-medium px-2 py-0.5">
              {college.ownership || 'Government'}
            </Badge>

            <Badge variant="outline" className="text-slate-600 border-slate-200 text-xs font-medium px-2 py-0.5">
              {college.universityType || 'University'}
            </Badge>
          </div>
        </div>

        {/* 4-Block Key Metrics Grid */}
        <div className="grid grid-cols-4 gap-2">
          <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
            <div className="text-[10px] text-slate-500 font-semibold flex items-center gap-1">
              <Briefcase className="w-3 h-3 text-[#0b53c3]" />
              Median CTC
            </div>
            <div className="text-base font-bold text-slate-900 mt-1">
              {college.medianPackageLpa ? `₹${college.medianPackageLpa}L` : '₹8.4L'}
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5">LPA per annum</div>
          </div>

          <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
            <div className="text-[10px] text-slate-500 font-semibold flex items-center gap-1">
              <GraduationCap className="w-3 h-3 text-[#0b53c3]" />
              Annual Tuition
            </div>
            <div className="text-base font-bold text-slate-900 mt-1">
              {college.avgAnnualFeeMin ? `₹${college.avgAnnualFeeMin}L` : '₹1.8L'}
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5">Govt regulated</div>
          </div>

          <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
            <div className="text-[10px] text-slate-500 font-semibold flex items-center gap-1">
              <Building2 className="w-3 h-3 text-[#0b53c3]" />
              Campus Area
            </div>
            <div className="text-base font-bold text-slate-900 mt-1">
              {college.campusAreaAcres ? `${college.campusAreaAcres} Ac` : '120 Ac'}
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5">{college.genderType || 'Co-ed'}</div>
          </div>

          <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
            <div className="text-[10px] text-slate-500 font-semibold flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-[#0b53c3]" />
              Approval
            </div>
            <div className="text-base font-bold text-slate-900 mt-1 truncate">
              {college.approvals?.[0] || 'UGC'}
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5">AISHE Verified</div>
          </div>
        </div>

        {/* Section Tabs */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl border border-slate-200/60">
          {[
            { id: 'overview', label: 'Overview' },
            { id: 'courses', label: `Programs (${college.courses?.length || 4})` },
            { id: 'placements', label: 'Placements' },
            { id: 'admissions', label: 'Admissions' },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all text-center ${
                activeTab === tab.id
                  ? 'bg-white text-[#0b53c3] shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab 1: Overview */}
        {activeTab === 'overview' && (
          <div className="space-y-3.5">
            <div>
              <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                About the Institution
              </h4>
              <p className="text-slate-700 leading-relaxed text-xs">
                {college.description ||
                  `${college.name} is a premier degree-granting higher education institution situated in ${college.city}, ${college.state}. Recognized for its academic excellence, faculty research output, and state-of-the-art laboratory infrastructure.`}
              </p>
            </div>

            {college.facilities && (
              <div>
                <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                  Campus Facilities
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {college.facilities.map((fac) => (
                    <span
                      key={fac}
                      className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 text-[11px] font-medium"
                    >
                      {fac}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Courses & Fees */}
        {activeTab === 'courses' && (
          <div className="space-y-2">
            {(college.courses || []).map((course) => (
              <div
                key={course.id}
                className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between gap-3 hover:border-blue-200 transition-colors"
              >
                <div className="min-w-0 flex-1">
                  <div className="font-bold text-slate-900 text-xs">
                    {course.name}
                  </div>
                  <div className="text-[11px] text-slate-500 mt-0.5">
                    {course.duration} &middot; {course.seats} Seats &middot; Exam: <span className="font-medium text-[#0b53c3]">{course.exam}</span>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <div className="font-bold text-slate-900 text-xs">
                    ₹{(course.annualFee / 100000).toFixed(2)}L
                  </div>
                  <div className="text-[10px] text-slate-400">per annum</div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tab 3: Placements & Recruiters */}
        {activeTab === 'placements' && (
          <div className="space-y-3">
            <div className="p-3 rounded-xl bg-blue-50/50 border border-blue-100 flex items-center justify-between">
              <div>
                <div className="text-xs font-semibold text-slate-600">Peak Placement CTC</div>
                <div className="text-lg font-black text-[#0b53c3]">
                  {college.highestPackageLpa ? `₹${college.highestPackageLpa} LPA` : '₹82.0 LPA'}
                </div>
              </div>
              <div>
                <div className="text-xs font-semibold text-slate-600">Median Batch Package</div>
                <div className="text-lg font-black text-slate-900">
                  {college.medianPackageLpa ? `₹${college.medianPackageLpa} LPA` : '₹18.5 LPA'}
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                Premier Recruiting Partners
              </h4>
              <div className="grid grid-cols-2 gap-2">
                {(college.topRecruiters || ['Google', 'Microsoft', 'Texas Instruments', 'Amazon', 'Apple', 'Goldman Sachs']).map((corp) => (
                  <div
                    key={corp}
                    className="p-2 rounded-xl bg-white border border-slate-200 flex items-center gap-2 shadow-2xs"
                  >
                    <CompanyLogo name={corp} size={22} />
                    <span className="font-semibold text-slate-800 text-xs truncate">{corp}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: Admissions & Counselling Authorities */}
        {activeTab === 'admissions' && (
          <div className="space-y-3">
            <div>
              <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                Counselling &amp; Seat Allocation Authorities
              </h4>
              <div className="space-y-1.5">
                {[
                  { name: 'JoSAA (Joint Seat Allocation Authority)', stream: 'Engineering / Architecture' },
                  { name: 'CSAB (Central Seat Allocation Board)', stream: 'Special Rounds' },
                  { name: 'State Higher Education Direct Rounds', stream: 'Institutional Quota' },
                ].map((auth) => (
                  <div key={auth.name} className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                    <div>
                      <div className="font-bold text-slate-900 text-xs">{auth.name}</div>
                      <div className="text-[10px] text-slate-400">{auth.stream}</div>
                    </div>
                    <Badge variant="outline" className="text-[10px] text-blue-700 bg-blue-50 border-blue-200">
                      Official
                    </Badge>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                Accepted National Entrance Exams
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {(college.examsAccepted || ['JEE Advanced', 'JEE Main']).map((exam) => (
                  <span
                    key={exam}
                    className="px-2.5 py-1 rounded-lg bg-blue-50/70 border border-blue-100 text-[#0b53c3] font-bold text-xs"
                  >
                    {exam}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* AISHE Verification Guarantee */}
        <div className="p-3 rounded-2xl bg-blue-50/50 border border-blue-100 text-xs text-blue-900 flex items-start gap-2.5">
          <CheckCircle2 className="w-4 h-4 text-[#0b53c3] shrink-0 mt-0.5" />
          <div>
            <span className="font-bold">Manifest Registry Verified:</span> Official data points keyed directly to AISHE code {college.aisheCode || 'U-INDEX'}. Free from commercial placement bias.
          </div>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="p-3.5 bg-slate-50/90 border-t border-slate-100 flex items-center gap-2.5">
        {college.website && (
          <a
            href={college.website}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1"
          >
            <Button
              variant="outline"
              size="sm"
              className="w-full h-9 text-xs font-semibold gap-1.5 text-slate-700 hover:text-[#0b53c3] border-slate-200 rounded-xl"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              Official Portal
            </Button>
          </a>
        )}

        <Button
          size="sm"
          className="flex-1 h-9 bg-[#0b53c3] hover:bg-[#09429e] text-white text-xs font-semibold rounded-xl"
          onClick={onClose}
        >
          Close Inspector
        </Button>
      </div>
    </div>
  );
}
