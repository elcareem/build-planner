'use client';

import ReactMarkdown from 'react-markdown';
import type { StandardSection } from '@build-planner/shared';

interface SectionRendererProps {
  section: StandardSection;
  isPlaceholder?: boolean;
}

export function SectionRenderer({ section, isPlaceholder = false }: SectionRendererProps) {
  if (isPlaceholder) {
    return (
      <div
        className="rounded-xl border border-[var(--color-placeholder-border)] bg-[var(--color-placeholder-bg)] px-7 py-6"
        aria-label={`${section.title} — coming soon`}
      >
        <div className="flex items-start justify-between gap-4 mb-3">
          <h3 className="text-base font-semibold text-[var(--color-heading)]">{section.title}</h3>
          <span className="flex-shrink-0 rounded-full bg-amber-100 border border-amber-200 px-2.5 py-0.5 text-xs font-medium text-amber-700">
            Coming soon
          </span>
        </div>
        <p className="text-sm text-[var(--color-muted)] leading-relaxed">{section.content}</p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-7 py-6">
      <h3 className="text-base font-semibold text-[var(--color-heading)] mb-4">{section.title}</h3>
      <div className="plan-prose text-sm text-[var(--color-body)]">
        <ReactMarkdown>{section.content}</ReactMarkdown>
      </div>
    </div>
  );
}
