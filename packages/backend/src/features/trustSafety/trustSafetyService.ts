import { Prisma } from '../../prisma/generated/client';
// bypass-RLS: TrustSafetyPolicyVersion is a global table (no
// organizationId — policies apply platform-wide). Acceptance reads are
// scoped to the current userId.
// eslint-disable-next-line no-restricted-syntax
import { prismaDangerouslyBypassRLS } from '../../prisma';
import { AppContext } from '../../shared/controller/appContext';
import { Error400 } from '../../shared/errors/Error400';
import { Error401 } from '../../shared/errors/Error401';
import { auditLogCreate } from '../auditLog/auditLogCreate';
import { auditLogOperations } from '../auditLog/auditLogOperations';
import { TrustSafetyPolicyType } from './trustSafetySchemas';

export const trustSafetyPolicyTypes: TrustSafetyPolicyType[] = [
  'refundPolicy',
  'teacherTerms',
  'studentTerms',
];

const blockingRiskStatuses = ['open', 'reviewing'];
const blockingRiskSeverities = ['high', 'critical'];
const repeatedReportThreshold = 3;
const riskFlagRuleSource = 'rule';

function requireSignedIn(context: AppContext) {
  if (!context.currentUser) {
    throw new Error401();
  }

  return context.currentUser;
}

export function trustSafetyNullableString(value?: string | null) {
  const trimmed = value?.trim();
  return trimmed || null;
}

export async function trustSafetyActivePolicyVersions() {
  const versions = await prismaDangerouslyBypassRLS.trustSafetyPolicyVersion.findMany(
    {
      where: { type: { in: trustSafetyPolicyTypes }, isActive: true },
      orderBy: [{ type: 'asc' }, { publishedAt: 'desc' }],
    },
  );
  const byType = new Map<string, (typeof versions)[number]>();

  for (const version of versions) {
    if (!byType.has(version.type)) {
      byType.set(version.type, version);
    }
  }

  return trustSafetyPolicyTypes
    .map((type) => byType.get(type))
    .filter((item): item is NonNullable<typeof item> => Boolean(item));
}

export async function trustSafetyPolicyStatus(context: AppContext) {
  const currentUser = requireSignedIn(context);
  const versions = await trustSafetyActivePolicyVersions();
  const acceptances = versions.length
    ? await prismaDangerouslyBypassRLS.trustSafetyPolicyAcceptance.findMany({
        where: {
          userId: currentUser.id,
          policyVersionId: { in: versions.map((version) => version.id) },
        },
      })
    : [];
  const acceptedVersionIds = new Set(
    acceptances.map((acceptance) => acceptance.policyVersionId),
  );

  return {
    policies: versions.map((version) => ({
      id: version.id,
      type: version.type,
      version: version.version,
      contentKey: version.contentKey,
      publishedAt: version.publishedAt,
      accepted: acceptedVersionIds.has(version.id),
    })),
  };
}

export async function trustSafetyAcceptPolicy(
  policyType: TrustSafetyPolicyType,
  context: AppContext,
) {
  const currentUser = requireSignedIn(context);
  const policyVersion =
    await prismaDangerouslyBypassRLS.trustSafetyPolicyVersion.findFirst({
      where: { type: policyType, isActive: true },
      orderBy: { publishedAt: 'desc' },
    });

  if (!policyVersion) {
    throw new Error400(context.dictionary.trustSafety.errors.policyNotFound);
  }

  const oldData =
    await prismaDangerouslyBypassRLS.trustSafetyPolicyAcceptance.findUnique({
      where: {
        userId_policyVersionId: {
          userId: currentUser.id,
          policyVersionId: policyVersion.id,
        },
      },
    });

  const acceptance =
    await prismaDangerouslyBypassRLS.trustSafetyPolicyAcceptance.upsert({
      where: {
        userId_policyVersionId: {
          userId: currentUser.id,
          policyVersionId: policyVersion.id,
        },
      },
      create: {
        userId: currentUser.id,
        memberId: context.currentMember?.id || null,
        policyVersionId: policyVersion.id,
        policyType: policyVersion.type,
        version: policyVersion.version,
      },
      update: {
        memberId: context.currentMember?.id || null,
        acceptedAt: new Date(),
      },
    });

  await auditLogCreate({
    entityId: acceptance.id,
    entityName: 'TrustSafetyPolicyAcceptance',
    operation: oldData ? auditLogOperations.update : auditLogOperations.create,
    organizationId: null,
    userId: currentUser.id,
    memberId: context.currentMember?.id || null,
    oldData,
    newData: acceptance,
  });

  return { acceptance };
}

