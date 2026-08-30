import { Router, Request, Response } from 'express';
import { PlanSchema } from '@build-planner/shared';
import { generatePlanPdf } from '../services/pdf.service';

export const exportPdfRouter = Router();

export function sanitizeFilename(name: string): string {
  const slug = name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  return slug || 'business-plan';
}

export async function handleExportPdf(req: Request, res: Response): Promise<void> {
  const validationResult = PlanSchema.safeParse(req.body);

  if (!validationResult.success) {
    res.status(400).json({
      success: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Invalid plan object payload',
        details: validationResult.error.flatten(),
      },
    });
    return;
  }

  const plan = validationResult.data;

  try {
    const pdfBuffer = await generatePlanPdf(plan);
    const filename = `${sanitizeFilename(plan.businessName)}-business-plan.pdf`;

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.setHeader('Content-Length', pdfBuffer.length);

    res.send(pdfBuffer);
  } catch (err: unknown) {
    console.error('PDF Generation Error:', err);
    res.status(500).json({
      success: false,
      error: {
        code: 'PDF_GENERATION_FAILED',
        message: 'An error occurred while generating the PDF document',
      },
    });
  }
}

exportPdfRouter.post('/v1/export-pdf', handleExportPdf);
