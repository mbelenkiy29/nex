import { Error400 } from '../../shared/errors/Error400';
import {
  aiTextProviderConfigured,
  aiTextProviderModel,
  generateAiText,
} from '../../shared/ai/aiTextProvider';
import type { CourseAiJobType } from './courseAiSchemas';

export const COURSE_AI_MODEL = aiTextProviderModel();

export function courseAiConfigured() {
  return aiTextProviderConfigured();
}

// Expected JSON output shape per job type — the editor maps these into the
// builder form as DRAFT content for the creator to review.
const OUTPUT_SHAPES: Record<CourseAiJobType, string> = {
  generateOutline:
    '{"modules":[{"title":"string","description":"string","lessons":[{"title":"string","summary":"string"}]}],"sources":[{"title":"string","url":"string","note":"string"}]}',
  generateQuiz:
    '{"questions":[{"questionText":"string","explanation":"string","examDomain":"string","difficulty":"easy|medium|hard","answers":[{"answerText":"string","isCorrect":true}]}],"sources":[{"title":"string","url":"string","note":"string"}]}',
  generateFlashcards:
    '{"cards":[{"front":"string","back":"string","hint":"string"}],"sources":[{"title":"string","url":"string","note":"string"}]}',
  generateLesson:
    '{"lessonTitle":"string","lessonSummary":"string","blocks":[{"blockType":"heading|paragraph|callout|bulletList","content":{}}],"sources":[{"title":"string","url":"string","note":"string"}]}',
  improveLesson:
    '{"lessonTitle":"string","lessonSummary":"string","blocks":[{"blockType":"heading|paragraph|callout|bulletList","content":{}}],"sources":[{"title":"string","url":"string","note":"string"}]}',
};

const INSTRUCTIONS: Record<CourseAiJobType, string> = {
  generateOutline:
    'Produce a course outline with 3-6 modules, each containing 2-5 lessons.',
  generateQuiz:
    'Produce 5-10 multiple-choice questions; each has 3-4 answers with exactly one correct.',
  generateFlashcards:
    'Produce 8-15 study flashcards. Keep front concise; hint may be empty.',
  generateLesson:
    'Produce lesson content as blocks. content shapes: heading {"level":2,"text":"..."}, paragraph {"text":"..."}, callout {"variant":"info","text":"..."}, bulletList {"items":["..."]}.',
  improveLesson:
    'Improve the provided lesson draft. Preserve the core learning goal, make the structure clearer, add missing explanations, and return improved lesson blocks.',
};

function systemPrompt(jobType: CourseAiJobType) {
  return [
    'You are an expert curriculum designer for an exam-prep platform (SIE, Series 7, CPA, SAT and similar).',
    INSTRUCTIONS[jobType],
    'Ground claims in the provided creator prompt and course context.',
    'Include source notes or citations in the top-level sources array. If no external URL is provided, cite the creator prompt or existing course material as the source title and explain the basis in note.',
    'Respond with ONLY valid minified JSON — no markdown fences, no commentary.',
    `The JSON must match this shape exactly: ${OUTPUT_SHAPES[jobType]}`,
  ].join('\n');
}

export function parseJsonResponse(text: string): unknown {
  let cleaned = text.trim();
  const fenced = cleaned.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (fenced) {
    cleaned = fenced[1].trim();
  }
  const start = cleaned.indexOf('{');
  const end = cleaned.lastIndexOf('}');
  if (start >= 0 && end > start) {
    cleaned = cleaned.slice(start, end + 1);
  }
  return JSON.parse(cleaned);
}

export async function runCourseAiGeneration(
  jobType: CourseAiJobType,
  prompt: string,
  messages: {
    notConfigured: string;
    parseFailed: string;
  } = {
    notConfigured: 'courseAiNotConfigured',
    parseFailed: 'courseAiParseFailed',
  },
): Promise<{
  json: unknown;
  usage: { inputTokens: number; outputTokens: number };
  model: string;
}> {
  if (!courseAiConfigured()) {
    throw new Error400(messages.notConfigured);
  }

  const response = await generateAiText({
    system: systemPrompt(jobType),
    prompt,
    maxTokens: 4096,
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
