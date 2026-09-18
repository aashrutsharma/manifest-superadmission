'use client';

import React from 'react';
import { College } from '../lib/types';

interface CollegeTableViewProps {
  colleges: College[];
  onSelectCollege: (college: College) => void;
  comparedIds: string[];
  onToggleCompare: (college: College) => void;
}

export default function CollegeTableView({
  colleges,
  onSelectCollege,
  comparedIds,
  onToggleCompare,
}: CollegeTableViewProps) {
  return (
    <div className="table-container">
      <table className="repo-table">
        <thead>
          <tr>
            <th style={{ width: '40px' }}>Cmp</th>
            <th>Institution / University</th>
            <th>Location</th>
            <th>Type</th>
            <th>NIRF</th>
            <th>NAAC</th>
            <th>Fee / Year</th>
            <th>Median CTC</th>
            <th>Highest CTC</th>
            <th style={{ textAlign: 'right' }}>Dossier</th>
          </tr>
        </thead>
        <tbody>
          {colleges.map((col) => {
            const isCompared = comparedIds.includes(col.id);
            return (
              <tr key={col.id}>
                <td>
                  <input
                    type="checkbox"
                    className="checkbox-input"
                    checked={isCompared}
                    onChange={() => onToggleCompare(col)}
                  />
                </td>
                <td>
                  <div className="table-college-cell">
                    <span className="table-college-name">{col.name}</span>
                    <span className="table-college-sub">{col.streams.join(', ')}</span>
                  </div>
                </td>
                <td>
                  {col.city}, {col.state}
                </td>
                <td>
                  <span className="badge-type">{col.universityType}</span>
                </td>
                <td>
                  {col.nirfOverallRank ? (
                    <span className="badge-nirf">#{col.nirfOverallRank}</span>
                  ) : (
                    <span style={{ color: 'var(--text-muted)' }}>-</span>
                  )}
                </td>
                <td>
                  <span className="badge-naac">{col.naacGrade}</span>
                </td>
                <td>
                  <span style={{ fontFamily: 'var(--font-mono)' }}>
                    ₹{col.avgAnnualFeeMin} - {col.avgAnnualFeeMax}L
                  </span>
                </td>
                <td>
                  <span style={{ fontFamily: 'var(--font-mono)' }}>₹{col.medianPackageLpa} LPA</span>
                </td>
                <td>
                  <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--emerald-light)', fontWeight: 600 }}>
                    ₹{col.highestPackageLpa} LPA
                  </span>
                </td>
                <td style={{ textAlign: 'right' }}>
                  <button
                    className="view-dossier-btn"
                    style={{ padding: '0.25rem 0.6rem', fontSize: '0.75rem' }}
                    onClick={() => onSelectCollege(col)}
                    type="button"
                  >
                    View
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

