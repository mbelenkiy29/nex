import Anthropic from '@anthropic-ai/sdk';
import { AppContext } from '../../shared/controller/appContext';
import { Error400 } from '../../shared/errors/Error400';
import { Error404 } from '../../shared/errors/Error404';
import { prisma } from '../../prisma';
import { promptLanguageName } from '../../shared/lib/promptLanguageName';
import {
  buildLessonContext,
  buildModuleContext,
  buildStudyAnalyticsText,
} from '../courseStudyAi/courseStudyAiContext';
import {
  explainLessonSystemPrompt,
  parseGeneratedQuestions,
  parseStudyPlanItems,
  quizSystemPrompt,
  runCourseStudyAiGeneration,
  studyPlanSystemPrompt,
  summarizeLessonSystemPrompt,
} from '../courseStudyAi/courseStudyAiService';
import {
  computeWeaknesses,
  daysUntilDate,
} from '../courseStudyAi/courseStudyAiAnalytics';
import {
  aiTrustGetPreferences,
  aiTrustLimitations,
  aiTrustSignal,
  aiTrustSource,
} from '../aiTrust/aiTrustService';
import type {
  AiTrustPreferences,
  AiTrustSignal,
} from '../aiTrust/aiTrustSchemas';

// Each STUDY_TOOL maps a Claude tool_use call to an existing courseStudyAi
// generator. The agent emits the widget payload as a `tool_result` chunk so the
// frontend can render an inline card; the model gets a short `textForModel`
// summary on the next iteration so its context stays tight.
export const STUDY_TOOL_NAMES = [
  'study_explain_lesson',
  'study_summarize_lesson',
  'study_quiz_module',
  'study_practice_module',
  'study_propose_plan',
] as const;

export type StudyToolName = (typeof STUDY_TOOL_NAMES)[number];

export type StudyWidgetKind =
  | 'lessonExplainCard'
  | 'lessonSummaryCard'
  | 'quizCarousel'
  | 'practiceCarousel'
  | 'studyPlanList';

export interface StudyToolWidget {
  kind: StudyWidgetKind;
  payload: Record<string, unknown>;
}

export interface StudyToolResult {
  widget: StudyToolWidget;
  textForModel: string;
  usage: { inputTokens: number; outputTokens: number };
}

interface StudyToolDefinition {
  name: StudyToolName;
  description: string;
  input_schema: Anthropic.Tool.InputSchema;
  run: (
    input: Record<string, unknown>,
    ctx: {
      context: AppContext;
      courseId: string | null;
      preferences?: AiTrustPreferences;
    },
  ) => Promise<StudyToolResult>;
}

// Uses the shared promptLanguageName() whitelist — single source of truth,
// explicit safe-set, closes the defence-in-depth gap in audit finding #13.
function languageNameOf(context: AppContext) {
  return promptLanguageName(context.locale);
}

// Hard cap on what the model sees as a tool_result. Keeps the agentic loop's
// context lean so widgets don't compound into 50k-token follow-up calls.
const TEXT_FOR_MODEL_CAP = 220;

function capTextForModel(text: string) {
  if (text.length <= TEXT_FOR_MODEL_CAP) return text;
  return text.slice(0, TEXT_FOR_MODEL_CAP - 1).trimEnd() + '…';
}

function requireCourseScope(
  courseId: string | null,
  context: AppContext,
): string {
  if (!courseId) {
    throw new Error400(
      context.dictionary.course.studyAi.errors.courseScopedRequired,
    );
  }
  return courseId;
}

function studyAiGenerationMessages(context: AppContext) {
  const errors = context.dictionary.course.studyAi.errors;
  return {
    notConfigured: errors.notConfigured,
    parseFailed: errors.parseFailed,
  };
}

async function preferencesForTool(
  context: AppContext,
  preferences?: AiTrustPreferences,
) {
  return preferences ?? (await aiTrustGetPreferences(context));
}

