import { Context } from 'hono';
import { streamSSE } from 'hono/streaming';
import { AppContext } from '../../shared/controller/appContext';
import { promptLanguageName } from '../../shared/lib/promptLanguageName';
import { Error400 } from '../../shared/errors/Error400';
import { Error401 } from '../../shared/errors/Error401';
import { Error404 } from '../../shared/errors/Error404';
import { Prisma } from '../../prisma/generated/client';
import { prisma } from '../../prisma';
import { AiTextProviderError } from '../../shared/ai/aiTextProvider';
import { auditLogCreate } from '../auditLog/auditLogCreate';
import { auditLogOperations } from '../auditLog/auditLogOperations';
import { courseEnsureLearningAccess } from '../course/courseControllers';
import {
  checkAllLimits,
  trackTokenUsage,
} from '../chatbot/chatbotUsageService';
import { gradeAiQuiz } from './courseStudyAiGrading';
import { computeWeaknesses, daysUntilDate } from './courseStudyAiAnalytics';
import {
  buildLessonContext,
  buildModuleContext,
  buildStudyAnalyticsText,
} from './courseStudyAiContext';
import {
  aiTrustGetPreferences,
  aiTrustJson,
  aiTrustLimitations,
  aiTrustSignal,
  aiTrustSource,
} from '../aiTrust/aiTrustService';
import type {
  AiTrustPreferences,
  AiTrustSignal,
} from '../aiTrust/aiTrustSchemas';
import {
  acquireStudyAiLock,
  releaseStudyAiLock,
  StudyAiLockError,
} from './courseStudyAiLockService';
import {
  courseStudyAiExamDateInputSchema,
  courseStudyAiLessonInputSchema,
  courseStudyAiPracticeInputSchema,
  courseStudyAiQuizInputSchema,
  courseStudyAiSubmitInputSchema,
  courseStudyPlanItemInputSchema,
  courseStudyPlanItemUpdateSchema,
} from './courseStudyAiSchemas';
import {
  explainLessonSystemPrompt,
  nextStepSystemPrompt,
  parseGeneratedQuestions,
  parseNextRecommendation,
  parseStudyPlanItems,
  quizSystemPrompt,
  runCourseStudyAiGeneration,
  streamCourseStudyAiText,
  studyPlanSystemPrompt,
  STUDY_AI_MODEL,
  summarizeLessonSystemPrompt,
} from './courseStudyAiService';
import {
  durationMs,
  errorToLogMetadata,
  logger,
} from '../../shared/lib/logger';

// A signed-in student always belongs to an organization (token usage is
// tracked per org, same as the chatbot). Bail out clearly if either is missing.
function requireStudyAiSession(context: AppContext) {
  if (!context.currentUser || !context.currentOrganization) {
    throw new Error401();
  }
  return {
    userId: context.currentUser.id,
    organizationId: context.currentOrganization.id,
  };
}

// Uses the shared promptLanguageName() whitelist — single source of truth,
// explicit safe-set, closes the defence-in-depth gap in audit finding #13.
function languageNameOf(context: AppContext) {
  return promptLanguageName(context.locale);
}

function courseStudyAiTrustConfidence(params: {
  preferences: AiTrustPreferences;
  answeredPracticeCount: number;
  completedLessonCount: number;
  hasLessonContent: boolean;
}) {
  const signals = [
    params.preferences.usePracticeResults && params.answeredPracticeCount > 0,
    params.preferences.useLessonProgress && params.completedLessonCount > 0,
    params.preferences.useLessonContent && params.hasLessonContent,
  ].filter(Boolean).length;
  if (signals >= 3 || params.answeredPracticeCount >= 10) return 'high';
  if (signals >= 1) return 'medium';
  return 'low';
}

