import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaHeart } from 'react-icons/fa';

const Footer = () => {
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => setShowBackToTop(window.scrollY > 400);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/#features', label: 'Features' },
    { to: '/#resources', label: 'Resources' },
    { to: '/#faq', label: 'FAQ' },
  ];

  const productLinks = [
    { to: '/dashboard', label: 'Dashboard' },
    { to: '/setup', label: 'Interview' },
    { to: '/achievements', label: 'Achievements' },
    { to: '/resume', label: 'Resume AI' },
  ];

  const companyLinks = [
    { to: '/about', label: 'About' },
    { to: '/contact', label: 'Contact' },
    { to: '/privacy', label: 'Privacy Policy' },
    { to: '/terms', label: 'Terms of Service' },
  ];

  const socialLinks = [
    {
      href: 'https://github.com',
      label: 'GitHub',
      icon: 'fa-github',
      color: '#e2e8f0',
    },
    {
      href: 'https://linkedin.com',
      label: 'LinkedIn',
      icon: 'fa-linkedin-in',
      color: '#0a66c2',
    },
    {
      href: 'https://twitter.com',
      label: 'Twitter / X',
      icon: 'fa-x-twitter',
      color: '#e2e8f0',
    },
    {
      href: 'mailto:hello@interviewace.ai',
      label: 'Email',
      icon: 'fa-envelope',
      color: '#6366f1',
    },
  ];

  return (
    <>
      <footer className="footer">
        {/* Top divider glow */}
        <div className="footer-glow" />

        <div className="footer-grid container">
          {/* ── Column 1: Brand ── */}
          <div className="footer-brand">
            <Link to="/" className="footer-logo">
              <span className="footer-logo-icon">
                <i className="fas fa-brain" style={{ color: 'var(--text)' }} />
              </span>
              <span className="footer-logo-text">InterviewAce</span>
            </Link>
            <p className="footer-desc">
              Sharpen your interview skills with AI-powered mock interviews,
              real-time feedback, and personalised resume analysis.
            </p>
            <div className="footer-social">
              {socialLinks.map(s => (
                <a
                  key={s.label}
                  href={s.href}
                  target={s.href.startsWith('mailto') ? undefined : '_blank'}
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className="social-link"
                  style={{ '--social-color': s.color }}
                >
                  <i className={`${s.icon.startsWith('fa-envelope') ? 'fas' : 'fab'} ${s.icon}`} />
                </a>
              ))}
            </div>
          </div>

          {/* ── Column 2: Navigation ── */}
          <div className="footer-col">
            <h4 className="footer-col-title">Navigation</h4>
            <ul className="footer-col-links">
              {navLinks.map(l => (
                <li key={l.to}>
                  <Link to={l.to} className="footer-link">{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ── Column 3: Product ── */}
          <div className="footer-col">
            <h4 className="footer-col-title">Product</h4>
            <ul className="footer-col-links">
              {productLinks.map(l => (
                <li key={l.to}>
                  <Link to={l.to} className="footer-link">{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ── Column 4: Company ── */}
          <div className="footer-col">
            <h4 className="footer-col-title">Company</h4>
            <ul className="footer-col-links">
              {companyLinks.map(l => (
                <li key={l.to}>
                  <Link to={l.to} className="footer-link">{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="footer-bottom container">
          <span className="footer-copy">
            © {new Date().getFullYear()} InterviewAce. All rights reserved.
          </span>
          <span className="footer-made">
            Made with <span className="footer-heart"><FaHeart style={{ color: 'var(--danger)', fontSize: '0.85rem' }} /></span> for job seekers everywhere
          </span>
        </div>
      </footer>

      {/* Back-to-top button */}
      <button
        className={`back-to-top ${showBackToTop ? 'visible' : ''}`}
        onClick={scrollToTop}
        aria-label="Back to top"
      >
        <i className="fas fa-chevron-up" />
      </button>
    </>
  );
};

export default Footer;
