import Stripe from 'stripe';
import { env } from '../../env';
// bypass-RLS: bundle checkout is a marketplace flow. Explicit published/safety
// filters protect what can be bought before enrollment exists.
// eslint-disable-next-line no-restricted-syntax
import { prismaDangerouslyBypassRLS } from '../../prisma';
import { AppContext } from '../../shared/controller/appContext';
import { Error400 } from '../../shared/errors/Error400';
import { Error401 } from '../../shared/errors/Error401';
import { Error404 } from '../../shared/errors/Error404';
import { getFrontendUrl } from '../../shared/lib/getFrontendUrl';
import {
  checkoutTrustAnalyticsMetadata,
  checkoutTrustSessionOptions,
} from '../checkout/checkoutTrust';
import { productAnalyticsTrackSystemEvent } from '../productAnalytics/productAnalyticsService';
import { pricingMetadataFromCheckout } from '../pricing/pricingService';
import { STRIPE_API_VERSION } from '../subscription/stripeApiVersion';
import { trustSafetyRequirePolicyAcceptance } from '../trustSafety/trustSafetyService';
import { courseBundleCheckoutInputSchema } from './courseSchemas';
import { COURSE_BUNDLE_PURCHASE_METADATA_KIND } from './courseBundlePaymentWebhook';

export async function courseBundleCheckoutController(
  params: { id: string },
  body: unknown,
  context: AppContext,
) {
  const currentUser = context.currentUser;
  if (!currentUser) {
    throw new Error401();
  }

  const input = courseBundleCheckoutInputSchema.parse(body);
  const bundle = await prismaDangerouslyBypassRLS.courseBundle.findFirst({
    where: { id: params.id, status: 'published' },
    include: {
      courses: {
        orderBy: { orderIndex: 'asc' },
        include: {
          course: {
            select: {
              id: true,
              title: true,
              status: true,
              safetyHold: true,
            },
          },
        },
      },
    },
  });

  if (!bundle) {
    throw new Error404();
  }

  if (!bundle.priceCents || bundle.priceCents <= 0) {
    throw new Error400(
      context.dictionary.course.errors.coursePaymentNotConfigured,
    );
  }

  const purchasableCourses = bundle.courses
    .map((item) => item.course)
    .filter((course) => course.status === 'published' && !course.safetyHold);

  if (purchasableCourses.length === 0) {
    throw new Error400(
      context.dictionary.course.errors.coursePaymentNotConfigured,
    );
  }

  await trustSafetyRequirePolicyAcceptance('studentTerms', context);

  if (!env.STRIPE_SECRET_KEY) {
    throw new Error400(
      context.dictionary.subscription.errors.stripeNotConfigured,
    );
  }

  const stripe = new Stripe(env.STRIPE_SECRET_KEY, {
    apiVersion: STRIPE_API_VERSION,
  });
  const frontendUrl = getFrontendUrl(context.currentOrganization?.slug);
  const metadata = {
    kind: COURSE_BUNDLE_PURCHASE_METADATA_KIND,
    bundleId: bundle.id,
    userId: currentUser.id,
    memberId: context.currentMember?.id ?? '',
    organizationId: context.currentOrganization?.id ?? '',
    ...pricingMetadataFromCheckout({
      pricingPackageId: input.pricingPackageId,
      pricingExperimentId: input.pricingExperimentId,
      pricingVariantId: input.pricingVariantId,
      packageType: input.packageType ?? 'course_bundle',
    }),
  };

  const checkout = await stripe.checkout.sessions.create({
    ...checkoutTrustSessionOptions(context, 'courseBundle'),
    mode: 'payment',
    submit_type: 'pay',
    line_items: [
      bundle.stripePriceId
        ? { price: bundle.stripePriceId, quantity: 1 }
        : {
            price_data: {
              currency: bundle.currency.toLowerCase(),
              unit_amount: bundle.priceCents,
              product_data: {
                name: bundle.title,
                description: bundle.description ?? undefined,
                metadata: { bundleId: bundle.id },
              },
            },
            quantity: 1,
          },
    ],
    success_url: `${frontendUrl}/course?bundle_purchase=success`,
    cancel_url: `${frontendUrl}/course?bundle_purchase=cancelled`,
    customer_email: currentUser.email,
    client_reference_id: currentUser.id,
    metadata,
    payment_intent_data: { metadata },
  });

  if (!checkout.url) {
    throw new Error400(
      context.dictionary.subscription.errors.stripeNotConfigured,
    );
  }

  await productAnalyticsTrackSystemEvent({
    eventName: 'checkout_started',
    source: 'backend',
    dedupeKey: `checkout_started:course_bundle:${checkout.id}`,
    userId: currentUser.id,
    memberId: context.currentMember?.id ?? null,
    organizationId: context.currentOrganization?.id ?? null,
    stripeCheckoutSessionId: checkout.id,
    stripePriceId: bundle.stripePriceId ?? null,
    ctaLocation: 'course_bundle_card',
    funnelId: `bundle:${bundle.id}`,
    metadata: {
      purchaseType: 'course_bundle',
      packageType: 'course_bundle',
      pricingPackageId: input.pricingPackageId,
      pricingExperimentId: input.pricingExperimentId,
      pricingVariantId: input.pricingVariantId,
      priceCents: bundle.priceCents,
      currency: bundle.currency,
      courseCount: purchasableCourses.length,
      ...checkoutTrustAnalyticsMetadata('courseBundle'),
    },
  });

  return { url: checkout.url };
}
