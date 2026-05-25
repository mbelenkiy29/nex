import { createRoute, redirect } from '@tanstack/react-router';
import { buildPageTitle } from '@/shared/lib/buildPageTitle';
import { authenticatedRoute } from '@/features/auth/authRouter';
import { useAuthStore } from '@/features/auth/authStore';
import { authGuardFrontend } from '@/features/auth/authGuardFrontend';

export const subscriptionRoute = createRoute({
  getParentRoute: () => authenticatedRoute,
  path: '/subscription',
  head: () => ({
    meta: [
      {
        title: buildPageTitle(
          useAuthStore.getState().dictionary.subscription.title,
        ),
      },
    ],
  }),
  beforeLoad: async ({ location }) => {
    const { currentUser, currentMember, config } = useAuthStore.getState();

    if (config?.subscriptionMode === 'disabled') {
      throw redirect({ to: '/' });
    }

    authGuardFrontend(
      { currentUser, currentMember },
      {
        subscription: ['read'],
      },
      location.pathname,
    );
  },
}).lazy(() =>
  import('./pages/SubscriptionPage').then((d) => d.subscriptionLazyRoute),
);

export const subscriptionRouter = [subscriptionRoute];
