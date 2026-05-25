import { conceptExporterMapper } from '@/features/concept/conceptExporterMapper';
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
  conceptFilterInputSchema,
  ConceptWithRelationships,
} from '@project/backend/features/concept/conceptSchemas';
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

export function ConceptListActions({
  table,
  count,
  filter,
  sorting,
}: {
  filter: z.input<typeof conceptFilterInputSchema>;
  sorting: DataTableSort;
  count?: number;
  table: Table<ConceptWithRelationships>;
}) {
  const { dictionary, hasPermission, locale } = useAuthStore(
    useShallow((state) => ({
      dictionary: state.dictionary,
      hasPermission: state.hasPermission,
      locale: state.locale,
    })),
  );
  const queryClient = useQueryClient();
  const isFetching = useIsFetching({ queryKey: ['concept'] });

  const [deleteManyDialogOpen, setDeleteManyDialogOpen] = useState(false);
  const [restoreManyDialogOpen, setRestoreManyDialogOpen] = useState(false);
  const [archiveManyDialogOpen, setArchiveManyDialogOpen] = useState(false);

  const hasPermissionToCreate = hasPermission({
    concept: ['create'],
  });

  const hasPermissionToDelete = hasPermission({
    concept: ['delete'],
  });

  const hasPermissionToArchive = hasPermission({
    concept: ['archive'],
  });

  const hasPermissionToRestore = hasPermission({
    concept: ['restore'],
  });

  const hasPermissionToImport = hasPermission({
    concept: ['import'],
  });

  const hasPermissionToExport = hasPermission({
    concept: ['export'],
  });

  const exportMutation = useMutation({
    mutationFn: async () => {
      return await apiClient
        .get(
          `api/concept?${objectToQuery({ filter, orderBy: dataTableSortToPrisma(sorting) })}`,
        )
        .json<{ count: number; concepts: ConceptWithRelationships[] }>();
    },
    onSuccess: (data) => {
      csvExporter(
        conceptExporterMapper(data.concepts, { dictionary, locale }),
        dictionary.concept.fields,
        'concepts',
      );
      toast.success(dictionary.concept.export.success);
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
        throw new Error(dictionary.concept.deleteMany.noSelection);
      }

      return await apiClient
        .delete(`api/concept?${objectToQuery({ ids })}`)
        .json();
    },
    onSuccess: () => {
      table.resetRowSelection();
      queryClient.resetQueries({
        queryKey: ['concept'],
      });
      toast.success(dictionary.concept.deleteMany.success);
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
        throw new Error(dictionary.concept.archiveMany.noSelection);
      }

      return await apiClient
        .put(`api/concept/archive`, { json: { ids } })
        .json();
    },
    onSuccess: () => {
      table.resetRowSelection();
      queryClient.resetQueries({
        queryKey: ['concept'],
      });
      toast.success(dictionary.concept.archiveMany.success);
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
        throw new Error(dictionary.concept.restoreMany.noSelection);
      }

      return await apiClient
        .put(`api/concept/restore`, { json: { ids } })
        .json();
    },
    onSuccess: () => {
      table.resetRowSelection();
      queryClient.resetQueries({
        queryKey: ['concept'],
      });
      toast.success(dictionary.concept.restoreMany.success);
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
              <DropdownMenuLinkItem render={<Link to={`/concept/importer`} />}>
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
        onClick={() => queryClient.invalidateQueries({ queryKey: ['concept'] })}
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
          render={<Link to={`/concept/new`} />}
        >
          <LuPlus className="mr-2 h-4 w-4" />
          <span>{dictionary.shared.new}</span>
        </Button>
      )}

      {archiveManyDialogOpen && (
        <ConfirmDialog
          title={dictionary.concept.archiveMany.confirmTitle}
          description={dictionaryFormat(
            dictionary.concept.archiveMany.confirmDescription,
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
          title={dictionary.concept.restoreMany.confirmTitle}
          description={dictionaryFormat(
            dictionary.concept.restoreMany.confirmDescription,
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
          title={dictionary.concept.deleteMany.confirmTitle}
          description={dictionaryFormat(
            dictionary.concept.deleteMany.confirmDescription,
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
