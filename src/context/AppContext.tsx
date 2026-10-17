import React, { createContext, useContext, useReducer, useEffect } from 'react';
import {
  UserProfile, TopicProgress, MasteryLevel, QuizAttempt,
  Achievement, DiagnosticResult, LangMode, Difficulty,
} from '../types';
import { achievements as allAchievements } from '../data';

// â”€â”€ Default user (guest/demo) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const today = new Date().toDateString();

const defaultUser: UserProfile = {
  id: 'demo-user',
  name: 'SKILLTRACE AI',
  email: '',
  avatar: '👤',
  xp: 120,
  level: 2,
  streak: 3,
  lastActiveDate: today,
  dailyGoalDate: today,
  selectedLanguage: 'python',
  dailyGoal: 30,
  dailyProgress: 15,
  dailyQuestionsToday: 0,
  dailyLessonsToday: 0,
  voiceEnabled: false,
  darkMode: false,
  learningLanguage: 'english',
  completedTopics: [],
  topicProgress: {},
  achievements: ['first-lesson'],
  preferredDifficulty: 'beginner',
  createdAt: Date.now() - 7 * 24 * 60 * 60 * 1000,
  diagnosticCompleted: {},
  bookmarkedCards: [],
  reviewedCards: [],
  showOnLeaderboard: true,
  leaderboardName: 'Alex J.',
  onboardingDone: false,
};

// â”€â”€ State â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
export interface RecentActivity {
  type: string;
  message: string;
  timestamp: number;
  xp: number;
}

interface AppState {
  user: UserProfile;
  sessionXP: number;
  sessionQuestions: number;
  sessionCorrect: number;
  recentActivity: RecentActivity[];
  newAchievements: Achievement[];
  diagnosticResults: Record<string, DiagnosticResult>;
}

const initialState: AppState = {
  user: defaultUser,
  sessionXP: 0,
  sessionQuestions: 0,
  sessionCorrect: 0,
  recentActivity: [
    { type: 'lesson', message: 'Completed: Python Variables', timestamp: Date.now() - 3600000, xp: 50 },
    { type: 'quiz', message: 'Quiz: 3/3 correct on Python Conditions', timestamp: Date.now() - 7200000, xp: 30 },
  ],
  newAchievements: [],
  diagnosticResults: {},
};

// â”€â”€ Actions â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
type Action =
  | { type: 'ADD_XP'; amount: number }
  | { type: 'COMPLETE_LESSON'; topicId: string; xp: number; title: string }
  | { type: 'RECORD_ATTEMPT'; attempt: QuizAttempt & { topicId: string; xp: number } }
  | { type: 'SET_LANGUAGE'; languageId: string }
  | { type: 'TOGGLE_VOICE' }
  | { type: 'TOGGLE_DARK_MODE' }
  | { type: 'SET_LEARNING_LANGUAGE'; lang: LangMode }
  | { type: 'UPDATE_DAILY_GOAL'; minutes: number }
  | { type: 'UPDATE_DAILY_PROGRESS'; minutes: number }
  | { type: 'ADD_DAILY_QUESTION' }
  | { type: 'UPDATE_STREAK' }
  | { type: 'UNLOCK_ACHIEVEMENT'; achievementId: string }
  | { type: 'CLEAR_NEW_ACHIEVEMENTS' }
  | { type: 'UPDATE_PROFILE'; name: string; avatar: string; leaderboardName: string; showOnLeaderboard: boolean }
  | { type: 'UPDATE_NAME'; name: string }
  | { type: 'COMPLETE_DIAGNOSTIC'; languageId: string; result: DiagnosticResult }
  | { type: 'COMPLETE_ONBOARDING' }
  | { type: 'BOOKMARK_CARD'; cardId: string }
  | { type: 'UNBOOKMARK_CARD'; cardId: string }
  | { type: 'MARK_CARD_REVIEWED'; cardId: string }
  | { type: 'SET_USER'; user: Partial<UserProfile> }
  | { type: 'RESET_DAILY_PROGRESS' };

