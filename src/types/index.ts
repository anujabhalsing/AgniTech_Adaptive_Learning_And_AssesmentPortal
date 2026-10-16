// SkillTrace AI - Type Definitions

// ── Enums / unions ────────────────────────────────────────────────────────────
export type Difficulty    = 'beginner' | 'intermediate' | 'advanced';
export type QuestionType  = 'mcq' | 'code-output' | 'fill-blank' | 'find-bug' | 'conceptual';
export type LearningMode  = 'learn' | 'practice' | 'revision';
export type MasteryLevel  = 'not-started' | 'learning' | 'needs-practice' | 'mastered';
export type LangMode      = 'english' | 'hinglish';
export type ChallengeLevel = 'easy' | 'medium' | 'hard';

// ── Language ──────────────────────────────────────────────────────────────────
export interface Language {
  id: string;
  name: string;
  icon: string;
  color: string;
  bgColor: string;
  description: string;
  topicCount: number;
  level: string;
}

// ── Topic ─────────────────────────────────────────────────────────────────────
export interface Topic {
  id: string;
  languageId: string;
  title: string;
  description: string;
  difficulty: Difficulty;
  prerequisites: string[];
  objectives: string[];
  estimatedMinutes: number;
  xpReward: number;
  order: number;
  tags: string[];
}

// ── Lesson ────────────────────────────────────────────────────────────────────
export interface Lesson {
  id: string;
  topicId: string;
  title: string;
  /** English content */
  content: string;
  /** Optional Hinglish content — falls back to English if absent */
  contentHinglish?: string;
  codeExample?: string;
  language?: string;
  output?: string;
  commonMistakes: string[];
  keyPoints: string[];
  aiGenerated: boolean;
}

// ── Hint ──────────────────────────────────────────────────────────────────────
export interface Hint {
  id: string;
  questionId: string;
  level: 1 | 2 | 3 | 4;
  text: string;
}

// ── Quiz Question ─────────────────────────────────────────────────────────────
export interface Question {
  id: string;
  topicId: string;
  languageId: string;
  type: QuestionType;
  difficulty: Difficulty;
  /** Easy/Medium/Hard label for adaptive engine (maps from difficulty) */
  challengeLevel?: ChallengeLevel;
  text: string;
  code?: string;
  options?: string[];
  correctAnswer: string | number;
  explanation: string;
  hints: Hint[];
  xpReward: number;
  aiGenerated: boolean;
  prerequisiteConcepts?: string[];
}

// ── Coding Challenge ──────────────────────────────────────────────────────────
export interface TestCase {
  id: string;
  challengeId: string;
  input: string;
  expectedOutput: string;
  isHidden: boolean;
  description: string;
}

export interface CodingChallenge {
  id: string;
  topicId: string;
  languageId: string;
  title: string;
  description: string;
  inputFormat: string;
  outputFormat: string;
  constraints: string;
  examples: { input: string; output: string; explanation?: string }[];
  starterCode: Record<string, string>; // { python: '...', java: '...' }
  difficulty: ChallengeLevel;
  xpReward: number;
  testCases: TestCase[];
  hints: Hint[];
  tags: string[];
}

export interface CodingSubmission {
  id: string;
  challengeId: string;
  userId: string;
  language: string;
  code: string;
  submittedAt: number;
  publicTestsPassed: number;
  publicTestsTotal: number;
  hiddenTestsPassed: number;
  hiddenTestsTotal: number;
  status: 'accepted' | 'partial' | 'wrong-answer' | 'compilation-error' | 'runtime-error' | 'demo';
  score: number;  // 0-100 based on tests
  executionTime: string | null;
  memoryUsed: string | null;
  compilationError: string | null;
  runtimeError: string | null;
}

// ── Diagnostic Assessment ─────────────────────────────────────────────────────
export interface DiagnosticQuestion {
  id: string;
  languageId: string;
  text: string;
  code?: string;
  options: string[];
  correctAnswer: number;
  targetConcept: string;       // concept this question probes
  difficulty: Difficulty;
  explanation: string;         // NOT shown during diagnostic
}

