import { createRoute } from '@tanstack/react-router';
import { rootRoute } from '@/features/router';
import { useAuthStore } from '@/features/auth/authStore';
import { buildPageTitle } from '@/shared/lib/buildPageTitle';
import { TermsPage } from './pages/TermsPage';
import { PrivacyPage } from './pages/PrivacyPage';

// /terms and /privacy are PUBLIC — Stripe checkout's auto-linked ToS and
// browser-shared links must work for signed-out visitors. They sit under
// `rootRoute` (not `authenticatedRoute`) like /sign-in / /sign-up.
export const termsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/terms',
  component: TermsPage,
  head: () => ({
    meta: [
      {
        title: buildPageTitle(
          useAuthStore.getState().dictionary.legal.terms.title,
        ),
      },
    ],
  }),
});

export const privacyRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/privacy',
  component: PrivacyPage,
  head: () => ({
    meta: [
      {
        title: buildPageTitle(
          useAuthStore.getState().dictionary.legal.privacy.title,
        ),
      },
    ],
  }),
});

export const legalRouter = [termsRoute, privacyRoute];
