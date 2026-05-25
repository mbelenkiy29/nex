import { authGuardFrontend } from '@/features/auth/authGuardFrontend';
import { authenticatedRoute } from '@/features/auth/authRouter';
import { useAuthStore } from '@/features/auth/authStore';
import { buildPageTitle } from '@/shared/lib/buildPageTitle';
import { createRoute } from '@tanstack/react-router';

export const examListRoute = createRoute({
  getParentRoute: () => authenticatedRoute,
  path: '/exam',
  head: () => ({
    meta: [
      {
        title: buildPageTitle(
          useAuthStore.getState().dictionary.exam.list.title,
        ),
      },
    ],
  }),
  beforeLoad: async ({ location }) => {
    const { currentUser, currentMember } = useAuthStore.getState();
    authGuardFrontend(
      { currentUser, currentMember },
      {
        exam: ['read'],
      },
      location.pathname,
    );
  },
}).lazy(() => import('./pages/ExamListPage').then((d) => d.examListLazyRoute));

export const examNewRoute = createRoute({
  getParentRoute: () => authenticatedRoute,
  path: '/exam/new',
  head: () => ({
    meta: [
      {
        title: buildPageTitle(
          useAuthStore.getState().dictionary.exam.new.title,
        ),
      },
    ],
  }),
  beforeLoad: async ({ location }) => {
    const { currentUser, currentMember } = useAuthStore.getState();
    authGuardFrontend(
      { currentUser, currentMember },
      {
        exam: ['create'],
      },
      location.pathname,
    );
  },
}).lazy(() => import('./pages/ExamNewPage').then((d) => d.examNewLazyRoute));

export const examEditRoute = createRoute({
  getParentRoute: () => authenticatedRoute,
  path: '/exam/$id/edit',
  head: () => ({
    meta: [
      {
        title: buildPageTitle(
          useAuthStore.getState().dictionary.exam.edit.title,
        ),
      },
    ],
  }),
  beforeLoad: async ({ location }) => {
    const { currentUser, currentMember } = useAuthStore.getState();
    authGuardFrontend(
      { currentUser, currentMember },
      {
        exam: ['update'],
      },
      location.pathname,
    );
  },
}).lazy(() => import('./pages/ExamEditPage').then((d) => d.examEditLazyRoute));

export const examViewRoute = createRoute({
  getParentRoute: () => authenticatedRoute,
  path: '/exam/$id',
  head: () => ({
    meta: [
      {
        title: buildPageTitle(
          useAuthStore.getState().dictionary.exam.view.title,
        ),
      },
    ],
  }),
  beforeLoad: async ({ location }) => {
    const { currentUser, currentMember } = useAuthStore.getState();
    authGuardFrontend(
      { currentUser, currentMember },
      {
        exam: ['read'],
      },
      location.pathname,
    );
  },
}).lazy(() => import('./pages/ExamViewPage').then((d) => d.examViewLazyRoute));

export const examImporterRoute = createRoute({
  getParentRoute: () => authenticatedRoute,
  path: '/exam/importer',
  head: () => ({
    meta: [
      {
        title: buildPageTitle(
          useAuthStore.getState().dictionary.exam.importer.title,
        ),
      },
    ],
  }),
  beforeLoad: async ({ location }) => {
    const { currentUser, currentMember } = useAuthStore.getState();
    authGuardFrontend(
      { currentUser, currentMember },
      {
        exam: ['import'],
      },
      location.pathname,
    );
  },
}).lazy(() =>
  import('./pages/ExamImporterPage').then((d) => d.examImporterLazyRoute),
);

export const examRouter = [
  examListRoute,
  examNewRoute,
  examEditRoute,
  examViewRoute,
  examImporterRoute,
];
