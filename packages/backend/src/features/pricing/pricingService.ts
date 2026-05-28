import { createHash } from 'node:crypto';
import type { Prisma } from '../../prisma/generated/client';
// bypass-RLS: pricing experiments and package configuration are platform-level
// marketplace controls, not tenant-owned records.
// eslint-disable-next-line no-restricted-syntax
import { prismaDangerouslyBypassRLS } from '../../prisma';
import { AppContext } from '../../shared/controller/appContext';
import { fetchStripePlans } from '../subscription/subscriptionFetchPlans';
import {
  pricingPackagesInputSchema,
  pricingPackageSchema,
} from './pricingSchemas';
import type { PricingPackageType } from './pricingSchemas';

type PricingAssignment = {
  experiment: {
    id: string;
    key: string;
    name: string;
    surface: string;
  } | null;
  variant: {
    id: string;
    key: string;
    name: string;
    isControl: boolean;
    packageConfig?: Prisma.JsonValue;
  } | null;
};

type VariantPackageConfig = {
  includePackageTypes?: PricingPackageType[];
  recommendedPackageTypes?: PricingPackageType[];
};

function hashToBucket(value: string, max: number) {
  const hex = createHash('sha256').update(value).digest('hex').slice(0, 12);
  return Number.parseInt(hex, 16) % max;
}

function readVariantConfig(value: Prisma.JsonValue | undefined) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return {};
  }

  return value as VariantPackageConfig;
}

function packageAllowed(
  packageType: PricingPackageType,
  config: VariantPackageConfig,
) {
  return (
    !Array.isArray(config.includePackageTypes) ||
    config.includePackageTypes.length === 0 ||
    config.includePackageTypes.includes(packageType)
  );
}

function pricingAssignmentMetadata(assignment: PricingAssignment) {
  return {
    pricingExperimentId: assignment.experiment?.id ?? null,
    pricingVariantId: assignment.variant?.id ?? null,
    variantName: assignment.variant?.name ?? null,
  };
}

export async function pricingExperimentAssignAndExpose(
  rawInput: unknown,
  context: AppContext,
): Promise<PricingAssignment> {
  const input = pricingPackagesInputSchema.parse(rawInput);
  const now = new Date();

  const experiment =
    await prismaDangerouslyBypassRLS.pricingExperiment.findFirst({
      where: {
        status: 'active',
        surface: input.surface,
        OR: [{ startsAt: null }, { startsAt: { lte: now } }],
        AND: [{ OR: [{ endsAt: null }, { endsAt: { gt: now } }] }],
      },
      include: {
        variants: { orderBy: [{ orderIndex: 'asc' }, { createdAt: 'asc' }] },
      },
      orderBy: { createdAt: 'desc' },
    });

  if (!experiment || experiment.variants.length === 0) {
    return { experiment: null, variant: null };
  }

  const currentUserId = context.currentUser?.id ?? null;
  if (currentUserId) {
    const existing =
      await prismaDangerouslyBypassRLS.pricingExposure.findUnique({
        where: {
          experimentId_userId: {
            experimentId: experiment.id,
            userId: currentUserId,
          },
        },
        include: { variant: true },
      });

    if (existing) {
      return {
        experiment: {
          id: experiment.id,
          key: experiment.key,
          name: experiment.name,
          surface: experiment.surface,
        },
        variant: {
          id: existing.variant.id,
          key: existing.variant.key,
          name: existing.variant.name,
          isControl: existing.variant.isControl,
          packageConfig: existing.variant.packageConfig,
        },
      };
    }
  }

  const control = experiment.variants.find((variant) => variant.isControl);
  const trafficBucket = hashToBucket(
    `${experiment.key}:${currentUserId || input.anonymousId || input.sessionId || 'anonymous'}`,
    10000,
  );
  const inTraffic = trafficBucket < experiment.trafficPercent * 100;
  const allocationBucket = hashToBucket(
    `${experiment.id}:${currentUserId || input.anonymousId || input.sessionId || 'anonymous'}`,
    10000,
  );
  let cursor = 0;
  let selected = inTraffic
    ? experiment.variants[0]
    : (control ?? experiment.variants[0]);

  if (inTraffic) {
    for (const variant of experiment.variants) {
      cursor += variant.allocationBps;
      if (allocationBucket < cursor) {
        selected = variant;
        break;
      }
    }
  }

  if (currentUserId) {
    await prismaDangerouslyBypassRLS.pricingExposure.upsert({
      where: {
        experimentId_userId: {
          experimentId: experiment.id,
          userId: currentUserId,
        },
      },
      create: {
        userId: currentUserId,
        organizationId: context.currentOrganization?.id ?? null,
        memberId: context.currentMember?.id ?? null,
        experimentId: experiment.id,
        variantId: selected.id,
        surface: input.surface,
        sessionId: input.sessionId || null,
        anonymousId: input.anonymousId || null,
        currentPath: input.currentPath || null,
        metadata: {
          courseId: input.courseId || null,
          courseSlug: input.courseSlug || null,
          bundleId: input.bundleId || null,
          inTraffic,
        },
      },
      update: {
        sessionId: input.sessionId || null,
        anonymousId: input.anonymousId || null,
        currentPath: input.currentPath || null,
      },
    });
  }

  return {
    experiment: {
      id: experiment.id,
      key: experiment.key,
      name: experiment.name,
      surface: experiment.surface,
    },
    variant: {
      id: selected.id,
      key: selected.key,
      name: selected.name,
      isControl: selected.isControl,
      packageConfig: selected.packageConfig,
    },
  };
}

