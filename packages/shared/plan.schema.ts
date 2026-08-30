import { z } from 'zod';

export const StandardSectionSchema = z.object({
  title: z.string().min(1, 'Section title is required'),
  content: z.string().min(1, 'Section content is required'),
});
export type StandardSection = z.infer<typeof StandardSectionSchema>;

export const CompetitorSchema = z.object({
  name: z.string().min(1, 'Competitor name is required'),
  strengths: z.string().min(1, 'Competitor strengths are required'),
  weaknesses: z.string().min(1, 'Competitor weaknesses are required'),
});
export type Competitor = z.infer<typeof CompetitorSchema>;

export const CompetitiveLandscapeSectionSchema = z.object({
  title: z.string().min(1, 'Section title is required'),
  content: z.string().optional(),
  competitors: z.array(CompetitorSchema),
});
export type CompetitiveLandscapeSection = z.infer<typeof CompetitiveLandscapeSectionSchema>;

export const SwotSectionSchema = z.object({
  title: z.string().min(1, 'Section title is required'),
  strengths: z.array(z.string()),
  weaknesses: z.array(z.string()),
  opportunities: z.array(z.string()),
  threats: z.array(z.string()),
});
export type SwotSection = z.infer<typeof SwotSectionSchema>;

export const PlanSectionsSchema = z.object({
  executiveSummary: StandardSectionSchema,
  companyDescription: StandardSectionSchema,
  productsServices: StandardSectionSchema,
  marketAnalysis: StandardSectionSchema,
  competitiveLandscape: CompetitiveLandscapeSectionSchema,
  marketingStrategy: StandardSectionSchema,
  operationsPlan: StandardSectionSchema,
  managementTeam: StandardSectionSchema,
  swot: SwotSectionSchema,
  financialPlanPlaceholder: StandardSectionSchema,
});
export type PlanSections = z.infer<typeof PlanSectionsSchema>;

export const PlanSchema = z.object({
  businessName: z.string().min(1, 'Business name is required'),
  tagline: z.string().min(1, 'Tagline is required'),
  generatedAt: z.string().datetime({ message: 'generatedAt must be a valid ISO date string' }),
  sections: PlanSectionsSchema,
});

export type Plan = z.infer<typeof PlanSchema>;
