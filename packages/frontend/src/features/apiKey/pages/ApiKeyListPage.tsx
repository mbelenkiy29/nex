import { ApiKeyActions } from '@/features/apiKey/components/ApiKeyActions';
import { ApiKeyListActions } from '@/features/apiKey/components/ApiKeyListActions';
import { ApiKeyListFilter } from '@/features/apiKey/components/ApiKeyListFilter';
import { ApiKeyPermissions } from '@/features/apiKey/components/ApiKeyPermissions';
import { ApiKeyStatus } from '@/features/apiKey/components/ApiKeyStatus';
import { PageHeader } from '@/shared/components/PageHeader';
import { DataTable } from '@/shared/components/dataTable/DataTable';
import { DataTableColumnIds } from '@/shared/components/dataTable/DataTableColumnHeader';
import { DataTablePagination } from '@/shared/components/dataTable/DataTablePagination';
import { DataTableQueryParams } from '@/shared/components/dataTable/DataTableQueryParams';
import { dataTableHeader } from '@/shared/components/dataTable/dataTableHeader';
import { dataTablePageCount } from '@/shared/components/dataTable/dataTablePageCount';
import { dataTableSortToPrisma } from '@/shared/components/dataTable/dataTableSortToPrisma';
import { apiClient } from '@/shared/lib/apiClient';
import { objectToQuery } from '@/shared/lib/objectToQuery';
import { useAuthStore } from '@/features/auth/authStore';
import { useDataTableStore } from '@/shared/stores/dataTableStore';
import { formatDateTime } from '@project/backend/shared/lib/formatDateTime';
import { useQuery } from '@tanstack/react-query';
import {
  createLazyRoute,
  useNavigate,
  useSearch,
} from '@tanstack/react-router';
import {
  type ColumnDef,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { useMemo, useState } from 'react';

type ApiKey = {
  id: string;
  name: string | null;
  prefix: string | null;
  start: string | null;
  enabled: boolean;
  expiresAt: Date | null;
  remaining: number | null;
  lastRequest: Date | null;
  permissions: string | Record<string, string[]> | null;
  createdAt: Date;
  updatedAt: Date;
};

const defaultData: Array<any> = [];
const TABLE_ID = 'api-key-list';
const NAMESPACE = 'apiKey';

export const apiKeyListLazyRoute = createLazyRoute('/api-key')({
  component: ApiKeyListPage,
});

export function ApiKeyListPage() {
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

  const sorting = useMemo(() => {
    return DataTableQueryParams.getSorting(searchParams, NAMESPACE);
  }, [searchParams]);

  const pagination = useMemo(() => {
    return DataTableQueryParams.getPagination(
      searchParams,
      getPageSize(TABLE_ID),
      NAMESPACE,
    );
  }, [searchParams, getPageSize]);

  const filter = useMemo(() => {
    return searchParams.apiKeyFilter || {};
  }, [searchParams]);

  const [columnVisibility, setColumnVisibility] = useState(() =>
    getColumnVisibility(TABLE_ID),
  );

  const query = useQuery({
    queryKey: ['apiKey', 'list', filter, sorting, pagination],
    queryFn: async ({ signal }) => {
      const skip = pagination.pageIndex * pagination.pageSize;
      const take = pagination.pageSize;

      return await apiClient
        .get(
          `api/api-key?${objectToQuery({
            filter,
            skip: Number.isFinite(skip) ? skip : 0,
            take: Number.isFinite(take) ? take : 10,
            orderBy: dataTableSortToPrisma(sorting),
          })}`,
          { signal },
        )
        .json<{ apiKeys: ApiKey[]; count: number }>();
    },
  });

  const columns: ColumnDef<ApiKey>[] = useMemo(
    () => [
      {
        accessorKey: 'name',
        meta: {
          title: dictionary.apiKey.fields.name,
        },
        cell: ({ row }) =>
          row.original.name || (
            <span className="text-muted-foreground">
              {dictionary.apiKey.fields.namePlaceholder}
            </span>
          ),
      },
      {
        accessorKey: 'start',
        meta: {
          title: dictionary.apiKey.fields.keyPreview,
        },
        cell: ({ row }) => (
          <code className="text-xs">{row.original.start}...</code>
        ),
        enableSorting: false,
      },
      {
        accessorKey: 'enabled',
        meta: {
          title: dictionary.apiKey.fields.status,
        },
        cell: ({ row }) => <ApiKeyStatus enabled={row.original.enabled} />,
      },
      {
        accessorKey: 'permissions',
        meta: {
          title: dictionary.apiKey.fields.permissions,
        },
        cell: ({ row }) => (
          <ApiKeyPermissions permissions={row.original.permissions} />
        ),
        enableSorting: false,
      },
      {
        accessorKey: 'remaining',
        meta: {
          title: dictionary.apiKey.fields.remaining,
        },
        header: dataTableHeader('right'),
        cell: ({ getValue }) => (
          <div className="text-right whitespace-nowrap">
            {(getValue() as number) ??
              dictionary.apiKey.enumerators.remaining.unlimited}
          </div>
        ),
      },
      {
        accessorKey: 'lastRequest',
        meta: {
          title: dictionary.apiKey.fields.lastUsed,
        },
        cell: ({ row }) => (
          <span className="whitespace-nowrap">
            {row.original.lastRequest
              ? formatDateTime(row.original.lastRequest, dictionary)
              : dictionary.apiKey.enumerators.lastUsed.never}
          </span>
        ),
      },
      {
        accessorKey: 'expiresAt',
        meta: {
          title: dictionary.apiKey.fields.expiresAt,
        },
        cell: ({ row }) => (
          <span className="whitespace-nowrap">
            {row.original.expiresAt
              ? formatDateTime(row.original.expiresAt, dictionary)
              : dictionary.apiKey.enumerators.expiresAt.never}
          </span>
        ),
      },
      {
        id: DataTableColumnIds.actions,
        meta: {
          sticky: true,
        },
        cell: ({ row }) => <ApiKeyActions mode="table" apiKey={row.original} />,
        enableSorting: false,
        enableHiding: false,
      },
    ],
    [dictionary],
  );

  const table = useReactTable({
    getRowId: ({ originalRow, index }) => originalRow?.id || index,
    data: query.data?.apiKeys || defaultData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
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
      NAMESPACE,
    ),
    onPaginationChange: DataTableQueryParams.onPaginationChange(
      pagination,
      navigate,
      searchParams,
      NAMESPACE,
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
    <div className="mb-4 flex w-full max-w-full flex-col gap-4 overflow-hidden p-6">
      <div className="flex items-center justify-between">
        <PageHeader items={[[dictionary.apiKey.list.menu]]} />
        <div className="flex gap-2">
          <ApiKeyListActions table={table} />
        </div>
      </div>

      <ApiKeyListFilter isLoading={query.isLoading} />
      <DataTable
        table={table}
        columns={columns}
        isLoading={query.isLoading}
        notFoundText={dictionary.apiKey.list.noResults}
      />
      <DataTablePagination table={table} />
    </div>
  );
}
