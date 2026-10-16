import React, { useState, useCallback, lazy, Suspense } from 'react';
import { Play, Send, RotateCcw, Lightbulb, ChevronDown, ChevronUp, AlertTriangle, CheckCircle2, XCircle, Clock, Cpu } from 'lucide-react';
import { codingChallenges } from '../data/codingChallenges';
import { languages } from '../data';
import { isJudge0Configured, runCode, ExecutionResult } from '../lib/judge0';
import { useApp } from '../context/AppContext';
import { CodingChallenge, TestCase, CodingSubmission } from '../types';

// Lazy-load Monaco editor to keep initial bundle lean
const MonacoEditor = lazy(() => import('@monaco-editor/react').then(m => ({ default: m.default })));

type View = 'list' | 'challenge';
type Panel = 'description' | 'results';

export default function CodingPage() {
  const { state, addXP, unlockAchievement } = useApp();
  const { user } = state;

  const [view, setView] = useState<View>('list');
  const [selectedChallenge, setSelectedChallenge] = useState<CodingChallenge | null>(null);
  const [selectedLang, setSelectedLang] = useState('python');
  const [code, setCode] = useState('');
  const [panel, setPanel] = useState<Panel>('description');
  const [running, setRunning] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [runResult, setRunResult] = useState<ExecutionResult | null>(null);
  const [submission, setSubmission] = useState<CodingSubmission | null>(null);
  const [hintsShown, setHintsShown] = useState(0);
  const [submissions, setSubmissions] = useState<CodingSubmission[]>([]);

  const judge0Active = isJudge0Configured();

  const openChallenge = (ch: CodingChallenge) => {
    const lang = ch.starterCode[selectedLang] ? selectedLang : Object.keys(ch.starterCode)[0];
    setSelectedChallenge(ch);
    setSelectedLang(lang);
    setCode(ch.starterCode[lang] ?? '');
    setPanel('description');
    setRunResult(null);
    setSubmission(null);
    setHintsShown(0);
    setView('challenge');
  };

  const handleLangChange = (lang: string) => {
    if (!selectedChallenge) return;
    setSelectedLang(lang);
    setCode(selectedChallenge.starterCode[lang] ?? '');
    setRunResult(null);
  };

  const handleRun = useCallback(async () => {
    if (!selectedChallenge) return;
    setRunning(true);
    setPanel('results');
    // Use first public test case as sample input
    const publicTest = selectedChallenge.testCases.find((tc) => !tc.isHidden);
    const result = await runCode(code, selectedLang, publicTest?.input ?? '');
    setRunResult(result);
    setRunning(false);
  }, [code, selectedLang, selectedChallenge]);

  const handleSubmit = useCallback(async () => {
    if (!selectedChallenge) return;
    setSubmitting(true);
    setPanel('results');

    const publicCases  = selectedChallenge.testCases.filter((tc) => !tc.isHidden);
    const hiddenCases  = selectedChallenge.testCases.filter((tc) => tc.isHidden);

    let publicPassed = 0;
    let hiddenPassed = 0;
    let compileError: string | null = null;
    let runtimeError: string | null = null;
    let lastExec: ExecutionResult | null = null;

    // Run public tests first
    for (const tc of publicCases) {
      const r = await runCode(code, selectedLang, tc.input);
      lastExec = r;
      if (r.compileOutput) { compileError = r.compileOutput; break; }
      if (r.stderr)        { runtimeError = r.stderr; }
      if (r.stdout?.trim() === tc.expectedOutput.trim()) publicPassed++;
    }

    // Run hidden tests (inputs revealed to server only — here simulated)
    if (!compileError) {
      for (const tc of hiddenCases) {
        const r = await runCode(code, selectedLang, tc.input);
        if (r.stdout?.trim() === tc.expectedOutput.trim()) hiddenPassed++;
      }
    }

    const totalPassed = publicPassed + hiddenPassed;
    const totalTests  = selectedChallenge.testCases.length;
    const score       = totalTests > 0 ? Math.round((totalPassed / totalTests) * 100) : 0;

    const status: CodingSubmission['status'] =
      compileError ? 'compilation-error' :
      lastExec?.isDemo ? 'demo' :
      score === 100 ? 'accepted' :
      score > 0     ? 'partial' :
      'wrong-answer';

    const sub: CodingSubmission = {
      id: `sub-${Date.now()}`,
      challengeId: selectedChallenge.id,
      userId: user.id,
      language: selectedLang,
      code,
      submittedAt: Date.now(),
      publicTestsPassed: publicPassed,
      publicTestsTotal: publicCases.length,
      hiddenTestsPassed: hiddenPassed,
      hiddenTestsTotal: hiddenCases.length,
      status,
      score,
      executionTime: lastExec?.time ?? null,
      memoryUsed: lastExec?.memory ?? null,
      compilationError: compileError,
      runtimeError: runtimeError,
    };

    setSubmission(sub);
    setSubmissions((prev) => [sub, ...prev]);

    if (score === 100) {
      addXP(selectedChallenge.xpReward);
      unlockAchievement('debug-explorer');
    } else if (score > 0) {
      addXP(Math.round(selectedChallenge.xpReward * score / 100));
    }

    setSubmitting(false);
  }, [code, selectedLang, selectedChallenge, user.id, addXP, unlockAchievement]);

  if (view === 'list') {
    return (
      <div className="page-content" style={{ margin: '0 auto' }}>
        <div style={{ marginBottom: 20 }}>
          <h1 style={{ fontSize: 28, fontWeight: 800, color: 'var(--text-primary)', marginBottom: 4 }}>
            Coding Challenges
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: 15 }}>
            Practise with real programming problems. Write, run, and submit your solution.
          </p>
        </div>

        {!judge0Active && (
          <div style={{
            background: 'rgba(217,119,6,0.06)', border: '1px solid rgba(217,119,6,0.2)',
            borderRadius: 10, padding: '12px 16px', marginBottom: 20,
          }}>
            <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
              <AlertTriangle size={15} color="var(--warning)" style={{ flexShrink: 0, marginTop: 1 }} />
              <div style={{ fontSize: 13, color: 'var(--warning)' }}>
                <strong>Demo Mode:</strong> VITE_JUDGE0_API_KEY is not configured. Code will not be executed —
                submissions will show simulated results. Configure Judge0 via RapidAPI to enable real code execution.
                See <code>.env.example</code> for setup instructions.
              </div>
            </div>
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 14 }}>
          {codingChallenges.map((ch) => {
            const lang = languages.find((l) => l.id === ch.languageId);
            const prevSub = submissions.filter((s) => s.challengeId === ch.id).sort((a, b) => b.submittedAt - a.submittedAt)[0];
            return (
              <div
                key={ch.id}
                className="card card-hover"
                style={{ cursor: 'pointer', borderTop: `3px solid ${diffColor(ch.difficulty)}` }}
                onClick={() => openChallenge(ch)}
                role="button" tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && openChallenge(ch)}
              >
                <div style={{ display: 'flex', gap: 10, marginBottom: 10 }}>
                  <span style={{ fontSize: 20 }}>{lang?.icon}</span>
                  <span className={`badge ${diffBadge(ch.difficulty)}`}>{ch.difficulty}</span>
                  {prevSub && (
                    <span className={`badge ${prevSub.score === 100 ? 'badge-mastered' : 'badge-needs-practice'}`}>
                      {prevSub.score === 100 ? 'Solved' : `${prevSub.score}%`}
                    </span>
                  )}
                </div>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 6 }}>{ch.title}</h3>
                <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 12, lineHeight: 1.5 }}>
                  {ch.description.split('\n')[0]}
                </p>
                <div style={{ display: 'flex', gap: 12, fontSize: 12, color: 'var(--text-muted)' }}>
                  <span>+{ch.xpReward} XP</span>
                  <span>{ch.testCases.length} test cases</span>
                  <span>{Object.keys(ch.starterCode).join(', ')}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // ── Challenge view ──
  if (!selectedChallenge) return null;

  const publicTests = selectedChallenge.testCases.filter((t) => !t.isHidden);
  const hiddenTests = selectedChallenge.testCases.filter((t) => t.isHidden);
  const availableLangs = Object.keys(selectedChallenge.starterCode);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 64px)' }}>
      {/* Top bar */}
      <div style={{
        padding: '10px 20px', background: 'var(--surface)', borderBottom: '1px solid var(--border)',
        display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap',
      }}>
        <button className="btn btn-ghost btn-sm" onClick={() => setView('list')}>
          ← Back
        </button>
        <h2 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)', flex: 1 }}>
          {selectedChallenge.title}
        </h2>
        <span className={`badge ${diffBadge(selectedChallenge.difficulty)}`}>{selectedChallenge.difficulty}</span>

        {/* Language selector */}
        <select
          value={selectedLang}
          onChange={(e) => handleLangChange(e.target.value)}
          style={{ width: 'auto', fontSize: 13 }}
          aria-label="Select language"
        >
          {availableLangs.map((l) => (
            <option key={l} value={l}>{languages.find((lang) => lang.id === l)?.name ?? l}</option>
          ))}
        </select>

        {!judge0Active && (
          <span style={{ fontSize: 11, color: 'var(--warning)', background: 'rgba(217,119,6,0.1)', padding: '3px 8px', borderRadius: 4 }}>
            Demo Mode
          </span>
        )}
      </div>

      {/* Main split */}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden', flexDirection: window.innerWidth < 768 ? 'column' : 'row' }}>
        {/* Left: description / results */}
        <div style={{ width: '40%', minWidth: 280, borderRight: '1px solid var(--border)', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <div className="tab-bar" style={{ margin: '8px 12px', flexShrink: 0 }}>
            <button className={`tab-btn ${panel === 'description' ? 'active' : ''}`} onClick={() => setPanel('description')}>Description</button>
            <button className={`tab-btn ${panel === 'results' ? 'active' : ''}`} onClick={() => setPanel('results')}>Results</button>
          </div>

          <div style={{ flex: 1, overflowY: 'auto', padding: '0 12px 20px' }}>
            {panel === 'description' && <DescriptionPanel challenge={selectedChallenge} hintsShown={hintsShown} onShowHint={() => setHintsShown((h) => Math.min(h + 1, selectedChallenge.hints.length))} />}
            {panel === 'results'     && <ResultsPanel run={runResult} sub={submission} publicTests={publicTests} hiddenTests={hiddenTests} running={running} submitting={submitting} />}
          </div>
        </div>

        {/* Right: editor */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', minWidth: 0 }}>
          <div style={{ flex: 1, overflow: 'hidden' }}>
            <Suspense fallback={
              <div style={{ padding: 20, color: 'var(--text-muted)', fontSize: 14 }}>Loading editor…</div>
            }>
              <MonacoEditor
                height="100%"
                language={selectedLang === 'javascript' ? 'javascript' : selectedLang === 'java' ? 'java' : selectedLang === 'cpp' ? 'cpp' : 'python'}
                theme="vs-dark"
                value={code}
                onChange={(v) => setCode(v ?? '')}
                options={{
                  minimap: { enabled: false },
                  fontSize: 14,
                  lineNumbers: 'on',
                  scrollBeyondLastLine: false,
                  wordWrap: 'on',
                  tabSize: 4,
                  automaticLayout: true,
                }}
              />
            </Suspense>
          </div>

          {/* Action bar */}
          <div style={{
            padding: '10px 16px', background: 'var(--surface)',
            borderTop: '1px solid var(--border)', display: 'flex', gap: 10, flexWrap: 'wrap',
          }}>
            <button
              className="btn btn-ghost btn-sm"
              onClick={() => { setCode(selectedChallenge.starterCode[selectedLang] ?? ''); setRunResult(null); setSubmission(null); }}
              title="Reset to starter code"
            >
              <RotateCcw size={14} /> Reset
            </button>
            <button
              className="btn btn-secondary"
              onClick={handleRun}
              disabled={running || submitting}
            >
              <Play size={14} /> {running ? 'Running…' : 'Run'}
            </button>
            <button
              className="btn btn-primary"
              onClick={handleSubmit}
              disabled={running || submitting}
            >
              <Send size={14} /> {submitting ? 'Submitting…' : 'Submit'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Sub-components ────────────────────────────────────────────────────────────

function DescriptionPanel({ challenge, hintsShown, onShowHint }: {
  challenge: CodingChallenge;
  hintsShown: number;
  onShowHint: () => void;
}) {
  return (
    <div style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.7 }}>
      <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 12, marginTop: 12 }}>Problem</h3>
      <p style={{ whiteSpace: 'pre-line', marginBottom: 16 }}>{challenge.description}</p>

      <SectionHeader title="Input Format" />
      <p style={{ marginBottom: 12 }}>{challenge.inputFormat}</p>

      <SectionHeader title="Output Format" />
      <p style={{ marginBottom: 12 }}>{challenge.outputFormat}</p>

      <SectionHeader title="Constraints" />
      <p style={{ marginBottom: 16, fontFamily: 'JetBrains Mono, monospace', fontSize: 13 }}>{challenge.constraints}</p>

      <SectionHeader title="Examples" />
      {challenge.examples.map((ex, i) => (
        <div key={i} style={{ background: 'var(--bg)', borderRadius: 8, padding: 12, marginBottom: 10, border: '1px solid var(--border)' }}>
          <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 4 }}>Example {i + 1}</div>
          <div style={{ fontSize: 12, marginBottom: 4 }}>
            <span style={{ color: 'var(--text-muted)' }}>Input: </span>
            <code style={{ fontFamily: 'JetBrains Mono, monospace', color: 'var(--text-primary)' }}>{ex.input}</code>
          </div>
          <div style={{ fontSize: 12, marginBottom: 4 }}>
            <span style={{ color: 'var(--text-muted)' }}>Output: </span>
            <code style={{ fontFamily: 'JetBrains Mono, monospace', color: 'var(--text-primary)' }}>{ex.output}</code>
          </div>
          {ex.explanation && <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>💡 {ex.explanation}</div>}
        </div>
      ))}

      {/* Hint ladder */}
      <SectionHeader title="Hints" />
      {challenge.hints.slice(0, hintsShown).map((hint) => (
        <div key={hint.id} className="hint-card" style={{ marginBottom: 8 }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--primary)', marginBottom: 4 }}>Hint {hint.level}</div>
          <p style={{ fontSize: 13, color: 'var(--text-secondary)', margin: 0, whiteSpace: 'pre-line' }}>{hint.text}</p>
        </div>
      ))}
      {hintsShown < challenge.hints.length && (
        <button className="btn btn-ghost btn-sm" onClick={onShowHint} style={{ width: '100%' }}>
          <Lightbulb size={14} style={{ color: 'var(--warning)' }} />
          {hintsShown === 0 ? 'Show a hint' : 'Show next hint'} ({challenge.hints.length - hintsShown} remaining)
        </button>
      )}
    </div>
  );
}

