import { Router, Request, Response } from 'express';
import { QuestionnaireAnswersSchema } from '@build-planner/shared';
import { generatePlan } from '../services/planGeneration.service';

const router = Router();

/**
 * POST /v1/generate
 *
 * Body: QuestionnaireAnswers
 *
 * Responses:
 *   200 { success: true,  data: Plan }
 *   400 { success: false, error: { code: 'VALIDATION_ERROR', message, details } }
 *   422 { success: false, error: { code: 'GENERATION_REFUSED', message } }
 *   502 { success: false, error: { code: 'GENERATION_FAILED',  message } }
 */
router.post('/', async (req: Request, res: Response): Promise<void> => {
  // Validate request body against the shared schema.
  const parsed = QuestionnaireAnswersSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({
      success: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Request body failed validation.',
        details: parsed.error.issues,
      },
    });
    return;
  }

  const result = await generatePlan(parsed.data);

  if (result.ok) {
    res.status(200).json({ success: true, data: result.plan });
    return;
  }

  if (result.reason === 'refused') {
    res.status(422).json({
      success: false,
      error: { code: 'GENERATION_REFUSED', message: result.message },
    });
    return;
  }

  // api_error
  res.status(502).json({
    success: false,
    error: { code: 'GENERATION_FAILED', message: result.message },
  });
});

export default router;
