'use client';

import React from 'react';
import { College } from '../lib/types';

interface CompareModalProps {
  comparedColleges: College[];
  isOpen: boolean;
  onClose: () => void;
  onRemoveCollege: (collegeId: string) => void;
  onClearAll: () => void;
}

export default function CompareModal({
  comparedColleges,
  isOpen,
  onClose,
  onRemoveCollege,
  onClearAll,
}: CompareModalProps) {
  if (!isOpen || comparedColleges.length === 0) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="dossier-modal"
        style={{ maxWidth: '1100px' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="dossier-modal-header">
          <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#FFFFFF' }}>
              College Comparison Matrix ({comparedColleges.length}/4)
            </h2>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Side-by-side benchmark comparison for higher education decisions
            </div>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <button
              className="clear-all-btn"
              onClick={onClearAll}
              style={{ fontSize: '0.8rem' }}
              type="button"
            >
              Clear Comparison
            </button>
            <button className="modal-close-btn" onClick={onClose} type="button">
              ✕
            </button>
          </div>
        </div>

        {/* Matrix Table */}
        <div className="dossier-modal-body" style={{ overflowX: 'auto' }}>
          <table className="compare-matrix-table">
            <thead>
              <tr>
                <th style={{ width: '180px' }}>Attribute</th>
                {comparedColleges.map((col) => (
                  <th key={col.id} style={{ minWidth: '220px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <span style={{ fontWeight: 700, fontSize: '0.92rem' }}>{col.shortName || col.name}</span>
                      <button
                        onClick={() => onRemoveCollege(col.id)}
                        style={{ color: 'var(--rose-accent)', fontSize: '0.85rem' }}
                        title="Remove from comparison"
                        type="button"
                      >
                        ✕
                      </button>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{ fontWeight: 600, color: 'var(--text-muted)' }}>NIRF Ranking</td>
                {comparedColleges.map((col) => (
                  <td key={col.id}>
                    {col.nirfOverallRank ? (
                      <span className="badge-nirf">#{col.nirfOverallRank} Overall</span>
                    ) : (
                      'Unranked'
                    )}
                  </td>
                ))}
              </tr>
              <tr>
                <td style={{ fontWeight: 600, color: 'var(--text-muted)' }}>NAAC Grade</td>
                {comparedColleges.map((col) => (
                  <td key={col.id}>
                    <span className="badge-naac">{col.naacGrade}</span>
                    {col.naacCgpa && ` (CGPA: ${col.naacCgpa})`}
                  </td>
                ))}
              </tr>
              <tr>
                <td style={{ fontWeight: 600, color: 'var(--text-muted)' }}>Location</td>
                {comparedColleges.map((col) => (
                  <td key={col.id}>
                    {col.city}, {col.state}
                  </td>
                ))}
              </tr>
              <tr>
                <td style={{ fontWeight: 600, color: 'var(--text-muted)' }}>Institution Type</td>
                {comparedColleges.map((col) => (
                  <td key={col.id}>
                    {col.universityType} ({col.ownership})
                  </td>
                ))}
              </tr>
              <tr>
                <td style={{ fontWeight: 600, color: 'var(--text-muted)' }}>Annual Fee Range</td>
                {comparedColleges.map((col) => (
                  <td key={col.id} style={{ fontFamily: 'var(--font-mono)', fontWeight: 600 }}>
                    ₹{col.avgAnnualFeeMin} - ₹{col.avgAnnualFeeMax} Lakhs/yr
                  </td>
                ))}
              </tr>
              <tr>
                <td style={{ fontWeight: 600, color: 'var(--text-muted)' }}>Median Package</td>
                {comparedColleges.map((col) => (
                  <td key={col.id} style={{ fontFamily: 'var(--font-mono)', color: 'var(--emerald-light)', fontWeight: 700 }}>
                    ₹{col.medianPackageLpa} LPA
                  </td>
                ))}
              </tr>
              <tr>
                <td style={{ fontWeight: 600, color: 'var(--text-muted)' }}>Highest Package</td>
                {comparedColleges.map((col) => (
                  <td key={col.id} style={{ fontFamily: 'var(--font-mono)', color: '#60A5FA', fontWeight: 700 }}>
                    ₹{col.highestPackageLpa} LPA
                  </td>
                ))}
              </tr>
              <tr>
                <td style={{ fontWeight: 600, color: 'var(--text-muted)' }}>Entrance Exams</td>
                {comparedColleges.map((col) => (
                  <td key={col.id} style={{ fontSize: '0.78rem' }}>
                    {col.examsAccepted.join(', ')}
                  </td>
                ))}
              </tr>
              <tr>
                <td style={{ fontWeight: 600, color: 'var(--text-muted)' }}>Key Disciplines</td>
                {comparedColleges.map((col) => (
                  <td key={col.id} style={{ fontSize: '0.78rem' }}>
                    {col.streams.join(', ')}
                  </td>
                ))}
              </tr>
              <tr>
                <td style={{ fontWeight: 600, color: 'var(--text-muted)' }}>Campus Area</td>
                {comparedColleges.map((col) => (
                  <td key={col.id}>{col.campusAreaAcres} Acres</td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

