import { createRoute, redirect } from '@tanstack/react-router';
import { authenticatedRoute } from '@/features/auth/authRouter';
import { useAuthStore } from '@/features/auth/authStore';
import { buildPageTitle } from '@/shared/lib/buildPageTitle';

export async function platformAdminBeforeLoad() {
  let { currentUser, isPlatformAdmin } = useAuthStore.getState();
  if (!currentUser) {
    throw redirect({ to: '/auth/sign-in' });
  }

  if (!isPlatformAdmin) {
    await useAuthStore.getState().fetchCurrentUser();
    currentUser = useAuthStore.getState().currentUser;
    isPlatformAdmin = useAuthStore.getState().isPlatformAdmin;
  }

  if (!currentUser) {
    throw redirect({ to: '/auth/sign-in' });
  }

  if (!isPlatformAdmin) {
    throw redirect({ to: '/' });
  }
}

export const platformAdminRoute = createRoute({
  getParentRoute: () => authenticatedRoute,
  path: '/admin',
  head: () => ({
    meta: [
      {
        title: buildPageTitle(
          useAuthStore.getState().dictionary.platformAdmin.title,
        ),
      },
    ],
  }),
  beforeLoad: platformAdminBeforeLoad,
}).lazy(() =>
  import('./pages/PlatformAdminPage').then((d) => d.platformAdminLazyRoute),
);

export const platformAdminCoursesRoute = createRoute({
  getParentRoute: () => authenticatedRoute,
  path: '/admin/courses',
  head: () => ({
    meta: [
      {
        title: buildPageTitle(
          useAuthStore.getState().dictionary.course.admin.title,
        ),
      },
    ],
  }),
  beforeLoad: platformAdminBeforeLoad,
}).lazy(() =>
  import('./pages/PlatformCoursesPage').then((d) => d.platformCoursesLazyRoute),
);

export const platformAdminCreatorApplicationsRoute = createRoute({
  getParentRoute: () => authenticatedRoute,
  path: '/admin/creator-applications',
  head: () => ({
    meta: [
      {
        title: buildPageTitle(
          useAuthStore.getState().dictionary.creatorApplication.adminTitle,
        ),
      },
    ],
  }),
  beforeLoad: platformAdminBeforeLoad,
}).lazy(() =>
  import('./pages/PlatformCreatorApplicationsPage').then(
    (d) => d.platformCreatorApplicationsLazyRoute,
  ),
);

export const platformAdminTrustSafetyRoute = createRoute({
  getParentRoute: () => authenticatedRoute,
  path: '/admin/trust-safety',
  head: () => ({
    meta: [
      {
        title: buildPageTitle(
          useAuthStore.getState().dictionary.trustSafety.admin.title,
        ),
      },
    ],
  }),
  beforeLoad: platformAdminBeforeLoad,
}).lazy(() =>
  import('./pages/PlatformTrustSafetyPage').then(
    (d) => d.platformTrustSafetyLazyRoute,
  ),
);

export const platformAdminRouter = [
  platformAdminRoute,
  platformAdminCoursesRoute,
  platformAdminCreatorApplicationsRoute,
  platformAdminTrustSafetyRoute,
];
