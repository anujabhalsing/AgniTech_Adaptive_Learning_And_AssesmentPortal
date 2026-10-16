import React, { useState, useMemo } from 'react';
import { Bookmark, BookmarkCheck, CheckCircle2, Filter, Search, Code2 } from 'lucide-react';
import { revisionCards } from '../data/revisionCards';
import { languages, topics } from '../data';
import { useApp } from '../context/AppContext';
import { RevisionCard } from '../types';
import CodeBlock from '../components/CodeBlock';

type FilterType = 'all' | 'bookmarked' | 'weak' | 'not-reviewed';

export default function RevisionCardsPage() {
  const { state, bookmarkCard, unbookmarkCard, markCardReviewed } = useApp();
  const { user } = state;

  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType]   = useState<FilterType>('all');
  const [selectedLang, setSelectedLang] = useState('all');
  const [selectedCard, setSelectedCard] = useState<RevisionCard | null>(null);
  const [flipped, setFlipped] = useState(false);

  // Determine which topic IDs are "weak" for the user
  const weakTopicIds = useMemo(() => {
    return Object.entries(user.topicProgress)
      .filter(([, p]) => p.mastery === 'needs-practice' || p.mastery === 'learning')
      .map(([id]) => id);
  }, [user.topicProgress]);

  const filtered = useMemo(() => {
    return revisionCards.filter((card) => {
      const matchLang = selectedLang === 'all' || card.languageId === selectedLang;
      const matchSearch = !searchQuery ||
        card.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        card.keyIdea.toLowerCase().includes(searchQuery.toLowerCase()) ||
        card.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchFilter =
        filterType === 'all'          ? true :
        filterType === 'bookmarked'   ? user.bookmarkedCards.includes(card.id) :
        filterType === 'weak'         ? weakTopicIds.includes(card.topicId) :
        filterType === 'not-reviewed' ? !user.reviewedCards.includes(card.id) :
        true;
      return matchLang && matchSearch && matchFilter;
    });
  }, [searchQuery, selectedLang, filterType, user.bookmarkedCards, user.reviewedCards, weakTopicIds]);

  const openCard = (card: RevisionCard) => {
    setSelectedCard(card);
    setFlipped(false);
  };

  const isBookmarked = (id: string) => user.bookmarkedCards.includes(id);
  const isReviewed   = (id: string) => user.reviewedCards.includes(id);

  if (selectedCard) {
    const lang = languages.find((l) => l.id === selectedCard.languageId);
    const langPref = user.learningLanguage;
    const idea = langPref === 'hinglish' && selectedCard.keyIdeaHinglish
      ? selectedCard.keyIdeaHinglish
      : selectedCard.keyIdea;

    return (
      <div className="page-content" style={{ margin: '0 auto', maxWidth: 680 }}>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 20, flexWrap: 'wrap' }}>
          <button className="btn btn-ghost btn-sm" onClick={() => setSelectedCard(null)}>
            ← Back to Cards
          </button>
          {langPref === 'hinglish' && selectedCard.keyIdeaHinglish && (
            <span style={{ fontSize: 12, color: '#7C3AED', background: '#F5F3FF', padding: '3px 8px', borderRadius: 4, fontWeight: 600 }}>
              Hinglish Mode
            </span>
          )}
        </div>

        {/* Sticky note card */}
        <div style={{
          background: cardBg(selectedCard.languageId),
          borderRadius: 16, padding: '28px 24px', marginBottom: 16,
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)', position: 'relative',
          borderTop: `4px solid ${lang?.color ?? 'var(--primary)'}`,
        }}>
          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
            <div>
              <div style={{ display: 'flex', gap: 8, marginBottom: 6 }}>
                <span style={{ fontSize: 18 }}>{lang?.icon}</span>
                <span className={`badge badge-${selectedCard.difficulty}`}>{selectedCard.difficulty}</span>
              </div>
              <h2 style={{ fontSize: 22, fontWeight: 800, color: 'var(--text-primary)' }}>
                {selectedCard.title}
              </h2>
            </div>
            <button
              className="btn btn-ghost btn-sm"
              onClick={() => isBookmarked(selectedCard.id) ? unbookmarkCard(selectedCard.id) : bookmarkCard(selectedCard.id)}
              aria-label={isBookmarked(selectedCard.id) ? 'Remove bookmark' : 'Bookmark this card'}
            >
              {isBookmarked(selectedCard.id)
                ? <BookmarkCheck size={18} color="var(--primary)" />
                : <Bookmark size={18} />}
            </button>
          </div>

          {/* Key idea */}
          <div style={{
            background: 'rgba(255,255,255,0.6)', borderRadius: 10, padding: '14px 16px', marginBottom: 16,
            border: '1px solid rgba(255,255,255,0.8)',
          }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: lang?.color ?? 'var(--primary)', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 6 }}>
              Key Idea
            </div>
            <p style={{ fontSize: 15, color: 'var(--text-primary)', margin: 0, lineHeight: 1.7 }}>{idea}</p>
          </div>

          {/* Code example */}
          {selectedCard.syntaxExample && (
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 6, fontWeight: 500 }}>
                Syntax / Example
              </div>
              <CodeBlock
                code={selectedCard.syntaxExample}
                language={selectedCard.language ?? selectedCard.languageId}
                showLineNumbers={false}
              />
            </div>
          )}

          {/* Common mistake */}
          <div style={{
            background: 'rgba(220,38,38,0.05)', border: '1px solid rgba(220,38,38,0.15)',
            borderRadius: 8, padding: '10px 14px', marginBottom: 12,
          }}>
            <div style={{ fontSize: 11, color: 'var(--error)', fontWeight: 600, marginBottom: 4 }}>⚠️ Common Mistake</div>
            <p style={{ fontSize: 13, color: 'var(--text-secondary)', margin: 0 }}>{selectedCard.commonMistake}</p>
          </div>

          {/* Memory tip */}
          {selectedCard.memoryTip && (
            <div style={{
              background: 'rgba(79,70,229,0.05)', border: '1px solid rgba(79,70,229,0.1)',
              borderRadius: 8, padding: '10px 14px',
            }}>
              <div style={{ fontSize: 11, color: 'var(--primary)', fontWeight: 600, marginBottom: 4 }}>💡 Memory Tip</div>
              <p style={{ fontSize: 13, color: 'var(--text-secondary)', margin: 0 }}>{selectedCard.memoryTip}</p>
            </div>
          )}
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', gap: 10 }}>
          <button
            className={`btn ${isReviewed(selectedCard.id) ? 'btn-success' : 'btn-primary'}`}
            style={{ flex: 1 }}
            onClick={() => {
              if (!isReviewed(selectedCard.id)) markCardReviewed(selectedCard.id);
              setSelectedCard(null);
            }}
          >
            {isReviewed(selectedCard.id) ? <CheckCircle2 size={15} /> : null}
            {isReviewed(selectedCard.id) ? 'Already Reviewed' : 'Mark as Reviewed ✓'}
          </button>
          <button className="btn btn-ghost" onClick={() => setSelectedCard(null)}>
            Next Card
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="page-content" style={{ margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: 20 }}>
        <h1 style={{ fontSize: 28, fontWeight: 800, color: 'var(--text-primary)', marginBottom: 4 }}>
          Revision Cards
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: 15 }}>
          Quick-reference cards for key concepts. Fast review, not full quizzes.
        </p>
      </div>

      {/* Stats row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: 10, marginBottom: 20 }}>
        <MiniStat label="Total Cards" value={revisionCards.length} icon="📚" />
        <MiniStat label="Reviewed"    value={user.reviewedCards.length} icon="✅" />
        <MiniStat label="Bookmarked"  value={user.bookmarkedCards.length} icon="🔖" />
        <MiniStat label="Weak Topics" value={weakTopicIds.length} icon="⚠️" />
      </div>

      {/* Filters */}
      <div className="card" style={{ marginBottom: 20 }}>
        <div style={{ position: 'relative', marginBottom: 12 }}>
          <Search size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none' }} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search cards…"
            style={{ paddingLeft: 36 }}
            aria-label="Search revision cards"
          />
        </div>

        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
          <Filter size={14} color="var(--text-muted)" />
          <div className="tab-bar" style={{ flex: 'none' }}>
            {(['all', 'weak', 'bookmarked', 'not-reviewed'] as FilterType[]).map((f) => (
              <button key={f} className={`tab-btn ${filterType === f ? 'active' : ''}`} onClick={() => setFilterType(f)}>
                {f === 'not-reviewed' ? 'Unseen' : f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>
          <select
            value={selectedLang}
            onChange={(e) => setSelectedLang(e.target.value)}
            style={{ width: 'auto', fontSize: 13 }}
            aria-label="Filter by language"
          >
            <option value="all">All Languages</option>
            {languages.map((l) => <option key={l.id} value={l.id}>{l.name}</option>)}
          </select>
          <span style={{ fontSize: 13, color: 'var(--text-muted)', marginLeft: 'auto' }}>
            {filtered.length} cards
          </span>
        </div>
      </div>

      {/* Cards grid */}
      {filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-muted)' }}>
          <p>No cards match your filters.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 14 }}>
          {filtered.map((card) => {
            const lang = languages.find((l) => l.id === card.languageId);
            const reviewed = isReviewed(card.id);
            const bookmarked = isBookmarked(card.id);

            return (
              <div
                key={card.id}
                className="card card-hover"
                style={{
                  cursor: 'pointer',
                  background: cardBg(card.languageId),
                  borderTop: `3px solid ${lang?.color ?? 'var(--primary)'}`,
                  opacity: reviewed ? 0.75 : 1,
                  position: 'relative',
                }}
                onClick={() => openCard(card)}
                role="button" tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && openCard(card)}
                aria-label={`Open revision card: ${card.title}`}
              >
                {/* Bookmark indicator */}
                {bookmarked && (
                  <div style={{ position: 'absolute', top: 10, right: 10 }}>
                    <BookmarkCheck size={16} color="var(--primary)" />
                  </div>
                )}
                {reviewed && (
                  <div style={{ position: 'absolute', top: 10, right: bookmarked ? 30 : 10 }}>
                    <CheckCircle2 size={14} color="var(--success)" />
                  </div>
                )}

                <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
                  <span style={{ fontSize: 16 }}>{lang?.icon}</span>
                  <span className={`badge badge-${card.difficulty}`}>{card.difficulty}</span>
                </div>

                <h3 style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 8 }}>
                  {card.title}
                </h3>
                <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 10 }}>
                  {(user.learningLanguage === 'hinglish' && card.keyIdeaHinglish
                    ? card.keyIdeaHinglish
                    : card.keyIdea
                  ).slice(0, 100)}
                  {card.keyIdea.length > 100 ? '…' : ''}
                </p>

                {/* Tags */}
                <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                  {card.tags.slice(0, 3).map((tag) => (
                    <span key={tag} style={{
                      fontSize: 11, color: 'var(--text-muted)', background: 'rgba(0,0,0,0.05)',
                      padding: '2px 6px', borderRadius: 4,
                    }}>{tag}</span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function MiniStat({ label, value, icon }: { label: string; value: number; icon: string }) {
  return (
    <div className="card" style={{ textAlign: 'center', padding: 14 }}>
      <div style={{ fontSize: 20, marginBottom: 4 }}>{icon}</div>
      <div style={{ fontSize: 20, fontWeight: 700, color: 'var(--text-primary)' }}>{value}</div>
      <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{label}</div>
    </div>
  );
}

const cardBgMap: Record<string, string> = {
  python:     'rgba(55,118,171,0.05)',
  java:       'rgba(237,139,0,0.05)',
  cpp:        'rgba(0,89,156,0.05)',
  javascript: 'rgba(247,223,30,0.05)',
  'html-css': 'rgba(227,79,38,0.05)',
  sql:        'rgba(51,103,145,0.05)',
  dsa:        'rgba(124,58,237,0.05)',
};

function cardBg(langId: string): string {
  return cardBgMap[langId] || 'var(--surface)';
}