function ResultsPanel({ run, sub, publicTests, hiddenTests, running, submitting }: {
  run: ExecutionResult | null;
  sub: CodingSubmission | null;
  publicTests: TestCase[];
  hiddenTests: TestCase[];
  running: boolean;
  submitting: boolean;
}) {
  if (running || submitting) {
    return (
      <div style={{ padding: '40px 0', textAlign: 'center' }}>
        <div style={{ fontSize: 32, marginBottom: 12 }}>⏳</div>
        <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>
          {running ? 'Running your code…' : 'Evaluating all test cases…'}
        </p>
      </div>
    );
  }

  if (!run && !sub) {
    return (
      <div style={{ padding: '40px 0', textAlign: 'center', color: 'var(--text-muted)', fontSize: 14 }}>
        Click <strong>Run</strong> to test with sample input, or <strong>Submit</strong> to run all test cases.
      </div>
    );
  }

  return (
    <div style={{ marginTop: 12 }}>
      {/* Run result */}
      {run && !sub && (
        <>
          <SectionHeader title="Run Output" />
          {run.isDemo && (
            <div style={{ background: 'rgba(217,119,6,0.06)', border: '1px solid rgba(217,119,6,0.2)', borderRadius: 8, padding: '8px 12px', marginBottom: 10, fontSize: 12, color: 'var(--warning)' }}>
              ⚠️ Demo mode: code was not actually executed. Configure VITE_JUDGE0_API_KEY for real execution.
            </div>
          )}
          <OutputBox label="stdout" value={run.stdout} green />
          {run.stderr && <OutputBox label="stderr (error)" value={run.stderr} red />}
          {run.compileOutput && <OutputBox label="Compilation Error" value={run.compileOutput} red />}
        </>
      )}

      {/* Submission result */}
      {sub && (
        <>
          <SubmissionSummary sub={sub} />

          <SectionHeader title={`Public Test Cases (${sub.publicTestsPassed}/${sub.publicTestsTotal})`} />
          {publicTests.map((tc, i) => (
            <TestRow key={tc.id} tc={tc} idx={i} passed={i < sub.publicTestsPassed} />
          ))}

          <SectionHeader title={`Hidden Test Cases (${sub.hiddenTestsPassed}/${sub.hiddenTestsTotal})`} />
          <div style={{ background: 'var(--bg)', borderRadius: 8, padding: '10px 12px', border: '1px solid var(--border)', marginBottom: 10, fontSize: 13, color: 'var(--text-muted)' }}>
            🔒 Hidden test inputs and expected outputs are not shown to preserve challenge integrity.
            {sub.hiddenTestsPassed}/{sub.hiddenTestsTotal} passed.
          </div>

          {(sub.compilationError || sub.runtimeError) && (
            <>
              <SectionHeader title="Error Details" />
              {sub.compilationError && <OutputBox label="Compilation Error" value={sub.compilationError} red />}
              {sub.runtimeError     && <OutputBox label="Runtime Error"     value={sub.runtimeError}     red />}
            </>
          )}

          <SectionHeader title="Logic & Code Analysis" />
          <LogicAnalysis sub={sub} />
        </>
      )}
    </div>
  );
}

