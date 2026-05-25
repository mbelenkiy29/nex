import { useState, useMemo } from 'react';
import { createLazyRoute } from '@tanstack/react-router';
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
import { Info } from 'lucide-react';

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
      <PageHeader items={[['Subscription']]} />

      <div className="container mx-auto flex h-full w-full flex-col px-4 py-8 md:py-12">
        {isNativeApp ? (
          <Alert className="mb-8">
            <Info className="h-4 w-4" />
            <AlertTitle>
              {dictionary.subscription.mobileUnavailableTitle}
            </AlertTitle>
            <AlertDescription>
              {dictionary.subscription.mobileUnavailable}
            </AlertDescription>
          </Alert>
        ) : (
          <>
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

            {/* Interval Tabs */}
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

            {/* Empty State */}
            {filteredPlans.length === 0 && (
              <div className="flex flex-col items-center justify-center py-16">
                <p className="text-muted-foreground text-center">
                  {dictionary.subscription.noPlansAvailable}
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