function lessonTrustSignal(params: {
  context: AppContext;
  preferences: AiTrustPreferences;
  lessonContext: Awaited<ReturnType<typeof buildLessonContext>>;
  reason: string;
}): AiTrustSignal {
  const { context, preferences, lessonContext } = params;
  return aiTrustSignal({
    context,
    preferences,
    whyGenerated: params.reason,
    influencingData: [
      aiTrustSource('courseOutline', 'used', {
        details: [lessonContext.course.title, lessonContext.lesson.title],
      }),
      preferences.useLessonContent
        ? aiTrustSource(
            'lessonContent',
            lessonContext.hasContent ? 'used' : 'unavailable',
            { count: lessonContext.hasContent ? 1 : 0 },
          )
        : aiTrustSource('lessonContent', 'omitted'),
    ],
    confidenceLevel:
      preferences.useLessonContent && lessonContext.hasContent ? 'high' : 'low',
    limitations: aiTrustLimitations(context, preferences, [
      !lessonContext.hasContent
        ? context.dictionary.aiTrust.limitations.noLessonContent
        : null,
    ]),
  });
}

function moduleTrustSignal(params: {
  context: AppContext;
  preferences: AiTrustPreferences;
  moduleContext: Awaited<ReturnType<typeof buildModuleContext>>;
  reason: string;
  questionCount: number;
}): AiTrustSignal {
  const { context, preferences, moduleContext } = params;
  return aiTrustSignal({
    context,
    preferences,
    whyGenerated: params.reason,
    influencingData: [
      aiTrustSource('courseOutline', 'used', {
        details: [moduleContext.course.title, moduleContext.module.title],
      }),
      preferences.useLessonContent
        ? aiTrustSource(
            'lessonContent',
            moduleContext.hasContent ? 'used' : 'unavailable',
            {
              count: moduleContext.lessons.length,
              details: moduleContext.lessons
                .slice(0, 5)
                .map((lesson) => lesson.title)
                .filter(Boolean),
            },
          )
        : aiTrustSource('lessonContent', 'omitted'),
    ],
    confidenceLevel:
      preferences.useLessonContent && moduleContext.hasContent ? 'high' : 'low',
    limitations: aiTrustLimitations(context, preferences, [
      context.dictionary.aiTrust.limitations.verifyAnswers,
      params.questionCount === 0
        ? context.dictionary.aiTrust.limitations.noLessonContent
        : null,
    ]),
  });
}

