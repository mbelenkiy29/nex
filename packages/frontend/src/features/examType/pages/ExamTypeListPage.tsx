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
import { ExamTypeActions } from '@/features/examType/components/ExamTypeActions';
import { ExamTypeListActions } from '@/features/examType/components/ExamTypeListActions';
import { ExamTypeListFilter } from '@/features/examType/components/ExamTypeListFilter';
import {
  ExamTypeWithRelationships,
  examTypeFilterInputSchema,
} from '@project/backend/features/examType/examTypeSchemas';
import { PageHeader } from '@/shared/components/PageHeader';
import { DataTable } from '@/shared/components/dataTable/DataTable';
import { DataTableColumnIds } from '@/shared/components/dataTable/DataTableColumnHeader';
import { DataTablePagination } from '@/shared/components/dataTable/DataTablePagination';
import { DataTableQueryParams } from '@/shared/components/dataTable/DataTableQueryParams';
import { dataTableHeader } from '@/shared/components/dataTable/dataTableHeader';
import { dataTablePageCount } from '@/shared/components/dataTable/dataTablePageCount';
import { dataTableSortToPrisma } from '@/shared/components/dataTable/dataTableSortToPrisma';
import { Checkbox } from '@/shared/components/ui/checkbox';
import { ExamTypeNewButton } from '@/features/examType/components/ExamTypeNewButton';
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
import { ExamWithRelationships } from '@project/backend/features/exam/examSchemas';
import { ExamLink } from '@/features/exam/components/ExamLink';
import { examTypeLabel } from '@project/backend/features/examType/examTypeLabel';
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
const TABLE_ID = 'examType-list';

export const examTypeListLazyRoute = createLazyRoute('/exam-type')({
  component: ExamTypeListPage,
});

export function ExamTypeListPage() {
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
    return DataTableQueryParams.getFilter(
      searchParams,
      examTypeFilterInputSchema,
    );
  }, [searchParams]);

  const [columnVisibility, setColumnVisibility] = useState(() =>
    getColumnVisibility(TABLE_ID),
  );

  const hasPermissionToImport = hasPermission({
    examType: ['import'],
  });

  const columns: ColumnDef<ExamTypeWithRelationships>[] = [
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
        title: dictionary.examType.fields.name,
      },
      cell: ({ row }) => (
        <span className="whitespace-nowrap">
          <Link
            className="text-blue-500 hover:text-blue-400 hover:underline focus:text-blue-400 dark:text-blue-400"
            to={`/exam-type/${row?.original?.id}`}
            search={{
              referrer: window.location.pathname + window.location.search,
            }}
          >
            {examTypeLabel(row?.original, dictionary, locale)}
          </Link>
        </span>
      ),
    },
    {
      accessorKey: 'type',
      meta: {
        title: dictionary.examType.fields.type,
      },
      cell: ({ row }) => {
        return dictionaryEnumerator(
          dictionary.examType.enumerators.type,
          row.getValue('type'),
        );
      },
    },
    {
      accessorKey: 'questionCount',
      meta: {
        title: dictionary.examType.fields.questionCount,
      },
      header: dataTableHeader('right'),
      cell: ({ getValue }) => {
        return (
          <div className="text-right whitespace-nowrap">
            {getValue() as string}
          </div>
        );
      },
    },
    {
      accessorKey: 'timeLimitMinutes',
      meta: {
        title: dictionary.examType.fields.timeLimitMinutes,
      },
      header: dataTableHeader('right'),
      cell: ({ getValue }) => {
        return (
          <div className="text-right whitespace-nowrap">
            {getValue() as string}
          </div>
        );
      },
    },
    {
      accessorKey: 'passingScore',
      meta: {
        title: dictionary.examType.fields.passingScore,
      },
      header: dataTableHeader('right'),
      cell: ({ getValue }) => {
        return (
          <div className="text-right whitespace-nowrap">
            {getValue() as string}
          </div>
        );
      },
    },
    {
      accessorKey: 'isActive',
      meta: {
        title: dictionary.examType.fields.isActive,
      },
      cell: ({ row }) => {
        return row.getValue('isActive')
          ? dictionary.shared.yes
          : dictionary.shared.no;
      },
    },
    {
      accessorKey: 'exam',
      meta: {
        title: dictionary.examType.fields.exam,
      },
      enableSorting: false,
      cell: ({ row }) => {
        return <ExamLink exam={row.getValue('exam')} />;
      },
    },
    {
      id: DataTableColumnIds.actions,
      meta: {
        sticky: true,
      },
      cell: ({ row }) => (
        <ExamTypeActions mode="table" examType={row.original} />
      ),
      enableSorting: false,
      enableHiding: false,
    },
  ];

  const query = useQuery({
    queryKey: ['examType', 'list', filter, sorting, pagination],
    queryFn: async ({ signal }) => {
      return await apiClient
        .get(
          `api/exam-type?${objectToQuery({
            filter: filter,
            skip: pagination.pageIndex * pagination.pageSize,
            take: pagination.pageSize,
            orderBy: dataTableSortToPrisma(sorting),
          })}`,
          { signal },
        )
        .json<{
          count: number;
          examTypes: ExamTypeWithRelationships[];
        }>();
    },
  });

  const table = useReactTable({
    getRowId: ({ originalRow, index }) => originalRow?.id || index,
    data: query.data?.examTypes || defaultData,
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
        <PageHeader items={[[dictionary.examType.list.menu]]} />
        {!(
          isFilterEmpty(filter) &&
          query.data?.count === 0 &&
          !query.isLoading
        ) && (
          <div className="flex gap-2">
            <ExamTypeListActions
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
            <EmptyTitle>{dictionary.examType.list.title}</EmptyTitle>
            <EmptyDescription>
              {dictionary.examType.list.empty}
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <div className="flex flex-col items-center gap-6">
              <div className="flex gap-2">
                <ExamTypeNewButton />
                {hasPermissionToImport && (
                  <Button
                    nativeButton={false}
                    variant="outline"
                    render={<Link to="/exam-type/importer" />}
                  >
                    {dictionary.examType.importer.menu}
                  </Button>
                )}
              </div>
              <Link
                to="/exam-type"
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
          <ExamTypeListFilter isLoading={query.isLoading} />

          <DataTable
            table={table}
            isLoading={query.isLoading}
            columns={columns}
            notFoundText={dictionary.examType.list.noResults}
            newButton={<ExamTypeNewButton />}
          />

          <DataTablePagination table={table} />
        </>
      )}
    </div>
  );
}
