import React, { useState, useMemo } from 'react';
import { Code2, Shuffle, Clock, Target, Filter, ChevronRight } from 'lucide-react';
import { topics, questions as allQuestions, languages } from '../data';
import { useApp } from '../context/AppContext';
import { getWeakTopics } from '../utils/mastery';
import QuizEngine from '../components/QuizEngine';
import QuizResults from '../components/QuizResults';

type Mode = 'select' | 'quiz' | 'results';

export default function PracticePage() {
  const { state } = useApp();
  const { user } = state;

  const [mode, setMode] = useState<Mode>('select');
  const [selectedTopicId, setSelectedTopicId] = useState<string>('');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [selectedLang, setSelectedLang] = useState<string>(user.selectedLanguage);
  const [practiceType, setPracticeType] = useState<string>('all');
  const [quizScore, setQuizScore] = useState(0);
  const [quizTotal, setQuizTotal] = useState(0);
  const [quizXP, setQuizXP] = useState(0);
  const [practiceQuestions, setPracticeQuestions] = useState(allQuestions.slice(0, 5));

  const weakTopicIds = getWeakTopics(user.topicProgress, selectedLang);

  const filteredQuestions = useMemo(() => {
    return allQuestions.filter((q) => {
      const matchLang = selectedLang === 'all' || q.languageId === selectedLang;
      const matchDiff = selectedDifficulty === 'all' || q.difficulty === selectedDifficulty;
      const matchType = practiceType === 'all' || q.type === practiceType;
      const matchTopic = !selectedTopicId || q.topicId === selectedTopicId;
      return matchLang && matchDiff && matchType && matchTopic;
    });
  }, [selectedLang, selectedDifficulty, practiceType, selectedTopicId]);

  const startPractice = (qs = filteredQuestions) => {
    if (qs.length === 0) return;
    // Shuffle
    const shuffled = [...qs].sort(() => Math.random() - 0.5).slice(0, 10);
    setPracticeQuestions(shuffled);
    setMode('quiz');
  };

  const startWeakConcepts = () => {
    const weakQs = allQuestions.filter((q) =>
      weakTopicIds.includes(q.topicId)
    );
    startPractice(weakQs.length > 0 ? weakQs : allQuestions.slice(0, 5));
  };

  const startDailyChallenge = () => {
    // Deterministic "daily" selection based on date
    const day = new Date().getDate();
    const dailyQs = [...allQuestions]
      .sort((a, b) => a.id.localeCompare(b.id))
      .filter((_, i) => i % 3 === day % 3)
      .slice(0, 5);
    setPracticeQuestions(dailyQs.length > 0 ? dailyQs : allQuestions.slice(0, 5));
    setMode('quiz');
  };

  if (mode === 'quiz') {
    return (
      <div className="page-content" style={{ margin: '0 auto' }}>
        <button
          className="btn btn-ghost btn-sm"
          style={{ marginBottom: 16 }}
          onClick={() => setMode('select')}
        >
          ← Back
        </button>
        <h1 style={{ fontSize: 22, fontWeight: 700, marginBottom: 20, color: 'var(--text-primary)' }}>
          Practice Session
        </h1>
        <QuizEngine
          questions={practiceQuestions}
          topicId={practiceQuestions[0]?.topicId || 'practice'}
          onComplete={(s, t, x) => { setQuizScore(s); setQuizTotal(t); setQuizXP(x); setMode('results'); }}
        />
      </div>
    );
  }

  if (mode === 'results') {
    return (
      <div className="page-content" style={{ margin: '0 auto' }}>
        <QuizResults
          score={quizScore}
          total={quizTotal}
          xpEarned={quizXP}
          topicTitle="Practice Session"
          onRetry={() => startPractice()}
          onContinue={() => setMode('select')}
          onLearn={() => setMode('select')}
        />
      </div>
    );
  }

  return (
    <div className="page-content" style={{ margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: 20 }}>
        <h1 style={{ fontSize: 28, fontWeight: 800, color: 'var(--text-primary)', marginBottom: 4 }}>
          Practice
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: 15 }}>
          Reinforce your knowledge with targeted exercises
        </p>
      </div>

      {/* Quick start cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 14, marginBottom: 24 }}>
        <QuickCard
          icon="🎯"
          title="Daily Challenge"
          desc="5 fresh questions every day"
          color="#4F46E5"
          onClick={startDailyChallenge}
        />
        <QuickCard
          icon="⚠️"
          title="Weak Concepts"
          desc={weakTopicIds.length > 0 ? `${weakTopicIds.length} topics need practice` : 'Great job — no weak spots!'}
          color="#D97706"
          onClick={startWeakConcepts}
          disabled={weakTopicIds.length === 0}
        />
        <QuickCard
          icon="🎲"
          title="Random Practice"
          desc="Shuffle and go — surprise yourself"
          color="#7C3AED"
          onClick={() => startPractice()}
        />
        <QuickCard
          icon="⏱"
          title="Timed Challenge"
          desc="Answer as many as you can quickly"
          color="#16A34A"
          onClick={() => startPractice(allQuestions.slice(0, 10))}
        />
      </div>

      {/* Custom practice */}
      <div className="card" style={{ marginBottom: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
          <Filter size={16} color="var(--primary)" />
          <h2 style={{ fontSize: 16, fontWeight: 600, color: 'var(--text-primary)' }}>
            Custom Practice Session
          </h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 12, marginBottom: 16 }}>
          <div>
            <label style={{ fontSize: 12, fontWeight: 500, color: 'var(--text-secondary)', marginBottom: 6, display: 'block' }}>
              Language
            </label>
            <select
              value={selectedLang}
              onChange={(e) => { setSelectedLang(e.target.value); setSelectedTopicId(''); }}
              aria-label="Select language"
            >
              <option value="all">All Languages</option>
              {languages.map((l) => <option key={l.id} value={l.id}>{l.name}</option>)}
            </select>
          </div>

          <div>
            <label style={{ fontSize: 12, fontWeight: 500, color: 'var(--text-secondary)', marginBottom: 6, display: 'block' }}>
              Difficulty
            </label>
            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              aria-label="Select difficulty"
            >
              <option value="all">All Levels</option>
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
          </div>

          <div>
            <label style={{ fontSize: 12, fontWeight: 500, color: 'var(--text-secondary)', marginBottom: 6, display: 'block' }}>
              Question Type
            </label>
            <select
              value={practiceType}
              onChange={(e) => setPracticeType(e.target.value)}
              aria-label="Select question type"
            >
              <option value="all">All Types</option>
              <option value="mcq">Multiple Choice</option>
              <option value="code-output">Code Output</option>
              <option value="find-bug">Find the Bug</option>
              <option value="conceptual">Conceptual</option>
              <option value="fill-blank">Fill in the Blank</option>
            </select>
          </div>

          <div>
            <label style={{ fontSize: 12, fontWeight: 500, color: 'var(--text-secondary)', marginBottom: 6, display: 'block' }}>
              Topic
            </label>
            <select
              value={selectedTopicId}
              onChange={(e) => setSelectedTopicId(e.target.value)}
              aria-label="Select topic"
            >
              <option value="">All Topics</option>
              {topics
                .filter((t) => selectedLang === 'all' || t.languageId === selectedLang)
                .map((t) => (
                  <option key={t.id} value={t.id}>{t.title}</option>
                ))}
            </select>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
          <p style={{ fontSize: 14, color: 'var(--text-muted)' }}>
            {filteredQuestions.length} questions match your filters
          </p>
          <button
            className="btn btn-primary"
            onClick={() => startPractice()}
            disabled={filteredQuestions.length === 0}
          >
            <Code2 size={16} />
            Start Practice ({Math.min(filteredQuestions.length, 10)} questions)
          </button>
        </div>
      </div>

      {/* Question preview list */}
      <div className="card">
        <h2 style={{ fontSize: 16, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 14 }}>
          Available Questions
        </h2>
        {filteredQuestions.length === 0 ? (
          <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>No questions match your filters.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {filteredQuestions.slice(0, 8).map((q) => {
              const topic = topics.find((t) => t.id === q.topicId);
              const lang = languages.find((l) => l.id === q.languageId);
              return (
                <div
                  key={q.id}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 12, padding: '10px 12px',
                    background: 'var(--bg)', borderRadius: 8, border: '1px solid var(--border)',
                  }}
                >
                  <span style={{ fontSize: 16 }}>{lang?.icon}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-primary)' }}>
                      {q.text.split('\n')[0].slice(0, 60)}...
                    </div>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                      {topic?.title} · {q.type} · {q.difficulty}
                    </div>
                  </div>
                  <span style={{ fontSize: 12, color: 'var(--primary)', fontWeight: 600 }}>+{q.xpReward} XP</span>
                </div>
              );
            })}
            {filteredQuestions.length > 8 && (
              <p style={{ fontSize: 13, color: 'var(--text-muted)', textAlign: 'center', marginTop: 4 }}>
                +{filteredQuestions.length - 8} more questions available
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function QuickCard({
  icon, title, desc, color, onClick, disabled
}: { icon: string; title: string; desc: string; color: string; onClick: () => void; disabled?: boolean }) {
  return (
    <button
      className="card card-hover"
      style={{
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.5 : 1,
        border: 'none', textAlign: 'left',
        borderTop: `3px solid ${color}`,
        background: `rgba(${hexToRgb(color)}, 0.03)`,
      }}
      onClick={!disabled ? onClick : undefined}
      disabled={disabled}
    >
      <div style={{ fontSize: 28, marginBottom: 10 }}>{icon}</div>
      <div style={{ fontWeight: 700, fontSize: 15, color: 'var(--text-primary)', marginBottom: 4 }}>{title}</div>
      <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{desc}</div>
    </button>
  );
}

function hexToRgb(hex: string): string {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return '0,0,0';
  return `${parseInt(result[1], 16)},${parseInt(result[2], 16)},${parseInt(result[3], 16)}`;
}
