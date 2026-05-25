import Stripe from 'stripe';
// bypass-RLS: Stripe server-to-server webhook — no session or org
// context. Idempotency is checked via the stripePaymentIntentId lookup.
// eslint-disable-next-line no-restricted-syntax
import { prismaDangerouslyBypassRLS } from '../../prisma';
import { AppContext } from '../../shared/controller/appContext';
import { auditLogCreate } from '../auditLog/auditLogCreate';
import { auditLogOperations } from '../auditLog/auditLogOperations';
import { computeCreatorPayout } from './oneOnOnePayoutSplit';
import {
  formatSessionWhen,
  notifyOneOnOneUser,
  scheduleOneOnOneReminders,
} from './oneOnOneService';
import { durationMs, logger } from '../../shared/lib/logger';

// Set on every 1:1 Stripe payment so the webhook can tell our checkout sessions
// apart from anything else Stripe may report.
const ONE_ON_ONE_METADATA_KIND = 'oneOnOneSession';

/**
 * Reads our `oneOnOneSessionId` out of Stripe metadata if and only if the
 * `kind` marker matches. Returns null for anything that isn't ours so the
 * subscription webhook can keep its existing fast paths.
 */
function readOneOnOneSessionId(
  metadata: Stripe.Metadata | null,
): string | null {
  if (!metadata) return null;
  if (metadata.kind !== ONE_ON_ONE_METADATA_KIND) return null;
  return metadata.oneOnOneSessionId || null;
}

/**
 * Handles `checkout.session.completed` for 1:1 sessions paid via Stripe. The
 * row was created `status=pendingPayment` at booking time, with the slot held
 * by `slotKey`. This call confirms it, records the payment intent, creates a
 * CreatorPayout split, audits, and notifies. Idempotent — Stripe retries.
 */
export async function oneOnOnePaymentWebhookHandler(
  _stripe: Stripe,
  stripeCheckoutSession: Stripe.Checkout.Session,
  context: AppContext,
): Promise<void> {
  const startedAt = Date.now();
  const sessionId = readOneOnOneSessionId(stripeCheckoutSession.metadata);
  if (!sessionId) {
    logger.debug('stripe.webhook.skipped', {
      handler: 'one_on_one_payment',
      checkoutSessionId: stripeCheckoutSession.id,
      reason: 'metadata_kind_mismatch',
    });
    return;
  }

  const session = await prismaDangerouslyBypassRLS.oneOnOneSession.findUnique({
    where: { id: sessionId },
    include: {
      course: {
        select: { id: true, title: true, creatorRevenueShareBps: true },
      },
      sessionType: { select: { title: true } },
    },
  });
  if (!session) {
    logger.warn('stripe.webhook.skipped', {
      handler: 'one_on_one_payment',
      checkoutSessionId: stripeCheckoutSession.id,
      oneOnOneSessionId: sessionId,
      reason: 'session_missing',
    });
    return;
  }

  // Idempotency: a retried webhook (or an already-confirmed/refunded row)
  // must not double-create a payout or re-notify.
  if (session.status !== 'pendingPayment') {
    logger.info('stripe.webhook.idempotent_duplicate', {
      handler: 'one_on_one_payment',
      checkoutSessionId: stripeCheckoutSession.id,
      oneOnOneSessionId: session.id,
      status: session.status,
    });
    return;
  }

  const paymentIntentId =
    typeof stripeCheckoutSession.payment_intent === 'string'
      ? stripeCheckoutSession.payment_intent
      : (stripeCheckoutSession.payment_intent?.id ?? null);

  const payoutSplit = computeCreatorPayout(
    session.priceCents ?? 0,
    session.currency,
    session.course.creatorRevenueShareBps,
  );

  const updated = await prismaDangerouslyBypassRLS.$transaction(async (tx) => {
    const payout = await tx.creatorPayout.create({
      data: {
        amount: payoutSplit.amount,
        currency: payoutSplit.currency,
        status: 'pending',
        description: `1:1 session — ${session.sessionType.title}`,
        creatorUserId: session.instructorUserId,
        courseId: session.courseId,
      },
    });

    const next = await tx.oneOnOneSession.update({
      where: { id: sessionId },
      data: {
        status: 'confirmed',
        paidAt: new Date(),
        stripePaymentIntentId: paymentIntentId,
        paymentExpiresAt: null,
        payoutId: payout.id,
      },
    });

    await auditLogCreate({
      entityId: next.id,
      entityName: 'OneOnOneSession',
      operation: auditLogOperations.update,
      organizationId: null,
      userId: session.studentUserId,
      tx,
      oldData: session,
      newData: next,
    });

    return next;
  });

  // Notify both parties — best-effort, never throws.
  const [instructor, student] = await Promise.all([
    prismaDangerouslyBypassRLS.user.findUnique({
      where: { id: updated.instructorUserId },
      select: { name: true, email: true },
    }),
    prismaDangerouslyBypassRLS.user.findUnique({
      where: { id: updated.studentUserId },
      select: { name: true, email: true },
    }),
  ]);
  const when = formatSessionWhen(updated.scheduledStartAt);
  const courseTitle = session.course.title;
  const t = context.dictionary.oneOnOneCall.notify;
  await Promise.all([
    notifyOneOnOneUser(updated.studentUserId, {
      title: t.bookingConfirmedTitle,
      message: `${t.bookingConfirmedTitle} — ${courseTitle} · ${when}`,
    }),
    notifyOneOnOneUser(updated.instructorUserId, {
      title: t.bookingConfirmedTitle,
      message: `${student?.name || student?.email || 'A student'} — ${courseTitle} · ${when}`,
    }),
  ]);
  // (instructor unused for now; kept for parity in case we add details.)
  void instructor;

  await scheduleOneOnOneReminders(
    updated.id,
    updated.scheduledStartAt,
    context.locale,
  );

  logger.info('stripe.webhook.one_on_one_payment_completed', {
    checkoutSessionId: stripeCheckoutSession.id,
    paymentIntentId,
    oneOnOneSessionId: updated.id,
    courseId: updated.courseId,
    studentUserId: updated.studentUserId,
    instructorUserId: updated.instructorUserId,
    durationMs: durationMs(startedAt),
  });
}

