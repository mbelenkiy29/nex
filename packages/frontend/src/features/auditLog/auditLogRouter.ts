import { createRoute } from '@tanstack/react-router';
import { buildPageTitle } from '@/shared/lib/buildPageTitle';
import { authenticatedRoute } from '@/features/auth/authRouter';
import { useAuthStore } from '@/features/auth/authStore';
import { authGuardFrontend } from '@/features/auth/authGuardFrontend';
import { queryClient } from '@/shared/lib/queryClient';

export const auditLogListRoute = createRoute({
  getParentRoute: () => authenticatedRoute,
  path: '/audit-log',
  head: () => ({
    meta: [
      {
        title: buildPageTitle(
          useAuthStore.getState().dictionary.auditLog.list.title,
        ),
      },
    ],
  }),
  beforeLoad: async ({ location }) => {
    const { currentUser, currentMember } = useAuthStore.getState();
    authGuardFrontend(
      { currentUser, currentMember },
      {
        auditLog: ['read'],
      },
      location.pathname,
    );

    queryClient.invalidateQueries({
      queryKey: ['auditLog'],
    });
  },
}).lazy(() =>
  import('./pages/AuditLogListPage').then((d) => d.auditLogListLazyRoute),
);

export const auditLogRouter = [auditLogListRoute];
