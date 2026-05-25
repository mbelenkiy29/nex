import {
  InvitationStatusBadge,
  InvitationExpiresAt,
} from '@/features/member/components/InvitationStatusBadge';
import { InvitationActions } from '@/features/member/components/InvitationActions';
import { InvitationListActions } from '@/features/member/components/InvitationListActions';
import { InvitationListFilter } from '@/features/member/components/InvitationListFilter';
import { DataTable } from '@/shared/components/dataTable/DataTable';
import { DataTableColumnIds } from '@/shared/components/dataTable/DataTableColumnHeader';
import { DataTablePagination } from '@/shared/components/dataTable/DataTablePagination';
import { Checkbox } from '@/shared/components/ui/checkbox';
import { DataTableQueryParams } from '@/shared/components/dataTable/DataTableQueryParams';
import { dataTableHeader } from '@/shared/components/dataTable/dataTableHeader';
import { dataTablePageCount } from '@/shared/components/dataTable/dataTablePageCount';
import { dataTableSortToPrisma } from '@/shared/components/dataTable/dataTableSortToPrisma';
import { apiClient } from '@/shared/lib/apiClient';
import { objectToQuery } from '@/shared/lib/objectToQuery';
import { useAuthStore } from '@/features/auth/authStore';
import { useDataTableStore } from '@/shared/stores/dataTableStore';
import type { InvitationWithRelationships } from '@project/backend/features/invitation/invitationSchemas';
import { dictionaryEnumerator } from '@project/backend/translation/dictionaryEnumerator';
import { useQuery } from '@tanstack/react-query';
import { Link, useNavigate, useSearch } from '@tanstack/react-router';
import {
  ColumnDef,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { useMemo, useState } from 'react';

const defaultData: Array<any> = [];
const TABLE_ID = 'invitation-list';
const NAMESPACE = 'invitation';

export function InvitationList() {
  const dictionary = useAuthStore((state) => state.dictionary);
  const hasPermission = useAuthStore((state) => state.hasPermission);
  const getColumnVisibility = useDataTableStore(
    (state) => state.getColumnVisibility,
  );
  const setAllColumnVisibility = useDataTableStore(
    (state) => state.setAllColumnVisibility,
  );
  const getPageSize = useDataTableStore((state) => state.getPageSize);
  const navigate = useNavigate();
  const searchParams = useSearch({ strict: false }) as Record<string, any>;

  const hasPermissionToRead = hasPermission({
    invitation: ['read'],
  });

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
    return searchParams.invitationFilter || {};
  }, [searchParams]);

  const [columnVisibility, setColumnVisibility] = useState(() =>
    getColumnVisibility(TABLE_ID),
  );

  const columns: ColumnDef<InvitationWithRelationships>[] = [
    {
      id: DataTableColumnIds.select,
      header: ({ table }) => (
        <Checkbox
          checked={table.getIsAllPageRowsSelected()}
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label={dictionary.shared.dataTable.selectAll}
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label={dictionary.shared.dataTable.selectRow}
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: 'email',
      meta: {
        title: dictionary.invitation.fields.email,
      },
      cell: ({ row }) => {
        const email = row.getValue('email') as string;
        return (
          <Link
            to="/member/invitation/$id"
            params={{ id: row.original.id }}
            className="text-blue-500 hover:text-blue-400 hover:underline focus:text-blue-400 dark:text-blue-400"
            preload="intent"
          >
            {email}
          </Link>
        );
      },
    },
    {
      accessorKey: 'role',
      meta: {
        title: dictionary.invitation.fields.role,
      },
      cell: ({ row }) => {
        const role = row.getValue('role') as string;
        return (
          <div>
            {dictionaryEnumerator(dictionary.member.enumerators.roles, role)}
          </div>
        );
      },
    },
    {
      accessorKey: 'status',
      meta: {
        title: dictionary.invitation.fields.status,
      },
      enableSorting: false,
      cell: ({ row }) => <InvitationStatusBadge invitation={row.original} />,
    },
    {
      accessorKey: 'expiresAt',
      meta: {
        title: dictionary.invitation.fields.expiresAt,
      },
      cell: ({ row }) => <InvitationExpiresAt invitation={row.original} />,
    },
    {
      id: DataTableColumnIds.actions,
      meta: {
        sticky: true,
      },
      cell: ({ row }) => <InvitationActions invitation={row.original} />,
      enableSorting: false,
      enableHiding: false,
    },
  ];

  const query = useQuery({
    queryKey: ['invitation', 'list', filter, sorting, pagination],
    queryFn: async ({ signal }) => {
      const skip = pagination.pageIndex * pagination.pageSize;
      const take = pagination.pageSize;

      return await apiClient
        .get(
          `api/member/invitation?${objectToQuery({
            filter: filter,
            skip: Number.isFinite(skip) ? skip : 0,
            take: Number.isFinite(take) ? take : 10,
            orderBy: dataTableSortToPrisma(sorting),
          })}`,
          { signal },
        )
        .json<{
          count: number;
          invitations: InvitationWithRelationships[];
        }>();
    },
    enabled: hasPermissionToRead,
  });

  const table = useReactTable({
    getRowId: ({ originalRow, index }) => originalRow?.id || index,
    data: query.data?.invitations || defaultData,
    columns: columns,
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

  if (!hasPermissionToRead) {
    return null;
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">
          {dictionary.invitation.list.title}
        </h2>
        <div className="flex gap-2">
          <InvitationListActions
            filter={filter}
            sorting={sorting}
            count={query.data?.count}
            table={table}
          />
        </div>
      </div>
      <InvitationListFilter isLoading={query.isLoading} />
      <DataTable
        table={table}
        isLoading={query.isLoading}
        columns={columns}
        notFoundText={dictionary.invitation.list.noResults}
      />
      <DataTablePagination table={table} />
    </div>
  );
}
