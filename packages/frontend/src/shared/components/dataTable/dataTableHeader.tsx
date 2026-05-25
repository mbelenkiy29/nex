import { DataTableColumnHeader } from '@/shared/components/dataTable/DataTableColumnHeader';
import { HeaderContext } from '@tanstack/react-table';

export function dataTableHeader(align: 'left' | 'center' | 'right') {
  return ({ column }: HeaderContext<any, any>) => (
    <div
      className={
        align === 'right'
          ? 'flex justify-end'
          : align === 'center'
            ? 'flex justify-center'
            : ''
      }
    >
      <DataTableColumnHeader column={column} />
    </div>
  );
}
