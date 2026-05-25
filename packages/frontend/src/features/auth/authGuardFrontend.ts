import { redirect } from '@tanstack/react-router';
import {
  useAuthStore,
  type PartialPermissions,
} from '@/features/auth/authStore';
import { getRedirectPath } from '@/shared/lib/getRedirectPath';

interface AuthGuardContext {
  currentUser: any | null;
  currentMember: any | null;
}

export function authGuardFrontend(
  { currentUser, currentMember }: AuthGuardContext,
  permissions?: PartialPermissions,
  pathname?: string,
) {
  // Only set redirect if pathname is not an auth page
  const validRedirect = getRedirectPath(pathname, '');
  const redirectParam = validRedirect ? { redirect: validRedirect } : undefined;

  if (!currentUser) {
    throw redirect({ to: '/auth/sign-in', search: redirectParam });
  }

  if (!currentMember) {
    const config = useAuthStore.getState().config;

    if (
      config?.organizationMode === 'single' ||
      (config?.organizationMode === 'multi-domain' &&
        config?.organizationForBranding)
    ) {
      throw redirect({ to: '/auth/no-permissions' });
    } else {
      throw redirect({ to: '/auth/organization', search: redirectParam });
    }
  }

  if (currentMember.disabled) {
    throw redirect({ to: '/auth/no-permissions' });
  }

  if (permissions) {
    if (!useAuthStore.getState().hasPermission(permissions)) {
      throw redirect({ to: '/auth/no-permissions' });
    }
  }

  if (!currentMember.firstName) {
    throw redirect({ to: '/auth/profile-onboard', search: redirectParam });
  }

  // Post-firstName: the signup course selector gate. Once
  // `onboardingCompletedAt` is set (by Skip or Continue on
  // /welcome/courses), the redirect never fires again. The /welcome
  // route is allowed through unguarded so the user can reach the
  // selector itself.
  if (
    !currentMember.onboardingCompletedAt &&
    !pathname?.startsWith('/welcome/')
  ) {
    throw redirect({ to: '/welcome/courses', search: redirectParam });
  }
}
