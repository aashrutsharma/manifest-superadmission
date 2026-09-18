'use client';

import React, { useState, useCallback, useRef, Suspense } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Shell from '@/components/Shell';
import InstitutionLogo from '@/components/InstitutionLogo';
import {
  Search,
  MessageSquare,
  ArrowRight,
  ArrowUp,
  MapPin,
  Building,
  RotateCcw,
  Sliders,
  BookmarkPlus,
  BookOpen,
  Sparkles,
  Award,
  ChevronLeft,
  ChevronRight,
  GraduationCap,
  ExternalLink,
  ChevronDown,
  Mic,
  SlidersHorizontal,
  X,
} from 'lucide-react';
import { queryCollegesFromDatabase, FetchCollegesResult } from '@/lib/collegeService';
import { College, FilterState } from '@/lib/types';
import { toast } from 'sonner';

const QUICK_PROMPTS = [
  { icon: '🏛️', text: 'Tell me about IIT Bombay NIRF rank, courses, and packages' },
  { icon: '⚙️', text: 'Top government engineering colleges in Maharashtra' },
  { icon: '🏥', text: 'Top medical colleges in Delhi with NAAC A++ grade' },
  { icon: '💼', text: 'Best MBA colleges in Bangalore with NIRF top 50' },
];

const STREAMS_LIST = [
  'All streams',
  'Engineering',
  'Medical',
  'Management',
  'Law',
  'Arts & Science',
  'Pharmacy',
  'Commerce',
];

const STATES_TOP = [
  'All states',
  'Maharashtra',
  'Tamil Nadu',
  'Karnataka',
  'Uttar Pradesh',
  'Delhi',
  'Rajasthan',
  'Gujarat',
  'Telangana',
];