/**
 * Releases a pending-payment 1:1 hold: the checkout expired or the payment
 * intent failed. Sets the session `expired`, nulls `slotKey` so the slot
 * frees, and notifies the student. Idempotent and metadata-gated, so this
 * handler is safe to call for every checkout.session.expired /
 * payment_intent.payment_failed event Stripe sends — non-1:1 events are
 * silently ignored.
 */
async function releasePendingOneOnOneSession(
  sessionId: string,
  context: AppContext,
): Promise<'released' | 'skipped'> {
  const session = await prismaDangerouslyBypassRLS.oneOnOneSession.findUnique({
    where: { id: sessionId },
    include: { course: { select: { title: true } } },
  });
  if (!session || session.status !== 'pendingPayment') {
    return 'skipped';
  }
  const updated = await prismaDangerouslyBypassRLS.oneOnOneSession.update({
    where: { id: sessionId },
    data: {
      status: 'expired',
      slotKey: null,
      paymentExpiresAt: null,
    },
  });
  await auditLogCreate({
    entityId: updated.id,
    entityName: 'OneOnOneSession',
    operation: auditLogOperations.update,
    organizationId: null,
    userId: session.studentUserId,
    oldData: session,
    newData: updated,
  });
  const t = context.dictionary.oneOnOneCall.notify;
  await notifyOneOnOneUser(session.studentUserId, {
    title: t.cancelledTitle,
    message: `${session.course.title} — payment was not completed; the slot has been released.`,
  });
  return 'released';
}

export async function oneOnOneCheckoutExpiredHandler(
  stripeCheckoutSession: Stripe.Checkout.Session,
  context: AppContext,
): Promise<void> {
  const startedAt = Date.now();
  const sessionId = readOneOnOneSessionId(stripeCheckoutSession.metadata);
  if (!sessionId) {
    logger.debug('stripe.webhook.skipped', {
      handler: 'one_on_one_checkout_expired',
      checkoutSessionId: stripeCheckoutSession.id,
      reason: 'metadata_kind_mismatch',
    });
    return;
  }
  const result = await releasePendingOneOnOneSession(sessionId, context);
  logger.info('stripe.webhook.one_on_one_hold_release_processed', {
    handler: 'one_on_one_checkout_expired',
    checkoutSessionId: stripeCheckoutSession.id,
    oneOnOneSessionId: sessionId,
    result,
    durationMs: durationMs(startedAt),
  });
}

export async function oneOnOnePaymentFailedHandler(
  paymentIntent: Stripe.PaymentIntent,
  context: AppContext,
): Promise<void> {
  const startedAt = Date.now();
  const sessionId = readOneOnOneSessionId(paymentIntent.metadata ?? null);
  if (!sessionId) {
    logger.debug('stripe.webhook.skipped', {
      handler: 'one_on_one_payment_failed',
      paymentIntentId: paymentIntent.id,
      reason: 'metadata_kind_mismatch',
    });
    return;
  }
  const result = await releasePendingOneOnOneSession(sessionId, context);
  logger.info('stripe.webhook.one_on_one_hold_release_processed', {
    handler: 'one_on_one_payment_failed',
    paymentIntentId: paymentIntent.id,
    oneOnOneSessionId: sessionId,
    result,
    durationMs: durationMs(startedAt),
  });
}
