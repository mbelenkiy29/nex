import { createRoute, redirect } from '@tanstack/react-router';
import { z } from 'zod';
import { rootRoute } from '@/features/router';
import { AppLayout } from '@/shared/layouts/AppLayout';
import { buildPageTitle } from '@/shared/lib/buildPageTitle';
import { useAuthStore } from '@/features/auth/authStore';
import { authGuardFrontend } from '@/features/auth/authGuardFrontend';
import { SignInPage } from '@/features/auth/pages/SignInPage';
import {
  CreatorSignUpPage,
  StudentSignUpPage,
} from '@/features/auth/pages/SignUpPage';
import { SignOutPage } from '@/features/auth/pages/SignOutPage';
import { AuthCallbackPage } from '@/features/auth/pages/AuthCallbackPage';
import { InvitationPage } from '@/features/auth/pages/InvitationPage';
import { VerifyEmailRequestPage } from '@/features/auth/pages/VerifyEmailRequestPage';
import { ProfileOnboardPage } from '@/features/auth/pages/ProfileOnboardPage';
import { WelcomeCoursesPage } from '@/features/auth/pages/WelcomeCoursesPage';
import { OrganizationPage } from '@/features/auth/pages/OrganizationPage';
import { NoPermissionsPage } from '@/features/auth/pages/NoPermissionsPage';
import { PasswordResetConfirmPage } from '@/features/auth/pages/PasswordResetConfirmPage';
import { PasswordResetRequestPage } from '@/features/auth/pages/PasswordResetRequestPage';
import { VerifyEmailConfirmPage } from '@/features/auth/pages/VerifyEmailConfirmPage';
import { EmailChangeConfirmPage } from '@/features/auth/pages/EmailChangeConfirmPage';
import { ProfilePage } from '@/features/auth/pages/ProfilePage';
import { PasswordChangePage } from '@/features/auth/pages/PasswordChangePage';
import { EmailChangePage } from '@/features/auth/pages/EmailChangePage';

export const authenticatedRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: 'authenticated',
  component: AppLayout,
});

export const signInRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: 'auth/sign-in',
  component: SignInPage,
  head: () => ({
    meta: [
      {
        title: buildPageTitle(
          useAuthStore.getState().dictionary.auth.signIn.title,
        ),
      },
    ],
  }),
  beforeLoad: async () => {
    const currentUser = useAuthStore.getState().currentUser;
    if (currentUser) {
      throw redirect({ to: '/' });
    }
  },
});

function signUpSearch(search: Record<string, any>) {
  return {
    ...(search.redirect ? { redirect: String(search.redirect) } : {}),
    ...(search.invitationToken
      ? { invitationToken: String(search.invitationToken) }
      : {}),
    ...(search.email ? { email: String(search.email) } : {}),
  };
}

export const signUpRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: 'auth/sign-up',
  beforeLoad: ({ search }) => {
    throw redirect({
      to: '/auth/student-sign-up',
      search: signUpSearch(search as Record<string, any>),
    });
  },
});

export const studentSignUpRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: 'auth/student-sign-up',
  component: StudentSignUpPage,
  head: () => ({
    meta: [
      {
        title: buildPageTitle(
          useAuthStore.getState().dictionary.auth.signUp.studentTitle,
        ),
      },
    ],
  }),
  beforeLoad: async () => {
    const currentUser = useAuthStore.getState().currentUser;
    if (currentUser) {
      throw redirect({ to: '/' });
    }
  },
});

export const creatorSignUpRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: 'auth/creator-sign-up',
  component: CreatorSignUpPage,
  head: () => ({
    meta: [
      {
        title: buildPageTitle(
          useAuthStore.getState().dictionary.auth.signUp.creatorTitle,
        ),
      },
    ],
  }),
  beforeLoad: async () => {
    const currentUser = useAuthStore.getState().currentUser;
    if (currentUser) {
      throw redirect({ to: '/' });
    }
  },
});

export const signOutRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/auth/sign-out',
  component: SignOutPage,
  head: () => ({
    meta: [
      {
        title: buildPageTitle(
          useAuthStore.getState().dictionary.auth.signOut.title,
        ),
      },
    ],
  }),
});

export const authCallbackRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: 'auth/callback',
  component: AuthCallbackPage,
});

export const invitationRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/auth/invitation',
  component: InvitationPage,
  head: () => ({
    meta: [
      {
        title: buildPageTitle(
          useAuthStore.getState().dictionary.auth.invitation.title,
        ),
      },
    ],
  }),
  beforeLoad: ({ search }) => {
    const token = (search as Record<string, any>).token;
    const email = (search as Record<string, any>).email;
    const existingUser = (search as Record<string, any>).existingUser;
    const currentUser = useAuthStore.getState().currentUser;

    if (!token) {
      throw redirect({ to: '/' });
    }

    if (!currentUser) {
      throw redirect({
        to: existingUser ? '/auth/sign-in' : '/auth/student-sign-up',
        search: {
          invitationToken: token,
          email: String(email || ''),
        },
      });
    }
  },
});

export const verifyEmailRequestRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: 'auth/verify-email/request',
  component: VerifyEmailRequestPage,
  head: () => ({
    meta: [
      {
        title: buildPageTitle(
          useAuthStore.getState().dictionary.auth.verifyEmailRequest.title,
        ),
      },
    ],
  }),
});