// â”€â”€ Helpers â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function computeMastery(progress: TopicProgress): MasteryLevel {
  if (progress.questionsAttempted === 0) return 'not-started';
  const rate = progress.questionsCorrect / Math.max(progress.questionsAttempted, 1);
  const hintPenalty = Math.min(progress.hintsUsed * 2, 20);
  const score = rate * 100 - hintPenalty;
  if (score >= 80 && progress.questionsAttempted >= 5) return 'mastered';
  if (score >= 50) return 'learning';
  return 'needs-practice';
}

function getLevelFromXP(xp: number): number {
  return Math.min(Math.floor(Math.sqrt(xp / 50)) + 1, 50);
}

function nextDifficulty(current: Difficulty, consecutive: number): Difficulty {
  if (consecutive >= 3) {
    if (current === 'beginner')     return 'intermediate';
    if (current === 'intermediate') return 'advanced';
  }
  return current;
}

function prevDifficulty(current: Difficulty): Difficulty {
  if (current === 'advanced')     return 'intermediate';
  if (current === 'intermediate') return 'beginner';
  return 'beginner';
}

function resetDailyIfNeeded(user: UserProfile): Partial<UserProfile> {
  const todayStr = new Date().toDateString();
  if (user.dailyGoalDate !== todayStr) {
    return {
      dailyGoalDate: todayStr,
      dailyProgress: 0,
      dailyQuestionsToday: 0,
      dailyLessonsToday: 0,
    };
  }
  return {};
}

