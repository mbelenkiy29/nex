import { auditLogExporterMapper } from '@/features/auditLog/auditLogExporterMapper';
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
import { objectToQuery } from '@/shared/lib/objectToQuery';
import { useAuthStore } from '@/features/auth/authStore';
import { useShallow } from 'zustand/react/shallow';
import { AuditLogWithAuthor } from '@project/backend/features/auditLog/auditLogSchemas';
import { auditLogFilterInputSchema } from '@project/backend/features/auditLog/auditLogSchemas';
import {
  useIsFetching,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import { LuFileSpreadsheet, LuLoader, LuRefreshCw } from 'react-icons/lu';
import { RxDotsHorizontal } from 'react-icons/rx';
import { toast } from 'sonner';
import { z } from 'zod';

export function AuditLogListActions({
  count,
  filter,
  sorting,
}: {
  filter: z.input<typeof auditLogFilterInputSchema>;
  sorting: DataTableSort;
  count?: number;
}) {
  const { dictionary, hasPermission } = useAuthStore(
    useShallow((state) => ({
      dictionary: state.dictionary,
      hasPermission: state.hasPermission,
    })),
  );

  const queryClient = useQueryClient();
  const isFetching = useIsFetching({ queryKey: ['auditLog'] });

  const hasPermissionToExport = hasPermission({
    auditLog: ['export'],
  });

  const exportMutation = useMutation({
    mutationFn: async () => {
      return await apiClient
        .get(
          `api/audit-log?${objectToQuery({
            filter: filter,
            orderBy: dataTableSortToPrisma(sorting),
          })}`,
        )
        .json<{
          count: number;
          auditLogs: AuditLogWithAuthor[];
        }>();
    },
    onSuccess: (data) => {
      csvExporter(
        auditLogExporterMapper(data.auditLogs, dictionary),
        dictionary.auditLog.fields,
        'auditLogs',
      );
      toast.success(dictionary.auditLog.export.success);
    },
    onError: (error: any) => {
      toast.error(error.message || dictionary.shared.errors.unknown);
    },
  });

  const isLoading = exportMutation.isPending;

  return (
    <>
      {hasPermissionToExport && (
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
            <DropdownMenuItem
              onClick={() => exportMutation.mutateAsync()}
              disabled={!count || exportMutation.isPending}
            >
              <LuFileSpreadsheet className="text-foreground/50 mr-2 h-4 w-4" />{' '}
              <span>{dictionary.shared.exportToCsv}</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}

      <Button
        variant="outline"
        size="sm"
        className="ml-auto flex h-8"
        onClick={() =>
          queryClient.invalidateQueries({ queryKey: ['auditLog'] })
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
    </>
  );
}
