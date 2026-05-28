import { Prisma } from '../../prisma/generated/client';
import { prisma } from '../../prisma';
import { AppContext } from '../../shared/controller/appContext';
import { Error400 } from '../../shared/errors/Error400';
import { Error401 } from '../../shared/errors/Error401';
import { Error404 } from '../../shared/errors/Error404';
import { auditLogCreate } from '../auditLog/auditLogCreate';
import { auditLogOperations } from '../auditLog/auditLogOperations';
import { filePopulateDownloadUrlInTree } from '../file/fileService';
import {
  courseFreeSampleDiagnosticAnswerInputSchema,
  courseFreeSampleDiagnosticParamsSchema,
  courseFreeSampleParamsSchema,
} from './courseFreeSampleSchemas';

const courseFreeSampleQuestionCount = 3;
const courseFreeSampleDiagnosticActiveStatus = 'sampleActive';
const courseFreeSampleDiagnosticCompletedStatus = 'sampleCompleted';
const learningOutcomesGeneralDomain = 'General';

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

const diagnosticAttemptInclude = {
  answers: {
    orderBy: { createdAt: 'asc' as const },
  },
} satisfies Prisma.CourseDiagnosticAttemptInclude;

type DiagnosticAttemptWithAnswers = Prisma.CourseDiagnosticAttemptGetPayload<{
  include: typeof diagnosticAttemptInclude;
}>;

type DiagnosticQuestionCandidate = {
  source: string;
  sourceQuestionId: string;
  questionText: string;
  answerOptions: string[];
  correctAnswerIndex: number;
  explanation?: string | null;
  difficulty: string;
  domain: string;
};

type DomainScore = {
  domain: string;
  correct: number;
  total: number;
  percent: number;
};

function requireCurrentUser(context: AppContext) {
  if (!context.currentUser) {
    throw new Error401();
  }

  return context.currentUser;
}

function courseFreeSampleHasPremiumAccess(course: {
  accessType?: string | null;
}) {
  return course.accessType === 'paid' || course.accessType === 'subscription';
}

async function courseFreeSamplePublishedCourse(
  id: string,
  context: AppContext,
) {
  const course = await prisma.course.findUnique({
    where: { id },
    select: {
      id: true,
      slug: true,
      title: true,
      accessType: true,
      status: true,
      safetyHold: true,
      lessons: {
        where: { isPreview: true, isHidden: false },
        orderBy: { orderIndex: 'asc' as const },
        take: 1,
        select: {
          id: true,
          title: true,
          description: true,
          videoFiles: true,
          videoUrl: true,
          resourceFiles: true,
          videoDurationSeconds: true,
          orderIndex: true,
          isPreview: true,
          isHidden: true,
          moduleId: true,
          blocks: {
            orderBy: { orderIndex: 'asc' as const },
          },
        },
      },
    },
  });

  if (!course || course.status !== 'published' || course.safetyHold) {
    throw new Error404();
  }

  if (!courseFreeSampleHasPremiumAccess(course)) {
    throw new Error400(context.dictionary.course.freeSample.errors.premiumOnly);
  }

  return course;
}

function jsonStringArray(value: unknown) {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.filter((item): item is string => typeof item === 'string');
}

