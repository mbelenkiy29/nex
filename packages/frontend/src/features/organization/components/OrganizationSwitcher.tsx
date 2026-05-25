import { featureIcons } from '@/features/featureIcons';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/shared/components/ui/dropdown-menu';
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/shared/components/ui/sidebar';
import { useAuthStore } from '@/features/auth/authStore';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate, useRouter } from '@tanstack/react-router';
import { useShallow } from 'zustand/react/shallow';
import { sortBy } from 'lodash-es';
import { LuChevronsUpDown, LuPencil, LuPlus, LuMail } from 'react-icons/lu';
import { toast } from 'sonner';
import { apiClient } from '@/shared/lib/apiClient';
import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/shared/components/ui/dialog';
import { Button } from '@/shared/components/ui/button';
import { dictionaryFormat } from '@/shared/lib/dictionaryFormat';
import {
  Avatar,
  AvatarImage,
  AvatarFallback,
} from '@/shared/components/ui/avatar';
import { useTheme } from 'next-themes';
import { downloadUrl } from '@/shared/lib/downloadUrl';

export function OrganizationSwitcher() {
  const {
    dictionary,
    hasPermission,
    currentOrganization,
    currentUser,
    config,
    fetchCurrentUser,
  } = useAuthStore(
    useShallow((state) => ({
      dictionary: state.dictionary,
      hasPermission: state.hasPermission,
      currentOrganization: state.currentOrganization,
      currentUser: state.currentUser,
      config: state.config,
      fetchCurrentUser: state.fetchCurrentUser,
    })),
  );
  const router = useRouter();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { isMobile } = useSidebar();
  const { theme } = useTheme();

  const [selectedInvitation, setSelectedInvitation] = useState<any | null>(
    null,
  );
  const [isAcceptingInvitation, setIsAcceptingInvitation] = useState(false);
  const [isRejectingInvitation, setIsRejectingInvitation] = useState(false);

  const invitationsQuery = useQuery({
    queryKey: ['invitations', 'my'],
    queryFn: async ({ signal }) => {
      const response = await apiClient
        .get('api/member/invitation/my', { signal })
        .json<{ invitations: Array<any> }>();
      return response.invitations || [];
    },
  });

  const hasPermissionToEditOrganization = hasPermission({
    organization: ['update'],
  });

  const handleOrganizationSwitch = async (organizationId: string) => {
    try {
      await apiClient
        .post(`api/organization/${organizationId}/set-active`)
        .json();

      await fetchCurrentUser();

      queryClient.invalidateQueries();

      router.invalidate();
    } catch (error: any) {
      toast.error(error.message || dictionary.shared.errors.unknown);
    }
  };

  const handleInvitationClick = (invitation: any) => {
    setSelectedInvitation(invitation);
  };

  const handleAcceptInvitation = async () => {
    if (!selectedInvitation) return;

    try {
      setIsAcceptingInvitation(true);
      await apiClient
        .post(`api/member/invitation/${selectedInvitation.id}/accept`)
        .json();

      await fetchCurrentUser();

      await queryClient.invalidateQueries({ queryKey: ['invitations', 'my'] });

      await handleOrganizationSwitch(selectedInvitation.organizationId);

      toast.success(dictionary.auth.organization.invitationAccepted);

      setSelectedInvitation(null);
    } catch (error: any) {
      toast.error(
        error.message || dictionary.auth.organization.invitationAcceptError,
      );
    } finally {
      setIsAcceptingInvitation(false);
    }
  };

  const handleRejectInvitation = async () => {
    if (!selectedInvitation) return;

    try {
      setIsRejectingInvitation(true);
      await apiClient
        .post(`api/member/invitation/${selectedInvitation.id}/reject`)
        .json<boolean>();

      await queryClient.invalidateQueries({ queryKey: ['invitations', 'my'] });

      toast.success(dictionary.auth.organization.invitationRejected);

      setSelectedInvitation(null);
    } catch (error: any) {
      toast.error(
        error.message || dictionary.auth.organization.invitationRejectError,
      );
    } finally {
      setIsRejectingInvitation(false);
    }
  };

  const handleCancelInvitation = () => {
    setSelectedInvitation(null);
  };

  const members = sortBy(
    currentUser?.members,
    (member) => member?.organization?.name,
  );

  const invitations = sortBy(
    invitationsQuery.data || [],
    (invitation) => invitation?.organization?.name,
  );

  if (
    (config?.organizationMode !== 'multi' &&
      config?.organizationMode !== 'multi-domain') ||
    (config?.organizationMode === 'multi-domain' &&
      config?.organizationForBranding) ||
    !currentUser
  ) {
    return (
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton
            size="lg"
            className="cursor-pointer"
            onClick={() => navigate({ to: '/' })}
          >
            <Avatar className="size-8 rounded-lg">
              <AvatarImage
                src={
                  getOrganizationLogo(config?.organizationForBranding, theme) ||
                  getOrganizationLogo(currentOrganization, theme)
                }
                alt={dictionary.projectName}
              />
              <AvatarFallback className="bg-sidebar-primary text-sidebar-primary-foreground rounded-lg">
                <featureIcons.organization className="size-4" />
              </AvatarFallback>
            </Avatar>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-medium">
                {currentOrganization?.name ||
                  config?.organizationForBranding?.name ||
                  dictionary.projectName}
              </span>
            </div>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    );
  }

  return (
    <>
      <SidebarMenu>
        <SidebarMenuItem>
          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <SidebarMenuButton
                  size="lg"
                  className="aria-expanded:bg-sidebar-accent aria-expanded:text-sidebar-accent-foreground"
                />
              }
            >
              <Avatar className="size-8 rounded-lg">
                <AvatarImage
                  src={getOrganizationLogo(currentOrganization, theme)}
                  alt={currentOrganization?.name}
                />
                <AvatarFallback className="bg-sidebar-primary text-sidebar-primary-foreground rounded-lg">
                  <featureIcons.organization className="size-4" />
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">
                  {currentOrganization?.name}
                </span>
              </div>
              <LuChevronsUpDown className="ml-auto" />
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
              align="start"
              side={isMobile ? 'bottom' : 'right'}
              sideOffset={4}
            >
              <DropdownMenuLabel className="text-muted-foreground text-xs">
                {dictionary.organization.switcher.title}
              </DropdownMenuLabel>
              {members?.map((member) => (
                <DropdownMenuItem
                  key={member.id}
                  onClick={() =>
                    handleOrganizationSwitch(member?.organization?.id!)
                  }
                  className="gap-2 p-2"
                >
                  <Avatar className="size-6 rounded-md">
                    <AvatarImage
                      src={getOrganizationLogo(member?.organization, theme)}
                      alt={member?.organization?.name}
                    />
                    <AvatarFallback className="rounded-md border">
                      <featureIcons.organization className="size-3.5 shrink-0" />
                    </AvatarFallback>
                  </Avatar>
                  {member?.organization!.name}
                </DropdownMenuItem>
              ))}
              {invitations.length > 0 && (
                <>
                  {members && members.length > 0 && <DropdownMenuSeparator />}
                  <DropdownMenuLabel className="text-muted-foreground text-xs">
                    {dictionary.auth.organization.invitations}
                  </DropdownMenuLabel>
                  {invitations.map((invitation) => (
                    <DropdownMenuItem
                      key={invitation.id}
                      onClick={() => handleInvitationClick(invitation)}
                      className="gap-2 p-2"
                    >
                      <div className="flex size-6 items-center justify-center rounded-md border">
                        <LuMail className="size-3.5 shrink-0" />
                      </div>
                      <div className="flex flex-col">
                        <span>{invitation.organization?.name}</span>
                        <span className="text-xs text-neutral-500">
                          {dictionary.auth.organization.pendingInvitation}
                        </span>
                      </div>
                    </DropdownMenuItem>
                  ))}
                </>
              )}
              <DropdownMenuSeparator />
              {hasPermissionToEditOrganization ? (
                <DropdownMenuItem
                  className="gap-2 p-2"
                  onClick={() =>
                    navigate({
                      to: `/organization/${currentOrganization?.id}/edit`,
                    })
                  }
                >
                  <div className="flex size-6 items-center justify-center rounded-md border bg-transparent">
                    <LuPencil className="size-4" />
                  </div>
                  <div className="text-muted-foreground font-medium">
                    {dictionary.organization.form.edit.title}
                  </div>
                </DropdownMenuItem>
              ) : null}
              <DropdownMenuItem
                className="gap-2 p-2"
                onClick={() => navigate({ to: '/organization/new' })}
              >
                <div className="flex size-6 items-center justify-center rounded-md border bg-transparent">
                  <LuPlus className="size-4" />
                </div>
                <div className="text-muted-foreground font-medium">
                  {dictionary.organization.switcher.create}
                </div>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarMenuItem>
      </SidebarMenu>

      {/* Invitation Dialog */}
      <Dialog
        open={selectedInvitation !== null}
        onOpenChange={(open) => !open && handleCancelInvitation()}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {dictionaryFormat(
                dictionary.organization.invitation.title,
                selectedInvitation?.organization?.name,
              )}
            </DialogTitle>
            <DialogDescription>
              {dictionaryFormat(
                dictionary.organization.invitation.message,
                selectedInvitation?.organization?.name,
              )}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              onClick={handleAcceptInvitation}
              disabled={isAcceptingInvitation || isRejectingInvitation}
            >
              {isAcceptingInvitation
                ? dictionary.auth.organization.acceptingInvitation
                : dictionary.shared.accept}
            </Button>
            <Button
              variant="outline"
              onClick={handleCancelInvitation}
              disabled={isAcceptingInvitation || isRejectingInvitation}
            >
              {dictionary.shared.cancel}
            </Button>
            <Button
              variant="destructive"
              onClick={handleRejectInvitation}
              disabled={isAcceptingInvitation || isRejectingInvitation}
            >
              {isRejectingInvitation
                ? dictionary.auth.organization.rejectingInvitation
                : dictionary.auth.organization.rejectInvitation}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

function getOrganizationLogo(
  organization: any,
  theme: string | undefined,
): string | undefined {
  const isDark = theme === 'dark';

  const logos = isDark ? organization?.logosDark : organization?.logosLight;

  const logosArray =
    typeof logos === 'string' ? JSON.parse(logos || 'null') : logos;

  return downloadUrl(logosArray, 0);
}
