import Stripe from 'stripe';
import { env } from '../../env';
import { prisma } from '../../prisma';
import { AppContext } from '../../shared/controller/appContext';
import { Error400 } from '../../shared/errors/Error400';
import { Error401 } from '../../shared/errors/Error401';
import { Error404 } from '../../shared/errors/Error404';
import { getFrontendUrl } from '../../shared/lib/getFrontendUrl';
import { STRIPE_API_VERSION } from '../subscription/stripeApiVersion';
import { productAnalyticsTrackSystemEvent } from '../productAnalytics/productAnalyticsService';
import { trustSafetyRequirePolicyAcceptance } from '../trustSafety/trustSafetyService';
import {
  checkoutTrustAnalyticsMetadata,
  checkoutTrustSessionOptions,
} from '../checkout/checkoutTrust';
import type { PricingPackageType } from '../pricing/pricingSchemas';
import { pricingMetadataFromCheckout } from '../pricing/pricingService';
import { coursePaymentEnsureStripePrice } from './coursePaymentService';
import { COURSE_PURCHASE_METADATA_KIND } from './coursePaymentWebhook';
import { courseCheckoutInputSchema } from './courseSchemas';

async function courseCheckoutCouponDiscount({
  couponCode,
  course,
  basePriceCents,
  userId,
  context,
}: {
  couponCode?: string | null;
  course: {
    id: string;
    priceCents: number | null;
    currency: string;
    creatorUserId: string | null;
  };
  basePriceCents: number;
  userId: string;
  context: AppContext;
}) {
  const code = couponCode?.trim().toUpperCase();

  if (!code) {
    return null;
  }

  const coupon = await prisma.courseCoupon.findUnique({ where: { code } });
  const now = new Date();

  if (
    !coupon ||
    coupon.status !== 'active' ||
    (coupon.startsAt && coupon.startsAt > now) ||
    (coupon.endsAt && coupon.endsAt < now) ||
    (coupon.courseId && coupon.courseId !== course.id) ||
    coupon.bundleId != null ||
    (!coupon.courseId &&
      coupon.creatorUserId &&
      coupon.creatorUserId !== course.creatorUserId) ||
    (coupon.maxRedemptions != null &&
      coupon.redeemedCount >= coupon.maxRedemptions)
  ) {
    throw new Error400(context.dictionary.course.errors.invalidCoupon);
  }

  const userRedemptions = await prisma.courseCouponRedemption.count({
    where: { couponId: coupon.id, userId },
  });

  if (userRedemptions >= coupon.maxRedemptionsPerUser) {
    throw new Error400(context.dictionary.course.errors.couponLimitReached);
  }

  const discountCents =
    coupon.discountType === 'percent'
      ? Math.round((basePriceCents * (coupon.percentOff || 0)) / 100)
      : Math.min(basePriceCents, coupon.amountOffCents || 0);

  if (discountCents <= 0 || discountCents >= basePriceCents) {
    throw new Error400(context.dictionary.course.errors.invalidCoupon);
  }

  return { coupon, discountCents };
}

/**
 * POST /api/course/:id/checkout — opens a Stripe Checkout session for the
 * current user to purchase a `accessType:'paid'` course. The frontend
 * navigates to the returned URL; payment success rolls back into the app
 * via `?purchase=success` on the course detail page.
 *
 * The webhook (`coursePaymentWebhookHandler`) is the system of record for
 * "enrollment exists" — this controller deliberately does NOT pre-create
 * the CourseEnrollment row.
 */
