import React, { useEffect } from 'react';
import { Trophy, Star, RefreshCw, BookOpen, ChevronRight, Zap } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { speakCustom } from '../utils/voice';

interface QuizResultsProps {
  score: number;
  total: number;
  xpEarned: number;
  topicTitle: string;
  onRetry: () => void;
  onContinue: () => void;
  onLearn: () => void;
}

export default function QuizResults({
  score, total, xpEarned, topicTitle, onRetry, onContinue, onLearn
}: QuizResultsProps) {
  const { state, unlockAchievement } = useApp();
  const percent = total > 0 ? Math.round((score / total) * 100) : 0;

  useEffect(() => {
    if (percent === 100) {
      unlockAchievement('perfect-quiz');
      speakCustom('Perfect score! Outstanding work!', state.user.voiceEnabled);
    } else if (percent >= 60) {
      speakCustom(`Good job! You got ${score} out of ${total} correct.`, state.user.voiceEnabled);
    } else {
      speakCustom('Keep practising — you will get there!', state.user.voiceEnabled);
    }
    if (score >= 5) unlockAchievement('five-correct');
  }, []);

  const getEmoji = () => {
    if (percent === 100) return '🏆';
    if (percent >= 80) return '🌟';
    if (percent >= 60) return '👍';
    if (percent >= 40) return '💪';
    return '📚';
  };

  const getMessage = () => {
    if (percent === 100) return 'Perfect Score! You nailed it!';
    if (percent >= 80) return 'Excellent work! Almost perfect!';
    if (percent >= 60) return 'Good job! Keep practising to reach mastery.';
    if (percent >= 40) return 'Nice effort! A bit more practice will do it.';
    return 'Keep going! Mistakes are how we learn.';
  };

  const getColor = () => {
    if (percent >= 80) return 'var(--success)';
    if (percent >= 60) return 'var(--primary)';
    if (percent >= 40) return 'var(--warning)';
    return 'var(--error)';
  };

  return (
    <div style={{ maxWidth: 520, margin: '0 auto', textAlign: 'center' }} className="animate-scaleIn">
      {/* Main result card */}
      <div className="card" style={{ padding: '36px 24px', marginBottom: 16 }}>
        {/* Big emoji */}
        <div style={{ fontSize: 64, marginBottom: 16, lineHeight: 1 }}>{getEmoji()}</div>

        {/* Score circle */}
        <div style={{ position: 'relative', display: 'inline-block', marginBottom: 20 }}>
          <svg width="120" height="120" viewBox="0 0 120 120">
            <circle cx="60" cy="60" r="54" fill="none" stroke="var(--border)" strokeWidth="8" />
            <circle
              cx="60" cy="60" r="54"
              fill="none"
              stroke={getColor()}
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={`${2 * Math.PI * 54}`}
              strokeDashoffset={`${2 * Math.PI * 54 * (1 - percent / 100)}`}
              transform="rotate(-90 60 60)"
              style={{ transition: 'stroke-dashoffset 1s ease' }}
            />
          </svg>
          <div style={{
            position: 'absolute', inset: 0,
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
          }}>
            <span style={{ fontSize: 28, fontWeight: 800, color: getColor() }}>{percent}%</span>
            <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{score}/{total}</span>
          </div>
        </div>

        <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 8, color: 'var(--text-primary)' }}>
          {getMessage()}
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: 14, marginBottom: 24 }}>
          Topic: <strong>{topicTitle}</strong>
        </p>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 24 }}>
          <StatBox icon="✅" value={`${score}/${total}`} label="Correct" />
          <StatBox icon="⚡" value={`+${xpEarned}`} label="XP Earned" highlight />
          <StatBox icon="📊" value={`${percent}%`} label="Accuracy" />
        </div>

        {/* Mastery note */}
        {percent < 70 && (
          <div style={{
            background: 'rgba(217,119,6,0.06)', border: '1px solid rgba(217,119,6,0.2)',
            borderRadius: 8, padding: '10px 14px', marginBottom: 20, textAlign: 'left',
          }}>
            <p style={{ fontSize: 13, color: 'var(--warning)', margin: 0 }}>
              💡 We recommend revisiting the lesson for <strong>{topicTitle}</strong> to strengthen your understanding before moving on.
            </p>
          </div>
        )}
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <button className="btn btn-primary btn-lg" style={{ width: '100%' }} onClick={onContinue}>
          Continue Learning <ChevronRight size={18} />
        </button>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          <button className="btn btn-secondary" onClick={onRetry}>
            <RefreshCw size={15} /> Retry Quiz
          </button>
          <button className="btn btn-ghost" onClick={onLearn}>
            <BookOpen size={15} /> Review Lesson
          </button>
        </div>
      </div>
    </div>
  );
}

function StatBox({ icon, value, label, highlight }: { icon: string; value: string; label: string; highlight?: boolean }) {
  return (
    <div style={{
      background: highlight ? 'rgba(79,70,229,0.06)' : 'var(--bg)',
      borderRadius: 10, padding: '12px 8px',
      border: `1px solid ${highlight ? 'rgba(79,70,229,0.15)' : 'var(--border)'}`,
    }}>
      <div style={{ fontSize: 20, marginBottom: 4 }}>{icon}</div>
      <div style={{ fontSize: 18, fontWeight: 700, color: highlight ? 'var(--primary)' : 'var(--text-primary)' }}>
        {value}
      </div>
      <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{label}</div>
    </div>
  );
}
