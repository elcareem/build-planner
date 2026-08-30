import Anthropic from '@anthropic-ai/sdk';

if (!process.env['ANTHROPIC_API_KEY']) {
  throw new Error('ANTHROPIC_API_KEY is not set');
}

/**
 * Shared Anthropic client instance.
 * Reads ANTHROPIC_API_KEY from the environment (set by dotenv in server.ts).
 * Reuse this across services rather than creating new clients per-request.
 */
export const anthropic = new Anthropic({
  apiKey: process.env['ANTHROPIC_API_KEY'],
});
