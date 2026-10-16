import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BookOpen, Code2, RefreshCw, ChevronRight, Target,
  Clock, TrendingUp, AlertCircle, Play, Zap, Trophy,
  CheckCircle2, FileCode, Globe
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { topics, languages } from '../data';
import { getNextRecommendedTopic, getWeakTopics, getMasteryLabel, getMasteryColor, getXPProgress } from '../utils/mastery';

export default function HomePage() {
  const { state, setLanguage, dispatch } = useApp();
  const { user, recentActivity } = state;
  const navigate = useNavigate();
  const [showDiagnosticBanner, setShowDiagnosticBanner] = useState(!user.diagnosticCompleted[user.selectedLanguage]);

  const recommendation = getNextRecommendedTopic(user.topicProgress, user.selectedLanguage);
  const weakTopicIds   = getWeakTopics(user.topicProgress, user.selectedLanguage);
  const selectedLang   = languages.find((l) => l.id === user.selectedLanguage);
  const xpProgress     = getXPProgress(user.xp);
  const dailyPercent   = Math.min((user.dailyProgress / user.dailyGoal) * 100, 100);
  const dailyDone      = user.dailyProgress >= user.dailyGoal;

  const recommendedTopic = recommendation
    ? topics.find((t) => t.id === recommendation.topicId)
    : null;

  const continueTopic = topics.find(
    (t) => t.languageId === user.selectedLanguage && !user.completedTopics.includes(t.id)
  );

  const weakTopics = weakTopicIds
    .slice(0, 3)
    .map((id) => topics.find((t) => t.id === id))
    .filter(Boolean);

  const modes = [
    { id: 'learn',    icon: BookOpen, label: 'Learn',    desc: 'Guided lessons with examples',       color: '#4F46E5', bg: 'rgba(79,70,229,0.06)',  path: '/learn' },
    { id: 'practice', icon: Code2,    label: 'Practice', desc: 'Quizzes and coding challenges',      color: '#7C3AED', bg: 'rgba(124,58,237,0.06)', path: '/practice' },
    { id: 'revision', icon: RefreshCw,label: 'Revision', desc: 'Flashcards and weak-concept drills', color: '#D97706', bg: 'rgba(217,119,6,0.06)',  path: '/revision' },
    { id: 'coding',   icon: FileCode, label: 'Code',     desc: 'Coding editor with real problems',   color: '#16A34A', bg: 'rgba(22,163,74,0.06)',  path: '/coding' },
  ];

  // Learning journey milestones
  const completedCount = user.completedTopics.filter((id) =>
    topics.find((t) => t.id === id && t.languageId === user.selectedLanguage)
  ).length;
  const totalLangTopics = topics.filter((t) => t.languageId === user.selectedLanguage).length;
  const journeyPercent  = totalLangTopics > 0 ? Math.round((completedCount / totalLangTopics) * 100) : 0;

  return (
    <div className="page-content" style={{ margin: '0 auto' }}>

      {/* Diagnostic banner */}
      {showDiagnosticBanner && !user.diagnosticCompleted[user.selectedLanguage] && (
        <div style={{
          background: 'linear-gradient(135deg, rgba(79,70,229,0.08), rgba(124,58,237,0.08))',
          border: '1px solid rgba(79,70,229,0.2)',
          borderRadius: 12, padding: '14px 18px', marginBottom: 20,
          display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap',
        }}>
          <div style={{ flex: 1, minWidth: 200 }}>
            <div style={{ fontWeight: 600, color: 'var(--primary)', fontSize: 14, marginBottom: 2 }}>
              🎯 Take a quick diagnostic assessment
            </div>
            <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
              Helps us recommend the right starting point for {selectedLang?.name}. Takes ~5 minutes.
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button className="btn btn-primary btn-sm" onClick={() => navigate('/diagnostic')}>
              Start Diagnostic
            </button>
            <button className="btn btn-ghost btn-sm" onClick={() => setShowDiagnosticBanner(false)}>
              Skip
            </button>
          </div>
        </div>
      )}

      {/* Welcome banner */}
      <div className="card animate-fadeIn" style={{
        background: 'linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)',
        border: 'none', color: 'white', marginBottom: 20, overflow: 'hidden', position: 'relative',
      }}>
        <div style={{ position: 'absolute', right: -20, top: -20, width: 160, height: 160, borderRadius: '50%', background: 'rgba(255,255,255,0.06)' }} aria-hidden="true" />
        <div style={{ position: 'absolute', right: 60, bottom: -40, width: 100, height: 100, borderRadius: '50%', background: 'rgba(255,255,255,0.04)' }} aria-hidden="true" />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ fontSize: 13, opacity: 0.7, marginBottom: 4 }}>Welcome back,</div>
          <h1 style={{ fontSize: 24, fontWeight: 800, marginBottom: 6 }}>
            {user.name} {user.avatar}
          </h1>
          <p style={{ opacity: 0.8, fontSize: 14, marginBottom: 16 }}>
            {user.streak > 0
              ? `You're on a ${user.streak}-day streak! Keep the momentum going. 🔥`
              : 'Start learning today to build your streak!'}
          </p>

          {/* Daily goal progress */}
          <div style={{ background: 'rgba(255,255,255,0.15)', borderRadius: 8, padding: '10px 14px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 6, opacity: 0.9 }}>
              <span>Today's Goal {dailyDone ? '✓' : ''}</span>
              <span>{user.dailyProgress}/{user.dailyGoal} min</span>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.2)', borderRadius: 4, height: 8 }}>
              <div style={{
                width: `${dailyPercent}%`, height: '100%', borderRadius: 4,
                background: dailyDone ? '#4ADE80' : 'white',
                transition: 'width 0.6s ease',
              }} />
            </div>
          </div>
        </div>
      </div>

      {/* ── Daily Goals Section ── */}
      <div className="card" style={{ marginBottom: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
          <Target size={18} color="var(--primary)" />
          <h2 style={{ fontSize: 16, fontWeight: 600, color: 'var(--text-primary)' }}>Daily Goals</h2>
          <span style={{ marginLeft: 'auto', fontSize: 12, color: 'var(--text-muted)' }}>
            {new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'short' })}
          </span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: 10, marginBottom: 16 }}>
          <GoalStat icon="❓" value={user.dailyQuestionsToday || 0} label="Questions" color="var(--primary)" />
          <GoalStat icon="📗" value={user.dailyLessonsToday || 0} label="Lessons" color="#16A34A" />
          <GoalStat icon="⚡" value={user.xp} label="Total XP" color="#D97706" />
          <GoalStat icon="🔥" value={user.streak} label="Day Streak" color="#DC2626" />
        </div>

        {/* Learning journey animation */}
        <div style={{ marginBottom: 16 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'var(--text-muted)', marginBottom: 8 }}>
            <span>🗺 {selectedLang?.name} Journey: {completedCount}/{totalLangTopics} topics</span>
            <span>{journeyPercent}%</span>
          </div>

          {/* Animated path */}
          <div style={{ position: 'relative', height: 48, background: 'var(--bg)', borderRadius: 24, overflow: 'hidden', border: '1px solid var(--border)' }}>
            {/* Track fill */}
            <div style={{
              position: 'absolute', left: 0, top: 0, height: '100%',
              width: `${journeyPercent}%`,
              background: 'linear-gradient(90deg, rgba(79,70,229,0.12), rgba(124,58,237,0.12))',
              transition: 'width 0.8s ease',
            }} />

            {/* Milestone dots */}
            {[0, 25, 50, 75, 100].map((pct) => (
              <div key={pct} style={{
                position: 'absolute', top: '50%', left: `${pct}%`,
                transform: 'translate(-50%, -50%)',
                width: 8, height: 8, borderRadius: '50%',
                background: journeyPercent >= pct ? 'var(--primary)' : 'var(--border)',
                transition: 'background 0.4s',
                zIndex: 1,
              }} />
            ))}

            {/* Learner emoji (positioned on the path) */}
            <div style={{
              position: 'absolute', top: '50%',
              left: `${Math.min(journeyPercent, 95)}%`,
              transform: 'translate(-50%, -50%)',
              fontSize: 22,
              transition: 'left 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
              zIndex: 2,
              filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))',
            }}>
              {user.avatar}
            </div>

            {/* Labels */}
            <div style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', fontSize: 10, color: 'var(--text-muted)' }}>Start</div>
            <div style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', fontSize: 10, color: 'var(--text-muted)' }}>
              {journeyPercent === 100 ? '🎓 Done!' : 'Mastery'}
            </div>
          </div>
        </div>

        {/* Continue button */}
        {continueTopic ? (
          <button
            className="btn btn-primary"
            style={{ width: '100%' }}
            onClick={() => navigate(`/learn?topic=${continueTopic.id}`)}
          >
            <Play size={15} /> Continue: {continueTopic.title} <ChevronRight size={14} />
          </button>
        ) : (
          <button className="btn btn-success" style={{ width: '100%' }} onClick={() => navigate('/explore')}>
            <CheckCircle2 size={15} /> Explore more topics <ChevronRight size={14} />
          </button>
        )}
      </div>

      {/* Stats row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 12, marginBottom: 20 }}>
        <StatCard icon="⚡" value={`${user.xp} XP`}       label="Total XP"    sub={`Level ${user.level}`} />
        <StatCard icon="🔥" value={`${user.streak}`}       label="Day Streak"  sub="🏆 Keep going!" />
        <StatCard icon="🏅" value={`${user.achievements.length}`} label="Badges" sub="View all" onPress={() => navigate('/achievements')} />
        <StatCard icon="📚" value={`${user.completedTopics.length}`} label="Done" sub="Topics complete" />
      </div>

      {/* Language selector */}
      <div className="card" style={{ marginBottom: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
          <Globe size={16} color="var(--primary)" />
          <h2 style={{ fontSize: 16, fontWeight: 600, color: 'var(--text-primary)' }}>Current Language</h2>
          {/* Hinglish toggle */}
          <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>Explain in:</span>
            <button
              onClick={() => dispatch({ type: 'SET_LEARNING_LANGUAGE', lang: user.learningLanguage === 'english' ? 'hinglish' : 'english' })}
              style={{
                fontSize: 12, fontWeight: 600, padding: '4px 10px', borderRadius: 6,
                cursor: 'pointer', border: '1.5px solid var(--primary)',
                background: user.learningLanguage === 'hinglish' ? 'var(--primary)' : 'transparent',
                color: user.learningLanguage === 'hinglish' ? 'white' : 'var(--primary)',
                transition: 'all 0.15s',
              }}
              aria-pressed={user.learningLanguage === 'hinglish'}
            >
              {user.learningLanguage === 'hinglish' ? '🇮🇳 Hinglish' : '🌐 English'}
            </button>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {languages.map((lang) => (
            <button
              key={lang.id}
              onClick={() => setLanguage(lang.id)}
              style={{
                padding: '7px 13px', borderRadius: 20, fontSize: 13, fontWeight: 500,
                cursor: 'pointer', border: '2px solid',
                borderColor: user.selectedLanguage === lang.id ? 'var(--primary)' : 'var(--border)',
                background: user.selectedLanguage === lang.id ? 'rgba(79,70,229,0.08)' : 'transparent',
                color: user.selectedLanguage === lang.id ? 'var(--primary)' : 'var(--text-secondary)',
                transition: 'all 0.15s', display: 'flex', alignItems: 'center', gap: 5,
              }}
            >
              <span>{lang.icon}</span><span>{lang.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Learning modes */}
      <div style={{ marginBottom: 20 }}>
        <h2 style={{ fontSize: 16, fontWeight: 600, marginBottom: 14, color: 'var(--text-primary)' }}>
          How do you want to learn today?
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 12 }}>
          {modes.map(({ id, icon: Icon, label, desc, color, bg, path }) => (
            <button
              key={id}
              className="card card-hover"
              style={{ cursor: 'pointer', border: 'none', textAlign: 'left', background: bg }}
              onClick={() => navigate(path)}
            >
              <div style={{ width: 38, height: 38, borderRadius: 10, background: color, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 10 }}>
                <Icon size={18} color="white" />
              </div>
              <div style={{ fontWeight: 700, fontSize: 15, color: 'var(--text-primary)', marginBottom: 3 }}>{label}</div>
              <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{desc}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Recommendation + continue */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 16, marginBottom: 20 }}>
        {recommendedTopic && recommendation && (
          <div className="card" style={{ borderLeft: '3px solid var(--primary)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10 }}>
              <Target size={14} color="var(--primary)" />
              <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: 0.5 }}>Recommended</span>
            </div>
            <h3 style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 6 }}>{recommendedTopic.title}</h3>
            <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 12, lineHeight: 1.5 }}>{recommendation.message}</p>
            <button className="btn btn-primary btn-sm" onClick={() => navigate(`/learn?topic=${recommendedTopic.id}`)}>
              Start <ChevronRight size={13} />
            </button>
          </div>
        )}
        {continueTopic && (
          <div className="card">
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10 }}>
              <Play size={14} color="#16A34A" />
              <span style={{ fontSize: 11, fontWeight: 600, color: '#16A34A', textTransform: 'uppercase', letterSpacing: 0.5 }}>Continue</span>
            </div>
            <h3 style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 6 }}>{continueTopic.title}</h3>
            <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 12 }}>{continueTopic.description}</p>
            <button className="btn btn-success btn-sm" onClick={() => navigate(`/learn?topic=${continueTopic.id}`)}>
              Continue <ChevronRight size={13} />
            </button>
          </div>
        )}
      </div>

      {/* Weak concepts */}
      {weakTopics.length > 0 && (
        <div className="card" style={{ marginBottom: 20, borderColor: 'rgba(217,119,6,0.2)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
            <AlertCircle size={15} color="var(--warning)" />
            <h2 style={{ fontSize: 16, fontWeight: 600, color: 'var(--text-primary)' }}>Needs More Practice</h2>
          </div>
          {weakTopics.map((topic) => {
            if (!topic) return null;
            const progress = user.topicProgress[topic.id];
            return (
              <div key={topic.id} style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: 500, color: 'var(--text-primary)' }}>{topic.title}</div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                    {progress ? `${progress.questionsCorrect}/${progress.questionsAttempted} correct` : 'No attempts'}
                  </div>
                </div>
                {progress && (
                  <span className={`badge ${getMasteryColor(progress.mastery)}`}>
                    {getMasteryLabel(progress.mastery)}
                  </span>
                )}
                <button className="btn btn-secondary btn-sm" onClick={() => navigate(`/learn?topic=${topic.id}`)}>
                  Practice
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* Recent activity */}
      <div className="card">
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
          <Clock size={15} color="var(--text-muted)" />
          <h2 style={{ fontSize: 16, fontWeight: 600, color: 'var(--text-primary)' }}>Recent Activity</h2>
        </div>
        {recentActivity.length === 0 ? (
          <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>No activity yet. Start learning!</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {recentActivity.slice(0, 5).map((activity, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <span style={{ fontSize: 18 }}>
                  {activity.type === 'lesson' ? '📗' : activity.type === 'diagnostic' ? '🎯' : activity.type === 'quiz' ? '✅' : '🏅'}
                </span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, color: 'var(--text-primary)' }}>{activity.message}</div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                    {new Date(activity.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    {' · '}{new Date(activity.timestamp).toLocaleDateString()}
                  </div>
                </div>
                {activity.xp > 0 && <span style={{ fontSize: 12, color: 'var(--primary)', fontWeight: 600 }}>+{activity.xp} XP</span>}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({ icon, value, label, sub, onPress }: {
  icon: string; value: string; label: string; sub?: string; onPress?: () => void;
}) {
  return (
    <div
      className={`card ${onPress ? 'card-hover' : ''}`}
      style={{ textAlign: 'center', cursor: onPress ? 'pointer' : 'default' }}
      onClick={onPress}
      role={onPress ? 'button' : undefined}
      tabIndex={onPress ? 0 : undefined}
      onKeyDown={(e) => e.key === 'Enter' && onPress?.()}
    >
      <div style={{ fontSize: 22, marginBottom: 4 }}>{icon}</div>
      <div style={{ fontSize: 18, fontWeight: 800, color: 'var(--text-primary)' }}>{value}</div>
      <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>{label}</div>
      {sub && <div style={{ fontSize: 11, color: 'var(--primary)', marginTop: 1 }}>{sub}</div>}
    </div>
  );
}

function GoalStat({ icon, value, label, color }: { icon: string; value: number; label: string; color: string }) {
  return (
    <div style={{ textAlign: 'center', padding: '10px 8px', background: 'var(--bg)', borderRadius: 8, border: '1px solid var(--border)' }}>
      <div style={{ fontSize: 18, marginBottom: 4 }}>{icon}</div>
      <div style={{ fontSize: 20, fontWeight: 700, color }}>{value}</div>
      <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{label}</div>
    </div>
  );
}
