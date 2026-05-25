import { createRoute } from '@tanstack/react-router';
import { buildPageTitle } from '@/shared/lib/buildPageTitle';
import { authenticatedRoute } from '@/features/auth/authRouter';
import { useAuthStore } from '@/features/auth/authStore';
import { authGuardFrontend } from '@/features/auth/authGuardFrontend';

export const mcpRoute = createRoute({
  getParentRoute: () => authenticatedRoute,
  path: '/mcp-docs',
  head: () => ({
    meta: [
      {
        title: buildPageTitle(useAuthStore.getState().dictionary.mcp.title),
      },
    ],
  }),
  beforeLoad: async ({ location }) => {
    const { currentUser, currentMember } = useAuthStore.getState();
    authGuardFrontend(
      { currentUser, currentMember },
      {
        mcp: ['use'],
      },
      location.pathname,
    );
  },
}).lazy(() => import('./pages/McpDocsPage').then((d) => d.mcpDocsLazyRoute));

export const mcpRouter = [mcpRoute];
