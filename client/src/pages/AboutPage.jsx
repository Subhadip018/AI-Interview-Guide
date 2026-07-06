import React from 'react';
import { Link } from 'react-router-dom';
import { FaBrain, FaRocket, FaUsers, FaShieldAlt, FaBullseye, FaCode, FaFlask, FaBriefcase } from 'react-icons/fa';

const AboutPage = () => {
  const stats = [
    { icon: FaRocket, value: '50K+', label: 'Users Trained' },
    { icon: FaBrain, value: '10K+', label: 'AI Interviews' },
    { icon: FaUsers, value: '95%', label: 'Success Rate' },
    { icon: FaShieldAlt, value: '500+', label: 'Companies Covered' },
  ];

  const values = [
    { icon: FaBullseye, title: 'Our Mission', desc: 'To democratize interview preparation by providing AI-powered coaching that simulates real-world interview pressure and delivers personalized feedback.' },
    { icon: FaBrain, title: 'AI-Powered', desc: 'Leveraging cutting-edge Groq AI with LLaMA 3 to analyze responses, provide expert feedback, and help you improve with every practice session.' },
    { icon: FaUsers, title: 'For Everyone', desc: 'Whether you are a fresh graduate or a seasoned professional, InterviewAce adapts to your skill level and target role.' },
  ];

  const team = [
    { name: 'Sarah Chen', role: 'CEO & Founder', icon: FaCode },
    { name: 'Marcus Johnson', role: 'CTO', icon: FaCode },
    { name: 'Priya Patel', role: 'Head of AI', icon: FaFlask },
    { name: 'Alex Rodriguez', role: 'Product Lead', icon: FaBriefcase },
  ];

  return (
    <div className="page-wrapper">
      <div className="bg-grid" aria-hidden="true" />
      <div className="bg-blobs" aria-hidden="true">
        <div className="bg-blob bg-blob-1" />
        <div className="bg-blob bg-blob-2" />
        <div className="bg-blob bg-blob-3" />
      </div>

      <div style={{ padding: '60px 0', position: 'relative', zIndex: 1 }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 60 }}>
            <div className="hero-badge" style={{ display: 'inline-flex', marginBottom: 16 }}>
              About Us
            </div>
            <h1 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 900, marginBottom: 16 }}>
              Revolutionizing <span className="gradient-text">Interview Preparation</span>
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem', maxWidth: 600, margin: '0 auto', lineHeight: 1.7 }}>
              We combine cutting-edge AI technology with real interview insights to help job seekers ace their interviews with confidence.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 24, marginBottom: 80 }}>
            {stats.map((s, i) => (
              <div key={i} style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: 28, textAlign: 'center' }}>
                <s.icon style={{ fontSize: '2rem', color: 'var(--primary)', marginBottom: 12 }} />
                <div style={{ fontSize: '1.8rem', fontWeight: 900, background: 'var(--gradient)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>{s.value}</div>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{s.label}</div>
              </div>
            ))}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 32, marginBottom: 80 }}>
            {values.map((v, i) => (
              <div key={i} style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: 32 }}>
                <div style={{ width: 52, height: 52, borderRadius: 14, background: 'rgba(99,102,241,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
                  <v.icon style={{ fontSize: '1.3rem', color: 'var(--primary)' }} />
                </div>
                <h3 style={{ fontWeight: 700, fontSize: '1.1rem', marginBottom: 8 }}>{v.title}</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.7 }}>{v.desc}</p>
              </div>
            ))}
          </div>

          <div style={{ marginBottom: 60 }}>
            <h2 style={{ fontSize: '1.8rem', fontWeight: 800, textAlign: 'center', marginBottom: 40 }}>
              Meet Our <span className="gradient-text">Team</span>
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 24 }}>
              {team.map((m, i) => (
                <div key={i} style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: 32, textAlign: 'center' }}>
                  <div style={{ fontSize: '2.5rem', marginBottom: 12, color: 'var(--primary)' }}><m.icon /></div>
                  <div style={{ fontWeight: 700, fontSize: '1rem' }}>{m.name}</div>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{m.role}</div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ textAlign: 'center', padding: '48px 0' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: 16 }}>Ready to ace your next interview?</h2>
            <Link to="/register" className="btn btn-primary btn-lg btn-pulse">
              Get Started Free
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;