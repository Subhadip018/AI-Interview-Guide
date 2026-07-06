import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { FaBullseye, FaBolt, FaFire, FaStar, FaRunning, FaCoffee, FaPalette, FaCog, FaRocket, FaCrown, FaRobot, FaDumbbell, FaTrophy, FaCheckCircle, FaLock, FaMedal, FaCheck, FaArrowRight } from 'react-icons/fa';

/* ── Badge definitions ─────────────────────────────── */
const ALL_BADGES = [
  { id: 'first_interview',    emoji: <FaBullseye />, name: 'First Interview',       desc: 'Complete your first interview' },
  { id: 'five_interviews',    emoji: <FaBolt />,    name: '5 Interviews Done',      desc: 'Complete 5 interviews' },
  { id: 'ten_interviews',     emoji: <FaFire />,    name: '10 Interviews',          desc: 'Complete 10 interviews' },
  { id: 'perfect_score',      emoji: <FaStar />,    name: 'Perfect Score',          desc: 'Score 100 in any interview' },
  { id: 'speed_runner',       emoji: <FaRunning />, name: 'Speed Runner',           desc: 'Finish interview under 5 minutes' },
  { id: 'java_expert',        emoji: <FaCoffee />,  name: 'Java Expert',            desc: 'Complete 3 Java interviews' },
  { id: 'frontend_master',    emoji: <FaPalette />, name: 'Frontend Master',        desc: 'Complete 5 frontend interviews' },
  { id: 'backend_pro',        emoji: <FaCog />,     name: 'Backend Pro',            desc: 'Complete 5 backend interviews' },
  { id: 'fullstack_legend',   emoji: <FaRocket />,  name: 'Full Stack Legend',      desc: 'Complete all role types' },
  { id: 'communication_star', emoji: <FaStar />,    name: 'Communication Star',     desc: 'Score 90+ on communication' },
  { id: 'confidence_king',    emoji: <FaCrown />,   name: 'Confidence King',        desc: 'Score 95+ on confidence' },
  { id: 'ai_master',          emoji: <FaRobot />,   name: 'AI Master',              desc: 'Use AI feedback 20 times' },
  { id: 'streak_3',           emoji: <FaFire />,    name: '3-Day Streak',           desc: 'Maintain a 3-day streak' },
  { id: 'streak_7',           emoji: <FaDumbbell />,name: '7-Day Streak',           desc: 'Maintain a 7-day streak' },
  { id: 'streak_30',          emoji: <FaTrophy />,  name: '30-Day Streak',          desc: 'Maintain a 30-day streak' },
];

/* ── Streak Banner ──────────────────────────────────── */
const StreakBanner = ({ streak, maxStreak }) => (
  <div
    style={{
      background: 'linear-gradient(135deg, rgba(245,158,11,0.15), rgba(239,68,68,0.1))',
      border: '1px solid rgba(245,158,11,0.35)',
      borderRadius: 'var(--radius)',
      padding: '20px 28px',
      marginBottom: 32,
      position: 'relative',
      overflow: 'hidden',
    }}
  >
    <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at left, rgba(245,158,11,0.08) 0%, transparent 60%)', pointerEvents: 'none' }} />
    <div style={{ display: 'flex', alignItems: 'center', gap: 24, flexWrap: 'wrap', position: 'relative', zIndex: 1 }}>
      <div style={{ fontSize: '3rem', flexShrink: 0, animation: 'streakPulse 2s ease-in-out infinite' }}><FaFire /></div>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--warning)', lineHeight: 1 }}>
          {streak ?? 0} Day{(streak ?? 0) !== 1 ? 's' : ''} Streak
        </div>
        <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: 4 }}>
          {(streak ?? 0) === 0
            ? 'Start your streak today by completing an interview!'
            : (streak ?? 0) < 3
            ? 'You\'re building momentum — keep going!'
            : (streak ?? 0) < 7
            ? 'Great consistency! You\'re on fire!'
            : 'Incredible dedication! You\'re unstoppable!'}
        </div>
      </div>
      <div
        style={{
          background: 'rgba(245,158,11,0.15)',
          border: '1px solid rgba(245,158,11,0.3)',
          borderRadius: 12,
          padding: '8px 16px',
          textAlign: 'center',
          flexShrink: 0,
        }}
      >
        <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--primary)' }}>{maxStreak ?? 0}</div>
        <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600 }}>MAX STREAK</div>
      </div>
    </div>
  </div>
);

