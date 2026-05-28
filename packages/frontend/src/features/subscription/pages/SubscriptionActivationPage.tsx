import { useEffect, useMemo, type ReactNode } from 'react';
import { dictionaryFormat } from '@project/backend/translation/dictionaryFormat';
import { createLazyRoute, Link, useSearch } from '@tanstack/react-router';
import {
  LuBookOpenCheck,
  LuBrain,
  LuChartPie,
  LuMap,
  LuRefreshCw,
  LuShieldCheck,
  LuSparkles,
  LuTarget,
} from 'react-icons/lu';
import { useShallow } from 'zustand/react/shallow';
import { useAuthStore } from '@/features/auth/authStore';
import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';
import { Card, CardContent } from '@/shared/components/ui/card';
import {
  productAnalyticsTrack,
  productAnalyticsTrackOnce,
} from '@/shared/lib/productAnalytics';

export const subscriptionActivationLazyRoute = createLazyRoute(
  '/subscription/activation',
)({
  component: SubscriptionActivationPage,
});

export function SubscriptionActivationPage() {
  const search = useSearch({ strict: false }) as { session_id?: string };
  const { dictionary, config, currentSubscription, fetchCurrentUser } =
    useAuthStore(
      useShallow((state) => ({
        dictionary: state.dictionary,
        config: state.config,
        currentSubscription: state.currentSubscription,
        fetchCurrentUser: state.fetchCurrentUser,
      })),
    );
  const t = dictionary.subscription.activation;
  const plans = config?.subscriptionPlans || [];
  const plan = useMemo(
    () =>
      plans.find(
        (item) => item.stripePriceId === currentSubscription?.stripePriceId,
      ),
    [currentSubscription?.stripePriceId, plans],
  );

  useEffect(() => {
    if (currentSubscription) {
      return;
    }

    let attempts = 0;
    const interval = window.setInterval(() => {
      attempts += 1;
      void fetchCurrentUser();
      if (attempts >= 12) {
        window.clearInterval(interval);
      }
    }, 1500);

    void fetchCurrentUser();

    return () => window.clearInterval(interval);
  }, [currentSubscription, fetchCurrentUser]);

  useEffect(() => {
    productAnalyticsTrackOnce('activation_seen:subscription', {
      eventName: 'activation_seen',
      stripeCheckoutSessionId: search.session_id || null,
      stripePriceId: currentSubscription?.stripePriceId ?? null,
      ctaLocation: 'subscription_activation',
      funnelId: currentSubscription?.stripePriceId
        ? `subscription:${currentSubscription.stripePriceId}`
        : 'subscription',
      metadata: {
        activationReady: Boolean(currentSubscription),
      },
    });
  }, [currentSubscription, search.session_id]);

  const trackClick = (ctaLocation: string) => {
    productAnalyticsTrack({
      eventName: 'activation_cta_click',
      stripeCheckoutSessionId: search.session_id || null,
      stripePriceId: currentSubscription?.stripePriceId ?? null,
      ctaLocation,
      funnelId: currentSubscription?.stripePriceId
        ? `subscription:${currentSubscription.stripePriceId}`
        : 'subscription',
      metadata: {
        activationReady: Boolean(currentSubscription),
      },
    });
  };

  if (!currentSubscription) {
    return (
      <div className="mx-auto flex w-full max-w-4xl flex-1 flex-col gap-5 px-4 py-8 lg:px-7">
        <Card className="nex-glass-card rounded-3xl border-white/70 dark:border-white/10">
          <CardContent className="p-7 text-center lg:p-9">
            <span className="bg-nexexam-primary/10 text-nexexam-primary mx-auto grid size-14 place-items-center rounded-2xl">
              <LuRefreshCw className="size-6 animate-spin" />
            </span>
            <h1 className="text-nexexam-ink mt-5 text-3xl font-extrabold tracking-normal dark:text-white">
              {t.unlockingTitle}
            </h1>
            <p className="text-muted-foreground mx-auto mt-3 max-w-2xl">
              {t.unlockingBody}
            </p>
            <Button
              type="button"
              className="mt-6 h-11 rounded-xl"
              onClick={() => void fetchCurrentUser()}
            >
              <LuRefreshCw className="size-4" />
              {t.retryUnlock}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const planName = plan?.name || dictionary.subscription.unknown;

  return (
    <div className="flex flex-col gap-6 px-4 py-6 lg:px-7">
      <section className="nex-glass-card nex-gradient-hero rounded-3xl p-7 lg:p-9">
        <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <div className="max-w-3xl">
            <Badge variant="secondary" className="rounded-xl">
              {t.unlockedPlan}
            </Badge>
            <Badge variant="outline" className="ml-2 rounded-xl bg-white/70">
              <LuShieldCheck className="size-3.5" />
              {dictionary.checkoutTrust.secureAfterPayment}
            </Badge>
            <h1 className="text-nexexam-ink mt-4 text-4xl font-extrabold tracking-normal dark:text-white">
              {dictionaryFormat(t.titleWithPlan, planName)}
            </h1>
            <p className="text-muted-foreground mt-3 text-lg">{t.body}</p>
          </div>
          <Button
            nativeButton={false}
            className="h-12 rounded-xl"
            onClick={() => trackClick('subscription_activation_catalog')}
            render={<Link to="/course" />}
          >
            {t.exploreCourses}
          </Button>
        </div>
      </section>

      <section className="grid gap-5 lg:grid-cols-3">
        <SubscriptionUnlockCard
          icon={<LuBrain className="size-5" />}
          title={t.aiCoachTitle}
          body={t.aiCoachBody}
        />
        <SubscriptionUnlockCard
          icon={<LuChartPie className="size-5" />}
          title={t.readinessTitle}
          body={t.readinessBody}
        />
        <SubscriptionUnlockCard
          icon={<LuTarget className="size-5" />}
          title={t.practiceTitle}
          body={t.practiceBody}
        />
      </section>

      <section className="grid gap-4 md:grid-cols-4">
        <Button
          nativeButton={false}
          className="h-11 rounded-xl"
          onClick={() => trackClick('subscription_activation_ai_tutor')}
          render={<Link to="/student/ai-tutor" />}
        >
          <LuSparkles className="size-4" />
          {t.openTutor}
        </Button>
        <Button
          nativeButton={false}
          variant="outline"
          className="h-11 rounded-xl bg-white/70"
          onClick={() => trackClick('subscription_activation_practice')}
          render={<Link to="/student/practice" />}
        >
          <LuTarget className="size-4" />
          {t.openPractice}
        </Button>
        <Button
          nativeButton={false}
          variant="outline"
          className="h-11 rounded-xl bg-white/70"
          onClick={() => trackClick('subscription_activation_mastery_map')}
          render={<Link to="/student/mastery-map" />}
        >
          <LuMap className="size-4" />
          {t.openMasteryMap}
        </Button>
        <Button
          nativeButton={false}
          variant="outline"
          className="h-11 rounded-xl bg-white/70"
          onClick={() => trackClick('subscription_activation_dashboard')}
          render={<Link to="/student/my-courses" />}
        >
          <LuBookOpenCheck className="size-4" />
          {t.openDashboard}
        </Button>
      </section>
    </div>
  );
}

function SubscriptionUnlockCard({
  icon,
  title,
  body,
}: {
  icon: ReactNode;
  title: string;
  body: string;
}) {
  return (
    <Card className="nex-glass-card rounded-2xl border-white/70 dark:border-white/10">
      <CardContent className="p-5">
        <span className="bg-nexexam-primary/10 text-nexexam-primary grid size-11 place-items-center rounded-xl">
          {icon}
        </span>
        <h2 className="mt-4 font-extrabold">{title}</h2>
        <p className="text-muted-foreground mt-2 text-sm">{body}</p>
      </CardContent>
    </Card>
  );
}
