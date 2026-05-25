import { PasswordResetConfirmFormWithRecaptcha } from '@/features/auth/components/PasswordResetConfirmForm';
import { featureIcons } from '@/features/featureIcons';
import { LanguageSwitcher } from '@/shared/components/LanguageSwitcher';
import { ThemeModeToggle } from '@/shared/components/ThemeModeToggle';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/shared/components/ui/card';
import { useAuthStore } from '@/features/auth/authStore';
import { Link } from '@tanstack/react-router';
import {
  Avatar,
  AvatarImage,
  AvatarFallback,
} from '@/shared/components/ui/avatar';
import { useTheme } from 'next-themes';
import {
  getOrganizationLogo,
  getOrganizationBackgroundImage,
} from '@/features/organization/organizationLogo';

export function PasswordResetConfirmPage() {
  const dictionary = useAuthStore((state) => state.dictionary);
  const config = useAuthStore((state) => state.config);
  const currentOrganization = useAuthStore(
    (state) => state.currentOrganization,
  );
  const locale = useAuthStore((state) => state.locale);
  const { theme } = useTheme();

  if (!dictionary) {
    return null;
  }

  const backgroundImage =
    getOrganizationBackgroundImage(config?.organizationForBranding, theme) ||
    getOrganizationBackgroundImage(currentOrganization, theme);

  return (
    <div
      className="bg-muted relative flex min-h-screen items-center justify-center bg-cover bg-center bg-no-repeat p-4"
      style={
        backgroundImage
          ? { backgroundImage: `url(${backgroundImage})` }
          : undefined
      }
    >
      <div className="absolute top-4 right-4 flex gap-4 md:top-8 md:right-8">
        <LanguageSwitcher />
        <ThemeModeToggle />
      </div>
      <div className="flex w-full flex-col items-center gap-6">
        <Link
          to="/"
          className="flex items-center gap-2 self-center font-medium"
        >
          <Avatar className="size-6 rounded-md">
            <AvatarImage
              src={
                getOrganizationLogo(config?.organizationForBranding, theme) ||
                getOrganizationLogo(currentOrganization, theme)
              }
              alt={
                config?.organizationForBranding?.name || dictionary.projectName
              }
            />
            <AvatarFallback className="bg-primary text-primary-foreground rounded-md">
              <featureIcons.organization className="size-4" />
            </AvatarFallback>
          </Avatar>
          {config?.organizationForBranding?.name || dictionary.projectName}
        </Link>
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">
              {dictionary.auth.passwordResetConfirm.title}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <PasswordResetConfirmFormWithRecaptcha locale={locale} />
            <Link
              className="mt-4 block text-center text-sm font-medium text-neutral-800 hover:underline dark:text-neutral-200"
              to="/auth/sign-in"
              preload="intent"
            >
              {dictionary.auth.passwordResetConfirm.signInLink}
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
