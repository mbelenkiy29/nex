export type PlatformMetricsRange = '7d' | '30d' | '90d' | '12m';

export type PlatformMetricsTrendPoint = {
  date: string;
  value: number;
};

export type PlatformMetrics = {
  range: PlatformMetricsRange;
  startDate: string;
  endDate: string;
  summary: {
    signups: number;
    courseEnrollments: number;
    lessonCompletions: number;
    lessonCompletionRate: number;
    homeworkCompletions: number;
    homeworkSubmitted: number;
    homeworkNeedsRevision: number;
    homeworkCompletionRate: number;
    averageQuizScore: number;
    averageAiQuizScore: number;
    aiTokens: number;
    activeAiUsers: number;
    refundRate: number;
    refundedSessions: number;
    paidSessions: number;
    creatorEarnings: number;
    pendingCreatorEarnings: number;
    monthlyRevenueCents: number;
    refundCents: number;
    studentRetentionRate: number;
    retainedStudents: number;
    enrolledStudents: number;
    averageCourseRating: number;
    courseRatingCount: number;
  };
  trends: {
    signups: PlatformMetricsTrendPoint[];
    enrollments: PlatformMetricsTrendPoint[];
    lessonCompletions: PlatformMetricsTrendPoint[];
    homeworkCompletions: PlatformMetricsTrendPoint[];
    aiTokens: PlatformMetricsTrendPoint[];
    revenueCents: PlatformMetricsTrendPoint[];
  };
  topCourses: Array<{
    courseId: string;
    title: string;
    creatorUserId?: string | null;
    enrollments: number;
    lessonCompletionRate: number;
    homeworkCompletionRate: number;
    averageQuizScore: number;
    averageAiQuizScore: number;
    averageRating: number;
    ratingCount: number;
    revenueCents: number;
  }>;
};
