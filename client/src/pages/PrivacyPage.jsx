import React from 'react';
import { Link } from 'react-router-dom';
import { FaShieldAlt, FaLock, FaEye, FaTrash, FaCookie, FaEnvelope } from 'react-icons/fa';

const sections = [
  { icon: FaShieldAlt, title: 'Information We Collect', content: 'We collect information you provide when creating an account (name, email), interview answers and feedback data, resume content for analysis, and usage analytics to improve our services.' },
  { icon: FaLock, title: 'How We Use Your Data', content: 'Your data is used to provide AI-powered interview coaching, generate personalized feedback, improve our AI models, and communicate with you about our services. We never sell your personal information to third parties.' },
  { icon: FaEye, title: 'Data Storage & Security', content: 'Your interview sessions are encrypted and stored securely on our servers. We implement industry-standard security measures including encryption at rest and in transit, regular security audits, and access controls.' },
  { icon: FaTrash, title: 'Your Rights & Data Deletion', content: 'You have the right to access, correct, or delete your data at any time. You can delete your account and associated data from your account settings, or contact us for assistance.' },
  { icon: FaCookie, title: 'Cookies', content: 'We use essential cookies for authentication and website functionality. Analytics cookies help us improve our platform. You can control cookie preferences through your browser settings.' },
  { icon: FaEnvelope, title: 'Contact Us', content: 'If you have questions about this privacy policy or how we handle your data, please contact us at privacy@interviewace.ai. We respond to all inquiries within 48 hours.' },
];

const PrivacyPage = () => (
  <div className="page-wrapper">
    <div className="bg-grid" aria-hidden="true" />
    <div className="bg-blobs" aria-hidden="true">
      <div className="bg-blob bg-blob-1" />
      <div className="bg-blob bg-blob-2" />
      <div className="bg-blob bg-blob-3" />
    </div>
    <div style={{ padding: '60px 0', position: 'relative', zIndex: 1 }}>
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <div className="hero-badge" style={{ display: 'inline-flex', marginBottom: 16 }}>
            <FaShieldAlt style={{ marginRight: 6 }} /> Privacy
          </div>
          <h1 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 900, marginBottom: 16 }}>
            Privacy <span className="gradient-text">Policy</span>
          </h1>
          <p style={{ color: 'var(--text-muted)', maxWidth: 600, margin: '0 auto' }}>
            Last updated: July 2025. Your privacy is important to us.
          </p>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24, maxWidth: 800, margin: '0 auto' }}>
          {sections.map((s, i) => (
            <div key={i} style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: 28 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                <s.icon style={{ fontSize: '1.2rem', color: 'var(--primary)' }} />
                <h3 style={{ fontWeight: 700, fontSize: '1.1rem' }}>{s.title}</h3>
              </div>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', lineHeight: 1.7 }}>{s.content}</p>
            </div>
          ))}
        </div>
        <div style={{ textAlign: 'center', marginTop: 40 }}>
          <Link to="/terms" style={{ color: 'var(--primary)', fontWeight: 600 }}>View Terms of Service →</Link>
        </div>
      </div>
    </div>
  </div>
);

export default PrivacyPage;