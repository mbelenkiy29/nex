import { useMutation } from '@tanstack/react-query';
import { LuCircleCheck, LuCrown } from 'react-icons/lu';
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
import { apiClient } from '@/shared/lib/apiClient';
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
};

export function SubscriptionCard({
  subscriptionPlan,
}: {
  subscriptionPlan: SubscriptionPlan;
}) {
  const { currentSubscription, currentMember, dictionary, hasPermission } =
    useAuthStore(
      useShallow((state) => ({
        currentSubscription: state.currentSubscription,
        currentMember: state.currentMember,
        dictionary: state.dictionary,
        hasPermission: state.hasPermission,
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
          json: { stripePriceId: subscriptionPlan.stripePriceId! },
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

  const formattedPrice = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: subscriptionPlan.currency.toUpperCase(),
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(subscriptionPlan.unitAmount / 100);

  const intervalText =
    subscriptionPlan.intervalCount === 1
      ? `/${subscriptionPlan.interval}`
      : `/${subscriptionPlan.intervalCount} ${subscriptionPlan.interval}s`;

  const buttonState = isCurrentPlan
    ? 'manage'
    : !currentSubscription
      ? 'payment'
      : 'none';

  return (
    <Card
      className={`flex h-full min-w-80 flex-col ${
        isCurrentPlan ? 'border-primary shadow-md' : ''
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
          <ul className="space-y-3 px-6">
            {subscriptionPlan.marketingFeatures.map((feature, index) => (
              <li key={index} className="flex items-start gap-3">
                <LuCircleCheck className="text-primary mt-0.5 h-5 w-5 shrink-0" />
                <span className="text-sm">{feature.name}</span>
              </li>
            ))}
          </ul>
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
            onClick={() => checkoutMutation.mutateAsync()}
          >
            {dictionary.subscription.subscribe}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
