import { Prisma } from '../../../prisma/generated/client';
// bypass-RLS: platform-admin operations span every org by design. Caller
// is gated by platform-admin role check before any read.
// eslint-disable-next-line no-restricted-syntax
import { prismaDangerouslyBypassRLS } from '../../../prisma';
import { AppContext } from '../../../shared/controller/appContext';
import { Error400 } from '../../../shared/errors/Error400';
import { Error404 } from '../../../shared/errors/Error404';
import { getFrontendUrl } from '../../../shared/lib/getFrontendUrl';
import { sendEmail } from '../../../shared/lib/sendEmail';
import { notifyUserDirect } from '../../../shared/notification/notifyUserDirect';
import { dictionaryFormat } from '../../../translation/dictionaryFormat';
import { auditLogCreate } from '../../auditLog/auditLogCreate';
import { auditLogOperations } from '../../auditLog/auditLogOperations';
import { platformAdminIsUserAllowed } from '../platformAdminGuard';
import {
  creatorPayoutCreateInputSchema,
  creatorPayoutUpdateStatusInputSchema,
  platformAdminInvitationCreateInputSchema,
  platformAdminListInputSchema,
  platformPromotionCreateInputSchema,
  platformPromotionUpdateInputSchema,
} from '../platformAdminSchemas';
import { authGuardPlatformAdminBackend } from '../platformAdminGuard';
import { platformMetricsBuild } from '../platformMetricsService';

const defaultTake = 25;
const dashboardDays = 7;

export function serializePayout(payout: any) {
  return {
    ...payout,
    amount: Number(payout.amount),
  };
}

function startOfDay(date: Date) {
  const next = new Date(date);
  next.setHours(0, 0, 0, 0);
  return next;
}

function formatDateKey(date: Date) {
  return date.toISOString().slice(0, 10);
}

function makeDailyBuckets(days: number) {
  const today = startOfDay(new Date());

  return Array.from({ length: days }, (_, index) => {
    const date = new Date(today);
    date.setDate(today.getDate() - (days - index - 1));

    return {
      date: formatDateKey(date),
      value: 0,
    };
  });
}

export async function platformAdminMeController(context: AppContext) {
  return {
    isPlatformAdmin: platformAdminIsUserAllowed(context.currentUser?.email),
  };
}

export async function platformAdminMetricsController(
  query: unknown,
  context: AppContext,
) {
  authGuardPlatformAdminBackend(context);

  return await platformMetricsBuild(query);
}

