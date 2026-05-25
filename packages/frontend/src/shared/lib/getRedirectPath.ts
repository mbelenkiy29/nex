/**
 * Filters redirect paths to prevent redirect loops.
 * Only returns the redirect if it's not an auth page.
 *
 * @param redirect - The redirect path from search params
 * @param fallback - Fallback path if redirect is invalid (defaults to '/')
 * @returns The redirect path or fallback
 */
export function getRedirectPath(
  redirect: string | undefined,
  fallback: string = '/',
): string {
  if (redirect?.trim() && !redirect.startsWith('/auth/')) {
    return redirect;
  }
  return fallback;
}
