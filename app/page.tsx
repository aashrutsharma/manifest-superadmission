'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { College } from '@/lib/types';
import { COLLEGES_DATA } from '@/lib/data/colleges';
import { EDUCATION_HUBS, EducationHub } from '@/lib/geo';
import ConsoleLogo from '@/components/ConsoleLogo';
import InstitutionLogo from '@/components/InstitutionLogo';
import InstitutionInspectorModal from '@/components/InstitutionInspectorModal';
import DatabaseSpreadsheetModal from '@/components/DatabaseSpreadsheetModal';
import ManifestArchitectureModal from '@/components/ManifestArchitectureModal';
import CompareModal from '@/components/CompareModal';
import ComparisonFloatingBar from '@/components/ComparisonFloatingBar';

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
  Layers,
  GraduationCap,
  Briefcase,
  IndianRupee,
  Loader2,
} from 'lucide-react';
import { Input } from '@/components/ui/input';


// Dynamic import for Leaflet map to prevent SSR window error
const IndiaGlobeMap = dynamic(() => import('@/components/IndiaGlobeMap'), {
  ssr: false,
  loading: () => (
    <div className="absolute inset-0 w-full h-full bg-[#f8fafc] flex items-center justify-center text-slate-500 text-xs font-semibold">
      <div className="flex items-center gap-2">
        <div className="w-4 h-4 border-2 border-[#0b53c3] border-t-transparent rounded-full animate-spin" />
        Loading Manifest India Registry...
      </div>
    </div>
  ),
});

