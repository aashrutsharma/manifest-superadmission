'use client';

import React, { useState, useEffect, useRef } from 'react';
import { College } from '../lib/types';
import { queryCollegesFromDatabase } from '../lib/collegeService';

interface CommandSearchProps {
  isOpen: boolean;
  onClose: () => void;
  colleges: College[];
  onSelectCollege: (college: College) => void;
}

export default function CommandSearch({
  isOpen,
  onClose,
  colleges,
  onSelectCollege,
}: CommandSearchProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<College[]>(colleges.slice(0, 10));
  const [isSearching, setIsSearching] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setResults(colleges.slice(0, 10));
    } else {
      setQuery('');
      setSelectedIndex(0);
    }
  }, [isOpen, colleges]);

  // Live Debounced Server Search across 70k+ colleges
  useEffect(() => {
    if (!isOpen) return;

    if (!query.trim()) {
      setResults(colleges.slice(0, 10));
      setIsSearching(false);
      return;
    }

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
          pageSize: 15,
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
  }, [query, isOpen, colleges]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1 < results.length ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 >= 0 ? prev - 1 : results.length - 1));
    } else if (e.key === 'Enter' && results[selectedIndex]) {
      e.preventDefault();
      onSelectCollege(results[selectedIndex]);
      onClose();
    } else if (e.key === 'Escape') {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="command-palette-card"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={handleKeyDown}
      >
        <div className="cmd-input-header">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: 'var(--emerald-primary)' }}>
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
          <input
            ref={inputRef}
            type="text"
            placeholder="Search 70,623+ colleges (e.g. IIT, Medical, Bangalore, C-43727)..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          {isSearching && (
            <div className="pulse-dot" style={{ width: '8px', height: '8px', marginRight: '0.5rem' }}></div>
          )}
          <button className="modal-close-btn" onClick={onClose} style={{ width: '28px', height: '28px' }} type="button">
            ✕
          </button>
        </div>

        <div className="cmd-results-list">
          {results.length === 0 && !isSearching ? (
            <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.88rem' }}>
              No institutions found matching &quot;{query}&quot;.
            </div>
          ) : (
            results.map((col, idx) => (
              <div
                key={col.id}
                className={`cmd-result-item ${idx === selectedIndex ? 'selected' : ''}`}
                onClick={() => {
                  onSelectCollege(col);
                  onClose();
                }}
              >
                <div className="cmd-item-info">
                  <div className="cmd-item-name">{col.name}</div>
                  <div className="cmd-item-meta">
                    <span>📍 {col.city}, {col.state}</span>
                    <span> • </span>
                    <span style={{ color: 'var(--emerald-light)' }}>
                      {col.code ? `AISHE: ${col.code}` : col.universityType}
                    </span>
                    <span> • </span>
                    <span>{col.streams.slice(0, 2).join(', ')}</span>
                  </div>
                </div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                  View Dossier →
                </div>
              </div>
            ))
          )}
        </div>

        <div className="cmd-footer">
          <div>
            <span>Use </span>
            <span className="kbd-shortcut">↑</span>
            <span className="kbd-shortcut">↓</span>
            <span> to navigate, </span>
            <span className="kbd-shortcut">↵</span>
            <span> to select</span>
          </div>
          <div>
            <span className="kbd-shortcut">ESC</span> to close
          </div>
        </div>
      </div>
    </div>
  );
}
