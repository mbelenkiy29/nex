import { useQuery } from '@tanstack/react-query';
import {
  ColumnDef,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import {
  createLazyRoute,
  Link,
  useNavigate,
  useSearch,
} from '@tanstack/react-router';
import { useMemo, useState } from 'react';
import { useAuthStore } from '@/features/auth/authStore';
import { useDataTableStore } from '@/shared/stores/dataTableStore';
import { ExamActions } from '@/features/exam/components/ExamActions';
import { ExamListActions } from '@/features/exam/components/ExamListActions';
import { ExamListFilter } from '@/features/exam/components/ExamListFilter';
import {
  ExamWithRelationships,
  examFilterInputSchema,
} from '@project/backend/features/exam/examSchemas';
import { PageHeader } from '@/shared/components/PageHeader';
import { DataTable } from '@/shared/components/dataTable/DataTable';
import { DataTableColumnIds } from '@/shared/components/dataTable/DataTableColumnHeader';
import { DataTablePagination } from '@/shared/components/dataTable/DataTablePagination';
import { DataTableQueryParams } from '@/shared/components/dataTable/DataTableQueryParams';
import { dataTableHeader } from '@/shared/components/dataTable/dataTableHeader';
import { dataTablePageCount } from '@/shared/components/dataTable/dataTablePageCount';
import { dataTableSortToPrisma } from '@/shared/components/dataTable/dataTableSortToPrisma';
import { Checkbox } from '@/shared/components/ui/checkbox';
import { ExamNewButton } from '@/features/exam/components/ExamNewButton';
import { dictionaryEnumerator } from '@project/backend/translation/dictionaryEnumerator';
import { formatDate } from '@project/backend/shared/lib/formatDate';
import { formatDateTime } from '@project/backend/shared/lib/formatDateTime';
import { downloadUrl } from '@/shared/lib/downloadUrl';
import { FilesList } from '@/features/file/components/FilesList';
import { FileUploaded } from '@project/backend/features/file/fileSchemas';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/shared/components/ui/avatar';
import { formatDecimal } from '@project/backend/shared/lib/formatDecimal';
import { examLabel } from '@project/backend/features/exam/examLabel';
import { apiClient } from '@/shared/lib/apiClient';
import { objectToQuery } from '@/shared/lib/objectToQuery';
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/shared/components/ui/empty';
import { IoFolderOpenOutline } from 'react-icons/io5';
import { isFilterEmpty } from '@/shared/lib/isFilterEmpty';
import { Button } from '@/shared/components/ui/button';

const defaultData: Array<any> = [];
const TABLE_ID = 'exam-list';

export const examListLazyRoute = createLazyRoute('/exam')({
  component: ExamListPage,
});

export function ExamListPage() {
  const dictionary = useAuthStore((state) => state.dictionary);
  const hasPermission = useAuthStore((state) => state.hasPermission);
  const locale = useAuthStore((state) => state.locale);
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
    return DataTableQueryParams.getSorting(searchParams);
  }, [searchParams]);

  const pagination = useMemo(() => {
    return DataTableQueryParams.getPagination(
      searchParams,
      getPageSize(TABLE_ID),
    );
  }, [searchParams, getPageSize]);

  const filter = useMemo(() => {
    return DataTableQueryParams.getFilter(searchParams, examFilterInputSchema);
  }, [searchParams]);

  const [columnVisibility, setColumnVisibility] = useState(() =>
    getColumnVisibility(TABLE_ID),
  );

  const hasPermissionToImport = hasPermission({
    exam: ['import'],
  });

  const columns: ColumnDef<ExamWithRelationships>[] = [
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
      accessorKey: 'name',
      meta: {
        title: dictionary.exam.fields.name,
      },
      cell: ({ row }) => (
        <span className="whitespace-nowrap">
          <Link
            className="text-blue-500 hover:text-blue-400 hover:underline focus:text-blue-400 dark:text-blue-400"
            to={`/exam/${row?.original?.id}`}
            search={{
              referrer: window.location.pathname + window.location.search,
            }}
          >
            {examLabel(row?.original, dictionary, locale)}
          </Link>
        </span>
      ),
    },
    {
      accessorKey: 'code',
      meta: {
        title: dictionary.exam.fields.code,
      },
    },
    {
      accessorKey: 'isActive',
      meta: {
        title: dictionary.exam.fields.isActive,
      },
      cell: ({ row }) => {
        return row.getValue('isActive')
          ? dictionary.shared.yes
          : dictionary.shared.no;
      },
    },
    {
      id: DataTableColumnIds.actions,
      meta: {
        sticky: true,
      },
      cell: ({ row }) => <ExamActions mode="table" exam={row.original} />,
      enableSorting: false,
      enableHiding: false,
    },
  ];

  const query = useQuery({
    queryKey: ['exam', 'list', filter, sorting, pagination],
    queryFn: async ({ signal }) => {
      return await apiClient
        .get(
          `api/exam?${objectToQuery({
            filter: filter,
            skip: pagination.pageIndex * pagination.pageSize,
            take: pagination.pageSize,
            orderBy: dataTableSortToPrisma(sorting),
          })}`,
          { signal },
        )
        .json<{
          count: number;
          exams: ExamWithRelationships[];
        }>();
    },
  });

  const table = useReactTable({
    getRowId: ({ originalRow, index }) => originalRow?.id || index,
    data: query.data?.exams || defaultData,
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
    <div className="mb-4 flex w-full max-w-full flex-col gap-4 overflow-hidden p-6">
      <div className="flex items-center justify-between">
        <PageHeader items={[[dictionary.exam.list.menu]]} />
        {!(
          isFilterEmpty(filter) &&
          query.data?.count === 0 &&
          !query.isLoading
        ) && (
          <div className="flex gap-2">
            <ExamListActions
              filter={filter}
              sorting={sorting}
              count={query.data?.count}
              table={table}
            />
          </div>
        )}
      </div>

      {isFilterEmpty(filter) && query.data?.count === 0 && !query.isLoading ? (
        <Empty>
          <EmptyHeader>
            <EmptyMedia>
              <IoFolderOpenOutline className="size-12" />
            </EmptyMedia>
            <EmptyTitle>{dictionary.exam.list.title}</EmptyTitle>
            <EmptyDescription>{dictionary.exam.list.empty}</EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <div className="flex flex-col items-center gap-6">
              <div className="flex gap-2">
                <ExamNewButton />
                {hasPermissionToImport && (
                  <Button
                    nativeButton={false}
                    variant="outline"
                    render={<Link to="/exam/importer" />}
                  >
                    {dictionary.exam.importer.menu}
                  </Button>
                )}
              </div>
              <Link
                to="/exam"
                search={{ filter: { archived: 'true' } }}
                className="text-muted-foreground text-sm hover:text-blue-400 hover:underline dark:text-blue-400"
              >
                {dictionary.shared.viewArchived}
              </Link>
            </div>
          </EmptyContent>
        </Empty>
      ) : (
        <>
          <ExamListFilter isLoading={query.isLoading} />

          <DataTable
            table={table}
            isLoading={query.isLoading}
            columns={columns}
            notFoundText={dictionary.exam.list.noResults}
            newButton={<ExamNewButton />}
          />

          <DataTablePagination table={table} />
        </>
      )}
    </div>
  );
}
