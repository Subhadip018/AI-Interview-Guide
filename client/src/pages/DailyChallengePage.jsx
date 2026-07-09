import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaTrophy, FaFire, FaCheckCircle, FaTimesCircle, FaArrowLeft, FaStar, FaBrain, FaCode, FaUsers, FaChartBar } from 'react-icons/fa';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const TOPIC_ICONS = {
  Frontend: FaCode,
  Backend: FaBrain,
  'Full Stack': FaStar,
  Behavioral: FaUsers,
  'Data Analyst': FaChartBar,
};

// Questions seeded by date: 1 per topic
const ALL_TOPICS = ['Frontend', 'Backend', 'Full Stack', 'Behavioral', 'Data Analyst'];

// Pull questions from the same bank used in the server
const QUESTION_BANK = [
  { id: 'dc_f1', question: 'Explain the difference between CSS Grid and Flexbox. When do you use each?', topic: 'Frontend', difficulty: 'Easy' },
  { id: 'dc_f2', question: 'What is the virtual DOM in React and how does it improve performance?', topic: 'Frontend', difficulty: 'Easy' },
  { id: 'dc_f3', question: 'How do you handle state management in a large React application?', topic: 'Frontend', difficulty: 'Medium' },
  { id: 'dc_f4', question: 'Explain event delegation and why it is used in JavaScript.', topic: 'Frontend', difficulty: 'Easy' },
  { id: 'dc_b1', question: 'Explain the difference between SQL and NoSQL databases and give use cases for each.', topic: 'Backend', difficulty: 'Easy' },
  { id: 'dc_b2', question: 'How do you secure a REST API? Walk through the main security concerns.', topic: 'Backend', difficulty: 'Medium' },
  { id: 'dc_b3', question: 'What is the CAP theorem and how does it affect distributed system design?', topic: 'Backend', difficulty: 'Hard' },
  { id: 'dc_b4', question: 'How does Docker help in development and production environments?', topic: 'Backend', difficulty: 'Easy' },
  { id: 'dc_fs1', question: 'How do you structure a full-stack project to ensure maintainability and scalability?', topic: 'Full Stack', difficulty: 'Medium' },
  { id: 'dc_fs2', question: 'Walk me through the request lifecycle from browser to database and back.', topic: 'Full Stack', difficulty: 'Medium' },
  { id: 'dc_fs3', question: 'Tell me about your most impactful project. What problem did it solve?', topic: 'Full Stack', difficulty: 'Easy' },
  { id: 'dc_beh1', question: 'Tell me about a time you resolved a major conflict within your team.', topic: 'Behavioral', difficulty: 'Medium' },
  { id: 'dc_beh2', question: 'Describe a time you had to learn a new technology very quickly to deliver a project.', topic: 'Behavioral', difficulty: 'Easy' },
  { id: 'dc_beh3', question: 'Tell me about a time you made a controversial technical decision and had to defend it.', topic: 'Behavioral', difficulty: 'Hard' },
  { id: 'dc_da1', question: 'How would you detect and handle outliers in a dataset?', topic: 'Data Analyst', difficulty: 'Medium' },
  { id: 'dc_da2', question: 'Explain the difference between correlation and causation with a real-world example.', topic: 'Data Analyst', difficulty: 'Easy' },
  { id: 'dc_da3', question: 'What is p-value and how do you interpret it in hypothesis testing?', topic: 'Data Analyst', difficulty: 'Medium' },
];

// Deterministic seed based on date
const getDailyQuestions = () => {
  const today = new Date();
  const dateStr = `${today.getFullYear()}-${today.getMonth()}-${today.getDate()}`;
  let seed = 0;
  for (let i = 0; i < dateStr.length; i++) seed = ((seed << 5) - seed) + dateStr.charCodeAt(i);
  const dayIndex = Math.abs(seed);
  return ALL_TOPICS.map((topic, ti) => {
    const pool = QUESTION_BANK.filter(q => q.topic === topic);
    return pool[Math.abs(dayIndex + ti * 7) % pool.length];
  });
};

