'use client';

import { cn } from '@/lib/utils';

interface OptionCardProps {
  value: string;
  label: string;
  description?: string;
  selected: boolean;
  onSelect: (value: string) => void;
}

export function OptionCard({ value, label, description, selected, onSelect }: OptionCardProps) {
  return (
    <button
      type="button"
      onClick={() => onSelect(value)}
      className={cn(
        'w-full text-left rounded-xl border px-5 py-4 transition-all duration-150',
        'flex items-start gap-3',
        selected
          ? 'border-[var(--color-teal)] bg-[var(--color-teal-light)] ring-1 ring-[var(--color-teal)]/20'
          : 'border-[var(--color-border)] bg-[var(--color-surface)] hover:border-[var(--color-teal)]/40'
      )}
    >
      {/* Radio indicator */}
      <span
        className={cn(
          'mt-0.5 flex-shrink-0 w-4 h-4 rounded-full border-2 transition-colors',
          selected
            ? 'border-[var(--color-teal)] bg-[var(--color-teal)]'
            : 'border-[var(--color-border)]'
        )}
      >
        {selected && (
          <span className="flex h-full w-full items-center justify-center">
            <span className="block w-1.5 h-1.5 rounded-full bg-white" />
          </span>
        )}
      </span>
      <span className="flex flex-col">
        <span className={cn('text-sm font-medium', selected ? 'text-[var(--color-teal)]' : 'text-[var(--color-heading)]')}>
          {label}
        </span>
        {description && (
          <span className="text-xs text-[var(--color-muted)] mt-0.5 leading-relaxed">{description}</span>
        )}
      </span>
    </button>
  );
}

interface OptionCardGroupProps {
  options: { value: string; label: string; description?: string }[];
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

export function OptionCardGroup({ options, value, onChange, error }: OptionCardGroupProps) {
  return (
    <div className="flex flex-col gap-2.5">
      {options.map((opt) => (
        <OptionCard key={opt.value} {...opt} selected={value === opt.value} onSelect={onChange} />
      ))}
      {error && <p className="text-xs text-red-500 mt-0.5">{error}</p>}
    </div>
  );
}