function courseStudyPlanTrustSignal(params: {
  context: AppContext;
  preferences: AiTrustPreferences;
  course: any;
  weaknesses: { domains: Array<any>; totalAnswered: number };
  completedLessonIds: Set<string>;
  examDate: string | null;
  daysUntil: number | null;
  model?: string | null;
}): AiTrustSignal {
  const { context, preferences, course, weaknesses, completedLessonIds } =
    params;
  const t = context.dictionary.aiTrust;
  const lessons = ((course.lessons || []) as Array<any>).filter(
    (lesson) => !lesson.isHidden,
  );
  const incompleteLessons = lessons.filter(
    (lesson) => !completedLessonIds.has(lesson.id),
  );
  const lessonDetails = incompleteLessons
    .slice(0, 5)
    .map((lesson) => lesson.title)
    .filter(Boolean);
  const weaknessDetails = weaknesses.domains
    .slice(0, 5)
    .map((domain) => `${domain.domain}: ${domain.percent}%`);

  const influencingData = [
    aiTrustSource('courseOutline', 'used', {
      count: lessons.length,
      details: ((course.modules || []) as Array<any>)
        .slice(0, 5)
        .map((module) => module.title)
        .filter(Boolean),
    }),
    preferences.useLessonProgress
      ? aiTrustSource(
          'lessonProgress',
          lessons.length ? 'used' : 'unavailable',
          {
            count: completedLessonIds.size,
            details: lessonDetails,
          },
        )
      : aiTrustSource('lessonProgress', 'omitted'),
    preferences.usePracticeResults
      ? aiTrustSource(
          'practiceResults',
          weaknesses.totalAnswered > 0 ? 'used' : 'unavailable',
          {
            count: weaknesses.totalAnswered,
            details: weaknessDetails,
          },
        )
      : aiTrustSource('practiceResults', 'omitted'),
    params.examDate
      ? aiTrustSource('examDate', 'used', {
          details: [
            params.daysUntil != null
              ? `${params.daysUntil} ${t.units.days}`
              : params.examDate,
          ],
        })
      : aiTrustSource('examDate', 'unavailable'),
  ];

  const hasLessonContent = lessons.some(
    (lesson) =>
      (lesson.blocks || []).length > 0 ||
      Boolean(String(lesson.videoTranscriptText || '').trim()),
  );
  return aiTrustSignal({
    context,
    preferences,
    whyGenerated: t.reasons.studyPlan,
    influencingData,
    confidenceLevel: courseStudyAiTrustConfidence({
      preferences,
      answeredPracticeCount: weaknesses.totalAnswered,
      completedLessonCount: completedLessonIds.size,
      hasLessonContent,
    }),
    limitations: aiTrustLimitations(context, preferences, [
      weaknesses.totalAnswered === 0 ? t.limitations.noPracticeData : null,
      completedLessonIds.size === 0 ? t.limitations.noLessonProgress : null,
    ]),
    model: params.model ?? STUDY_AI_MODEL,
  });
}

/**
 * Runs a one-shot JSON AI study action behind the per-user lock and the shared
 * daily token limits. Returns a 409 when another study request is in flight and
 * a 429 when a token cap is hit; provider failures are localized generically.
 */
