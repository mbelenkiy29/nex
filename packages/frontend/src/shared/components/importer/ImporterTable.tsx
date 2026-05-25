import {
  ColumnDef,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { isArray, truncate } from 'lodash-es';
import { DataTable } from '@/shared/components/dataTable/DataTable';
import { DataTablePagination } from '@/shared/components/dataTable/DataTablePagination';
import { dataTableHeader } from '@/shared/components/dataTable/dataTableHeader';
import { ImporterRowStatus } from '@/shared/components/importer/ImporterRowStatus';
import { useAuthStore } from '@/features/auth/authStore';

export function ImporterTable({
  keys,
  labels,
  rows,
}: {
  keys: string[];
  labels: Record<string, string>;
  rows: any[];
}) {
  const dictionary = useAuthStore((state) => state.dictionary);

  const dataColumns = keys.map((key) => {
    return {
      accessorKey: key,
      meta: {
        title: labels[key],
      },
    };
  });

  const columns: ColumnDef<any>[] = [
    {
      accessorKey: '_line',
      meta: {
        title: dictionary.shared.importer.line,
      },
    },
    {
      accessorKey: '_status',
      meta: {
        title: dictionary.shared.importer.status,
      },
      cell: ({ row }) => (
        <div className="whitespace-nowrap">
          <ImporterRowStatus
            _status={row.original._status}
            _errorMessages={row.original._errorMessages}
          />
        </div>
      ),
    },

    ...dataColumns,
  ];

  const table = useReactTable({
    data: rows,
    columns,
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getCoreRowModel: getCoreRowModel(),
    defaultColumn: {
      header: dataTableHeader('left'),
      cell: ({ getValue }) => {
        const value = getValue();
        if (isArray(value)) {
          return (
            <span className="whitespace-nowrap">
              {value.map((item, index) => {
                const displayValue =
                  typeof item === 'string'
                    ? item
                    : item?.name || item?.key || String(item);
                const titleValue =
                  typeof item === 'string'
                    ? item
                    : item?.signedUrl ||
                      item?.publicUrl ||
                      item?.name ||
                      String(item);

                return (
                  <div title={titleValue} key={index}>
                    {truncate(displayValue, { length: 40 })}
                  </div>
                );
              })}
            </span>
          );
        }

        return (
          <span className="whitespace-nowrap" title={String(value)}>
            {truncate(value as string, { length: 40 })}
          </span>
        );
      },
    },
  });

  return (
    <>
      <DataTable table={table} columns={dataColumns} />
      <DataTablePagination table={table} />
    </>
  );
}
