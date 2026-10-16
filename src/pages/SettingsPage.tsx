import React, { useState } from 'react';
import { Settings, Volume2, VolumeX, Moon, Sun, User, Target, Bell, Globe, Trophy } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { isSpeechSupported } from '../utils/voice';

export default function SettingsPage() {
  const { state, toggleVoice, toggleDarkMode, dispatch } = useApp();
  const { user } = state;
  const [name, setName] = useState(user.name);
  const [dailyGoal, setDailyGoal] = useState(user.dailyGoal);
  const [lbName, setLbName] = useState(user.leaderboardName || user.name.split(' ')[0]);
  const [saved, setSaved] = useState(false);
  const speechSupported = isSpeechSupported();

  const handleSave = () => {
    if (name.trim()) {
      dispatch({ type: 'UPDATE_PROFILE', name: name.trim(), avatar: user.avatar, leaderboardName: lbName.trim() || name.trim(), showOnLeaderboard: user.showOnLeaderboard });
    }
    dispatch({ type: 'UPDATE_DAILY_GOAL', minutes: dailyGoal });
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="page-content" style={{ margin: '0 auto', maxWidth: 680 }}>
      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 28, fontWeight: 800, color: 'var(--text-primary)', marginBottom: 4 }}>
          Settings
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: 15 }}>
          Customise your learning experience
        </p>
      </div>

      {/* Profile */}
      <div className="card" style={{ marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
          <User size={18} color="var(--primary)" />
          <h2 style={{ fontSize: 16, fontWeight: 600, color: 'var(--text-primary)' }}>Profile</h2>
        </div>

        <div style={{ marginBottom: 14 }}>
          <label style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)', marginBottom: 6, display: 'block' }}
            htmlFor="name-input">
            Display Name
          </label>
          <input
            id="name-input"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
            maxLength={40}
          />
        </div>

        <div style={{ marginBottom: 14 }}>
          <label style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)', marginBottom: 6, display: 'block' }}
            htmlFor="lb-name-input">
            Leaderboard Display Name
          </label>
          <input
            id="lb-name-input"
            type="text"
            value={lbName}
            onChange={(e) => setLbName(e.target.value)}
            placeholder="e.g. Priya S."
            maxLength={30}
          />
          <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>
            This name (not your email) is shown publicly on the leaderboard.
          </div>
        </div>

        <div style={{ marginBottom: 16 }}>
          <label style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)', marginBottom: 4, display: 'block' }}>
            Avatar
          </label>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {['🧑‍💻', '👩‍💻', '🧑‍🎓', '👨‍🎓', '🦸', '🦸‍♀️', '🧙', '🧙‍♀️'].map((av) => (
              <button
                key={av}
                style={{
                  fontSize: 24, padding: '6px 10px', borderRadius: 8, cursor: 'pointer',
                  border: '2px solid',
                  borderColor: user.avatar === av ? 'var(--primary)' : 'var(--border)',
                  background: user.avatar === av ? 'rgba(79,70,229,0.08)' : 'var(--bg)',
                  transition: 'all 0.15s',
                }}
                onClick={() => dispatch({ type: 'UPDATE_NAME', name: user.name })}
                aria-label={`Avatar ${av}`}
                title={av}
              >
                {av}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Learning preferences */}
      <div className="card" style={{ marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
          <Target size={18} color="var(--primary)" />
          <h2 style={{ fontSize: 16, fontWeight: 600, color: 'var(--text-primary)' }}>Learning Preferences</h2>
        </div>

        <div style={{ marginBottom: 14 }}>
          <label style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)', marginBottom: 6, display: 'block' }}
            htmlFor="daily-goal">
            Daily Learning Goal: {dailyGoal} minutes
          </label>
          <input
            id="daily-goal"
            type="range"
            min={5}
            max={120}
            step={5}
            value={dailyGoal}
            onChange={(e) => setDailyGoal(Number(e.target.value))}
            style={{ width: '100%', height: 6, accentColor: 'var(--primary)' }}
            aria-label="Daily goal in minutes"
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>
            <span>5 min</span>
            <span>120 min</span>
          </div>
        </div>
      </div>

      {/* Appearance */}
      <div className="card" style={{ marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
          <Moon size={18} color="var(--primary)" />
          <h2 style={{ fontSize: 16, fontWeight: 600, color: 'var(--text-primary)' }}>Appearance</h2>
        </div>

        <ToggleRow
          icon={user.darkMode ? <Moon size={18} /> : <Sun size={18} />}
          label="Dark Mode"
          description="Switch between light and dark theme"
          enabled={user.darkMode}
          onToggle={toggleDarkMode}
        />
      </div>

      {/* Voice */}
      <div className="card" style={{ marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
          <Volume2 size={18} color="var(--primary)" />
          <h2 style={{ fontSize: 16, fontWeight: 600, color: 'var(--text-primary)' }}>Voice Feedback</h2>
        </div>

        {!speechSupported && (
          <div style={{
            background: 'rgba(217,119,6,0.06)', border: '1px solid rgba(217,119,6,0.2)',
            borderRadius: 8, padding: '10px 14px', marginBottom: 12, fontSize: 13, color: 'var(--warning)',
          }}>
            ⚠️ Your browser does not support the Web Speech API. Voice feedback is unavailable.
          </div>
        )}

        <ToggleRow
          icon={user.voiceEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
          label="Enable Voice Feedback"
          description="Hear encouraging messages after answering quiz questions"
          enabled={user.voiceEnabled}
          onToggle={toggleVoice}
          disabled={!speechSupported}
        />

        {user.voiceEnabled && (
          <div style={{ marginTop: 12, padding: '10px 14px', background: 'var(--bg)', borderRadius: 8, fontSize: 13, color: 'var(--text-secondary)' }}>
            💡 Voice will speak briefly after each quiz answer. No audio plays on page load. You can mute it anytime using the speaker icon in the header.
          </div>
        )}
      </div>

      {/* Data & privacy note */}
      <div className="card" style={{ marginBottom: 20, borderColor: 'rgba(79,70,229,0.15)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
          <Bell size={18} color="var(--primary)" />
          <h2 style={{ fontSize: 16, fontWeight: 600, color: 'var(--text-primary)' }}>Data & Privacy</h2>
        </div>
        <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 8 }}>
          📦 <strong>Demo Mode:</strong> All your progress, XP, and settings are stored only in your browser's local storage. Data does not sync across devices.
        </p>
        <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 12 }}>
          🤖 <strong>AI Features:</strong> AI-powered re-explanations and supplementary questions require an API key configuration. Core lessons and quizzes work without any API.
        </p>
        <button
          className="btn btn-danger btn-sm"
          style={{ fontSize: 13 }}
          onClick={() => {
            if (confirm('Reset all progress? This cannot be undone.')) {
              localStorage.removeItem('skilltrace-ai-state');
              window.location.reload();
            }
          }}
        >
          Reset All Progress
        </button>
      </div>

      {/* Save */}
      <button className="btn btn-primary btn-lg" style={{ width: '100%' }} onClick={handleSave}>
        {saved ? '✓ Saved!' : 'Save Settings'}
      </button>
    </div>
  );
}

function ToggleRow({
  icon, label, description, enabled, onToggle, disabled
}: {
  icon: React.ReactNode;
  label: string;
  description: string;
  enabled: boolean;
  onToggle: () => void;
  disabled?: boolean;
}) {
  return (
    <div style={{ display: 'flex', gap: 12, alignItems: 'center', justifyContent: 'space-between' }}>
      <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
        <div style={{ color: 'var(--text-secondary)' }}>{icon}</div>
        <div>
          <div style={{ fontSize: 14, fontWeight: 500, color: 'var(--text-primary)' }}>{label}</div>
          <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{description}</div>
        </div>
      </div>
      <button
        role="switch"
        aria-checked={enabled}
        onClick={!disabled ? onToggle : undefined}
        style={{
          width: 44, height: 24, borderRadius: 12, border: 'none', cursor: disabled ? 'not-allowed' : 'pointer',
          background: enabled ? 'var(--primary)' : 'var(--border)',
          position: 'relative', transition: 'background 0.2s', flexShrink: 0,
          opacity: disabled ? 0.4 : 1,
        }}
      >
        <div style={{
          width: 18, height: 18, borderRadius: '50%', background: 'white',
          position: 'absolute', top: 3,
          left: enabled ? 23 : 3,
          transition: 'left 0.2s',
          boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
        }} />
      </button>
    </div>
  );
}
