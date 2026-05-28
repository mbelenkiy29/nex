import { Prisma } from '../../prisma/generated/client';
import { prisma } from '../../prisma';
import { AppContext } from '../../shared/controller/appContext';
import { Error400 } from '../../shared/errors/Error400';
import { Error401 } from '../../shared/errors/Error401';
import { Error403 } from '../../shared/errors/Error403';
import { Error404 } from '../../shared/errors/Error404';
import { dictionaryFormat } from '../../translation/dictionaryFormat';
import { auditLogCreate } from '../auditLog/auditLogCreate';
import { auditLogOperations } from '../auditLog/auditLogOperations';
import { platformAdminIsUserAllowed } from '../platformAdmin/platformAdminGuard';
import {
  studentExperienceAdaptivePlanGenerateInputSchema,
  studentExperienceCourseParamsSchema,
  studentExperienceAttemptParamsSchema,
  studentExperienceDiagnosticAnswerInputSchema,
  studentExperienceDiagnosticAttemptParamsSchema,
  studentExperienceDiagnosticStartInputSchema,
  studentExperienceFlashcardReviewInputSchema,
  studentExperienceFlashcardReviewParamsSchema,
  studentExperienceNoteInputSchema,
  studentExperienceNoteParamsSchema,
  studentExperienceNoteUpdateInputSchema,
  studentExperiencePracticeAnswerInputSchema,
  studentExperiencePracticeStartInputSchema,
  studentExperienceRemediationGenerateInputSchema,
  studentExperienceResumeInputSchema,
  studentExperienceSyncInputSchema,
  studentExperienceStudyPlanInputSchema,
  studentExperienceStudyPlanParamsSchema,
  studentExperienceStudyPlanUpdateInputSchema,
  studentReminderPreferenceInputSchema,
} from './studentExperienceSchemas';
import {
  StudentReadinessScore,
  studentExperienceReadinessCalculate,
} from './studentExperienceReadiness';

const dashboardCourseTake = 24;
const dashboardHomeworkTake = 8;
const dashboardNotesTake = 5;
const dashboardStudyPlanTake = 6;
const masteryMapCourseTake = 24;
const masteryMapTrendDays = 60;
const defaultPracticeQuestionCount = 5;
const defaultDiagnosticQuestionCount = 8;
const learningOutcomesGeneralDomain = 'General';
const masteryMapMilestoneThresholds = [
  { key: 'baseline', threshold: 25 },
  { key: 'momentum', threshold: 50 },
  { key: 'ready', threshold: 75 },
  { key: 'examReady', threshold: 90 },
  { key: 'mastered', threshold: 100 },
] as const;

const studentCourseInclude = {
  modules: {
    orderBy: { orderIndex: 'asc' as const },
    include: {
      lessons: {
        orderBy: { orderIndex: 'asc' as const },
        select: {
          id: true,
          title: true,
          description: true,
          moduleId: true,
          orderIndex: true,
        },
      },
    },
  },
  lessons: {
    orderBy: { orderIndex: 'asc' as const },
    select: {
      id: true,
      title: true,
      description: true,
      moduleId: true,
      orderIndex: true,
    },
  },
  assignments: {
    orderBy: [{ orderIndex: 'asc' as const }, { createdAt: 'asc' as const }],
    select: {
      id: true,
      title: true,
      prompt: true,
      dueDaysAfterEnroll: true,
      moduleId: true,
      lessonId: true,
      orderIndex: true,
    },
  },
} satisfies Prisma.CourseInclude;

type StudentCourse = Prisma.CourseGetPayload<{
  include: typeof studentCourseInclude;
}>;

type StudentCourseAccess = {
  course: StudentCourse;
  enrollment: {
    id: string;
    courseId: string;
    status: string;
    enrolledAt: Date;
    targetExamDate: string | null;
    examName: string | null;
  } | null;
};

type HomeworkStatus =
  | 'open'
  | 'dueSoon'
  | 'overdue'
  | 'submitted'
  | 'complete'
  | 'needsRevision';

function requireCurrentUser(context: AppContext) {
  if (!context.currentUser) {
    throw new Error401();
  }

  return context.currentUser;
}

function isPlatformAdmin(context: AppContext) {
  return platformAdminIsUserAllowed(context.currentUser?.email);
}

async function studentExperienceEnsureCourseAccess(
  courseId: string,
  context: AppContext,
): Promise<StudentCourseAccess> {
  const currentUser = requireCurrentUser(context);
  const course = await prisma.course.findUnique({
    where: { id: courseId },
    include: studentCourseInclude,
  });

  if (!course) {
    throw new Error404();
  }

  const enrollment = await prisma.courseEnrollment.findFirst({
    where: {
      courseId,
      userId: currentUser.id,
      status: 'active',
    },
    select: {
      id: true,
      courseId: true,
      status: true,
      enrolledAt: true,
      targetExamDate: true,
      examName: true,
    },
  });

  if (isPlatformAdmin(context)) {
    return { course, enrollment };
  }

  if (course.status !== 'published') {
    throw new Error404();
  }

  if (!enrollment) {
    throw new Error403();
  }

  return { course, enrollment };
}

export async function studentExperienceDashboardController(
  context: AppContext,
) {
  const currentUser = requireCurrentUser(context);
  const enrollments = await prisma.courseEnrollment.findMany({
    where: {
      userId: currentUser.id,
      status: 'active',
      course: { status: 'published' },
    },
    select: { courseId: true },
    orderBy: { enrolledAt: 'desc' },
    take: dashboardCourseTake,
  });

  const courseOverviews = await Promise.all(
    enrollments.map((enrollment) =>
      studentExperienceCourseOverviewPayload(enrollment.courseId, context),
    ),
  );
  const homework = courseOverviews
    .flatMap((item) => item.homework.items)
    .sort(homeworkSort)
    .slice(0, dashboardHomeworkTake);
  const notes = courseOverviews
    .flatMap((item) => item.notes.items)
    .sort(
      (a, b) =>
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
    )
    .slice(0, dashboardNotesTake);
  const studyPlan = courseOverviews
    .flatMap((item) => item.studyPlan.items)
    .sort(studyPlanSort)
    .slice(0, dashboardStudyPlanTake);
  const readinessScores = courseOverviews.map((item) => item.readiness.score);
  const readiness = {
    score: readinessScores.length
      ? Math.round(
          readinessScores.reduce((total, score) => total + score, 0) /
            readinessScores.length,
        )
      : 0,
    insufficientData:
      !readinessScores.length ||
      courseOverviews.some((item) => item.readiness.insufficientData),
  };
  const nextAction = studentExperienceNextAction(courseOverviews);
  const practiceAttempts = courseOverviews.flatMap(
    (item) => item.practice.recentAttempts,
  );
  const practiceScores = practiceAttempts
    .map((attempt) => attempt.scorePercent)
    .filter((score): score is number => score != null);

  return {
    summary: {
      enrolledCourses: courseOverviews.length,
      completedLessons: courseOverviews.reduce(
        (total, item) => total + item.progress.completedLessons,
        0,
      ),
      totalLessons: courseOverviews.reduce(
        (total, item) => total + item.progress.totalLessons,
        0,
      ),
      upcomingHomework: homework.filter((item) =>
        ['open', 'dueSoon'].includes(item.status),
      ).length,
      overdueHomework: homework.filter((item) => item.status === 'overdue')
        .length,
      notes: notes.length,
      studyPlanDueToday: studyPlan.filter((item) => item.isDueToday).length,
      averageReadiness: readiness.score,
    },
    readiness,
    nextAction,
    courses: courseOverviews.map((item) => item.courseCard),
    upcomingHomework: homework,
    practice: {
      availableQuestions: courseOverviews.reduce(
        (total, item) => total + item.practice.availableQuestions,
        0,
      ),
      recentAttempts: practiceAttempts.slice(0, 5),
      averageAccuracy: practiceScores.length
        ? Math.round(
            practiceScores.reduce((total, score) => total + score, 0) /
              practiceScores.length,
          )
        : null,
      weakAreas: Array.from(
        new Set(courseOverviews.flatMap((item) => item.practice.weakAreas)),
      ).slice(0, 5),
    },
    notes,
    studyPlan,
  };
}

export async function studentExperienceMasteryMapController(
  context: AppContext,
) {
  const currentUser = requireCurrentUser(context);
  const enrollments = await prisma.courseEnrollment.findMany({
    where: {
      userId: currentUser.id,
      status: 'active',
      course: { status: 'published' },
    },
    select: { courseId: true },
    orderBy: { enrolledAt: 'desc' },
    take: masteryMapCourseTake,
  });

  const courseOverviews = await Promise.all(
    enrollments.map((enrollment) =>
      studentExperienceCourseOverviewPayload(enrollment.courseId, context),
    ),
  );
  const courseIds = courseOverviews.map((overview) => overview.course.id);
  const trendStart = addDays(startOfToday(), -masteryMapTrendDays);
  const [snapshots, courses, certificates] = courseIds.length
    ? await Promise.all([
        prisma.$withRLS(
          { organization: context.currentOrganization ?? undefined },
          async (tx) =>
            await tx.courseReadinessSnapshot.findMany({
              where: {
                userId: currentUser.id,
                courseId: { in: courseIds },
                capturedOn: { gte: trendStart },
              },
              orderBy: [{ capturedOn: 'asc' }, { capturedAt: 'asc' }],
            }),
        ),
        prisma.course.findMany({
          where: { id: { in: courseIds } },
          select: {
            id: true,
            title: true,
            accessType: true,
            certificateEnabled: true,
            modules: {
              orderBy: { orderIndex: 'asc' },
              select: {
                id: true,
                title: true,
                description: true,
                orderIndex: true,
                lessons: {
                  orderBy: { orderIndex: 'asc' },
                  select: { id: true, title: true, orderIndex: true },
                },
              },
            },
            lessons: {
              orderBy: { orderIndex: 'asc' },
              select: {
                id: true,
                title: true,
                moduleId: true,
                orderIndex: true,
              },
            },
          },
        }),
        prisma.$withRLS(
          { organization: context.currentOrganization ?? undefined },
          async (tx) =>
            await tx.courseCertificate.findMany({
              where: { userId: currentUser.id, courseId: { in: courseIds } },
              select: {
                id: true,
                courseId: true,
                issuedAt: true,
                revokedAt: true,
                certificateNumber: true,
                verificationCode: true,
              },
            }),
        ),
      ])
    : [[], [], []];
  const trend = masteryMapReadinessTrend(
    snapshots,
    courseOverviews.map((overview) => overview.readiness.score),
  );
  const weakSkills = masteryMapWeakSkills(courseOverviews);
  const courseById = new Map(courses.map((course) => [course.id, course]));
  const modules = masteryMapModules(courses, courseOverviews);
  const certificatePayload = masteryMapCertificates({
    courses: courseOverviews,
    courseById,
    certificates,
  });
  const streaks = masteryMapStreaks(courseOverviews);
  const readinessScore = courseOverviews.length
    ? Math.round(
        courseOverviews.reduce(
          (total, overview) => total + overview.readiness.score,
          0,
        ) / courseOverviews.length,
      )
    : 0;
  const milestones = masteryMapMilestoneThresholds.map((milestone) => ({
    ...milestone,
    achieved: readinessScore >= milestone.threshold,
  }));
  const nextMilestone =
    milestones.find((milestone) => !milestone.achieved) ||
    milestones[milestones.length - 1];
  const hasSubscription = Boolean(context.currentSubscription);
  const paidCourseIds = courseOverviews
    .filter((overview) =>
      ['manual', 'paid', 'subscription'].includes(overview.course.accessType),
    )
    .map((overview) => overview.course.id);

  return {
    access: {
      mode: hasSubscription
        ? 'full'
        : paidCourseIds.length
          ? 'course'
          : 'preview',
      hasSubscription,
      fullCrossCourse: hasSubscription,
      premiumLocked: !hasSubscription,
      paidCourseIds,
    },
    summary: {
      enrolledCourses: courseOverviews.length,
      readinessScore,
      readinessDirection: trend.direction,
      readinessDelta: trend.delta,
      weakSkills: weakSkills.length,
      unlockedModules: modules.unlockedCount,
      totalModules: modules.totalCount,
      certificatesEarned: certificatePayload.earnedCount,
      certificatesAvailable: certificatePayload.availableCount,
      currentStreak: streaks.currentStreak,
      longestStreak: streaks.longestStreak,
      nextMilestone,
    },
    readinessTrend: trend,
    weakSkills,
    modules,
    certificates: certificatePayload,
    streaks,
    milestones,
    courses: courseOverviews.map((overview) => ({
      course: overview.course,
      progress: overview.progress,
      readiness: overview.readiness,
      nextLesson: overview.nextLesson,
      weakAreas: overview.practice.weakAreas,
    })),
  };
}

export async function studentExperienceCourseOverviewController(
  params: unknown,
  context: AppContext,
) {
  const data = studentExperienceCourseParamsSchema.parse(params);
  return await studentExperienceCourseOverviewPayload(data.courseId, context);
}

export async function studentExperienceHomeworkController(
  params: unknown,
  context: AppContext,
) {
  const data = studentExperienceCourseParamsSchema.parse(params);
  const overview = await studentExperienceCourseOverviewPayload(
    data.courseId,
    context,
  );
  return overview.homework;
}

