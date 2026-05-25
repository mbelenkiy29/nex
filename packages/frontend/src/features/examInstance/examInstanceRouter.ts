import { authGuardFrontend } from '@/features/auth/authGuardFrontend';
import { authenticatedRoute } from '@/features/auth/authRouter';
import { useAuthStore } from '@/features/auth/authStore';
import { buildPageTitle } from '@/shared/lib/buildPageTitle';
import { createRoute } from '@tanstack/react-router';

export const examInstanceListRoute = createRoute({
  getParentRoute: () => authenticatedRoute,
  path: '/exam-instance',
  head: () => ({
    meta: [
      {
        title: buildPageTitle(
          useAuthStore.getState().dictionary.examInstance.list.title,
        ),
      },
    ],
  }),
  beforeLoad: async ({ location }) => {
    const { currentUser, currentMember } = useAuthStore.getState();
    authGuardFrontend(
      { currentUser, currentMember },
      {
        examInstance: ['read'],
      },
      location.pathname,
    );
  },
}).lazy(() =>
  import('./pages/ExamInstanceListPage').then(
    (d) => d.examInstanceListLazyRoute,
  ),
);

export const examInstanceNewRoute = createRoute({
  getParentRoute: () => authenticatedRoute,
  path: '/exam-instance/new',
  head: () => ({
    meta: [
      {
        title: buildPageTitle(
          useAuthStore.getState().dictionary.examInstance.new.title,
        ),
      },
    ],
  }),
  beforeLoad: async ({ location }) => {
    const { currentUser, currentMember } = useAuthStore.getState();
    authGuardFrontend(
      { currentUser, currentMember },
      {
        examInstance: ['create'],
      },
      location.pathname,
    );
  },
}).lazy(() =>
  import('./pages/ExamInstanceNewPage').then((d) => d.examInstanceNewLazyRoute),
);

export const examInstanceEditRoute = createRoute({
  getParentRoute: () => authenticatedRoute,
  path: '/exam-instance/$id/edit',
  head: () => ({
    meta: [
      {
        title: buildPageTitle(
          useAuthStore.getState().dictionary.examInstance.edit.title,
        ),
      },
    ],
  }),
  beforeLoad: async ({ location }) => {
    const { currentUser, currentMember } = useAuthStore.getState();
    authGuardFrontend(
      { currentUser, currentMember },
      {
        examInstance: ['update'],
      },
      location.pathname,
    );
  },
}).lazy(() =>
  import('./pages/ExamInstanceEditPage').then(
    (d) => d.examInstanceEditLazyRoute,
  ),
);

export const examInstanceViewRoute = createRoute({
  getParentRoute: () => authenticatedRoute,
  path: '/exam-instance/$id',
  head: () => ({
    meta: [
      {
        title: buildPageTitle(
          useAuthStore.getState().dictionary.examInstance.view.title,
        ),
      },
    ],
  }),
  beforeLoad: async ({ location }) => {
    const { currentUser, currentMember } = useAuthStore.getState();
    authGuardFrontend(
      { currentUser, currentMember },
      {
        examInstance: ['read'],
      },
      location.pathname,
    );
  },
}).lazy(() =>
  import('./pages/ExamInstanceViewPage').then(
    (d) => d.examInstanceViewLazyRoute,
  ),
);

export const examInstanceImporterRoute = createRoute({
  getParentRoute: () => authenticatedRoute,
  path: '/exam-instance/importer',
  head: () => ({
    meta: [
      {
        title: buildPageTitle(
          useAuthStore.getState().dictionary.examInstance.importer.title,
        ),
      },
    ],
  }),
  beforeLoad: async ({ location }) => {
    const { currentUser, currentMember } = useAuthStore.getState();
    authGuardFrontend(
      { currentUser, currentMember },
      {
        examInstance: ['import'],
      },
      location.pathname,
    );
  },
}).lazy(() =>
  import('./pages/ExamInstanceImporterPage').then(
    (d) => d.examInstanceImporterLazyRoute,
  ),
);

export const examInstanceRouter = [
  examInstanceListRoute,
  examInstanceNewRoute,
  examInstanceEditRoute,
  examInstanceViewRoute,
  examInstanceImporterRoute,
];