async function runJsonStudyAi<T>(
  c: Context,
  context: AppContext,
  options: { action: string; courseId: string },
  generate: () => Promise<{
    payload: T;
    usage: { inputTokens: number; outputTokens: number };
    model?: string;
  }>,
) {
  const { userId, organizationId } = requireStudyAiSession(context);
  const startedAt = Date.now();

  try {
    await acquireStudyAiLock(userId);
  } catch (error) {
    if (error instanceof StudyAiLockError) {
      logger.warn('ai.course_study.concurrent_request', {
        userId,
        organizationId,
        courseId: options.courseId,
        action: options.action,
      });
      return c.json(
        {
          error: 'concurrent_request',
          message: context.dictionary.course.studyAi.errors.busy,
        },
        409,
      );
    }
    throw error;
  }

  try {
    const limit = await checkAllLimits(userId, organizationId);
    if (!limit.allowed) {
      logger.warn('ai.course_study.limit_exceeded', {
        userId,
        organizationId,
        courseId: options.courseId,
        action: options.action,
        limitType: limit.limitType,
        current: limit.current,
        limit: limit.limit,
      });
      return c.json(
        {
          error: 'limit_exceeded',
          limitType: limit.limitType,
          current: limit.current,
          limit: limit.limit,
        },
        429,
      );
    }

    const { payload, usage, model } = await generate();
    if (usage.inputTokens || usage.outputTokens) {
      await trackTokenUsage(
        userId,
        organizationId,
        usage.inputTokens,
        usage.outputTokens,
      );
    }
    logger.info('ai.course_study.completed', {
      userId,
      organizationId,
      courseId: options.courseId,
      action: options.action,
      model: model || STUDY_AI_MODEL,
      inputTokens: usage.inputTokens,
      outputTokens: usage.outputTokens,
      durationMs: durationMs(startedAt),
    });
    return c.json(payload as Record<string, unknown>);
  } catch (error) {
    logger.error('ai.course_study.failed', {
      userId,
      organizationId,
      courseId: options.courseId,
      action: options.action,
      model: STUDY_AI_MODEL,
      durationMs: durationMs(startedAt),
      error: errorToLogMetadata(error),
    });
    if (error instanceof AiTextProviderError) {
      throw new Error400(context.dictionary.course.studyAi.errors.generic);
    }
    throw error;
  } finally {
    await releaseStudyAiLock(userId);
  }
}

// --- Streaming: explain / summarize a lesson -------------------------------

async function streamLessonText(
  courseId: string,
  body: unknown,
  context: AppContext,
  c: Context,
  mode: 'explain' | 'summarize',
) {
  const data = courseStudyAiLessonInputSchema.parse(body);
  const { userId, organizationId } = requireStudyAiSession(context);
  const startedAt = Date.now();

  try {
    await acquireStudyAiLock(userId);
  } catch (error) {
    if (error instanceof StudyAiLockError) {
      logger.warn('ai.course_study.concurrent_request', {
        userId,
        organizationId,
        courseId,
        action: mode,
      });
      return c.json(
        {
          error: 'concurrent_request',
          message: context.dictionary.course.studyAi.errors.busy,
        },
        409,
      );
    }
    throw error;
  }

  try {
    const limit = await checkAllLimits(userId, organizationId);
    if (!limit.allowed) {
      logger.warn('ai.course_study.limit_exceeded', {
        userId,
        organizationId,
        courseId,
        action: mode,
        limitType: limit.limitType,
        current: limit.current,
        limit: limit.limit,
      });
      // `return` skips the catch below, so release the lock explicitly here.
      await releaseStudyAiLock(userId);
      return c.json(
        {
          error: 'limit_exceeded',
          limitType: limit.limitType,
          current: limit.current,
          limit: limit.limit,
        },
        429,
      );
    }

    const preferences = await aiTrustGetPreferences(context);
    // Building the context enforces the enrolled-student guard (401/403/404).
    const lessonContext = await buildLessonContext(
      courseId,
      data.lessonId,
      context,
      preferences,
    );

    const language = languageNameOf(context);
    const system =
      mode === 'explain'
        ? explainLessonSystemPrompt(language)
        : summarizeLessonSystemPrompt(language);

    return streamSSE(c, async (stream) => {
      let inputTokens = 0;
      let outputTokens = 0;
      let sawErrorChunk = false;
      const errors = context.dictionary.course.studyAi.errors;
      try {
        for await (const chunk of streamCourseStudyAiText(
          system,
          lessonContext.text,
          2048,
          {
            notConfigured: errors.notConfigured,
            streamGeneric: errors.generic,
          },
        )) {
          if (chunk.type === 'usage' && chunk.usage) {
            inputTokens = chunk.usage.inputTokens;
            outputTokens = chunk.usage.outputTokens;
          }
          if (chunk.type === 'error') {
            sawErrorChunk = true;
          }
          await stream.writeSSE({
            data: JSON.stringify(chunk),
            event: chunk.type,
          });
          if (chunk.type === 'error' || chunk.type === 'done') {
            await stream.sleep(50);
          }
        }
        if (inputTokens || outputTokens) {
          await trackTokenUsage(
            userId,
            organizationId,
            inputTokens,
            outputTokens,
          );
        }
        if (sawErrorChunk) {
          logger.warn('ai.course_study.failed', {
            userId,
            organizationId,
            courseId,
            action: mode,
            model: STUDY_AI_MODEL,
            durationMs: durationMs(startedAt),
            errorCode: 'stream_error_chunk',
          });
        } else {
          logger.info('ai.course_study.completed', {
            userId,
            organizationId,
            courseId,
            action: mode,
            model: STUDY_AI_MODEL,
            inputTokens,
            outputTokens,
            durationMs: durationMs(startedAt),
          });
        }
      } catch (error: any) {
        logger.error('ai.course_study.failed', {
          userId,
          organizationId,
          courseId,
          action: mode,
          model: STUDY_AI_MODEL,
          durationMs: durationMs(startedAt),
          error: errorToLogMetadata(error),
        });
        await stream.writeSSE({
          data: JSON.stringify({
            type: 'error',
            content: error?.message || errors.generic,
          }),
          event: 'error',
        });
      } finally {
        await releaseStudyAiLock(userId);
      }
    });
  } catch (error) {
    // Lock is only released inside the stream callback; release here for the
    // pre-stream failure paths (context guard, limit lookup).
    await releaseStudyAiLock(userId);
    logger.error('ai.course_study.failed', {
      userId,
      organizationId,
      courseId,
      action: mode,
      model: STUDY_AI_MODEL,
      durationMs: durationMs(startedAt),
      error: errorToLogMetadata(error),
    });
    throw error;
  }
}

