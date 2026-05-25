import { AppContext } from '../../../shared/controller/appContext';
import { Error400 } from '../../../shared/errors/Error400';
import { Error404 } from '../../../shared/errors/Error404';
import { prisma } from '../../../prisma';
import { auditLogCreate } from '../../auditLog/auditLogCreate';
import { auditLogOperations } from '../../auditLog/auditLogOperations';
import {
  formatSessionWhen,
  notifyOneOnOneUser,
  refundOneOnOneSession,
} from '../../oneOnOneCall/oneOnOneService';
import { oneOnOneResolveDisputeSchema } from '../../oneOnOneCall/oneOnOneSchemas';
import { authGuardPlatformAdminBackend } from '../platformAdminGuard';

// Statuses an open dispute can be resolved from. `resolvedRefund` and
// `resolvedNoRefund` are terminal — re-resolving them is rejected.
const RESOLVABLE = new Set(['open', 'underReview']);

const VALID_LIST_STATUSES = new Set([
  'open',
  'underReview',
  'resolvedRefund',
  'resolvedNoRefund',
]);

const disputeInclude = {
  session: {
    include: {
      course: { select: { id: true, title: true, slug: true } },
      sessionType: {
        select: { id: true, title: true, durationMinutes: true },
      },
      instructorUser: { select: { id: true, name: true, email: true } },
      studentUser: { select: { id: true, name: true, email: true } },
    },
  },
  openedByUser: { select: { id: true, name: true, email: true } },
} as const;

/**
 * Platform-admin: list 1:1 disputes, newest first, optionally filtered by
 * status. Includes the session, both parties, and the payment/refund state
 * so the console can render at-a-glance triage.
 */
export async function oneOnOneDisputeAdminListController(
  query: unknown,
  context: AppContext,
) {
  authGuardPlatformAdminBackend(context);
  const status =
    typeof (query as any)?.status === 'string' &&
    VALID_LIST_STATUSES.has((query as any).status)
      ? ((query as any).status as
          | 'open'
          | 'underReview'
          | 'resolvedRefund'
          | 'resolvedNoRefund')
      : undefined;

  const disputes = await prisma.oneOnOneDispute.findMany({
    where: status ? { status } : undefined,
    include: disputeInclude,
    orderBy: { createdAt: 'desc' },
    take: 200,
  });
  return { disputes };
}

export async function oneOnOneDisputeAdminFindController(
  id: string,
  context: AppContext,
) {
  authGuardPlatformAdminBackend(context);
  const dispute = await prisma.oneOnOneDispute.findUnique({
    where: { id },
    include: disputeInclude,
  });
  if (!dispute) {
    throw new Error404();
  }
  return { dispute };
}

/**
 * Resolve a dispute. On `refund`, hand off to `refundOneOnOneSession` (which
 * is Stripe-idempotent and flips the session to `'refunded'` + cancels the
 * matching `CreatorPayout`). On `noRefund`, the session keeps its prior
 * status; only the dispute row moves. Both parties are notified.
 */
export async function oneOnOneDisputeAdminResolveController(
  id: string,
  body: unknown,
  context: AppContext,
) {
  authGuardPlatformAdminBackend(context);
  const data = oneOnOneResolveDisputeSchema.parse(body);
  const t = context.dictionary.oneOnOneCall;

  const dispute = await prisma.oneOnOneDispute.findUnique({
    where: { id },
    include: {
      session: {
        include: {
          course: { select: { title: true } },
        },
      },
    },
  });
  if (!dispute) {
    throw new Error404();
  }
  if (!RESOLVABLE.has(dispute.status)) {
    throw new Error400(t.dispute.alreadyDisputed);
  }

  const session = dispute.session;

  if (data.resolution === 'refund') {
    // refundOneOnOneSession is idempotent + a no-op for free / unpaid rows;
    // it updates session.status to 'refunded' and cancels the CreatorPayout.
    await refundOneOnOneSession(session, data.refundCents);
  }

  const nextStatus =
    data.resolution === 'refund' ? 'resolvedRefund' : 'resolvedNoRefund';

  const updated = await prisma.oneOnOneDispute.update({
    where: { id },
    data: {
      status: nextStatus,
      resolutionNotes: data.resolutionNotes ?? null,
      resolvedByUserId: context.currentUser!.id,
      resolvedAt: new Date(),
    },
    include: disputeInclude,
  });

  await auditLogCreate({
    entityId: updated.id,
    entityName: 'OneOnOneDispute',
    operation: auditLogOperations.update,
    organizationId: null,
    userId: context.currentUser!.id,
    oldData: dispute,
    newData: updated,
  });

  // Notify both parties with the resolution outcome.
  const outcomeMessage =
    data.resolution === 'refund'
      ? t.dispute.outcomeRefund
      : t.dispute.outcomeNoRefund;
  const message = `${session.course.title} · ${formatSessionWhen(session.scheduledStartAt)} — ${outcomeMessage}`;

  await Promise.all([
    notifyOneOnOneUser(session.studentUserId, {
      title: t.notify.disputeResolvedTitle,
      message,
    }),
    notifyOneOnOneUser(session.instructorUserId, {
      title: t.notify.disputeResolvedTitle,
      message,
    }),
  ]);

  // Refresh the session view so the response carries the post-refund status.
  const refreshedSession = await prisma.oneOnOneSession.findUnique({
    where: { id: session.id },
  });
  return { dispute: updated, session: refreshedSession };
}
