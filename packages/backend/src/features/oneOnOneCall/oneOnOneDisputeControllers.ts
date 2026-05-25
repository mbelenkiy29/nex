import { Context } from 'hono';
import { AppContext } from '../../shared/controller/appContext';
import { Error400 } from '../../shared/errors/Error400';
import { Error404 } from '../../shared/errors/Error404';
// bypass-RLS: dispute resolution notifies platform admins across all
// orgs (admin role is platform-level, not per-org). Caller authorization
// is checked before any cross-org fan-out.
// eslint-disable-next-line no-restricted-syntax
import { prisma, prismaDangerouslyBypassRLS } from '../../prisma';
import { env } from '../../env';
import { auditLogCreate } from '../auditLog/auditLogCreate';
import { auditLogOperations } from '../auditLog/auditLogOperations';
import { oneOnOneOpenDisputeSchema } from './oneOnOneSchemas';
import {
  formatSessionWhen,
  notifyOneOnOneUser,
  oneOnOneDisplayName,
  requireOneOnOneUser,
} from './oneOnOneService';

// Only completed or no-show sessions can be disputed. Anything still in-flight
// ('confirmed', 'pendingPayment') should be cancelled instead; already-cancelled
// /-refunded / -expired sessions have already been resolved.
const DISPUTABLE_STATUSES = new Set(['completed', 'noShow']);

/**
 * Student-side: opens a dispute on a paid 1:1 that has already ended. Flips
 * `OneOnOneSession.status` to `'disputed'` and creates a single
 * `OneOnOneDispute` row (the model has `sessionId @unique` — at most one
 * dispute per session). The instructor and every platform admin who has a
 * `User` row gets a per-user notification.
 */
export async function oneOnOneOpenDisputeController(
  sessionId: string,
  body: unknown,
  context: AppContext,
  c: Context,
) {
  const data = oneOnOneOpenDisputeSchema.parse(body);
  const { userId } = requireOneOnOneUser(context);
  const t = context.dictionary.oneOnOneCall;
  const errors = t.dispute;

  const session = await prisma.oneOnOneSession.findUnique({
    where: { id: sessionId },
    include: {
      course: { select: { title: true } },
      instructorUser: { select: { id: true, name: true, email: true } },
      studentUser: { select: { id: true, name: true, email: true } },
      dispute: { select: { id: true } },
    },
  });
  if (!session) {
    throw new Error404();
  }
  if (session.studentUserId !== userId) {
    // Surface as 400 (not 403) so the message can explain "student-only".
    throw new Error400(errors.notEligible);
  }
  if (!session.paidAt || !session.priceCents) {
    throw new Error400(errors.notEligible);
  }
  if (!DISPUTABLE_STATUSES.has(session.status)) {
    throw new Error400(errors.notEligible);
  }
  if (session.dispute) {
    throw new Error400(errors.alreadyDisputed);
  }

  const { dispute, updatedSession } = await prisma.$transaction(async (tx) => {
    const dispute = await tx.oneOnOneDispute.create({
      data: {
        sessionId,
        openedByUserId: userId,
        reason: data.reason,
      },
    });
    const updatedSession = await tx.oneOnOneSession.update({
      where: { id: sessionId },
      data: { status: 'disputed' },
    });
    return { dispute, updatedSession };
  });

  await auditLogCreate({
    entityId: dispute.id,
    entityName: 'OneOnOneDispute',
    operation: auditLogOperations.create,
    organizationId: null,
    userId,
    newData: dispute,
  });

  // Notify the instructor and every platform admin that has a User row.
  const when = formatSessionWhen(session.scheduledStartAt);
  const studentName = oneOnOneDisplayName(session.studentUser);
  const body2 = `${studentName} — ${session.course.title} · ${when}`;

  await notifyOneOnOneUser(session.instructorUserId, {
    title: t.notify.disputeOpenedTitle,
    message: body2,
  });

  const adminEmails = env.PLATFORM_ADMIN_EMAILS ?? [];
  if (adminEmails.length > 0) {
    const admins = await prismaDangerouslyBypassRLS.user.findMany({
      where: { email: { in: adminEmails } },
      select: { id: true },
    });
    await Promise.all(
      admins.map((admin) =>
        notifyOneOnOneUser(admin.id, {
          title: t.notify.disputeOpenedTitle,
          message: body2,
        }),
      ),
    );
  }

  return c.json({ dispute, session: updatedSession });
}
