import { Prisma } from '../../prisma/generated/client';
// bypass-RLS: platform-wide aggregation metrics (DAU, courses created,
// revenue) intentionally span all orgs. Caller is platform-admin gated.
// eslint-disable-next-line no-restricted-syntax
import { prismaDangerouslyBypassRLS } from '../../prisma';
import {
  platformMetricsInputSchema,
  platformMetricsRangeSchema,
} from './platformAdminSchemas';

type MetricsRange = ReturnType<typeof platformMetricsRangeSchema.parse>;

type MetricsScope = {
  range: MetricsRange;
  courseId?: string | null;
  creatorUserId?: string | null;
};

type BucketUnit = 'day' | 'month';

type MetricsBucket = {
  date: string;
  value: number;
};

const percent = (value: number, total: number) =>
  total > 0 ? Math.round((value / total) * 100) : 0;

const average = (values: number[]) =>
  values.length
    ? Math.round(
        (values.reduce((total, value) => total + value, 0) / values.length) *
          10,
      ) / 10
    : 0;

function startOfDay(date: Date) {
  const next = new Date(date);
  next.setHours(0, 0, 0, 0);
  return next;
}

function startOfMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function addMonths(date: Date, months: number) {
  const next = new Date(date);
  next.setMonth(next.getMonth() + months);
  return next;
}

function dateKey(date: Date, unit: BucketUnit) {
  return unit === 'month'
    ? date.toISOString().slice(0, 7)
    : date.toISOString().slice(0, 10);
}

function metricsWindow(range: MetricsRange) {
  const now = new Date();

  if (range === '12m') {
    const start = addMonths(startOfMonth(now), -11);
    return {
      start,
      end: now,
      unit: 'month' as const,
      bucketCount: 12,
    };
  }

  const days = range === '7d' ? 7 : range === '90d' ? 90 : 30;
  const start = startOfDay(now);
  start.setDate(start.getDate() - (days - 1));

  return {
    start,
    end: now,
    unit: 'day' as const,
    bucketCount: days,
  };
}

function makeBuckets(start: Date, count: number, unit: BucketUnit) {
  return Array.from({ length: count }, (_, index) => {
    const date =
      unit === 'month'
        ? addMonths(start, index)
        : new Date(start.getTime() + index * 24 * 60 * 60 * 1000);

    return { date: dateKey(date, unit), value: 0 };
  });
}

function incrementBucket(
  bucketsByDate: Map<string, MetricsBucket>,
  date: Date | string | null | undefined,
  unit: BucketUnit,
  value = 1,
) {
  if (!date) {
    return;
  }

  const parsed = date instanceof Date ? date : new Date(date);
  const bucket = bucketsByDate.get(dateKey(parsed, unit));

  if (bucket) {
    bucket.value += value;
  }
}

function countMap(rows: Array<{ courseId: string | null; _count: { _all: number } }>) {
  const map = new Map<string, number>();

  rows.forEach((row) => {
    if (row.courseId) {
      map.set(row.courseId, row._count._all);
    }
  });

  return map;
}

function sumPotential(
  enrollmentCounts: Map<string, number>,
  contentCounts: Map<string, number>,
) {
  let total = 0;
  for (const [courseId, enrollmentCount] of enrollmentCounts.entries()) {
    total += enrollmentCount * (contentCounts.get(courseId) || 0);
  }
  return total;
}

function emptyMetricsPayload(scope: MetricsScope) {
  const window = metricsWindow(scope.range);
  const emptyTrend = makeBuckets(window.start, window.bucketCount, window.unit);

  return {
    range: scope.range,
    startDate: window.start.toISOString(),
    endDate: window.end.toISOString(),
    summary: {
      signups: 0,
      courseEnrollments: 0,
      lessonCompletions: 0,
      lessonCompletionRate: 0,
      homeworkCompletions: 0,
      homeworkSubmitted: 0,
      homeworkNeedsRevision: 0,
      homeworkCompletionRate: 0,
      averageQuizScore: 0,
      averageAiQuizScore: 0,
      aiTokens: 0,
      activeAiUsers: 0,
      refundRate: 0,
      refundedSessions: 0,
      paidSessions: 0,
      creatorEarnings: 0,
      pendingCreatorEarnings: 0,
      monthlyRevenueCents: 0,
      refundCents: 0,
      studentRetentionRate: 0,
      retainedStudents: 0,
      enrolledStudents: 0,
      averageCourseRating: 0,
      courseRatingCount: 0,
    },
    trends: {
      signups: emptyTrend,
      enrollments: emptyTrend,
      lessonCompletions: emptyTrend,
      homeworkCompletions: emptyTrend,
      aiTokens: emptyTrend,
      revenueCents: emptyTrend,
    },
    topCourses: [],
  };
}

