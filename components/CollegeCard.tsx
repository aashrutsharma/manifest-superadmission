'use client';

import React from 'react';
import { College } from '../lib/types';

interface CollegeCardProps {
  college: College;
  onSelectCollege: (college: College) => void;
  isCompared: boolean;
  onToggleCompare: (college: College) => void;
}

export default function CollegeCard({
  college,
  onSelectCollege,
  isCompared,
  onToggleCompare,
}: CollegeCardProps) {
  return (
    <div className="college-card">
      {/* Header Row */}
      <div className="card-header-row">
        <div className="card-title-group">
          <h3 className="card-college-name">{college.name}</h3>
          <div className="card-location">
            <span>📍 {college.city}, {college.state}</span>
            <span>•</span>
            <span>Est. {college.establishedYear}</span>
          </div>
        </div>
      </div>

      {/* Badges */}
      <div className="card-badges-row">
        {college.nirfOverallRank && (
          <span className="badge-nirf">NIRF #{college.nirfOverallRank}</span>
        )}
        <span className="badge-naac">NAAC {college.naacGrade}</span>
        <span className="badge-type">{college.universityType}</span>
        <span className="badge-type">{college.ownership}</span>
      </div>

      {/* Key Metrics Grid */}
      <div className="card-metrics-grid">
        <div className="metric-item">
          <span className="metric-label">Avg Fee / Yr</span>
          <span className="metric-val">₹{college.avgAnnualFeeMin} - {college.avgAnnualFeeMax}L</span>
        </div>
        <div className="metric-item">
          <span className="metric-label">Median CTC</span>
          <span className="metric-val">₹{college.medianPackageLpa} LPA</span>
        </div>
        <div className="metric-item">
          <span className="metric-label">Max CTC</span>
          <span className="metric-val" style={{ color: 'var(--emerald-light)' }}>
            ₹{college.highestPackageLpa} LPA
          </span>
        </div>
      </div>

      {/* Stream Badges */}
      <div className="card-courses-preview">
        <span className="card-courses-title">Key Disciplines</span>
        <div className="card-stream-tags">
          {college.streams.slice(0, 4).map((s) => (
            <span key={s} className="stream-tag">{s}</span>
          ))}
          {college.streams.length > 4 && (
            <span className="stream-tag">+{college.streams.length - 4} more</span>
          )}
        </div>
      </div>

      {/* Exams Accepted */}
      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
        <span style={{ fontWeight: 600, color: 'var(--text-secondary)' }}>Exams: </span>
        {college.examsAccepted.slice(0, 3).join(', ')}
        {college.examsAccepted.length > 3 && ` +${college.examsAccepted.length - 3}`}
      </div>

      {/* Footer / Actions */}
      <div className="card-footer-row">
        <label className="compare-btn" style={{ cursor: 'pointer' }}>
          <input
            type="checkbox"
            className="checkbox-input"
            checked={isCompared}
            onChange={() => onToggleCompare(college)}
          />
          <span>Compare</span>
        </label>

        <button
          className="view-dossier-btn"
          onClick={() => onSelectCollege(college)}
          type="button"
        >
          <span>View Dossier</span>
          <span>→</span>
        </button>
      </div>
    </div>
  );
}