export default function ManifestDashboard() {
  // Live Database Dataset State
  const [baseColleges, setBaseColleges] = useState<College[]>(COLLEGES_DATA);
  const [collegesList, setCollegesList] = useState<College[]>(COLLEGES_DATA);
  const [totalDatabaseCount, setTotalDatabaseCount] = useState<number>(70623);
  const [isFetchingLive, setIsFetchingLive] = useState<boolean>(false);
  const [isSearchingLive, setIsSearchingLive] = useState<boolean>(false);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState<boolean>(false);

  // Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedNirfTier, setSelectedNirfTier] = useState<string>('All');
  const [selectedExam, setSelectedExam] = useState<string>('All');
  const [selectedBudget, setSelectedBudget] = useState<string>('All');
  const [selectedCtc, setSelectedCtc] = useState<string>('All');
  const [selectedType, setSelectedType] = useState<string>('All');
  const [selectedNaac, setSelectedNaac] = useState<string>('All');
  const [selectedStream, setSelectedStream] = useState<string>('All');

  // Interactive View States
  const [selectedCollege, setSelectedCollege] = useState<College | null>(null);
  const [activeHub, setActiveHub] = useState<EducationHub | null>(null);
  const [resetViewTrigger, setResetViewTrigger] = useState(0);

  // Dynamic Compare State
  const [comparedColleges, setComparedColleges] = useState<College[]>([]);
  const [isCompareModalOpen, setIsCompareModalOpen] = useState(false);

  // Modals
  const [isDatabaseOpen, setIsDatabaseOpen] = useState(false);
  const [isArchitectureOpen, setIsArchitectureOpen] = useState(false);

  // Dock States
  const [dockViewMode, setDockViewMode] = useState<'colleges' | 'programs'>('colleges');
  const [isDockExpanded, setIsDockExpanded] = useState(true);

  // Ask Manifest Query
  const [askInput, setAskInput] = useState('');
  const [askStatus, setAskStatus] = useState<string | null>(null);

  // Fetch initial batch from live database API (/api/colleges)
  useEffect(() => {
    let isMounted = true;
    async function loadLiveColleges() {
      try {
        setIsFetchingLive(true);
        const res = await fetch('/api/colleges?pageSize=150');
        if (!res.ok) throw new Error('API failed');
        const data = await res.json();
        if (isMounted && data.colleges && data.colleges.length > 0) {
          // Merge live database records with local enriched records (avoid duplicates)
          const liveIds = new Set(data.colleges.map((c: College) => c.id));
          const enrichedOnly = COLLEGES_DATA.filter((c) => !liveIds.has(c.id));
          const combined = [...enrichedOnly, ...data.colleges];
          setBaseColleges(combined);
          setCollegesList(combined);
          if (data.totalCount) setTotalDatabaseCount(data.totalCount);
        }
      } catch {
        // Gracefully use local dataset
      } finally {
        if (isMounted) setIsFetchingLive(false);
      }
    }
    loadLiveColleges();
    return () => {
      isMounted = false;
    };
  }, []);

  // Live debounced search across all 70,623 institutions
  useEffect(() => {
    const trimmed = searchQuery.trim();
    if (!trimmed) {
      setCollegesList(baseColleges);
      setIsSearchingLive(false);
      return;
    }

    if (trimmed.length < 2) return;

    let isSubscribed = true;
    setIsSearchingLive(true);

    const timer = setTimeout(async () => {
      try {
        const res = await fetch(`/api/colleges?q=${encodeURIComponent(trimmed)}&pageSize=60`);
        if (!res.ok) throw new Error('Search failed');
        const data = await res.json();
        if (isSubscribed && data.colleges) {
          const fetchedIds = new Set(data.colleges.map((c: College) => c.id));
          const localMatches = COLLEGES_DATA.filter(
            (c) =>
              !fetchedIds.has(c.id) &&
              (c.name.toLowerCase().includes(trimmed.toLowerCase()) ||
                (c.shortName && c.shortName.toLowerCase().includes(trimmed.toLowerCase())) ||
                c.city.toLowerCase().includes(trimmed.toLowerCase()))
          );
          setCollegesList([...data.colleges, ...localMatches]);
          if (typeof data.totalCount === 'number') {
            setTotalDatabaseCount(data.totalCount);
          }
        }
      } catch {
        // keep current list
      } finally {
        if (isSubscribed) setIsSearchingLive(false);
      }
    }, 280);

    return () => {
      isSubscribed = false;
      clearTimeout(timer);
    };
  }, [searchQuery, baseColleges]);

  // Filtered dataset
  const filteredColleges = useMemo(() => {
    return collegesList.filter((college) => {
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

      // NIRF Tier
      if (selectedNirfTier !== 'All') {
        const rank = college.nirfOverallRank;
        if (selectedNirfTier === 'Top 10' && (!rank || rank > 10)) return false;
        if (selectedNirfTier === 'Top 50' && (!rank || rank > 50)) return false;
        if (selectedNirfTier === 'Top 100' && (!rank || rank > 100)) return false;
        if (selectedNirfTier === '100-200' && (!rank || rank < 101 || rank > 200)) return false;
      }

      // Entrance Exam Filter
      if (selectedExam !== 'All') {
        const exams = college.examsAccepted || [];
        const hasExam = exams.some((e) => e.toLowerCase().includes(selectedExam.toLowerCase()));
        if (!hasExam) return false;
      }

      // Budget / Annual Fee Filter
      if (selectedBudget !== 'All') {
        const fee = college.avgAnnualFeeMin || 1.5;
        if (selectedBudget === '< ₹1 Lakh' && fee >= 1.0) return false;
        if (selectedBudget === '₹1L - ₹3L' && (fee < 1.0 || fee > 3.0)) return false;
        if (selectedBudget === '₹3L - ₹6L' && (fee < 3.0 || fee > 6.0)) return false;
        if (selectedBudget === '> ₹6L' && fee <= 6.0) return false;
      }

      // Placement CTC Filter
      if (selectedCtc !== 'All') {
        const ctc = college.medianPackageLpa || 5;
        if (selectedCtc === '> ₹20 LPA' && ctc < 20) return false;
        if (selectedCtc === '> ₹12 LPA' && ctc < 12) return false;
        if (selectedCtc === '> ₹6 LPA' && ctc < 6) return false;
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
  }, [
    collegesList,
    searchQuery,
    selectedNirfTier,
    selectedExam,
    selectedBudget,
    selectedCtc,
    selectedType,
    selectedNaac,
    selectedStream,
  ]);

  // Leading institutions list for right widget
  const leadingInstitutions = useMemo(() => {
    return [...collegesList]
      .filter((c) => c.nirfOverallRank && c.nirfOverallRank <= 10)
      .sort((a, b) => (a.nirfOverallRank || 999) - (b.nirfOverallRank || 999))
      .slice(0, 5);
  }, [collegesList]);

  // Discipline counts for right widget
  const disciplineCounts = useMemo(() => {
    const counts: Record<string, number> = {
      Engineering: 0,
      'Arts & Science': 0,
      Management: 0,
      Medical: 0,
      Law: 0,
    };
    collegesList.forEach((c) => {
      c.streams?.forEach((s) => {
        if (counts[s] !== undefined) counts[s]++;
      });
    });
    return counts;
  }, [collegesList]);

  // Active filter count for mobile badge
  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (selectedNirfTier !== 'All') count++;
    if (selectedExam !== 'All') count++;
    if (selectedBudget !== 'All') count++;
    if (selectedCtc !== 'All') count++;
    if (selectedType !== 'All') count++;
    if (selectedNaac !== 'All') count++;
    if (selectedStream !== 'All') count++;
    if (searchQuery.trim()) count++;
    return count;
  }, [selectedNirfTier, selectedExam, selectedBudget, selectedCtc, selectedType, selectedNaac, selectedStream, searchQuery]);

  // Compare handlers
  const handleToggleCompare = useCallback((college: College) => {
    setComparedColleges((prev) => {
      const exists = prev.some((c) => c.id === college.id);
      if (exists) {
        return prev.filter((c) => c.id !== college.id);
      }
      if (prev.length >= 4) {
        return prev;
      }
      return [...prev, college];
    });
  }, []);

  const handleRemoveFromCompare = useCallback((collegeId: string) => {
    setComparedColleges((prev) => prev.filter((c) => c.id !== collegeId));
  }, []);

  const handleClearCompare = useCallback(() => {
    setComparedColleges([]);
  }, []);

  // Reset all filters
  const handleResetFilters = useCallback(() => {
    setSearchQuery('');
    setSelectedNirfTier('All');
    setSelectedExam('All');
    setSelectedBudget('All');
    setSelectedCtc('All');
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

  // Natural query handler
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

    if (filteredColleges.length > 0) {
      setSelectedCollege(filteredColleges[0]);
    }
  };

  return (
    <main className="relative w-screen h-screen overflow-hidden bg-[#f8fafc] text-slate-900 font-sans select-none">
      {/* 1. Full-Bleed Digital India Map & 3D Globe */}
      <IndiaGlobeMap
        colleges={filteredColleges}
        selectedCollege={selectedCollege}
        onSelectCollege={(college) => setSelectedCollege(college)}
        activeHub={activeHub}
        resetViewTrigger={resetViewTrigger}
      />

      {/* Dynamic Compare Floating Tray (when 1 or more colleges added) */}
      <ComparisonFloatingBar
        comparedColleges={comparedColleges}
        onOpenCompareModal={() => setIsCompareModalOpen(true)}
        onRemoveCollege={handleRemoveFromCompare}
        onClearAll={handleClearCompare}
      />

      {/* Mobile Drawer Backdrop */}
      {isMobileFilterOpen && (
        <div
          className="lg:hidden fixed inset-0 z-30 bg-slate-900/40 backdrop-blur-xs animate-in fade-in-0 duration-200"
          onClick={() => setIsMobileFilterOpen(false)}
        />
      )}

      {/* Floating Filter Button on Mobile */}
      <button
        type="button"
        onClick={() => setIsMobileFilterOpen(true)}
        className="lg:hidden fixed top-3.5 left-3.5 z-20 flex items-center gap-1.5 px-3 py-2 bg-white/95 backdrop-blur-xl rounded-full border border-slate-200/90 shadow-md text-xs font-bold text-slate-800 active:scale-95 transition-all"
      >
        <Search className="w-3.5 h-3.5 text-[#0b53c3]" />
        <span>Filters</span>
        {activeFiltersCount > 0 && (
          <span className="w-4 h-4 rounded-full bg-[#0b53c3] text-white text-[10px] flex items-center justify-center font-bold">
            {activeFiltersCount}
          </span>
        )}
      </button>

      {/* 2. Top Action Bar */}
      <header className="fixed top-3.5 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5 sm:gap-2 bg-transparent pointer-events-auto max-w-[calc(100vw-24px)]">
        {/* Prominent Database Button in Primary #0b53c3 */}
        <button
          type="button"
          onClick={() => setIsDatabaseOpen(true)}
          className="flex items-center gap-1.5 sm:gap-2.5 px-3.5 sm:px-5 py-2 sm:py-2.5 bg-[#0b53c3] hover:bg-[#09429e] text-white rounded-full shadow-lg font-bold text-xs tracking-tight transition-all hover:scale-105 active:scale-95 border border-blue-400/30"
        >
          <Database className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />
          <span className="text-xs sm:text-[13px]">Database</span>
          <span className="text-[10px] sm:text-[11px] bg-white/25 px-1.5 sm:px-2 py-0.5 rounded-full font-mono font-bold">
            {totalDatabaseCount.toLocaleString()}
          </span>
        </button>

        {/* Dynamic Compare Action Pill (if 1+ colleges added) */}
        {comparedColleges.length > 0 && (
          <button
            type="button"
            onClick={() => setIsCompareModalOpen(true)}
            className="flex items-center gap-1 px-3 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-full shadow-md font-bold text-xs transition-all"
          >
            <Layers className="w-3.5 h-3.5 text-blue-400" />
            <span>Compare ({comparedColleges.length})</span>
          </button>
        )}

        {/* Architecture Info Button (?) */}
        <button
          type="button"
          onClick={() => setIsArchitectureOpen(true)}
          aria-label="What is Manifest"
          className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white/95 backdrop-blur-xl border border-slate-200/90 text-slate-700 hover:text-[#0b53c3] hover:border-[#0b53c3]/40 shadow-sm flex items-center justify-center text-xs font-bold transition-colors shrink-0"
        >
          <HelpCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
        </button>

        {/* Reset Camera to Full India */}
        <button
          type="button"
          onClick={handleResetFilters}
          aria-label="Reset Map to Full India"
          className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white/95 backdrop-blur-xl border border-slate-200/90 text-slate-700 hover:text-slate-900 shadow-sm flex items-center justify-center transition-colors shrink-0"
          title="Reset View"
        >
          <Compass className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
        </button>
      </header>

      {/* 3. Floating Left Sidebar (Clean Console Logo Header, Rich Student Filters) */}
      <aside
        className={`fixed top-3 left-3 bottom-3 w-[335px] max-w-[calc(100vw-24px)] z-35 bg-white/95 backdrop-blur-2xl rounded-3xl border border-slate-200/90 shadow-2xl flex flex-col overflow-hidden pointer-events-auto transition-transform duration-300 ease-in-out ${
          isMobileFilterOpen ? 'translate-x-0' : '-translate-x-[120%] lg:translate-x-0'
        }`}
      >
        {/* Top Header with Console Logo */}
        <div className="p-4 sm:p-5 pb-3 sm:pb-4 border-b border-slate-100">
          <div className="flex items-center justify-between py-1">
            <div className="flex-1 flex justify-center">
              <ConsoleLogo size="xl" className="justify-center" />
            </div>
            <button
              type="button"
              onClick={() => setIsMobileFilterOpen(false)}
              className="lg:hidden p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              aria-label="Close Filters"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <p className="text-xs text-slate-500 font-semibold text-center mt-2 leading-relaxed">
            Registry of <span className="font-extrabold text-slate-800">{totalDatabaseCount.toLocaleString()}</span> degree-granting higher education institutions.
          </p>

          {/* Search Input with Live Spinner */}
          <div className="relative mt-3.5">
            {isSearchingLive ? (
              <Loader2 className="w-4 h-4 text-[#0b53c3] absolute left-3 top-1/2 -translate-y-1/2 animate-spin" />
            ) : (
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            )}
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={isSearchingLive ? 'Searching 70,623 live colleges...' : 'Search 70k+ colleges, cities, AISHE...'}
              className="pl-9 pr-8 h-9 text-xs bg-slate-50/90 border-slate-200 rounded-xl font-semibold focus-visible:ring-[#0b53c3]"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Scrollable Filters Body */}
        <div className="p-5 overflow-y-auto flex-1 space-y-4 text-xs">
          {/* 1. NIRF RANK TIER */}
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Award className="w-3.5 h-3.5 text-[#0b53c3]" />
                NIRF Rank Tier
              </span>
              {selectedNirfTier !== 'All' && (
                <button
                  type="button"
                  onClick={() => setSelectedNirfTier('All')}
                  className="text-[#0b53c3] text-[10px] font-bold lowercase hover:underline"
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
                  className={`px-2 py-2 rounded-xl text-xs font-bold transition-all text-center ${
                    selectedNirfTier === tier
                      ? 'bg-[#0b53c3] text-white shadow-xs'
                      : 'bg-slate-100/90 text-slate-700 hover:bg-slate-200/80'
                  }`}
                >
                  {tier}
                </button>
              ))}
            </div>
          </div>

          {/* 2. ACCEPTED ENTRANCE EXAM */}
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
              <GraduationCap className="w-3.5 h-3.5 text-[#0b53c3]" />
              Entrance Exam
            </div>
            <div className="flex flex-wrap gap-1.5">
              {['All', 'JEE Advanced', 'JEE Main', 'NEET-UG', 'CAT', 'GATE', 'CUET', 'CLAT'].map((exam) => (
                <button
                  key={exam}
                  type="button"
                  onClick={() => setSelectedExam(exam === 'All' ? 'All' : exam)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                    selectedExam === exam
                      ? 'bg-[#0b53c3] text-white shadow-xs'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200/70'
                  }`}
                >
                  {exam}
                </button>
              ))}
            </div>
          </div>

          {/* 3. TUITION BUDGET RANGE */}
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
              <IndianRupee className="w-3.5 h-3.5 text-[#0b53c3]" />
              Annual Tuition Budget
            </div>
            <div className="grid grid-cols-2 gap-1.5">
              {['All', '< ₹1 Lakh', '₹1L - ₹3L', '₹3L - ₹6L'].map((budget) => (
                <button
                  key={budget}
                  type="button"
                  onClick={() => setSelectedBudget(budget)}
                  className={`px-2 py-1.5 rounded-lg text-xs font-semibold transition-all text-center ${
                    selectedBudget === budget
                      ? 'bg-[#0b53c3] text-white shadow-xs'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200/70'
                  }`}
                >
                  {budget}
                </button>
              ))}
            </div>
          </div>

          {/* 4. MEDIAN PLACEMENT TIER */}
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
              <Briefcase className="w-3.5 h-3.5 text-[#0b53c3]" />
              Placement Package Tier
            </div>
            <div className="grid grid-cols-2 gap-1.5">
              {['All', '> ₹20 LPA', '> ₹12 LPA', '> ₹6 LPA'].map((ctc) => (
                <button
                  key={ctc}
                  type="button"
                  onClick={() => setSelectedCtc(ctc)}
                  className={`px-2 py-1.5 rounded-lg text-xs font-semibold transition-all text-center ${
                    selectedCtc === ctc
                      ? 'bg-[#0b53c3] text-white shadow-xs'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200/70'
                  }`}
                >
                  {ctc}
                </button>
              ))}
            </div>
          </div>

          {/* 5. INSTITUTION CATEGORY */}
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
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
                  className={`w-full flex items-center justify-between px-3 py-1.5 rounded-xl text-xs font-medium transition-colors ${
                    selectedType === item.value
                      ? 'bg-blue-50 text-[#0b53c3] font-bold'
                      : 'text-slate-700 hover:bg-slate-100/80'
                  }`}
                >
                  <span className="truncate">{item.label}</span>
                  {selectedType === item.value && <Check className="w-3.5 h-3.5 text-[#0b53c3]" />}
                </button>
              ))}
            </div>
          </div>

          {/* 6. ACCREDITATION */}
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
              NAAC Accreditation
            </div>
            <div className="flex flex-wrap gap-1.5">
              {['All', 'A++', 'A+', 'A'].map((grade) => (
                <button
                  key={grade}
                  type="button"
                  onClick={() => setSelectedNaac(grade)}
                  className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                    selectedNaac === grade
                      ? 'bg-[#0b53c3] text-white shadow-xs'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200/80'
                  }`}
                >
                  {grade === 'All' ? 'All NAAC' : `NAAC ${grade}`}
                </button>
              ))}
            </div>
          </div>

          {/* 7. DISCIPLINES */}
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
              Academic Stream
            </div>
            <div className="space-y-1">
              {['All', 'Engineering', 'Management', 'Medical', 'Arts & Science', 'Law'].map(
                (stream) => (
                  <button
                    key={stream}
                    type="button"
                    onClick={() => setSelectedStream(stream)}
                    className={`w-full flex items-center justify-between px-3 py-1.5 rounded-xl text-xs font-medium transition-colors ${
                      selectedStream === stream
                        ? 'bg-blue-50 text-[#0b53c3] font-bold'
                        : 'text-slate-700 hover:bg-slate-100/80'
                    }`}
                  >
                    <span>{stream === 'All' ? 'All Streams' : stream}</span>
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
        <div className="p-4 border-t border-slate-100 bg-slate-50/80 flex items-center justify-between text-xs">
          <div className="text-xs text-slate-600 font-semibold">
            <span className="font-extrabold text-slate-900">{filteredColleges.length}</span> visible
            {isFetchingLive && <span className="ml-1 text-[#0b53c3] font-bold animate-pulse">&middot; live</span>}
          </div>
          <button
            type="button"
            onClick={handleResetFilters}
            className="text-xs font-bold text-[#0b53c3] hover:text-[#09429e] flex items-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset All
          </button>
        </div>
      </aside>

      {/* 4. Bottom Data Dock (Interactive Pill Card Strip with Logos) */}
      <section className="fixed bottom-2.5 sm:bottom-3.5 left-2 sm:left-4 lg:left-[350px] right-2 sm:right-4 xl:right-[330px] z-20 pointer-events-auto bg-white/95 backdrop-blur-2xl rounded-2xl sm:rounded-3xl border border-slate-200/90 shadow-2xl overflow-hidden transition-all">
        {/* Dock Header */}
        <div className="px-4 py-2.5 border-b border-slate-100 flex items-center justify-between gap-3 bg-slate-50/70">
          <div className="flex items-center gap-2.5">
            <div className="w-6 h-6 rounded-lg bg-[#0b53c3] flex items-center justify-center text-white text-xs font-black shadow-xs">
              M
            </div>
            <div className="text-xs font-bold text-slate-900 tracking-tight">
              Current view <span className="font-mono text-[#0b53c3] font-extrabold">{filteredColleges.length}</span>
            </div>

            {/* Mode Toggle: Institutions vs Top Programs */}
            <div className="flex items-center p-0.5 bg-slate-200/70 rounded-xl ml-2">
              <button
                type="button"
                onClick={() => setDockViewMode('colleges')}
                className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
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
                className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
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
            <span className="text-[11px] text-slate-400 font-medium hidden sm:inline">
              Click any chip to inspect
            </span>
            <button
              type="button"
              onClick={() => setIsDockExpanded(!isDockExpanded)}
              className="p-1 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors"
              aria-label={isDockExpanded ? 'Collapse dock' : 'Expand dock'}
            >
              {isDockExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Chips Wrap Grid with Crisp Logos */}
        {isDockExpanded && (
          <div className="p-3 sm:p-3.5 max-h-[125px] sm:max-h-[155px] overflow-y-auto">
            {dockViewMode === 'colleges' ? (
              <div className="flex flex-wrap gap-2">
                {filteredColleges.slice(0, 28).map((college) => {
                  const isSelected = selectedCollege?.id === college.id;
                  const isCompared = comparedColleges.some((c) => c.id === college.id);
                  return (
                    <button
                      key={college.id}
                      type="button"
                      onClick={() => setSelectedCollege(college)}
                      className={`pl-1.5 pr-3 py-1 rounded-2xl text-xs font-semibold transition-all flex items-center gap-2 border shadow-2xs ${
                        isSelected
                          ? 'bg-[#0b53c3] text-white border-[#0b53c3] shadow-md scale-105'
                          : 'bg-white hover:bg-blue-50/50 text-slate-800 border-slate-200/80 hover:border-blue-300'
                      }`}
                    >
                      <InstitutionLogo
                        name={college.name}
                        shortName={college.shortName}
                        slug={college.slug}
                        code={college.code}
                        size="xs"
                      />
                      <span className="truncate max-w-[150px] font-bold">
                        {college.shortName || college.name}
                      </span>
                      {college.nirfOverallRank && (
                        <span
                          className={`text-[10px] font-black px-1.5 py-0.2 rounded-md ${
                            isSelected ? 'bg-white/20 text-white' : 'bg-blue-50 text-[#0b53c3]'
                          }`}
                        >
                          #{college.nirfOverallRank}
                        </span>
                      )}
                      {isCompared && (
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" title="In compare" />
                      )}
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="flex flex-wrap gap-2">
                {filteredColleges.slice(0, 18).flatMap((college) =>
                  (college.courses || []).slice(0, 1).map((course) => (
                    <button
                      key={course.id}
                      type="button"
                      onClick={() => setSelectedCollege(college)}
                      className="pl-2 pr-3 py-1.5 rounded-2xl text-xs font-semibold bg-white hover:bg-blue-50/50 text-slate-800 border border-slate-200 flex items-center gap-2 shadow-2xs"
                    >
                      <InstitutionLogo
                        name={college.name}
                        shortName={college.shortName}
                        slug={college.slug}
                        code={college.code}
                        size="xs"
                      />
                      <div className="text-left">
                        <div className="font-bold text-slate-900 text-xs">{course.name}</div>
                        <div className="text-[10px] text-slate-400">
                          {college.shortName} &middot; ₹{(course.annualFee / 100000).toFixed(1)}L/yr
                        </div>
                      </div>
                    </button>
                  ))
                )}
              </div>
            )}
          </div>
        )}
      </section>

      {/* 5. Floating Right Widgets Stack (Desktop only) */}
      <aside className="hidden xl:flex fixed top-3.5 right-3.5 bottom-3.5 w-[310px] z-20 flex-col gap-2.5 pointer-events-auto overflow-y-auto">
        {/* Widget 1: Leading Institutions */}
        <div className="p-4 bg-white/95 backdrop-blur-2xl rounded-3xl border border-slate-200/90 shadow-xl">
          <div className="flex items-center justify-between text-xs font-bold text-slate-900 mb-3">
            <span className="flex items-center gap-1.5">
              <Award className="w-4 h-4 text-[#0b53c3]" />
              Leading Institutions
            </span>
            <span className="text-[10px] font-mono text-slate-400 font-semibold">NIRF 2024</span>
          </div>

          <div className="space-y-2.5">
            {leadingInstitutions.map((college) => {
              const rank = college.nirfOverallRank || 1;
              const percent = Math.max(15, 100 - (rank - 1) * 9);
              return (
                <button
                  key={college.id}
                  type="button"
                  onClick={() => setSelectedCollege(college)}
                  className="w-full text-left group"
                >
                  <div className="flex items-center justify-between text-xs mb-1">
                    <div className="flex items-center gap-2 truncate">
                      <InstitutionLogo
                        name={college.name}
                        shortName={college.shortName}
                        slug={college.slug}
                        code={college.code}
                        size="xs"
                      />
                      <span className="font-bold text-slate-800 group-hover:text-[#0b53c3] transition-colors truncate">
                        {college.shortName || college.name}
                      </span>
                    </div>
                    <span className="font-black text-[#0b53c3] text-xs shrink-0 ml-2">
                      #{rank}
                    </span>
                  </div>
                  {/* Progress Bar Meter in #0b53c3 */}
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
        <div className="p-4 bg-white/95 backdrop-blur-2xl rounded-3xl border border-slate-200/90 shadow-xl">
          <div className="flex items-center justify-between text-xs font-bold text-slate-900 mb-2.5">
            <span className="flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-[#0b53c3]" />
              Key Education Hubs
            </span>
            <span className="text-[10px] font-mono text-slate-400 font-semibold">70k+</span>
          </div>

          <div className="space-y-1">
            {EDUCATION_HUBS.map((hub, index) => {
              const isActive = activeHub?.id === hub.id;
              return (
                <button
                  key={hub.id}
                  type="button"
                  onClick={() => handleSelectHub(hub)}
                  className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-xl text-xs transition-all text-left ${
                    isActive
                      ? 'bg-blue-50 text-[#0b53c3] font-bold shadow-2xs'
                      : 'text-slate-700 hover:bg-slate-100/80'
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    <span className="text-[10px] text-slate-400 font-mono font-bold">{index + 1}.</span>
                    <span className="truncate font-semibold">{hub.name}</span>
                  </div>
                  <span className="font-mono text-xs text-slate-500 font-bold shrink-0">
                    {hub.count.toLocaleString()}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Widget 3: Disciplines */}
        <div className="p-4 bg-white/95 backdrop-blur-2xl rounded-3xl border border-slate-200/90 shadow-xl">
          <div className="flex items-center justify-between text-xs font-bold text-slate-900 mb-2.5">
            <span className="flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4 text-[#0b53c3]" />
              Disciplines
            </span>
            <span className="text-[10px] font-mono text-slate-400 font-semibold">Distribution</span>
          </div>

          <div className="space-y-1">
            {Object.entries(disciplineCounts).map(([stream, count]) => (
              <button
                key={stream}
                type="button"
                onClick={() => setSelectedStream(stream)}
                className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-xl text-xs transition-colors ${
                  selectedStream === stream
                    ? 'bg-blue-50 text-[#0b53c3] font-bold'
                    : 'text-slate-600 hover:bg-slate-100/80'
                }`}
              >
                <span className="font-semibold">{stream}</span>
                <span className="font-mono text-xs text-slate-500 font-bold">{count}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Widget 4: Ask Manifest Query Box */}
        <div className="p-4 bg-white/95 backdrop-blur-2xl rounded-3xl border border-slate-200/90 shadow-xl">
          <div className="flex items-center justify-between text-xs font-bold text-slate-900 mb-1">
            <span className="flex items-center gap-1.5 text-slate-900">
              <Sparkles className="w-4 h-4 text-[#0b53c3]" />
              Ask Manifest
            </span>
            {askStatus && (
              <button
                type="button"
                onClick={() => {
                  setAskStatus(null);
                  setAskInput('');
                }}
                className="text-[10px] text-slate-400 hover:text-slate-700 font-bold"
              >
                clear
              </button>
            )}
          </div>

          <p className="text-[11px] text-slate-500 mb-3 leading-tight italic">
            70,000+ colleges indexed. What are you looking for?
          </p>

          <form onSubmit={handleAskSubmit} className="space-y-2">
            <div className="relative">
              <Input
                value={askInput}
                onChange={(e) => setAskInput(e.target.value)}
                placeholder="e.g. top CSE in Bengaluru..."
                className="pr-9 h-9 text-xs bg-slate-50 border-slate-200 rounded-xl font-medium focus-visible:ring-[#0b53c3]"
              />
              <button
                type="submit"
                className="w-7 h-7 rounded-lg bg-[#0b53c3] hover:bg-[#09429e] text-white flex items-center justify-center absolute right-1 top-1/2 -translate-y-1/2 transition-all shadow-xs"
                aria-label="Send query"
              >
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </form>

          {/* Quick Suggestions */}
          <div className="mt-2.5 flex flex-wrap gap-1.5">
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
                className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-[10px] font-semibold transition-colors"
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      </aside>

      {/* 6. Floating Widespread Institution Inspector Card / Drawer */}
      <InstitutionInspectorModal
        college={selectedCollege}
        onClose={() => setSelectedCollege(null)}
        isCompared={selectedCollege ? comparedColleges.some((c) => c.id === selectedCollege.id) : false}
        onToggleCompare={handleToggleCompare}
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
        comparedIds={comparedColleges.map((c) => c.id)}
        onToggleCompare={handleToggleCompare}
      />

      {/* 8. Dynamic Compare Benchmark Matrix Modal */}
      <CompareModal
        comparedColleges={comparedColleges}
        isOpen={isCompareModalOpen}
        onClose={() => setIsCompareModalOpen(false)}
        onRemoveCollege={handleRemoveFromCompare}
        onClearAll={handleClearCompare}
      />


      {/* 9. About Manifest Architecture Modal */}
      <ManifestArchitectureModal
        isOpen={isArchitectureOpen}
        onClose={() => setIsArchitectureOpen(false)}
      />
    </main>
  );
}
