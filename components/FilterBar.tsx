'use client';

import React from 'react';
import { FilterState, StreamType, UniversityType, NaacGrade, OwnershipType } from '../lib/types';

interface FilterBarProps {
  filters: FilterState;
  onFilterChange: (updates: Partial<FilterState>) => void;
  totalFiltered: number;
  totalAvailable: number;
  viewMode: 'grid' | 'table';
  onViewModeChange: (mode: 'grid' | 'table') => void;
  onResetAll: () => void;
}

export default function FilterBar({
  filters,
  onFilterChange,
  totalFiltered,
  totalAvailable,
  viewMode,
  onViewModeChange,
  onResetAll,
}: FilterBarProps) {
  const hasActiveFilters =
    Boolean(filters.searchQuery) ||
    filters.selectedStreams.length > 0 ||
    filters.selectedStates.length > 0 ||
    filters.selectedTypes.length > 0 ||
    filters.selectedOwnership.length > 0 ||
    filters.selectedNaac.length > 0;

  return (
    <div className="toolbar-container">
      <div className="toolbar-top-row">
        {/* Search Input Box */}
        <div className="search-input-box">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: 'var(--text-muted)' }}>
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
          <input
            type="text"
            placeholder="Search by college name, city, course (e.g. IIT, B.Tech, Bangalore)..."
            value={filters.searchQuery}
            onChange={(e) => onFilterChange({ searchQuery: e.target.value })}
          />
          {filters.searchQuery && (
            <button
              onClick={() => onFilterChange({ searchQuery: '' })}
              style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}
              type="button"
            >
              ✕
            </button>
          )}
        </div>

        {/* Controls & Sorting */}
        <div className="toolbar-controls">
          <select
            className="select-dropdown"
            value={filters.sortBy}
            onChange={(e) => onFilterChange({ sortBy: e.target.value as FilterState['sortBy'] })}
          >
            <option value="nirf">Sort: NIRF Ranking (Best First)</option>
            <option value="package_desc">Sort: Highest Package (LPA)</option>
            <option value="fee_asc">Sort: Annual Fee (Low to High)</option>
            <option value="fee_desc">Sort: Annual Fee (High to Low)</option>
            <option value="established">Sort: Established (Oldest)</option>
            <option value="name">Sort: Name (A to Z)</option>
          </select>

          {/* View Toggle (Grid vs Table) */}
          <div className="view-toggle-group">
            <button
              type="button"
              className={`view-toggle-btn ${viewMode === 'grid' ? 'active' : ''}`}
              onClick={() => onViewModeChange('grid')}
              title="Mintlify Card Grid View"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="3" width="7" height="7"></rect>
                <rect x="14" y="3" width="7" height="7"></rect>
                <rect x="14" y="14" width="7" height="7"></rect>
                <rect x="3" y="14" width="7" height="7"></rect>
              </svg>
              <span>Cards</span>
            </button>
            <button
              type="button"
              className={`view-toggle-btn ${viewMode === 'table' ? 'active' : ''}`}
              onClick={() => onViewModeChange('table')}
              title="Wikipedia / Data Matrix Table View"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="8" y1="6" x2="21" y2="6"></line>
                <line x1="8" y1="12" x2="21" y2="12"></line>
                <line x1="8" y1="18" x2="21" y2="18"></line>
                <line x1="3" y1="6" x2="3.01" y2="6"></line>
                <line x1="3" y1="12" x2="3.01" y2="12"></line>
                <line x1="3" y1="18" x2="3.01" y2="18"></line>
              </svg>
              <span>Table</span>
            </button>
          </div>
        </div>
      </div>

      {/* Active Filter Pills Row */}
      {hasActiveFilters && (
        <div className="active-filters-row">
          <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: 600 }}>
            Showing {totalFiltered} of {totalAvailable} colleges:
          </span>

          {filters.searchQuery && (
            <span className="active-filter-pill">
              Query: &quot;{filters.searchQuery}&quot;
              <span className="filter-remove-btn" onClick={() => onFilterChange({ searchQuery: '' })}>✕</span>
            </span>
          )}

          {filters.selectedStreams.map((s) => (
            <span key={s} className="active-filter-pill">
              {s}
              <span
                className="filter-remove-btn"
                onClick={() =>
                  onFilterChange({
                    selectedStreams: filters.selectedStreams.filter((item) => item !== s),
                  })
                }
              >
                ✕
              </span>
            </span>
          ))}

          {filters.selectedStates.map((st) => (
            <span key={st} className="active-filter-pill">
              {st}
              <span
                className="filter-remove-btn"
                onClick={() =>
                  onFilterChange({
                    selectedStates: filters.selectedStates.filter((item) => item !== st),
                  })
                }
              >
                ✕
              </span>
            </span>
          ))}

          {filters.selectedTypes.map((t) => (
            <span key={t} className="active-filter-pill">
              {t}
              <span
                className="filter-remove-btn"
                onClick={() =>
                  onFilterChange({
                    selectedTypes: filters.selectedTypes.filter((item) => item !== t),
                  })
                }
              >
                ✕
              </span>
            </span>
          ))}

          {filters.selectedNaac.map((n) => (
            <span key={n} className="active-filter-pill">
              NAAC {n}
              <span
                className="filter-remove-btn"
                onClick={() =>
                  onFilterChange({
                    selectedNaac: filters.selectedNaac.filter((item) => item !== n),
                  })
                }
              >
                ✕
              </span>
            </span>
          ))}

          {filters.selectedOwnership.map((o) => (
            <span key={o} className="active-filter-pill">
              {o}
              <span
                className="filter-remove-btn"
                onClick={() =>
                  onFilterChange({
                    selectedOwnership: filters.selectedOwnership.filter((item) => item !== o),
                  })
                }
              >
                ✕
              </span>
            </span>
          ))}

          <button className="clear-all-btn" onClick={onResetAll} type="button">
            Clear all filters
          </button>
        </div>
      )}
    </div>
  );
}

