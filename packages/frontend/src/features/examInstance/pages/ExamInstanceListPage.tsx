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
import { ExamInstanceActions } from '@/features/examInstance/components/ExamInstanceActions';
import { ExamInstanceListActions } from '@/features/examInstance/components/ExamInstanceListActions';
import { ExamInstanceListFilter } from '@/features/examInstance/components/ExamInstanceListFilter';
import {
  ExamInstanceWithRelationships,
  examInstanceFilterInputSchema,
} from '@project/backend/features/examInstance/examInstanceSchemas';
import { PageHeader } from '@/shared/components/PageHeader';
import { DataTable } from '@/shared/components/dataTable/DataTable';
import { DataTableColumnIds } from '@/shared/components/dataTable/DataTableColumnHeader';
import { DataTablePagination } from '@/shared/components/dataTable/DataTablePagination';
import { DataTableQueryParams } from '@/shared/components/dataTable/DataTableQueryParams';
import { dataTableHeader } from '@/shared/components/dataTable/dataTableHeader';
import { dataTablePageCount } from '@/shared/components/dataTable/dataTablePageCount';
import { dataTableSortToPrisma } from '@/shared/components/dataTable/dataTableSortToPrisma';
import { Checkbox } from '@/shared/components/ui/checkbox';
import { ExamInstanceNewButton } from '@/features/examInstance/components/ExamInstanceNewButton';
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
import { ExamTypeWithRelationships } from '@project/backend/features/examType/examTypeSchemas';
import { ExamTypeLink } from '@/features/examType/components/ExamTypeLink';
import { MemberWithRelationships } from '@project/backend/features/member/memberSchemas';
import { MemberLink } from '@/features/member/components/MemberLink';
import { examInstanceLabel } from '@project/backend/features/examInstance/examInstanceLabel';
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
const TABLE_ID = 'examInstance-list';

export const examInstanceListLazyRoute = createLazyRoute('/exam-instance')({
  component: ExamInstanceListPage,
});