const getStreakData = () => {
  try {
    return JSON.parse(localStorage.getItem('ia_daily_challenge_streak') || '{}');
  } catch { return {}; }
};

const setStreakData = (data) => {
  localStorage.setItem('ia_daily_challenge_streak', JSON.stringify(data));
};

const DailyChallengePage = () => {
  const { user, refreshUser } = useAuth();
  const navigate = useNavigate();
  const questions = useMemo(() => getDailyQuestions(), []);
  const [answers, setAnswers] = useState({});
  const [scores, setScores] = useState({});
  const [checked, setChecked] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [overallScore, setOverallScore] = useState(0);
  const [dailyStreak, setDailyStreak] = useState(0);
  const [completing, setCompleting] = useState(false);

  useEffect(() => {
    const sd = getStreakData();
    const today = new Date().toDateString();
    if (sd.lastDate === today) {
      setSubmitted(true);
      setDailyStreak(sd.count || 0);
      if (sd.scores) setScores(sd.scores);
    } else {
      const yesterday = new Date(Date.now() - 86400000).toDateString();
      setDailyStreak(sd.lastDate === yesterday ? (sd.count || 0) : 0);
    }
  }, []);

  const TOPIC_KEYWORDS = {
    Frontend: ['react', 'component', 'dom', 'css', 'html', 'javascript', 'jsx', 'state', 'hook', 'render', 'props', 'event', 'responsive', 'flexbox', 'grid', 'virtual', 'api', 'async', 'promise', 'callback', 're-render', 'usestate', 'useeffect', 'classname', 'styled', 'inline', 'scss', 'sass', 'animation', 'transition', 'selector', 'pseudo', 'media', 'query', 'typescript', 'babel', 'webpack'],
    Backend: ['api', 'database', 'sql', 'nosql', 'server', 'endpoint', 'auth', 'middleware', 'cache', 'scalability', 'docker', 'rest', 'crud', 'microservice', 'load', 'balancing', 'query', 'index', 'migration', 'orm', 'mongoose', 'express', 'node', 'python', 'java', 'spring', 'deployment', 'ci/cd', 'pipeline'],
    'Full Stack': ['frontend', 'backend', 'database', 'api', 'deployment', 'ci/cd', 'testing', 'architecture', 'scalable', 'maintainable', 'framework', 'pipeline', 'git', 'version', 'control', 'integration', 'fullstack', 'mern', 'mean', 'rest', 'graphql', 'microservice', 'monolith', 'docker'],
    Behavioral: ['team', 'project', 'challenge', 'solution', 'collaborate', 'communicate', 'lead', 'mentor', 'deadline', 'conflict', 'resolve', 'learn', 'improve', 'result', 'impact', 'responsibility', 'goal', 'achieve', 'stakeholder', 'feedback', 'adapt', 'prioritize', 'negotiate'],
    'Data Analyst': ['data', 'analysis', 'statistics', 'python', 'sql', 'visualization', 'machine', 'learning', 'pandas', 'numpy', 'regression', 'correlation', 'hypothesis', 'outlier', 'cleaning', 'preprocessing', 'model', 'dashboard', 'tableau', 'power bi', 'excel', 'r', 'scikit', 'tensorflow', 'classification'],
  };

  const evaluateAnswer = useCallback((answer, question, topic) => {
    if (!answer || answer.trim().length < 10) return 0;
    const text = answer.toLowerCase();
    const words = answer.split(/\s+/).length;

    // Word count score (more lenient thresholds)
    const lengthScore = words >= 40 ? 35 : words >= 25 ? 25 : words >= 15 ? 15 : 5;

    // Topic-specific keyword matching
    const keywords = TOPIC_KEYWORDS[topic] || [];
    const matchedCount = keywords.filter(kw => text.includes(kw)).length;
    const keywordRatio = keywords.length > 0 ? matchedCount / keywords.length : 0;
    const keywordScore = keywordRatio >= 0.15 ? 30 : keywordRatio >= 0.08 ? 20 : keywordRatio >= 0.04 ? 10 : 5;

    // Question-aware matching (synonym-friendly - just check for thematic overlap)
    const questionWords = question.toLowerCase().split(/\s+/).filter(w => w.length > 4);
    const questionMatches = questionWords.filter(w => text.includes(w)).length;
    const questionRatio = questionWords.length > 0 ? questionMatches / questionWords.length : 0;
    const questionScore = questionRatio >= 0.4 ? 15 : questionRatio >= 0.2 ? 8 : 3;

    // Quality indicators
    const hasExample = /example|for instance|specifically|such as|like|including/i.test(text);
    const hasReasoning = /because|therefore|however|consequently|as a result|since|hence|thus/i.test(text);
    const hasStructure = /first|second|finally|additionally|moreover|furthermore|in addition|on the other hand/i.test(text);
    const qualityScore = (hasExample ? 8 : 0) + (hasReasoning ? 8 : 0) + (hasStructure ? 4 : 0);

    // Bonus for substantial answers with good keyword coverage
    const bonusScore = words >= 30 && keywordRatio >= 0.1 ? 10 : words >= 20 && keywordRatio >= 0.05 ? 5 : 0;

    let total = lengthScore + keywordScore + questionScore + qualityScore + bonusScore;
    return Math.min(100, Math.max(0, total));
  }, []);

  const handleCheck = (qId) => {
    const q = questions.find(q => q.id === qId);
    const score = evaluateAnswer(answers[qId] || '', q?.question || '', q?.topic || '');
    setScores(prev => ({ ...prev, [qId]: score }));
    setChecked(prev => ({ ...prev, [qId]: true }));
  };

  const handleSubmit = async () => {
    const allScores = {};
    questions.forEach(q => {
      allScores[q.id] = evaluateAnswer(answers[q.id] || '', q.question, q.topic);
    });
    setScores(allScores);
    const avg = Math.round(Object.values(allScores).reduce((a, b) => a + b, 0) / questions.length);
    setOverallScore(avg);
    setSubmitted(true);

    const today = new Date().toDateString();
    const yesterday = new Date(Date.now() - 86400000).toDateString();
    const sd = getStreakData();
    let newCount = 1;
    if (sd.lastDate === yesterday) newCount = (sd.count || 0) + 1;
    else if (sd.lastDate === today) newCount = sd.count || 0;

    if (avg >= 60) {
      setDailyStreak(newCount);
      setStreakData({ lastDate: today, count: newCount, scores: allScores });
    } else {
      setDailyStreak(sd.lastDate === today ? (sd.count || 0) : 0);
      setStreakData({ lastDate: today, count: sd.lastDate === today ? (sd.count || 0) : 0, scores: allScores });
    }

    if (avg >= 60) {
      setCompleting(true);
      try {
        await axios.post('/api/achievements/daily-complete', { streak: newCount, score: avg });
        refreshUser();
      } catch { /* ignore */ }
      setCompleting(false);
    }
  };

  const allChecked = questions.every(q => checked[q.id]);
  const attempted = Object.keys(checked).length;

  return (
    <div className="page-wrapper" style={{ paddingBottom: 80 }}>
      <div className="bg-grid" aria-hidden="true" />
      <div className="bg-blobs" aria-hidden="true">
        <div className="bg-blob bg-blob-1" /><div className="bg-blob bg-blob-2" /><div className="bg-blob bg-blob-3" />
      </div>
      <div style={{ position: 'relative', zIndex: 1, paddingTop: 40 }}>
        <div className="container" style={{ maxWidth: 800 }}>
          <Link to="/achievements" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: 20 }}>
            <FaArrowLeft /> Back to Achievements
          </Link>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16, marginBottom: 32 }}>
            <div>
              <h1 style={{ fontSize: 'clamp(1.6rem, 3vw, 2.2rem)', fontWeight: 900, marginBottom: 4 }}>
                <FaStar style={{ color: 'var(--warning)', marginRight: 10 }} /> Daily Challenge
              </h1>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
                {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
              </p>
            </div>
            <div style={{ textAlign: 'center', background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.3)', borderRadius: 12, padding: '12px 24px' }}>
              <div style={{ fontSize: '1.8rem', fontWeight: 900, color: 'var(--warning)' }}>{dailyStreak}</div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600 }}>DAY STREAK</div>
            </div>
          </div>

          {submitted && (
            <div style={{ background: overallScore >= 60 ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)', border: `1px solid ${overallScore >= 60 ? 'rgba(34,197,94,0.3)' : 'rgba(239,68,68,0.3)'}`, borderRadius: 'var(--radius)', padding: '20px 28px', marginBottom: 28, display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
              {overallScore >= 60 ? <FaTrophy style={{ fontSize: '2rem', color: 'var(--warning)' }} /> : <FaTimesCircle style={{ fontSize: '2rem', color: 'var(--danger)' }} />}
              <div>
                <div style={{ fontWeight: 700, fontSize: '1.1rem' }}>{overallScore >= 60 ? 'Challenge Complete!' : 'Keep Trying!'}</div>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Score: {overallScore}/100 {overallScore >= 60 ? '— Streak updated!' : '— Score 60+ to update your streak'}</div>
              </div>
            </div>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {questions.map((q, i) => {
              const TopicIcon = TOPIC_ICONS[q.topic] || FaStar;
              const isChecked = checked[q.id];
              const score = scores[q.id];
              const scoreColor = score >= 70 ? 'var(--success)' : score >= 40 ? 'var(--warning)' : 'var(--danger)';
              return (
                <div key={q.id} style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: 24 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                    <span style={{ background: 'rgba(99,102,241,0.12)', width: 32, height: 32, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)', flexShrink: 0 }}>
                      <TopicIcon />
                    </span>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>Question {i + 1}: {q.topic}</div>
                      <div style={{ display: 'flex', gap: 6, marginTop: 4 }}>
                        <span className="badge badge-primary">{q.topic}</span>
                        <span className={`badge ${q.difficulty === 'Hard' ? 'badge-danger' : q.difficulty === 'Medium' ? 'badge-warning' : 'badge-success'}`}>{q.difficulty}</span>
                      </div>
                    </div>
                  </div>
                  <p style={{ color: 'var(--text)', fontSize: '0.95rem', lineHeight: 1.65, marginBottom: 16 }}>{q.question}</p>
                  <textarea
                    value={answers[q.id] || ''}
                    onChange={(e) => setAnswers(prev => ({ ...prev, [q.id]: e.target.value }))}
                    disabled={submitted}
                    placeholder="Type your answer here..."
                    rows={4}
                    style={{ width: '100%', background: 'rgba(255,255,255,0.04)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', padding: 12, color: 'var(--text)', fontSize: '0.9rem', resize: 'vertical', fontFamily: 'inherit', marginBottom: 12 }}
                  />
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
                    {!submitted && !isChecked && (
                      <button onClick={() => handleCheck(q.id)} className="btn btn-secondary btn-sm" disabled={!answers[q.id]?.trim()}>Check Answer</button>
                    )}
                    {isChecked && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span style={{ fontWeight: 800, fontSize: '1.1rem', color: scoreColor }}>{score}</span>
                        <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>/ 100</span>
                        {score >= 60 ? <FaCheckCircle style={{ color: 'var(--success)' }} /> : <FaTimesCircle style={{ color: 'var(--danger)' }} />}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {!submitted && (
            <div style={{ textAlign: 'center', marginTop: 32 }}>
              <button onClick={handleSubmit} className="btn btn-primary btn-lg btn-pulse" disabled={attempted === 0 || completing} style={{ minWidth: 240 }}>
                {completing ? 'Submitting...' : 'Submit All Answers'}
              </button>
              <p style={{ marginTop: 12, color: 'var(--text-dim)', fontSize: '0.85rem' }}>Click "Check Answer" on at least one question to enable submission.</p>
            </div>
          )}

          {submitted && (
            <div style={{ textAlign: 'center', marginTop: 32 }}>
              <Link to="/setup" className="btn btn-primary btn-lg">
                <FaBrain style={{ marginRight: 8 }} /> Practice More
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DailyChallengePage;
