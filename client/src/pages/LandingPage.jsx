import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  FaRocket, FaStar, FaPlay, FaBrain, FaMicrophone,
  FaRobot, FaStopwatch, FaBuilding, FaCode, FaUserTie,
  FaChartLine, FaTrophy, FaBook, FaVideo, FaFileAlt,
  FaQuestionCircle, FaCodeBranch, FaFileSignature,
  FaArrowRight, FaChevronDown, FaEnvelope,
  FaShieldAlt, FaInfinity, FaBolt, FaSignInAlt,
  FaJava, FaLightbulb, FaStar as FaStarSolid,
} from 'react-icons/fa';

/* ═══════════════════════════════════════════════════
   INTERSECTION OBSERVER — scroll-in animations
═══════════════════════════════════════════════════ */
const useScrollAnimation = () => {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -30px 0px' }
    );
    const els = document.querySelectorAll('.anim-fade-up');
    els.forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);
};

/* ═══════════════════════════════════════════════════
   HERO SECTION
═══════════════════════════════════════════════════ */
const HeroSection = () => {
  const handleViewFeatures = (e) => {
    e.preventDefault();
    document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="hero-section">
      {/* Grid background */}
      <div className="bg-grid" aria-hidden="true" />

      <div className="hero-container">
        {/* ── Left Column ── */}
        <div className="hero-content">
          <div className="hero-badge anim-fade-up">
            <FaRocket style={{ fontSize: '0.75rem' }} />
            AI-Powered Interview Coach &bull; Live Now
          </div>

          <h1 className="hero-title anim-fade-up">
            Practice Like a Pro<br />
            <span className="gradient-text">Ace Every Interview</span>
          </h1>

          <p className="hero-subtitle anim-fade-up">
            Harness the power of Groq AI + LLaMA 3 to simulate real interview pressure,
            get instant expert feedback, and build unshakeable confidence—all in one platform.
          </p>

          <div className="hero-ctas anim-fade-up">
            <Link to="/register" className="btn btn-primary btn-lg btn-pulse" id="hero-cta-start">
              <FaPlay style={{ fontSize: '0.8rem' }} /> Start Free Interview
            </Link>
            <a href="#features" className="btn btn-secondary btn-lg" id="hero-cta-features" onClick={handleViewFeatures}>
              <FaStar style={{ fontSize: '0.8rem' }} /> View Features
            </a>
          </div>

          <div className="hero-stats anim-fade-up">
            {[
              { value: '50K+', label: 'Users Trained' },
              { value: '95%',  label: 'Success Rate' },
              { value: '500+', label: 'Questions' },
            ].map(s => (
              <div key={s.label} className="hero-stat-item">
                <span className="hero-stat-value">{s.value}</span>
                <span className="hero-stat-label">{s.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ── Right Column — AI Avatar ── */}
        <div className="hero-visual anim-fade-up">
          <div className="hero-avatar-wrap">
            {/* Central avatar orb */}
            <div className="hero-avatar">
              <div className="hero-avatar-inner">
                <FaRobot style={{ fontSize: '3rem', color: '#fff' }} />
              </div>
              <div className="hero-avatar-ring hero-avatar-ring-1" />
              <div className="hero-avatar-ring hero-avatar-ring-2" />
              <div className="hero-avatar-ring hero-avatar-ring-3" />
            </div>

            {/* Floating stat cards */}
            <div className="float-card float-card-tl">
              <div className="float-card-icon" style={{ background: 'rgba(34,197,94,0.15)', color: '#22C55E' }}>
                <FaBrain />
              </div>
              <div>
                <div className="float-card-value">92%</div>
                <div className="float-card-label">Confidence</div>
              </div>
            </div>

            <div className="float-card float-card-tr">
              <div className="float-card-icon" style={{ background: 'rgba(99,102,241,0.15)', color: '#6366F1' }}>
                <FaJava />
              </div>
              <div>
                <div className="float-card-value">Expert</div>
                <div className="float-card-label">Java Skills</div>
              </div>
            </div>

            <div className="float-card float-card-bl">
              <div className="float-card-icon" style={{ background: 'rgba(245,158,11,0.15)', color: '#F59E0B' }}>
                <FaStarSolid />
              </div>
              <div>
                <div className="float-card-value" style={{ color: '#F59E0B' }}>★★★★★</div>
                <div className="float-card-label">Rating</div>
              </div>
            </div>

            <div className="float-card float-card-br">
              <div className="float-card-icon" style={{ background: 'rgba(6,182,212,0.15)', color: '#06B6D4' }}>
                <FaLightbulb />
              </div>
              <div>
                <div className="float-card-value" style={{ color: '#06B6D4' }}>Top 5%</div>
                <div className="float-card-label">Problem Solving</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="hero-scroll-hint">
        <div className="scroll-dot" />
        <span>Scroll to explore</span>
      </div>
    </section>
  );
};

/* ═══════════════════════════════════════════════════
   FEATURES SECTION
═══════════════════════════════════════════════════ */
const features = [
  { Icon: FaMicrophone, title: 'Speech Recognition', desc: 'Real-time voice-to-text for natural interview practice. Speak your answers naturally and get instant transcription.', color: '#6366F1' },
  { Icon: FaRobot,      title: 'Groq AI Feedback',   desc: 'Intelligent analysis of your answers with LLaMA 3 AI. Receive detailed, expert-level feedback in seconds.',     color: '#8B5CF6' },
  { Icon: FaStopwatch,  title: 'Smart Timer',         desc: 'Timed questions with pacing feedback to improve response speed and delivery under pressure.',                    color: '#06B6D4' },
  { Icon: FaBuilding,   title: 'Company Questions',   desc: 'Curated question banks for Google, Amazon, Microsoft, Meta, and Netflix—straight from real interviews.',         color: '#22C55E' },
  { Icon: FaCode,       title: 'Coding Round',        desc: 'Built-in code editor with HTML, CSS, JS support. Practice live coding challenges with syntax highlighting.',     color: '#F59E0B' },
  { Icon: FaUserTie,    title: 'Behavioral Round',    desc: 'STAR method guide for behavioral interview mastery. Craft compelling stories that resonate with interviewers.',  color: '#EF4444' },
  { Icon: FaChartLine,  title: 'Progress Tracking',   desc: 'Radar charts, performance analytics, and trend graphs to visualize your growth over every session.',            color: '#EC4899' },
  { Icon: FaTrophy,     title: 'Achievements',        desc: 'Unlock badges, level up your profile, and compete on the local leaderboard to stay motivated.',                 color: '#F97316' },
];

const FeaturesSection = () => (
  <section id="features" className="section features-section">
    <div className="section-container">
      <div className="section-header anim-fade-up">
        <div className="section-badge"><FaStar style={{ marginRight: 6 }} /> Platform Features</div>
        <h2 className="section-title">Everything You Need to <span className="gradient-text">Land the Job</span></h2>
        <p className="section-sub">
          A complete AI-powered interview training suite, packed with every tool you need
          to outperform the competition.
        </p>
      </div>

      <div className="features-grid">
        {features.map((f, i) => {
          const { Icon } = f;
          return (
            <div
              key={f.title}
              className="feature-card anim-fade-up"
              style={{ animationDelay: `${i * 0.07}s` }}
            >
              <div
                className="feature-icon-wrap"
                style={{ background: `${f.color}18`, boxShadow: `0 0 20px ${f.color}22` }}
              >
                <span className="feature-icon">
                  <Icon style={{ color: f.color, fontSize: '1.4rem' }} />
                </span>
              </div>
              <h3 className="feature-title">{f.title}</h3>
              <p className="feature-desc">{f.desc}</p>
              <div className="feature-glow" style={{ background: `radial-gradient(circle at 50% 100%, ${f.color}20, transparent 70%)` }} />
            </div>
          );
        })}
      </div>
    </div>
  </section>
);

/* ═══════════════════════════════════════════════════
   RESOURCES SECTION — Accordion Grid
═══════════════════════════════════════════════════ */
const resourceGroups = [
  {
    Icon: FaVideo,
    title: 'Video Tutorials',
    items: [
      'How to Structure Your Answers (STAR Method)',
      'Cracking System Design Interviews',
      'Mastering Behavioral Questions at FAANG',
      'Live Mock Interview — Software Engineer Role',
      'Data Structures Deep Dive: Trees & Graphs',
    ],
  },
  {
    Icon: FaFileAlt,
    title: 'Interview Articles',
    items: [
      'The Ultimate Guide to Technical Interviews',
      '10 Most Asked System Design Questions (2025)',
      'How to Negotiate Salary After an Offer',
      'Remote Interview Tips That Actually Work',
      'Overcoming Interview Anxiety — Expert Guide',
    ],
  },
  {
    Icon: FaQuestionCircle,
    title: 'Common Questions',
    items: [
      'Tell me about yourself — Perfect Answer Framework',
      'Greatest weakness — Honest & Impressive Answers',
      'Why do you want to work here?',
      '5-year plan questions — Strategy & Examples',
      'Situational & hypothetical question tactics',
    ],
  },
  {
    Icon: FaCodeBranch,
    title: 'DSA Topics',
    items: [
      'Arrays & Strings — Pattern Recognition',
      'Trees & Binary Search — Interview Patterns',
      'Graph Traversal: BFS, DFS & Dijkstra',
      'Dynamic Programming — Memoization Tactics',
      'Sorting Algorithms — When & Why to Use Each',
    ],
  },
  {
    Icon: FaFileSignature,
    title: 'Resume Tips',
    items: [
      'ATS Optimization — Beat the Applicant Filters',
      'Power Verbs That Catch Recruiter Attention',
      'Quantifying Achievements on Your Resume',
      'Tech Resume vs. Non-tech Resume Differences',
      'LinkedIn Profile Tips to Get 10× More Visibility',
    ],
  },
];

const ResourceAccordion = ({ Icon, title, items }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className={`resource-accordion ${open ? 'open' : ''}`}>
      <button
        className="resource-accordion-header"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
      >
        <span className="resource-acc-icon">
          <Icon style={{ color: 'var(--primary)' }} />
        </span>
        <span className="resource-acc-title">{title}</span>
        <FaChevronDown className={`resource-acc-arrow ${open ? 'rotated' : ''}`} />
      </button>
      <div className="resource-accordion-body" style={{ maxHeight: open ? '400px' : '0' }}>
        <ul className="resource-list">
          {items.map((item, i) => (
            <li key={i} className="resource-list-item">
              <FaArrowRight className="resource-list-icon" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

const ResourcesSection = () => (
  <section id="resources" className="section resources-section">
    <div className="section-container">
      <div className="section-header anim-fade-up">
        <div className="section-badge"><FaBook style={{ marginRight: 6 }} /> Learning Hub</div>
        <h2 className="section-title">Interview <span className="gradient-text">Resources</span></h2>
        <p className="section-sub">
          Curated guides, videos, and study materials to complement your AI practice sessions
          and sharpen every dimension of your interview skills.
        </p>
      </div>

      <div className="resources-grid">
        {resourceGroups.map((group, i) => (
          <div
            key={group.title}
            className="anim-fade-up"
            style={{ animationDelay: `${i * 0.08}s` }}
          >
            <ResourceAccordion Icon={group.Icon} title={group.title} items={group.items} />
          </div>
        ))}
      </div>
    </div>
  </section>
);

/* ═══════════════════════════════════════════════════
   FAQ SECTION
═══════════════════════════════════════════════════ */
const faqs = [
  {
    q: 'How does the AI feedback work?',
    a: "InterviewAce uses Groq's ultra-fast inference engine powered by LLaMA 3 to analyze your spoken or typed answers in real time. The AI evaluates content relevance, structure, use of the STAR method, clarity, and depth—then delivers actionable, expert-level feedback within seconds.",
  },
  {
    q: 'Is speech recognition accurate enough for interviews?',
    a: 'Yes! Our speech recognition engine achieves 95%+ accuracy on technical terminology. It handles software engineering jargon, company names, and algorithmic terms with high precision. You can also edit the transcript before submitting for AI analysis.',
  },
  {
    q: 'Can I practice offline?',
    a: 'The core AI feedback and speech features require an internet connection. However, you can browse your saved session history, review previous feedback, and access downloaded resources offline.',
  },
  {
    q: "What companies' questions are included?",
    a: 'Our curated question bank covers Google, Amazon, Microsoft, Meta, Netflix, Apple, Uber, LinkedIn, Stripe, and 50+ other top tech companies—updated quarterly with fresh questions sourced from recent interview reports.',
  },
  {
    q: 'Is InterviewAce free to use?',
    a: 'Yes, creating an account and starting practice sessions is completely free. You get unlimited access to our core feature set. Premium features like advanced analytics, company-specific deep dives, and unlimited AI feedback credits are available on our Pro plan.',
  },
  {
    q: 'How are my answers stored and is my data private?',
    a: 'Your sessions are encrypted and stored securely. We never share your personal data or interview answers with third parties. You can delete your data at any time from your account settings.',
  },
  {
    q: 'Can I use InterviewAce for non-technical interviews?',
    a: "Absolutely! While we're optimized for software engineering roles, our behavioral rounds, STAR method guide, and AI feedback work great for product management, data science, design, and general management interviews.",
  },
  {
    q: 'How does the coding round work?',
    a: "Our built-in code editor supports HTML, CSS, and JavaScript with syntax highlighting and live preview. You'll receive algorithm problems matching real interview difficulty, with automated test cases and AI code review after each submission.",
  },
];

const FAQItem = ({ q, a, index }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className={`faq-item ${open ? 'open' : ''}`} style={{ animationDelay: `${index * 0.06}s` }}>
      <button
        className="faq-question"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        id={`faq-btn-${index}`}
      >
        <span className="faq-q-text">{q}</span>
        <div className="faq-chevron">
          <FaChevronDown style={{ transition: 'transform 0.3s ease', transform: open ? 'rotate(180deg)' : 'rotate(0deg)' }} />
        </div>
      </button>
      <div className="faq-answer" style={{ maxHeight: open ? '300px' : '0' }}>
        <p>{a}</p>
      </div>
    </div>
  );
};

const FAQSection = () => (
  <section id="faq" className="section faq-section">
    <div className="section-container">
      <div className="section-header anim-fade-up">
        <div className="section-badge"><FaQuestionCircle style={{ marginRight: 6 }} /> Got Questions?</div>
        <h2 className="section-title">Frequently Asked <span className="gradient-text">Questions</span></h2>
        <p className="section-sub">
          Everything you need to know about InterviewAce. Can't find an answer? Reach out to our support team.
        </p>
      </div>

      <div className="faq-list anim-fade-up">
        {faqs.map((item, i) => (
          <FAQItem key={i} index={i} q={item.q} a={item.a} />
        ))}
      </div>

      <div className="faq-cta anim-fade-up">
        <p>Still have questions?</p>
        <a href="mailto:support@interviewace.ai" className="btn btn-secondary">
          <FaEnvelope /> Contact Support
        </a>
      </div>
    </div>
  </section>
);

/* ═══════════════════════════════════════════════════
   LANDING PAGE — root component
═══════════════════════════════════════════════════ */
const LandingPage = () => {
  useScrollAnimation();

  return (
    <main className="landing-page">
      <HeroSection />
      <FeaturesSection />
      <ResourcesSection />
      <FAQSection />

      {/* ── Footer CTA Banner ── */}
      <section className="landing-footer-cta">
        <div className="section-container">
          <div className="footer-cta-card anim-fade-up">
            <div className="footer-cta-glow" />
            <h2 className="footer-cta-title">
              Ready to <span className="gradient-text">Ace Your Interview?</span>
            </h2>
            <p className="footer-cta-sub">
              Join 50,000+ professionals who've mastered their interviews with AI coaching.
              Start free, no credit card required.
            </p>
            <div className="footer-cta-actions">
              <Link to="/register" className="btn btn-primary btn-lg btn-pulse" id="footer-cta-btn">
                <FaRocket /> Get Started Free
              </Link>
              <Link to="/login" className="btn btn-ghost btn-lg">
                <FaSignInAlt /> Sign In
              </Link>
            </div>
            <div className="footer-cta-trust">
              <span><FaShieldAlt /> No credit card</span>
              <span><FaInfinity /> Free forever tier</span>
              <span><FaBolt /> Instant access</span>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default LandingPage;
