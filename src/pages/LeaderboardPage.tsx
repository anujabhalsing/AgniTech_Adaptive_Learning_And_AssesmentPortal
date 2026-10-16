import React, { useState, useMemo } from 'react';
import { Trophy, Shield, EyeOff, Info } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { LeaderboardEntry } from '../types';
import { isSupabaseConfigured } from '../lib/supabase';

// Demo leaderboard data — clearly labelled, not real students
const DEMO_ENTRIES: Omit<LeaderboardEntry, 'isCurrentUser'>[] = [
  { rank: 1, userId: 'demo-1', displayName: 'Priya S.',   avatar: '👩‍💻', xp: 1840, streak: 14, weeklyXP: 420 },
  { rank: 2, userId: 'demo-2', displayName: 'Rahul M.',   avatar: '🧑‍💻', xp: 1620, streak: 9,  weeklyXP: 310 },
  { rank: 3, userId: 'demo-3', displayName: 'Ananya K.',  avatar: '🧑‍🎓', xp: 1450, streak: 7,  weeklyXP: 280 },
  { rank: 4, userId: 'demo-4', displayName: 'Dev P.',     avatar: '👨‍💻', xp: 1200, streak: 5,  weeklyXP: 240 },
  { rank: 5, userId: 'demo-5', displayName: 'Sara T.',    avatar: '🧙‍♀️', xp: 950,  streak: 3,  weeklyXP: 180 },
];

