import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { FaRocket, FaBolt } from 'react-icons/fa';

const COMPANY_ICONS = {
  Google: { icon: 'fab fa-google', color: '#4285F4' },
  Amazon: { icon: 'fab fa-amazon', color: '#FF9900' },
  Microsoft: { icon: 'fab fa-windows', color: '#00A4EF' },
  Meta: { icon: 'fab fa-facebook', color: '#1877F2' },
  Netflix: { icon: 'fas fa-play-circle', color: '#E50914' },
  General: { icon: 'fas fa-building', color: '#10B981' },
};

function getScoreColor(score) {
  if (score >= 70) return 'var(--success)';
  if (score >= 50) return 'var(--warning)';
  return 'var(--danger)';
}

function formatDate(dateStr) {
  if (!dateStr) return '—';
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export default function DashboardPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const res = await axios.get('/api/results');
        setResults(res.data?.results || res.data || []);
      } catch (err) {
        console.error('Failed to fetch results:', err);
        setError('Could not load interview history.');
      } finally {
        setLoading(false);
      }
    };
    fetchResults();
  }, []);

  // Compute stats
  const totalInterviews = results.length;
  const scores = results.map(r => r.score ?? r.totalScore ?? 0).filter(s => typeof s === 'number');
  const bestScore = scores.length ? Math.max(...scores) : 0;
  const avgAccuracy = scores.length ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0;
  const currentStreak = results.filter(r => (r.score ?? r.totalScore ?? 0) >= 50).length;

  const recent = results.slice(0, 5);

  const firstName = user?.name?.split(' ')[0] || 'there';

  const stats = [
    { icon: <i className="fas fa-bullseye" />, label: 'Total Interviews', value: totalInterviews, colorClass: 'stat-icon-primary' },
    { icon: <i className="fas fa-trophy" />, label: 'Best Score', value: `${bestScore}%`, colorClass: 'stat-icon-success' },
    { icon: <i className="fas fa-chart-line" />, label: 'Avg Accuracy', value: `${avgAccuracy}%`, colorClass: 'stat-icon-accent' },
    { icon: <i className="fas fa-fire" />, label: 'Current Streak', value: currentStreak, colorClass: 'stat-icon-secondary' },
  ];

  const quickActions = [
    {
      icon: <i className="fas fa-rocket" />,
      title: 'Start New Interview',
      sub: 'Practice with AI-powered questions',
      to: '/setup',
    },
    {
      icon: <i className="fas fa-chart-bar" />,
      title: 'View Analytics',
      sub: 'See your performance breakdown',
      to: '/analytics',
    },
    {
      icon: <i className="fas fa-file-alt" />,
      title: 'Analyze Resume',
      sub: 'Get AI feedback on your resume',
      to: '/resume',
    },
    {
      icon: <i className="fas fa-award" />,
      title: 'View Achievements',
      sub: 'Track your milestones',
      to: '/achievements',
    },
    {
      icon: <i className="fas fa-trophy" />,
      title: 'Leaderboard',
      sub: 'See top performers',
      to: '/leaderboard',
    },
  ];

  return (
    <div className="page-wrapper">
      {/* Decorative Background */}
      <div className="bg-grid" aria-hidden="true" />
      <div className="bg-blobs" aria-hidden="true">
        <div className="bg-blob bg-blob-1" />
        <div className="bg-blob bg-blob-2" />
        <div className="bg-blob bg-blob-3" />
      </div>

      <div className="dashboard-page">
        <div className="container">

          {/* Header */}
          <div className="dashboard-header" style={{ animation: 'fadeInUp 0.5s ease both' }}>
            <h1 className="dashboard-welcome">
              <i className="fas fa-user-circle" style={{ marginRight: 8, color: 'var(--primary)' }} /> Welcome back, <span>{firstName}</span>
            </h1>
            <p className="dashboard-sub">
              Here's a snapshot of your interview performance. Keep pushing!
            </p>
          </div>

          {/* Stats Grid */}
          <div className="stats-grid" style={{ animation: 'fadeInUp 0.5s ease 0.1s both' }}>
            {stats.map((s, i) => (
              <div className="stat-card" key={i}>
                <div className={`stat-icon ${s.colorClass}`}>{s.icon}</div>
                <div className="stat-info">
                  <div className="stat-value">{s.value}</div>
                  <div className="stat-label">{s.label}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Main Grid */}
          <div className="dashboard-grid" style={{ animation: 'fadeInUp 0.5s ease 0.2s both' }}>

            {/* Recent Interviews */}
            <div
              className="recent-interviews card"
              style={{ padding: 28 }}
            >
              <h3>
                <i className="fas fa-list-alt" style={{ marginRight: '8px', color: 'var(--primary)' }} /> Recent Interviews
              </h3>

              {loading && (
                <div style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '40px 0' }}>
                  <div className="loading-spinner" style={{
                    width: 36, height: 36, border: '3px solid var(--border)',
                    borderTopColor: 'var(--primary)', borderRadius: '50%',
                    animation: 'spin 0.8s linear infinite', margin: '0 auto 12px'
                  }} />
                  Loading history…
                </div>
              )}

              {!loading && error && (
                <div style={{
                  color: 'var(--danger)',
                  background: 'rgba(239,68,68,0.08)',
                  border: '1px solid rgba(239,68,68,0.2)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '16px',
                  fontSize: '0.9rem'
                }}>
                  <i className="fas fa-exclamation-triangle" /> {error}
                </div>
              )}

              {!loading && !error && recent.length === 0 && (
                <div style={{ textAlign: 'center', padding: '48px 20px' }}>
                  <i className="fas fa-microphone-slash" style={{ fontSize: '3rem', color: 'var(--text-dim)', marginBottom: 16 }} />
                  <h4 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: 8 }}>
                    No interviews yet
                  </h4>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: 24 }}>
                    You haven't completed any mock interviews. Start your first one to see your performance here.
                  </p>
                  <Link to="/setup" className="btn btn-primary btn-pulse">
                    <FaRocket style={{ marginRight: 8 }} /> Start My First Interview
                  </Link>
                </div>
              )}

              {!loading && !error && recent.map((item, idx) => {
                const score = item.score ?? item.totalScore ?? 0;
                const company = item.config?.company || item.company || 'General';
                const role = item.config?.role || item.role || 'Developer';
                const iconData = COMPANY_ICONS[company] || COMPANY_ICONS.General;
                const scoreColor = getScoreColor(score);

                return (
                  <div className="interview-history-item" key={item._id || idx}>
                    <div className="ihi-company-logo" style={{ color: iconData.color }}>
                      <i className={iconData.icon} />
                    </div>
                    <div className="ihi-info">
                      <div className="ihi-title">{company} — {role}</div>
                      <div className="ihi-meta">
                        {formatDate(item.createdAt || item.date)} &nbsp;·&nbsp;
                        {item.config?.type || item.type || 'Mixed'} &nbsp;·&nbsp;
                        {item.config?.difficulty || item.difficulty || 'Medium'}
                      </div>
                    </div>
                    <div className="ihi-score">
                      <div className="ihi-score-value" style={{ color: scoreColor }}>
                        {score}%
                      </div>
                      <div className="ihi-score-label">Score</div>
                    </div>
                  </div>
                );
              })}

              {!loading && !error && results.length > 5 && (
                <div style={{ textAlign: 'center', marginTop: 12 }}>
                  <Link to="/analytics" style={{ color: 'var(--primary)', fontSize: '0.9rem', fontWeight: 600 }}>
                    View all {results.length} interviews →
                  </Link>
                </div>
              )}
            </div>

            {/* Quick Actions */}
            <div className="quick-start-card" style={{ animation: 'fadeInUp 0.5s ease 0.3s both' }}>
              <h3><FaBolt style={{ color: 'var(--warning)', marginRight: 8 }} /> Quick Actions</h3>
              {quickActions.map((action, i) => (
                <button
                  key={i}
                  className="quick-action"
                  onClick={() => navigate(action.to)}
                  id={`quick-action-${i}`}
                >
                  <div className="quick-action-icon">{action.icon}</div>
                  <div className="quick-action-text">
                    <div className="quick-action-title">{action.title}</div>
                    <div className="quick-action-sub">{action.sub}</div>
                  </div>
                  <span style={{ color: 'var(--text-dim)', fontSize: '1.1rem' }}>›</span>
                </button>
              ))}

              {/* Performance summary mini-card */}
              {totalInterviews > 0 && (
                <div style={{
                  marginTop: 16,
                  padding: '16px',
                  background: 'rgba(99,102,241,0.06)',
                  border: '1px solid rgba(99,102,241,0.15)',
                  borderRadius: 'var(--radius-sm)',
                }}>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 8 }}>
                    Your Performance
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Avg Score</span>
                    <span style={{ fontWeight: 700, color: getScoreColor(avgAccuracy) }}>{avgAccuracy}%</span>
                  </div>
                  <div className="progress-bar" style={{ marginTop: 8 }}>
                    <div
                      className="progress-fill"
                      style={{ width: `${avgAccuracy}%` }}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* CTA Banner */}
          <div style={{
            animation: 'fadeInUp 0.5s ease 0.4s both',
            background: 'linear-gradient(135deg, rgba(99,102,241,0.12), rgba(139,92,246,0.08))',
            border: '1px solid rgba(99,102,241,0.2)',
            borderRadius: 'var(--radius)',
            padding: '32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 24,
            flexWrap: 'wrap',
          }}>
            <div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: 4 }}>
                <i className="fas fa-bullseye" style={{ color: 'var(--accent)', marginRight: 8 }} /> Ready for your next challenge?
              </h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                Practice makes perfect. Start a new mock interview now and sharpen your skills.
              </p>
            </div>
            <Link to="/setup" className="btn btn-primary btn-lg btn-pulse" id="dashboard-start-btn">
              <FaRocket style={{ marginRight: 8 }} /> Start Interview
            </Link>
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