export const profileOnboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: 'auth/profile-onboard',
  component: ProfileOnboardPage,
  beforeLoad: async () => {
    const { currentUser, currentMember } = useAuthStore.getState();
    if (!currentUser) {
      throw redirect({ to: '/auth/sign-in' });
    } else if (!currentMember) {
      throw redirect({ to: '/' });
    } else if (currentMember.firstName) {
      throw redirect({ to: '/' });
    }
  },
});

// "Pick your first courses" — runs once after profile-onboard, gated by
// `Member.onboardingCompletedAt`. Skip and Continue both stamp the field
// (idempotent) so the route becomes unreachable for this user afterwards.
export const welcomeCoursesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: 'welcome/courses',
  component: WelcomeCoursesPage,
  beforeLoad: async () => {
    const { currentUser, currentMember } = useAuthStore.getState();
    if (!currentUser) {
      throw redirect({ to: '/auth/sign-in' });
    } else if (!currentMember) {
      throw redirect({ to: '/' });
    } else if (!currentMember.firstName) {
      throw redirect({ to: '/auth/profile-onboard' });
    } else if (currentMember.onboardingCompletedAt) {
      throw redirect({ to: '/' });
    }
  },
});

export const organizationRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: 'auth/organization',
  component: OrganizationPage,
  beforeLoad: async () => {
    const { currentUser, currentMember } = useAuthStore.getState();
    if (!currentUser) {
      throw redirect({ to: '/auth/sign-in' });
    } else if (currentMember) {
      throw redirect({ to: '/' });
    }
  },
});

export const noPermissionsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: 'auth/no-permissions',
  component: NoPermissionsPage,
  beforeLoad: async () => {
    const { currentUser, currentMember } = useAuthStore.getState();
    if (!currentUser) {
      throw redirect({ to: '/auth/sign-in' });
    } else if (currentMember && !currentMember?.disabled) {
      throw redirect({ to: '/' });
    }
  },
});

const passwordResetConfirmSearchSchema = z.object({
  token: z.string().optional(),
});

export const passwordResetConfirmRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: 'auth/password-reset/confirm',
  component: PasswordResetConfirmPage,
  validateSearch: passwordResetConfirmSearchSchema,
  beforeLoad: async () => {
    const currentUser = useAuthStore.getState().currentUser;
    if (currentUser) {
      throw redirect({ to: '/' });
    }
  },
});

export const passwordResetRequestRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: 'auth/password-reset/request',
  component: PasswordResetRequestPage,
  head: () => ({
    meta: [
      {
        title: buildPageTitle(
          useAuthStore.getState().dictionary.auth.passwordResetRequest.title,
        ),
      },
    ],
  }),
  beforeLoad: async () => {
    const currentUser = useAuthStore.getState().currentUser;
    if (currentUser) {
      throw redirect({ to: '/' });
    }
  },
});

const verifyEmailConfirmSearchSchema = z.object({
  token: z.string().optional(),
  redirect: z.string().optional(),
});

export const verifyEmailConfirmRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: 'auth/verify-email/confirm',
  component: VerifyEmailConfirmPage,
  validateSearch: verifyEmailConfirmSearchSchema,
  beforeLoad: async ({ search }) => {
    const currentUser = useAuthStore.getState().currentUser;
    if (currentUser?.emailVerified && !(search as { token?: string }).token) {
      throw redirect({ to: '/' });
    }
  },
});

const emailChangeConfirmSearchSchema = z.object({
  token: z.string().optional(),
  newEmail: z.string().optional(),
  redirect: z.string().optional(),
});

export const emailChangeConfirmRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: 'auth/email-change/confirm',
  component: EmailChangeConfirmPage,
  validateSearch: emailChangeConfirmSearchSchema,
});

export const profileRoute = createRoute({
  getParentRoute: () => authenticatedRoute,
  path: '/auth/profile',
  component: ProfilePage,
  head: () => ({
    meta: [
      {
        title: buildPageTitle(
          useAuthStore.getState().dictionary.auth.profile.title,
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
});

export const passwordChangeRoute = createRoute({
  getParentRoute: () => authenticatedRoute,
  path: '/auth/password-change',
  component: PasswordChangePage,
  head: () => ({
    meta: [
      {
        title: buildPageTitle(
          useAuthStore.getState().dictionary.auth.passwordChange.title,
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
});

export const emailChangeRoute = createRoute({
  getParentRoute: () => authenticatedRoute,
  path: '/auth/email-change',
  component: EmailChangePage,
  head: () => ({
    meta: [
      {
        title: buildPageTitle(
          useAuthStore.getState().dictionary.auth.emailChange.title,
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
});

export const authRouter = [
  signInRoute,
  signUpRoute,
  studentSignUpRoute,
  creatorSignUpRoute,
  signOutRoute,
  authCallbackRoute,
  invitationRoute,
  verifyEmailRequestRoute,
  profileOnboardRoute,
  welcomeCoursesRoute,
  organizationRoute,
  noPermissionsRoute,
  passwordResetConfirmRoute,
  passwordResetRequestRoute,
  verifyEmailConfirmRoute,
  emailChangeConfirmRoute,
];

export const authAuthenticatedRouter = [
  profileRoute,
  passwordChangeRoute,
  emailChangeRoute,
];
