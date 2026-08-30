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
  { value: 'idea', label: 'Just an idea', description: "I haven't started yet — this is still a concept." },
  { value: 'registered_not_trading', label: 'Registered, not trading yet', description: "My business is legally registered but hasn't opened its doors." },
  { value: 'registered_trading', label: 'Registered and trading', description: 'My business is live and making money.' },
  { value: 'trading_not_registered', label: 'Trading, not registered', description: "I'm operating informally and haven't registered yet." },
];

const PURPOSE_OPTIONS: { value: PlanPurpose; label: string; description: string }[] = [
  { value: 'bank_loan', label: 'Bank loan', description: 'To support a funding application with a bank.' },
  { value: 'grant', label: 'Grant application', description: 'For a government or NGO grant.' },
  { value: 'investor', label: 'Investor pitch', description: 'To present to angel investors or VCs.' },
  { value: 'personal', label: 'Personal roadmap', description: 'Just for my own planning and clarity.' },
];

/* ------------------------------------------------------------------ */
/* Refinement item — always-visible optional question card             */
/* ------------------------------------------------------------------ */

interface RefinementItemProps {
  icon: string;
  question: string;
  description: string;
  answered: boolean;
  onClear: () => void;
  children: React.ReactNode;
}

function RefinementItem({ icon, question, description, answered, onClear, children }: RefinementItemProps) {
  return (
    <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 sm:p-6 flex flex-col gap-3 shadow-xs hover:border-[var(--color-teal)]/30 transition-colors">
      {/* Header row */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-[var(--color-bg)] border border-[var(--color-border)] text-sm font-bold text-[var(--color-teal)] shrink-0 mt-0.5">
            {icon}
          </div>
          <div className="flex flex-col gap-0.5">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-base font-semibold text-[var(--color-heading)] tracking-tight">
                {question}
              </h3>
              <span className="rounded-full bg-[var(--color-bg)] border border-[var(--color-border)] px-2 py-0.5 text-[10px] font-medium text-[var(--color-muted)]">
                Optional
              </span>
              {answered && (
                <span className="rounded-full bg-[var(--color-teal-light)] border border-[var(--color-teal)]/20 px-2 py-0.5 text-[10px] font-medium text-[var(--color-teal)]">
                  ✓ Added
                </span>
              )}
            </div>
            <p className="text-xs text-[var(--color-muted)] leading-relaxed">
              {description}
            </p>
          </div>
        </div>
        {answered && (
          <button
            type="button"
            onClick={onClear}
            className="shrink-0 text-xs font-medium text-red-500 hover:text-red-600 transition-colors pt-1"
          >
            Clear
          </button>
        )}
      </div>

      {/* Input */}
      <div className="mt-1">
        {children}
      </div>
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
    5: [], // Step 5 fields (usp, competitors, pricePoint) are all optional
  };

  const handleNext = async () => {
    const fieldsToValidate = stepFields[step];
    if (fieldsToValidate && fieldsToValidate.length > 0) {
      const isValid = await trigger(fieldsToValidate);
      if (!isValid) return;
    }
    setStep((s) => Math.min(s + 1, TOTAL_STEPS));
  };

  const handleBack = () => {
    setStep((s) => Math.max(s - 1, 1));
  };

  const onSubmit = (data: QuestionnaireAnswers) => {
    onComplete(data);
  };

  return (
    <div className="w-full max-w-xl mx-auto">
      {/* Header with progress */}
      <div className="flex items-center justify-between mb-8 pb-6 border-b border-[var(--color-border)]">
        <span className="text-xs font-semibold uppercase tracking-widest text-[var(--color-teal)]">
          Questionnaire
        </span>
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
              description="Start with the core identity. What do you do, and where are you based?"
            />
            <TextInputField
              label="Business one-liner"
              placeholder="e.g. Farm-to-door organic grocery delivery in Lagos"
              hint="Describe your business in one clear sentence (10–150 characters)."
              error={errors.businessOneLiner?.message}
              {...register('businessOneLiner')}
            />
            <TextInputField
              label="Location"
              placeholder="e.g. Lagos, Nigeria"
              hint="City, state, or region where your business operates."
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
              title="Who is your target customer?"
              description="Be specific — who buys from you, and what problem do you solve for them?"
            />
            <TextareaField
              label="Target customer"
              placeholder="e.g. Busy urban professionals aged 25–45 in Victoria Island who value health and convenience"
              hint="Describe your ideal buyer, demographic, or buyer persona."
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
              description="These three questions are completely optional. Answering them sharpens your competitive analysis, positioning, and pricing sections."
            />

            {/* Optional badge banner */}
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-[var(--color-bg)] border border-[var(--color-border)] px-3 py-1 text-xs text-[var(--color-muted)]">
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-[var(--color-teal)]" />
                All 3 fields below are optional — fill in any or click Skip
              </span>
            </div>

            {/* Refinement items */}
            <div className="flex flex-col gap-4">

              {/* USP */}
              <RefinementItem
                icon="✦"
                question="Unique Selling Point"
                description="What makes your offer different or better than alternatives?"
                answered={typeof uspValue === 'string' && uspValue.trim().length > 0}
                onClear={() => setValue('usp', '', { shouldValidate: true, shouldDirty: true })}
              >
                <TextareaField
                  label=""
                  placeholder="e.g. We're the only service offering farm-to-door delivery within 60 minutes in Lagos"
                  error={errors.usp?.message}
                  {...register('usp')}
                />
              </RefinementItem>

              {/* Competitors */}
              <RefinementItem
                icon="◈"
                question="Main Competitors"
                description="List names or describe the key alternatives your customers might use."
                answered={typeof competitorsValue === 'string' && competitorsValue.trim().length > 0}
                onClear={() => setValue('competitors', '', { shouldValidate: true, shouldDirty: true })}
              >
                <TextareaField
                  label=""
                  placeholder="e.g. Market Square, FreshDirect NG, local market vendors"
                  error={errors.competitors?.message}
                  {...register('competitors')}
                />
              </RefinementItem>

              {/* Price point */}
              <RefinementItem
                icon="₦"
                question="Average Price Point"
                description="Include a number and currency symbol for accurate pricing models."
                answered={typeof pricePointValue === 'string' && pricePointValue.trim().length > 0}
                onClear={() => setValue('pricePoint', '', { shouldValidate: true, shouldDirty: true })}
              >
                <TextInputField
                  label=""
                  placeholder="e.g. ₦4,500 per box / $20 per session"
                  error={errors.pricePoint?.message}
                  {...register('pricePoint')}
                />
              </RefinementItem>

            </div>

            <p className="text-xs text-[var(--color-muted)] text-center mt-1">
              Ready? Click <strong className="font-medium text-[var(--color-heading)]">Generate my plan</strong> anytime to begin.
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
            <div className="flex items-center gap-3">
              <button
                type="submit"
                className="rounded-lg bg-[var(--color-teal)] px-6 py-2.5 text-sm font-medium text-white hover:bg-[var(--color-teal-hover)] transition-colors"
              >
                Generate my plan →
              </button>
            </div>
          )}
        </div>
      </form>
    </div>
  );
}
