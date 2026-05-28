import Stripe from 'stripe';
// bypass-RLS: Stripe webhook runs without a user/org session and is gated by
// Checkout metadata + idempotent Stripe session ids.
// eslint-disable-next-line no-restricted-syntax
import { prismaDangerouslyBypassRLS } from '../../prisma';
import { AppContext } from '../../shared/controller/appContext';
import { durationMs, logger } from '../../shared/lib/logger';
import { auditLogCreate } from '../auditLog/auditLogCreate';
import { auditLogOperations } from '../auditLog/auditLogOperations';
import { productAnalyticsTrackSystemEvent } from '../productAnalytics/productAnalyticsService';

export const COURSE_BUNDLE_PURCHASE_METADATA_KIND = 'courseBundlePurchase';

function readBundlePurchaseMetadata(metadata: Stripe.Metadata | null) {
  if (!metadata || metadata.kind !== COURSE_BUNDLE_PURCHASE_METADATA_KIND) {
    return null;
  }
  if (!metadata.bundleId || !metadata.userId) {
    return null;
  }

  return {
    bundleId: metadata.bundleId,
    userId: metadata.userId,
    memberId: metadata.memberId || null,
    organizationId: metadata.organizationId || null,
    pricingPackageId: metadata.pricingPackageId || null,
    pricingExperimentId: metadata.pricingExperimentId || null,
    pricingVariantId: metadata.pricingVariantId || null,
  };
}

export async function courseBundlePaymentWebhookHandler(
  _stripe: Stripe,
  stripeCheckoutSession: Stripe.Checkout.Session,
  context: AppContext,
) {
  const startedAt = Date.now();
  const meta = readBundlePurchaseMetadata(stripeCheckoutSession.metadata);
  if (!meta) {
    logger.debug('stripe.webhook.skipped', {
      handler: 'course_bundle_purchase',
      checkoutSessionId: stripeCheckoutSession.id,
      reason: 'metadata_kind_mismatch',
    });
    return;
  }

  const existing =
    await prismaDangerouslyBypassRLS.courseBundlePurchase.findUnique({
      where: { stripeCheckoutSessionId: stripeCheckoutSession.id },
      select: { id: true },
    });

  if (existing) {
    logger.info('stripe.webhook.idempotent_duplicate', {
      handler: 'course_bundle_purchase',
      checkoutSessionId: stripeCheckoutSession.id,
      courseBundlePurchaseId: existing.id,
    });
    return;
  }

  const bundle = await prismaDangerouslyBypassRLS.courseBundle.findUnique({
    where: { id: meta.bundleId },
    include: {
      courses: {
        include: {
          course: {
            select: {
              id: true,
              status: true,
              safetyHold: true,
            },
          },
        },
      },
    },
  });

  if (!bundle) {
    logger.warn('stripe.webhook.skipped', {
      handler: 'course_bundle_purchase',
      checkoutSessionId: stripeCheckoutSession.id,
      bundleId: meta.bundleId,
      reason: 'bundle_missing',
    });
    return;
  }

  const courseIds = bundle.courses
    .map((item) => item.course)
    .filter((course) => course.status === 'published' && !course.safetyHold)
    .map((course) => course.id);

  const paymentIntentId =
    typeof stripeCheckoutSession.payment_intent === 'string'
      ? stripeCheckoutSession.payment_intent
      : (stripeCheckoutSession.payment_intent?.id ?? null);
  const amountTotal =
    stripeCheckoutSession.amount_total ?? bundle.priceCents ?? 0;
  const sessionCurrency = (
    stripeCheckoutSession.currency ||
    bundle.currency ||
    'USD'
  ).toUpperCase();

  const purchase = await prismaDangerouslyBypassRLS.$transaction(async (tx) => {
    const purchase = await tx.courseBundlePurchase.create({
      data: {
        bundleId: bundle.id,
        userId: meta.userId,
        memberId: meta.memberId,
        organizationId: meta.organizationId,
        stripeCheckoutSessionId: stripeCheckoutSession.id,
        stripePaymentIntentId: paymentIntentId,
        priceCents: amountTotal,
        currency: sessionCurrency,
        pricingPackageId: meta.pricingPackageId,
        pricingExperimentId: meta.pricingExperimentId,
        pricingVariantId: meta.pricingVariantId,
      },
    });

    await Promise.all(
      courseIds.map((courseId) =>
        tx.courseEnrollment.upsert({
          where: { courseId_userId: { courseId, userId: meta.userId } },
          update: {
            status: 'active',
            enrolledAt: new Date(),
            completedAt: null,
            accessSource: 'bundlePurchase',
            pricingPackageId: meta.pricingPackageId,
          },
          create: {
            courseId,
            userId: meta.userId,
            memberId: meta.memberId,
            status: 'active',
            enrolledAt: new Date(),
            accessSource: 'bundlePurchase',
            pricingPackageId: meta.pricingPackageId,
          },
        }),
      ),
    );

    return purchase;
  });

  await auditLogCreate({
    entityId: purchase.id,
    entityName: 'CourseBundlePurchase',
    operation: auditLogOperations.create,
    organizationId: meta.organizationId,
    userId: meta.userId,
    memberId: meta.memberId,
    context,
    newData: purchase,
  });

  await productAnalyticsTrackSystemEvent({
    eventName: 'paid',
    source: 'stripeWebhook',
    dedupeKey: `paid:course_bundle:${stripeCheckoutSession.id}`,
    userId: meta.userId,
    memberId: meta.memberId,
    organizationId: meta.organizationId,
    stripeCheckoutSessionId: stripeCheckoutSession.id,
    funnelId: `bundle:${bundle.id}`,
    metadata: {
      purchaseType: 'course_bundle',
      packageType: 'course_bundle',
      pricingPackageId: meta.pricingPackageId,
      pricingExperimentId: meta.pricingExperimentId,
      pricingVariantId: meta.pricingVariantId,
      priceCents: amountTotal,
      currency: sessionCurrency,
      courseCount: courseIds.length,
    },
  });

  logger.info('stripe.webhook.course_bundle_purchase_completed', {
    checkoutSessionId: stripeCheckoutSession.id,
    bundleId: bundle.id,
    userId: meta.userId,
    courseCount: courseIds.length,
    durationMs: durationMs(startedAt),
  });
}
