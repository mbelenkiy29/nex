import { useEffect, useState, useMemo, type ReactNode } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import {
  createLazyRoute,
  useNavigate,
  useSearch,
} from '@tanstack/react-router';
import { useAuthStore } from '@/features/auth/authStore';
import { useShallow } from 'zustand/react/shallow';
import { SubscriptionCard } from '@/features/subscription/components/SubscriptionCard';
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from '@/shared/components/ui/tabs';
import { Badge } from '@/shared/components/ui/badge';
import { PageHeader } from '@/shared/components/PageHeader';
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from '@/shared/components/ui/alert';
import {
  LuBookOpenCheck,
  LuBrain,
  LuCheck,
  LuInfo,
  LuSparkles,
  LuTarget,
} from 'react-icons/lu';
import { productAnalyticsTrackOnce } from '@/shared/lib/productAnalytics';
import { PricingPackageSelector } from '@/features/pricing/PricingPackageSelector';
import {
  PricingPackage,
  PricingPackagesResponse,
} from '@/features/pricing/pricingTypes';
import { apiClient } from '@/shared/lib/apiClient';
import { objectToQuery } from '@/shared/lib/objectToQuery';
import { toast } from 'sonner';

export const subscriptionLazyRoute = createLazyRoute('/subscription')({
  component: SubscriptionPage,
});