function SubmissionSummary({ sub }: { sub: CodingSubmission }) {
  const statusConfig = {
    accepted:           { color: 'var(--success)',  icon: '✅', label: 'Accepted' },
    partial:            { color: 'var(--warning)',  icon: '🟡', label: 'Partial Credit' },
    'wrong-answer':     { color: 'var(--error)',    icon: '❌', label: 'Wrong Answer' },
    'compilation-error':{ color: 'var(--error)',    icon: '🔴', label: 'Compilation Error' },
    'runtime-error':    { color: 'var(--error)',    icon: '⚠️', label: 'Runtime Error' },
    demo:               { color: 'var(--warning)',  icon: '🔧', label: 'Demo (not executed)' },
  };
  const cfg = statusConfig[sub.status] || statusConfig.demo;

  return (
    <div style={{
      background: 'var(--bg)', borderRadius: 10, padding: '14px 16px',
      border: `1px solid ${cfg.color}`, marginBottom: 16,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
        <span style={{ fontSize: 20 }}>{cfg.icon}</span>
        <div>
          <div style={{ fontWeight: 700, color: cfg.color, fontSize: 15 }}>{cfg.label}</div>
          <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
            Score: {sub.score}% · Tests: {sub.publicTestsPassed + sub.hiddenTestsPassed}/{sub.publicTestsTotal + sub.hiddenTestsTotal}
          </div>
        </div>
      </div>
      <div style={{ display: 'flex', gap: 16, fontSize: 12, color: 'var(--text-muted)', flexWrap: 'wrap' }}>
        {sub.executionTime && <span><Clock size={11} style={{ marginRight: 3 }} />{sub.executionTime}s</span>}
        {sub.memoryUsed    && <span><Cpu  size={11} style={{ marginRight: 3 }} />{sub.memoryUsed} KB</span>}
        {sub.status === 'demo' && <span>🔧 Code not actually run — configure Judge0 for real evaluation.</span>}
      </div>

      {/* Score breakdown bar */}
      <div style={{ marginTop: 10 }}>
        <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 4 }}>
          Test-based score (official) — separate from logic analysis below
        </div>
        <div className="progress-bar" style={{ height: 8 }}>
          <div className="progress-fill" style={{
            width: `${sub.score}%`,
            background: sub.score === 100 ? 'var(--success)' : sub.score >= 50 ? 'var(--warning)' : 'var(--error)',
          }} />
        </div>
      </div>
    </div>
  );
}

