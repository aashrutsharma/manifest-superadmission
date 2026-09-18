'use client';

import React, { useState } from 'react';
import { College } from '../lib/types';

interface CollegeDetailModalProps {
  college: College | null;
  onClose: () => void;
}

export default function CollegeDetailModal({ college, onClose }: CollegeDetailModalProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'courses' | 'placements' | 'facilities'>('overview');

  if (!college) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="dossier-modal" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="dossier-modal-header">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
              <span className="badge-nirf">NIRF #{college.nirfOverallRank || 'N/A'}</span>
              <span className="badge-naac">NAAC {college.naacGrade}</span>
              <span className="badge-type">{college.universityType}</span>
              <span className="badge-type">{college.ownership}</span>
              <span className="badge-type">{college.genderType}</span>
            </div>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#FFFFFF', letterSpacing: '-0.02em' }}>
              {college.name}
            </h2>
            <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', display: 'flex', gap: '0.8rem', flexWrap: 'wrap' }}>
              <span>📍 {college.address}</span>
              <span>•</span>
              <span>Est. {college.establishedYear}</span>
              <span>•</span>
              <span>Campus: {college.campusAreaAcres} Acres</span>
            </div>
          </div>
          <button className="modal-close-btn" onClick={onClose} type="button">
            ✕
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="dossier-nav-tabs">
          <button
            className={`dossier-tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
            type="button"
          >
            Overview & Summary
          </button>
          <button
            className={`dossier-tab-btn ${activeTab === 'courses' ? 'active' : ''}`}
            onClick={() => setActiveTab('courses')}
            type="button"
          >
            Courses & Fee Matrix ({college.courses.length})
          </button>
          <button
            className={`dossier-tab-btn ${activeTab === 'placements' ? 'active' : ''}`}
            onClick={() => setActiveTab('placements')}
            type="button"
          >
            Placements & Recruiters
          </button>
          <button
            className={`dossier-tab-btn ${activeTab === 'facilities' ? 'active' : ''}`}
            onClick={() => setActiveTab('facilities')}
            type="button"
          >
            Facilities & Infrastructure
          </button>
        </div>

        {/* Modal Body Content */}
        <div className="dossier-modal-body">
          {activeTab === 'overview' && (
            <>
              {/* Description */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <h4 style={{ fontSize: '0.8rem', textTransform: 'uppercase', color: 'var(--text-muted)' }}>
                  Institutional Profile
                </h4>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                  {college.description}
                </p>
              </div>

              {/* Key Metrics */}
              <div className="card-metrics-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)', padding: '1rem' }}>
                <div className="metric-item">
                  <span className="metric-label">NIRF Rank</span>
                  <span className="metric-val" style={{ color: 'var(--emerald-light)' }}>
                    #{college.nirfOverallRank || 'N/A'}
                  </span>
                </div>
                <div className="metric-item">
                  <span className="metric-label">NAAC CGPA</span>
                  <span className="metric-val">{college.naacCgpa || college.naacGrade}</span>
                </div>
                <div className="metric-item">
                  <span className="metric-label">Median CTC</span>
                  <span className="metric-val">₹{college.medianPackageLpa} LPA</span>
                </div>
                <div className="metric-item">
                  <span className="metric-label">Highest CTC</span>
                  <span className="metric-val" style={{ color: 'var(--emerald-light)' }}>
                    ₹{college.highestPackageLpa} LPA
                  </span>
                </div>
              </div>

              {/* Accreditations & Approvals */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <h4 style={{ fontSize: '0.8rem', textTransform: 'uppercase', color: 'var(--text-muted)' }}>
                  Approvals & Affiliations
                </h4>
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  {college.approvals.map((appr) => (
                    <span key={appr} className="badge-nirf" style={{ background: 'rgba(59, 130, 246, 0.1)', borderColor: 'rgba(59, 130, 246, 0.3)', color: '#93C5FD' }}>
                      {appr} Approved
                    </span>
                  ))}
                  {college.affiliatingUniversity && (
                    <span className="badge-type">Affiliated to {college.affiliatingUniversity}</span>
                  )}
                </div>
              </div>

              {/* Contact Information */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', background: 'var(--bg-primary)', padding: '1rem', borderRadius: 'var(--radius-md)' }}>
                <div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Official Website</div>
                  <a href={college.website} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--emerald-light)', fontSize: '0.82rem', textDecoration: 'underline' }}>
                    {college.website} ↗
                  </a>
                </div>
                <div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Admissions Phone</div>
                  <div style={{ fontSize: '0.82rem', color: 'var(--text-primary)' }}>{college.phone}</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Contact Email</div>
                  <div style={{ fontSize: '0.82rem', color: 'var(--text-primary)' }}>{college.email}</div>
                </div>
              </div>

              {/* Superadmission Counseling CTA */}
              <div className="counseling-cta-box">
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#FFFFFF' }}>
                    Looking for Admissions in {college.shortName}?
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                    Get expert counseling, cutoff analysis, and step-by-step guidance from Superadmission advisors.
                  </div>
                </div>
                <a
                  href={`https://superadmission.com/counseling?college=${encodeURIComponent(college.name)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="cta-apply-btn"
                >
                  Get Counseling Assistance ↗
                </a>
              </div>
            </>
          )}

          {activeTab === 'courses' && (
            <div>
              <h4 style={{ fontSize: '0.8rem', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
                Programs, Seat Matrix & Fee Structure
              </h4>
              <table className="course-matrix-table">
                <thead>
                  <tr>
                    <th>Degree & Course</th>
                    <th>Stream</th>
                    <th>Duration</th>
                    <th>Annual Tuition</th>
                    <th>Seats</th>
                    <th>Entrance Exam</th>
                  </tr>
                </thead>
                <tbody>
                  {college.courses.map((c) => (
                    <tr key={c.id}>
                      <td>
                        <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{c.name}</div>
                        <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{c.eligibility}</div>
                      </td>
                      <td>
                        <span className="stream-tag">{c.stream}</span>
                      </td>
                      <td>{c.duration}</td>
                      <td>
                        <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 600, color: 'var(--emerald-light)' }}>
                          ₹{(c.annualFee / 100000).toFixed(2)} Lakhs/yr
                        </span>
                      </td>
                      <td>{c.seats} Seats</td>
                      <td>
                        <span className="badge-nirf">{c.exam}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'placements' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div className="card-metrics-grid" style={{ gridTemplateColumns: 'repeat(2, 1fr)', padding: '1rem' }}>
                <div className="metric-item">
                  <span className="metric-label">Median Placement CTC</span>
                  <span className="metric-val" style={{ fontSize: '1.25rem', color: 'var(--emerald-light)' }}>
                    ₹{college.medianPackageLpa} LPA
                  </span>
                </div>
                <div className="metric-item">
                  <span className="metric-label">Highest Recorded Domestic/Intl CTC</span>
                  <span className="metric-val" style={{ fontSize: '1.25rem', color: '#60A5FA' }}>
                    ₹{college.highestPackageLpa} LPA
                  </span>
                </div>
              </div>

              <div>
                <h4 style={{ fontSize: '0.8rem', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
                  Marquee & Top Recruiters
                </h4>
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  {college.topRecruiters.map((rec) => (
                    <span
                      key={rec}
                      style={{
                        background: 'var(--bg-primary)',
                        border: '1px solid var(--border-medium)',
                        padding: '0.4rem 0.8rem',
                        borderRadius: 'var(--radius-md)',
                        fontSize: '0.82rem',
                        color: 'var(--text-primary)',
                      }}
                    >
                      🏢 {rec}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h4 style={{ fontSize: '0.8rem', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
                  Entrance Exams Accepted
                </h4>
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  {college.examsAccepted.map((ex) => (
                    <span key={ex} className="badge-nirf" style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem' }}>
                      📝 {ex}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'facilities' && (
            <div>
              <h4 style={{ fontSize: '0.8rem', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
                Campus Facilities & Infrastructure
              </h4>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.75rem' }}>
                {college.facilities.map((fac) => (
                  <div
                    key={fac}
                    style={{
                      background: 'var(--bg-primary)',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: 'var(--radius-md)',
                      padding: '0.85rem 1rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      color: 'var(--text-primary)',
                      fontSize: '0.85rem',
                    }}
                  >
                    <span style={{ color: 'var(--emerald-primary)' }}>✓</span>
                    <span>{fac}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

