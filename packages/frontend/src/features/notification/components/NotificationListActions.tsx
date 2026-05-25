import { DataTableViewOptions } from '@/shared/components/dataTable/DataTableViewButton';
import { Button } from '@/shared/components/ui/button';
import { useAuthStore } from '@/features/auth/authStore';
import { Notification } from '@project/backend/prisma/prismaTypes';
import { Link } from '@tanstack/react-router';
import { Table } from '@tanstack/react-table';
import { useShallow } from 'zustand/react/shallow';
import {
  LuPlus,
  LuCheck,
  LuLoader,
  LuCircleDashed,
  LuRefreshCw,
} from 'react-icons/lu';
import { useIsFetching, useMutation } from '@tanstack/react-query';
import { apiClient } from '@/shared/lib/apiClient';
import { queryClient } from '@/shared/lib/queryClient';
import { toast } from 'sonner';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/shared/components/ui/dropdown-menu';
import { RxDotsHorizontal } from 'react-icons/rx';

export function NotificationListActions({
  table,
}: {
  table: Table<Notification>;
}) {
  const { dictionary, hasPermission } = useAuthStore(
    useShallow((state) => ({
      dictionary: state.dictionary,
      hasPermission: state.hasPermission,
    })),
  );

  const isFetching = useIsFetching({ queryKey: ['notification'] });

  const hasPermissionToCreate = hasPermission({
    notification: ['create'],
  });

  const markSelectedAsReadMutation = useMutation({
    mutationFn: async () => {
      const model = table.getFilteredSelectedRowModel();
      const ids = model.rows.map((r) => r.original.id);

      if (!ids.length) {
        throw new Error('No notifications selected');
      }

      return await apiClient
        .post('api/notification/mark-as-read', {
          json: { ids },
        })
        .json();
    },
    onSuccess: () => {
      table.resetRowSelection();
      queryClient.invalidateQueries({ queryKey: ['notification'] });
      toast.success(dictionary.notification.markAsReadSuccess);
    },
    onError: (error: any) => {
      toast.error(error.message || dictionary.shared.errors.unknown);
    },
  });

  const markSelectedAsUnreadMutation = useMutation({
    mutationFn: async () => {
      const model = table.getFilteredSelectedRowModel();
      const ids = model.rows.map((r) => r.original.id);

      if (!ids.length) {
        throw new Error('No notifications selected');
      }

      return await apiClient
        .post('api/notification/mark-as-unread', {
          json: { ids },
        })
        .json();
    },
    onSuccess: () => {
      table.resetRowSelection();
      queryClient.invalidateQueries({ queryKey: ['notification'] });
      toast.success(dictionary.notification.markAsUnreadSuccess);
    },
    onError: (error: any) => {
      toast.error(error.message || dictionary.shared.errors.unknown);
    },
  });

  const selectedCount = table.getFilteredSelectedRowModel().rows.length;

  const isLoading =
    markSelectedAsReadMutation.isPending ||
    markSelectedAsUnreadMutation.isPending;

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <Button variant="outline" size="sm" className="ml-auto flex h-8" />
          }
        >
          {isLoading ? (
            <LuLoader className="h-4 w-4 animate-spin" />
          ) : (
            <RxDotsHorizontal className="h-4 w-4" />
          )}
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem
            onClick={() => markSelectedAsReadMutation.mutate()}
            disabled={!selectedCount || markSelectedAsReadMutation.isPending}
          >
            <LuCheck className="text-foreground/50 mr-2 h-4 w-4" />
            <span>{dictionary.notification.markAsRead}</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => markSelectedAsUnreadMutation.mutate()}
            disabled={!selectedCount || markSelectedAsUnreadMutation.isPending}
          >
            <LuCircleDashed className="text-foreground/50 mr-2 h-4 w-4" />
            <span>{dictionary.notification.markAsUnread}</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <DataTableViewOptions table={table} />

      <Button
        variant="outline"
        size="sm"
        className="ml-auto flex h-8"
        onClick={() =>
          queryClient.invalidateQueries({ queryKey: ['notification'] })
        }
        disabled={!!isFetching}
      >
        {isFetching ? (
          <LuLoader className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <LuRefreshCw className="mr-2 h-4 w-4" />
        )}
        <span>{dictionary.shared.refresh}</span>
      </Button>

      {hasPermissionToCreate && (
        <Button
          nativeButton={false}
          size="sm"
          className="ml-auto flex h-8 whitespace-nowrap"
          render={<Link to="/notification/send" />}
        >
          <LuPlus className="mr-2 h-4 w-4" />
          <span>{dictionary.notification.send.menu}</span>
        </Button>
      )}
    </>
  );
}
