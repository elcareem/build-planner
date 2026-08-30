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
  { value: 'personal', label: 'Personal roadmap', description: "Just for my own planning and clarity." },
];

/* ------------------------------------------------------------------ */
/* Component                                                            */
/* ------------------------------------------------------------------ */

interface QuestionnaireFormProps {
  onComplete: (data: QuestionnaireAnswers) => void;
}

export function QuestionnaireForm({ onComplete }: QuestionnaireFormProps) {
  const [step, setStep] = useState(1);
  const [showOptional, setShowOptional] = useState(false);

  const {
    register,
    control,
    handleSubmit,
    trigger,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    getValues,
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

      {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
      <form onSubmit={(handleSubmit as any)(onSubmit)} noValidate>
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
                // controlled by register, so we manually set via setValue equivalent
                const el = document.querySelector<HTMLInputElement>('input[name="location"]');
                if (el) {
                  el.value = chip;
                  el.dispatchEvent(new Event('input', { bubbles: true }));
                }
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

        {/* ── Step 5: Optional refinements ── */}
        {step === 5 && (
          <div className="flex flex-col gap-6">
            <StepHeader
              step={5}
              total={TOTAL_STEPS}
              title="Optional refinements"
              description="These details sharpen your competitive analysis and pricing sections. Skip if you're not sure yet."
            />

            <button
              type="button"
              onClick={() => setShowOptional((v) => !v)}
              className="flex items-center gap-2 text-sm text-[var(--color-teal)] font-medium hover:underline self-start"
            >
              <span
                className={`inline-block transition-transform duration-200 ${showOptional ? 'rotate-90' : ''}`}
              >
                ▶
              </span>
              {showOptional ? 'Hide optional fields' : 'Add more detail (optional)'}
            </button>

            {showOptional && (
              <div className="flex flex-col gap-5 pt-1">
                <TextareaField
                  label="Your unique selling point (USP)"
                  placeholder="e.g. We're the only service offering farm-to-door delivery within 60 minutes in Lagos"
                  hint="What makes your offer different or better than alternatives?"
                  error={errors.usp?.message}
                  {...register('usp')}
                />
                <TextareaField
                  label="Known competitors"
                  placeholder="e.g. Market Square, FreshDirect NG, local market vendors"
                  hint="List names or describe the alternatives your customers might use."
                  error={errors.competitors?.message}
                  {...register('competitors')}
                />
                <TextInputField
                  label="Price point"
                  placeholder="e.g. ₦4,500 per box / $20 per session"
                  hint="Your main product or service price. Must include a number."
                  error={errors.pricePoint?.message}
                  {...register('pricePoint')}
                />
              </div>
            )}

            {!showOptional && (
              <p className="text-sm text-[var(--color-muted)]">
                You can generate your plan now — these fields are entirely optional.
              </p>
            )}
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
