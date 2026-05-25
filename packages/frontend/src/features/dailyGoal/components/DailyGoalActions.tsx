import { ConfirmDialog } from '@/shared/components/ConfirmDialog';
import { Button } from '@/shared/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLinkItem,
  DropdownMenuTrigger,
} from '@/shared/components/ui/dropdown-menu';
import { apiClient } from '@/shared/lib/apiClient';
import { objectToQuery } from '@/shared/lib/objectToQuery';
import { useAuthStore } from '@/features/auth/authStore';
import { DailyGoalWithRelationships } from '@project/backend/features/dailyGoal/dailyGoalSchemas';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Link, useNavigate } from '@tanstack/react-router';
import { useState } from 'react';
import {
  LuArchive,
  LuEye,
  LuHistory,
  LuPencil,
  LuTrash2,
  LuUndo2,
} from 'react-icons/lu';
import { RxDotsHorizontal } from 'react-icons/rx';
import { toast } from 'sonner';

export function DailyGoalActions({
  mode,
  dailyGoal,
  referrer,
}: {
  mode: 'table' | 'view';
  dailyGoal: DailyGoalWithRelationships;
  referrer?: string;
}) {
  const dictionary = useAuthStore((state) => state.dictionary);
  const hasPermission = useAuthStore((state) => state.hasPermission);
  const navigate = useNavigate();

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [archiveDialogOpen, setArchiveDialogOpen] = useState(false);
  const [restoreDialogOpen, setRestoreDialogOpen] = useState(false);

  const queryClient = useQueryClient();

  const hasPermissionToEdit = hasPermission({
    dailyGoal: ['update'],
  });

  const hasPermissionToAuditLogs = hasPermission({
    auditLog: ['read'],
  });

  const hasPermissionToDelete = hasPermission({
    dailyGoal: ['delete'],
  });

  const deleteMutation = useMutation({
    mutationFn: async () => {
      return await apiClient
        .delete(`api/daily-goal?${objectToQuery({ ids: [dailyGoal.id] })}`)
        .json();
    },
    onSuccess: () => {
      queryClient.resetQueries({
        queryKey: ['dailyGoal'],
      });

      if (mode === 'view') {
        if (referrer?.startsWith('/daily-goal?')) {
          navigate({ to: referrer as any });
        } else {
          navigate({ to: '/daily-goal' });
        }
      }

      toast.success(dictionary.dailyGoal.delete.success);
    },
    onError: (error: any) => {
      toast.error(error.message || dictionary.shared.errors.unknown);
    },
  });

  const hasPermissionToArchive = hasPermission({
    dailyGoal: ['archive'],
  });

  const archiveMutation = useMutation({
    mutationFn: async () => {
      return await apiClient
        .put('api/daily-goal/archive', { json: { ids: [dailyGoal.id] } })
        .json();
    },
    onSuccess: () => {
      queryClient.resetQueries({
        queryKey: ['dailyGoal'],
      });

      if (mode === 'view') {
        if (referrer?.startsWith('/daily-goal?')) {
          navigate({ to: referrer as any });
        } else {
          navigate({ to: '/daily-goal' });
        }
      }

      toast.success(dictionary.dailyGoal.archive.success);
    },
    onError: (error: any) => {
      toast.error(error.message || dictionary.shared.errors.unknown);
    },
  });

  const hasPermissionToRestore = hasPermission({
    dailyGoal: ['restore'],
  });

  const restoreMutation = useMutation({
    mutationFn: async () => {
      return await apiClient
        .put('api/daily-goal/restore', { json: { ids: [dailyGoal.id] } })
        .json();
    },
    onSuccess: () => {
      queryClient.resetQueries({
        queryKey: ['dailyGoal'],
      });

      if (mode === 'view') {
        if (referrer?.startsWith('/daily-goal?')) {
          navigate({ to: referrer as any });
        } else {
          navigate({ to: '/daily-goal' });
        }
      }

      toast.success(dictionary.dailyGoal.restore.success);
    },
    onError: (error: any) => {
      toast.error(error.message || dictionary.shared.errors.unknown);
    },
  });

  if (
    mode === 'view' &&
    !hasPermissionToEdit &&
    !hasPermissionToDelete &&
    !hasPermissionToArchive &&
    !hasPermissionToRestore
  ) {
    return null;
  }

  return (
    <div className="flex justify-end gap-2">
      <DropdownMenu>
        {mode === 'table' && (
          <DropdownMenuTrigger
            render={
              <Button
                variant="ghost"
                className="aria-expanded:bg-muted flex h-8 w-8 p-0"
              />
            }
          >
            <RxDotsHorizontal className="h-4 w-4" />
            <span className="sr-only">{dictionary.shared.openMenu}</span>
          </DropdownMenuTrigger>
        )}

        {mode === 'view' && (
          <DropdownMenuTrigger
            render={
              <Button
                variant="outline"
                size="sm"
                className="ml-auto flex h-8"
              />
            }
          >
            <RxDotsHorizontal className="h-4 w-4" />
          </DropdownMenuTrigger>
        )}

        <DropdownMenuContent align="end" className="w-[160px]">
          {mode === 'table' && (
            <DropdownMenuLinkItem
              render={
                <Link
                  to={`/daily-goal/$id`}
                  params={{ id: dailyGoal.id }}
                  search={{
                    referrer: window.location.pathname + window.location.search,
                  }}
                />
              }
            >
              <LuEye className="text-foreground/50 mr-2 h-4 w-4" />{' '}
              {dictionary.shared.view}
            </DropdownMenuLinkItem>
          )}

          {mode === 'table' && hasPermissionToEdit && (
            <DropdownMenuLinkItem
              render={
                <Link
                  to={`/daily-goal/$id/edit`}
                  params={{ id: dailyGoal.id }}
                  search={{
                    referrer: window.location.pathname + window.location.search,
                  }}
                />
              }
            >
              <LuPencil className="text-foreground/50 mr-2 h-4 w-4" />{' '}
              {dictionary.shared.edit}
            </DropdownMenuLinkItem>
          )}

          {hasPermissionToAuditLogs && (
            <DropdownMenuLinkItem
              render={
                <Link
                  to={`/audit-log`}
                  search={{
                    filter: {
                      entityId: dailyGoal.id,
                    },
                  }}
                />
              }
            >
              <LuHistory className="text-foreground/50 mr-2 h-4 w-4" />{' '}
              {dictionary.auditLog.list.menu}
            </DropdownMenuLinkItem>
          )}

          {hasPermissionToArchive && !dailyGoal?.archivedAt && (
            <DropdownMenuItem
              onClick={() => setArchiveDialogOpen(true)}
              disabled={archiveMutation.isPending || restoreMutation.isPending}
            >
              <LuArchive className="text-foreground/50 mr-2 h-4 w-4" />{' '}
              <span>{dictionary.shared.archive}</span>
            </DropdownMenuItem>
          )}

          {hasPermissionToRestore && Boolean(dailyGoal?.archivedAt) && (
            <DropdownMenuItem
              onClick={() => setRestoreDialogOpen(true)}
              disabled={archiveMutation.isPending || restoreMutation.isPending}
            >
              <LuUndo2 className="text-foreground/50 mr-2 h-4 w-4" />{' '}
              <span>{dictionary.shared.restore}</span>
            </DropdownMenuItem>
          )}

          {hasPermissionToDelete && (
            <DropdownMenuItem
              onClick={() => setDeleteDialogOpen(true)}
              disabled={deleteMutation.isPending}
            >
              <LuTrash2 className="text-foreground/50 mr-2 h-4 w-4" />{' '}
              <span>{dictionary.shared.delete}</span>
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      {mode === 'view' && hasPermissionToEdit && (
        <Button
          nativeButton={false}
          size="sm"
          className="ml-auto flex h-8"
          render={
            <Link
              to={`/daily-goal/$id/edit`}
              params={{ id: dailyGoal.id }}
              search={referrer ? { referrer } : undefined}
            />
          }
        >
          <LuPencil className="mr-2 h-4 w-4" /> {dictionary.shared.edit}
        </Button>
      )}

      {archiveDialogOpen && (
        <ConfirmDialog
          title={dictionary.dailyGoal.archive.confirmTitle}
          confirmText={dictionary.shared.archive}
          variant="destructive"
          cancelText={dictionary.shared.cancel}
          onConfirm={() => {
            archiveMutation.mutateAsync();
            setArchiveDialogOpen(false);
          }}
          onCancel={() => setArchiveDialogOpen(false)}
        />
      )}

      {restoreDialogOpen && (
        <ConfirmDialog
          title={dictionary.dailyGoal.restore.confirmTitle}
          confirmText={dictionary.shared.restore}
          variant="destructive"
          cancelText={dictionary.shared.cancel}
          onConfirm={() => {
            restoreMutation.mutateAsync();
            setRestoreDialogOpen(false);
          }}
          onCancel={() => setRestoreDialogOpen(false)}
        />
      )}

      {deleteDialogOpen && (
        <ConfirmDialog
          title={dictionary.dailyGoal.delete.confirmTitle}
          confirmText={dictionary.shared.delete}
          variant="destructive"
          cancelText={dictionary.shared.cancel}
          onConfirm={() => {
            deleteMutation.mutateAsync();
            setDeleteDialogOpen(false);
          }}
          onCancel={() => setDeleteDialogOpen(false)}
        />
      )}
    </div>
  );
}
