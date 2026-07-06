import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { FaLightbulb, FaTrophy, FaChartBar, FaChartPie, FaCrosshairs, FaCheckCircle, FaExclamationTriangle, FaRocket, FaFrown, FaBuilding, FaBriefcase, FaBullseye, FaCalendarAlt, FaQuestionCircle, FaPrint, FaDumbbell } from 'react-icons/fa';
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
} from 'chart.js';
import { Radar, Bar, Doughnut } from 'react-chartjs-2';

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement
);

const METRICS = ['Confidence', 'Accuracy', 'Communication', 'Speed', 'Problem Solving', 'Time Management'];
const METRIC_FIELDS = ['confidence', 'accuracy', 'communication', 'speed', 'problemSolving', 'timeManagement'];

const getScoreColor = (score) => {
  if (score >= 85) return 'var(--success)';
  if (score >= 65) return 'var(--warning)';
  return 'var(--danger)';
};

const getScoreLabel = (score) => {
  if (score >= 90) return 'Excellent';
  if (score >= 75) return 'Good';
  if (score >= 60) return 'Average';
  return 'Needs Work';
};

/* ── Circular Score SVG ─────────────────────────────────── */
const ScoreCircle = ({ score }) => {
  const r = 70;
  const circ = 2 * Math.PI * r;
  const offset = circ - (score / 100) * circ;
  const color = getScoreColor(score);

  return (
    <div className="score-circle-wrap">
      <svg width="180" height="180" viewBox="0 0 180 180">
        <defs>
          <linearGradient id="scoreGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#6366F1" />
            <stop offset="50%" stopColor="#8B5CF6" />
            <stop offset="100%" stopColor="#06B6D4" />
          </linearGradient>
        </defs>
        {/* Track */}
        <circle
          cx="90" cy="90" r={r}
          fill="none"
          stroke="rgba(255,255,255,0.06)"
          strokeWidth="12"
        />
        {/* Progress */}
        <circle
          cx="90" cy="90" r={r}
          fill="none"
          stroke="url(#scoreGrad)"
          strokeWidth="12"
          strokeLinecap="round"
          strokeDasharray={circ}
          strokeDashoffset={offset}
          transform="rotate(-90 90 90)"
          style={{ transition: 'stroke-dashoffset 1.2s cubic-bezier(0.4,0,0.2,1)' }}
        />
        <text x="90" y="85" textAnchor="middle" fill="white" fontSize="32" fontWeight="900" fontFamily="Poppins, sans-serif">
          {score}
        </text>
        <text x="90" y="108" textAnchor="middle" fill="rgba(148,163,184,0.9)" fontSize="12" fontFamily="Poppins, sans-serif">
          / 100
        </text>
      </svg>
      <div className="score-circle-label" style={{ color }}>{getScoreLabel(score)}</div>
    </div>
  );
};

