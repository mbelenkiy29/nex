import { invitationExporterMapper } from '@/features/member/invitationExporterMapper';
import { ConfirmDialog } from '@/shared/components/ConfirmDialog';
import { DataTableViewOptions } from '@/shared/components/dataTable/DataTableViewButton';
import { DataTableSort } from '@/shared/components/dataTable/dataTableSchemas';
import { dataTableSortToPrisma } from '@/shared/components/dataTable/dataTableSortToPrisma';
import { Button } from '@/shared/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLinkItem,
  DropdownMenuTrigger,
} from '@/shared/components/ui/dropdown-menu';
import { apiClient } from '@/shared/lib/apiClient';
import { csvExporter } from '@/shared/lib/csvExporter';
import { dictionaryFormat } from '@/shared/lib/dictionaryFormat';
import { objectToQuery } from '@/shared/lib/objectToQuery';
import { useAuthStore } from '@/features/auth/authStore';
import {
  invitationFilterInputSchema,
  InvitationWithRelationships,
} from '@project/backend/features/invitation/invitationSchemas';
import {
  useIsFetching,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import { Link } from '@tanstack/react-router';
import { Table } from '@tanstack/react-table';
import { useState } from 'react';
import { useShallow } from 'zustand/react/shallow';
import {
  LuBan,
  LuFileSpreadsheet,
  LuLoader,
  LuMail,
  LuRefreshCw,
} from 'react-icons/lu';
import { MdUpload } from 'react-icons/md';
import { RxDotsHorizontal } from 'react-icons/rx';
import { toast } from 'sonner';
import { z } from 'zod';

export function InvitationListActions({
  table,
  count,
  filter,
  sorting,
}: {
  filter: z.input<typeof invitationFilterInputSchema>;
  sorting: DataTableSort;
  count?: number;
  table: Table<InvitationWithRelationships>;
}) {
  const { dictionary, hasPermission, locale } = useAuthStore(
    useShallow((state) => ({
      dictionary: state.dictionary,
      hasPermission: state.hasPermission,
      locale: state.locale,
    })),
  );
  const queryClient = useQueryClient();
  const isFetching = useIsFetching({ queryKey: ['invitation'] });

  const [cancelManyDialogOpen, setCancelManyDialogOpen] = useState(false);
  const [resendManyDialogOpen, setResendManyDialogOpen] = useState(false);

  const hasPermissionToCancel = hasPermission({
    invitation: ['cancel'],
  });

  const hasPermissionToResend = hasPermission({
    invitation: ['resend'],
  });

  const hasPermissionToImport = hasPermission({
    member: ['import'],
  });

  const hasPermissionToCreate = hasPermission({
    invitation: ['create'],
  });

  const hasPermissionToExport = hasPermission({
    invitation: ['export'],
  });

  const exportMutation = useMutation({
    mutationFn: () => {
      return apiClient
        .get(
          `api/member/invitation?${objectToQuery({
            filter: filter,
            orderBy: dataTableSortToPrisma(sorting),
          })}`,
        )
        .json<{
          count: number;
          invitations: InvitationWithRelationships[];
        }>();
    },
    onSuccess: (data) => {
      csvExporter(
        invitationExporterMapper(data.invitations, { dictionary, locale }),
        dictionary.invitation.fields,
        'invitations',
      );
      toast.success(dictionary.invitation.export.success);
    },
    onError: (error: any) => {
      toast.error(error.message || dictionary.shared.errors.unknown);
    },
  });

  const cancelManyMutation = useMutation({
    mutationFn: async () => {
      const model = table.getFilteredSelectedRowModel();
      const invitations = model.rows
        .map((r) => r.original)
        .filter((inv) => inv.status === 'pending');

      if (!invitations.length) {
        throw new Error(dictionary.invitation.cancelMany.noSelection);
      }

      const results = await Promise.allSettled(
        invitations.map(async (invitation) => {
          await apiClient
            .delete(`api/member/invitation/${invitation.id}`)
            .json<boolean>();
          return { success: true, invitation };
        }),
      );

      const succeeded = results.filter((r) => r.status === 'fulfilled').length;
      const failed = results.filter((r) => r.status === 'rejected').length;

      const errors = results
        .filter((r): r is PromiseRejectedResult => r.status === 'rejected')
        .map((r) => r.reason.message);

      return { succeeded, failed, errors, total: invitations.length };
    },
    onSuccess: (data) => {
      table.resetRowSelection();
      queryClient.resetQueries({
        queryKey: ['invitation'],
      });

      if (data.failed === 0) {
        toast.success(dictionary.invitation.cancelMany.success);
      } else if (data.succeeded === 0) {
        toast.error(
          `${dictionary.shared.errors.unknown}: ${data.errors.join(', ')}`,
        );
      } else {
        toast.warning(
          `${data.succeeded} of ${data.total} invitations cancelled. ${data.failed} failed: ${data.errors.join(', ')}`,
        );
      }
    },
    onError: (error: any) => {
      const errorMessage = error.message || dictionary.shared.errors.unknown;
      console.error('Failed to cancel invitations:', error);
      toast.error(errorMessage);
    },
  });

  const resendManyMutation = useMutation({
    mutationFn: async () => {
      const model = table.getFilteredSelectedRowModel();
      const invitations = model.rows
        .map((r) => r.original)
        .filter((inv) => inv.status === 'pending');

      if (!invitations.length) {
        throw new Error(dictionary.invitation.resendMany.noSelection);
      }

      const results = await Promise.allSettled(
        invitations.map(async (invitation) => {
          await apiClient
            .post(`api/member/invitation/${invitation.id}/resend`)
            .json();
          return { success: true, invitation };
        }),
      );

      const succeeded = results.filter((r) => r.status === 'fulfilled').length;
      const failed = results.filter((r) => r.status === 'rejected').length;

      const errors = results
        .filter((r): r is PromiseRejectedResult => r.status === 'rejected')
        .map((r) => r.reason.message);

      return { succeeded, failed, errors, total: invitations.length };
    },
    onSuccess: (data) => {
      table.resetRowSelection();
      queryClient.resetQueries({
        queryKey: ['invitation'],
      });

      if (data.failed === 0) {
        toast.success(dictionary.invitation.resendMany.success);
      } else if (data.succeeded === 0) {
        toast.error(
          `${dictionary.shared.errors.unknown}: ${data.errors.join(', ')}`,
        );
      } else {
        toast.warning(
          `${data.succeeded} of ${data.total} invitations resent. ${data.failed} failed: ${data.errors.join(', ')}`,
        );
      }
    },
    onError: (error: any) => {
      const errorMessage = error.message || dictionary.shared.errors.unknown;
      console.error('Failed to resend invitations:', error);
      toast.error(errorMessage);
    },
  });

  const selectedRows = table.getFilteredSelectedRowModel().rows;
  const pendingSelectedCount = selectedRows.filter(
    (r) => r.original.status === 'pending',
  ).length;

  const isLoading =
    cancelManyMutation.isPending ||
    resendManyMutation.isPending ||
    exportMutation.isPending;

  const hasAnyDropdownPermission =
    hasPermissionToCancel ||
    hasPermissionToResend ||
    hasPermissionToExport ||
    hasPermissionToImport;

  return (
    <>
      {hasAnyDropdownPermission && (
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button
                variant="outline"
                size="sm"
                className="ml-auto flex h-8"
              />
            }
          >
            {isLoading ? (
              <LuLoader className="h-4 w-4 animate-spin" />
            ) : (
              <RxDotsHorizontal className="h-4 w-4" />
            )}
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            {hasPermissionToCancel && (
              <DropdownMenuItem
                onClick={() => setCancelManyDialogOpen(true)}
                disabled={!pendingSelectedCount || cancelManyMutation.isPending}
              >
                <LuBan className="text-foreground/50 mr-2 h-4 w-4" />{' '}
                <span>{dictionary.invitation.actions.cancel}</span>
              </DropdownMenuItem>
            )}
            {hasPermissionToResend && (
              <DropdownMenuItem
                onClick={() => setResendManyDialogOpen(true)}
                disabled={!pendingSelectedCount || resendManyMutation.isPending}
              >
                <LuMail className="text-foreground/50 mr-2 h-4 w-4" />{' '}
                <span>{dictionary.invitation.actions.resend}</span>
              </DropdownMenuItem>
            )}
            {hasPermissionToExport && (
              <DropdownMenuItem
                onClick={() => exportMutation.mutateAsync()}
                disabled={!count || exportMutation.isPending}
              >
                <LuFileSpreadsheet className="text-foreground/50 mr-2 h-4 w-4" />{' '}
                <span>{dictionary.shared.exportToCsv}</span>
              </DropdownMenuItem>
            )}
            {hasPermissionToImport && (
              <DropdownMenuLinkItem
                render={<Link to={`/member/importer`} preload="intent" />}
              >
                <MdUpload className="text-foreground/50 mr-2 h-4 w-4" />{' '}
                <span>{dictionary.shared.importer.title}</span>
              </DropdownMenuLinkItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      )}

      <DataTableViewOptions table={table} />

      <Button
        variant="outline"
        size="sm"
        className="ml-auto flex h-8"
        onClick={() =>
          queryClient.invalidateQueries({ queryKey: ['invitation'] })
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
          render={<Link to={`/member/new`} preload="intent" />}
        >
          <LuMail className="mr-2 h-4 w-4" />
          <span className="whitespace-nowrap">
            {dictionary.member.new.menu}
          </span>
        </Button>
      )}

      {cancelManyDialogOpen && (
        <ConfirmDialog
          title={dictionary.invitation.cancelMany.confirmTitle}
          description={dictionaryFormat(
            dictionary.invitation.cancelMany.confirmDescription,
            pendingSelectedCount,
          )}
          confirmText={dictionary.invitation.actions.cancel}
          variant="destructive"
          cancelText={dictionary.shared.cancel}
          onConfirm={() => {
            cancelManyMutation.mutateAsync();
            setCancelManyDialogOpen(false);
          }}
          onCancel={() => setCancelManyDialogOpen(false)}
        />
      )}

      {resendManyDialogOpen && (
        <ConfirmDialog
          title={dictionary.invitation.resendMany.confirmTitle}
          description={dictionaryFormat(
            dictionary.invitation.resendMany.confirmDescription,
            pendingSelectedCount,
          )}
          confirmText={dictionary.invitation.actions.resend}
          cancelText={dictionary.shared.cancel}
          onConfirm={() => {
            resendManyMutation.mutateAsync();
            setResendManyDialogOpen(false);
          }}
          onCancel={() => setResendManyDialogOpen(false)}
        />
      )}
    </>
  );
}
