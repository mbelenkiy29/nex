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
import { StudyNoteActions } from '@/features/studyNote/components/StudyNoteActions';
import { StudyNoteListActions } from '@/features/studyNote/components/StudyNoteListActions';
import { StudyNoteListFilter } from '@/features/studyNote/components/StudyNoteListFilter';
import {
  StudyNoteWithRelationships,
  studyNoteFilterInputSchema,
} from '@project/backend/features/studyNote/studyNoteSchemas';
import { PageHeader } from '@/shared/components/PageHeader';
import { DataTable } from '@/shared/components/dataTable/DataTable';
import { DataTableColumnIds } from '@/shared/components/dataTable/DataTableColumnHeader';
import { DataTablePagination } from '@/shared/components/dataTable/DataTablePagination';
import { DataTableQueryParams } from '@/shared/components/dataTable/DataTableQueryParams';
import { dataTableHeader } from '@/shared/components/dataTable/dataTableHeader';
import { dataTablePageCount } from '@/shared/components/dataTable/dataTablePageCount';
import { dataTableSortToPrisma } from '@/shared/components/dataTable/dataTableSortToPrisma';
import { Checkbox } from '@/shared/components/ui/checkbox';
import { StudyNoteNewButton } from '@/features/studyNote/components/StudyNoteNewButton';
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
import { ChapterWithRelationships } from '@project/backend/features/chapter/chapterSchemas';
import { ChapterLink } from '@/features/chapter/components/ChapterLink';
import { LessonWithRelationships } from '@project/backend/features/lesson/lessonSchemas';
import { LessonLink } from '@/features/lesson/components/LessonLink';
import { MemberWithRelationships } from '@project/backend/features/member/memberSchemas';
import { MemberLink } from '@/features/member/components/MemberLink';
import { studyNoteLabel } from '@project/backend/features/studyNote/studyNoteLabel';
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
const TABLE_ID = 'studyNote-list';

export const studyNoteListLazyRoute = createLazyRoute('/study-note')({
  component: StudyNoteListPage,
});

export function StudyNoteListPage() {
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
      studyNoteFilterInputSchema,
    );
  }, [searchParams]);

  const [columnVisibility, setColumnVisibility] = useState(() =>
    getColumnVisibility(TABLE_ID),
  );

  const hasPermissionToImport = hasPermission({
    studyNote: ['import'],
  });

  const columns: ColumnDef<StudyNoteWithRelationships>[] = [
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
      accessorKey: 'title',
      meta: {
        title: dictionary.studyNote.fields.title,
      },
      cell: ({ row }) => (
        <span className="whitespace-nowrap">
          <Link
            className="text-blue-500 hover:text-blue-400 hover:underline focus:text-blue-400 dark:text-blue-400"
            to={`/study-note/${row?.original?.id}`}
            search={{
              referrer: window.location.pathname + window.location.search,
            }}
          >
            {studyNoteLabel(row?.original, dictionary, locale)}
          </Link>
        </span>
      ),
    },
    {
      accessorKey: 'isFavorite',
      meta: {
        title: dictionary.studyNote.fields.isFavorite,
      },
      cell: ({ row }) => {
        return row.getValue('isFavorite')
          ? dictionary.shared.yes
          : dictionary.shared.no;
      },
    },
    {
      accessorKey: 'tags',
      meta: {
        title: dictionary.studyNote.fields.tags,
      },
      enableSorting: false,
      cell: ({ row }) => {
        return (
          <div>
            {(row.getValue('tags') as Array<string>).map((value) => {
              return <div key={value}>{value}</div>;
            })}
          </div>
        );
      },
    },
    {
      accessorKey: 'chapter',
      meta: {
        title: dictionary.studyNote.fields.chapter,
      },
      enableSorting: false,
      cell: ({ row }) => {
        return <ChapterLink chapter={row.getValue('chapter')} />;
      },
    },
    {
      accessorKey: 'lesson',
      meta: {
        title: dictionary.studyNote.fields.lesson,
      },
      enableSorting: false,
      cell: ({ row }) => {
        return <LessonLink lesson={row.getValue('lesson')} />;
      },
    },
    {
      accessorKey: 'author',
      meta: {
        title: dictionary.studyNote.fields.author,
      },
      enableSorting: false,
      cell: ({ row }) => {
        return <MemberLink member={row.getValue('author')} />;
      },
    },
    {
      accessorKey: 'createdByMember',
      meta: {
        title: dictionary.studyNote.fields.createdByMember,
      },
      enableSorting: false,
      cell: ({ row }) => {
        return <MemberLink member={row.getValue('createdByMember')} />;
      },
    },
    {
      accessorKey: 'createdAt',
      meta: {
        title: dictionary.studyNote.fields.createdAt,
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
        title: dictionary.studyNote.fields.updatedByMember,
      },
      enableSorting: false,
      cell: ({ row }) => {
        return <MemberLink member={row.getValue('updatedByMember')} />;
      },
    },
    {
      accessorKey: 'updatedAt',
      meta: {
        title: dictionary.studyNote.fields.updatedAt,
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
        <StudyNoteActions mode="table" studyNote={row.original} />
      ),
      enableSorting: false,
      enableHiding: false,
    },
  ];

  const query = useQuery({
    queryKey: ['studyNote', 'list', filter, sorting, pagination],
    queryFn: async ({ signal }) => {
      return await apiClient
        .get(
          `api/study-note?${objectToQuery({
            filter: filter,
            skip: pagination.pageIndex * pagination.pageSize,
            take: pagination.pageSize,
            orderBy: dataTableSortToPrisma(sorting),
          })}`,
          { signal },
        )
        .json<{
          count: number;
          studyNotes: StudyNoteWithRelationships[];
        }>();
    },
  });

  const table = useReactTable({
    getRowId: ({ originalRow, index }) => originalRow?.id || index,
    data: query.data?.studyNotes || defaultData,
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
        <PageHeader items={[[dictionary.studyNote.list.menu]]} />
        {!(
          isFilterEmpty(filter) &&
          query.data?.count === 0 &&
          !query.isLoading
        ) && (
          <div className="flex gap-2">
            <StudyNoteListActions
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
            <EmptyTitle>{dictionary.studyNote.list.title}</EmptyTitle>
            <EmptyDescription>
              {dictionary.studyNote.list.empty}
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <div className="flex flex-col items-center gap-6">
              <div className="flex gap-2">
                <StudyNoteNewButton />
                {hasPermissionToImport && (
                  <Button
                    nativeButton={false}
                    variant="outline"
                    render={<Link to="/study-note/importer" />}
                  >
                    {dictionary.studyNote.importer.menu}
                  </Button>
                )}
              </div>
              <Link
                to="/study-note"
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
          <StudyNoteListFilter isLoading={query.isLoading} />

          <DataTable
            table={table}
            isLoading={query.isLoading}
            columns={columns}
            notFoundText={dictionary.studyNote.list.noResults}
            newButton={<StudyNoteNewButton />}
          />

          <DataTablePagination table={table} />
        </>
      )}
    </div>
  );
}
