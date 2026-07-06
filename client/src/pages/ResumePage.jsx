import { FaCheckCircle, FaExclamationTriangle, FaTimesCircle, FaCog, FaFolderOpen, FaFileAlt, FaBullseye, FaKey, FaBolt, FaRocket, FaRobot, FaWrench, FaClipboardList, FaSyncAlt, FaLightbulb } from 'react-icons/fa';
import React, { useState, useCallback } from 'react';
import axios from 'axios';
import * as pdfjsLib from 'pdfjs-dist';

// Configure PDF.js worker from local copy (avoids CDN version mismatches)
pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';

/* ── ATS Ring SVG ────────────────────────────────────── */
const ATSRing = ({ score }) => {
  const r = 58;
  const circ = 2 * Math.PI * r;
  const offset = circ - (score / 100) * circ;

  const color =
    score >= 80 ? '#22C55E'
    : score >= 60 ? '#F59E0B'
    : '#EF4444';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
      <svg width="150" height="150" viewBox="0 0 150 150">
        <defs>
          <linearGradient id="atsGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#6366F1" />
            <stop offset="50%" stopColor="#8B5CF6" />
            <stop offset="100%" stopColor="#06B6D4" />
          </linearGradient>
        </defs>
        <circle cx="75" cy="75" r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="10" />
        <circle
          cx="75" cy="75" r={r}
          fill="none"
          stroke="url(#atsGrad)"
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={circ}
          strokeDashoffset={offset}
          transform="rotate(-90 75 75)"
          style={{ transition: 'stroke-dashoffset 1.4s cubic-bezier(0.4,0,0.2,1)', filter: `drop-shadow(0 0 8px ${color}60)` }}
        />
        <text x="75" y="70" textAnchor="middle" fill="white" fontSize="26" fontWeight="900" fontFamily="Poppins, sans-serif">
          {score}
        </text>
        <text x="75" y="88" textAnchor="middle" fill="rgba(148,163,184,0.8)" fontSize="10" fontFamily="Poppins, sans-serif">
          ATS SCORE
        </text>
      </svg>
      <span
        style={{
          background: score >= 80 ? 'rgba(34,197,94,0.15)' : score >= 60 ? 'rgba(245,158,11,0.15)' : 'rgba(239,68,68,0.15)',
          border: `1px solid ${score >= 80 ? 'rgba(34,197,94,0.35)' : score >= 60 ? 'rgba(245,158,11,0.35)' : 'rgba(239,68,68,0.35)'}`,
          color: score >= 80 ? 'var(--success)' : score >= 60 ? 'var(--warning)' : 'var(--danger)',
          borderRadius: 100,
          padding: '4px 14px',
          fontSize: '0.82rem',
          fontWeight: 700,
        }}
      >
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
          {score >= 80 ? <><FaCheckCircle style={{ color: 'var(--success)' }} /> ATS Friendly</> :
           score >= 60 ? <><FaExclamationTriangle style={{ color: 'var(--warning)' }} /> Needs Work</> :
           <><FaTimesCircle style={{ color: 'var(--danger)' }} /> Poor Match</>}
        </span>
      </span>
    </div>
  );
};

