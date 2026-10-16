import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ChevronLeft, ChevronRight, BookOpen, CheckCircle2, Lock } from 'lucide-react';
import { topics, lessons, questions as allQuestions, languages } from '../data';
import { useApp } from '../context/AppContext';
import { getMasteryLabel, getMasteryColor } from '../utils/mastery';
import LessonViewer from '../components/LessonViewer';
import QuizEngine from '../components/QuizEngine';
import QuizResults from '../components/QuizResults';

type View = 'topic-list' | 'lesson' | 'quiz' | 'results';

export default function LearnPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { state, unlockAchievement } = useApp();
  const { user } = state;
  const navigate = useNavigate();

  const [view, setView] = useState<View>('topic-list');
  const [selectedTopicId, setSelectedTopicId] = useState<string | null>(
    searchParams.get('topic')
  );
  const [quizScore, setQuizScore] = useState(0);
  const [quizTotal, setQuizTotal] = useState(0);
  const [quizXP, setQuizXP] = useState(0);

  // React when URL param changes
  useEffect(() => {
    const topicParam = searchParams.get('topic');
    if (topicParam) {
      setSelectedTopicId(topicParam);
      setView('lesson');
    }
  }, [searchParams]);

  const selectedTopic = topics.find((t) => t.id === selectedTopicId);
  const selectedLesson = selectedTopic ? lessons.find((l) => l.topicId === selectedTopicId) : null;
  const topicQuestions = selectedTopicId
    ? allQuestions.filter((q) => q.topicId === selectedTopicId)
    : [];

  const selectedLangId = user.selectedLanguage;
  const langTopics = topics
    .filter((t) => t.languageId === selectedLangId)
    .sort((a, b) => a.order - b.order);
  const lang = languages.find((l) => l.id === selectedLangId);

  const handleTopicSelect = (topicId: string) => {
    setSelectedTopicId(topicId);
    setSearchParams({ topic: topicId });
    setView('lesson');
    unlockAchievement('explorer');
  };

  const handleLessonComplete = () => {
    unlockAchievement('first-lesson');
    if (topicQuestions.length > 0) setView('quiz');
  };

  const handleQuizComplete = (score: number, total: number, xpEarned: number) => {
    setQuizScore(score);
    setQuizTotal(total);
    setQuizXP(xpEarned);
    setView('results');
  };

  const handleResultsContinue = () => {
    // Move to next topic
    if (!selectedTopic) { setView('topic-list'); return; }
    const idx = langTopics.findIndex((t) => t.id === selectedTopicId);
    const nextTopic = langTopics[idx + 1];
    if (nextTopic) {
      handleTopicSelect(nextTopic.id);
    } else {
      setView('topic-list');
      setSelectedTopicId(null);
    }
  };

  const isTopicLocked = (topic: typeof langTopics[0]): boolean => {
    return topic.prerequisites.some(
      (prereqId) =>
        !user.completedTopics.includes(prereqId) &&
        user.topicProgress[prereqId]?.mastery !== 'mastered'
    );
  };

  if (view === 'lesson' && selectedTopic && selectedLesson) {
    return (
      <div className="page-content" style={{ margin: '0 auto' }}>
        <button
          className="btn btn-ghost btn-sm"
          style={{ marginBottom: 16 }}
          onClick={() => { setView('topic-list'); setSearchParams({}); }}
        >
          <ChevronLeft size={15} /> Back to Topics
        </button>
        <LessonViewer
          lesson={selectedLesson}
          topic={selectedTopic}
          onComplete={handleLessonComplete}
          onStartQuiz={() => setView('quiz')}
        />
      </div>
    );
  }

  if (view === 'lesson' && selectedTopic && !selectedLesson) {
    return (
      <div className="page-content" style={{ margin: '0 auto' }}>
        <button className="btn btn-ghost btn-sm" style={{ marginBottom: 16 }} onClick={() => setView('topic-list')}>
          <ChevronLeft size={15} /> Back
        </button>
        <div className="card" style={{ textAlign: 'center', padding: '40px 20px' }}>
          <p style={{ color: 'var(--text-muted)', marginBottom: 16 }}>
            Detailed lesson content for <strong>{selectedTopic.title}</strong> is being added soon.
          </p>
          <p style={{ fontSize: 14, color: 'var(--text-secondary)', marginBottom: 20 }}>
            {selectedTopic.description}
          </p>
          {topicQuestions.length > 0 ? (
            <button className="btn btn-primary" onClick={() => setView('quiz')}>
              Jump to Quiz →
            </button>
          ) : (
            <button className="btn btn-secondary" onClick={() => setView('topic-list')}>
              Choose Another Topic
            </button>
          )}
        </div>
      </div>
    );
  }

  if (view === 'quiz') {
    if (topicQuestions.length === 0) {
      return (
        <div className="page-content" style={{ margin: '0 auto' }}>
          <div className="card" style={{ textAlign: 'center', padding: '40px' }}>
            <p style={{ color: 'var(--text-muted)', marginBottom: 16 }}>No quiz questions available for this topic yet.</p>
            <button className="btn btn-secondary" onClick={() => setView('lesson')}>Back to Lesson</button>
          </div>
        </div>
      );
    }
    return (
      <div className="page-content" style={{ margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
          <button className="btn btn-ghost btn-sm" onClick={() => setView('lesson')}>
            <ChevronLeft size={15} /> Back to Lesson
          </button>
          <h1 style={{ fontSize: 20, fontWeight: 700, color: 'var(--text-primary)' }}>
            Quiz: {selectedTopic?.title}
          </h1>
        </div>
        <QuizEngine
          questions={topicQuestions}
          topicId={selectedTopicId!}
          onComplete={handleQuizComplete}
        />
      </div>
    );
  }

  if (view === 'results' && selectedTopic) {
    return (
      <div className="page-content" style={{ margin: '0 auto' }}>
        <QuizResults
          score={quizScore}
          total={quizTotal}
          xpEarned={quizXP}
          topicTitle={selectedTopic.title}
          onRetry={() => setView('quiz')}
          onContinue={handleResultsContinue}
          onLearn={() => setView('lesson')}
        />
      </div>
    );
  }

  // Topic list view
  return (
    <div className="page-content" style={{ margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: 20 }}>
        <h1 style={{ fontSize: 28, fontWeight: 800, color: 'var(--text-primary)', marginBottom: 4 }}>
          Learn
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: 15 }}>
          Guided lessons with examples and quizzes
        </p>
      </div>

      {/* Language tabs */}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 20 }}>
        {languages.map((l) => (
          <button
            key={l.id}
            className={`btn btn-sm ${user.selectedLanguage === l.id ? 'btn-primary' : 'btn-ghost'}`}
            onClick={() => navigate(`/learn`)}
            style={{ opacity: user.selectedLanguage === l.id ? 1 : 0.7 }}
          >
            {l.icon} {l.name}
          </button>
        ))}
      </div>

      {/* Current language header */}
      {lang && (
        <div className="card" style={{ marginBottom: 20, display: 'flex', gap: 16, alignItems: 'center', borderTop: `3px solid ${lang.color}` }}>
          <div style={{
            width: 56, height: 56, borderRadius: 12,
            background: lang.bgColor, display: 'flex',
            alignItems: 'center', justifyContent: 'center', fontSize: 30, flexShrink: 0,
          }}>
            {lang.icon}
          </div>
          <div>
            <h2 style={{ fontSize: 20, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 4 }}>
              {lang.name}
            </h2>
            <p style={{ fontSize: 14, color: 'var(--text-secondary)' }}>{lang.description}</p>
          </div>
        </div>
      )}

      {/* Topic list */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {langTopics.map((topic, idx) => {
          const locked = isTopicLocked(topic);
          const progress = user.topicProgress[topic.id];
          const isCompleted = user.completedTopics.includes(topic.id);
          const hasLesson = lessons.some((l) => l.topicId === topic.id);
          const hasQuiz = allQuestions.some((q) => q.topicId === topic.id);

          return (
            <div
              key={topic.id}
              className={`card ${!locked ? 'card-hover' : ''}`}
              style={{
                cursor: locked ? 'not-allowed' : 'pointer',
                opacity: locked ? 0.6 : 1,
                borderLeft: isCompleted ? '3px solid var(--success)' : locked ? '3px solid var(--border)' : '3px solid var(--primary)',
                display: 'flex', alignItems: 'center', gap: 16,
              }}
              onClick={() => !locked && handleTopicSelect(topic.id)}
              role="button"
              tabIndex={locked ? undefined : 0}
              onKeyDown={(e) => !locked && e.key === 'Enter' && handleTopicSelect(topic.id)}
              aria-label={locked ? `${topic.title} — locked` : `Start ${topic.title}`}
              aria-disabled={locked}
            >
              {/* Step number */}
              <div style={{
                width: 36, height: 36, borderRadius: '50%', flexShrink: 0,
                background: isCompleted ? 'var(--success)' : locked ? 'var(--border)' : 'rgba(79,70,229,0.1)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: isCompleted ? 'white' : locked ? 'var(--text-muted)' : 'var(--primary)',
                fontWeight: 700, fontSize: 14,
              }}>
                {isCompleted ? <CheckCircle2 size={18} /> : locked ? <Lock size={16} /> : idx + 1}
              </div>

              {/* Info */}
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', gap: 8, marginBottom: 4, flexWrap: 'wrap' }}>
                  <h3 style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-primary)', margin: 0 }}>
                    {topic.title}
                  </h3>
                  <span className={`badge badge-${topic.difficulty}`}>{topic.difficulty}</span>
                  {progress && !isCompleted && (
                    <span className={`badge ${getMasteryColor(progress.mastery)}`}>
                      {getMasteryLabel(progress.mastery)}
                    </span>
                  )}
                </div>
                <p style={{ fontSize: 13, color: 'var(--text-secondary)', margin: 0 }}>
                  {topic.description}
                </p>
                <div style={{ display: 'flex', gap: 12, marginTop: 6, fontSize: 12, color: 'var(--text-muted)' }}>
                  <span>⏱ {topic.estimatedMinutes} min</span>
                  <span>⚡ +{topic.xpReward} XP</span>
                  {hasLesson && <span>📗 Lesson</span>}
                  {hasQuiz && <span>🎯 Quiz</span>}
                </div>
              </div>

              {/* Arrow */}
              {!locked && (
                <ChevronRight size={18} color="var(--text-muted)" style={{ flexShrink: 0 }} />
              )}
            </div>
          );
        })}

        {langTopics.length === 0 && (
          <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-muted)' }}>
            <p>No topics available for this language yet.</p>
            <button
              className="btn btn-primary"
              style={{ marginTop: 12 }}
              onClick={() => navigate('/explore')}
            >
              Explore all languages
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
