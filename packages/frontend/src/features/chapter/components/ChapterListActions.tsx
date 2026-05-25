import { chapterExporterMapper } from '@/features/chapter/chapterExporterMapper';
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
  chapterFilterInputSchema,
  ChapterWithRelationships,
} from '@project/backend/features/chapter/chapterSchemas';
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

export function ChapterListActions({
  table,
  count,
  filter,
  sorting,
}: {
  filter: z.input<typeof chapterFilterInputSchema>;
  sorting: DataTableSort;
  count?: number;
  table: Table<ChapterWithRelationships>;
}) {
  const { dictionary, hasPermission, locale } = useAuthStore(
    useShallow((state) => ({
      dictionary: state.dictionary,
      hasPermission: state.hasPermission,
      locale: state.locale,
    })),
  );
  const queryClient = useQueryClient();
  const isFetching = useIsFetching({ queryKey: ['chapter'] });

  const [deleteManyDialogOpen, setDeleteManyDialogOpen] = useState(false);
  const [restoreManyDialogOpen, setRestoreManyDialogOpen] = useState(false);
  const [archiveManyDialogOpen, setArchiveManyDialogOpen] = useState(false);

  const hasPermissionToCreate = hasPermission({
    chapter: ['create'],
  });

  const hasPermissionToDelete = hasPermission({
    chapter: ['delete'],
  });

  const hasPermissionToArchive = hasPermission({
    chapter: ['archive'],
  });

  const hasPermissionToRestore = hasPermission({
    chapter: ['restore'],
  });

  const hasPermissionToImport = hasPermission({
    chapter: ['import'],
  });

  const hasPermissionToExport = hasPermission({
    chapter: ['export'],
  });

  const exportMutation = useMutation({
    mutationFn: async () => {
      return await apiClient
        .get(
          `api/chapter?${objectToQuery({ filter, orderBy: dataTableSortToPrisma(sorting) })}`,
        )
        .json<{ count: number; chapters: ChapterWithRelationships[] }>();
    },
    onSuccess: (data) => {
      csvExporter(
        chapterExporterMapper(data.chapters, { dictionary, locale }),
        dictionary.chapter.fields,
        'chapters',
      );
      toast.success(dictionary.chapter.export.success);
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
        throw new Error(dictionary.chapter.deleteMany.noSelection);
      }

      return await apiClient
        .delete(`api/chapter?${objectToQuery({ ids })}`)
        .json();
    },
    onSuccess: () => {
      table.resetRowSelection();
      queryClient.resetQueries({
        queryKey: ['chapter'],
      });
      toast.success(dictionary.chapter.deleteMany.success);
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
        throw new Error(dictionary.chapter.archiveMany.noSelection);
      }

      return await apiClient
        .put(`api/chapter/archive`, { json: { ids } })
        .json();
    },
    onSuccess: () => {
      table.resetRowSelection();
      queryClient.resetQueries({
        queryKey: ['chapter'],
      });
      toast.success(dictionary.chapter.archiveMany.success);
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
        throw new Error(dictionary.chapter.restoreMany.noSelection);
      }

      return await apiClient
        .put(`api/chapter/restore`, { json: { ids } })
        .json();
    },
    onSuccess: () => {
      table.resetRowSelection();
      queryClient.resetQueries({
        queryKey: ['chapter'],
      });
      toast.success(dictionary.chapter.restoreMany.success);
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
              <DropdownMenuLinkItem render={<Link to={`/chapter/importer`} />}>
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
        onClick={() => queryClient.invalidateQueries({ queryKey: ['chapter'] })}
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
          render={<Link to={`/chapter/new`} />}
        >
          <LuPlus className="mr-2 h-4 w-4" />
          <span>{dictionary.shared.new}</span>
        </Button>
      )}

      {archiveManyDialogOpen && (
        <ConfirmDialog
          title={dictionary.chapter.archiveMany.confirmTitle}
          description={dictionaryFormat(
            dictionary.chapter.archiveMany.confirmDescription,
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
          title={dictionary.chapter.restoreMany.confirmTitle}
          description={dictionaryFormat(
            dictionary.chapter.restoreMany.confirmDescription,
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
          title={dictionary.chapter.deleteMany.confirmTitle}
          description={dictionaryFormat(
            dictionary.chapter.deleteMany.confirmDescription,
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