// â”€â”€ Reducer â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function appReducer(state: AppState, action: Action): AppState {
  switch (action.type) {

    case 'ADD_XP': {
      const newXP = state.user.xp + action.amount;
      return {
        ...state,
        user: { ...state.user, xp: newXP, level: getLevelFromXP(newXP) },
        sessionXP: state.sessionXP + action.amount,
      };
    }

    case 'COMPLETE_LESSON': {
      const dailyReset = resetDailyIfNeeded(state.user);
      const alreadyDone = state.user.completedTopics.includes(action.topicId);
      const newXP = alreadyDone ? state.user.xp : state.user.xp + action.xp;
      const completed = alreadyDone
        ? state.user.completedTopics
        : [...state.user.completedTopics, action.topicId];
      const activity: RecentActivity = {
        type: 'lesson',
        message: `Completed: ${action.title}`,
        timestamp: Date.now(),
        xp: alreadyDone ? 0 : action.xp,
      };
      return {
        ...state,
        user: {
          ...state.user,
          ...dailyReset,
          xp: newXP,
          level: getLevelFromXP(newXP),
          completedTopics: completed,
          dailyLessonsToday: (state.user.dailyLessonsToday || 0) + 1,
          dailyProgress: Math.min(
            (dailyReset.dailyProgress ?? state.user.dailyProgress) + 5,
            state.user.dailyGoal
          ),
        },
        sessionXP: state.sessionXP + (alreadyDone ? 0 : action.xp),
        recentActivity: [activity, ...state.recentActivity].slice(0, 20),
      };
    }

    case 'RECORD_ATTEMPT': {
      const dailyReset = resetDailyIfNeeded(state.user);
      const { topicId, xp, ...attempt } = action.attempt;

      const existing: TopicProgress = state.user.topicProgress[topicId] || {
        topicId,
        mastery: 'not-started' as MasteryLevel,
        masteryScore: 0,
        lessonsCompleted: 0,
        questionsAttempted: 0,
        questionsCorrect: 0,
        hintsUsed: 0,
        lastAttempt: 0,
        attempts: [],
        consecutiveCorrect: 0,
        usedQuestionIds: [],
        currentDifficulty: state.user.preferredDifficulty,
      };

      // Adaptive difficulty
      const newConsecutive = attempt.isCorrect && attempt.hintsUsed === 0
        ? existing.consecutiveCorrect + 1
        : 0;

      let newDifficulty = existing.currentDifficulty;
      if (attempt.isCorrect && newConsecutive >= 3) {
        newDifficulty = nextDifficulty(existing.currentDifficulty, newConsecutive);
      } else if (!attempt.isCorrect) {
        const recentAttempts = [...existing.attempts, attempt].slice(-3);
        const recentWrong = recentAttempts.filter((a) => !a.isCorrect).length;
        if (recentWrong >= 2) {
          newDifficulty = prevDifficulty(existing.currentDifficulty);
        }
      }

      // Track used questions to avoid repeats
      const usedQIds = existing.usedQuestionIds.includes(attempt.questionId)
        ? existing.usedQuestionIds
        : [...existing.usedQuestionIds, attempt.questionId];

      const updated: TopicProgress = {
        ...existing,
        questionsAttempted: existing.questionsAttempted + 1,
        questionsCorrect: existing.questionsCorrect + (attempt.isCorrect ? 1 : 0),
        hintsUsed: existing.hintsUsed + attempt.hintsUsed,
        lastAttempt: Date.now(),
        attempts: [...existing.attempts, attempt].slice(-50),
        consecutiveCorrect: newConsecutive,
        usedQuestionIds: usedQIds,
        currentDifficulty: newDifficulty,
      };
      updated.mastery = computeMastery(updated);
      updated.masteryScore = Math.round(
        (updated.questionsCorrect / Math.max(updated.questionsAttempted, 1)) * 100
      );

      const earnedXP = attempt.isCorrect ? xp : 0;
      const newXP = state.user.xp + earnedXP;

      return {
        ...state,
        user: {
          ...state.user,
          ...dailyReset,
          xp: newXP,
          level: getLevelFromXP(newXP),
          topicProgress: { ...state.user.topicProgress, [topicId]: updated },
          dailyQuestionsToday: (dailyReset.dailyQuestionsToday ?? (state.user.dailyQuestionsToday || 0)) + 1,
          dailyProgress: Math.min(
            (dailyReset.dailyProgress ?? state.user.dailyProgress) + 2,
            state.user.dailyGoal
          ),
        },
        sessionXP: state.sessionXP + earnedXP,
        sessionQuestions: state.sessionQuestions + 1,
        sessionCorrect: state.sessionCorrect + (attempt.isCorrect ? 1 : 0),
      };
    }

    case 'SET_LANGUAGE':
      return { ...state, user: { ...state.user, selectedLanguage: action.languageId } };

    case 'TOGGLE_VOICE':
      return { ...state, user: { ...state.user, voiceEnabled: !state.user.voiceEnabled } };

    case 'TOGGLE_DARK_MODE':
      return { ...state, user: { ...state.user, darkMode: !state.user.darkMode } };

    case 'SET_LEARNING_LANGUAGE':
      return { ...state, user: { ...state.user, learningLanguage: action.lang } };

    case 'UPDATE_DAILY_GOAL':
      return { ...state, user: { ...state.user, dailyGoal: action.minutes } };

    case 'UPDATE_DAILY_PROGRESS': {
      const dailyReset = resetDailyIfNeeded(state.user);
      const base = dailyReset.dailyProgress ?? state.user.dailyProgress;
      return {
        ...state,
        user: {
          ...state.user,
          ...dailyReset,
          dailyProgress: Math.min(base + action.minutes, state.user.dailyGoal),
        },
      };
    }

    case 'ADD_DAILY_QUESTION': {
      const dailyReset = resetDailyIfNeeded(state.user);
      return {
        ...state,
        user: {
          ...state.user,
          ...dailyReset,
          dailyQuestionsToday: (dailyReset.dailyQuestionsToday ?? (state.user.dailyQuestionsToday || 0)) + 1,
        },
      };
    }

    case 'RESET_DAILY_PROGRESS': {
      const todayStr = new Date().toDateString();
      return {
        ...state,
        user: {
          ...state.user,
          dailyGoalDate: todayStr,
          dailyProgress: 0,
          dailyQuestionsToday: 0,
          dailyLessonsToday: 0,
        },
      };
    }

    case 'UPDATE_STREAK': {
      const todayStr = new Date().toDateString();
      const last = state.user.lastActiveDate;
      const yesterday = new Date(Date.now() - 86400000).toDateString();
      if (last === todayStr) return state;
      const streak = last === yesterday ? state.user.streak + 1 : 1;
      return { ...state, user: { ...state.user, streak, lastActiveDate: todayStr } };
    }

    case 'UNLOCK_ACHIEVEMENT': {
      if (state.user.achievements.includes(action.achievementId)) return state;
      const ach = allAchievements.find((a) => a.id === action.achievementId);
      if (!ach) return state;
      const newXP = state.user.xp + ach.xpReward;
      return {
        ...state,
        user: {
          ...state.user,
          xp: newXP,
          level: getLevelFromXP(newXP),
          achievements: [...state.user.achievements, action.achievementId],
        },
        newAchievements: [...state.newAchievements, { ...ach, unlockedAt: Date.now() }],
      };
    }

    case 'CLEAR_NEW_ACHIEVEMENTS':
      return { ...state, newAchievements: [] };

    case 'UPDATE_NAME':
      return { ...state, user: { ...state.user, name: action.name } };

    case 'UPDATE_PROFILE':
      return {
        ...state,
        user: {
          ...state.user,
          name: action.name,
          avatar: action.avatar,
          leaderboardName: action.leaderboardName,
          showOnLeaderboard: action.showOnLeaderboard,
        },
      };

    case 'COMPLETE_DIAGNOSTIC': {
      const activity: RecentActivity = {
        type: 'diagnostic',
        message: `Diagnostic completed for ${action.languageId} â€” Level: ${action.result.recommendedLevel}`,
        timestamp: Date.now(),
        xp: 50,
      };
      return {
        ...state,
        user: {
          ...state.user,
          diagnosticCompleted: { ...state.user.diagnosticCompleted, [action.languageId]: true },
          xp: state.user.xp + 50,
          level: getLevelFromXP(state.user.xp + 50),
        },
        diagnosticResults: { ...state.diagnosticResults, [action.languageId]: action.result },
        recentActivity: [activity, ...state.recentActivity].slice(0, 20),
      };
    }

    case 'COMPLETE_ONBOARDING':
      return { ...state, user: { ...state.user, onboardingDone: true } };

    case 'BOOKMARK_CARD': {
      if (state.user.bookmarkedCards.includes(action.cardId)) return state;
      return { ...state, user: { ...state.user, bookmarkedCards: [...state.user.bookmarkedCards, action.cardId] } };
    }
    case 'UNBOOKMARK_CARD':
      return { ...state, user: { ...state.user, bookmarkedCards: state.user.bookmarkedCards.filter((id) => id !== action.cardId) } };

    case 'MARK_CARD_REVIEWED': {
      if (state.user.reviewedCards.includes(action.cardId)) return state;
      return { ...state, user: { ...state.user, reviewedCards: [...state.user.reviewedCards, action.cardId] } };
    }

    case 'SET_USER':
      return { ...state, user: { ...state.user, ...action.user } };

    default:
      return state;
  }
}

