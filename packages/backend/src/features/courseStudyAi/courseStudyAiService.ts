import { z } from 'zod';
import { Error400 } from '../../shared/errors/Error400';
import { parseJsonResponse } from '../courseAi/courseAiService';
import { errorToLogMetadata, logger } from '../../shared/lib/logger';
import {
  aiTextProviderConfigured,
  aiTextProviderModel,
  generateAiText,
  streamAiText,
} from '../../shared/ai/aiTextProvider';
import {
  courseStudyAiQuestionSchema,
  type CourseStudyAiQuestion,
  type CourseStudyAiStreamChunk,
} from './courseStudyAiSchemas';

type CourseStudyAiErrorMessages = {
  notConfigured: string;
  parseFailed: string;
  unexpectedQuizFormat: string;
  streamGeneric: string;
};

export const STUDY_AI_MODEL = aiTextProviderModel();

export function courseStudyAiConfigured() {
  return aiTextProviderConfigured();
}

// ---------------------------------------------------------------------------
// System prompts — kept as inline English constants (mirrors courseAiService)
// so they stay out of the 5-locale dictionary integrity surface. The student's
// language is threaded in so answers come back localized.
// ---------------------------------------------------------------------------

export function explainLessonSystemPrompt(language: string) {
  return [
    'You are an encouraging, expert tutor on an exam-prep platform.',
    'A student wants the following lesson explained so they truly understand it.',
    'Using ONLY the lesson content provided, explain it in plain language:',
    '- open with a one-paragraph plain-English overview;',
    '- break the key ideas down with short markdown headings and bullet points;',
    '- include one concrete example or analogy where it helps;',
    "- finish with a short '### Common pitfalls' section.",
    'Be concise — a student should be able to read it in 2-3 minutes.',
    'Do not invent facts beyond the provided content. Respond in markdown.',
    'If the lesson has no content, say so briefly and suggest reviewing the course materials.',
    `Write your response in ${language}.`,
  ].join('\n');
}

export function summarizeLessonSystemPrompt(language: string) {
  return [
    'You are a study assistant on an exam-prep platform.',
    'Summarize the provided lesson for fast revision. Respond in markdown with:',
    '- a 2-3 sentence overview;',
    "- a '### Key points' bulleted list of 5-8 bullets;",
    "- a single bold 'Takeaway:' line at the end.",
    'Use ONLY the provided content; do not invent facts. Keep it tight.',
    `Write your response in ${language}.`,
  ].join('\n');
}

export function quizSystemPrompt(count: number, language: string) {
  return [
    'You are an exam-prep question writer.',
    `Using ONLY the provided module content, write ${count} multiple-choice questions`,
    'that test genuine understanding (not trivia or wording recall).',
    'Each question must have exactly 4 options with exactly ONE correct option.',
    'Give a one-sentence explanation of why the correct option is right.',
    "Set examDomain to a short topic label drawn from the module's content.",
    'Vary difficulty across easy, medium and hard.',
    `Write all question text, options and explanations in ${language}.`,
    'Respond with ONLY valid minified JSON — no markdown fences, no commentary —',
    'matching this shape exactly:',
    '{"questions":[{"questionText":"string","explanation":"string","examDomain":"string","difficulty":"easy|medium|hard","options":[{"text":"string","isCorrect":true}]}]}',
  ].join('\n');
}

// ---------------------------------------------------------------------------
// One-shot JSON generation (quiz / practice).
// ---------------------------------------------------------------------------

export async function runCourseStudyAiGeneration(
  system: string,
  prompt: string,
  maxTokens = 4096,
  messages: Pick<CourseStudyAiErrorMessages, 'notConfigured' | 'parseFailed'>,
): Promise<{
  json: unknown;
  usage: { inputTokens: number; outputTokens: number };
  model: string;
}> {
  if (!courseStudyAiConfigured()) {
    throw new Error400(messages.notConfigured);
  }

  const response = await generateAiText({
    system,
    prompt,
    maxTokens,
    json: true,
  });

  try {
    return {
      json: parseJsonResponse(response.text),
      usage: response.usage,
      model: response.model,
    };
  } catch {
    throw new Error400(messages.parseFailed);
  }
}

