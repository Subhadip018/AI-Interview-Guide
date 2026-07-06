import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useInterview } from '../context/InterviewContext';
import { 
  FaClock, FaBullseye, FaLightbulb, FaSmile, FaSyncAlt,
  FaMicrophone, FaPen, FaCode, FaPalette, FaBrain,
  FaVolumeMute, FaVolumeUp, FaCheck, FaChevronRight, FaTrophy, FaTrash,
  FaHourglassHalf, FaChartLine, FaStopwatch, FaCircle
} from 'react-icons/fa';

/* ─────────────────────────────────────────────
   Helper: format seconds to MM:SS
───────────────────────────────────────────── */
function formatTime(seconds) {
  const m = Math.floor(seconds / 60).toString().padStart(2, '0');
  const s = (seconds % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}

/* ─────────────────────────────────────────────
   Tips & STAR Data
───────────────────────────────────────────── */
const TIPS = [
  { icon: <FaClock style={{ color: 'var(--accent)' }} />, text: 'Take a moment to think before answering. Pause is okay.' },
  { icon: <FaBullseye style={{ color: 'var(--danger)' }} />, text: 'Be specific — use concrete examples and metrics.' },
  { icon: <FaLightbulb style={{ color: 'var(--warning)' }} />, text: 'Structure your answer: context → action → result.' },
  { icon: <FaSmile style={{ color: 'var(--success)' }} />, text: 'Maintain a calm, confident tone even under pressure.' },
  { icon: <FaSyncAlt style={{ color: 'var(--primary)' }} />, text: "It's fine to ask the interviewer to clarify the question." },
];

const STAR_ITEMS = [
  { label: 'Situation', desc: 'Set the scene and give context.' },
  { label: 'Task', desc: 'Describe your responsibility.' },
  { label: 'Action', desc: 'Explain the steps you took.' },
  { label: 'Result', desc: 'Share the outcome & learnings.' },
];

/* ─────────────────────────────────────────────
   Completion Card Component
───────────────────────────────────────────── */
function CompletionCard({ onViewResults, loading }) {
  return (
    <div style={{
      minHeight: 'calc(100vh - var(--navbar-h))',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px 20px',
    }}>
      <div style={{
        background: 'var(--card)',
        border: '1px solid var(--border)',
        borderRadius: 24,
        padding: '60px 48px',
        textAlign: 'center',
        maxWidth: 520,
        width: '100%',
        position: 'relative',
        overflow: 'hidden',
        animation: 'fadeInUp 0.5s ease both',
      }}>
        <div style={{
          position: 'absolute', inset: 0,
          background: 'radial-gradient(ellipse at center, rgba(99,102,241,0.08), transparent 70%)',
          pointerEvents: 'none',
        }} />
        <div style={{ fontSize: '5rem', marginBottom: 24, animation: 'bounceIn 0.6s ease', color: 'var(--primary)' }}>
          <FaTrophy />
        </div>
        <h2 style={{ fontSize: '2rem', fontWeight: 900, marginBottom: 12 }}>
          Interview Complete!
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '1rem', lineHeight: 1.7, marginBottom: 36 }}>
          Great job! You've answered all the questions. We're analyzing your responses and calculating your score…
        </p>
        <button
          className="btn btn-primary btn-lg btn-pulse"
          onClick={onViewResults}
          disabled={loading}
          id="view-results-btn"
          type="button"
          style={{ minWidth: 220, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
        >
          {loading ? (
            <>
              <span style={{
                display: 'inline-block', width: 18, height: 18,
                border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff',
                borderRadius: '50%', animation: 'spin 0.7s linear infinite'
              }} />
              Analyzing…
            </>
          ) : (
            <><FaChartLine /> View My Results</>
          )}
        </button>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Main InterviewPage Component
───────────────────────────────────────────── */
export default function InterviewPage() {
  const navigate = useNavigate();
  const {
    config,
    questions,
    currentIndex,
    answers,
    isComplete,
    submitAnswer,
    nextQuestion,
    skipQuestion,
  } = useInterview();

  const currentQuestion = questions[currentIndex] || {};
  const totalQuestions = questions.length;
  const timeLimit = currentQuestion.timeLimit || 120;

  /* ── State ── */
  const [currentAnswer, setCurrentAnswer] = useState('');
  const [activeTab, setActiveTab] = useState('text');      // voice | text | code | whiteboard
  const [isRecording, setIsRecording] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [timeLeft, setTimeLeft] = useState(timeLimit);
  const [showHint, setShowHint] = useState(false);
  const [isDrawing, setIsDrawing] = useState(false);
  const [drawColor, setDrawColor] = useState('#6366F1');
  const [drawSize, setDrawSize] = useState(3);
  const [codeTab, setCodeTab] = useState('js');
  const [codeContent, setCodeContent] = useState('// Write your solution here\n');
  const [transcript, setTranscript] = useState('');
  const [submittingResults, setSubmittingResults] = useState(false);

  /* ── Refs ── */
  const timerRef = useRef(null);
  const recognitionRef = useRef(null);
  const canvasRef = useRef(null);
  const lastPosRef = useRef({ x: 0, y: 0 });
  const transcriptRef = useRef('');

  useEffect(() => {
    transcriptRef.current = transcript;
  }, [transcript]);

  /* ── Redirect if no questions ── */
  useEffect(() => {
    if (!questions || questions.length === 0) {
      navigate('/setup');
    }
  }, [questions, navigate]);

  /* ── Reset answer & timer on question change ── */
  useEffect(() => {
    setCurrentAnswer('');
    setTranscript('');
    setShowHint(false);
    setIsRecording(false);
    setTimeLeft(currentQuestion.timeLimit || 120);
    stopSpeech();
    if (config.voiceEnabled && currentQuestion.question) {
      speakQuestion(currentQuestion.question);
    }
    // Clear whiteboard
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d');
      ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentIndex]);

  /* ── Timer countdown ── */
  useEffect(() => {
    if (isComplete) return;
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          handleAutoAdvance();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentIndex, isComplete]);

  /* ── Speech Synthesis ── */
  const speakQuestion = (text) => {
    if (!window.speechSynthesis) return;
    stopSpeech();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.95;
    utterance.pitch = 1;
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    window.speechSynthesis.speak(utterance);
  };

  const stopSpeech = () => {
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  /* ── Speech Recognition ── */
  const toggleRecording = useCallback(() => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) {
      alert('Speech recognition is not supported in your browser. Please use Chrome.');
      return;
    }
    if (isRecording) {
      recognitionRef.current?.stop();
      setIsRecording(false);
      return;
    }
    const recognition = new SR();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';
    recognition.onresult = (e) => {
      let interim = '';
      let final = '';
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const t = e.results[i][0].transcript;
        if (e.results[i].isFinal) final += t;
        else interim += t;
      }
      setTranscript(prev => prev + final);
      setCurrentAnswer(prev => prev + final);
    };
    recognition.onerror = (e) => {
      console.error('Speech recognition error:', e.error);
      setIsRecording(false);
      alert('Speech was not clear or permission was denied. Redirecting to text option.');
      setActiveTab('text');
    };
    recognition.onend = () => {
      setIsRecording(false);
      setTimeout(() => {
        if (!transcriptRef.current || transcriptRef.current.trim().length < 3) {
          alert('Speech was not clear or no voice detected. Redirecting to text option.');
          setActiveTab('text');
        }
      }, 500);
    };
    recognition.start();
    recognitionRef.current = recognition;
    setIsRecording(true);
  }, [isRecording]);

  /* ── Auto-advance when timer hits 0 ── */
  const handleAutoAdvance = () => {
    submitAnswer(currentAnswer || '[Time expired — no answer provided]');
    nextQuestion();
  };

  /* ── Submit Answer ── */
  const handleSubmit = () => {
    clearInterval(timerRef.current);
    stopSpeech();
    if (isRecording) recognitionRef.current?.stop();

    const ans = activeTab === 'code' ? codeContent : currentAnswer;
    submitAnswer(ans || '[No answer provided]');
    setCurrentAnswer('');
    setCodeContent('// Write your solution here\n');
    nextQuestion();
  };

  /* ── Skip ── */
  const handleSkip = () => {
    clearInterval(timerRef.current);
    stopSpeech();
    if (isRecording) recognitionRef.current?.stop();
    skipQuestion();
    setCurrentAnswer('');
  };

  /* ── View Results (POST to /api/interview/feedback) ── */
  const handleViewResults = async () => {
    setSubmittingResults(true);
    try {
      const payload = {
        config,
        answers,
        questions,
      };
      const res = await axios.post('/api/interview/feedback', payload);
      const resultId = res.data?.resultId || res.data?._id || res.data?.id;
      navigate(resultId ? `/results/${resultId}` : '/results', { state: res.data });
    } catch (err) {
      console.error('Failed to submit results:', err);
      // Navigate anyway, carrying local answers
      navigate('/results', { state: { config, answers, questions } });
    } finally {
      setSubmittingResults(false);
    }
  };

  /* ─── Whiteboard canvas ─── */
  const handleCanvasMouseDown = (e) => {
    setIsDrawing(true);
    const rect = canvasRef.current.getBoundingClientRect();
    lastPosRef.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  };

  const handleCanvasMouseMove = (e) => {
    if (!isDrawing || !canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const ctx = canvasRef.current.getContext('2d');
    ctx.beginPath();
    ctx.moveTo(lastPosRef.current.x, lastPosRef.current.y);
    ctx.lineTo(x, y);
    ctx.strokeStyle = drawColor;
    ctx.lineWidth = drawSize;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.stroke();
    lastPosRef.current = { x, y };
  };

  const handleCanvasMouseUp = () => setIsDrawing(false);

  const clearCanvas = () => {
    if (!canvasRef.current) return;
    const ctx = canvasRef.current.getContext('2d');
    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
  };

  /* ── Timer states ── */
  const timerPct = (timeLeft / timeLimit) * 100;
  const timerClass = timeLeft <= 10 ? 'danger' : timeLeft <= 30 ? 'warning' : '';

  /* ── If complete ── */
  if (isComplete) {
    return (
      <div className="page-wrapper">
        <div className="bg-grid" aria-hidden="true" />
        <div className="bg-blobs" aria-hidden="true">
          <div className="bg-blob bg-blob-1" />
          <div className="bg-blob bg-blob-2" />
        </div>
        <CompletionCard onViewResults={handleViewResults} loading={submittingResults} />
        <style>{`
          @keyframes fadeInUp { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }
          @keyframes bounceIn { 0% { transform:scale(0.3); opacity:0; } 60% { transform:scale(1.1); } 100% { transform:scale(1); opacity:1; } }
          @keyframes spin { to { transform:rotate(360deg); } }
        `}</style>
      </div>
    );
  }

  /* ── If no question loaded yet ── */
  if (!currentQuestion.question) {
    return (
      <div className="page-wrapper" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
        <div style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: 12, color: 'var(--primary)' }}>
            <FaHourglassHalf style={{ animation: 'spin 1.5s linear infinite' }} />
          </div>
          Loading interview…
        </div>
      </div>
    );
  }

  return (
    <div className="page-wrapper">
      {/* Background */}
      <div className="bg-grid" aria-hidden="true" />
      <div className="bg-blobs" aria-hidden="true">
        <div className="bg-blob bg-blob-1" />
        <div className="bg-blob bg-blob-2" />
      </div>

      <div className="interview-page">
        <div className="container">
          <div className="interview-layout">

            {/* ──────────── LEFT PANEL ──────────── */}
            <aside className="interview-left">

              {/* AI Avatar */}
              <div className="ai-avatar-card">
                <div className={`ai-avatar ${isSpeaking ? 'speaking' : ''}`} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <div className="ai-avatar-ring" />
                  <FaBrain style={{ color: '#fff', fontSize: '2.2rem', zIndex: 10 }} />
                </div>
                <div className="ai-avatar-name">Alex AI</div>
                <div className="ai-avatar-status">
                  {isSpeaking ? 'Speaking…' : 'Ready to interview'}
                </div>
                {isSpeaking && (
                  <button
                    onClick={stopSpeech}
                    type="button"
                    style={{
                      marginTop: 12, padding: '6px 16px',
                      borderRadius: 100, fontSize: '0.8rem',
                      fontWeight: 600, cursor: 'pointer',
                      background: 'rgba(239,68,68,0.1)',
                      border: '1px solid rgba(239,68,68,0.3)',
                      color: 'var(--danger)',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 6
                    }}
                  >
                    <FaVolumeMute /> Stop Speaking
                  </button>
                )}
                {!isSpeaking && config.voiceEnabled && (
                  <button
                    onClick={() => speakQuestion(currentQuestion.question)}
                    type="button"
                    style={{
                      marginTop: 12, padding: '6px 16px',
                      borderRadius: 100, fontSize: '0.8rem',
                      fontWeight: 600, cursor: 'pointer',
                      background: 'rgba(99,102,241,0.1)',
                      border: '1px solid rgba(99,102,241,0.3)',
                      color: 'var(--primary)',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 6
                    }}
                  >
                    <FaVolumeUp /> Read Question
                  </button>
                )}
              </div>

              {/* Question Progress */}
              <div className="q-progress-card">
                <div className="q-progress-title">Progress</div>
                <div className="q-counter">
                  <span>{currentIndex + 1}</span>
                  <span style={{ color: 'var(--text-dim)', fontSize: '1.2rem' }}>
                    /{totalQuestions}
                  </span>
                </div>
                <div className="progress-bar" style={{ marginBottom: 12 }}>
                  <div
                    className="progress-fill"
                    style={{ width: `${((currentIndex + 1) / totalQuestions) * 100}%` }}
                  />
                </div>
                <div className="q-dots">
                  {questions.map((_, i) => {
                    const isAnswered = !!answers[i];
                    const isCurrent = i === currentIndex;
                    return (
                      <div
                        key={i}
                        className={`q-dot ${isAnswered ? 'answered' : ''} ${isCurrent ? 'current' : ''}`}
                        title={`Question ${i + 1}`}
                      >
                        {i + 1}
                      </div>
                    );
                  })}
                </div>
              </div>

            </aside>

            {/* ──────────── CENTER PANEL ──────────── */}
            <main className="interview-center">

              {/* Timer Bar */}
              <div className="timer-bar">
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Time Remaining
                  </div>
                  <div className={`timer-display ${timerClass}`}>
                    {formatTime(timeLeft)}
                  </div>
                </div>
                <div className="timer-progress" style={{ flex: 1 }}>
                  <div className="progress-bar">
                    <div
                      className="progress-fill"
                      style={{
                        width: `${timerPct}%`,
                        background: timeLeft <= 10
                          ? 'linear-gradient(135deg, #EF4444, #dc2626)'
                          : timeLeft <= 30
                            ? 'linear-gradient(135deg, #F59E0B, #d97706)'
                            : undefined,
                      }}
                    />
                  </div>
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)', textAlign: 'right' }}>
                  <div>{config.company}</div>
                  <div>{config.role}</div>
                </div>
              </div>

              {/* Question Card */}
              <div className="question-card" key={currentIndex}>
                <div className="question-meta">
                  <span className={`badge badge-${currentQuestion.type === 'Technical' ? 'accent' : currentQuestion.type === 'Behavioral' ? 'primary' : 'warning'}`}>
                    {currentQuestion.type || config.type}
                  </span>
                  <span className={`badge badge-${config.difficulty === 'Easy' ? 'success' : config.difficulty === 'Hard' ? 'danger' : 'warning'}`}>
                    {config.difficulty}
                  </span>
                  <span className="question-number">Question {currentIndex + 1} of {totalQuestions}</span>
                </div>

                <p className="question-text">
                  {currentQuestion.question}
                </p>

                 {/* Hint toggle */}
                 <button
                   onClick={() => setShowHint(v => !v)}
                   type="button"
                   style={{
                     padding: '6px 14px', borderRadius: 100,
                     fontSize: '0.82rem', fontWeight: 600, cursor: 'pointer',
                     background: showHint ? 'rgba(6,182,212,0.15)' : 'rgba(255,255,255,0.04)',
                     border: '1px solid rgba(6,182,212,0.3)',
                     color: 'var(--accent)', transition: 'all 0.2s',
                     display: 'inline-flex', alignItems: 'center', gap: 6
                   }}
                   id="hint-toggle-btn"
                 >
                   <FaLightbulb /> {showHint ? 'Hide Hint' : 'Show Hint'}
                 </button>
 
                 {showHint && (currentQuestion.hint || currentQuestion.tip) && (
                   <div className="question-hint">
                     <span><FaLightbulb /></span>
                     <span>{currentQuestion.hint || currentQuestion.tip}</span>
                   </div>
                 )}
 
                 {showHint && !currentQuestion.hint && !currentQuestion.tip && (
                   <div className="question-hint">
                     <span><FaLightbulb /></span>
                     <span>
                       Try using the STAR method: describe the Situation, Task, Action you took, and the Result.
                     </span>
                   </div>
                 )}
               </div>
 
               {/* Answer Area */}
               <div className="answer-area">
                 {/* Tabs */}
                 <div className="answer-tabs" role="tablist">
                   {['voice', 'text', 'code', 'whiteboard'].map(tab => (
                     <button
                       key={tab}
                       className={`answer-tab ${activeTab === tab ? 'active' : ''}`}
                       onClick={() => setActiveTab(tab)}
                       role="tab"
                       id={`tab-${tab}`}
                       type="button"
                       style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}
                     >
                       {tab === 'voice' && <FaMicrophone />}
                       {tab === 'text' && <FaPen />}
                       {tab === 'code' && <FaCode />}
                       {tab === 'whiteboard' && <FaPalette />}
                       {tab.charAt(0).toUpperCase() + tab.slice(1)}
                     </button>
                   ))}
                 </div>
 
                 {/* ── VOICE TAB ── */}
                 {activeTab === 'voice' && (
                   <div>
                     <div style={{
                       display: 'flex', alignItems: 'center', gap: 16,
                       padding: '16px', borderRadius: 'var(--radius-sm)',
                       background: 'rgba(255,255,255,0.02)',
                     }}>
                       <button
                         className={`mic-btn ${isRecording ? 'recording' : ''}`}
                         onClick={toggleRecording}
                         id="mic-btn"
                         type="button"
                         title={isRecording ? 'Stop recording' : 'Start recording'}
                       >
                         {isRecording ? <FaStopwatch /> : <FaMicrophone />}
                      </button>
                      <div className="voice-waveform">
                        {Array.from({ length: 12 }).map((_, i) => (
                          <div
                            key={i}
                            className={`wave-bar ${isRecording ? 'active' : ''}`}
                            style={{ animationDelay: `${i * 0.07}s` }}
                          />
                        ))}
                      </div>
                      <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', minWidth: 100 }}>
                        {isRecording ? <><FaCircle style={{ color: '#EF4444', fontSize: '0.7rem', marginRight: 6 }} /> Recording…</> : 'Tap mic to start'}
                      </div>
                    </div>

                    {transcript && (
                      <div style={{
                        marginTop: 14,
                        padding: '14px',
                        background: 'rgba(255,255,255,0.03)',
                        border: '1px solid var(--border)',
                        borderRadius: 'var(--radius-sm)',
                        fontSize: '0.92rem',
                        lineHeight: 1.7,
                        color: 'var(--text)',
                        minHeight: 80,
                      }}>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: 8, fontWeight: 600 }}>
                          TRANSCRIPT
                        </div>
                        {transcript}
                      </div>
                    )}

                    {!transcript && !isRecording && (
                      <div style={{
                        marginTop: 14, textAlign: 'center',
                        color: 'var(--text-dim)', fontSize: '0.88rem', padding: '20px 0',
                      }}>
                        Your spoken answer will appear here as text.
                      </div>
                    )}
                  </div>
                )}

                {/* ── TEXT TAB ── */}
                {activeTab === 'text' && (
                  <textarea
                    className="answer-textarea"
                    placeholder="Type your answer here… Be specific and structured."
                    value={currentAnswer}
                    onChange={e => setCurrentAnswer(e.target.value)}
                    id="text-answer"
                  />
                )}

                {/* ── CODE TAB ── */}
                {activeTab === 'code' && (
                  <div className="code-editor">
                    <div className="code-editor-header">
                      <div style={{ display: 'flex', gap: 6, marginRight: 8 }}>
                        <span style={{ width: 12, height: 12, borderRadius: '50%', background: '#ff5f57' }} />
                        <span style={{ width: 12, height: 12, borderRadius: '50%', background: '#febc2e' }} />
                        <span style={{ width: 12, height: 12, borderRadius: '50%', background: '#28c840' }} />
                      </div>
                      {['js', 'py', 'java', 'cpp'].map(lang => (
                        <button
                          key={lang}
                          className={`code-tab ${codeTab === lang ? 'active' : ''}`}
                          onClick={() => setCodeTab(lang)}
                          id={`code-lang-${lang}`}
                          type="button"
                        >
                          {lang === 'js' ? 'JavaScript' : lang === 'py' ? 'Python' : lang === 'java' ? 'Java' : 'C++'}
                        </button>
                      ))}
                    </div>
                    <textarea
                      className="code-textarea"
                      value={codeContent}
                      onChange={e => setCodeContent(e.target.value)}
                      spellCheck={false}
                      id="code-editor-textarea"
                      placeholder={`// Write your ${codeTab} solution here`}
                    />
                    <div className="code-run-bar">
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>
                        Language: <strong style={{ color: 'var(--primary)' }}>{codeTab.toUpperCase()}</strong>
                      </span>
                    </div>
                  </div>
                )}

                {/* ── WHITEBOARD TAB ── */}
                {activeTab === 'whiteboard' && (
                  <div className="whiteboard-wrap">
                    <div className="whiteboard-toolbar">
                      <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontWeight: 600 }}>Draw:</span>
                      {/* Color palette */}
                      {['#6366F1', '#22C55E', '#EF4444', '#F59E0B', '#06B6D4', '#ffffff'].map(col => (
                        <button
                          key={col}
                          onClick={() => setDrawColor(col)}
                          type="button"
                          title={col}
                          style={{
                            width: 22, height: 22, borderRadius: '50%', cursor: 'pointer',
                            background: col,
                            border: drawColor === col ? '2px solid white' : '2px solid transparent',
                            outline: drawColor === col ? '1px solid rgba(255,255,255,0.4)' : 'none',
                            transition: 'all 0.2s',
                          }}
                        />
                      ))}
                      <span style={{ marginLeft: 8, fontSize: '0.8rem', color: 'var(--text-muted)' }}>Size:</span>
                      {[2, 4, 8].map(sz => (
                        <button
                          key={sz}
                          onClick={() => setDrawSize(sz)}
                          type="button"
                          style={{
                            width: sz + 14, height: sz + 14, borderRadius: '50%',
                            cursor: 'pointer',
                            background: drawSize === sz ? 'var(--primary)' : 'rgba(255,255,255,0.1)',
                            border: 'none', transition: 'all 0.2s',
                          }}
                        />
                      ))}
                      <button
                        onClick={clearCanvas}
                        type="button"
                        id="whiteboard-clear"
                        style={{
                          marginLeft: 'auto', padding: '4px 12px',
                          borderRadius: 6, fontSize: '0.8rem', fontWeight: 600,
                          cursor: 'pointer', background: 'rgba(239,68,68,0.1)',
                          border: '1px solid rgba(239,68,68,0.3)',
                          color: 'var(--danger)',
                          display: 'inline-flex', alignItems: 'center', gap: 4
                        }}
                      >
                        <FaTrash /> Clear
                      </button>
                    </div>
                    <canvas
                      ref={canvasRef}
                      className="whiteboard-canvas"
                      width={620}
                      height={280}
                      onMouseDown={handleCanvasMouseDown}
                      onMouseMove={handleCanvasMouseMove}
                      onMouseUp={handleCanvasMouseUp}
                      onMouseLeave={handleCanvasMouseUp}
                      id="whiteboard-canvas"
                    />
                  </div>
                )}
              </div>
 
              {/* Action Buttons */}
              <div className="interview-actions">
                <button
                  className={`btn ${isRecording ? 'btn-danger' : 'btn-primary'}`}
                  onClick={activeTab === 'voice' ? toggleRecording : handleSubmit}
                  id="primary-action-btn"
                  type="button"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}
                >
                  {activeTab === 'voice'
                    ? isRecording ? <><FaStopwatch /> Stop Recording</> : <><FaMicrophone /> Record Voice</>
                    : <><FaCheck /> Submit Answer</>}
                </button>
 
                {activeTab !== 'voice' && (
                  <button
                    className="btn btn-secondary"
                    onClick={handleSubmit}
                    id="submit-answer-btn"
                    type="button"
                    style={{ display: activeTab === 'voice' ? 'none' : 'inline-flex', alignItems: 'center', gap: 6 }}
                  >
                    <FaCheck /> Submit
                  </button>
                )}
 
                {activeTab === 'voice' && transcript && (
                  <button
                    className="btn btn-success"
                    onClick={handleSubmit}
                    id="submit-voice-btn"
                    type="button"
                    style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}
                  >
                    <FaCheck /> Submit Answer
                  </button>
                )}
 
                <button
                  className="btn btn-ghost"
                  onClick={handleSkip}
                  id="skip-question-btn"
                  type="button"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}
                >
                  <FaChevronRight /> Skip
                </button>
 
                <button
                  className="btn btn-ghost"
                  onClick={() => setShowHint(v => !v)}
                  id="hint-btn"
                  type="button"
                  style={{ marginLeft: 'auto', display: 'inline-flex', alignItems: 'center', gap: 6 }}
                >
                  <FaLightbulb /> Hint
                </button>
              </div>
 
            </main>
 
            {/* ──────────── RIGHT PANEL ──────────── */}
            <aside className="interview-right">
 
              {/* Tips Card */}
              <div className="tips-card">
                <h4><FaLightbulb style={{ marginRight: 6 }} /> Interview Tips</h4>
                {TIPS.map((tip, i) => (
                  <div className="tip-item" key={i}>
                    <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 20, height: 20 }}>{tip.icon}</span>
                    <span>{tip.text}</span>
                  </div>
                ))}
              </div>
 
              {/* STAR Guide */}
              <div className="star-guide">
                <h4><FaTrophy style={{ marginRight: 6 }} /> STAR Method</h4>
                {STAR_ITEMS.map((item, i) => (
                  <div className="star-item" key={i}>
                    <div className="star-item-label">{item.label}</div>
                    <div className="star-item-desc">{item.desc}</div>
                  </div>
                ))}
              </div>

              {/* Session info */}
              <div style={{
                background: 'var(--card)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius)',
                padding: 16,
              }}>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', marginBottom: 12 }}>
                  Session Info
                </div>
                {[
                  { label: 'Company', value: config.company },
                  { label: 'Role', value: config.role },
                  { label: 'Type', value: config.type },
                  { label: 'Difficulty', value: config.difficulty },
                  { label: 'Answered', value: `${answers.filter(Boolean).length}/${totalQuestions}` },
                ].map((row, i) => (
                  <div key={i} style={{
                    display: 'flex', justifyContent: 'space-between',
                    padding: '6px 0',
                    borderBottom: i < 4 ? '1px solid rgba(255,255,255,0.04)' : 'none',
                    fontSize: '0.85rem',
                  }}>
                    <span style={{ color: 'var(--text-muted)' }}>{row.label}</span>
                    <span style={{ fontWeight: 600 }}>{row.value}</span>
                  </div>
                ))}
              </div>

            </aside>

          </div>
        </div>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
