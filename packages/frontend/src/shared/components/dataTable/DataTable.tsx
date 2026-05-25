import {
  ColumnDef,
  Table as ReactTable,
  flexRender,
} from '@tanstack/react-table';
import { cn } from '@/shared/lib/utils';
import { DataTableEmptyRow } from '@/shared/components/dataTable/DataTableEmptyRow';
import { DataTableSkeletonRow } from '@/shared/components/dataTable/DataTableSkeletonRow';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/shared/components/ui/table';

export function DataTable({
  table,
  notFoundText,
  newButton,
  columns,
  isLoading,
}: {
  table: ReactTable<any>;
  columns: ColumnDef<any>[];
  isLoading?: boolean;
  notFoundText?: string;
  newButton?: React.ReactNode;
}) {
  return (
    <div className="rounded-md border">
      <div className="overflow-x-auto rounded-md">
        <Table>
          <TableHeader className="bg-sidebar">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow
                key={headerGroup.id}
                className={'group hover:bg-muted-half'}
              >
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead
                      key={header.id}
                      className={cn(
                        (header?.column?.columnDef?.meta as any)?.sticky
                          ? `bg-sidebar group-hover:bg-muted-half sticky right-0 w-0 transition-colors`
                          : '',
                        '[&:has([role=checkbox])]:w-12',
                      )}
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                  className={'group hover:bg-muted-half'}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      className={
                        (cell?.column?.columnDef?.meta as any)?.sticky
                          ? `bg-background group-hover:bg-muted-half sticky right-0 w-0 transition-colors ${
                              row.getIsSelected() && 'bg-muted'
                            }`
                          : ''
                      }
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : isLoading ? (
              <DataTableSkeletonRow columns={columns} />
            ) : (
              <DataTableEmptyRow
                text={notFoundText}
                newButton={newButton}
                columns={columns}
              />
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