function LogicAnalysis({ sub }: { sub: CodingSubmission }) {
  const msgs: string[] = [];
  if (sub.compilationError) msgs.push('Your code did not compile. Check for syntax errors, missing colons/brackets, or undefined variables.');
  else if (sub.score === 100) msgs.push('All test cases passed — your logic appears correct for the provided test suite.');
  else if (sub.score >= 50) {
    msgs.push('Your solution passes some test cases but fails others. Consider edge cases: empty input, negative numbers, single elements, or large values.');
    if (sub.publicTestsPassed < sub.publicTestsTotal) msgs.push('Review the public test cases that failed — compare your output carefully with the expected output (watch for extra spaces or newlines).');
  } else {
    msgs.push('Your solution does not pass most test cases. Check whether your core algorithm is correct before tuning edge cases.');
    msgs.push('Tip: Trace through the first example manually with pen and paper before writing code.');
  }
  if (sub.runtimeError) msgs.push('A runtime error occurred. Common causes: index out of bounds, division by zero, or operating on a None/null value.');

  return (
    <div style={{
      background: 'rgba(79,70,229,0.04)', border: '1px solid rgba(79,70,229,0.12)',
      borderRadius: 8, padding: '12px 14px', marginBottom: 12,
    }}>
      <div style={{ fontSize: 11, color: 'var(--primary)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 8 }}>
        AI-assisted analysis (estimate — not verified proof)
      </div>
      {msgs.map((m, i) => (
        <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 6, alignItems: 'flex-start' }}>
          <span style={{ color: 'var(--primary)', flexShrink: 0 }}>→</span>
          <p style={{ fontSize: 13, color: 'var(--text-secondary)', margin: 0, lineHeight: 1.6 }}>{m}</p>
        </div>
      ))}
      <p style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 8, marginBottom: 0 }}>
        ⚠️ This analysis is an estimate based on test results and common patterns — not a guarantee of correctness.
        The official score is based solely on test-case results above.
      </p>
    </div>
  );
}

