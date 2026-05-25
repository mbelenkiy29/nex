import { createRoute } from '@tanstack/react-router';
import { buildPageTitle } from '@/shared/lib/buildPageTitle';
import { authenticatedRoute } from '@/features/auth/authRouter';
import { useAuthStore } from '@/features/auth/authStore';
import { authGuardFrontend } from '@/features/auth/authGuardFrontend';

export const notificationListRoute = createRoute({
  getParentRoute: () => authenticatedRoute,
  path: '/notification',
  head: () => ({
    meta: [
      {
        title: buildPageTitle(
          useAuthStore.getState().dictionary.notification.title,
        ),
      },
    ],
  }),
  beforeLoad: async ({ location }) => {
    const { currentUser, currentMember } = useAuthStore.getState();
    authGuardFrontend(
      { currentUser, currentMember },
      { notification: ['read'] },
      location.pathname,
    );
  },
}).lazy(() =>
  import('./pages/NotificationListPage').then(
    (d) => d.notificationListLazyRoute,
  ),
);

export const notificationSendRoute = createRoute({
  getParentRoute: () => authenticatedRoute,
  path: '/notification/send',
  head: () => ({
    meta: [
      {
        title: buildPageTitle(
          useAuthStore.getState().dictionary.notification.send.title,
        ),
      },
    ],
  }),
  beforeLoad: async ({ location }) => {
    const { currentUser, currentMember } = useAuthStore.getState();
    authGuardFrontend(
      { currentUser, currentMember },
      {
        notification: ['create'],
      },
      location.pathname,
    );
  },
}).lazy(() =>
  import('./pages/NotificationSendPage').then(
    (d) => d.notificationSendLazyRoute,
  ),
);

export const notificationRouter = [
  notificationListRoute,
  notificationSendRoute,
];
