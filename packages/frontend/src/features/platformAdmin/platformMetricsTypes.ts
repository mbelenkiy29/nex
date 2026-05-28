export type PlatformMetricsRange = '7d' | '30d' | '90d' | '12m';

export type PlatformMetricsTrendPoint = {
  date: string;
  value: number;
};

export type PlatformMetricsFunnelEventName =
  | 'course_view'
  | 'preview_start'
  | 'value_sample_started'
  | 'value_sample_completed'
  | 'sample_diagnostic_started'
  | 'sample_diagnostic_completed'
  | 'paywall_seen'
  | 'cta_click'
  | 'checkout_started'
  | 'paid'
  | 'first_value_after_payment';

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
  funnel: {
    steps: Array<{
      eventName: PlatformMetricsFunnelEventName;
      count: number;
      users: number;
      conversionFromPrevious: number;
      conversionFromStart: number;
    }>;
    summary: {
      checkoutStartRate: number;
      paidConversionRate: number;
      firstValueRate: number;
      paidUsers: number;
      firstValueUsers: number;
    };
    topCourses: Array<{
      courseId: string;
      title: string;
      courseViews: number;
      paywallSeen: number;
      checkoutStarted: number;
      paid: number;
      firstValueAfterPayment: number;
      paidConversionRate: number;
      firstValueRate: number;
    }>;
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
