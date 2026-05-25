import { lessonExporterMapper } from '@/features/lesson/lessonExporterMapper';
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
  lessonFilterInputSchema,
  LessonWithRelationships,
} from '@project/backend/features/lesson/lessonSchemas';
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

export function LessonListActions({
  table,
  count,
  filter,
  sorting,
}: {
  filter: z.input<typeof lessonFilterInputSchema>;
  sorting: DataTableSort;
  count?: number;
  table: Table<LessonWithRelationships>;
}) {
  const { dictionary, hasPermission, locale } = useAuthStore(
    useShallow((state) => ({
      dictionary: state.dictionary,
      hasPermission: state.hasPermission,
      locale: state.locale,
    })),
  );
  const queryClient = useQueryClient();
  const isFetching = useIsFetching({ queryKey: ['lesson'] });

  const [deleteManyDialogOpen, setDeleteManyDialogOpen] = useState(false);
  const [restoreManyDialogOpen, setRestoreManyDialogOpen] = useState(false);
  const [archiveManyDialogOpen, setArchiveManyDialogOpen] = useState(false);

  const hasPermissionToCreate = hasPermission({
    lesson: ['create'],
  });

  const hasPermissionToDelete = hasPermission({
    lesson: ['delete'],
  });

  const hasPermissionToArchive = hasPermission({
    lesson: ['archive'],
  });

  const hasPermissionToRestore = hasPermission({
    lesson: ['restore'],
  });

  const hasPermissionToImport = hasPermission({
    lesson: ['import'],
  });

  const hasPermissionToExport = hasPermission({
    lesson: ['export'],
  });

  const exportMutation = useMutation({
    mutationFn: async () => {
      return await apiClient
        .get(
          `api/lesson?${objectToQuery({ filter, orderBy: dataTableSortToPrisma(sorting) })}`,
        )
        .json<{ count: number; lessons: LessonWithRelationships[] }>();
    },
    onSuccess: (data) => {
      csvExporter(
        lessonExporterMapper(data.lessons, { dictionary, locale }),
        dictionary.lesson.fields,
        'lessons',
      );
      toast.success(dictionary.lesson.export.success);
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
        throw new Error(dictionary.lesson.deleteMany.noSelection);
      }

      return await apiClient
        .delete(`api/lesson?${objectToQuery({ ids })}`)
        .json();
    },
    onSuccess: () => {
      table.resetRowSelection();
      queryClient.resetQueries({
        queryKey: ['lesson'],
      });
      toast.success(dictionary.lesson.deleteMany.success);
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
        throw new Error(dictionary.lesson.archiveMany.noSelection);
      }

      return await apiClient
        .put(`api/lesson/archive`, { json: { ids } })
        .json();
    },
    onSuccess: () => {
      table.resetRowSelection();
      queryClient.resetQueries({
        queryKey: ['lesson'],
      });
      toast.success(dictionary.lesson.archiveMany.success);
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
        throw new Error(dictionary.lesson.restoreMany.noSelection);
      }

      return await apiClient
        .put(`api/lesson/restore`, { json: { ids } })
        .json();
    },
    onSuccess: () => {
      table.resetRowSelection();
      queryClient.resetQueries({
        queryKey: ['lesson'],
      });
      toast.success(dictionary.lesson.restoreMany.success);
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
              <DropdownMenuLinkItem render={<Link to={`/lesson/importer`} />}>
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
        onClick={() => queryClient.invalidateQueries({ queryKey: ['lesson'] })}
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
          render={<Link to={`/lesson/new`} />}
        >
          <LuPlus className="mr-2 h-4 w-4" />
          <span>{dictionary.shared.new}</span>
        </Button>
      )}

      {archiveManyDialogOpen && (
        <ConfirmDialog
          title={dictionary.lesson.archiveMany.confirmTitle}
          description={dictionaryFormat(
            dictionary.lesson.archiveMany.confirmDescription,
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
          title={dictionary.lesson.restoreMany.confirmTitle}
          description={dictionaryFormat(
            dictionary.lesson.restoreMany.confirmDescription,
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
          title={dictionary.lesson.deleteMany.confirmTitle}
          description={dictionaryFormat(
            dictionary.lesson.deleteMany.confirmDescription,
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