export function SubscriptionPage() {
  const { dictionary, config, currentSubscription, isInitialized } =
    useAuthStore(
      useShallow((state) => ({
        dictionary: state.dictionary,
        config: state.config,
        currentSubscription: state.currentSubscription,
        isInitialized: state.isInitialized,
      })),
    );
  const isNativeApp =
    typeof window !== 'undefined' && (window as any).isNativeApp;
  const subscriptionPlans = config?.subscriptionPlans || [];
  const search = useSearch({ strict: false }) as {
    checkout?: 'cancelled';
    ai_credits?: 'success' | 'cancelled';
  };
  const navigate = useNavigate();
  const pricingPackagesQuery = useQuery({
    queryKey: ['pricing', 'packages', 'subscription_page'],
    queryFn: async ({ signal }) =>
      apiClient
        .get(
          `api/pricing/packages?${objectToQuery({
            surface: 'subscription_page',
            currentPath:
              typeof window !== 'undefined'
                ? `${window.location.pathname}${window.location.search}`
                : undefined,
          })}`,
          { signal },
        )
        .json<PricingPackagesResponse>(),
  });
  const aiCreditCheckoutMutation = useMutation({
    mutationFn: (pkg: PricingPackage) =>
      apiClient
        .post(`api/ai-credit-packs/${pkg.aiCreditPackId}/checkout`, {
          json: {
            pricingPackageId: pkg.id,
            pricingExperimentId: pkg.pricingExperimentId,
            pricingVariantId: pkg.pricingVariantId,
            packageType: pkg.packageType,
          },
        })
        .json<{ url: string }>(),
    onSuccess: ({ url }) => {
      window.location.href = url;
    },
    onError: (error: Error) =>
      toast.error(error.message || dictionary.shared.errors.unknown),
  });

  useEffect(() => {
    if (search.checkout !== 'cancelled') {
      return;
    }

    toast.info(dictionary.checkoutTrust.checkoutCancelled);
    navigate({ to: '/subscription', search: {}, replace: true });
  }, [dictionary.checkoutTrust.checkoutCancelled, navigate, search.checkout]);

  useEffect(() => {
    if (search.ai_credits === 'success') {
      toast.success(dictionary.pricing.aiCreditPurchaseSuccess);
      navigate({ to: '/subscription', search: {}, replace: true });
    } else if (search.ai_credits === 'cancelled') {
      toast.info(dictionary.checkoutTrust.checkoutCancelled);
      navigate({ to: '/subscription', search: {}, replace: true });
    }
  }, [
    dictionary.checkoutTrust.checkoutCancelled,
    dictionary.pricing.aiCreditPurchaseSuccess,
    navigate,
    search.ai_credits,
  ]);

  useEffect(() => {
    if (currentSubscription || subscriptionPlans.length === 0) {
      return;
    }

    productAnalyticsTrackOnce('paywall_seen:subscription_page', {
      eventName: 'paywall_seen',
      ctaLocation: 'subscription_page',
      funnelId: 'subscription',
      metadata: {
        purchaseType: 'subscription',
        planCount: subscriptionPlans.length,
      },
    });
  }, [currentSubscription, subscriptionPlans.length]);

  const availableIntervals = useMemo(() => {
    const visiblePlans = subscriptionPlans.filter(
      (plan) =>
        plan.active ||
        currentSubscription?.stripePriceId === plan.stripePriceId,
    );
    const intervals = new Set(
      visiblePlans.map((plan) => plan.interval as string),
    );
    return Array.from(intervals).sort((a, b) => {
      const order = ['month', 'year', 'week', 'day'];
      return order.indexOf(a) - order.indexOf(b);
    });
  }, [subscriptionPlans, currentSubscription]);

  const defaultInterval = availableIntervals.includes('month')
    ? 'month'
    : availableIntervals[0] || 'month';

  const [selectedInterval, setSelectedInterval] =
    useState<string>(defaultInterval);

  const filteredPlans = useMemo(() => {
    return subscriptionPlans
      .filter((plan) => plan.interval === selectedInterval)
      .filter(
        (plan) =>
          plan.active ||
          currentSubscription?.stripePriceId === plan.stripePriceId,
      )
      .sort((a, b) => a.unitAmount - b.unitAmount);
  }, [subscriptionPlans, selectedInterval, currentSubscription]);

  const getIntervalLabel = (interval: string) => {
    return (
      dictionary.subscription.intervals[
        interval as keyof typeof dictionary.subscription.intervals
      ] || interval
    );
  };

  const getGridClasses = (itemCount: number) => {
    if (itemCount === 1) {
      return 'mx-auto grid max-w-md grid-cols-1 gap-6';
    }
    if (itemCount === 2) {
      return 'mx-auto grid max-w-4xl grid-cols-1 gap-6 sm:grid-cols-2';
    }
    return 'mx-auto grid max-w-6xl grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3';
  };

  if (!isInitialized) {
    return null;
  }

  return (
    <div className="flex flex-1 flex-col p-6">
      <PageHeader items={[[dictionary.subscription.title]]} />

      <div className="container mx-auto flex h-full w-full flex-col px-4 py-8 md:py-12">
        {isNativeApp ? (
          <Alert className="mb-8">
            <LuInfo className="h-4 w-4" />
            <AlertTitle>
              {dictionary.subscription.mobileUnavailableTitle}
            </AlertTitle>
            <AlertDescription>
              {dictionary.subscription.mobileUnavailable}
            </AlertDescription>
          </Alert>
        ) : (
          <>
            <SubscriptionValueHero />

            <PricingExperimentShelf
              packages={pricingPackagesQuery.data?.packages || []}
              pending={aiCreditCheckoutMutation.isPending}
              onAiCreditCheckout={(pkg) => aiCreditCheckoutMutation.mutate(pkg)}
            />

            {currentSubscription && (
              <div className="mb-8 flex items-center justify-center gap-2">
                <span className="text-muted-foreground text-sm">
                  {dictionary.subscription.currentPlan}
                </span>
                <Badge variant="secondary" className="text-sm">
                  {subscriptionPlans.find(
                    (p) =>
                      p.stripePriceId === currentSubscription.stripePriceId,
                  )?.name || dictionary.subscription.unknown}
                </Badge>
              </div>
            )}

            {availableIntervals.length > 1 && (
              <Tabs
                value={selectedInterval}
                onValueChange={setSelectedInterval}
                className="w-full"
              >
                <div className="mb-8 flex justify-center">
                  <TabsList>
                    {availableIntervals.map((interval) => (
                      <TabsTrigger key={interval} value={interval}>
                        {getIntervalLabel(interval)}
                      </TabsTrigger>
                    ))}
                  </TabsList>
                </div>

                {availableIntervals.map((interval) => (
                  <TabsContent key={interval} value={interval} className="mt-0">
                    <div className={getGridClasses(filteredPlans.length)}>
                      {filteredPlans.map((plan) => (
                        <SubscriptionCard
                          key={plan.stripePriceId}
                          subscriptionPlan={plan}
                        />
                      ))}
                    </div>
                  </TabsContent>
                ))}
              </Tabs>
            )}

            {/* Fallback for single interval */}
            {availableIntervals.length <= 1 && (
              <div className={getGridClasses(filteredPlans.length)}>
                {filteredPlans.map((plan) => (
                  <SubscriptionCard
                    key={plan.stripePriceId}
                    subscriptionPlan={plan}
                  />
                ))}
              </div>
            )}

            {filteredPlans.length === 0 && (
              <div className="flex flex-col items-center justify-center py-16">
                <p className="text-muted-foreground text-center">
                  {dictionary.subscription.noPlansAvailable}
                </p>
              </div>
            )}

            <SubscriptionComparison />
          </>
        )}
      </div>
    </div>
  );
}

