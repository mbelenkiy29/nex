import { authGuardFrontend } from '@/features/auth/authGuardFrontend';
import { authenticatedRoute } from '@/features/auth/authRouter';
import { useAuthStore } from '@/features/auth/authStore';
import { buildPageTitle } from '@/shared/lib/buildPageTitle';
import { createRoute } from '@tanstack/react-router';

export const chapterListRoute = createRoute({
  getParentRoute: () => authenticatedRoute,
  path: '/chapter',
  head: () => ({
    meta: [
      {
        title: buildPageTitle(
          useAuthStore.getState().dictionary.chapter.list.title,
        ),
      },
    ],
  }),
  beforeLoad: async ({ location }) => {
    const { currentUser, currentMember } = useAuthStore.getState();
    authGuardFrontend(
      { currentUser, currentMember },
      {
        chapter: ['read'],
      },
      location.pathname,
    );
  },
}).lazy(() =>
  import('./pages/ChapterListPage').then((d) => d.chapterListLazyRoute),
);

export const chapterNewRoute = createRoute({
  getParentRoute: () => authenticatedRoute,
  path: '/chapter/new',
  head: () => ({
    meta: [
      {
        title: buildPageTitle(
          useAuthStore.getState().dictionary.chapter.new.title,
        ),
      },
    ],
  }),
  beforeLoad: async ({ location }) => {
    const { currentUser, currentMember } = useAuthStore.getState();
    authGuardFrontend(
      { currentUser, currentMember },
      {
        chapter: ['create'],
      },
      location.pathname,
    );
  },
}).lazy(() =>
  import('./pages/ChapterNewPage').then((d) => d.chapterNewLazyRoute),
);

export const chapterEditRoute = createRoute({
  getParentRoute: () => authenticatedRoute,
  path: '/chapter/$id/edit',
  head: () => ({
    meta: [
      {
        title: buildPageTitle(
          useAuthStore.getState().dictionary.chapter.edit.title,
        ),
      },
    ],
  }),
  beforeLoad: async ({ location }) => {
    const { currentUser, currentMember } = useAuthStore.getState();
    authGuardFrontend(
      { currentUser, currentMember },
      {
        chapter: ['update'],
      },
      location.pathname,
    );
  },
}).lazy(() =>
  import('./pages/ChapterEditPage').then((d) => d.chapterEditLazyRoute),
);

export const chapterViewRoute = createRoute({
  getParentRoute: () => authenticatedRoute,
  path: '/chapter/$id',
  head: () => ({
    meta: [
      {
        title: buildPageTitle(
          useAuthStore.getState().dictionary.chapter.view.title,
        ),
      },
    ],
  }),
  beforeLoad: async ({ location }) => {
    const { currentUser, currentMember } = useAuthStore.getState();
    authGuardFrontend(
      { currentUser, currentMember },
      {
        chapter: ['read'],
      },
      location.pathname,
    );
  },
}).lazy(() =>
  import('./pages/ChapterViewPage').then((d) => d.chapterViewLazyRoute),
);

export const chapterImporterRoute = createRoute({
  getParentRoute: () => authenticatedRoute,
  path: '/chapter/importer',
  head: () => ({
    meta: [
      {
        title: buildPageTitle(
          useAuthStore.getState().dictionary.chapter.importer.title,
        ),
      },
    ],
  }),
  beforeLoad: async ({ location }) => {
    const { currentUser, currentMember } = useAuthStore.getState();
    authGuardFrontend(
      { currentUser, currentMember },
      {
        chapter: ['import'],
      },
      location.pathname,
    );
  },
}).lazy(() =>
  import('./pages/ChapterImporterPage').then((d) => d.chapterImporterLazyRoute),
);

export const chapterRouter = [
  chapterListRoute,
  chapterNewRoute,
  chapterEditRoute,
  chapterViewRoute,
  chapterImporterRoute,
];
