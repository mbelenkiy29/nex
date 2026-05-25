import { z } from 'zod';
import { Context } from 'hono';
// bypass-RLS: platform-admin view spans all orgs. Caller is gated by
// platform-admin role check before any read.
// eslint-disable-next-line no-restricted-syntax
import { prismaDangerouslyBypassRLS } from '../../prisma';
import { AppContext } from '../../shared/controller/appContext';
import { Error400 } from '../../shared/errors/Error400';
import { Error404 } from '../../shared/errors/Error404';
import { auditLogCreate } from '../auditLog/auditLogCreate';
import { auditLogOperations } from '../auditLog/auditLogOperations';
import { authGuardPlatformAdminBackend } from '../platformAdmin/platformAdminGuard';
import { notifyUserDirect } from '../../shared/notification/notifyUserDirect';

const PURCHASE_INCLUDE = {
  course: { select: { id: true, title: true, slug: true } },
  user: { select: { id: true, name: true, email: true } },
  organization: { select: { id: true, name: true } },
} as const;

export const coursePurchaseListQuerySchema = z.object({
  refunded: z.enum(['true', 'false']).optional(),
  take: z.coerce.number().int().min(1).max(200).optional(),
  skip: z.coerce.number().int().min(0).optional(),
});

export const coursePurchaseRefundInputSchema = z.object({
  refundReason: z.string().trim().max(2000).optional().nullable(),
});

/**
 * Admin list of all course one-time purchases. Filterable by refunded status.
 * Used by the `CoursePurchasesCard` on the platform admin page.
 */
export async function platformAdminCoursePurchaseListController(
  query: unknown,
  context: AppContext,
  c: Context,
) {
  authGuardPlatformAdminBackend(context);
  const data = coursePurchaseListQuerySchema.parse(query);
  const take = data.take ?? 50;
  const skip = data.skip ?? 0;

  const where: {
    refundedAt?: { not: null } | null;
  } = {};
  if (data.refunded === 'true') where.refundedAt = { not: null };
  if (data.refunded === 'false') where.refundedAt = null;

  const [count, purchases] = await Promise.all([
    prismaDangerouslyBypassRLS.coursePurchase.count({ where }),
    prismaDangerouslyBypassRLS.coursePurchase.findMany({
      where,
      include: PURCHASE_INCLUDE,
      orderBy: { createdAt: 'desc' },
      take,
      skip,
    }),
  ]);

  return c.json({ count, purchases });
}

/**
 * Admin "Mark refunded" action — v1's manual refund workflow. The admin
 * issues the refund in Stripe Dashboard out-of-band first, then clicks
 * this to flip the local state:
 *   - CoursePurchase.refundedAt + refundedByUserId + refundReason
 *   - CourseEnrollment.status → 'refunded' (student loses learn-page access)
 *   - CreatorPayout.status → 'cancelled' (creator no longer owed for this sale)
 *   - audit-logged
 *
 * The student CAN re-buy after a refund; the webhook upsert flips the
 * CourseEnrollment row back to 'active' on the new purchase. v2 wires the
 * Stripe `charge.refunded` webhook for full automation.
 */
export async function platformAdminCoursePurchaseRefundController(
  params: { id: string },
  body: unknown,
  context: AppContext,
  c: Context,
) {
  const { currentUser } = authGuardPlatformAdminBackend(context);
  const data = coursePurchaseRefundInputSchema.parse(body);

  const before = await prismaDangerouslyBypassRLS.coursePurchase.findUnique({
    where: { id: params.id },
    include: PURCHASE_INCLUDE,
  });
  if (!before) {
    throw new Error404();
  }
  if (before.refundedAt) {
    throw new Error400(
      context.dictionary.course.errors.alreadyEnrolled, // misnomer; reused for "state change blocked"
    );
  }

  const updated = await prismaDangerouslyBypassRLS.$transaction(async (tx) => {
    const purchase = await tx.coursePurchase.update({
      where: { id: params.id },
      data: {
        refundedAt: new Date(),
        refundedByUserId: currentUser.id,
        refundReason: data.refundReason ?? null,
      },
      include: PURCHASE_INCLUDE,
    });

    await tx.courseEnrollment.updateMany({
      where: { courseId: before.courseId, userId: before.userId },
      data: { status: 'refunded' },
    });

    if (before.payoutId) {
      await tx.creatorPayout.update({
        where: { id: before.payoutId },
        data: { status: 'cancelled', cancelledAt: new Date() },
      });
    }

    await auditLogCreate({
      entityId: purchase.id,
      entityName: 'CoursePurchase',
      operation: auditLogOperations.update,
      context,
      tx,
      oldData: { refundedAt: null, refundReason: null },
      newData: {
        refundedAt: purchase.refundedAt,
        refundedByUserId: purchase.refundedByUserId,
        refundReason: purchase.refundReason,
      },
    });

    return purchase;
  });

  // Best-effort notification for the buyer.
  const t = context.dictionary.course.notify;
  await notifyUserDirect(before.userId, {
    title: t.courseRefundedTitle,
    message: t.courseRefundedBody.replace('{0}', before.course.title),
  });

  return c.json({ purchase: updated });
}
