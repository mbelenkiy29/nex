import { Prisma } from '../../prisma/generated/client';
// bypass-RLS: Course is a marketplace entity with no organizationId
// (Udemy-style cross-tenant catalogue). CreatorApplication is per-user
// not per-org. Ownership filters are explicit in each query.
// eslint-disable-next-line no-restricted-syntax
import { prisma, prismaDangerouslyBypassRLS } from '../../prisma';
import { AppContext } from '../../shared/controller/appContext';
import { Error400 } from '../../shared/errors/Error400';
import { Error403 } from '../../shared/errors/Error403';
import { Error404 } from '../../shared/errors/Error404';
import { filePopulateDownloadUrlInTree } from '../file/fileService';
import { auditLogCreate } from '../auditLog/auditLogCreate';
import { auditLogOperations } from '../auditLog/auditLogOperations';
import {
  courseInclude,
  courseAssignmentSubmissionReviewController,
  courseSyncContent,
  courseUniqueSlug,
  withCourseSubmissionUsers,
  normalizeNullableString,
} from './courseControllers';
import {
  courseBuilderCheckpointCreateInputSchema,
  courseBuilderManageInputSchema,
} from './courseSchemas';
import { platformMetricsBuild } from '../platformAdmin/platformMetricsService';
import {
  trustSafetyRequireCreatorEnabled,
  trustSafetyRequirePolicyAcceptance,
} from '../trustSafety/trustSafetyService';
import { courseReviewDecisionCreate } from './courseReviewDecisionService';
import {
  courseVideoTranscriptEnqueue,
  courseVideoTranscriptEnqueueQueuedLessons,
} from './courseVideoTranscriptQueue';
import { courseLessonVideoSourceKey } from './courseVideoTranscriptService';

// The Course Builder is creator-facing. Read access (list/get) only requires an
// existing creator application so a creator whose Nex Verified badge lapsed can
// still see their drafts; write actions require an active verified creator.
async function findCreatorApplication(userId: string) {
  return prismaDangerouslyBypassRLS.creatorApplication.findUnique({
    where: { userId },
    select: { id: true, nexVerified: true, safetyStatus: true },
  });
}

async function authGuardCreatorBackend(context: AppContext) {
  if (!context.currentUser) {
    throw new Error403();
  }

  const application = await findCreatorApplication(context.currentUser.id);

  if (!application) {
    throw new Error403();
  }

  return { currentUser: context.currentUser, application };
}

export async function authGuardVerifiedCreatorBackend(context: AppContext) {
  const { currentUser, application } = await authGuardCreatorBackend(context);

  if (!application.nexVerified) {
    throw new Error403();
  }

  await trustSafetyRequireCreatorEnabled(currentUser.id, context);

  return { currentUser, application };
}

// Loads a course and enforces creator ownership. Fails closed with a 404 (not a
// 403) so a creator cannot probe which course ids exist.
async function findOwnedCourse(courseId: string, userId: string) {
  const course = await prisma.course.findUnique({
    where: { id: courseId },
    include: courseInclude,
  });

  if (!course || course.creatorUserId !== userId) {
    throw new Error404();
  }

  return course;
}

function courseBuilderMetadata(
  data: ReturnType<typeof courseBuilderManageInputSchema.parse>,
) {
  return {
    title: data.title,
    subtitle: normalizeNullableString(data.subtitle),
    description: normalizeNullableString(data.description),
    categoryId: data.categoryId ?? null,
    examType: normalizeNullableString(data.examType),
    thumbnail: data.thumbnail as Prisma.InputJsonValue,
    introVideoFiles: data.introVideoFiles as Prisma.InputJsonValue,
    promoVideoFiles: data.promoVideoFiles as Prisma.InputJsonValue,
    difficulty: normalizeNullableString(data.difficulty),
    language: normalizeNullableString(data.language),
    visibility: data.visibility,
    audience: data.audience,
  };
}

type BuilderCourse = Prisma.CourseGetPayload<{ include: typeof courseInclude }>;

