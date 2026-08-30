'use client';

interface StepHeaderProps {
  step: number;
  total: number;
  title: string;
  description: string;
}

export function StepHeader({ step, total, title, description }: StepHeaderProps) {
  return (
    <div className="mb-8">
      <p className="text-xs font-medium uppercase tracking-widest text-[var(--color-muted)] mb-3">
        Step {step} of {total}
      </p>
      <h2 className="text-2xl font-semibold text-[var(--color-heading)] leading-tight mb-2">
        {title}
      </h2>
      <p className="text-[var(--color-muted)] text-sm leading-relaxed">{description}</p>
    </div>
  );
}
