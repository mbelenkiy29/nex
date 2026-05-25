import { authGuardFrontend } from '@/features/auth/authGuardFrontend';
import { authenticatedRoute } from '@/features/auth/authRouter';
import { useAuthStore } from '@/features/auth/authStore';
import { buildPageTitle } from '@/shared/lib/buildPageTitle';
import { createRoute } from '@tanstack/react-router';

export const conceptListRoute = createRoute({
  getParentRoute: () => authenticatedRoute,
  path: '/concept',
  head: () => ({
    meta: [
      {
        title: buildPageTitle(
          useAuthStore.getState().dictionary.concept.list.title,
        ),
      },
    ],
  }),
  beforeLoad: async ({ location }) => {
    const { currentUser, currentMember } = useAuthStore.getState();
    authGuardFrontend(
      { currentUser, currentMember },
      {
        concept: ['read'],
      },
      location.pathname,
    );
  },
}).lazy(() =>
  import('./pages/ConceptListPage').then((d) => d.conceptListLazyRoute),
);

export const conceptNewRoute = createRoute({
  getParentRoute: () => authenticatedRoute,
  path: '/concept/new',
  head: () => ({
    meta: [
      {
        title: buildPageTitle(
          useAuthStore.getState().dictionary.concept.new.title,
        ),
      },
    ],
  }),
  beforeLoad: async ({ location }) => {
    const { currentUser, currentMember } = useAuthStore.getState();
    authGuardFrontend(
      { currentUser, currentMember },
      {
        concept: ['create'],
      },
      location.pathname,
    );
  },
}).lazy(() =>
  import('./pages/ConceptNewPage').then((d) => d.conceptNewLazyRoute),
);

export const conceptEditRoute = createRoute({
  getParentRoute: () => authenticatedRoute,
  path: '/concept/$id/edit',
  head: () => ({
    meta: [
      {
        title: buildPageTitle(
          useAuthStore.getState().dictionary.concept.edit.title,
        ),
      },
    ],
  }),
  beforeLoad: async ({ location }) => {
    const { currentUser, currentMember } = useAuthStore.getState();
    authGuardFrontend(
      { currentUser, currentMember },
      {
        concept: ['update'],
      },
      location.pathname,
    );
  },
}).lazy(() =>
  import('./pages/ConceptEditPage').then((d) => d.conceptEditLazyRoute),
);

export const conceptViewRoute = createRoute({
  getParentRoute: () => authenticatedRoute,
  path: '/concept/$id',
  head: () => ({
    meta: [
      {
        title: buildPageTitle(
          useAuthStore.getState().dictionary.concept.view.title,
        ),
      },
    ],
  }),
  beforeLoad: async ({ location }) => {
    const { currentUser, currentMember } = useAuthStore.getState();
    authGuardFrontend(
      { currentUser, currentMember },
      {
        concept: ['read'],
      },
      location.pathname,
    );
  },
}).lazy(() =>
  import('./pages/ConceptViewPage').then((d) => d.conceptViewLazyRoute),
);

export const conceptImporterRoute = createRoute({
  getParentRoute: () => authenticatedRoute,
  path: '/concept/importer',
  head: () => ({
    meta: [
      {
        title: buildPageTitle(
          useAuthStore.getState().dictionary.concept.importer.title,
        ),
      },
    ],
  }),
  beforeLoad: async ({ location }) => {
    const { currentUser, currentMember } = useAuthStore.getState();
    authGuardFrontend(
      { currentUser, currentMember },
      {
        concept: ['import'],
      },
      location.pathname,
    );
  },
}).lazy(() =>
  import('./pages/ConceptImporterPage').then((d) => d.conceptImporterLazyRoute),
);

export const conceptRouter = [
  conceptListRoute,
  conceptNewRoute,
  conceptEditRoute,
  conceptViewRoute,
  conceptImporterRoute,
];