function courseToBuilderCheckpointPayload(course: BuilderCourse) {
  return courseBuilderManageInputSchema.parse({
    title: course.title,
    slug: course.slug,
    subtitle: course.subtitle,
    description: course.description,
    categoryId: course.categoryId,
    examType: course.examType,
    thumbnail: course.thumbnail,
    introVideoFiles: course.introVideoFiles,
    promoVideoFiles: course.promoVideoFiles,
    difficulty: course.difficulty,
    language: course.language,
    visibility: course.visibility,
    audience: course.audience,
    modules: course.modules.map((module) => ({
      id: module.id,
      title: module.title,
      description: module.description,
      orderIndex: module.orderIndex,
    })),
    lessons: course.lessons.map((lesson) => ({
      id: lesson.id,
      title: lesson.title,
      description: lesson.description,
      videoFiles: lesson.videoFiles,
      videoUrl: lesson.videoUrl,
      resourceFiles: lesson.resourceFiles,
      videoTranscriptText: lesson.videoTranscriptText,
      videoTranscriptStatus: lesson.videoTranscriptStatus,
      videoTranscriptSourceKey: lesson.videoTranscriptSourceKey,
      videoTranscriptError: lesson.videoTranscriptError,
      videoTranscriptGeneratedAt: lesson.videoTranscriptGeneratedAt,
      videoDurationSeconds: lesson.videoDurationSeconds,
      orderIndex: lesson.orderIndex,
      isPreview: lesson.isPreview,
      isHidden: lesson.isHidden,
      moduleId: lesson.moduleId,
    })),
    assignments: course.assignments.map((assignment) => ({
      id: assignment.id,
      title: assignment.title,
      prompt: assignment.prompt,
      orderIndex: assignment.orderIndex,
      dueDaysAfterEnroll: assignment.dueDaysAfterEnroll,
      rubric: assignment.rubric,
      allowResubmissions: assignment.allowResubmissions,
      maxAttempts: assignment.maxAttempts,
      moduleId: assignment.moduleId,
      lessonId: assignment.lessonId,
    })),
    questions: course.questions.map((question) => ({
      id: question.id,
      questionText: question.questionText,
      questionType: question.questionType,
      explanation: question.explanation,
      difficulty: question.difficulty,
      examDomain: question.examDomain,
      tags: question.tags,
      source: question.source,
      aiGenerated: question.aiGenerated,
      status: question.status,
      meta: question.meta,
      answers: question.answers.map((answer) => ({
        id: answer.id,
        answerText: answer.answerText,
        isCorrect: answer.isCorrect,
        matchText: answer.matchText,
        explanation: answer.explanation,
        orderIndex: answer.orderIndex,
      })),
    })),
    quizzes: course.quizzes.map((quiz) => ({
      id: quiz.id,
      title: quiz.title,
      description: quiz.description,
      orderIndex: quiz.orderIndex,
      passingScore: quiz.passingScore,
      timeLimitMinutes: quiz.timeLimitMinutes,
      randomizeQuestions: quiz.randomizeQuestions,
      randomizeAnswers: quiz.randomizeAnswers,
      showExplanations: quiz.showExplanations,
      allowRetries: quiz.allowRetries,
      maxAttempts: quiz.maxAttempts,
      moduleId: quiz.moduleId,
      lessonId: quiz.lessonId,
    })),
    quizQuestions: course.quizzes.flatMap((quiz) =>
      quiz.questions.map((link) => ({
        id: link.id,
        quizId: quiz.id,
        questionId: link.questionId,
        orderIndex: link.orderIndex,
        points: link.points,
      })),
    ),
    practiceExams: course.practiceExams.map((exam) => ({
      id: exam.id,
      title: exam.title,
      description: exam.description,
      examType: exam.examType,
      totalQuestions: exam.totalQuestions,
      timeLimitMinutes: exam.timeLimitMinutes,
      passingScore: exam.passingScore,
      randomizeQuestions: exam.randomizeQuestions,
      simulateRealExam: exam.simulateRealExam,
      orderIndex: exam.orderIndex,
    })),
    practiceExamRules: course.practiceExams.flatMap((exam) =>
      exam.rules.map((rule) => ({
        id: rule.id,
        practiceExamId: exam.id,
        examDomain: rule.examDomain,
        questionCount: rule.questionCount,
        difficulty: rule.difficulty,
        orderIndex: rule.orderIndex,
      })),
    ),
    outcomes: course.outcomes.map((outcome) => ({
      id: outcome.id,
      text: outcome.text,
      orderIndex: outcome.orderIndex,
    })),
    requirements: course.requirements.map((requirement) => ({
      id: requirement.id,
      text: requirement.text,
      orderIndex: requirement.orderIndex,
    })),
    flashcardSets: course.flashcardSets.map((set) => ({
      id: set.id,
      title: set.title,
      description: set.description,
      moduleId: set.moduleId,
      lessonId: set.lessonId,
      orderIndex: set.orderIndex,
    })),
    flashcards: course.flashcardSets.flatMap((set) =>
      set.cards.map((card) => ({
        id: card.id,
        flashcardSetId: set.id,
        front: card.front,
        back: card.back,
        hint: card.hint,
        orderIndex: card.orderIndex,
      })),
    ),
    blocks: course.lessons.flatMap((lesson) =>
      lesson.blocks.map((block) => ({
        id: block.id,
        lessonId: lesson.id,
        blockType: block.blockType,
        content: block.content,
        orderIndex: block.orderIndex,
      })),
    ),
  });
}

