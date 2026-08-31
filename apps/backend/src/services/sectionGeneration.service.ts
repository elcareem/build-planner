import {
  zodToJsonSchema,
  StandardSectionSchema,
  CompetitiveLandscapeSectionSchema,
  SwotSectionSchema,
  SectionKey,
} from '@build-planner/shared';
import { z } from 'zod';
import { anthropic } from './claude.service';

const MODEL = 'claude-sonnet-5';
const MAX_TOKENS = 2048;

const INJECTION_PATTERNS = [
  /ignore\s+.*instructions?/i,
  /you\s+are\s+now\s+/i,
  /forget\s+(everything|all|prior|previous)/i,
  /new\s+instructions?:/i,
  /system\s*prompt/i,
  /<\s*\/?\s*system\s*>/i,
];

function looksLikeInjection(input: string): boolean {
  return INJECTION_PATTERNS.some((pattern) => pattern.test(input));
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function getSectionZodSchema(sectionKey: SectionKey): any {
  switch (sectionKey) {
    case 'swot':
      return SwotSectionSchema;
    case 'competitiveLandscape':
      return CompetitiveLandscapeSectionSchema;
    default:
      return StandardSectionSchema;
  }
}

export type SectionGenerationResult =
  | { ok: true; data: unknown }
  | { ok: false; reason: 'injection' | 'refused' | 'api_error'; message: string };

export async function generateSection(params: {
  sectionKey: SectionKey;
  currentContent?: unknown;
  instruction: string;
}): Promise<SectionGenerationResult> {
  if (looksLikeInjection(params.instruction)) {
    return {
      ok: false,
      reason: 'injection',
      message: 'The submitted instruction contains disallowed text. Please revise and try again.',
    };
  }

  const targetSchema = getSectionZodSchema(params.sectionKey);
  const toolName = `update_${params.sectionKey}`;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { $schema: _$schema, ...sectionJsonSchema } = (zodToJsonSchema as any)(targetSchema, {
    $refStrategy: 'none',
  }) as any;

  const systemPrompt = `You are an expert business plan writer updating a single section of a business plan.
Target section key: "${params.sectionKey}".
Tone: Confident, precise, and professional. Do not add filler text or markdown outside the tool call.`;

  const userPrompt = [
    `Update the "${params.sectionKey}" section according to the user's instruction below.`,
    '',
    '<instruction>',
    params.instruction,
    '</instruction>',
    '',
    params.currentContent
      ? `<current_content>\n${JSON.stringify(params.currentContent, null, 2)}\n</current_content>`
      : '',
    '',
    `Call the ${toolName} tool with the updated section data matching the required schema structure.`,
  ].join('\n');

  try {
    const response = await anthropic.messages.create({
      model: MODEL,
      max_tokens: MAX_TOKENS,
      system: systemPrompt,
      tools: [
        {
          name: toolName,
          description: `Submit updated ${params.sectionKey} section data.`,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          input_schema: sectionJsonSchema as any,
          strict: true,
        },
      ],
      tool_choice: { type: 'tool', name: toolName },
      messages: [{ role: 'user', content: userPrompt }],
    });

    if (response.stop_reason === 'refusal') {
      const refusalText =
        response.content.find((b) => b.type === 'text')?.text ?? 'Content was refused by the model.';
      return { ok: false, reason: 'refused', message: refusalText };
    }

    const toolUseBlock = response.content.find((b) => b.type === 'tool_use');
    if (!toolUseBlock || toolUseBlock.type !== 'tool_use') {
      return { ok: false, reason: 'api_error', message: 'Model did not return a tool use response.' };
    }

    const parsed = targetSchema.safeParse(toolUseBlock.input);
    if (!parsed.success) {
      return {
        ok: false,
        reason: 'api_error',
        message: `Generated section failed schema validation: ${parsed.error.message}`,
      };
    }

    return { ok: true, data: parsed.data };
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return { ok: false, reason: 'api_error', message };
  }
}