export async function trustSafetyRequirePolicyAcceptance(
  policyType: TrustSafetyPolicyType,
  context: AppContext,
) {
  const currentUser = requireSignedIn(context);
  const policyVersion =
    await prismaDangerouslyBypassRLS.trustSafetyPolicyVersion.findFirst({
      where: { type: policyType, isActive: true },
      orderBy: { publishedAt: 'desc' },
    });

  if (!policyVersion) {
    return;
  }

  const acceptance =
    await prismaDangerouslyBypassRLS.trustSafetyPolicyAcceptance.findUnique({
      where: {
        userId_policyVersionId: {
          userId: currentUser.id,
          policyVersionId: policyVersion.id,
        },
      },
    });

  if (!acceptance) {
    throw new Error400(
      context.dictionary.trustSafety.errors.policyAcceptanceRequired,
    );
  }
}

export async function trustSafetyCreatorApplication(userId: string) {
  return await prismaDangerouslyBypassRLS.creatorApplication.findUnique({
    where: { userId },
    select: {
      id: true,
      nexVerified: true,
      safetyStatus: true,
      safetyDisabledReason: true,
    },
  });
}

export async function trustSafetyRequireCreatorEnabled(
  userId: string,
  context: AppContext,
) {
  const application = await trustSafetyCreatorApplication(userId);

  if (application?.safetyStatus === 'disabled') {
    throw new Error400(context.dictionary.trustSafety.errors.creatorDisabled);
  }
}

export async function trustSafetyBlockingRiskFlags(input: {
  courseId?: string | null;
  creatorUserId?: string | null;
}) {
  const or: Prisma.TrustSafetyRiskFlagWhereInput[] = [];

  if (input.courseId) {
    or.push({ courseId: input.courseId });
  }

  if (input.creatorUserId) {
    or.push({ creatorUserId: input.creatorUserId });
  }

  if (!or.length) {
    return [];
  }

  return await prismaDangerouslyBypassRLS.trustSafetyRiskFlag.findMany({
    where: {
      OR: or,
      status: { in: blockingRiskStatuses },
      severity: { in: blockingRiskSeverities },
    },
  });
}

export async function trustSafetyAssertCourseCanPublish(
  course: {
    id: string;
    creatorUserId?: string | null;
    safetyHold?: boolean | null;
  },
  context: AppContext,
) {
  if (course.safetyHold) {
    throw new Error400(context.dictionary.trustSafety.errors.courseSafetyHold);
  }

  if (course.creatorUserId) {
    await trustSafetyRequireCreatorEnabled(course.creatorUserId, context);
  }

  const blockingFlags = await trustSafetyBlockingRiskFlags({
    courseId: course.id,
    creatorUserId: course.creatorUserId,
  });

  if (blockingFlags.length) {
    throw new Error400(context.dictionary.trustSafety.errors.riskFlagsBlock);
  }
}

async function trustSafetyCreateRiskFlagIfMissing(
  data: Prisma.TrustSafetyRiskFlagUncheckedCreateInput,
  context: AppContext,
) {
  const oldData = await prismaDangerouslyBypassRLS.trustSafetyRiskFlag.findFirst(
    {
      where: {
        source: data.source || riskFlagRuleSource,
        targetType: data.targetType,
        reason: data.reason,
        status: { in: blockingRiskStatuses },
        courseId: data.courseId || null,
        creatorUserId: data.creatorUserId || null,
        reportId: data.reportId || null,
        payoutId: data.payoutId || null,
        oneOnOneSessionId: data.oneOnOneSessionId || null,
      },
    },
  );

  if (oldData) {
    return null;
  }

  const flag = await prismaDangerouslyBypassRLS.trustSafetyRiskFlag.create({
    data,
  });

  await auditLogCreate({
    entityId: flag.id,
    entityName: 'TrustSafetyRiskFlag',
    operation: auditLogOperations.create,
    organizationId: null,
    userId: context.currentUser?.id || null,
    memberId: context.currentMember?.id || null,
    newData: flag,
  });

  return flag;
}

