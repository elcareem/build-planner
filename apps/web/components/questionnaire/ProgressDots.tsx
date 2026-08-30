'use client';

import { cn } from '@/lib/utils';

interface ProgressDotsProps {
  total: number;
  current: number; // 0-based
}

export function ProgressDots({ total, current }: ProgressDotsProps) {
  return (
    <div className="flex items-center gap-1.5" role="progressbar" aria-valuenow={current + 1} aria-valuemax={total}>
      {Array.from({ length: total }).map((_, i) => (
        <span
          key={i}
          className={cn(
            'block rounded-full transition-all duration-300',
            i === current
              ? 'w-5 h-2 bg-[var(--color-teal)]'
              : i < current
              ? 'w-2 h-2 bg-[var(--color-teal)] opacity-40'
              : 'w-2 h-2 bg-[var(--color-border)]'
          )}
        />
      ))}
    </div>
  );
}