export async function studentExperiencePracticeController(
  params: unknown,
  context: AppContext,
) {
  const data = studentExperienceCourseParamsSchema.parse(params);
  return await studentExperiencePracticePayload(data.courseId, context);
}

export async function studentExperiencePracticeStartController(
  params: unknown,
  body: unknown,
  context: AppContext,
) {
  const { courseId } = studentExperienceCourseParamsSchema.parse(params);
  const input = studentExperiencePracticeStartInputSchema.parse(body || {});
  const currentUser = requireCurrentUser(context);
  await studentExperienceEnsureCourseAccess(courseId, context);

  const activeAttempt = await prisma.coursePracticeAttempt.findFirst({
    where: { courseId, userId: currentUser.id, status: 'active' },
    orderBy: { startedAt: 'desc' },
    include: practiceAttemptInclude,
  });

  if (activeAttempt) {
    return {
      attempt: practiceAttemptPayload(activeAttempt),
    };
  }

  const questionCount = input.questionCount || defaultPracticeQuestionCount;
  const availableQuestions =
    await studentExperienceAvailableQuestions(courseId);
  const selectedQuestions = availableQuestions.slice(0, questionCount);

  if (!selectedQuestions.length) {
    throw new Error400(context.dictionary.studentExperience.errors.noPractice);
  }

  const attempt = await prisma.$transaction(async (tx) => {
    const createdAttempt = await tx.coursePracticeAttempt.create({
      data: {
        courseId,
        userId: currentUser.id,
        memberId: context.currentMember?.id || null,
        totalQuestions: selectedQuestions.length,
      },
    });

    await tx.coursePracticeAnswer.createMany({
      data: selectedQuestions.map((question) => ({
        attemptId: createdAttempt.id,
        practiceQuestionId: question.id,
      })),
    });

    return await tx.coursePracticeAttempt.findUniqueOrThrow({
      where: { id: createdAttempt.id },
      include: practiceAttemptInclude,
    });
  });

  await auditLogCreate({
    entityId: attempt.id,
    entityName: 'CoursePracticeAttempt',
    operation: auditLogOperations.create,
    context,
    newData: attempt,
  });

  return {
    attempt: practiceAttemptPayload(attempt),
  };
}

export async function studentExperiencePracticeAnswerController(
  params: unknown,
  body: unknown,
  context: AppContext,
) {
  const { attemptId } = studentExperienceAttemptParamsSchema.parse(params);
  const data = studentExperiencePracticeAnswerInputSchema.parse(body);
  const currentUser = requireCurrentUser(context);
  const attempt = await prisma.coursePracticeAttempt.findFirst({
    where: { id: attemptId, userId: currentUser.id },
    include: practiceAttemptInclude,
  });

  if (!attempt) {
    throw new Error404();
  }

  if (attempt.status !== 'active') {
    throw new Error400(
      context.dictionary.studentExperience.errors.practiceComplete,
    );
  }

  await studentExperienceEnsureCourseAccess(attempt.courseId, context);

  const answer = attempt.answers.find(
    (item) => item.practiceQuestionId === data.questionId,
  );

  if (!answer) {
    throw new Error404();
  }

  const answerOptions = answer.practiceQuestion.answerOptions || [];
  if (data.selectedAnswerIndex >= answerOptions.length) {
    throw new Error400(
      context.dictionary.studentExperience.errors.invalidAnswer,
    );
  }

  const updatedAnswer = await prisma.coursePracticeAnswer.update({
    where: {
      attemptId_practiceQuestionId: {
        attemptId,
        practiceQuestionId: data.questionId,
      },
    },
    data: {
      selectedAnswerIndex: data.selectedAnswerIndex,
      isCorrect:
        data.selectedAnswerIndex === answer.practiceQuestion.correctAnswerIndex,
      answeredAt: new Date(),
    },
    include: {
      practiceQuestion: {
        select: practiceQuestionSelect,
      },
    },
  });

  await auditLogCreate({
    entityId: updatedAnswer.id,
    entityName: 'CoursePracticeAnswer',
    operation: auditLogOperations.update,
    context,
    oldData: answer,
    newData: updatedAnswer,
  });

  return {
    answer: practiceQuestionAnswerPayload(updatedAnswer, true),
  };
}

export async function studentExperiencePracticeCompleteController(
  params: unknown,
  context: AppContext,
) {
  const { attemptId } = studentExperienceAttemptParamsSchema.parse(params);
  const currentUser = requireCurrentUser(context);
  const attempt = await prisma.coursePracticeAttempt.findFirst({
    where: { id: attemptId, userId: currentUser.id },
    include: practiceAttemptInclude,
  });

  if (!attempt) {
    throw new Error404();
  }

  await studentExperienceEnsureCourseAccess(attempt.courseId, context);

  if (attempt.status === 'completed') {
    return {
      attempt: practiceAttemptPayload(attempt, true),
    };
  }

  const totalQuestions = attempt.answers.length;
  const correctAnswers = attempt.answers.filter(
    (answer) => answer.isCorrect,
  ).length;
  const scorePercent = totalQuestions
    ? Math.round((correctAnswers / totalQuestions) * 100)
    : 0;

  const updatedAttempt = await prisma.coursePracticeAttempt.update({
    where: { id: attempt.id },
    data: {
      status: 'completed',
      completedAt: new Date(),
      totalQuestions,
      correctAnswers,
      scorePercent,
    },
    include: practiceAttemptInclude,
  });

  await auditLogCreate({
    entityId: updatedAttempt.id,
    entityName: 'CoursePracticeAttempt',
    operation: auditLogOperations.update,
    context,
    oldData: attempt,
    newData: updatedAttempt,
  });

  await studentExperienceTouchStreak(attempt.courseId, currentUser.id, context);
  await studentExperienceReadinessSnapshotCapture(attempt.courseId, context);

  return {
    attempt: practiceAttemptPayload(updatedAttempt, true),
  };
}

export async function studentExperienceNotesListController(
  params: unknown,
  context: AppContext,
) {
  const { courseId } = studentExperienceCourseParamsSchema.parse(params);
  const currentUser = requireCurrentUser(context);
  await studentExperienceEnsureCourseAccess(courseId, context);

  return {
    items: await prisma.courseStudentNote.findMany({
      where: { courseId, userId: currentUser.id },
      orderBy: { updatedAt: 'desc' },
      take: 50,
    }),
  };
}

export async function studentExperienceNoteCreateController(
  params: unknown,
  body: unknown,
  context: AppContext,
) {
  const { courseId } = studentExperienceCourseParamsSchema.parse(params);
  const data = studentExperienceNoteInputSchema.parse(body);
  const currentUser = requireCurrentUser(context);
  await studentExperienceEnsureCourseAccess(courseId, context);
  await studentExperienceValidateCourseLesson(courseId, data.lessonId);

  const note = await prisma.courseStudentNote.create({
    data: {
      courseId,
      userId: currentUser.id,
      memberId: context.currentMember?.id || null,
      lessonId: data.lessonId || null,
      title: data.title,
      content: data.content,
      tags: data.tags || [],
    },
  });

  await auditLogCreate({
    entityId: note.id,
    entityName: 'CourseStudentNote',
    operation: auditLogOperations.create,
    context,
    newData: note,
  });

  return { note };
}

export async function studentExperienceNoteUpdateController(
  params: unknown,
  body: unknown,
  context: AppContext,
) {
  const { courseId, noteId } = studentExperienceNoteParamsSchema.parse(params);
  const data = studentExperienceNoteUpdateInputSchema.parse(body);
  const currentUser = requireCurrentUser(context);
  await studentExperienceEnsureCourseAccess(courseId, context);
  await studentExperienceValidateCourseLesson(courseId, data.lessonId);

  const oldData = await prisma.courseStudentNote.findFirst({
    where: { id: noteId, courseId, userId: currentUser.id },
  });

  if (!oldData) {
    throw new Error404();
  }

  const note = await prisma.courseStudentNote.update({
    where: { id: noteId },
    data: {
      lessonId: data.lessonId,
      title: data.title,
      content: data.content,
      tags: data.tags,
    },
  });

  await auditLogCreate({
    entityId: note.id,
    entityName: 'CourseStudentNote',
    operation: auditLogOperations.update,
    context,
    oldData,
    newData: note,
  });

  return { note };
}

export async function studentExperienceNoteDeleteController(
  params: unknown,
  context: AppContext,
) {
  const { courseId, noteId } = studentExperienceNoteParamsSchema.parse(params);
  const currentUser = requireCurrentUser(context);
  await studentExperienceEnsureCourseAccess(courseId, context);
  const oldData = await prisma.courseStudentNote.findFirst({
    where: { id: noteId, courseId, userId: currentUser.id },
  });

  if (!oldData) {
    throw new Error404();
  }

  await prisma.courseStudentNote.delete({ where: { id: noteId } });

  await auditLogCreate({
    entityId: noteId,
    entityName: 'CourseStudentNote',
    operation: auditLogOperations.delete,
    context,
    oldData,
  });

  return { id: noteId };
}

export async function studentExperienceStudyPlanListController(
  params: unknown,
  context: AppContext,
) {
  const { courseId } = studentExperienceCourseParamsSchema.parse(params);
  const currentUser = requireCurrentUser(context);
  const overview = await studentExperienceCourseOverviewPayload(
    courseId,
    context,
  );

  return {
    items: await prisma.courseStudyPlanItem.findMany({
      where: { courseId, userId: currentUser.id },
      orderBy: [{ plannedForDate: 'asc' }, { createdAt: 'desc' }],
      take: 100,
    }),
    suggestions: overview.studyPlan.suggestions,
  };
}

export async function studentExperienceStudyPlanCreateController(
  params: unknown,
  body: unknown,
  context: AppContext,
) {
  const { courseId } = studentExperienceCourseParamsSchema.parse(params);
  const data = studentExperienceStudyPlanInputSchema.parse(body);
  const currentUser = requireCurrentUser(context);
  await studentExperienceEnsureCourseAccess(courseId, context);

  const item = await prisma.courseStudyPlanItem.create({
    data: {
      courseId,
      userId: currentUser.id,
      memberId: context.currentMember?.id || null,
      title: data.title,
      description: data.description || null,
      plannedForDate: data.plannedForDate || null,
      status: data.status,
      completedAt: data.status === 'complete' ? new Date() : null,
    },
  });

  await auditLogCreate({
    entityId: item.id,
    entityName: 'CourseStudyPlanItem',
    operation: auditLogOperations.create,
    context,
    newData: item,
  });

  return { item };
}

export async function studentExperienceAdaptivePlanGenerateController(
  params: unknown,
  body: unknown,
  context: AppContext,
) {
  const { courseId } = studentExperienceCourseParamsSchema.parse(params);
  const input = studentExperienceAdaptivePlanGenerateInputSchema.parse(
    body || {},
  );
  const currentUser = requireCurrentUser(context);
  const overview = await studentExperienceCourseOverviewPayload(
    courseId,
    context,
  );

  if (!overview.enrollment) {
    throw new Error403();
  }

  const oldEnrollment = await prisma.courseEnrollment.findFirst({
    where: { id: overview.enrollment.id, userId: currentUser.id },
  });

  if (!oldEnrollment) {
    throw new Error404();
  }

  const t = context.dictionary.studentExperience.adaptivePlan;
  const targetExamDate = input.targetExamDate || null;
  const examName = input.examName?.trim() || null;
  const generatedItems = adaptivePlanBuildItems({
    overview,
    targetExamDate,
    dictionary: context.dictionary,
  });

  const existingItems = await prisma.courseStudyPlanItem.findMany({
    where: {
      courseId,
      userId: currentUser.id,
      source: 'adaptive',
      status: { not: 'complete' },
    },
    select: {
      title: true,
    },
  });
  const existingTitles = new Set(existingItems.map((item) => item.title));
  const itemsToCreate = generatedItems.filter(
    (item) => !existingTitles.has(item.title),
  );

  const { enrollment, items } = await prisma.$transaction(async (tx) => {
    const updatedEnrollment = await tx.courseEnrollment.update({
      where: { id: overview.enrollment!.id },
      data: {
        targetExamDate,
        examName,
      },
    });

    const createdItems = [];
    for (const item of itemsToCreate) {
      createdItems.push(
        await tx.courseStudyPlanItem.create({
          data: {
            courseId,
            userId: currentUser.id,
            memberId: context.currentMember?.id || null,
            title: item.title,
            description: item.description,
            plannedForDate: item.plannedForDate,
            status: 'todo',
            source: 'adaptive',
          },
        }),
      );
    }

    return {
      enrollment: updatedEnrollment,
      items: createdItems,
    };
  });

  await auditLogCreate({
    entityId: enrollment.id,
    entityName: 'CourseEnrollment',
    operation: auditLogOperations.update,
    context,
    oldData: oldEnrollment,
    newData: enrollment,
  });

  for (const item of items) {
    await auditLogCreate({
      entityId: item.id,
      entityName: 'CourseStudyPlanItem',
      operation: auditLogOperations.create,
      context,
      newData: item,
    });
  }
  await studentExperienceReadinessSnapshotCapture(courseId, context);

  return {
    enrollment,
    items,
    message: dictionaryFormat(t.itemsCreated, items.length),
  };
}

