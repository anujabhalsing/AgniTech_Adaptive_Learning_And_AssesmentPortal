import React from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import {
  Home, Compass, BookOpen, Code2, BookMarked,
  BarChart2, Trophy, Settings, X, Zap, FileCode, Award
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { getXPProgress } from '../utils/mastery';

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

const navItems = [
  { path: '/',             icon: Home,       label: 'Home' },
  { path: '/explore',      icon: Compass,    label: 'Explore' },
  { path: '/learn',        icon: BookOpen,   label: 'Learn' },
  { path: '/practice',     icon: Code2,      label: 'Practice' },
  { path: '/coding',       icon: FileCode,   label: 'Coding' },
  { path: '/revision',     icon: BookMarked, label: 'Revision Cards' },
  { path: '/progress',     icon: BarChart2,  label: 'My Progress' },
  { path: '/achievements', icon: Trophy,     label: 'Achievements' },
  { path: '/leaderboard',  icon: Award,      label: 'Leaderboard' },
  { path: '/settings',     icon: Settings,   label: 'Settings' },
];

export default function Sidebar({ open, onClose }: SidebarProps) {
  const { state } = useApp();
  const { user } = state;
  const { signOut, user: authUser } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const xpProgress = getXPProgress(user.xp);

  return (
    <>
      {/* Overlay */}
      <div
        className={`sidebar-overlay ${open ? 'open' : ''}`}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Sidebar */}
      <nav className={`sidebar ${open ? 'open' : ''}`} aria-label="Main navigation">
        {/* Logo */}
        <div style={{
          padding: '16px',
          borderBottom: '1px solid var(--border)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: 36, height: 36,
              background: 'linear-gradient(135deg, #4F46E5, #7C3AED)',
              borderRadius: 10,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <svg width="20" height="20" viewBox="0 0 32 32" fill="none">
                <path d="M6 18L11 12L14 15L18 8L26 18" stroke="white" strokeWidth="2.5"
                  strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M6 24L11 18L14 21L18 14L26 24" stroke="rgba(255,255,255,0.5)"
                  strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: 15, color: 'var(--text-primary)', lineHeight: 1.2 }}>
                SkillTrace
              </div>
              <div style={{ fontSize: 11, color: 'var(--primary)', fontWeight: 600 }}>AI</div>
            </div>
          </div>
          <button
            className="mobile-menu-btn"
            onClick={onClose}
            aria-label="Close navigation"
            style={{ display: open ? undefined : 'none' }}
          >
            <X size={18} />
          </button>
        </div>

        {/* User summary */}
        <div style={{ padding: '16px', borderBottom: '1px solid var(--border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
            <div style={{
              width: 36, height: 36, borderRadius: '50%',
              background: 'linear-gradient(135deg, #EEF2FF, #C7D2FE)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 18,
            }}>
              {user.avatar}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontWeight: 600, fontSize: 13, color: 'var(--text-primary)', 
                overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {user.name}
              </div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Level {user.level}</div>
            </div>
          </div>

          {/* XP bar */}
          <div style={{ marginBottom: 6 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: 'var(--text-muted)' }}>
                <Zap size={11} color="var(--warning)" />
                <span>{user.xp} XP</span>
              </div>
              <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                {xpProgress.current}/{xpProgress.required} to Level {user.level + 1}
              </span>
            </div>
            <div className="progress-bar" style={{ height: 5 }}>
              <div
                className="progress-fill"
                style={{
                  width: `${xpProgress.percent}%`,
                  background: 'linear-gradient(90deg, #4F46E5, #7C3AED)',
                }}
              />
            </div>
          </div>

          {/* Streak */}
          <div style={{
            display: 'flex', gap: 12, fontSize: 12, color: 'var(--text-secondary)',
          }}>
            <span>🔥 {user.streak} day streak</span>
            <span>🏆 {user.achievements.length} badges</span>
          </div>
        </div>

        {/* Nav links */}
        <div style={{ padding: '8px 0', flex: 1 }}>
          {navItems.map(({ path, icon: Icon, label }) => {
            const isActive = path === '/'
              ? location.pathname === '/'
              : location.pathname.startsWith(path);
            return (
              <NavLink
                key={path}
                to={path}
                className={`nav-item ${isActive ? 'active' : ''}`}
                onClick={onClose}
                aria-current={isActive ? 'page' : undefined}
              >
                <Icon size={17} />
                <span>{label}</span>
              </NavLink>
            );
          })}
        </div>

        {/* Daily goal */}
        <div style={{
          padding: '12px 16px',
          borderTop: '1px solid var(--border)',
          fontSize: 12,
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, color: 'var(--text-secondary)' }}>
            <span>Daily Goal</span>
            <span>{user.dailyProgress}/{user.dailyGoal} min</span>
          </div>
          <div className="progress-bar" style={{ height: 5 }}>
            <div
              className="progress-fill"
              style={{
                width: `${Math.min((user.dailyProgress / user.dailyGoal) * 100, 100)}%`,
                background: user.dailyProgress >= user.dailyGoal ? 'var(--success)' : 'var(--primary)',
              }}
            />
          </div>
          {/* Sign out */}
          {authUser && (
            <button
              onClick={() => signOut()}
              style={{
                marginTop: 10, width: '100%', fontSize: 12, color: 'var(--text-muted)',
                background: 'none', border: 'none', cursor: 'pointer', padding: '4px 0',
                textAlign: 'left', display: 'flex', alignItems: 'center', gap: 4,
              }}
            >
              {authUser.isGuest ? '← Switch Account' : '→ Sign Out'}
            </button>
          )}
        </div>
      </nav>
    </>
  );
}
