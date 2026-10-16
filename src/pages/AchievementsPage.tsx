import React from 'react';
import { Trophy, Lock } from 'lucide-react';
import { achievements as allAchievements } from '../data';
import { useApp } from '../context/AppContext';

export default function AchievementsPage() {
  const { state } = useApp();
  const { user } = state;

  const unlocked = allAchievements.filter((a) => user.achievements.includes(a.id));
  const locked = allAchievements.filter((a) => !user.achievements.includes(a.id));

  return (
    <div className="page-content" style={{ margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: 20 }}>
        <h1 style={{ fontSize: 28, fontWeight: 800, color: 'var(--text-primary)', marginBottom: 4 }}>
          Achievements
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: 15 }}>
          {unlocked.length} of {allAchievements.length} badges unlocked
        </p>
      </div>

      {/* Progress overview */}
      <div className="card" style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 12 }}>
          <div style={{ fontSize: 40 }}>🏆</div>
          <div>
            <h2 style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 4 }}>
              Badge Collection
            </h2>
            <p style={{ fontSize: 14, color: 'var(--text-secondary)' }}>
              Earn badges by completing activities and reaching milestones
            </p>
          </div>
        </div>
        <div className="progress-bar" style={{ height: 10 }}>
          <div
            className="progress-fill"
            style={{
              width: `${Math.round((unlocked.length / allAchievements.length) * 100)}%`,
              background: 'linear-gradient(90deg, #4F46E5, #7C3AED)',
            }}
          />
        </div>
        <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 6 }}>
          {unlocked.length}/{allAchievements.length} unlocked · {Math.round((unlocked.length / allAchievements.length) * 100)}% complete
        </div>
      </div>

      {/* Unlocked */}
      {unlocked.length > 0 && (
        <div style={{ marginBottom: 28 }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 14 }}>
            ✅ Unlocked ({unlocked.length})
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 14 }}>
            {unlocked.map((ach) => (
              <AchievementCard key={ach.id} achievement={ach} unlocked />
            ))}
          </div>
        </div>
      )}

      {/* Locked */}
      {locked.length > 0 && (
        <div>
          <h2 style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 14 }}>
            🔒 Still to Unlock ({locked.length})
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 14 }}>
            {locked.map((ach) => (
              <AchievementCard key={ach.id} achievement={ach} unlocked={false} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function AchievementCard({ achievement, unlocked }: {
  achievement: typeof import('../data').achievements[0];
  unlocked: boolean;
}) {
  return (
    <div
      className="card"
      style={{
        opacity: unlocked ? 1 : 0.55,
        borderColor: unlocked ? 'rgba(79,70,229,0.2)' : 'var(--border)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {unlocked && (
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, height: 3,
          background: 'linear-gradient(90deg, #4F46E5, #7C3AED)',
        }} />
      )}

      <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
        <div style={{
          width: 48, height: 48, borderRadius: 12, flexShrink: 0,
          background: unlocked ? 'linear-gradient(135deg, #EEF2FF, #C7D2FE)' : 'var(--bg)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 24, filter: unlocked ? 'none' : 'grayscale(100%)',
        }}>
          {unlocked ? achievement.icon : <Lock size={20} color="var(--text-muted)" />}
        </div>
        <div>
          <h3 style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 4 }}>
            {achievement.title}
          </h3>
          <p style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 6, lineHeight: 1.5 }}>
            {achievement.description}
          </p>
          <div style={{ fontSize: 11, color: unlocked ? 'var(--primary)' : 'var(--text-muted)', fontWeight: 600 }}>
            {unlocked ? `+${achievement.xpReward} XP earned` : `+${achievement.xpReward} XP · ${achievement.condition}`}
          </div>
        </div>
      </div>
    </div>
  );
}
