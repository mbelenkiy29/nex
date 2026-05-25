export type DashboardPersona = 'student' | 'creator';
export type DashboardView = 'superAdmin' | DashboardPersona;

const dashboardPersonaStorageKey = 'nexexam.dashboardPersona';

export function dashboardPersonaGet(): DashboardPersona | null {
  if (typeof window === 'undefined') {
    return null;
  }

  const value = window.localStorage.getItem(dashboardPersonaStorageKey);
  return value === 'creator' || value === 'student' ? value : null;
}

export function dashboardPersonaSet(persona: DashboardPersona) {
  if (typeof window === 'undefined') {
    return;
  }

  window.localStorage.setItem(dashboardPersonaStorageKey, persona);
}

export function dashboardPersonaClear() {
  if (typeof window === 'undefined') {
    return;
  }

  window.localStorage.removeItem(dashboardPersonaStorageKey);
}

export function dashboardViewFromPath(pathname: string): DashboardView | null {
  if (pathname === '/admin' || pathname.startsWith('/admin/')) {
    return 'superAdmin';
  }

  if (pathname === '/creator' || pathname.startsWith('/creator/')) {
    return 'creator';
  }

  if (pathname === '/student' || pathname.startsWith('/student/')) {
    return 'student';
  }

  return null;
}

/**
 * Canonical active-view resolver. Used by `AppMenu`, `SuperAdminViewSwitcher`,
 * and `AppSidebar` so the sidebar matches the persona the user actually
 * chose, not just whatever route they happen to be on.
 *
 * Precedence:
 *   1. URL `/admin*`   → 'superAdmin' (and any admin-only signal wins)
 *   2. URL `/student*` → 'student'
 *   3. URL `/creator*` → 'creator'
 *   4. Otherwise → stored persona for admins (default 'superAdmin'); for
 *      non-admins, derive from their actual role via the caller.
 *
 * The persistence layer is the `dashboardPersona*` helpers above, which are
 * already set by `SuperAdminViewSwitcher` on click and by the `/student` and
 * `/creator` dashboard route guards on entry.
 */
export function dashboardActiveView({
  isPlatformAdmin,
  pathname,
}: {
  isPlatformAdmin: boolean;
  pathname: string;
}): DashboardView {
  const fromPath = dashboardViewFromPath(pathname);
  if (fromPath) {
    return fromPath;
  }
  if (isPlatformAdmin) {
    const stored = dashboardPersonaGet();
    return stored ?? 'superAdmin';
  }
  // For non-admins on a non-dashboard URL, persona doesn't matter — callers
  // only consult this when they need a view label. Default to student because
  // it's the broadest default; creator-only users have their `isCreator`
  // signal upstream.
  return 'student';
}

export function dashboardHomePath({
  isPlatformAdmin,
  persona,
}: {
  isPlatformAdmin: boolean;
  persona?: DashboardPersona | null;
}) {
  if (isPlatformAdmin) {
    // Admin home respects the persona the admin last selected. Without one,
    // they land on /admin (their natural starting surface).
    if (persona === 'student') return '/student';
    if (persona === 'creator') return '/creator';
    return '/admin';
  }

  return persona === 'creator' ? '/creator' : '/student';
}
