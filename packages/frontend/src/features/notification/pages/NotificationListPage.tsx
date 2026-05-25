import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
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
import { PageHeader } from '@/shared/components/PageHeader';
import { DataTable } from '@/shared/components/dataTable/DataTable';
import { DataTablePagination } from '@/shared/components/dataTable/DataTablePagination';
import { DataTableQueryParams } from '@/shared/components/dataTable/DataTableQueryParams';
import { dataTableHeader } from '@/shared/components/dataTable/dataTableHeader';
import { dataTablePageCount } from '@/shared/components/dataTable/dataTablePageCount';
import { dataTableSortToPrisma } from '@/shared/components/dataTable/dataTableSortToPrisma';
import { apiClient } from '@/shared/lib/apiClient';
import { formatDateTime } from '@project/backend/shared/lib/formatDateTime';
import { objectToQuery } from '@/shared/lib/objectToQuery';
import { useAuthStore } from '@/features/auth/authStore';
import { useDataTableStore } from '@/shared/stores/dataTableStore';
import { notificationFilterInputSchema } from '@project/backend/features/notification/notificationSchemas';
import { Notification } from '@project/backend/prisma/prismaTypes';
import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';
import { Link } from '@tanstack/react-router';
import { Checkbox } from '@/shared/components/ui/checkbox';
import { DataTableColumnIds } from '@/shared/components/dataTable/DataTableColumnHeader';
import { useShallow } from 'zustand/react/shallow';
import { notificationFormatContent } from '@project/backend/features/notification/notificationFormat';
import { NotificationPayload } from '@project/backend/features/notification/notificationSchemas';
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
import { dictionaryEnumerator } from '@project/backend/translation/dictionaryEnumerator';
import { NotificationListActions } from '@/features/notification/components/NotificationListActions';
import { toast } from 'sonner';

const defaultData: Array<any> = [];
const TABLE_ID = 'notification-list';

export const notificationListLazyRoute = createLazyRoute('/notification')({
  component: NotificationListPage,
});

