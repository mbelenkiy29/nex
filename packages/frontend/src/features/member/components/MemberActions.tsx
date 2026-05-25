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
import { useAuthStore } from '@/features/auth/authStore';
import { MemberWithRelationships } from '@project/backend/features/member/memberSchemas';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Link, useNavigate } from '@tanstack/react-router';
import { useState } from 'react';
import {
  LuEye,
  LuHistory,
  LuPencil,
  LuSearch,
  LuTrash2,
  LuBan,
  LuUndo2,
} from 'react-icons/lu';
import { RxDotsHorizontal } from 'react-icons/rx';
import { toast } from 'sonner';

export function MemberActions({
  mode,
  member,
  referrer,
}: {
  mode: 'table' | 'view';
  member: MemberWithRelationships;
  referrer?: string;
}) {
  const dictionary = useAuthStore((state) => state.dictionary);
  const hasPermission = useAuthStore((state) => state.hasPermission);
  const config = useAuthStore((state) => state.config);
  const navigate = useNavigate();

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [disableDialogOpen, setDisableDialogOpen] = useState(false);
  const [restoreDialogOpen, setRestoreDialogOpen] = useState(false);

  const queryClient = useQueryClient();

  const defaultMemberSearch = {
    invitationFilter: {
      statuses: ['pending'],
    },
  };

  const hasPermissionToEdit = hasPermission({
    member: ['update'],
  });

  const hasPermissionToAuditLogs = hasPermission({
    auditLog: ['read'],
  });

  const hasPermissionToDelete = hasPermission({
    member: ['delete'],
  });

  const deleteMutation = useMutation({
    mutationFn: async () => {
      return await apiClient.delete(`api/member/${member.id}`).json<boolean>();
    },
    onSuccess: () => {
      queryClient.resetQueries({
        queryKey: ['member'],
      });

      if (mode === 'view') {
        if (referrer?.startsWith('/member?')) {
          navigate({ to: referrer as any });
        } else {
          navigate({ to: '/member', search: defaultMemberSearch });
        }
      }

      toast.success(dictionary.member.delete.success);
    },
    onError: (error: any) => {
      const errorMessage = error.message || dictionary.shared.errors.unknown;
      console.error('Failed to remove member:', error);
      toast.error(errorMessage);
    },
  });

  const disableMutation = useMutation({
    mutationFn: async () => {
      return await apiClient
        .patch(`api/member/${member.id}/disable`)
        .json<boolean>();
    },
    onSuccess: () => {
      queryClient.resetQueries({
        queryKey: ['member'],
      });
      toast.success('User successfully disabled');
    },
    onError: (error: any) => {
      const errorMessage = error.message || dictionary.shared.errors.unknown;
      console.error('Failed to disable member:', error);
      toast.error(errorMessage);
    },
  });

  const restoreMutation = useMutation({
    mutationFn: async () => {
      return await apiClient
        .patch(`api/member/${member.id}/restore`)
        .json<boolean>();
    },
    onSuccess: () => {
      queryClient.resetQueries({
        queryKey: ['member'],
      });
      toast.success('User successfully restored');
    },
    onError: (error: any) => {
      const errorMessage = error.message || dictionary.shared.errors.unknown;
      console.error('Failed to restore member:', error);
      toast.error(errorMessage);
    },
  });

  if (mode === 'view' && !hasPermissionToEdit && !hasPermissionToDelete) {
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

        <DropdownMenuContent align="end" className="w-40">
          {mode === 'table' && (
            <DropdownMenuLinkItem
              render={
                <Link
                  to={`/member/${member.id}`}
                  search={{
                    referrer: window.location.pathname + window.location.search,
                  }}
                  preload="intent"
                />
              }
            >
              <LuSearch className="text-foreground/50 mr-2 h-4 w-4" />{' '}
              {dictionary.shared.view}
            </DropdownMenuLinkItem>
          )}

          {mode === 'table' && hasPermissionToEdit && (
            <DropdownMenuLinkItem
              render={
                <Link
                  to={`/member/${member.id}/edit`}
                  search={{
                    referrer: window.location.pathname + window.location.search,
                  }}
                  preload="intent"
                />
              }
            >
              <LuPencil className="text-foreground/50 mr-2 h-4 w-4" />{' '}
              {dictionary.shared.edit}
            </DropdownMenuLinkItem>
          )}

          {mode === 'table' && hasPermissionToAuditLogs && (
            <DropdownMenuLinkItem
              render={
                <Link
                  to={`/audit-log`}
                  search={{
                    filter: {
                      member: {
                        id: member.id,
                        fullName: member.fullName,
                      },
                    },
                  }}
                  preload="intent"
                />
              }
            >
              <LuEye className="text-foreground/50 mr-2 h-4 w-4" />{' '}
              {dictionary.member.showActivity}
            </DropdownMenuLinkItem>
          )}

          {hasPermissionToAuditLogs && (
            <DropdownMenuLinkItem
              render={
                <Link
                  to={`/audit-log`}
                  search={{
                    filter: {
                      entityId: member.id,
                    },
                  }}
                  preload="intent"
                />
              }
            >
              <LuHistory className="text-foreground/50 mr-2 h-4 w-4" />{' '}
              {dictionary.auditLog.list.menu}
            </DropdownMenuLinkItem>
          )}

          {hasPermissionToDelete && !member.disabled && (
            <DropdownMenuItem
              onClick={() => setDisableDialogOpen(true)}
              disabled={disableMutation.isPending}
            >
              <LuBan className="text-foreground/50 mr-2 h-4 w-4" />{' '}
              <span>Disable</span>
            </DropdownMenuItem>
          )}

          {hasPermissionToDelete && member.disabled && (
            <DropdownMenuItem
              onClick={() => setRestoreDialogOpen(true)}
              disabled={restoreMutation.isPending}
            >
              <LuUndo2 className="text-foreground/50 mr-2 h-4 w-4" />{' '}
              <span>Restore</span>
            </DropdownMenuItem>
          )}

          {hasPermissionToDelete && !config?.organizationDefaultRole && (
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

      {mode === 'view' && hasPermissionToAuditLogs && (
        <Button
          nativeButton={false}
          variant={'outline'}
          size="sm"
          className="ml-auto flex h-8 whitespace-nowrap"
          render={
            <Link
              to={`/audit-log`}
              search={{
                filter: {
                  member: {
                    id: member.id,
                    fullName: member.fullName,
                  },
                },
              }}
              preload="intent"
            />
          }
        >
          <LuEye className="mr-2 h-4 w-4" /> {dictionary.member.showActivity}
        </Button>
      )}

      {mode === 'view' && hasPermissionToEdit && (
        <Button
          nativeButton={false}
          size="sm"
          className="ml-auto flex h-8"
          render={
            <Link
              to={`/member/${member.id}/edit`}
              search={referrer ? { referrer } : undefined}
              preload="intent"
            />
          }
        >
          <LuPencil className="mr-2 h-4 w-4" /> {dictionary.shared.edit}
        </Button>
      )}

      {deleteDialogOpen && (
        <ConfirmDialog
          title={dictionary.member.delete.confirmTitle}
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

      {disableDialogOpen && (
        <ConfirmDialog
          title="Disable User?"
          confirmText="Disable"
          variant="destructive"
          cancelText={dictionary.shared.cancel}
          onConfirm={() => {
            disableMutation.mutateAsync();
            setDisableDialogOpen(false);
          }}
          onCancel={() => setDisableDialogOpen(false)}
        />
      )}

      {restoreDialogOpen && (
        <ConfirmDialog
          title="Restore User?"
          confirmText="Restore"
          variant="default"
          cancelText={dictionary.shared.cancel}
          onConfirm={() => {
            restoreMutation.mutateAsync();
            setRestoreDialogOpen(false);
          }}
          onCancel={() => setRestoreDialogOpen(false)}
        />
      )}
    </div>
  );
}
