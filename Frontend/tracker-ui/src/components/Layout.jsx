import React from 'react';
import { Outlet, NavLink, useLocation, useNavigate } from 'react-router-dom';
import useStore from '../store/useStore';
import api from '../api/axios';

const NAV = [
  { to: '/',         label: 'Dashboard',       icon: '⊞', group: 'Main' },
  { to: '/log',      label: 'Log Workout',      icon: '📋', group: 'Main' },
  { to: '/charts',   label: 'Progress Charts',  icon: '📈', group: 'Main' },
  { to: '/library',  label: 'Exercise Library', icon: '🏋️', group: 'Main' },
  { to: '/insights', label: 'AI Insights',      icon: '🤖', group: 'AI Features', badge: '3' },
  { to: '/plan',     label: 'Workout Plan',     icon: '📅', group: 'AI Features', badgeGreen: 'AI' },
  { to: '/profile',  label: 'Profile & Goals',  icon: '🎯', group: 'AI Features' },
  { to: '/report',   label: 'Monthly Report',   icon: '📊', group: 'Reports' },
  { to: '/settings', label: 'Settings',         icon: '⚙️', group: 'Reports' },
];
const PAGE_TITLES = {
  '/': 'Dashboard', '/log': 'Log Workout', '/charts': 'Progress Charts',
  '/library': 'Exercise Library', '/insights': 'AI Insights',
  '/plan': 'AI Workout Plan', '/profile': 'Profile & Goals',
  '/report': 'Monthly Report', '/settings': 'Settings',
};
const groups = ['Main', 'AI Features', 'Reports'];

export default function Layout() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useStore();

  const title = PAGE_TITLES[pathname] ?? 'FitTrack AI';
  const today = new Date().toLocaleDateString('en-US', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' });
  const initials = user?.name?.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2) ?? 'U';

  const handleLogout = async () => {
    try { await api.post('/auth/logout'); } catch (_) {}
    logout();
    navigate('/login');
  };

  return (
    <div className="app-layout">
      {/* ── SIDEBAR ── */}
      <aside className="sidebar">
        <div className="logo">
          <div className="logo-mark">⚡</div>
          <span className="logo-text">Fit<span>Track</span></span>
          <div className="live-dot-wrap"><div className="live-dot"></div>live</div>
        </div>

        <nav className="nav">
          {groups.map(group => (
            <React.Fragment key={group}>
              <div className="nav-group-label">{group}</div>
              {NAV.filter(n => n.group === group).map(n => (
                <NavLink
                  key={n.to}
                  to={n.to}
                  end={n.to === '/'}
                  className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}
                >
                  <span className="nav-icon">{n.icon}</span>
                  {n.label}
                  {n.badge      && <span className="nav-badge">{n.badge}</span>}
                  {n.badgeGreen && <span className="nav-badge green">{n.badgeGreen}</span>}
                </NavLink>
              ))}
            </React.Fragment>
          ))}
        </nav>

        <div className="sidebar-bottom">
          <div className="user-pill" onClick={handleLogout} title="Click to logout">
            <div className="avatar">{initials}</div>
            <div className="user-info">
              <div className="user-name">{user?.name ?? 'User'}</div>
              <div className="user-plan">Pro Plan · Logout ↗</div>
            </div>
          </div>
        </div>
      </aside>

      {/* ── MAIN ── */}
      <div className="main">
        <div className="topbar">
          <div className="page-title">{title}</div>
          <div className="topbar-date">{today}</div>
          <div className="search">
            <span style={{ color: 'var(--text3)' }}>🔍</span>
            <input type="text" placeholder="Search exercises…" />
          </div>
          <div className="icon-btn">🔔<div className="notif-dot"></div></div>
          <div className="icon-btn">📤</div>
          <button className="btn-log" onClick={() => navigate('/log')}>
            ⚡ New Session
          </button>
        </div>

        <div className="content">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
