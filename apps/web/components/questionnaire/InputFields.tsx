'use client';

import { cn } from '@/lib/utils';

interface TextInputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  hint?: string;
  error?: string;
  chips?: string[];
  onChipClick?: (chip: string) => void;
}

export function TextInputField({
  label,
  hint,
  error,
  chips,
  onChipClick,
  className,
  ...props
}: TextInputFieldProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium text-[var(--color-heading)]">{label}</label>
      <input
        className={cn(
          'w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)]',
          'px-4 py-3 text-sm text-[var(--color-body)] placeholder:text-[var(--color-muted)]',
          'outline-none transition-colors',
          'focus:border-[var(--color-teal)] focus:ring-2 focus:ring-[var(--color-teal)]/10',
          error && 'border-red-400 focus:border-red-400 focus:ring-red-400/10',
          className
        )}
        {...props}
      />
      {chips && chips.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-1">
          {chips.map((chip) => (
            <button
              key={chip}
              type="button"
              onClick={() => onChipClick?.(chip)}
              className="rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-1 text-xs text-[var(--color-muted)] hover:border-[var(--color-teal)] hover:text-[var(--color-teal)] transition-colors"
            >
              {chip}
            </button>
          ))}
        </div>
      )}
      {hint && !error && <p className="text-xs text-[var(--color-muted)]">{hint}</p>}
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}

interface TextareaFieldProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  hint?: string;
  error?: string;
}

export function TextareaField({ label, hint, error, className, ...props }: TextareaFieldProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium text-[var(--color-heading)]">{label}</label>
      <textarea
        rows={3}
        className={cn(
          'w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)]',
          'px-4 py-3 text-sm text-[var(--color-body)] placeholder:text-[var(--color-muted)]',
          'outline-none transition-colors resize-none',
          'focus:border-[var(--color-teal)] focus:ring-2 focus:ring-[var(--color-teal)]/10',
          error && 'border-red-400 focus:border-red-400 focus:ring-red-400/10',
          className
        )}
        {...props}
      />
      {hint && !error && <p className="text-xs text-[var(--color-muted)]">{hint}</p>}
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}
