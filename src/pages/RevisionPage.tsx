import React, { useState, useMemo } from 'react';
import { RefreshCw, Clock, Target, AlertTriangle, ChevronRight } from 'lucide-react';
import { topics, questions as allQuestions, languages } from '../data';
import { useApp } from '../context/AppContext';
import { getWeakTopics, getRevisionTopics, getMasteryLabel, getMasteryColor } from '../utils/mastery';
import QuizEngine from '../components/QuizEngine';
import QuizResults from '../components/QuizResults';

type Mode = 'overview' | 'quiz' | 'results';

export default function RevisionPage() {
  const { state } = useApp();
  const { user } = state;

  const [mode, setMode] = useState<Mode>('overview');
  const [quizScore, setQuizScore] = useState(0);
  const [quizTotal, setQuizTotal] = useState(0);
  const [quizXP, setQuizXP] = useState(0);
  const [revisionQuestions, setRevisionQuestions] = useState(allQuestions.slice(0, 5));
  const [activeTopicId, setActiveTopicId] = useState('');

  const weakTopicIds = getWeakTopics(user.topicProgress);
  const revisionTopicIds = getRevisionTopics(user.topicProgress);

  const incorrectQuestions = useMemo(() => {
    const incorrectIds = new Set<string>();
    Object.values(user.topicProgress).forEach((progress) => {
      progress.attempts.filter((a) => !a.isCorrect).forEach((a) => {
        incorrectIds.add(a.questionId);
      });
    });
    return allQuestions.filter((q) => incorrectIds.has(q.id));
  }, [user.topicProgress]);

  const weakTopics = weakTopicIds
    .slice(0, 6)
    .map((id) => topics.find((t) => t.id === id))
    .filter(Boolean) as typeof topics;

  const revisionTopics = revisionTopicIds
    .slice(0, 4)
    .map((id) => topics.find((t) => t.id === id))
    .filter(Boolean) as typeof topics;

  const startRevisionForTopic = (topicId: string) => {
    const qs = allQuestions.filter((q) => q.topicId === topicId);
    if (qs.length === 0) return;
    setRevisionQuestions([...qs].sort(() => Math.random() - 0.5).slice(0, 5));
    setActiveTopicId(topicId);
    setMode('quiz');
  };

  const startMistakeReview = () => {
    if (incorrectQuestions.length === 0) return;
    setRevisionQuestions([...incorrectQuestions].sort(() => Math.random() - 0.5).slice(0, 10));
    setActiveTopicId('mistakes');
    setMode('quiz');
  };

  const startSpacedRevision = () => {
    const qs = allQuestions.filter((q) =>
      revisionTopicIds.slice(0, 3).includes(q.topicId)
    );
    if (qs.length === 0) {
      // No due topics — just do weak topics
      const weakQs = allQuestions.filter((q) => weakTopicIds.includes(q.topicId));
      setRevisionQuestions(weakQs.length > 0 ? weakQs.slice(0, 10) : allQuestions.slice(0, 5));
    } else {
      setRevisionQuestions(qs.slice(0, 10));
    }
    setMode('quiz');
  };

  if (mode === 'quiz') {
    return (
      <div className="page-content" style={{ margin: '0 auto' }}>
        <button className="btn btn-ghost btn-sm" style={{ marginBottom: 16 }} onClick={() => setMode('overview')}>
          ← Back
        </button>
        <h1 style={{ fontSize: 22, fontWeight: 700, marginBottom: 20, color: 'var(--text-primary)' }}>
          Revision Session
        </h1>
        <QuizEngine
          questions={revisionQuestions}
          topicId={activeTopicId}
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
          topicTitle="Revision Session"
          onRetry={() => setMode('quiz')}
          onContinue={() => setMode('overview')}
          onLearn={() => setMode('overview')}
        />
      </div>
    );
  }

  return (
    <div className="page-content" style={{ margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: 20 }}>
        <h1 style={{ fontSize: 28, fontWeight: 800, color: 'var(--text-primary)', marginBottom: 4 }}>
          Revision
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: 15 }}>
          Review past mistakes and strengthen weak concepts
        </p>
      </div>

      {/* Quick revision actions */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 14, marginBottom: 24 }}>
        <div
          className="card card-hover"
          style={{ cursor: 'pointer', borderTop: '3px solid #DC2626', background: 'rgba(220,38,38,0.03)' }}
          onClick={startMistakeReview}
          role="button" tabIndex={0}
          onKeyDown={(e) => e.key === 'Enter' && startMistakeReview()}
        >
          <div style={{ fontSize: 28, marginBottom: 10 }}>❌</div>
          <div style={{ fontWeight: 700, fontSize: 15, color: 'var(--text-primary)', marginBottom: 4 }}>
            Review My Mistakes
          </div>
          <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 8 }}>
            {incorrectQuestions.length} questions you got wrong
          </div>
          {incorrectQuestions.length > 0 ? (
            <span style={{ fontSize: 12, color: '#DC2626', fontWeight: 600 }}>
              Start reviewing →
            </span>
          ) : (
            <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>No mistakes yet 🎉</span>
          )}
        </div>

        <div
          className="card card-hover"
          style={{ cursor: 'pointer', borderTop: '3px solid #D97706', background: 'rgba(217,119,6,0.03)' }}
          onClick={startSpacedRevision}
          role="button" tabIndex={0}
          onKeyDown={(e) => e.key === 'Enter' && startSpacedRevision()}
        >
          <div style={{ fontSize: 28, marginBottom: 10 }}>📅</div>
          <div style={{ fontWeight: 700, fontSize: 15, color: 'var(--text-primary)', marginBottom: 4 }}>
            Spaced Revision
          </div>
          <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 8 }}>
            {revisionTopicIds.length} topics due for review
          </div>
          <span style={{ fontSize: 12, color: '#D97706', fontWeight: 600 }}>
            {revisionTopicIds.length > 0 ? 'Start review →' : 'All caught up! ✓'}
          </span>
        </div>

        <div
          className="card card-hover"
          style={{ cursor: weakTopics.length > 0 ? 'pointer' : 'default', borderTop: '3px solid #7C3AED', background: 'rgba(124,58,237,0.03)', opacity: weakTopics.length > 0 ? 1 : 0.6 }}
          onClick={() => weakTopics.length > 0 && weakTopics[0] && startRevisionForTopic(weakTopics[0].id)}
          role="button" tabIndex={weakTopics.length > 0 ? 0 : undefined}
        >
          <div style={{ fontSize: 28, marginBottom: 10 }}>🎯</div>
          <div style={{ fontWeight: 700, fontSize: 15, color: 'var(--text-primary)', marginBottom: 4 }}>
            Weakest Topic
          </div>
          <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 8 }}>
            {weakTopics[0]?.title || 'No weak topics'}
          </div>
          <span style={{ fontSize: 12, color: '#7C3AED', fontWeight: 600 }}>
            {weakTopics.length > 0 ? 'Focus here →' : 'Keep it up! 💪'}
          </span>
        </div>
      </div>

      {/* Revision schedule */}
      {revisionTopics.length > 0 && (
        <div className="card" style={{ marginBottom: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
            <Clock size={16} color="var(--warning)" />
            <h2 style={{ fontSize: 16, fontWeight: 600, color: 'var(--text-primary)' }}>
              Due for Review
            </h2>
          </div>
          <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 14 }}>
            These topics haven't been practised recently. A quick review helps lock them in.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {revisionTopics.map((topic) => {
              const progress = user.topicProgress[topic.id];
              const lang = languages.find((l) => l.id === topic.languageId);
              const daysSince = progress
                ? Math.floor((Date.now() - progress.lastAttempt) / 86400000)
                : 99;

              return (
                <div key={topic.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 12px', background: 'var(--bg)', borderRadius: 8, border: '1px solid var(--border)' }}>
                  <span style={{ fontSize: 18 }}>{lang?.icon}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 14, fontWeight: 500, color: 'var(--text-primary)' }}>{topic.title}</div>
                    <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                      Last studied: {daysSince} day{daysSince !== 1 ? 's' : ''} ago
                    </div>
                  </div>
                  {progress && (
                    <span className={`badge ${getMasteryColor(progress.mastery)}`}>
                      {getMasteryLabel(progress.mastery)}
                    </span>
                  )}
                  <button
                    className="btn btn-secondary btn-sm"
                    onClick={() => startRevisionForTopic(topic.id)}
                  >
                    Review <ChevronRight size={13} />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Weak concepts */}
      {weakTopics.length > 0 && (
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
            <AlertTriangle size={16} color="var(--warning)" />
            <h2 style={{ fontSize: 16, fontWeight: 600, color: 'var(--text-primary)' }}>
              Weak Concepts
            </h2>
          </div>
          <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 14 }}>
            Topics where your quiz performance suggests more practice is needed.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: 10 }}>
            {weakTopics.map((topic) => {
              const progress = user.topicProgress[topic.id];
              const lang = languages.find((l) => l.id === topic.languageId);
              return (
                <div key={topic.id} className="card" style={{ padding: '14px' }}>
                  <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
                    <span>{lang?.icon}</span>
                    {progress && (
                      <span className={`badge ${getMasteryColor(progress.mastery)}`}>
                        {getMasteryLabel(progress.mastery)}
                      </span>
                    )}
                  </div>
                  <h3 style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 4 }}>
                    {topic.title}
                  </h3>
                  {progress && (
                    <div style={{ marginBottom: 10 }}>
                      <div className="progress-bar" style={{ height: 4, marginBottom: 4 }}>
                        <div
                          className="progress-fill"
                          style={{ width: `${progress.masteryScore}%`, background: 'var(--warning)' }}
                        />
                      </div>
                      <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                        {progress.questionsCorrect}/{progress.questionsAttempted} correct
                      </div>
                    </div>
                  )}
                  <button
                    className="btn btn-secondary btn-sm"
                    style={{ width: '100%' }}
                    onClick={() => startRevisionForTopic(topic.id)}
                  >
                    Practise Now →
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Empty state */}
      {weakTopics.length === 0 && revisionTopics.length === 0 && incorrectQuestions.length === 0 && (
        <div className="card" style={{ textAlign: 'center', padding: '60px 20px' }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>🎉</div>
          <h2 style={{ fontSize: 20, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 8 }}>
            You're all caught up!
          </h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: 20 }}>
            No weak topics or overdue reviews. Keep learning to build your mastery.
          </p>
          <button className="btn btn-primary" onClick={() => window.location.href = '/learn'}>
            Learn Something New →
          </button>
        </div>
      )}
    </div>
  );
}
