import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, Search, Bell, Moon, Sun, Volume2, VolumeX } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { topics, languages } from '../data';

interface HeaderProps {
  onMenuClick: () => void;
  title?: string;
}

export default function Header({ onMenuClick, title }: HeaderProps) {
  const { state, toggleDarkMode, toggleVoice } = useApp();
  const { user } = state;
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<typeof topics>([]);
  const [showSearch, setShowSearch] = useState(false);
  const navigate = useNavigate();

  const handleSearch = (q: string) => {
    setSearchQuery(q);
    if (q.trim().length < 2) {
      setSearchResults([]);
      return;
    }
    const lq = q.toLowerCase();
    const results = topics.filter(
      (t) =>
        t.title.toLowerCase().includes(lq) ||
        t.description.toLowerCase().includes(lq) ||
        t.tags.some((tag) => tag.toLowerCase().includes(lq)) ||
        t.languageId.toLowerCase().includes(lq)
    ).slice(0, 6);
    setSearchResults(results);
  };

  const handleResultClick = (topicId: string) => {
    setShowSearch(false);
    setSearchQuery('');
    setSearchResults([]);
    navigate(`/learn?topic=${topicId}`);
  };

  const getLanguageIcon = (langId: string) => {
    return languages.find((l) => l.id === langId)?.icon ?? '📘';
  };

  return (
    <header className="page-header" style={{ gap: 12 }}>
      {/* Mobile menu toggle */}
      <button
        className="mobile-menu-btn"
        onClick={onMenuClick}
        aria-label="Open navigation menu"
        style={{ display: 'flex' }}
      >
        <Menu size={20} />
      </button>

      {/* Page title */}
      {title && (
        <h1 style={{
          fontSize: 18, fontWeight: 700, color: 'var(--text-primary)',
          marginRight: 16, whiteSpace: 'nowrap',
          display: 'none',
        }}
        className="desktop-title"
        >
          {title}
        </h1>
      )}

      {/* Search bar */}
      <div style={{ position: 'relative', flex: 1, maxWidth: 480 }}>
        <div style={{ position: 'relative' }}>
          <Search
            size={16}
            style={{
              position: 'absolute', left: 12, top: '50%',
              transform: 'translateY(-50%)',
              color: 'var(--text-muted)', pointerEvents: 'none',
            }}
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => { handleSearch(e.target.value); setShowSearch(true); }}
            onFocus={() => setShowSearch(true)}
            onBlur={() => setTimeout(() => setShowSearch(false), 200)}
            placeholder="What do you want to learn today?"
            aria-label="Search topics"
            style={{
              paddingLeft: 36, paddingRight: 12,
              background: 'var(--bg)', border: '1.5px solid var(--border)',
              borderRadius: 8, fontSize: 14, height: 38, width: '100%',
            }}
          />
        </div>

        {/* Search dropdown */}
        {showSearch && searchResults.length > 0 && (
          <div style={{
            position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 200,
            background: 'var(--surface)', border: '1px solid var(--border)',
            borderRadius: 10, boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
            marginTop: 4, overflow: 'hidden',
          }}>
            {searchResults.map((topic) => (
              <button
                key={topic.id}
                onClick={() => handleResultClick(topic.id)}
                style={{
                  width: '100%', padding: '10px 14px', textAlign: 'left',
                  background: 'none', border: 'none', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', gap: 10,
                  borderBottom: '1px solid var(--border)',
                  transition: 'background 0.1s',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--bg)')}
                onMouseLeave={(e) => (e.currentTarget.style.background = 'none')}
              >
                <span style={{ fontSize: 16 }}>{getLanguageIcon(topic.languageId)}</span>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-primary)' }}>
                    {topic.title}
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                    {topic.languageId} · {topic.difficulty}
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Right controls */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginLeft: 'auto' }}>
        {/* Voice toggle */}
        <button
          className="btn btn-ghost btn-sm"
          onClick={toggleVoice}
          title={user.voiceEnabled ? 'Mute voice feedback' : 'Enable voice feedback'}
          aria-label={user.voiceEnabled ? 'Disable voice' : 'Enable voice'}
          style={{ padding: 8, minHeight: 'unset', borderRadius: '50%' }}
        >
          {user.voiceEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
        </button>

        {/* Dark mode toggle */}
        <button
          className="btn btn-ghost btn-sm"
          onClick={toggleDarkMode}
          title="Toggle dark mode"
          aria-label="Toggle dark mode"
          style={{ padding: 8, minHeight: 'unset', borderRadius: '50%' }}
        >
          {user.darkMode ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        {/* Notifications (visual only) */}
        <button
          className="btn btn-ghost btn-sm"
          aria-label="Notifications"
          style={{ padding: 8, minHeight: 'unset', borderRadius: '50%', position: 'relative' }}
        >
          <Bell size={18} />
          <span style={{
            position: 'absolute', top: 4, right: 4,
            width: 8, height: 8, borderRadius: '50%',
            background: 'var(--error)', border: '2px solid var(--surface)',
          }} aria-hidden="true" />
        </button>

        {/* Avatar */}
        <div style={{
          width: 34, height: 34, borderRadius: '50%',
          background: 'linear-gradient(135deg, #EEF2FF, #C7D2FE)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 16, cursor: 'pointer', marginLeft: 4,
          border: '2px solid var(--primary)',
        }}
          title={user.name}
          role="button"
          tabIndex={0}
          onClick={() => navigate('/settings')}
          onKeyDown={(e) => e.key === 'Enter' && navigate('/settings')}
          aria-label="Open settings"
        >
          {user.avatar}
        </div>
      </div>
    </header>
  );
}