/* ── Upload Zone ─────────────────────────────────────── */
const UploadZone = ({ onFile, dragOver, onDragOver, onDragLeave, onDrop, fileName, loading }) => (
  <div
    onDragOver={onDragOver}
    onDragLeave={onDragLeave}
    onDrop={onDrop}
    style={{
      border: `2px dashed ${dragOver ? 'var(--primary)' : 'rgba(99,102,241,0.3)'}`,
      borderRadius: 'var(--radius)',
      padding: '48px 32px',
      textAlign: 'center',
      background: dragOver
        ? 'rgba(99,102,241,0.08)'
        : 'rgba(24,24,27,0.4)',
      transition: 'all 0.25s ease',
      cursor: 'pointer',
      position: 'relative',
    }}
    onClick={() => document.getElementById('resume-file-input').click()}
  >
    <input
      id="resume-file-input"
      type="file"
      accept=".pdf,.doc,.docx,.txt"
      style={{ display: 'none' }}
      onChange={(e) => e.target.files?.[0] && onFile(e.target.files[0])}
    />
    <div style={{ fontSize: '3.5rem', marginBottom: 16, filter: dragOver ? 'drop-shadow(0 0 10px rgba(99,102,241,0.6))' : 'none', transition: 'filter 0.25s' }}>
      {loading ? <FaCog style={{ fontSize: '3.5rem', animation: 'spin 0.8s linear infinite' }} /> :
       dragOver ? <FaFolderOpen style={{ fontSize: '3.5rem', filter: 'drop-shadow(0 0 10px rgba(99,102,241,0.6))' }} /> :
       <FaFileAlt style={{ fontSize: '3.5rem' }} />}
    </div>
    {loading ? (
      <>
        <div style={{ fontWeight: 700, fontSize: '1rem', marginBottom: 8 }}>Analyzing Resume…</div>
        <div style={{ display: 'flex', gap: 6, justifyContent: 'center', marginTop: 12 }}>
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              style={{
                width: 8, height: 8, borderRadius: '50%', background: 'var(--primary)',
                animation: 'dotBounce 1.2s ease-in-out infinite',
                animationDelay: `${i * 0.2}s`,
              }}
            />
          ))}
        </div>
      </>
    ) : fileName ? (
      <>
        <div style={{ fontWeight: 700, fontSize: '1rem', marginBottom: 4, color: 'var(--success)' }}><FaCheckCircle style={{ marginRight: 6 }} /> {fileName}</div>
        <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Click or drag to replace</div>
      </>
    ) : (
      <>
        <div style={{ fontWeight: 700, fontSize: '1rem', marginBottom: 8 }}>
          {dragOver ? 'Drop your resume here!' : 'Drag & Drop your Resume'}
        </div>
        <div style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginBottom: 20 }}>
          or click to browse files
        </div>
        <span
          style={{
            background: 'rgba(99,102,241,0.12)',
            border: '1px solid rgba(99,102,241,0.25)',
            borderRadius: 100,
            padding: '6px 18px',
            fontSize: '0.82rem',
            color: 'var(--primary)',
            fontWeight: 600,
          }}
        >
          PDF, DOC, DOCX, TXT supported
        </span>
      </>
    )}
  </div>
);

/* ── Analysis Tips ─────────────────────────────────── */
const TIPS = [
  { icon: <FaBullseye />, title: 'ATS Optimization', desc: 'Our AI scans your resume against ATS systems used by top companies.' },
  { icon: <FaKey />, title: 'Keyword Analysis', desc: 'We identify critical keywords present and missing from your resume.' },
  { icon: <FaBolt />, title: 'Instant Feedback', desc: 'Receive actionable improvements in under 30 seconds.' },
  { icon: <FaRocket />, title: 'Skill Gap Detection', desc: 'Find out which skills to add to boost your interview chances.' },
];

