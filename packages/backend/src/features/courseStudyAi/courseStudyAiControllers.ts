import { Context } from 'hono';
import { streamSSE } from 'hono/streaming';
import { AppContext } from '../../shared/controller/appContext';
import { promptLanguageName } from '../../shared/lib/promptLanguageName';
import { Error400 } from '../../shared/errors/Error400';
import { Error401 } from '../../shared/errors/Error401';
import { Error404 } from '../../shared/errors/Error404';
import { Prisma } from '../../prisma/generated/client';
import { prisma } from '../../prisma';
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

/**
 * Runs a one-shot JSON AI study action behind the per-user lock and the shared
 * daily token limits. Returns a 409 when another study request is in flight and
 * a 429 when a token cap is hit; any other error propagates to ApiResponseError.
 */
async function runJsonStudyAi<T>(
  c: Context,
  context: AppContext,
  options: { action: string; courseId: string },
  generate: () => Promise<{
    payload: T;
    usage: { inputTokens: number; outputTokens: number };
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

    const { payload, usage } = await generate();
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
      model: STUDY_AI_MODEL,
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

    // Building the context enforces the enrolled-student guard (401/403/404).
    const lessonContext = await buildLessonContext(
      courseId,
      data.lessonId,
      context,
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
      {
        notConfigured: errors.notConfigured,
        parseFailed: errors.parseFailed,
      },
    );
    return {
      payload: {
        kind: 'quiz' as const,
        moduleId: data.moduleId,
        questions: parseGeneratedQuestions(json, {
          unexpectedQuizFormat: errors.unexpectedQuizFormat,
        }),
      },
      usage,
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
      );
      if (!moduleContext.hasContent) {
        throw new Error400(
          context.dictionary.course.studyAi.errors.moduleNoContentPractice,
        );
      }
      const errors = context.dictionary.course.studyAi.errors;
      const { json, usage } = await runCourseStudyAiGeneration(
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
          questions: parseGeneratedQuestions(json, {
            unexpectedQuizFormat: errors.unexpectedQuizFormat,
          }),
        },
        usage,
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
    const [weaknesses, progress] = await Promise.all([
      computeWeaknesses(courseId, userId),
      prisma.courseLessonProgress.findMany({
        where: { courseId, userId },
        select: { lessonId: true },
      }),
    ]);
    const completed = new Set(progress.map((row) => row.lessonId));
    const contextText = buildStudyAnalyticsText(course, weaknesses, completed);
    const errors = context.dictionary.course.studyAi.errors;
    const { json, usage } = await runCourseStudyAiGeneration(
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
        recommendation: parseNextRecommendation(json, {
          unexpectedResponse: errors.unexpectedResponse,
        }),
      },
      usage,
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
  return c.json({ items });
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
      const [weaknesses, progress] = await Promise.all([
        computeWeaknesses(courseId, userId),
        prisma.courseLessonProgress.findMany({
          where: { courseId, userId },
          select: { lessonId: true },
        }),
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
      );

      const errors = context.dictionary.course.studyAi.errors;
      const { json, usage } = await runCourseStudyAiGeneration(
        studyPlanSystemPrompt(languageNameOf(context)),
        `Build a study plan for this student.\n\n${contextText}`,
        3000,
        {
          notConfigured: errors.notConfigured,
          parseFailed: errors.parseFailed,
        },
      );
      const dated = distributeStudyPlanDates(
        parseStudyPlanItems(json, {
          unexpectedStudyPlan: errors.unexpectedStudyPlan,
        }),
        daysUntil,
      );

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
          })),
        });
      }

      const items = await prisma.courseStudyPlanItem.findMany({
        where: { courseId, userId },
        orderBy: [{ plannedForDate: 'asc' }, { createdAt: 'asc' }],
      });
      return { payload: { items }, usage };
    },
  );
}
