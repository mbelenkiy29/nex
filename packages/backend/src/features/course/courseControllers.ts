import { randomBytes } from 'node:crypto';
import { Prisma } from '../../prisma/generated/client';
// bypass-RLS: marketplace course detail must show instructor info across
// org boundaries (Course has no organizationId). All non-marketplace reads
// scope ownership via explicit where: { userId / studentId } filters.
// eslint-disable-next-line no-restricted-syntax
import { prisma, prismaDangerouslyBypassRLS } from '../../prisma';
import { AppContext } from '../../shared/controller/appContext';
import { Error400 } from '../../shared/errors/Error400';
import { Error401 } from '../../shared/errors/Error401';
import { Error403 } from '../../shared/errors/Error403';
import { Error404 } from '../../shared/errors/Error404';
import { filePopulateDownloadUrlInTree } from '../file/fileService';
import { auditLogCreate } from '../auditLog/auditLogCreate';
import { auditLogOperations } from '../auditLog/auditLogOperations';
import { coursePaymentEnsureStripePrice } from './coursePaymentService';
import {
  authGuardPlatformAdminBackend,
  platformAdminIsUserAllowed,
} from '../platformAdmin/platformAdminGuard';
import {
  CourseContentManageInput,
  courseAssignmentSubmissionInputSchema,
  courseAssignmentSubmissionReviewInputSchema,
  courseAutocompleteInputSchema,
  courseCompareInputSchema,
  courseEnrollmentManageInputSchema,
  courseListInputSchema,
  courseManageInputSchema,
  courseQuizAttemptInputSchema,
  coursePracticeExamSubmitSchema,
  courseRatingInputSchema,
  courseReviewInputSchema,
  courseWishlistCreateInputSchema,
} from './courseSchemas';
import {
  trustSafetyAssertCourseCanPublish,
  trustSafetyRequirePolicyAcceptance,
} from '../trustSafety/trustSafetyService';
import {
  courseReviewDecisionCreate,
  courseReviewDecisionFindMany,
} from './courseReviewDecisionService';

const defaultTake = 25;
const catalogTake = 50;
const aiContextMaxLength = 20000;
const catalogMaxCandidates = 500;

export const courseInclude = {
  modules: {
    orderBy: { orderIndex: 'asc' as const },
    include: {
      lessons: { orderBy: { orderIndex: 'asc' as const } },
      assignments: { orderBy: { orderIndex: 'asc' as const } },
    },
  },
  lessons: {
    orderBy: { orderIndex: 'asc' as const },
    include: {
      assignments: { orderBy: { orderIndex: 'asc' as const } },
      blocks: { orderBy: { orderIndex: 'asc' as const } },
    },
  },
  assignments: {
    orderBy: { orderIndex: 'asc' as const },
    include: {
      submissions: { orderBy: { submittedAt: 'desc' as const } },
    },
  },
  quizzes: {
    orderBy: { orderIndex: 'asc' as const },
    include: {
      questions: {
        orderBy: { orderIndex: 'asc' as const },
        include: {
          question: {
            include: {
              answers: { orderBy: { orderIndex: 'asc' as const } },
            },
          },
        },
      },
    },
  },
  questions: {
    orderBy: { createdAt: 'asc' as const },
    include: { answers: { orderBy: { orderIndex: 'asc' as const } } },
  },
  practiceExams: {
    orderBy: { orderIndex: 'asc' as const },
    include: { rules: { orderBy: { orderIndex: 'asc' as const } } },
  },
  outcomes: { orderBy: { orderIndex: 'asc' as const } },
  requirements: { orderBy: { orderIndex: 'asc' as const } },
  flashcardSets: {
    orderBy: { orderIndex: 'asc' as const },
    include: { cards: { orderBy: { orderIndex: 'asc' as const } } },
  },
  enrollments: {
    orderBy: { enrolledAt: 'desc' as const },
  },
} satisfies Prisma.CourseInclude;

function requireSignedIn(context: AppContext) {
  if (!context.currentUser) {
    throw new Error401();
  }

  return { currentUser: context.currentUser };
}

function isPlatformAdmin(context: AppContext) {
  return platformAdminIsUserAllowed(context.currentUser?.email);
}

function slugify(value: string) {
  const slug = value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

  return slug || 'course';
}

export async function courseUniqueSlug(
  title: string,
  requestedSlug?: string | null,
  id?: string,
) {
  const base = slugify(requestedSlug || title);
  let slug = base;
  let index = 2;

  while (true) {
    const existing = await prisma.course.findUnique({
      where: { slug },
      select: { id: true },
    });

    if (!existing || existing.id === id) {
      return slug;
    }

    slug = `${base}-${index}`;
    index += 1;
  }
}

export function normalizeNullableString(value?: string | null) {
  const normalized = value?.trim();
  return normalized || null;
}

type RubricCriterion = {
  id: string;
  title: string;
  description: string | null;
  maxPoints: number;
  orderIndex: number;
};

function courseAssignmentRubricCriteria(
  value: Prisma.JsonValue | null | undefined,
): RubricCriterion[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .map((item): RubricCriterion | null => {
      if (!item || typeof item !== 'object' || Array.isArray(item)) {
        return null;
      }

      const record = item as Record<string, unknown>;
      const maxPoints = Number(record.maxPoints);

      if (
        typeof record.id !== 'string' ||
        typeof record.title !== 'string' ||
        !Number.isFinite(maxPoints)
      ) {
        return null;
      }

      return {
        id: record.id,
        title: record.title,
        description:
          typeof record.description === 'string' ? record.description : null,
        maxPoints,
        orderIndex: Number(record.orderIndex) || 0,
      };
    })
    .filter((item): item is RubricCriterion => Boolean(item))
    .sort((a, b) => a.orderIndex - b.orderIndex);
}

function courseAssignmentRubricScorePayload({
  rubric,
  rubricScores,
  context,
}: {
  rubric: Prisma.JsonValue | null | undefined;
  rubricScores: Array<{
    criterionId: string;
    score: number;
    feedback?: string | null;
  }>;
  context: AppContext;
}) {
  const criteria = courseAssignmentRubricCriteria(rubric);

  if (!criteria.length) {
    return { rubricScores: null, score: null, maxScore: null };
  }

  const criteriaById = new Map(criteria.map((item) => [item.id, item]));
  const normalizedScores = rubricScores.map((item) => {
    const criterion = criteriaById.get(item.criterionId);

    if (!criterion || item.score > criterion.maxPoints) {
      throw new Error400(context.dictionary.course.errors.invalidRubricScore);
    }

    return {
      criterionId: item.criterionId,
      score: item.score,
      feedback: normalizeNullableString(item.feedback),
    };
  });
  const submittedScoresByCriterion = new Map(
    normalizedScores.map((item) => [item.criterionId, item.score]),
  );
  const score = criteria.reduce(
    (total, criterion) =>
      total + (submittedScoresByCriterion.get(criterion.id) || 0),
    0,
  );
  const maxScore = criteria.reduce(
    (total, criterion) => total + criterion.maxPoints,
    0,
  );

  return {
    rubricScores: normalizedScores as Prisma.InputJsonValue,
    score,
    maxScore,
  };
}

// Looks up a CourseCategory by id to mirror its `name` into the legacy
// `Course.category` String column. Returns `undefined` when the caller
// didn't supply a categoryId (skip mirror), `null` when explicitly clearing.
async function resolveCategoryNameMirror(
  tx: {
    courseCategory: {
      findUnique: (args: {
        where: { id: string };
        select: { name: true };
      }) => Promise<{ name: string } | null>;
    };
  },
  categoryId: string | null | undefined,
): Promise<string | null | undefined> {
  if (categoryId === undefined) {
    return undefined;
  }
  if (categoryId === null) {
    return null;
  }
  const row = await tx.courseCategory.findUnique({
    where: { id: categoryId },
    select: { name: true },
  });
  return row?.name ?? null;
}

function courseBaseData(
  data: ReturnType<typeof courseManageInputSchema.parse>,
  options?: { categoryNameMirror?: string | null },
) {
  const publishedAt = data.status === 'published' ? new Date() : null;

  // When a categoryId is supplied, the resolved CourseCategory.name overrides
  // the freeform `category` string so the legacy column stays in lock-step
  // with the FK.
  const category =
    options?.categoryNameMirror !== undefined
      ? options.categoryNameMirror
      : normalizeNullableString(data.category);

  return {
    title: data.title,
    subtitle: normalizeNullableString(data.subtitle),
    description: normalizeNullableString(data.description),
    category,
    categoryId: data.categoryId ?? null,
    examType: normalizeNullableString(data.examType),
    thumbnail: data.thumbnail as Prisma.InputJsonValue,
    introVideoFiles: data.introVideoFiles as Prisma.InputJsonValue,
    promoVideoFiles: data.promoVideoFiles as Prisma.InputJsonValue,
    difficulty: normalizeNullableString(data.difficulty),
    language: normalizeNullableString(data.language),
    visibility: data.visibility,
    audience: data.audience,
    status: data.status,
    accessType: data.accessType,
    priceCents: data.priceCents ?? null,
    certificateEnabled: data.certificateEnabled,
    currency: data.currency || 'USD',
    stripePriceId: normalizeNullableString(data.stripePriceId),
    subscriptionPlanKey: normalizeNullableString(data.subscriptionPlanKey),
    creatorRevenueShareBps: data.creatorRevenueShareBps,
    nexVerified: data.nexVerified,
    creatorUserId: data.creatorUserId,
    creatorMemberId: data.creatorMemberId,
    creatorOrganizationId: data.creatorOrganizationId,
    publishedAt,
  };
}

function stripProtectedCourseFiles(course: any) {
  const cleaned = structuredClone(course);
  const stripLesson = (lesson: any) => {
    lesson.videoFiles = null;
    lesson.resourceFiles = null;
  };
  for (const lesson of cleaned.lessons || []) {
    stripLesson(lesson);
  }
  for (const module of cleaned.modules || []) {
    for (const lesson of module.lessons || []) {
      stripLesson(lesson);
    }
  }
  return cleaned;
}

// Removes correct-answer data (isCorrect flags + explanations) from quiz
// questions so it never reaches a student before they submit an attempt.
// Builder/preview/admin payloads deliberately skip this — the owner sees all.
function stripQuizAnswers(course: any) {
  const cleaned = structuredClone(course);
  // The raw question bank (with answer keys) must never reach a student.
  delete cleaned.questions;
  for (const quiz of cleaned.quizzes || []) {
    for (const link of quiz.questions || []) {
      const question = link.question;
      if (!question) {
        continue;
      }
      question.explanation = null;
      for (const answer of question.answers || []) {
        delete answer.isCorrect;
        delete answer.explanation;
        delete answer.matchText;
      }
    }
  }
  return cleaned;
}

function stripAssignmentSubmissionHistory(course: any) {
  const cleaned = structuredClone(course);
  for (const assignment of cleaned.assignments || []) {
    delete assignment.submissions;
  }
  return cleaned;
}

function courseCreatorUserIds(courses: Array<any>) {
  return Array.from(
    new Set(
      courses
        .map((course) => course.creatorUserId)
        .filter((id): id is string => Boolean(id)),
    ),
  );
}

async function withCourseCreators(courses: Array<any>) {
  const creatorIds = courseCreatorUserIds(courses);
  const creators = creatorIds.length
    ? await prismaDangerouslyBypassRLS.user.findMany({
        where: { id: { in: creatorIds } },
        select: { id: true, name: true, email: true, image: true },
      })
    : [];
  const creatorsById = new Map(
    creators.map((creator) => [creator.id, creator]),
  );

  return courses.map((course) => ({
    ...course,
    creatorUser: course.creatorUserId
      ? creatorsById.get(course.creatorUserId) || null
      : null,
  }));
}

async function withCourseRatingSummaries(
  courses: Array<any>,
  currentUserId?: string | null,
) {
  const courseIds = courses
    .map((course) => course.id)
    .filter((id): id is string => Boolean(id));

  if (!courseIds.length) {
    return courses;
  }

  const [ratingGroups, currentUserRatings] = await Promise.all([
    prisma.courseRating.groupBy({
      by: ['courseId'],
      where: { courseId: { in: courseIds }, isPublic: true },
      _avg: { rating: true },
      _count: { _all: true },
    }),
    currentUserId
      ? prisma.courseRating.findMany({
          where: { courseId: { in: courseIds }, userId: currentUserId },
        })
      : Promise.resolve([]),
  ]);
  const ratingByCourseId = new Map(
    ratingGroups.map((group) => [
      group.courseId,
      {
        average: Math.round(Number(group._avg.rating || 0) * 10) / 10,
        count: group._count._all,
      },
    ]),
  );
  const currentRatingByCourseId = new Map(
    currentUserRatings.map((rating) => [rating.courseId, rating]),
  );

  return courses.map((course) => ({
    ...course,
    ratingSummary: ratingByCourseId.get(course.id) || {
      average: 0,
      count: 0,
    },
    myRating: currentRatingByCourseId.get(course.id) || null,
  }));
}

