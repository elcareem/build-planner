import assert from 'node:assert';
import { test, describe } from 'node:test';
import {
  QuestionnaireAnswersSchema,
  PlanSchema,
  zodToJsonSchema,
} from './index';

describe('QuestionnaireAnswersSchema', () => {
  const validAnswers = {
    businessOneLiner: '24-hour laundry service for busy professionals',
    location: 'Lagos',
    targetCustomer: 'professionals aged 25-35',
    stage: 'idea',
    capital: '₦500,000',
    planPurpose: 'bank_loan',
    usp: '50% cheaper than competitors',
    competitors: '7-Eleven and local dry cleaners',
    pricePoint: '₦5,000 / month',
  };

  test('valid questionnaire answers pass validation', () => {
    const result = QuestionnaireAnswersSchema.safeParse(validAnswers);
    assert.strictEqual(result.success, true);
  });

  test('location rejects any input containing digits', () => {
    const invalid = { ...validAnswers, location: 'Lagos 2' };
    const result = QuestionnaireAnswersSchema.safeParse(invalid);
    assert.strictEqual(result.success, false);
    if (!result.success) {
      const locationIssue = result.error.issues.find(
        (i) => i.path.includes('location')
      );
      assert.ok(locationIssue);
      assert.strictEqual(
        locationIssue.message,
        "Location shouldn't contain numbers — just the state or city name"
      );
    }
  });

  test('businessOneLiner rejects pure digits', () => {
    const invalid = { ...validAnswers, businessOneLiner: '1234567890' };
    const result = QuestionnaireAnswersSchema.safeParse(invalid);
    assert.strictEqual(result.success, false);
  });

  test('businessOneLiner accepts valid digit-containing text', () => {
    const valid = {
      ...validAnswers,
      businessOneLiner: '24-hour laundry service in Victoria Island',
    };
    const result = QuestionnaireAnswersSchema.safeParse(valid);
    assert.strictEqual(result.success, true);
  });

  test('targetCustomer rejects pure digits', () => {
    const invalid = { ...validAnswers, targetCustomer: '12345' };
    const result = QuestionnaireAnswersSchema.safeParse(invalid);
    assert.strictEqual(result.success, false);
  });

  test('targetCustomer accepts valid digit-containing text', () => {
    const valid = {
      ...validAnswers,
      targetCustomer: 'professionals aged 25-35',
    };
    const result = QuestionnaireAnswersSchema.safeParse(valid);
    assert.strictEqual(result.success, true);
  });

  test('capital rejects content with no digits at all', () => {
    const invalid = { ...validAnswers, capital: 'money' };
    const result = QuestionnaireAnswersSchema.safeParse(invalid);
    assert.strictEqual(result.success, false);
  });

  test('pricePoint rejects content with no digits at all when provided', () => {
    const invalid = { ...validAnswers, pricePoint: 'expensive' };
    const result = QuestionnaireAnswersSchema.safeParse(invalid);
    assert.strictEqual(result.success, false);
  });

  test('usp rejects content with no letters when provided', () => {
    const invalid = { ...validAnswers, usp: '12345' };
    const result = QuestionnaireAnswersSchema.safeParse(invalid);
    assert.strictEqual(result.success, false);
  });

  test('whitespace padding is trimmed before length checks', () => {
    const whitespaceLocation = { ...validAnswers, location: '   a   ' };
    const result = QuestionnaireAnswersSchema.safeParse(whitespaceLocation);
    // Location trimmed length is 1, which fails min length 3
    assert.strictEqual(result.success, false);
  });
});

describe('PlanSchema', () => {
  const validPlan = {
    businessName: 'Clean Express Laundry',
    tagline: 'Fresh clothes, 24/7',
    generatedAt: new Date().toISOString(),
    sections: {
      executiveSummary: {
        title: 'Executive Summary',
        content: 'Clean Express is a modern 24/7 laundry business...',
      },
      companyDescription: {
        title: 'Company Description',
        content: 'Founded in Lagos...',
      },
      productsServices: {
        title: 'Products & Services',
        content: 'Wash, fold, and dry cleaning...',
      },
      marketAnalysis: {
        title: 'Market Analysis',
        content: 'Targeting busy urban professionals...',
      },
      competitiveLandscape: {
        title: 'Competitive Landscape',
        content: 'Key competitors in the area...',
        competitors: [
          {
            name: 'QuickWash Ltd',
            strengths: 'Established brand',
            weaknesses: 'High prices',
          },
        ],
      },
      marketingStrategy: {
        title: 'Marketing Strategy',
        content: 'Digital marketing and local flyers...',
      },
      operationsPlan: {
        title: 'Operations Plan',
        content: 'Open 24 hours daily...',
      },
      managementTeam: {
        title: 'Management Team',
        content: 'Experienced operations team...',
      },
      swot: {
        title: 'SWOT Analysis',
        strengths: ['24/7 availability', 'Modern machines'],
        weaknesses: ['New brand'],
        opportunities: ['Corporate contracts'],
        threats: ['Power outages'],
      },
      financialPlanPlaceholder: {
        title: 'Financial Plan',
        content: 'Projections for Year 1...',
      },
    },
  };

  test('valid Plan object passes validation', () => {
    const result = PlanSchema.safeParse(validPlan);
    assert.strictEqual(result.success, true);
  });

  test('PlanSchema produces valid JSON Schema for Claude tool-use', () => {
    const jsonSchema = zodToJsonSchema(PlanSchema);
    assert.strictEqual(jsonSchema.type, 'object');
    assert.ok(jsonSchema.properties);
    assert.ok(Array.isArray(jsonSchema.required));
  });
});
