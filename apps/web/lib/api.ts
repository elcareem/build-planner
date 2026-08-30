import type { Plan, QuestionnaireAnswers } from '@build-planner/shared';

/**
 * Base URL of the backend API. In production this is injected per-environment
 * via NEXT_PUBLIC_API_URL (see .env.example / Vercel). Falling back to the
 * local dev backend keeps local `next dev` working out of the box.
 */
const API_URL = process.env.NEXT_PUBLIC_API_URL?.replace(/\/+$/, '') ?? 'http://localhost:4000';

/**
 * Max time we allow the backend to respond before giving up.
 *
 * The backend is configured with a 120s server timeout (server.ts) and the
 * worst-case Claude generation run is ~30–60s. The client timeout is set to
 * 150s — strictly ABOVE the backend's 120s server timeout — so the frontend
 * never gives up before the backend would. If the backend did time out at 120s,
 * it returns a 5xx response which we surface as a readable error rather than a
 * client-side abort.
 */
const REQUEST_TIMEOUT_MS = 150_000;

const GENERATE_PATH = '/v1/generate';

export type GeneratePlanResult =
  | { ok: true; plan: Plan }
  | { ok: false; message: string };

interface GenerateErrorEnvelope {
  success: false;
  error?: {
    code?: string;
    message?: string;
  };
}

type GenerateResponse = { success: true; data: Plan } | GenerateErrorEnvelope;

/**
 * A user-facing message for a given backend error code. Kept non-technical so
 * raw stack traces, JSON dumps, or model internals are never surfaced.
 */
function messageForCode(code: string | undefined, fallback: string): string {
  switch (code) {
    case 'VALIDATION_ERROR':
      return 'Some of your answers couldn’t be processed. Please go back and review them, then try again.';
    case 'GENERATION_REFUSED':
    case 'INJECTION_DETECTED':
      return 'We couldn’t generate a plan from those answers. Please rephrase your responses and try again.';
    case 'GENERATION_FAILED':
    default:
      return fallback;
  }
}

/**
 * POST the questionnaire answers to the backend /v1/generate endpoint and
 * return the generated Plan, or a readable error message.
 *
 * Never throws for expected failures — it always resolves to a result object so
 * the caller can render an error state instead of crashing.
 */
export async function generatePlan(answers: QuestionnaireAnswers): Promise<GeneratePlanResult> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  let response: Response;
  try {
    response = await fetch(`${API_URL}${GENERATE_PATH}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(answers),
      signal: controller.signal,
    });
  } catch (err) {
    clearTimeout(timeout);
    if (err instanceof Error && err.name === 'AbortError') {
      return {
        ok: false,
        message:
          'Generating your plan is taking longer than expected. Please try again in a moment.',
      };
    }
    return {
      ok: false,
      message:
        'We couldn’t reach our plan generator right now. Please check your connection and try again.',
    };
  }
  clearTimeout(timeout);

  let json: GenerateResponse;
  try {
    json = (await response.json()) as GenerateResponse;
  } catch {
    return {
      ok: false,
      message:
        'We got an unexpected response from our plan generator. Please try again in a moment.',
    };
  }

  if (response.ok && json.success) {
    return { ok: true, plan: json.data };
  }

  const error: GenerateErrorEnvelope = json as GenerateErrorEnvelope;
  const fallback =
    response.status >= 500
      ? 'Our plan generator hit a temporary problem. Please try again in a moment.'
      : 'We couldn’t generate your plan right now. Please try again.';
  return {
    ok: false,
    message: messageForCode(error?.error?.code, fallback),
  };
}
