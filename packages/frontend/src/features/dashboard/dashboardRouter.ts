import { createRoute, redirect } from '@tanstack/react-router';
import { buildPageTitle } from '@/shared/lib/buildPageTitle';
import { authenticatedRoute } from '@/features/auth/authRouter';
import { useAuthStore } from '@/features/auth/authStore';
import { authGuardFrontend } from '@/features/auth/authGuardFrontend';
import {
  dashboardHomePath,
  dashboardPersonaGet,
  dashboardPersonaSet,
} from '@/features/dashboard/dashboardHome';

export const dashboardRoute = createRoute({
  getParentRoute: () => authenticatedRoute,
  path: '/',
  beforeLoad: async ({ location }) => {
    const { currentUser, currentMember, isPlatformAdmin, isCreator } =
      useAuthStore.getState();
    if (currentUser && isPlatformAdmin) {
      // Honor the persona the admin chose via SuperAdminViewSwitcher. No
      // stored persona → /admin (admin's natural starting surface).
      const persona = dashboardPersonaGet();
      throw redirect({
        to: dashboardHomePath({ isPlatformAdmin: true, persona }),
      });
    }

    authGuardFrontend(
      { currentUser, currentMember },
      undefined,
      location.pathname,
    );

    if (isCreator) {
      dashboardPersonaSet('creator');
      throw redirect({ to: '/creator' });
    }

    dashboardPersonaSet('student');
    throw redirect({ to: '/student' });
  },
});

export const studentDashboardRoute = createRoute({
  getParentRoute: () => authenticatedRoute,
  path: '/student',
  head: () => ({
    meta: [
      {
        title: buildPageTitle(
          useAuthStore.getState().dictionary.dashboard.student.menu,
        ),
      },
    ],
  }),
  beforeLoad: async ({ location }) => {
    const { currentUser, currentMember, isPlatformAdmin, isCreator } =
      useAuthStore.getState();
    if (currentUser && isPlatformAdmin) {
      dashboardPersonaSet('student');
      return;
    }

    authGuardFrontend(
      { currentUser, currentMember },
      undefined,
      location.pathname,
    );

    // Teachers (users with a creator application) cannot view the student
    // dashboard; send them to their own dashboard instead.
    if (isCreator) {
      throw redirect({ to: '/creator' });
    }

    dashboardPersonaSet('student');
  },
}).lazy(() =>
  import('@/features/studentExperience/pages/StudentDashboardPage').then(
    (d) => d.studentDashboardLazyRoute,
  ),
);

export const creatorDashboardRoute = createRoute({
  getParentRoute: () => authenticatedRoute,
  path: '/creator',
  head: () => ({
    meta: [
      {
        title: buildPageTitle(
          useAuthStore.getState().dictionary.dashboard.creator.menu,
        ),
      },
    ],
  }),
  beforeLoad: async ({ location }) => {
    const { currentUser, currentMember, isPlatformAdmin } =
      useAuthStore.getState();
    if (currentUser && isPlatformAdmin) {
      dashboardPersonaSet('creator');
      return;
    }

    authGuardFrontend(
      { currentUser, currentMember },
      undefined,
      location.pathname,
    );

    // Only teachers (users with a creator application) may view the creator
    // dashboard. Re-fetch once in case the flag is stale (e.g. the user just
    // submitted an application this session) before redirecting them away.
    let { isCreator } = useAuthStore.getState();
    if (!isCreator) {
      await useAuthStore.getState().fetchCurrentUser();
      isCreator = useAuthStore.getState().isCreator;
    }

    if (!isCreator) {
      throw redirect({ to: '/student' });
    }

    dashboardPersonaSet('creator');
  },
}).lazy(() =>
  import('./pages/CreatorDashboardPage').then(
    (d) => d.creatorDashboardLazyRoute,
  ),
);

export const dashboardRouter = [
  dashboardRoute,
  studentDashboardRoute,
  creatorDashboardRoute,
];
