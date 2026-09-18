'use client';

import React from 'react';
import { StreamType, UniversityType, NaacGrade, OwnershipType } from '../lib/types';
import { INDIAN_STATES, STREAMS_LIST, UNIVERSITY_TYPES_LIST, NAAC_GRADES_LIST } from '../lib/data/states';

interface SidebarProps {
  selectedStreams: StreamType[];
  onToggleStream: (stream: StreamType) => void;
  selectedStates: string[];
  onToggleState: (state: string) => void;
  selectedTypes: UniversityType[];
  onToggleType: (type: UniversityType) => void;
  selectedOwnership: OwnershipType[];
  onToggleOwnership: (ownership: OwnershipType) => void;
  selectedNaac: NaacGrade[];
  onToggleNaac: (naac: NaacGrade) => void;
  onResetAllFilters: () => void;
  activeFilterCount: number;
}

export default function Sidebar({
  selectedStreams,
  onToggleStream,
  selectedStates,
  onToggleState,
  selectedTypes,
  onToggleType,
  selectedOwnership,
  onToggleOwnership,
  selectedNaac,
  onToggleNaac,
  onResetAllFilters,
  activeFilterCount,
}: SidebarProps) {
  return (
    <aside className="sidebar-container">
      {/* Overview & Reset */}
      <div className="sidebar-section">
        <div className="sidebar-heading">
          <span>TAXONOMY & FILTERS</span>
          {activeFilterCount > 0 && (
            <button className="clear-all-btn" onClick={onResetAllFilters} type="button">
              Reset ({activeFilterCount})
            </button>
          )}
        </div>
      </div>

      {/* Streams & Disciplines */}
      <div className="sidebar-section">
        <div className="sidebar-heading">
          <span>Academic Disciplines</span>
        </div>
        <ul className="sidebar-nav-list">
          {STREAMS_LIST.map((stream) => {
            const isSelected = selectedStreams.includes(stream);
            return (
              <li
                key={stream}
                className={`sidebar-nav-item ${isSelected ? 'active' : ''}`}
                onClick={() => onToggleStream(stream)}
              >
                <div className="sidebar-item-left">
                  <span style={{ fontSize: '0.9rem' }}>
                    {stream === 'Engineering' && '⚙️'}
                    {stream === 'Medical' && '🩺'}
                    {stream === 'Management' && '📊'}
                    {stream === 'Law' && '⚖️'}
                    {stream === 'Arts & Science' && '🔬'}
                    {stream === 'Design' && '🎨'}
                    {stream === 'Pharmacy' && '💊'}
                    {stream === 'Commerce' && '📈'}
                    {stream === 'Architecture' && '🏛️'}
                  </span>
                  <span>{stream}</span>
                </div>
                {isSelected && <span className="sidebar-badge-count">Active</span>}
              </li>
            );
          })}
        </ul>
      </div>

      {/* Institution Types */}
      <div className="sidebar-section">
        <div className="sidebar-heading">
          <span>Institution Classification</span>
        </div>
        <div className="filter-checkbox-list">
          {UNIVERSITY_TYPES_LIST.map((type) => {
            const isChecked = selectedTypes.includes(type);
            return (
              <label key={type} className="filter-checkbox-label">
                <span className="checkbox-custom">
                  <input
                    type="checkbox"
                    className="checkbox-input"
                    checked={isChecked}
                    onChange={() => onToggleType(type)}
                  />
                  <span>{type}</span>
                </span>
              </label>
            );
          })}
        </div>
      </div>

      {/* NAAC Accreditation */}
      <div className="sidebar-section">
        <div className="sidebar-heading">
          <span>NAAC Accreditation</span>
        </div>
        <div className="filter-checkbox-list">
          {NAAC_GRADES_LIST.map((grade) => {
            const isChecked = selectedNaac.includes(grade);
            return (
              <label key={grade} className="filter-checkbox-label">
                <span className="checkbox-custom">
                  <input
                    type="checkbox"
                    className="checkbox-input"
                    checked={isChecked}
                    onChange={() => onToggleNaac(grade)}
                  />
                  <span>Grade {grade}</span>
                </span>
              </label>
            );
          })}
        </div>
      </div>

      {/* Ownership */}
      <div className="sidebar-section">
        <div className="sidebar-heading">
          <span>Ownership</span>
        </div>
        <div className="filter-checkbox-list">
          {(['Public', 'Private'] as OwnershipType[]).map((own) => {
            const isChecked = selectedOwnership.includes(own);
            return (
              <label key={own} className="filter-checkbox-label">
                <span className="checkbox-custom">
                  <input
                    type="checkbox"
                    className="checkbox-input"
                    checked={isChecked}
                    onChange={() => onToggleOwnership(own)}
                  />
                  <span>{own} Institutions</span>
                </span>
              </label>
            );
          })}
        </div>
      </div>

      {/* States & Union Territories */}
      <div className="sidebar-section">
        <div className="sidebar-heading">
          <span>States & Territories</span>
        </div>
        <div className="filter-checkbox-list" style={{ maxHeight: '220px', overflowY: 'auto' }}>
          {INDIAN_STATES.map((st) => {
            const isChecked = selectedStates.includes(st.name);
            return (
              <label key={st.code} className="filter-checkbox-label">
                <span className="checkbox-custom">
                  <input
                    type="checkbox"
                    className="checkbox-input"
                    checked={isChecked}
                    onChange={() => onToggleState(st.name)}
                  />
                  <span>{st.name}</span>
                </span>
                <span className="sidebar-badge-count">{st.code}</span>
              </label>
            );
          })}
        </div>
      </div>
    </aside>
  );
}

