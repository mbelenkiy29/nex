import { RouteConfig } from '../../../shared/openapi/routeToPath';
import { SubscriptionMode } from '../../../prisma/generated/client';
import {
  StripeCustomerMetadata,
  subscriptionWebhookOutputSchema,
} from '../subscriptionSchemas';
// bypass-RLS: Stripe server-to-server webhook — no session or org
// context. Idempotency is checked via stripeSubscriptionId lookups.
// eslint-disable-next-line no-restricted-syntax
import { prismaDangerouslyBypassRLS } from '../../../prisma';
import { AppContext } from '../../../shared/controller/appContext';
import { Error400 } from '../../../shared/errors/Error400';
import { auditLogOperations } from '../../auditLog/auditLogOperations';
import { auditLogCreate } from '../../auditLog/auditLogCreate';
import {
  invalidateSubscription,
  buildSubscriptionCacheKey,
} from '../../auth/authCache';
import { invalidateStripePlansCache } from '../subscriptionFetchPlans';
import { sendNotification } from '../../notification/notificationService';
import {
  oneOnOneCheckoutExpiredHandler,
  oneOnOnePaymentFailedHandler,
  oneOnOnePaymentWebhookHandler,
} from '../../oneOnOneCall/oneOnOnePaymentWebhook';
import { coursePaymentWebhookHandler } from '../../course/coursePaymentWebhook';

import Stripe from 'stripe';
import { STRIPE_API_VERSION } from '../stripeApiVersion';
import { env } from '../../../env';
import {
  durationMs,
  errorToLogMetadata,
  logger,
} from '../../../shared/lib/logger';

export const subscriptionWebhookApiDoc: RouteConfig = {
  method: 'post',
  path: '/api/subscription/webhook',
  response: subscriptionWebhookOutputSchema,
};

export async function subscriptionWebhookController(
  rawBody: any,
  stripeSignature: string,
  context: AppContext,
) {
  const startedAt = Date.now();
  if (!env.STRIPE_SECRET_KEY) {
    logger.error('stripe.webhook.not_configured');
    throw new Error400(
      context.dictionary.subscription.errors.stripeNotConfigured,
    );
  }

  const stripe = new Stripe(env.STRIPE_SECRET_KEY, {
    apiVersion: STRIPE_API_VERSION,
  });

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      rawBody,
      stripeSignature,
      env.STRIPE_WEBHOOK_SECRET || '',
    );
  } catch (error) {
    logger.warn('stripe.webhook.rejected', {
      reason: 'signature_verification_failed',
      durationMs: durationMs(startedAt),
      error: errorToLogMetadata(error),
    });
    throw error;
  }

  logger.info('stripe.webhook.received', {
    stripeEventId: event.id,
    eventType: event.type,
  });

  try {
    if (event.type === 'checkout.session.completed') {
      await _processStripeCheckoutSessionCompleted(stripe, event, context);
    }

    // 1:1 paid bookings — these don't touch the subscription path.
    if (event.type === 'checkout.session.expired') {
      await oneOnOneCheckoutExpiredHandler(
        event.data.object as Stripe.Checkout.Session,
        context,
      );
    }

    if (event.type === 'payment_intent.payment_failed') {
      await oneOnOnePaymentFailedHandler(
        event.data.object as Stripe.PaymentIntent,
        context,
      );
    }

    if (
      event.type === 'customer.subscription.updated' ||
      event.type === 'customer.subscription.deleted'
    ) {
      await _processStripeCustomerSubscriptionUpdatedOrDeleted(
        stripe,
        event,
        context,
      );
    }

    if (
      event.type === 'product.created' ||
      event.type === 'product.updated' ||
      event.type === 'product.deleted' ||
      event.type === 'price.created' ||
      event.type === 'price.updated' ||
      event.type === 'price.deleted'
    ) {
      await _processStripeProductOrPriceChanged(event);
    }

    logger.info('stripe.webhook.completed', {
      stripeEventId: event.id,
      eventType: event.type,
      durationMs: durationMs(startedAt),
    });
  } catch (error) {
    logger.error('stripe.webhook.failed', {
      stripeEventId: event.id,
      eventType: event.type,
      durationMs: durationMs(startedAt),
      error: errorToLogMetadata(error),
    });
    throw error;
  }
}

