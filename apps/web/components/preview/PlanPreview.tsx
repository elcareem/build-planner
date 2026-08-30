'use client';

import type { Plan } from '@build-planner/shared';
import { SectionRenderer } from './SectionRenderer';
import { CompetitorTable } from './CompetitorTable';
import { SwotGrid } from './SwotGrid';
import ReactMarkdown from 'react-markdown';

interface PlanPreviewProps {
  plan: Plan;
}

export function PlanPreview({ plan }: PlanPreviewProps) {
  const s = plan.sections;

  return (
    <article className="w-full max-w-3xl mx-auto flex flex-col gap-4">
      {/* Plan header */}
      <header className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-7 py-7 mb-2">
        <div className="flex items-center gap-2 mb-3">
          <span className="inline-block w-2 h-2 rounded-full bg-[var(--color-teal)]" />
          <span className="text-xs font-medium uppercase tracking-widest text-[var(--color-teal)]">
            Business Plan
          </span>
        </div>
        <h1 className="text-2xl font-bold text-[var(--color-heading)] mb-1">{plan.businessName}</h1>
        <p className="text-[var(--color-muted)] text-sm">{plan.tagline}</p>
        <p className="text-xs text-[var(--color-muted)] mt-3 opacity-60">
          Generated {new Date(plan.generatedAt).toLocaleDateString('en-GB', { dateStyle: 'long' })}
        </p>
      </header>

      {/* Standard prose sections */}
      <SectionRenderer section={s.executiveSummary} />
      <SectionRenderer section={s.companyDescription} />
      <SectionRenderer section={s.productsServices} />
      <SectionRenderer section={s.marketAnalysis} />

      {/* Competitive landscape — prose + competitor table */}
      <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-7 py-6">
        <h3 className="text-base font-semibold text-[var(--color-heading)] mb-4">
          {s.competitiveLandscape.title}
        </h3>
        {s.competitiveLandscape.content && (
          <div className="plan-prose text-sm text-[var(--color-body)] mb-5">
            <ReactMarkdown>{s.competitiveLandscape.content}</ReactMarkdown>
          </div>
        )}
        <CompetitorTable competitors={s.competitiveLandscape.competitors} />
      </div>

      <SectionRenderer section={s.marketingStrategy} />
      <SectionRenderer section={s.operationsPlan} />
      <SectionRenderer section={s.managementTeam} />

      {/* SWOT — structured grid */}
      <SwotGrid swot={s.swot} />

      {/* Financial plan — placeholder treatment */}
      <SectionRenderer section={s.financialPlanPlaceholder} isPlaceholder />
    </article>
  );
}