function numberFromUnknown(value: unknown) {
  const numberValue = Number(value);
  return Number.isFinite(numberValue) ? numberValue : 0;
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

function diagnosticAttemptPayload(
  attempt: DiagnosticAttemptWithAnswers,
  revealAll = false,
) {
  const reveal =
    revealAll || attempt.status === courseFreeSampleDiagnosticCompletedStatus;

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

async function courseFreeSamplePracticeQuestions(courseId: string) {
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

async function courseFreeSampleDiagnosticQuestionCandidates(
  courseId: string,
  userId?: string | null,
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
    courseFreeSamplePracticeQuestions(courseId),
    userId
      ? prisma.courseDomainMastery.findMany({
          where: { courseId, userId },
          select: { domain: true, scorePercent: true },
        })
      : Promise.resolve([]),
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

async function courseFreeSampleDiagnosticState(
  courseId: string,
  userId?: string | null,
) {
  const candidates = await courseFreeSampleDiagnosticQuestionCandidates(
    courseId,
    userId,
  );
  const [activeAttempt, completedAttempt] = userId
    ? await Promise.all([
        prisma.courseDiagnosticAttempt.findFirst({
          where: {
            courseId,
            userId,
            status: courseFreeSampleDiagnosticActiveStatus,
          },
          orderBy: { startedAt: 'desc' },
          include: diagnosticAttemptInclude,
        }),
        prisma.courseDiagnosticAttempt.findFirst({
          where: {
            courseId,
            userId,
            status: courseFreeSampleDiagnosticCompletedStatus,
          },
          orderBy: { completedAt: 'desc' },
          include: diagnosticAttemptInclude,
        }),
      ])
    : [null, null];

  return {
    availableQuestions: candidates.length,
    sampleQuestionCount: Math.min(
      courseFreeSampleQuestionCount,
      candidates.length,
    ),
    activeAttempt: activeAttempt
      ? diagnosticAttemptPayload(activeAttempt)
      : null,
    completedAttempt: completedAttempt
      ? diagnosticAttemptPayload(completedAttempt, true)
      : null,
    canStart: Boolean(userId && candidates.length && !completedAttempt),
    requiresSignIn: !userId,
    sampleLimitReached: Boolean(completedAttempt),
  };
}

export async function courseFreeSampleController(
  params: unknown,
  context: AppContext,
) {
  const { id } = courseFreeSampleParamsSchema.parse(params);
  const course = await courseFreeSamplePublishedCourse(id, context);
  const previewLesson = course.lessons[0] || null;
  await filePopulateDownloadUrlInTree(previewLesson);

  return {
    course: {
      id: course.id,
      slug: course.slug,
      title: course.title,
      accessType: course.accessType,
    },
    previewLesson,
    diagnostic: await courseFreeSampleDiagnosticState(
      course.id,
      context.currentUser?.id,
    ),
  };
}

export async function courseFreeSampleDiagnosticStartController(
  params: unknown,
  context: AppContext,
) {
  const { id } = courseFreeSampleParamsSchema.parse(params);
  const currentUser = requireCurrentUser(context);
  const course = await courseFreeSamplePublishedCourse(id, context);
  const completedAttempt = await prisma.courseDiagnosticAttempt.findFirst({
    where: {
      courseId: course.id,
      userId: currentUser.id,
      status: courseFreeSampleDiagnosticCompletedStatus,
    },
    orderBy: { completedAt: 'desc' },
    include: diagnosticAttemptInclude,
  });

  if (completedAttempt) {
    return {
      attempt: diagnosticAttemptPayload(completedAttempt, true),
      sampleLimitReached: true,
    };
  }

  const activeAttempt = await prisma.courseDiagnosticAttempt.findFirst({
    where: {
      courseId: course.id,
      userId: currentUser.id,
      status: courseFreeSampleDiagnosticActiveStatus,
    },
    orderBy: { startedAt: 'desc' },
    include: diagnosticAttemptInclude,
  });

  if (activeAttempt) {
    return {
      attempt: diagnosticAttemptPayload(activeAttempt),
      sampleLimitReached: false,
    };
  }

  const candidates = await courseFreeSampleDiagnosticQuestionCandidates(
    course.id,
    currentUser.id,
  );
  const selectedQuestions = candidates.slice(0, courseFreeSampleQuestionCount);

  if (!selectedQuestions.length) {
    throw new Error400(context.dictionary.studentExperience.errors.noPractice);
  }

  const attempt = await prisma.$transaction(async (tx) => {
    const createdAttempt = await tx.courseDiagnosticAttempt.create({
      data: {
        courseId: course.id,
        userId: currentUser.id,
        memberId: context.currentMember?.id || null,
        status: courseFreeSampleDiagnosticActiveStatus,
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
    sampleLimitReached: false,
  };
}

export async function courseFreeSampleDiagnosticAnswerController(
  params: unknown,
  body: unknown,
  context: AppContext,
) {
  const { id, attemptId } =
    courseFreeSampleDiagnosticParamsSchema.parse(params);
  const data = courseFreeSampleDiagnosticAnswerInputSchema.parse(body);
  const currentUser = requireCurrentUser(context);
  await courseFreeSamplePublishedCourse(id, context);

  const attempt = await prisma.courseDiagnosticAttempt.findFirst({
    where: {
      id: attemptId,
      courseId: id,
      userId: currentUser.id,
      status: courseFreeSampleDiagnosticActiveStatus,
    },
    include: diagnosticAttemptInclude,
  });

  if (!attempt) {
    throw new Error404();
  }

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

export async function courseFreeSampleDiagnosticCompleteController(
  params: unknown,
  context: AppContext,
) {
  const { id, attemptId } =
    courseFreeSampleDiagnosticParamsSchema.parse(params);
  const currentUser = requireCurrentUser(context);
  const course = await courseFreeSamplePublishedCourse(id, context);
  const attempt = await prisma.courseDiagnosticAttempt.findFirst({
    where: {
      id: attemptId,
      courseId: course.id,
      userId: currentUser.id,
      status: {
        in: [
          courseFreeSampleDiagnosticActiveStatus,
          courseFreeSampleDiagnosticCompletedStatus,
        ],
      },
    },
    include: diagnosticAttemptInclude,
  });

  if (!attempt) {
    throw new Error404();
  }

  if (attempt.status === courseFreeSampleDiagnosticCompletedStatus) {
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
      status: courseFreeSampleDiagnosticCompletedStatus,
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

  return {
    attempt: diagnosticAttemptPayload(updatedAttempt, true),
  };
}