function SubscriptionValueHero() {
  const dictionary = useAuthStore((state) => state.dictionary);
  const t = dictionary.subscription.value;

  return (
    <section className="nex-glass-card mb-8 rounded-3xl border-white/70 p-6 lg:p-8 dark:border-white/10">
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
        <div>
          <Badge className="bg-primary/10 text-primary hover:bg-primary/10 rounded-xl">
            <LuSparkles className="size-3.5" />
            {t.eyebrow}
          </Badge>
          <h1 className="text-nexexam-ink mt-4 max-w-3xl text-3xl font-extrabold tracking-normal md:text-4xl dark:text-white">
            {t.title}
          </h1>
          <p className="text-muted-foreground mt-3 max-w-2xl text-base">
            {t.body}
          </p>
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <ValuePathCard
              icon={<LuBookOpenCheck className="size-5" />}
              title={t.courseTitle}
              body={t.courseBody}
            />
            <ValuePathCard
              icon={<LuBrain className="size-5" />}
              title={t.subscriptionTitle}
              body={t.subscriptionBody}
            />
          </div>
        </div>
        <div className="rounded-2xl border bg-white/70 p-5 dark:bg-white/8">
          <div className="flex items-center gap-3">
            <span className="bg-primary/10 text-primary grid size-10 place-items-center rounded-xl">
              <LuTarget className="size-5" />
            </span>
            <h2 className="font-extrabold">{t.includedTitle}</h2>
          </div>
          <ul className="mt-4 space-y-3">
            {t.included.map((item) => (
              <li key={item} className="flex items-start gap-3 text-sm">
                <LuCheck className="text-primary mt-0.5 size-4 shrink-0" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

function PricingExperimentShelf({
  packages,
  pending,
  onAiCreditCheckout,
}: {
  packages: PricingPackage[];
  pending: boolean;
  onAiCreditCheckout: (pkg: PricingPackage) => void;
}) {
  const dictionary = useAuthStore((state) => state.dictionary);
  const aiPackages = packages.filter(
    (pkg) => pkg.packageType === 'ai_credit_pack' && pkg.aiCreditPackId,
  );

  if (!aiPackages.length) {
    return null;
  }

  return (
    <section className="mb-8 grid gap-3">
      <div>
        <h2 className="text-nexexam-ink text-xl font-extrabold tracking-normal dark:text-white">
          {dictionary.pricing.aiCreditShelfTitle}
        </h2>
        <p className="text-muted-foreground mt-1 text-sm">
          {dictionary.pricing.aiCreditShelfBody}
        </p>
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <PricingPackageSelector
          packages={aiPackages}
          onCheckout={onAiCreditCheckout}
          checkoutLabel={dictionary.pricing.buyCredits}
          pending={pending}
        />
      </div>
    </section>
  );
}

function ValuePathCard({
  icon,
  title,
  body,
}: {
  icon: ReactNode;
  title: string;
  body: string;
}) {
  return (
    <div className="rounded-2xl border bg-white/70 p-4 dark:bg-white/8">
      <div className="flex items-center gap-3">
        <span className="bg-primary/10 text-primary grid size-9 place-items-center rounded-xl">
          {icon}
        </span>
        <h2 className="font-extrabold">{title}</h2>
      </div>
      <p className="text-muted-foreground mt-2 text-sm">{body}</p>
    </div>
  );
}

function SubscriptionComparison() {
  const dictionary = useAuthStore((state) => state.dictionary);
  const t = dictionary.subscription.value;

  return (
    <section className="mx-auto mt-8 w-full max-w-5xl">
      <h2 className="text-nexexam-ink text-xl font-extrabold tracking-normal dark:text-white">
        {t.comparisonTitle}
      </h2>
      <div className="mt-4 overflow-hidden rounded-2xl border bg-white/72 dark:bg-white/8">
        {t.comparisonRows.map((row) => (
          <div
            key={row.label}
            className="grid gap-3 border-b p-4 last:border-b-0 md:grid-cols-[180px_1fr_1fr]"
          >
            <div className="text-sm font-extrabold">{row.label}</div>
            <div className="text-muted-foreground text-sm">{row.course}</div>
            <div className="text-sm font-semibold">{row.subscription}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
