import { Router, Request, Response } from 'express';
import { GenerateSectionRequestSchema } from '@build-planner/shared';
import { generateSection } from '../services/sectionGeneration.service';

const router = Router();

router.post('/v1/generate-section', async (req: Request, res: Response): Promise<void> => {
  const parseResult = GenerateSectionRequestSchema.safeParse(req.body);

  if (!parseResult.success) {
    res.status(400).json({
      success: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Invalid request body',
        details: parseResult.error.flatten(),
      },
    });
    return;
  }

  const { sectionKey, currentContent, instruction } = parseResult.data;

  const result = await generateSection({
    sectionKey,
    currentContent,
    instruction,
  });

  if (!result.ok) {
    if (result.reason === 'injection') {
      res.status(400).json({
        success: false,
        error: {
          code: 'PROMPT_INJECTION',
          message: result.message,
        },
      });
      return;
    }

    if (result.reason === 'refused') {
      res.status(400).json({
        success: false,
        error: {
          code: 'GENERATION_REFUSED',
          message: result.message,
        },
      });
      return;
    }

    res.status(502).json({
      success: false,
      error: {
        code: 'GENERATION_FAILED',
        message: result.message,
      },
    });
    return;
  }

  res.json({
    success: true,
    data: result.data,
  });
});

export default router;