export async function courseCheckoutController(
  params: { id: string },
  body: unknown,
  context: AppContext,
) {
  const currentUser = context.currentUser;
  if (!currentUser) {
    throw new Error401();
  }

  const course = await prisma.course.findUnique({
    where: { id: params.id },
    select: {
      id: true,
      title: true,
      slug: true,
      status: true,
      accessType: true,
      safetyHold: true,
      priceCents: true,
      currency: true,
      stripePriceId: true,
      lifetimeAccessEnabled: true,
      lifetimePriceCents: true,
      lifetimeStripePriceId: true,
      creatorUserId: true,
    },
  });
  if (!course || course.status !== 'published' || course.safetyHold) {
    throw new Error404();
  }
  if (course.accessType !== 'paid') {
    throw new Error400(
      context.dictionary.course.errors.coursePaymentNotConfigured,
    );
  }
  if (!course.priceCents || course.priceCents <= 0) {
    throw new Error400(
      context.dictionary.course.errors.coursePaymentNotConfigured,
    );
  }

  // Block re-purchase of an active enrollment. Refunded rows are eligible
  // to re-buy (the webhook upsert flips them back to `active`).
  const existing = await prisma.courseEnrollment.findUnique({
    where: {
      courseId_userId: { courseId: course.id, userId: currentUser.id },
    },
    select: { status: true },
  });
  if (existing && existing.status === 'active') {
    throw new Error400(context.dictionary.course.errors.alreadyEnrolled);
  }

  await trustSafetyRequirePolicyAcceptance('studentTerms', context);
  const input = courseCheckoutInputSchema.parse(body);
  const packageType: PricingPackageType =
    input.packageType === 'selected_lifetime_course_access'
      ? 'selected_lifetime_course_access'
      : 'course_purchase';
  const isLifetimePurchase = packageType === 'selected_lifetime_course_access';
  if (
    isLifetimePurchase &&
    (!course.lifetimeAccessEnabled ||
      !course.lifetimePriceCents ||
      course.lifetimePriceCents <= 0)
  ) {
    throw new Error400(
      context.dictionary.course.errors.coursePaymentNotConfigured,
    );
  }
  const basePriceCents = isLifetimePurchase
    ? course.lifetimePriceCents!
    : course.priceCents || 0;
  const couponDiscount = await courseCheckoutCouponDiscount({
    couponCode: input.couponCode,
    course,
    basePriceCents,
    userId: currentUser.id,
    context,
  });
  const checkoutPriceCents =
    basePriceCents - (couponDiscount?.discountCents || 0);

  // Lazy provisioning fallback: if the course was approved before the Stripe
  // hook was wired (or the row was reset), make sure a Price exists now.
  let stripePriceId = course.stripePriceId;
  if (isLifetimePurchase) {
    stripePriceId = course.lifetimeStripePriceId;
  }
  if (!isLifetimePurchase && !stripePriceId && !couponDiscount) {
    const ensured = await coursePaymentEnsureStripePrice(course.id, context);
    stripePriceId = ensured.stripePriceId;
  }

  const stripe = new Stripe(env.STRIPE_SECRET_KEY!, {
    apiVersion: STRIPE_API_VERSION,
  });
  const frontendUrl = getFrontendUrl(context.currentOrganization?.slug);

  const metadata = {
    kind: COURSE_PURCHASE_METADATA_KIND,
    courseId: course.id,
    userId: currentUser.id,
    memberId: context.currentMember?.id ?? '',
    organizationId: context.currentOrganization?.id ?? '',
    couponId: couponDiscount?.coupon.id ?? '',
    discountCents: String(couponDiscount?.discountCents ?? 0),
    accessDuration: isLifetimePurchase ? 'lifetime' : 'standard',
    ...pricingMetadataFromCheckout({
      pricingPackageId: input.pricingPackageId,
      pricingExperimentId: input.pricingExperimentId,
      pricingVariantId: input.pricingVariantId,
      packageType,
    }),
  };

  const checkout = await stripe.checkout.sessions.create(
    {
      ...checkoutTrustSessionOptions(context, 'course'),
      mode: 'payment',
      submit_type: 'pay',
      line_items: [
        couponDiscount
          ? {
              price_data: {
                currency: course.currency.toLowerCase(),
                unit_amount: checkoutPriceCents,
                product_data: {
                  name: course.title,
                  metadata: { courseId: course.id },
                },
              },
              quantity: 1,
            }
          : stripePriceId
            ? { price: stripePriceId, quantity: 1 }
            : {
                price_data: {
                  currency: course.currency.toLowerCase(),
                  unit_amount: checkoutPriceCents,
                  product_data: {
                    name: course.title,
                    metadata: { courseId: course.id },
                  },
                },
                quantity: 1,
              },
      ],
      success_url: `${frontendUrl}/course/${course.id}/activation?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${frontendUrl}/course/${course.slug}?purchase=cancelled`,
      customer_email: currentUser.email,
      client_reference_id: currentUser.id,
      metadata,
      // Mirror metadata onto the PaymentIntent too, so any future refund
      // webhook can discriminate without needing the Checkout Session.
      payment_intent_data: { metadata },
    },
    {
      idempotencyKey: [
        'course-checkout',
        course.id,
        currentUser.id,
        packageType,
        input.couponCode || '',
      ].join(':'),
    },
  );

  await productAnalyticsTrackSystemEvent({
    eventName: 'checkout_started',
    source: 'backend',
    dedupeKey: `checkout_started:course:${checkout.id}`,
    userId: currentUser.id,
    memberId: context.currentMember?.id ?? null,
    organizationId: context.currentOrganization?.id ?? null,
    courseId: course.id,
    stripeCheckoutSessionId: checkout.id,
    stripePriceId: stripePriceId ?? null,
    accessType: course.accessType,
    ctaLocation: 'course_detail_buy',
    funnelId: `course:${course.id}`,
    metadata: {
      purchaseType: 'course',
      packageType,
      pricingPackageId: input.pricingPackageId,
      pricingExperimentId: input.pricingExperimentId,
      pricingVariantId: input.pricingVariantId,
      courseSlug: course.slug,
      priceCents: checkoutPriceCents,
      currency: course.currency,
      couponApplied: Boolean(couponDiscount),
      accessDuration: isLifetimePurchase ? 'lifetime' : 'standard',
      ...checkoutTrustAnalyticsMetadata('course'),
    },
  });

  return { url: checkout.url };
}