export async function trustSafetyCreateRepeatedReportFlag(
  report: {
    courseId?: string | null;
    teacherUserId?: string | null;
    targetType: string;
  },
  context: AppContext,
) {
  if (report.courseId) {
    const count = await prismaDangerouslyBypassRLS.trustSafetyReport.count({
      where: {
        courseId: report.courseId,
        status: { in: ['open', 'underReview'] },
      },
    });

    if (count >= repeatedReportThreshold) {
      await trustSafetyCreateRiskFlagIfMissing(
        {
          targetType: 'course',
          courseId: report.courseId,
          severity: 'high',
          source: riskFlagRuleSource,
          reason: 'repeatedReports',
        },
        context,
      );
    }
  }

  if (report.teacherUserId) {
    const count = await prismaDangerouslyBypassRLS.trustSafetyReport.count({
      where: {
        teacherUserId: report.teacherUserId,
        status: { in: ['open', 'underReview'] },
      },
    });

    if (count >= repeatedReportThreshold) {
      await trustSafetyCreateRiskFlagIfMissing(
        {
          targetType: 'creator',
          creatorUserId: report.teacherUserId,
          severity: 'high',
          source: riskFlagRuleSource,
          reason: 'repeatedReports',
        },
        context,
      );
    }
  }
}

export async function trustSafetyRunRuleScan(context: AppContext) {
  requireSignedIn(context);
  const created = [];

  const rejectedApplications =
    await prismaDangerouslyBypassRLS.creatorApplication.findMany({
      where: {
        OR: [{ identityStatus: 'rejected' }, { identityScanStatus: 'failed' }],
      },
      select: { id: true, userId: true },
    });

  for (const application of rejectedApplications) {
    const flag = await trustSafetyCreateRiskFlagIfMissing(
      {
        targetType: 'creator',
        creatorUserId: application.userId,
        creatorApplicationId: application.id,
        severity: 'high',
        source: riskFlagRuleSource,
        reason: 'identityRejected',
        createdByUserId: context.currentUser?.id || null,
      },
      context,
    );
    if (flag) {
      created.push(flag);
    }
  }

  const courseReportGroups =
    await prismaDangerouslyBypassRLS.trustSafetyReport.groupBy({
      by: ['courseId'],
      where: {
        courseId: { not: null },
        status: { in: ['open', 'underReview'] },
      },
      _count: { _all: true },
    });

  for (const group of courseReportGroups) {
    if (group.courseId && group._count._all >= repeatedReportThreshold) {
      const flag = await trustSafetyCreateRiskFlagIfMissing(
        {
          targetType: 'course',
          courseId: group.courseId,
          severity: 'high',
          source: riskFlagRuleSource,
          reason: 'repeatedReports',
          createdByUserId: context.currentUser?.id || null,
        },
        context,
      );
      if (flag) {
        created.push(flag);
      }
    }
  }

  const teacherReportGroups =
    await prismaDangerouslyBypassRLS.trustSafetyReport.groupBy({
      by: ['teacherUserId'],
      where: {
        teacherUserId: { not: null },
        status: { in: ['open', 'underReview'] },
      },
      _count: { _all: true },
    });

  for (const group of teacherReportGroups) {
    if (group.teacherUserId && group._count._all >= repeatedReportThreshold) {
      const flag = await trustSafetyCreateRiskFlagIfMissing(
        {
          targetType: 'creator',
          creatorUserId: group.teacherUserId,
          severity: 'high',
          source: riskFlagRuleSource,
          reason: 'repeatedReports',
          createdByUserId: context.currentUser?.id || null,
        },
        context,
      );
      if (flag) {
        created.push(flag);
      }
    }
  }

  const cancelledPayoutGroups =
    await prismaDangerouslyBypassRLS.creatorPayout.groupBy({
      by: ['creatorUserId'],
      where: { creatorUserId: { not: null }, status: 'cancelled' },
      _count: { _all: true },
    });

  for (const group of cancelledPayoutGroups) {
    if (group.creatorUserId && group._count._all >= 2) {
      const flag = await trustSafetyCreateRiskFlagIfMissing(
        {
          targetType: 'creator',
          creatorUserId: group.creatorUserId,
          severity: 'medium',
          source: riskFlagRuleSource,
          reason: 'payoutCancellations',
          createdByUserId: context.currentUser?.id || null,
        },
        context,
      );
      if (flag) {
        created.push(flag);
      }
    }
  }

  const disputedSessionGroups =
    await prismaDangerouslyBypassRLS.oneOnOneSession.groupBy({
      by: ['instructorUserId'],
      where: { status: { in: ['disputed', 'refunded'] } },
      _count: { _all: true },
    });

  for (const group of disputedSessionGroups) {
    if (group._count._all >= 2) {
      const flag = await trustSafetyCreateRiskFlagIfMissing(
        {
          targetType: 'creator',
          creatorUserId: group.instructorUserId,
          severity: 'high',
          source: riskFlagRuleSource,
          reason: 'sessionRefundDisputes',
          createdByUserId: context.currentUser?.id || null,
        },
        context,
      );
      if (flag) {
        created.push(flag);
      }
    }
  }

  return { createdCount: created.length, flags: created };
}