export async function platformMetricsBuild(query: unknown) {
  const scope = platformMetricsInputSchema.parse(query);
  const window = metricsWindow(scope.range);
  const courseWhere: Prisma.CourseWhereInput = {
    ...(scope.courseId ? { id: scope.courseId } : {}),
    ...(scope.creatorUserId ? { creatorUserId: scope.creatorUserId } : {}),
  };
  const isCourseScoped = Boolean(scope.courseId || scope.creatorUserId);
  const scopedCourses = isCourseScoped
    ? await prismaDangerouslyBypassRLS.course.findMany({
        where: courseWhere,
        select: { id: true, title: true, creatorUserId: true },
      })
    : [];
  const scopedCourseIds = scopedCourses.map((course) => course.id);

  if (isCourseScoped && scopedCourseIds.length === 0) {
    return emptyMetricsPayload(scope);
  }

  const courseFilter: Prisma.CourseEnrollmentWhereInput = isCourseScoped
    ? { courseId: { in: scopedCourseIds } }
    : {};
  const courseActivityFilter = isCourseScoped
    ? { courseId: { in: scopedCourseIds } }
    : {};
  const scopedEnrollments = isCourseScoped
    ? await prismaDangerouslyBypassRLS.courseEnrollment.findMany({
        where: courseFilter,
        select: { userId: true },
      })
    : [];
  const scopedUserIds = Array.from(
    new Set(scopedEnrollments.map((enrollment) => enrollment.userId)),
  );
  const scopedUserFilter =
    isCourseScoped && scopedUserIds.length
      ? { userId: { in: scopedUserIds } }
      : isCourseScoped
        ? { userId: { in: [] } }
        : {};

  const [
    signupUsers,
    rangeEnrollments,
    lessonCompletions,
    activeEnrollmentGroups,
    lessonCountGroups,
    assignmentCountGroups,
    homeworkStatusGroups,
    homeworkCompletions,
    quizAttempts,
    aiQuizAttempts,
    aiUsageRows,
    paidSessions,
    paidPayouts,
    pendingPayouts,
    activeEnrollments,
    practiceExamAttempts,
    oneOnOneActivity,
    ratingAggregate,
    enrollmentGroupsForTopCourses,
    allCoursesForTop,
    courseLessonCompletions,
    courseHomeworkCompletions,
    courseQuizAverages,
    courseAiQuizAverages,
    courseRatingGroups,
    courseRevenueGroups,
  ] = await Promise.all([
    prismaDangerouslyBypassRLS.user.findMany({
      where: {
        createdAt: { gte: window.start, lte: window.end },
        ...scopedUserFilter,
      },
      select: { id: true, createdAt: true },
    }),
    prismaDangerouslyBypassRLS.courseEnrollment.findMany({
      where: {
        ...courseFilter,
        enrolledAt: { gte: window.start, lte: window.end },
      },
      select: { id: true, courseId: true, userId: true, enrolledAt: true },
    }),
    prismaDangerouslyBypassRLS.courseLessonProgress.findMany({
      where: {
        ...courseActivityFilter,
        completedAt: { gte: window.start, lte: window.end },
      },
      select: { courseId: true, lessonId: true, userId: true, completedAt: true },
    }),
    prismaDangerouslyBypassRLS.courseEnrollment.groupBy({
      by: ['courseId'],
      where: { ...courseFilter, status: 'active' },
      _count: { _all: true },
    }),
    prismaDangerouslyBypassRLS.courseLesson.groupBy({
      by: ['courseId'],
      where: { ...courseActivityFilter, isHidden: false },
      _count: { _all: true },
    }),
    prismaDangerouslyBypassRLS.courseAssignment.groupBy({
      by: ['courseId'],
      where: courseActivityFilter,
      _count: { _all: true },
    }),
    prismaDangerouslyBypassRLS.courseAssignmentSubmission.groupBy({
      by: ['status'],
      where: {
        ...courseActivityFilter,
        OR: [
          { submittedAt: { gte: window.start, lte: window.end } },
          { reviewedAt: { gte: window.start, lte: window.end } },
        ],
      },
      _count: { _all: true },
    }),
    prismaDangerouslyBypassRLS.courseAssignmentSubmission.findMany({
      where: {
        ...courseActivityFilter,
        status: 'complete',
        OR: [
          { reviewedAt: { gte: window.start, lte: window.end } },
          { reviewedAt: null, submittedAt: { gte: window.start, lte: window.end } },
        ],
      },
      select: { courseId: true, assignmentId: true, userId: true, submittedAt: true, reviewedAt: true },
    }),
    prismaDangerouslyBypassRLS.courseQuizAttempt.findMany({
      where: {
        ...courseActivityFilter,
        submittedAt: { gte: window.start, lte: window.end },
      },
      select: { courseId: true, userId: true, scorePercent: true, submittedAt: true },
    }),
    prismaDangerouslyBypassRLS.courseAiQuizAttempt.findMany({
      where: {
        ...courseActivityFilter,
        submittedAt: { gte: window.start, lte: window.end },
      },
      select: { courseId: true, userId: true, scorePercent: true, submittedAt: true },
    }),
    prismaDangerouslyBypassRLS.chatbotUsage.findMany({
      where: {
        date: { gte: window.start, lte: window.end },
        ...scopedUserFilter,
      },
      select: { userId: true, date: true, inputTokens: true, outputTokens: true, totalTokens: true },
    }),
    prismaDangerouslyBypassRLS.oneOnOneSession.findMany({
      where: {
        ...courseActivityFilter,
        paidAt: { gte: window.start, lte: window.end },
        priceCents: { not: null },
      },
      select: { courseId: true, studentUserId: true, paidAt: true, priceCents: true, refundedAt: true, refundCents: true },
    }),
    prismaDangerouslyBypassRLS.creatorPayout.findMany({
      where: {
        status: 'paid',
        ...(scope.creatorUserId ? { creatorUserId: scope.creatorUserId } : {}),
        ...(isCourseScoped ? { courseId: { in: scopedCourseIds } } : {}),
        OR: [
          { paidAt: { gte: window.start, lte: window.end } },
          { paidAt: null, createdAt: { gte: window.start, lte: window.end } },
        ],
      },
      select: { amount: true },
    }),
    prismaDangerouslyBypassRLS.creatorPayout.findMany({
      where: {
        status: 'pending',
        ...(scope.creatorUserId ? { creatorUserId: scope.creatorUserId } : {}),
        ...(isCourseScoped ? { courseId: { in: scopedCourseIds } } : {}),
      },
      select: { amount: true },
    }),
    prismaDangerouslyBypassRLS.courseEnrollment.findMany({
      where: {
        ...courseFilter,
        status: 'active',
        enrolledAt: { lte: window.end },
      },
      select: { courseId: true, userId: true, enrolledAt: true },
    }),
    prismaDangerouslyBypassRLS.coursePracticeExamAttempt.findMany({
      where: {
        ...courseActivityFilter,
        submittedAt: { gte: window.start, lte: window.end },
      },
      select: { courseId: true, userId: true, submittedAt: true },
    }),
    prismaDangerouslyBypassRLS.oneOnOneSession.findMany({
      where: {
        ...courseActivityFilter,
        scheduledStartAt: { gte: window.start, lte: window.end },
      },
      select: { courseId: true, studentUserId: true, scheduledStartAt: true },
    }),
    prismaDangerouslyBypassRLS.courseRating.aggregate({
      where: {
        ...(isCourseScoped ? { courseId: { in: scopedCourseIds } } : {}),
        isPublic: true,
      },
      _avg: { rating: true },
      _count: { _all: true },
    }),
    prismaDangerouslyBypassRLS.courseEnrollment.groupBy({
      by: ['courseId'],
      where: {
        ...courseFilter,
        enrolledAt: { gte: window.start, lte: window.end },
      },
      _count: { _all: true },
    }),
    prismaDangerouslyBypassRLS.course.findMany({
      where: isCourseScoped ? { id: { in: scopedCourseIds } } : {},
      select: { id: true, title: true, creatorUserId: true },
    }),
    prismaDangerouslyBypassRLS.courseLessonProgress.groupBy({
      by: ['courseId'],
      where: {
        ...courseActivityFilter,
        completedAt: { gte: window.start, lte: window.end },
      },
      _count: { _all: true },
    }),
    prismaDangerouslyBypassRLS.courseAssignmentSubmission.groupBy({
      by: ['courseId'],
      where: {
        ...courseActivityFilter,
        status: 'complete',
        OR: [
          { reviewedAt: { gte: window.start, lte: window.end } },
          { reviewedAt: null, submittedAt: { gte: window.start, lte: window.end } },
        ],
      },
      _count: { _all: true },
    }),
    prismaDangerouslyBypassRLS.courseQuizAttempt.groupBy({
      by: ['courseId'],
      where: {
        ...courseActivityFilter,
        submittedAt: { gte: window.start, lte: window.end },
      },
      _avg: { scorePercent: true },
    }),
    prismaDangerouslyBypassRLS.courseAiQuizAttempt.groupBy({
      by: ['courseId'],
      where: {
        ...courseActivityFilter,
        submittedAt: { gte: window.start, lte: window.end },
      },
      _avg: { scorePercent: true },
    }),
    prismaDangerouslyBypassRLS.courseRating.groupBy({
      by: ['courseId'],
      where: {
        ...(isCourseScoped ? { courseId: { in: scopedCourseIds } } : {}),
        isPublic: true,
      },
      _avg: { rating: true },
      _count: { _all: true },
    }),
    prismaDangerouslyBypassRLS.oneOnOneSession.groupBy({
      by: ['courseId'],
      where: {
        ...courseActivityFilter,
        paidAt: { gte: window.start, lte: window.end },
        priceCents: { not: null },
      },
      _sum: { priceCents: true, refundCents: true },
    }),
  ]);

  const activeEnrollmentCounts = countMap(activeEnrollmentGroups);
  const lessonCounts = countMap(lessonCountGroups);
  const assignmentCounts = countMap(assignmentCountGroups);
  const lessonCompletionOpportunityCount = sumPotential(
    activeEnrollmentCounts,
    lessonCounts,
  );
  const homeworkOpportunityCount = sumPotential(
    activeEnrollmentCounts,
    assignmentCounts,
  );
  const homeworkCountsByStatus = new Map(
    homeworkStatusGroups.map((row) => [row.status, row._count._all]),
  );
  const revenueCents = paidSessions.reduce(
    (total, session) =>
      total + (session.priceCents || 0) - (session.refundCents || 0),
    0,
  );
  const refundCents = paidSessions.reduce(
    (total, session) => total + (session.refundCents || 0),
    0,
  );
  const paidSessionCount = paidSessions.length;
  const refundedSessionCount = paidSessions.filter(
    (session) => session.refundedAt,
  ).length;
  const aiTokens = aiUsageRows.reduce(
    (total, row) => total + row.totalTokens,
    0,
  );
  const creatorEarnings = paidPayouts.reduce(
    (total, payout) => total + Number(payout.amount || 0),
    0,
  );
  const pendingCreatorEarnings = pendingPayouts.reduce(
    (total, payout) => total + Number(payout.amount || 0),
    0,
  );

  const enrollmentKey = (courseId: string, userId: string) =>
    `${courseId}:${userId}`;
  const enrollmentByKey = new Map(
    activeEnrollments.map((enrollment) => [
      enrollmentKey(enrollment.courseId, enrollment.userId),
      enrollment,
    ]),
  );
  const retainedUserIds = new Set<string>();
  const markRetained = (
    courseId: string,
    userId: string,
    occurredAt: Date | null,
  ) => {
    if (!occurredAt) {
      return;
    }
    const enrollment = enrollmentByKey.get(enrollmentKey(courseId, userId));
    if (enrollment && occurredAt >= enrollment.enrolledAt) {
      retainedUserIds.add(userId);
    }
  };

  lessonCompletions.forEach((row) =>
    markRetained(row.courseId, row.userId, row.completedAt),
  );
  homeworkCompletions.forEach((row) =>
    markRetained(row.courseId, row.userId, row.reviewedAt || row.submittedAt),
  );
  quizAttempts.forEach((row) =>
    markRetained(row.courseId, row.userId, row.submittedAt),
  );
  aiQuizAttempts.forEach((row) =>
    markRetained(row.courseId, row.userId, row.submittedAt),
  );
  practiceExamAttempts.forEach((row) =>
    markRetained(row.courseId, row.userId, row.submittedAt),
  );
  oneOnOneActivity.forEach((row) =>
    markRetained(row.courseId, row.studentUserId, row.scheduledStartAt),
  );

  if (aiUsageRows.length) {
    const enrollmentsByUserId = activeEnrollments.reduce((map, enrollment) => {
      if (!map.has(enrollment.userId)) {
        map.set(enrollment.userId, []);
      }
      map.get(enrollment.userId)!.push(enrollment);
      return map;
    }, new Map<string, typeof activeEnrollments>());

    aiUsageRows.forEach((row) => {
      for (const enrollment of enrollmentsByUserId.get(row.userId) || []) {
        markRetained(enrollment.courseId, row.userId, row.date);
      }
    });
  }

  const enrolledStudentCount = new Set(
    activeEnrollments.map((enrollment) => enrollment.userId),
  ).size;

  const baseBuckets = makeBuckets(window.start, window.bucketCount, window.unit);
  const bucketSet = () => baseBuckets.map((bucket) => ({ ...bucket }));
  const signupsTrend = bucketSet();
  const enrollmentsTrend = bucketSet();
  const lessonTrend = bucketSet();
  const homeworkTrend = bucketSet();
  const aiTrend = bucketSet();
  const revenueTrend = bucketSet();
  const signupsByDate = new Map(signupsTrend.map((bucket) => [bucket.date, bucket]));
  const enrollmentsByDate = new Map(
    enrollmentsTrend.map((bucket) => [bucket.date, bucket]),
  );
  const lessonsByDate = new Map(lessonTrend.map((bucket) => [bucket.date, bucket]));
  const homeworkByDate = new Map(
    homeworkTrend.map((bucket) => [bucket.date, bucket]),
  );
  const aiByDate = new Map(aiTrend.map((bucket) => [bucket.date, bucket]));
  const revenueByDate = new Map(
    revenueTrend.map((bucket) => [bucket.date, bucket]),
  );

  signupUsers.forEach((row) =>
    incrementBucket(signupsByDate, row.createdAt, window.unit),
  );
  rangeEnrollments.forEach((row) =>
    incrementBucket(enrollmentsByDate, row.enrolledAt, window.unit),
  );
  lessonCompletions.forEach((row) =>
    incrementBucket(lessonsByDate, row.completedAt, window.unit),
  );
  homeworkCompletions.forEach((row) =>
    incrementBucket(
      homeworkByDate,
      row.reviewedAt || row.submittedAt,
      window.unit,
    ),
  );
  aiUsageRows.forEach((row) =>
    incrementBucket(aiByDate, row.date, window.unit, row.totalTokens),
  );
  paidSessions.forEach((row) =>
    incrementBucket(
      revenueByDate,
      row.paidAt,
      window.unit,
      (row.priceCents || 0) - (row.refundCents || 0),
    ),
  );

  const enrollmentCountsByCourse = countMap(enrollmentGroupsForTopCourses);
  const lessonCompletionsByCourse = countMap(courseLessonCompletions);
  const homeworkCompletionsByCourse = countMap(courseHomeworkCompletions);
  const quizAverageByCourse = new Map(
    courseQuizAverages.map((row) => [
      row.courseId,
      Math.round(Number(row._avg.scorePercent || 0) * 10) / 10,
    ]),
  );
  const aiQuizAverageByCourse = new Map(
    courseAiQuizAverages.map((row) => [
      row.courseId,
      Math.round(Number(row._avg.scorePercent || 0) * 10) / 10,
    ]),
  );
  const ratingsByCourse = new Map(
    courseRatingGroups.map((row) => [
      row.courseId,
      {
        average: Math.round(Number(row._avg.rating || 0) * 10) / 10,
        count: row._count._all,
      },
    ]),
  );
  const revenueByCourse = new Map(
    courseRevenueGroups.map((row) => [
      row.courseId,
      Number(row._sum.priceCents || 0) - Number(row._sum.refundCents || 0),
    ]),
  );
  const activeEnrollmentCountsByCourse = activeEnrollmentCounts;
  const topCourses = allCoursesForTop
    .map((course) => {
      const enrollmentCount = enrollmentCountsByCourse.get(course.id) || 0;
      const activeEnrollmentCount =
        activeEnrollmentCountsByCourse.get(course.id) || 0;
      const lessonCount = lessonCounts.get(course.id) || 0;
      const assignmentCount = assignmentCounts.get(course.id) || 0;
      const rating = ratingsByCourse.get(course.id) || {
        average: 0,
        count: 0,
      };

      return {
        courseId: course.id,
        title: course.title,
        creatorUserId: course.creatorUserId,
        enrollments: enrollmentCount,
        lessonCompletionRate: percent(
          lessonCompletionsByCourse.get(course.id) || 0,
          activeEnrollmentCount * lessonCount,
        ),
        homeworkCompletionRate: percent(
          homeworkCompletionsByCourse.get(course.id) || 0,
          activeEnrollmentCount * assignmentCount,
        ),
        averageQuizScore: quizAverageByCourse.get(course.id) || 0,
        averageAiQuizScore: aiQuizAverageByCourse.get(course.id) || 0,
        averageRating: rating.average,
        ratingCount: rating.count,
        revenueCents: revenueByCourse.get(course.id) || 0,
      };
    })
    .sort((a, b) => b.enrollments - a.enrollments || b.revenueCents - a.revenueCents)
    .slice(0, 8);

  return {
    range: scope.range,
    startDate: window.start.toISOString(),
    endDate: window.end.toISOString(),
    summary: {
      signups: signupUsers.length,
      courseEnrollments: rangeEnrollments.length,
      lessonCompletions: lessonCompletions.length,
      lessonCompletionRate: percent(
        lessonCompletions.length,
        lessonCompletionOpportunityCount,
      ),
      homeworkCompletions: homeworkCountsByStatus.get('complete') || 0,
      homeworkSubmitted: homeworkCountsByStatus.get('submitted') || 0,
      homeworkNeedsRevision: homeworkCountsByStatus.get('needsRevision') || 0,
      homeworkCompletionRate: percent(
        homeworkCompletions.length,
        homeworkOpportunityCount,
      ),
      averageQuizScore: average(
        quizAttempts.map((attempt) => attempt.scorePercent),
      ),
      averageAiQuizScore: average(
        aiQuizAttempts.map((attempt) => attempt.scorePercent),
      ),
      aiTokens,
      activeAiUsers: new Set(aiUsageRows.map((row) => row.userId)).size,
      refundRate: percent(refundedSessionCount, paidSessionCount),
      refundedSessions: refundedSessionCount,
      paidSessions: paidSessionCount,
      creatorEarnings,
      pendingCreatorEarnings,
      monthlyRevenueCents: revenueCents,
      refundCents,
      studentRetentionRate: percent(retainedUserIds.size, enrolledStudentCount),
      retainedStudents: retainedUserIds.size,
      enrolledStudents: enrolledStudentCount,
      averageCourseRating:
        Math.round(Number(ratingAggregate._avg.rating || 0) * 10) / 10,
      courseRatingCount: ratingAggregate._count._all,
    },
    trends: {
      signups: signupsTrend,
      enrollments: enrollmentsTrend,
      lessonCompletions: lessonTrend,
      homeworkCompletions: homeworkTrend,
      aiTokens: aiTrend,
      revenueCents: revenueTrend,
    },
    topCourses,
  };
}
