import React, { useState } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import AchievementToast from './components/AchievementToast';
import HomePage from './pages/HomePage';
import ExplorePage from './pages/ExplorePage';
import LearnPage from './pages/LearnPage';
import PracticePage from './pages/PracticePage';
import RevisionCardsPage from './pages/RevisionCardsPage';
import ProgressPage from './pages/ProgressPage';
import AchievementsPage from './pages/AchievementsPage';
import SettingsPage from './pages/SettingsPage';
import DiagnosticPage from './pages/DiagnosticPage';
import CodingPage from './pages/CodingPage';
import LeaderboardPage from './pages/LeaderboardPage';
import AuthPage from './pages/auth/AuthPage';
import { useAuth } from './context/AuthContext';
import { useApp } from './context/AppContext';

const pageTitles: Record<string, string> = {
  '/':              'Home',
  '/explore':       'Explore',
  '/learn':         'Learn',
  '/practice':      'Practice',
  '/revision':      'Revision Cards',
  '/coding':        'Coding',
  '/progress':      'My Progress',
  '/achievements':  'Achievements',
  '/leaderboard':   'Leaderboard',
  '/settings':      'Settings',
  '/diagnostic':    'Diagnostic',
};

// Pages that require authentication
const PROTECTED_PATHS = [
  '/', '/explore', '/learn', '/practice', '/revision',
  '/coding', '/progress', '/achievements', '/leaderboard',
  '/settings', '/diagnostic',
];

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh', display: 'flex', alignItems: 'center',
        justifyContent: 'center', background: 'var(--bg)',
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>⏳</div>
          <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>Loading…</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}

function AppShell({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const title = pageTitles[location.pathname] || 'SkillTrace AI';

  return (
    <div className="app-layout">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="main-content">
        <Header onMenuClick={() => setSidebarOpen(true)} title={title} />
        <main style={{ flex: 1, overflowY: 'auto' }}>{children}</main>
      </div>
      <AchievementToast />
    </div>
  );
}

export default function App() {
  const { user } = useAuth();

  return (
    <Routes>
      {/* Public routes */}
      <Route path="/auth" element={user ? <Navigate to="/" replace /> : <AuthPage />} />
      <Route path="/auth/callback" element={<AuthCallback />} />

      {/* Protected routes — wrapped in layout shell */}
      <Route path="/*" element={
        <ProtectedRoute>
          <AppShell>
            <Routes>
              <Route path="/"             element={<HomePage />} />
              <Route path="/explore"      element={<ExplorePage />} />
              <Route path="/learn"        element={<LearnPage />} />
              <Route path="/practice"     element={<PracticePage />} />
              <Route path="/revision"     element={<RevisionCardsPage />} />
              <Route path="/coding"       element={<CodingPage />} />
              <Route path="/progress"     element={<ProgressPage />} />
              <Route path="/achievements" element={<AchievementsPage />} />
              <Route path="/leaderboard"  element={<LeaderboardPage />} />
              <Route path="/settings"     element={<SettingsPage />} />
              <Route path="/diagnostic"   element={<DiagnosticPage />} />
              <Route path="*"             element={<NotFound />} />
            </Routes>
          </AppShell>
        </ProtectedRoute>
      } />
    </Routes>
  );
}

function AuthCallback() {
  // Supabase redirects here after email verification
  // The auth state change listener in AuthContext handles the session
  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center',
      justifyContent: 'center', background: 'var(--bg)',
    }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: 40, marginBottom: 12 }}>✅</div>
        <p style={{ color: 'var(--text-primary)', fontWeight: 600 }}>Email verified!</p>
        <p style={{ color: 'var(--text-muted)', fontSize: 14, marginBottom: 16 }}>
          Redirecting you to the app…
        </p>
        <a href="/" className="btn btn-primary">Go to Dashboard</a>
      </div>
    </div>
  );
}

function NotFound() {
  return (
    <div className="page-content" style={{ textAlign: 'center', padding: '80px 20px' }}>
      <div style={{ fontSize: 56, marginBottom: 16 }}>🔍</div>
      <h1 style={{ fontSize: 28, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 8 }}>
        Page not found
      </h1>
      <p style={{ color: 'var(--text-secondary)', marginBottom: 24 }}>
        Looks like you've wandered off the learning path!
      </p>
      <a href="/" className="btn btn-primary btn-lg">Go to Home</a>
    </div>
  );
}
