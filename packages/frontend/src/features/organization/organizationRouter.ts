import { createRoute } from '@tanstack/react-router';
import { buildPageTitle } from '@/shared/lib/buildPageTitle';
import { authenticatedRoute } from '@/features/auth/authRouter';
import { useAuthStore } from '@/features/auth/authStore';
import { authGuardFrontend } from '@/features/auth/authGuardFrontend';

export const organizationNewRoute = createRoute({
  getParentRoute: () => authenticatedRoute,
  path: '/organization/new',
  head: () => ({
    meta: [
      {
        title: buildPageTitle(
          useAuthStore.getState().dictionary.organization.form.new.title,
        ),
      },
    ],
  }),
  beforeLoad: async ({ location }) => {
    const { currentUser, currentMember } = useAuthStore.getState();
    authGuardFrontend(
      { currentUser, currentMember },
      undefined,
      location.pathname,
    );
  },
}).lazy(() =>
  import('./pages/OrganizationNewPage').then((d) => d.organizationNewLazyRoute),
);

export const organizationEditRoute = createRoute({
  getParentRoute: () => authenticatedRoute,
  path: '/organization/$id/edit',
  head: () => ({
    meta: [
      {
        title: buildPageTitle(
          useAuthStore.getState().dictionary.organization.form.edit.title,
        ),
      },
    ],
  }),
  beforeLoad: async ({ location }) => {
    const { currentUser, currentMember } = useAuthStore.getState();
    authGuardFrontend(
      { currentUser, currentMember },
      {
        organization: ['update'],
      },
      location.pathname,
    );
  },
}).lazy(() =>
  import('./pages/OrganizationEditPage').then(
    (d) => d.organizationEditLazyRoute,
  ),
);

export const organizationRouter = [organizationNewRoute, organizationEditRoute];