export function ExamInstanceListPage() {
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
      examInstanceFilterInputSchema,
    );
  }, [searchParams]);

  const [columnVisibility, setColumnVisibility] = useState(() =>
    getColumnVisibility(TABLE_ID),
  );

  const hasPermissionToImport = hasPermission({
    examInstance: ['import'],
  });

  const columns: ColumnDef<ExamInstanceWithRelationships>[] = [
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
      accessorKey: 'status',
      meta: {
        title: dictionary.examInstance.fields.status,
      },
      cell: ({ row }) => (
        <span className="whitespace-nowrap">
          <Link
            className="text-blue-500 hover:text-blue-400 hover:underline focus:text-blue-400 dark:text-blue-400"
            to={`/exam-instance/${row?.original?.id}`}
            search={{
              referrer: window.location.pathname + window.location.search,
            }}
          >
            {examInstanceLabel(row?.original, dictionary, locale)}
          </Link>
        </span>
      ),
    },
    {
      accessorKey: 'score',
      meta: {
        title: dictionary.examInstance.fields.score,
      },
      header: dataTableHeader('right'),
      cell: ({ getValue }) => {
        return (
          <div className="text-right whitespace-nowrap">
            {formatDecimal(getValue() as string, locale, 2)}
          </div>
        );
      },
    },
    {
      accessorKey: 'passed',
      meta: {
        title: dictionary.examInstance.fields.passed,
      },
      cell: ({ row }) => {
        return row.getValue('passed')
          ? dictionary.shared.yes
          : dictionary.shared.no;
      },
    },
    {
      accessorKey: 'startedAt',
      meta: {
        title: dictionary.examInstance.fields.startedAt,
      },
      cell: ({ row }) => (
        <span className="whitespace-nowrap">
          {formatDateTime(row.getValue('startedAt'), dictionary)}
        </span>
      ),
    },
    {
      accessorKey: 'completedAt',
      meta: {
        title: dictionary.examInstance.fields.completedAt,
      },
      cell: ({ row }) => (
        <span className="whitespace-nowrap">
          {formatDateTime(row.getValue('completedAt'), dictionary)}
        </span>
      ),
    },
    {
      accessorKey: 'timeSpentSeconds',
      meta: {
        title: dictionary.examInstance.fields.timeSpentSeconds,
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
      accessorKey: 'examType',
      meta: {
        title: dictionary.examInstance.fields.examType,
      },
      enableSorting: false,
      cell: ({ row }) => {
        return <ExamTypeLink examType={row.getValue('examType')} />;
      },
    },
    {
      accessorKey: 'student',
      meta: {
        title: dictionary.examInstance.fields.student,
      },
      enableSorting: false,
      cell: ({ row }) => {
        return <MemberLink member={row.getValue('student')} />;
      },
    },
    {
      accessorKey: 'createdByMember',
      meta: {
        title: dictionary.examInstance.fields.createdByMember,
      },
      enableSorting: false,
      cell: ({ row }) => {
        return <MemberLink member={row.getValue('createdByMember')} />;
      },
    },
    {
      accessorKey: 'createdAt',
      meta: {
        title: dictionary.examInstance.fields.createdAt,
      },
      cell: ({ row }) => (
        <span className="whitespace-nowrap">
          {formatDateTime(row.getValue('createdAt'), dictionary)}
        </span>
      ),
    },
    {
      accessorKey: 'updatedByMember',
      meta: {
        title: dictionary.examInstance.fields.updatedByMember,
      },
      enableSorting: false,
      cell: ({ row }) => {
        return <MemberLink member={row.getValue('updatedByMember')} />;
      },
    },
    {
      accessorKey: 'updatedAt',
      meta: {
        title: dictionary.examInstance.fields.updatedAt,
      },
      cell: ({ row }) => (
        <span className="whitespace-nowrap">
          {formatDateTime(row.getValue('updatedAt'), dictionary)}
        </span>
      ),
    },
    {
      id: DataTableColumnIds.actions,
      meta: {
        sticky: true,
      },
      cell: ({ row }) => (
        <ExamInstanceActions mode="table" examInstance={row.original} />
      ),
      enableSorting: false,
      enableHiding: false,
    },
  ];

  const query = useQuery({
    queryKey: ['examInstance', 'list', filter, sorting, pagination],
    queryFn: async ({ signal }) => {
      return await apiClient
        .get(
          `api/exam-instance?${objectToQuery({
            filter: filter,
            skip: pagination.pageIndex * pagination.pageSize,
            take: pagination.pageSize,
            orderBy: dataTableSortToPrisma(sorting),
          })}`,
          { signal },
        )
        .json<{
          count: number;
          examInstances: ExamInstanceWithRelationships[];
        }>();
    },
  });

  const table = useReactTable({
    getRowId: ({ originalRow, index }) => originalRow?.id || index,
    data: query.data?.examInstances || defaultData,
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
        <PageHeader items={[[dictionary.examInstance.list.menu]]} />
        {!(
          isFilterEmpty(filter) &&
          query.data?.count === 0 &&
          !query.isLoading
        ) && (
          <div className="flex gap-2">
            <ExamInstanceListActions
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
            <EmptyTitle>{dictionary.examInstance.list.title}</EmptyTitle>
            <EmptyDescription>
              {dictionary.examInstance.list.empty}
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <div className="flex flex-col items-center gap-6">
              <div className="flex gap-2">
                <ExamInstanceNewButton />
                {hasPermissionToImport && (
                  <Button
                    nativeButton={false}
                    variant="outline"
                    render={<Link to="/exam-instance/importer" />}
                  >
                    {dictionary.examInstance.importer.menu}
                  </Button>
                )}
              </div>
            </div>
          </EmptyContent>
        </Empty>
      ) : (
        <>
          <ExamInstanceListFilter isLoading={query.isLoading} />

          <DataTable
            table={table}
            isLoading={query.isLoading}
            columns={columns}
            notFoundText={dictionary.examInstance.list.noResults}
            newButton={<ExamInstanceNewButton />}
          />

          <DataTablePagination table={table} />
        </>
      )}
    </div>
  );
}