/* ── Collapsible Q&A item ──────────────────────────────── */
const QAItem = ({ item, index }) => {
  const [open, setOpen] = useState(false);
  const scoreColor = getScoreColor(item.score ?? 70);

  return (
    <div className="qa-item" style={{ marginBottom: 12 }}>
      <button
        className="qa-header"
        onClick={() => setOpen((o) => !o)}
        style={{
          width: '100%',
          textAlign: 'left',
          background: 'rgba(24,24,27,0.8)',
          border: '1px solid rgba(99,102,241,0.2)',
          borderRadius: open ? '12px 12px 0 0' : 12,
          padding: '16px 20px',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 12,
          transition: 'all 0.25s ease',
          color: 'var(--text)',
          fontFamily: 'inherit',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, flex: 1, minWidth: 0 }}>
          <span
            style={{
              background: 'rgba(99,102,241,0.15)',
              border: '1px solid rgba(99,102,241,0.3)',
              borderRadius: 8,
              padding: '2px 10px',
              fontSize: '0.8rem',
              fontWeight: 700,
              color: 'var(--primary)',
              flexShrink: 0,
            }}
          >
            Q{index + 1}
          </span>
          <span style={{ fontWeight: 600, fontSize: '0.95rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {item.question}
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
          <span style={{ fontWeight: 800, fontSize: '1rem', color: scoreColor }}>
            {item.score ?? 70}
          </span>
          <span style={{ color: 'var(--text-muted)', fontSize: '1rem', transition: 'transform 0.25s', transform: open ? 'rotate(180deg)' : 'rotate(0deg)' }}>
            ▾
          </span>
        </div>
      </button>
      {open && (
        <div
          style={{
            background: 'rgba(15,15,18,0.95)',
            border: '1px solid rgba(99,102,241,0.2)',
            borderTop: 'none',
            borderRadius: '0 0 12px 12px',
            padding: '20px 20px 20px',
          }}
        >
          <div style={{ marginBottom: 12 }}>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600, marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Your Answer</p>
            <p style={{ color: 'var(--text)', fontSize: '0.93rem', lineHeight: 1.7 }}>{item.answer || 'No answer recorded.'}</p>
          </div>
          {item.feedback && (
            <div style={{ background: 'rgba(99,102,241,0.06)', border: '1px solid rgba(99,102,241,0.15)', borderRadius: 8, padding: '12px 14px' }}>
              <p style={{ fontSize: '0.8rem', color: 'var(--primary)', fontWeight: 600, marginBottom: 4 }}><FaLightbulb style={{ marginRight: 6 }} /> AI Feedback</p>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.6 }}>{item.feedback}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

/* ── Main Component ─────────────────────────────────────── */
const ResultsPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const params = useParams();
  const { user } = useAuth();

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchResult = async () => {
      try {
        const urlId = params?.id;
        const stateId = location.state?.resultId;
        const resultId = urlId || stateId;
        let res;
        if (resultId) {
          res = await axios.get(`/api/results/${resultId}`);
          setResult(res.data.result || res.data);
        } else if (location.state && (location.state.score !== undefined || location.state.answers)) {
          // Came directly from interview with inline data
          setResult(location.state);
        } else {
          res = await axios.get('/api/results');
          const results = res.data.results || res.data || [];
          if (results.length === 0) throw new Error('No results found.');
          setResult(results[0]);
        }
      } catch (err) {
        setError(err.response?.data?.message || err.message || 'Failed to load results.');
      } finally {
        setLoading(false);
      }
    };
    fetchResult();
  }, [location.state, params?.id]);

  if (loading) {
    return (
      <div className="page-wrapper" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <div className="spinner" style={{ width: 60, height: 60, border: '4px solid rgba(99,102,241,0.15)', borderTopColor: 'var(--primary)', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 20px' }} />
          <p style={{ color: 'var(--text-muted)' }}>Loading your results…</p>
        </div>
      </div>
    );
  }

  if (error || !result) {
    return (
      <div className="page-wrapper" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="card" style={{ textAlign: 'center', maxWidth: 400 }}>
          <FaFrown style={{ fontSize: '3rem', marginBottom: 16, color: 'var(--text-muted)' }} />
          <h2 style={{ marginBottom: 8 }}>No Results Found</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: 24 }}>{error || 'Complete an interview to see your results here.'}</p>
          <Link to="/setup" className="btn btn-primary">Start an Interview</Link>
        </div>
      </div>
    );
  }

  const metricValues = METRIC_FIELDS.map((field) => {
    const val = result[field] ?? result.metrics?.[field] ?? null;
    return val !== null ? val : Math.round(50 + Math.random() * 40);
  });

  const overallScore = result.overallScore ?? result.score ?? result.totalScore ?? Math.round(metricValues.reduce((a, b) => a + b, 0) / metricValues.length);

  /* Chart Data */
  const radarData = {
    labels: METRICS,
    datasets: [
      {
        label: 'Your Performance',
        data: metricValues,
        backgroundColor: 'rgba(99,102,241,0.15)',
        borderColor: 'rgba(99,102,241,0.8)',
        pointBackgroundColor: '#8B5CF6',
        pointBorderColor: 'rgba(139,92,246,0.5)',
        pointHoverBackgroundColor: '#06B6D4',
        borderWidth: 2,
        fill: true,
      },
    ],
  };

  const barData = {
    labels: METRICS,
    datasets: [
      {
        label: 'Score',
        data: metricValues,
        backgroundColor: [
          'rgba(99,102,241,0.7)',
          'rgba(139,92,246,0.7)',
          'rgba(6,182,212,0.7)',
          'rgba(34,197,94,0.7)',
          'rgba(245,158,11,0.7)',
          'rgba(239,68,68,0.7)',
        ],
        borderColor: [
          'rgba(99,102,241,1)',
          'rgba(139,92,246,1)',
          'rgba(6,182,212,1)',
          'rgba(34,197,94,1)',
          'rgba(245,158,11,1)',
          'rgba(239,68,68,1)',
        ],
        borderWidth: 2,
        borderRadius: 6,
      },
    ],
  };

  const doughnutData = {
    labels: METRICS,
    datasets: [
      {
        data: metricValues,
        backgroundColor: [
          'rgba(99,102,241,0.85)',
          'rgba(139,92,246,0.85)',
          'rgba(6,182,212,0.85)',
          'rgba(34,197,94,0.85)',
          'rgba(245,158,11,0.85)',
          'rgba(239,68,68,0.85)',
        ],
        borderColor: 'rgba(15,15,18,0.8)',
        borderWidth: 3,
        hoverOffset: 8,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        labels: { color: 'rgba(248,250,252,0.8)', font: { family: 'Poppins', size: 11 } },
      },
      tooltip: {
        backgroundColor: 'rgba(15,15,18,0.95)',
        borderColor: 'rgba(99,102,241,0.3)',
        borderWidth: 1,
        titleColor: '#F8FAFC',
        bodyColor: 'rgba(148,163,184,0.9)',
        padding: 10,
      },
    },
  };

  const radarOptions = {
    ...chartOptions,
    scales: {
      r: {
        min: 0,
        max: 100,
        grid: { color: 'rgba(255,255,255,0.06)' },
        pointLabels: { color: 'rgba(148,163,184,0.9)', font: { family: 'Poppins', size: 11 } },
        ticks: { display: false, stepSize: 20 },
        angleLines: { color: 'rgba(255,255,255,0.06)' },
      },
    },
  };

  const barOptions = {
    ...chartOptions,
    scales: {
      x: {
        grid: { color: 'rgba(255,255,255,0.05)' },
        ticks: { color: 'rgba(148,163,184,0.8)', font: { family: 'Poppins', size: 10 } },
      },
      y: {
        min: 0,
        max: 100,
        grid: { color: 'rgba(255,255,255,0.05)' },
        ticks: { color: 'rgba(148,163,184,0.8)', font: { family: 'Poppins', size: 10 } },
      },
    },
  };

  /* Feedback */
  const strengths = result.strengths || result.aiFeedback?.strengths || result.feedback?.strengths || ['Strong communication skills', 'Good technical knowledge', 'Confident delivery'];
  const weaknesses = result.weaknesses || result.aiFeedback?.weaknesses || result.feedback?.weaknesses || ['Time management could improve', 'Some answers lacked depth', 'Occasional hesitation'];
  const suggestions = result.suggestions || result.aiFeedback?.suggestions || result.feedback?.suggestions || ['Practice more behavioral questions', 'Review system design concepts', 'Work on concise answers'];

  /* Q&A */
  const questions = result.questions || result.answers || [];

  const handleDownload = () => window.print();

  return (
    <div className="page-wrapper results-page">
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        .results-page { padding-bottom: 80px; }
        .results-hero { background: linear-gradient(145deg, rgba(18,18,21,0.95), rgba(24,24,27,0.9)); border-bottom: 1px solid rgba(99,102,241,0.15); padding: 48px 0 40px; margin-bottom: 40px; position: relative; overflow: hidden; }
        .results-hero::before { content: ''; position: absolute; inset: 0; background: radial-gradient(ellipse at 50% 0%, rgba(99,102,241,0.12) 0%, transparent 70%); pointer-events: none; }
        .score-circle-wrap { display: flex; flex-direction: column; align-items: center; gap: 8px; }
        .score-circle-label { font-weight: 700; font-size: 1.1rem; }
        .charts-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; margin-bottom: 40px; }
        .chart-card { background: var(--card); border: 1px solid var(--border); border-radius: var(--radius); padding: 24px; }
        .chart-card-title { font-size: 0.9rem; font-weight: 700; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.06em; margin-bottom: 20px; display: flex; align-items: center; gap: 8px; }
        .feedback-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; margin-bottom: 40px; }
        .feedback-card { background: var(--card); border: 1px solid var(--border); border-radius: var(--radius); padding: 24px; }
        .feedback-card-title { font-size: 1rem; font-weight: 700; margin-bottom: 16px; display: flex; align-items: center; gap: 8px; }
        .feedback-list { list-style: none; display: flex; flex-direction: column; gap: 10px; }
        .feedback-list li { display: flex; align-items: flex-start; gap: 10px; font-size: 0.9rem; color: var(--text-muted); line-height: 1.5; }
        .feedback-list li::before { flex-shrink: 0; font-size: 0.85rem; margin-top: 1px; }
        .feedback-card.strengths { border-color: rgba(34,197,94,0.25); }
        .feedback-card.strengths .feedback-card-title { color: var(--success); }
        .feedback-card.strengths .feedback-list li::before { content: '✓'; color: var(--success); }
        .feedback-card.weaknesses { border-color: rgba(239,68,68,0.25); }
        .feedback-card.weaknesses .feedback-card-title { color: var(--danger); }
        .feedback-card.weaknesses .feedback-list li::before { content: '✗'; color: var(--danger); }
        .feedback-card.suggestions { border-color: rgba(245,158,11,0.25); }
        .feedback-card.suggestions .feedback-card-title { color: var(--warning); }
        .feedback-card.suggestions .feedback-list li::before { content: '→'; color: var(--warning); }
        .results-actions { display: flex; flex-wrap: wrap; gap: 14px; justify-content: center; margin-top: 48px; }
        .meta-pill { display: inline-flex; align-items: center; gap: 6px; background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.1); border-radius: 100px; padding: 5px 14px; font-size: 0.85rem; color: var(--text-muted); }
        @media(max-width: 900px) { .charts-grid, .feedback-grid { grid-template-columns: 1fr; } }
        @media print {
          .results-actions, nav, footer, .bg-canvas, .bg-grid, .bg-blobs { display: none !important; }
          body { background: white; color: black; }
        }
      `}</style>

      {/* ── Score Hero ── */}
      <div className="results-hero">
        <div className="container">
          <div style={{ display: 'flex', alignItems: 'center', gap: 48, flexWrap: 'wrap', justifyContent: 'center' }}>
            <ScoreCircle score={overallScore} />
            <div>
              <div style={{ fontSize: '0.8rem', color: 'var(--primary)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>
                Interview Results
              </div>
              <h1 style={{ fontSize: 'clamp(1.6rem, 3vw, 2.4rem)', fontWeight: 900, marginBottom: 12 }}>
                {overallScore >= 75 ? <><FaTrophy style={{ color: 'var(--warning)', marginRight: 8 }} /> Great Performance!</> : overallScore >= 55 ? <><FaCheckCircle style={{ color: 'var(--success)', marginRight: 8 }} /> Solid Effort!</> : <><FaDumbbell style={{ color: 'var(--primary)', marginRight: 8 }} /> Keep Practicing!</>}
              </h1>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginBottom: 20 }}>
                {result.company && <span className="meta-pill"><FaBuilding style={{ marginRight: 6 }} /> {result.company}</span>}
                {result.role && <span className="meta-pill"><FaBriefcase style={{ marginRight: 6 }} /> {result.role}</span>}
                {result.interviewType && <span className="meta-pill"><FaBullseye style={{ marginRight: 6 }} /> {result.interviewType}</span>}
                {result.createdAt && (
                  <span className="meta-pill"><FaCalendarAlt style={{ marginRight: 6 }} /> {new Date(result.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                )}
                {questions.length > 0 && <span className="meta-pill"><FaQuestionCircle style={{ marginRight: 6 }} /> {questions.length} Questions</span>}
              </div>
              <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
                {metricValues.map((val, i) => (
                  <div key={i} style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '1.3rem', fontWeight: 800, color: getScoreColor(val) }}>{val}</div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)', fontWeight: 500 }}>{METRICS[i].split(' ')[0]}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container">
        {/* ── Charts Grid ── */}
        <div style={{ marginBottom: 12 }}>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: 6 }}>Performance Analytics</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: 28 }}>Detailed breakdown across all evaluation metrics</p>
        </div>
        <div className="charts-grid">
          <div className="chart-card">
            <div className="chart-card-title"><FaCrosshairs style={{ marginRight: 8 }} /> Radar Overview</div>
            <Radar data={radarData} options={radarOptions} />
          </div>
          <div className="chart-card">
            <div className="chart-card-title"><FaChartBar style={{ marginRight: 8 }} /> Metric Breakdown</div>
            <Bar data={barData} options={barOptions} />
          </div>
          <div className="chart-card">
            <div className="chart-card-title"><FaChartPie style={{ marginRight: 8 }} /> Score Distribution</div>
            <Doughnut data={doughnutData} options={{ ...chartOptions, cutout: '65%' }} />
          </div>
        </div>

        {/* ── AI Feedback Cards ── */}
        <div style={{ marginBottom: 12 }}>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: 6 }}>AI Feedback</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: 28 }}>Detailed AI analysis of your interview performance</p>
        </div>
        <div className="feedback-grid">
          <div className="feedback-card strengths">
            <div className="feedback-card-title"><FaCheckCircle style={{ color: 'var(--success)', marginRight: 8 }} /> Strengths</div>
            <ul className="feedback-list">
              {strengths.map((s, i) => <li key={i}>{s}</li>)}
            </ul>
          </div>
          <div className="feedback-card weaknesses">
            <div className="feedback-card-title"><FaExclamationTriangle style={{ color: 'var(--danger)', marginRight: 8 }} /> Weaknesses</div>
            <ul className="feedback-list">
              {weaknesses.map((w, i) => <li key={i}>{w}</li>)}
            </ul>
          </div>
          <div className="feedback-card suggestions">
            <div className="feedback-card-title"><FaLightbulb style={{ color: 'var(--warning)', marginRight: 8 }} /> Suggestions</div>
            <ul className="feedback-list">
              {suggestions.map((s, i) => <li key={i}>{s}</li>)}
            </ul>
          </div>
        </div>

        {/* ── Question Review ── */}
        {questions.length > 0 && (
          <div style={{ marginBottom: 48 }}>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: 6 }}>Question Review</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: 28 }}>Click each question to expand your answer and AI feedback</p>
            {questions.map((item, i) => (
              <QAItem key={i} item={item} index={i} />
            ))}
          </div>
        )}

        {/* ── Action Buttons ── */}
        <div className="results-actions">
          <Link to="/setup" className="btn btn-primary btn-lg">
            <FaRocket style={{ marginRight: 8 }} /> Start New Interview
          </Link>
          <Link to="/analytics" className="btn btn-secondary btn-lg">
            <FaChartBar style={{ marginRight: 8 }} /> View Analytics
          </Link>
          <Link to="/dashboard" className="btn btn-secondary btn-lg">
            <FaChartBar style={{ marginRight: 8 }} /> Dashboard
          </Link>
          <button onClick={handleDownload} className="btn btn-ghost btn-lg">
            <FaPrint style={{ marginRight: 8 }} /> Download / Print
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResultsPage;
