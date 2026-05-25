import { authGuardFrontend } from '@/features/auth/authGuardFrontend';
import { authenticatedRoute } from '@/features/auth/authRouter';
import { useAuthStore } from '@/features/auth/authStore';
import { buildPageTitle } from '@/shared/lib/buildPageTitle';
import { createRoute } from '@tanstack/react-router';

export const dailyGoalListRoute = createRoute({
  getParentRoute: () => authenticatedRoute,
  path: '/daily-goal',
  head: () => ({
    meta: [
      {
        title: buildPageTitle(
          useAuthStore.getState().dictionary.dailyGoal.list.title,
        ),
      },
    ],
  }),
  beforeLoad: async ({ location }) => {
    const { currentUser, currentMember } = useAuthStore.getState();
    authGuardFrontend(
      { currentUser, currentMember },
      {
        dailyGoal: ['read'],
      },
      location.pathname,
    );
  },
}).lazy(() =>
  import('./pages/DailyGoalListPage').then((d) => d.dailyGoalListLazyRoute),
);

export const dailyGoalNewRoute = createRoute({
  getParentRoute: () => authenticatedRoute,
  path: '/daily-goal/new',
  head: () => ({
    meta: [
      {
        title: buildPageTitle(
          useAuthStore.getState().dictionary.dailyGoal.new.title,
        ),
      },
    ],
  }),
  beforeLoad: async ({ location }) => {
    const { currentUser, currentMember } = useAuthStore.getState();
    authGuardFrontend(
      { currentUser, currentMember },
      {
        dailyGoal: ['create'],
      },
      location.pathname,
    );
  },
}).lazy(() =>
  import('./pages/DailyGoalNewPage').then((d) => d.dailyGoalNewLazyRoute),
);

export const dailyGoalEditRoute = createRoute({
  getParentRoute: () => authenticatedRoute,
  path: '/daily-goal/$id/edit',
  head: () => ({
    meta: [
      {
        title: buildPageTitle(
          useAuthStore.getState().dictionary.dailyGoal.edit.title,
        ),
      },
    ],
  }),
  beforeLoad: async ({ location }) => {
    const { currentUser, currentMember } = useAuthStore.getState();
    authGuardFrontend(
      { currentUser, currentMember },
      {
        dailyGoal: ['update'],
      },
      location.pathname,
    );
  },
}).lazy(() =>
  import('./pages/DailyGoalEditPage').then((d) => d.dailyGoalEditLazyRoute),
);

export const dailyGoalViewRoute = createRoute({
  getParentRoute: () => authenticatedRoute,
  path: '/daily-goal/$id',
  head: () => ({
    meta: [
      {
        title: buildPageTitle(
          useAuthStore.getState().dictionary.dailyGoal.view.title,
        ),
      },
    ],
  }),
  beforeLoad: async ({ location }) => {
    const { currentUser, currentMember } = useAuthStore.getState();
    authGuardFrontend(
      { currentUser, currentMember },
      {
        dailyGoal: ['read'],
      },
      location.pathname,
    );
  },
}).lazy(() =>
  import('./pages/DailyGoalViewPage').then((d) => d.dailyGoalViewLazyRoute),
);

export const dailyGoalImporterRoute = createRoute({
  getParentRoute: () => authenticatedRoute,
  path: '/daily-goal/importer',
  head: () => ({
    meta: [
      {
        title: buildPageTitle(
          useAuthStore.getState().dictionary.dailyGoal.importer.title,
        ),
      },
    ],
  }),
  beforeLoad: async ({ location }) => {
    const { currentUser, currentMember } = useAuthStore.getState();
    authGuardFrontend(
      { currentUser, currentMember },
      {
        dailyGoal: ['import'],
      },
      location.pathname,
    );
  },
}).lazy(() =>
  import('./pages/DailyGoalImporterPage').then(
    (d) => d.dailyGoalImporterLazyRoute,
  ),
);

export const dailyGoalRouter = [
  dailyGoalListRoute,
  dailyGoalNewRoute,
  dailyGoalEditRoute,
  dailyGoalViewRoute,
  dailyGoalImporterRoute,
];