export function NotificationListPage() {
  const { dictionary, hasPermission } = useAuthStore(
    useShallow((state) => ({
      dictionary: state.dictionary,
      hasPermission: state.hasPermission,
    })),
  );
  const getColumnVisibility = useDataTableStore(
    (state) => state.getColumnVisibility,
  );
  const setAllColumnVisibility = useDataTableStore(
    (state) => state.setAllColumnVisibility,
  );
  const getPageSize = useDataTableStore((state) => state.getPageSize);
  const navigate = useNavigate();
  const searchParams = useSearch({ strict: false }) as Record<string, any>;
  const queryClient = useQueryClient();

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
      z.input<typeof notificationFilterInputSchema>
    >(searchParams, notificationFilterInputSchema);
  }, [searchParams]);

  const [columnVisibility, setColumnVisibility] = useState(() =>
    getColumnVisibility(TABLE_ID),
  );

  const markAsReadMutation = useMutation({
    mutationFn: async (notificationId: string) => {
      return await apiClient
        .post('api/notification/mark-as-read', {
          json: { ids: [notificationId] },
        })
        .json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notification'] });
    },
    onError: (error: any) => {
      toast.error(error?.message || dictionary.shared.errors.unknown);
    },
  });

  const markAsUnreadMutation = useMutation({
    mutationFn: async (notificationId: string) => {
      return await apiClient
        .post('api/notification/mark-as-unread', {
          json: { ids: [notificationId] },
        })
        .json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notification'] });
    },
    onError: (error: any) => {
      toast.error(error?.message || dictionary.shared.errors.unknown);
    },
  });

  const columns: ColumnDef<Notification>[] = [
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
      accessorKey: 'createdAt',
      meta: {
        title: dictionary.notification.fields.createdAt,
      },
      cell: ({ getValue }) => (
        <span className="whitespace-nowrap">
          {formatDateTime(getValue() as string, dictionary)}
        </span>
      ),
    },
    {
      accessorKey: 'type',
      meta: {
        title: dictionary.notification.fields.type,
      },
      cell: ({ row }) => {
        return dictionaryEnumerator(
          dictionary.notification.enumerators.type,
          row.getValue('type'),
        );
      },
    },
    {
      accessorKey: 'payload',
      meta: {
        title: dictionary.notification.fields.message,
      },
      enableSorting: false,
      cell: ({ row }) => {
        const payload = row.original.payload as NotificationPayload;
        const content = notificationFormatContent(payload, dictionary);

        return (
          <div>
            <div>{content.subject}</div>
            <div className="text-muted-foreground">{content.pushBody}</div>
          </div>
        );
      },
    },
    {
      accessorKey: 'readAt',
      meta: {
        title: dictionary.notification.fields.readAt,
      },
      cell: ({ getValue, row }) => {
        const readAt = getValue() as string | null;
        const notificationId = row.original.id;

        if (readAt) {
          return (
            <Badge
              variant="secondary"
              className="cursor-pointer hover:opacity-80"
              onClick={(e) => {
                e.stopPropagation();
                markAsUnreadMutation.mutate(notificationId);
              }}
            >
              {dictionary.notification.status.read}
            </Badge>
          );
        }

        return (
          <Badge
            variant="default"
            className="cursor-pointer hover:opacity-80"
            onClick={(e) => {
              e.stopPropagation();
              markAsReadMutation.mutate(notificationId);
            }}
          >
            {dictionary.notification.status.unread}
          </Badge>
        );
      },
    },
  ];

  const query = useQuery({
    queryKey: ['notification', filter, sorting, pagination],
    queryFn: async ({ signal }) => {
      return await apiClient
        .get(
          `api/notification?${objectToQuery({
            filter: filter,
            offset: pagination.pageIndex * pagination.pageSize,
            limit: pagination.pageSize,
            orderBy: dataTableSortToPrisma(sorting),
          })}`,
          { signal },
        )
        .json<{ rows: Notification[]; count: number }>();
    },
  });

  const rows = query.data?.rows || defaultData;
  const count = query.data?.count || 0;

  const table = useReactTable({
    getRowId: ({ originalRow, index }) => originalRow?.id || index,
    data: rows,
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
    pageCount: dataTablePageCount(count, pagination),
    meta: {
      count,
      tableId: TABLE_ID,
    },
  });

  const hasPermissionToCreate = hasPermission({
    notification: ['create'],
  });

  const isEmpty =
    !query.isLoading && rows.length === 0 && isFilterEmpty(filter);

  return (
    <div className="mb-4 flex w-full max-w-full flex-col gap-4 overflow-hidden p-6">
      <div className="flex items-center justify-between">
        <PageHeader items={[[dictionary.notification.menu]]} />
        <div className="flex gap-2">
          <NotificationListActions table={table} />
        </div>
      </div>

      {isEmpty ? (
        <Empty>
          <EmptyHeader>
            <EmptyMedia>
              <IoFolderOpenOutline className="size-12" />
            </EmptyMedia>
            <EmptyTitle>{dictionary.notification.title}</EmptyTitle>
            <EmptyDescription>
              {dictionary.notification.noNotifications}
            </EmptyDescription>
          </EmptyHeader>
          {hasPermissionToCreate && (
            <EmptyContent>
              <div className="flex flex-col items-center gap-6">
                <div className="flex gap-2">
                  <Button
                    nativeButton={false}
                    size="sm"
                    render={<Link to="/notification/send" />}
                  >
                    {dictionary.notification.send.menu}
                  </Button>
                </div>
              </div>
            </EmptyContent>
          )}
        </Empty>
      ) : (
        <div className="space-y-4">
          <DataTable
            table={table}
            columns={columns}
            isLoading={query.isLoading}
            notFoundText={dictionary.shared.searchNotFound}
          />

          <DataTablePagination table={table} />
        </div>
      )}
    </div>
  );
}
