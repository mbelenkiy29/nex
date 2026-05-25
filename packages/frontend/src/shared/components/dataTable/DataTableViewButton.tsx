import { Table } from '@tanstack/react-table';
import { RxMixerHorizontal } from 'react-icons/rx';
import { Button } from '@/shared/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/shared/components/ui/dropdown-menu';
import { useAuthStore } from '@/features/auth/authStore';

export function DataTableViewOptions<TData>({
  table,
}: {
  table: Table<TData>;
}) {
  const dictionary = useAuthStore((state) => state.dictionary);

  const hasHiddenColumns = table
    .getAllColumns()
    .some(
      (c) => c.accessorFn !== undefined && c.getCanHide() && !c.getIsVisible(),
    );

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            variant="outline"
            size="sm"
            className="relative ml-auto flex h-8"
          />
        }
      >
        <RxMixerHorizontal className="mr-2 h-4 w-4" />
        {dictionary.shared.dataTable.viewOptions}
        {hasHiddenColumns && (
          <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full border border-blue-300 bg-blue-500 dark:border-blue-700"></span>
          </span>
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[150px]">
        <DropdownMenuLabel>
          {dictionary.shared.dataTable.toggleColumns}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {table
          .getAllColumns()
          .filter(
            (column) =>
              typeof column.accessorFn !== 'undefined' && column.getCanHide(),
          )
          .map((column) => {
            return (
              <DropdownMenuCheckboxItem
                key={column.id}
                className="capitalize"
                checked={column.getIsVisible()}
                onCheckedChange={(value) => column.toggleVisibility(!!value)}
              >
                {(column.columnDef.meta as Record<string, string>)?.title}
              </DropdownMenuCheckboxItem>
            );
          })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
