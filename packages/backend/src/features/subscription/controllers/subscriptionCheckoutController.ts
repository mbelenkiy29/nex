import { SubscriptionMode } from '../../../prisma/generated/client';
import Stripe from 'stripe';
import { STRIPE_API_VERSION } from '../stripeApiVersion';
import { z } from 'zod';
import { AppContext } from '../../../shared/controller/appContext';
import { Error400 } from '../../../shared/errors/Error400';
import { getFrontendUrl } from '../../../shared/lib/getFrontendUrl';
import { RouteConfig } from '../../../shared/openapi/routeToPath';
import { dictionaryFormat } from '../../../translation/dictionaryFormat';
import { authGuardBackend } from '../../auth/authGuardBackend';
import {
  StripeCustomerMetadata,
  subscriptionCheckoutInputSchema,
  subscriptionCheckoutOutputSchema,
} from '../subscriptionSchemas';
import { subscriptionIsValidStripePriceId } from '../subscriptionIsValidStripePriceId';
import { subscriptionSelectAndValidateDefaultMode } from '../subscriptionSelectAndValidateDefaultMode';
import { McpTool } from '../../mcp/mcpTypes';
import { toMcpJsonSchema } from '../../mcp/mcpSchemaConverter';
import { Dictionary } from '../../../translation/locales';
import { env } from '../../../env';
import { productAnalyticsTrackSystemEvent } from '../../productAnalytics/productAnalyticsService';
import {
  checkoutTrustAnalyticsMetadata,
  checkoutTrustSessionOptions,
} from '../../checkout/checkoutTrust';
import { pricingMetadataFromCheckout } from '../../pricing/pricingService';

export const subscriptionCheckoutApiDoc: RouteConfig = {
  method: 'post',
  path: '/api/subscription/checkout',
  body: subscriptionCheckoutInputSchema,
  response: subscriptionCheckoutOutputSchema,
};

export const subscriptionCheckoutMcpTool = (
  dictionary: Dictionary,
): McpTool => ({
  name: 'subscription_checkout',
  description: dictionary.subscription.mcpDescription.checkout,
  requiredPermissions: { subscription: ['create'] },
  schema: toMcpJsonSchema(subscriptionCheckoutInputSchema),
  handler: async (params, context) => {
    return await subscriptionCheckoutController(params, context);
  },
});

export async function subscriptionCheckoutController(
  query: unknown,
  context: AppContext,
): Promise<z.output<typeof subscriptionCheckoutOutputSchema>> {
  const input = subscriptionCheckoutInputSchema.parse(query);
  const { stripePriceId } = input;

  if (!(await subscriptionIsValidStripePriceId(stripePriceId))) {
    throw new Error400(
      dictionaryFormat(
        context.dictionary.shared.errors.invalid,
        'stripePriceId',
      ),
    );
  }

  await authGuardBackend(
    {
      subscription: ['create'],
    },
    context,
  );

  if (context.currentSubscription) {
    throw new Error400(
      context.dictionary.subscription.errors.alreadyExistsActive,
    );
  }

  if (!env.STRIPE_SECRET_KEY) {
    throw new Error400(
      context.dictionary.subscription.errors.stripeNotConfigured,
    );
  }

  const stripe = new Stripe(env.STRIPE_SECRET_KEY, {
    apiVersion: STRIPE_API_VERSION,
  });

  const customer = await _findOrCreateStripeCustomer(stripe, context);

  const frontendUrl = getFrontendUrl(context.currentOrganization?.slug);

  const session = await stripe.checkout.sessions.create({
    ...checkoutTrustSessionOptions(context, 'subscription'),
    line_items: [
      {
        price: stripePriceId,
        quantity: 1,
      },
    ],
    mode: 'subscription',
    success_url: `${frontendUrl}/subscription/activation?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${frontendUrl}/subscription?checkout=cancelled`,
    customer: customer.id,
    customer_update: {
      address: 'auto',
      name: 'auto',
    },
    allow_promotion_codes: true,
    payment_method_collection: 'always',
    metadata: pricingMetadataFromCheckout({
      pricingPackageId: input.pricingPackageId,
      pricingExperimentId: input.pricingExperimentId,
      pricingVariantId: input.pricingVariantId,
      packageType: input.packageType ?? 'monthly_subscription',
    }),
    subscription_data: {
      metadata: pricingMetadataFromCheckout({
        pricingPackageId: input.pricingPackageId,
        pricingExperimentId: input.pricingExperimentId,
        pricingVariantId: input.pricingVariantId,
        packageType: input.packageType ?? 'monthly_subscription',
      }),
    },
  });

  if (!session.url) {
    throw new Error400(
      context.dictionary.subscription.errors.stripeNotConfigured,
    );
  }

  await productAnalyticsTrackSystemEvent({
    eventName: 'checkout_started',
    source: 'backend',
    dedupeKey: `checkout_started:subscription:${session.id}`,
    userId: context.currentUser?.id ?? null,
    memberId: context.currentMember?.id ?? null,
    organizationId: context.currentOrganization?.id ?? null,
    stripeCheckoutSessionId: session.id,
    stripePriceId,
    ctaLocation: 'subscription_plan_card',
    funnelId: `subscription:${stripePriceId}`,
    metadata: {
      purchaseType: 'subscription',
      packageType: input.packageType,
      pricingPackageId: input.pricingPackageId,
      pricingExperimentId: input.pricingExperimentId,
      pricingVariantId: input.pricingVariantId,
      ...checkoutTrustAnalyticsMetadata('subscription'),
    },
  });

  return { url: session.url };
}

async function _findOrCreateStripeCustomer(
  stripe: Stripe,
  context: AppContext,
) {
  const subscriptionMode = subscriptionSelectAndValidateDefaultMode(context);

  const customers = await stripe.customers.list({
    email: context?.currentUser?.email,
    limit: 100,
  });

  let customer = customers?.data?.find((customer) => {
    const metadata: StripeCustomerMetadata = customer.metadata;

    if (subscriptionMode === SubscriptionMode.organization) {
      return (
        metadata.organizationId === context.currentOrganization?.id &&
        !metadata.memberId
      );
    }

    if (subscriptionMode === SubscriptionMode.member) {
      return (
        metadata.organizationId === context.currentOrganization?.id &&
        metadata.memberId === context.currentMember?.id
      );
    }

    return !metadata.organizationId && !metadata.memberId;
  });

  if (!customer) {
    const metadata: StripeCustomerMetadata = {
      userId: context.currentUser?.id || null,
    };

    if (subscriptionMode === SubscriptionMode.organization) {
      metadata.organizationId = context.currentOrganization?.id || null;
    }

    if (subscriptionMode === SubscriptionMode.member) {
      metadata.organizationId = context.currentOrganization?.id || null;
      metadata.memberId = context.currentMember?.id || null;
    }

    // Idempotency key prevents two concurrent checkout requests for the same
    // user/mode/org/member from racing and creating duplicate Stripe customers.
    const customerIdempotencyKey = [
      'stripe-customer',
      subscriptionMode,
      metadata.userId ?? '',
      metadata.organizationId ?? '',
      metadata.memberId ?? '',
    ].join(':');

    customer = await stripe.customers.create(
      {
        email: context?.currentUser?.email,
        metadata: {
          ...metadata,
        },
      },
      { idempotencyKey: customerIdempotencyKey },
    );
  }

  return customer;
}
