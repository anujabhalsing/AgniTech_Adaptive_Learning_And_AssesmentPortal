import React, { useState } from 'react';
import { BarChart2, TrendingUp, Target, Award, Clock } from 'lucide-react';
import { topics, languages, questions as allQuestions } from '../data';
import { useApp } from '../context/AppContext';
import { getMasteryLabel, getMasteryColor, getXPProgress } from '../utils/mastery';

export default function ProgressPage() {
  const { state } = useApp();
  const { user } = state;
  const [selectedLang, setSelectedLang] = useState(user.selectedLanguage);
  const xpProgress = getXPProgress(user.xp);

  const langTopics = topics.filter((t) => t.languageId === selectedLang).sort((a, b) => a.order - b.order);
  const lang = languages.find((l) => l.id === selectedLang);

  const totalAttempted = Object.values(user.topicProgress).reduce((s, p) => s + p.questionsAttempted, 0);
  const totalCorrect = Object.values(user.topicProgress).reduce((s, p) => s + p.questionsCorrect, 0);
  const totalHints = Object.values(user.topicProgress).reduce((s, p) => s + p.hintsUsed, 0);
  const accuracy = totalAttempted > 0 ? Math.round((totalCorrect / totalAttempted) * 100) : 0;

  const masteredCount = Object.values(user.topicProgress).filter((p) => p.mastery === 'mastered').length;
  const learningCount = Object.values(user.topicProgress).filter((p) => p.mastery === 'learning').length;
  const needsPracticeCount = Object.values(user.topicProgress).filter((p) => p.mastery === 'needs-practice').length;

  return (
    <div className="page-content" style={{ margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: 20 }}>
        <h1 style={{ fontSize: 28, fontWeight: 800, color: 'var(--text-primary)', marginBottom: 4 }}>
          My Progress
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: 15 }}>
          Track your estimated mastery and learning journey
        </p>
      </div>

      {/* Overall stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 12, marginBottom: 20 }}>
        <StatCard icon="⚡" value={`${user.xp}`} label="Total XP" color="#4F46E5" />
        <StatCard icon="📊" value={`${accuracy}%`} label="Accuracy" color="#16A34A" />
        <StatCard icon="🎯" value={`${totalCorrect}`} label="Correct" color="#7C3AED" />
        <StatCard icon="📚" value={`${user.completedTopics.length}`} label="Lessons Done" color="#D97706" />
        <StatCard icon="🔥" value={`${user.streak}`} label="Day Streak" color="#DC2626" />
        <StatCard icon="🏆" value={`${user.achievements.length}`} label="Badges" color="#16A34A" />
      </div>

      {/* Level progress */}
      <div className="card" style={{ marginBottom: 20 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <div>
            <h2 style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-primary)' }}>Level {user.level}</h2>
            <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>
              {xpProgress.current} / {xpProgress.required} XP to Level {user.level + 1}
            </p>
          </div>
          <div style={{
            width: 56, height: 56, borderRadius: '50%',
            background: 'linear-gradient(135deg, #4F46E5, #7C3AED)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'white', fontWeight: 800, fontSize: 20,
          }}>
            {user.level}
          </div>
        </div>
        <div className="progress-bar" style={{ height: 10 }}>
          <div
            className="progress-fill"
            style={{ width: `${xpProgress.percent}%`, background: 'linear-gradient(90deg, #4F46E5, #7C3AED)' }}
          />
        </div>
      </div>

      {/* Mastery breakdown */}
      <div className="card" style={{ marginBottom: 20 }}>
        <h2 style={{ fontSize: 16, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 14 }}>
          Mastery Overview
        </h2>
        <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 14 }}>
          Note: Mastery is an estimate based on your quiz performance and hint usage — not a guarantee of full understanding.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: 10 }}>
          <MasteryBlock label="Mastered" count={masteredCount} color="var(--success)" />
          <MasteryBlock label="Learning" count={learningCount} color="var(--primary)" />
          <MasteryBlock label="Needs Practice" count={needsPracticeCount} color="var(--warning)" />
          <MasteryBlock label="Not Started" count={Math.max(0, topics.length - masteredCount - learningCount - needsPracticeCount)} color="var(--text-muted)" />
        </div>
      </div>

      {/* Per-language breakdown */}
      <div className="card" style={{ marginBottom: 20 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
          <h2 style={{ fontSize: 16, fontWeight: 600, color: 'var(--text-primary)' }}>
            Topic Mastery — {lang?.name}
          </h2>
          <select
            value={selectedLang}
            onChange={(e) => setSelectedLang(e.target.value)}
            style={{ width: 'auto', fontSize: 13 }}
            aria-label="Select language"
          >
            {languages.map((l) => <option key={l.id} value={l.id}>{l.name}</option>)}
          </select>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {langTopics.map((topic) => {
            const progress = user.topicProgress[topic.id];
            const mastery = progress?.mastery || 'not-started';
            const score = progress?.masteryScore || 0;

            return (
              <div key={topic.id} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 140, flexShrink: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-primary)', marginBottom: 2 }}>
                    {topic.title}
                  </div>
                  <span className={`badge ${getMasteryColor(mastery)}`}>
                    {getMasteryLabel(mastery)}
                  </span>
                </div>
                <div style={{ flex: 1 }}>
                  <div className="progress-bar" style={{ height: 8 }}>
                    <div
                      className="progress-fill"
                      style={{
                        width: `${score}%`,
                        background: mastery === 'mastered' ? 'var(--success)'
                          : mastery === 'learning' ? 'var(--primary)'
                          : mastery === 'needs-practice' ? 'var(--warning)'
                          : 'var(--border)',
                      }}
                    />
                  </div>
                </div>
                <span style={{ width: 40, textAlign: 'right', fontSize: 13, color: 'var(--text-muted)' }}>
                  {score}%
                </span>
                {progress && (
                  <span style={{ fontSize: 11, color: 'var(--text-muted)', width: 60, textAlign: 'right' }}>
                    {progress.questionsCorrect}/{progress.questionsAttempted}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Concept map (simplified path) */}
      <div className="card" style={{ marginBottom: 20 }}>
        <h2 style={{ fontSize: 16, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 14 }}>
          Learning Path — {lang?.name}
        </h2>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 0, alignItems: 'center' }}>
          {langTopics.map((topic, idx) => {
            const progress = user.topicProgress[topic.id];
            const mastery = progress?.mastery || 'not-started';
            const isCompleted = user.completedTopics.includes(topic.id);

            const nodeColor = isCompleted
              ? 'var(--success)'
              : mastery === 'mastered' ? 'var(--success)'
              : mastery === 'learning' ? 'var(--primary)'
              : mastery === 'needs-practice' ? 'var(--warning)'
              : 'var(--border)';

            return (
              <React.Fragment key={topic.id}>
                <div style={{ textAlign: 'center', padding: '0 4px' }}>
                  <div style={{
                    width: 48, height: 48, borderRadius: '50%',
                    border: `3px solid ${nodeColor}`,
                    background: isCompleted ? nodeColor : 'var(--surface)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: isCompleted ? 'white' : nodeColor,
                    fontWeight: 700, fontSize: 14, margin: '0 auto 6px',
                  }}>
                    {isCompleted ? '✓' : idx + 1}
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--text-secondary)', maxWidth: 80, lineHeight: 1.3 }}>
                    {topic.title}
                  </div>
                </div>
                {idx < langTopics.length - 1 && (
                  <div style={{ flex: 'none', color: 'var(--border)', fontSize: 20, paddingBottom: 20 }}>→</div>
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* Activity summary */}
      <div className="card">
        <h2 style={{ fontSize: 16, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 14 }}>
          Activity Summary
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 14 }}>
          <div style={{ padding: '14px', background: 'var(--bg)', borderRadius: 8 }}>
            <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 4 }}>Questions Attempted</div>
            <div style={{ fontSize: 24, fontWeight: 700, color: 'var(--text-primary)' }}>{totalAttempted}</div>
          </div>
          <div style={{ padding: '14px', background: 'var(--bg)', borderRadius: 8 }}>
            <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 4 }}>Correct Answers</div>
            <div style={{ fontSize: 24, fontWeight: 700, color: 'var(--success)' }}>{totalCorrect}</div>
          </div>
          <div style={{ padding: '14px', background: 'var(--bg)', borderRadius: 8 }}>
            <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 4 }}>Hints Used</div>
            <div style={{ fontSize: 24, fontWeight: 700, color: 'var(--warning)' }}>{totalHints}</div>
          </div>
          <div style={{ padding: '14px', background: 'var(--bg)', borderRadius: 8 }}>
            <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 4 }}>Overall Accuracy</div>
            <div style={{ fontSize: 24, fontWeight: 700, color: accuracy >= 70 ? 'var(--success)' : 'var(--warning)' }}>{accuracy}%</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, value, label, color }: { icon: string; value: string; label: string; color: string }) {
  return (
    <div className="card" style={{ textAlign: 'center', padding: 16 }}>
      <div style={{ fontSize: 22, marginBottom: 6 }}>{icon}</div>
      <div style={{ fontSize: 22, fontWeight: 800, color }}>{value}</div>
      <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>{label}</div>
    </div>
  );
}

function MasteryBlock({ label, count, color }: { label: string; count: number; color: string }) {
  return (
    <div style={{ textAlign: 'center', padding: '14px 10px', background: 'var(--bg)', borderRadius: 8 }}>
      <div style={{ fontSize: 24, fontWeight: 700, color }}>{count}</div>
      <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 4 }}>{label}</div>
    </div>
  );
}
