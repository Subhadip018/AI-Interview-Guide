import React from 'react';
import { Link } from 'react-router-dom';
import { FaFileContract, FaCheckCircle, FaTimesCircle, FaBan, FaGavel, FaInfoCircle } from 'react-icons/fa';

const sections = [
  { icon: FaFileContract, title: 'Acceptance of Terms', content: 'By creating an account and using InterviewAce, you agree to these terms. If you do not agree, please do not use our services. We reserve the right to update these terms with notice.' },
  { icon: FaCheckCircle, title: 'Account Responsibilities', content: 'You are responsible for maintaining the confidentiality of your account credentials and for all activities under your account. You must provide accurate information and be at least 13 years of age.' },
  { icon: FaBan, title: 'Acceptable Use', content: 'You agree not to misuse our platform for any unlawful purpose, attempt to circumvent our AI systems, or engage in any activity that disrupts our services. Automated scraping or data extraction is prohibited.' },
  { icon: FaInfoCircle, title: 'AI Feedback Disclaimer', content: 'AI-generated feedback is for educational purposes only and should not be considered as professional career advice. While we strive for accuracy, AI assessments may contain errors and should be used as a guide.' },
  { icon: FaGavel, title: 'Limitation of Liability', content: 'InterviewAce and its affiliates are not liable for any indirect, incidental, or consequential damages arising from your use of our platform. Our total liability is limited to the amount paid by you in the past 12 months.' },
  { icon: FaTimesCircle, title: 'Termination', content: 'We reserve the right to suspend or terminate accounts that violate these terms. You may delete your account at any time. Upon termination, your data will be deleted within 30 days.' },
];

const TermsPage = () => (
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
            <FaGavel style={{ marginRight: 6 }} /> Legal
          </div>
          <h1 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 900, marginBottom: 16 }}>
            Terms of <span className="gradient-text">Service</span>
          </h1>
          <p style={{ color: 'var(--text-muted)', maxWidth: 600, margin: '0 auto' }}>
            Last updated: July 2025. Please read these terms carefully before using InterviewAce.
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
          <Link to="/privacy" style={{ color: 'var(--primary)', fontWeight: 600 }}>View Privacy Policy →</Link>
        </div>
      </div>
    </div>
  </div>
);

export default TermsPage;