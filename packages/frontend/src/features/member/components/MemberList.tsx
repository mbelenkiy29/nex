import { MemberActions } from '@/features/member/components/MemberActions';
import { MemberListActions } from '@/features/member/components/MemberListActions';
import { MemberListFilter } from '@/features/member/components/MemberListFilter';
import { MemberNewButton } from '@/features/member/components/MemberNewButton';
import { MemberStatusBadge } from '@/features/member/components/MemberStatusBadge';
import { PageHeader } from '@/shared/components/PageHeader';
import { DataTable } from '@/shared/components/dataTable/DataTable';
import { DataTableColumnIds } from '@/shared/components/dataTable/DataTableColumnHeader';
import { DataTablePagination } from '@/shared/components/dataTable/DataTablePagination';
import { DataTableQueryParams } from '@/shared/components/dataTable/DataTableQueryParams';
import { dataTableHeader } from '@/shared/components/dataTable/dataTableHeader';
import { dataTablePageCount } from '@/shared/components/dataTable/dataTablePageCount';
import { dataTableSortToPrisma } from '@/shared/components/dataTable/dataTableSortToPrisma';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/shared/components/ui/avatar';
import { Checkbox } from '@/shared/components/ui/checkbox';
import { apiClient } from '@/shared/lib/apiClient';
import { downloadUrl } from '@/shared/lib/downloadUrl';
import { objectToQuery } from '@/shared/lib/objectToQuery';
import { useAuthStore } from '@/features/auth/authStore';
import { useDataTableStore } from '@/shared/stores/dataTableStore';
import type { FileUploaded } from '@project/backend/features/file/fileSchemas';
import type { MemberWithRelationships } from '@project/backend/features/member/memberSchemas';
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
const TABLE_ID = 'member-list';
const NAMESPACE = 'member';

export function MemberList() {
  const dictionary = useAuthStore((state) => state.dictionary);
  const config = useAuthStore((state) => state.config);
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
    return searchParams.memberFilter || {};
  }, [searchParams]);

  const [columnVisibility, setColumnVisibility] = useState(() =>
    getColumnVisibility(TABLE_ID),
  );

  const columns: ColumnDef<MemberWithRelationships>[] = useMemo(() => {
    const cols: ColumnDef<MemberWithRelationships>[] = [
      {
        id: DataTableColumnIds.select,
        header: ({ table }) => (
          <Checkbox
            checked={table.getIsAllPageRowsSelected()}
            onCheckedChange={(value) =>
              table.toggleAllPageRowsSelected(!!value)
            }
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
        accessorKey: 'avatars',
        meta: {
          title: dictionary.member.fields.avatars,
        },
        enableSorting: false,
        cell: ({ row }) => {
          const avatars: FileUploaded[] = row.getValue('avatars');
          return (
            <Avatar>
              <AvatarImage
                className="object-cover"
                src={downloadUrl(avatars)}
              />
              <AvatarFallback></AvatarFallback>
            </Avatar>
          );
        },
      },
      {
        accessorKey: 'user.email',
        meta: {
          title: dictionary.member.fields.email,
        },
        cell: ({ getValue, row }) => (
          <span className="whitespace-nowrap">
            <Link
              className="text-blue-500 hover:text-blue-400 hover:underline focus:text-blue-400 dark:text-blue-400"
              to={`/member/${row?.original?.id}`}
              search={{
                referrer: window.location.pathname + window.location.search,
              }}
              preload="intent"
            >
              {getValue() as string}
            </Link>
          </span>
        ),
      },
      {
        accessorKey: 'fullName',
        meta: {
          title: dictionary.member.fields.fullName,
        },
      },
      {
        accessorKey: 'role',
        meta: {
          title: dictionary.member.fields.role,
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
    ];

    if (config?.organizationDefaultRole) {
      cols.push({
        accessorKey: 'disabled',
        meta: {
          title: dictionary.member.fields.status,
        },
        enableSorting: false,
        cell: ({ row }) => <MemberStatusBadge member={row.original} />,
      });
    }

    cols.push({
      id: DataTableColumnIds.actions,
      meta: {
        sticky: true,
      },
      cell: ({ row }) => <MemberActions mode="table" member={row.original} />,
      enableSorting: false,
      enableHiding: false,
    });

    return cols;
  }, [dictionary, config]);

  const query = useQuery({
    queryKey: ['member', 'list', filter, sorting, pagination],
    queryFn: async ({ signal }) => {
      const skip = pagination.pageIndex * pagination.pageSize;
      const take = pagination.pageSize;

      return await apiClient
        .get(
          `api/member?${objectToQuery({
            filter: filter,
            skip: Number.isFinite(skip) ? skip : 0,
            take: Number.isFinite(take) ? take : 10,
            orderBy: dataTableSortToPrisma(sorting),
          })}`,
          { signal },
        )
        .json<{
          count: number;
          members: MemberWithRelationships[];
        }>();
    },
  });

  const table = useReactTable({
    getRowId: ({ originalRow, index }) => originalRow?.id || index,
    data: query.data?.members || defaultData,
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
    <>
      <div className="flex items-center justify-between">
        <PageHeader items={[[dictionary.member.list.menu]]} />
        <div className="flex gap-2">
          <MemberListActions
            filter={filter}
            sorting={sorting}
            count={query.data?.count}
            table={table}
          />
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <h2 className="text-lg font-semibold">
          {dictionary.member.list.title}
        </h2>
        <MemberListFilter isLoading={query.isLoading} />
        <DataTable
          table={table}
          isLoading={query.isLoading}
          columns={columns}
          notFoundText={dictionary.member.list.noResults}
          newButton={<MemberNewButton />}
        />
        <DataTablePagination table={table} />
      </div>
    </>
  );
}
