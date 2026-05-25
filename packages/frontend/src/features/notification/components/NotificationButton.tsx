import { useQuery } from '@tanstack/react-query';
import { Link } from '@tanstack/react-router';
import { LuBell } from 'react-icons/lu';
import { apiClient } from '@/shared/lib/apiClient';
import { Badge } from '@/shared/components/ui/badge';
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from '@/shared/components/ui/sidebar';
import { useAuthStore } from '@/features/auth/authStore';

export function NotificationButton({ isSidebar }: { isSidebar?: boolean }) {
  const dictionary = useAuthStore((state) => state.dictionary);
  const currentUser = useAuthStore((state) => state.currentUser);

  const { data } = useQuery({
    queryKey: ['notification', 'unread-count'],
    queryFn: async ({ signal }) => {
      return await apiClient
        .get('api/notification/unread-count', { signal })
        .json<{ count: number }>();
    },
    enabled: !!currentUser,
    refetchInterval: 30000, // Refetch every 30 seconds
    staleTime: 0, // Always consider data stale to ensure fresh fetches
  });

  const unreadCount = data?.count || 0;

  if (isSidebar) {
    return (
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton
            render={<Link to="/notification" />}
            tooltip={dictionary.notification.menu}
          >
            <div className="relative">
              <LuBell className="h-4 w-4" />
              {unreadCount > 0 && (
                <Badge
                  variant="destructive"
                  className="absolute -top-1 -right-1 flex h-4 min-w-4 items-center justify-center p-0 text-[10px]"
                >
                  {unreadCount > 99 ? '99+' : unreadCount}
                </Badge>
              )}
            </div>
            <span>{dictionary.notification.menu}</span>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    );
  }

  return (
    <Link
      to="/notification"
      className="hover:bg-accent hover:text-accent-foreground relative rounded-md p-2 transition-colors"
    >
      <LuBell className="h-5 w-5" />
      {unreadCount > 0 && (
        <Badge
          variant="destructive"
          className="absolute -top-1 -right-1 flex h-5 min-w-5 items-center justify-center p-0 text-[10px]"
        >
          {unreadCount > 99 ? '99+' : unreadCount}
        </Badge>
      )}
    </Link>
  );
}
