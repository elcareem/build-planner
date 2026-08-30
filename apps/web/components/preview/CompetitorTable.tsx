'use client';

import type { Competitor } from '@build-planner/shared';

interface CompetitorTableProps {
  competitors: Competitor[];
}

export function CompetitorTable({ competitors }: CompetitorTableProps) {
  if (competitors.length === 0) return null;

  return (
    <div className="overflow-x-auto rounded-xl border border-[var(--color-border)]">
      <table className="w-full text-sm border-collapse">
        <thead>
          <tr className="bg-[var(--color-bg)] border-b border-[var(--color-border)]">
            <th className="text-left px-5 py-3 font-semibold text-[var(--color-heading)] w-1/4">Competitor</th>
            <th className="text-left px-5 py-3 font-semibold text-[var(--color-heading)] w-[37.5%]">Strengths</th>
            <th className="text-left px-5 py-3 font-semibold text-[var(--color-heading)] w-[37.5%]">Weaknesses</th>
          </tr>
        </thead>
        <tbody>
          {competitors.map((c, i) => (
            <tr
              key={i}
              className="border-b border-[var(--color-border)] last:border-0 bg-[var(--color-surface)] hover:bg-[var(--color-bg)] transition-colors"
            >
              <td className="px-5 py-3.5 font-medium text-[var(--color-heading)] align-top">{c.name}</td>
              <td className="px-5 py-3.5 text-[var(--color-body)] align-top leading-relaxed">{c.strengths}</td>
              <td className="px-5 py-3.5 text-[var(--color-body)] align-top leading-relaxed">{c.weaknesses}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