function _selectModeFromCustomerMetadata(
  customerMetadata: StripeCustomerMetadata,
) {
  if (customerMetadata.memberId) {
    return SubscriptionMode.member;
  }

  if (customerMetadata.organizationId) {
    return SubscriptionMode.organization;
  }

  return SubscriptionMode.disabled;
}

async function _processStripeCheckoutSessionCompleted(
  stripe: Stripe,
  event: Stripe.Event,
  context: AppContext,
) {
  const data = event.data.object as { id: string };

  const stripeCheckoutSession = await stripe.checkout.sessions.retrieve(
    data.id,
    {
      expand: ['line_items', 'customer', 'subscription', 'payment_intent'],
    },
  );

  // Both 1:1 paid bookings and course one-time purchases go through
  // `mode: 'payment'`. Each handler is gated on its own `metadata.kind`,
  // so the order of the chain is safe — a non-matching event is a no-op
  // in each handler. If a future feature adds a third `mode:'payment'`
  // discriminator (e.g. lifetime upgrades), insert it into this chain
  // rather than forking the branch.
  if (stripeCheckoutSession.mode === 'payment') {
    await coursePaymentWebhookHandler(stripe, stripeCheckoutSession, context);
    await oneOnOnePaymentWebhookHandler(stripe, stripeCheckoutSession, context);
    return;
  }

  if (stripeCheckoutSession.mode !== 'subscription') {
    logger.info('stripe.webhook.skipped', {
      stripeEventId: event.id,
      eventType: event.type,
      checkoutSessionId: stripeCheckoutSession.id,
      mode: stripeCheckoutSession.mode,
      reason: 'not_subscription_checkout',
    });
    return;
  }

  const stripePriceId = stripeCheckoutSession.line_items?.data[0]?.price
    ?.id as string;

  const stripeSubscription =
    stripeCheckoutSession.subscription as Stripe.Subscription;
  const stripeCustomer = stripeCheckoutSession.customer as Stripe.Customer;
  const stripeCustomerMetadata =
    stripeCustomer.metadata as StripeCustomerMetadata;

  const mode = _selectModeFromCustomerMetadata(stripeCustomerMetadata);

  if (mode === 'disabled') {
    logger.warn('stripe.webhook.skipped', {
      stripeEventId: event.id,
      eventType: event.type,
      checkoutSessionId: stripeCheckoutSession.id,
      reason: 'invalid_customer_metadata',
      metadataKeys: Object.keys(stripeCustomerMetadata ?? {}),
    });
    return;
  }

  // Idempotency: Stripe retries webhook delivery, so the same
  // checkout.session.completed event can arrive more than once. If the
  // subscription already exists, treat this as a successful no-op rather than
  // letting the `stripeSubscriptionId` unique constraint throw a 500 — which
  // would make Stripe keep retrying and re-send admin notifications.
  const existingSubscription =
    await prismaDangerouslyBypassRLS.subscription.findUnique({
      where: { stripeSubscriptionId: stripeSubscription.id },
    });

  if (existingSubscription) {
    logger.info('stripe.webhook.idempotent_duplicate', {
      stripeEventId: event.id,
      eventType: event.type,
      stripeSubscriptionId: stripeSubscription.id,
      subscriptionId: existingSubscription.id,
    });
    return;
  }

  // Webhook operates without user context - bypass RLS for system operation
  const subscription = await prismaDangerouslyBypassRLS.$transaction(
    async (tx) => {
      const subscription = await tx.subscription.create({
        data: {
          mode,
          status: stripeSubscription.status,
          stripeSubscriptionId: stripeSubscription.id,
          stripeCustomerId: stripeCustomer.id,
          stripePriceId,
          userId: stripeCustomerMetadata.userId as string,
          organizationId: stripeCustomerMetadata.organizationId || undefined,
          memberId: stripeCustomerMetadata.memberId || undefined,
          cancelAt: stripeSubscription.cancel_at
            ? new Date(stripeSubscription.cancel_at * 1000)
            : null,
        },
      });

      // Create audit log
      await auditLogCreate({
        entityId: subscription.id,
        entityName: 'Subscription',
        operation: auditLogOperations.create,
        context,
        newData: subscription,
        tx,
      });

      return subscription;
    },
  );

  // Send notification to admin members about new subscription
  if (subscription.organizationId) {
    // Get user details
    const user = await prismaDangerouslyBypassRLS.user.findUnique({
      where: { id: subscription.userId },
    });

    if (user) {
      // Get product name from Stripe
      const product =
        stripeCheckoutSession.line_items?.data[0]?.description || 'Plan';

      await sendNotification({
        organizationId: subscription.organizationId,
        roles: ['admin'],
        payload: {
          type: 'subscriptionCreated',
          userName: user.name || user.email,
          userEmail: user.email,
          organizationName: '', // Will be populated by sendNotification
          planName: product,
        },
        senderUserId: subscription.userId,
        locale: context.locale,
      });
    }
  }

  // Invalidate subscription cache
  const subscriptionCacheKey = buildSubscriptionCacheKey(
    mode,
    stripeCustomerMetadata.userId || undefined,
    stripeCustomerMetadata.organizationId || undefined,
    stripeCustomerMetadata.memberId || undefined,
  );

  if (subscriptionCacheKey) {
    await invalidateSubscription(subscriptionCacheKey);
  }
}