export async function platformAdminOverviewController(context: AppContext) {
  authGuardPlatformAdminBackend(context);
  const trendStart = startOfDay(new Date());
  trendStart.setDate(trendStart.getDate() - (dashboardDays - 1));

  const [
    users,
    organizations,
    students,
    activeSubscriptions,
    pendingInvitations,
    activePromotions,
    pendingPayouts,
    totalPayouts,
    payoutStatusTotals,
    recentPayouts,
    creatorPayoutOwners,
    roleCounts,
    disabledMembers,
    unreadNotifications,
    recentAuditLogs,
  ] = await Promise.all([
    prismaDangerouslyBypassRLS.user.count(),
    prismaDangerouslyBypassRLS.organization.count(),
    prismaDangerouslyBypassRLS.member.count({
      where: { disabled: false, role: 'member' },
    }),
    prismaDangerouslyBypassRLS.subscription.count({
      where: { status: { in: ['active', 'trialing'] } },
    }),
    prismaDangerouslyBypassRLS.invitation.count({
      where: { status: 'pending' },
    }),
    prismaDangerouslyBypassRLS.platformPromotion.count({
      where: { isActive: true },
    }),
    prismaDangerouslyBypassRLS.creatorPayout.count({
      where: { status: 'pending' },
    }),
    prismaDangerouslyBypassRLS.creatorPayout.aggregate({
      _sum: { amount: true },
    }),
    prismaDangerouslyBypassRLS.creatorPayout.groupBy({
      by: ['status'],
      _count: { _all: true },
      _sum: { amount: true },
    }),
    prismaDangerouslyBypassRLS.creatorPayout.findMany({
      where: { createdAt: { gte: trendStart } },
      select: {
        amount: true,
        createdAt: true,
        status: true,
      },
      orderBy: { createdAt: 'asc' },
    }),
    prismaDangerouslyBypassRLS.creatorPayout.findMany({
      where: {
        OR: [
          { creatorUserId: { not: null } },
          { creatorMemberId: { not: null } },
        ],
      },
      select: {
        creatorUserId: true,
        creatorMemberId: true,
      },
    }),
    prismaDangerouslyBypassRLS.member.groupBy({
      by: ['role'],
      _count: { _all: true },
    }),
    prismaDangerouslyBypassRLS.member.count({
      where: { disabled: true },
    }),
    prismaDangerouslyBypassRLS.notification.count({
      where: { readAt: null },
    }),
    prismaDangerouslyBypassRLS.auditLog.findMany({
      orderBy: { timestamp: 'desc' },
      take: 6,
    }),
  ]);

  const auditUserIds = recentAuditLogs
    .map((auditLog) => auditLog.userId)
    .filter(Boolean) as Array<string>;

  const auditUsers = auditUserIds.length
    ? await prismaDangerouslyBypassRLS.user.findMany({
        where: { id: { in: auditUserIds } },
        select: { id: true, email: true, name: true },
      })
    : [];

  const auditUsersById = new Map(auditUsers.map((user) => [user.id, user]));
  const payoutTrend = makeDailyBuckets(dashboardDays);
  const payoutTrendByDate = new Map(
    payoutTrend.map((item) => [item.date, item]),
  );

  recentPayouts.forEach((payout) => {
    const bucket = payoutTrendByDate.get(formatDateKey(payout.createdAt));
    if (bucket) {
      bucket.value += Number(payout.amount);
    }
  });

  const payoutSummary = payoutStatusTotals.reduce(
    (summary, item) => ({
      ...summary,
      [item.status]: {
        count: item._count._all,
        amount: Number(item._sum.amount || 0),
      },
    }),
    {} as Record<string, { count: number; amount: number }>,
  );
  const activeCreators = new Set(
    creatorPayoutOwners.map(
      (owner) => owner.creatorUserId || owner.creatorMemberId,
    ),
  ).size;

  return {
    users,
    organizations,
    students,
    activeCreators,
    activeSubscriptions,
    pendingInvitations,
    activePromotions,
    pendingPayouts,
    unreadNotifications,
    totalPayoutAmount: Number(totalPayouts._sum.amount || 0),
    payoutSummary,
    payoutTrend,
    roleCounts: roleCounts.map((roleCount) => ({
      role: roleCount.role,
      count: roleCount._count._all,
    })),
    risk: {
      disabledMembers,
      pendingPayouts,
      cancelledPayouts: payoutSummary.cancelled?.count || 0,
      cancelledPayoutAmount: payoutSummary.cancelled?.amount || 0,
    },
    recentAuditLogs: recentAuditLogs.map((auditLog) => {
      const user = auditLog.userId ? auditUsersById.get(auditLog.userId) : null;

      return {
        id: auditLog.id,
        timestamp: auditLog.timestamp.toISOString(),
        entityName: auditLog.entityName,
        operation: auditLog.operation,
        authorName: user?.name || user?.email || null,
        authorEmail: user?.email || null,
      };
    }),
  };
}

