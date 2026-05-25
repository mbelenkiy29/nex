import { createRoute, redirect } from '@tanstack/react-router';
import { authenticatedRoute } from '@/features/auth/authRouter';
import { authGuardFrontend } from '@/features/auth/authGuardFrontend';
import { useAuthStore } from '@/features/auth/authStore';
import { dashboardPersonaSet } from '@/features/dashboard/dashboardHome';
import { buildPageTitle } from '@/shared/lib/buildPageTitle';

// Same creator gate used by /creator/availability and /creator/courses.
// Refetches the current user if `isCreator` is stale, then redirects to the
// creator application screen if they still aren't a vetted creator.
async function ensureCreatorAccess(pathname: string) {
  const state = useAuthStore.getState();
  authGuardFrontend(
    { currentUser: state.currentUser, currentMember: state.currentMember },
    undefined,
    pathname,
  );
  let { isCreator } = useAuthStore.getState();
  if (!isCreator) {
    await useAuthStore.getState().fetchCurrentUser();
    isCreator = useAuthStore.getState().isCreator;
  }
  if (!isCreator) {
    throw redirect({ to: '/creator-application' });
  }
  dashboardPersonaSet('creator');
}

export const myEarningsRoute = createRoute({
  getParentRoute: () => authenticatedRoute,
  path: '/creator/earnings',
  head: () => ({
    meta: [
      {
        title: buildPageTitle(
          useAuthStore.getState().dictionary.creatorEarnings.title,
        ),
      },
    ],
  }),
  beforeLoad: async ({ location }) => {
    await ensureCreatorAccess(location.pathname);
  },
}).lazy(() =>
  import('./pages/MyEarningsPage').then((d) => d.myEarningsLazyRoute),
);

export const creatorEarningsRouter = [myEarningsRoute];
