'use client';

import { useState } from 'react';
import { useForm, Controller, type Resolver } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  QuestionnaireAnswersSchema,
  type QuestionnaireAnswers,
  type Stage,
  type PlanPurpose,
} from '@build-planner/shared';

import { ProgressDots } from './ProgressDots';
import { StepHeader } from './StepHeader';
import { TextInputField, TextareaField } from './InputFields';
import { OptionCardGroup } from './OptionCard';

/* ------------------------------------------------------------------ */
/* Step config                                                          */
/* ------------------------------------------------------------------ */

const TOTAL_STEPS = 5;

const STAGE_OPTIONS: { value: Stage; label: string; description: string }[] = [
  { value: 'idea',                    label: 'Just an idea',               description: "I haven't started yet — this is still a concept." },
  { value: 'registered_not_trading',  label: 'Registered, not trading yet', description: "My business is legally registered but hasn't opened its doors." },
  { value: 'registered_trading',      label: 'Registered and trading',      description: 'My business is live and making money.' },
  { value: 'trading_not_registered',  label: 'Trading, not registered',     description: "I'm operating informally and haven't registered yet." },
];

const PURPOSE_OPTIONS: { value: PlanPurpose; label: string; description: string }[] = [
  { value: 'bank_loan',  label: 'Bank loan',          description: 'To support a funding application with a bank.' },
  { value: 'grant',      label: 'Grant application',  description: 'For a government or NGO grant.' },
  { value: 'investor',   label: 'Investor pitch',      description: 'To present to angel investors or VCs.' },
  { value: 'personal',   label: 'Personal roadmap',    description: 'Just for my own planning and clarity.' },
];

/* ------------------------------------------------------------------ */
/* Refinement item — individual expandable optional question           */
/* ------------------------------------------------------------------ */

interface RefinementItemProps {
  icon: string;
  question: string;
  hint: string;
  value: string;
  error?: string;
  children: React.ReactNode;
}

