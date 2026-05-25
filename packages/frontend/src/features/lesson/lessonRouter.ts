import { authGuardFrontend } from '@/features/auth/authGuardFrontend';
import { authenticatedRoute } from '@/features/auth/authRouter';
import { useAuthStore } from '@/features/auth/authStore';
import { buildPageTitle } from '@/shared/lib/buildPageTitle';
import { createRoute } from '@tanstack/react-router';

export const lessonListRoute = createRoute({
  getParentRoute: () => authenticatedRoute,
  path: '/lesson',
  head: () => ({
    meta: [
      {
        title: buildPageTitle(
          useAuthStore.getState().dictionary.lesson.list.title,
        ),
      },
    ],
  }),
  beforeLoad: async ({ location }) => {
    const { currentUser, currentMember } = useAuthStore.getState();
    authGuardFrontend(
      { currentUser, currentMember },
      {
        lesson: ['read'],
      },
      location.pathname,
    );
  },
}).lazy(() =>
  import('./pages/LessonListPage').then((d) => d.lessonListLazyRoute),
);

export const lessonNewRoute = createRoute({
  getParentRoute: () => authenticatedRoute,
  path: '/lesson/new',
  head: () => ({
    meta: [
      {
        title: buildPageTitle(
          useAuthStore.getState().dictionary.lesson.new.title,
        ),
      },
    ],
  }),
  beforeLoad: async ({ location }) => {
    const { currentUser, currentMember } = useAuthStore.getState();
    authGuardFrontend(
      { currentUser, currentMember },
      {
        lesson: ['create'],
      },
      location.pathname,
    );
  },
}).lazy(() =>
  import('./pages/LessonNewPage').then((d) => d.lessonNewLazyRoute),
);

export const lessonEditRoute = createRoute({
  getParentRoute: () => authenticatedRoute,
  path: '/lesson/$id/edit',
  head: () => ({
    meta: [
      {
        title: buildPageTitle(
          useAuthStore.getState().dictionary.lesson.edit.title,
        ),
      },
    ],
  }),
  beforeLoad: async ({ location }) => {
    const { currentUser, currentMember } = useAuthStore.getState();
    authGuardFrontend(
      { currentUser, currentMember },
      {
        lesson: ['update'],
      },
      location.pathname,
    );
  },
}).lazy(() =>
  import('./pages/LessonEditPage').then((d) => d.lessonEditLazyRoute),
);

export const lessonViewRoute = createRoute({
  getParentRoute: () => authenticatedRoute,
  path: '/lesson/$id',
  head: () => ({
    meta: [
      {
        title: buildPageTitle(
          useAuthStore.getState().dictionary.lesson.view.title,
        ),
      },
    ],
  }),
  beforeLoad: async ({ location }) => {
    const { currentUser, currentMember } = useAuthStore.getState();
    authGuardFrontend(
      { currentUser, currentMember },
      {
        lesson: ['read'],
      },
      location.pathname,
    );
  },
}).lazy(() =>
  import('./pages/LessonViewPage').then((d) => d.lessonViewLazyRoute),
);

export const lessonImporterRoute = createRoute({
  getParentRoute: () => authenticatedRoute,
  path: '/lesson/importer',
  head: () => ({
    meta: [
      {
        title: buildPageTitle(
          useAuthStore.getState().dictionary.lesson.importer.title,
        ),
      },
    ],
  }),
  beforeLoad: async ({ location }) => {
    const { currentUser, currentMember } = useAuthStore.getState();
    authGuardFrontend(
      { currentUser, currentMember },
      {
        lesson: ['import'],
      },
      location.pathname,
    );
  },
}).lazy(() =>
  import('./pages/LessonImporterPage').then((d) => d.lessonImporterLazyRoute),
);

export const lessonRouter = [
  lessonListRoute,
  lessonNewRoute,
  lessonEditRoute,
  lessonViewRoute,
  lessonImporterRoute,
];