/* ── Daily Challenge Card ───────────────────────────── */
const DailyChallenge = ({ onComplete, navigate }) => {
  const [challenge, setChallenge] = useState(null);
  const [loading, setLoading] = useState(true);
  const [completed, setCompleted] = useState(false);
  const [dailyStreak, setDailyStreak] = useState(0);

  useEffect(() => {
    const today = new Date().toDateString();
    const yesterday = new Date(Date.now() - 86400000).toDateString();

    // Get daily streak from localStorage
    const streakData = JSON.parse(localStorage.getItem('ia_daily_streak') || '{}');
    const lastComplete = streakData.lastDate || '';

    if (lastComplete === today) {
      setCompleted(true);
      setDailyStreak(streakData.count || 0);
    } else if (lastComplete === yesterday) {
      setDailyStreak(streakData.count || 0);
    } else if (lastComplete && lastComplete !== yesterday) {
      setDailyStreak(0);
      localStorage.setItem('ia_daily_streak', JSON.stringify({ lastDate: '', count: 0 }));
    }

    const fetchChallenge = async () => {
      try {
        const res = await axios.get('/api/questions');
        const questions = res.data.questions || res.data || [];
        if (questions.length > 0) {
          const dayIndex = Math.floor(Date.now() / 86400000) % questions.length;
          setChallenge(questions[dayIndex] || questions[0]);
        }
      } catch {
        setChallenge({
          question: 'Tell me about a challenging project you worked on and how you overcame the obstacles.',
          category: 'Behavioral',
          difficulty: 'Medium',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchChallenge();
  }, []);

  const handleComplete = () => {
    const today = new Date().toDateString();
    const yesterday = new Date(Date.now() - 86400000).toDateString();
    const streakData = JSON.parse(localStorage.getItem('ia_daily_streak') || '{}');
    const lastComplete = streakData.lastDate || '';
    let newCount = 1;

    if (lastComplete === yesterday) {
      newCount = (streakData.count || 0) + 1;
    }

    localStorage.setItem('ia_daily_streak', JSON.stringify({ lastDate: today, count: newCount }));
    setCompleted(true);
    setDailyStreak(newCount);
    if (onComplete) onComplete();
  };

  return (
    <div
      style={{
        background: 'linear-gradient(145deg, rgba(99,102,241,0.1), rgba(139,92,246,0.08))',
        border: '1px solid rgba(99,102,241,0.3)',
        borderRadius: 'var(--radius)',
        padding: 24,
        marginBottom: 32,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: 'var(--gradient)' }} />
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: 240 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
            <FaBullseye style={{ fontSize: '1.3rem' }} />
            <span style={{ fontWeight: 700, fontSize: '1rem' }}>Daily Challenge</span>
            <span style={{ background: 'rgba(99,102,241,0.15)', border: '1px solid rgba(99,102,241,0.3)', borderRadius: 100, padding: '2px 10px', fontSize: '0.75rem', fontWeight: 700, color: 'var(--primary)' }}>
              +50 XP
            </span>
          </div>
          {loading ? (
            <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: 8, height: 40, animation: 'pulse 1.5s ease infinite' }} />
          ) : (
            <p style={{ color: 'var(--text)', fontSize: '0.95rem', lineHeight: 1.65, marginBottom: 12 }}>
              {challenge?.question || challenge?.text || 'Loading challenge…'}
            </p>
          )}
          {challenge && (
            <div style={{ display: 'flex', gap: 8 }}>
              {challenge.category && (
                <span className="badge badge-primary">{challenge.category}</span>
              )}
              {challenge.difficulty && (
                <span className={`badge badge-${challenge.difficulty === 'Hard' ? 'danger' : challenge.difficulty === 'Medium' ? 'warning' : 'success'}`}>
                  {challenge.difficulty}
                </span>
              )}
            </div>
          )}
        </div>
        <div style={{ textAlign: 'center', flexShrink: 0 }}>
          <div style={{ marginBottom: 8 }}>
            <div style={{ fontSize: '1.6rem', fontWeight: 900, color: 'var(--warning)' }}><FaFire style={{ color: 'var(--warning)', marginRight: 6 }} />{dailyStreak}</div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600 }}>DAILY STREAK</div>
          </div>
          {completed ? (
            <div
              style={{
                background: 'rgba(34,197,94,0.15)',
                border: '1px solid rgba(34,197,94,0.3)',
                borderRadius: 10,
                padding: '10px 20px',
                color: 'var(--success)',
                fontWeight: 700,
                fontSize: '0.9rem',
              }}
            >
              <><FaCheckCircle style={{ color: 'var(--success)', marginRight: 6 }} /> Completed!</>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <button
                onClick={() => navigate('/daily-challenge')}
                className="btn btn-primary btn-sm"
                style={{ borderRadius: 10 }}
              >
                <FaArrowRight style={{ marginRight: 6 }} /> Solve
              </button>
              <button
                onClick={handleComplete}
                className="btn btn-secondary btn-sm"
                style={{ borderRadius: 10, fontSize: '0.78rem' }}
              >
                Mark Done
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

/* ── Badge Card ─────────────────────────────────────── */
const BadgeCard = ({ badge, unlocked }) => (
  <div
    style={{
      background: unlocked
        ? 'linear-gradient(145deg, rgba(99,102,241,0.12), rgba(139,92,246,0.08))'
        : 'rgba(24,24,27,0.6)',
      border: `1px solid ${unlocked ? 'rgba(99,102,241,0.4)' : 'rgba(255,255,255,0.06)'}`,
      borderRadius: 'var(--radius)',
      padding: '24px 20px',
      textAlign: 'center',
      transition: 'var(--transition)',
      cursor: 'default',
      position: 'relative',
      overflow: 'hidden',
      opacity: unlocked ? 1 : 0.5,
      filter: unlocked ? 'none' : 'grayscale(0.6)',
    }}
    onMouseEnter={(e) => unlocked && (e.currentTarget.style.transform = 'translateY(-4px)')}
    onMouseLeave={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
  >
    {unlocked && (
      <div style={{ position: 'absolute', top: 8, right: 8, width: 20, height: 20, background: 'var(--success)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.6rem', fontWeight: 700 }}>
        <FaCheck style={{ fontSize: '0.6rem' }} />
      </div>
    )}
    <div style={{ fontSize: '2.8rem', marginBottom: 10, filter: unlocked ? `drop-shadow(0 0 10px rgba(99,102,241,0.5))` : 'none' }}>
      {badge.emoji}
    </div>
    <div style={{ fontWeight: 700, fontSize: '0.9rem', marginBottom: 6, color: unlocked ? 'var(--text)' : 'var(--text-muted)' }}>
      {badge.name}
    </div>
    <div style={{ fontSize: '0.78rem', color: 'var(--text-dim)', lineHeight: 1.4 }}>
      {badge.desc}
    </div>
    {unlocked && (
      <div style={{ marginTop: 10, display: 'inline-flex', alignItems: 'center', gap: 4, background: 'rgba(34,197,94,0.12)', border: '1px solid rgba(34,197,94,0.25)', borderRadius: 100, padding: '2px 10px', fontSize: '0.75rem', color: 'var(--success)', fontWeight: 600 }}>
        Unlocked
      </div>
    )}
    {!unlocked && (
      <div style={{ marginTop: 10, display: 'inline-flex', alignItems: 'center', gap: 4, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 100, padding: '2px 10px', fontSize: '0.75rem', color: 'var(--text-dim)', fontWeight: 600 }}>
        <><FaLock style={{ marginRight: 6 }} /> Locked</>
      </div>
    )}
  </div>
);

/* ── Leaderboard ─────────────────────────────────────── */
const Leaderboard = ({ entries }) => (
  <div
    style={{
      background: 'var(--card)',
      border: '1px solid var(--border)',
      borderRadius: 'var(--radius)',
      overflow: 'hidden',
    }}
  >
    <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <h3 style={{ fontWeight: 700, fontSize: '1rem' }}><FaTrophy style={{ marginRight: 8 }} /> Leaderboard</h3>
      <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Top Performers</span>
    </div>
    <div style={{ overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ background: 'rgba(255,255,255,0.02)' }}>
            {['Rank', 'Name', 'Score', 'Accuracy', 'Date'].map((h) => (
              <th
                key={h}
                style={{
                  padding: '12px 16px',
                  textAlign: h === 'Rank' ? 'center' : 'left',
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  color: 'var(--text-muted)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                  borderBottom: '1px solid var(--border)',
                }}
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {entries.length === 0 ? (
            <tr>
              <td colSpan={5} style={{ padding: '32px 16px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                No leaderboard entries yet. Complete interviews to appear here!
              </td>
            </tr>
          ) : (
            entries.map((entry, i) => (
                <tr
                  key={i}
                  style={{
                    background: i < 3 ? `rgba(99,102,241,${0.04 - i * 0.01})` : 'transparent',
                    transition: 'background 0.2s',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(99,102,241,0.07)')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = i < 3 ? `rgba(99,102,241,${0.04 - i * 0.01})` : 'transparent')}
                >
                  <td style={{ padding: '14px 16px', textAlign: 'center', fontSize: '1.1rem' }}>
                    {i === 0 ? <FaMedal style={{ color: '#FFD700' }} /> : i === 1 ? <FaMedal style={{ color: '#C0C0C0' }} /> : i === 2 ? <FaMedal style={{ color: '#CD7F32' }} /> : <span style={{ color: 'var(--text-muted)', fontWeight: 700, fontSize: '0.9rem' }}>#{i + 1}</span>}
                  </td>
                <td style={{ padding: '14px 16px', fontWeight: 600, fontSize: '0.93rem' }}>
                  {entry.name || 'Anonymous'}
                </td>
                <td style={{ padding: '14px 16px' }}>
                  <span style={{ fontWeight: 800, fontSize: '1rem', color: entry.score >= 85 ? 'var(--success)' : entry.score >= 65 ? 'var(--warning)' : 'var(--danger)' }}>
                    {entry.score}
                  </span>
                  <span style={{ color: 'var(--text-dim)', fontSize: '0.8rem' }}>/100</span>
                </td>
                <td style={{ padding: '14px 16px', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                  {entry.accuracy != null ? `${entry.accuracy}%` : '—'}
                </td>
                <td style={{ padding: '14px 16px', color: 'var(--text-dim)', fontSize: '0.85rem' }}>
                  {entry.date ? new Date(entry.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : '—'}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  </div>
);

/* ── Main Component ─────────────────────────────────── */
const AchievementsPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [unlockedIds, setUnlockedIds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [leaderboard, setLeaderboard] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [achRes, lbRes] = await Promise.all([
          axios.get('/api/achievements'),
          axios.get('/api/auth/leaderboard')
        ]);
        const data = achRes.data.achievements || achRes.data || [];
        const ids = Array.isArray(data)
          ? data.map((a) => a.badgeId || a.id || a)
          : [];
        setUnlockedIds(ids);
        setLeaderboard(lbRes.data.leaderboard || []);
      } catch {
        const count = parseInt(localStorage.getItem('ia_interview_count') || '0', 10);
        const auto = [];
        if (count >= 1) auto.push('first_interview');
        if (count >= 5) auto.push('five_interviews');
        if (count >= 10) auto.push('ten_interviews');
        setUnlockedIds(auto);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const streak = user?.streak ?? 0;
  const maxStreak = user?.maxStreak ?? 0;
  const unlockedCount = unlockedIds.length;

  return (
    <div className="page-wrapper achievements-page">
      <style>{`
        @keyframes streakPulse { 0%,100%{transform:scale(1)} 50%{transform:scale(1.1)} }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
        .achievements-page { padding-bottom: 80px; }
        .badges-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 20px; margin-bottom: 40px; }
        @media(max-width:600px) { .badges-grid { grid-template-columns: repeat(2, 1fr); } }
      `}</style>

      <div className="container" style={{ paddingTop: 40 }}>
        {/* Header */}
        <div style={{ marginBottom: 36 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16, marginBottom: 8 }}>
            <h1 style={{ fontSize: 'clamp(1.6rem, 3vw, 2.2rem)', fontWeight: 900, background: 'var(--gradient)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              Achievements
            </h1>
            <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
              <div style={{ background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.25)', borderRadius: 12, padding: '10px 20px', textAlign: 'center' }}>
                <div style={{ fontSize: '1.6rem', fontWeight: 900, color: 'var(--primary)' }}>{unlockedCount}</div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600 }}>UNLOCKED</div>
              </div>
              <div style={{ background: 'rgba(139,92,246,0.1)', border: '1px solid rgba(139,92,246,0.25)', borderRadius: 12, padding: '10px 20px', textAlign: 'center' }}>
                <div style={{ fontSize: '1.6rem', fontWeight: 900, color: 'var(--secondary)' }}>{ALL_BADGES.length}</div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600 }}>TOTAL</div>
              </div>
            </div>
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>Track your progress, maintain streaks, and collect badges as you master interview skills.</p>
        </div>

        {/* Streak Banner */}
        <StreakBanner streak={streak} maxStreak={maxStreak} />

        {/* Daily Challenge */}
        <DailyChallenge navigate={navigate} />

        {/* Badges Progress */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
          <h2 style={{ fontSize: '1.2rem', fontWeight: 800 }}><FaMedal style={{ marginRight: 8, color: 'var(--primary)' }} /> Badges ({unlockedCount}/{ALL_BADGES.length})</h2>
          <div style={{ flex: 1, maxWidth: 200 }}>
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${(unlockedCount / ALL_BADGES.length) * 100}%` }} />
            </div>
          </div>
        </div>

        {loading ? (
          <div className="badges-grid">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} style={{ background: 'rgba(24,24,27,0.6)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 'var(--radius)', padding: 24, height: 160, animation: 'pulse 1.5s ease infinite', animationDelay: `${i * 0.08}s` }} />
            ))}
          </div>
        ) : (
          <div className="badges-grid">
            {ALL_BADGES.map((badge) => (
              <BadgeCard
                key={badge.id}
                badge={badge}
                unlocked={unlockedIds.includes(badge.id)}
              />
            ))}
          </div>
        )}

        {/* Leaderboard */}
        <div style={{ marginBottom: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 800 }}><FaTrophy style={{ marginRight: 8, color: 'var(--warning)' }} /> Top Performers</h2>
            <Link to="/leaderboard" className="btn btn-secondary btn-sm" style={{ fontSize: '0.82rem' }}>
              View Full Leaderboard →
            </Link>
          </div>
        </div>
        <Leaderboard entries={leaderboard} />
      </div>
    </div>
  );
};

export default AchievementsPage;
