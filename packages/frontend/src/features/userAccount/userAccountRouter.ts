import { createRoute } from '@tanstack/react-router';
import { authenticatedRoute } from '@/features/auth/authRouter';
import { rootRoute } from '@/features/router';
import { useAuthStore } from '@/features/auth/authStore';
import { authGuardFrontend } from '@/features/auth/authGuardFrontend';
import { buildPageTitle } from '@/shared/lib/buildPageTitle';
import { PrivacyAndAccountPage } from './pages/PrivacyAndAccountPage';
import { AccountDeletionConfirmPage } from './pages/AccountDeletionConfirmPage';

export const privacyAndAccountRoute = createRoute({
  getParentRoute: () => authenticatedRoute,
  path: '/account',
  component: PrivacyAndAccountPage,
  head: () => ({
    meta: [
      {
        title: buildPageTitle(
          useAuthStore.getState().dictionary.account.privacyTabLabel,
        ),
      },
    ],
  }),
  beforeLoad: async ({ location }) => {
    const { currentUser, currentMember } = useAuthStore.getState();
    authGuardFrontend({ currentUser, currentMember }, undefined, location.pathname);
  },
});

// Email-link confirmation lands here. Public route — the user might click
// it after their session expired, and we still want them to confirm.
export const accountDeletionConfirmRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/account/delete/confirm',
  component: AccountDeletionConfirmPage,
  head: () => ({
    meta: [
      {
        title: buildPageTitle(
          useAuthStore.getState().dictionary.account.delete.dialogTitle,
        ),
      },
    ],
  }),
});

export const userAccountAuthenticatedRouter = [privacyAndAccountRoute];
export const userAccountPublicRouter = [accountDeletionConfirmRoute];