function StreamContent() {
  const [activeTab, setActiveTab] = useState<'chat' | 'search'>('chat');
  const [query, setQuery] = useState('');
  const [submittedQuery, setSubmittedQuery] = useState('');
  const [results, setResults] = useState<FetchCollegesResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);

  // Playground Settings Sidebar State
  const [searchMode, setSearchMode] = useState<'agentic' | 'auto'>('agentic');
  const [selectedStream, setSelectedStream] = useState('All streams');
  const [selectedState, setSelectedState] = useState('All states');
  const [resultsCount, setResultsCount] = useState(24);
  const [strictness, setStrictness] = useState('0.40');
  const [rerankResults, setRerankResults] = useState(true);
  const [rewriteQuery, setRewriteQuery] = useState(false);
  const [includeRelated, setIncludeRelated] = useState(true);
  const [includePlacements, setIncludePlacements] = useState(true);
  const [includeNirf, setIncludeNirf] = useState(true);

  const inputRef = useRef<HTMLInputElement>(null);

  const doSearch = useCallback(
    async (q: string, pg: number) => {
      setLoading(true);
      setSubmittedQuery(q);
      try {
        const res = await queryCollegesFromDatabase({
          searchQuery: q,
          selectedStates: selectedState !== 'All states' ? [selectedState] : [],
          selectedStreams: selectedStream !== 'All streams' ? [selectedStream] : [],
          selectedTypes: [],
          selectedOwnership: [],
          selectedNaac: [],
          sortBy: 'nirf',
          page: pg,
          pageSize: resultsCount,
        });
        setResults(res);
        setPage(pg);
      } catch (err) {
        console.error('Search failed:', err);
      } finally {
        setLoading(false);
      }
    },
    [selectedState, selectedStream, resultsCount]
  );

  const handleSearchSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!query.trim()) return;
    doSearch(query.trim(), 1);
  };

  const handlePromptClick = (text: string) => {
    setQuery(text);
    doSearch(text, 1);
  };

  const handleSaveToShortlist = (college: College) => {
    try {
      const saved: College[] = JSON.parse(localStorage.getItem('manifest-basket') || '[]');
      if (saved.find((s) => s.id === college.id)) {
        toast.info('Already in your shortlist');
      } else {
        localStorage.setItem('manifest-basket', JSON.stringify([...saved, college]));
        toast.success(`${college.name.slice(0, 28)}... saved to shortlist!`);
      }
    } catch {
      toast.error('Could not save to shortlist');
    }
  };

  const handleResetSettings = () => {
    setSearchMode('agentic');
    setSelectedStream('All streams');
    setSelectedState('All states');
    setResultsCount(24);
    setStrictness('0.40');
    setRerankResults(true);
    setRewriteQuery(false);
    toast.info('Settings reset to default');
  };

  return (
    <div className="p-6 max-w-[1400px] mx-auto w-full flex flex-col gap-5">
      {/* 1. Header Title & Subtitle */}
      <div>
        <h1 className="text-[22px] font-bold tracking-tight text-slate-900">
          Playground
        </h1>
        <p className="text-[13px] text-slate-500 mt-0.5 flex items-center gap-1.5">
          <span>Search 70,623 colleges and explore higher education across India.</span>
          <a
            href="https://superadmission.com"
            target="_blank"
            rel="noreferrer"
            className="text-blue-600 hover:underline inline-flex items-center gap-0.5"
          >
            How search works <span className="text-[11px]">↗</span>
          </a>
        </p>
      </div>

      {/* 2. Main Two-Column Playground Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left / Center Work Area */}
        <div className="lg:col-span-8 xl:col-span-9 flex flex-col gap-4">
          <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-2xs">
            {/* Top Tabs: Chat / Search */}
            <div className="flex items-center gap-2 mb-8 border-b border-slate-100 pb-3">
              <button
                onClick={() => setActiveTab('chat')}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-[13px] font-medium transition-all ${
                  activeTab === 'chat'
                    ? 'bg-blue-50 text-blue-700 font-semibold border border-blue-200/60'
                    : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Conversational</span>
              </button>
              <button
                onClick={() => setActiveTab('search')}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-[13px] font-medium transition-all ${
                  activeTab === 'search'
                    ? 'bg-blue-50 text-blue-700 font-semibold border border-blue-200/60'
                    : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <Search className="w-3.5 h-3.5" />
                <span>Direct Search</span>
              </button>
            </div>

            {/* Prompt Search Box */}
            <div className="max-w-2xl mx-auto w-full flex flex-col items-center">
              {/* Logo Symbol Header (shown when no results yet) */}
              {!results && (
                <div className="flex flex-col items-center text-center mb-6">
                  <div className="w-12 h-12 rounded-xl bg-slate-100 border border-slate-200/80 flex items-center justify-center mb-3 shadow-2xs">
                    <Image
                      src="/console-logo.png"
                      alt="Console"
                      width={32}
                      height={32}
                      className="object-contain"
                    />
                  </div>
                  <h2 className="text-[17px] font-bold text-slate-900">
                    See what Manifest can do
                  </h2>
                  <p className="text-[13px] text-slate-500 mt-1">
                    Ask questions, filter by exam or NIRF, or search any of 70,623 colleges.
                  </p>
                </div>
              )}

              {/* Input Card Container */}
              <form
                onSubmit={handleSearchSubmit}
                className="w-full bg-white border border-slate-200 rounded-xl p-3 shadow-sm hover:border-slate-300 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100 transition-all mb-4"
              >
                <div className="flex items-center gap-2 mb-3 px-1">
                  <Search className="w-4 h-4 text-slate-400 shrink-0" />
                  <input
                    ref={inputRef}
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search any college, AISHE code, stream, city, state, or NIRF rank..."
                    className="w-full text-[14px] text-slate-800 placeholder-slate-400 outline-none"
                    autoFocus
                  />
                  {query && (
                    <button
                      type="button"
                      onClick={() => setQuery('')}
                      className="text-slate-400 hover:text-slate-600 p-1"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {/* Sub-bar inside the input box */}
                <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-[12px]">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="flex items-center gap-1 bg-slate-100/90 text-slate-700 px-2 py-0.5 rounded-md font-medium border border-slate-200/60 cursor-pointer">
                      <span>Sonnet 4.6 Agentic</span>
                      <ChevronDown className="w-3 h-3 text-slate-400" />
                    </span>
                    <span className="flex items-center gap-1 text-slate-500 hover:text-slate-800 px-2 py-0.5 rounded-md cursor-pointer">
                      <span># Select stream</span>
                      <ChevronDown className="w-3 h-3 text-slate-400" />
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      className="p-1.5 text-slate-400 hover:text-slate-700 rounded-md hover:bg-slate-50"
                      title="Voice query"
                    >
                      <Mic className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="submit"
                      disabled={!query.trim() || loading}
                      className="w-7 h-7 rounded-lg bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white flex items-center justify-center transition-colors shadow-xs"
                    >
                      <ArrowUp className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </form>

              {/* Quick Prompt Suggestions */}
              {!results && (
                <div className="w-full flex flex-col gap-2">
                  {QUICK_PROMPTS.map((item, idx) => (
                    <button
                      key={idx}
                      onClick={() => handlePromptClick(item.text)}
                      className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl border border-slate-200/80 bg-slate-50/50 hover:bg-slate-100/80 hover:border-slate-300 text-left transition-all group"
                    >
                      <div className="flex items-center gap-2.5 text-[13px] text-slate-700 group-hover:text-slate-900 font-medium">
                        <span className="text-base">{item.icon}</span>
                        <span>{item.text}</span>
                      </div>
                      <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-600 transition-colors" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* 3. Search Results Section */}
            {results && (
              <div className="mt-8 border-t border-slate-100 pt-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="text-[13px] text-slate-600">
                    Showing{' '}
                    <span className="font-semibold text-slate-900">
                      {results.totalCount.toLocaleString()}
                    </span>{' '}
                    institutions {submittedQuery && `for "${submittedQuery}"`}
                  </div>

                  <button
                    onClick={() => {
                      setResults(null);
                      setQuery('');
                    }}
                    className="text-[12px] text-slate-500 hover:text-slate-800 underline"
                  >
                    Clear results
                  </button>
                </div>

                {loading ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Array.from({ length: 6 }).map((_, i) => (
                      <div
                        key={i}
                        className="border border-slate-200 rounded-xl p-4 animate-pulse bg-slate-50/50 space-y-3"
                      >
                        <div className="flex gap-3">
                          <div className="w-10 h-10 rounded-lg bg-slate-200" />
                          <div className="flex-1 space-y-2">
                            <div className="h-4 bg-slate-200 rounded w-3/4" />
                            <div className="h-3 bg-slate-200 rounded w-1/2" />
                          </div>
                        </div>
                        <div className="h-3 bg-slate-200 rounded w-full" />
                      </div>
                    ))}
                  </div>
                ) : results.colleges.length === 0 ? (
                  <div className="py-12 text-center text-slate-500">
                    <Building className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                    <p className="font-semibold text-slate-700">No matching colleges found</p>
                    <p className="text-xs text-slate-400 mt-1">
                      Try adjusting keywords, state, or stream filters.
                    </p>
                  </div>
                ) : (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {results.colleges.map((col) => (
                        <div
                          key={col.id}
                          className="bg-white border border-slate-200/90 rounded-xl p-4 hover:border-blue-300 hover:shadow-sm transition-all duration-150 flex flex-col justify-between"
                        >
                          <div>
                            {/* Card Header */}
                            <div className="flex items-start gap-3 mb-2.5">
                              <InstitutionLogo name={col.name} size={42} />
                              <div className="flex-1 min-w-0">
                                <div className="flex items-start justify-between gap-2">
                                  <h3 className="font-bold text-[13.5px] text-slate-900 leading-snug truncate">
                                    {col.name}
                                  </h3>
                                  {col.nirfOverallRank && (
                                    <span className="shrink-0 text-[10.5px] font-bold bg-blue-50 text-blue-700 border border-blue-200/80 px-1.5 py-0.2 rounded">
                                      NIRF #{col.nirfOverallRank}
                                    </span>
                                  )}
                                </div>
                                <div className="flex items-center gap-1.5 text-[11.5px] text-slate-500 mt-0.5">
                                  <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                                  <span>
                                    {col.city}, {col.state}
                                  </span>
                                  {col.code && (
                                    <span className="font-mono text-[10.5px] text-slate-400 bg-slate-100 px-1 rounded">
                                      {col.code}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>

                            {/* Tags */}
                            <div className="flex flex-wrap gap-1.5 mb-3">
                              <span className="text-[11px] font-medium bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md">
                                {col.universityType}
                              </span>
                              <span className="text-[11px] font-medium bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md">
                                {col.ownership}
                              </span>
                              {col.naacGrade && (
                                <span className="text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/60 px-1.5 py-0.5 rounded-md">
                                  NAAC {col.naacGrade}
                                </span>
                              )}
                              {col.streams.slice(0, 2).map((s) => (
                                <span
                                  key={s}
                                  className="text-[11px] text-slate-600 bg-slate-50 border border-slate-200 px-2 py-0.5 rounded-md"
                                >
                                  {s}
                                </span>
                              ))}
                            </div>

                            {/* Stats */}
                            <div className="grid grid-cols-2 gap-2 bg-slate-50/80 rounded-lg p-2.5 mb-3 text-[11.5px]">
                              <div>
                                <span className="text-slate-400 text-[10px] uppercase font-bold block">
                                  Median Salary
                                </span>
                                <span className="font-bold text-slate-800 font-mono">
                                  {col.medianPackageLpa > 0
                                    ? `${col.medianPackageLpa.toFixed(1)} LPA`
                                    : 'Available on query'}
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

                          {/* Card Footer */}
                          <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                            <Link
                              href={`/colleges/${col.id}`}
                              className="text-[12px] font-semibold text-blue-600 hover:text-blue-800 inline-flex items-center gap-1"
                            >
                              View college profile <ArrowRight className="w-3 h-3" />
                            </Link>

                            <button
                              onClick={() => handleSaveToShortlist(col)}
                              className="p-1.5 rounded-md text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                              title="Save to shortlist"
                            >
                              <BookmarkPlus className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Pagination */}
                    {results.totalPages > 1 && (
                      <div className="flex items-center justify-between mt-6 pt-4 border-t border-slate-100">
                        <button
                          disabled={page <= 1}
                          onClick={() => doSearch(submittedQuery, page - 1)}
                          className="flex items-center gap-1 text-[12px] font-medium text-slate-600 hover:text-slate-900 disabled:opacity-30 disabled:cursor-not-allowed"
                        >
                          <ChevronLeft className="w-4 h-4" /> Previous
                        </button>

                        <div className="text-[12px] text-slate-500 font-mono">
                          Page {page} of {results.totalPages}
                        </div>

                        <button
                          disabled={page >= results.totalPages}
                          onClick={() => doSearch(submittedQuery, page + 1)}
                          className="flex items-center gap-1 text-[12px] font-medium text-slate-600 hover:text-slate-900 disabled:opacity-30 disabled:cursor-not-allowed"
                        >
                          Next <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right Sidebar: Memory / Search Settings */}
        <div className="lg:col-span-4 xl:col-span-3 flex flex-col gap-4">
          <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-2xs select-none">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <span className="font-bold text-[13.5px] text-slate-900">Search settings</span>
              <button
                onClick={handleResetSettings}
                className="flex items-center gap-1 text-[11px] text-slate-500 hover:text-slate-800"
              >
                <span>Reset</span>
                <RotateCcw className="w-3 h-3" />
              </button>
            </div>

            {/* Mode selection toggle */}
            <div className="mb-4">
              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
                Search Mode
              </label>
              <div className="grid grid-cols-2 p-0.5 bg-slate-100 rounded-lg text-[12px] font-semibold text-slate-600">
                <button
                  type="button"
                  onClick={() => setSearchMode('agentic')}
                  className={`py-1 rounded-md transition-all ${
                    searchMode === 'agentic'
                      ? 'bg-white text-blue-700 shadow-2xs'
                      : 'hover:text-slate-900'
                  }`}
                >
                  Agentic
                </button>
                <button
                  type="button"
                  onClick={() => setSearchMode('auto')}
                  className={`py-1 rounded-md transition-all ${
                    searchMode === 'auto'
                      ? 'bg-white text-blue-700 shadow-2xs'
                      : 'hover:text-slate-900'
                  }`}
                >
                  Auto-search
                </button>
              </div>
            </div>

            {/* Stream filter dropdown */}
            <div className="mb-4">
              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
                Academic Stream
              </label>
              <select
                value={selectedStream}
                onChange={(e) => setSelectedStream(e.target.value)}
                className="w-full text-[12.5px] text-slate-800 bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 outline-none hover:border-slate-300 focus:border-blue-500"
              >
                {STREAMS_LIST.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            {/* State filter dropdown */}
            <div className="mb-4">
              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
                Target State
              </label>
              <select
                value={selectedState}
                onChange={(e) => setSelectedState(e.target.value)}
                className="w-full text-[12.5px] text-slate-800 bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 outline-none hover:border-slate-300 focus:border-blue-500"
              >
                {STATES_TOP.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            {/* Results count stepper */}
            <div className="flex items-center justify-between mb-3 text-[12.5px]">
              <span className="text-slate-600">Results retrieved</span>
              <div className="flex items-center border border-slate-200 rounded-md overflow-hidden bg-slate-50 font-mono text-[12px]">
                <button
                  type="button"
                  onClick={() => setResultsCount((prev) => Math.max(8, prev - 8))}
                  className="px-2 py-0.5 hover:bg-slate-200 text-slate-600"
                >
                  -
                </button>
                <span className="px-2 font-semibold text-slate-800 bg-white">{resultsCount}</span>
                <button
                  type="button"
                  onClick={() => setResultsCount((prev) => Math.min(48, prev + 8))}
                  className="px-2 py-0.5 hover:bg-slate-200 text-slate-600"
                >
                  +
                </button>
              </div>
            </div>

            {/* Match strictness */}
            <div className="flex items-center justify-between mb-4 text-[12.5px]">
              <span className="text-slate-600">Match strictness</span>
              <div className="flex items-center border border-slate-200 rounded-md overflow-hidden bg-slate-50 font-mono text-[12px]">
                <span className="px-2.5 py-0.5 font-semibold text-slate-800 bg-white">
                  {strictness}
                </span>
              </div>
            </div>

            {/* Toggles */}
            <div className="border-t border-slate-100 pt-3 flex flex-col gap-2.5">
              <label className="flex items-center justify-between cursor-pointer text-[12.5px] text-slate-700">
                <span>Rerank by NIRF</span>
                <input
                  type="checkbox"
                  checked={rerankResults}
                  onChange={(e) => setRerankResults(e.target.checked)}
                  className="accent-blue-600 w-4 h-4 cursor-pointer"
                />
              </label>
              <label className="flex items-center justify-between cursor-pointer text-[12.5px] text-slate-700">
                <span>Expand acronyms (IIT, NIT)</span>
                <input
                  type="checkbox"
                  checked={rewriteQuery}
                  onChange={(e) => setRewriteQuery(e.target.checked)}
                  className="accent-blue-600 w-4 h-4 cursor-pointer"
                />
              </label>
            </div>

            {/* Include in results checkboxes */}
            <div className="border-t border-slate-100 mt-4 pt-3">
              <span className="text-[10.5px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
                Include in Results
              </span>
              <div className="flex flex-col gap-1.5 text-[12px] text-slate-600">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={includeRelated}
                    onChange={(e) => setIncludeRelated(e.target.checked)}
                    className="accent-blue-600 rounded"
                  />
                  <span>Affiliated colleges</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={includePlacements}
                    onChange={(e) => setIncludePlacements(e.target.checked)}
                    className="accent-blue-600 rounded"
                  />
                  <span>Placement & packages</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={includeNirf}
                    onChange={(e) => setIncludeNirf(e.target.checked)}
                    className="accent-blue-600 rounded"
                  />
                  <span>NIRF ranking breakdown</span>
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function StreamPage() {
  return (
    <Shell title="Playground" badgeText="70,623 Colleges">
      <Suspense fallback={<div className="p-8 text-slate-400 text-sm">Loading Playground...</div>}>
        <StreamContent />
      </Suspense>
    </Shell>
  );
}
