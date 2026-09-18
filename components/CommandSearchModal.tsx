'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Search, MapPin, Building, ArrowRight, X } from 'lucide-react';
import { College } from '../lib/types';
import { queryCollegesFromDatabase } from '../lib/collegeService';

interface CommandSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CommandSearchModal({ isOpen, onClose }: CommandSearchModalProps) {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<College[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setQuery('');
      setSelectedIndex(0);
      queryCollegesFromDatabase({
        searchQuery: '',
        selectedStates: [],
        selectedStreams: [],
        selectedTypes: [],
        selectedOwnership: [],
        selectedNaac: [],
        sortBy: 'nirf',
        page: 1,
        pageSize: 8,
      }).then((res) => setResults(res.colleges));
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    setIsSearching(true);
    const timer = setTimeout(async () => {
      try {
        const res = await queryCollegesFromDatabase({
          searchQuery: query.trim(),
          selectedStates: [],
          selectedStreams: [],
          selectedTypes: [],
          selectedOwnership: [],
          selectedNaac: [],
          sortBy: 'nirf',
          page: 1,
          pageSize: 10,
        });
        setResults(res.colleges);
        setSelectedIndex(0);
      } catch (err) {
        console.error('Command search error:', err);
      } finally {
        setIsSearching(false);
      }
    }, 120);

    return () => clearTimeout(timer);
  }, [query, isOpen]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1 < results.length ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 >= 0 ? prev - 1 : results.length - 1));
    } else if (e.key === 'Enter' && results[selectedIndex]) {
      e.preventDefault();
      const col = results[selectedIndex];
      router.push(`/colleges/${col.id}`);
      onClose();
    } else if (e.key === 'Escape') {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-start justify-center pt-24 px-4"
      onClick={onClose}
    >
      <div
        className="bg-white border border-[#E2E8F0] rounded-xl w-full max-w-[620px] shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={handleKeyDown}
      >
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-[#E2E8F0]">
          <Search className="w-4 h-4 text-[#94A3B8]" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search 70,623 colleges (e.g. IITB, Medical, Bangalore, C-43727)..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full text-[14px] text-[#0F172A] placeholder-[#94A3B8] outline-none"
          />
          {isSearching && (
            <div className="w-3.5 h-3.5 border-2 border-[#2563EB] border-t-transparent rounded-full animate-spin"></div>
          )}
          <button
            onClick={onClose}
            className="text-[#94A3B8] hover:text-[#0F172A] p-1 rounded"
            type="button"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="max-h-[380px] overflow-y-auto p-2 flex flex-col gap-1">
          {results.length === 0 && !isSearching ? (
            <div className="py-8 text-center text-[13px] text-[#94A3B8]">
              No institutions found matching &quot;{query}&quot;.
            </div>
          ) : (
            results.map((col, idx) => (
              <div
                key={col.id}
                className={`flex items-center justify-between p-2.5 rounded-lg cursor-pointer transition-colors ${
                  idx === selectedIndex ? 'bg-[#EFF6FF] text-[#1E40AF]' : 'hover:bg-[#F8FAFC]'
                }`}
                onClick={() => {
                  router.push(`/colleges/${col.id}`);
                  onClose();
                }}
              >
                <div className="flex flex-col gap-0.5 min-w-0 pr-2">
                  <div className="font-semibold text-[13.5px] text-[#0F172A] truncate">
                    {col.name}
                  </div>
                  <div className="flex items-center gap-2 text-[12px] text-[#64748B]">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {col.city}, {col.state}
                    </span>
                    {col.code && (
                      <span className="bg-[#F1F5F9] px-1.5 py-0.2 rounded text-[11px] font-mono">
                        {col.code}
                      </span>
                    )}
                    {col.nirfOverallRank && (
                      <span className="text-[#2563EB] font-medium text-[11px]">
                        NIRF #{col.nirfOverallRank}
                      </span>
                    )}
                  </div>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-[#94A3B8] flex-shrink-0" />
              </div>
            ))
          )}
        </div>

        <div className="flex items-center justify-between px-4 py-2.5 border-t border-[#E2E8F0] bg-[#F8FAFC] text-[11.5px] text-[#64748B]">
          <div className="flex items-center gap-2">
            <span>Navigate</span>
            <span className="kbd-badge">↑</span>
            <span className="kbd-badge">↓</span>
            <span>Select</span>
            <span className="kbd-badge">↵</span>
          </div>
          <div>
            <span className="kbd-badge">ESC</span> to close
          </div>
        </div>
      </div>
    </div>
  );
}

