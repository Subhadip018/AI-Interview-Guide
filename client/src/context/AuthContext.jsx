import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);

const INACTIVITY_TIMEOUT_MS = 10 * 60 * 1000; // 10 minutes

export const AuthProvider = ({ children }) => {
  const [user, setUser]       = useState(null);
  const [token, setToken]     = useState(localStorage.getItem('ia_token') || null);
  const [loading, setLoading] = useState(true);
  const inactivityTimer       = useRef(null);

  /* ── Internal logout (clears all state) ── */
  const performLogout = useCallback(() => {
    localStorage.removeItem('ia_token');
    setToken(null);
    setUser(null);
    delete axios.defaults.headers.common['Authorization'];
    clearTimeout(inactivityTimer.current);
    // Redirect to login with a reason param so UI can show a message
    if (window.location.pathname !== '/login' && window.location.pathname !== '/') {
      window.location.href = '/login?reason=session_expired';
    }
  }, []);

  /* ── Reset the inactivity timer on any user activity ── */
  const resetInactivityTimer = useCallback(() => {
    if (!user) return; // Only track if logged in
    clearTimeout(inactivityTimer.current);
    inactivityTimer.current = setTimeout(() => {
      performLogout();
    }, INACTIVITY_TIMEOUT_MS);
  }, [user, performLogout]);

  /* ── Attach activity listeners when user is logged in ── */
  useEffect(() => {
    if (!user) {
      clearTimeout(inactivityTimer.current);
      return;
    }

    const activityEvents = ['mousemove', 'mousedown', 'keydown', 'touchstart', 'scroll', 'click'];
    activityEvents.forEach(evt => window.addEventListener(evt, resetInactivityTimer, { passive: true }));

    // Start the timer immediately on login
    resetInactivityTimer();

    return () => {
      activityEvents.forEach(evt => window.removeEventListener(evt, resetInactivityTimer));
      clearTimeout(inactivityTimer.current);
    };
  }, [user, resetInactivityTimer]);

  /* ── Set axios header and fetch user on token change ── */
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      fetchCurrentUser();
    } else {
      delete axios.defaults.headers.common['Authorization'];
      setLoading(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const fetchCurrentUser = async () => {
    try {
      const res = await axios.get('/api/auth/me');
      setUser(res.data.user);
    } catch (err) {
      // Token invalid or expired — silent logout without redirect
      localStorage.removeItem('ia_token');
      setToken(null);
      setUser(null);
      delete axios.defaults.headers.common['Authorization'];
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    const res = await axios.post('/api/auth/login', { email, password });
    const { token: newToken, user: userData } = res.data;
    localStorage.setItem('ia_token', newToken);
    setToken(newToken);
    setUser(userData);
    axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
    return userData;
  };

  const register = async (name, email, password) => {
    const res = await axios.post('/api/auth/register', { name, email, password });
    const { token: newToken, user: userData } = res.data;
    localStorage.setItem('ia_token', newToken);
    setToken(newToken);
    setUser(userData);
    axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
    return userData;
  };

  /* ── Public logout (called from UI buttons) ── */
  const logout = useCallback(() => {
    localStorage.removeItem('ia_token');
    setToken(null);
    setUser(null);
    delete axios.defaults.headers.common['Authorization'];
    clearTimeout(inactivityTimer.current);
  }, []);

  const updateUser = (updates) => {
    setUser(prev => ({ ...prev, ...updates }));
  };

  const refreshUser = useCallback(async () => {
    try {
      const res = await axios.get('/api/auth/me');
      setUser(res.data.user);
    } catch { /* ignore */ }
  }, []);

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout, updateUser, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};

export default AuthContext;
