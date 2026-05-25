import { Prisma } from '../../prisma/generated/client';
import { prisma } from '../../prisma';
import { AppContext } from '../../shared/controller/appContext';
import { Error400 } from '../../shared/errors/Error400';
import { Error404 } from '../../shared/errors/Error404';
import { getPgBoss } from '../../shared/jobs/pgBoss';
import { auditLogCreate } from '../auditLog/auditLogCreate';
import { auditLogOperations } from '../auditLog/auditLogOperations';
import { authGuardVerifiedCreatorBackend } from '../course/courseBuilderControllers';
import { COURSE_AI_QUEUE } from './courseAiJobSchemas';
import { courseAiGenerateInputSchema } from './courseAiSchemas';
import { courseAiConfigured } from './courseAiService';
import { logger } from '../../shared/lib/logger';

export async function courseAiGenerateController(
  params: { courseId: string },
  body: unknown,
  context: AppContext,
) {
  const { currentUser } = await authGuardVerifiedCreatorBackend(context);
  const data = courseAiGenerateInputSchema.parse(body);
  const t = context.dictionary.course.builder.ai;

  if (!courseAiConfigured()) {
    throw new Error400(t.errors.notConfigured);
  }

  // Ownership check — only the course's creator may generate into it.
  const course = await prisma.course.findUnique({
    where: { id: params.courseId },
    select: { id: true, creatorUserId: true },
  });
  if (!course || course.creatorUserId !== currentUser.id) {
    throw new Error404();
  }

  if (data.jobType === 'improveLesson') {
    if (!data.lessonId) {
      throw new Error400(t.errors.lessonRequired);
    }

    const lesson = await prisma.courseLesson.findFirst({
      where: { id: data.lessonId, courseId: course.id },
      select: { id: true },
    });
    if (!lesson) {
      throw new Error404();
    }
  }

  const job = await prisma.courseAiGenerationJob.create({
    data: {
      userId: currentUser.id,
      courseId: course.id,
      jobType: data.jobType,
      status: 'queued',
      progressPercent: 0,
      progressStage: 'queued',
      input: {
        prompt: data.prompt,
        lessonId: data.lessonId || null,
      } as Prisma.InputJsonValue,
    },
  });

  try {
    const boss = await getPgBoss();
    await boss.send(COURSE_AI_QUEUE, {
      kind: 'generate',
      jobId: job.id,
    });
    logger.info('ai.course_generation.queued', {
      jobId: job.id,
      userId: currentUser.id,
      courseId: course.id,
      jobType: data.jobType,
    });

    await auditLogCreate({
      entityId: job.id,
      entityName: 'CourseAiGenerationJob',
      operation: auditLogOperations.create,
      organizationId: null,
      userId: currentUser.id,
      newData: job,
    });

    return { job };
  } catch (error) {
    logger.error('ai.course_generation.queue_failed', {
      jobId: job.id,
      userId: currentUser.id,
      courseId: course.id,
      jobType: data.jobType,
      error,
    });
    await prisma.courseAiGenerationJob.update({
      where: { id: job.id },
      data: {
        status: 'failed',
        progressPercent: 100,
        progressStage: 'failed',
        errorMessage: 'courseAiQueueFailed',
        completedAt: new Date(),
      },
    });
    throw new Error400(t.errors.queueFailed);
  }
}

export async function courseAiJobController(
  params: { jobId: string },
  context: AppContext,
) {
  const { currentUser } = await authGuardVerifiedCreatorBackend(context);
  const job = await prisma.courseAiGenerationJob.findUnique({
    where: { id: params.jobId },
  });
  if (!job || job.userId !== currentUser.id) {
    throw new Error404();
  }
  return { job, aiConfigured: courseAiConfigured() };
}