/* ── Main Component ─────────────────────────────────── */
const ResumePage = () => {
  const [dragOver, setDragOver] = useState(false);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [analysis, setAnalysis] = useState(null);

  /* ── PDF Text Extraction ── */
  const extractPdfText = async (pdfFile) => {
    const arrayBuffer = await pdfFile.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    let fullText = '';
    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
      const page = await pdf.getPage(pageNum);
      const content = await page.getTextContent();
      const pageText = content.items.map((item) => item.str).join(' ');
      fullText += pageText + '\n';
    }
    return fullText.trim();
  };

  /* ── Text Extraction (generic) ── */
  const extractText = async (selectedFile) => {
    const ext = selectedFile.name.split('.').pop().toLowerCase();
    if (ext === 'pdf') {
      return extractPdfText(selectedFile);
    }
    // For .doc/.docx/.txt — read as plain text (basic fallback)
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target.result || '');
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsText(selectedFile);
    });
  };

  const validateResumeFile = (selectedFile) => {
    const ext = selectedFile.name.split('.').pop().toLowerCase();
    const allowedExts = ['pdf', 'doc', 'docx', 'txt'];
    if (!allowedExts.includes(ext)) {
      return `Unsupported file type ".${ext}". Please upload a PDF, DOC, DOCX, or TXT file.`;
    }
    if (selectedFile.size > 5 * 1024 * 1024) {
      return 'File is too large. Maximum size is 5 MB.';
    }
    return null;
  };

  /* ── Analyze ── */
  const analyzeResume = useCallback(async (selectedFile) => {
    if (!selectedFile) return;
    const validationError = validateResumeFile(selectedFile);
    if (validationError) {
      setError(validationError);
      return;
    }
    setError('');
    setLoading(true);
    setAnalysis(null);

    try {
      const text = await extractText(selectedFile);

      // Content-based resume validation
      const resumeIndicators = ['experience', 'education', 'skill', 'project', 'work history', 'certification', 'summary', 'objective', 'employment', 'professional', 'qualification', 'achievement', 'technolog', 'languag'];
      const textLower = text.toLowerCase();
      const matchCount = resumeIndicators.filter(ind => textLower.includes(ind)).length;
      if (matchCount < 3) {
        setError('The uploaded file does not appear to be a resume. Please upload a valid resume document containing work experience, education, or skills.');
        setLoading(false);
        return;
      }

      if (!text || text.length < 50) {
        throw new Error('Could not extract meaningful text from the file. Please try a different format.');
      }

      const res = await axios.post('/api/resume/analyze', { resumeText: text, fileName: selectedFile.name });
      setAnalysis(res.data.analysis || res.data);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Analysis failed. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  const handleFile = useCallback((selectedFile) => {
    setFile(selectedFile);
    analyzeResume(selectedFile);
  }, [analyzeResume]);

  const handleDragOver = useCallback((e) => { e.preventDefault(); setDragOver(true); }, []);
  const handleDragLeave = useCallback(() => setDragOver(false), []);
  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setDragOver(false);
    const dropped = e.dataTransfer.files?.[0];
    if (dropped) handleFile(dropped);
  }, [handleFile]);

  /* ── Derived analysis fields ── */
  const atsScore = analysis?.atsScore ?? analysis?.score ?? 0;
  const presentSkills = analysis?.presentSkills || analysis?.skillsFound || [];
  const missingSkills = analysis?.missingSkills || analysis?.skillsMissing || [];
  const keywords = analysis?.keywords || [];
  const improvements = analysis?.improvements || analysis?.suggestions || [];
  const summary = analysis?.summary || analysis?.overview || '';

  return (
    <div className="page-wrapper resume-page">
      <style>{`
        @keyframes dotBounce { 0%,80%,100%{transform:scale(0.6);opacity:0.4} 40%{transform:scale(1);opacity:1} }
        .resume-page { padding-bottom: 80px; }
        .resume-layout { display: grid; grid-template-columns: 1fr 1fr; gap: 32px; align-items: start; }
        @media(max-width: 860px) { .resume-layout { grid-template-columns: 1fr; } }
        .skill-tag { display: inline-flex; align-items: center; gap: 4px; padding: 5px 12px; border-radius: 100px; font-size: 0.82rem; font-weight: 600; margin: 4px; }
        .skill-present { background: rgba(34,197,94,0.12); border: 1px solid rgba(34,197,94,0.3); color: var(--success); }
        .skill-missing { background: rgba(239,68,68,0.12); border: 1px solid rgba(239,68,68,0.3); color: var(--danger); }
        .keyword-cloud-item { display: inline-block; padding: 4px 12px; border-radius: 100px; font-size: 0.8rem; font-weight: 600; margin: 3px; background: rgba(6,182,212,0.1); border: 1px solid rgba(6,182,212,0.25); color: var(--accent); transition: transform 0.2s; cursor: default; }
        .keyword-cloud-item:hover { transform: scale(1.05); }
        .improvement-item { display: flex; align-items: flex-start; gap: 10px; padding: 12px 0; border-bottom: 1px solid rgba(255,255,255,0.05); }
        .improvement-item:last-child { border-bottom: none; }
        .result-section { background: var(--card); border: 1px solid var(--border); border-radius: var(--radius); padding: 24px; margin-bottom: 20px; width: 100%; }
        .result-section-title { font-size: 0.85rem; font-weight: 700; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.07em; margin-bottom: 16px; display: flex; align-items: center; gap: 8px; }
        .resume-results-container { width: 100%; }
        .resume-results-container .result-section { text-align: left; }
      `}</style>

      <div className="container" style={{ paddingTop: 40 }}>
        {/* Page Header */}
        <div style={{ marginBottom: 40 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
            <div style={{ width: 44, height: 44, background: 'var(--gradient)', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.3rem', boxShadow: 'var(--glow-primary)' }}>
              <FaFileAlt />
            </div>
            <h1 style={{ fontSize: 'clamp(1.6rem, 3vw, 2.2rem)', fontWeight: 900, background: 'var(--gradient)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              Resume Analyzer
            </h1>
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', maxWidth: 600 }}>
            Upload your resume and get instant AI-powered feedback on ATS compatibility, skill gaps, keyword optimization, and actionable improvements.
          </p>
        </div>

        <div className="resume-layout">
          {/* ── Left Column: Upload ── */}
          <div>
            {/* Upload Zone */}
            <UploadZone
              onFile={handleFile}
              dragOver={dragOver}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              fileName={file?.name}
              loading={loading}
            />

            {/* Error */}
            {error && (
              <div
                style={{
                  background: 'rgba(239,68,68,0.08)',
                  border: '1px solid rgba(239,68,68,0.25)',
                  borderRadius: 10,
                  padding: '12px 16px',
                  marginTop: 12,
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 10,
                  color: 'var(--danger)',
                  fontSize: '0.9rem',
                }}
              >
                <FaExclamationTriangle style={{ flexShrink: 0 }} />
                <span>{error}</span>
              </div>
            )}

            {/* What We Analyze */}
            <div style={{ marginTop: 32 }}>
              <h3 style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 16 }}>
                What We Analyze
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {TIPS.map((tip) => (
                  <div
                    key={tip.title}
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: 14,
                      background: 'rgba(24,24,27,0.6)',
                      border: '1px solid rgba(255,255,255,0.05)',
                      borderRadius: 12,
                      padding: '14px 16px',
                    }}
                  >
                    <span style={{ fontSize: '1.4rem', flexShrink: 0, color: 'var(--primary)' }}>{tip.icon}</span>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '0.9rem', marginBottom: 3 }}>{tip.title}</div>
                      <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>{tip.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ── Right Column: Results ── */}
          <div className="resume-results-container">
            {!analysis && !loading && (
              <div
                style={{
                  background: 'var(--card)',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius)',
                  padding: '60px 32px',
                  textAlign: 'center',
                }}
              >
                <FaRobot style={{ fontSize: '4rem', marginBottom: 20 }} />
                <h3 style={{ fontWeight: 700, fontSize: '1.1rem', marginBottom: 10 }}>Ready to Analyze</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                  Upload your resume on the left to receive detailed AI feedback and ATS compatibility scoring.
                </p>
              </div>
            )}

            {loading && (
              <div
                style={{
                  background: 'var(--card)',
                  border: '1px solid rgba(99,102,241,0.3)',
                  borderRadius: 'var(--radius)',
                  padding: '60px 32px',
                  textAlign: 'center',
                }}
              >
                <div style={{ width: 60, height: 60, border: '4px solid rgba(99,102,241,0.15)', borderTopColor: 'var(--primary)', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 24px' }} />
                <h3 style={{ fontWeight: 700, fontSize: '1.1rem', marginBottom: 10 }}>Analyzing with Groq AI…</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                  Parsing resume content, checking ATS compatibility, and generating personalized feedback.
                </p>
                <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
              </div>
            )}

            {analysis && (
              <div>
                {/* ATS Score */}
                <div className="result-section" style={{ borderColor: atsScore >= 80 ? 'rgba(34,197,94,0.3)' : atsScore >= 60 ? 'rgba(245,158,11,0.3)' : 'rgba(239,68,68,0.3)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 20 }}>
                    <div>
                      <div className="result-section-title">ATS Compatibility</div>
                      <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', maxWidth: 280 }}>
                        {atsScore >= 80
                          ? 'Your resume is well-optimized for Applicant Tracking Systems.'
                          : atsScore >= 60
                          ? 'Your resume passes most ATS filters but has room for improvement.'
                          : 'Your resume may be filtered out by ATS systems. Follow the suggestions below.'}
                      </p>
                    </div>
                    <ATSRing score={atsScore} />
                  </div>
                </div>

                {/* Skills */}
                {(presentSkills.length > 0 || missingSkills.length > 0) && (
                  <div className="result-section">
                    <div className="result-section-title"><FaWrench style={{ marginRight: 8 }} /> Skills Analysis</div>
                    {presentSkills.length > 0 && (
                      <div style={{ marginBottom: 12 }}>
                        <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--success)', marginBottom: 8 }}>Found ({presentSkills.length})</div>
                        <div>
                          {presentSkills.map((skill) => (
                            <span key={skill} className="skill-tag skill-present">✓ {skill}</span>
                          ))}
                        </div>
                      </div>
                    )}
                    {missingSkills.length > 0 && (
                      <div>
                        <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--danger)', marginBottom: 8 }}>Missing ({missingSkills.length})</div>
                        <div>
                          {missingSkills.map((skill) => (
                            <span key={skill} className="skill-tag skill-missing">✗ {skill}</span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Keywords */}
                {keywords.length > 0 && (
                  <div className="result-section">
                    <div className="result-section-title"><FaKey style={{ marginRight: 8 }} /> Keyword Cloud</div>
                    <div>
                      {keywords.map((kw) => (
                        <span key={kw} className="keyword-cloud-item">{kw}</span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Improvements */}
                {improvements.length > 0 && (
                  <div className="result-section">
                    <div className="result-section-title"><FaLightbulb style={{ marginRight: 8 }} /> Recommended Improvements</div>
                    <div>
                      {improvements.map((imp, i) => (
                        <div key={i} className="improvement-item">
                          <span
                            style={{
                              background: 'rgba(99,102,241,0.15)',
                              color: 'var(--primary)',
                              width: 22, height: 22,
                              borderRadius: '50%',
                              display: 'flex', alignItems: 'center', justifyContent: 'center',
                              fontSize: '0.72rem',
                              fontWeight: 800,
                              flexShrink: 0,
                              marginTop: 1,
                            }}
                          >
                            {i + 1}
                          </span>
                          <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
                            {typeof imp === 'string' ? imp : imp.text || imp.suggestion || JSON.stringify(imp)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Summary */}
                {summary && (
                  <div className="result-section" style={{ borderColor: 'rgba(6,182,212,0.2)' }}>
                    <div className="result-section-title" style={{ color: 'var(--accent)' }}><FaClipboardList style={{ marginRight: 8 }} /> AI Summary</div>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', lineHeight: 1.75 }}>{summary}</p>
                  </div>
                )}

                {/* Re-analyze button */}
                <button
                  onClick={() => { setAnalysis(null); setFile(null); setError(''); }}
                  className="btn btn-secondary"
                  style={{ width: '100%', justifyContent: 'center', marginTop: 4 }}
                >
                  <FaSyncAlt style={{ marginRight: 8 }} /> Analyze Another Resume
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumePage;
