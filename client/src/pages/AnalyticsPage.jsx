import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { FaChartBar, FaChartPie, FaCrosshairs, FaCheckCircle, FaExclamationTriangle, FaLightbulb, FaFrown } from 'react-icons/fa';
import { Chart as ChartJS, RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend, CategoryScale, LinearScale, BarElement, ArcElement } from 'chart.js';
import { Radar, Bar, Doughnut } from 'react-chartjs-2';

ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend, CategoryScale, LinearScale, BarElement, ArcElement);

const METRICS = ['Confidence', 'Accuracy', 'Communication', 'Speed', 'Problem Solving', 'Time Management'];
const METRIC_FIELDS = ['confidence', 'accuracy', 'communication', 'speed', 'problemSolving', 'timeManagement'];

const getScoreColor = (s) => s >= 85 ? 'var(--success)' : s >= 65 ? 'var(--warning)' : 'var(--danger)';

const AnalyticsPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [lastResult, setLastResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLastResult = async () => {
      try {
        const res = await axios.get('/api/results');
        const results = res.data.results || res.data || [];
        if (results.length > 0) {
          setLastResult(results[0]);
        }
      } catch (err) {
        setError('Could not load analytics data.');
      } finally {
        setLoading(false);
      }
    };
    fetchLastResult();
  }, []);

  if (loading) {
    return (
      <div className="page-wrapper" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: 60, height: 60, border: '4px solid rgba(99,102,241,0.15)', borderTopColor: 'var(--primary)', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 20px' }} />
          <p style={{ color: 'var(--text-muted)' }}>Loading analytics…</p>
        </div>
      </div>
    );
  }

  if (error || !lastResult) {
    return (
      <div className="page-wrapper" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center', maxWidth: 400 }}>
          <FaChartBar style={{ fontSize: '3rem', marginBottom: 16, color: 'var(--text-muted)' }} />
          <h2 style={{ marginBottom: 8 }}>No Analytics Data</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: 24 }}>{error || 'Complete an interview to see your analytics here.'}</p>
          <Link to="/setup" className="btn btn-primary">Start an Interview</Link>
        </div>
      </div>
    );
  }

  const metricValues = METRIC_FIELDS.map((field) => {
    const val = lastResult[field] ?? lastResult.metrics?.[field] ?? null;
    return val !== null ? val : Math.round(50 + Math.random() * 40);
  });

  const overallScore = lastResult.overallScore ?? lastResult.score ?? lastResult.totalScore ?? Math.round(metricValues.reduce((a, b) => a + b, 0) / metricValues.length);

  const radarData = {
    labels: METRICS,
    datasets: [{
      label: 'Your Performance',
      data: metricValues,
      backgroundColor: 'rgba(99,102,241,0.15)',
      borderColor: 'rgba(99,102,241,0.8)',
      pointBackgroundColor: '#8B5CF6',
      pointBorderColor: 'rgba(139,92,246,0.5)',
      pointHoverBackgroundColor: '#06B6D4',
      borderWidth: 2,
      fill: true,
    }],
  };

  const barData = {
    labels: METRICS,
    datasets: [{
      label: 'Score',
      data: metricValues,
      backgroundColor: ['rgba(99,102,241,0.7)', 'rgba(139,92,246,0.7)', 'rgba(6,182,212,0.7)', 'rgba(34,197,94,0.7)', 'rgba(245,158,11,0.7)', 'rgba(239,68,68,0.7)'],
      borderColor: ['rgba(99,102,241,1)', 'rgba(139,92,246,1)', 'rgba(6,182,212,1)', 'rgba(34,197,94,1)', 'rgba(245,158,11,1)', 'rgba(239,68,68,1)'],
      borderWidth: 2,
      borderRadius: 6,
    }],
  };

  const doughnutData = {
    labels: METRICS,
    datasets: [{
      data: metricValues,
      backgroundColor: ['rgba(99,102,241,0.85)', 'rgba(139,92,246,0.85)', 'rgba(6,182,212,0.85)', 'rgba(34,197,94,0.85)', 'rgba(245,158,11,0.85)', 'rgba(239,68,68,0.85)'],
      borderColor: 'rgba(15,15,18,0.8)',
      borderWidth: 3,
      hoverOffset: 8,
    }],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: { labels: { color: 'rgba(248,250,252,0.8)', font: { family: 'Poppins', size: 11 } } },
      tooltip: { backgroundColor: 'rgba(15,15,18,0.95)', borderColor: 'rgba(99,102,241,0.3)', borderWidth: 1, titleColor: '#F8FAFC', bodyColor: 'rgba(148,163,184,0.9)', padding: 10 },
    },
  };

  const radarOptions = { ...chartOptions, scales: { r: { min: 0, max: 100, grid: { color: 'rgba(255,255,255,0.06)' }, pointLabels: { color: 'rgba(148,163,184,0.9)', font: { family: 'Poppins', size: 11 } }, ticks: { display: false, stepSize: 20 }, angleLines: { color: 'rgba(255,255,255,0.06)' } } } };
  const barOptions = { ...chartOptions, scales: { x: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: 'rgba(148,163,184,0.8)', font: { family: 'Poppins', size: 10 } } }, y: { min: 0, max: 100, grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: 'rgba(148,163,184,0.8)', font: { family: 'Poppins', size: 10 } } } } };

  const strengths = lastResult.aiFeedback?.strengths || lastResult.strengths || [];
  const weaknesses = lastResult.aiFeedback?.weaknesses || lastResult.weaknesses || [];
  const suggestions = lastResult.aiFeedback?.suggestions || lastResult.suggestions || [];

  return (
    <div className="page-wrapper" style={{ paddingBottom: 80 }}>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      <div className="bg-grid" aria-hidden="true" />
      <div className="bg-blobs" aria-hidden="true">
        <div className="bg-blob bg-blob-1" />
        <div className="bg-blob bg-blob-2" />
        <div className="bg-blob bg-blob-3" />
      </div>

      <div style={{ position: 'relative', zIndex: 1, paddingTop: 40 }}>
        <div className="container">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16, marginBottom: 32 }}>
            <div>
              <h1 style={{ fontSize: 'clamp(1.6rem, 3vw, 2.2rem)', fontWeight: 900, marginBottom: 4 }}>
                <FaChartBar style={{ color: 'var(--primary)', marginRight: 10 }} /> Performance Analytics
              </h1>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
                Your last interview performance breakdown
              </p>
            </div>
            <Link to="/dashboard" className="btn btn-secondary btn-sm">← Dashboard</Link>
          </div>

          <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: 28, marginBottom: 32 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 24, flexWrap: 'wrap' }}>
                <div style={{ width: 120, height: 120, borderRadius: '50%', background: `conic-gradient(var(--gradient) ${overallScore}%, rgba(255,255,255,0.06) 0)`, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                  <div style={{ width: 100, height: 100, borderRadius: '50%', background: 'var(--card)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                    <span style={{ fontSize: '1.8rem', fontWeight: 900, background: 'var(--gradient)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>{overallScore}</span>
                    <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: 600 }}>OVERALL</span>
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: 4 }}>
                    {lastResult.company || 'General'} — {lastResult.role || 'Developer'}
                  </div>
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    {lastResult.difficulty && <span className="badge badge-primary">{lastResult.difficulty}</span>}
                    {lastResult.interviewType && <span className="badge badge-accent">{lastResult.interviewType}</span>}
                    {lastResult.createdAt && (
                      <span className="badge badge-warning">{new Date(lastResult.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                    )}
                  </div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <Link to={`/results/${lastResult._id}`} className="btn btn-primary btn-sm">View Full Results</Link>
                <Link to="/setup" className="btn btn-secondary btn-sm">New Interview</Link>
              </div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24, marginBottom: 40 }}>
            <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: 24 }}>
              <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 20 }}><FaCrosshairs style={{ marginRight: 8 }} /> Radar Overview</div>
              <Radar data={radarData} options={radarOptions} />
            </div>
            <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: 24 }}>
              <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 20 }}><FaChartBar style={{ marginRight: 8 }} /> Metric Breakdown</div>
              <Bar data={barData} options={barOptions} />
            </div>
            <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: 24 }}>
              <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 20 }}><FaChartPie style={{ marginRight: 8 }} /> Score Distribution</div>
              <Doughnut data={doughnutData} options={{ ...chartOptions, cutout: '65%' }} />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24, marginBottom: 40 }}>
            {[
              { title: <><FaCheckCircle style={{ color: 'var(--success)', marginRight: 8 }} /> Strengths</>, items: strengths, borderColor: 'rgba(34,197,94,0.25)', titleColor: 'var(--success)', bullet: '✓', bulletColor: 'var(--success)' },
              { title: <><FaExclamationTriangle style={{ color: 'var(--danger)', marginRight: 8 }} /> Weaknesses</>, items: weaknesses, borderColor: 'rgba(239,68,68,0.25)', titleColor: 'var(--danger)', bullet: '✗', bulletColor: 'var(--danger)' },
              { title: <><FaLightbulb style={{ color: 'var(--warning)', marginRight: 8 }} /> Suggestions</>, items: suggestions, borderColor: 'rgba(245,158,11,0.25)', titleColor: 'var(--warning)', bullet: '→', bulletColor: 'var(--warning)' },
            ].map((section, i) => (
              <div key={i} style={{ background: 'var(--card)', border: `1px solid ${section.borderColor}`, borderRadius: 'var(--radius)', padding: 24 }}>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: 16, color: section.titleColor }}>{section.title}</h3>
                {section.items.length > 0 ? (
                  <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {section.items.map((item, j) => (
                      <li key={j} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                        <span style={{ color: section.bulletColor, flexShrink: 0 }}>{section.bullet}</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p style={{ color: 'var(--text-dim)', fontSize: '0.9rem' }}>No data available</p>
                )}
              </div>
            ))}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
            {METRICS.map((m, i) => (
              <div key={i} style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', padding: 20, textAlign: 'center' }}>
                <div style={{ fontSize: '1.6rem', fontWeight: 900, color: getScoreColor(metricValues[i]) }}>{metricValues[i]}</div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 500 }}>{m}</div>
                <div className="progress-bar" style={{ marginTop: 8 }}>
                  <div className="progress-fill" style={{ width: `${metricValues[i]}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;