// SkillTrace AI — Voice Feedback Module (Web Speech API)
// Uses only the browser's built-in SpeechSynthesis — no paid API required.
// Falls back gracefully if unsupported.

const VoiceFeedback = (() => {
  const synth = window.speechSynthesis || null;
  let enabled = true;
  let voices   = [];
  let preferredVoice = null;

  const POSITIVE_MESSAGES = [
    "Excellent! That's correct! You're on a roll!",
    "Brilliant answer! Keep going!",
    "Amazing! You've got this concept down!",
    "Perfect! Ready for the next challenge?",
    "Fantastic work! You're making great progress!",
    "Correct! You're getting better with every attempt!"
  ];

  const SUPPORTIVE_MESSAGES = [
    "No worries! Mistakes are how we learn. Let's try again.",
    "Almost there! Take a look at the hint for a nudge.",
    "It's okay to struggle with a new concept. We'll work through it together.",
    "Good try! Check the explanation and give it another go.",
    "Learning is a process. You're doing great just by trying!"
  ];

  const HINT_MESSAGES = [
    "Here's a hint to guide you.",
    "Let me give you a little help.",
    "No problem — here's a clue to point you in the right direction."
  ];

  function loadVoices() {
    if (!synth) return;
    voices = synth.getVoices();
    // Prefer a natural-sounding English voice
    preferredVoice = voices.find(v => v.lang.startsWith('en') && v.name.includes('Female'))
                  || voices.find(v => v.lang.startsWith('en'))
                  || null;
  }

  if (synth) {
    loadVoices();
    synth.addEventListener && synth.addEventListener('voiceschanged', loadVoices);
    // Some browsers fire voiceschanged; others don't
    setTimeout(loadVoices, 500);
  }

  function speak(text, rate = 0.95) {
    if (!synth || !enabled) return;
    synth.cancel(); // stop any current speech
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate   = rate;
    utterance.pitch  = 1.05;
    utterance.volume = 0.9;
    if (preferredVoice) utterance.voice = preferredVoice;
    synth.speak(utterance);
  }

  function speakCorrect() {
    const msg = POSITIVE_MESSAGES[Math.floor(Math.random() * POSITIVE_MESSAGES.length)];
    speak(msg);
    return msg;
  }

  function speakIncorrect() {
    const msg = SUPPORTIVE_MESSAGES[Math.floor(Math.random() * SUPPORTIVE_MESSAGES.length)];
    speak(msg);
    return msg;
  }

  function speakHint() {
    const msg = HINT_MESSAGES[Math.floor(Math.random() * HINT_MESSAGES.length)];
    speak(msg);
    return msg;
  }

  function speakText(text) {
    speak(text);
  }

  function setEnabled(val) {
    enabled = !!val;
    if (!enabled && synth) synth.cancel();
  }

  function isEnabled() { return enabled; }
  function isSupported() { return !!synth; }
  function stop() { if (synth) synth.cancel(); }

  return { speakCorrect, speakIncorrect, speakHint, speakText, setEnabled, isEnabled, isSupported, stop };
})();

window.VoiceFeedback = VoiceFeedback;
