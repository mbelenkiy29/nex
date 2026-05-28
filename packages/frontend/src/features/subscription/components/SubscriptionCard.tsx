import { useMutation } from '@tanstack/react-query';
import { LuCircleCheck, LuCrown, LuSparkles } from 'react-icons/lu';
import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/shared/components/ui/card';
import { Separator } from '@/shared/components/ui/separator';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/shared/components/ui/tooltip';
import { toast } from 'sonner';
import { useAuthStore } from '@/features/auth/authStore';
import { useShallow } from 'zustand/react/shallow';
import { CheckoutTrustPanel } from '@/features/checkout/CheckoutTrustPanel';
import { apiClient } from '@/shared/lib/apiClient';
import { dictionaryFormat } from '@/shared/lib/dictionaryFormat';
import { productAnalyticsTrack } from '@/shared/lib/productAnalytics';
import { formatDate } from '@project/backend/shared/lib/formatDate';

type SubscriptionPlan = {
  stripePriceId: string;
  name: string;
  description: string | null;
  currency: string;
  unitAmount: number;
  interval: 'day' | 'week' | 'month' | 'year';
  intervalCount: number;
  marketingFeatures: Array<{ name: string }>;
  unitLabel: string | null;
  active: boolean;
  packageType:
    | 'monthly_subscription'
    | 'annual_subscription'
    | 'course_purchase'
    | 'course_bundle'
    | 'ai_credit_pack'
    | 'selected_lifetime_course_access';
  savingsPercent: number | null;
  recommended: boolean;
  comparisonGroup: string | null;
};