export async function courseStudyAiExplainLessonController(
  courseId: string,
  body: unknown,
  context: AppContext,
  c: Context,
) {
  return streamLessonText(courseId, body, context, c, 'explain');
}

export async function courseStudyAiSummarizeLessonController(
  courseId: string,
  body: unknown,
  context: AppContext,
  c: Context,
) {
  return streamLessonText(courseId, body, context, c, 'summarize');
}

// --- One-shot JSON: quiz / practice question generation --------------------

export async function courseStudyAiQuizController(
  courseId: string,
  body: unknown,
  context: AppContext,
  c: Context,
) {
  const data = courseStudyAiQuizInputSchema.parse(body);
  return runJsonStudyAi(c, context, { action: 'quiz', courseId }, async () => {
    const moduleContext = await buildModuleContext(
      courseId,
      data.moduleId,
      context,
      await aiTrustGetPreferences(context),
    );
    if (!moduleContext.hasContent) {
      throw new Error400(
        context.dictionary.course.studyAi.errors.moduleNoContentQuiz,
      );
    }
    const errors = context.dictionary.course.studyAi.errors;
    const generation = await runCourseStudyAiGeneration(
      quizSystemPrompt(5, languageNameOf(context)),
      `Generate the quiz from this module content:\n\n${moduleContext.text}`,
      4096,
      {
        notConfigured: errors.notConfigured,
        parseFailed: errors.parseFailed,
      },
    );
    return {
      payload: {
        kind: 'quiz' as const,
        moduleId: data.moduleId,
        questions: parseGeneratedQuestions(generation.json, {
          unexpectedQuizFormat: errors.unexpectedQuizFormat,
        }),
      },
      usage: generation.usage,
      model: generation.model,
    };
  });
}

