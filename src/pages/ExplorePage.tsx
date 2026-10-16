import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, ChevronRight, BookOpen, CheckCircle2 } from 'lucide-react';
import { languages, topics } from '../data';
import { useApp } from '../context/AppContext';
import { getMasteryLabel, getMasteryColor } from '../utils/mastery';

export default function ExplorePage() {
  const { state } = useApp();
  const { user } = state;
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLang, setSelectedLang] = useState<string>('all');
  const [selectedLevel, setSelectedLevel] = useState<string>('all');
  const [view, setView] = useState<'languages' | 'topics'>('languages');

  const filteredTopics = useMemo(() => {
    return topics.filter((t) => {
      const matchLang = selectedLang === 'all' || t.languageId === selectedLang;
      const matchLevel = selectedLevel === 'all' || t.difficulty === selectedLevel;
      const matchSearch =
        !searchQuery ||
        t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchLang && matchLevel && matchSearch;
    });
  }, [searchQuery, selectedLang, selectedLevel]);

  const filteredLanguages = useMemo(() => {
    if (!searchQuery) return languages;
    return languages.filter((l) =>
      l.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  const getCompletedCount = (langId: string) => {
    return topics.filter(
      (t) => t.languageId === langId && user.completedTopics.includes(t.id)
    ).length;
  };

  const getTotalCount = (langId: string) => topics.filter((t) => t.languageId === langId).length;

  return (
    <div className="page-content" style={{ margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: 20 }}>
        <h1 style={{ fontSize: 28, fontWeight: 800, color: 'var(--text-primary)', marginBottom: 4 }}>
          Explore
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: 15 }}>
          Discover languages, topics, and learning paths
        </p>
      </div>

      {/* Search + filters */}
      <div className="card" style={{ marginBottom: 20 }}>
        <div style={{ position: 'relative', marginBottom: 14 }}>
          <Search size={16} style={{
            position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)',
            color: 'var(--text-muted)', pointerEvents: 'none',
          }} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search languages, topics, or concepts..."
            aria-label="Search"
            style={{ paddingLeft: 36 }}
          />
        </div>

        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
          <Filter size={15} color="var(--text-muted)" />

          {/* View toggle */}
          <div className="tab-bar" style={{ flex: 'none' }}>
            <button className={`tab-btn ${view === 'languages' ? 'active' : ''}`} onClick={() => setView('languages')}>
              Languages
            </button>
            <button className={`tab-btn ${view === 'topics' ? 'active' : ''}`} onClick={() => setView('topics')}>
              Topics
            </button>
          </div>

          {/* Level filter */}
          <select
            value={selectedLevel}
            onChange={(e) => setSelectedLevel(e.target.value)}
            style={{ width: 'auto', flex: 'none', minWidth: 120 }}
            aria-label="Filter by level"
          >
            <option value="all">All Levels</option>
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>

          {/* Language filter (only in topics view) */}
          {view === 'topics' && (
            <select
              value={selectedLang}
              onChange={(e) => setSelectedLang(e.target.value)}
              style={{ width: 'auto', flex: 'none', minWidth: 130 }}
              aria-label="Filter by language"
            >
              <option value="all">All Languages</option>
              {languages.map((l) => (
                <option key={l.id} value={l.id}>{l.name}</option>
              ))}
            </select>
          )}

          <span style={{ fontSize: 13, color: 'var(--text-muted)', marginLeft: 'auto' }}>
            {view === 'languages' ? `${filteredLanguages.length} languages` : `${filteredTopics.length} topics`}
          </span>
        </div>
      </div>

      {/* Languages grid */}
      {view === 'languages' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
          {filteredLanguages.map((lang) => {
            const completed = getCompletedCount(lang.id);
            const total = getTotalCount(lang.id);
            const percent = total > 0 ? Math.round((completed / total) * 100) : 0;

            return (
              <div
                key={lang.id}
                className="card card-hover animate-fadeIn"
                style={{ cursor: 'pointer', borderTop: `3px solid ${lang.color}` }}
                onClick={() => {
                  setView('topics');
                  setSelectedLang(lang.id);
                }}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && (setView('topics'), setSelectedLang(lang.id))}
                aria-label={`Explore ${lang.name}`}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14, marginBottom: 14 }}>
                  <div style={{
                    width: 52, height: 52, borderRadius: 12,
                    background: lang.bgColor, display: 'flex',
                    alignItems: 'center', justifyContent: 'center', fontSize: 28, flexShrink: 0,
                  }}>
                    {lang.icon}
                  </div>
                  <div style={{ flex: 1 }}>
                    <h3 style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 2 }}>
                      {lang.name}
                    </h3>
                    <span style={{ fontSize: 11, color: lang.color, fontWeight: 600 }}>{lang.level}</span>
                  </div>
                </div>

                <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 14, lineHeight: 1.6 }}>
                  {lang.description}
                </p>

                {/* Progress */}
                <div style={{ marginBottom: 14 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'var(--text-muted)', marginBottom: 6 }}>
                    <span>{completed}/{total} topics done</span>
                    <span>{percent}%</span>
                  </div>
                  <div className="progress-bar">
                    <div
                      className="progress-fill"
                      style={{ width: `${percent}%`, background: lang.color }}
                    />
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                    {total} topics available
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 13, color: 'var(--primary)', fontWeight: 600 }}>
                    Explore <ChevronRight size={14} />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Topics grid */}
      {view === 'topics' && (
        <div>
          {filteredTopics.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-muted)' }}>
              <span style={{ fontSize: 40 }}>🔍</span>
              <p style={{ marginTop: 12, fontSize: 15 }}>No topics found. Try adjusting your filters.</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 14 }}>
              {filteredTopics.map((topic) => {
                const lang = languages.find((l) => l.id === topic.languageId);
                const progress = user.topicProgress[topic.id];
                const isCompleted = user.completedTopics.includes(topic.id);

                return (
                  <div
                    key={topic.id}
                    className="card card-hover animate-fadeIn"
                    style={{ cursor: 'pointer', position: 'relative' }}
                    onClick={() => navigate(`/learn?topic=${topic.id}`)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => e.key === 'Enter' && navigate(`/learn?topic=${topic.id}`)}
                    aria-label={`Learn ${topic.title}`}
                  >
                    {isCompleted && (
                      <div style={{ position: 'absolute', top: 12, right: 12 }}>
                        <CheckCircle2 size={18} color="var(--success)" />
                      </div>
                    )}

                    <div style={{ display: 'flex', gap: 10, marginBottom: 10 }}>
                      <span style={{ fontSize: 20 }}>{lang?.icon}</span>
                      <div>
                        <span style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 500 }}>
                          {lang?.name}
                        </span>
                        <div style={{ display: 'flex', gap: 6, marginTop: 2 }}>
                          <span className={`badge badge-${topic.difficulty}`}>{topic.difficulty}</span>
                          {progress && (
                            <span className={`badge ${getMasteryColor(progress.mastery)}`}>
                              {getMasteryLabel(progress.mastery)}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <h3 style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 6 }}>
                      {topic.title}
                    </h3>
                    <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 12, lineHeight: 1.5 }}>
                      {topic.description}
                    </p>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 12, color: 'var(--text-muted)' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                        <BookOpen size={12} />
                        {topic.estimatedMinutes} min
                      </span>
                      <span>+{topic.xpReward} XP</span>
                      {topic.prerequisites.length > 0 && (
                        <span>Prereqs: {topic.prerequisites.length}</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
