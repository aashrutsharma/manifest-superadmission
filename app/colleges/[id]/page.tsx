import { getCollegeById } from '@/lib/collegeService';
import Shell from '@/components/Shell';
import InstitutionLogo from '@/components/InstitutionLogo';
import { notFound } from 'next/navigation';
import {
  MapPin,
  Globe,
  Mail,
  Building2,
  ArrowLeft,
  CheckCircle2,
  Award,
  BookOpen,
  Users,
  TrendingUp,
  GraduationCap,
  Phone,
  BookmarkPlus,
} from 'lucide-react';
import Link from 'next/link';

export default async function CollegeDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const college = await getCollegeById(decodeURIComponent(id));
  if (!college) notFound();

  return (
    <Shell title={college.name} badgeText={college.city || 'India'}>
      <div className="p-6 max-w-5xl mx-auto w-full flex flex-col gap-6">
        {/* Back Link */}
        <div>
          <Link
            href="/colleges"
            className="inline-flex items-center gap-1.5 text-[12.5px] font-semibold text-slate-500 hover:text-slate-900 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Institutions Directory</span>
          </Link>
        </div>

        {/* ── Hero card ── */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-2xs">
          <div className="flex items-start gap-5 flex-wrap">
            <InstitutionLogo name={college.name} size={68} />
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-4 flex-wrap mb-2">
                <div>
                  <h1 className="text-[22px] font-bold tracking-tight text-slate-900 leading-tight mb-1.5">
                    {college.name}
                  </h1>
                  {college.code && (
                    <code className="text-[11px] bg-slate-100 px-2 py-0.5 rounded text-slate-500 font-mono">
                      AISHE: {college.code}
                    </code>
                  )}
                </div>
                {college.nirfOverallRank && (
                  <span className="text-[12px] font-bold bg-amber-50 border border-amber-200/80 text-amber-700 px-2.5 py-1 rounded-lg shrink-0">
                    NIRF Rank #{college.nirfOverallRank}
                  </span>
                )}
              </div>

              <div className="flex items-center gap-1.5 text-[13px] text-slate-500 mb-3">
                <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span>
                  {college.city}, {college.state}
                </span>
                {college.establishedYear > 1800 && (
                  <span className="text-slate-400">· Est. {college.establishedYear}</span>
                )}
              </div>

              <div className="flex flex-wrap gap-1.5">
                <span className="text-[11.5px] font-medium bg-slate-100 text-slate-700 px-2.5 py-0.5 rounded-md">
                  {college.universityType}
                </span>
                <span className="text-[11.5px] font-medium bg-slate-100 text-slate-700 px-2.5 py-0.5 rounded-md">
                  {college.ownership}
                </span>
                {college.genderType && college.genderType !== 'Co-ed' && (
                  <span className="text-[11.5px] font-medium bg-purple-50 text-purple-700 border border-purple-200/60 px-2.5 py-0.5 rounded-md">
                    {college.genderType}
                  </span>
                )}
                {college.naacGrade && (
                  <span className="text-[11.5px] font-semibold border border-emerald-200/80 bg-emerald-50 text-emerald-700 px-2.5 py-0.5 rounded-md">
                    NAAC {college.naacGrade}
                  </span>
                )}
                {college.streams.slice(0, 3).map((s) => (
                  <span
                    key={s}
                    className="text-[11.5px] text-slate-600 bg-slate-50 border border-slate-200 px-2.5 py-0.5 rounded-md"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Contact & Links row */}
          {(college.website || college.email || college.affiliatingUniversity) && (
            <div className="mt-5 pt-4 border-t border-slate-100 flex flex-wrap gap-5 text-[12.5px]">
              {college.website && college.website !== 'https://superadmission.com' && (
                <a
                  href={college.website}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1.5 text-blue-600 hover:underline font-medium"
                >
                  <Globe className="w-3.5 h-3.5 text-blue-500" />
                  <span>{college.website.replace(/^https?:\/\//, '').replace(/\/$/, '')}</span>
                </a>
              )}
              {college.email && college.email !== 'info@superadmission.com' && (
                <span className="flex items-center gap-1.5 text-slate-500">
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  <span>{college.email}</span>
                </span>
              )}
              {college.affiliatingUniversity && (
                <span className="flex items-center gap-1.5 text-slate-500">
                  <GraduationCap className="w-3.5 h-3.5 text-slate-400" />
                  <span>Affiliated to {college.affiliatingUniversity}</span>
                </span>
              )}
            </div>
          )}
        </div>

        {/* ── Stats grid ── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white border border-slate-200/90 rounded-xl p-4 shadow-2xs">
            <p className="text-[11px] text-slate-400 uppercase tracking-wide font-bold mb-1">
              Median Salary
            </p>
            <p className="text-[20px] font-bold text-slate-900 font-mono">
              {college.medianPackageLpa > 0 ? `${college.medianPackageLpa.toFixed(1)} LPA` : '—'}
            </p>
          </div>
          <div className="bg-white border border-slate-200/90 rounded-xl p-4 shadow-2xs">
            <p className="text-[11px] text-slate-400 uppercase tracking-wide font-bold mb-1">
              Highest Salary
            </p>
            <p className="text-[20px] font-bold text-slate-900 font-mono">
              {college.highestPackageLpa > 0 ? `${college.highestPackageLpa.toFixed(1)} LPA` : '—'}
            </p>
          </div>
          <div className="bg-white border border-slate-200/90 rounded-xl p-4 shadow-2xs">
            <p className="text-[11px] text-slate-400 uppercase tracking-wide font-bold mb-1">
              NAAC Score
            </p>
            <p className="text-[20px] font-bold text-slate-900 font-mono">
              {college.naacCgpa ? college.naacCgpa.toFixed(2) : college.naacGrade || '—'}
            </p>
          </div>
          <div className="bg-white border border-slate-200/90 rounded-xl p-4 shadow-2xs">
            <p className="text-[11px] text-slate-400 uppercase tracking-wide font-bold mb-1">
              Campus Area
            </p>
            <p className="text-[20px] font-bold text-slate-900 font-mono">
              {college.campusAreaAcres > 0 ? `${college.campusAreaAcres} ac.` : '—'}
            </p>
          </div>
        </div>

        {/* ── Two Column Details ── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
          {/* Left 2 Cols: About & Programs */}
          <div className="md:col-span-2 flex flex-col gap-6">
            {/* About */}
            <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-2xs">
              <h2 className="text-[14px] font-bold text-slate-900 mb-2">About the Institution</h2>
              <p className="text-[13.5px] text-slate-600 leading-relaxed">
                {college.description}
              </p>
            </div>

            {/* Programs Table */}
            {college.courses.length > 0 && (
              <div className="bg-white border border-slate-200/90 rounded-2xl overflow-hidden shadow-2xs">
                <div className="p-4 border-b border-slate-100 bg-slate-50/50">
                  <h2 className="text-[14px] font-bold text-slate-900">Programs & Degrees Offered</h2>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-[13px]">
                    <thead>
                      <tr className="border-b border-slate-200/80 bg-white text-[11px] font-bold uppercase tracking-wider text-slate-400">
                        <th className="py-3 px-4">Program</th>
                        <th className="py-3 px-4">Degree</th>
                        <th className="py-3 px-4">Duration</th>
                        <th className="py-3 px-4">Seats</th>
                        <th className="py-3 px-4 text-right">Fee / yr</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {college.courses.map((course) => (
                        <tr key={course.id} className="hover:bg-slate-50/50">
                          <td className="py-3 px-4 font-semibold text-slate-800">
                            <div>
                              <span>{course.name}</span>
                              {course.exam && (
                                <span className="block text-[11px] font-normal text-slate-400 mt-0.5">
                                  Exam: {course.exam}
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="py-3 px-4 text-slate-600">{course.degree}</td>
                          <td className="py-3 px-4 text-slate-600">{course.duration}</td>
                          <td className="py-3 px-4 text-slate-600">{course.seats}</td>
                          <td className="py-3 px-4 font-mono font-bold text-slate-800 text-right">
                            ₹{(course.annualFee / 1000).toFixed(0)}K
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>

          {/* Right 1 Col: Info panels */}
          <div className="flex flex-col gap-4">
            {/* Facilities */}
            {college.facilities.length > 0 && (
              <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-2xs">
                <h3 className="text-[13px] font-bold text-slate-900 mb-3">Campus Facilities</h3>
                <div className="flex flex-col gap-2 text-[12.5px] text-slate-700">
                  {college.facilities.map((f) => (
                    <div key={f} className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>{f}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Entrance Exams */}
            {college.examsAccepted.length > 0 && (
              <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-2xs">
                <h3 className="text-[13px] font-bold text-slate-900 mb-3">Accepted Entrance Exams</h3>
                <div className="flex flex-wrap gap-1.5">
                  {college.examsAccepted.map((e) => (
                    <span
                      key={e}
                      className="text-[11.5px] font-medium bg-slate-100 text-slate-700 px-2.5 py-1 rounded-md"
                    >
                      {e}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Approvals */}
            {college.approvals.length > 0 && (
              <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-2xs">
                <h3 className="text-[13px] font-bold text-slate-900 mb-3">Accreditations & Approvals</h3>
                <div className="flex flex-wrap gap-1.5">
                  {college.approvals.map((a) => (
                    <span
                      key={a}
                      className="text-[11.5px] font-semibold bg-blue-50 text-blue-700 border border-blue-200 px-2 py-0.5 rounded-md"
                    >
                      {a}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Shell>
  );
}
