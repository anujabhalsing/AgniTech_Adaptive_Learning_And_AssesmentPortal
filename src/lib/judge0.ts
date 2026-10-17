/**
 * Judge0 API client via RapidAPI — gracefully degrades when unconfigured.
 *
 * To enable real code execution:
 * 1. Sign up at https://rapidapi.com/judge0-official/api/judge0-ce
 * 2. Set VITE_JUDGE0_API_KEY in your .env file
 * 3. Optionally override VITE_JUDGE0_API_HOST (default: judge0-ce.p.rapidapi.com)
 *
 * Security note: This uses the RapidAPI hosted Judge0. Code runs in Judge0's
 * sandbox — not on your own server. API key is exposed client-side (standard
 * for RapidAPI usage). For production with sensitive tasks, use a server-side
 * proxy so your key stays server-only.
 */

export const JUDGE0_LANGUAGE_IDS: Record<string, number> = {
  python:     71,  // Python 3.8.1
  java:       62,  // Java (OpenJDK 13.0.1)
  cpp:        54,  // C++ (GCC 9.2.0)
  javascript: 63,  // JavaScript (Node.js 12.14.0)
  c:          50,  // C (GCC 9.2.0)
};

export type ExecutionStatus =
  | 'queued'
  | 'running'
  | 'accepted'
  | 'wrong-answer'
  | 'time-limit'
  | 'compilation-error'
  | 'runtime-error'
  | 'system-error'
  | 'demo-mode';

export interface ExecutionResult {
  status: ExecutionStatus;
  statusDescription: string;
  stdout: string | null;
  stderr: string | null;
  compileOutput: string | null;
  time: string | null;      // in seconds
  memory: string | null;    // in KB
  exitCode: number | null;
  isDemo: boolean;
}

export interface TestCaseResult {
  testCaseId: string;
  description: string;
  isHidden: boolean;
  passed: boolean;
  actualOutput: string | null;
  expectedOutput: string;   // only included for public test cases
  executionResult: ExecutionResult;
}

const JUDGE0_HOST = 'ce.judge0.com';

export const isJudge0Configured = (): boolean => true;

/**
 * Run code against a single input and return the result.
 * Returns a demo result when Judge0 is not configured.
 */
export async function runCode(
  sourceCode: string,
  languageId: string,
  stdin: string = ''
): Promise<ExecutionResult> {
  

  const langNum = JUDGE0_LANGUAGE_IDS[languageId];
  if (!langNum) {
    return {
      status: 'system-error',
      statusDescription: `Language "${languageId}" is not supported for execution.`,
      stdout: null, stderr: null, compileOutput: null, time: null, memory: null,
      exitCode: null, isDemo: false,
    };
  }

  try {
    // Submit the code
    const submitRes = await fetch(
      `https://${JUDGE0_HOST}/submissions?base64_encoded=false&wait=false`,
      {
        method: 'POST',
        headers: {
  'Content-Type': 'application/json',
},
        body: JSON.stringify({
          source_code: sourceCode,
          language_id: langNum,
          stdin,
          cpu_time_limit: 5,
          memory_limit: 128000,
        }),
      }
    );

    if (!submitRes.ok) {
      throw new Error(`Judge0 submit failed: ${submitRes.status}`);
    }

    const { token } = await submitRes.json();

    // Poll for result (up to 10 attempts × 1s = 10s max wait)
    for (let i = 0; i < 10; i++) {
      await sleep(1000);
      const pollRes = await fetch(
        `https://${JUDGE0_HOST}/submissions/${token}?base64_encoded=false`,
        {
          headers: {},
        }
      );
      if (!pollRes.ok) continue;
      const data = await pollRes.json();

      // Status IDs: 1=Queued, 2=Processing, 3=Accepted, 4=Wrong Answer, 5=TLE, 6=CE, etc.
      if (data.status?.id <= 2) continue;  // still running

      return mapJudge0Response(data);
    }

    return {
      status: 'system-error',
      statusDescription: 'Execution timed out waiting for Judge0 response.',
      stdout: null, stderr: null, compileOutput: null, time: null, memory: null,
      exitCode: null, isDemo: false,
    };

  } catch (err: unknown) {
    return {
      status: 'system-error',
      statusDescription: err instanceof Error ? err.message : 'Unknown error calling Judge0.',
      stdout: null, stderr: null, compileOutput: null, time: null, memory: null,
      exitCode: null, isDemo: false,
    };
  }
}

function mapJudge0Response(data: Record<string, unknown>): ExecutionResult {
  const statusId = (data.status as { id: number })?.id ?? 0;
  const statusMap: Record<number, ExecutionStatus> = {
    3: 'accepted',
    4: 'wrong-answer',
    5: 'time-limit',
    6: 'compilation-error',
    7: 'runtime-error',
    8: 'runtime-error',
    9: 'runtime-error',
    10: 'runtime-error',
    11: 'runtime-error',
    12: 'runtime-error',
    13: 'runtime-error',
  };

  return {
    status: statusMap[statusId] ?? 'system-error',
    statusDescription: (data.status as { description: string })?.description ?? 'Unknown',
    stdout: (data.stdout as string | null) ?? null,
    stderr: (data.stderr as string | null) ?? null,
    compileOutput: (data.compile_output as string | null) ?? null,
    time: (data.time as string | null) ?? null,
    memory: (data.memory as string | null) ?? null,
    exitCode: (data.exit_code as number | null) ?? null,
    isDemo: false,
  };
}

/**
 * Simulate execution without actually running code.
 * Clearly returns isDemo: true so the UI can show a banner.
 */
function demoResult(sourceCode: string, stdin: string): ExecutionResult {
  // Attempt a very basic Python-like simulation for display purposes only
  const isLikelyPrint = /print\s*\(/.test(sourceCode);
  const isLikelyError = /def\s+\w+\s*\(\s*\)\s*:\s*$/.test(sourceCode) &&
    !/^\s+/.test(sourceCode.split('\n')[1] ?? '');

  return {
    status: 'demo-mode',
    statusDescription: 'Demo Mode — code was not actually executed',
    stdout: isLikelyPrint
      ? '[Demo] Code output would appear here when Judge0 is configured.'
      : isLikelyError
      ? null
      : '[Demo] Code received. Configure VITE_JUDGE0_API_KEY to run real code.',
    stderr: null,
    compileOutput: null,
    time: null,
    memory: null,
    exitCode: null,
    isDemo: true,
  };
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