export async function studentExperienceLearningOutcomesController(
  params: unknown,
  context: AppContext,
) {
  const { courseId } = studentExperienceCourseParamsSchema.parse(params);
  const overview = await studentExperienceCourseOverviewPayload(
    courseId,
    context,
  );

  return overview.learningOutcomes;
}

export async function studentExperienceResumeController(
  params: unknown,
  context: AppContext,
) {
  const { courseId } = studentExperienceCourseParamsSchema.parse(params);
  const currentUser = requireCurrentUser(context);
  await studentExperienceEnsureCourseAccess(courseId, context);

  const resume = await prisma.courseLearningSession.findUnique({
    where: {
      courseId_userId: {
        courseId,
        userId: currentUser.id,
      },
    },
  });

  return { resume: resume ? courseLearningResumePayload(resume) : null };
}

export async function studentExperienceResumeUpdateController(
  params: unknown,
  body: unknown,
  context: AppContext,
) {
  const { courseId } = studentExperienceCourseParamsSchema.parse(params);
  const data = studentExperienceResumeInputSchema.parse(body || {});
  const currentUser = requireCurrentUser(context);
  await studentExperienceEnsureCourseAccess(courseId, context);
  await studentExperienceValidateCourseLesson(courseId, data.lessonId);

  if (data.practiceAttemptId) {
    const attempt = await prisma.coursePracticeAttempt.findFirst({
      where: {
        id: data.practiceAttemptId,
        courseId,
        userId: currentUser.id,
      },
      select: { id: true },
    });

    if (!attempt) {
      throw new Error404();
    }
  }

  const existing = await prisma.courseLearningSession.findUnique({
    where: {
      courseId_userId: {
        courseId,
        userId: currentUser.id,
      },
    },
  });
  const resume = await prisma.courseLearningSession.upsert({
    where: {
      courseId_userId: {
        courseId,
        userId: currentUser.id,
      },
    },
    create: {
      courseId,
      userId: currentUser.id,
      memberId: context.currentMember?.id || null,
      lessonId: data.lessonId || null,
      practiceAttemptId: data.practiceAttemptId || null,
      lastRoute: data.lastRoute || null,
      lastPositionSeconds: data.lastPositionSeconds ?? null,
      lastScrollPercent: data.lastScrollPercent ?? null,
      lastActivityAt: new Date(),
      deviceType: data.deviceType || null,
      metadata: (data.metadata || {}) as Prisma.InputJsonValue,
    },
    update: {
      lessonId: data.lessonId,
      practiceAttemptId: data.practiceAttemptId,
      lastRoute: data.lastRoute,
      lastPositionSeconds: data.lastPositionSeconds,
      lastScrollPercent: data.lastScrollPercent,
      lastActivityAt: new Date(),
      deviceType: data.deviceType,
      metadata:
        data.metadata == null
          ? undefined
          : (data.metadata as Prisma.InputJsonValue),
    },
  });

  await auditLogCreate({
    entityId: resume.id,
    entityName: 'CourseLearningSession',
    operation: existing ? auditLogOperations.update : auditLogOperations.create,
    context,
    oldData: existing,
    newData: resume,
  });

  return { resume: courseLearningResumePayload(resume) };
}

export async function studentExperienceOfflineSyncController(
  body: unknown,
  context: AppContext,
) {
  const data = studentExperienceSyncInputSchema.parse(body || {});
  const results = [];

  for (const mutation of data.mutations) {
    try {
      if (mutation.type === 'lessonComplete') {
        results.push({
          id: mutation.id,
          status: 'synced',
          result: await studentExperienceSyncLessonComplete(mutation, context),
        });
      } else if (mutation.type === 'noteCreate') {
        results.push({
          id: mutation.id,
          status: 'synced',
          result: await studentExperienceNoteCreateController(
            { courseId: mutation.courseId },
            mutation,
            context,
          ),
        });
      } else if (mutation.type === 'practiceAnswer') {
        results.push({
          id: mutation.id,
          status: 'synced',
          result: await studentExperiencePracticeAnswerController(
            { attemptId: mutation.attemptId },
            {
              questionId: mutation.questionId,
              selectedAnswerIndex: mutation.selectedAnswerIndex,
            },
            context,
          ),
        });
      } else if (mutation.type === 'studyPlanUpdate') {
        results.push({
          id: mutation.id,
          status: 'synced',
          result: await studentExperienceStudyPlanUpdateController(
            { courseId: mutation.courseId, itemId: mutation.itemId },
            { status: mutation.status },
            context,
          ),
        });
      } else if (mutation.type === 'resumeUpdate') {
        results.push({
          id: mutation.id,
          status: 'synced',
          result: await studentExperienceResumeUpdateController(
            { courseId: mutation.courseId },
            mutation.resume,
            context,
          ),
        });
      }
    } catch (error) {
      results.push({
        id: mutation.id,
        status: 'failed',
        error:
          error instanceof Error
            ? error.message
            : context.dictionary.studentExperience.mobile.syncFailed,
      });
    }
  }

  return { results };
}

async function studentExperienceSyncLessonComplete(
  mutation: { courseId: string; lessonId: string },
  context: AppContext,
) {
  const currentUser = requireCurrentUser(context);
  await studentExperienceEnsureCourseAccess(mutation.courseId, context);
  const lesson = await prisma.courseLesson.findFirst({
    where: { id: mutation.lessonId, courseId: mutation.courseId },
  });

  if (!lesson) {
    throw new Error404();
  }

  const existing = await prisma.courseLessonProgress.findUnique({
    where: {
      lessonId_userId: {
        lessonId: mutation.lessonId,
        userId: currentUser.id,
      },
    },
  });
  const progress = await prisma.courseLessonProgress.upsert({
    where: {
      lessonId_userId: {
        lessonId: mutation.lessonId,
        userId: currentUser.id,
      },
    },
    create: {
      courseId: mutation.courseId,
      lessonId: mutation.lessonId,
      userId: currentUser.id,
    },
    update: {
      completedAt: new Date(),
    },
  });

  await auditLogCreate({
    entityId: progress.id,
    entityName: 'CourseLessonProgress',
    operation: existing ? auditLogOperations.update : auditLogOperations.create,
    context,
    oldData: existing,
    newData: progress,
  });

  await studentExperienceTouchStreak(
    mutation.courseId,
    currentUser.id,
    context,
  );
  await studentExperienceReadinessSnapshotCapture(mutation.courseId, context);

  return { progress };
}

export async function studentReminderPreferenceListController(
  context: AppContext,
) {
  const currentUser = requireCurrentUser(context);

  const preferences = await prisma.studentReminderPreference.findMany({
    where: { userId: currentUser.id },
    orderBy: [{ courseId: 'asc' }, { createdAt: 'asc' }],
  });

  return { preferences };
}

export async function studentReminderPreferenceUpsertController(
  body: unknown,
  context: AppContext,
) {
  const data = studentReminderPreferenceInputSchema.parse(body || {});
  const currentUser = requireCurrentUser(context);

  if (data.courseId) {
    await studentExperienceEnsureCourseAccess(data.courseId, context);
  }

  const existing = await prisma.studentReminderPreference.findFirst({
    where: {
      userId: currentUser.id,
      courseId: data.courseId || null,
    },
  });
  const preference = existing
    ? await prisma.studentReminderPreference.update({
        where: { id: existing.id },
        data: {
          enabled: data.enabled,
          quietHoursStart: data.quietHoursStart || null,
          quietHoursEnd: data.quietHoursEnd || null,
          timezone: data.timezone,
          channels: data.channels,
          smartRemindersEnabled: data.smartRemindersEnabled,
        },
      })
    : await prisma.studentReminderPreference.create({
        data: {
          userId: currentUser.id,
          courseId: data.courseId || null,
          enabled: data.enabled,
          quietHoursStart: data.quietHoursStart || null,
          quietHoursEnd: data.quietHoursEnd || null,
          timezone: data.timezone,
          channels: data.channels,
          smartRemindersEnabled: data.smartRemindersEnabled,
        },
      });

  await auditLogCreate({
    entityId: preference.id,
    entityName: 'StudentReminderPreference',
    operation: existing ? auditLogOperations.update : auditLogOperations.create,
    context,
    oldData: existing,
    newData: preference,
  });

  return { preference };
}

export async function studentExperienceDiagnosticStartController(
  params: unknown,
  body: unknown,
  context: AppContext,
) {
  const { courseId } = studentExperienceCourseParamsSchema.parse(params);
  const input = studentExperienceDiagnosticStartInputSchema.parse(body || {});
  const currentUser = requireCurrentUser(context);
  await studentExperienceEnsureCourseAccess(courseId, context);

  const activeAttempt = await prisma.courseDiagnosticAttempt.findFirst({
    where: { courseId, userId: currentUser.id, status: 'active' },
    orderBy: { startedAt: 'desc' },
    include: diagnosticAttemptInclude,
  });

  if (activeAttempt) {
    return {
      attempt: diagnosticAttemptPayload(activeAttempt),
    };
  }

  const questionCount = input.questionCount || defaultDiagnosticQuestionCount;
  const candidates = await studentExperienceDiagnosticQuestionCandidates(
    courseId,
    currentUser.id,
  );
  const selectedQuestions = candidates.slice(0, questionCount);

  if (!selectedQuestions.length) {
    throw new Error400(context.dictionary.studentExperience.errors.noPractice);
  }

  const attempt = await prisma.$transaction(async (tx) => {
    const createdAttempt = await tx.courseDiagnosticAttempt.create({
      data: {
        courseId,
        userId: currentUser.id,
        memberId: context.currentMember?.id || null,
        totalQuestions: selectedQuestions.length,
      },
    });

    for (const question of selectedQuestions) {
      await tx.courseDiagnosticAnswer.create({
        data: {
          attemptId: createdAttempt.id,
          userId: currentUser.id,
          source: question.source,
          sourceQuestionId: question.sourceQuestionId,
          questionText: question.questionText,
          answerOptions:
            question.answerOptions as unknown as Prisma.InputJsonValue,
          correctAnswerIndex: question.correctAnswerIndex,
          explanation: question.explanation,
          difficulty: question.difficulty,
          domain: question.domain,
        },
      });
    }

    return await tx.courseDiagnosticAttempt.findUniqueOrThrow({
      where: { id: createdAttempt.id },
      include: diagnosticAttemptInclude,
    });
  });

  await auditLogCreate({
    entityId: attempt.id,
    entityName: 'CourseDiagnosticAttempt',
    operation: auditLogOperations.create,
    context,
    newData: attempt,
  });

  for (const answer of attempt.answers) {
    await auditLogCreate({
      entityId: answer.id,
      entityName: 'CourseDiagnosticAnswer',
      operation: auditLogOperations.create,
      context,
      newData: answer,
    });
  }

  return {
    attempt: diagnosticAttemptPayload(attempt),
  };
}

export async function studentExperienceDiagnosticAnswerController(
  params: unknown,
  body: unknown,
  context: AppContext,
) {
  const { courseId, attemptId } =
    studentExperienceDiagnosticAttemptParamsSchema.parse(params);
  const data = studentExperienceDiagnosticAnswerInputSchema.parse(body);
  const currentUser = requireCurrentUser(context);
  const attempt = await prisma.courseDiagnosticAttempt.findFirst({
    where: { id: attemptId, courseId, userId: currentUser.id },
    include: diagnosticAttemptInclude,
  });

  if (!attempt) {
    throw new Error404();
  }

  if (attempt.status !== 'active') {
    throw new Error400(
      context.dictionary.studentExperience.errors.practiceComplete,
    );
  }

  await studentExperienceEnsureCourseAccess(courseId, context);

  const answer = attempt.answers.find((item) => item.id === data.answerId);
  if (!answer) {
    throw new Error404();
  }

  const answerOptions = jsonStringArray(answer.answerOptions);
  if (data.selectedAnswerIndex >= answerOptions.length) {
    throw new Error400(
      context.dictionary.studentExperience.errors.invalidAnswer,
    );
  }

  const updatedAnswer = await prisma.courseDiagnosticAnswer.update({
    where: { id: answer.id },
    data: {
      selectedAnswerIndex: data.selectedAnswerIndex,
      isCorrect: data.selectedAnswerIndex === answer.correctAnswerIndex,
      answeredAt: new Date(),
    },
  });

  await auditLogCreate({
    entityId: updatedAnswer.id,
    entityName: 'CourseDiagnosticAnswer',
    operation: auditLogOperations.update,
    context,
    oldData: answer,
    newData: updatedAnswer,
  });

  return {
    answer: diagnosticAnswerPayload(updatedAnswer, true),
  };
}

