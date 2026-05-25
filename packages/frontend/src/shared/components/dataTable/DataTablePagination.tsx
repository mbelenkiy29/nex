import { Table } from '@tanstack/react-table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/shared/components/ui/pagination';
import { useAuthStore } from '@/features/auth/authStore';
import { useDataTableStore } from '@/shared/stores/dataTableStore';
import { dictionaryFormat } from '@project/backend/translation/dictionaryFormat';

const MIN_COUNT_FOR_PAGINATION = 10;

interface DataTablePaginationProps<TData> {
  table: Table<TData>;
}

export function DataTablePagination<TData>({
  table,
}: DataTablePaginationProps<TData>) {
  const dictionary = useAuthStore((state) => state.dictionary);
  const setPageSize = useDataTableStore((state) => state.setPageSize);

  const tableId = (table.options.meta as any)?.tableId;
  const totalCount = (table.options.meta as any)?.count || 0;
  const pageSize = table.getState().pagination.pageSize;
  const currentPage = table.getState().pagination.pageIndex + 1;
  const totalPages = table.getPageCount();
  const selectedCount = table.getFilteredSelectedRowModel().rows.length;

  if (totalCount <= MIN_COUNT_FOR_PAGINATION && selectedCount === 0) {
    return null;
  }

  const getPageNumbers = () => {
    const pages: (number | 'ellipsis')[] = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);

      if (currentPage > 3) {
        pages.push('ellipsis');
      }

      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (currentPage < totalPages - 2) {
        pages.push('ellipsis');
      }

      pages.push(totalPages);
    }

    return pages;
  };

  const startResult =
    totalCount > 0 ? currentPage * pageSize - pageSize + 1 : 0;
  const endResult = Math.min(currentPage * pageSize, totalCount);

  return (
    <div className="flex items-center justify-between px-2">
      <div className="text-muted-foreground text-sm">
        {totalCount >= MIN_COUNT_FOR_PAGINATION && (
          <>
            {dictionaryFormat(
              dictionary.shared.dataTable.paginationRange,
              startResult,
              endResult,
              totalCount,
            )}
          </>
        )}
        {selectedCount > 0 && (
          <span
            className={totalCount >= MIN_COUNT_FOR_PAGINATION ? 'ml-2' : ''}
          >
            {dictionaryFormat(
              dictionary.shared.dataTable.paginationSelected,
              selectedCount,
            )}
          </span>
        )}
      </div>
      {totalCount >= MIN_COUNT_FOR_PAGINATION && (
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2">
            <Select
              value={`${pageSize}`}
              onValueChange={(value) => {
                const newPageSize = Number(value);
                table.setPageSize(newPageSize);
                if (tableId) {
                  setPageSize(tableId, newPageSize);
                }
              }}
            >
              <SelectTrigger className="h-8 w-[70px]">
                <SelectValue>{pageSize}</SelectValue>
              </SelectTrigger>
              <SelectContent side="top">
                {[10, 20, 30, 40, 50].map((size) => (
                  <SelectItem key={size} value={`${size}`}>
                    {size} {dictionary.shared.dataTable.paginationRowsPerPage}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={(e) => {
                    e.preventDefault();
                    table.previousPage();
                  }}
                  aria-disabled={!table.getCanPreviousPage()}
                  className={
                    !table.getCanPreviousPage()
                      ? 'pointer-events-none opacity-50'
                      : 'cursor-pointer'
                  }
                />
              </PaginationItem>

              {getPageNumbers().map((page, index) =>
                page === 'ellipsis' ? (
                  <PaginationItem key={`ellipsis-${index}`}>
                    <PaginationEllipsis />
                  </PaginationItem>
                ) : (
                  <PaginationItem key={page}>
                    <PaginationLink
                      onClick={(e) => {
                        e.preventDefault();
                        table.setPageIndex(page - 1);
                      }}
                      isActive={currentPage === page}
                      className="cursor-pointer"
                    >
                      {page}
                    </PaginationLink>
                  </PaginationItem>
                ),
              )}

              <PaginationItem>
                <PaginationNext
                  onClick={(e) => {
                    e.preventDefault();
                    table.nextPage();
                  }}
                  aria-disabled={!table.getCanNextPage()}
                  className={
                    !table.getCanNextPage()
                      ? 'pointer-events-none opacity-50'
                      : 'cursor-pointer'
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  );
}
