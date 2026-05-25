import { AuditLogActions } from '@/features/auditLog/components/AuditLogActions';
import { AuditLogApiHttpResponseCodeBadge } from '@/features/auditLog/components/AuditLogApiHttpResponseCodeBadge';
import { AuditLogListActions } from '@/features/auditLog/components/AuditLogListActions';
import { AuditLogListFilter } from '@/features/auditLog/components/AuditLogListFilter';
import { AuditLogViewDialog } from '@/features/auditLog/components/AuditLogViewDialog';
import { PageHeader } from '@/shared/components/PageHeader';
import { DataTable } from '@/shared/components/dataTable/DataTable';
import { DataTableColumnIds } from '@/shared/components/dataTable/DataTableColumnHeader';
import { DataTablePagination } from '@/shared/components/dataTable/DataTablePagination';
import { DataTableQueryParams } from '@/shared/components/dataTable/DataTableQueryParams';
import { DataTableViewOptions } from '@/shared/components/dataTable/DataTableViewButton';
import { dataTableHeader } from '@/shared/components/dataTable/dataTableHeader';
import { dataTablePageCount } from '@/shared/components/dataTable/dataTablePageCount';
import { dataTableSortToPrisma } from '@/shared/components/dataTable/dataTableSortToPrisma';
import { apiClient } from '@/shared/lib/apiClient';
import { formatDateTime } from '@project/backend/shared/lib/formatDateTime';
import { objectToQuery } from '@/shared/lib/objectToQuery';
import { useAuthStore } from '@/features/auth/authStore';
import { useDataTableStore } from '@/shared/stores/dataTableStore';
import { apiKeyLabel } from '@project/backend/features/apiKey/apiKeyLabel';
import { AuditLogWithAuthor } from '@project/backend/features/auditLog/auditLogSchemas';
import { auditLogFilterInputSchema } from '@project/backend/features/auditLog/auditLogSchemas';
import { memberFullName } from '@project/backend/features/member/memberFullName';
import { dictionaryEnumerator } from '@project/backend/translation/dictionaryEnumerator';
import { useQuery } from '@tanstack/react-query';
import {
  createLazyRoute,
  useNavigate,
  useSearch,
} from '@tanstack/react-router';
import {
  ColumnDef,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { useMemo, useState } from 'react';
import { z } from 'zod';

const defaultData: Array<any> = [];
const TABLE_ID = 'audit-log-list';

export const auditLogListLazyRoute = createLazyRoute('/audit-log')({
  component: AuditLogListPage,
});

export function AuditLogListPage() {
  const dictionary = useAuthStore((state) => state.dictionary);
  const getColumnVisibility = useDataTableStore(
    (state) => state.getColumnVisibility,
  );
  const setAllColumnVisibility = useDataTableStore(
    (state) => state.setAllColumnVisibility,
  );
  const getPageSize = useDataTableStore((state) => state.getPageSize);
  const navigate = useNavigate();
  const searchParams = useSearch({ strict: false }) as Record<string, any>;
  const [auditLogToCompareChanges, setAuditLogToCompareChanges] =
    useState<AuditLogWithAuthor>();

  const sorting = useMemo(() => {
    return DataTableQueryParams.getSorting(searchParams);
  }, [searchParams]);

  const pagination = useMemo(() => {
    return DataTableQueryParams.getPagination(
      searchParams,
      getPageSize(TABLE_ID),
    );
  }, [searchParams, getPageSize]);

  const filter = useMemo(() => {
    return DataTableQueryParams.getFilter<
      z.input<typeof auditLogFilterInputSchema>
    >(searchParams, auditLogFilterInputSchema);
  }, [searchParams]);

  const [columnVisibility, setColumnVisibility] = useState(() =>
    getColumnVisibility(TABLE_ID),
  );

  const columns: ColumnDef<AuditLogWithAuthor>[] = [
    {
      accessorKey: 'timestamp',
      meta: {
        title: dictionary.auditLog.fields.timestamp,
      },
      cell: ({ getValue, row }) => (
        <span className="whitespace-nowrap">
          <button
            className="text-blue-500 hover:text-blue-400 hover:underline focus:text-blue-400 dark:text-blue-400"
            type="button"
            onClick={() => setAuditLogToCompareChanges(row.original)}
          >
            {formatDateTime(getValue() as string, dictionary)}
          </button>
        </span>
      ),
    },
    {
      accessorKey: 'authorEmail',
      meta: {
        title: dictionary.auditLog.fields.member,
      },
      cell: ({ getValue, row }) => (
        <span className="whitespace-nowrap">
          {getValue() as string}
          {Boolean(row.original.authorFirstName) && (
            <span className="ml-2">
              (
              {memberFullName({
                firstName: row.original.authorFirstName,
                lastName: row.original.authorLastName,
              })}
              )
            </span>
          )}
        </span>
      ),
    },
    {
      accessorKey: 'entityName',
      meta: {
        title: dictionary.auditLog.fields.entityName,
      },
      cell: ({ getValue }) => (
        <span className="whitespace-nowrap">{getValue() as string}</span>
      ),
    },
    {
      accessorKey: 'operation',
      meta: {
        title: dictionary.auditLog.fields.operation,
      },
      cell: ({ getValue }) => (
        <span className="whitespace-nowrap">
          {dictionaryEnumerator(
            dictionary.auditLog.enumerators.operation,
            getValue() as string,
          )}
        </span>
      ),
    },
    {
      accessorKey: 'entityId',
      meta: {
        title: dictionary.auditLog.fields.entityId,
      },
    },
    {
      accessorKey: 'apiKey.name',
      meta: {
        title: dictionary.auditLog.fields.apiKey,
      },
      cell: ({ row }) => {
        if (row.original.apiKey == null && row.original.apiKeyId) {
          return `${row.original.apiKeyId} (${dictionary.shared.deleted})`;
        }

        return (
          <span className="whitespace-nowrap">
            {apiKeyLabel(row.original.apiKey)}
          </span>
        );
      },
    },
    {
      accessorKey: 'apiEndpoint',
      meta: {
        title: dictionary.auditLog.fields.apiEndpoint,
      },
    },
    {
      accessorKey: 'apiHttpResponseCode',
      meta: {
        title: dictionary.auditLog.fields.apiHttpResponseCode,
      },
      cell: ({ row }) => (
        <span className="whitespace-nowrap">
          <AuditLogApiHttpResponseCodeBadge auditLog={row.original} />
        </span>
      ),
    },

    {
      id: DataTableColumnIds.actions,
      meta: {
        sticky: true,
      },
      cell: ({ row }) => (
        <AuditLogActions
          mode="table"
          auditLog={row.original}
          onView={setAuditLogToCompareChanges}
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
  ];

  const query = useQuery({
    queryKey: ['auditLog', 'list', filter, sorting, pagination],
    queryFn: async ({ signal }) => {
      return await apiClient
        .get(
          `api/audit-log?${objectToQuery({
            filter: filter,
            skip: pagination.pageIndex * pagination.pageSize,
            take: pagination.pageSize,
            orderBy: dataTableSortToPrisma(sorting),
          })}`,
          { signal },
        )
        .json<{
          count: number;
          auditLogs: AuditLogWithAuthor[];
        }>();
    },
  });

  const table = useReactTable({
    getRowId: ({ originalRow, index }) => originalRow?.id || index,
    data: query.data?.auditLogs || defaultData,
    columns,
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getCoreRowModel: getCoreRowModel(),
    defaultColumn: {
      header: dataTableHeader('left'),
      cell: ({ getValue }) => (
        <span className="whitespace-nowrap">{getValue() as string}</span>
      ),
    },
    state: {
      sorting,
      pagination,
      columnVisibility,
    },
    onSortingChange: DataTableQueryParams.onSortingChange(
      sorting,
      navigate,
      searchParams,
    ),
    onPaginationChange: DataTableQueryParams.onPaginationChange(
      pagination,
      navigate,
      searchParams,
    ),
    onColumnVisibilityChange: (updater) => {
      const newVisibility =
        typeof updater === 'function' ? updater(columnVisibility) : updater;
      setColumnVisibility(newVisibility);
      setAllColumnVisibility(TABLE_ID, newVisibility);
    },
    manualSorting: true,
    manualPagination: true,
    pageCount: dataTablePageCount(query.data?.count, pagination),
    meta: {
      count: query.data?.count,
      tableId: TABLE_ID,
    },
  });

  return (
    <div className="mb-4 flex w-full flex-col gap-4 overflow-x-hidden p-6">
      <div className="flex items-center justify-between">
        <PageHeader items={[[dictionary.auditLog.list.menu]]} />
        <div className="flex gap-2">
          <DataTableViewOptions table={table} />
          <AuditLogListActions
            filter={filter}
            sorting={sorting}
            count={query.data?.count}
          />
        </div>
      </div>

      <AuditLogListFilter isLoading={query.isLoading} />

      <DataTable
        table={table}
        isLoading={query.isLoading}
        columns={columns}
        notFoundText={dictionary.auditLog.list.noResults}
      />

      <DataTablePagination table={table} />

      {Boolean(auditLogToCompareChanges) && (
        <AuditLogViewDialog
          auditLog={auditLogToCompareChanges!}
          onClose={() => setAuditLogToCompareChanges(undefined)}
        />
      )}
    </div>
  );
}
