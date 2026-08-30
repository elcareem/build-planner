'use client';

import type { SwotSection } from '@build-planner/shared';
import { cn } from '@/lib/utils';

interface SwotQuadrantProps {
  title: string;
  items: string[];
  colorClass: string;
  dotClass: string;
}

function SwotQuadrant({ title, items, colorClass, dotClass }: SwotQuadrantProps) {
  return (
    <div className={cn('rounded-xl border p-5', colorClass)}>
      <h4 className="text-xs font-semibold uppercase tracking-widest mb-3 opacity-70">{title}</h4>
      <ul className="flex flex-col gap-2">
        {items.map((item, i) => (
          <li key={i} className="flex items-start gap-2 text-sm leading-snug">
            <span className={cn('mt-1.5 flex-shrink-0 w-1.5 h-1.5 rounded-full', dotClass)} />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

interface SwotGridProps {
  swot: SwotSection;
}

export function SwotGrid({ swot }: SwotGridProps) {
  return (
    <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-7 py-6">
      <h3 className="text-base font-semibold text-[var(--color-heading)] mb-5">{swot.title}</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <SwotQuadrant
          title="Strengths"
          items={swot.strengths}
          colorClass="border-emerald-200 bg-emerald-50 text-emerald-900"
          dotClass="bg-emerald-500"
        />
        <SwotQuadrant
          title="Weaknesses"
          items={swot.weaknesses}
          colorClass="border-red-200 bg-red-50 text-red-900"
          dotClass="bg-red-400"
        />
        <SwotQuadrant
          title="Opportunities"
          items={swot.opportunities}
          colorClass="border-blue-200 bg-blue-50 text-blue-900"
          dotClass="bg-blue-400"
        />
        <SwotQuadrant
          title="Threats"
          items={swot.threats}
          colorClass="border-orange-200 bg-orange-50 text-orange-900"
          dotClass="bg-orange-400"
        />
      </div>
    </div>
  );
}
