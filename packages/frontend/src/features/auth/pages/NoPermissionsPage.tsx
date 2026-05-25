import { SignOutButton } from '@/features/auth/components/SignOutButton';
import { featureIcons } from '@/features/featureIcons';
import { LanguageSwitcher } from '@/shared/components/LanguageSwitcher';
import { ThemeModeToggle } from '@/shared/components/ThemeModeToggle';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/shared/components/ui/card';
import { Spinner } from '@/shared/components/ui/spinner';
import { apiClient } from '@/shared/lib/apiClient';
import { useAuthStore } from '@/features/auth/authStore';
import { useShallow } from 'zustand/react/shallow';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Link, useNavigate } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
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

export function NoPermissionsPage() {
  const { dictionary, config, currentOrganization, fetchCurrentUser } =
    useAuthStore(
      useShallow((state) => ({
        dictionary: state.dictionary,
        config: state.config,
        currentOrganization: state.currentOrganization,
        fetchCurrentUser: state.fetchCurrentUser,
      })),
    );
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isProcessing, setIsProcessing] = useState(false);
  const { theme } = useTheme();

  const backgroundImage =
    getOrganizationBackgroundImage(config?.organizationForBranding, theme) ||
    getOrganizationBackgroundImage(currentOrganization, theme);

  const invitationsQuery = useQuery({
    queryKey: ['invitations', 'my'],
    queryFn: async ({ signal }) => {
      const response = await apiClient
        .get('api/member/invitation/my', { signal })
        .json<{ invitations: Array<any> }>();
      return response.invitations || [];
    },
  });

  useEffect(() => {
    const autoAcceptInvitation = async () => {
      if (
        !invitationsQuery.isSuccess ||
        invitationsQuery.data.length === 0 ||
        isProcessing
      ) {
        return;
      }

      try {
        setIsProcessing(true);
        const invitation = invitationsQuery.data[0];

        await apiClient
          .post(`api/member/invitation/${invitation.id}/accept`)
          .json();

        await fetchCurrentUser();

        queryClient.invalidateQueries();

        navigate({ to: '/' });
      } catch (error: any) {
        console.error('Failed to auto-accept invitation:', error);
        toast.error(
          error.message || dictionary.auth.organization.invitationAcceptError,
        );
        setIsProcessing(false);
      }
    };

    autoAcceptInvitation();
  }, [
    invitationsQuery.isSuccess,
    invitationsQuery.data,
    isProcessing,
    fetchCurrentUser,
    queryClient,
    navigate,
    dictionary,
  ]);

  if (!dictionary) {
    return null;
  }

  // Show loading state while checking/accepting invitations
  if (invitationsQuery.isLoading || isProcessing) {
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
                  config?.organizationForBranding?.name ||
                  dictionary.projectName
                }
              />
              <AvatarFallback className="bg-primary text-primary-foreground rounded-md">
                <featureIcons.organization className="size-4" />
              </AvatarFallback>
            </Avatar>
            {config?.organizationForBranding?.name || dictionary.projectName}
          </Link>
          <Card className="w-full max-w-md">
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center">
                <Spinner className="mb-4" />
                <p className="text-neutral-600 dark:text-neutral-300">
                  {dictionary.auth.invitation.loadingMessage}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

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
              {dictionary.auth.noPermissions.title}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-center text-neutral-600 dark:text-neutral-300">
              {dictionary.auth.noPermissions.message}
            </p>

            <div className="flex justify-center">
              <SignOutButton
                className="mt-8 block text-center text-sm font-medium text-neutral-800 hover:underline dark:text-neutral-200"
                text={dictionary.auth.signOut.button}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
