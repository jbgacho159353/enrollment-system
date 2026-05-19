import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const IconDashboard = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
    <rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
  </svg>
);
const IconStudents = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
    <circle cx="9" cy="7" r="4"/>
    <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
  </svg>
);
const IconEnrollments = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
    <polyline points="14 2 14 8 20 8"/>
    <line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>
    <polyline points="10 9 9 9 8 9"/>
  </svg>
);
const IconCourses = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
  </svg>
);
const IconLogout = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
    <polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
  </svg>
);
const IconLogo = () => (
  <svg viewBox="0 0 24 24" fill="white">
    <path d="M12 3L1 9l11 6 9-4.91V17h2V9L12 3z"/>
    <path d="M5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82z"/>
  </svg>
);

export default function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const initials = user
    ? user.username.slice(0, 2).toUpperCase()
    : 'AU';

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <div className="sidebar-logo-icon">
          <IconLogo />
        </div>
        <div className="sidebar-logo-text">
          Enrollment
          <span>System</span>
        </div>
      </div>

      <nav className="sidebar-nav">
        <div className="sidebar-nav-section">Main Menu</div>

        <NavLink to="/dashboard" className={({ isActive }) => isActive ? 'active' : ''}>
          <IconDashboard />
          Dashboard
        </NavLink>

        <NavLink to="/students" className={({ isActive }) => isActive ? 'active' : ''}>
          <IconStudents />
          Students
        </NavLink>

        <NavLink to="/enrollments" className={({ isActive }) => isActive ? 'active' : ''}>
          <IconEnrollments />
          Enrollments
        </NavLink>

        <NavLink to="/courses" className={({ isActive }) => isActive ? 'active' : ''}>
          <IconCourses />
          Courses
        </NavLink>
      </nav>

      <div className="sidebar-footer">
        <div className="sidebar-user-avatar">{initials}</div>
        <div className="sidebar-user-info">
          <div className="sidebar-user-name">{user?.username || 'Admin User'}</div>
          <div className="sidebar-user-role">{user?.role || 'Administrator'}</div>
        </div>
        <button className="sidebar-logout-btn" onClick={handleLogout} title="Logout">
          <IconLogout />
        </button>
      </div>
    </aside>
  );
}