export async function courseStudyAiPracticeController(
  courseId: string,
  body: unknown,
  context: AppContext,
  c: Context,
) {
  const data = courseStudyAiPracticeInputSchema.parse(body);
  return runJsonStudyAi(
    c,
    context,
    { action: 'practice', courseId },
    async () => {
      const moduleContext = await buildModuleContext(
        courseId,
        data.moduleId,
        context,
        await aiTrustGetPreferences(context),
      );
      if (!moduleContext.hasContent) {
        throw new Error400(
          context.dictionary.course.studyAi.errors.moduleNoContentPractice,
        );
      }
      const errors = context.dictionary.course.studyAi.errors;
      const generation = await runCourseStudyAiGeneration(
        quizSystemPrompt(data.count, languageNameOf(context)),
        `Generate the practice questions from this module content:\n\n${moduleContext.text}`,
        8000,
        {
          notConfigured: errors.notConfigured,
          parseFailed: errors.parseFailed,
        },
      );
      return {
        payload: {
          kind: 'practice' as const,
          moduleId: data.moduleId,
          questions: parseGeneratedQuestions(generation.json, {
            unexpectedQuizFormat: errors.unexpectedQuizFormat,
          }),
        },
        usage: generation.usage,
        model: generation.model,
      };
    },
  );
}

// --- Persist a completed AI quiz attempt (no AI call, no token cost) -------

export async function courseStudyAiSubmitQuizController(
  courseId: string,
  body: unknown,
  context: AppContext,
  c: Context,
) {
  const data = courseStudyAiSubmitInputSchema.parse(body);
  // Enrolled-student guard (throws 401/403/404).
  const { enrollment } = await courseEnsureLearningAccess(courseId, context);
  const userId = context.currentUser!.id;

  const grade = gradeAiQuiz(data.questions, data.answers);

  const attempt = await prisma.courseAiQuizAttempt.create({
    data: {
      courseId,
      moduleId: data.moduleId ?? null,
      userId,
      memberId: enrollment?.memberId ?? null,
      kind: data.kind,
      questions: data.questions as unknown as Prisma.InputJsonValue,
      answers: data.answers as unknown as Prisma.InputJsonValue,
      scorePercent: grade.scorePercent,
      passed: grade.passed,
      domainScores: grade.domainScores as unknown as Prisma.InputJsonValue,
    },
  });

  await auditLogCreate({
    entityId: attempt.id,
    entityName: 'CourseAiQuizAttempt',
    operation: auditLogOperations.create,
    organizationId: null,
    userId,
    newData: attempt,
  });

  return c.json({
    attemptId: attempt.id,
    scorePercent: grade.scorePercent,
    passed: grade.passed,
    correct: grade.correct,
    total: grade.total,
    domainScores: grade.domainScores,
  });
}

// --- Per-course target exam date (stored on the student's enrollment) ------

export async function courseStudyAiGetExamDateController(
  courseId: string,
  context: AppContext,
  c: Context,
) {
  const { enrollment } = await courseEnsureLearningAccess(courseId, context);
  return c.json({
    targetExamDate: enrollment?.targetExamDate ?? null,
    examName: enrollment?.examName ?? null,
  });
}

export async function courseStudyAiPutExamDateController(
  courseId: string,
  body: unknown,
  context: AppContext,
  c: Context,
) {
  const data = courseStudyAiExamDateInputSchema.parse(body);
  const { enrollment } = await courseEnsureLearningAccess(courseId, context);
  if (!enrollment) {
    throw new Error400(
      context.dictionary.course.studyAi.errors.enrollToSetExamDate,
    );
  }
  const updated = await prisma.courseEnrollment.update({
    where: { id: enrollment.id },
    data: {
      targetExamDate: data.targetExamDate,
      examName: data.examName ?? null,
    },
  });
  return c.json({
    targetExamDate: updated.targetExamDate,
    examName: updated.examName,
  });
}

// --- Weakness detection (deterministic, no AI) -----------------------------

export async function courseStudyAiWeaknessesController(
  courseId: string,
  context: AppContext,
  c: Context,
) {
  await courseEnsureLearningAccess(courseId, context);
  const userId = context.currentUser!.id;
  const report = await computeWeaknesses(courseId, userId);
  return c.json({
    domains: report.domains,
    totalAnswered: report.totalAnswered,
    hasData: report.totalAnswered > 0,
  });
}

// --- "What should I study next?" (AI recommendation) -----------------------