export async function platformAdminStudentsController(
  query: unknown,
  context: AppContext,
) {
  authGuardPlatformAdminBackend(context);
  const data = platformAdminListInputSchema.parse(query);
  const search = data.filter?.search?.trim();
  const role = data.filter?.role;
  const status = data.filter?.status;
  const whereAnd: Array<Prisma.UserWhereInput> = [];

  if (search) {
    whereAnd.push({
      OR: [
        { email: { contains: search, mode: 'insensitive' } },
        { name: { contains: search, mode: 'insensitive' } },
        {
          members: {
            some: {
              OR: [
                { fullName: { contains: search, mode: 'insensitive' } },
                { firstName: { contains: search, mode: 'insensitive' } },
                { lastName: { contains: search, mode: 'insensitive' } },
              ],
            },
          },
        },
      ],
    });
  }

  if (role && role !== 'all') {
    whereAnd.push({ members: { some: { role } } });
  }

  if (status === 'active') {
    whereAnd.push({ members: { some: { disabled: false } } });
  }

  if (status === 'disabled') {
    whereAnd.push({ members: { some: { disabled: true } } });
  }

  const where: Prisma.UserWhereInput = whereAnd.length ? { AND: whereAnd } : {};

  const [count, users] = await Promise.all([
    prismaDangerouslyBypassRLS.user.count({ where }),
    prismaDangerouslyBypassRLS.user.findMany({
      where,
      include: {
        members: {
          include: { organization: true },
          orderBy: { createdAt: 'desc' },
        },
      },
      orderBy: { createdAt: 'desc' },
      skip: data.skip || 0,
      take: data.take || defaultTake,
    }),
  ]);

  const userIds = users.map((user) => user.id);
  const creatorEarnings = userIds.length
    ? await prismaDangerouslyBypassRLS.creatorPayout.groupBy({
        by: ['creatorUserId'],
        where: {
          creatorUserId: { in: userIds },
          status: 'paid',
        },
        _sum: { amount: true },
      })
    : [];

  const creatorEarningsByUserId = new Map(
    creatorEarnings
      .filter((item) => item.creatorUserId)
      .map((item) => [item.creatorUserId, Number(item._sum.amount || 0)]),
  );

  return {
    count,
    users: users.map((user) => ({
      ...user,
      creatorEarnings: creatorEarningsByUserId.get(user.id) || 0,
      accessStatus: user.members.some((member) => member.disabled)
        ? 'disabled'
        : 'active',
      primaryRole: user.members.some((member) => member.role === 'admin')
        ? 'admin'
        : 'member',
    })),
  };
}

export async function platformAdminOrganizationsController(
  query: unknown,
  context: AppContext,
) {
  authGuardPlatformAdminBackend(context);
  const data = platformAdminListInputSchema.parse(query);
  const search = data.filter?.search?.trim();

  const where: Prisma.OrganizationWhereInput = search
    ? {
        OR: [
          { name: { contains: search, mode: 'insensitive' } },
          { slug: { contains: search, mode: 'insensitive' } },
        ],
      }
    : {};

  const organizations = await prismaDangerouslyBypassRLS.organization.findMany({
    where,
    select: {
      id: true,
      name: true,
      slug: true,
    },
    orderBy: { name: 'asc' },
    take: data.take || 100,
  });

  return { organizations };
}

export async function platformAdminInvitationCreateController(
  body: unknown,
  context: AppContext,
) {
  const { currentUser } = authGuardPlatformAdminBackend(context);
  const data = platformAdminInvitationCreateInputSchema.parse(body);

  const organization = await prismaDangerouslyBypassRLS.organization.findUnique(
    {
      where: { id: data.organizationId },
    },
  );

  if (!organization) {
    throw new Error404();
  }

  const existingPending = await prismaDangerouslyBypassRLS.invitation.findFirst(
    {
      where: {
        email: data.email,
        organizationId: data.organizationId,
        status: 'pending',
      },
    },
  );

  if (existingPending) {
    throw new Error400(context.dictionary.platformAdmin.errors.inviteExists);
  }

  const invitation = await prismaDangerouslyBypassRLS.invitation.create({
    data: {
      email: data.email,
      organizationId: data.organizationId,
      inviterId: currentUser.id,
      role: data.role,
      status: 'pending',
      expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 48),
    },
  });

  const existingUser = await prismaDangerouslyBypassRLS.user.findFirst({
    where: { email: data.email },
    select: { id: true },
  });

  const inviteLink = `${getFrontendUrl(
    organization.slug,
  )}/auth/invitation?token=${invitation.id}&email=${encodeURIComponent(
    data.email,
  )}${existingUser ? '&existingUser=true' : ''}`;

  await sendEmail(
    data.email,
    null,
    context.dictionary.platformAdmin.invitation.emailSubject,
    context.dictionary.platformAdmin.invitation.emailBody
      .replace('{0}', organization.name)
      .replace('{1}', inviteLink),
    'HTML',
  );

  await auditLogCreate({
    entityId: invitation.id,
    entityName: 'Invitation',
    operation: auditLogOperations.create,
    organizationId: organization.id,
    userId: currentUser.id,
    newData: invitation,
  });

  return { invitation, inviteLink };
}

