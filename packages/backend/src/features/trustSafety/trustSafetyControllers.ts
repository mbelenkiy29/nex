import { Prisma } from '../../prisma/generated/client';
// bypass-RLS: trust + safety actions span the marketplace catalogue
// (Course / CourseRating have no organizationId). Caller is gated by
// the moderator/admin role check upstream.
// eslint-disable-next-line no-restricted-syntax
import { prismaDangerouslyBypassRLS } from '../../prisma';
import { AppContext } from '../../shared/controller/appContext';
import { Error401 } from '../../shared/errors/Error401';
import { Error404 } from '../../shared/errors/Error404';
import { auditLogCreate } from '../auditLog/auditLogCreate';
import { auditLogOperations } from '../auditLog/auditLogOperations';
import { courseReviewDecisionCreate } from '../course/courseReviewDecisionService';
import { authGuardPlatformAdminBackend } from '../platformAdmin/platformAdminGuard';
import {
  trustSafetyAdminListInputSchema,
  trustSafetyCourseHoldInputSchema,
  trustSafetyCreatorStatusInputSchema,
  trustSafetyPolicyAcceptInputSchema,
  trustSafetyReportCreateInputSchema,
  trustSafetyReportUpdateInputSchema,
  trustSafetyRiskFlagCreateInputSchema,
  trustSafetyRiskFlagUpdateInputSchema,
} from './trustSafetySchemas';
import {
  trustSafetyAcceptPolicy,
  trustSafetyCreateRepeatedReportFlag,
  trustSafetyNullableString,
  trustSafetyPolicyStatus,
  trustSafetyRunRuleScan,
} from './trustSafetyService';

const defaultTake = 50;

function requireSignedIn(context: AppContext) {
  if (!context.currentUser) {
    throw new Error401();
  }

  return context.currentUser;
}

export async function trustSafetyPoliciesController(context: AppContext) {
  return await trustSafetyPolicyStatus(context);
}

export async function trustSafetyPolicyAcceptController(
  body: unknown,
  context: AppContext,
) {
  const data = trustSafetyPolicyAcceptInputSchema.parse(body);
  return await trustSafetyAcceptPolicy(data.policyType, context);
}

export async function trustSafetyReportCreateController(
  body: unknown,
  context: AppContext,
) {
  const currentUser = requireSignedIn(context);
  const data = trustSafetyReportCreateInputSchema.parse(body);
  let courseId = data.courseId;
  let teacherUserId = data.teacherUserId;
  const ratingId = data.ratingId;

  if (data.targetType === 'course' && courseId) {
    const course = await prismaDangerouslyBypassRLS.course.findUnique({
      where: { id: courseId },
      select: { id: true, status: true, safetyHold: true, creatorUserId: true },
    });

    if (!course || course.status !== 'published' || course.safetyHold) {
      throw new Error404();
    }

    teacherUserId = course.creatorUserId;
  }

  if (data.targetType === 'teacher' && teacherUserId) {
    const teacher = await prismaDangerouslyBypassRLS.user.findUnique({
      where: { id: teacherUserId },
      select: { id: true },
    });

    if (!teacher) {
      throw new Error404();
    }
  }

  if (data.targetType === 'courseRating' && ratingId) {
    const rating = await prismaDangerouslyBypassRLS.courseRating.findUnique({
      where: { id: ratingId },
      select: {
        id: true,
        courseId: true,
        course: { select: { creatorUserId: true } },
      },
    });

    if (!rating) {
      throw new Error404();
    }

    courseId = rating.courseId;
    teacherUserId = rating.course.creatorUserId;
  }

  const report = await prismaDangerouslyBypassRLS.trustSafetyReport.create({
    data: {
      targetType: data.targetType,
      courseId,
      teacherUserId,
      ratingId,
      reporterUserId: currentUser.id,
      reporterMemberId: context.currentMember?.id || null,
      reason: data.reason,
      details: trustSafetyNullableString(data.details),
    },
  });

  await auditLogCreate({
    entityId: report.id,
    entityName: 'TrustSafetyReport',
    operation: auditLogOperations.create,
    organizationId: null,
    userId: currentUser.id,
    memberId: context.currentMember?.id || null,
    newData: report,
  });

  await trustSafetyCreateRepeatedReportFlag(report, context);

  return { report };
}

