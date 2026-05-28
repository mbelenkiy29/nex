import Stripe from 'stripe';
import type { Prisma } from '../../prisma/generated/client';
// bypass-RLS: AI credits are user-owned marketplace entitlements and can be
// consumed across org contexts. Access is explicitly filtered by userId.
// eslint-disable-next-line no-restricted-syntax
import { prismaDangerouslyBypassRLS } from '../../prisma';
import { AppContext } from '../../shared/controller/appContext';
import { Error400 } from '../../shared/errors/Error400';
import { Error401 } from '../../shared/errors/Error401';
import { Error404 } from '../../shared/errors/Error404';
import { getFrontendUrl } from '../../shared/lib/getFrontendUrl';
import { logger } from '../../shared/lib/logger';
import { env } from '../../env';
import { auditLogCreate } from '../auditLog/auditLogCreate';
import { auditLogOperations } from '../auditLog/auditLogOperations';
import {
  checkoutTrustAnalyticsMetadata,
  checkoutTrustSessionOptions,
} from '../checkout/checkoutTrust';
import { productAnalyticsTrackSystemEvent } from '../productAnalytics/productAnalyticsService';
import { pricingMetadataFromCheckout } from '../pricing/pricingService';
import { STRIPE_API_VERSION } from '../subscription/stripeApiVersion';
import { aiCreditCheckoutInputSchema } from './aiCreditSchemas';

export const AI_CREDIT_PURCHASE_METADATA_KIND = 'aiCreditPurchase';

export async function aiCreditBalance(userId: string) {
  const result = await prismaDangerouslyBypassRLS.aiCreditLedgerEntry.aggregate(
    {
      where: { userId },
      _sum: { tokenAmount: true },
    },
  );

  return Math.max(0, result._sum.tokenAmount || 0);
}

export async function aiCreditDebitPurchasedTokens({
  userId,
  organizationId,
  tokenAmount,
  source,
}: {
  userId: string;
  organizationId: string;
  tokenAmount: number;
  source: string;
}) {
  if (tokenAmount <= 0) {
    return;
  }

  const balance = await aiCreditBalance(userId);
  const debit = Math.min(balance, tokenAmount);

  if (debit <= 0) {
    return;
  }

  await prismaDangerouslyBypassRLS.aiCreditLedgerEntry.create({
    data: {
      userId,
      organizationId,
      entryType: 'debit',
      tokenAmount: -debit,
      source,
      metadata: {
        requestedDebitTokens: tokenAmount,
      },
    },
  });
}

export async function aiCreditCheckoutController(
  params: { id: string },
  body: unknown,
  context: AppContext,
) {
  const currentUser = context.currentUser;
  if (!currentUser) {
    throw new Error401();
  }

  const input = aiCreditCheckoutInputSchema.parse(body);
  const pack = await prismaDangerouslyBypassRLS.aiCreditPack.findFirst({
    where: { id: params.id, status: 'active' },
  });

  if (!pack) {
    throw new Error404();
  }

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
    kind: AI_CREDIT_PURCHASE_METADATA_KIND,
    aiCreditPackId: pack.id,
    userId: currentUser.id,
    memberId: context.currentMember?.id ?? '',
    organizationId: context.currentOrganization?.id ?? '',
    ...pricingMetadataFromCheckout({
      pricingPackageId: input.pricingPackageId,
      pricingExperimentId: input.pricingExperimentId,
      pricingVariantId: input.pricingVariantId,
      packageType: input.packageType ?? 'ai_credit_pack',
    }),
  };

  const session = await stripe.checkout.sessions.create({
    ...checkoutTrustSessionOptions(context, 'aiCreditPack'),
    mode: 'payment',
    submit_type: 'pay',
    line_items: [
      pack.stripePriceId
        ? { price: pack.stripePriceId, quantity: 1 }
        : {
            price_data: {
              currency: pack.currency.toLowerCase(),
              unit_amount: pack.priceCents,
              product_data: {
                name: pack.name,
                description: pack.description ?? undefined,
                metadata: { aiCreditPackId: pack.id },
              },
            },
            quantity: 1,
          },
    ],
    success_url: `${frontendUrl}/subscription?ai_credits=success`,
    cancel_url: `${frontendUrl}/subscription?ai_credits=cancelled`,
    customer_email: currentUser.email,
    client_reference_id: currentUser.id,
    metadata,
    payment_intent_data: { metadata },
  });

  if (!session.url) {
    throw new Error400(
      context.dictionary.subscription.errors.stripeNotConfigured,
    );
  }

  await productAnalyticsTrackSystemEvent({
    eventName: 'checkout_started',
    source: 'backend',
    dedupeKey: `checkout_started:ai_credit_pack:${session.id}`,
    userId: currentUser.id,
    memberId: context.currentMember?.id ?? null,
    organizationId: context.currentOrganization?.id ?? null,
    stripeCheckoutSessionId: session.id,
    stripePriceId: pack.stripePriceId ?? null,
    ctaLocation: 'ai_credit_pack',
    funnelId: `ai-credit:${pack.id}`,
    metadata: {
      purchaseType: 'ai_credit_pack',
      packageType: 'ai_credit_pack',
      pricingPackageId: input.pricingPackageId,
      pricingExperimentId: input.pricingExperimentId,
      pricingVariantId: input.pricingVariantId,
      priceCents: pack.priceCents,
      currency: pack.currency,
      tokenAmount: pack.tokenAmount + pack.bonusTokenAmount,
      ...checkoutTrustAnalyticsMetadata('aiCreditPack'),
    },
  });

  return { url: session.url };
}