export async function platformAdminMemberStatusController(
  params: { id: string; disabled: boolean },
  context: AppContext,
) {
  const { currentUser } = authGuardPlatformAdminBackend(context);

  const oldData = await prismaDangerouslyBypassRLS.member.findUnique({
    where: { id: params.id },
  });

  if (!oldData) {
    throw new Error404();
  }

  const member = await prismaDangerouslyBypassRLS.member.update({
    where: { id: params.id },
    data: {
      disabled: params.disabled,
      updatedByUserId: currentUser.id,
    },
    include: { user: true, organization: true },
  });

  await auditLogCreate({
    entityId: member.id,
    entityName: 'Member',
    operation: auditLogOperations.update,
    organizationId: member.organizationId,
    userId: currentUser.id,
    oldData,
    newData: member,
  });

  return { member };
}

export async function platformPromotionListController(
  query: unknown,
  context: AppContext,
) {
  authGuardPlatformAdminBackend(context);
  const data = platformAdminListInputSchema.parse(query);

  const [count, promotions] = await Promise.all([
    prismaDangerouslyBypassRLS.platformPromotion.count(),
    prismaDangerouslyBypassRLS.platformPromotion.findMany({
      include: { organization: true, createdByUser: true },
      orderBy: { createdAt: 'desc' },
      skip: data.skip || 0,
      take: data.take || defaultTake,
    }),
  ]);

  return { count, promotions };
}

export async function platformPromotionCreateController(
  body: unknown,
  context: AppContext,
) {
  const { currentUser } = authGuardPlatformAdminBackend(context);
  const data = platformPromotionCreateInputSchema.parse(body);

  const promotion = await prismaDangerouslyBypassRLS.platformPromotion.create({
    data: {
      ...data,
      createdByUserId: currentUser.id,
      updatedByUserId: currentUser.id,
    },
    include: { organization: true, createdByUser: true },
  });

  await auditLogCreate({
    entityId: promotion.id,
    entityName: 'PlatformPromotion',
    operation: auditLogOperations.create,
    organizationId: promotion.organizationId,
    userId: currentUser.id,
    newData: promotion,
  });

  return { promotion };
}

export async function platformPromotionUpdateController(
  params: { id: string },
  body: unknown,
  context: AppContext,
) {
  const { currentUser } = authGuardPlatformAdminBackend(context);
  const data = platformPromotionUpdateInputSchema.parse(body);
  const oldData = await prismaDangerouslyBypassRLS.platformPromotion.findUnique(
    {
      where: { id: params.id },
    },
  );

  if (!oldData) {
    throw new Error404();
  }

  const promotion = await prismaDangerouslyBypassRLS.platformPromotion.update({
    where: { id: params.id },
    data: {
      ...data,
      updatedByUserId: currentUser.id,
    },
    include: { organization: true, createdByUser: true },
  });

  await auditLogCreate({
    entityId: promotion.id,
    entityName: 'PlatformPromotion',
    operation: auditLogOperations.update,
    organizationId: promotion.organizationId,
    userId: currentUser.id,
    oldData,
    newData: promotion,
  });

  return { promotion };
}

export async function platformPromotionActiveController(context: AppContext) {
  if (!context.currentUser) {
    return { promotions: [] };
  }

  const now = new Date();
  const role = context.currentMember?.role;
  const audience = role === 'admin' ? ['all', 'admins'] : ['all', 'students'];

  const promotions =
    await prismaDangerouslyBypassRLS.platformPromotion.findMany({
      where: {
        isActive: true,
        audience: { in: audience },
        OR: [
          { organizationId: null },
          ...(context.currentOrganization?.id
            ? [{ organizationId: context.currentOrganization.id }]
            : []),
        ],
        AND: [
          { OR: [{ startsAt: null }, { startsAt: { lte: now } }] },
          { OR: [{ endsAt: null }, { endsAt: { gte: now } }] },
        ],
      },
      orderBy: { createdAt: 'desc' },
      take: 10,
    });

  return { promotions };
}