const studyTools: StudyToolDefinition[] = [
  {
    name: 'study_explain_lesson',
    description:
      'Render an inline lesson-explanation card. Use when the student asks to understand or "explain" a specific lesson by name. The lesson must belong to the active course.',
    input_schema: {
      type: 'object',
      properties: {
        lessonId: { type: 'string', description: 'UUID of the CourseLesson' },
      },
      required: ['lessonId'],
    },
    async run(input, { context, courseId, preferences: providedPreferences }) {
      const scopedCourseId = requireCourseScope(courseId, context);
      const preferences = await preferencesForTool(
        context,
        providedPreferences,
      );
      const lessonId = String(input.lessonId ?? '');
      if (!lessonId) {
        throw new Error400(
          context.dictionary.course.studyAi.errors.lessonRequired,
        );
      }
      const lessonContext = await buildLessonContext(
        scopedCourseId,
        lessonId,
        context,
        preferences,
      );
      const { json: _ignored, usage } = await runCourseStudyAiGeneration(
        explainLessonSystemPrompt(languageNameOf(context)) +
          '\nReturn ONLY valid minified JSON: {"summary":"string","keyPoints":["string"]}.',
        `Explain this lesson:\n\n${lessonContext.text}`,
        2048,
        studyAiGenerationMessages(context),
      );
      // The explain prompt isn't strictly JSON in the existing implementation
      // (it's a streaming text endpoint), so we ran a re-prompt here that asks
      // for structured JSON. Falls back gracefully if the model returned text.
      const parsed = parseExplainSummaryJson(_ignored);
      return {
        widget: {
          kind: 'lessonExplainCard',
          payload: {
            lessonId,
            lessonTitle: lessonContext.lesson.title,
            courseTitle: lessonContext.course.title,
            summary: parsed.summary,
            keyPoints: parsed.keyPoints,
            trust: lessonTrustSignal({
              context,
              preferences,
              lessonContext,
              reason: context.dictionary.aiTrust.reasons.lessonExplain,
            }),
          },
        },
        textForModel: capTextForModel(
          `Rendered an inline explain-card for "${lessonContext.lesson.title}". The user can read it and follow up.`,
        ),
        usage,
      };
    },
  },
  {
    name: 'study_summarize_lesson',
    description:
      'Render an inline lesson-summary card. Use when the student asks to summarize a lesson.',
    input_schema: {
      type: 'object',
      properties: {
        lessonId: { type: 'string', description: 'UUID of the CourseLesson' },
      },
      required: ['lessonId'],
    },
    async run(input, { context, courseId, preferences: providedPreferences }) {
      const scopedCourseId = requireCourseScope(courseId, context);
      const preferences = await preferencesForTool(
        context,
        providedPreferences,
      );
      const lessonId = String(input.lessonId ?? '');
      if (!lessonId) {
        throw new Error400(
          context.dictionary.course.studyAi.errors.lessonRequired,
        );
      }
      const lessonContext = await buildLessonContext(
        scopedCourseId,
        lessonId,
        context,
        preferences,
      );
      const { json, usage } = await runCourseStudyAiGeneration(
        summarizeLessonSystemPrompt(languageNameOf(context)) +
          '\nReturn ONLY valid minified JSON: {"summary":"string","keyPoints":["string"]}.',
        `Summarize this lesson:\n\n${lessonContext.text}`,
        1024,
        studyAiGenerationMessages(context),
      );
      const parsed = parseExplainSummaryJson(json);
      return {
        widget: {
          kind: 'lessonSummaryCard',
          payload: {
            lessonId,
            lessonTitle: lessonContext.lesson.title,
            courseTitle: lessonContext.course.title,
            summary: parsed.summary,
            keyPoints: parsed.keyPoints,
            trust: lessonTrustSignal({
              context,
              preferences,
              lessonContext,
              reason: context.dictionary.aiTrust.reasons.lessonSummary,
            }),
          },
        },
        textForModel: capTextForModel(
          `Rendered an inline summary-card for "${lessonContext.lesson.title}".`,
        ),
        usage,
      };
    },
  },
  {
    name: 'study_quiz_module',
    description:
      'Render an inline 5-question multiple-choice quiz from a course module. Use when the student says "quiz me on …" and the topic maps to a module title. moduleId must belong to the active course.',
    input_schema: {
      type: 'object',
      properties: {
        moduleId: { type: 'string', description: 'UUID of the CourseModule' },
      },
      required: ['moduleId'],
    },
    async run(input, { context, courseId, preferences: providedPreferences }) {
      const scopedCourseId = requireCourseScope(courseId, context);
      const preferences = await preferencesForTool(
        context,
        providedPreferences,
      );
      const moduleId = String(input.moduleId ?? '');
      if (!moduleId) {
        throw new Error400(
          context.dictionary.course.studyAi.errors.moduleRequired,
        );
      }
      const moduleContext = await buildModuleContext(
        scopedCourseId,
        moduleId,
        context,
        preferences,
      );
      if (!moduleContext.hasContent) {
        throw new Error400(
          context.dictionary.course.studyAi.errors.moduleNoContentQuiz,
        );
      }
      const errors = context.dictionary.course.studyAi.errors;
      const { json, usage } = await runCourseStudyAiGeneration(
        quizSystemPrompt(5, languageNameOf(context)),
        `Generate the quiz from this module content:\n\n${moduleContext.text}`,
        4096,
        studyAiGenerationMessages(context),
      );
      const questions = parseGeneratedQuestions(json, {
        unexpectedQuizFormat: errors.unexpectedQuizFormat,
      });
      return {
        widget: {
          kind: 'quizCarousel',
          payload: {
            moduleId,
            moduleTitle: moduleContext.module.title,
            courseId: scopedCourseId,
            courseTitle: moduleContext.course.title,
            questions,
            trust: moduleTrustSignal({
              context,
              preferences,
              moduleContext,
              reason: context.dictionary.aiTrust.reasons.quiz,
              questionCount: questions.length,
            }),
          },
        },
        textForModel: capTextForModel(
          `Rendered an inline ${questions.length}-question quiz for module "${moduleContext.module.title}". The user can answer and submit.`,
        ),
        usage,
      };
    },
  },
  {
    name: 'study_practice_module',
    description:
      'Render an inline 12-question practice set from a course module. Heavier than a quiz; use when the student asks for practice or drill.',
    input_schema: {
      type: 'object',
      properties: {
        moduleId: { type: 'string', description: 'UUID of the CourseModule' },
        count: { type: 'number', description: 'Number of questions (5-20)' },
      },
      required: ['moduleId'],
    },
    async run(input, { context, courseId, preferences: providedPreferences }) {
      const scopedCourseId = requireCourseScope(courseId, context);
      const preferences = await preferencesForTool(
        context,
        providedPreferences,
      );
      const moduleId = String(input.moduleId ?? '');
      if (!moduleId) {
        throw new Error400(
          context.dictionary.course.studyAi.errors.moduleRequired,
        );
      }
      const requestedCount = Number(input.count ?? 12);
      const count = Math.min(
        20,
        Math.max(5, Number.isFinite(requestedCount) ? requestedCount : 12),
      );
      const moduleContext = await buildModuleContext(
        scopedCourseId,
        moduleId,
        context,
        preferences,
      );
      if (!moduleContext.hasContent) {
        throw new Error400(
          context.dictionary.course.studyAi.errors.moduleNoContentPractice,
        );
      }
      const errors = context.dictionary.course.studyAi.errors;
      const { json, usage } = await runCourseStudyAiGeneration(
        quizSystemPrompt(count, languageNameOf(context)),
        `Generate practice questions from this module content:\n\n${moduleContext.text}`,
        8000,
        studyAiGenerationMessages(context),
      );
      const questions = parseGeneratedQuestions(json, {
        unexpectedQuizFormat: errors.unexpectedQuizFormat,
      });
      return {
        widget: {
          kind: 'practiceCarousel',
          payload: {
            moduleId,
            moduleTitle: moduleContext.module.title,
            courseId: scopedCourseId,
            courseTitle: moduleContext.course.title,
            questions,
            trust: moduleTrustSignal({
              context,
              preferences,
              moduleContext,
              reason: context.dictionary.aiTrust.reasons.practice,
              questionCount: questions.length,
            }),
          },
        },
        textForModel: capTextForModel(
          `Rendered ${questions.length} practice questions for "${moduleContext.module.title}".`,
        ),
        usage,
      };
    },
  },
  {
    name: 'study_propose_plan',
    description:
      "Propose an ordered study plan as an inline list widget. Uses the student's topic weaknesses, lesson progress, and (if set) exam date. The student can save individual items or the whole plan.",
    input_schema: {
      type: 'object',
      properties: {},
    },
    async run(_input, { context, courseId, preferences: providedPreferences }) {
      const scopedCourseId = requireCourseScope(courseId, context);
      const preferences = await preferencesForTool(
        context,
        providedPreferences,
      );
      const userId = context.currentUser?.id;
      if (!userId) {
        throw new Error400(
          context.dictionary.course.studyAi.errors.signInStudyPlan,
        );
      }
      const course = await prisma.course.findUnique({
        where: { id: scopedCourseId },
        select: {
          id: true,
          title: true,
          audience: true,
          examType: true,
          lessons: { select: { id: true, title: true, isHidden: true } },
          modules: { select: { id: true, title: true } },
        },
      });
      if (!course) throw new Error404();
      const enrollment = await prisma.courseEnrollment.findFirst({
        where: { courseId: scopedCourseId, userId },
        select: { id: true, targetExamDate: true, examName: true },
      });

      const [weaknesses, progress] = await Promise.all([
        preferences.usePracticeResults
          ? computeWeaknesses(scopedCourseId, userId)
          : Promise.resolve({ domains: [], totalAnswered: 0 }),
        preferences.useLessonProgress
          ? prisma.courseLessonProgress.findMany({
              where: { courseId: scopedCourseId, userId },
              select: { lessonId: true },
            })
          : Promise.resolve([]),
      ]);
      const completed = new Set(progress.map((row) => row.lessonId));
      const examDate = enrollment?.targetExamDate ?? null;
      const daysUntil = examDate ? daysUntilDate(examDate) : null;
      const text = buildStudyAnalyticsText(
        course as any,
        weaknesses,
        completed,
        {
          examName: enrollment?.examName ?? null,
          daysUntil,
        },
        preferences,
      );

      const errors = context.dictionary.course.studyAi.errors;
      const { json, usage } = await runCourseStudyAiGeneration(
        studyPlanSystemPrompt(languageNameOf(context)),
        `Build a study plan for this student.\n\n${text}`,
        3000,
        studyAiGenerationMessages(context),
      );
      const items = parseStudyPlanItems(json, {
        unexpectedStudyPlan: errors.unexpectedStudyPlan,
      });
      return {
        widget: {
          kind: 'studyPlanList',
          payload: {
            courseId: scopedCourseId,
            courseTitle: course.title,
            examName: enrollment?.examName ?? null,
            daysUntil,
            items,
            trust: aiTrustSignal({
              context,
              preferences,
              whyGenerated: context.dictionary.aiTrust.reasons.studyPlan,
              influencingData: [
                aiTrustSource('courseOutline', 'used', {
                  count: course.lessons.length,
                  details: course.modules
                    .slice(0, 5)
                    .map((module) => module.title),
                }),
                preferences.useLessonProgress
                  ? aiTrustSource('lessonProgress', 'used', {
                      count: completed.size,
                    })
                  : aiTrustSource('lessonProgress', 'omitted'),
                preferences.usePracticeResults
                  ? aiTrustSource(
                      'practiceResults',
                      weaknesses.totalAnswered > 0 ? 'used' : 'unavailable',
                      {
                        count: weaknesses.totalAnswered,
                        details: weaknesses.domains
                          .slice(0, 5)
                          .map(
                            (domain) => `${domain.domain}: ${domain.percent}%`,
                          ),
                      },
                    )
                  : aiTrustSource('practiceResults', 'omitted'),
                examDate
                  ? aiTrustSource('examDate', 'used')
                  : aiTrustSource('examDate', 'unavailable'),
              ],
              confidenceLevel:
                weaknesses.totalAnswered > 0 || completed.size > 0
                  ? 'medium'
                  : 'low',
              limitations: aiTrustLimitations(context, preferences, [
                weaknesses.totalAnswered === 0
                  ? context.dictionary.aiTrust.limitations.noPracticeData
                  : null,
              ]),
            }),
          },
        },
        textForModel: capTextForModel(
          `Rendered a ${items.length}-item study plan inline. The user can save items individually or all at once.`,
        ),
        usage,
      };
    },
  },
];