export async function studentExperienceDiagnosticCompleteController(
  params: unknown,
  context: AppContext,
) {
  const { courseId, attemptId } =
    studentExperienceDiagnosticAttemptParamsSchema.parse(params);
  const currentUser = requireCurrentUser(context);
  const attempt = await prisma.courseDiagnosticAttempt.findFirst({
    where: { id: attemptId, courseId, userId: currentUser.id },
    include: diagnosticAttemptInclude,
  });

  if (!attempt) {
    throw new Error404();
  }

  await studentExperienceEnsureCourseAccess(courseId, context);

  if (attempt.status === 'completed') {
    return {
      attempt: diagnosticAttemptPayload(attempt, true),
    };
  }

  if (attempt.answers.some((answer) => answer.selectedAnswerIndex == null)) {
    throw new Error400(
      context.dictionary.studentExperience.errors.diagnosticIncomplete,
    );
  }

  const domainScores = diagnosticDomainScores(attempt.answers);
  const totalQuestions = attempt.answers.length;
  const correctAnswers = attempt.answers.filter(
    (answer) => answer.isCorrect,
  ).length;
  const scorePercent = totalQuestions
    ? Math.round((correctAnswers / totalQuestions) * 100)
    : 0;

  const updatedAttempt = await prisma.courseDiagnosticAttempt.update({
    where: { id: attempt.id },
    data: {
      status: 'completed',
      completedAt: new Date(),
      totalQuestions,
      correctAnswers,
      scorePercent,
      domainScores: domainScores as unknown as Prisma.InputJsonValue,
    },
    include: diagnosticAttemptInclude,
  });

  await auditLogCreate({
    entityId: updatedAttempt.id,
    entityName: 'CourseDiagnosticAttempt',
    operation: auditLogOperations.update,
    context,
    oldData: attempt,
    newData: updatedAttempt,
  });

  await studentExperienceUpdateMasteryFromDomainScores({
    courseId,
    userId: currentUser.id,
    domainScores,
    context,
  });
  await studentExperienceTouchStreak(courseId, currentUser.id, context);
  await studentExperienceReadinessSnapshotCapture(courseId, context);

  return {
    attempt: diagnosticAttemptPayload(updatedAttempt, true),
  };
}

export async function studentExperienceFlashcardReviewController(
  params: unknown,
  body: unknown,
  context: AppContext,
) {
  const { courseId, flashcardId } =
    studentExperienceFlashcardReviewParamsSchema.parse(params);
  const data = studentExperienceFlashcardReviewInputSchema.parse(body);
  const currentUser = requireCurrentUser(context);
  await studentExperienceEnsureCourseAccess(courseId, context);

  const flashcard = await prisma.courseFlashcard.findFirst({
    where: { id: flashcardId, flashcardSet: { courseId } },
    select: { id: true },
  });

  if (!flashcard) {
    throw new Error404();
  }

  const existing = await prisma.courseFlashcardReview.findUnique({
    where: {
      userId_flashcardId: {
        userId: currentUser.id,
        flashcardId,
      },
    },
  });
  const schedule = flashcardReviewSchedule(existing, data.rating);
  const review = await prisma.courseFlashcardReview.upsert({
    where: {
      userId_flashcardId: {
        userId: currentUser.id,
        flashcardId,
      },
    },
    create: {
      courseId,
      userId: currentUser.id,
      flashcardId,
      ...schedule,
      lastRating: data.rating,
      lastReviewedAt: new Date(),
    },
    update: {
      ...schedule,
      lastRating: data.rating,
      lastReviewedAt: new Date(),
    },
  });

  await auditLogCreate({
    entityId: review.id,
    entityName: 'CourseFlashcardReview',
    operation: existing ? auditLogOperations.update : auditLogOperations.create,
    context,
    oldData: existing,
    newData: review,
  });

  await studentExperienceTouchStreak(courseId, currentUser.id, context);

  return {
    review: flashcardReviewPayload(review),
  };
}

export async function studentExperienceRemediationGenerateController(
  params: unknown,
  body: unknown,
  context: AppContext,
) {
  const { courseId } = studentExperienceCourseParamsSchema.parse(params);
  const input = studentExperienceRemediationGenerateInputSchema.parse(
    body || {},
  );
  const currentUser = requireCurrentUser(context);
  const overview = await studentExperienceCourseOverviewPayload(
    courseId,
    context,
  );
  const domain =
    input.domain?.trim() ||
    overview.learningOutcomes.remediation.weakDomains[0] ||
    overview.learningOutcomes.mastery.domains[0]?.domain ||
    learningOutcomesGeneralDomain;
  const t = context.dictionary.studentExperience.learningOutcomes.remediation;
  const dates = adaptivePlanDates(
    overview.enrollment?.targetExamDate || null,
    3,
  );
  const planItems = [
    {
      title: dictionaryFormat(t.itemTitles.review, domain),
      description: dictionaryFormat(t.itemDescriptions.review, domain),
      plannedForDate: dates[0],
    },
    {
      title: dictionaryFormat(t.itemTitles.practice, domain),
      description: dictionaryFormat(t.itemDescriptions.practice, domain),
      plannedForDate: dates[1],
    },
    {
      title: dictionaryFormat(t.itemTitles.recall, domain),
      description: dictionaryFormat(t.itemDescriptions.recall, domain),
      plannedForDate: dates[2],
    },
  ];

  const { plan, items } = await prisma.$transaction(async (tx) => {
    const createdPlan = await tx.courseRemediationPlan.create({
      data: {
        courseId,
        userId: currentUser.id,
        memberId: context.currentMember?.id || null,
        domain,
        title: dictionaryFormat(t.planTitle, domain),
        description: dictionaryFormat(t.planDescription, domain),
        items: planItems as unknown as Prisma.InputJsonValue,
      },
    });

    const createdItems = [];
    for (const item of planItems) {
      createdItems.push(
        await tx.courseStudyPlanItem.create({
          data: {
            courseId,
            userId: currentUser.id,
            memberId: context.currentMember?.id || null,
            title: item.title,
            description: item.description,
            plannedForDate: item.plannedForDate,
            status: 'todo',
            source: 'remediation',
          },
        }),
      );
    }

    return { plan: createdPlan, items: createdItems };
  });

  await auditLogCreate({
    entityId: plan.id,
    entityName: 'CourseRemediationPlan',
    operation: auditLogOperations.create,
    context,
    newData: plan,
  });

  for (const item of items) {
    await auditLogCreate({
      entityId: item.id,
      entityName: 'CourseStudyPlanItem',
      operation: auditLogOperations.create,
      context,
      newData: item,
    });
  }
  await studentExperienceReadinessSnapshotCapture(courseId, context);

  return {
    plan: remediationPlanPayload(plan),
    items: items.map(studyPlanItemPayload),
    message: dictionaryFormat(t.itemsCreated, items.length),
  };
}

export async function studentExperienceStudyPlanUpdateController(
  params: unknown,
  body: unknown,
  context: AppContext,
) {
  const { courseId, itemId } =
    studentExperienceStudyPlanParamsSchema.parse(params);
  const data = studentExperienceStudyPlanUpdateInputSchema.parse(body);
  const currentUser = requireCurrentUser(context);
  await studentExperienceEnsureCourseAccess(courseId, context);

  const oldData = await prisma.courseStudyPlanItem.findFirst({
    where: { id: itemId, courseId, userId: currentUser.id },
  });

  if (!oldData) {
    throw new Error404();
  }

  const item = await prisma.courseStudyPlanItem.update({
    where: { id: itemId },
    data: {
      title: data.title,
      description: data.description,
      plannedForDate: data.plannedForDate,
      status: data.status,
      completedAt:
        data.status === 'complete'
          ? oldData.completedAt || new Date()
          : data.status === 'todo'
            ? null
            : undefined,
    },
  });

  await auditLogCreate({
    entityId: item.id,
    entityName: 'CourseStudyPlanItem',
    operation: auditLogOperations.update,
    context,
    oldData,
    newData: item,
  });

  if (item.status === 'complete') {
    await studentExperienceTouchStreak(courseId, currentUser.id, context);
    await studentExperienceReadinessSnapshotCapture(courseId, context);
  }

  return { item };
}

export async function studentExperienceReadinessSnapshotCapture(
  courseId: string,
  context: AppContext,
) {
  const currentUser = requireCurrentUser(context);
  const overview = await studentExperienceCourseOverviewPayload(
    courseId,
    context,
  );
  const capturedOn = startOfToday();
  const now = new Date();
  const { oldData, snapshot } = await prisma.$withRLS(
    { organization: context.currentOrganization ?? undefined },
    async (tx) => {
      const existing = await tx.courseReadinessSnapshot.findUnique({
        where: {
          courseId_userId_capturedOn: {
            courseId,
            userId: currentUser.id,
            capturedOn,
          },
        },
      });
      const saved = await tx.courseReadinessSnapshot.upsert({
        where: {
          courseId_userId_capturedOn: {
            courseId,
            userId: currentUser.id,
            capturedOn,
          },
        },
        create: {
          courseId,
          userId: currentUser.id,
          score: overview.readiness.score,
          insufficientData: overview.readiness.insufficientData,
          signals: overview.readiness
            .signals as unknown as Prisma.InputJsonValue,
          capturedOn,
          capturedAt: now,
        },
        update: {
          score: overview.readiness.score,
          insufficientData: overview.readiness.insufficientData,
          signals: overview.readiness
            .signals as unknown as Prisma.InputJsonValue,
          capturedAt: now,
        },
      });

      return { oldData: existing, snapshot: saved };
    },
  );

  await auditLogCreate({
    entityId: snapshot.id,
    entityName: 'CourseReadinessSnapshot',
    operation: oldData ? auditLogOperations.update : auditLogOperations.create,
    context,
    oldData,
    newData: snapshot,
  });

  return snapshot;
}

export async function studentExperienceStudyPlanDeleteController(
  params: unknown,
  context: AppContext,
) {
  const { courseId, itemId } =
    studentExperienceStudyPlanParamsSchema.parse(params);
  const currentUser = requireCurrentUser(context);
  await studentExperienceEnsureCourseAccess(courseId, context);
  const oldData = await prisma.courseStudyPlanItem.findFirst({
    where: { id: itemId, courseId, userId: currentUser.id },
  });

  if (!oldData) {
    throw new Error404();
  }

  await prisma.courseStudyPlanItem.delete({ where: { id: itemId } });

  await auditLogCreate({
    entityId: itemId,
    entityName: 'CourseStudyPlanItem',
    operation: auditLogOperations.delete,
    context,
    oldData,
  });

  return { id: itemId };
}

async function studentExperienceCourseOverviewPayload(
  courseId: string,
  context: AppContext,
) {
  const currentUser = requireCurrentUser(context);
  const { course, enrollment } = await studentExperienceEnsureCourseAccess(
    courseId,
    context,
  );
  const enrollmentDate =
    enrollment?.enrolledAt || course.publishedAt || course.createdAt;
  const [
    progress,
    submissions,
    practiceAttempts,
    notes,
    studyPlanItems,
    availableQuestions,
    examInstances,
    resume,
  ] = await Promise.all([
    prisma.courseLessonProgress.findMany({
      where: { courseId, userId: currentUser.id },
      orderBy: { completedAt: 'desc' },
    }),
    prisma.courseAssignmentSubmission.findMany({
      where: { courseId, userId: currentUser.id },
      orderBy: { submittedAt: 'desc' },
    }),
    prisma.coursePracticeAttempt.findMany({
      where: { courseId, userId: currentUser.id },
      orderBy: { startedAt: 'desc' },
      take: 10,
    }),
    prisma.courseStudentNote.findMany({
      where: { courseId, userId: currentUser.id },
      orderBy: { updatedAt: 'desc' },
      take: 20,
    }),
    prisma.courseStudyPlanItem.findMany({
      where: { courseId, userId: currentUser.id },
      orderBy: [{ plannedForDate: 'asc' }, { createdAt: 'desc' }],
      take: 50,
    }),
    studentExperienceAvailableQuestions(courseId),
    context.currentMember?.id
      ? prisma.examInstance.findMany({
          where: {
            courseId,
            studentId: context.currentMember.id,
            score: { not: null },
            archivedAt: null,
          },
          select: { id: true, score: true, completedAt: true, status: true },
          orderBy: { completedAt: 'desc' },
          take: 10,
        })
      : Promise.resolve([]),
    prisma.courseLearningSession.findUnique({
      where: {
        courseId_userId: {
          courseId,
          userId: currentUser.id,
        },
      },
    }),
  ]);
  const completedLessonIds = new Set(progress.map((item) => item.lessonId));
  const totalLessons = course.lessons.length;
  const completedLessons = completedLessonIds.size;
  const progressPercent = totalLessons
    ? Math.round((completedLessons / totalLessons) * 100)
    : 0;
  const nextLesson =
    course.lessons.find((lesson) => !completedLessonIds.has(lesson.id)) || null;
  const homeworkItems = course.assignments.map((assignment) =>
    homeworkItemPayload({
      course,
      assignment,
      enrollmentDate,
      submission: submissions.find(
        (item) => item.assignmentId === assignment.id,
      ),
      attemptCount: submissions.filter(
        (item) => item.assignmentId === assignment.id,
      ).length,
    }),
  );
  const completedAttempts = practiceAttempts.filter(
    (attempt) => attempt.status === 'completed' && attempt.scorePercent != null,
  );
  const practiceScore = average(
    completedAttempts.map((attempt) => attempt.scorePercent),
  );
  const examScore = average(
    examInstances.map((item) =>
      item.score == null ? null : Number(item.score),
    ),
  );
  const readiness = readinessPayload({
    progressPercent,
    homeworkItems,
    practiceScore,
    examScore,
    recentActivityScore: recentActivityScore({
      enrollmentDate,
      progress,
      submissions,
      practiceAttempts,
      notes,
      studyPlanItems,
    }),
  });
  const homeworkSummary = homeworkSummaryPayload(homeworkItems);
  const suggestions = studyPlanSuggestions({
    course,
    homeworkItems,
    nextLesson,
    availableQuestions: availableQuestions.length,
  });
  const weakAreas = await studentExperienceWeakAreas(courseId, currentUser.id);
  const learningOutcomes = await studentExperienceLearningOutcomesPayload({
    courseId,
    userId: currentUser.id,
    course,
    studyPlanItems,
    weakAreas,
  });

  return {
    course: coursePayload(course),
    enrollment,
    courseCard: {
      course: coursePayload(course),
      enrollment,
      progress: {
        completedLessons,
        totalLessons,
        percent: progressPercent,
      },
      homework: homeworkSummary,
      practice: {
        availableQuestions: availableQuestions.length,
        completedAttempts: completedAttempts.length,
        averageAccuracy: practiceScore,
        lastScore: completedAttempts[0]?.scorePercent ?? null,
      },
      notes: { count: notes.length },
      studyPlan: {
        openItems: studyPlanItems.filter((item) => item.status !== 'complete')
          .length,
        dueToday: studyPlanItems.filter((item) =>
          isDateToday(item.plannedForDate),
        ).length,
      },
      readiness,
      nextLesson: nextLesson
        ? {
            id: nextLesson.id,
            title: nextLesson.title,
            moduleId: nextLesson.moduleId,
          }
        : null,
    },
    progress: {
      completedLessons,
      totalLessons,
      percent: progressPercent,
      completedLessonIds: Array.from(completedLessonIds),
    },
    nextLesson,
    homework: {
      items: homeworkItems.sort(homeworkSort),
      summary: homeworkSummary,
    },
    practice: {
      availableQuestions: availableQuestions.length,
      recentAttempts: practiceAttempts.map(practiceAttemptSummaryPayload),
      averageAccuracy: practiceScore,
      weakAreas,
    },
    notes: {
      items: notes,
      count: notes.length,
    },
    studyPlan: {
      items: studyPlanItems.map(studyPlanItemPayload),
      suggestions,
    },
    resume: resume ? courseLearningResumePayload(resume) : null,
    readiness,
    learningOutcomes,
  };
}

