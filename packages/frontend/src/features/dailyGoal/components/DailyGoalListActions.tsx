import { dailyGoalExporterMapper } from '@/features/dailyGoal/dailyGoalExporterMapper';
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
import { objectToQuery } from '@/shared/lib/objectToQuery';
import { useAuthStore } from '@/features/auth/authStore';
import {
  dailyGoalFilterInputSchema,
  DailyGoalWithRelationships,
} from '@project/backend/features/dailyGoal/dailyGoalSchemas';
import { dictionaryFormat } from '@project/backend/translation/dictionaryFormat';
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
  LuArchive,
  LuFileSpreadsheet,
  LuLoader,
  LuPlus,
  LuRefreshCw,
  LuTrash2,
  LuUndo2,
} from 'react-icons/lu';
import { MdUpload } from 'react-icons/md';
import { RxDotsHorizontal } from 'react-icons/rx';
import { toast } from 'sonner';
import { z } from 'zod';

export function DailyGoalListActions({
  table,
  count,
  filter,
  sorting,
}: {
  filter: z.input<typeof dailyGoalFilterInputSchema>;
  sorting: DataTableSort;
  count?: number;
  table: Table<DailyGoalWithRelationships>;
}) {
  const { dictionary, hasPermission, locale } = useAuthStore(
    useShallow((state) => ({
      dictionary: state.dictionary,
      hasPermission: state.hasPermission,
      locale: state.locale,
    })),
  );
  const queryClient = useQueryClient();
  const isFetching = useIsFetching({ queryKey: ['dailyGoal'] });

  const [deleteManyDialogOpen, setDeleteManyDialogOpen] = useState(false);
  const [restoreManyDialogOpen, setRestoreManyDialogOpen] = useState(false);
  const [archiveManyDialogOpen, setArchiveManyDialogOpen] = useState(false);

  const hasPermissionToCreate = hasPermission({
    dailyGoal: ['create'],
  });

  const hasPermissionToDelete = hasPermission({
    dailyGoal: ['delete'],
  });

  const hasPermissionToArchive = hasPermission({
    dailyGoal: ['archive'],
  });

  const hasPermissionToRestore = hasPermission({
    dailyGoal: ['restore'],
  });

  const hasPermissionToImport = hasPermission({
    dailyGoal: ['import'],
  });

  const hasPermissionToExport = hasPermission({
    dailyGoal: ['export'],
  });

  const exportMutation = useMutation({
    mutationFn: async () => {
      return await apiClient
        .get(
          `api/daily-goal?${objectToQuery({ filter, orderBy: dataTableSortToPrisma(sorting) })}`,
        )
        .json<{ count: number; dailyGoals: DailyGoalWithRelationships[] }>();
    },
    onSuccess: (data) => {
      csvExporter(
        dailyGoalExporterMapper(data.dailyGoals, { dictionary, locale }),
        dictionary.dailyGoal.fields,
        'dailyGoals',
      );
      toast.success(dictionary.dailyGoal.export.success);
    },
    onError: (error: any) => {
      toast.error(error.message || dictionary.shared.errors.unknown);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async () => {
      const model = table.getFilteredSelectedRowModel();
      const ids = model.rows.map((r) => r.original.id);

      if (!ids.length) {
        throw new Error(dictionary.dailyGoal.deleteMany.noSelection);
      }

      return await apiClient
        .delete(`api/daily-goal?${objectToQuery({ ids })}`)
        .json();
    },
    onSuccess: () => {
      table.resetRowSelection();
      queryClient.resetQueries({
        queryKey: ['dailyGoal'],
      });
      toast.success(dictionary.dailyGoal.deleteMany.success);
    },
    onError: (error: any) => {
      toast.error(error.message || dictionary.shared.errors.unknown);
    },
  });

  const archiveMutation = useMutation({
    mutationFn: async () => {
      const model = table.getFilteredSelectedRowModel();
      const ids = model.rows.map((r) => r.original.id);

      if (!ids.length) {
        throw new Error(dictionary.dailyGoal.archiveMany.noSelection);
      }

      return await apiClient
        .put(`api/daily-goal/archive`, { json: { ids } })
        .json();
    },
    onSuccess: () => {
      table.resetRowSelection();
      queryClient.resetQueries({
        queryKey: ['dailyGoal'],
      });
      toast.success(dictionary.dailyGoal.archiveMany.success);
    },
    onError: (error: any) => {
      toast.error(error.message || dictionary.shared.errors.unknown);
    },
  });

  const restoreMutation = useMutation({
    mutationFn: async () => {
      const model = table.getFilteredSelectedRowModel();
      const ids = model.rows.map((r) => r.original.id);

      if (!ids.length) {
        throw new Error(dictionary.dailyGoal.restoreMany.noSelection);
      }

      return await apiClient
        .put(`api/daily-goal/restore`, { json: { ids } })
        .json();
    },
    onSuccess: () => {
      table.resetRowSelection();
      queryClient.resetQueries({
        queryKey: ['dailyGoal'],
      });
      toast.success(dictionary.dailyGoal.restoreMany.success);
    },
    onError: (error: any) => {
      toast.error(error.message || dictionary.shared.errors.unknown);
    },
  });

  const selectedCount = table.getFilteredSelectedRowModel().rows.length;

  const isLoading =
    deleteMutation.isPending ||
    exportMutation.isPending ||
    archiveMutation.isPending ||
    restoreMutation.isPending;

  const hasAnyDropdownPermission =
    hasPermissionToArchive ||
    hasPermissionToRestore ||
    hasPermissionToDelete ||
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
            {hasPermissionToArchive && (
              <DropdownMenuItem
                onClick={() => setArchiveManyDialogOpen(true)}
                disabled={
                  !selectedCount ||
                  archiveMutation.isPending ||
                  restoreMutation.isPending
                }
              >
                <LuArchive className="text-foreground/50 mr-2 h-4 w-4" />{' '}
                <span>{dictionary.shared.archive}</span>
              </DropdownMenuItem>
            )}
            {hasPermissionToRestore && (
              <DropdownMenuItem
                onClick={() => setRestoreManyDialogOpen(true)}
                disabled={
                  !selectedCount ||
                  archiveMutation.isPending ||
                  restoreMutation.isPending
                }
              >
                <LuUndo2 className="text-foreground/50 mr-2 h-4 w-4" />{' '}
                <span>{dictionary.shared.restore}</span>
              </DropdownMenuItem>
            )}
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
            {hasPermissionToImport && (
              <DropdownMenuLinkItem
                render={<Link to={`/daily-goal/importer`} />}
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
          queryClient.invalidateQueries({ queryKey: ['dailyGoal'] })
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
          render={<Link to={`/daily-goal/new`} />}
        >
          <LuPlus className="mr-2 h-4 w-4" />
          <span>{dictionary.shared.new}</span>
        </Button>
      )}

      {archiveManyDialogOpen && (
        <ConfirmDialog
          title={dictionary.dailyGoal.archiveMany.confirmTitle}
          description={dictionaryFormat(
            dictionary.dailyGoal.archiveMany.confirmDescription,
            selectedCount,
          )}
          confirmText={dictionary.shared.archive}
          variant="destructive"
          cancelText={dictionary.shared.cancel}
          onConfirm={() => {
            archiveMutation.mutateAsync();
            setArchiveManyDialogOpen(false);
          }}
          onCancel={() => setArchiveManyDialogOpen(false)}
        />
      )}

      {restoreManyDialogOpen && (
        <ConfirmDialog
          title={dictionary.dailyGoal.restoreMany.confirmTitle}
          description={dictionaryFormat(
            dictionary.dailyGoal.restoreMany.confirmDescription,
            selectedCount,
          )}
          confirmText={dictionary.shared.restore}
          variant="destructive"
          cancelText={dictionary.shared.cancel}
          onConfirm={() => {
            restoreMutation.mutateAsync();
            setRestoreManyDialogOpen(false);
          }}
          onCancel={() => setRestoreManyDialogOpen(false)}
        />
      )}

      {deleteManyDialogOpen && (
        <ConfirmDialog
          title={dictionary.dailyGoal.deleteMany.confirmTitle}
          description={dictionaryFormat(
            dictionary.dailyGoal.deleteMany.confirmDescription,
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