// Lightweight parser shared by explain + summary tools. The downstream
// `runCourseStudyAiGeneration` already throws Error400 on invalid JSON; here
// we only normalize the shape after the parse succeeded.
function parseExplainSummaryJson(json: unknown): {
  summary: string;
  keyPoints: string[];
} {
  if (!json || typeof json !== 'object') {
    return { summary: '', keyPoints: [] };
  }
  const obj = json as Record<string, unknown>;
  const summary = typeof obj.summary === 'string' ? obj.summary : '';
  const keyPoints = Array.isArray(obj.keyPoints)
    ? obj.keyPoints.filter((k): k is string => typeof k === 'string')
    : [];
  return { summary, keyPoints };
}

export function getStudyToolDefinitions(): Anthropic.Tool[] {
  return studyTools.map((tool) => ({
    name: tool.name,
    description: tool.description,
    input_schema: tool.input_schema,
  }));
}

export function isStudyToolName(name: string): name is StudyToolName {
  return (STUDY_TOOL_NAMES as readonly string[]).includes(name);
}

export async function runStudyTool(
  name: StudyToolName,
  input: Record<string, unknown>,
  ctx: {
    context: AppContext;
    courseId: string | null;
    preferences?: AiTrustPreferences;
  },
): Promise<StudyToolResult> {
  const tool = studyTools.find((t) => t.name === name);
  if (!tool) {
    throw new Error400(
      ctx.context.dictionary.course.studyAi.errors.unknownStudyTool.replace(
        '{0}',
        name,
      ),
    );
  }
  return tool.run(input, ctx);
}
