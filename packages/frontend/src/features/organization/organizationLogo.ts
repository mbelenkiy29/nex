import { downloadUrl } from '@/shared/lib/downloadUrl';

function resolveIsDark(theme: string | undefined): boolean {
  if (theme === 'dark') return true;
  if (theme === 'light') return false;
  // theme is 'system' or undefined - check system preference
  return window.matchMedia('(prefers-color-scheme: dark)').matches;
}

export function getOrganizationLogo(
  organization: any,
  theme: string | undefined,
): string | undefined {
  const isDark = resolveIsDark(theme);
  const logos = isDark ? organization?.logosDark : organization?.logosLight;
  const logosArray =
    typeof logos === 'string' ? JSON.parse(logos || 'null') : logos;
  return downloadUrl(logosArray, 0);
}

export function getOrganizationBackgroundImage(
  organization: any,
  theme: string | undefined,
): string | undefined {
  const isDark = resolveIsDark(theme);
  const backgroundImages = isDark
    ? organization?.backgroundImageDark
    : organization?.backgroundImageLight;
  const backgroundImagesArray =
    typeof backgroundImages === 'string'
      ? JSON.parse(backgroundImages || 'null')
      : backgroundImages;
  return downloadUrl(backgroundImagesArray, 0);
}