function readAiCreditMetadata(metadata: Stripe.Metadata | null) {
  if (!metadata || metadata.kind !== AI_CREDIT_PURCHASE_METADATA_KIND) {
    return null;
  }
  if (!metadata.aiCreditPackId || !metadata.userId) {
    return null;
  }

  return {
    aiCreditPackId: metadata.aiCreditPackId,
    userId: metadata.userId,
    memberId: metadata.memberId || null,
    organizationId: metadata.organizationId || null,
    pricingPackageId: metadata.pricingPackageId || null,
    pricingExperimentId: metadata.pricingExperimentId || null,
    pricingVariantId: metadata.pricingVariantId || null,
  };
}

export async function aiCreditPaymentWebhookHandler(
  _stripe: Stripe,
  stripeCheckoutSession: Stripe.Checkout.Session,
  context: AppContext,
) {
  const meta = readAiCreditMetadata(stripeCheckoutSession.metadata);
  if (!meta) {
    logger.debug('stripe.webhook.skipped', {
      handler: 'ai_credit_purchase',
      checkoutSessionId: stripeCheckoutSession.id,
      reason: 'metadata_kind_mismatch',
    });
    return;
  }

  const existing = await prismaDangerouslyBypassRLS.aiCreditPurchase.findUnique(
    {
      where: { stripeCheckoutSessionId: stripeCheckoutSession.id },
      select: { id: true },
    },
  );

  if (existing) {
    logger.info('stripe.webhook.idempotent_duplicate', {
      handler: 'ai_credit_purchase',
      checkoutSessionId: stripeCheckoutSession.id,
      aiCreditPurchaseId: existing.id,
    });
    return;
  }

  const pack = await prismaDangerouslyBypassRLS.aiCreditPack.findUnique({
    where: { id: meta.aiCreditPackId },
  });

  if (!pack) {
    logger.warn('stripe.webhook.skipped', {
      handler: 'ai_credit_purchase',
      checkoutSessionId: stripeCheckoutSession.id,
      aiCreditPackId: meta.aiCreditPackId,
      reason: 'pack_missing',
    });
    return;
  }

  const paymentIntentId =
    typeof stripeCheckoutSession.payment_intent === 'string'
      ? stripeCheckoutSession.payment_intent
      : (stripeCheckoutSession.payment_intent?.id ?? null);
  const amountTotal = stripeCheckoutSession.amount_total ?? pack.priceCents;
  const sessionCurrency = (
    stripeCheckoutSession.currency ||
    pack.currency ||
    'USD'
  ).toUpperCase();
  const tokensPurchased = pack.tokenAmount + pack.bonusTokenAmount;

  const purchase = await prismaDangerouslyBypassRLS.$transaction(async (tx) => {
    const purchase = await tx.aiCreditPurchase.create({
      data: {
        aiCreditPackId: pack.id,
        userId: meta.userId,
        memberId: meta.memberId,
        organizationId: meta.organizationId,
        stripeCheckoutSessionId: stripeCheckoutSession.id,
        stripePaymentIntentId: paymentIntentId,
        tokensPurchased,
        priceCents: amountTotal,
        currency: sessionCurrency,
        pricingPackageId: meta.pricingPackageId,
        pricingExperimentId: meta.pricingExperimentId,
        pricingVariantId: meta.pricingVariantId,
      },
    });

    const ledger = await tx.aiCreditLedgerEntry.create({
      data: {
        userId: meta.userId,
        organizationId: meta.organizationId,
        entryType: 'purchase',
        tokenAmount: tokensPurchased,
        source: 'stripeCheckout',
        aiCreditPackId: pack.id,
        purchaseId: purchase.id,
        metadata: {
          stripeCheckoutSessionId: stripeCheckoutSession.id,
        } satisfies Prisma.InputJsonValue,
      },
    });

    return { ...purchase, ledgerEntryId: ledger.id };
  });

  await auditLogCreate({
    entityId: purchase.id,
    entityName: 'AiCreditPurchase',
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
    dedupeKey: `paid:ai_credit_pack:${stripeCheckoutSession.id}`,
    userId: meta.userId,
    memberId: meta.memberId,
    organizationId: meta.organizationId,
    stripeCheckoutSessionId: stripeCheckoutSession.id,
    funnelId: `ai-credit:${pack.id}`,
    metadata: {
      purchaseType: 'ai_credit_pack',
      packageType: 'ai_credit_pack',
      pricingPackageId: meta.pricingPackageId,
      pricingExperimentId: meta.pricingExperimentId,
      pricingVariantId: meta.pricingVariantId,
      priceCents: amountTotal,
      currency: sessionCurrency,
      tokenAmount: tokensPurchased,
    },
  });

  logger.info('stripe.webhook.ai_credit_purchase_completed', {
    checkoutSessionId: stripeCheckoutSession.id,
    aiCreditPackId: pack.id,
    userId: meta.userId,
    tokenAmount: tokensPurchased,
  });
}
