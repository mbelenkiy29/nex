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
import { ConceptWithRelationships } from '@project/backend/features/concept/conceptSchemas';
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

export function ConceptActions({
  mode,
  concept,
  referrer,
}: {
  mode: 'table' | 'view';
  concept: ConceptWithRelationships;
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
    concept: ['update'],
  });

  const hasPermissionToAuditLogs = hasPermission({
    auditLog: ['read'],
  });

  const hasPermissionToDelete = hasPermission({
    concept: ['delete'],
  });

  const deleteMutation = useMutation({
    mutationFn: async () => {
      return await apiClient
        .delete(`api/concept?${objectToQuery({ ids: [concept.id] })}`)
        .json();
    },
    onSuccess: () => {
      queryClient.resetQueries({
        queryKey: ['concept'],
      });

      if (mode === 'view') {
        if (referrer?.startsWith('/concept?')) {
          navigate({ to: referrer as any });
        } else {
          navigate({ to: '/concept' });
        }
      }

      toast.success(dictionary.concept.delete.success);
    },
    onError: (error: any) => {
      toast.error(error.message || dictionary.shared.errors.unknown);
    },
  });

  const hasPermissionToArchive = hasPermission({
    concept: ['archive'],
  });

  const archiveMutation = useMutation({
    mutationFn: async () => {
      return await apiClient
        .put('api/concept/archive', { json: { ids: [concept.id] } })
        .json();
    },
    onSuccess: () => {
      queryClient.resetQueries({
        queryKey: ['concept'],
      });

      if (mode === 'view') {
        if (referrer?.startsWith('/concept?')) {
          navigate({ to: referrer as any });
        } else {
          navigate({ to: '/concept' });
        }
      }

      toast.success(dictionary.concept.archive.success);
    },
    onError: (error: any) => {
      toast.error(error.message || dictionary.shared.errors.unknown);
    },
  });

  const hasPermissionToRestore = hasPermission({
    concept: ['restore'],
  });

  const restoreMutation = useMutation({
    mutationFn: async () => {
      return await apiClient
        .put('api/concept/restore', { json: { ids: [concept.id] } })
        .json();
    },
    onSuccess: () => {
      queryClient.resetQueries({
        queryKey: ['concept'],
      });

      if (mode === 'view') {
        if (referrer?.startsWith('/concept?')) {
          navigate({ to: referrer as any });
        } else {
          navigate({ to: '/concept' });
        }
      }

      toast.success(dictionary.concept.restore.success);
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
                  to={`/concept/$id`}
                  params={{ id: concept.id }}
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
                  to={`/concept/$id/edit`}
                  params={{ id: concept.id }}
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
                      entityId: concept.id,
                    },
                  }}
                />
              }
            >
              <LuHistory className="text-foreground/50 mr-2 h-4 w-4" />{' '}
              {dictionary.auditLog.list.menu}
            </DropdownMenuLinkItem>
          )}

          {hasPermissionToArchive && !concept?.archivedAt && (
            <DropdownMenuItem
              onClick={() => setArchiveDialogOpen(true)}
              disabled={archiveMutation.isPending || restoreMutation.isPending}
            >
              <LuArchive className="text-foreground/50 mr-2 h-4 w-4" />{' '}
              <span>{dictionary.shared.archive}</span>
            </DropdownMenuItem>
          )}

          {hasPermissionToRestore && Boolean(concept?.archivedAt) && (
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
              to={`/concept/$id/edit`}
              params={{ id: concept.id }}
              search={referrer ? { referrer } : undefined}
            />
          }
        >
          <LuPencil className="mr-2 h-4 w-4" /> {dictionary.shared.edit}
        </Button>
      )}

      {archiveDialogOpen && (
        <ConfirmDialog
          title={dictionary.concept.archive.confirmTitle}
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
          title={dictionary.concept.restore.confirmTitle}
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
          title={dictionary.concept.delete.confirmTitle}
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