async function _processStripeCustomerSubscriptionUpdatedOrDeleted(
  stripe: Stripe,
  event: Stripe.Event,
  context: AppContext,
) {
  const stripeSubscription = event.data.object as Stripe.Subscription;
  const stripePriceId = stripeSubscription?.items?.data?.[0]?.price
    ?.id as string;

  const updatedSubscription = await prismaDangerouslyBypassRLS.$transaction(
    async (tx) => {
      const oldSubscription = await tx.subscription.findUnique({
        where: {
          stripeSubscriptionId: stripeSubscription.id,
        },
      });

      if (!oldSubscription) {
        logger.warn('stripe.webhook.skipped', {
          stripeEventId: event.id,
          eventType: event.type,
          stripeSubscriptionId: stripeSubscription.id,
          reason: 'subscription_missing',
        });
        return null;
      }

      await tx.subscription.update({
        data: {
          status: stripeSubscription.status,
          stripePriceId: stripePriceId,
          cancelAt: stripeSubscription.cancel_at
            ? new Date(stripeSubscription.cancel_at * 1000)
            : null,
        },
        where: {
          stripeSubscriptionId: stripeSubscription.id,
        },
      });

      const updated = await tx.subscription.findUniqueOrThrow({
        where: {
          stripeSubscriptionId: stripeSubscription.id,
        },
      });

      await auditLogCreate({
        entityId: updated.id,
        entityName: 'Subscription',
        operation: auditLogOperations.update,
        context,
        oldData: oldSubscription,
        newData: updated,
        tx,
      });

      return updated;
    },
  );

  if (updatedSubscription) {
    const subscriptionCacheKey = buildSubscriptionCacheKey(
      updatedSubscription.mode,
      updatedSubscription.userId || undefined,
      updatedSubscription.organizationId || undefined,
      updatedSubscription.memberId || undefined,
    );

    if (subscriptionCacheKey) {
      await invalidateSubscription(subscriptionCacheKey);
    }
  }
}

async function _processStripeProductOrPriceChanged(event: Stripe.Event) {
  logger.info('stripe.webhook.plan_cache_invalidation_started', {
    stripeEventId: event.id,
    eventType: event.type,
  });
  await invalidateStripePlansCache();
  logger.info('stripe.webhook.plan_cache_invalidated', {
    stripeEventId: event.id,
    eventType: event.type,
  });
}
