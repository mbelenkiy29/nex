import { createRoute } from '@tanstack/react-router';
import { buildPageTitle } from '@/shared/lib/buildPageTitle';
import { authenticatedRoute } from '@/features/auth/authRouter';
import { useAuthStore } from '@/features/auth/authStore';
import { authGuardFrontend } from '@/features/auth/authGuardFrontend';

export const apiDocsRoute = createRoute({
  getParentRoute: () => authenticatedRoute,
  path: '/api-docs',
  head: () => ({
    meta: [
      {
        title: buildPageTitle(useAuthStore.getState().dictionary.apiDocs.title),
      },
    ],
  }),
  beforeLoad: async ({ location }) => {
    const { currentUser, currentMember } = useAuthStore.getState();
    authGuardFrontend(
      { currentUser, currentMember },
      {
        apiDocs: ['read'],
      },
      location.pathname,
    );
  },
}).lazy(() => import('./pages/ApiDocsPage').then((d) => d.apiDocsLazyRoute));

export const apiDocsRouter = [apiDocsRoute];