async function courseBuilderCheckpointCreateInternal({
  courseId,
  userId,
  source,
  label,
  payload,
}: {
  courseId: string;
  userId: string;
  source: string;
  label?: string | null;
  payload: unknown;
}) {
  return await prisma.$transaction(async (tx) => {
    if (source === 'autosave') {
      await tx.courseBuilderCheckpoint.deleteMany({
        where: { courseId, userId, source: 'autosave' },
      });
    }

    return await tx.courseBuilderCheckpoint.create({
      data: {
        courseId,
        userId,
        source,
        label: normalizeNullableString(label),
        payload: payload as Prisma.InputJsonValue,
      },
    });
  });
}

export async function courseBuilderListController(context: AppContext) {
  const { currentUser } = await authGuardCreatorBackend(context);
  const courses = await prisma.course.findMany({
    where: { creatorUserId: currentUser.id },
    include: {
      _count: {
        select: {
          modules: true,
          lessons: true,
          assignments: true,
          quizzes: true,
          practiceExams: true,
          outcomes: true,
          flashcardSets: true,
          enrollments: true,
        },
      },
    },
    orderBy: { updatedAt: 'desc' },
  });

  return {
    courses: courses.map((course) => ({
      id: course.id,
      title: course.title,
      slug: course.slug,
      subtitle: course.subtitle,
      description: course.description,
      thumbnail: course.thumbnail,
      status: course.status,
      reviewNotes: course.reviewNotes,
      submittedForReviewAt: course.submittedForReviewAt,
      reviewedAt: course.reviewedAt,
      publishedAt: course.publishedAt,
      updatedAt: course.updatedAt,
      counts: {
        modules: course._count.modules,
        lessons: course._count.lessons,
        assignments: course._count.assignments,
        quizzes: course._count.quizzes,
        practiceExams: course._count.practiceExams,
        outcomes: course._count.outcomes,
        flashcardSets: course._count.flashcardSets,
        enrollments: course._count.enrollments,
      },
    })),
  };
}

export async function courseBuilderCheckpointListController(
  params: { id: string },
  context: AppContext,
) {
  const { currentUser } = await authGuardCreatorBackend(context);
  await findOwnedCourse(params.id, currentUser.id);

  const checkpoints = await prisma.courseBuilderCheckpoint.findMany({
    where: { courseId: params.id, userId: currentUser.id },
    orderBy: { createdAt: 'desc' },
    take: 30,
  });

  return { checkpoints };
}

export async function courseBuilderCheckpointCreateController(
  params: { id: string },
  body: unknown,
  context: AppContext,
) {
  const { currentUser } = await authGuardVerifiedCreatorBackend(context);
  const data = courseBuilderCheckpointCreateInputSchema.parse(body);
  const course = await findOwnedCourse(params.id, currentUser.id);

  if (course.status !== 'draft') {
    throw new Error400(context.dictionary.course.errors.editLockedNotDraft);
  }

  const checkpoint = await courseBuilderCheckpointCreateInternal({
    courseId: course.id,
    userId: currentUser.id,
    source: data.source,
    label: data.label,
    payload: data.payload,
  });

  return { checkpoint };
}