// â”€â”€ Context â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
interface AppContextType {
  state: AppState;
  dispatch: React.Dispatch<Action>;
  addXP: (amount: number) => void;
  completeLesson: (topicId: string, xp: number, title?: string) => void;
  recordAttempt: (attempt: QuizAttempt & { topicId: string; xp: number }) => void;
  setLanguage: (id: string) => void;
  toggleVoice: () => void;
  toggleDarkMode: () => void;
  unlockAchievement: (id: string) => void;
  getTopicProgress: (topicId: string) => TopicProgress | undefined;
  setLearningLanguage: (lang: LangMode) => void;
  completeDiagnostic: (languageId: string, result: DiagnosticResult) => void;
  bookmarkCard: (cardId: string) => void;
  unbookmarkCard: (cardId: string) => void;
  markCardReviewed: (cardId: string) => void;
}

const AppContext = createContext<AppContextType | null>(null);

// â”€â”€ Provider â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const STORAGE_KEY = 'skilltrace-ai-v2';

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState, (init) => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        const mergedUser = {
          ...init.user,
          ...parsed.user,
          // Ensure new v2 fields have defaults when loading old saves
          dailyGoalDate: parsed.user?.dailyGoalDate || today,
          dailyQuestionsToday: parsed.user?.dailyQuestionsToday || 0,
          dailyLessonsToday: parsed.user?.dailyLessonsToday || 0,
          learningLanguage: parsed.user?.learningLanguage || 'english',
          diagnosticCompleted: parsed.user?.diagnosticCompleted || {},
          bookmarkedCards: parsed.user?.bookmarkedCards || [],
          reviewedCards: parsed.user?.reviewedCards || [],
          showOnLeaderboard: parsed.user?.showOnLeaderboard ?? true,
          leaderboardName: parsed.user?.leaderboardName || (parsed.user?.name?.split(' ')[0] + ' ' + (parsed.user?.name?.split(' ')[1]?.[0] || '') + '.') || 'Student',
          onboardingDone: parsed.user?.onboardingDone || false,
        };
        // Reset daily progress if it's a new day
        const todayStr = new Date().toDateString();
        if (mergedUser.dailyGoalDate !== todayStr) {
          mergedUser.dailyGoalDate = todayStr;
          mergedUser.dailyProgress = 0;
          mergedUser.dailyQuestionsToday = 0;
          mergedUser.dailyLessonsToday = 0;
        }
        return {
          ...init,
          user: mergedUser,
          diagnosticResults: parsed.diagnosticResults || {},
        };
      }
    } catch { /* ignore */ }
    return init;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      user: state.user,
      diagnosticResults: state.diagnosticResults,
    }));
  }, [state.user, state.diagnosticResults]);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', state.user.darkMode);
  }, [state.user.darkMode]);

  // Update streak on mount
  useEffect(() => {
    dispatch({ type: 'UPDATE_STREAK' });
  }, []);

  const value: AppContextType = {
    state,
    dispatch,
    addXP: (amount) => dispatch({ type: 'ADD_XP', amount }),
    completeLesson: (topicId, xp, title = 'Lesson') =>
      dispatch({ type: 'COMPLETE_LESSON', topicId, xp, title }),
    recordAttempt: (attempt) => dispatch({ type: 'RECORD_ATTEMPT', attempt }),
    setLanguage: (id) => dispatch({ type: 'SET_LANGUAGE', languageId: id }),
    toggleVoice: () => dispatch({ type: 'TOGGLE_VOICE' }),
    toggleDarkMode: () => dispatch({ type: 'TOGGLE_DARK_MODE' }),
    unlockAchievement: (id) => dispatch({ type: 'UNLOCK_ACHIEVEMENT', achievementId: id }),
    getTopicProgress: (topicId) => state.user.topicProgress[topicId],
    setLearningLanguage: (lang) => dispatch({ type: 'SET_LEARNING_LANGUAGE', lang }),
    completeDiagnostic: (languageId, result) =>
      dispatch({ type: 'COMPLETE_DIAGNOSTIC', languageId, result }),
    bookmarkCard: (cardId) => dispatch({ type: 'BOOKMARK_CARD', cardId }),
    unbookmarkCard: (cardId) => dispatch({ type: 'UNBOOKMARK_CARD', cardId }),
    markCardReviewed: (cardId) => dispatch({ type: 'MARK_CARD_REVIEWED', cardId }),
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}

