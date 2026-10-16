// SkillTrace AI — Persistent State Store (localStorage)
// All student data is stored locally in the browser.
// No data is sent to any server unless an AI API is explicitly configured.

const STORE_KEY = 'skilltrace_v1';

const DEFAULT_STATE = {
  profile: {
    name: 'Learner',
    avatar: '🎓',
    joinedDate: new Date().toISOString(),
    preferredLang: 'python'
  },
  xp: 0,
  streak: {
    count: 0,
    lastActiveDate: null
  },
  completedTopics: [],        // array of topicId strings
  masteryScores: {},          // { topicId: 0-100 }
  quizAttempts: [],           // { topicId, questionId, correct, hintsUsed, timestamp }
  lessonViews: [],            // { topicId, timestamp }
  achievements: [],           // array of achievement ids
  settings: {
    voiceEnabled: true,
    voiceRate: 0.95,
    darkMode: false,
    reducedMotion: false
  },
  dailyGoal: {
    target: 3,                // topics per day
    completedToday: 0,
    lastResetDate: null
  },
  revisionSchedule: {},       // { topicId: nextReviewDate }
  codingSubmissions: []       // { topicId, code, timestamp, passed }
};

function loadState() {
  try {
    const raw = localStorage.getItem(STORE_KEY);
    if (!raw) return JSON.parse(JSON.stringify(DEFAULT_STATE));
    const saved = JSON.parse(raw);
    // Merge with defaults so new fields appear after upgrades
    return deepMerge(JSON.parse(JSON.stringify(DEFAULT_STATE)), saved);
  } catch (e) {
    console.warn('SkillTrace: could not load saved state, using defaults.', e);
    return JSON.parse(JSON.stringify(DEFAULT_STATE));
  }
}

function saveState(state) {
  try {
    localStorage.setItem(STORE_KEY, JSON.stringify(state));
  } catch (e) {
    console.warn('SkillTrace: could not save state.', e);
  }
}

function deepMerge(target, source) {
  const result = { ...target };
  for (const key of Object.keys(source)) {
    if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
      result[key] = deepMerge(target[key] || {}, source[key]);
    } else {
      result[key] = source[key];
    }
  }
  return result;
}

// ── Streak management ────────────────────────────────────────────────────────
function updateStreak(state) {
  const today = new Date().toDateString();
  const last  = state.streak.lastActiveDate;
  if (last === today) return state; // already counted today

  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const count = last === yesterday.toDateString() ? state.streak.count + 1 : 1;

  return {
    ...state,
    streak: { count, lastActiveDate: today }
  };
}

// ── XP management ─────────────────────────────────────────────────────────────
function addXP(state, amount) {
  return { ...state, xp: state.xp + amount };
}

// ── Mastery management ───────────────────────────────────────────────────────
function updateMastery(state, topicId, delta) {
  const current = state.masteryScores[topicId] || 0;
  const next    = Math.max(0, Math.min(100, current + delta));
  return {
    ...state,
    masteryScores: { ...state.masteryScores, [topicId]: next }
  };
}

function getMastery(state, topicId) {
  return state.masteryScores[topicId] || 0;
}

// ── Achievements ──────────────────────────────────────────────────────────────
const ACHIEVEMENT_DEFS = [
  { id: 'first_lesson',     title: 'First Steps',           icon: '🚀', desc: 'Completed your first lesson',          condition: s => s.lessonViews.length >= 1 },
  { id: 'first_quiz',       title: 'Quiz Starter',          icon: '📝', desc: 'Completed your first quiz question',   condition: s => s.quizAttempts.length >= 1 },
  { id: 'five_correct',     title: 'Five Right',            icon: '⭐', desc: 'Got 5 questions correct',              condition: s => s.quizAttempts.filter(a => a.correct).length >= 5 },
  { id: 'ten_correct',      title: 'Ten Right',             icon: '🌟', desc: 'Got 10 questions correct',             condition: s => s.quizAttempts.filter(a => a.correct).length >= 10 },
  { id: 'first_topic',      title: 'Topic Conquered',       icon: '🎯', desc: 'Completed your first topic',           condition: s => s.completedTopics.length >= 1 },
  { id: 'three_topics',     title: 'Knowledge Builder',     icon: '📚', desc: 'Completed 3 topics',                   condition: s => s.completedTopics.length >= 3 },
  { id: 'streak_3',         title: '3-Day Streak',          icon: '🔥', desc: 'Practised 3 days in a row',            condition: s => s.streak.count >= 3 },
  { id: 'streak_7',         title: 'Week Warrior',          icon: '💪', desc: 'Practised 7 days in a row',            condition: s => s.streak.count >= 7 },
  { id: 'hundred_xp',       title: 'Century',               icon: '💯', desc: 'Earned 100 XP',                        condition: s => s.xp >= 100 },
  { id: 'debugging_explorer',title:'Debugging Explorer',    icon: '🐛', desc: 'Found bugs in 3 find-the-bug questions',condition: s => s.quizAttempts.filter(a => a.type === 'bug' && a.correct).length >= 3 },
  { id: 'concept_master',   title: 'Concept Master',        icon: '🧠', desc: 'Reached 80%+ mastery on any topic',   condition: s => Object.values(s.masteryScores).some(v => v >= 80) }
];