function TestRow({ tc, idx, passed }: { tc: TestCase; idx: number; passed: boolean }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ marginBottom: 6, border: '1px solid var(--border)', borderRadius: 8, overflow: 'hidden' }}>
      <button
        onClick={() => setOpen(!open)}
        style={{
          width: '100%', padding: '8px 12px', background: 'var(--bg)', border: 'none',
          cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8, textAlign: 'left',
        }}
      >
        {passed ? <CheckCircle2 size={14} color="var(--success)" /> : <XCircle size={14} color="var(--error)" />}
        <span style={{ fontSize: 13, color: 'var(--text-primary)', flex: 1 }}>
          Case {idx + 1}: {tc.description}
        </span>
        {open ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
      </button>
      {open && (
        <div style={{ padding: '8px 12px', background: 'var(--surface)', borderTop: '1px solid var(--border)' }}>
          <div style={{ fontSize: 12, marginBottom: 4 }}>
            <span style={{ color: 'var(--text-muted)' }}>Input: </span>
            <code style={{ fontFamily: 'JetBrains Mono, monospace', color: 'var(--text-primary)' }}>{tc.input || '(empty)'}</code>
          </div>
          <div style={{ fontSize: 12 }}>
            <span style={{ color: 'var(--text-muted)' }}>Expected: </span>
            <code style={{ fontFamily: 'JetBrains Mono, monospace', color: 'var(--text-primary)' }}>{tc.expectedOutput}</code>
          </div>
        </div>
      )}
    </div>
  );
}