function courseLearningResumePayload(
  resume: Prisma.CourseLearningSessionGetPayload<Record<string, never>>,
) {
  return {
    id: resume.id,
    courseId: resume.courseId,
    lessonId: resume.lessonId,
    practiceAttemptId: resume.practiceAttemptId,
    lastRoute: resume.lastRoute,
    lastPositionSeconds: resume.lastPositionSeconds,
    lastScrollPercent: resume.lastScrollPercent,
    lastActivityAt: resume.lastActivityAt,
    deviceType: resume.deviceType,
    metadata: resume.metadata,
    updatedAt: resume.updatedAt,
  };
}

function coursePayload(course: StudentCourse) {
  return {
    id: course.id,
    title: course.title,
    slug: course.slug,
    subtitle: course.subtitle,
    description: course.description,
    category: course.category,
    examType: course.examType,
    thumbnail: course.thumbnail,
    nexVerified: course.nexVerified,
    accessType: course.accessType,
    priceCents: course.priceCents,
    currency: course.currency,
  };
}

type StudentExperienceCourseOverviewPayload = Awaited<
  ReturnType<typeof studentExperienceCourseOverviewPayload>
>;

type MasteryMapCourseRecord = {
  id: string;
  title: string;
  accessType: string;
  certificateEnabled: boolean;
  modules: Array<{
    id: string;
    title: string;
    description: string | null;
    orderIndex: number;
    lessons: Array<{ id: string; title: string; orderIndex: number }>;
  }>;
  lessons: Array<{
    id: string;
    title: string;
    moduleId: string | null;
    orderIndex: number;
  }>;
};

type MasteryMapCertificateRow = {
  id: string;
  courseId: string;
  issuedAt: Date;
  revokedAt: Date | null;
  certificateNumber: string;
  verificationCode: string;
};

function masteryMapReadinessTrend(
  snapshots: Array<{ score: number; capturedOn: Date }>,
  currentScores: number[],
) {
  const dailyScores = new Map<string, number[]>();

  for (const snapshot of snapshots) {
    const key = toDateInputValue(snapshot.capturedOn);
    dailyScores.set(key, [...(dailyScores.get(key) || []), snapshot.score]);
  }

  if (currentScores.length) {
    dailyScores.set(toDateInputValue(startOfToday()), currentScores);
  }

  const points = Array.from(dailyScores.entries())
    .map(([date, scores]) => ({
      date,
      score: average(scores) || 0,
    }))
    .sort((a, b) => a.date.localeCompare(b.date));
  const first = points[0]?.score ?? 0;
  const last = points[points.length - 1]?.score ?? first;
  const delta = points.length > 1 ? last - first : 0;
  const direction =
    points.length < 2
      ? 'none'
      : delta > 2
        ? 'up'
        : delta < -2
          ? 'down'
          : 'flat';

  return { points, direction, delta };
}

function masteryMapWeakSkills(
  courseOverviews: StudentExperienceCourseOverviewPayload[],
) {
  return courseOverviews
    .flatMap((overview) =>
      overview.learningOutcomes.mastery.domains.map((domain) => ({
        courseId: overview.course.id,
        courseTitle: overview.course.title,
        domain: domain.domain,
        scorePercent: domain.scorePercent,
        confidence: domain.confidence,
        evidenceCount: domain.evidenceCount,
        recommendedAction: domain.recommendedAction,
      })),
    )
    .filter(
      (skill) =>
        skill.scorePercent < 70 || skill.recommendedAction !== 'maintain',
    )
    .sort((a, b) => {
      if (a.scorePercent !== b.scorePercent) {
        return a.scorePercent - b.scorePercent;
      }

      return a.evidenceCount - b.evidenceCount;
    })
    .slice(0, 8);
}

function masteryMapModules(
  courses: MasteryMapCourseRecord[],
  courseOverviews: StudentExperienceCourseOverviewPayload[],
) {
  const overviewByCourseId = new Map(
    courseOverviews.map((overview) => [overview.course.id, overview]),
  );
  const items = courses.flatMap((course) => {
    const overview = overviewByCourseId.get(course.id);
    const completedLessonIds = new Set(overview?.progress.completedLessonIds);
    const modules = course.modules.map((module) => ({
      id: module.id,
      title: module.title,
      description: module.description,
      orderIndex: module.orderIndex,
      lessons: module.lessons,
    }));
    const ungroupedLessons = course.lessons.filter(
      (lesson) => !lesson.moduleId,
    );

    if (ungroupedLessons.length) {
      modules.push({
        id: `${course.id}:ungrouped`,
        title: course.title,
        description: null,
        orderIndex: Number.MAX_SAFE_INTEGER,
        lessons: ungroupedLessons,
      });
    }

    let previousModuleComplete = true;
    let currentModuleAssigned = false;

    return modules
      .sort((a, b) => a.orderIndex - b.orderIndex)
      .map((module) => {
        const totalLessons = module.lessons.length;
        const completedLessons = module.lessons.filter((lesson) =>
          completedLessonIds.has(lesson.id),
        ).length;
        const percent = totalLessons
          ? Math.round((completedLessons / totalLessons) * 100)
          : 0;
        const isComplete =
          totalLessons > 0 && completedLessons === totalLessons;
        const hasProgress = completedLessons > 0;
        const unlocked = previousModuleComplete || hasProgress;
        const status = isComplete
          ? 'complete'
          : !unlocked
            ? 'locked'
            : !currentModuleAssigned
              ? 'current'
              : 'unlocked';

        if (status === 'current') {
          currentModuleAssigned = true;
        }
        if (totalLessons > 0) {
          previousModuleComplete = isComplete;
        }

        return {
          id: module.id,
          courseId: course.id,
          courseTitle: course.title,
          title: module.title,
          description: module.description,
          completedLessons,
          totalLessons,
          percent,
          status,
        };
      });
  });

  return {
    unlockedCount: items.filter((item) => item.status !== 'locked').length,
    totalCount: items.length,
    items: items.slice(0, 20),
  };
}

function masteryMapCertificates(input: {
  courses: StudentExperienceCourseOverviewPayload[];
  courseById: Map<string, MasteryMapCourseRecord>;
  certificates: MasteryMapCertificateRow[];
}) {
  const certificateByCourseId = new Map(
    input.certificates.map((certificate) => [
      certificate.courseId,
      certificate,
    ]),
  );
  const items = input.courses.map((overview) => {
    const course = input.courseById.get(overview.course.id);
    const certificate = certificateByCourseId.get(overview.course.id);
    const enabled = Boolean(course?.certificateEnabled);
    const status = !enabled
      ? 'unavailable'
      : certificate?.revokedAt
        ? 'revoked'
        : certificate
          ? 'earned'
          : overview.progress.completedLessons > 0
            ? 'inProgress'
            : 'locked';

    return {
      courseId: overview.course.id,
      courseTitle: overview.course.title,
      enabled,
      status,
      percent: overview.progress.percent,
      completedLessons: overview.progress.completedLessons,
      totalLessons: overview.progress.totalLessons,
      certificate: certificate
        ? {
            id: certificate.id,
            issuedAt: certificate.issuedAt,
            revokedAt: certificate.revokedAt,
            certificateNumber: certificate.certificateNumber,
            verificationCode: certificate.verificationCode,
          }
        : null,
    };
  });

  return {
    earnedCount: items.filter((item) => item.status === 'earned').length,
    availableCount: items.filter((item) => item.enabled).length,
    items,
  };
}

function masteryMapStreaks(
  courseOverviews: StudentExperienceCourseOverviewPayload[],
) {
  const courses = courseOverviews.map((overview) => ({
    courseId: overview.course.id,
    courseTitle: overview.course.title,
    currentStreak: overview.learningOutcomes.streak.currentStreak,
    longestStreak: overview.learningOutcomes.streak.longestStreak,
    lastActivityDate: overview.learningOutcomes.streak.lastActivityDate,
  }));

  return {
    currentStreak: courses.length
      ? Math.max(...courses.map((course) => course.currentStreak))
      : 0,
    longestStreak: courses.length
      ? Math.max(...courses.map((course) => course.longestStreak))
      : 0,
    activeCourses: courses.filter((course) => course.currentStreak > 0).length,
    courses,
  };
}

function homeworkItemPayload({
  course,
  assignment,
  enrollmentDate,
  submission,
  attemptCount,
}: {
  course: StudentCourse;
  assignment: StudentCourse['assignments'][number];
  enrollmentDate: Date;
  submission?: {
    id: string;
    status: string;
    submittedAt: Date;
    reviewedAt: Date | null;
    feedback: string | null;
    attemptNumber: number;
    score: number | null;
    maxScore: number | null;
  };
  attemptCount: number;
}) {
  const dueDate =
    assignment.dueDaysAfterEnroll != null
      ? addDays(enrollmentDate, assignment.dueDaysAfterEnroll)
      : null;
  const status = homeworkStatus(dueDate, submission);

  return {
    id: assignment.id,
    courseId: course.id,
    courseTitle: course.title,
    title: assignment.title,
    prompt: assignment.prompt,
    dueDate: dueDate?.toISOString() || null,
    dueDaysAfterEnroll: assignment.dueDaysAfterEnroll,
    moduleId: assignment.moduleId,
    lessonId: assignment.lessonId,
    attemptCount,
    status,
    submission: submission
      ? {
          id: submission.id,
          status: submission.status,
          submittedAt: submission.submittedAt,
          reviewedAt: submission.reviewedAt,
          feedback: submission.feedback,
          attemptNumber: submission.attemptNumber,
          score: submission.score,
          maxScore: submission.maxScore,
        }
      : null,
  };
}

function homeworkStatus(
  dueDate: Date | null,
  submission?: { status: string } | null,
): HomeworkStatus {
  if (submission?.status === 'complete') {
    return 'complete';
  }

  if (submission?.status === 'needsRevision') {
    return 'needsRevision';
  }

  if (submission?.status === 'submitted') {
    return 'submitted';
  }

  if (!dueDate) {
    return 'open';
  }

  const now = new Date();
  if (dueDate.getTime() < startOfToday().getTime()) {
    return 'overdue';
  }

  if (dueDate.getTime() <= addDays(now, 3).getTime()) {
    return 'dueSoon';
  }

  return 'open';
}

function homeworkSummaryPayload(items: Array<{ status: HomeworkStatus }>) {
  return {
    total: items.length,
    open: items.filter((item) => item.status === 'open').length,
    dueSoon: items.filter((item) => item.status === 'dueSoon').length,
    overdue: items.filter((item) => item.status === 'overdue').length,
    submitted: items.filter((item) => item.status === 'submitted').length,
    complete: items.filter((item) => item.status === 'complete').length,
    needsRevision: items.filter((item) => item.status === 'needsRevision')
      .length,
  };
}

