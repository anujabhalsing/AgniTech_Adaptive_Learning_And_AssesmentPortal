// Voice feedback utility using the browser's SpeechSynthesis API

const POSITIVE_MESSAGES = [
  'Yahoooo! Correct answer! Great job!',
  'Amazing work! You are getting better with every attempt!',
  'Perfect! You have mastered another concept!',
  'Brilliant! Ready for the next challenge?',
  'Excellent! That is exactly right!',
  'Wonderful! Keep up the great work!',
  'Outstanding! You are on a roll!',
];

const ENCOURAGING_MESSAGES = [
  'No worries! Mistakes are part of learning. Let us try again.',
  'You are getting closer. Here is a small hint to help you.',
  'It is okay to struggle with a new concept. We will work through it together.',
  'Good effort! Review the explanation and give it another go.',
  'Almost there! Take your time and think it through.',
  'Learning takes practice. You have got this!',
];

function getRandomMessage(messages: string[]): string {
  return messages[Math.floor(Math.random() * messages.length)];
}

let currentUtterance: SpeechSynthesisUtterance | null = null;

export function speak(text: string, enabled: boolean): void {
  if (!enabled) return;
  if (!('speechSynthesis' in window)) return;

  // Cancel any ongoing speech
  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = 1.0;
  utterance.pitch = 1.0;
  utterance.volume = 0.85;

  // Prefer a pleasant voice if available
  const voices = window.speechSynthesis.getVoices();
  const preferred = voices.find(
    (v) =>
      v.lang.startsWith('en') &&
      (v.name.includes('Female') || v.name.includes('Samantha') || v.name.includes('Google'))
  );
  if (preferred) utterance.voice = preferred;

  currentUtterance = utterance;
  window.speechSynthesis.speak(utterance);
}

export function speakCorrect(enabled: boolean): void {
  speak(getRandomMessage(POSITIVE_MESSAGES), enabled);
}

export function speakIncorrect(enabled: boolean): void {
  speak(getRandomMessage(ENCOURAGING_MESSAGES), enabled);
}

export function speakCustom(text: string, enabled: boolean): void {
  speak(text, enabled);
}

export function stopSpeaking(): void {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
    currentUtterance = null;
  }
}

export function isSpeechSupported(): boolean {
  return 'speechSynthesis' in window;
}
