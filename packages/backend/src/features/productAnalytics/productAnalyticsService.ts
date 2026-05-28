import { Prisma } from '../../prisma/generated/client';
// bypass-RLS: product analytics events can be emitted before an organization
// context exists and are aggregated platform-wide by platform admins.
// eslint-disable-next-line no-restricted-syntax
import { prismaDangerouslyBypassRLS } from '../../prisma';
import { AppContext } from '../../shared/controller/appContext';
import { errorToLogMetadata, logger } from '../../shared/lib/logger';
import {
  ProductAnalyticsEventInput,
  ProductAnalyticsEventSource,
  productAnalyticsEventInputSchema,
  productAnalyticsEventSourceSchema,
} from './productAnalyticsSchemas';

type ProductAnalyticsTrackInput = ProductAnalyticsEventInput & {
  source?: ProductAnalyticsEventSource;
  userId?: string | null;
  memberId?: string | null;
  organizationId?: string | null;
};

function sanitizeMetadata(metadata: Record<string, unknown>) {
  let normalized: Record<string, unknown>;
  let serialized: string;

  try {
    serialized = JSON.stringify(metadata || {});
    normalized = JSON.parse(serialized) as Record<string, unknown>;
  } catch {
    return {
      truncated: true,
    };
  }

  if (serialized.length <= 5000) {
    return normalized;
  }

  return {
    truncated: true,
  };
}

async function productAnalyticsCreateEvent(
  input: ProductAnalyticsTrackInput,
  context?: AppContext,
) {
  const parsed = productAnalyticsEventInputSchema.parse(input);
  const source = productAnalyticsEventSourceSchema.parse(
    input.source || 'backend',
  );

  await prismaDangerouslyBypassRLS.productAnalyticsEvent.create({
    data: {
      eventName: parsed.eventName,
      source,
      dedupeKey: parsed.dedupeKey,
      userId: input.userId ?? context?.currentUser?.id ?? null,
      memberId: input.memberId ?? context?.currentMember?.id ?? null,
      organizationId:
        input.organizationId ?? context?.currentOrganization?.id ?? null,
      courseId: parsed.courseId,
      lessonId: parsed.lessonId,
      subscriptionId: parsed.subscriptionId,
      coursePurchaseId: parsed.coursePurchaseId,
      stripeCheckoutSessionId: parsed.stripeCheckoutSessionId,
      stripePriceId: parsed.stripePriceId,
      accessType: parsed.accessType || null,
      ctaLocation: parsed.ctaLocation,
      funnelId: parsed.funnelId,
      sessionId: parsed.sessionId,
      anonymousId: parsed.anonymousId,
      currentPath: parsed.currentPath,
      referrerPath: parsed.referrerPath,
      metadata: sanitizeMetadata(parsed.metadata),
    },
  });
}

export async function productAnalyticsTrackEvent(
  input: ProductAnalyticsEventInput,
  context: AppContext,
) {
  try {
    await productAnalyticsCreateEvent(
      {
        ...input,
        source: 'frontend',
      },
      context,
    );
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === 'P2002'
    ) {
      return;
    }

    throw error;
  }
}

export async function productAnalyticsTrackSystemEvent(
  input: ProductAnalyticsTrackInput,
) {
  try {
    await productAnalyticsCreateEvent(input);
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === 'P2002'
    ) {
      return;
    }

    logger.warn('product_analytics.event_skipped', {
      eventName: input.eventName,
      dedupeKey: input.dedupeKey,
      error: errorToLogMetadata(error),
    });
  }
}
