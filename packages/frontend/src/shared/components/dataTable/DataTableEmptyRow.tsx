import React from 'react';
import { TableCell, TableRow } from '@/shared/components/ui/table';
import { useAuthStore } from '@/features/auth/authStore';

export function DataTableEmptyRow({
  text,
  columns,
  newButton,
}: {
  text?: string;
  columns: any[];
  newButton?: React.ReactNode;
}) {
  const dictionary = useAuthStore((state) => state.dictionary);
  return (
    <TableRow>
      <TableCell colSpan={columns.length}>
        <div className="flex items-center justify-center gap-8 p-8">
          <div className="flex flex-col items-center gap-4">
            <span className="text-muted-foreground text-sm font-medium">
              {text || dictionary.shared.dataTable.noResults}
            </span>

            {newButton}
          </div>
        </div>
      </TableCell>
    </TableRow>
  );
}
