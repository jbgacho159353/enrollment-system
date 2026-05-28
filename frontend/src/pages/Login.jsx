import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const IconUser = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
  </svg>
);
const IconLock = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
  </svg>
);
const IconEye = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
    <circle cx="12" cy="12" r="3"/>
  </svg>
);
const IconEyeOff = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
    <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
    <line x1="1" y1="1" x2="23" y2="23"/>
  </svg>
);
const IconAlert = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
  </svg>
);
const IconShield = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
  </svg>
);
const IconUsers = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
    <circle cx="9" cy="7" r="4"/>
    <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
    <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
  </svg>
);
const IconCheck = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);
const IconArrow = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12"/>
    <polyline points="12 5 19 12 12 19"/>
  </svg>
);
const IconLogo = () => (
  <svg viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 3L1 9l11 6 9-4.91V17h2V9L12 3z"/>
    <path d="M5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82z"/>
  </svg>
);

export default function Login() {
  const { login } = useAuth();
  const navigate  = useNavigate();

  const [form, setForm]               = useState({ username: '', password: '' });
  const [showPwd, setShowPwd]         = useState(false);
  const [loading, setLoading]         = useState(false);
  const [guestLoading, setGuestLoading] = useState('');
  const [error, setError]             = useState('');

  const handleChange = (e) => {
    setError('');
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.username || !form.password) {
      setError('Please enter your username and password.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await login(form.username, form.password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleGuest = async (role) => {
    const creds = role === 'admin'
      ? { username: 'admin',     password: 'admin123' }
      : { username: 'registrar', password: 'registrar123' };
    setGuestLoading(role);
    setError('');
    try {
      await login(creds.username, creds.password);
      navigate('/dashboard');
    } catch {
      setError('Guest login failed. Please try again.');
    } finally {
      setGuestLoading('');
    }
  };

  return (
    <div className="login-page">
      {/* ── Left Panel ─────────────────────────── */}
      <div className="login-left">
        <div className="login-orb orb-1" />
        <div className="login-orb orb-2" />
        <div className="login-orb orb-3" />
        <div className="login-grid-overlay" />

        <div className="login-left-content">
          <div className="login-logo-wrap">
            <div className="login-logo-icon"><IconLogo /></div>
            <span className="login-logo-text">EduEnroll</span>
          </div>

          <h1 className="login-hero-title">
            School Enrollment<br />Made Simple.
          </h1>
          <p className="login-hero-sub">
            A complete platform for managing student registrations,
            courses, and academic records — all in one place.
          </p>

          <ul className="login-features">
            {[
              'Real-time enrollment tracking',
              'Student & course management',
              'Analytics & reporting dashboard',
            ].map((f) => (
              <li key={f} className="login-feature-item">
                <span className="login-feature-check"><IconCheck /></span>
                {f}
              </li>
            ))}
          </ul>

          <div className="login-stats-card">
            <div className="login-stat">
              <span className="login-stat-num">500+</span>
              <span className="login-stat-lbl">Students</span>
            </div>
            <div className="login-stat-divider" />
            <div className="login-stat">
              <span className="login-stat-num">48</span>
              <span className="login-stat-lbl">Courses</span>
            </div>
            <div className="login-stat-divider" />
            <div className="login-stat">
              <span className="login-stat-num">99%</span>
              <span className="login-stat-lbl">Uptime</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Right Panel ─────────────────────────── */}
      <div className="login-right">
        <div className="login-form-box">
          {/* Header */}
          <div className="login-form-header">
            <div className="login-form-logo"><IconLogo /></div>
            <div>
              <h2>Welcome back</h2>
              <p className="login-subtitle">Sign in to your account to continue</p>
            </div>
          </div>

          {/* Guest Access */}
          <div className="login-guest-section">
            <div className="login-guest-top">
              <div className="login-guest-badge">
                <span className="login-demo-dot" />
                Demo Mode
              </div>
              <p className="login-guest-desc">
                Explore all features instantly — no account needed.
              </p>
            </div>
            <div className="login-guest-btns">
              <button
                className="login-guest-btn admin"
                onClick={() => handleGuest('admin')}
                disabled={!!guestLoading || loading}
              >
                <span className="login-guest-btn-icon"><IconShield /></span>
                <span className="login-guest-btn-info">
                  <strong>Admin Access</strong>
                  <small>Full system control</small>
                </span>
                {guestLoading === 'admin'
                  ? <span className="login-guest-spinner" />
                  : <span className="login-guest-arrow"><IconArrow /></span>
                }
              </button>

              <button
                className="login-guest-btn registrar"
                onClick={() => handleGuest('registrar')}
                disabled={!!guestLoading || loading}
              >
                <span className="login-guest-btn-icon"><IconUsers /></span>
                <span className="login-guest-btn-info">
                  <strong>Registrar Access</strong>
                  <small>Enrollment management</small>
                </span>
                {guestLoading === 'registrar'
                  ? <span className="login-guest-spinner reg" />
                  : <span className="login-guest-arrow"><IconArrow /></span>
                }
              </button>
            </div>
          </div>

          {/* Divider */}
          <div className="login-divider">
            <span>or sign in with credentials</span>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit}>
            {error && (
              <div className="login-alert">
                <IconAlert />
                {error}
              </div>
            )}

            <div className="login-input-group">
              <label className="login-input-label">Username</label>
              <div className="login-input-wrap">
                <span className="login-input-icon"><IconUser /></span>
                <input
                  type="text"
                  name="username"
                  className="login-input"
                  placeholder="Enter your username"
                  value={form.username}
                  onChange={handleChange}
                  autoComplete="username"
                />
              </div>
            </div>

            <div className="login-input-group">
              <label className="login-input-label">Password</label>
              <div className="login-input-wrap">
                <span className="login-input-icon"><IconLock /></span>
                <input
                  type={showPwd ? 'text' : 'password'}
                  name="password"
                  className="login-input"
                  placeholder="Enter your password"
                  value={form.password}
                  onChange={handleChange}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  className="login-input-toggle"
                  onClick={() => setShowPwd(!showPwd)}
                >
                  {showPwd ? <IconEyeOff /> : <IconEye />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="login-btn"
              disabled={loading || !!guestLoading}
            >
              {loading
                ? <><span className="login-btn-spinner" /> Signing in…</>
                : 'Sign In'
              }
            </button>
          </form>

          <div className="login-footer">
            Don't have an account?{' '}
            <a href="mailto:joelgacho.ffseo@gmail.com">Contact Administrator</a>
          </div>
        </div>
      </div>
    </div>
  );
}