export async function platformAdminTrustSafetyQueueController(
  query: unknown,
  context: AppContext,
) {
  authGuardPlatformAdminBackend(context);
  const data = trustSafetyAdminListInputSchema.parse(query);
  const reportStatus = data.filter?.reportStatus?.trim();
  const flagStatus = data.filter?.flagStatus?.trim();
  const priority = data.filter?.priority?.trim();
  const assignee = data.filter?.assignee?.trim();
  const targetType = data.filter?.targetType?.trim();
  const severity = data.filter?.severity?.trim();
  const search = data.filter?.search?.trim();
  const skip = data.skip || 0;
  const take = data.take || defaultTake;
  const reportWhereAnd: Prisma.TrustSafetyReportWhereInput[] = [];
  const flagWhereAnd: Prisma.TrustSafetyRiskFlagWhereInput[] = [];

  if (reportStatus && reportStatus !== 'all') {
    reportWhereAnd.push({ status: reportStatus });
  }

  if (flagStatus && flagStatus !== 'all') {
    flagWhereAnd.push({ status: flagStatus });
  }

  if (priority && priority !== 'all') {
    reportWhereAnd.push({ priority });
  }

  if (assignee && assignee !== 'all') {
    reportWhereAnd.push({
      assignedToUserId: assignee === 'unassigned' ? null : assignee,
    });
  }

  if (targetType && targetType !== 'all') {
    reportWhereAnd.push({ targetType });
    flagWhereAnd.push({ targetType });
  }

  if (severity && severity !== 'all') {
    flagWhereAnd.push({ severity });
  }

  if (search) {
    reportWhereAnd.push({
      OR: [
        { reason: { contains: search, mode: 'insensitive' } },
        { details: { contains: search, mode: 'insensitive' } },
        { course: { title: { contains: search, mode: 'insensitive' } } },
        { teacherUser: { email: { contains: search, mode: 'insensitive' } } },
        { teacherUser: { name: { contains: search, mode: 'insensitive' } } },
      ],
    });
    flagWhereAnd.push({
      OR: [
        { reason: { contains: search, mode: 'insensitive' } },
        { adminNotes: { contains: search, mode: 'insensitive' } },
        { course: { title: { contains: search, mode: 'insensitive' } } },
        { creatorUser: { email: { contains: search, mode: 'insensitive' } } },
        { creatorUser: { name: { contains: search, mode: 'insensitive' } } },
      ],
    });
  }

  const reportWhere = reportWhereAnd.length ? { AND: reportWhereAnd } : {};
  const flagWhere = flagWhereAnd.length ? { AND: flagWhereAnd } : {};
  const [
    reports,
    reportCount,
    riskFlags,
    riskFlagCount,
    coursesInReview,
    disabledApplications,
    policyVersions,
    openReportCount,
    openRiskFlagCount,
  ] = await Promise.all([
    prismaDangerouslyBypassRLS.trustSafetyReport.findMany({
      where: reportWhere,
      include: {
        course: { select: { id: true, title: true, slug: true, status: true } },
        teacherUser: { select: { id: true, name: true, email: true } },
        reporterUser: { select: { id: true, name: true, email: true } },
        assignedToUser: { select: { id: true, name: true, email: true } },
        rating: { select: { id: true, rating: true, comment: true } },
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take,
    }),
    prismaDangerouslyBypassRLS.trustSafetyReport.count({
      where: reportWhere,
    }),
    prismaDangerouslyBypassRLS.trustSafetyRiskFlag.findMany({
      where: flagWhere,
      include: {
        course: { select: { id: true, title: true, slug: true, status: true } },
        creatorUser: { select: { id: true, name: true, email: true } },
        report: { select: { id: true, targetType: true, reason: true } },
        payout: {
          select: { id: true, amount: true, currency: true, status: true },
        },
        oneOnOneSession: {
          select: { id: true, status: true, scheduledStartAt: true },
        },
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take,
    }),
    prismaDangerouslyBypassRLS.trustSafetyRiskFlag.count({
      where: flagWhere,
    }),
    prismaDangerouslyBypassRLS.course.findMany({
      where: { status: 'inReview' },
      select: {
        id: true,
        title: true,
        slug: true,
        status: true,
        submittedForReviewAt: true,
        safetyHold: true,
        safetyHoldReason: true,
        creatorUserId: true,
        creatorUser: { select: { id: true, name: true, email: true } },
        reviewDecisions: {
          include: {
            reviewedByUser: { select: { id: true, name: true, email: true } },
          },
          orderBy: { reviewedAt: 'desc' },
          take: 5,
        },
      },
      orderBy: { submittedForReviewAt: 'desc' },
      take: 20,
    }),
    prismaDangerouslyBypassRLS.creatorApplication.findMany({
      where: { safetyStatus: 'disabled' },
      orderBy: { safetyDisabledAt: 'desc' },
      take: 20,
    }),
    prismaDangerouslyBypassRLS.trustSafetyPolicyVersion.findMany({
      where: { isActive: true },
      orderBy: [{ type: 'asc' }, { publishedAt: 'desc' }],
    }),
    prismaDangerouslyBypassRLS.trustSafetyReport.count({
      where: { status: { in: ['open', 'underReview'] } },
    }),
    prismaDangerouslyBypassRLS.trustSafetyRiskFlag.count({
      where: { status: { in: ['open', 'reviewing'] } },
    }),
  ]);

  const disabledUserIds = disabledApplications.map(
    (application) => application.userId,
  );
  const disabledUsers = disabledUserIds.length
    ? await prismaDangerouslyBypassRLS.user.findMany({
        where: { id: { in: disabledUserIds } },
        select: { id: true, name: true, email: true },
      })
    : [];
  const disabledUsersById = new Map(
    disabledUsers.map((user) => [user.id, user]),
  );

  return {
    reports,
    reportCount,
    riskFlags: riskFlags.map((flag) => ({
      ...flag,
      payout: flag.payout
        ? { ...flag.payout, amount: Number(flag.payout.amount) }
        : null,
    })),
    riskFlagCount,
    coursesInReview,
    disabledCreators: disabledApplications.map((application) => ({
      ...application,
      user: disabledUsersById.get(application.userId) || null,
    })),
    policyVersions,
    counts: {
      openReports: openReportCount,
      openRiskFlags: openRiskFlagCount,
      pendingReviews: coursesInReview.length,
      disabledCreators: disabledApplications.length,
    },
  };
}

export async function platformAdminTrustSafetyReportUpdateController(
  params: { id: string },
  body: unknown,
  context: AppContext,
) {
  const { currentUser } = authGuardPlatformAdminBackend(context);
  const data = trustSafetyReportUpdateInputSchema.parse(body);
  const oldData = await prismaDangerouslyBypassRLS.trustSafetyReport.findUnique(
    {
      where: { id: params.id },
    },
  );

  if (!oldData) {
    throw new Error404();
  }

  const resolved =
    data.status === 'resolvedActionTaken' || data.status === 'resolvedNoAction';
  const report = await prismaDangerouslyBypassRLS.trustSafetyReport.update({
    where: { id: params.id },
    data: {
      status: data.status,
      priority: data.priority || oldData.priority,
      assignedToUserId:
        data.assignedToUserId !== undefined
          ? data.assignedToUserId
          : oldData.assignedToUserId,
      reviewDueAt:
        data.reviewDueAt !== undefined ? data.reviewDueAt : oldData.reviewDueAt,
      outcomeCategory:
        data.outcomeCategory !== undefined
          ? trustSafetyNullableString(data.outcomeCategory)
          : oldData.outcomeCategory,
      resolutionSummary:
        data.resolutionSummary !== undefined
          ? trustSafetyNullableString(data.resolutionSummary)
          : oldData.resolutionSummary,
      adminNotes:
        data.adminNotes !== undefined
          ? trustSafetyNullableString(data.adminNotes)
          : oldData.adminNotes,
      resolvedByUserId: resolved ? currentUser.id : null,
      resolvedAt: resolved ? new Date() : null,
    },
  });

  await auditLogCreate({
    entityId: report.id,
    entityName: 'TrustSafetyReport',
    operation: auditLogOperations.update,
    organizationId: null,
    userId: currentUser.id,
    oldData,
    newData: report,
  });

  return { report };
}

export async function platformAdminTrustSafetyRiskFlagCreateController(
  body: unknown,
  context: AppContext,
) {
  const { currentUser } = authGuardPlatformAdminBackend(context);
  const data = trustSafetyRiskFlagCreateInputSchema.parse(body);
  const flag = await prismaDangerouslyBypassRLS.trustSafetyRiskFlag.create({
    data: {
      targetType: data.targetType,
      severity: data.severity,
      source: 'manual',
      reason: data.reason,
      adminNotes: trustSafetyNullableString(data.adminNotes),
      courseId: data.courseId,
      creatorUserId: data.creatorUserId,
      reportId: data.reportId,
      payoutId: data.payoutId,
      oneOnOneSessionId: data.oneOnOneSessionId,
      createdByUserId: currentUser.id,
    },
  });

  await auditLogCreate({
    entityId: flag.id,
    entityName: 'TrustSafetyRiskFlag',
    operation: auditLogOperations.create,
    organizationId: null,
    userId: currentUser.id,
    newData: flag,
  });

  return { flag };
}

export async function platformAdminTrustSafetyRiskFlagUpdateController(
  params: { id: string },
  body: unknown,
  context: AppContext,
) {
  const { currentUser } = authGuardPlatformAdminBackend(context);
  const data = trustSafetyRiskFlagUpdateInputSchema.parse(body);
  const oldData =
    await prismaDangerouslyBypassRLS.trustSafetyRiskFlag.findUnique({
      where: { id: params.id },
    });

  if (!oldData) {
    throw new Error404();
  }

  const resolved = data.status === 'resolved' || data.status === 'dismissed';
  const flag = await prismaDangerouslyBypassRLS.trustSafetyRiskFlag.update({
    where: { id: params.id },
    data: {
      status: data.status,
      severity: data.severity || oldData.severity,
      adminNotes:
        data.adminNotes !== undefined
          ? trustSafetyNullableString(data.adminNotes)
          : undefined,
      resolvedByUserId: resolved ? currentUser.id : null,
      resolvedAt: resolved ? new Date() : null,
    },
  });

  await auditLogCreate({
    entityId: flag.id,
    entityName: 'TrustSafetyRiskFlag',
    operation: auditLogOperations.update,
    organizationId: null,
    userId: currentUser.id,
    oldData,
    newData: flag,
  });

  return { flag };
}

export async function platformAdminTrustSafetyCreatorStatusController(
  params: { userId: string },
  body: unknown,
  context: AppContext,
) {
  const { currentUser } = authGuardPlatformAdminBackend(context);
  const data = trustSafetyCreatorStatusInputSchema.parse(body);
  const oldData =
    await prismaDangerouslyBypassRLS.creatorApplication.findUnique({
      where: { userId: params.userId },
    });

  if (!oldData) {
    throw new Error404();
  }

  const application =
    await prismaDangerouslyBypassRLS.creatorApplication.update({
      where: { userId: params.userId },
      data: data.disabled
        ? {
            safetyStatus: 'disabled',
            safetyDisabledAt: new Date(),
            safetyDisabledByUserId: currentUser.id,
            safetyDisabledReason: trustSafetyNullableString(data.reason),
            nexVerified: false,
            nexVerifiedAt: null,
            nexVerifiedByUserId: null,
          }
        : {
            safetyStatus: 'active',
            safetyDisabledAt: null,
            safetyDisabledByUserId: null,
            safetyDisabledReason: null,
          },
    });

  await auditLogCreate({
    entityId: application.id,
    entityName: 'CreatorApplication',
    operation: auditLogOperations.update,
    organizationId: null,
    userId: currentUser.id,
    oldData,
    newData: application,
  });

  if (data.disabled && data.holdCourses) {
    const courses = await prismaDangerouslyBypassRLS.course.findMany({
      where: {
        creatorUserId: params.userId,
        status: 'published',
        safetyHold: false,
      },
    });

    for (const course of courses) {
      const updated = await prismaDangerouslyBypassRLS.course.update({
        where: { id: course.id },
        data: {
          safetyHold: true,
          safetyHoldReason: trustSafetyNullableString(data.reason),
          safetyHoldByUserId: currentUser.id,
          safetyHoldAt: new Date(),
        },
      });

      await auditLogCreate({
        entityId: updated.id,
        entityName: 'Course',
        operation: auditLogOperations.update,
        organizationId: null,
        userId: currentUser.id,
        oldData: course,
        newData: updated,
      });
    }
  }

  return { application };
}

export async function platformAdminTrustSafetyCourseHoldController(
  params: { id: string },
  body: unknown,
  context: AppContext,
) {
  const { currentUser } = authGuardPlatformAdminBackend(context);
  const data = trustSafetyCourseHoldInputSchema.parse(body);
  const oldData = await prismaDangerouslyBypassRLS.course.findUnique({
    where: { id: params.id },
  });

  if (!oldData) {
    throw new Error404();
  }

  const course = await prismaDangerouslyBypassRLS.course.update({
    where: { id: params.id },
    data: data.held
      ? {
          safetyHold: true,
          safetyHoldReason: trustSafetyNullableString(data.reason),
          safetyHoldByUserId: currentUser.id,
          safetyHoldAt: new Date(),
        }
      : {
          safetyHold: false,
          safetyHoldReason: null,
          safetyHoldByUserId: null,
          safetyHoldAt: null,
        },
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
      decision: data.held ? 'safetyHoldPlaced' : 'safetyHoldRemoved',
      reviewNotes: data.reason,
      reviewedByUserId: currentUser.id,
      previousStatus: oldData.status,
      nextStatus: course.status,
    },
    context,
  );

  return { course };
}

export async function platformAdminTrustSafetyCourseReviewDecisionsController(
  params: { courseId: string },
  context: AppContext,
) {
  authGuardPlatformAdminBackend(context);
  const course = await prismaDangerouslyBypassRLS.course.findUnique({
    where: { id: params.courseId },
    select: {
      id: true,
      reviewDecisions: {
        include: {
          reviewedByUser: { select: { id: true, name: true, email: true } },
        },
        orderBy: { reviewedAt: 'desc' },
        take: 100,
      },
    },
  });

  if (!course) {
    throw new Error404();
  }

  return { decisions: course.reviewDecisions };
}

export async function platformAdminTrustSafetyRuleScanController(
  context: AppContext,
) {
  authGuardPlatformAdminBackend(context);
  return await trustSafetyRunRuleScan(context);
}
