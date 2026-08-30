import test from 'node:test';
import assert from 'node:assert';
import { sanitizeFilename } from './exportPdf.route';
import { samplePlan } from '@build-planner/shared';
import { generatePlanPdf } from '../services/pdf.service';

test('sanitizeFilename formats names correctly', () => {
  assert.strictEqual(sanitizeFilename('FreshBox NG'), 'freshbox-ng');
  assert.strictEqual(sanitizeFilename('   Special $100 Business!  '), 'special-100-business');
  assert.strictEqual(sanitizeFilename('!!!'), 'business-plan');
});

test('generatePlanPdf creates a valid PDF buffer from samplePlan', async () => {
  const pdfBuffer = await generatePlanPdf(samplePlan);
  
  assert.ok(Buffer.isBuffer(pdfBuffer));
  assert.ok(pdfBuffer.length > 1000, 'PDF buffer should contain generated content');
  
  // PDF header signature check: starts with %PDF-
  const header = pdfBuffer.subarray(0, 5).toString('utf-8');
  assert.strictEqual(header, '%PDF-');
});