function readinessPayload(input: {
  progressPercent: number;
  homeworkItems: Array<{ status: HomeworkStatus }>;
  practiceScore: number | null;
  examScore: number | null;
  recentActivityScore: number | null;
}): StudentReadinessScore {
  const homeworkScore =
    input.homeworkItems.length > 0
      ? average(
          input.homeworkItems.map((item) => {
            if (item.status === 'complete') return 100;
            if (item.status === 'submitted') return 75;
            if (item.status === 'needsRevision') return 35;
            return 0;
          }),
        )
      : null;

  return studentExperienceReadinessCalculate({
    courseProgressPercent: input.progressPercent,
    homeworkScorePercent: homeworkScore,
    practiceScorePercent: input.practiceScore,
    examScorePercent: input.examScore,
    recentActivityScorePercent: input.recentActivityScore,
  });
}

function recentActivityScore(input: {
  enrollmentDate: Date;
  progress: Array<{ completedAt: Date }>;
  submissions: Array<{ submittedAt: Date; reviewedAt: Date | null }>;
  practiceAttempts: Array<{ startedAt: Date; completedAt: Date | null }>;
  notes: Array<{ updatedAt: Date }>;
  studyPlanItems: Array<{ updatedAt: Date }>;
}) {
  const dates = [
    input.enrollmentDate,
    ...input.progress.map((item) => item.completedAt),
    ...input.submissions.flatMap((item) =>
      item.reviewedAt
        ? [item.submittedAt, item.reviewedAt]
        : [item.submittedAt],
    ),
    ...input.practiceAttempts.flatMap((item) =>
      item.completedAt ? [item.startedAt, item.completedAt] : [item.startedAt],
    ),
    ...input.notes.map((item) => item.updatedAt),
    ...input.studyPlanItems.map((item) => item.updatedAt),
  ];
  const latest = dates
    .filter(Boolean)
    .sort((a, b) => b.getTime() - a.getTime())[0];

  if (!latest) {
    return null;
  }

  const days = Math.floor((Date.now() - latest.getTime()) / 86_400_000);
  if (days <= 7) return 100;
  if (days <= 14) return 70;
  if (days <= 30) return 40;
  return 15;
}

const practiceQuestionSelect = {
  id: true,
  questionText: true,
  correctAnswerIndex: true,
  answerOptions: true,
  explanation: true,
  difficulty: true,
  category: true,
  tags: true,
} satisfies Prisma.PracticeQuestionSelect;

const practiceAttemptInclude = {
  answers: {
    orderBy: { createdAt: 'asc' as const },
    include: {
      practiceQuestion: {
        select: practiceQuestionSelect,
      },
    },
  },
} satisfies Prisma.CoursePracticeAttemptInclude;

type PracticeAttemptWithAnswers = Prisma.CoursePracticeAttemptGetPayload<{
  include: typeof practiceAttemptInclude;
}>;

async function studentExperiencePracticePayload(
  courseId: string,
  context: AppContext,
) {
  const currentUser = requireCurrentUser(context);
  await studentExperienceEnsureCourseAccess(courseId, context);
  const [availableQuestions, attempts, activeAttempt] = await Promise.all([
    studentExperienceAvailableQuestions(courseId),
    prisma.coursePracticeAttempt.findMany({
      where: { courseId, userId: currentUser.id, status: 'completed' },
      orderBy: { completedAt: 'desc' },
      take: 10,
    }),
    prisma.coursePracticeAttempt.findFirst({
      where: { courseId, userId: currentUser.id, status: 'active' },
      orderBy: { startedAt: 'desc' },
      include: practiceAttemptInclude,
    }),
  ]);
  const scores = attempts
    .map((attempt) => attempt.scorePercent)
    .filter((score): score is number => score != null);

  return {
    availableQuestions: availableQuestions.length,
    sampleQuestions: availableQuestions.slice(0, 5).map((question) => ({
      id: question.id,
      questionText: question.questionText,
      answerOptions: question.answerOptions,
      difficulty: question.difficulty,
      category: question.category,
      tags: question.tags,
    })),
    activeAttempt: activeAttempt ? practiceAttemptPayload(activeAttempt) : null,
    recentAttempts: attempts.map(practiceAttemptSummaryPayload),
    averageAccuracy: average(scores),
    weakAreas: await studentExperienceWeakAreas(courseId, currentUser.id),
  };
}

async function studentExperienceAvailableQuestions(courseId: string) {
  const questions = await prisma.practiceQuestion.findMany({
    where: {
      courseId,
      isActive: true,
      archivedAt: null,
    },
    select: practiceQuestionSelect,
    orderBy: [{ updatedAt: 'desc' }, { createdAt: 'desc' }],
    take: 100,
  });

  return questions.filter(
    (question) =>
      question.answerOptions.length > 0 &&
      question.correctAnswerIndex >= 0 &&
      question.correctAnswerIndex < question.answerOptions.length,
  );
}

async function studentExperienceWeakAreas(courseId: string, userId: string) {
  const missedAnswers = await prisma.coursePracticeAnswer.findMany({
    where: {
      isCorrect: false,
      attempt: {
        courseId,
        userId,
      },
    },
    include: {
      practiceQuestion: {
        select: {
          category: true,
          difficulty: true,
        },
      },
    },
    orderBy: { answeredAt: 'desc' },
    take: 30,
  });

  return Array.from(
    new Set(
      missedAnswers
        .map(
          (answer) =>
            answer.practiceQuestion.category ||
            answer.practiceQuestion.difficulty ||
            null,
        )
        .filter((value): value is string => Boolean(value)),
    ),
  ).slice(0, 5);
}

const diagnosticAttemptInclude = {
  answers: {
    orderBy: { createdAt: 'asc' as const },
  },
} satisfies Prisma.CourseDiagnosticAttemptInclude;

type DiagnosticAttemptWithAnswers = Prisma.CourseDiagnosticAttemptGetPayload<{
  include: typeof diagnosticAttemptInclude;
}>;

type DiagnosticQuestionCandidate = {
  source: 'courseQuestion' | 'practiceQuestion';
  sourceQuestionId: string;
  questionText: string;
  answerOptions: string[];
  correctAnswerIndex: number;
  explanation: string | null;
  difficulty: string;
  domain: string;
};

type DomainScore = {
  domain: string;
  correct: number;
  total: number;
  percent: number;
};

function diagnosticAttemptPayload(
  attempt: DiagnosticAttemptWithAnswers,
  revealAll = false,
) {
  const reveal = revealAll || attempt.status === 'completed';

  return {
    id: attempt.id,
    courseId: attempt.courseId,
    status: attempt.status,
    startedAt: attempt.startedAt,
    completedAt: attempt.completedAt,
    totalQuestions: attempt.totalQuestions,
    correctAnswers: attempt.correctAnswers,
    scorePercent: attempt.scorePercent,
    domainScores: domainScoresFromJson(attempt.domainScores),
    questions: attempt.answers.map((answer) =>
      diagnosticAnswerPayload(
        answer,
        reveal || answer.selectedAnswerIndex != null,
      ),
    ),
  };
}

function diagnosticAnswerPayload(
  answer: Prisma.CourseDiagnosticAnswerGetPayload<Record<string, never>>,
  reveal: boolean,
) {
  return {
    answerId: answer.id,
    questionId: answer.sourceQuestionId,
    source: answer.source,
    questionText: answer.questionText,
    answerOptions: jsonStringArray(answer.answerOptions),
    difficulty: answer.difficulty,
    domain: answer.domain,
    selectedAnswerIndex: answer.selectedAnswerIndex,
    isCorrect: reveal ? answer.isCorrect : null,
    correctAnswerIndex: reveal ? answer.correctAnswerIndex : null,
    explanation: reveal ? answer.explanation : null,
    answeredAt: answer.answeredAt,
  };
}

async function studentExperienceDiagnosticQuestionCandidates(
  courseId: string,
  userId: string,
): Promise<DiagnosticQuestionCandidate[]> {
  const [courseQuestions, practiceQuestions, mastery] = await Promise.all([
    prisma.courseQuestion.findMany({
      where: {
        courseId,
        status: 'approved',
        questionType: { in: ['multipleChoice', 'trueFalse'] },
      },
      select: {
        id: true,
        questionText: true,
        explanation: true,
        difficulty: true,
        examDomain: true,
        tags: true,
        answers: {
          orderBy: { orderIndex: 'asc' },
          select: {
            answerText: true,
            isCorrect: true,
          },
        },
      },
      orderBy: [{ updatedAt: 'desc' }, { createdAt: 'desc' }],
      take: 100,
    }),
    studentExperienceAvailableQuestions(courseId),
    prisma.courseDomainMastery.findMany({
      where: { courseId, userId },
      select: { domain: true, scorePercent: true, evidenceCount: true },
    }),
  ]);
  const masteryByDomain = new Map(
    mastery.map((item) => [item.domain, item.scorePercent]),
  );
  const candidates: DiagnosticQuestionCandidate[] = [];

  for (const question of courseQuestions) {
    const correctAnswerIndex = question.answers.findIndex(
      (answer) => answer.isCorrect,
    );
    const correctAnswerCount = question.answers.filter(
      (answer) => answer.isCorrect,
    ).length;
    const answerOptions = question.answers.map((answer) => answer.answerText);
    if (
      correctAnswerIndex < 0 ||
      correctAnswerCount !== 1 ||
      answerOptions.length < 2
    ) {
      continue;
    }

    candidates.push({
      source: 'courseQuestion',
      sourceQuestionId: question.id,
      questionText: question.questionText,
      answerOptions,
      correctAnswerIndex,
      explanation: question.explanation,
      difficulty: question.difficulty,
      domain:
        question.examDomain ||
        question.tags[0] ||
        learningOutcomesGeneralDomain,
    });
  }

  for (const question of practiceQuestions) {
    candidates.push({
      source: 'practiceQuestion',
      sourceQuestionId: question.id,
      questionText: question.questionText,
      answerOptions: question.answerOptions,
      correctAnswerIndex: question.correctAnswerIndex,
      explanation: question.explanation,
      difficulty: question.difficulty,
      domain:
        question.category ||
        question.tags[0] ||
        question.difficulty ||
        learningOutcomesGeneralDomain,
    });
  }

  return candidates.sort((a, b) => {
    const aScore = masteryByDomain.get(a.domain) ?? 101;
    const bScore = masteryByDomain.get(b.domain) ?? 101;
    if (aScore !== bScore) {
      return aScore - bScore;
    }

    return a.domain.localeCompare(b.domain);
  });
}