export default function LeaderboardPage() {
  const { state, dispatch } = useApp();
  const { user } = state;
  const [period, setPeriod]   = useState<'weekly' | 'alltime'>('weekly');
  const [showOptOut, setShowOptOut] = useState(false);

  const supabaseConfigured = isSupabaseConfigured();

  const entries = useMemo((): LeaderboardEntry[] => {
    // Without Supabase, show demo data + current user's position
    const base = DEMO_ENTRIES.map((e) => ({ ...e, isCurrentUser: false }));

    if (!user.showOnLeaderboard) return base;

    const userEntry: LeaderboardEntry = {
      rank: 0,   // computed below
      userId: user.id,
      displayName: user.leaderboardName || user.name.split(' ')[0],
      avatar: user.avatar,
      xp: user.xp,
      weeklyXP: user.dailyProgress * 7,   // rough estimate in demo
      streak: user.streak,
      isCurrentUser: true,
    };

    const combined = [...base, userEntry].sort((a, b) =>
      period === 'weekly' ? b.weeklyXP - a.weeklyXP : b.xp - a.xp
    );

    return combined.map((e, i) => ({ ...e, rank: i + 1 }));
  }, [user, period]);

  const currentUserEntry = entries.find((e) => e.isCurrentUser);

  return (
    <div className="page-content" style={{ margin: '0 auto', maxWidth: 720 }}>
      {/* Header */}
      <div style={{ marginBottom: 20 }}>
        <h1 style={{ fontSize: 28, fontWeight: 800, color: 'var(--text-primary)', marginBottom: 4 }}>
          Leaderboard
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: 15 }}>
          Compare your progress with other learners.
        </p>
      </div>

      {/* Demo / config notice */}
      {!supabaseConfigured && (
        <div style={{
          background: 'rgba(79,70,229,0.06)', border: '1px solid rgba(79,70,229,0.15)',
          borderRadius: 10, padding: '12px 16px', marginBottom: 20,
        }}>
          <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
            <Info size={15} color="var(--primary)" style={{ flexShrink: 0, marginTop: 1 }} />
            <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
              <strong>Demo Mode:</strong> Supabase is not configured. The list below includes sample placeholder students to show the layout.
              Your real position is estimated from local data. Connect Supabase to enable a live class leaderboard.
            </div>
          </div>
        </div>
      )}

      {/* Period toggle */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 20, alignItems: 'center', flexWrap: 'wrap' }}>
        <div className="tab-bar">
          <button className={`tab-btn ${period === 'weekly' ? 'active' : ''}`} onClick={() => setPeriod('weekly')}>
            This Week
          </button>
          <button className={`tab-btn ${period === 'alltime' ? 'active' : ''}`} onClick={() => setPeriod('alltime')}>
            All Time
          </button>
        </div>
        <div style={{ fontSize: 12, color: 'var(--text-muted)', marginLeft: 'auto' }}>
          Ranking: {period === 'weekly' ? 'Weekly XP earned' : 'Total XP earned'}
        </div>
      </div>

      {/* Podium top 3 */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10, marginBottom: 20 }}>
        {[entries[1], entries[0], entries[2]].map((e, visualIdx) => {
          if (!e) return <div key={visualIdx} />;
          const heights = ['80px', '100px', '60px'];
          const medals  = ['🥈', '🥇', '🥉'];
          const medals2 = [1, 0, 2];
          return (
            <div key={e.userId} style={{ textAlign: 'center' }}>
              <div style={{
                fontSize: 28, marginBottom: 4,
                filter: e.isCurrentUser ? 'none' : 'none',
              }}>{e.avatar}</div>
              <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>
                {e.displayName}
                {e.isCurrentUser && <span style={{ color: 'var(--primary)', marginLeft: 4 }}>◀ you</span>}
              </div>
              <div style={{ fontSize: 20 }}>{medals[visualIdx]}</div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                {period === 'weekly' ? e.weeklyXP : e.xp} XP
              </div>
              <div style={{
                height: heights[visualIdx], marginTop: 4,
                background: visualIdx === 1 ? 'linear-gradient(135deg,#4F46E5,#7C3AED)' : 'var(--border)',
                borderRadius: '6px 6px 0 0',
              }} />
            </div>
          );
        })}
      </div>

      {/* Full table */}
      <div className="card" style={{ marginBottom: 20 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
          {entries.map((entry, idx) => (
            <div
              key={entry.userId}
              style={{
                display: 'flex', alignItems: 'center', gap: 12,
                padding: '12px 16px',
                background: entry.isCurrentUser ? 'rgba(79,70,229,0.06)' : 'transparent',
                borderRadius: 8,
                borderBottom: idx < entries.length - 1 ? '1px solid var(--border)' : 'none',
              }}
            >
              {/* Rank */}
              <div style={{
                width: 32, height: 32, borderRadius: '50%', flexShrink: 0,
                background: entry.rank <= 3 ? 'linear-gradient(135deg,#4F46E5,#7C3AED)' : 'var(--bg)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: entry.rank <= 3 ? 14 : 13,
                color: entry.rank <= 3 ? 'white' : 'var(--text-muted)',
                fontWeight: 700,
              }}>
                {entry.rank <= 3 ? ['🥇','🥈','🥉'][entry.rank - 1] : entry.rank}
              </div>

              {/* Avatar */}
              <div style={{ fontSize: 22, flexShrink: 0 }}>{entry.avatar}</div>

              {/* Name */}
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)' }}>
                    {entry.displayName}
                  </span>
                  {entry.isCurrentUser && (
                    <span style={{ fontSize: 11, color: 'var(--primary)', background: 'rgba(79,70,229,0.1)', padding: '2px 6px', borderRadius: 4, fontWeight: 600 }}>
                      You
                    </span>
                  )}
                  {!supabaseConfigured && !entry.isCurrentUser && (
                    <span style={{ fontSize: 10, color: 'var(--text-muted)', background: 'var(--bg)', padding: '1px 5px', borderRadius: 3 }}>
                      demo
                    </span>
                  )}
                </div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                  🔥 {entry.streak} day streak
                </div>
              </div>

              {/* XP */}
              <div style={{ textAlign: 'right', flexShrink: 0 }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--primary)' }}>
                  {period === 'weekly' ? entry.weeklyXP : entry.xp} XP
                </div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                  {period === 'weekly' ? 'this week' : 'all time'}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* How ranking works */}
      <div className="card" style={{ marginBottom: 16 }}>
        <h2 style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 10 }}>
          How ranking works
        </h2>
        <ul style={{ fontSize: 13, color: 'var(--text-secondary)', paddingLeft: 16, lineHeight: 1.8 }}>
          <li>XP is earned for completing lessons, answering quiz questions correctly, and coding submissions.</li>
          <li>Weekly XP resets every Monday. All-time XP is cumulative.</li>
          <li>Partial credit for coding challenges is awarded based on the fraction of test cases passed.</li>
          <li>XP is only awarded once per unique question or lesson — refreshing does not re-award points.</li>
          <li>Ranking does not account for speed, time spent, or difficulty chosen.</li>
        </ul>
      </div>

      {/* Privacy */}
      <div className="card">
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
          <Shield size={16} color="var(--text-muted)" />
          <h2 style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-primary)' }}>Privacy</h2>
        </div>
        <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 12 }}>
          Only your display name (not your email or full name) is shown. You can opt out at any time.
        </p>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', background: 'var(--bg)', borderRadius: 8 }}>
          <div>
            <div style={{ fontSize: 14, fontWeight: 500, color: 'var(--text-primary)' }}>
              {user.showOnLeaderboard ? 'You appear on the leaderboard' : 'You are hidden from the leaderboard'}
            </div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Display name: {user.leaderboardName || user.name}</div>
          </div>
          <button
            role="switch"
            aria-checked={user.showOnLeaderboard}
            onClick={() => dispatch({ type: 'SET_USER', user: { showOnLeaderboard: !user.showOnLeaderboard } })}
            style={{
              width: 44, height: 24, borderRadius: 12, border: 'none', cursor: 'pointer',
              background: user.showOnLeaderboard ? 'var(--primary)' : 'var(--border)',
              position: 'relative', transition: 'background 0.2s', flexShrink: 0,
            }}
          >
            <div style={{
              width: 18, height: 18, borderRadius: '50%', background: 'white',
              position: 'absolute', top: 3,
              left: user.showOnLeaderboard ? 23 : 3,
              transition: 'left 0.2s',
              boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
            }} />
          </button>
        </div>
      </div>
    </div>
  );
}