export async function pricingPackagesResolve(
  rawInput: unknown,
  context: AppContext,
) {
  const input = pricingPackagesInputSchema.parse(rawInput);
  const assignment = await pricingExperimentAssignAndExpose(input, context);
  const variantConfig = readVariantConfig(assignment.variant?.packageConfig);
  const t = context.dictionary.pricing;
  const assignmentMetadata = pricingAssignmentMetadata(assignment);

  const [plans, course, bundle, aiCreditPacks] = await Promise.all([
    fetchStripePlans(),
    input.courseId || input.courseSlug
      ? prismaDangerouslyBypassRLS.course.findFirst({
          where: {
            ...(input.courseId ? { id: input.courseId } : {}),
            ...(input.courseSlug ? { slug: input.courseSlug } : {}),
            status: 'published',
            safetyHold: false,
          },
          select: {
            id: true,
            title: true,
            accessType: true,
            priceCents: true,
            currency: true,
            stripePriceId: true,
            lifetimeAccessEnabled: true,
            lifetimePriceCents: true,
            lifetimeStripePriceId: true,
          },
        })
      : Promise.resolve(null),
    input.bundleId
      ? prismaDangerouslyBypassRLS.courseBundle.findFirst({
          where: { id: input.bundleId, status: 'published' },
          include: {
            courses: {
              include: {
                course: {
                  select: {
                    id: true,
                    title: true,
                    status: true,
                    safetyHold: true,
                    priceCents: true,
                  },
                },
              },
            },
          },
        })
      : Promise.resolve(null),
    prismaDangerouslyBypassRLS.aiCreditPack.findMany({
      where: { status: 'active' },
      orderBy: [{ displayOrder: 'asc' }, { createdAt: 'asc' }],
    }),
  ]);

  const monthlyByName = new Map(
    plans
      .filter((plan) => plan.interval === 'month' && plan.intervalCount === 1)
      .map((plan) => [plan.name, plan]),
  );

  const packageCandidates = [
    ...plans.map((plan) => {
      const packageType: PricingPackageType =
        plan.interval === 'year'
          ? 'annual_subscription'
          : 'monthly_subscription';
      const monthly = monthlyByName.get(plan.name);
      const annualBaseline =
        monthly && plan.interval === 'year' ? monthly.unitAmount * 12 : null;
      const savingsPercent =
        annualBaseline && annualBaseline > plan.unitAmount
          ? Math.round(
              ((annualBaseline - plan.unitAmount) / annualBaseline) * 100,
            )
          : null;
      const recommended =
        variantConfig.recommendedPackageTypes?.includes(packageType) ??
        packageType === 'annual_subscription';

      return pricingPackageSchema.parse({
        id: `subscription:${plan.stripePriceId}`,
        packageType,
        name: plan.name,
        description: plan.description,
        priceCents: plan.unitAmount,
        currency: plan.currency,
        billingInterval: plan.interval,
        stripePriceId: plan.stripePriceId,
        courseId: null,
        bundleId: null,
        aiCreditPackId: null,
        tokenAmount: null,
        savingsPercent,
        recommended,
        comparisonGroup: 'subscription',
        benefits: plan.marketingFeatures.map((feature) => feature.name),
        ...assignmentMetadata,
      });
    }),
    course && course.accessType === 'paid' && course.priceCents
      ? pricingPackageSchema.parse({
          id: `course:${course.id}`,
          packageType: 'course_purchase',
          name: course.title,
          description: t.coursePurchaseDescription,
          priceCents: course.priceCents,
          currency: course.currency,
          billingInterval: 'one_time',
          stripePriceId: course.stripePriceId ?? null,
          courseId: course.id,
          bundleId: null,
          aiCreditPackId: null,
          tokenAmount: null,
          savingsPercent: null,
          recommended: false,
          comparisonGroup: 'course',
          benefits: t.benefits.coursePurchase,
          ...assignmentMetadata,
        })
      : null,
    course?.lifetimeAccessEnabled && course.lifetimePriceCents
      ? pricingPackageSchema.parse({
          id: `course-lifetime:${course.id}`,
          packageType: 'selected_lifetime_course_access',
          name: t.lifetimeAccessName.replace('{0}', course.title),
          description: t.lifetimeAccessDescription,
          priceCents: course.lifetimePriceCents,
          currency: course.currency,
          billingInterval: 'one_time',
          stripePriceId: course.lifetimeStripePriceId ?? null,
          courseId: course.id,
          bundleId: null,
          aiCreditPackId: null,
          tokenAmount: null,
          savingsPercent: null,
          recommended: Boolean(
            variantConfig.recommendedPackageTypes?.includes(
              'selected_lifetime_course_access',
            ),
          ),
          comparisonGroup: 'course',
          benefits: t.benefits.lifetime,
          ...assignmentMetadata,
        })
      : null,
    bundle && bundle.priceCents
      ? pricingPackageSchema.parse({
          id: `bundle:${bundle.id}`,
          packageType: 'course_bundle',
          name: bundle.title,
          description: bundle.description,
          priceCents: bundle.priceCents,
          currency: bundle.currency,
          billingInterval: 'one_time',
          stripePriceId: bundle.stripePriceId ?? null,
          courseId: null,
          bundleId: bundle.id,
          aiCreditPackId: null,
          tokenAmount: null,
          savingsPercent: bundleSavingsPercent(bundle),
          recommended: Boolean(
            variantConfig.recommendedPackageTypes?.includes('course_bundle'),
          ),
          comparisonGroup: 'bundle',
          benefits: t.benefits.bundle,
          ...assignmentMetadata,
        })
      : null,
    ...aiCreditPacks.map((pack) =>
      pricingPackageSchema.parse({
        id: `ai-credit:${pack.id}`,
        packageType: 'ai_credit_pack',
        name: pack.name,
        description: pack.description,
        priceCents: pack.priceCents,
        currency: pack.currency,
        billingInterval: 'one_time',
        stripePriceId: pack.stripePriceId ?? null,
        courseId: null,
        bundleId: null,
        aiCreditPackId: pack.id,
        tokenAmount: pack.tokenAmount + pack.bonusTokenAmount,
        savingsPercent: null,
        recommended: Boolean(
          variantConfig.recommendedPackageTypes?.includes('ai_credit_pack'),
        ),
        comparisonGroup: 'ai',
        benefits: t.benefits.aiCredits,
        ...assignmentMetadata,
      }),
    ),
  ];
  const packages = packageCandidates
    .filter((pkg): pkg is NonNullable<(typeof packageCandidates)[number]> =>
      Boolean(pkg),
    )
    .filter((pkg) => packageAllowed(pkg.packageType, variantConfig));

  return {
    experiment: assignment.experiment
      ? {
          id: assignment.experiment.id,
          key: assignment.experiment.key,
          name: assignment.experiment.name,
          surface: assignment.experiment.surface,
        }
      : null,
    variant: assignment.variant
      ? {
          id: assignment.variant.id,
          key: assignment.variant.key,
          name: assignment.variant.name,
          isControl: assignment.variant.isControl,
        }
      : null,
    packages,
  };
}

function bundleSavingsPercent(bundle: {
  priceCents: number | null;
  courses: Array<{ course: { priceCents: number | null } }>;
}) {
  const bundlePrice = bundle.priceCents || 0;
  const standalone = bundle.courses.reduce(
    (total, item) => total + (item.course.priceCents || 0),
    0,
  );

  if (!standalone || standalone <= bundlePrice) {
    return null;
  }

  return Math.round(((standalone - bundlePrice) / standalone) * 100);
}

export function pricingMetadataFromCheckout(input: {
  pricingPackageId?: string | null;
  pricingExperimentId?: string | null;
  pricingVariantId?: string | null;
  packageType?: PricingPackageType | null;
}) {
  return {
    pricingPackageId: input.pricingPackageId ?? '',
    pricingExperimentId: input.pricingExperimentId ?? '',
    pricingVariantId: input.pricingVariantId ?? '',
    packageType: input.packageType ?? '',
  };
}
