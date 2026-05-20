import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const IconUser = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="16" height="16">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
  </svg>
);
const IconLock = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="16" height="16">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
  </svg>
);
const IconEye = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="16" height="16">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
    <circle cx="12" cy="12" r="3"/>
  </svg>
);
const IconEyeOff = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="16" height="16">
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
const IconLogo = () => (
  <svg viewBox="0 0 24 24" fill="white" width="36" height="36">
    <path d="M12 3L1 9l11 6 9-4.91V17h2V9L12 3z"/>
    <path d="M5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82z"/>
  </svg>
);

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [form, setForm]           = useState({ username: '', password: '' });
  const [userType, setUserType]   = useState('admin');
  const [showPwd, setShowPwd]     = useState(false);
  const [remember, setRemember]   = useState(false);
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState('');

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

  return (
    <div className="login-page">
      {/* Left Panel */}
      <div className="login-left">
        <div className="login-brand">
          <div className="login-brand-icon">
            <IconLogo />
          </div>
          <h1>Welcome Back!</h1>
          <p>Sign in to continue to your<br />Enrollment System</p>
        </div>

        <div className="login-illustration">
          <div className="login-illustration-card">
            <div className="login-ill-row">
              <div className="login-ill-dot" />
              <div className="login-ill-line accent" />
              <div className="login-ill-line short" />
            </div>
            <div className="login-ill-box" />
            <div className="login-ill-row" style={{ marginBottom: 0 }}>
              <div className="login-ill-dot" />
              <div className="login-ill-line" />
              <div className="login-ill-line accent short" />
            </div>
            <div style={{ marginTop: 10 }}>
              <div className="login-ill-box" style={{ height: 16, marginBottom: 6 }} />
              <div className="login-ill-box" style={{ height: 16, width: '70%' }} />
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel */}
      <div className="login-right">
        <div className="login-form-box">
          <h2>Login to your account</h2>
          <p className="login-subtitle">Enter your credentials to access your account</p>

          {/* User Type */}
          <div>
            <p className="login-input-label" style={{ marginBottom: 8 }}>User Type</p>
            <div className="user-type-selector">
              {['admin', 'registrar'].map((type) => (
                <label key={type} className={`user-type-option ${userType === type ? 'selected' : ''}`}>
                  <input
                    type="radio"
                    name="userType"
                    value={type}
                    checked={userType === type}
                    onChange={() => setUserType(type)}
                  />
                  <span style={{ textTransform: 'capitalize' }}>{type}</span>
                </label>
              ))}
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            {error && (
              <div className="login-alert">
                <IconAlert />
                {error}
              </div>
            )}

            {/* Username */}
            <div className="login-input-group">
              <label className="login-input-label">Username</label>
              <div className="login-input-icon"><IconUser /></div>
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

            {/* Password */}
            <div className="login-input-group">
              <label className="login-input-label">Password</label>
              <div className="login-input-icon"><IconLock /></div>
              <input
                type={showPwd ? 'text' : 'password'}
                name="password"
                className="login-input"
                placeholder="Enter your password"
                value={form.password}
                onChange={handleChange}
                autoComplete="current-password"
              />
              <button type="button" className="login-input-toggle" onClick={() => setShowPwd(!showPwd)}>
                {showPwd ? <IconEyeOff /> : <IconEye />}
              </button>
            </div>

            {/* Options */}
            <div className="login-options">
              <label className="login-remember">
                <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} />
                Remember me
              </label>
              <span className="login-forgot">Forgot Password?</span>
            </div>

            <button type="submit" className="login-btn" disabled={loading}>
              {loading ? 'Signing in…' : 'Sign In'}
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
