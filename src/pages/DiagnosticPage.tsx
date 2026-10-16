import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, AlertCircle } from 'lucide-react';
import { getDiagnosticQuestions } from '../data/diagnostic';
import { languages } from '../data';
import { useApp } from '../context/AppContext';
import { DiagnosticResult, DiagnosticQuestion } from '../types';
import CodeBlock from '../components/CodeBlock';

type Phase = 'select-lang' | 'running' | 'complete';

export default function DiagnosticPage() {
  const { state, completeDiagnostic, dispatch } = useApp();
  const { user } = state;
  const navigate = useNavigate();

  const [phase, setPhase]           = useState<Phase>('select-lang');
  const [langId, setLangId]         = useState(user.selectedLanguage);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers]       = useState<Record<string, number>>({});
  const [selected, setSelected]     = useState<number | null>(null);
  const [result, setResult]         = useState<DiagnosticResult | null>(null);

  const questions = useMemo(() => getDiagnosticQuestions(langId), [langId]);

  const handleStartDiagnostic = () => {
    if (questions.length === 0) return;
    setPhase('running');
    setCurrentIdx(0);
    setAnswers({});
    setSelected(null);
  };

  const handleAnswer = () => {
    if (selected === null) return;
    const q = questions[currentIdx];
    const newAnswers = { ...answers, [q.id]: selected };
    setAnswers(newAnswers);
    setSelected(null);

    if (currentIdx + 1 < questions.length) {
      setCurrentIdx((i) => i + 1);
    } else {
      // Compute results — DO NOT show correct/incorrect per question
      computeAndFinish(newAnswers, questions);
    }
  };

  const computeAndFinish = (
    finalAnswers: Record<string, number>,
    qs: DiagnosticQuestion[]
  ) => {
    const conceptResults: Record<string, boolean> = {};
    let correct = 0;
    qs.forEach((q) => {
      const ans = finalAnswers[q.id] ?? -1;
      const isCorrect = ans === q.correctAnswer;
      conceptResults[q.targetConcept] = isCorrect;
      if (isCorrect) correct++;
    });

    const percent = correct / qs.length;
    const weakConcepts = qs
      .filter((q) => !conceptResults[q.targetConcept])
      .map((q) => q.targetConcept)
      .filter((v, i, a) => a.indexOf(v) === i);

    const recommendedLevel =
      percent >= 0.75 ? 'intermediate' :
      percent >= 0.45 ? 'beginner' :
      'beginner';

    const diagResult: DiagnosticResult = {
      userId: user.id,
      languageId: langId,
      completedAt: Date.now(),
      totalQuestions: qs.length,
      correctAnswers: correct,
      conceptResults,
      recommendedLevel,
      weakConcepts,
      retaken: Boolean(user.diagnosticCompleted[langId]),
    };

    setResult(diagResult);
    completeDiagnostic(langId, diagResult);
    setPhase('complete');
  };

  const handleSkip = () => {
    dispatch({ type: 'COMPLETE_ONBOARDING' });
    navigate('/');
  };

  const currentQ = questions[currentIdx];
  const progress = questions.length > 0 ? (currentIdx / questions.length) * 100 : 0;

  // ── Select language ──
  if (phase === 'select-lang') {
    return (
      <div style={{
        minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: 'var(--bg)', padding: 24,
      }}>
        <div style={{ maxWidth: 560, width: '100%' }}>
          <div style={{ textAlign: 'center', marginBottom: 32 }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>🎯</div>
            <h1 style={{ fontSize: 26, fontWeight: 800, color: 'var(--text-primary)', marginBottom: 8 }}>
              Quick Diagnostic Assessment
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: 15, lineHeight: 1.6 }}>
              This short assessment helps us recommend the right starting point for you.
              Answer honestly — there's no pass or fail, and you can retake it anytime.
            </p>
          </div>

          <div className="card" style={{ marginBottom: 20 }}>
            <div style={{
              background: 'rgba(217,119,6,0.06)', border: '1px solid rgba(217,119,6,0.2)',
              borderRadius: 8, padding: '10px 14px', marginBottom: 16,
            }}>
              <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                <AlertCircle size={15} color="var(--warning)" style={{ flexShrink: 0, marginTop: 1 }} />
                <p style={{ fontSize: 13, color: 'var(--warning)', margin: 0 }}>
                  <strong>Important:</strong> Correct answers are NOT shown during the diagnostic. Results are used only to personalise your learning path.
                </p>
              </div>
            </div>

            <h2 style={{ fontSize: 16, fontWeight: 600, marginBottom: 14, color: 'var(--text-primary)' }}>
              Choose a language to assess:
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 10, marginBottom: 20 }}>
              {languages
                .filter((l) => getDiagnosticQuestions(l.id).length > 0)
                .map((lang) => (
                <button
                  key={lang.id}
                  style={{
                    padding: '12px 10px', borderRadius: 10, cursor: 'pointer',
                    border: '2px solid',
                    borderColor: langId === lang.id ? 'var(--primary)' : 'var(--border)',
                    background: langId === lang.id ? 'rgba(79,70,229,0.08)' : 'var(--surface)',
                    textAlign: 'center', transition: 'all 0.15s',
                  }}
                  onClick={() => setLangId(lang.id)}
                >
                  <div style={{ fontSize: 24, marginBottom: 4 }}>{lang.icon}</div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>{lang.name}</div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>
                    {getDiagnosticQuestions(lang.id).length} questions
                  </div>
                </button>
              ))}
            </div>

            <button
              className="btn btn-primary btn-lg"
              style={{ width: '100%', marginBottom: 10 }}
              onClick={handleStartDiagnostic}
              disabled={questions.length === 0}
            >
              Start Diagnostic <ChevronRight size={18} />
            </button>
            <button className="btn btn-ghost" style={{ width: '100%' }} onClick={handleSkip}>
              Skip for now — go to dashboard
            </button>
          </div>
          <p style={{ textAlign: 'center', fontSize: 12, color: 'var(--text-muted)' }}>
            This is not a scientifically validated intelligence test. It's a starting-point guide.
          </p>
        </div>
      </div>
    );
  }

  // ── Running ──
  if (phase === 'running' && currentQ) {
    return (
      <div style={{
        minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: 'var(--bg)', padding: 24,
      }}>
        <div style={{ maxWidth: 640, width: '100%' }}>
          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <div style={{ fontSize: 14, color: 'var(--text-secondary)', fontWeight: 600 }}>
              {languages.find((l) => l.id === langId)?.icon} {languages.find((l) => l.id === langId)?.name} Diagnostic
            </div>
            <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>
              {currentIdx + 1} / {questions.length}
            </div>
          </div>
          <div className="progress-bar" style={{ marginBottom: 24 }}>
            <div className="progress-fill" style={{ width: `${progress}%`, background: 'linear-gradient(90deg, #4F46E5, #7C3AED)' }} />
          </div>

          <div className="card animate-fadeIn" style={{ marginBottom: 16 }}>
            {/* No difficulty badge shown during diagnostic to avoid anchoring */}
            <p style={{ fontSize: 16, fontWeight: 500, color: 'var(--text-primary)', marginBottom: 16, whiteSpace: 'pre-line', lineHeight: 1.7 }}>
              {currentQ.text}
            </p>
            {currentQ.code && (
              <div style={{ marginBottom: 16 }}>
                <CodeBlock code={currentQ.code} language={langId} showLineNumbers={false} />
              </div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 20 }}>
              {currentQ.options.map((opt, idx) => (
                <button
                  key={idx}
                  className={`quiz-option ${selected === idx ? 'selected' : ''}`}
                  onClick={() => setSelected(idx)}
                >
                  <span style={{
                    width: 26, height: 26, borderRadius: '50%', flexShrink: 0,
                    background: selected === idx ? 'rgba(79,70,229,0.1)' : 'var(--bg)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 11, fontWeight: 700, color: selected === idx ? 'var(--primary)' : 'var(--text-muted)',
                    border: '1px solid currentColor',
                  }}>
                    {String.fromCharCode(65 + idx)}
                  </span>
                  <span>{opt}</span>
                </button>
              ))}
            </div>

            <div style={{
              background: 'rgba(79,70,229,0.04)', borderRadius: 8, padding: '8px 12px',
              marginBottom: 16, fontSize: 12, color: 'var(--text-muted)',
            }}>
              ⚠️ Feedback and correct answers will not be shown until the diagnostic is complete.
            </div>

            <button
              className="btn btn-primary"
              style={{ width: '100%' }}
              onClick={handleAnswer}
              disabled={selected === null}
            >
              {currentIdx + 1 < questions.length ? 'Next Question' : 'Finish Diagnostic'} <ChevronRight size={15} />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── Complete ──
  if (phase === 'complete' && result) {
    const levelLabels: Record<string, string> = {
      beginner: 'Beginner — Build strong foundations',
      intermediate: 'Intermediate — Deepen your knowledge',
      advanced: 'Advanced — Master complex concepts',
    };
    const percent = Math.round((result.correctAnswers / result.totalQuestions) * 100);

    return (
      <div style={{
        minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: 'var(--bg)', padding: 24,
      }}>
        <div style={{ maxWidth: 560, width: '100%', textAlign: 'center' }}>
          <div className="card animate-scaleIn" style={{ padding: '36px 24px', marginBottom: 16 }}>
            <div style={{ fontSize: 56, marginBottom: 16 }}>
              {percent >= 75 ? '🌟' : percent >= 45 ? '🎯' : '📚'}
            </div>
            <h1 style={{ fontSize: 24, fontWeight: 800, color: 'var(--text-primary)', marginBottom: 8 }}>
              Diagnostic Complete!
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: 15, marginBottom: 24 }}>
              Based on your responses, here's your personalised starting recommendation.
            </p>

            <div style={{
              background: 'rgba(79,70,229,0.06)', border: '1px solid rgba(79,70,229,0.15)',
              borderRadius: 12, padding: '16px 20px', marginBottom: 20, textAlign: 'left',
            }}>
              <div style={{ fontSize: 12, color: 'var(--primary)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 6 }}>
                Recommended Starting Level
              </div>
              <div style={{ fontSize: 20, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 4 }}>
                {levelLabels[result.recommendedLevel]}
              </div>
              <p style={{ fontSize: 13, color: 'var(--text-secondary)', margin: 0 }}>
                This is an estimate based on {result.totalQuestions} diagnostic questions, not a complete assessment.
              </p>
            </div>

            {result.weakConcepts.length > 0 && (
              <div style={{
                background: 'rgba(217,119,6,0.06)', border: '1px solid rgba(217,119,6,0.2)',
                borderRadius: 10, padding: '12px 16px', marginBottom: 20, textAlign: 'left',
              }}>
                <div style={{ fontSize: 12, color: 'var(--warning)', fontWeight: 600, marginBottom: 8, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                  Suggested focus areas
                </div>
                {result.weakConcepts.slice(0, 4).map((c) => (
                  <div key={c} style={{ display: 'flex', gap: 6, alignItems: 'center', marginBottom: 4 }}>
                    <span style={{ color: 'var(--warning)' }}>•</span>
                    <span style={{ fontSize: 13, color: 'var(--text-secondary)', textTransform: 'capitalize' }}>
                      {c.replace(/-/g, ' ')}
                    </span>
                  </div>
                ))}
              </div>
            )}

            <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 24, lineHeight: 1.6 }}>
              Correct answers and per-question feedback are not displayed after a diagnostic. They are stored internally to shape your learning recommendations.
            </div>

            <button
              className="btn btn-primary btn-lg"
              style={{ width: '100%' }}
              onClick={() => {
                dispatch({ type: 'COMPLETE_ONBOARDING' });
                navigate('/');
              }}
            >
              Start Learning <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