function courseDurationSeconds(course: any) {
  const total = (course.lessons || []).reduce(
    (sum: number, lesson: { videoDurationSeconds?: number | null }) =>
      sum + (lesson.videoDurationSeconds || 0),
    0,
  );

  return total || null;
}

function courseDurationBucketMatches(
  durationSeconds: number | null,
  bucket?: string | null,
) {
  if (!bucket) {
    return true;
  }
  if (!durationSeconds) {
    return false;
  }

  const hours = durationSeconds / 3600;

  if (bucket === 'short') {
    return hours < 2;
  }
  if (bucket === 'medium') {
    return hours >= 2 && hours <= 8;
  }
  if (bucket === 'long') {
    return hours > 8;
  }

  return true;
}

function courseTrendingScore(course: any) {
  const ratingAverage = course.ratingSummary?.average ?? 0;
  const ratingCount = course.ratingSummary?.count ?? 0;
  const enrollmentCount =
    course.enrollments?.length ?? course.counts?.enrollments ?? 0;
  const publishedAt = new Date(
    course.publishedAt ?? course.createdAt,
  ).getTime();
  const ageDays = Number.isFinite(publishedAt)
    ? Math.max(0, (Date.now() - publishedAt) / 86_400_000)
    : 365;
  const recencyBoost = Math.max(0, 30 - ageDays) / 30;

  return (
    (course.nexVerified ? 20 : 0) +
    ratingAverage * 12 +
    Math.log10(ratingCount + 1) * 10 +
    Math.log10(enrollmentCount + 1) * 8 +
    recencyBoost * 10
  );
}

async function courseSavedIdsForUser(userId?: string | null) {
  if (!userId) {
    return new Set<string>();
  }

  const items = await prisma.courseWishlistItem.findMany({
    where: { userId },
    select: { courseId: true },
  });

  return new Set(items.map((item) => item.courseId));
}

async function courseEnrolledIdsForUser(userId?: string | null) {
  if (!userId) {
    return new Set<string>();
  }

  const enrollments = await prisma.courseEnrollment.findMany({
    where: {
      userId,
      status: { in: ['active', 'completed'] },
    },
    select: { courseId: true },
  });

  return new Set(enrollments.map((item) => item.courseId));
}

function courseMarketplacePayload(
  course: any,
  savedCourseIds: Set<string>,
  enrolledCourseIds: Set<string>,
) {
  const durationSeconds = courseDurationSeconds(course);
  const modules = course.modules || [];
  const lessons = course.lessons || [];
  const assignments = course.assignments || [];
  const enrollments = course.enrollments || [];
  const quizzes = course.quizzes || [];
  const practiceExams = course.practiceExams || [];

  return {
    ...course,
    durationSeconds,
    isSaved: savedCourseIds.has(course.id),
    isEnrolled: enrolledCourseIds.has(course.id),
    socialProof: {
      enrollmentCount: enrollments.length,
      ratingAverage: course.ratingSummary?.average ?? 0,
      ratingCount: course.ratingSummary?.count ?? 0,
    },
    counts: {
      modules: modules.length,
      lessons: lessons.length,
      assignments: assignments.length,
      enrollments: enrollments.length,
      quizzes: quizzes.length,
      practiceExams: practiceExams.length,
    },
    modules: undefined,
    lessons: undefined,
    assignments: undefined,
    enrollments: undefined,
    quizzes: undefined,
    practiceExams: undefined,
  };
}

async function courseHydrateMarketplaceCourses(
  courses: Array<any>,
  currentUserId?: string | null,
) {
  const [coursesWithCreators, savedCourseIds, enrolledCourseIds] =
    await Promise.all([
      withCourseCreators(courses),
      courseSavedIdsForUser(currentUserId),
      courseEnrolledIdsForUser(currentUserId),
    ]);
  const coursesWithRatings = await withCourseRatingSummaries(
    coursesWithCreators,
    currentUserId,
  );

  return coursesWithRatings.map((course) =>
    courseMarketplacePayload(course, savedCourseIds, enrolledCourseIds),
  );
}

async function courseDefaultWishlist(context: AppContext) {
  const { currentUser } = requireSignedIn(context);
  const existing = await prisma.courseWishlist.findFirst({
    where: { userId: currentUser.id, isDefault: true },
  });

  if (existing) {
    return existing;
  }

  const wishlist = await prisma.courseWishlist.create({
    data: {
      userId: currentUser.id,
      isDefault: true,
      name: context.dictionary.course.marketplace.savedDefaultName,
    },
  });

  await auditLogCreate({
    entityId: wishlist.id,
    entityName: 'CourseWishlist',
    operation: auditLogOperations.create,
    organizationId: null,
    userId: currentUser.id,
    memberId: context.currentMember?.id || null,
    newData: wishlist,
  });

  return wishlist;
}

export async function withCourseSubmissionUsers<T>(course: T) {
  const submissions =
    (course as any).assignments?.flatMap(
      (assignment: any) => assignment.submissions || [],
    ) || [];
  const userIds: string[] = Array.from(
    new Set(
      submissions
        .map((submission: any) => submission.userId)
        .filter((id: unknown): id is string => typeof id === 'string'),
    ),
  );
  const users = userIds.length
    ? await prismaDangerouslyBypassRLS.user.findMany({
        where: { id: { in: userIds } },
        select: { id: true, name: true, email: true, image: true },
      })
    : [];
  const usersById = new Map(users.map((user) => [user.id, user]));

  for (const submission of submissions) {
    submission.studentUser = usersById.get(submission.userId) || null;
  }

  return course;
}

async function courseFindEnrollment(courseId: string, userId: string) {
  return await prisma.courseEnrollment.findFirst({
    where: {
      courseId,
      userId,
      status: { in: ['active', 'completed'] },
    },
  });
}

function courseCertificateCode() {
  return randomBytes(10).toString('hex').toUpperCase();
}

async function courseMaybeCompleteEnrollment({
  course,
  userId,
  context,
}: {
  course: any;
  userId: string;
  context: AppContext;
}) {
  const enrollment = await prisma.courseEnrollment.findUnique({
    where: { courseId_userId: { courseId: course.id, userId } },
  });

  if (!enrollment) {
    return { enrollment: null, certificate: null };
  }

  const requiredLessonIds = (course.lessons || [])
    .filter((lesson: { isHidden?: boolean | null }) => !lesson.isHidden)
    .map((lesson: { id: string }) => lesson.id);

  if (!requiredLessonIds.length) {
    return { enrollment, certificate: null };
  }

  const completedLessons = await prisma.courseLessonProgress.findMany({
    where: {
      courseId: course.id,
      userId,
      lessonId: { in: requiredLessonIds },
    },
    select: { lessonId: true },
  });

  const completedLessonIds = new Set(
    completedLessons.map((item) => item.lessonId),
  );

  if (
    !requiredLessonIds.every((lessonId: string) =>
      completedLessonIds.has(lessonId),
    )
  ) {
    return { enrollment, certificate: null };
  }

  let completedEnrollment = enrollment;

  if (!enrollment.completedAt || enrollment.status !== 'completed') {
    completedEnrollment = await prisma.courseEnrollment.update({
      where: { id: enrollment.id },
      data: {
        status: 'completed',
        completedAt: enrollment.completedAt || new Date(),
      },
    });

    await auditLogCreate({
      entityId: completedEnrollment.id,
      entityName: 'CourseEnrollment',
      operation: auditLogOperations.update,
      organizationId: null,
      userId,
      memberId: context.currentMember?.id || null,
      oldData: enrollment,
      newData: completedEnrollment,
    });
  }

  if (!course.certificateEnabled) {
    return { enrollment: completedEnrollment, certificate: null };
  }

  const existingCertificate = await prisma.courseCertificate.findUnique({
    where: { enrollmentId: completedEnrollment.id },
  });

  if (existingCertificate) {
    return {
      enrollment: completedEnrollment,
      certificate: existingCertificate,
    };
  }

  const certificate = await prisma.courseCertificate.create({
    data: {
      courseId: course.id,
      enrollmentId: completedEnrollment.id,
      userId,
      certificateNumber: `NEX-${Date.now()}-${courseCertificateCode().slice(0, 6)}`,
      verificationCode: courseCertificateCode(),
      metadata: {
        courseTitle: course.title,
        completedAt: completedEnrollment.completedAt?.toISOString(),
      },
    },
  });

  await auditLogCreate({
    entityId: certificate.id,
    entityName: 'CourseCertificate',
    operation: auditLogOperations.create,
    organizationId: null,
    userId,
    memberId: context.currentMember?.id || null,
    newData: certificate,
  });

  return { enrollment: completedEnrollment, certificate };
}

export async function courseEnsureLearningAccess(
  courseId: string,
  context: AppContext,
) {
  const { currentUser } = requireSignedIn(context);
  const course = await prisma.course.findUnique({
    where: { id: courseId },
    include: courseInclude,
  });

  if (!course) {
    throw new Error404();
  }

  if (isPlatformAdmin(context)) {
    return { course, enrollment: null };
  }

  if (course.status !== 'published' || course.safetyHold) {
    throw new Error404();
  }

  const enrollment = await courseFindEnrollment(course.id, currentUser.id);

  if (!enrollment) {
    throw new Error403();
  }

  return { course, enrollment };
}

