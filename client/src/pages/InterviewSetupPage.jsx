import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useInterview } from '../context/InterviewContext';

const COMPANIES = [
  { label: 'Google', icon: 'fab fa-google', color: '#4285F4' },
  { label: 'Amazon', icon: 'fab fa-amazon', color: '#FF9900' },
  { label: 'Microsoft', icon: 'fab fa-windows', color: '#00A4EF' },
  { label: 'Meta', icon: 'fab fa-facebook', color: '#1877F2' },
  { label: 'Netflix', icon: 'fas fa-play-circle', color: '#E50914' },
  { label: 'General', icon: 'fas fa-building', color: '#10B981' },
];

const ROLES = [
  { label: 'Frontend' },
  { label: 'Backend' },
  { label: 'Full Stack' },
  { label: 'Java Developer' },
  { label: 'Python Developer' },
  { label: 'Data Analyst' },
];

const DIFFICULTIES = ['Easy', 'Medium', 'Hard'];
const INTERVIEW_TYPES = ['Behavioral', 'Technical', 'HR', 'Mixed'];
const COUNT_OPTIONS = [5, 10, 15, 20];

export default function InterviewSetupPage() {
  const navigate = useNavigate();
  const { updateConfig, startInterview } = useInterview();

  const [company, setCompany] = useState('Google');
  const [role, setRole] = useState('Frontend');
  const [difficulty, setDifficulty] = useState('Medium');
  const [type, setType] = useState('Mixed');
  const [count, setCount] = useState(10);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleCountStep = (dir) => {
    const idx = COUNT_OPTIONS.indexOf(count);
    if (dir === '+' && idx < COUNT_OPTIONS.length - 1) setCount(COUNT_OPTIONS[idx + 1]);
    if (dir === '-' && idx > 0) setCount(COUNT_OPTIONS[idx - 1]);
  };

  const handleStart = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = { company, role, type, difficulty, count };
      updateConfig({ company, role, difficulty, type, count, voiceEnabled });

      const res = await axios.get('/api/questions', { params });
      const questions = res.data?.questions || res.data || [];

      if (!questions.length) {
        throw new Error('No questions returned. Please try different settings.');
      }

      startInterview(questions);
      navigate('/interview');
    } catch (err) {
      console.error('Setup error:', err);
      setError(err.response?.data?.message || err.message || 'Failed to fetch questions. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="page-wrapper">
      {/* Background */}
      <div className="bg-grid" aria-hidden="true" />
      <div className="bg-blobs" aria-hidden="true">
        <div className="bg-blob bg-blob-1" />
        <div className="bg-blob bg-blob-2" />
        <div className="bg-blob bg-blob-3" />
      </div>

      <div className="setup-page">
        <div className="container">

          {/* Page Header */}
          <div className="setup-header" style={{ animation: 'fadeInUp 0.5s ease both' }}>
            <div className="hero-badge" style={{ display: 'inline-flex', marginBottom: 16 }}>
              <span className="hero-badge-dot" />
              Interview Configuration
            </div>
            <h1 className="section-title">Setup Your Interview</h1>
            <p className="section-sub">
              Customize your mock interview experience — pick a company, role, difficulty, and more.
            </p>
          </div>

          {/* Setup Grid */}
          <div className="setup-grid" style={{ animation: 'fadeInUp 0.5s ease 0.15s both' }}>

            {/* Left Card */}
            <div className="setup-card">
              <div className="setup-card-title">
                <i className="fas fa-building" style={{ color: 'var(--primary)', marginRight: '8px' }} /> Target Company &amp; Role
              </div>

              {/* Company selector */}
              <div className="form-group" style={{ marginBottom: 24 }}>
                <div className="form-label">Company</div>
                <div className="option-chips">
                  {COMPANIES.map(c => (
                    <button
                      key={c.label}
                      className={`option-chip ${company === c.label ? 'selected' : ''}`}
                      onClick={() => setCompany(c.label)}
                      id={`company-${c.label.toLowerCase().replace(/\s+/g, '-')}`}
                      type="button"
                    >
                      <i className={c.icon} style={{ color: company === c.label ? '#fff' : c.color, marginRight: '6px' }} />
                      {c.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Role selector */}
              <div className="form-group">
                <div className="form-label">Role</div>
                <div className="option-chips">
                  {ROLES.map(r => (
                    <button
                      key={r.label}
                      className={`option-chip ${role === r.label ? 'selected' : ''}`}
                      onClick={() => setRole(r.label)}
                      id={`role-${r.label.toLowerCase().replace(/\s+/g, '-')}`}
                      type="button"
                    >
                      {r.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Config preview */}
              <div style={{
                marginTop: 28,
                padding: '16px',
                background: 'rgba(99,102,241,0.06)',
                border: '1px solid rgba(99,102,241,0.15)',
                borderRadius: 'var(--radius-sm)',
              }}>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600, marginBottom: 8 }}>
                  Selected Target
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ fontSize: '1.6rem' }}>
                    {(() => {
                      const comp = COMPANIES.find(c => c.label === company);
                      return comp ? <i className={comp.icon} style={{ color: comp.color }} /> : <i className="fas fa-building" />;
                    })()}
                  </span>
                  <div>
                    <div style={{ fontWeight: 700 }}>{company}</div>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{role}</div>
                  </div>
                </div>
              </div>
            </div>

             {/* Right Card */}
            <div className="setup-card">
              <div className="setup-card-title">
                <i className="fas fa-cog" style={{ color: 'var(--secondary)', marginRight: '8px' }} /> Interview Settings
              </div>

              {/* Difficulty */}
              <div className="form-group" style={{ marginBottom: 24 }}>
                <div className="form-label">Difficulty</div>
                <div className="difficulty-buttons">
                  {DIFFICULTIES.map(d => (
                    <button
                      key={d}
                      className={`diff-btn ${difficulty === d ? `selected ${d.toLowerCase()}` : ''}`}
                      onClick={() => setDifficulty(d)}
                      id={`difficulty-${d.toLowerCase()}`}
                      type="button"
                    >
                      {d === 'Easy' && <i className="fas fa-circle" style={{ color: '#22c55e', fontSize: '0.65rem', marginRight: '6px' }} />}
                      {d === 'Medium' && <i className="fas fa-circle" style={{ color: '#eab308', fontSize: '0.65rem', marginRight: '6px' }} />}
                      {d === 'Hard' && <i className="fas fa-circle" style={{ color: '#ef4444', fontSize: '0.65rem', marginRight: '6px' }} />}
                      {d}
                    </button>
                  ))}
                </div>
              </div>

              {/* Interview Type */}
              <div className="form-group" style={{ marginBottom: 24 }}>
                <div className="form-label">Interview Type</div>
                <div className="option-chips">
                  {INTERVIEW_TYPES.map(t => (
                    <button
                      key={t}
                      className={`option-chip ${type === t ? 'selected' : ''}`}
                      onClick={() => setType(t)}
                      id={`type-${t.toLowerCase()}`}
                      type="button"
                    >
                      {t === 'Behavioral' && <i className="fas fa-comment-dots" style={{ marginRight: '6px' }} />}
                      {t === 'Technical' && <i className="fas fa-code" style={{ marginRight: '6px' }} />}
                      {t === 'HR' && <i className="fas fa-user-friends" style={{ marginRight: '6px' }} />}
                      {t === 'Mixed' && <i className="fas fa-random" style={{ marginRight: '6px' }} />}
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              {/* Question Count */}
              <div className="form-group" style={{ marginBottom: 24 }}>
                <div className="form-label">Number of Questions</div>
                <div className="count-selector">
                  <button
                    className="count-btn"
                    onClick={() => handleCountStep('-')}
                    disabled={COUNT_OPTIONS.indexOf(count) === 0}
                    id="count-decrease"
                    type="button"
                  >
                    −
                  </button>
                  <div className="count-value">{count}</div>
                  <button
                    className="count-btn"
                    onClick={() => handleCountStep('+')}
                    disabled={COUNT_OPTIONS.indexOf(count) === COUNT_OPTIONS.length - 1}
                    id="count-increase"
                    type="button"
                  >
                    +
                  </button>
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>questions</span>
                </div>
                <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
                  {COUNT_OPTIONS.map(n => (
                    <button
                      key={n}
                      onClick={() => setCount(n)}
                      type="button"
                      style={{
                        padding: '4px 12px',
                        borderRadius: 100,
                        fontSize: '0.8rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        background: count === n ? 'rgba(99,102,241,0.2)' : 'rgba(255,255,255,0.04)',
                        border: count === n ? '1px solid var(--primary)' : '1px solid var(--border)',
                        color: count === n ? 'var(--primary)' : 'var(--text-muted)',
                      }}
                    >
                      {n}
                    </button>
                  ))}
                </div>
              </div>

              {/* Voice Toggle */}
              <div className="form-group">
                <div className="form-label">Voice Mode</div>
                <div className="toggle-switch">
                  <label className="toggle">
                    <input
                      type="checkbox"
                      checked={voiceEnabled}
                      onChange={e => setVoiceEnabled(e.target.checked)}
                      id="voice-toggle"
                    />
                    <span className="toggle-slider" />
                  </label>
                  <span className="toggle-label">
                    {voiceEnabled ? (
                      <><i className="fas fa-microphone" style={{ color: 'var(--primary)', marginRight: '6px' }} /> AI reads questions aloud</>
                    ) : (
                      <><i className="fas fa-microphone-slash" style={{ color: 'var(--text-muted)', marginRight: '6px' }} /> Text only mode</>
                    )}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Error message */}
          {error && (
            <div style={{
              maxWidth: 900, margin: '20px auto 0',
              padding: '14px 20px',
              background: 'rgba(239,68,68,0.08)',
              border: '1px solid rgba(239,68,68,0.3)',
              borderRadius: 'var(--radius-sm)',
              color: 'var(--danger)',
              fontSize: '0.9rem',
              display: 'flex', alignItems: 'center', gap: 10,
            }}>
              <i className="fas fa-exclamation-triangle" style={{ color: 'var(--danger)' }} /> {error}
            </div>
          )}

          {/* Summary + Start */}
          <div className="setup-submit" style={{ animation: 'fadeInUp 0.5s ease 0.3s both' }}>
            {/* Summary chips */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: 10, flexWrap: 'wrap', marginBottom: 24 }}>
              {[
                { label: company, icon: <i className={COMPANIES.find(c => c.label === company)?.icon || 'fas fa-building'} style={{ color: COMPANIES.find(c => c.label === company)?.color }} /> },
                { label: role, icon: <i className="fas fa-briefcase" style={{ color: 'var(--primary)' }} /> },
                { label: difficulty, icon: <i className="fas fa-circle" style={{ color: difficulty === 'Easy' ? '#22c55e' : difficulty === 'Medium' ? '#eab308' : '#ef4444', fontSize: '0.7rem' }} /> },
                { label: type, icon: <i className="fas fa-bullseye" style={{ color: 'var(--accent)' }} /> },
                { label: `${count} Qs`, icon: <i className="fas fa-question-circle" style={{ color: 'var(--text-muted)' }} /> },
                { label: voiceEnabled ? 'Voice On' : 'Text Only', icon: <i className={voiceEnabled ? 'fas fa-microphone' : 'fas fa-microphone-slash'} style={{ color: voiceEnabled ? 'var(--primary)' : 'var(--text-dim)' }} /> },
              ].map((item, i) => (
                <span
                  key={i}
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: 8,
                    padding: '6px 14px',
                    borderRadius: 100,
                    background: 'rgba(99,102,241,0.1)',
                    border: '1px solid rgba(99,102,241,0.25)',
                    fontSize: '0.85rem', fontWeight: 600, color: 'var(--primary)',
                  }}
                >
                  {item.icon} {item.label}
                </span>
              ))}
            </div>

            <button
              className="btn btn-primary btn-lg btn-pulse"
              onClick={handleStart}
              disabled={loading}
              id="start-interview-btn"
              type="button"
              style={{ minWidth: 240 }}
            >
              {loading ? (
                <>
                  <span style={{
                    display: 'inline-block', width: 18, height: 18,
                    border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff',
                    borderRadius: '50%', animation: 'spin 0.7s linear infinite'
                  }} />
                  Preparing Interview…
                </>
              ) : (
                <> Start Interview</>
              )}
            </button>

            <p style={{ marginTop: 14, color: 'var(--text-dim)', fontSize: '0.85rem' }}>
              Your interview will begin immediately after loading questions.
            </p>
          </div>

        </div>
      </div>

      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