function RefinementItem({ icon, question, hint, value, children }: RefinementItemProps) {
  const [open, setOpen] = useState(false);
  const answered = value.trim().length > 0;

  return (
    <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center gap-4 px-5 py-4 text-left hover:bg-[var(--color-bg)] transition-colors"
      >
        {/* Icon */}
        <span className="text-xl flex-shrink-0 w-8 text-center">{icon}</span>

        {/* Text */}
        <span className="flex-1 min-w-0">
          <span className="block text-sm font-medium text-[var(--color-heading)]">{question}</span>
          {answered ? (
            <span className="block text-xs text-[var(--color-teal)] mt-0.5 truncate">{value}</span>
          ) : (
            <span className="block text-xs text-[var(--color-muted)] mt-0.5">{hint}</span>
          )}
        </span>

        {/* State badge + chevron */}
        <span className="flex items-center gap-2 flex-shrink-0">
          {answered && (
            <span className="rounded-full bg-[var(--color-teal-light)] border border-[var(--color-teal)]/20 px-2 py-0.5 text-[10px] font-medium text-[var(--color-teal)]">
              Added
            </span>
          )}
          <span
            className={`text-[var(--color-muted)] transition-transform duration-200 text-xs ${open ? 'rotate-180' : ''}`}
          >
            ▾
          </span>
        </span>
      </button>

      {open && (
        <div className="px-5 pb-5 pt-1 border-t border-[var(--color-border)]">
          {children}
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Main form                                                            */
/* ------------------------------------------------------------------ */

interface QuestionnaireFormProps {
  onComplete: (data: QuestionnaireAnswers) => void;
}

export function QuestionnaireForm({ onComplete }: QuestionnaireFormProps) {
  const [step, setStep] = useState(1);

  const {
    register,
    control,
    handleSubmit,
    trigger,
    setValue,
    watch,
    formState: { errors },
    // z.preprocess on optional fields widens the inferred type to `unknown`,
    // conflicting with react-hook-form's generic. Casting via Resolver<QuestionnaireAnswers>
    // is safe because the Zod resolver coerces and validates at runtime.
  } = useForm<QuestionnaireAnswers>({
    resolver: zodResolver(QuestionnaireAnswersSchema) as Resolver<QuestionnaireAnswers>,
    mode: 'onTouched',
    defaultValues: {
      businessOneLiner: '',
      location: '',
      targetCustomer: '',
      stage: undefined,
      capital: '',
      planPurpose: undefined,
      usp: '',
      competitors: '',
      pricePoint: '',
    },
  });

  // Watch optional fields so RefinementItem can show live preview and "Added" badge.
  // Using a single watch([...]) call returns a stable tuple and avoids the
  // react-hooks/incompatible-library warning about per-field watch() calls.
  const [uspValue, competitorsValue, pricePointValue] = watch(['usp', 'competitors', 'pricePoint']);

  // Fields that belong to each step for targeted validation
  const stepFields: Record<number, (keyof QuestionnaireAnswers)[]> = {
    1: ['businessOneLiner', 'location'],
    2: ['targetCustomer'],
    3: ['stage'],
    4: ['capital', 'planPurpose'],
    5: [],
  };

  async function handleNext() {
    const valid = await trigger(stepFields[step]);
    if (valid) setStep((s) => Math.min(s + 1, TOTAL_STEPS));
  }

  function handleBack() {
    setStep((s) => Math.max(s - 1, 1));
  }

  function onSubmit(data: QuestionnaireAnswers) {
    onComplete(data);
  }

  return (
    <div className="w-full max-w-lg mx-auto">
      {/* Progress */}
      <div className="mb-8">
        <ProgressDots total={TOTAL_STEPS} current={step - 1} />
      </div>

      <form onSubmit={handleSubmit(onSubmit)} noValidate>

        {/* ── Step 1: Business basics ── */}
        {step === 1 && (
          <div className="flex flex-col gap-6">
            <StepHeader
              step={1}
              total={TOTAL_STEPS}
              title="Tell us about your business"
              description="A short summary and where you're based. This shapes everything in your plan."
            />
            <TextInputField
              label="Business one-liner"
              placeholder="e.g. A subscription box of locally sourced snacks delivered monthly"
              hint="10–150 characters. Be specific — the more precise, the better your plan."
              error={errors.businessOneLiner?.message}
              {...register('businessOneLiner')}
            />
            <TextInputField
              label="Location"
              placeholder="e.g. Lagos, Nigeria"
              hint="City or state where you primarily operate."
              error={errors.location?.message}
              chips={['Lagos', 'Abuja', 'Port Harcourt', 'Nairobi', 'Accra']}
              onChipClick={(chip) => {
                setValue('location', chip, { shouldValidate: true, shouldDirty: true });
              }}
              {...register('location')}
            />
          </div>
        )}

        {/* ── Step 2: Target customer ── */}
        {step === 2 && (
          <div className="flex flex-col gap-6">
            <StepHeader
              step={2}
              total={TOTAL_STEPS}
              title="Who are your customers?"
              description="Describe the people or businesses you're selling to. Be as specific as you can."
            />
            <TextareaField
              label="Target customer"
              placeholder="e.g. Urban professionals aged 25–40 in Lagos who want healthy, convenient meals but don't have time to cook"
              hint="5–150 characters. Think demographics, behaviours, or pain points."
              error={errors.targetCustomer?.message}
              {...register('targetCustomer')}
            />
          </div>
        )}

        {/* ── Step 3: Business stage ── */}
        {step === 3 && (
          <div className="flex flex-col gap-6">
            <StepHeader
              step={3}
              total={TOTAL_STEPS}
              title="What stage are you at?"
              description="This helps us frame the plan appropriately — whether you need to prove a concept or attract growth capital."
            />
            <Controller
              name="stage"
              control={control}
              render={({ field }) => (
                <OptionCardGroup
                  options={STAGE_OPTIONS}
                  value={field.value ?? ''}
                  onChange={field.onChange}
                  error={errors.stage?.message}
                />
              )}
            />
          </div>
        )}

        {/* ── Step 4: Capital + Purpose ── */}
        {step === 4 && (
          <div className="flex flex-col gap-8">
            <div className="flex flex-col gap-6">
              <StepHeader
                step={4}
                total={TOTAL_STEPS}
                title="Capital & plan purpose"
                description="How much are you working with, and what is this plan for?"
              />
              <TextInputField
                label="Starting capital"
                placeholder="e.g. ₦2,500,000 or $5,000"
                hint="Include currency. This is used to calibrate financial guidance."
                error={errors.capital?.message}
                {...register('capital')}
              />
            </div>
            <div className="flex flex-col gap-3">
              <p className="text-sm font-medium text-[var(--color-heading)]">Plan purpose</p>
              <Controller
                name="planPurpose"
                control={control}
                render={({ field }) => (
                  <OptionCardGroup
                    options={PURPOSE_OPTIONS}
                    value={field.value ?? ''}
                    onChange={field.onChange}
                    error={errors.planPurpose?.message}
                  />
                )}
              />
            </div>
          </div>
        )}

        {/* ── Step 5: Make it stronger (optional refinements) ── */}
        {step === 5 && (
          <div className="flex flex-col gap-6">
            <StepHeader
              step={5}
              total={TOTAL_STEPS}
              title="Make it stronger"
              description="These three questions are completely optional. Answering them sharpens your competitive analysis, positioning, and pricing sections — but you can skip any or all of them."
            />

            {/* Optional badge */}
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-[var(--color-bg)] border border-[var(--color-border)] px-3 py-1 text-xs text-[var(--color-muted)]">
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-[var(--color-border)]" />
                All fields optional — tap to answer
              </span>
            </div>

            {/* Refinement items */}
            <div className="flex flex-col gap-3">

              {/* USP */}
              <RefinementItem
                icon="✦"
                question="What's your unique selling point?"
                hint="What makes your offer different or better than alternatives?"
                value={typeof uspValue === 'string' ? uspValue : ''}
                error={errors.usp?.message}
              >
                <TextareaField
                  label="Your USP"
                  placeholder="e.g. We're the only service offering farm-to-door delivery within 60 minutes in Lagos"
                  hint="What makes your offer different or better than alternatives?"
                  error={errors.usp?.message}
                  {...register('usp')}
                />
              </RefinementItem>

              {/* Competitors */}
              <RefinementItem
                icon="◈"
                question="Who are your biggest local competitors?"
                hint="Name them or describe what your customers currently use instead."
                value={typeof competitorsValue === 'string' ? competitorsValue : ''}
                error={errors.competitors?.message}
              >
                <TextareaField
                  label="Known competitors"
                  placeholder="e.g. Market Square, FreshDirect NG, local market vendors"
                  hint="List names or describe the alternatives your customers might use."
                  error={errors.competitors?.message}
                  {...register('competitors')}
                />
              </RefinementItem>

              {/* Price point */}
              <RefinementItem
                icon="₦"
                question="What's your average price point?"
                hint="Your main product or service price, with currency."
                value={typeof pricePointValue === 'string' ? pricePointValue : ''}
                error={errors.pricePoint?.message}
              >
                <TextInputField
                  label="Price point"
                  placeholder="e.g. ₦4,500 per box / $20 per session"
                  hint="Must include a number and ideally a currency symbol."
                  error={errors.pricePoint?.message}
                  {...register('pricePoint')}
                />
              </RefinementItem>

            </div>

            <p className="text-xs text-[var(--color-muted)] text-center">
              Ready? Hit <strong className="font-medium text-[var(--color-heading)]">Generate my plan</strong> — answered or not.
            </p>
          </div>
        )}

        {/* ── Navigation ── */}
        <div className="flex items-center justify-between mt-10">
          {step > 1 ? (
            <button
              type="button"
              onClick={handleBack}
              className="text-sm text-[var(--color-muted)] hover:text-[var(--color-heading)] transition-colors"
            >
              ← Back
            </button>
          ) : (
            <span />
          )}

          {step < TOTAL_STEPS ? (
            <button
              type="button"
              onClick={handleNext}
              className="rounded-lg bg-[var(--color-teal)] px-6 py-2.5 text-sm font-medium text-white hover:bg-[var(--color-teal-hover)] transition-colors"
            >
              Continue →
            </button>
          ) : (
            <button
              type="submit"
              className="rounded-lg bg-[var(--color-teal)] px-6 py-2.5 text-sm font-medium text-white hover:bg-[var(--color-teal-hover)] transition-colors"
            >
              Generate my plan →
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