export function SubscriptionCard({
  subscriptionPlan,
}: {
  subscriptionPlan: SubscriptionPlan;
}) {
  const {
    currentSubscription,
    currentMember,
    dictionary,
    hasPermission,
    locale,
  } = useAuthStore(
    useShallow((state) => ({
      currentSubscription: state.currentSubscription,
      currentMember: state.currentMember,
      dictionary: state.dictionary,
      hasPermission: state.hasPermission,
      locale: state.locale,
    })),
  );

  const hasPermissionToEdit = hasPermission({
    subscription: ['update'],
  });
  const isSubscriptionUser =
    !currentSubscription ||
    currentSubscription?.userId === currentMember?.userId;

  const isCurrentPlan =
    currentSubscription?.stripePriceId === subscriptionPlan.stripePriceId;

  const checkoutMutation = useMutation({
    mutationFn: async () => {
      return await apiClient
        .post('api/subscription/checkout', {
          json: {
            stripePriceId: subscriptionPlan.stripePriceId!,
            pricingPackageId: `subscription:${subscriptionPlan.stripePriceId}`,
            packageType: subscriptionPlan.packageType,
          },
        })
        .json<{ url: string }>();
    },
    onSuccess: async (response) => {
      window.location.href = response.url;
    },
    onError: (error: any) => {
      toast.error(error.message || dictionary.shared.errors.unknown);
    },
  });

  const portalMutation = useMutation({
    mutationFn: async () => {
      return await apiClient
        .post('api/subscription/portal')
        .json<{ url: string }>();
    },
    onSuccess: async (response) => {
      window.location.href = response.url;
    },
    onError: (error: any) => {
      toast.error(error.message || dictionary.shared.errors.unknown);
    },
  });

  const formattedPrice = new Intl.NumberFormat(locale || undefined, {
    style: 'currency',
    currency: subscriptionPlan.currency.toUpperCase(),
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(subscriptionPlan.unitAmount / 100);

  const intervalUnit =
    subscriptionPlan.intervalCount === 1
      ? dictionary.subscription.intervalUnits[subscriptionPlan.interval]
      : dictionary.subscription.intervalUnitsPlural[subscriptionPlan.interval];
  const intervalLabel =
    subscriptionPlan.intervalCount === 1
      ? intervalUnit
      : dictionaryFormat(
          dictionary.subscription.intervalCountLabel,
          subscriptionPlan.intervalCount,
          intervalUnit,
        );
  const intervalText = dictionaryFormat(
    dictionary.subscription.priceInterval,
    intervalLabel,
  );

  const buttonState = isCurrentPlan
    ? 'manage'
    : !currentSubscription
      ? 'payment'
      : 'none';

  return (
    <Card
      className={`nex-glass-card flex h-full min-w-80 flex-col rounded-3xl border-white/70 p-0 dark:border-white/10 ${
        isCurrentPlan ? 'border-primary/60 shadow-[var(--nexexam-glow)]' : ''
      }`}
    >
      <CardHeader className="text-center">
        <div className="mb-2 flex items-center justify-center gap-2">
          <CardTitle className="text-2xl">{subscriptionPlan.name}</CardTitle>
          {isCurrentPlan && (
            <Badge variant="default" className="gap-1">
              <LuCrown className="h-3 w-3" />
              {dictionary.subscription.current}
            </Badge>
          )}
          {!isCurrentPlan && subscriptionPlan.recommended && (
            <Badge className="bg-nexexam-accent text-nexexam-primary hover:bg-nexexam-accent gap-1">
              <LuSparkles className="h-3 w-3" />
              {dictionary.pricing.recommended}
            </Badge>
          )}
        </div>
        {subscriptionPlan.description && (
          <CardDescription className="text-base">
            {subscriptionPlan.description}
          </CardDescription>
        )}
      </CardHeader>

      <CardContent className="flex-1 space-y-6 p-0">
        <div className="px-6 text-center">
          <div className="flex items-baseline justify-center gap-1">
            <span className="text-5xl font-bold tracking-tight">
              {formattedPrice}
            </span>
            <span className="text-muted-foreground text-lg font-normal">
              {intervalText}
            </span>
          </div>
          {subscriptionPlan.savingsPercent ? (
            <Badge className="bg-primary/10 text-primary hover:bg-primary/10 mt-3 rounded-xl">
              {dictionary.pricing.savingsBadge.replace(
                '{0}',
                String(subscriptionPlan.savingsPercent),
              )}
            </Badge>
          ) : null}
        </div>

        {buttonState === 'manage' && currentSubscription?.cancelAt ? (
          <div className="bg-destructive/80 w-full py-1 text-center text-sm text-white">
            {dictionary.subscription.cancelAt}{' '}
            <strong>
              {formatDate(currentSubscription.cancelAt, dictionary)}
            </strong>
          </div>
        ) : (
          <div className="px-6">
            <Separator />
          </div>
        )}

        {subscriptionPlan.marketingFeatures.length > 0 && (
          <div className="px-6">
            <Badge className="bg-primary/10 text-primary hover:bg-primary/10 rounded-xl">
              <LuSparkles className="size-3.5" />
              {dictionary.subscription.value.cardUnlockLabel}
            </Badge>
          </div>
        )}

        {subscriptionPlan.marketingFeatures.length > 0 && (
          <ul className="space-y-3 px-6">
            {subscriptionPlan.marketingFeatures.map((feature, index) => (
              <li key={index} className="flex items-start gap-3">
                <LuCircleCheck className="text-primary mt-0.5 h-5 w-5 shrink-0" />
                <span className="text-sm">{feature.name}</span>
              </li>
            ))}
          </ul>
        )}

        {buttonState === 'payment' && (
          <div className="px-6">
            <CheckoutTrustPanel
              variant="subscription"
              priceLabel={formattedPrice}
              intervalLabel={intervalLabel}
              compact
            />
          </div>
        )}
      </CardContent>

      <CardFooter className="flex-col items-stretch gap-2 pt-0">
        {buttonState === 'manage' && !isSubscriptionUser && (
          <TooltipProvider delay={0}>
            <Tooltip>
              <TooltipTrigger render={<span className="w-full" />}>
                <Button type="button" className="w-full" disabled={true}>
                  {dictionary.subscription.manage}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                {dictionary.subscription.notPlanUser}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}

        {buttonState === 'manage' && isSubscriptionUser && (
          <>
            <Button
              type="button"
              className="w-full"
              disabled={!hasPermissionToEdit || portalMutation.isPending}
              onClick={() => portalMutation.mutateAsync()}
            >
              {dictionary.subscription.manage}
            </Button>
          </>
        )}

        {buttonState === 'payment' && (
          <Button
            type="button"
            className="w-full"
            variant={isCurrentPlan ? 'default' : 'default'}
            disabled={
              !hasPermissionToEdit ||
              checkoutMutation.isPending ||
              !isSubscriptionUser
            }
            onClick={() => {
              productAnalyticsTrack({
                eventName: 'cta_click',
                stripePriceId: subscriptionPlan.stripePriceId,
                ctaLocation: 'subscription_plan_card',
                funnelId: `subscription:${subscriptionPlan.stripePriceId}`,
                metadata: {
                  purchaseType: 'subscription',
                  packageType: subscriptionPlan.packageType,
                  pricingPackageId: `subscription:${subscriptionPlan.stripePriceId}`,
                  planInterval: subscriptionPlan.interval,
                  intervalCount: subscriptionPlan.intervalCount,
                  priceCents: subscriptionPlan.unitAmount,
                  currency: subscriptionPlan.currency,
                  checkoutTrustShown: true,
                  renewalTermsShown: true,
                  localPaymentMethodsShown: true,
                },
              });
              void checkoutMutation.mutateAsync();
            }}
          >
            {dictionary.subscription.subscribe}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
