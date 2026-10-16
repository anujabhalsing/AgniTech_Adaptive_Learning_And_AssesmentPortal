import React, { useState, useCallback, useEffect } from 'react';
import { CheckCircle2, XCircle, Lightbulb, ChevronRight, RotateCcw } from 'lucide-react';
import { Question, Hint } from '../types';
import { useApp } from '../context/AppContext';
import { speakCorrect, speakIncorrect } from '../utils/voice';
import CodeBlock from './CodeBlock';

interface QuizEngineProps {
  questions: Question[];
  topicId: string;
  onComplete: (score: number, total: number, xpEarned: number) => void;
}

type Phase = 'answering' | 'correct' | 'incorrect';

export default function QuizEngine({ questions, topicId, onComplete }: QuizEngineProps) {
  const { state, recordAttempt, unlockAchievement } = useApp();
  const { user } = state;

  const [currentIdx, setCurrentIdx] = useState(0);
  const [phase, setPhase] = useState<Phase>('answering');
  const [selected, setSelected] = useState<number | null>(null);
  const [hintsShown, setHintsShown] = useState<number>(0);
  const [score, setScore] = useState(0);
  const [totalXP, setTotalXP] = useState(0);
  const [startTime] = useState(Date.now());
  const [questionStart, setQuestionStart] = useState(Date.now());

  const currentQuestion = questions[currentIdx];
  const isLast = currentIdx === questions.length - 1;

  const handleSelect = useCallback((optionIdx: number) => {
    if (phase !== 'answering') return;
    setSelected(optionIdx);
  }, [phase]);

  const handleSubmit = useCallback(() => {
    if (selected === null || phase !== 'answering') return;

    const isCorrect = selected === currentQuestion.correctAnswer;
    const timeTaken = Math.round((Date.now() - questionStart) / 1000);

    recordAttempt({
      id: `${Date.now()}-${currentQuestion.id}`,
      questionId: currentQuestion.id,
      selectedAnswer: selected,
      isCorrect,
      hintsUsed: hintsShown,
      timestamp: Date.now(),
      timeTaken,
      topicId,
      xp: currentQuestion.xpReward,
    });

    if (isCorrect) {
      setScore((s) => s + 1);
      setTotalXP((x) => x + currentQuestion.xpReward);
      speakCorrect(user.voiceEnabled);
      setPhase('correct');
    } else {
      speakIncorrect(user.voiceEnabled);
      setPhase('incorrect');
    }

    // Unlock achievements
    unlockAchievement('first-quiz');
  }, [selected, phase, currentQuestion, hintsShown, questionStart, topicId, recordAttempt, user.voiceEnabled, unlockAchievement]);

  const handleNext = useCallback(() => {
    if (isLast) {
      onComplete(score + (phase === 'correct' ? 0 : 0), questions.length, totalXP);
    } else {
      setCurrentIdx((i) => i + 1);
      setPhase('answering');
      setSelected(null);
      setHintsShown(0);
      setQuestionStart(Date.now());
    }
  }, [isLast, score, phase, questions.length, totalXP, onComplete]);

  const handleRetry = useCallback(() => {
    setPhase('answering');
    setSelected(null);
    setHintsShown(0);
    setQuestionStart(Date.now());
    unlockAchievement('persistent');
  }, [unlockAchievement]);

  const showNextHint = useCallback(() => {
    const maxHints = currentQuestion.hints.length;
    if (hintsShown < maxHints) setHintsShown((h) => h + 1);
  }, [hintsShown, currentQuestion.hints.length]);

  const progress = ((currentIdx) / questions.length) * 100;

  return (
    <div style={{ maxWidth: 680, margin: '0 auto' }}>
      {/* Progress */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: 'var(--text-muted)', marginBottom: 8 }}>
          <span>Question {currentIdx + 1} of {questions.length}</span>
          <span>Score: {score}/{currentIdx + (phase !== 'answering' ? 1 : 0)}</span>
        </div>
        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{ width: `${progress}%`, background: 'linear-gradient(90deg, #4F46E5, #7C3AED)' }}
          />
        </div>
      </div>

      {/* Question card */}
      <div className="card animate-fadeIn" style={{ marginBottom: 16 }}>
        {/* Question header */}
        <div style={{ display: 'flex', gap: 10, marginBottom: 16, alignItems: 'flex-start' }}>
          <span className={`badge badge-${currentQuestion.difficulty}`}>
            {currentQuestion.difficulty}
          </span>
          <span className="badge" style={{ color: 'var(--text-muted)', background: 'var(--bg)', borderColor: 'var(--border)' }}>
            {currentQuestion.type.replace('-', ' ')}
          </span>
          <span style={{ marginLeft: 'auto', fontSize: 13, color: 'var(--primary)', fontWeight: 600 }}>
            +{currentQuestion.xpReward} XP
          </span>
        </div>

        {/* Question text */}
        <p style={{ fontSize: 16, fontWeight: 500, color: 'var(--text-primary)', marginBottom: 16, lineHeight: 1.6, whiteSpace: 'pre-line' }}>
          {currentQuestion.text}
        </p>

        {/* Code snippet if any */}
        {currentQuestion.code && (
          <div style={{ marginBottom: 16 }}>
            <CodeBlock
              code={currentQuestion.code}
              language={currentQuestion.languageId}
              showLineNumbers={false}
            />
          </div>
        )}

        {/* Options */}
        {currentQuestion.options && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {currentQuestion.options.map((option, idx) => {
              let className = 'quiz-option';
              if (phase !== 'answering') {
                if (idx === currentQuestion.correctAnswer) className += ' correct';
                else if (idx === selected && !( idx === currentQuestion.correctAnswer)) className += ' incorrect';
              } else if (selected === idx) {
                className += ' selected';
              }

              return (
                <button
                  key={idx}
                  className={className}
                  onClick={() => handleSelect(idx)}
                  disabled={phase !== 'answering'}
                  aria-pressed={selected === idx}
                >
                  <span style={{
                    width: 28, height: 28, borderRadius: '50%',
                    background: phase !== 'answering' && idx === currentQuestion.correctAnswer
                      ? 'rgba(22,163,74,0.1)'
                      : phase !== 'answering' && idx === selected && idx !== currentQuestion.correctAnswer
                      ? 'rgba(220,38,38,0.1)'
                      : selected === idx ? 'rgba(79,70,229,0.1)' : 'var(--bg)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0, fontSize: 12, fontWeight: 700,
                    color: phase !== 'answering' && idx === currentQuestion.correctAnswer
                      ? 'var(--success)'
                      : phase !== 'answering' && idx === selected && idx !== currentQuestion.correctAnswer
                      ? 'var(--error)'
                      : selected === idx ? 'var(--primary)' : 'var(--text-muted)',
                    border: '1px solid currentColor',
                  }}>
                    {String.fromCharCode(65 + idx)}
                  </span>
                  <span style={{ flex: 1 }}>{option}</span>
                  {phase !== 'answering' && idx === currentQuestion.correctAnswer && (
                    <CheckCircle2 size={18} color="var(--success)" />
                  )}
                  {phase !== 'answering' && idx === selected && idx !== currentQuestion.correctAnswer && (
                    <XCircle size={18} color="var(--error)" />
                  )}
                </button>
              );
            })}
          </div>
        )}

        {/* Submit */}
        {phase === 'answering' && (
          <button
            className="btn btn-primary"
            style={{ marginTop: 20, width: '100%' }}
            onClick={handleSubmit}
            disabled={selected === null}
          >
            Submit Answer
          </button>
        )}
      </div>

      {/* Feedback */}
      {phase === 'correct' && (
        <div className="card animate-bounceIn" style={{
          borderColor: 'var(--success)',
          background: 'rgba(22,163,74,0.04)',
          marginBottom: 16,
        }}>
          <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
            <CheckCircle2 size={24} color="var(--success)" style={{ flexShrink: 0, marginTop: 2 }} />
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 700, color: 'var(--success)', fontSize: 16, marginBottom: 4 }}>
                Correct! +{currentQuestion.xpReward} XP 🎉
              </div>
              <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                {currentQuestion.explanation}
              </p>
            </div>
          </div>
          <button
            className="btn btn-primary"
            style={{ marginTop: 16, width: '100%' }}
            onClick={handleNext}
          >
            {isLast ? 'See Results' : 'Next Question'} <ChevronRight size={16} />
          </button>
        </div>
      )}

      {phase === 'incorrect' && (
        <div className="card animate-scaleIn" style={{
          borderColor: 'var(--error)',
          background: 'rgba(220,38,38,0.04)',
          marginBottom: 16,
        }}>
          <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
            <XCircle size={24} color="var(--error)" style={{ flexShrink: 0, marginTop: 2 }} />
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 700, color: 'var(--error)', fontSize: 16, marginBottom: 4 }}>
                Not quite — keep going! 💪
              </div>
              <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                {currentQuestion.explanation}
              </p>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
            <button className="btn btn-secondary" style={{ flex: 1 }} onClick={handleRetry}>
              <RotateCcw size={15} /> Try Again
            </button>
            <button className="btn btn-ghost" style={{ flex: 1 }} onClick={handleNext}>
              {isLast ? 'See Results' : 'Next Question'} <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}

      {/* Hint ladder */}
      <div style={{ marginBottom: 16 }}>
        {phase === 'answering' && currentQuestion.hints.length > 0 && (
          <div>
            {currentQuestion.hints.slice(0, hintsShown).map((hint) => (
              <HintCard key={hint.id} hint={hint} />
            ))}
            {hintsShown < currentQuestion.hints.length && (
              <button
                className="btn btn-ghost btn-sm"
                onClick={showNextHint}
                style={{ width: '100%', justifyContent: 'center', marginTop: 8 }}
              >
                <Lightbulb size={15} style={{ color: 'var(--warning)' }} />
                {hintsShown === 0 ? 'Get a hint' : 'Next hint'}
                {' '}({currentQuestion.hints.length - hintsShown} remaining)
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function HintCard({ hint }: { hint: Hint }) {
  const levelLabels = ['Nudge', 'Concept', 'Pseudocode', 'Solution'];
  const levelColors = ['#4F46E5', '#7C3AED', '#D97706', '#16A34A'];

  return (
    <div className="hint-card" style={{ marginBottom: 8, borderLeftColor: levelColors[hint.level - 1] }}>
      <div style={{ fontSize: 11, fontWeight: 600, color: levelColors[hint.level - 1], marginBottom: 4, textTransform: 'uppercase', letterSpacing: 0.5 }}>
        Hint {hint.level}: {levelLabels[hint.level - 1]}
      </div>
      <p style={{ fontSize: 14, color: 'var(--text-secondary)', margin: 0 }}>{hint.text}</p>
    </div>
  );
}
