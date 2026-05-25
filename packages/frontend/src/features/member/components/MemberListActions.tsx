import { memberExporterMapper } from '@/features/member/memberExporterMapper';
import { ConfirmDialog } from '@/shared/components/ConfirmDialog';
import { DataTableViewOptions } from '@/shared/components/dataTable/DataTableViewButton';
import { DataTableSort } from '@/shared/components/dataTable/dataTableSchemas';
import { dataTableSortToPrisma } from '@/shared/components/dataTable/dataTableSortToPrisma';
import { Button } from '@/shared/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/shared/components/ui/dropdown-menu';
import { apiClient } from '@/shared/lib/apiClient';
import { csvExporter } from '@/shared/lib/csvExporter';
import { dictionaryFormat } from '@/shared/lib/dictionaryFormat';
import { objectToQuery } from '@/shared/lib/objectToQuery';
import { useAuthStore } from '@/features/auth/authStore';
import {
  memberFilterInputSchema,
  MemberWithRelationships,
} from '@project/backend/features/member/memberSchemas';
import {
  useIsFetching,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import { Table } from '@tanstack/react-table';
import { useState } from 'react';
import { useShallow } from 'zustand/react/shallow';
import {
  LuFileSpreadsheet,
  LuLoader,
  LuRefreshCw,
  LuTrash2,
} from 'react-icons/lu';
import { RxDotsHorizontal } from 'react-icons/rx';
import { toast } from 'sonner';
import { z } from 'zod';

export function MemberListActions({
  table,
  count,
  filter,
  sorting,
}: {
  filter: z.input<typeof memberFilterInputSchema>;
  sorting: DataTableSort;
  count?: number;
  table: Table<MemberWithRelationships>;
}) {
  const { dictionary, hasPermission, locale } = useAuthStore(
    useShallow((state) => ({
      dictionary: state.dictionary,
      hasPermission: state.hasPermission,
      locale: state.locale,
    })),
  );
  const queryClient = useQueryClient();
  const isFetching = useIsFetching({ queryKey: ['member'] });

  const [deleteManyDialogOpen, setDeleteManyDialogOpen] = useState(false);

  const hasPermissionToDelete = hasPermission({
    member: ['delete'],
  });

  const hasPermissionToExport = hasPermission({
    member: ['export'],
  });

  const exportMutation = useMutation({
    mutationFn: () => {
      return apiClient
        .get(
          `api/member?${objectToQuery({
            filter: filter,
            orderBy: dataTableSortToPrisma(sorting),
          })}`,
        )
        .json<{
          count: number;
          members: MemberWithRelationships[];
        }>();
    },
    onSuccess: (data) => {
      csvExporter(
        memberExporterMapper(data.members, { dictionary, locale }),
        dictionary.member.fields,
        'members',
      );
      toast.success(dictionary.member.export.success);
    },
    onError: (error: any) => {
      toast.error(error.message || dictionary.shared.errors.unknown);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async () => {
      const model = table.getFilteredSelectedRowModel();
      const members = model.rows.map((r) => r.original);

      if (!members.length) {
        throw new Error(dictionary.member.deleteMany.noSelection);
      }

      // Use allSettled to handle partial failures gracefully
      const results = await Promise.allSettled(
        members.map(async (member) => {
          await apiClient.delete(`api/member/${member.id}`).json<boolean>();
          return { success: true, member };
        }),
      );

      const succeeded = results.filter((r) => r.status === 'fulfilled').length;
      const failed = results.filter((r) => r.status === 'rejected').length;

      const errors = results
        .filter((r): r is PromiseRejectedResult => r.status === 'rejected')
        .map((r) => r.reason.message);

      return { succeeded, failed, errors, total: members.length };
    },
    onSuccess: (data) => {
      table.resetRowSelection();
      queryClient.resetQueries({
        queryKey: ['member'],
      });

      if (data.failed === 0) {
        toast.success(dictionary.member.deleteMany.success);
      } else if (data.succeeded === 0) {
        toast.error(
          `${dictionary.shared.errors.unknown}: ${data.errors.join(', ')}`,
        );
      } else {
        toast.warning(
          `${data.succeeded} of ${data.total} members removed. ${data.failed} failed: ${data.errors.join(', ')}`,
        );
      }
    },
    onError: (error: any) => {
      const errorMessage = error.message || dictionary.shared.errors.unknown;
      console.error('Failed to remove members:', error);
      toast.error(errorMessage);
    },
  });

  const selectedCount = table.getFilteredSelectedRowModel().rows.length;

  const isLoading = deleteMutation.isPending || exportMutation.isPending;

  const hasAnyDropdownPermission =
    hasPermissionToDelete || hasPermissionToExport;

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
            {hasPermissionToDelete && (
              <DropdownMenuItem
                onClick={() => setDeleteManyDialogOpen(true)}
                disabled={!selectedCount || deleteMutation.isPending}
              >
                <LuTrash2 className="text-foreground/50 mr-2 h-4 w-4" />{' '}
                <span>{dictionary.shared.delete}</span>
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
          </DropdownMenuContent>
        </DropdownMenu>
      )}

      <DataTableViewOptions table={table} />

      <Button
        variant="outline"
        size="sm"
        className="ml-auto flex h-8"
        onClick={() => queryClient.invalidateQueries({ queryKey: ['member'] })}
        disabled={!!isFetching}
      >
        {isFetching ? (
          <LuLoader className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <LuRefreshCw className="mr-2 h-4 w-4" />
        )}
        <span>{dictionary.shared.refresh}</span>
      </Button>

      {deleteManyDialogOpen && (
        <ConfirmDialog
          title={dictionary.member.deleteMany.confirmTitle}
          description={dictionaryFormat(
            dictionary.member.deleteMany.confirmDescription,
            selectedCount,
          )}
          confirmText={dictionary.shared.delete}
          variant="destructive"
          cancelText={dictionary.shared.cancel}
          onConfirm={() => {
            deleteMutation.mutateAsync();
            setDeleteManyDialogOpen(false);
          }}
          onCancel={() => setDeleteManyDialogOpen(false)}
        />
      )}
    </>
  );
}
