'use client';

import { Suspense, useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { samplePlan } from '@build-planner/shared';
import type { QuestionnaireAnswers } from '@build-planner/shared';
import { QuestionnaireForm } from '@/components/questionnaire/QuestionnaireForm';
import { PlanPreview } from '@/components/preview/PlanPreview';

type ViewState = 'questionnaire' | 'preview';

// Inner component — uses useSearchParams, so it needs Suspense above it
function PlanPageInner() {
  const searchParams = useSearchParams();
  const [view, setView] = useState<ViewState>('questionnaire');
  const [answers, setAnswers] = useState<QuestionnaireAnswers | null>(null);

  // ?preview=1 from the landing page "See a sample plan" CTA
  useEffect(() => {
    if (searchParams.get('preview') === '1') {
      setView('preview');
    }
  }, [searchParams]);

  function handleFormComplete(data: QuestionnaireAnswers) {
    setAnswers(data);
    setView('preview');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function handleStartOver() {
    setAnswers(null);
    setView('questionnaire');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  return (
    <div className="min-h-screen bg-[var(--color-bg)]">
      {/* Top nav bar */}
      <nav className="sticky top-0 z-10 bg-[var(--color-bg)]/90 backdrop-blur-sm border-b border-[var(--color-border)]">
        <div className="max-w-3xl mx-auto px-6 h-14 flex items-center justify-between">
          <a
            href="/"
            className="text-sm font-semibold text-[var(--color-heading)] hover:opacity-80 transition-opacity"
          >
            Build<span className="text-[var(--color-teal)]">Planner</span>
          </a>
          {view === 'preview' && (
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
        {view === 'questionnaire' && (
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
                  onClick={() => setView('preview')}
                  className="text-[var(--color-teal)] font-medium hover:underline"
                >
                  Preview a sample plan →
                </button>
              </p>
            </div>
          </>
        )}

        {view === 'preview' && (
          <>
            {answers && (
              <div className="mb-8 rounded-xl border border-[var(--color-teal-light)] bg-[var(--color-teal-light)] px-5 py-4 flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-medium text-[var(--color-teal)]">
                    Your answers were captured successfully.
                  </p>
                  <p className="text-xs text-[var(--color-muted)] mt-0.5">
                    The plan below uses sample data — generation will be wired up in the next issue.
                  </p>
                </div>
                <button
                  onClick={handleStartOver}
                  className="flex-shrink-0 rounded-lg border border-[var(--color-teal)] px-4 py-1.5 text-xs font-medium text-[var(--color-teal)] hover:bg-[var(--color-teal)] hover:text-white transition-colors"
                >
                  Edit answers
                </button>
              </div>
            )}
            <PlanPreview plan={samplePlan} />
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