function checkAchievements(state) {
  let updated = state;
  let newlyUnlocked = [];
  for (const def of ACHIEVEMENT_DEFS) {
    if (!updated.achievements.includes(def.id) && def.condition(updated)) {
      updated = { ...updated, achievements: [...updated.achievements, def.id] };
      newlyUnlocked.push(def);
    }
  }
  return { state: updated, newlyUnlocked };
}

// ── Daily goal ────────────────────────────────────────────────────────────────
function checkDailyReset(state) {
  const today = new Date().toDateString();
  if (state.dailyGoal.lastResetDate !== today) {
    return {
      ...state,
      dailyGoal: { ...state.dailyGoal, completedToday: 0, lastResetDate: today }
    };
  }
  return state;
}

// ── Revision schedule (simple spaced repetition) ─────────────────────────────
function scheduleRevision(state, topicId, wasCorrect) {
  const now = Date.now();
  const intervals = [1, 3, 7, 14, 30]; // days
  const current = state.revisionSchedule[topicId];
  let daysUntilNext = 1;

  if (current) {
    const daysSinceLast = (now - current.lastReview) / 86400000;
    const step = wasCorrect ? Math.min((current.step || 0) + 1, intervals.length - 1) : 0;
    daysUntilNext = intervals[step];
    const nextDate = new Date(now + daysUntilNext * 86400000).toISOString();
    return {
      ...state,
      revisionSchedule: {
        ...state.revisionSchedule,
        [topicId]: { step, nextDate, lastReview: now }
      }
    };
  }

  const nextDate = new Date(now + 86400000).toISOString(); // tomorrow
  return {
    ...state,
    revisionSchedule: {
      ...state.revisionSchedule,
      [topicId]: { step: 0, nextDate, lastReview: now }
    }
  };
}

// ── Weak topics ───────────────────────────────────────────────────────────────
function getWeakTopics(state, limit = 3) {
  const scores = state.masteryScores;
  return Object.entries(scores)
    .filter(([_, v]) => v < 60 && v > 0)
    .sort(([, a], [, b]) => a - b)
    .slice(0, limit)
    .map(([id]) => id);
}

// ── Recommendation engine ─────────────────────────────────────────────────────
function getNextRecommendation(state, topics) {
  // 1. Topics due for revision
  const now = Date.now();
  const dueRevision = Object.entries(state.revisionSchedule)
    .filter(([, v]) => v.nextDate && new Date(v.nextDate).getTime() <= now)
    .map(([id]) => id);
  if (dueRevision.length > 0) {
    const t = topics.find(t => t.id === dueRevision[0]);
    if (t) return { topic: t, reason: 'Due for revision based on your learning schedule.' };
  }
  // 2. Weak topics
  const weak = getWeakTopics(state, 1);
  if (weak.length > 0) {
    const t = topics.find(t => t.id === weak[0]);
    if (t) return { topic: t, reason: 'Your recent quiz results suggest this topic needs more practice.' };
  }
  // 3. Next unstarted topic
  const started = Object.keys(state.masteryScores);
  const unstarted = topics.filter(t => !started.includes(t.id) && !state.completedTopics.includes(t.id));
  if (unstarted.length > 0) {
    return { topic: unstarted[0], reason: 'Continue building on what you know — this is the next topic in your path.' };
  }
  // 4. Default to first topic
  if (topics.length > 0) {
    return { topic: topics[0], reason: 'Start here to begin your learning journey.' };
  }
  return null;
}

// Expose globally
window.SkillTraceStore = {
  load: loadState,
  save: saveState,
  updateStreak,
  addXP,
  updateMastery,
  getMastery,
  checkAchievements,
  checkDailyReset,
  scheduleRevision,
  getWeakTopics,
  getNextRecommendation,
  ACHIEVEMENT_DEFS
};