const generatedQuizSchema = z.object({
  questions: z.array(courseStudyAiQuestionSchema),
});

// Validates + normalizes the model's quiz JSON. Drops any question that has no
// correct option (a malformed item) rather than failing the whole batch.
export function parseGeneratedQuestions(
  json: unknown,
  messages: Pick<CourseStudyAiErrorMessages, 'unexpectedQuizFormat'>,
): Array<CourseStudyAiQuestion> {
  const parsed = generatedQuizSchema.safeParse(json);
  if (!parsed.success) {
    throw new Error400(messages.unexpectedQuizFormat);
  }
  const usable = parsed.data.questions.filter((question) =>
    question.options.some((option) => option.isCorrect),
  );
  if (usable.length === 0) {
    throw new Error400(messages.unexpectedQuizFormat);
  }
  return usable;
}

// ---------------------------------------------------------------------------
// Streaming text generation (explain / summarize).
// ---------------------------------------------------------------------------

export async function* streamCourseStudyAiText(
  system: string,
  prompt: string,
  maxTokens = 2048,
  messages: Pick<CourseStudyAiErrorMessages, 'notConfigured' | 'streamGeneric'>,
): AsyncGenerator<CourseStudyAiStreamChunk> {
  if (!courseStudyAiConfigured()) {
    yield {
      type: 'error',
      content: messages.notConfigured,
    };
    return;
  }

  try {
    for await (const chunk of streamAiText({ system, prompt, maxTokens })) {
      yield chunk;
    }
    yield { type: 'done' };
  } catch (error: any) {
    logger.error('ai.course_study.stream_failed', {
      error: errorToLogMetadata(error),
    });
    yield {
      type: 'error',
      content: messages.streamGeneric,
    };
  }
}

// ---------------------------------------------------------------------------
// Recommendation + study-plan prompts and parsers.
// ---------------------------------------------------------------------------

export function nextStepSystemPrompt(language: string) {
  return [
    'You are a study coach on an exam-prep platform.',
    "Given a student's topic performance and lesson progress, recommend what",
    'they should study next. Be specific and motivating: name the weakest',
    'topics and the most useful unfinished lessons, and say briefly why.',
    'Keep it to 2-4 short sentences. Respond with ONLY valid minified JSON,',
    'no markdown fences: {"recommendation":"string"} — the recommendation may',
    'use light markdown (bold, a short list).',
    `Write the recommendation in ${language}.`,
  ].join('\n');
}

export function studyPlanSystemPrompt(language: string) {
  return [
    'You are a study coach on an exam-prep platform.',
    "Build an ordered study plan from the student's topic performance, lesson",
    'progress and (if given) the time left until their exam.',
    'Produce 5-10 focused tasks, most important first — prioritise weak topics',
    'and unfinished foundational lessons; include at least one review/practice',
    'task near the end. Each task: a short actionable title and a one-sentence',
    'description. Do NOT include dates — the app schedules them.',
    'Respond with ONLY valid minified JSON, no markdown fences:',
    '{"items":[{"title":"string","description":"string"}]}',
    `Write all titles and descriptions in ${language}.`,
  ].join('\n');
}

const nextRecommendationSchema = z.object({
  recommendation: z.string().min(1),
});

export function parseNextRecommendation(
  json: unknown,
  messages: { unexpectedResponse: string },
): string {
  const parsed = nextRecommendationSchema.safeParse(json);
  if (!parsed.success) {
    throw new Error400(messages.unexpectedResponse);
  }
  return parsed.data.recommendation;
}

const studyPlanItemsSchema = z.object({
  items: z
    .array(
      z.object({
        title: z.string().min(1).max(200),
        description: z.string().max(2000).default(''),
      }),
    )
    .min(1),
});

export function parseStudyPlanItems(
  json: unknown,
  messages: { unexpectedStudyPlan: string },
): Array<{ title: string; description: string }> {
  const parsed = studyPlanItemsSchema.safeParse(json);
  if (!parsed.success || parsed.data.items.length === 0) {
    throw new Error400(messages.unexpectedStudyPlan);
  }
  return parsed.data.items;
}