export async function creatorPayoutListController(
  query: unknown,
  context: AppContext,
) {
  authGuardPlatformAdminBackend(context);
  const data = platformAdminListInputSchema.parse(query);
  const status = data.filter?.status;

  const where: Prisma.CreatorPayoutWhereInput = status ? { status } : {};

  const [count, payouts] = await Promise.all([
    prismaDangerouslyBypassRLS.creatorPayout.count({ where }),
    prismaDangerouslyBypassRLS.creatorPayout.findMany({
      where,
      include: {
        organization: true,
        course: true,
        creatorUser: true,
        creatorMember: true,
        createdByUser: true,
      },
      orderBy: { createdAt: 'desc' },
      skip: data.skip || 0,
      take: data.take || defaultTake,
    }),
  ]);

  return { count, payouts: payouts.map(serializePayout) };
}

export async function creatorPayoutCreateController(
  body: unknown,
  context: AppContext,
) {
  const { currentUser } = authGuardPlatformAdminBackend(context);
  const data = creatorPayoutCreateInputSchema.parse(body);

  const payout = await prismaDangerouslyBypassRLS.creatorPayout.create({
    data: {
      ...data,
      currency: data.currency.toUpperCase(),
      status: 'pending',
      createdByUserId: currentUser.id,
      updatedByUserId: currentUser.id,
    },
    include: {
      organization: true,
      course: true,
      creatorUser: true,
      creatorMember: true,
      createdByUser: true,
    },
  });

  await auditLogCreate({
    entityId: payout.id,
    entityName: 'CreatorPayout',
    operation: auditLogOperations.create,
    organizationId: payout.organizationId,
    userId: currentUser.id,
    newData: serializePayout(payout),
  });

  return { payout: serializePayout(payout) };
}

export async function creatorPayoutStatusController(
  params: { id: string },
  body: unknown,
  context: AppContext,
) {
  const { currentUser } = authGuardPlatformAdminBackend(context);
  const data = creatorPayoutUpdateStatusInputSchema.parse(body);
  const oldData = await prismaDangerouslyBypassRLS.creatorPayout.findUnique({
    where: { id: params.id },
  });

  if (!oldData) {
    throw new Error404();
  }

  const payout = await prismaDangerouslyBypassRLS.creatorPayout.update({
    where: { id: params.id },
    data: {
      status: data.status,
      paidAt: data.status === 'paid' ? new Date() : null,
      cancelledAt: data.status === 'cancelled' ? new Date() : null,
      updatedByUserId: currentUser.id,
    },
    include: {
      organization: true,
      course: true,
      creatorUser: true,
      creatorMember: true,
      createdByUser: true,
    },
  });

  await auditLogCreate({
    entityId: payout.id,
    entityName: 'CreatorPayout',
    operation: auditLogOperations.update,
    organizationId: payout.organizationId,
    userId: currentUser.id,
    oldData: serializePayout(oldData),
    newData: serializePayout(payout),
  });

  // Notify the creator. Skip silently if the payout was filed against a
  // Member with no associated User (admin manual entry edge case) or if the
  // status didn't actually move (defensive).
  if (payout.creatorUserId && data.status !== oldData.status) {
    const t = context.dictionary.creatorEarnings.notify;
    const amount = Number(payout.amount).toFixed(2);
    if (data.status === 'paid') {
      await notifyUserDirect(payout.creatorUserId, {
        title: t.payoutPaidTitle,
        message: dictionaryFormat(t.payoutPaidBody, amount, payout.currency),
      });
    } else if (data.status === 'cancelled') {
      await notifyUserDirect(payout.creatorUserId, {
        title: t.payoutCancelledTitle,
        message: dictionaryFormat(
          t.payoutCancelledBody,
          amount,
          payout.currency,
        ),
      });
    }
  }

  return { payout: serializePayout(payout) };
}
