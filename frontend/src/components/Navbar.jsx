import React from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const routeMeta = {
  '/dashboard':   { title: 'Dashboard',   crumb: 'Home' },
  '/students':    { title: 'Students',    crumb: 'Home' },
  '/courses':     { title: 'Courses',     crumb: 'Home' },
  '/enrollments': { title: 'Enrollments', crumb: 'Home' }
};

const IconBell = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
    <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
  </svg>
);
const IconChevron = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="6 9 12 15 18 9"/>
  </svg>
);

export default function Navbar() {
  const { pathname } = useLocation();
  const { user } = useAuth();
  const meta = routeMeta[pathname] || { title: 'Page', crumb: 'Home' };
  const initials = user ? user.username.slice(0, 2).toUpperCase() : 'AU';

  return (
    <header className="navbar">
      <div className="navbar-breadcrumb">
        <div className="navbar-page-title">{meta.title}</div>
        <div className="navbar-crumbs">
          <span>{meta.crumb}</span>
          <span className="sep">/</span>
          <span className="current">{meta.title}</span>
        </div>
      </div>

      <div className="navbar-actions">
        <button className="navbar-icon-btn" title="Notifications">
          <IconBell />
          <span className="navbar-notification-dot" />
        </button>

        <div className="navbar-user">
          <div className="navbar-user-avatar">{initials}</div>
          <span className="navbar-user-name">{user?.username || 'Admin User'}</span>
          <IconChevron />
        </div>
      </div>
    </header>
  );
}
