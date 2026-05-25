import Stripe from 'stripe';
// bypass-RLS: Stripe server-to-server webhook — no session or org context
// available. Idempotency is checked via the stripePaymentIntentId lookup.
// eslint-disable-next-line no-restricted-syntax
import { prismaDangerouslyBypassRLS } from '../../prisma';
import { AppContext } from '../../shared/controller/appContext';
import { auditLogCreate } from '../auditLog/auditLogCreate';
import { auditLogOperations } from '../auditLog/auditLogOperations';
import { notifyUserDirect } from '../../shared/notification/notifyUserDirect';
import { computeCreatorPayout } from '../oneOnOneCall/oneOnOnePayoutSplit';
import { durationMs, logger } from '../../shared/lib/logger';

// Distinguishes course-purchase checkout sessions from anything else Stripe
// may send. Mirrors the 1:1 pattern but with a different kind value so the
// chained webhook handlers in subscriptionWebhookController don't collide.
export const COURSE_PURCHASE_METADATA_KIND = 'coursePurchase';

interface CoursePurchaseMetadata {
  courseId: string;
  userId: string;
  memberId: string | null;
  organizationId: string | null;
  couponId: string | null;
  discountCents: number;
}

function readCoursePurchaseMetadata(
  metadata: Stripe.Metadata | null,
): CoursePurchaseMetadata | null {
  if (!metadata) return null;
  if (metadata.kind !== COURSE_PURCHASE_METADATA_KIND) return null;
  if (!metadata.courseId || !metadata.userId) return null;
  return {
    courseId: metadata.courseId,
    userId: metadata.userId,
    memberId: metadata.memberId || null,
    organizationId: metadata.organizationId || null,
    couponId: metadata.couponId || null,
    discountCents: Number(metadata.discountCents || 0),
  };
}

/**
 * Handles `checkout.session.completed` for course one-time purchases. Inserts
 * a CoursePurchase row (unique on `stripeCheckoutSessionId` — Stripe retries
 * land as a no-op), upserts the CourseEnrollment (re-purchase after refund
 * flips status back to `active`), creates a pending CreatorPayout via the
 * shared `computeCreatorPayout` split, audits, and notifies the buyer.
 *
 * Metadata-gated: any non-course `mode:'payment'` event is silently skipped.
 */
