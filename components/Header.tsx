'use client';

import React from 'react';

interface HeaderProps {
  totalCount: number;
  onOpenCommandSearch: () => void;
  onExportData?: () => void;
}

export default function Header({ totalCount, onOpenCommandSearch, onExportData }: HeaderProps) {
  return (
    <header className="header-wrapper">
      <div className="header-inner">
        {/* Brand Section */}
        <div className="brand-section">
          <div className="brand-logo-icon">M</div>
          <div className="brand-text-block">
            <div className="brand-title">
              <span>MANIFEST</span>
              <span className="brand-version-badge">Repository v1.0</span>
            </div>
            <div className="brand-subtitle">Data Repository of Superadmission</div>
          </div>
        </div>

        {/* Global Instant Search Trigger (Cmd + K) */}
        <button className="header-search-trigger" onClick={onOpenCommandSearch} type="button">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
          <span>Search 70,000+ colleges, courses, cutoffs...</span>
          <span className="kbd-shortcut">⌘K</span>
        </button>

        {/* Header Right Actions */}
        <div className="header-actions">
          <div className="header-stat-pill">
            <div className="pulse-dot"></div>
            <span>{totalCount.toLocaleString()}+ Indexed Colleges</span>
          </div>

          {onExportData && (
            <button className="header-link-btn" onClick={onExportData} title="Export Repository Data to CSV">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                <polyline points="7 10 12 15 17 10"></polyline>
                <line x1="12" y1="15" x2="12" y2="3"></line>
              </svg>
              <span>Export CSV</span>
            </button>
          )}

          <a 
            href="https://superadmission.com" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="header-link-btn"
            style={{ borderColor: 'var(--emerald-border)', color: 'var(--emerald-light)' }}
          >
            <span>Superadmission ↗</span>
          </a>
        </div>
      </div>
    </header>
  );
}

