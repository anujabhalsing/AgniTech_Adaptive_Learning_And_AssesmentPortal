import { TopicProgress, MasteryLevel, RecommendationReason } from '../types';
import { topics } from '../data';

export function getMasteryColor(mastery: MasteryLevel): string {
  switch (mastery) {
    case 'mastered': return 'text-green-600 bg-green-50 border-green-200';
    case 'learning': return 'text-blue-600 bg-blue-50 border-blue-200';
    case 'needs-practice': return 'text-amber-600 bg-amber-50 border-amber-200';
    default: return 'text-slate-400 bg-slate-50 border-slate-200';
  }
}

export function getMasteryLabel(mastery: MasteryLevel): string {
  switch (mastery) {
    case 'mastered': return 'Mastered';
    case 'learning': return 'Learning';
    case 'needs-practice': return 'Needs Practice';
    default: return 'Not Started';
  }
}

export function getMasteryPercent(progress: TopicProgress | undefined): number {
  if (!progress) return 0;
  return progress.masteryScore;
}

export function getWeakTopics(
  topicProgress: Record<string, TopicProgress>,
  languageId?: string
): string[] {
  return Object.entries(topicProgress)
    .filter(([topicId, progress]) => {
      const topic = topics.find((t) => t.id === topicId);
      if (languageId && topic?.languageId !== languageId) return false;
      return progress.mastery === 'needs-practice' || progress.mastery === 'learning';
    })
    .sort(([, a], [, b]) => a.masteryScore - b.masteryScore)
    .map(([topicId]) => topicId);
}

export function getNextRecommendedTopic(
  topicProgress: Record<string, TopicProgress>,
  selectedLanguage: string
): RecommendationReason | null {
  const langTopics = topics
    .filter((t) => t.languageId === selectedLanguage)
    .sort((a, b) => a.order - b.order);

  // First: fix topics that need practice
  const needsPractice = langTopics.find(
    (t) => topicProgress[t.id]?.mastery === 'needs-practice'
  );
  if (needsPractice) {
    return {
      type: 'weak-concept',
      message: `We recommend revisiting "${needsPractice.title}" because your recent answers suggest this concept needs more practice.`,
      topicId: needsPractice.id,
    };
  }

  // Second: continue where you left off
  const inProgress = langTopics.find(
    (t) => topicProgress[t.id]?.mastery === 'learning'
  );
  if (inProgress) {
    return {
      type: 'next-topic',
      message: `Continue learning "${inProgress.title}" — you're making great progress!`,
      topicId: inProgress.id,
    };
  }

  // Third: next untouched topic whose prerequisites are met
  const nextNew = langTopics.find((t) => {
    if (topicProgress[t.id]) return false;
    const prereqsMet = t.prerequisites.every(
      (prereqId) => topicProgress[prereqId]?.mastery === 'mastered' || topicProgress[prereqId]?.mastery === 'learning'
    );
    return prereqsMet || t.prerequisites.length === 0;
  });
  if (nextNew) {
    return {
      type: 'next-topic',
      message: `You're ready to start "${nextNew.title}" — all prerequisites are complete!`,
      topicId: nextNew.id,
    };
  }

  return null;
}

export function getRevisionTopics(
  topicProgress: Record<string, TopicProgress>
): string[] {
  const now = Date.now();
  const DAY = 86400000;

  return Object.entries(topicProgress)
    .filter(([, progress]) => {
      const daysSince = (now - progress.lastAttempt) / DAY;
      // Topics not practiced in 3+ days that aren't fully mastered
      return daysSince >= 3 && progress.mastery !== 'mastered';
    })
    .sort(([, a], [, b]) => a.lastAttempt - b.lastAttempt)
    .map(([topicId]) => topicId);
}

export function getXPForLevel(level: number): number {
  return level * level * 50;
}

export function getXPProgress(xp: number): { current: number; required: number; percent: number } {
  const level = Math.floor(Math.sqrt(xp / 50)) + 1;
  const currentLevelXP = getXPForLevel(level - 1);
  const nextLevelXP = getXPForLevel(level);
  const required = nextLevelXP - currentLevelXP;
  const current = xp - currentLevelXP;
  return { current, required, percent: Math.round((current / required) * 100) };
}
