import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface DataTableState {
  columnVisibility: Record<string, Record<string, boolean>>;
  pageSize: Record<string, number>;

  setColumnVisibility: (
    tableId: string,
    columnId: string,
    isVisible: boolean,
  ) => void;
  setAllColumnVisibility: (
    tableId: string,
    visibility: Record<string, boolean>,
  ) => void;
  getColumnVisibility: (tableId: string) => Record<string, boolean>;
  setPageSize: (tableId: string, pageSize: number) => void;
  getPageSize: (tableId: string) => number | undefined;
  resetTableState: (tableId: string) => void;
}

export const useDataTableStore = create<DataTableState>()(
  persist(
    (set, get) => ({
      columnVisibility: {},
      pageSize: {},

      setColumnVisibility: (tableId, columnId, isVisible) => {
        set((state) => ({
          columnVisibility: {
            ...state.columnVisibility,
            [tableId]: {
              ...(state.columnVisibility[tableId] || {}),
              [columnId]: isVisible,
            },
          },
        }));
      },

      setAllColumnVisibility: (tableId, visibility) => {
        set((state) => ({
          columnVisibility: {
            ...state.columnVisibility,
            [tableId]: visibility,
          },
        }));
      },

      getColumnVisibility: (tableId) => {
        return get().columnVisibility[tableId] || {};
      },

      setPageSize: (tableId, pageSize) => {
        set((state) => ({
          pageSize: {
            ...state.pageSize,
            [tableId]: pageSize,
          },
        }));
      },

      getPageSize: (tableId) => {
        return get().pageSize[tableId];
      },

      resetTableState: (tableId) => {
        set((state) => {
          const newColumnVisibility = { ...state.columnVisibility };
          const newPageSize = { ...state.pageSize };
          delete newColumnVisibility[tableId];
          delete newPageSize[tableId];
          return {
            columnVisibility: newColumnVisibility,
            pageSize: newPageSize,
          };
        });
      },
    }),
    {
      name: 'data-table-storage',
      partialize: (state) => ({
        columnVisibility: state.columnVisibility,
        pageSize: state.pageSize,
      }),
    },
  ),
);
