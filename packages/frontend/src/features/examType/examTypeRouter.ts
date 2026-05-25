import { authGuardFrontend } from '@/features/auth/authGuardFrontend';
import { authenticatedRoute } from '@/features/auth/authRouter';
import { useAuthStore } from '@/features/auth/authStore';
import { buildPageTitle } from '@/shared/lib/buildPageTitle';
import { createRoute } from '@tanstack/react-router';

export const examTypeListRoute = createRoute({
  getParentRoute: () => authenticatedRoute,
  path: '/exam-type',
  head: () => ({
    meta: [
      {
        title: buildPageTitle(
          useAuthStore.getState().dictionary.examType.list.title,
        ),
      },
    ],
  }),
  beforeLoad: async ({ location }) => {
    const { currentUser, currentMember } = useAuthStore.getState();
    authGuardFrontend(
      { currentUser, currentMember },
      {
        examType: ['read'],
      },
      location.pathname,
    );
  },
}).lazy(() =>
  import('./pages/ExamTypeListPage').then((d) => d.examTypeListLazyRoute),
);

export const examTypeNewRoute = createRoute({
  getParentRoute: () => authenticatedRoute,
  path: '/exam-type/new',
  head: () => ({
    meta: [
      {
        title: buildPageTitle(
          useAuthStore.getState().dictionary.examType.new.title,
        ),
      },
    ],
  }),
  beforeLoad: async ({ location }) => {
    const { currentUser, currentMember } = useAuthStore.getState();
    authGuardFrontend(
      { currentUser, currentMember },
      {
        examType: ['create'],
      },
      location.pathname,
    );
  },
}).lazy(() =>
  import('./pages/ExamTypeNewPage').then((d) => d.examTypeNewLazyRoute),
);

export const examTypeEditRoute = createRoute({
  getParentRoute: () => authenticatedRoute,
  path: '/exam-type/$id/edit',
  head: () => ({
    meta: [
      {
        title: buildPageTitle(
          useAuthStore.getState().dictionary.examType.edit.title,
        ),
      },
    ],
  }),
  beforeLoad: async ({ location }) => {
    const { currentUser, currentMember } = useAuthStore.getState();
    authGuardFrontend(
      { currentUser, currentMember },
      {
        examType: ['update'],
      },
      location.pathname,
    );
  },
}).lazy(() =>
  import('./pages/ExamTypeEditPage').then((d) => d.examTypeEditLazyRoute),
);

export const examTypeViewRoute = createRoute({
  getParentRoute: () => authenticatedRoute,
  path: '/exam-type/$id',
  head: () => ({
    meta: [
      {
        title: buildPageTitle(
          useAuthStore.getState().dictionary.examType.view.title,
        ),
      },
    ],
  }),
  beforeLoad: async ({ location }) => {
    const { currentUser, currentMember } = useAuthStore.getState();
    authGuardFrontend(
      { currentUser, currentMember },
      {
        examType: ['read'],
      },
      location.pathname,
    );
  },
}).lazy(() =>
  import('./pages/ExamTypeViewPage').then((d) => d.examTypeViewLazyRoute),
);

export const examTypeImporterRoute = createRoute({
  getParentRoute: () => authenticatedRoute,
  path: '/exam-type/importer',
  head: () => ({
    meta: [
      {
        title: buildPageTitle(
          useAuthStore.getState().dictionary.examType.importer.title,
        ),
      },
    ],
  }),
  beforeLoad: async ({ location }) => {
    const { currentUser, currentMember } = useAuthStore.getState();
    authGuardFrontend(
      { currentUser, currentMember },
      {
        examType: ['import'],
      },
      location.pathname,
    );
  },
}).lazy(() =>
  import('./pages/ExamTypeImporterPage').then(
    (d) => d.examTypeImporterLazyRoute,
  ),
);

export const examTypeRouter = [
  examTypeListRoute,
  examTypeNewRoute,
  examTypeEditRoute,
  examTypeViewRoute,
  examTypeImporterRoute,
];