export async function courseBuilderCheckpointRestoreController(
  params: { id: string; checkpointId: string },
  context: AppContext,
) {
  const { currentUser } = await authGuardVerifiedCreatorBackend(context);
  const checkpoint = await prisma.courseBuilderCheckpoint.findFirst({
    where: {
      id: params.checkpointId,
      courseId: params.id,
      userId: currentUser.id,
    },
  });

  if (!checkpoint) {
    throw new Error404();
  }

  const oldData = await findOwnedCourse(params.id, currentUser.id);
  if (oldData.status !== 'draft') {
    throw new Error400(context.dictionary.course.errors.editLockedNotDraft);
  }

  const parsed = courseBuilderManageInputSchema.safeParse(checkpoint.payload);
  if (!parsed.success) {
    return { checkpoint, restoredToCourse: false };
  }

  const data = parsed.data;
  const slug = await courseUniqueSlug(
    data.title,
    data.slug || oldData.slug,
    oldData.id,
  );
  const course = await prismaDangerouslyBypassRLS.$transaction(async (tx) => {
    await tx.course.update({
      where: { id: oldData.id },
      data: {
        ...courseBuilderMetadata(data),
        slug,
        updatedByUserId: currentUser.id,
      },
    });
    await courseSyncContent(tx, oldData.id, data);

    return await tx.course.findUniqueOrThrow({
      where: { id: oldData.id },
      include: courseInclude,
    });
  });

  await auditLogCreate({
    entityId: course.id,
    entityName: 'Course',
    operation: auditLogOperations.update,
    organizationId: null,
    userId: currentUser.id,
    memberId: context.currentMember?.id || null,
    oldData,
    newData: course,
  });

  await courseBuilderCheckpointCreateInternal({
    courseId: course.id,
    userId: currentUser.id,
    source: 'restore',
    label: checkpoint.label,
    payload: data,
  });

  await courseVideoTranscriptEnqueueQueuedLessons(course.lessons);
  await filePopulateDownloadUrlInTree(course);
  return { checkpoint, course, restoredToCourse: true };
}

export async function courseBuilderCheckpointDeleteController(
  params: { id: string; checkpointId: string },
  context: AppContext,
) {
  const { currentUser } = await authGuardVerifiedCreatorBackend(context);
  await findOwnedCourse(params.id, currentUser.id);

  const checkpoint = await prisma.courseBuilderCheckpoint.findFirst({
    where: {
      id: params.checkpointId,
      courseId: params.id,
      userId: currentUser.id,
    },
  });
  if (!checkpoint) {
    throw new Error404();
  }

  await prisma.courseBuilderCheckpoint.delete({
    where: { id: checkpoint.id },
  });

  return { id: checkpoint.id };
}

export async function courseBuilderMetricsController(
  query: unknown,
  context: AppContext,
) {
  const { currentUser } = await authGuardVerifiedCreatorBackend(context);
  const queryObject =
    query && typeof query === 'object' && !Array.isArray(query) ? query : {};

  return await platformMetricsBuild({
    ...queryObject,
    creatorUserId: currentUser.id,
  });
}

export async function courseBuilderGetController(
  params: { id: string },
  context: AppContext,
) {
  const { currentUser } = await authGuardCreatorBackend(context);
  const course = await findOwnedCourse(params.id, currentUser.id);

  // The owner sees full content (including quiz answer keys) for editing and
  // student-preview rendering — quiz answers are only stripped on student APIs.
  await filePopulateDownloadUrlInTree(course);
  await withCourseSubmissionUsers(course);
  return { course };
}