export async function coursePaymentWebhookHandler(
  _stripe: Stripe,
  stripeCheckoutSession: Stripe.Checkout.Session,
  context: AppContext,
): Promise<void> {
  const startedAt = Date.now();
  const meta = readCoursePurchaseMetadata(stripeCheckoutSession.metadata);
  if (!meta) {
    logger.debug('stripe.webhook.skipped', {
      handler: 'course_purchase',
      checkoutSessionId: stripeCheckoutSession.id,
      reason: 'metadata_kind_mismatch',
    });
    return;
  }

  // Idempotency: a retried webhook (or a duplicate `checkout.session.completed`)
  // must not insert two CoursePurchase rows.
  const existing = await prismaDangerouslyBypassRLS.coursePurchase.findUnique({
    where: { stripeCheckoutSessionId: stripeCheckoutSession.id },
    select: { id: true },
  });
  if (existing) {
    logger.info('stripe.webhook.idempotent_duplicate', {
      handler: 'course_purchase',
      checkoutSessionId: stripeCheckoutSession.id,
      coursePurchaseId: existing.id,
      courseId: meta.courseId,
      userId: meta.userId,
    });
    return;
  }

  const course = await prismaDangerouslyBypassRLS.course.findUnique({
    where: { id: meta.courseId },
    select: {
      id: true,
      title: true,
      slug: true,
      currency: true,
      priceCents: true,
      creatorUserId: true,
      creatorMemberId: true,
      creatorRevenueShareBps: true,
    },
  });
  if (!course) {
    logger.warn('stripe.webhook.skipped', {
      handler: 'course_purchase',
      checkoutSessionId: stripeCheckoutSession.id,
      courseId: meta.courseId,
      userId: meta.userId,
      reason: 'course_missing',
    });
    return;
  }

  const paymentIntentId =
    typeof stripeCheckoutSession.payment_intent === 'string'
      ? stripeCheckoutSession.payment_intent
      : (stripeCheckoutSession.payment_intent?.id ?? null);

  const amountTotal =
    stripeCheckoutSession.amount_total ?? course.priceCents ?? 0;
  const sessionCurrency = (
    stripeCheckoutSession.currency ||
    course.currency ||
    'USD'
  ).toUpperCase();

  const payoutSplit = computeCreatorPayout(
    amountTotal,
    sessionCurrency,
    course.creatorRevenueShareBps,
  );

  await prismaDangerouslyBypassRLS.$transaction(async (tx) => {
    // Pending payout row first so we can reference it from CoursePurchase.
    const payout = course.creatorUserId
      ? await tx.creatorPayout.create({
          data: {
            amount: payoutSplit.amount,
            currency: payoutSplit.currency,
            status: 'pending',
            description: `Course purchase — ${course.title}`,
            creatorUserId: course.creatorUserId,
            creatorMemberId: course.creatorMemberId,
            courseId: course.id,
          },
        })
      : null;

    const purchase = await tx.coursePurchase.create({
      data: {
        courseId: course.id,
        userId: meta.userId,
        memberId: meta.memberId,
        organizationId: meta.organizationId,
        stripeCheckoutSessionId: stripeCheckoutSession.id,
        stripePaymentIntentId: paymentIntentId,
        priceCents: amountTotal,
        currency: sessionCurrency,
        paidAt: new Date(),
        payoutId: payout?.id ?? null,
      },
    });

    if (meta.couponId && meta.discountCents > 0) {
      const oldCoupon = await tx.courseCoupon.findUnique({
        where: { id: meta.couponId },
      });
      const redemption = await tx.courseCouponRedemption.create({
        data: {
          couponId: meta.couponId,
          userId: meta.userId,
          courseId: course.id,
          purchaseId: purchase.id,
          discountCents: meta.discountCents,
          currency: sessionCurrency,
        },
      });
      const updatedCoupon = await tx.courseCoupon.update({
        where: { id: meta.couponId },
        data: { redeemedCount: { increment: 1 } },
      });
      await auditLogCreate({
        entityId: redemption.id,
        entityName: 'CourseCouponRedemption',
        operation: auditLogOperations.create,
        organizationId: meta.organizationId,
        userId: meta.userId,
        memberId: meta.memberId,
        tx,
        newData: redemption,
      });
      await auditLogCreate({
        entityId: updatedCoupon.id,
        entityName: 'CourseCoupon',
        operation: auditLogOperations.update,
        organizationId: meta.organizationId,
        userId: meta.userId,
        memberId: meta.memberId,
        tx,
        oldData: oldCoupon,
        newData: updatedCoupon,
      });
    }

    // Upsert respects the @@unique([courseId, userId]) on CourseEnrollment.
    // Refunded → active is the re-purchase happy path. Existing active rows
    // are touched (no-op) so the audit log shows when the row was last paid.
    await tx.courseEnrollment.upsert({
      where: { courseId_userId: { courseId: course.id, userId: meta.userId } },
      update: { status: 'active', enrolledAt: new Date(), completedAt: null },
      create: {
        courseId: course.id,
        userId: meta.userId,
        memberId: meta.memberId,
        status: 'active',
        enrolledAt: new Date(),
      },
    });

    await auditLogCreate({
      entityId: purchase.id,
      entityName: 'CoursePurchase',
      operation: auditLogOperations.create,
      organizationId: meta.organizationId,
      userId: meta.userId,
      memberId: meta.memberId,
      tx,
      newData: purchase,
    });
  });

  // Best-effort notification. Cross-tenant safe via notifyUserDirect.
  const t = context.dictionary.course.notify;
  await notifyUserDirect(meta.userId, {
    title: t.coursePurchaseConfirmedTitle,
    message: t.coursePurchaseConfirmedBody.replace('{0}', course.title),
  });

  logger.info('stripe.webhook.course_purchase_completed', {
    checkoutSessionId: stripeCheckoutSession.id,
    paymentIntentId,
    courseId: course.id,
    userId: meta.userId,
    organizationId: meta.organizationId,
    amountTotal,
    currency: sessionCurrency,
    durationMs: durationMs(startedAt),
  });
}
