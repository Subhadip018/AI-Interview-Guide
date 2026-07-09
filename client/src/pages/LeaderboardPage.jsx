import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { FaTrophy, FaUsers, FaFire, FaAward, FaCalendarAlt, FaRocket } from 'react-icons/fa';

const getRankBadge = (rank) => {
  if (rank === 1) return <FaTrophy style={{ color: '#FFD700' }} />;
  if (rank === 2) return <FaAward style={{ color: '#C0C0C0' }} />;
  if (rank === 3) return <FaAward style={{ color: '#CD7F32' }} />;
  return <span style={{ color: 'var(--text-muted)', fontWeight: 700 }}>#{rank}</span>;
};

const LeaderboardPage = () => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('leaderboard');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [lbRes, usersRes] = await Promise.all([
          axios.get('/api/auth/leaderboard'),
          axios.get('/api/auth/users')
        ]);
        setLeaderboard(lbRes.data.leaderboard || []);
        setAllUsers(usersRes.data.users || []);
      } catch (err) {
        console.error('Failed to fetch leaderboard data');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="page-wrapper" style={{ paddingBottom: 80 }}>
      <div className="bg-grid" aria-hidden="true" />
      <div className="bg-blobs" aria-hidden="true">
        <div className="bg-blob bg-blob-1" />
        <div className="bg-blob bg-blob-2" />
        <div className="bg-blob bg-blob-3" />
      </div>

      <div style={{ position: 'relative', zIndex: 1, paddingTop: 40 }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 40 }}>
            <h1 style={{ fontSize: 'clamp(1.6rem, 3vw, 2.2rem)', fontWeight: 900, marginBottom: 8 }}>
              <FaTrophy style={{ color: 'var(--warning)', marginRight: 12 }} /> Leaderboard
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>Top performers and community rankings</p>
          </div>

          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginBottom: 32 }}>
            <button
              className={`btn ${tab === 'leaderboard' ? 'btn-primary' : 'btn-secondary'} btn-sm`}
              onClick={() => setTab('leaderboard')}
            >
              <FaTrophy style={{ marginRight: 6 }} /> Top Performers
            </button>
            <button
              className={`btn ${tab === 'all' ? 'btn-primary' : 'btn-secondary'} btn-sm`}
              onClick={() => setTab('all')}
            >
              <FaUsers style={{ marginRight: 6 }} /> All Users
            </button>
          </div>

          {loading ? (
            <div style={{ textAlign: 'center', padding: 60 }}>
              <div style={{ width: 48, height: 48, border: '4px solid rgba(99,102,241,0.15)', borderTopColor: 'var(--primary)', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 16px' }} />
              <p style={{ color: 'var(--text-muted)' }}>Loading rankings…</p>
            </div>
          ) : tab === 'leaderboard' ? (
            <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', overflow: 'hidden' }}>
              <div style={{ padding: '16px 24px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontWeight: 700, fontSize: '1rem' }}>Top 50 Performers</span>
                <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Ranked by best score</span>
              </div>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ background: 'rgba(255,255,255,0.02)' }}>
                      {['Rank', 'Name', 'Best Score', 'Interviews', 'Best Streak', 'Joined'].map((h) => (
                        <th key={h} style={{ padding: '12px 16px', textAlign: h === 'Rank' ? 'center' : 'left', fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', borderBottom: '1px solid var(--border)' }}>
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {leaderboard.length === 0 ? (
                      <tr>
                        <td colSpan={6} style={{ padding: '32px 16px', textAlign: 'center', color: 'var(--text-muted)' }}>
                          No entries yet. Complete interviews to appear here!
                        </td>
                      </tr>
                    ) : (
                      leaderboard.map((entry, i) => (
                        <tr key={i} style={{ background: i < 3 ? `rgba(99,102,241,${0.04 - i * 0.01})` : 'transparent', transition: 'background 0.2s' }}
                            onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(99,102,241,0.07)')}
                            onMouseLeave={(e) => (e.currentTarget.style.background = i < 3 ? `rgba(99,102,241,${0.04 - i * 0.01})` : 'transparent')}>
                          <td style={{ padding: '14px 16px', textAlign: 'center', fontSize: '1.1rem', fontWeight: 700 }}>{getRankBadge(entry.rank)}</td>
                          <td style={{ padding: '14px 16px', fontWeight: 600, fontSize: '0.93rem' }}>{entry.name}</td>
                          <td style={{ padding: '14px 16px' }}>
                            <span style={{ fontWeight: 800, fontSize: '1rem', color: entry.score >= 85 ? 'var(--success)' : entry.score >= 65 ? 'var(--warning)' : 'var(--danger)' }}>{entry.score}</span>
                            <span style={{ color: 'var(--text-dim)', fontSize: '0.8rem' }}>/100</span>
                          </td>
                          <td style={{ padding: '14px 16px', color: 'var(--text-muted)', fontSize: '0.9rem' }}>{entry.interviews}</td>
                          <td style={{ padding: '14px 16px' }}>
                            <span style={{ color: entry.maxStreak > 0 ? 'var(--warning)' : 'var(--text-dim)', fontWeight: 700 }}><FaFire style={{ marginRight: 4 }} /> {entry.maxStreak}</span>
                          </td>
                          <td style={{ padding: '14px 16px', color: 'var(--text-dim)', fontSize: '0.85rem' }}>
                            {entry.createdAt ? new Date(entry.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—'}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', overflow: 'hidden' }}>
              <div style={{ padding: '16px 24px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontWeight: 700, fontSize: '1rem' }}>All Users ({allUsers.length})</span>
                <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Community overview</span>
              </div>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ background: 'rgba(255,255,255,0.02)' }}>
                      {['Name', 'Best Score', 'Interviews', 'Best Streak', 'Joined'].map((h) => (
                        <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', borderBottom: '1px solid var(--border)' }}>
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {allUsers.length === 0 ? (
                      <tr>
                        <td colSpan={5} style={{ padding: '32px 16px', textAlign: 'center', color: 'var(--text-muted)' }}>
                          No users found.
                        </td>
                      </tr>
                    ) : (
                      allUsers.map((u, i) => (
                        <tr key={i} style={{ transition: 'background 0.2s' }}
                            onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(99,102,241,0.07)')}
                            onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}>
                          <td style={{ padding: '14px 16px', fontWeight: 600, fontSize: '0.93rem' }}>{u.name}</td>
                          <td style={{ padding: '14px 16px' }}>
                            <span style={{ fontWeight: 800, color: u.bestScore >= 85 ? 'var(--success)' : u.bestScore >= 65 ? 'var(--warning)' : 'var(--danger)' }}>{u.bestScore}</span>
                            <span style={{ color: 'var(--text-dim)', fontSize: '0.8rem' }}>/100</span>
                          </td>
                          <td style={{ padding: '14px 16px', color: 'var(--text-muted)' }}>{u.totalInterviews}</td>
                          <td style={{ padding: '14px 16px' }}>
                            <span style={{ color: u.maxStreak > 0 ? 'var(--warning)' : 'var(--text-dim)', fontWeight: 700 }}><FaFire style={{ marginRight: 4 }} /> {u.maxStreak}</span>
                          </td>
                          <td style={{ padding: '14px 16px', color: 'var(--text-dim)', fontSize: '0.85rem' }}>
                            {u.createdAt ? new Date(u.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—'}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
};

export default LeaderboardPage;