export async function courseStudyAiNextController(
  courseId: string,
  context: AppContext,
  c: Context,
) {
  return runJsonStudyAi(c, context, { action: 'next', courseId }, async () => {
    const { course } = await courseEnsureLearningAccess(courseId, context);
    const userId = context.currentUser!.id;
    const preferences = await aiTrustGetPreferences(context);
    const [weaknesses, progress] = await Promise.all([
      preferences.usePracticeResults
        ? computeWeaknesses(courseId, userId)
        : Promise.resolve({ domains: [], totalAnswered: 0 }),
      preferences.useLessonProgress
        ? prisma.courseLessonProgress.findMany({
            where: { courseId, userId },
            select: { lessonId: true },
          })
        : Promise.resolve([]),
    ]);
    const completed = new Set(progress.map((row) => row.lessonId));
    const contextText = buildStudyAnalyticsText(
      course,
      weaknesses,
      completed,
      undefined,
      preferences,
    );
    const errors = context.dictionary.course.studyAi.errors;
    const generation = await runCourseStudyAiGeneration(
      nextStepSystemPrompt(languageNameOf(context)),
      `Recommend what this student should study next.\n\n${contextText}`,
      1024,
      {
        notConfigured: errors.notConfigured,
        parseFailed: errors.parseFailed,
      },
    );
    return {
      payload: {
        recommendation: parseNextRecommendation(generation.json, {
          unexpectedResponse: errors.unexpectedResponse,
        }),
      },
      usage: generation.usage,
      model: generation.model,
    };
  });
}

// --- Study plan: list / create / update / delete (no AI) -------------------

export async function courseStudyAiListStudyPlanController(
  courseId: string,
  context: AppContext,
  c: Context,
) {
  await courseEnsureLearningAccess(courseId, context);
  const userId = context.currentUser!.id;
  const items = await prisma.courseStudyPlanItem.findMany({
    where: { courseId, userId },
    orderBy: [{ plannedForDate: 'asc' }, { createdAt: 'asc' }],
  });
  return c.json({
    items,
    trust:
      items.find((item) => item.source === 'ai' && item.trustSignals)
        ?.trustSignals ?? null,
  });
}

export async function courseStudyAiCreateStudyPlanItemController(
  courseId: string,
  body: unknown,
  context: AppContext,
  c: Context,
) {
  const data = courseStudyPlanItemInputSchema.parse(body);
  const { enrollment } = await courseEnsureLearningAccess(courseId, context);
  const userId = context.currentUser!.id;
  const item = await prisma.courseStudyPlanItem.create({
    data: {
      courseId,
      userId,
      memberId: enrollment?.memberId ?? null,
      title: data.title,
      description: data.description ?? null,
      plannedForDate: data.plannedForDate ?? null,
      status: 'todo',
      source: 'manual',
    },
  });
  return c.json({ item });
}

export async function courseStudyAiUpdateStudyPlanItemController(
  courseId: string,
  itemId: string,
  body: unknown,
  context: AppContext,
  c: Context,
) {
  const data = courseStudyPlanItemUpdateSchema.parse(body);
  await courseEnsureLearningAccess(courseId, context);
  const userId = context.currentUser!.id;
  const existing = await prisma.courseStudyPlanItem.findFirst({
    where: { id: itemId, courseId, userId },
  });
  if (!existing) {
    throw new Error404();
  }
  const item = await prisma.courseStudyPlanItem.update({
    where: { id: itemId },
    data: {
      ...(data.title !== undefined ? { title: data.title } : {}),
      ...(data.description !== undefined
        ? { description: data.description }
        : {}),
      ...(data.plannedForDate !== undefined
        ? { plannedForDate: data.plannedForDate }
        : {}),
      ...(data.status !== undefined
        ? {
            status: data.status,
            completedAt: data.status === 'completed' ? new Date() : null,
          }
        : {}),
    },
  });
  return c.json({ item });
}

