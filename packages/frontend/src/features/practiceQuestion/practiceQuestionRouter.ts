import { authGuardFrontend } from '@/features/auth/authGuardFrontend';
import { authenticatedRoute } from '@/features/auth/authRouter';
import { useAuthStore } from '@/features/auth/authStore';
import { buildPageTitle } from '@/shared/lib/buildPageTitle';
import { createRoute } from '@tanstack/react-router';

export const practiceQuestionListRoute = createRoute({
  getParentRoute: () => authenticatedRoute,
  path: '/practice-question',
  head: () => ({
    meta: [
      {
        title: buildPageTitle(
          useAuthStore.getState().dictionary.practiceQuestion.list.title,
        ),
      },
    ],
  }),
  beforeLoad: async ({ location }) => {
    const { currentUser, currentMember } = useAuthStore.getState();
    authGuardFrontend(
      { currentUser, currentMember },
      {
        practiceQuestion: ['read'],
      },
      location.pathname,
    );
  },
}).lazy(() =>
  import('./pages/PracticeQuestionListPage').then(
    (d) => d.practiceQuestionListLazyRoute,
  ),
);

export const practiceQuestionNewRoute = createRoute({
  getParentRoute: () => authenticatedRoute,
  path: '/practice-question/new',
  head: () => ({
    meta: [
      {
        title: buildPageTitle(
          useAuthStore.getState().dictionary.practiceQuestion.new.title,
        ),
      },
    ],
  }),
  beforeLoad: async ({ location }) => {
    const { currentUser, currentMember } = useAuthStore.getState();
    authGuardFrontend(
      { currentUser, currentMember },
      {
        practiceQuestion: ['create'],
      },
      location.pathname,
    );
  },
}).lazy(() =>
  import('./pages/PracticeQuestionNewPage').then(
    (d) => d.practiceQuestionNewLazyRoute,
  ),
);

export const practiceQuestionEditRoute = createRoute({
  getParentRoute: () => authenticatedRoute,
  path: '/practice-question/$id/edit',
  head: () => ({
    meta: [
      {
        title: buildPageTitle(
          useAuthStore.getState().dictionary.practiceQuestion.edit.title,
        ),
      },
    ],
  }),
  beforeLoad: async ({ location }) => {
    const { currentUser, currentMember } = useAuthStore.getState();
    authGuardFrontend(
      { currentUser, currentMember },
      {
        practiceQuestion: ['update'],
      },
      location.pathname,
    );
  },
}).lazy(() =>
  import('./pages/PracticeQuestionEditPage').then(
    (d) => d.practiceQuestionEditLazyRoute,
  ),
);

export const practiceQuestionViewRoute = createRoute({
  getParentRoute: () => authenticatedRoute,
  path: '/practice-question/$id',
  head: () => ({
    meta: [
      {
        title: buildPageTitle(
          useAuthStore.getState().dictionary.practiceQuestion.view.title,
        ),
      },
    ],
  }),
  beforeLoad: async ({ location }) => {
    const { currentUser, currentMember } = useAuthStore.getState();
    authGuardFrontend(
      { currentUser, currentMember },
      {
        practiceQuestion: ['read'],
      },
      location.pathname,
    );
  },
}).lazy(() =>
  import('./pages/PracticeQuestionViewPage').then(
    (d) => d.practiceQuestionViewLazyRoute,
  ),
);

export const practiceQuestionImporterRoute = createRoute({
  getParentRoute: () => authenticatedRoute,
  path: '/practice-question/importer',
  head: () => ({
    meta: [
      {
        title: buildPageTitle(
          useAuthStore.getState().dictionary.practiceQuestion.importer.title,
        ),
      },
    ],
  }),
  beforeLoad: async ({ location }) => {
    const { currentUser, currentMember } = useAuthStore.getState();
    authGuardFrontend(
      { currentUser, currentMember },
      {
        practiceQuestion: ['import'],
      },
      location.pathname,
    );
  },
}).lazy(() =>
  import('./pages/PracticeQuestionImporterPage').then(
    (d) => d.practiceQuestionImporterLazyRoute,
  ),
);

export const practiceQuestionRouter = [
  practiceQuestionListRoute,
  practiceQuestionNewRoute,
  practiceQuestionEditRoute,
  practiceQuestionViewRoute,
  practiceQuestionImporterRoute,
];