export async function courseCatalogController(
  query: unknown,
  context: AppContext,
) {
  const data = courseListInputSchema.parse(query);
  const search = data.filter?.search?.trim();
  const categoryId = data.filter?.categoryId?.trim();
  const category = data.filter?.category?.trim();
  const examType = data.filter?.examType?.trim();
  const difficulty = data.filter?.difficulty?.trim();
  const language = data.filter?.language?.trim();
  const durationBucket = data.filter?.durationBucket?.trim();
  const creatorId = data.filter?.creatorId?.trim();
  const priceBucket = data.filter?.priceBucket as
    | 'free'
    | 'paid'
    | 'any'
    | undefined;
  const verifiedOnly = data.filter?.verifiedOnly === true;
  const sort =
    (data.filter?.sort as
      | 'trending'
      | 'topRated'
      | 'newest'
      | 'mostPopular'
      | 'priceAsc'
      | 'priceDesc'
      | 'durationAsc'
      | undefined) ?? 'trending';
  const minRating =
    typeof data.filter?.minRating === 'number'
      ? data.filter.minRating
      : data.filter?.minRating
        ? Number(data.filter.minRating)
        : 0;
  const whereAnd: Array<Prisma.CourseWhereInput> = [
    { status: 'published', safetyHold: false },
  ];

  if (search) {
    whereAnd.push({
      OR: [
        { title: { contains: search, mode: 'insensitive' } },
        { subtitle: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { category: { contains: search, mode: 'insensitive' } },
        { examType: { contains: search, mode: 'insensitive' } },
      ],
    });
  }

  if (categoryId) {
    whereAnd.push({ categoryId });
  } else if (category) {
    whereAnd.push({ category: { equals: category, mode: 'insensitive' } });
  }

  if (examType) {
    whereAnd.push({ examType: { equals: examType, mode: 'insensitive' } });
  }

  if (difficulty) {
    whereAnd.push({ difficulty: { equals: difficulty, mode: 'insensitive' } });
  }

  if (language) {
    whereAnd.push({ language: { equals: language, mode: 'insensitive' } });
  }

  if (creatorId) {
    whereAnd.push({ creatorUserId: creatorId });
  }

  if (priceBucket === 'free') {
    whereAnd.push({ accessType: 'free' });
  } else if (priceBucket === 'paid') {
    whereAnd.push({ accessType: { in: ['paid', 'subscription', 'manual'] } });
  }

  if (verifiedOnly) {
    whereAnd.push({ nexVerified: true });
  }

  const orderBy: Prisma.CourseOrderByWithRelationInput[] =
    sort === 'newest'
      ? [{ publishedAt: 'desc' }]
      : [{ nexVerified: 'desc' }, { publishedAt: 'desc' }];

  const where: Prisma.CourseWhereInput = { AND: whereAnd };
  const [courses, categories, facetRows, featuredRaw, bundleRows] =
    await Promise.all([
      prisma.course.findMany({
        where,
        include: {
          modules: { select: { id: true } },
          lessons: { select: { id: true, videoDurationSeconds: true } },
          assignments: { select: { id: true } },
          enrollments: { select: { id: true } },
          quizzes: { select: { id: true } },
          practiceExams: { select: { id: true } },
        },
        orderBy,
        take: catalogMaxCandidates,
      }),
      prisma.courseCategory.findMany({
        where: { isActive: true },
        select: {
          id: true,
          slug: true,
          name: true,
          description: true,
          iconName: true,
          displayOrder: true,
        },
        orderBy: [{ displayOrder: 'asc' }, { name: 'asc' }],
      }),
      prisma.course.findMany({
        where: { status: 'published', safetyHold: false },
        select: {
          examType: true,
          difficulty: true,
          language: true,
          accessType: true,
          priceCents: true,
          lessons: { select: { videoDurationSeconds: true } },
        },
        take: catalogMaxCandidates,
      }),
      prisma.course.findMany({
        where: { status: 'published', safetyHold: false, nexVerified: true },
        include: {
          modules: { select: { id: true } },
          lessons: { select: { id: true, videoDurationSeconds: true } },
          assignments: { select: { id: true } },
          enrollments: { select: { id: true } },
          quizzes: { select: { id: true } },
          practiceExams: { select: { id: true } },
        },
        orderBy: { publishedAt: 'desc' },
        take: 12,
      }),
      prisma.courseBundle.findMany({
        where: { status: 'published' },
        include: {
          courses: {
            orderBy: { orderIndex: 'asc' },
            include: {
              course: {
                select: {
                  id: true,
                  title: true,
                  slug: true,
                  thumbnail: true,
                  status: true,
                  safetyHold: true,
                },
              },
            },
          },
        },
        orderBy: [{ publishedAt: 'desc' }, { createdAt: 'desc' }],
        take: 6,
      }),
    ]);

  const hydratedCourses = await courseHydrateMarketplaceCourses(
    courses,
    context.currentUser?.id,
  );
  let final = hydratedCourses.filter((course) =>
    courseDurationBucketMatches(course.durationSeconds, durationBucket),
  );
  if (minRating > 0) {
    final = final.filter((c) => (c.ratingSummary?.average ?? 0) >= minRating);
  }

  if (sort === 'topRated') {
    final = [...final].sort((a, b) => {
      const avgA = a.ratingSummary?.average ?? 0;
      const avgB = b.ratingSummary?.average ?? 0;
      if (avgA !== avgB) return avgB - avgA;
      const countA = a.ratingSummary?.count ?? 0;
      const countB = b.ratingSummary?.count ?? 0;
      return countB - countA;
    });
  } else if (sort === 'mostPopular') {
    final = [...final].sort(
      (a, b) =>
        (b.socialProof?.enrollmentCount ?? 0) -
        (a.socialProof?.enrollmentCount ?? 0),
    );
  } else if (sort === 'priceAsc') {
    final = [...final].sort(
      (a, b) => (a.priceCents ?? 0) - (b.priceCents ?? 0),
    );
  } else if (sort === 'priceDesc') {
    final = [...final].sort(
      (a, b) => (b.priceCents ?? 0) - (a.priceCents ?? 0),
    );
  } else if (sort === 'durationAsc') {
    final = [...final].sort(
      (a, b) => (a.durationSeconds ?? 0) - (b.durationSeconds ?? 0),
    );
  } else if (sort === 'trending') {
    final = [...final].sort(
      (a, b) => courseTrendingScore(b) - courseTrendingScore(a),
    );
  }

  const featuredWithRatings = await courseHydrateMarketplaceCourses(
    featuredRaw,
    context.currentUser?.id,
  );
  const featured = [...featuredWithRatings]
    .sort((a, b) => courseTrendingScore(b) - courseTrendingScore(a))
    .slice(0, 3);

  const skip = data.skip || 0;
  const take = data.take || catalogTake;
  const pageCourses = final.slice(skip, skip + take);
  const durationBuckets = new Set(
    facetRows
      .map((course) => {
        const duration = courseDurationSeconds(course);
        if (!duration) return null;
        const hours = duration / 3600;
        if (hours < 2) return 'short';
        if (hours <= 8) return 'medium';
        return 'long';
      })
      .filter((value): value is 'short' | 'medium' | 'long' => Boolean(value)),
  );
  const uniqueSorted = (values: Array<string | null>) =>
    Array.from(
      new Set(values.map((value) => value?.trim()).filter(Boolean) as string[]),
    ).sort((a, b) => a.localeCompare(b));

  return {
    count: final.length,
    categories,
    facets: {
      examTypes: uniqueSorted(facetRows.map((course) => course.examType)),
      difficulties: uniqueSorted(facetRows.map((course) => course.difficulty)),
      languages: uniqueSorted(facetRows.map((course) => course.language)),
      durationBuckets: Array.from(durationBuckets),
      priceBuckets: uniqueSorted(facetRows.map((course) => course.accessType)),
    },
    featured,
    bundles: bundleRows.map((bundle) => ({
      ...bundle,
      counts: { courses: bundle.courses.length },
      courses: bundle.courses
        .map((item) => item.course)
        .filter(
          (course) => course.status === 'published' && !course.safetyHold,
        ),
    })),
    courses: pageCourses,
  };
}

export async function courseCompareController(
  query: unknown,
  context: AppContext,
) {
  const { ids } = courseCompareInputSchema.parse(query);

  if (!ids.length) {
    return { courses: [] };
  }

  const courses = await prisma.course.findMany({
    where: {
      id: { in: ids },
      status: 'published',
      safetyHold: false,
    },
    include: {
      modules: { select: { id: true } },
      lessons: { select: { id: true, videoDurationSeconds: true } },
      assignments: { select: { id: true } },
      enrollments: { select: { id: true } },
      quizzes: { select: { id: true } },
      practiceExams: { select: { id: true } },
    },
  });
  const hydrated = await courseHydrateMarketplaceCourses(
    courses,
    context.currentUser?.id,
  );
  const byId = new Map(hydrated.map((course) => [course.id, course]));

  return {
    courses: ids.map((id) => byId.get(id)).filter(Boolean),
  };
}

export async function courseWishlistsController(context: AppContext) {
  const { currentUser } = requireSignedIn(context);
  await courseDefaultWishlist(context);

  const wishlists = await prisma.courseWishlist.findMany({
    where: { userId: currentUser.id },
    include: {
      items: {
        orderBy: { createdAt: 'desc' },
        include: {
          course: {
            include: {
              modules: { select: { id: true } },
              lessons: { select: { id: true, videoDurationSeconds: true } },
              assignments: { select: { id: true } },
              enrollments: { select: { id: true } },
              quizzes: { select: { id: true } },
              practiceExams: { select: { id: true } },
            },
          },
        },
      },
    },
    orderBy: [{ isDefault: 'desc' }, { createdAt: 'asc' }],
  });
  const courses = wishlists.flatMap((wishlist) =>
    wishlist.items
      .map((item) => item.course)
      .filter((course) => course.status === 'published' && !course.safetyHold),
  );
  const hydratedCourses = await courseHydrateMarketplaceCourses(
    courses,
    currentUser.id,
  );
  const courseById = new Map(
    hydratedCourses.map((course) => [course.id, course]),
  );

  return {
    wishlists: wishlists.map((wishlist) => ({
      ...wishlist,
      items: wishlist.items
        .map((item) => ({
          ...item,
          course: courseById.get(item.courseId) || null,
        }))
        .filter((item) => item.course),
    })),
  };
}

export async function courseWishlistCreateController(
  body: unknown,
  context: AppContext,
) {
  const { currentUser } = requireSignedIn(context);
  const data = courseWishlistCreateInputSchema.parse(body);

  const wishlist = await prisma.courseWishlist.create({
    data: { userId: currentUser.id, name: data.name, isDefault: false },
  });

  await auditLogCreate({
    entityId: wishlist.id,
    entityName: 'CourseWishlist',
    operation: auditLogOperations.create,
    organizationId: null,
    userId: currentUser.id,
    memberId: context.currentMember?.id || null,
    newData: wishlist,
  });

  return { wishlist };
}

export async function courseSaveController(
  params: { id: string },
  context: AppContext,
) {
  const { currentUser } = requireSignedIn(context);
  const course = await prisma.course.findUnique({ where: { id: params.id } });

  if (!course || course.status !== 'published' || course.safetyHold) {
    throw new Error404();
  }

  const wishlist = await courseDefaultWishlist(context);
  const existing = await prisma.courseWishlistItem.findFirst({
    where: {
      userId: currentUser.id,
      wishlistId: wishlist.id,
      courseId: course.id,
    },
  });

  if (existing) {
    return { saved: true, item: existing };
  }

  const item = await prisma.courseWishlistItem.create({
    data: {
      userId: currentUser.id,
      wishlistId: wishlist.id,
      courseId: course.id,
    },
  });

  await auditLogCreate({
    entityId: item.id,
    entityName: 'CourseWishlistItem',
    operation: auditLogOperations.create,
    organizationId: null,
    userId: currentUser.id,
    memberId: context.currentMember?.id || null,
    newData: item,
  });

  return { saved: true, item };
}

export async function courseWishlistItemAddController(
  params: { wishlistId: string; courseId: string },
  context: AppContext,
) {
  const { currentUser } = requireSignedIn(context);
  const [wishlist, course] = await Promise.all([
    prisma.courseWishlist.findFirst({
      where: { id: params.wishlistId, userId: currentUser.id },
    }),
    prisma.course.findUnique({ where: { id: params.courseId } }),
  ]);

  if (
    !wishlist ||
    !course ||
    course.status !== 'published' ||
    course.safetyHold
  ) {
    throw new Error404();
  }

  const existing = await prisma.courseWishlistItem.findFirst({
    where: {
      wishlistId: wishlist.id,
      courseId: course.id,
      userId: currentUser.id,
    },
  });

  if (existing) {
    return { item: existing };
  }

  const item = await prisma.courseWishlistItem.create({
    data: {
      userId: currentUser.id,
      wishlistId: wishlist.id,
      courseId: course.id,
    },
  });

  await auditLogCreate({
    entityId: item.id,
    entityName: 'CourseWishlistItem',
    operation: auditLogOperations.create,
    organizationId: null,
    userId: currentUser.id,
    memberId: context.currentMember?.id || null,
    newData: item,
  });

  return { item };
}

export async function courseWishlistItemRemoveController(
  params: { wishlistId: string; courseId: string },
  context: AppContext,
) {
  const { currentUser } = requireSignedIn(context);
  const items = await prisma.courseWishlistItem.findMany({
    where: {
      wishlistId: params.wishlistId,
      courseId: params.courseId,
      userId: currentUser.id,
    },
  });

  await prisma.courseWishlistItem.deleteMany({
    where: {
      wishlistId: params.wishlistId,
      courseId: params.courseId,
      userId: currentUser.id,
    },
  });

  await Promise.all(
    items.map((item) =>
      auditLogCreate({
        entityId: item.id,
        entityName: 'CourseWishlistItem',
        operation: auditLogOperations.delete,
        organizationId: null,
        userId: currentUser.id,
        memberId: context.currentMember?.id || null,
        oldData: item,
      }),
    ),
  );

  return { removed: true };
}

export async function courseUnsaveController(
  params: { id: string },
  context: AppContext,
) {
  const { currentUser } = requireSignedIn(context);
  const items = await prisma.courseWishlistItem.findMany({
    where: { userId: currentUser.id, courseId: params.id },
  });

  await prisma.courseWishlistItem.deleteMany({
    where: { userId: currentUser.id, courseId: params.id },
  });

  await Promise.all(
    items.map((item) =>
      auditLogCreate({
        entityId: item.id,
        entityName: 'CourseWishlistItem',
        operation: auditLogOperations.delete,
        organizationId: null,
        userId: currentUser.id,
        memberId: context.currentMember?.id || null,
        oldData: item,
      }),
    ),
  );

  return { saved: false };
}

export async function courseCreatorProfileController(
  params: { creatorId: string },
  context: AppContext,
) {
  const [creator, courses, bundles] = await Promise.all([
    prismaDangerouslyBypassRLS.user.findUnique({
      where: { id: params.creatorId },
      select: { id: true, name: true, image: true },
    }),
    prisma.course.findMany({
      where: {
        creatorUserId: params.creatorId,
        status: 'published',
        safetyHold: false,
      },
      include: {
        modules: { select: { id: true } },
        lessons: { select: { id: true, videoDurationSeconds: true } },
        assignments: { select: { id: true } },
        enrollments: { select: { id: true } },
        quizzes: { select: { id: true } },
        practiceExams: { select: { id: true } },
      },
      orderBy: [{ nexVerified: 'desc' }, { publishedAt: 'desc' }],
      take: 24,
    }),
    prisma.courseBundle.findMany({
      where: { creatorUserId: params.creatorId, status: 'published' },
      include: {
        courses: {
          orderBy: { orderIndex: 'asc' },
          include: { course: true },
        },
      },
      orderBy: [{ publishedAt: 'desc' }, { createdAt: 'desc' }],
      take: 12,
    }),
  ]);

  if (!creator) {
    throw new Error404();
  }

  const hydratedCourses = await courseHydrateMarketplaceCourses(
    courses,
    context.currentUser?.id,
  );
  const ratingCount = hydratedCourses.reduce(
    (total, course) => total + (course.ratingSummary?.count ?? 0),
    0,
  );
  const ratingTotal = hydratedCourses.reduce(
    (total, course) =>
      total +
      (course.ratingSummary?.average ?? 0) * (course.ratingSummary?.count ?? 0),
    0,
  );

  return {
    creator: {
      ...creator,
      verified: hydratedCourses.some((course) => course.nexVerified),
      totalCourses: hydratedCourses.length,
      totalEnrollments: hydratedCourses.reduce(
        (total, course) => total + (course.socialProof?.enrollmentCount ?? 0),
        0,
      ),
      ratingSummary: {
        average: ratingCount
          ? Math.round((ratingTotal / ratingCount) * 10) / 10
          : 0,
        count: ratingCount,
      },
    },
    courses: hydratedCourses,
    bundles: bundles.map((bundle) => ({
      ...bundle,
      counts: { courses: bundle.courses.length },
      courses: bundle.courses
        .map((item) => item.course)
        .filter(
          (course) => course.status === 'published' && !course.safetyHold,
        ),
    })),
  };
}

export async function courseCertificateListController(context: AppContext) {
  const { currentUser } = requireSignedIn(context);
  const certificates = await prisma.courseCertificate.findMany({
    where: { userId: currentUser.id, revokedAt: null },
    include: {
      course: {
        select: {
          id: true,
          title: true,
          slug: true,
          thumbnail: true,
          creatorUserId: true,
        },
      },
    },
    orderBy: { issuedAt: 'desc' },
  });

  return { certificates };
}

export async function courseCertificateController(
  params: { id: string },
  context: AppContext,
) {
  const { currentUser } = requireSignedIn(context);
  const enrollment = await courseFindEnrollment(params.id, currentUser.id);

  if (!enrollment) {
    throw new Error403();
  }

  const certificate = await prisma.courseCertificate.findUnique({
    where: { enrollmentId: enrollment.id },
    include: {
      course: {
        select: { id: true, title: true, slug: true, thumbnail: true },
      },
      user: { select: { id: true, name: true } },
    },
  });

  if (!certificate) {
    throw new Error404();
  }

  return { certificate };
}

export async function courseCertificateVerifyController(params: {
  verificationCode: string;
}) {
  const certificate = await prisma.courseCertificate.findUnique({
    where: { verificationCode: params.verificationCode },
    include: {
      course: { select: { id: true, title: true, slug: true } },
      user: { select: { name: true } },
    },
  });

  if (!certificate) {
    throw new Error404();
  }

  return {
    certificate: {
      id: certificate.id,
      certificateNumber: certificate.certificateNumber,
      verificationCode: certificate.verificationCode,
      issuedAt: certificate.issuedAt,
      revokedAt: certificate.revokedAt,
      course: certificate.course,
      learnerName: certificate.user.name || null,
    },
  };
}

/**
 * Returns the top published courses for the signup "pick your first courses"
 * step. Verified courses come first, then by rating average (highest first),
 * then by createdAt descending. Empty array if the catalog is empty — the
 * frontend renders a "we're prepping" copy + still lets the user finish
 * onboarding via the Skip button.
 */
export async function courseOnboardingSuggestionsController(
  context: AppContext,
) {
  const courses = await prisma.course.findMany({
    where: { status: 'published', safetyHold: false },
    include: {
      modules: { select: { id: true } },
      lessons: { select: { id: true } },
      assignments: { select: { id: true } },
      enrollments: { select: { id: true } },
    },
    orderBy: [{ nexVerified: 'desc' }, { createdAt: 'desc' }],
    take: 24,
  });

  const coursesWithCreators = await withCourseCreators(courses);
  const coursesWithRatings = await withCourseRatingSummaries(
    coursesWithCreators,
    context.currentUser?.id,
  );

  // Re-sort post-rating-aggregation: verified-first, then by ratingSummary
  // average DESC, then by count DESC, then publishedAt fallback. Stable
  // ordering matters because the welcome page caches the response.
  const sorted = [...coursesWithRatings].sort((a, b) => {
    if (a.nexVerified !== b.nexVerified) return a.nexVerified ? -1 : 1;
    const avgA = a.ratingSummary?.average ?? 0;
    const avgB = b.ratingSummary?.average ?? 0;
    if (avgA !== avgB) return avgB - avgA;
    const countA = a.ratingSummary?.count ?? 0;
    const countB = b.ratingSummary?.count ?? 0;
    if (countA !== countB) return countB - countA;
    return (
      new Date(b.publishedAt ?? b.createdAt).getTime() -
      new Date(a.publishedAt ?? a.createdAt).getTime()
    );
  });

  // Optionally tell the frontend which courses the user is already in so
  // those can render with a disabled "Enrolled" pill instead of "Enroll".
  const enrollments = context.currentUser
    ? await prisma.courseEnrollment.findMany({
        where: {
          userId: context.currentUser.id,
          status: { in: ['active', 'completed'] },
        },
        select: { courseId: true },
      })
    : [];
  const enrolledCourseIds = new Set(enrollments.map((e) => e.courseId));

  return {
    courses: sorted.map((course) => ({
      ...course,
      isEnrolled: enrolledCourseIds.has(course.id),
      counts: {
        modules: course.modules.length,
        lessons: course.lessons.length,
        assignments: course.assignments.length,
        enrollments: course.enrollments.length,
      },
      modules: undefined,
      lessons: undefined,
      assignments: undefined,
      enrollments: undefined,
    })),
  };
}

export async function courseAutocompleteController(
  query: unknown,
  context: AppContext,
) {
  requireSignedIn(context);
  const { search, exclude, take, orderBy } =
    courseAutocompleteInputSchema.parse(query);
  const whereAnd: Array<Prisma.CourseWhereInput> = [];

  if (!isPlatformAdmin(context)) {
    whereAnd.push({ status: 'published', safetyHold: false });
  }

  if (exclude?.length) {
    whereAnd.push({ id: { notIn: exclude } });
  }

  if (search) {
    whereAnd.push({
      OR: [
        { title: { contains: search, mode: 'insensitive' } },
        { slug: { contains: search, mode: 'insensitive' } },
        { category: { contains: search, mode: 'insensitive' } },
        { examType: { contains: search, mode: 'insensitive' } },
      ],
    });
  }

  const courses = await prisma.course.findMany({
    where: whereAnd.length ? { AND: whereAnd } : {},
    take,
    orderBy,
    select: {
      id: true,
      title: true,
      slug: true,
    },
  });

  return courses;
}

export async function courseDetailController(
  params: { slug: string },
  context: AppContext,
) {
  const course = await prisma.course.findUnique({
    where: { slug: params.slug },
    include: courseInclude,
  });

  if (
    !course ||
    ((course.status !== 'published' || course.safetyHold) &&
      !isPlatformAdmin(context))
  ) {
    throw new Error404();
  }

  const enrollment =
    context.currentUser &&
    (await courseFindEnrollment(course.id, context.currentUser.id));
  const [courseWithCreator] = await withCourseCreators([
    stripAssignmentSubmissionHistory(
      stripQuizAnswers(stripProtectedCourseFiles(course)),
    ),
  ]);
  const [courseWithRating] = await withCourseRatingSummaries(
    [courseWithCreator],
    context.currentUser?.id,
  );
  const savedCourseIds = await courseSavedIdsForUser(context.currentUser?.id);
  const certificate = enrollment
    ? await prisma.courseCertificate.findUnique({
        where: { enrollmentId: enrollment.id },
      })
    : null;
  const durationSeconds = courseDurationSeconds(courseWithRating);

  return {
    course: {
      ...courseWithRating,
      durationSeconds,
      isSaved: savedCourseIds.has(courseWithRating.id),
      socialProof: {
        enrollmentCount: courseWithRating.enrollments?.length ?? 0,
        ratingAverage: courseWithRating.ratingSummary?.average ?? 0,
        ratingCount: courseWithRating.ratingSummary?.count ?? 0,
      },
    },
    isEnrolled: Boolean(enrollment),
    certificate,
  };
}

export async function courseMyLearningController(context: AppContext) {
  const { currentUser } = requireSignedIn(context);
  const enrollments = await prisma.courseEnrollment.findMany({
    where: {
      userId: currentUser.id,
      status: { in: ['active', 'completed'] },
      course: {
        status: 'published',
        safetyHold: false,
      },
    },
    include: {
      course: {
        include: {
          lessons: {
            orderBy: [{ orderIndex: 'asc' }, { createdAt: 'asc' }],
            select: {
              id: true,
              title: true,
              moduleId: true,
              orderIndex: true,
            },
          },
          assignments: {
            orderBy: [{ orderIndex: 'asc' }, { createdAt: 'asc' }],
            select: { id: true },
          },
        },
      },
    },
    orderBy: { enrolledAt: 'desc' },
  });

  const enrolledCourseIds = enrollments.map((item) => item.courseId);
  const [progress, submissions, recommendedCourses] = await Promise.all([
    enrolledCourseIds.length
      ? prisma.courseLessonProgress.findMany({
          where: {
            userId: currentUser.id,
            courseId: { in: enrolledCourseIds },
          },
          select: { courseId: true, lessonId: true },
        })
      : Promise.resolve([]),
    enrolledCourseIds.length
      ? prisma.courseAssignmentSubmission.findMany({
          where: {
            userId: currentUser.id,
            courseId: { in: enrolledCourseIds },
          },
          select: {
            courseId: true,
            assignmentId: true,
            status: true,
          },
        })
      : Promise.resolve([]),
    prisma.course.findMany({
      where: {
        status: 'published',
        safetyHold: false,
        ...(enrolledCourseIds.length
          ? { id: { notIn: enrolledCourseIds } }
          : {}),
      },
      include: {
        _count: {
          select: {
            modules: true,
            lessons: true,
            assignments: true,
            enrollments: true,
          },
        },
      },
      orderBy: [{ nexVerified: 'desc' }, { publishedAt: 'desc' }],
      take: 3,
    }),
  ]);

  const progressByCourseId = progress.reduce((map, item) => {
    if (!map.has(item.courseId)) {
      map.set(item.courseId, new Set<string>());
    }
    map.get(item.courseId)!.add(item.lessonId);
    return map;
  }, new Map<string, Set<string>>());
  const submissionsByCourseId = submissions.reduce((map, item) => {
    if (!map.has(item.courseId)) {
      map.set(item.courseId, new Set<string>());
    }
    map.get(item.courseId)!.add(item.assignmentId);
    return map;
  }, new Map<string, Set<string>>());

  const coursesWithCreators = await withCourseCreators(
    enrollments.map((item) => item.course),
  );
  const coursesWithRatings = await withCourseRatingSummaries(
    coursesWithCreators,
    currentUser.id,
  );
  const coursesById = new Map(
    coursesWithRatings.map((course) => [course.id, course]),
  );

  const enrolledCourses = enrollments.map((enrollment) => {
    const course = coursesById.get(enrollment.courseId) || enrollment.course;
    const completedLessonIds =
      progressByCourseId.get(enrollment.courseId) || new Set<string>();
    const submittedAssignmentIds =
      submissionsByCourseId.get(enrollment.courseId) || new Set<string>();
    const totalLessons = course.lessons.length;
    const totalAssignments = course.assignments.length;
    const percent = totalLessons
      ? Math.round((completedLessonIds.size / totalLessons) * 100)
      : 0;
    const nextLesson =
      course.lessons.find(
        (lesson: { id: string }) => !completedLessonIds.has(lesson.id),
      ) || null;

    return {
      enrollment: {
        id: enrollment.id,
        courseId: enrollment.courseId,
        status: enrollment.status,
        enrolledAt: enrollment.enrolledAt,
      },
      course: {
        id: course.id,
        title: course.title,
        slug: course.slug,
        subtitle: course.subtitle,
        category: course.category,
        thumbnail: course.thumbnail,
        nexVerified: course.nexVerified,
        creatorUser: course.creatorUser,
        ratingSummary: course.ratingSummary,
        myRating: course.myRating,
      },
      counts: {
        lessons: totalLessons,
        assignments: totalAssignments,
      },
      progress: {
        completedLessons: completedLessonIds.size,
        totalLessons,
        submittedAssignments: submittedAssignmentIds.size,
        totalAssignments,
        percent,
      },
      nextLesson: nextLesson
        ? {
            id: nextLesson.id,
            title: nextLesson.title,
            moduleId: nextLesson.moduleId,
          }
        : null,
    };
  });

  const stats = enrolledCourses.reduce(
    (totals, item) => ({
      completedLessons:
        totals.completedLessons + item.progress.completedLessons,
      totalLessons: totals.totalLessons + item.progress.totalLessons,
      submittedAssignments:
        totals.submittedAssignments + item.progress.submittedAssignments,
      totalAssignments:
        totals.totalAssignments + item.progress.totalAssignments,
      progressTotal: totals.progressTotal + item.progress.percent,
    }),
    {
      completedLessons: 0,
      totalLessons: 0,
      submittedAssignments: 0,
      totalAssignments: 0,
      progressTotal: 0,
    },
  );
  const recommendedCoursesWithCreators =
    await withCourseCreators(recommendedCourses);
  const recommendedCoursesWithRatings = await withCourseRatingSummaries(
    recommendedCoursesWithCreators,
    currentUser.id,
  );

  return {
    enrolledCourses,
    recommendedCourses: recommendedCoursesWithRatings.map((course) => ({
      id: course.id,
      title: course.title,
      slug: course.slug,
      subtitle: course.subtitle,
      category: course.category,
      thumbnail: course.thumbnail,
      nexVerified: course.nexVerified,
      creatorUser: course.creatorUser,
      ratingSummary: course.ratingSummary,
      counts: {
        modules: course._count.modules,
        lessons: course._count.lessons,
        assignments: course._count.assignments,
        enrollments: course._count.enrollments,
      },
    })),
    stats: {
      enrolledCourses: enrolledCourses.length,
      completedLessons: stats.completedLessons,
      totalLessons: stats.totalLessons,
      submittedAssignments: stats.submittedAssignments,
      totalAssignments: stats.totalAssignments,
      averageProgress: enrolledCourses.length
        ? Math.round(stats.progressTotal / enrolledCourses.length)
        : 0,
    },
  };
}

export async function courseEnrollController(
  params: { id: string },
  context: AppContext,
) {
  const { currentUser } = requireSignedIn(context);
  const course = await prisma.course.findUnique({
    where: { id: params.id },
  });

  if (!course || course.status !== 'published') {
    throw new Error404();
  }

  if (course.safetyHold) {
    throw new Error404();
  }

  await trustSafetyRequirePolicyAcceptance('studentTerms', context);

  if (course.accessType !== 'free') {
    throw new Error400(context.dictionary.course.errors.manualEnrollmentOnly);
  }

  const enrollment = await prisma.courseEnrollment.upsert({
    where: {
      courseId_userId: {
        courseId: course.id,
        userId: currentUser.id,
      },
    },
    create: {
      courseId: course.id,
      userId: currentUser.id,
      memberId: context.currentMember?.id || null,
      status: 'active',
    },
    update: {
      status: 'active',
      memberId: context.currentMember?.id || null,
      completedAt: null,
    },
  });

  await auditLogCreate({
    entityId: enrollment.id,
    entityName: 'CourseEnrollment',
    operation: auditLogOperations.create,
    organizationId: null,
    userId: currentUser.id,
    memberId: context.currentMember?.id || null,
    newData: enrollment,
  });

  return { enrollment };
}

export async function courseRatingUpsertController(
  params: { id: string },
  body: unknown,
  context: AppContext,
) {
  const { currentUser } = requireSignedIn(context);
  const data = courseRatingInputSchema.parse(body);
  const [course, enrollment] = await Promise.all([
    prisma.course.findUnique({ where: { id: params.id } }),
    courseFindEnrollment(params.id, currentUser.id),
  ]);

  if (!course || course.status !== 'published') {
    throw new Error404();
  }

  if (!enrollment) {
    throw new Error403(
      context.dictionary.course.errors.ratingRequiresEnrollment,
    );
  }

  const oldData = await prisma.courseRating.findUnique({
    where: {
      courseId_userId: {
        courseId: course.id,
        userId: currentUser.id,
      },
    },
  });
  const ratingData = {
    rating: data.rating,
    comment: normalizeNullableString(data.comment),
    isPublic: data.isPublic,
    memberId: context.currentMember?.id || null,
  };
  const rating = oldData
    ? await prisma.courseRating.update({
        where: { id: oldData.id },
        data: ratingData,
      })
    : await prisma.courseRating.create({
        data: {
          ...ratingData,
          courseId: course.id,
          userId: currentUser.id,
        },
      });

  await auditLogCreate({
    entityId: rating.id,
    entityName: 'CourseRating',
    operation: oldData ? auditLogOperations.update : auditLogOperations.create,
    organizationId: null,
    userId: currentUser.id,
    memberId: context.currentMember?.id || null,
    oldData,
    newData: rating,
  });

  const [courseWithRating] = await withCourseRatingSummaries(
    [{ id: course.id }],
    currentUser.id,
  );

  return {
    rating,
    ratingSummary: courseWithRating.ratingSummary,
  };
}

export async function courseLearnController(
  params: { id: string },
  context: AppContext,
) {
  const { currentUser } = requireSignedIn(context);
  const { course, enrollment } = await courseEnsureLearningAccess(
    params.id,
    context,
  );

  const [progress, submissions, quizAttempts, certificate, resume] =
    await Promise.all([
      prisma.courseLessonProgress.findMany({
        where: { courseId: course.id, userId: currentUser.id },
      }),
      prisma.courseAssignmentSubmission.findMany({
        where: { courseId: course.id, userId: currentUser.id },
        orderBy: { submittedAt: 'desc' },
      }),
      prisma.courseQuizAttempt.findMany({
        where: { courseId: course.id, userId: currentUser.id },
        orderBy: { submittedAt: 'desc' },
      }),
      enrollment
        ? prisma.courseCertificate.findUnique({
            where: { enrollmentId: enrollment.id },
          })
        : Promise.resolve(null),
      prisma.courseLearningSession.findUnique({
        where: {
          courseId_userId: {
            courseId: course.id,
            userId: currentUser.id,
          },
        },
      }),
    ]);

  const [safeCourse] = await withCourseRatingSummaries(
    [stripAssignmentSubmissionHistory(stripQuizAnswers(course))],
    currentUser.id,
  );
  await filePopulateDownloadUrlInTree(safeCourse);
  await filePopulateDownloadUrlInTree(submissions);

  return {
    course: safeCourse,
    enrollment,
    progress,
    submissions,
    quizAttempts,
    certificate,
    resume,
  };
}

export async function courseQuizAttemptController(
  params: { id: string; quizId: string },
  body: unknown,
  context: AppContext,
) {
  const { currentUser } = requireSignedIn(context);
  const data = courseQuizAttemptInputSchema.parse(body);
  const { course } = await courseEnsureLearningAccess(params.id, context);
  const quiz = await prisma.courseQuiz.findFirst({
    where: { id: params.quizId, courseId: course.id },
    include: {
      questions: {
        orderBy: { orderIndex: 'asc' },
        include: { question: { include: { answers: true } } },
      },
    },
  });

  if (!quiz) {
    throw new Error404();
  }

  const selectionByQuestionId = new Map(
    data.answers.map((answer) => [
      answer.questionId,
      new Set(answer.selectedOptionIds),
    ]),
  );

  let earnedPoints = 0;
  let totalPoints = 0;
  const questionResults = quiz.questions.map((link) => {
    const question = link.question;
    const correctOptionIds = question.answers
      .filter((answer) => answer.isCorrect)
      .map((answer) => answer.id);
    const selected =
      selectionByQuestionId.get(question.id) || new Set<string>();
    const isCorrect =
      correctOptionIds.length > 0 &&
      correctOptionIds.length === selected.size &&
      correctOptionIds.every((id) => selected.has(id));

    totalPoints += link.points;
    if (isCorrect) {
      earnedPoints += link.points;
    }

    return {
      questionId: question.id,
      isCorrect,
      correctOptionIds,
      explanation: question.explanation,
    };
  });

  const scorePercent = totalPoints
    ? Math.round((earnedPoints / totalPoints) * 100)
    : 0;
  const passed =
    quiz.passingScore != null ? scorePercent >= quiz.passingScore : true;

  const attempt = await prisma.courseQuizAttempt.create({
    data: {
      quizId: quiz.id,
      courseId: course.id,
      userId: currentUser.id,
      memberId: context.currentMember?.id || null,
      answers: data.answers as unknown as Prisma.InputJsonValue,
      scorePercent,
      passed,
    },
  });

  await auditLogCreate({
    entityId: attempt.id,
    entityName: 'CourseQuizAttempt',
    operation: auditLogOperations.create,
    organizationId: null,
    userId: currentUser.id,
    memberId: context.currentMember?.id || null,
    newData: attempt,
  });

  return {
    attempt,
    result: {
      scorePercent,
      passed,
      earnedPoints,
      totalPoints,
      questions: questionResults,
    },
  };
}

function shuffleArray<T>(items: T[]): T[] {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

// Starts a practice-exam attempt: server-side, rule-based (domain-weighted)
// question selection from the course's approved bank questions.
export async function coursePracticeExamStartController(
  params: { id: string; examId: string },
  context: AppContext,
) {
  const { currentUser } = requireSignedIn(context);
  const { course } = await courseEnsureLearningAccess(params.id, context);
  const exam = await prisma.coursePracticeExam.findFirst({
    where: { id: params.examId, courseId: course.id },
    include: { rules: { orderBy: { orderIndex: 'asc' } } },
  });

  if (!exam) {
    throw new Error404();
  }

  const approved = await prisma.courseQuestion.findMany({
    where: { courseId: course.id, status: 'approved' },
    include: { answers: { orderBy: { orderIndex: 'asc' } } },
  });

  const selected: typeof approved = [];
  const usedIds = new Set<string>();

  if (exam.rules.length > 0) {
    for (const rule of exam.rules) {
      const pool = approved.filter(
        (question) =>
          !usedIds.has(question.id) &&
          (question.examDomain || '') === rule.examDomain &&
          (!rule.difficulty || question.difficulty === rule.difficulty),
      );
      for (const question of shuffleArray(pool).slice(0, rule.questionCount)) {
        selected.push(question);
        usedIds.add(question.id);
      }
    }
  } else {
    const count = exam.totalQuestions || approved.length;
    for (const question of shuffleArray(approved).slice(0, count)) {
      selected.push(question);
      usedIds.add(question.id);
    }
  }

  const ordered = exam.randomizeQuestions ? shuffleArray(selected) : selected;

  const attempt = await prisma.coursePracticeExamAttempt.create({
    data: {
      practiceExamId: exam.id,
      courseId: course.id,
      userId: currentUser.id,
      memberId: context.currentMember?.id || null,
      questionIds: ordered.map(
        (question) => question.id,
      ) as unknown as Prisma.InputJsonValue,
      answers: [] as unknown as Prisma.InputJsonValue,
      scorePercent: 0,
      passed: false,
      domainScores: [] as unknown as Prisma.InputJsonValue,
    },
  });

  return {
    attempt: {
      id: attempt.id,
      practiceExamId: attempt.practiceExamId,
      startedAt: attempt.startedAt,
    },
    exam: {
      id: exam.id,
      title: exam.title,
      timeLimitMinutes: exam.timeLimitMinutes,
      passingScore: exam.passingScore,
      simulateRealExam: exam.simulateRealExam,
    },
    // Answer keys are stripped — never sent to the student before grading.
    questions: ordered.map((question) => ({
      id: question.id,
      questionText: question.questionText,
      questionType: question.questionType,
      examDomain: question.examDomain,
      answers: question.answers.map((answer) => ({
        id: answer.id,
        answerText: answer.answerText,
      })),
    })),
  };
}

export async function coursePracticeExamSubmitController(
  params: { id: string; examId: string; attemptId: string },
  body: unknown,
  context: AppContext,
) {
  const { currentUser } = requireSignedIn(context);
  const data = coursePracticeExamSubmitSchema.parse(body);
  const { course } = await courseEnsureLearningAccess(params.id, context);
  const attempt = await prisma.coursePracticeExamAttempt.findFirst({
    where: {
      id: params.attemptId,
      courseId: course.id,
      practiceExamId: params.examId,
      userId: currentUser.id,
    },
  });

  if (!attempt) {
    throw new Error404();
  }
  if (attempt.submittedAt) {
    throw new Error400(context.dictionary.course.errors.examAlreadySubmitted);
  }

  const questionIds = (attempt.questionIds as string[]) || [];
  const questions = await prisma.courseQuestion.findMany({
    where: { id: { in: questionIds }, courseId: course.id },
    include: { answers: true },
  });
  const questionById = new Map(
    questions.map((question) => [question.id, question]),
  );
  const selectionByQuestionId = new Map(
    data.answers.map((answer) => [
      answer.questionId,
      new Set(answer.selectedOptionIds),
    ]),
  );

  let correct = 0;
  const domainTally = new Map<string, { correct: number; total: number }>();
  const questionResults = questionIds.map((questionId) => {
    const question = questionById.get(questionId);
    const domain = question?.examDomain || 'General';
    const tally = domainTally.get(domain) || { correct: 0, total: 0 };
    tally.total += 1;

    const correctOptionIds = (question?.answers || [])
      .filter((answer) => answer.isCorrect)
      .map((answer) => answer.id);
    const selected = selectionByQuestionId.get(questionId) || new Set<string>();
    const isCorrect =
      correctOptionIds.length > 0 &&
      correctOptionIds.length === selected.size &&
      correctOptionIds.every((id) => selected.has(id));

    if (isCorrect) {
      correct += 1;
      tally.correct += 1;
    }
    domainTally.set(domain, tally);

    return {
      questionId,
      isCorrect,
      correctOptionIds,
      explanation: question?.explanation || null,
    };
  });

  const total = questionIds.length;
  const scorePercent = total ? Math.round((correct / total) * 100) : 0;
  const exam = await prisma.coursePracticeExam.findUnique({
    where: { id: params.examId },
  });
  const passed =
    exam?.passingScore != null ? scorePercent >= exam.passingScore : true;
  const domainScores = [...domainTally.entries()].map(([domain, tally]) => ({
    domain,
    correct: tally.correct,
    total: tally.total,
    percent: tally.total ? Math.round((tally.correct / tally.total) * 100) : 0,
  }));

  const updated = await prisma.coursePracticeExamAttempt.update({
    where: { id: attempt.id },
    data: {
      answers: data.answers as unknown as Prisma.InputJsonValue,
      scorePercent,
      passed,
      domainScores: domainScores as unknown as Prisma.InputJsonValue,
      submittedAt: new Date(),
    },
  });

  await auditLogCreate({
    entityId: updated.id,
    entityName: 'CoursePracticeExamAttempt',
    operation: auditLogOperations.create,
    organizationId: null,
    userId: currentUser.id,
    memberId: context.currentMember?.id || null,
    newData: updated,
  });

  return {
    attempt: updated,
    result: {
      scorePercent,
      passed,
      correct,
      total,
      domainScores,
      questions: questionResults,
    },
  };
}

export async function courseLessonCompleteController(
  params: { id: string; lessonId: string },
  context: AppContext,
) {
  const { currentUser } = requireSignedIn(context);
  const { course } = await courseEnsureLearningAccess(params.id, context);
  const lesson = await prisma.courseLesson.findFirst({
    where: { id: params.lessonId, courseId: course.id },
  });

  if (!lesson) {
    throw new Error404();
  }

  const progress = await prisma.courseLessonProgress.upsert({
    where: {
      lessonId_userId: {
        lessonId: lesson.id,
        userId: currentUser.id,
      },
    },
    create: {
      courseId: course.id,
      lessonId: lesson.id,
      userId: currentUser.id,
    },
    update: {
      completedAt: new Date(),
    },
  });

  await auditLogCreate({
    entityId: progress.id,
    entityName: 'CourseLessonProgress',
    operation: auditLogOperations.create,
    organizationId: null,
    userId: currentUser.id,
    memberId: context.currentMember?.id || null,
    newData: progress,
  });

  const completion = await courseMaybeCompleteEnrollment({
    course,
    userId: currentUser.id,
    context,
  });

  return { progress, ...completion };
}

export async function courseAssignmentSubmissionController(
  params: { id: string; assignmentId: string },
  body: unknown,
  context: AppContext,
) {
  const { currentUser } = requireSignedIn(context);
  const data = courseAssignmentSubmissionInputSchema.parse(body);
  const { course } = await courseEnsureLearningAccess(params.id, context);
  const assignment = await prisma.courseAssignment.findFirst({
    where: {
      id: params.assignmentId,
      courseId: course.id,
    },
  });

  if (!assignment) {
    throw new Error404();
  }

  if (!data.text && !data.files?.length) {
    throw new Error400(context.dictionary.course.errors.submissionRequired);
  }

  const latestSubmission = await prisma.courseAssignmentSubmission.findFirst({
    where: {
      assignmentId: assignment.id,
      userId: currentUser.id,
    },
    orderBy: [{ attemptNumber: 'desc' }, { submittedAt: 'desc' }],
  });

  if (latestSubmission) {
    if (latestSubmission.status === 'submitted') {
      throw new Error400(
        context.dictionary.course.errors.submissionPendingReview,
      );
    }

    if (latestSubmission.status === 'complete') {
      throw new Error400(context.dictionary.course.errors.submissionComplete);
    }

    if (!assignment.allowResubmissions) {
      throw new Error400(
        context.dictionary.course.errors.resubmissionNotAllowed,
      );
    }

    if (
      assignment.maxAttempts != null &&
      latestSubmission.attemptNumber >= assignment.maxAttempts
    ) {
      throw new Error400(context.dictionary.course.errors.maxAttemptsReached);
    }
  }

  const submission = await prisma.courseAssignmentSubmission.create({
    data: {
      assignmentId: assignment.id,
      courseId: course.id,
      userId: currentUser.id,
      memberId: context.currentMember?.id || null,
      text: data.text || null,
      files: data.files as Prisma.InputJsonValue,
      attemptNumber: (latestSubmission?.attemptNumber || 0) + 1,
      status: 'submitted',
    },
  });

  await auditLogCreate({
    entityId: submission.id,
    entityName: 'CourseAssignmentSubmission',
    operation: auditLogOperations.create,
    organizationId: null,
    userId: currentUser.id,
    memberId: context.currentMember?.id || null,
    oldData: latestSubmission,
    newData: submission,
  });

  await filePopulateDownloadUrlInTree(submission);
  return { submission };
}

export async function platformAdminCourseListController(
  query: unknown,
  context: AppContext,
) {
  authGuardPlatformAdminBackend(context);
  const data = courseListInputSchema.parse(query);
  const search = data.filter?.search?.trim();
  const status = data.filter?.status?.trim();
  const accessType = data.filter?.accessType?.trim();
  const examType = data.filter?.examType?.trim();
  const whereAnd: Array<Prisma.CourseWhereInput> = [];

  if (search) {
    whereAnd.push({
      OR: [
        { title: { contains: search, mode: 'insensitive' } },
        { slug: { contains: search, mode: 'insensitive' } },
        { category: { contains: search, mode: 'insensitive' } },
        { examType: { contains: search, mode: 'insensitive' } },
      ],
    });
  }

  if (status && status !== 'all') {
    whereAnd.push({ status });
  }

  if (accessType && accessType !== 'all') {
    whereAnd.push({ accessType });
  }

  if (examType) {
    whereAnd.push({ examType: { contains: examType, mode: 'insensitive' } });
  }

  const where: Prisma.CourseWhereInput = whereAnd.length
    ? { AND: whereAnd }
    : {};

  const [count, courses] = await Promise.all([
    prisma.course.count({ where }),
    prisma.course.findMany({
      where,
      include: {
        _count: {
          select: {
            modules: true,
            lessons: true,
            assignments: true,
            enrollments: true,
          },
        },
      },
      orderBy: [{ updatedAt: 'desc' }],
      skip: data.skip || 0,
      take: data.take || defaultTake,
    }),
  ]);

  return { count, courses: await withCourseCreators(courses) };
}

export async function platformAdminCourseFindController(
  params: { id: string },
  context: AppContext,
) {
  authGuardPlatformAdminBackend(context);
  const course = await prisma.course.findUnique({
    where: { id: params.id },
    include: courseInclude,
  });

  if (!course) {
    throw new Error404();
  }

  await filePopulateDownloadUrlInTree(course);
  await withCourseSubmissionUsers(course);
  const [courseWithCreator] = await withCourseCreators([course]);
  const linkedContent = await courseLinkedContentCounts(course.id);

  return { course: courseWithCreator, linkedContent };
}

export async function platformAdminCourseCreateController(
  body: unknown,
  context: AppContext,
) {
  const { currentUser } = authGuardPlatformAdminBackend(context);
  const data = courseManageInputSchema.parse(body);
  const slug = await courseUniqueSlug(data.title, data.slug);

  const course = await prismaDangerouslyBypassRLS.$transaction(async (tx) => {
    const categoryNameMirror = await resolveCategoryNameMirror(
      tx,
      data.categoryId,
    );
    const created = await tx.course.create({
      data: {
        ...courseBaseData(data, { categoryNameMirror }),
        slug,
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
    newData: course,
  });

  await filePopulateDownloadUrlInTree(course);
  return { course };
}

async function courseLinkedContentCounts(courseId: string) {
  const [
    exams,
    chapters,
    legacyLessons,
    concepts,
    practiceQuestions,
    studyNotes,
    documentUploads,
    examTypes,
    examInstances,
  ] = await Promise.all([
    prisma.exam.count({ where: { courseId } }),
    prisma.chapter.count({ where: { courseId } }),
    prisma.lesson.count({ where: { courseId } }),
    prisma.concept.count({ where: { courseId } }),
    prisma.practiceQuestion.count({ where: { courseId } }),
    prisma.studyNote.count({ where: { courseId } }),
    prisma.documentUpload.count({ where: { courseId } }),
    prisma.examType.count({ where: { courseId } }),
    prisma.examInstance.count({ where: { courseId } }),
  ]);

  return {
    exams,
    chapters,
    legacyLessons,
    concepts,
    practiceQuestions,
    studyNotes,
    documentUploads,
    examTypes,
    examInstances,
  };
}

export async function platformAdminCourseUpdateController(
  params: { id: string },
  body: unknown,
  context: AppContext,
) {
  const { currentUser } = authGuardPlatformAdminBackend(context);
  const data = courseManageInputSchema.parse(body);
  const oldData = await prisma.course.findUnique({
    where: { id: params.id },
    include: courseInclude,
  });

  if (!oldData) {
    throw new Error404();
  }

  const slug = await courseUniqueSlug(
    data.title,
    data.slug || oldData.slug,
    oldData.id,
  );

  if (data.status === 'published') {
    await trustSafetyAssertCourseCanPublish(oldData, context);
  }

  const course = await prismaDangerouslyBypassRLS.$transaction(async (tx) => {
    const categoryNameMirror = await resolveCategoryNameMirror(
      tx,
      data.categoryId,
    );
    await tx.course.update({
      where: { id: oldData.id },
      data: {
        ...courseBaseData(data, { categoryNameMirror }),
        slug,
        updatedByUserId: currentUser.id,
        publishedAt:
          data.status === 'published' && !oldData.publishedAt
            ? new Date()
            : data.status === 'published'
              ? oldData.publishedAt
              : null,
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
    oldData,
    newData: course,
  });

  // Rotate the Stripe Price when the paid-course pricing changed. Skipped
  // when the course is still draft (no buyers yet) — provisioning happens
  // at admin-approve time. Failures here log + continue; the next checkout
  // attempt will rehydrate via the lazy fallback.
  const isPaid = course.accessType === 'paid';
  const priceChanged =
    oldData.priceCents !== course.priceCents ||
    oldData.currency !== course.currency;
  if (isPaid && priceChanged && course.status === 'published') {
    try {
      await coursePaymentEnsureStripePrice(course.id, context);
    } catch (e) {
      console.error(
        `coursePaymentEnsureStripePrice rotation failed for course ${course.id}`,
        e,
      );
    }
  }

  await filePopulateDownloadUrlInTree(course);
  return { course };
}

export async function platformAdminCourseReviewController(
  params: { id: string },
  body: unknown,
  context: AppContext,
) {
  const { currentUser } = authGuardPlatformAdminBackend(context);
  const data = courseReviewInputSchema.parse(body);
  const oldData = await prisma.course.findUnique({
    where: { id: params.id },
    include: courseInclude,
  });

  if (!oldData) {
    throw new Error404();
  }

  if (oldData.status !== 'inReview') {
    throw new Error400(context.dictionary.course.errors.reviewNotPending);
  }

  const approve = data.decision === 'approve';

  if (approve) {
    await trustSafetyAssertCourseCanPublish(oldData, context);
  }

  const course = await prisma.course.update({
    where: { id: oldData.id },
    data: {
      status: approve ? 'published' : 'draft',
      publishedAt: approve ? oldData.publishedAt || new Date() : null,
      reviewNotes: approve ? null : normalizeNullableString(data.reviewNotes),
      reviewedByUserId: currentUser.id,
      reviewedAt: new Date(),
    },
    include: courseInclude,
  });

  await auditLogCreate({
    entityId: course.id,
    entityName: 'Course',
    operation: auditLogOperations.update,
    organizationId: null,
    userId: currentUser.id,
    oldData,
    newData: course,
  });

  await courseReviewDecisionCreate(
    {
      courseId: course.id,
      decision: approve ? 'approve' : 'requestChanges',
      reviewNotes: data.reviewNotes,
      reviewedByUserId: currentUser.id,
      previousStatus: oldData.status,
      nextStatus: course.status,
    },
    context,
  );

  // Approve-time Stripe provisioning. For a paid course, lazy-create the
  // Product+Price now so the first buyer doesn't pay the Stripe round-trip
  // latency. Failures here log + continue — `courseCheckoutController` has
  // a lazy fallback that re-runs this for the buyer if something went wrong.
  if (approve && course.accessType === 'paid' && course.priceCents) {
    try {
      await coursePaymentEnsureStripePrice(course.id, context);
    } catch (e) {
      console.error(
        `coursePaymentEnsureStripePrice failed for course ${course.id}`,
        e,
      );
    }
  }

  await filePopulateDownloadUrlInTree(course);
  const [courseWithCreator] = await withCourseCreators([course]);
  return { course: courseWithCreator };
}

export async function platformAdminCourseReviewDecisionListController(
  params: { id: string },
  context: AppContext,
) {
  authGuardPlatformAdminBackend(context);
  const course = await prismaDangerouslyBypassRLS.course.findUnique({
    where: { id: params.id },
    select: { id: true },
  });

  if (!course) {
    throw new Error404();
  }

  return {
    decisions: await courseReviewDecisionFindMany(params.id),
  };
}

export async function courseSyncContent(
  tx: Prisma.TransactionClient,
  courseId: string,
  data: CourseContentManageInput,
) {
  const idsOf = (rows: Array<{ id?: string }>) =>
    rows.map((row) => row.id).filter((id): id is string => Boolean(id));
  const moduleIds = idsOf(data.modules);
  const lessonIds = idsOf(data.lessons);
  const assignmentIds = idsOf(data.assignments);
  const questionIds = idsOf(data.questions);
  const quizIds = idsOf(data.quizzes);
  const quizQuestionIds = idsOf(data.quizQuestions);
  const practiceExamIds = idsOf(data.practiceExams);
  const practiceExamRuleIds = idsOf(data.practiceExamRules);
  const outcomeIds = idsOf(data.outcomes);
  const requirementIds = idsOf(data.requirements);
  const flashcardSetIds = idsOf(data.flashcardSets);
  const flashcardIds = idsOf(data.flashcards);
  const blockIds = idsOf(data.blocks);

  // Delete rows that are no longer present in the submitted payload.
  await tx.courseLessonBlock.deleteMany({
    where: {
      lesson: { courseId },
      ...(blockIds.length ? { id: { notIn: blockIds } } : {}),
    },
  });
  await tx.courseFlashcard.deleteMany({
    where: {
      flashcardSet: { courseId },
      ...(flashcardIds.length ? { id: { notIn: flashcardIds } } : {}),
    },
  });
  await tx.courseFlashcardSet.deleteMany({
    where: {
      courseId,
      ...(flashcardSetIds.length ? { id: { notIn: flashcardSetIds } } : {}),
    },
  });
  await tx.courseOutcome.deleteMany({
    where: {
      courseId,
      ...(outcomeIds.length ? { id: { notIn: outcomeIds } } : {}),
    },
  });
  await tx.courseRequirement.deleteMany({
    where: {
      courseId,
      ...(requirementIds.length ? { id: { notIn: requirementIds } } : {}),
    },
  });
  await tx.courseQuizQuestion.deleteMany({
    where: {
      quiz: { courseId },
      ...(quizQuestionIds.length ? { id: { notIn: quizQuestionIds } } : {}),
    },
  });
  await tx.coursePracticeExamRule.deleteMany({
    where: {
      practiceExam: { courseId },
      ...(practiceExamRuleIds.length
        ? { id: { notIn: practiceExamRuleIds } }
        : {}),
    },
  });
  await tx.coursePracticeExam.deleteMany({
    where: {
      courseId,
      ...(practiceExamIds.length ? { id: { notIn: practiceExamIds } } : {}),
    },
  });
  await tx.courseQuiz.deleteMany({
    where: {
      courseId,
      ...(quizIds.length ? { id: { notIn: quizIds } } : {}),
    },
  });
  await tx.courseQuestion.deleteMany({
    where: {
      courseId,
      ...(questionIds.length ? { id: { notIn: questionIds } } : {}),
    },
  });
  await tx.courseAssignment.deleteMany({
    where: {
      courseId,
      ...(assignmentIds.length ? { id: { notIn: assignmentIds } } : {}),
    },
  });
  await tx.courseLesson.deleteMany({
    where: {
      courseId,
      ...(lessonIds.length ? { id: { notIn: lessonIds } } : {}),
    },
  });
  await tx.courseModule.deleteMany({
    where: {
      courseId,
      ...(moduleIds.length ? { id: { notIn: moduleIds } } : {}),
    },
  });

  // Upsert by client-supplied UUID. A new row carries a client-generated id so
  // child rows (lessons / quizzes / questions) can reference it in one save.
  // updateMany is scoped to courseId, so an id from another course matches
  // nothing and falls through to a create that fails on the primary key —
  // a malformed payload errors out instead of writing across courses.
  for (const module of data.modules) {
    const moduleData = {
      title: module.title,
      description: normalizeNullableString(module.description),
      orderIndex: module.orderIndex,
    };

    if (module.id) {
      const result = await tx.courseModule.updateMany({
        where: { id: module.id, courseId },
        data: moduleData,
      });
      if (result.count === 0) {
        await tx.courseModule.create({
          data: { ...moduleData, id: module.id, courseId },
        });
      }
    } else {
      await tx.courseModule.create({ data: { ...moduleData, courseId } });
    }
  }

  for (const lesson of data.lessons) {
    const lessonData = {
      title: lesson.title,
      description: normalizeNullableString(lesson.description),
      content: normalizeNullableString(lesson.content),
      videoFiles: lesson.videoFiles as Prisma.InputJsonValue,
      videoUrl: lesson.videoUrl,
      resourceFiles: lesson.resourceFiles as Prisma.InputJsonValue,
      videoDurationSeconds: lesson.videoDurationSeconds || null,
      orderIndex: lesson.orderIndex,
      isPreview: lesson.isPreview,
      isHidden: lesson.isHidden,
      moduleId: lesson.moduleId,
    };

    if (lesson.id) {
      const result = await tx.courseLesson.updateMany({
        where: { id: lesson.id, courseId },
        data: lessonData,
      });
      if (result.count === 0) {
        await tx.courseLesson.create({
          data: { ...lessonData, id: lesson.id, courseId },
        });
      }
    } else {
      await tx.courseLesson.create({ data: { ...lessonData, courseId } });
    }
  }

  for (const assignment of data.assignments) {
    const assignmentData = {
      title: assignment.title,
      prompt: assignment.prompt,
      orderIndex: assignment.orderIndex,
      dueDaysAfterEnroll: assignment.dueDaysAfterEnroll || null,
      rubric: assignment.rubric as Prisma.InputJsonValue,
      allowResubmissions: assignment.allowResubmissions,
      maxAttempts: assignment.maxAttempts || null,
      moduleId: assignment.moduleId,
      lessonId: assignment.lessonId,
    };

    if (assignment.id) {
      const result = await tx.courseAssignment.updateMany({
        where: { id: assignment.id, courseId },
        data: assignmentData,
      });
      if (result.count === 0) {
        await tx.courseAssignment.create({
          data: { ...assignmentData, id: assignment.id, courseId },
        });
      }
    } else {
      await tx.courseAssignment.create({
        data: { ...assignmentData, courseId },
      });
    }
  }

  // ---- question bank (CourseQuestion + nested CourseQuestionAnswer) ----
  for (const question of data.questions) {
    const questionData = {
      questionText: question.questionText,
      questionType: question.questionType,
      explanation: normalizeNullableString(question.explanation),
      difficulty: question.difficulty,
      examDomain: normalizeNullableString(question.examDomain),
      tags: question.tags,
      source: normalizeNullableString(question.source),
      aiGenerated: question.aiGenerated,
      status: question.status,
      meta: (question.meta ?? null) as Prisma.InputJsonValue,
    };

    let questionId: string;
    if (question.id) {
      const result = await tx.courseQuestion.updateMany({
        where: { id: question.id, courseId },
        data: questionData,
      });
      if (result.count === 0) {
        await tx.courseQuestion.create({
          data: { ...questionData, id: question.id, courseId },
        });
      }
      questionId = question.id;
    } else {
      const created = await tx.courseQuestion.create({
        data: { ...questionData, courseId },
      });
      questionId = created.id;
    }

    const answerIds = idsOf(question.answers);
    await tx.courseQuestionAnswer.deleteMany({
      where: {
        questionId,
        ...(answerIds.length ? { id: { notIn: answerIds } } : {}),
      },
    });
    for (const answer of question.answers) {
      const answerData = {
        answerText: answer.answerText,
        isCorrect: answer.isCorrect,
        matchText: normalizeNullableString(answer.matchText),
        explanation: normalizeNullableString(answer.explanation),
        orderIndex: answer.orderIndex,
      };
      if (answer.id) {
        const result = await tx.courseQuestionAnswer.updateMany({
          where: { id: answer.id, questionId },
          data: answerData,
        });
        if (result.count === 0) {
          await tx.courseQuestionAnswer.create({
            data: { ...answerData, id: answer.id, questionId },
          });
        }
      } else {
        await tx.courseQuestionAnswer.create({
          data: { ...answerData, questionId },
        });
      }
    }
  }

  // ---- quizzes ----
  for (const quiz of data.quizzes) {
    const quizData = {
      title: quiz.title,
      description: normalizeNullableString(quiz.description),
      orderIndex: quiz.orderIndex,
      passingScore: quiz.passingScore ?? null,
      timeLimitMinutes: quiz.timeLimitMinutes ?? null,
      randomizeQuestions: quiz.randomizeQuestions,
      randomizeAnswers: quiz.randomizeAnswers,
      showExplanations: quiz.showExplanations,
      allowRetries: quiz.allowRetries,
      maxAttempts: quiz.maxAttempts ?? null,
      moduleId: quiz.moduleId,
      lessonId: quiz.lessonId,
    };

    if (quiz.id) {
      const result = await tx.courseQuiz.updateMany({
        where: { id: quiz.id, courseId },
        data: quizData,
      });
      if (result.count === 0) {
        await tx.courseQuiz.create({
          data: { ...quizData, id: quiz.id, courseId },
        });
      }
    } else {
      await tx.courseQuiz.create({ data: { ...quizData, courseId } });
    }
  }

  // ---- quiz <-> question join rows ----
  // Ignore links that reference a quiz or question outside this payload.
  const courseQuizIds = new Set(quizIds);
  const courseQuestionIds = new Set(questionIds);
  for (const link of data.quizQuestions) {
    if (
      !courseQuizIds.has(link.quizId) ||
      !courseQuestionIds.has(link.questionId)
    ) {
      continue;
    }
    const linkData = { orderIndex: link.orderIndex, points: link.points };
    if (link.id) {
      const result = await tx.courseQuizQuestion.updateMany({
        where: { id: link.id, quiz: { courseId } },
        data: { ...linkData, questionId: link.questionId },
      });
      if (result.count === 0) {
        await tx.courseQuizQuestion.create({
          data: {
            ...linkData,
            id: link.id,
            quizId: link.quizId,
            questionId: link.questionId,
          },
        });
      }
    } else {
      await tx.courseQuizQuestion.create({
        data: {
          ...linkData,
          quizId: link.quizId,
          questionId: link.questionId,
        },
      });
    }
  }

  // ---- practice exams ----
  for (const exam of data.practiceExams) {
    const examData = {
      title: exam.title,
      description: normalizeNullableString(exam.description),
      examType: normalizeNullableString(exam.examType),
      totalQuestions: exam.totalQuestions,
      timeLimitMinutes: exam.timeLimitMinutes ?? null,
      passingScore: exam.passingScore ?? null,
      randomizeQuestions: exam.randomizeQuestions,
      simulateRealExam: exam.simulateRealExam,
      orderIndex: exam.orderIndex,
    };

    if (exam.id) {
      const result = await tx.coursePracticeExam.updateMany({
        where: { id: exam.id, courseId },
        data: examData,
      });
      if (result.count === 0) {
        await tx.coursePracticeExam.create({
          data: { ...examData, id: exam.id, courseId },
        });
      }
    } else {
      await tx.coursePracticeExam.create({
        data: { ...examData, courseId },
      });
    }
  }

  // ---- practice exam rules ----
  const courseExamIds = new Set(practiceExamIds);
  for (const rule of data.practiceExamRules) {
    if (!courseExamIds.has(rule.practiceExamId)) {
      continue;
    }
    const ruleData = {
      examDomain: rule.examDomain,
      questionCount: rule.questionCount,
      difficulty: rule.difficulty ?? null,
      orderIndex: rule.orderIndex,
    };
    if (rule.id) {
      const result = await tx.coursePracticeExamRule.updateMany({
        where: { id: rule.id, practiceExam: { courseId } },
        data: ruleData,
      });
      if (result.count === 0) {
        await tx.coursePracticeExamRule.create({
          data: {
            ...ruleData,
            id: rule.id,
            practiceExamId: rule.practiceExamId,
          },
        });
      }
    } else {
      await tx.coursePracticeExamRule.create({
        data: { ...ruleData, practiceExamId: rule.practiceExamId },
      });
    }
  }

  // ---- course outcomes / requirements ----
  for (const outcome of data.outcomes) {
    const outcomeData = { text: outcome.text, orderIndex: outcome.orderIndex };
    if (outcome.id) {
      const result = await tx.courseOutcome.updateMany({
        where: { id: outcome.id, courseId },
        data: outcomeData,
      });
      if (result.count === 0) {
        await tx.courseOutcome.create({
          data: { ...outcomeData, id: outcome.id, courseId },
        });
      }
    } else {
      await tx.courseOutcome.create({ data: { ...outcomeData, courseId } });
    }
  }
  for (const requirement of data.requirements) {
    const requirementData = {
      text: requirement.text,
      orderIndex: requirement.orderIndex,
    };
    if (requirement.id) {
      const result = await tx.courseRequirement.updateMany({
        where: { id: requirement.id, courseId },
        data: requirementData,
      });
      if (result.count === 0) {
        await tx.courseRequirement.create({
          data: { ...requirementData, id: requirement.id, courseId },
        });
      }
    } else {
      await tx.courseRequirement.create({
        data: { ...requirementData, courseId },
      });
    }
  }

  // ---- flashcard sets + cards ----
  for (const set of data.flashcardSets) {
    const setData = {
      title: set.title,
      description: normalizeNullableString(set.description),
      moduleId: set.moduleId,
      lessonId: set.lessonId,
      orderIndex: set.orderIndex,
    };
    if (set.id) {
      const result = await tx.courseFlashcardSet.updateMany({
        where: { id: set.id, courseId },
        data: setData,
      });
      if (result.count === 0) {
        await tx.courseFlashcardSet.create({
          data: { ...setData, id: set.id, courseId },
        });
      }
    } else {
      await tx.courseFlashcardSet.create({ data: { ...setData, courseId } });
    }
  }
  const courseFlashcardSetIds = new Set(flashcardSetIds);
  for (const card of data.flashcards) {
    if (!courseFlashcardSetIds.has(card.flashcardSetId)) {
      continue;
    }
    const cardData = {
      front: card.front,
      back: card.back,
      hint: normalizeNullableString(card.hint),
      orderIndex: card.orderIndex,
    };
    if (card.id) {
      const result = await tx.courseFlashcard.updateMany({
        where: { id: card.id, flashcardSet: { courseId } },
        data: cardData,
      });
      if (result.count === 0) {
        await tx.courseFlashcard.create({
          data: {
            ...cardData,
            id: card.id,
            flashcardSetId: card.flashcardSetId,
          },
        });
      }
    } else {
      await tx.courseFlashcard.create({
        data: { ...cardData, flashcardSetId: card.flashcardSetId },
      });
    }
  }

  // ---- lesson content blocks ----
  const courseLessonIds = new Set(lessonIds);
  for (const block of data.blocks) {
    if (!courseLessonIds.has(block.lessonId)) {
      continue;
    }
    const blockData = {
      blockType: block.blockType,
      content: (block.content ?? {}) as Prisma.InputJsonValue,
      orderIndex: block.orderIndex,
    };
    if (block.id) {
      const result = await tx.courseLessonBlock.updateMany({
        where: { id: block.id, lesson: { courseId } },
        data: blockData,
      });
      if (result.count === 0) {
        await tx.courseLessonBlock.create({
          data: { ...blockData, id: block.id, lessonId: block.lessonId },
        });
      }
    } else {
      await tx.courseLessonBlock.create({
        data: { ...blockData, lessonId: block.lessonId },
      });
    }
  }
}

export async function platformAdminCourseEnrollController(
  params: { id: string },
  body: unknown,
  context: AppContext,
) {
  const { currentUser } = authGuardPlatformAdminBackend(context);
  const data = courseEnrollmentManageInputSchema.parse(body);
  const [course, user] = await Promise.all([
    prisma.course.findUnique({ where: { id: params.id } }),
    prismaDangerouslyBypassRLS.user.findUnique({
      where: { email: data.email },
      include: {
        members: {
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
      },
    }),
  ]);

  if (!course || !user) {
    throw new Error404();
  }

  const enrollment = await prisma.courseEnrollment.upsert({
    where: {
      courseId_userId: {
        courseId: course.id,
        userId: user.id,
      },
    },
    create: {
      courseId: course.id,
      userId: user.id,
      memberId: user.members[0]?.id || null,
      status: 'active',
    },
    update: {
      status: 'active',
      memberId: user.members[0]?.id || null,
      completedAt: null,
    },
  });

  await auditLogCreate({
    entityId: enrollment.id,
    entityName: 'CourseEnrollment',
    operation: auditLogOperations.create,
    organizationId: null,
    userId: currentUser.id,
    newData: enrollment,
  });

  return { enrollment };
}

export async function courseAssignmentSubmissionReviewController(
  params: { id: string; courseId?: string },
  body: unknown,
  context: AppContext,
  reviewerUserId: string,
) {
  const data = courseAssignmentSubmissionReviewInputSchema.parse(body);
  const oldData = await prisma.courseAssignmentSubmission.findFirst({
    where: {
      id: params.id,
      ...(params.courseId ? { courseId: params.courseId } : {}),
    },
    include: { assignment: true },
  });

  if (!oldData) {
    throw new Error404();
  }

  if (data.status === 'submitted') {
    throw new Error400(
      context.dictionary.course.errors.invalidSubmissionReviewStatus,
    );
  }

  const rubricPayload = courseAssignmentRubricScorePayload({
    rubric: oldData.assignment.rubric,
    rubricScores: data.rubricScores,
    context,
  });
  const submission = await prisma.courseAssignmentSubmission.update({
    where: { id: params.id },
    data: {
      status: data.status,
      feedback: normalizeNullableString(data.feedback),
      reviewerUserId,
      reviewedAt: new Date(),
      rubricScores: rubricPayload.rubricScores ?? Prisma.JsonNull,
      score: rubricPayload.score,
      maxScore: rubricPayload.maxScore,
    },
  });

  await auditLogCreate({
    entityId: submission.id,
    entityName: 'CourseAssignmentSubmission',
    operation: auditLogOperations.update,
    organizationId: null,
    userId: reviewerUserId,
    oldData,
    newData: submission,
  });

  return { submission };
}

export async function platformAdminAssignmentSubmissionReviewController(
  params: { id: string },
  body: unknown,
  context: AppContext,
) {
  const { currentUser } = authGuardPlatformAdminBackend(context);

  return await courseAssignmentSubmissionReviewController(
    params,
    body,
    context,
    currentUser.id,
  );
}

export async function courseBuildAiContext(
  courseId: string,
  lessonId: string | undefined,
  context: AppContext,
) {
  const { currentUser } = requireSignedIn(context);
  const { course } = await courseEnsureLearningAccess(courseId, context);
  const [progress, submissions, legacyContent] = await Promise.all([
    prisma.courseLessonProgress.findMany({
      where: { courseId, userId: currentUser.id },
      select: { lessonId: true, completedAt: true },
    }),
    prisma.courseAssignmentSubmission.findMany({
      where: { courseId, userId: currentUser.id },
      select: {
        assignmentId: true,
        status: true,
        submittedAt: true,
        feedback: true,
      },
    }),
    courseLegacyAiContent(courseId),
  ]);

  const completedLessonIds = new Set(progress.map((item) => item.lessonId));
  const submissionsByAssignmentId = new Map(
    submissions.map((submission) => [submission.assignmentId, submission]),
  );
  const focusedLesson = lessonId
    ? course.lessons.find((lesson) => lesson.id === lessonId)
    : null;

  const lines = [
    context.dictionary.chatbot.courseContextHeader,
    `${context.dictionary.course.fields.title}: ${course.title}`,
    course.category
      ? `${context.dictionary.course.fields.category}: ${course.category}`
      : null,
    focusedLesson
      ? `${context.dictionary.course.ai.focusedLesson}: ${focusedLesson.title}`
      : null,
    context.dictionary.chatbot.courseVideoTranscriptNotice,
    '',
    context.dictionary.course.ai.outline,
  ].filter(Boolean) as Array<string>;

  for (const module of course.modules) {
    lines.push(`- ${module.title}`);
    for (const lesson of module.lessons) {
      lines.push(
        `  - ${lesson.title}${
          completedLessonIds.has(lesson.id)
            ? ` (${context.dictionary.course.ai.completed})`
            : ''
        }`,
      );
      if (lesson.content) {
        lines.push(`    ${lesson.content.slice(0, 1800)}`);
      }
    }
    for (const assignment of module.assignments) {
      const submission = submissionsByAssignmentId.get(assignment.id);
      lines.push(
        `  - ${context.dictionary.course.ai.assignment}: ${assignment.title}; ${assignment.prompt.slice(
          0,
          1200,
        )}${
          submission
            ? ` (${context.dictionary.course.fields.status}: ${submission.status})`
            : ''
        }`,
      );
    }
  }

  for (const assignment of course.assignments.filter(
    (assignment) => !assignment.moduleId,
  )) {
    const submission = submissionsByAssignmentId.get(assignment.id);
    lines.push(
      `- ${context.dictionary.course.ai.assignment}: ${assignment.title}; ${assignment.prompt.slice(
        0,
        1200,
      )}${
        submission
          ? ` (${context.dictionary.course.fields.status}: ${submission.status})`
          : ''
      }`,
    );
  }

  if (
    legacyContent.exams.length ||
    legacyContent.chapters.length ||
    legacyContent.lessons.length ||
    legacyContent.concepts.length ||
    legacyContent.practiceQuestions.length ||
    legacyContent.studyNotes.length ||
    legacyContent.documentUploads.length ||
    legacyContent.examTypes.length
  ) {
    lines.push('', context.dictionary.course.ai.linkedContent);
  }

  for (const exam of legacyContent.exams) {
    lines.push(
      `- ${context.dictionary.exam.list.menu}: ${exam.name}${
        exam.code ? ` (${exam.code})` : ''
      }${exam.description ? `; ${exam.description.slice(0, 1000)}` : ''}`,
    );
  }

  for (const chapter of legacyContent.chapters) {
    lines.push(
      `- ${context.dictionary.chapter.list.menu}: ${chapter.title}${
        chapter.description ? `; ${chapter.description.slice(0, 1000)}` : ''
      }`,
    );
    if (chapter.objectives.length) {
      lines.push(`  ${chapter.objectives.slice(0, 6).join('; ')}`);
    }
  }

  for (const lesson of legacyContent.lessons) {
    lines.push(
      `- ${context.dictionary.lesson.list.menu}: ${lesson.title}${
        lesson.content ? `; ${lesson.content.slice(0, 1200)}` : ''
      }`,
    );
  }

  for (const concept of legacyContent.concepts) {
    lines.push(
      `- ${context.dictionary.concept.list.menu}: ${concept.conceptName}; ${concept.explanation.slice(
        0,
        1200,
      )}`,
    );
  }

  for (const question of legacyContent.practiceQuestions) {
    lines.push(
      `- ${context.dictionary.practiceQuestion.list.menu}: ${question.questionText.slice(
        0,
        1000,
      )}${
        question.explanation ? `; ${question.explanation.slice(0, 800)}` : ''
      }`,
    );
  }

  for (const note of legacyContent.studyNotes) {
    lines.push(
      `- ${context.dictionary.studyNote.list.menu}: ${note.title}; ${note.content.slice(
        0,
        1200,
      )}`,
    );
  }

  for (const upload of legacyContent.documentUploads) {
    lines.push(
      `- ${context.dictionary.documentUpload.list.menu}: ${upload.originalFilename}; ${upload.status}`,
    );
  }

  for (const examType of legacyContent.examTypes) {
    lines.push(
      `- ${context.dictionary.examType.list.menu}: ${examType.name}; ${examType.type}`,
    );
  }

  return lines.join('\n').slice(0, aiContextMaxLength);
}

async function courseLegacyAiContent(courseId: string) {
  const [
    exams,
    chapters,
    lessons,
    concepts,
    practiceQuestions,
    studyNotes,
    documentUploads,
    examTypes,
  ] = await Promise.all([
    prisma.exam.findMany({
      where: { courseId, archivedAt: null },
      select: { name: true, code: true, description: true },
      orderBy: { updatedAt: 'desc' },
      take: 10,
    }),
    prisma.chapter.findMany({
      where: { courseId, archivedAt: null },
      select: { title: true, description: true, objectives: true },
      orderBy: [{ orderIndex: 'asc' }, { updatedAt: 'desc' }],
      take: 20,
    }),
    prisma.lesson.findMany({
      where: { courseId, archivedAt: null },
      select: { title: true, content: true },
      orderBy: [{ lessonNumber: 'asc' }, { updatedAt: 'desc' }],
      take: 30,
    }),
    prisma.concept.findMany({
      where: { courseId, archivedAt: null },
      select: { conceptName: true, explanation: true },
      orderBy: { updatedAt: 'desc' },
      take: 30,
    }),
    prisma.practiceQuestion.findMany({
      where: { courseId, archivedAt: null },
      select: { questionText: true, explanation: true },
      orderBy: { updatedAt: 'desc' },
      take: 30,
    }),
    prisma.studyNote.findMany({
      where: { courseId, archivedAt: null },
      select: { title: true, content: true },
      orderBy: { updatedAt: 'desc' },
      take: 20,
    }),
    prisma.documentUpload.findMany({
      where: { courseId, archivedAt: null },
      select: { originalFilename: true, status: true },
      orderBy: { updatedAt: 'desc' },
      take: 20,
    }),
    prisma.examType.findMany({
      where: { courseId, archivedAt: null },
      select: { name: true, type: true },
      orderBy: { updatedAt: 'desc' },
      take: 20,
    }),
  ]);

  return {
    exams,
    chapters,
    lessons,
    concepts,
    practiceQuestions,
    studyNotes,
    documentUploads,
    examTypes,
  };
}
