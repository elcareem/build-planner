'use client';

import { Suspense, useState, useEffect, useRef } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { samplePlan } from '@build-planner/shared';
import type { Plan, QuestionnaireAnswers } from '@build-planner/shared';
import { QuestionnaireForm } from '@/components/questionnaire/QuestionnaireForm';
import { PlanPreview } from '@/components/preview/PlanPreview';
import { generatePlan, exportPdf } from '@/lib/api';

type Phase = 'questionnaire' | 'generating' | 'preview';

// Inner component — uses useSearchParams, so it needs Suspense above it
function PlanPageInner() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Read ?preview=1 once for the initial render — useState only uses its
  // initialiser on the first mount so this is safe and lint-compliant.
  const isPreviewParam = searchParams.get('preview') === '1';
  const [phase, setPhase] = useState<Phase>(isPreviewParam ? 'preview' : 'questionnaire');
  const [answers, setAnswers] = useState<QuestionnaireAnswers | null>(null);
  const [plan, setPlan] = useState<Plan | null>(isPreviewParam ? samplePlan : null);
  const [error, setError] = useState<string | null>(null);
  const [isSample, setIsSample] = useState(isPreviewParam);
  const [exportError, setExportError] = useState<string | null>(null);
  const [isExporting, setIsExporting] = useState(false);

  // Strip ?preview=1 from the URL after mount so it is consumed exactly once.
  // No setState here — just a URL cleanup so back-navigation and reload always
  // start clean at the questionnaire.
  const stripped = useRef(false);
  useEffect(() => {
    if (stripped.current || !isPreviewParam) return;
    stripped.current = true;
    router.replace('/plan', { scroll: false });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleFormComplete(data: QuestionnaireAnswers) {
    setAnswers(data);
    setError(null);
    setPhase('generating');
    window.scrollTo({ top: 0, behavior: 'smooth' });

    const result = await generatePlan(data);
    if (result.ok) {
      setPlan(result.plan);
      setIsSample(false);
      setPhase('preview');
    } else {
      setPlan(null);
      setIsSample(false);
      setError(result.message);
      setPhase('preview');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  async function handleExportPdf() {
    if (!plan || isExporting) return;
    setExportError(null);
    setIsExporting(true);
    const result = await exportPdf(plan);
    setIsExporting(false);
    if (!result.ok) {
      setExportError(result.message);
    }
  }

  function handleRetry() {
    if (!answers) return;
    void handleFormComplete(answers);
  }

  function handleShowSample() {
    setAnswers(null);
    setPlan(samplePlan);
    setIsSample(true);
    setError(null);
    setPhase('preview');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function handleStartOver() {
    setAnswers(null);
    setPlan(null);
    setError(null);
    setExportError(null);
    setIsSample(false);
    setPhase('questionnaire');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function handleEditAnswers() {
    setPlan(null);
    setError(null);
    setExportError(null);
    setPhase('questionnaire');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  return (
    <div className="min-h-screen bg-[var(--color-bg)]">
      {/* Top nav bar */}
      <nav className="sticky top-0 z-10 bg-[var(--color-bg)]/90 backdrop-blur-sm border-b border-[var(--color-border)]">
        <div className="max-w-3xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link
            href="/"
            className="text-sm font-semibold text-[var(--color-heading)] hover:opacity-80 transition-opacity"
          >
            Build<span className="text-[var(--color-teal)]">Planner</span>
          </Link>
          {phase !== 'questionnaire' && (
            <button
              onClick={handleStartOver}
              className="text-xs text-[var(--color-muted)] hover:text-[var(--color-heading)] transition-colors"
            >
              ← Start over
            </button>
          )}
        </div>
      </nav>

      <main className="max-w-3xl mx-auto px-6 py-16">
        {phase === 'questionnaire' && (
          <>
            {/* Hero header */}
            <div className="text-center mb-14">
              <h1 className="text-3xl font-bold text-[var(--color-heading)] mb-3 tracking-tight">
                Generate your business plan
              </h1>
              <p className="text-[var(--color-muted)] text-base max-w-md mx-auto leading-relaxed">
                Answer a few short questions and we&apos;ll build a complete, structured plan in seconds.
              </p>
            </div>

            {/* Questionnaire card */}
            <div className="bg-[var(--color-surface)] rounded-2xl border border-[var(--color-border)] px-8 py-10 shadow-sm">
              <QuestionnaireForm onComplete={handleFormComplete} />
            </div>

            {/* Preview sample plan shortcut */}
            <div className="mt-8 text-center">
              <p className="text-xs text-[var(--color-muted)]">
                Want to see what a finished plan looks like?{' '}
                <button
                  onClick={handleShowSample}
                  className="text-[var(--color-teal)] font-medium hover:underline"
                >
                  Preview a sample plan →
                </button>
              </p>
            </div>
          </>
        )}

        {phase === 'generating' && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-14 h-14 mb-6">
              <svg
                className="animate-spin text-[var(--color-teal)]"
                viewBox="0 0 24 24"
                fill="none"
                aria-hidden="true"
              >
                <circle
                  className="opacity-20"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-80"
                  fill="currentColor"
                  d="M4 12a8 8 0 0 1 8-8v4a4 4 0 0 0-4 4H4z"
                />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-[var(--color-heading)] mb-2">
              Crafting your business plan…
            </h2>
            <p className="text-[var(--color-muted)] text-sm max-w-md mx-auto leading-relaxed">
              This usually takes 20–30 seconds. We&apos;re building your executive summary, market
              analysis, SWOT, and more — please keep this tab open.
            </p>
          </div>
        )}

        {phase === 'preview' && (
          <>
            {error ? (
              <div className="rounded-xl border border-red-200 bg-red-50 px-6 py-8 text-center">
                <div className="text-3xl mb-3 text-amber-600" aria-hidden="true">!</div>
                <h2 className="text-lg font-semibold text-[var(--color-heading)] mb-2">
                  We couldn&apos;t generate your plan
                </h2>
                <p className="text-sm text-[var(--color-muted)] max-w-md mx-auto leading-relaxed mb-6">
                  {error}
                </p>
                <div className="flex flex-wrap items-center justify-center gap-3">
                  <button
                    onClick={handleRetry}
                    className="rounded-lg bg-[var(--color-teal)] px-5 py-2.5 text-sm font-medium text-white hover:bg-[var(--color-teal-hover)] transition-colors"
                  >
                    Try again
                  </button>
                  <button
                    onClick={handleEditAnswers}
                    className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-5 py-2.5 text-sm font-medium text-[var(--color-heading)] hover:border-[var(--color-teal)]/40 transition-colors"
                  >
                    Edit answers
                  </button>
                </div>
              </div>
            ) : plan ? (
              <>
                {answers && (
                  <div className="mb-8 rounded-xl border border-[var(--color-teal-light)] bg-[var(--color-teal-light)] px-5 py-4 flex flex-col gap-3">
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <p className="text-sm font-medium text-[var(--color-teal)]">
                          {isSample
                            ? 'This is a sample plan.'
                            : 'Your plan is ready! Every section was generated from your answers.'}
                        </p>
                        {isSample && (
                          <p className="text-xs text-[var(--color-muted)] mt-0.5">
                            Answer the questionnaire to generate your own tailored plan.
                          </p>
                        )}
                      </div>
                      <div className="flex flex-shrink-0 items-center gap-2">
                        {!isSample && (
                          <button
                            onClick={() => { void handleExportPdf(); }}
                            disabled={isExporting}
                            className="rounded-lg border border-[var(--color-teal)] px-4 py-1.5 text-xs font-medium text-[var(--color-teal)] hover:bg-[var(--color-teal)] hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {isExporting ? 'Exporting…' : 'Download PDF'}
                          </button>
                        )}
                        <button
                          onClick={handleEditAnswers}
                          className="rounded-lg border border-[var(--color-teal)] px-4 py-1.5 text-xs font-medium text-[var(--color-teal)] hover:bg-[var(--color-teal)] hover:text-white transition-colors"
                        >
                          {isSample ? 'Generate my plan' : 'Edit answers'}
                        </button>
                      </div>
                    </div>
                    {exportError && (
                      <p className="text-xs text-red-600 border-t border-[var(--color-teal-light)] pt-2">
                        {exportError}
                      </p>
                    )}
                  </div>
                )}
                <PlanPreview plan={plan} />
              </>
            ) : (
              <div className="rounded-xl border border-red-200 bg-red-50 px-6 py-8 text-center">
                <p className="text-sm text-[var(--color-muted)] max-w-md mx-auto">
                  Something went wrong. Please try again.
                </p>
                <button
                  onClick={handleEditAnswers}
                  className="mt-5 rounded-lg bg-[var(--color-teal)] px-5 py-2.5 text-sm font-medium text-white hover:bg-[var(--color-teal-hover)] transition-colors"
                >
                  Back to questionnaire
                </button>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}

// Suspense wrapper required by Next.js when a client component calls useSearchParams()
export default function PlanPage() {
  return (
    <Suspense>
      <PlanPageInner />
    </Suspense>
  );
}
