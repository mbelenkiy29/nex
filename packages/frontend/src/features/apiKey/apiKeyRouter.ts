import { createRoute } from '@tanstack/react-router';
import { buildPageTitle } from '@/shared/lib/buildPageTitle';
import { authenticatedRoute } from '@/features/auth/authRouter';
import { useAuthStore } from '@/features/auth/authStore';
import { authGuardFrontend } from '@/features/auth/authGuardFrontend';

export const apiKeyListRoute = createRoute({
  getParentRoute: () => authenticatedRoute,
  path: '/api-key',
  head: () => ({
    meta: [
      {
        title: buildPageTitle(
          useAuthStore.getState().dictionary.apiKey.list.title,
        ),
      },
    ],
  }),
  beforeLoad: async ({ location }) => {
    const { currentUser, currentMember } = useAuthStore.getState();
    authGuardFrontend(
      { currentUser, currentMember },
      {
        apiKey: ['read'],
      },
      location.pathname,
    );
  },
}).lazy(() =>
  import('./pages/ApiKeyListPage').then((d) => d.apiKeyListLazyRoute),
);

export const apiKeyNewRoute = createRoute({
  getParentRoute: () => authenticatedRoute,
  path: '/api-key/new',
  head: () => ({
    meta: [
      {
        title: buildPageTitle(
          useAuthStore.getState().dictionary.apiKey.new.title,
        ),
      },
    ],
  }),
  beforeLoad: async ({ location }) => {
    const { currentUser, currentMember } = useAuthStore.getState();
    authGuardFrontend(
      { currentUser, currentMember },
      {
        apiKey: ['create'],
      },
      location.pathname,
    );
  },
}).lazy(() =>
  import('./pages/ApiKeyNewPage').then((d) => d.apiKeyNewLazyRoute),
);

export const apiKeyEditRoute = createRoute({
  getParentRoute: () => authenticatedRoute,
  path: '/api-key/$id/edit',
  head: () => ({
    meta: [
      {
        title: buildPageTitle(
          useAuthStore.getState().dictionary.apiKey.edit.title,
        ),
      },
    ],
  }),
  beforeLoad: async ({ location }) => {
    const { currentUser, currentMember } = useAuthStore.getState();
    authGuardFrontend(
      { currentUser, currentMember },
      {
        apiKey: ['update'],
      },
      location.pathname,
    );
  },
}).lazy(() =>
  import('./pages/ApiKeyEditPage').then((d) => d.apiKeyEditLazyRoute),
);

export const apiKeyRouter = [apiKeyListRoute, apiKeyNewRoute, apiKeyEditRoute];
