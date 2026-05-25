import { Column } from '@tanstack/react-table';
import {
  RxArrowDown,
  RxArrowUp,
  RxCaretSort,
  RxCross2,
  RxEyeNone,
} from 'react-icons/rx';
import { cn } from '@/shared/lib/utils';
import { Button } from '@/shared/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/shared/components/ui/dropdown-menu';
import { useAuthStore } from '@/features/auth/authStore';

export const DataTableColumnIds = {
  select: 'select',
  actions: 'actions',
} as const;

type DataTableColumnMeta = {
  title?: string;
};

interface DataTableColumnHeaderProps<
  TData,
  TValue,
> extends React.HTMLAttributes<HTMLDivElement> {
  column: Column<TData, TValue>;
}

export function DataTableColumnHeader<TData, TValue>({
  column,
  className,
}: DataTableColumnHeaderProps<TData, TValue>) {
  const dictionary = useAuthStore((state) => state.dictionary);
  const title = (column.columnDef.meta as DataTableColumnMeta | undefined)
    ?.title;

  const canSort = column.getCanSort();
  const canHide = column.getCanHide();

  if (!canSort && !canHide) {
    return <div className={cn('whitespace-nowrap', className)}>{title}</div>;
  }

  return (
    <div className={cn('flex items-center space-x-2', className)}>
      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <Button
              variant="ghost"
              size="sm"
              className="aria-expanded:bg-accent -ml-3 h-8"
            />
          }
        >
          <span className="whitespace-nowrap">{title}</span>
          {canSort && (
            <>
              {column.getIsSorted() === 'desc' ? (
                <RxArrowDown className="ml-2 h-4 w-4" />
              ) : column.getIsSorted() === 'asc' ? (
                <RxArrowUp className="ml-2 h-4 w-4" />
              ) : (
                <RxCaretSort className="ml-2 h-4 w-4" />
              )}
            </>
          )}
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          {canSort && (
            <>
              <DropdownMenuItem onClick={() => column.toggleSorting(false)}>
                <RxArrowUp className="text-muted-foreground/70 mr-2 h-3.5 w-3.5" />
                {dictionary.shared.dataTable.sortAscending}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => column.toggleSorting(true)}>
                <RxArrowDown className="text-muted-foreground/70 mr-2 h-3.5 w-3.5" />
                {dictionary.shared.dataTable.sortDescending}
              </DropdownMenuItem>
              {column.getIsSorted() && (
                <DropdownMenuItem onClick={() => column.clearSorting()}>
                  <RxCross2 className="text-muted-foreground/70 mr-2 h-3.5 w-3.5" />
                  {dictionary.shared.dataTable.clearSort}
                </DropdownMenuItem>
              )}
            </>
          )}
          {canHide && (
            <>
              {canSort && <DropdownMenuSeparator />}
              <DropdownMenuItem onClick={() => column.toggleVisibility(false)}>
                <RxEyeNone className="text-muted-foreground/70 mr-2 h-3.5 w-3.5" />
                {dictionary.shared.dataTable.hide}
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