export async function courseStudyAiDeleteStudyPlanItemController(
  courseId: string,
  itemId: string,
  context: AppContext,
  c: Context,
) {
  await courseEnsureLearningAccess(courseId, context);
  const userId = context.currentUser!.id;
  const existing = await prisma.courseStudyPlanItem.findFirst({
    where: { id: itemId, courseId, userId },
  });
  if (!existing) {
    throw new Error404();
  }
  await prisma.courseStudyPlanItem.delete({ where: { id: itemId } });
  return c.json({ ok: true });
}

// Spreads ordered tasks across the run-up to the exam (or the next 14 days
// when no exam date is set). Returns ISO date strings.
function distributeStudyPlanDates(
  items: Array<{ title: string; description: string }>,
  daysUntil: number | null,
): Array<{ title: string; description: string; plannedForDate: string }> {
  const span = daysUntil && daysUntil > 1 ? daysUntil - 1 : 14;
  return items.map((item, index) => {
    const offset =
      items.length > 1 && span > 1
        ? 1 + Math.floor((index * (span - 1)) / (items.length - 1))
        : 1;
    const date = new Date();
    date.setDate(date.getDate() + offset);
    return { ...item, plannedForDate: date.toISOString().slice(0, 10) };
  });
}

// --- AI study plan for an exam date ----------------------------------------

export async function courseStudyAiGenerateStudyPlanController(
  courseId: string,
  context: AppContext,
  c: Context,
) {
  return runJsonStudyAi(
    c,
    context,
    { action: 'study_plan', courseId },
    async () => {
      const { course, enrollment } = await courseEnsureLearningAccess(
        courseId,
        context,
      );
      const userId = context.currentUser!.id;
      const preferences = await aiTrustGetPreferences(context);
      const [weaknesses, progress] = await Promise.all([
        preferences.usePracticeResults
          ? computeWeaknesses(courseId, userId)
          : Promise.resolve({ domains: [], totalAnswered: 0 }),
        preferences.useLessonProgress
          ? prisma.courseLessonProgress.findMany({
              where: { courseId, userId },
              select: { lessonId: true },
            })
          : Promise.resolve([]),
      ]);
      const completed = new Set(progress.map((row) => row.lessonId));
      const examDate = enrollment?.targetExamDate ?? null;
      const daysUntil = examDate ? daysUntilDate(examDate) : null;
      const contextText = buildStudyAnalyticsText(
        course,
        weaknesses,
        completed,
        {
          examName: enrollment?.examName,
          daysUntil,
        },
        preferences,
      );

      const errors = context.dictionary.course.studyAi.errors;
      const generation = await runCourseStudyAiGeneration(
        studyPlanSystemPrompt(languageNameOf(context)),
        `Build a study plan for this student.\n\n${contextText}`,
        3000,
        {
          notConfigured: errors.notConfigured,
          parseFailed: errors.parseFailed,
        },
      );
      const dated = distributeStudyPlanDates(
        parseStudyPlanItems(generation.json, {
          unexpectedStudyPlan: errors.unexpectedStudyPlan,
        }),
        daysUntil,
      );
      const trust = courseStudyPlanTrustSignal({
        context,
        preferences,
        course,
        weaknesses,
        completedLessonIds: completed,
        examDate,
        daysUntil,
        model: generation.model,
      });

      // Regenerating replaces prior AI items; manually added items are kept.
      await prisma.courseStudyPlanItem.deleteMany({
        where: { courseId, userId, source: 'ai' },
      });
      if (dated.length) {
        await prisma.courseStudyPlanItem.createMany({
          data: dated.map((item) => ({
            courseId,
            userId,
            memberId: enrollment?.memberId ?? null,
            title: item.title,
            description: item.description || null,
            plannedForDate: item.plannedForDate,
            status: 'todo',
            source: 'ai',
            trustSignals: aiTrustJson(trust),
          })),
        });
      }

      const items = await prisma.courseStudyPlanItem.findMany({
        where: { courseId, userId },
        orderBy: [{ plannedForDate: 'asc' }, { createdAt: 'asc' }],
      });
      return {
        payload: { items, trust },
        usage: generation.usage,
        model: generation.model,
      };
    },
  );
}
