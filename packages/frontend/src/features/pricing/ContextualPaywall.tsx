import { useMutation, useQuery } from '@tanstack/react-query';
import { Link } from '@tanstack/react-router';
import { LuArrowRight, LuCheck, LuLock, LuSparkles } from 'react-icons/lu';
import { toast } from 'sonner';
import { useEffect, useState } from 'react';
import { CheckoutTrustPanel } from '@/features/checkout/CheckoutTrustPanel';
import { useAuthStore } from '@/features/auth/authStore';
import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';
import { apiClient } from '@/shared/lib/apiClient';
import { cn } from '@/shared/lib/utils';
import { objectToQuery } from '@/shared/lib/objectToQuery';
import {
  productAnalyticsTrack,
  productAnalyticsTrackOnce,
} from '@/shared/lib/productAnalytics';
import {
  formatPackagePrice,
  PricingPackageSelector,
} from './PricingPackageSelector';
import type { PricingPackage, PricingPackageType } from './pricingTypes';

export type ContextualPaywallSource =
  | 'personalized_onboarding_result'
  | 'diagnostic_result'
  | 'preview_lesson_complete'
  | 'ai_full_plan'
  | 'locked_certificate'
  | 'locked_practice_exam';

export function ContextualPaywall({
  source,
  courseId,
  courseSlug,
  lessonId,
  attemptId,
  lockedFeature,
  preferredPackageTypes,
  compact = false,
  className,
  metadata,
  checkoutPending,
  onCheckoutPackage,
}: {
  source: ContextualPaywallSource;
  courseId?: string | null;
  courseSlug?: string | null;
  lessonId?: string | null;
  attemptId?: string | null;
  lockedFeature?: 'certificate' | 'practice_exam' | null;
  preferredPackageTypes?: PricingPackageType[];
  compact?: boolean;
  className?: string;
  metadata?: Record<string, unknown>;
  checkoutPending?: boolean;
  onCheckoutPackage?: (pkg: PricingPackage) => void;
}) {
  const dictionary = useAuthStore((state) => state.dictionary);
  const locale = useAuthStore((state) => state.locale);
  const t = dictionary.contextualPaywall;
  const [selectedPackageId, setSelectedPackageId] = useState<string | null>(
    null,
  );
  const query = useQuery({
    queryKey: [
      'pricing',
      'packages',
      source,
      courseId || null,
      courseSlug || null,
    ],
    queryFn: async ({ signal }) =>
      apiClient
        .get(
          `api/pricing/packages?${objectToQuery({
            surface: source,
            courseId: courseId || undefined,
            courseSlug: courseSlug || undefined,
            currentPath:
              typeof window !== 'undefined'
                ? `${window.location.pathname}${window.location.search}`
                : undefined,
          })}`,
          { signal },
        )
        .json<{
          packages: PricingPackage[];
        }>(),
  });

  const packageTypes = preferredPackageTypes || defaultPackageTypes(source);
  const packages = (query.data?.packages || []).filter((pkg) =>
    packageTypes.includes(pkg.packageType),
  );
  const selectedPackage =
    packages.find((pkg) => pkg.id === selectedPackageId) ||
    packages.find((pkg) => pkg.recommended) ||
    packages[0] ||
    null;
  const priceLabel = selectedPackage
    ? formatPackagePrice(selectedPackage, locale)
    : null;
  const checkoutVariant = selectedPackage
    ? checkoutTrustVariant(selectedPackage)
    : null;
  const analyticsMetadata = {
    ...(metadata || {}),
    paywallSource: source,
    lockedFeature: lockedFeature || null,
    pricingPackageId: selectedPackage?.id ?? null,
    pricingExperimentId: selectedPackage?.pricingExperimentId ?? null,
    pricingVariantId: selectedPackage?.pricingVariantId ?? null,
    packageType: selectedPackage?.packageType ?? null,
    availablePackageTypes: packages.map((pkg) => pkg.packageType),
  };

  const checkoutMutation = useMutation({
    mutationFn: async (pkg: PricingPackage) => {
      const response = await contextualPaywallCheckout(pkg);
      if (!response) {
        throw new Error(t.errors.checkoutUnavailable);
      }
      return response;
    },
    onSuccess: ({ url }) => {
      window.location.href = url;
    },
    onError: (error: Error) =>
      toast.error(error.message || dictionary.shared.errors.unknown),
  });

  useEffect(() => {
    if (!selectedPackageId && selectedPackage) {
      setSelectedPackageId(selectedPackage.id);
    }
  }, [selectedPackage, selectedPackageId]);

  useEffect(() => {
    productAnalyticsTrackOnce(
      `contextual_paywall:${source}:${courseId || 'global'}:${lessonId || attemptId || lockedFeature || 'default'}`,
      {
        eventName: 'paywall_seen',
        courseId: courseId || null,
        lessonId: lessonId || null,
        ctaLocation: `contextual_paywall_${source}`,
        funnelId: courseId ? `course:${courseId}` : 'subscription',
        metadata: analyticsMetadata,
      },
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [source, courseId, lessonId, attemptId, lockedFeature]);

  const isPending = checkoutPending || checkoutMutation.isPending;
  const ctaLabel = selectedPackage
    ? ctaLabelForPackage(selectedPackage, t)
    : t.cta.viewPlans;

  const handleCheckout = () => {
    productAnalyticsTrack({
      eventName: 'cta_click',
      courseId: courseId || selectedPackage?.courseId || null,
      lessonId: lessonId || null,
      stripePriceId: selectedPackage?.stripePriceId || null,
      ctaLocation: `contextual_paywall_${source}`,
      funnelId: courseId ? `course:${courseId}` : 'subscription',
      metadata: {
        ...analyticsMetadata,
        priceCents: selectedPackage?.priceCents ?? null,
        currency: selectedPackage?.currency ?? null,
        checkoutTrustShown: Boolean(checkoutVariant),
      },
    });

    if (!selectedPackage) {
      return;
    }

    if (onCheckoutPackage) {
      onCheckoutPackage(selectedPackage);
      return;
    }

    checkoutMutation.mutate(selectedPackage);
  };

  return (
    <section
      className={cn(
        'border-primary/20 bg-primary/8 dark:bg-primary/15 rounded-2xl border p-4',
        !compact && 'p-5',
        className,
      )}
    >
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0 flex-1">
          <Badge className="text-primary rounded-xl bg-white/80 hover:bg-white/80 dark:bg-white/10">
            <LuLock className="size-3.5" />
            {t.badges[source]}
          </Badge>
          <h3 className={cn('mt-3 font-extrabold', !compact && 'text-lg')}>
            {t.titles[source]}
          </h3>
          <p className="text-muted-foreground mt-1 text-sm">
            {t.bodies[source]}
          </p>
          <ul className="mt-3 grid gap-2">
            {t.bullets[source].slice(0, compact ? 2 : 3).map((item) => (
              <li
                key={item}
                className="text-muted-foreground flex items-start gap-2 text-xs"
              >
                <LuCheck className="text-primary mt-0.5 size-3.5 shrink-0" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="w-full lg:w-72">
          {selectedPackage && packages.length > 1 && !compact ? (
            <PricingPackageSelector
              packages={packages.slice(0, 2)}
              selectedPackageId={selectedPackage.id}
              onSelect={(pkg) => setSelectedPackageId(pkg.id)}
            />
          ) : selectedPackage ? (
            <div className="rounded-xl border bg-white/75 p-3 dark:bg-white/8">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="font-bold">{selectedPackage.name}</div>
                  <div className="text-muted-foreground mt-1 text-xs">
                    {selectedPackage.description}
                  </div>
                </div>
                <div className="text-right text-sm font-extrabold">
                  {priceLabel}
                </div>
              </div>
            </div>
          ) : null}

          {checkoutVariant && (
            <CheckoutTrustPanel
              variant={checkoutVariant}
              priceLabel={priceLabel}
              intervalLabel={intervalLabelForPackage(
                selectedPackage,
                dictionary,
              )}
              compact
              className="mt-3"
            />
          )}

          {selectedPackage ? (
            <Button
              type="button"
              className="mt-3 h-10 w-full rounded-xl"
              disabled={isPending}
              onClick={handleCheckout}
            >
              <LuSparkles className="size-4" />
              {isPending ? t.cta.checkoutPending : ctaLabel}
            </Button>
          ) : (
            <Button
              nativeButton={false}
              render={<Link to="/subscription" />}
              className="mt-3 h-10 w-full rounded-xl"
              onClick={() =>
                productAnalyticsTrack({
                  eventName: 'cta_click',
                  courseId: courseId || null,
                  lessonId: lessonId || null,
                  ctaLocation: `contextual_paywall_${source}`,
                  funnelId: courseId ? `course:${courseId}` : 'subscription',
                  metadata: {
                    ...analyticsMetadata,
                    action: 'view_plans',
                  },
                })
              }
            >
              <LuArrowRight className="size-4" />
              {t.cta.viewPlans}
            </Button>
          )}
        </div>
      </div>
    </section>
  );
}

function defaultPackageTypes(
  source: ContextualPaywallSource,
): PricingPackageType[] {
  if (source === 'preview_lesson_complete') {
    return ['course_purchase', 'selected_lifetime_course_access'];
  }
  if (source === 'personalized_onboarding_result') {
    return [
      'annual_subscription',
      'monthly_subscription',
      'course_purchase',
      'selected_lifetime_course_access',
    ];
  }
  if (source === 'ai_full_plan') {
    return ['annual_subscription', 'monthly_subscription', 'ai_credit_pack'];
  }
  return ['annual_subscription', 'monthly_subscription'];
}

function checkoutTrustVariant(pkg: PricingPackage) {
  if (
    pkg.packageType === 'monthly_subscription' ||
    pkg.packageType === 'annual_subscription'
  ) {
    return 'subscription' as const;
  }
  if (
    pkg.packageType === 'course_purchase' ||
    pkg.packageType === 'selected_lifetime_course_access'
  ) {
    return 'course' as const;
  }
  if (pkg.packageType === 'ai_credit_pack') {
    return 'aiCreditPack' as const;
  }
  if (pkg.packageType === 'course_bundle') {
    return 'courseBundle' as const;
  }
  return null;
}

function ctaLabelForPackage(pkg: PricingPackage, t: any) {
  if (
    pkg.packageType === 'monthly_subscription' ||
    pkg.packageType === 'annual_subscription'
  ) {
    return t.cta.subscription;
  }
  if (pkg.packageType === 'ai_credit_pack') {
    return t.cta.aiCredits;
  }
  return t.cta.course;
}

async function contextualPaywallCheckout(pkg: PricingPackage) {
  const pricingMetadata = {
    pricingPackageId: pkg.id,
    pricingExperimentId: pkg.pricingExperimentId,
    pricingVariantId: pkg.pricingVariantId,
    packageType: pkg.packageType,
  };

  if (
    (pkg.packageType === 'monthly_subscription' ||
      pkg.packageType === 'annual_subscription') &&
    pkg.stripePriceId
  ) {
    return await apiClient
      .post('api/subscription/checkout', {
        json: {
          stripePriceId: pkg.stripePriceId,
          ...pricingMetadata,
        },
      })
      .json<{ url: string }>();
  }

  if (
    (pkg.packageType === 'course_purchase' ||
      pkg.packageType === 'selected_lifetime_course_access') &&
    pkg.courseId
  ) {
    return await apiClient
      .post(`api/course/${pkg.courseId}/checkout`, {
        json: {
          ...pricingMetadata,
        },
      })
      .json<{ url: string }>();
  }

  if (pkg.packageType === 'ai_credit_pack' && pkg.aiCreditPackId) {
    return await apiClient
      .post(`api/ai-credit-packs/${pkg.aiCreditPackId}/checkout`, {
        json: {
          ...pricingMetadata,
        },
      })
      .json<{ url: string }>();
  }

  if (pkg.packageType === 'course_bundle' && pkg.bundleId) {
    return await apiClient
      .post(`api/course/bundles/${pkg.bundleId}/checkout`, {
        json: {
          ...pricingMetadata,
        },
      })
      .json<{ url: string }>();
  }

  return null;
}

function intervalLabelForPackage(pkg: PricingPackage | null, dictionary: any) {
  if (pkg?.billingInterval === 'month') {
    return dictionary.pricing.perMonth;
  }
  if (pkg?.billingInterval === 'year') {
    return dictionary.pricing.perYear;
  }
  return null;
}
