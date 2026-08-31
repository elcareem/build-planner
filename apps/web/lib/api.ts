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
const EXPORT_PDF_PATH = '/v1/export-pdf';

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

export type ExportPdfResult = { ok: true } | { ok: false; message: string };

/**
 * POST the current plan to the backend /v1/export-pdf endpoint and trigger an
 * in-browser file download. The filename is derived from the plan's business
 * name by the backend via the Content-Disposition header.
 *
 * Never throws for expected failures — it always resolves to a result object so
 * the caller can render an error state instead of crashing.
 */
export async function exportPdf(plan: Plan): Promise<ExportPdfResult> {
  let response: Response;
  try {
    response = await fetch(`${API_URL}${EXPORT_PDF_PATH}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(plan),
    });
  } catch {
    return {
      ok: false,
      message: 'We couldn\'t reach the export service. Please check your connection and try again.',
    };
  }

  if (!response.ok) {
    return {
      ok: false,
      message:
        response.status >= 500
          ? 'The PDF export hit a temporary problem on our end. Please try again in a moment.'
          : 'We couldn\'t export your plan right now. Please try again.',
    };
  }

  try {
    const blob = await response.blob();
    const url = URL.createObjectURL(blob);

    // Derive filename from Content-Disposition if provided, otherwise fall back.
    const disposition = response.headers.get('Content-Disposition') ?? '';
    const match = /filename="([^"]+)"/.exec(disposition);
    const filename = match?.[1] ?? 'business-plan.pdf';

    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = filename;
    anchor.click();
    URL.revokeObjectURL(url);

    return { ok: true };
  } catch {
    return {
      ok: false,
      message: 'The PDF downloaded but couldn\'t be saved. Please try again.',
    };
  }
}

export type GenerateSectionApiResult =
  | { ok: true; data: unknown }
  | { ok: false; message: string };

export async function generateSectionApi(params: {
  sectionKey: string;
  currentContent?: unknown;
  instruction: string;
}): Promise<GenerateSectionApiResult> {
  try {
    const response = await fetch(`${API_URL}/v1/generate-section`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });

    const body = await response.json();

    if (!response.ok || !body.success) {
      const message = body?.error?.message ?? 'Failed to regenerate section. Please try again.';
      return { ok: false, message };
    }

    return { ok: true, data: body.data };
  } catch {
    return { ok: false, message: 'Could not connect to section generator server. Please check your connection.' };
  }
}

