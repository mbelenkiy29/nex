export type TrustSafetyPolicyType =
  | 'refundPolicy'
  | 'teacherTerms'
  | 'studentTerms';

export type TrustSafetyPolicyStatus = {
  id: string;
  type: TrustSafetyPolicyType;
  version: string;
  contentKey: string;
  publishedAt: string;
  accepted: boolean;
};

export type TrustSafetyReportStatus =
  | 'open'
  | 'underReview'
  | 'resolvedActionTaken'
  | 'resolvedNoAction';

export type TrustSafetyReportPriority = 'low' | 'normal' | 'high' | 'urgent';

export type TrustSafetyReportOutcomeCategory =
  | 'none'
  | 'contentRemoved'
  | 'creatorWarning'
  | 'creatorSuspended'
  | 'refundReviewed'
  | 'noViolation'
  | 'duplicate';

export type TrustSafetyRiskFlagStatus =
  | 'open'
  | 'reviewing'
  | 'resolved'
  | 'dismissed';

export type TrustSafetyRiskFlagSeverity =
  | 'low'
  | 'medium'
  | 'high'
  | 'critical';

export type TrustSafetyReport = {
  id: string;
  createdAt: string;
  targetType: 'course' | 'teacher' | 'courseRating';
  reason: string;
  details?: string | null;
  status: TrustSafetyReportStatus;
  priority: TrustSafetyReportPriority;
  assignedToUserId?: string | null;
  assignedToUser?: { id: string; name: string; email: string } | null;
  reviewDueAt?: string | null;
  outcomeCategory?: TrustSafetyReportOutcomeCategory | null;
  resolutionSummary?: string | null;
  adminNotes?: string | null;
  course?: { id: string; title: string; slug: string; status: string } | null;
  teacherUser?: { id: string; name: string; email: string } | null;
  reporterUser?: { id: string; name: string; email: string } | null;
  rating?: { id: string; rating: number; comment?: string | null } | null;
};

export type TrustSafetyRiskFlag = {
  id: string;
  createdAt: string;
  targetType: 'creator' | 'course' | 'report' | 'payout' | 'oneOnOneSession';
  severity: TrustSafetyRiskFlagSeverity;
  source: 'manual' | 'rule';
  reason: string;
  status: TrustSafetyRiskFlagStatus;
  adminNotes?: string | null;
  course?: { id: string; title: string; slug: string; status: string } | null;
  creatorUser?: { id: string; name: string; email: string } | null;
  report?: { id: string; targetType: string; reason: string } | null;
  payout?: {
    id: string;
    amount: number;
    currency: string;
    status: string;
  } | null;
  oneOnOneSession?: {
    id: string;
    status: string;
    scheduledStartAt: string;
  } | null;
};

export type TrustSafetyQueue = {
  reports: TrustSafetyReport[];
  reportCount: number;
  riskFlags: TrustSafetyRiskFlag[];
  riskFlagCount: number;
  coursesInReview: Array<{
    id: string;
    title: string;
    slug: string;
    status: string;
    submittedForReviewAt?: string | null;
    safetyHold: boolean;
    safetyHoldReason?: string | null;
    creatorUser?: { id: string; name: string; email: string } | null;
    reviewDecisions?: CourseReviewDecision[];
  }>;
  disabledCreators: Array<{
    id: string;
    userId: string;
    displayName: string;
    safetyDisabledAt?: string | null;
    safetyDisabledReason?: string | null;
    user?: { id: string; name: string; email: string } | null;
  }>;
  policyVersions: TrustSafetyPolicyStatus[];
  counts: {
    openReports: number;
    openRiskFlags: number;
    pendingReviews: number;
    disabledCreators: number;
  };
};

export type CourseReviewDecision = {
  id: string;
  createdAt: string;
  courseId: string;
  decision: string;
  reviewNotes?: string | null;
  reviewedByUserId?: string | null;
  reviewedByUser?: { id: string; name: string; email: string } | null;
  reviewedAt: string;
  previousStatus: string;
  nextStatus: string;
};