async function studentExperienceLearningOutcomesPayload(input: {
  courseId: string;
  userId: string;
  course: StudentCourse;
  studyPlanItems: Array<{
    id: string;
    title: string;
    description: string | null;
    plannedForDate: string | null;
    status: string;
    source: string;
    completedAt: Date | null;
    createdAt: Date;
    updatedAt: Date;
  }>;
  weakAreas: string[];
}) {
  const now = new Date();
  const [
    diagnosticCandidates,
    activeDiagnostic,
    lastDiagnostic,
    masteryRows,
    diagnosticAttempts,
    practiceExamAttempts,
    aiQuizAttempts,
    flashcards,
    streak,
    activeRemediationPlan,
    practiceExams,
  ] = await Promise.all([
    studentExperienceDiagnosticQuestionCandidates(input.courseId, input.userId),
    prisma.courseDiagnosticAttempt.findFirst({
      where: {
        courseId: input.courseId,
        userId: input.userId,
        status: 'active',
      },
      orderBy: { startedAt: 'desc' },
      include: diagnosticAttemptInclude,
    }),
    prisma.courseDiagnosticAttempt.findFirst({
      where: {
        courseId: input.courseId,
        userId: input.userId,
        status: 'completed',
      },
      orderBy: { completedAt: 'desc' },
      include: diagnosticAttemptInclude,
    }),
    prisma.courseDomainMastery.findMany({
      where: { courseId: input.courseId, userId: input.userId },
      orderBy: [{ scorePercent: 'asc' }, { updatedAt: 'desc' }],
    }),
    prisma.courseDiagnosticAttempt.findMany({
      where: {
        courseId: input.courseId,
        userId: input.userId,
        status: 'completed',
      },
      select: { domainScores: true },
      take: 20,
    }),
    prisma.coursePracticeExamAttempt.findMany({
      where: { courseId: input.courseId, userId: input.userId },
      select: {
        id: true,
        practiceExamId: true,
        scorePercent: true,
        passed: true,
        domainScores: true,
        startedAt: true,
        submittedAt: true,
      },
      orderBy: { startedAt: 'desc' },
      take: 10,
    }),
    prisma.courseAiQuizAttempt.findMany({
      where: { courseId: input.courseId, userId: input.userId },
      select: { domainScores: true },
      take: 20,
    }),
    prisma.courseFlashcard.findMany({
      where: { flashcardSet: { courseId: input.courseId } },
      include: {
        flashcardSet: { select: { id: true, title: true } },
        reviews: {
          where: { userId: input.userId },
          take: 1,
        },
      },
      orderBy: { orderIndex: 'asc' },
    }),
    prisma.courseStudyStreak.findUnique({
      where: {
        courseId_userId: {
          courseId: input.courseId,
          userId: input.userId,
        },
      },
    }),
    prisma.courseRemediationPlan.findFirst({
      where: {
        courseId: input.courseId,
        userId: input.userId,
        status: 'active',
      },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.coursePracticeExam.findMany({
      where: { courseId: input.courseId },
      select: {
        id: true,
        title: true,
        timeLimitMinutes: true,
        passingScore: true,
        totalQuestions: true,
        simulateRealExam: true,
      },
      orderBy: [{ orderIndex: 'asc' }, { createdAt: 'asc' }],
      take: 10,
    }),
  ]);
  const mastery = masteryPayload({
    candidates: diagnosticCandidates,
    persisted: masteryRows,
    weakAreas: input.weakAreas,
    scoreRows: [
      ...diagnosticAttempts,
      ...practiceExamAttempts,
      ...aiQuizAttempts,
    ],
  });
  const flashcardsPayload = flashcardOutcomesPayload(flashcards, now);
  const remediationWeakDomains = mastery.domains
    .filter((domain) => domain.scorePercent < 70 || domain.evidenceCount === 0)
    .map((domain) => domain.domain)
    .concat(input.weakAreas)
    .filter(uniqueString)
    .slice(0, 5);
  const submittedMockExamAttempts = practiceExamAttempts.filter(
    (attempt) => attempt.submittedAt,
  );
  const mockScores = submittedMockExamAttempts.map(
    (attempt) => attempt.scorePercent,
  );

  return {
    diagnostic: {
      availableQuestions: diagnosticCandidates.length,
      activeAttempt: activeDiagnostic
        ? diagnosticAttemptPayload(activeDiagnostic)
        : null,
      lastAttempt: lastDiagnostic
        ? diagnosticAttemptPayload(lastDiagnostic, true)
        : null,
    },
    mastery,
    flashcards: flashcardsPayload,
    streak: streak
      ? {
          currentStreak: streak.currentStreak,
          longestStreak: streak.longestStreak,
          lastActivityDate: streak.lastActivityDate,
        }
      : {
          currentStreak: 0,
          longestStreak: 0,
          lastActivityDate: null,
        },
    remediation: {
      activePlan: activeRemediationPlan
        ? remediationPlanPayload(activeRemediationPlan)
        : null,
      weakDomains: remediationWeakDomains,
    },
    schedule: {
      preview: schedulePreviewPayload({
        studyPlanItems: input.studyPlanItems,
        dueFlashcards: flashcardsPayload.cards.length,
        remediationPlan: activeRemediationPlan,
      }),
    },
    mockExams: {
      availableExams: practiceExams.length,
      simulatedExams: practiceExams.filter((exam) => exam.simulateRealExam)
        .length,
      bestScore: mockScores.length ? Math.max(...mockScores) : null,
      lastScore: submittedMockExamAttempts[0]?.scorePercent ?? null,
      recentAttempts: submittedMockExamAttempts.slice(0, 5).map((attempt) => ({
        id: attempt.id,
        practiceExamId: attempt.practiceExamId,
        scorePercent: attempt.scorePercent,
        passed: attempt.passed,
        startedAt: attempt.startedAt,
        submittedAt: attempt.submittedAt,
      })),
      exams: practiceExams,
    },
  };
}

function masteryPayload(input: {
  candidates: DiagnosticQuestionCandidate[];
  persisted: Array<{
    domain: string;
    scorePercent: number;
    confidence: string;
    evidenceCount: number;
    lastPracticedAt: Date | null;
    recommendedAction: string | null;
  }>;
  weakAreas: string[];
  scoreRows: Array<{ domainScores: unknown }>;
}) {
  const tallyByDomain = domainTalliesFromRows(input.scoreRows);
  const persistedByDomain = new Map(
    input.persisted.map((item) => [item.domain, item]),
  );
  const domains = [
    ...input.candidates.map((item) => item.domain),
    ...input.persisted.map((item) => item.domain),
    ...tallyByDomain.keys(),
    ...input.weakAreas,
  ].filter(uniqueString);
  const rows = domains.map((domain) => {
    const tally = tallyByDomain.get(domain);
    const persisted = persistedByDomain.get(domain);
    const evidenceCount = tally?.total ?? persisted?.evidenceCount ?? 0;
    const scorePercent =
      tally && tally.total
        ? Math.round((tally.correct / tally.total) * 100)
        : (persisted?.scorePercent ??
          (input.weakAreas.includes(domain) ? 45 : 0));

    return {
      domain,
      scorePercent,
      confidence: masteryConfidence(evidenceCount),
      evidenceCount,
      lastPracticedAt: persisted?.lastPracticedAt ?? null,
      recommendedAction:
        persisted?.recommendedAction ||
        masteryRecommendedAction(scorePercent, evidenceCount),
    };
  });

  return {
    domains: rows.sort((a, b) => {
      if (a.evidenceCount === 0 && b.evidenceCount > 0) return 1;
      if (b.evidenceCount === 0 && a.evidenceCount > 0) return -1;
      return a.scorePercent - b.scorePercent;
    }),
    averageScore: average(rows.map((item) => item.scorePercent)),
  };
}

async function studentExperienceUpdateMasteryFromDomainScores(input: {
  courseId: string;
  userId: string;
  domainScores: DomainScore[];
  context: AppContext;
}) {
  for (const score of input.domainScores) {
    if (!score.total) {
      continue;
    }

    const oldData = await prisma.courseDomainMastery.findUnique({
      where: {
        courseId_userId_domain: {
          courseId: input.courseId,
          userId: input.userId,
          domain: score.domain,
        },
      },
    });
    const evidenceCount = (oldData?.evidenceCount || 0) + score.total;
    const weightedScore = oldData
      ? Math.round(
          (oldData.scorePercent * oldData.evidenceCount +
            score.percent * score.total) /
            Math.max(evidenceCount, 1),
        )
      : score.percent;
    const mastery = await prisma.courseDomainMastery.upsert({
      where: {
        courseId_userId_domain: {
          courseId: input.courseId,
          userId: input.userId,
          domain: score.domain,
        },
      },
      create: {
        courseId: input.courseId,
        userId: input.userId,
        domain: score.domain,
        scorePercent: weightedScore,
        confidence: masteryConfidence(evidenceCount),
        evidenceCount,
        lastPracticedAt: new Date(),
        recommendedAction: masteryRecommendedAction(
          weightedScore,
          evidenceCount,
        ),
      },
      update: {
        scorePercent: weightedScore,
        confidence: masteryConfidence(evidenceCount),
        evidenceCount,
        lastPracticedAt: new Date(),
        recommendedAction: masteryRecommendedAction(
          weightedScore,
          evidenceCount,
        ),
      },
    });

    await auditLogCreate({
      entityId: mastery.id,
      entityName: 'CourseDomainMastery',
      operation: oldData
        ? auditLogOperations.update
        : auditLogOperations.create,
      context: input.context,
      oldData,
      newData: mastery,
    });
  }
}

async function studentExperienceTouchStreak(
  courseId: string,
  userId: string,
  context: AppContext,
) {
  const today = startOfToday();
  const todayKey = toDateInputValue(today);
  const yesterdayKey = toDateInputValue(addDays(today, -1));
  const oldData = await prisma.courseStudyStreak.findUnique({
    where: {
      courseId_userId: {
        courseId,
        userId,
      },
    },
  });

  if (
    oldData?.lastActivityDate &&
    toDateInputValue(oldData.lastActivityDate) === todayKey
  ) {
    return oldData;
  }

  const currentStreak =
    oldData?.lastActivityDate &&
    toDateInputValue(oldData.lastActivityDate) === yesterdayKey
      ? oldData.currentStreak + 1
      : 1;
  const longestStreak = Math.max(oldData?.longestStreak || 0, currentStreak);
  const streak = oldData
    ? await prisma.courseStudyStreak.update({
        where: { id: oldData.id },
        data: {
          currentStreak,
          longestStreak,
          lastActivityDate: today,
        },
      })
    : await prisma.courseStudyStreak.create({
        data: {
          courseId,
          userId,
          currentStreak,
          longestStreak,
          lastActivityDate: today,
        },
      });

  await auditLogCreate({
    entityId: streak.id,
    entityName: 'CourseStudyStreak',
    operation: oldData ? auditLogOperations.update : auditLogOperations.create,
    context,
    oldData,
    newData: streak,
  });

  return streak;
}

function diagnosticDomainScores(
  answers: DiagnosticAttemptWithAnswers['answers'],
): DomainScore[] {
  const tally = new Map<string, { correct: number; total: number }>();
  for (const answer of answers) {
    const domain = answer.domain || learningOutcomesGeneralDomain;
    const current = tally.get(domain) || { correct: 0, total: 0 };
    current.total += 1;
    if (answer.isCorrect) {
      current.correct += 1;
    }
    tally.set(domain, current);
  }

  return [...tally.entries()].map(([domain, item]) => ({
    domain,
    correct: item.correct,
    total: item.total,
    percent: item.total ? Math.round((item.correct / item.total) * 100) : 0,
  }));
}

function domainScoresFromJson(value: unknown): DomainScore[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .map((item) => {
      if (!item || typeof item !== 'object') {
        return null;
      }

      const row = item as Record<string, unknown>;
      const domain =
        typeof row.domain === 'string' && row.domain.trim()
          ? row.domain
          : learningOutcomesGeneralDomain;
      const total = numberFromUnknown(row.total);
      const correct = numberFromUnknown(row.correct);
      const percent =
        row.percent == null
          ? total
            ? Math.round((correct / total) * 100)
            : 0
          : numberFromUnknown(row.percent);

      return { domain, correct, total, percent };
    })
    .filter((item): item is DomainScore => Boolean(item));
}

function domainTalliesFromRows(rows: Array<{ domainScores: unknown }>) {
  const tally = new Map<string, { correct: number; total: number }>();
  for (const row of rows) {
    for (const score of domainScoresFromJson(row.domainScores)) {
      const current = tally.get(score.domain) || { correct: 0, total: 0 };
      current.correct += score.correct;
      current.total += score.total;
      tally.set(score.domain, current);
    }
  }

  return tally;
}

function flashcardOutcomesPayload(
  flashcards: Array<
    Prisma.CourseFlashcardGetPayload<{
      include: {
        flashcardSet: { select: { id: true; title: true } };
        reviews: true;
      };
    }>
  >,
  now: Date,
) {
  const cardsWithReviews = flashcards.map((card) => ({
    card,
    review: card.reviews[0] || null,
  }));
  const dueCards = cardsWithReviews.filter(
    (item) => !item.review || item.review.dueAt <= now,
  );
  const nextDueAt = cardsWithReviews
    .map((item) => item.review?.dueAt || now)
    .sort((a, b) => a.getTime() - b.getTime())[0];

  return {
    totalCards: flashcards.length,
    dueCards: dueCards.length,
    nextDueAt: nextDueAt || null,
    cards: dueCards.slice(0, 3).map((item) => ({
      id: item.card.id,
      front: item.card.front,
      back: item.card.back,
      hint: item.card.hint,
      setId: item.card.flashcardSet.id,
      setTitle: item.card.flashcardSet.title,
      review: item.review ? flashcardReviewPayload(item.review) : null,
    })),
  };
}

function flashcardReviewSchedule(
  existing: {
    easeFactor: number;
    intervalDays: number;
    repetitions: number;
  } | null,
  rating: 'again' | 'hard' | 'good' | 'easy',
) {
  const baseEase = existing?.easeFactor ?? 250;
  const baseRepetitions = existing?.repetitions ?? 0;
  const baseInterval = existing?.intervalDays ?? 0;
  let easeFactor = baseEase;
  let repetitions = baseRepetitions;
  let intervalDays = 1;

  if (rating === 'again') {
    easeFactor = Math.max(130, baseEase - 20);
    repetitions = 0;
    intervalDays = 1;
  } else if (rating === 'hard') {
    easeFactor = Math.max(130, baseEase - 15);
    repetitions = baseRepetitions + 1;
    intervalDays = Math.max(1, baseInterval || 1);
  } else if (rating === 'good') {
    easeFactor = baseEase;
    repetitions = baseRepetitions + 1;
    intervalDays =
      repetitions <= 1
        ? 1
        : repetitions === 2
          ? 3
          : Math.max(5, Math.round((baseInterval || 3) * (baseEase / 100)));
  } else {
    easeFactor = Math.min(320, baseEase + 15);
    repetitions = baseRepetitions + 1;
    intervalDays =
      repetitions <= 1
        ? 3
        : repetitions === 2
          ? 7
          : Math.max(10, Math.round((baseInterval || 7) * (easeFactor / 100)));
  }

  return {
    easeFactor,
    intervalDays,
    repetitions,
    dueAt: addDays(new Date(), intervalDays),
  };
}

function flashcardReviewPayload(review: {
  id: string;
  flashcardId: string;
  easeFactor: number;
  intervalDays: number;
  repetitions: number;
  dueAt: Date;
  lastReviewedAt: Date | null;
  lastRating: string | null;
}) {
  return {
    id: review.id,
    flashcardId: review.flashcardId,
    easeFactor: review.easeFactor,
    intervalDays: review.intervalDays,
    repetitions: review.repetitions,
    dueAt: review.dueAt,
    lastReviewedAt: review.lastReviewedAt,
    lastRating: review.lastRating,
  };
}

function remediationPlanPayload(plan: {
  id: string;
  courseId: string;
  domain: string;
  status: string;
  title: string;
  description: string | null;
  items: unknown;
  source: string;
  createdAt: Date;
  updatedAt: Date;
  completedAt: Date | null;
}) {
  return {
    id: plan.id,
    courseId: plan.courseId,
    domain: plan.domain,
    status: plan.status,
    title: plan.title,
    description: plan.description,
    items: Array.isArray(plan.items) ? plan.items : [],
    source: plan.source,
    createdAt: plan.createdAt,
    updatedAt: plan.updatedAt,
    completedAt: plan.completedAt,
  };
}

function schedulePreviewPayload(input: {
  studyPlanItems: Array<{
    id: string;
    title: string;
    description: string | null;
    plannedForDate: string | null;
    status: string;
    source: string;
  }>;
  dueFlashcards: number;
  remediationPlan: {
    id: string;
    title: string;
    domain: string;
  } | null;
}) {
  const items = input.studyPlanItems
    .filter((item) => item.status !== 'complete')
    .sort(studyPlanSort)
    .slice(0, 6)
    .map((item) => ({
      id: item.id,
      type: 'studyPlan',
      title: item.title,
      description: item.description,
      plannedForDate: item.plannedForDate,
      source: item.source,
    }));

  if (input.dueFlashcards > 0) {
    items.unshift({
      id: 'due-flashcards',
      type: 'flashcards',
      title: String(input.dueFlashcards),
      description: null,
      plannedForDate: toDateInputValue(startOfToday()),
      source: 'spacedRepetition',
    });
  }

  if (input.remediationPlan) {
    items.unshift({
      id: input.remediationPlan.id,
      type: 'remediation',
      title: input.remediationPlan.title,
      description: input.remediationPlan.domain,
      plannedForDate: toDateInputValue(startOfToday()),
      source: 'remediation',
    });
  }

  return items.slice(0, 6);
}

function masteryConfidence(evidenceCount: number) {
  if (evidenceCount >= 10) {
    return 'high';
  }

  if (evidenceCount >= 4) {
    return 'medium';
  }

  return 'low';
}

function masteryRecommendedAction(scorePercent: number, evidenceCount: number) {
  if (!evidenceCount) {
    return 'diagnose';
  }

  if (scorePercent < 60) {
    return 'remediate';
  }

  if (scorePercent < 80) {
    return 'practice';
  }

  return 'maintain';
}

function uniqueString(value: string, index: number, values: string[]) {
  return Boolean(value) && values.indexOf(value) === index;
}

function numberFromUnknown(value: unknown) {
  const numberValue = Number(value);
  return Number.isFinite(numberValue) ? numberValue : 0;
}

function jsonStringArray(value: unknown) {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.filter((item): item is string => typeof item === 'string');
}

function practiceAttemptPayload(
  attempt: PracticeAttemptWithAnswers,
  revealAll = false,
) {
  const reveal = revealAll || attempt.status === 'completed';

  return {
    ...practiceAttemptSummaryPayload(attempt),
    questions: attempt.answers.map((answer) =>
      practiceQuestionAnswerPayload(answer, reveal),
    ),
  };
}

function practiceAttemptSummaryPayload(attempt: {
  id: string;
  courseId: string;
  status: string;
  startedAt: Date;
  completedAt: Date | null;
  totalQuestions: number;
  correctAnswers: number;
  scorePercent: number | null;
}) {
  return {
    id: attempt.id,
    courseId: attempt.courseId,
    status: attempt.status,
    startedAt: attempt.startedAt,
    completedAt: attempt.completedAt,
    totalQuestions: attempt.totalQuestions,
    correctAnswers: attempt.correctAnswers,
    scorePercent: attempt.scorePercent,
  };
}

function practiceQuestionAnswerPayload(
  answer: {
    id: string;
    practiceQuestionId: string;
    selectedAnswerIndex: number | null;
    isCorrect: boolean | null;
    answeredAt: Date | null;
    practiceQuestion: Prisma.PracticeQuestionGetPayload<{
      select: typeof practiceQuestionSelect;
    }>;
  },
  reveal: boolean,
) {
  const answered = answer.selectedAnswerIndex != null;
  const canReveal = reveal || answered;

  return {
    answerId: answer.id,
    questionId: answer.practiceQuestionId,
    questionText: answer.practiceQuestion.questionText,
    answerOptions: answer.practiceQuestion.answerOptions,
    difficulty: answer.practiceQuestion.difficulty,
    category: answer.practiceQuestion.category,
    tags: answer.practiceQuestion.tags,
    selectedAnswerIndex: answer.selectedAnswerIndex,
    isCorrect: canReveal ? answer.isCorrect : null,
    correctAnswerIndex: canReveal
      ? answer.practiceQuestion.correctAnswerIndex
      : null,
    explanation: canReveal ? answer.practiceQuestion.explanation : null,
    answeredAt: answer.answeredAt,
  };
}

async function studentExperienceValidateCourseLesson(
  courseId: string,
  lessonId?: string | null,
) {
  if (!lessonId) {
    return;
  }

  const lesson = await prisma.courseLesson.findFirst({
    where: { id: lessonId, courseId },
    select: { id: true },
  });

  if (!lesson) {
    throw new Error404();
  }
}

function studyPlanSuggestions(input: {
  course: StudentCourse;
  homeworkItems: Array<{
    id: string;
    title: string;
    status: HomeworkStatus;
    dueDate: string | null;
  }>;
  nextLesson: StudentCourse['lessons'][number] | null;
  availableQuestions: number;
}) {
  const suggestions: Array<{
    kind: 'lesson' | 'homework' | 'practice';
    courseId: string;
    targetId: string | null;
    targetTitle: string;
    dueDate: string | null;
    priority: number;
  }> = [];

  if (input.nextLesson) {
    suggestions.push({
      kind: 'lesson',
      courseId: input.course.id,
      targetId: input.nextLesson.id,
      targetTitle: input.nextLesson.title,
      dueDate: null,
      priority: 2,
    });
  }

  const homework = input.homeworkItems.find((item) =>
    ['overdue', 'needsRevision', 'dueSoon', 'open'].includes(item.status),
  );
  if (homework) {
    suggestions.push({
      kind: 'homework',
      courseId: input.course.id,
      targetId: homework.id,
      targetTitle: homework.title,
      dueDate: homework.dueDate,
      priority: homework.status === 'overdue' ? 0 : 1,
    });
  }

  if (input.availableQuestions > 0) {
    suggestions.push({
      kind: 'practice',
      courseId: input.course.id,
      targetId: null,
      targetTitle: input.course.title,
      dueDate: null,
      priority: 3,
    });
  }

  return suggestions.sort((a, b) => a.priority - b.priority).slice(0, 3);
}

function adaptivePlanBuildItems(input: {
  overview: Awaited<ReturnType<typeof studentExperienceCourseOverviewPayload>>;
  targetExamDate: string | null;
  dictionary: AppContext['dictionary'];
}) {
  const { overview, targetExamDate, dictionary } = input;
  const t = dictionary.studentExperience.adaptivePlan;
  const dates = adaptivePlanDates(targetExamDate, 6);
  const items: Array<{
    title: string;
    description: string;
    plannedForDate: string | null;
  }> = [];
  const completedPracticeAttempts = overview.practice.recentAttempts.filter(
    (attempt) => attempt.status === 'completed',
  );

  if (
    !completedPracticeAttempts.length &&
    overview.practice.availableQuestions
  ) {
    items.push({
      title: t.itemTitles.diagnostic,
      description: dictionaryFormat(
        t.itemDescriptions.diagnostic,
        overview.course.title,
      ),
      plannedForDate: dates[0],
    });
  }

  overview.practice.weakAreas.slice(0, 3).forEach((area, index) => {
    items.push({
      title: dictionaryFormat(t.itemTitles.weakArea, area),
      description: dictionaryFormat(t.itemDescriptions.weakArea, area),
      plannedForDate: dates[index + 1] || null,
    });
  });

  const urgentHomework = overview.homework.items.find((item) =>
    ['overdue', 'needsRevision', 'dueSoon'].includes(item.status),
  );
  if (urgentHomework) {
    items.push({
      title: dictionaryFormat(t.itemTitles.homework, urgentHomework.title),
      description: dictionaryFormat(
        t.itemDescriptions.homework,
        urgentHomework.title,
      ),
      plannedForDate: normalizePlannedDate(urgentHomework.dueDate) || dates[2],
    });
  }

  if (overview.nextLesson) {
    items.push({
      title: dictionaryFormat(t.itemTitles.lesson, overview.nextLesson.title),
      description: dictionaryFormat(
        t.itemDescriptions.lesson,
        overview.nextLesson.title,
      ),
      plannedForDate: dates[3] || null,
    });
  }

  if (overview.practice.availableQuestions) {
    items.push({
      title: dictionaryFormat(t.itemTitles.practice, overview.course.title),
      description: dictionaryFormat(
        t.itemDescriptions.practice,
        overview.course.title,
      ),
      plannedForDate: dates[4] || null,
    });
  }

  if (!items.length) {
    items.push({
      title: t.itemTitles.maintain,
      description: dictionaryFormat(
        t.itemDescriptions.maintain,
        overview.course.title,
      ),
      plannedForDate: dates[0],
    });
  }

  return items.slice(0, 6);
}

function adaptivePlanDates(targetExamDate: string | null, count: number) {
  const start = startOfToday();
  const target = targetExamDate ? new Date(targetExamDate) : null;
  const daysUntilTarget =
    target && target.getTime() > start.getTime()
      ? Math.floor((target.getTime() - start.getTime()) / 86_400_000)
      : null;
  const spacing =
    daysUntilTarget && daysUntilTarget > count
      ? Math.max(1, Math.floor(daysUntilTarget / (count + 1)))
      : 1;

  return Array.from({ length: count }, (_, index) =>
    toDateInputValue(addDays(start, spacing * index)),
  );
}

function normalizePlannedDate(value: string | null) {
  if (!value) {
    return null;
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return toDateInputValue(date);
}

function studyPlanItemPayload(item: {
  id: string;
  courseId: string;
  title: string;
  description: string | null;
  plannedForDate: string | null;
  status: string;
  source: string;
  completedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}) {
  return {
    ...item,
    isDueToday: isDateToday(item.plannedForDate),
  };
}

function studentExperienceNextAction(
  courseOverviews: Array<
    Awaited<ReturnType<typeof studentExperienceCourseOverviewPayload>>
  >,
) {
  const homework = courseOverviews
    .flatMap((item) => item.homework.items)
    .sort(homeworkSort)
    .find((item) =>
      ['overdue', 'needsRevision', 'dueSoon'].includes(item.status),
    );

  if (homework) {
    return {
      type: 'homework',
      courseId: homework.courseId,
      title: homework.title,
      lessonId: homework.lessonId,
      assignmentId: homework.id,
    };
  }

  const lessonCourse = courseOverviews.find((item) => item.nextLesson);
  if (lessonCourse?.nextLesson) {
    return {
      type: 'lesson',
      courseId: lessonCourse.course.id,
      title: lessonCourse.nextLesson.title,
      lessonId: lessonCourse.nextLesson.id,
      assignmentId: null,
    };
  }

  const practiceCourse = courseOverviews.find(
    (item) => item.practice.availableQuestions > 0,
  );
  if (practiceCourse) {
    return {
      type: 'practice',
      courseId: practiceCourse.course.id,
      title: practiceCourse.course.title,
      lessonId: null,
      assignmentId: null,
    };
  }

  return null;
}

function homeworkSort(
  a: { dueDate: string | null; status: HomeworkStatus },
  b: { dueDate: string | null; status: HomeworkStatus },
) {
  const statusPriority: Record<HomeworkStatus, number> = {
    overdue: 0,
    needsRevision: 1,
    dueSoon: 2,
    open: 3,
    submitted: 4,
    complete: 5,
  };
  const priority = statusPriority[a.status] - statusPriority[b.status];
  if (priority !== 0) {
    return priority;
  }

  return (
    (a.dueDate ? new Date(a.dueDate).getTime() : Number.MAX_SAFE_INTEGER) -
    (b.dueDate ? new Date(b.dueDate).getTime() : Number.MAX_SAFE_INTEGER)
  );
}

function studyPlanSort(
  a: { plannedForDate: string | null; status: string },
  b: { plannedForDate: string | null; status: string },
) {
  if (a.status !== b.status) {
    return a.status === 'complete' ? 1 : -1;
  }

  return (
    (a.plannedForDate
      ? new Date(a.plannedForDate).getTime()
      : Number.MAX_SAFE_INTEGER) -
    (b.plannedForDate
      ? new Date(b.plannedForDate).getTime()
      : Number.MAX_SAFE_INTEGER)
  );
}

function average(values: Array<number | null | undefined>) {
  const validValues = values.filter(
    (value): value is number => value != null && !Number.isNaN(value),
  );

  if (!validValues.length) {
    return null;
  }

  return Math.round(
    validValues.reduce((total, value) => total + value, 0) / validValues.length,
  );
}

function addDays(date: Date, days: number) {
  const value = new Date(date);
  value.setDate(value.getDate() + days);
  return value;
}

function startOfToday() {
  const value = new Date();
  value.setHours(0, 0, 0, 0);
  return value;
}

function isDateToday(value?: string | null) {
  if (!value) {
    return false;
  }

  const target = new Date(value);
  const today = startOfToday();
  const tomorrow = addDays(today, 1);
  return target >= today && target < tomorrow;
}

function toDateInputValue(date: Date) {
  return date.toISOString().slice(0, 10);
}
