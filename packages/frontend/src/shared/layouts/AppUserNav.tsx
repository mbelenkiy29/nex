import { useMutation } from '@tanstack/react-query';
import { useNavigate, useRouter } from '@tanstack/react-router';
import {
  LuChevronsUpDown,
  LuCreditCard,
  LuFile,
  LuLock,
  LuLogOut,
  LuMail,
  LuPlug,
  LuSettings,
  LuShield,
  LuUser,
} from 'react-icons/lu';
import { useShallow } from 'zustand/react/shallow';
import { featureIcons } from '@/features/featureIcons';
import { memberAcronym } from '@/features/member/memberAcronym';
import { downloadUrl } from '@/shared/lib/downloadUrl';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/shared/components/ui/avatar';
import { Button } from '@/shared/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
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
import { toast } from 'sonner';
import { useAuthStore } from '@/features/auth/authStore';

export function AppUserNav({ isSidebar }: { isSidebar?: boolean }) {
  const navigate = useNavigate();
  const router = useRouter();
  const {
    dictionary,
    currentUser,
    currentMember,
    currentOrganization,
    config,
    isPlatformAdmin,
  } = useAuthStore(
    useShallow((state) => ({
      dictionary: state.dictionary,
      currentUser: state.currentUser,
      currentMember: state.currentMember,
      currentOrganization: state.currentOrganization,
      config: state.config,
      isPlatformAdmin: state.isPlatformAdmin,
    })),
  );
  const signOut = useAuthStore((state) => state.signOut);
  const hasPermission = useAuthStore((state) => state.hasPermission);
  const { isMobile, setOpenMobile } = useSidebar();

  const hasPermissionToApiKeyRead =
    isPlatformAdmin &&
    hasPermission({
      apiKey: ['read'],
    });

  const hasPermissionToUseMcp =
    isPlatformAdmin &&
    hasPermission({
      mcp: ['use'],
    });

  const showApplicationSettings =
    isPlatformAdmin &&
    config?.organizationMode === 'single' &&
    Boolean(currentOrganization?.id) &&
    hasPermission({ organization: ['update'] });

  const hasPermissionToReadSubscription =
    isPlatformAdmin &&
    config?.subscriptionMode !== 'disabled' &&
    hasPermission({
      subscription: ['read'],
    });

  const signOutMutation = useMutation({
    mutationFn: async () => {
      await signOut();
    },
    onSuccess: async () => {
      router.navigate({ to: '/' });
    },
    onError: (error: any) => {
      toast.error(error.message || dictionary.shared.errors.unknown);
    },
  });

  if (isSidebar) {
    return (
      <>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <SidebarMenuButton
                    size="lg"
                    className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                  />
                }
              >
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage
                    src={downloadUrl(currentMember?.avatars)}
                    alt={currentUser?.email}
                    className="object-cover"
                  />
                  <AvatarFallback className="rounded-lg">
                    {memberAcronym(currentUser, currentMember)}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">
                    {currentMember?.fullName}
                  </span>
                  <span className="truncate text-xs">{currentUser?.email}</span>
                </div>
                <LuChevronsUpDown className="ml-auto size-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
                side={isMobile ? 'bottom' : 'right'}
                align="end"
                sideOffset={4}
              >
                <DropdownMenuLabel className="p-0 font-normal">
                  <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                    <Avatar className="h-8 w-8 rounded-lg">
                      <AvatarImage
                        src={downloadUrl(currentMember?.avatars)}
                        alt={currentUser?.email}
                        className="object-cover"
                      />
                      <AvatarFallback className="rounded-lg">
                        {memberAcronym(currentUser, currentMember)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="grid flex-1 text-left text-sm leading-tight">
                      <span className="truncate font-medium">
                        {currentMember?.fullName}
                      </span>
                      <span className="truncate text-xs">
                        {currentUser?.email}
                      </span>
                    </div>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem
                    onClick={() => {
                      setOpenMobile(false);
                      navigate({ to: '/auth/profile' });
                    }}
                  >
                    <LuUser className="mr-2 h-4 w-4" />
                    <span>{dictionary.auth.profile.menu}</span>
                  </DropdownMenuItem>
                  {hasPermissionToReadSubscription && (
                    <DropdownMenuItem
                      onClick={() => {
                        setOpenMobile(false);
                        navigate({ to: '/subscription' });
                      }}
                    >
                      <LuCreditCard className="mr-2 h-4 w-4" />
                      <span>{dictionary.subscription.menu}</span>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem
                    onClick={() => {
                      setOpenMobile(false);
                      navigate({ to: '/auth/email-change' });
                    }}
                  >
                    <LuMail className="mr-2 h-4 w-4" />
                    <span>{dictionary.auth.emailChange.menu}</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => {
                      setOpenMobile(false);
                      navigate({ to: '/auth/password-change' });
                    }}
                  >
                    <LuLock className="mr-2 h-4 w-4" />
                    <span>{dictionary.auth.passwordChange.menu}</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => {
                      setOpenMobile(false);
                      navigate({ to: '/account' });
                    }}
                  >
                    <LuShield className="mr-2 h-4 w-4" />
                    <span>{dictionary.account.privacyTabLabel}</span>
                  </DropdownMenuItem>
                  {hasPermissionToApiKeyRead ? (
                    <DropdownMenuItem
                      onClick={() => {
                        setOpenMobile(false);
                        navigate({ to: '/api-key' });
                      }}
                    >
                      <featureIcons.apiKey className="mr-2 h-4 w-4" />
                      <span>{dictionary.apiKey.list.menu}</span>
                    </DropdownMenuItem>
                  ) : null}
                  {hasPermissionToApiKeyRead ? (
                    <DropdownMenuItem
                      onClick={() => {
                        setOpenMobile(false);
                        navigate({ to: '/api-docs' });
                      }}
                    >
                      <LuFile className="mr-2 h-4 w-4" />
                      <span>{dictionary.apiKey.docs.menu}</span>
                    </DropdownMenuItem>
                  ) : null}
                  {hasPermissionToUseMcp ? (
                    <DropdownMenuItem
                      onClick={() => {
                        setOpenMobile(false);
                        navigate({ to: '/mcp-docs' });
                      }}
                    >
                      <LuPlug className="mr-2 h-4 w-4" />
                      <span>{dictionary.mcp.menu}</span>
                    </DropdownMenuItem>
                  ) : null}
                  {showApplicationSettings ? (
                    <DropdownMenuItem
                      onClick={() => {
                        setOpenMobile(false);
                        navigate({
                          to: `/organization/${currentOrganization!.id}/edit`,
                        });
                      }}
                    >
                      <LuSettings className="mr-2 h-4 w-4" />
                      <span>
                        {dictionary.organization.applicationSettings.menu}
                      </span>
                    </DropdownMenuItem>
                  ) : null}
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => {
                    setOpenMobile(false);
                    signOutMutation.mutateAsync();
                  }}
                >
                  <LuLogOut className="mr-2 h-4 w-4" />
                  <span>{dictionary.auth.signOut.menu}</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </>
    );
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <Button
              variant="ghost"
              className="relative flex justify-start gap-4"
            />
          }
        >
          <Avatar className="h-8 w-8 rounded-full">
            <AvatarImage
              src={downloadUrl(currentMember?.avatars)}
              alt={currentUser?.email}
              className="object-cover"
            />
            <AvatarFallback className="bg-background text-muted-foreground">
              {memberAcronym(currentUser, currentMember)}
            </AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end">
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm leading-none font-medium">
                {currentMember?.fullName}
              </p>
              <p className="text-muted-foreground text-xs leading-none">
                {currentUser?.email}
              </p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem onClick={() => navigate({ to: '/auth/profile' })}>
              <LuUser className="mr-2 h-4 w-4" />
              <span>{dictionary.auth.profile.menu}</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => navigate({ to: '/auth/email-change' })}
            >
              <LuMail className="mr-2 h-4 w-4" />
              <span>{dictionary.auth.emailChange.menu}</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => navigate({ to: '/auth/password-change' })}
            >
              <LuLock className="mr-2 h-4 w-4" />
              <span>{dictionary.auth.passwordChange.menu}</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate({ to: '/account' })}>
              <LuShield className="mr-2 h-4 w-4" />
              <span>{dictionary.account.privacyTabLabel}</span>
            </DropdownMenuItem>
            {hasPermissionToReadSubscription && (
              <DropdownMenuItem
                onClick={() => navigate({ to: '/subscription' })}
              >
                <LuCreditCard className="mr-2 h-4 w-4" />
                <span>{dictionary.subscription.menu}</span>
              </DropdownMenuItem>
            )}
            {hasPermissionToApiKeyRead ? (
              <DropdownMenuItem onClick={() => navigate({ to: '/api-key' })}>
                <featureIcons.apiKey className="mr-2 h-4 w-4" />
                <span>{dictionary.apiKey.list.menu}</span>
              </DropdownMenuItem>
            ) : null}
            {hasPermissionToApiKeyRead ? (
              <DropdownMenuItem onClick={() => navigate({ to: '/api-docs' })}>
                <LuFile className="mr-2 h-4 w-4" />
                <span>{dictionary.apiKey.docs.menu}</span>
              </DropdownMenuItem>
            ) : null}
            {hasPermissionToUseMcp ? (
              <DropdownMenuItem onClick={() => navigate({ to: '/mcp-docs' })}>
                <LuPlug className="mr-2 h-4 w-4" />
                <span>{dictionary.mcp.menu}</span>
              </DropdownMenuItem>
            ) : null}
            {showApplicationSettings ? (
              <DropdownMenuItem
                onClick={() =>
                  navigate({
                    to: `/organization/${currentOrganization!.id}/edit`,
                  })
                }
              >
                <LuSettings className="mr-2 h-4 w-4" />
                <span>{dictionary.organization.applicationSettings.menu}</span>
              </DropdownMenuItem>
            ) : null}
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => signOutMutation.mutateAsync()}>
            <LuLogOut className="mr-2 h-4 w-4" />
            <span>{dictionary.auth.signOut.menu}</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
