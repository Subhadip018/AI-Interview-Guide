import React, { useState, useEffect, useRef } from 'react';
import { NavLink, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  FaBrain, FaTachometerAlt, FaMicrophone, FaTrophy,
  FaFileAlt, FaSignOutAlt, FaTimes, FaChartLine,
} from 'react-icons/fa';
import { RxHamburgerMenu } from 'react-icons/rx';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [scrolled, setScrolled]       = useState(false);
  const [menuOpen, setMenuOpen]       = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const userMenuRef = useRef(null);

  /* ── Scroll effect ── */
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  /* ── Close mobile menu on route change ── */
  useEffect(() => {
    setMenuOpen(false);
    setShowUserMenu(false);
  }, [location]);

  /* ── Close user menu on outside click ── */
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setShowUserMenu(false);
      }
    };
    if (showUserMenu) {
      document.addEventListener('mousedown', handleOutsideClick);
    }
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, [showUserMenu]);

  const handleLogout = () => {
    logout();
    setShowUserMenu(false);
    setMenuOpen(false);
    navigate('/');
  };

  const guestLinks = [
    { to: '/', label: 'Home' },
    { to: '/#features', label: 'Features' },
    { to: '/#resources', label: 'Resources' },
    { to: '/#faq', label: 'FAQ' },
  ];

  const authLinks = [
    { to: '/dashboard',     label: 'Dashboard',    Icon: FaTachometerAlt },
    { to: '/setup',         label: 'Interview',    Icon: FaMicrophone },
    { to: '/analytics',     label: 'Analytics',    Icon: FaChartLine },
    { to: '/achievements',  label: 'Achievements', Icon: FaTrophy },
    { to: '/resume',        label: 'Resume AI',    Icon: FaFileAlt },
  ];

  const links = user ? authLinks : guestLinks;

  return (
    <>
      <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
        <div className="navbar-inner">
          {/* Logo */}
          <Link to="/" className="nav-logo">
            <div className="nav-logo-icon">
              <FaBrain style={{ fontSize: '1rem', color: '#fff' }} />
            </div>
            <span className="nav-logo-text">InterviewAce</span>
          </Link>

          {/* Desktop Nav Links */}
          <ul className="nav-links">
            {links.map(link => (
              <li key={link.to}>
                <NavLink
                  to={link.to}
                  className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                >
                  {link.label}
                </NavLink>
              </li>
            ))}
          </ul>

          {/* Actions */}
          <div className="nav-actions">
            {user ? (
              /* ── User Avatar + Dropdown ── */
              <div className="nav-user" ref={userMenuRef}>
                <div
                  className="nav-avatar"
                  onClick={() => setShowUserMenu(prev => !prev)}
                  title={user.name}
                  role="button"
                  aria-haspopup="true"
                  aria-expanded={showUserMenu}
                  id="user-avatar-btn"
                >
                  {user.name?.charAt(0).toUpperCase()}
                </div>

                {showUserMenu && (
                  <div
                    style={{
                      position: 'absolute',
                      top: '110%',
                      right: 0,
                      background: 'var(--card)',
                      border: '1px solid var(--border)',
                      borderRadius: '12px',
                      padding: '8px',
                      minWidth: '200px',
                      zIndex: 1100,
                      boxShadow: '0 20px 60px rgba(0,0,0,0.6)',
                    }}
                  >
                    {/* User info header */}
                    <div style={{ padding: '10px 12px 12px', borderBottom: '1px solid var(--border)', marginBottom: 4 }}>
                      <div style={{ fontWeight: 700, fontSize: '0.92rem' }}>{user.name}</div>
                      <div style={{ color: 'var(--text-muted)', fontSize: '0.78rem', marginTop: 2 }}>{user.email}</div>
                    </div>

                    {/* Dashboard link */}
                    <Link
                      to="/dashboard"
                      id="dropdown-dashboard"
                      onClick={() => setShowUserMenu(false)}
                      style={{
                        display: 'flex', alignItems: 'center', gap: '10px',
                        padding: '10px 12px', borderRadius: '8px', fontSize: '0.9rem',
                        color: 'var(--text-muted)', transition: 'all 0.2s',
                        textDecoration: 'none', fontWeight: 500,
                      }}
                      onMouseEnter={e => e.currentTarget.style.background = 'rgba(99,102,241,0.1)'}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                    >
                      <FaTachometerAlt style={{ color: 'var(--primary)', flexShrink: 0 }} />
                      Dashboard
                    </Link>

                    {/* Sign Out button */}
                    <button
                      id="dropdown-signout"
                      onClick={handleLogout}
                      style={{
                        display: 'flex', alignItems: 'center', gap: '10px',
                        padding: '10px 12px', borderRadius: '8px', fontSize: '0.9rem',
                        color: 'var(--danger)', width: '100%', textAlign: 'left',
                        transition: 'all 0.2s', background: 'none', border: 'none',
                        cursor: 'pointer', fontFamily: 'var(--font)', fontWeight: 500,
                      }}
                      onMouseEnter={e => e.currentTarget.style.background = 'rgba(239,68,68,0.1)'}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                    >
                      <FaSignOutAlt style={{ flexShrink: 0 }} /> Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link to="/login" className="btn btn-secondary btn-sm">Login</Link>
                <Link to="/register" className="btn btn-primary btn-sm">Get Started</Link>
              </>
            )}
          </div>

          {/* Hamburger - moved outside nav-actions to always be visible */}
          <button
            className={`hamburger ${menuOpen ? 'open' : ''}`}
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
            id="hamburger-btn"
          >
            <span /><span /><span />
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div className={`mobile-menu ${menuOpen ? 'open' : ''}`}>
        {links.map(link => (
          <NavLink
            key={link.to}
            to={link.to}
            className="mobile-link"
            onClick={() => setMenuOpen(false)}
          >
            {link.Icon && <link.Icon style={{ marginRight: 8 }} />} {link.label}
          </NavLink>
        ))}
        {user ? (
          <button
            onClick={handleLogout}
            className="mobile-link"
            id="mobile-signout-btn"
            style={{
              color: 'var(--danger)', border: 'none', background: 'none',
              cursor: 'pointer', textAlign: 'left', fontFamily: 'var(--font)',
              fontSize: '1rem', padding: '12px 16px', width: '100%',
              display: 'flex', alignItems: 'center', gap: 8,
            }}
          >
            <FaSignOutAlt /> Sign Out
          </button>
        ) : (
          <div style={{ display: 'flex', gap: '10px', padding: '12px 16px' }}>
            <Link to="/login"    className="btn btn-secondary btn-sm" style={{ flex: 1, justifyContent: 'center' }}>Login</Link>
            <Link to="/register" className="btn btn-primary   btn-sm" style={{ flex: 1, justifyContent: 'center' }}>Register</Link>
          </div>
        )}
      </div>
    </>
  );
};

export default Navbar;