export async function courseBuilderCreateController(
  body: unknown,
  context: AppContext,
) {
  const { currentUser } = await authGuardVerifiedCreatorBackend(context);
  const data = courseBuilderManageInputSchema.parse(body);
  const slug = await courseUniqueSlug(data.title, data.slug);

  const course = await prismaDangerouslyBypassRLS.$transaction(async (tx) => {
    const created = await tx.course.create({
      data: {
        ...courseBuilderMetadata(data),
        slug,
        status: 'draft',
        accessType: 'free',
        creatorUserId: currentUser.id,
        creatorMemberId: context.currentMember?.id || null,
        creatorOrganizationId: context.currentOrganization?.id || null,
        createdByUserId: currentUser.id,
        updatedByUserId: currentUser.id,
      },
    });

    await courseSyncContent(tx, created.id, data);

    return await tx.course.findUniqueOrThrow({
      where: { id: created.id },
      include: courseInclude,
    });
  });

  await auditLogCreate({
    entityId: course.id,
    entityName: 'Course',
    operation: auditLogOperations.create,
    organizationId: null,
    userId: currentUser.id,
    memberId: context.currentMember?.id || null,
    newData: course,
  });

  await courseVideoTranscriptEnqueueQueuedLessons(course.lessons);
  await filePopulateDownloadUrlInTree(course);
  return { course };
}

export async function courseBuilderUpdateController(
  params: { id: string },
  body: unknown,
  context: AppContext,
) {
  const { currentUser } = await authGuardVerifiedCreatorBackend(context);
  const data = courseBuilderManageInputSchema.parse(body);
  const oldData = await findOwnedCourse(params.id, currentUser.id);

  // A course is only editable while in draft. inReview is locked; a published
  // course must be withdrawn first (which unpublishes it for enrolled students).
  if (oldData.status !== 'draft') {
    throw new Error400(context.dictionary.course.errors.editLockedNotDraft);
  }

  const slug = await courseUniqueSlug(
    data.title,
    data.slug || oldData.slug,
    oldData.id,
  );

  const course = await prismaDangerouslyBypassRLS.$transaction(async (tx) => {
    await tx.course.update({
      where: { id: oldData.id },
      data: {
        ...courseBuilderMetadata(data),
        slug,
        updatedByUserId: currentUser.id,
      },
    });

    await courseSyncContent(tx, oldData.id, data);

    return await tx.course.findUniqueOrThrow({
      where: { id: oldData.id },
      include: courseInclude,
    });
  });

  await auditLogCreate({
    entityId: course.id,
    entityName: 'Course',
    operation: auditLogOperations.update,
    organizationId: null,
    userId: currentUser.id,
    memberId: context.currentMember?.id || null,
    oldData,
    newData: course,
  });

  await courseVideoTranscriptEnqueueQueuedLessons(course.lessons);
  await filePopulateDownloadUrlInTree(course);
  return { course };
}

export async function courseBuilderVideoTranscriptRetryController(
  params: { id: string; lessonId: string },
  context: AppContext,
) {
  const { currentUser } = await authGuardVerifiedCreatorBackend(context);
  const course = await findOwnedCourse(params.id, currentUser.id);
  if (course.status !== 'draft') {
    throw new Error400(context.dictionary.course.errors.editLockedNotDraft);
  }

  const lesson = course.lessons.find((item) => item.id === params.lessonId);
  if (!lesson) {
    throw new Error404();
  }

  const sourceKey = courseLessonVideoSourceKey(lesson.videoFiles);
  if (!sourceKey) {
    throw new Error400(context.dictionary.course.errors.videoTranscriptNoVideo);
  }

  const updated = await prisma.courseLesson.update({
    where: { id: lesson.id },
    data: {
      videoTranscriptText: null,
      videoTranscriptStatus: 'queued',
      videoTranscriptSourceKey: sourceKey,
      videoTranscriptError: null,
      videoTranscriptGeneratedAt: null,
    },
  });

  await auditLogCreate({
    entityId: updated.id,
    entityName: 'CourseLesson',
    operation: auditLogOperations.update,
    organizationId: null,
    userId: currentUser.id,
    memberId: context.currentMember?.id || null,
    oldData: {
      videoTranscriptStatus: lesson.videoTranscriptStatus,
      videoTranscriptSourceKey: lesson.videoTranscriptSourceKey,
    },
    newData: {
      videoTranscriptStatus: updated.videoTranscriptStatus,
      videoTranscriptSourceKey: updated.videoTranscriptSourceKey,
    },
  });

  await courseVideoTranscriptEnqueue({
    kind: 'transcribe',
    lessonId: updated.id,
    sourceKey,
  });

  return { lesson: updated };
}

