import { createRoute, redirect } from '@tanstack/react-router';
import { authenticatedRoute } from '@/features/auth/authRouter';
import { authGuardFrontend } from '@/features/auth/authGuardFrontend';
import { useAuthStore } from '@/features/auth/authStore';
import { dashboardPersonaSet } from '@/features/dashboard/dashboardHome';
import { platformAdminBeforeLoad } from '@/features/platformAdmin/platformAdminRouter';
import { buildPageTitle } from '@/shared/lib/buildPageTitle';

// Creator gate mirroring features/course/courseRouter.ts: re-fetch the current
// user if `isCreator` is stale, then redirect to the application page if they
// still aren't a vetted creator.
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

// Instructor: set recurring availability + define bookable session types.
export const oneOnOneAvailabilityRoute = createRoute({
  getParentRoute: () => authenticatedRoute,
  path: '/creator/availability',
  head: () => ({
    meta: [
      {
        title: buildPageTitle(
          useAuthStore.getState().dictionary.oneOnOneCall.availability.title,
        ),
      },
    ],
  }),
  beforeLoad: async ({ location }) => {
    await ensureCreatorAccess(location.pathname);
  },
}).lazy(() =>
  import('./pages/OneOnOneAvailabilityPage').then(
    (d) => d.oneOnOneAvailabilityLazyRoute,
  ),
);

// Student / instructor: upcoming & past 1:1 sessions.
export const mySessionsRoute = createRoute({
  getParentRoute: () => authenticatedRoute,
  path: '/sessions',
  head: () => ({
    meta: [
      {
        title: buildPageTitle(
          useAuthStore.getState().dictionary.oneOnOneCall.session.title,
        ),
      },
    ],
  }),
  beforeLoad: async ({ location }) => {
    const { currentUser, currentMember } = useAuthStore.getState();
    authGuardFrontend(
      { currentUser, currentMember },
      undefined,
      location.pathname,
    );
  },
}).lazy(() =>
  import('./pages/MySessionsPage').then((d) => d.mySessionsLazyRoute),
);

// Platform-admin dispute review console. Backend is the authoritative gate
// (`authGuardPlatformAdminBackend`); this frontend route reuses the same
// `platformAdminBeforeLoad` redirect rule as the rest of the admin surface.
export const adminDisputesRoute = createRoute({
  getParentRoute: () => authenticatedRoute,
  path: '/platform-admin/one-on-one-disputes',
  head: () => ({
    meta: [
      {
        title: buildPageTitle(
          useAuthStore.getState().dictionary.oneOnOneCall.dispute.admin.title,
        ),
      },
    ],
  }),
  beforeLoad: platformAdminBeforeLoad,
}).lazy(() =>
  import('./pages/AdminDisputesPage').then((d) => d.adminDisputesLazyRoute),
);

export const oneOnOneCallRouter = [
  oneOnOneAvailabilityRoute,
  mySessionsRoute,
  adminDisputesRoute,
];
