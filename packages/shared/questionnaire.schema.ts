import { z } from 'zod';

export const StageEnum = z.enum([
  'idea',
  'registered_not_trading',
  'registered_trading',
  'trading_not_registered',
]);
export type Stage = z.infer<typeof StageEnum>;

export const PlanPurposeEnum = z.enum([
  'bank_loan',
  'grant',
  'investor',
  'personal',
]);
export type PlanPurpose = z.infer<typeof PlanPurposeEnum>;

export const QuestionnaireAnswersSchema = z.object({
  businessOneLiner: z
    .string()
    .trim()
    .min(10, 'Business summary must be at least 10 characters')
    .max(150, 'Business summary cannot exceed 150 characters')
    .refine((val) => /[a-zA-Z]/.test(val), {
      message: 'Business summary must contain at least one letter',
    }),
  location: z
    .string()
    .trim()
    .min(3, 'Location must be at least 3 characters')
    .max(40, 'Location cannot exceed 40 characters')
    .refine((val) => /[a-zA-Z]/.test(val), {
      message: 'Location must contain at least one letter',
    })
    .refine((val) => !/[0-9]/.test(val), {
      message: "Location shouldn't contain numbers — just the state or city name",
    }),
  targetCustomer: z
    .string()
    .trim()
    .min(5, 'Target customer description must be at least 5 characters')
    .max(150, 'Target customer description cannot exceed 150 characters')
    .refine((val) => /[a-zA-Z]/.test(val), {
      message: 'Target customer description must contain at least one letter',
    }),
  stage: StageEnum,
  capital: z
    .string()
    .trim()
    .min(1, 'Capital estimate is required')
    .max(40, 'Capital estimate cannot exceed 40 characters')
    .refine((val) => /[0-9]/.test(val), {
      message: 'Capital must contain at least one digit (e.g., ₦500,000)',
    }),
  planPurpose: PlanPurposeEnum,
  usp: z.preprocess(
    (val) => (typeof val === 'string' && val.trim().length === 0 ? null : val),
    z
      .string()
      .trim()
      .max(300, 'USP cannot exceed 300 characters')
      .refine((val) => /[a-zA-Z]/.test(val), {
        message: 'USP must contain at least one letter if provided',
      })
      .nullable()
      .optional()
  ),
  competitors: z.preprocess(
    (val) => (typeof val === 'string' && val.trim().length === 0 ? null : val),
    z
      .string()
      .trim()
      .max(300, 'Competitors description cannot exceed 300 characters')
      .refine((val) => /[a-zA-Z]/.test(val), {
        message: 'Competitors description must contain at least one letter if provided',
      })
      .nullable()
      .optional()
  ),
  pricePoint: z.preprocess(
    (val) => (typeof val === 'string' && val.trim().length === 0 ? null : val),
    z
      .string()
      .trim()
      .max(50, 'Price point cannot exceed 50 characters')
      .refine((val) => /[0-9]/.test(val), {
        message: 'Price point must contain at least one digit if provided',
      })
      .nullable()
      .optional()
  ),
});

export type QuestionnaireAnswers = z.infer<typeof QuestionnaireAnswersSchema>;