export async function courseBuilderSubmitForReviewController(
  params: { id: string },
  context: AppContext,
) {
  const { currentUser } = await authGuardVerifiedCreatorBackend(context);
  await trustSafetyRequirePolicyAcceptance('teacherTerms', context);
  const oldData = await findOwnedCourse(params.id, currentUser.id);

  if (oldData.status !== 'draft') {
    throw new Error400(context.dictionary.course.errors.submitNotDraft);
  }

  // Publishing checklist — a course must be reasonably complete before review.
  const checklistFailed =
    !oldData.title.trim() ||
    !(oldData.description || '').trim() ||
    !(Array.isArray(oldData.thumbnail) && oldData.thumbnail.length > 0) ||
    oldData.modules.length === 0 ||
    oldData.lessons.length < 3 ||
    (oldData.quizzes.length === 0 && oldData.practiceExams.length === 0) ||
    oldData.outcomes.length === 0;
  if (checklistFailed) {
    throw new Error400(context.dictionary.course.errors.submitNeedsContent);
  }

  await courseBuilderCheckpointCreateInternal({
    courseId: oldData.id,
    userId: currentUser.id,
    source: 'submitSnapshot',
    label: context.dictionary.course.builder.checkpoints.submitSnapshotLabel,
    payload: courseToBuilderCheckpointPayload(oldData),
  });

  const course = await prisma.course.update({
    where: { id: oldData.id },
    data: {
      status: 'inReview',
      submittedForReviewAt: new Date(),
      reviewNotes: null,
      updatedByUserId: currentUser.id,
    },
    include: courseInclude,
  });

  await auditLogCreate({
    entityId: course.id,
    entityName: 'Course',
    operation: auditLogOperations.update,
    organizationId: null,
    userId: currentUser.id,
    memberId: context.currentMember?.id || null,
    oldData,
    newData: course,
  });

  await courseReviewDecisionCreate(
    {
      courseId: course.id,
      decision: 'submitted',
      reviewedByUserId: currentUser.id,
      previousStatus: oldData.status,
      nextStatus: course.status,
    },
    context,
  );

  await filePopulateDownloadUrlInTree(course);
  return { course };
}

export async function courseBuilderWithdrawController(
  params: { id: string },
  context: AppContext,
) {
  const { currentUser } = await authGuardVerifiedCreatorBackend(context);
  const oldData = await findOwnedCourse(params.id, currentUser.id);

  // Withdraw a pending review, or unpublish a live course — both return to
  // draft. Unpublishing removes the course for enrolled students.
  if (oldData.status !== 'inReview' && oldData.status !== 'published') {
    throw new Error400(context.dictionary.course.errors.cannotWithdraw);
  }

  const course = await prisma.course.update({
    where: { id: oldData.id },
    data: {
      status: 'draft',
      publishedAt: null,
      submittedForReviewAt: null,
      updatedByUserId: currentUser.id,
    },
    include: courseInclude,
  });

  await auditLogCreate({
    entityId: course.id,
    entityName: 'Course',
    operation: auditLogOperations.update,
    organizationId: null,
    userId: currentUser.id,
    memberId: context.currentMember?.id || null,
    oldData,
    newData: course,
  });

  await courseReviewDecisionCreate(
    {
      courseId: course.id,
      decision:
        oldData.status === 'published' ? 'creatorUnpublished' : 'withdrawn',
      reviewedByUserId: currentUser.id,
      previousStatus: oldData.status,
      nextStatus: course.status,
    },
    context,
  );

  await filePopulateDownloadUrlInTree(course);
  return { course };
}

export async function courseBuilderAssignmentSubmissionReviewController(
  params: { courseId: string; submissionId: string },
  body: unknown,
  context: AppContext,
) {
  const { currentUser } = await authGuardVerifiedCreatorBackend(context);
  await findOwnedCourse(params.courseId, currentUser.id);

  return await courseAssignmentSubmissionReviewController(
    { id: params.submissionId, courseId: params.courseId },
    body,
    context,
    currentUser.id,
  );
}