function SectionHeader({ title }: { title: string }) {
  return (
    <div style={{ fontWeight: 600, fontSize: 13, color: 'var(--text-primary)', marginBottom: 8, marginTop: 16, borderBottom: '1px solid var(--border)', paddingBottom: 4 }}>
      {title}
    </div>
  );
}

function OutputBox({ label, value, green, red }: { label: string; value: string | null; green?: boolean; red?: boolean }) {
  if (!value) return null;
  return (
    <div style={{ marginBottom: 10 }}>
      <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 4 }}>{label}</div>
      <pre style={{
        background: '#1E293B', color: green ? '#4ADE80' : red ? '#F87171' : '#E2E8F0',
        borderRadius: 8, padding: '10px 12px', fontSize: 12, margin: 0,
        fontFamily: 'JetBrains Mono, monospace', overflowX: 'auto', whiteSpace: 'pre-wrap',
        border: `1px solid ${green ? 'rgba(74,222,128,0.2)' : red ? 'rgba(248,113,113,0.2)' : 'var(--border)'}`,
      }}>
        {value}
      </pre>
    </div>
  );
}

function diffColor(d: string): string {
  return d === 'easy' ? '#16A34A' : d === 'medium' ? '#D97706' : '#DC2626';
}
function diffBadge(d: string): string {
  return d === 'easy' ? 'badge-mastered' : d === 'medium' ? 'badge-intermediate' : 'badge-advanced';
}