export interface DiagnosticResult {
  userId: string;
  languageId: string;
  completedAt: number;
  totalQuestions: number;
  correctAnswers: number;
  conceptResults: Record<string, boolean>;   // concept → correct?
  recommendedLevel: Difficulty;
  weakConcepts: string[];
  retaken: boolean;
}

// ── Revision Card ─────────────────────────────────────────────────────────────
export interface RevisionCard {
  id: string;
  topicId: string;
  languageId: string;
  title: string;
  keyIdea: string;
  keyIdeaHinglish?: string;
  syntaxExample?: string;
  language?: string;
  commonMistake: string;
  memoryTip?: string;
  difficulty: Difficulty;
  tags: string[];
}

// ── Quiz Attempt (existing, keep compatible) ──────────────────────────────────
export interface QuizAttempt {
  id: string;
  questionId: string;
  selectedAnswer: string | number;
  isCorrect: boolean;
  hintsUsed: number;
  timestamp: number;
  timeTaken: number;
}

// ── Topic Progress ────────────────────────────────────────────────────────────
export interface TopicProgress {
  topicId: string;
  mastery: MasteryLevel;
  masteryScore: number;           // 0-100
  lessonsCompleted: number;
  questionsAttempted: number;
  questionsCorrect: number;
  hintsUsed: number;
  lastAttempt: number;
  attempts: QuizAttempt[];
  /** For adaptive engine: consecutive correct without hints */
  consecutiveCorrect: number;
  /** Track question IDs used to avoid repeats */
  usedQuestionIds: string[];
  currentDifficulty: Difficulty;
}

// ── Achievement ───────────────────────────────────────────────────────────────
export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  xpReward: number;
  unlockedAt?: number;
  condition: string;
}

// ── User Profile (extended from v1) ──────────────────────────────────────────
export interface UserProfile {
  id: string;
  name: string;
  email?: string;
  avatar: string;
  xp: number;
  level: number;
  streak: number;
  lastActiveDate: string;
  /** ISO date string of last activity for daily goal reset */
  dailyGoalDate: string;
  selectedLanguage: string;
  dailyGoal: number;
  dailyProgress: number;
  /** Questions answered today */
  dailyQuestionsToday: number;
  /** Lessons completed today */
  dailyLessonsToday: number;
  voiceEnabled: boolean;
  darkMode: boolean;
  learningLanguage: LangMode;       // English or Hinglish explanations
  completedTopics: string[];
  topicProgress: Record<string, TopicProgress>;
  achievements: string[];
  preferredDifficulty: Difficulty;
  createdAt: number;
  /** Diagnostic completed for each languageId */
  diagnosticCompleted: Record<string, boolean>;
  /** Bookmarked revision card IDs */
  bookmarkedCards: string[];
  /** Reviewed revision card IDs */
  reviewedCards: string[];
  /** Whether to show on leaderboard */
  showOnLeaderboard: boolean;
  /** Display name for leaderboard (may differ from name) */
  leaderboardName: string;
  /** Whether onboarding has been completed */
  onboardingDone: boolean;
}

// ── Session Stats ─────────────────────────────────────────────────────────────
export interface SessionStats {
  questionsAnswered: number;
  correctAnswers: number;
  xpEarned: number;
  timeSpent: number;
  hintsUsed: number;
  topicsStudied: string[];
}

// ── Adaptive Recommendation ───────────────────────────────────────────────────
export interface RecommendationReason {
  type: 'weak-concept' | 'next-topic' | 'revision-due' | 'daily-challenge';
  message: string;
  topicId: string;
}

// ── Leaderboard ───────────────────────────────────────────────────────────────
export interface LeaderboardEntry {
  rank: number;
  userId: string;
  displayName: string;
  avatar: string;
  xp: number;
  streak: number;
  weeklyXP: number;
  isCurrentUser: boolean;
}
