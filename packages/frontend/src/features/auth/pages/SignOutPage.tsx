import { SignOut } from '@/features/auth/components/SignOut';
import { featureIcons } from '@/features/featureIcons';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/shared/components/ui/card';
import { useAuthStore } from '@/features/auth/authStore';
import { useShallow } from 'zustand/react/shallow';
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

export function SignOutPage() {
  const { dictionary, config, currentOrganization } = useAuthStore(
    useShallow((state) => ({
      dictionary: state.dictionary,
      config: state.config,
      currentOrganization: state.currentOrganization,
    })),
  );
  const { theme } = useTheme();

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
              {dictionary.auth.signOut.title}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <SignOut />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
