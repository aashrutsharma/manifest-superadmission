'use client';

import React, { useState, useMemo, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { College } from '@/lib/types';
import { COLLEGES_DATA } from '@/lib/data/colleges';
import { EDUCATION_HUBS, EducationHub } from '@/lib/geo';
import ConsoleLogo from '@/components/ConsoleLogo';
import InstitutionInspectorModal from '@/components/InstitutionInspectorModal';
import DatabaseSpreadsheetModal from '@/components/DatabaseSpreadsheetModal';
import ManifestArchitectureModal from '@/components/ManifestArchitectureModal';

import {
  Search,
  Database,
  HelpCircle,
  RotateCcw,
  MapPin,
  Award,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Compass,
  ChevronDown,
  ChevronUp,
  Check,
  X,
} from 'lucide-react';
import { Input } from '@/components/ui/input';


// Dynamic import for Leaflet map to prevent SSR window error
const IndiaGlobeMap = dynamic(() => import('@/components/IndiaGlobeMap'), {
  ssr: false,
  loading: () => (
    <div className="absolute inset-0 w-full h-full bg-[#f1f5f9] flex items-center justify-center text-slate-400 text-xs font-medium">
      <div className="flex items-center gap-2">
        <div className="w-4 h-4 border-2 border-[#0b53c3] border-t-transparent rounded-full animate-spin" />
        Loading Manifest India Registry...
      </div>
    </div>
  ),
});

export default function ManifestDashboard() {
  // Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedNirfTier, setSelectedNirfTier] = useState<string>('All');
  const [selectedType, setSelectedType] = useState<string>('All');
  const [selectedNaac, setSelectedNaac] = useState<string>('All');
  const [selectedStream, setSelectedStream] = useState<string>('All');

  // Interactive View States
  const [selectedCollege, setSelectedCollege] = useState<College | null>(null);
  const [activeHub, setActiveHub] = useState<EducationHub | null>(null);
  const [resetViewTrigger, setResetViewTrigger] = useState(0);

  // Modals
  const [isDatabaseOpen, setIsDatabaseOpen] = useState(false);
  const [isArchitectureOpen, setIsArchitectureOpen] = useState(false);

  // Dock States
  const [dockViewMode, setDockViewMode] = useState<'colleges' | 'programs'>('colleges');
  const [isDockExpanded, setIsDockExpanded] = useState(true);

  // Ask Manifest Natural Query
  const [askInput, setAskInput] = useState('');
  const [askStatus, setAskStatus] = useState<string | null>(null);

  // Filtered dataset
  const filteredColleges = useMemo(() => {
    return COLLEGES_DATA.filter((college) => {
      // Search matching
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesName = college.name.toLowerCase().includes(q);
        const matchesShort = (college.shortName || '').toLowerCase().includes(q);
        const matchesCity = college.city.toLowerCase().includes(q);
        const matchesState = college.state.toLowerCase().includes(q);
        const matchesAishe = (college.aisheCode || '').toLowerCase().includes(q);
        const matchesCode = (college.code || '').toLowerCase().includes(q);
        if (!matchesName && !matchesShort && !matchesCity && !matchesState && !matchesAishe && !matchesCode) {
          return false;
        }
      }

      // NIRF Tier matching
      if (selectedNirfTier !== 'All') {
        const rank = college.nirfOverallRank;
        if (selectedNirfTier === 'Top 10' && (!rank || rank > 10)) return false;
        if (selectedNirfTier === 'Top 50' && (!rank || rank > 50)) return false;
        if (selectedNirfTier === 'Top 100' && (!rank || rank > 100)) return false;
        if (selectedNirfTier === '100-200' && (!rank || rank < 101 || rank > 200)) return false;
      }

      // Type matching
      if (selectedType !== 'All') {
        const type = (college.universityType || '').toLowerCase();
        if (selectedType === 'Central / IIT / NIT' && !type.includes('iit') && !type.includes('nit') && !type.includes('central')) {
          return false;
        }
        if (selectedType === 'State Public' && !type.includes('state') && !type.includes('public')) {
          return false;
        }
        if (selectedType === 'Private Deemed' && !type.includes('private') && !type.includes('deemed')) {
          return false;
        }
      }

      // NAAC matching
      if (selectedNaac !== 'All') {
        if (!college.naacGrade || !college.naacGrade.includes(selectedNaac)) {
          return false;
        }
      }

      // Stream matching
      if (selectedStream !== 'All') {
        if (!college.streams || !college.streams.some((s) => s.toLowerCase().includes(selectedStream.toLowerCase()))) {
          return false;
        }
      }

      return true;
    });
  }, [searchQuery, selectedNirfTier, selectedType, selectedNaac, selectedStream]);

  // Leading institutions list for right widget
  const leadingInstitutions = useMemo(() => {
    return [...COLLEGES_DATA]
      .filter((c) => c.nirfOverallRank && c.nirfOverallRank <= 10)
      .sort((a, b) => (a.nirfOverallRank || 999) - (b.nirfOverallRank || 999))
      .slice(0, 5);
  }, []);

  // Discipline counts for right widget
  const disciplineCounts = useMemo(() => {
    const counts: Record<string, number> = {
      Engineering: 0,
      'Arts & Science': 0,
      Management: 0,
      Medical: 0,
      Law: 0,
    };
    COLLEGES_DATA.forEach((c) => {
      c.streams?.forEach((s) => {
        if (counts[s] !== undefined) counts[s]++;
      });
    });
    return counts;
  }, []);

  // Reset all filters
  const handleResetFilters = useCallback(() => {
    setSearchQuery('');
    setSelectedNirfTier('All');
    setSelectedType('All');
    setSelectedNaac('All');
    setSelectedStream('All');
    setActiveHub(null);
    setSelectedCollege(null);
    setAskInput('');
    setAskStatus(null);
    setResetViewTrigger((prev) => prev + 1);
  }, []);

  // Hub selection handler
  const handleSelectHub = (hub: EducationHub) => {
    setActiveHub(hub);
    setSearchQuery(hub.shortName === 'Delhi-NCR' ? 'Delhi' : hub.shortName);
  };

  // Natural language query handler
  const handleAskSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!askInput.trim()) return;

    const query = askInput.toLowerCase();
    setAskStatus(`Filtered by "${askInput}"`);

    if (query.includes('bengaluru') || query.includes('bangalore')) {
      const hub = EDUCATION_HUBS.find((h) => h.id === 'bengaluru');
      if (hub) setActiveHub(hub);
    } else if (query.includes('delhi') || query.includes('ncr')) {
      const hub = EDUCATION_HUBS.find((h) => h.id === 'ncr');
      if (hub) setActiveHub(hub);
    } else if (query.includes('mumbai') || query.includes('pune')) {
      const hub = EDUCATION_HUBS.find((h) => h.id === 'mumbai-pune');
      if (hub) setActiveHub(hub);
    } else if (query.includes('chennai') || query.includes('tamil nadu')) {
      const hub = EDUCATION_HUBS.find((h) => h.id === 'tamil-nadu');
      if (hub) setActiveHub(hub);
    }

    if (query.includes('cse') || query.includes('engineer') || query.includes('tech')) {
      setSelectedStream('Engineering');
    } else if (query.includes('medical') || query.includes('neet') || query.includes('mbbs')) {
      setSelectedStream('Medical');
    } else if (query.includes('mba') || query.includes('management')) {
      setSelectedStream('Management');
    }

    if (query.includes('top 10')) setSelectedNirfTier('Top 10');
    else if (query.includes('top 50')) setSelectedNirfTier('Top 50');

    // Focus on first matching result
    if (filteredColleges.length > 0) {
      setSelectedCollege(filteredColleges[0]);
    }
  };

  return (
    <main className="relative w-screen h-screen overflow-hidden bg-[#f8fafc] text-slate-900 font-sans select-none">
      {/* 1. Full-Bleed Digital India Map */}
      <IndiaGlobeMap
        colleges={filteredColleges}
        selectedCollege={selectedCollege}
        onSelectCollege={(college) => setSelectedCollege(college)}
        activeHub={activeHub}
        resetViewTrigger={resetViewTrigger}
      />

      {/* 2. Top Action Bar */}
      <header className="fixed top-3 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 bg-transparent pointer-events-auto">
        {/* Prominent Database Button in Brand Color #0b53c3 */}
        <button
          type="button"
          onClick={() => setIsDatabaseOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-[#0b53c3] hover:bg-[#09429e] text-white rounded-full shadow-md font-semibold text-xs tracking-tight transition-all hover:scale-105 active:scale-95"
        >
          <Database className="w-3.5 h-3.5 text-white" />
          <span>Database</span>
          <span className="text-[10px] bg-white/20 px-1.5 py-0.5 rounded-full font-mono">
            {filteredColleges.length}
          </span>
        </button>

        {/* Architecture Info Button (?) */}
        <button
          type="button"
          onClick={() => setIsArchitectureOpen(true)}
          aria-label="What is Manifest"
          className="w-8 h-8 rounded-full bg-white/95 backdrop-blur-md border border-slate-200/90 text-slate-600 hover:text-[#0b53c3] hover:border-[#0b53c3]/40 shadow-sm flex items-center justify-center text-xs font-bold transition-colors"
        >
          <HelpCircle className="w-4 h-4" />
        </button>

        {/* Reset Camera to Full India */}
        <button
          type="button"
          onClick={handleResetFilters}
          aria-label="Reset Map to Full India"
          className="w-8 h-8 rounded-full bg-white/95 backdrop-blur-md border border-slate-200/90 text-slate-600 hover:text-slate-900 shadow-sm flex items-center justify-center transition-colors"
          title="Reset View"
        >
          <Compass className="w-4 h-4" />
        </button>
      </header>

      {/* 3. Floating Left Sidebar (Cockpit Filters) */}
      <aside className="fixed top-3 left-3 bottom-3 w-[305px] z-20 bg-white/95 backdrop-blur-xl rounded-2xl border border-slate-200/90 shadow-xl flex flex-col overflow-hidden pointer-events-auto">
        {/* Top Header */}
        <div className="p-4 pb-3 border-b border-slate-100">
          <div className="flex items-center justify-between mb-2">
            <a
              href="https://superadmission.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[11px] text-slate-400 hover:text-slate-700 transition-colors flex items-center gap-1 font-medium"
            >
              &larr; Superadmission
            </a>
            <span className="text-[10px] font-mono text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">
              AISHE 2024-25
            </span>
          </div>

          <div className="flex items-center gap-2">
            <ConsoleLogo size="md" />
            <div className="h-4 w-[1px] bg-slate-200 mx-0.5" />
            <span className="font-bold text-slate-900 text-sm tracking-tight">Manifest</span>
          </div>

          <p className="text-[11px] text-slate-500 mt-1 leading-snug">
            Registry of 70,000+ Indian degree-granting higher education institutions.
          </p>

          {/* Search Input */}
          <div className="relative mt-3">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search institution, city, or AISHE..."
              className="pl-8 pr-7 h-8 text-xs bg-slate-50/80 border-slate-200 rounded-lg focus-visible:ring-[#0b53c3]"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>

        {/* Scrollable Filters */}
        <div className="p-4 overflow-y-auto flex-1 space-y-4 text-xs">
          {/* NIRF TIER */}
          <div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center justify-between">
              <span>NIRF Rank Tier</span>
              {selectedNirfTier !== 'All' && (
                <button
                  type="button"
                  onClick={() => setSelectedNirfTier('All')}
                  className="text-[#0b53c3] text-[10px] lowercase hover:underline"
                >
                  clear
                </button>
              )}
            </div>
            <div className="grid grid-cols-3 gap-1.5">
              {['All', 'Top 10', 'Top 50', 'Top 100', '100-200'].map((tier) => (
                <button
                  key={tier}
                  type="button"
                  onClick={() => setSelectedNirfTier(tier)}
                  className={`px-2 py-1.5 rounded-lg text-xs font-semibold transition-all text-center ${
                    selectedNirfTier === tier
                      ? 'bg-[#0b53c3] text-white shadow-xs'
                      : 'bg-slate-100/80 text-slate-600 hover:bg-slate-200/70'
                  }`}
                >
                  {tier}
                </button>
              ))}
            </div>
          </div>

          {/* INSTITUTION TYPE */}
          <div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">
              Institution Category
            </div>
            <div className="space-y-1">
              {[
                { label: 'All Categories', value: 'All' },
                { label: 'Central University / IIT / NIT', value: 'Central / IIT / NIT' },
                { label: 'State Public University', value: 'State Public' },
                { label: 'Private Deemed University', value: 'Private Deemed' },
              ].map((item) => (
                <button
                  key={item.value}
                  type="button"
                  onClick={() => setSelectedType(item.value)}
                  className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    selectedType === item.value
                      ? 'bg-blue-50 text-[#0b53c3] font-semibold'
                      : 'text-slate-600 hover:bg-slate-100/80'
                  }`}
                >
                  <span className="truncate">{item.label}</span>
                  {selectedType === item.value && <Check className="w-3.5 h-3.5 text-[#0b53c3]" />}
                </button>
              ))}
            </div>
          </div>

          {/* ACCREDITATION */}
          <div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">
              Accreditation
            </div>
            <div className="flex flex-wrap gap-1.5">
              {['All', 'A++', 'A+', 'A'].map((grade) => (
                <button
                  key={grade}
                  type="button"
                  onClick={() => setSelectedNaac(grade)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${
                    selectedNaac === grade
                      ? 'bg-[#0b53c3] text-white font-semibold'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200/80'
                  }`}
                >
                  {grade === 'All' ? 'All NAAC' : `NAAC ${grade}`}
                </button>
              ))}
            </div>
          </div>

          {/* DISCIPLINES / STREAMS */}
          <div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">
              Discipline / Stream
            </div>
            <div className="space-y-1">
              {['All', 'Engineering', 'Management', 'Medical', 'Arts & Science', 'Law'].map(
                (stream) => (
                  <button
                    key={stream}
                    type="button"
                    onClick={() => setSelectedStream(stream)}
                    className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                      selectedStream === stream
                        ? 'bg-blue-50 text-[#0b53c3] font-semibold'
                        : 'text-slate-600 hover:bg-slate-100/80'
                    }`}
                  >
                    <span>{stream === 'All' ? 'All Disciplines' : stream}</span>
                    {selectedStream === stream && (
                      <Check className="w-3.5 h-3.5 text-[#0b53c3]" />
                    )}
                  </button>
                )
              )}
            </div>
          </div>
        </div>

        {/* Footer info & reset */}
        <div className="p-3 border-t border-slate-100 bg-slate-50/70 flex items-center justify-between text-xs">
          <div className="text-[11px] text-slate-500 font-medium">
            <span className="font-bold text-slate-900">{filteredColleges.length}</span> of 72,000+
          </div>
          <button
            type="button"
            onClick={handleResetFilters}
            className="text-[11px] font-semibold text-[#0b53c3] hover:text-[#09429e] flex items-center gap-1"
          >
            <RotateCcw className="w-3 h-3" />
            Reset
          </button>
        </div>
      </aside>

      {/* 4. Bottom Data Dock (Interactive Pill Card Strip) */}
      <section className="fixed bottom-3 left-[325px] right-[325px] max-w-4xl mx-auto z-20 pointer-events-auto bg-white/95 backdrop-blur-xl rounded-2xl border border-slate-200/90 shadow-xl overflow-hidden transition-all">
        {/* Dock Header */}
        <div className="px-3.5 py-2.5 border-b border-slate-100 flex items-center justify-between gap-3 bg-slate-50/50">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded bg-[#0b53c3] flex items-center justify-center text-white text-[10px] font-bold">
              M
            </div>
            <div className="text-xs font-bold text-slate-900 tracking-tight">
              Current view <span className="font-mono text-[#0b53c3]">{filteredColleges.length}</span>
            </div>

            {/* Mode Toggle Pills: Institutions vs Top Programs */}
            <div className="flex items-center p-0.5 bg-slate-200/70 rounded-lg ml-2">
              <button
                type="button"
                onClick={() => setDockViewMode('colleges')}
                className={`px-2.5 py-0.5 text-[11px] font-semibold rounded-md transition-all ${
                  dockViewMode === 'colleges'
                    ? 'bg-[#0b53c3] text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Institutions
              </button>
              <button
                type="button"
                onClick={() => setDockViewMode('programs')}
                className={`px-2.5 py-0.5 text-[11px] font-semibold rounded-md transition-all ${
                  dockViewMode === 'programs'
                    ? 'bg-[#0b53c3] text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Top Programs
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] text-slate-400 hidden sm:inline">
              Click any chip to inspect
            </span>
            <button
              type="button"
              onClick={() => setIsDockExpanded(!isDockExpanded)}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors"
              aria-label={isDockExpanded ? 'Collapse dock' : 'Expand dock'}
            >
              {isDockExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Chips Wrap Grid */}
        {isDockExpanded && (
          <div className="p-3 max-h-[140px] overflow-y-auto">
            {dockViewMode === 'colleges' ? (
              <div className="flex flex-wrap gap-1.5">
                {filteredColleges.slice(0, 24).map((college) => {
                  const isSelected = selectedCollege?.id === college.id;
                  return (
                    <button
                      key={college.id}
                      type="button"
                      onClick={() => setSelectedCollege(college)}
                      className={`px-2.5 py-1 rounded-xl text-xs font-medium transition-all flex items-center gap-1.5 border ${
                        isSelected
                          ? 'bg-[#0b53c3] text-white border-[#0b53c3] shadow-sm'
                          : 'bg-white hover:bg-blue-50/50 text-slate-700 border-slate-200 hover:border-blue-300'
                      }`}
                    >
                      <span className="font-semibold">{college.shortName || college.name}</span>
                      {college.nirfOverallRank && (
                        <span
                          className={`text-[10px] font-bold px-1 rounded ${
                            isSelected ? 'bg-white/20 text-white' : 'bg-blue-50 text-[#0b53c3]'
                          }`}
                        >
                          #{college.nirfOverallRank}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="flex flex-wrap gap-1.5">
                {filteredColleges.slice(0, 16).flatMap((college) =>
                  (college.courses || []).slice(0, 1).map((course) => (
                    <button
                      key={course.id}
                      type="button"
                      onClick={() => setSelectedCollege(college)}
                      className="px-2.5 py-1 rounded-xl text-xs font-medium bg-white hover:bg-blue-50/50 text-slate-700 border border-slate-200 flex items-center gap-2"
                    >
                      <span className="font-semibold text-slate-900">{course.name}</span>
                      <span className="text-[10px] text-slate-400">
                        {college.shortName} &middot; ₹{(course.annualFee / 100000).toFixed(1)}L/yr
                      </span>
                    </button>
                  ))
                )}
              </div>
            )}
          </div>
        )}
      </section>

      {/* 5. Floating Right Widgets Stack */}
      <aside className="fixed top-3 right-3 bottom-3 w-[295px] z-20 flex flex-col gap-2.5 pointer-events-auto overflow-y-auto">
        {/* Widget 1: Leading Institutions */}
        <div className="p-3.5 bg-white/95 backdrop-blur-xl rounded-2xl border border-slate-200/90 shadow-lg">
          <div className="flex items-center justify-between text-xs font-bold text-slate-900 mb-2.5">
            <span className="flex items-center gap-1.5">
              <Award className="w-3.5 h-3.5 text-[#0b53c3]" />
              Leading Institutions
            </span>
            <span className="text-[10px] font-mono text-slate-400 font-normal">NIRF 2024</span>
          </div>

          <div className="space-y-2">
            {leadingInstitutions.map((college) => {
              const rank = college.nirfOverallRank || 1;
              const percent = Math.max(10, 100 - (rank - 1) * 9);
              return (
                <button
                  key={college.id}
                  type="button"
                  onClick={() => setSelectedCollege(college)}
                  className="w-full text-left group"
                >
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-semibold text-slate-800 group-hover:text-[#0b53c3] transition-colors truncate">
                      {college.shortName || college.name}
                    </span>
                    <span className="font-bold text-[#0b53c3] text-[11px] shrink-0 ml-2">
                      #{rank}
                    </span>
                  </div>
                  {/* Progress Bar Meter filled in #0b53c3 */}
                  <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#0b53c3] rounded-full transition-all duration-500"
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Widget 2: Education Hubs */}
        <div className="p-3.5 bg-white/95 backdrop-blur-xl rounded-2xl border border-slate-200/90 shadow-lg">
          <div className="flex items-center justify-between text-xs font-bold text-slate-900 mb-2">
            <span className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-[#0b53c3]" />
              Education Hubs
            </span>
            <span className="text-[10px] font-mono text-slate-400 font-normal">70k+</span>
          </div>

          <div className="space-y-1">
            {EDUCATION_HUBS.map((hub, index) => {
              const isActive = activeHub?.id === hub.id;
              return (
                <button
                  key={hub.id}
                  type="button"
                  onClick={() => handleSelectHub(hub)}
                  className={`w-full flex items-center justify-between px-2 py-1.5 rounded-lg text-xs transition-all text-left ${
                    isActive
                      ? 'bg-blue-50 text-[#0b53c3] font-semibold'
                      : 'text-slate-700 hover:bg-slate-100/70'
                  }`}
                >
                  <div className="flex items-center gap-1.5 truncate">
                    <span className="text-[10px] text-slate-400 font-mono">{index + 1}.</span>
                    <span className="truncate">{hub.name}</span>
                  </div>
                  <span className="font-mono text-[11px] text-slate-500 shrink-0">
                    {hub.count.toLocaleString()}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Widget 3: Disciplines */}
        <div className="p-3.5 bg-white/95 backdrop-blur-xl rounded-2xl border border-slate-200/90 shadow-lg">
          <div className="flex items-center justify-between text-xs font-bold text-slate-900 mb-2">
            <span className="flex items-center gap-1.5">
              <TrendingUp className="w-3.5 h-3.5 text-[#0b53c3]" />
              Disciplines
            </span>
            <span className="text-[10px] font-mono text-slate-400 font-normal">Streams</span>
          </div>

          <div className="space-y-1">
            {Object.entries(disciplineCounts).map(([stream, count]) => (
              <button
                key={stream}
                type="button"
                onClick={() => setSelectedStream(stream)}
                className={`w-full flex items-center justify-between px-2 py-1 rounded-lg text-xs transition-colors ${
                  selectedStream === stream
                    ? 'bg-blue-50 text-[#0b53c3] font-semibold'
                    : 'text-slate-600 hover:bg-slate-100/70'
                }`}
              >
                <span>{stream}</span>
                <span className="font-mono text-[11px] text-slate-400">{count}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Widget 4: Ask Manifest Query Box (Series B Startup Polish) */}
        <div className="p-3.5 bg-white/95 backdrop-blur-xl rounded-2xl border border-slate-200/90 shadow-lg">
          <div className="flex items-center justify-between text-xs font-bold text-slate-900 mb-1">
            <span className="flex items-center gap-1.5 text-slate-900">
              <Sparkles className="w-3.5 h-3.5 text-[#0b53c3]" />
              Ask Manifest
            </span>
            {askStatus && (
              <button
                type="button"
                onClick={() => {
                  setAskStatus(null);
                  setAskInput('');
                }}
                className="text-[10px] text-slate-400 hover:text-slate-700"
              >
                clear
              </button>
            )}
          </div>

          <p className="text-[11px] text-slate-500 mb-2.5 leading-tight italic">
            70,000+ colleges indexed. What are you looking for?
          </p>

          <form onSubmit={handleAskSubmit} className="space-y-2">
            <div className="relative">
              <Input
                value={askInput}
                onChange={(e) => setAskInput(e.target.value)}
                placeholder="e.g. top CSE in Bengaluru..."
                className="pr-8 h-8 text-xs bg-slate-50 border-slate-200 rounded-lg focus-visible:ring-[#0b53c3]"
              />
              <button
                type="submit"
                className="w-6 h-6 rounded-md bg-[#0b53c3] hover:bg-[#09429e] text-white flex items-center justify-center absolute right-1 top-1/2 -translate-y-1/2 transition-colors"
                aria-label="Send query"
              >
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </form>

          {/* Quick Suggestions */}
          <div className="mt-2 flex flex-wrap gap-1">
            {[
              'Top 10 Engineering',
              'Bengaluru Tech',
              'NAAC A++ Medical',
            ].map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => {
                  setAskInput(tag);
                  if (tag.includes('Engineering')) setSelectedStream('Engineering');
                  if (tag.includes('Medical')) setSelectedStream('Medical');
                  if (tag.includes('Bengaluru')) {
                    const hub = EDUCATION_HUBS.find((h) => h.id === 'bengaluru');
                    if (hub) setActiveHub(hub);
                  }
                  if (tag.includes('Top 10')) setSelectedNirfTier('Top 10');
                  if (tag.includes('A++')) setSelectedNaac('A++');
                }}
                className="px-2 py-0.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded text-[10px] transition-colors"
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      </aside>

      {/* 6. Floating Institution Inspector Card */}
      <InstitutionInspectorModal
        college={selectedCollege}
        onClose={() => setSelectedCollege(null)}
      />

      {/* 7. Full Database Spreadsheet Modal */}
      <DatabaseSpreadsheetModal
        isOpen={isDatabaseOpen}
        onClose={() => setIsDatabaseOpen(false)}
        colleges={filteredColleges}
        onSelectAndFocus={(college) => {
          setSelectedCollege(college);
          setIsDatabaseOpen(false);
        }}
      />

      {/* 8. About Manifest Architecture Modal */}
      <ManifestArchitectureModal
        isOpen={isArchitectureOpen}
        onClose={() => setIsArchitectureOpen(false)}
      />
    </main>
  );
}
