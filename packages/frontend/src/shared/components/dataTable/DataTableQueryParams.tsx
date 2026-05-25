import { PaginationState, SortingState, Updater } from '@tanstack/react-table';
import { useNavigate } from '@tanstack/react-router';
import { dataTableDefaults } from '@/shared/components/dataTable/dataTableDefaults';
import { dataTableSortSchema } from '@/shared/components/dataTable/dataTableSchemas';
import { objectRemoveEmptyNullAndUndefined } from '@/shared/lib/objectRemoveEmptyNullAndUndefined';
import { objectToQuery } from '@/shared/lib/objectToQuery';
import { queryToObject } from '@/shared/lib/queryToObject';
import { z } from 'zod';

export class DataTableQueryParams {
  /**
   * Get the key name for a parameter, optionally with a namespace prefix
   * @param key - The base key name (e.g., 'filter', 'sorting', 'pagination')
   * @param namespace - Optional namespace prefix (e.g., 'member', 'invitation')
   * @returns The namespaced key (e.g., 'memberFilter') or base key if no namespace
   */
  private static getKey(key: string, namespace?: string): string {
    if (!namespace) return key;
    return `${namespace}${key.charAt(0).toUpperCase()}${key.slice(1)}`;
  }

  static getFilter<T>(
    searchParams: Record<string, any>,
    schema: z.ZodSchema<T>,
    namespace?: string,
  ): T {
    const filterKey = this.getKey('filter', namespace);
    const filter: any = searchParams[filterKey] || {};
    return schema.parse(filter) as T;
  }

  static onFilterChange(
    filter: object,
    navigate: ReturnType<typeof useNavigate>,
    searchParams: Record<string, any>,
    namespace?: string,
  ) {
    const filterKey = this.getKey('filter', namespace);
    const queryString = objectToQuery({
      ...searchParams,
      [filterKey]: objectRemoveEmptyNullAndUndefined(filter),
    });
    navigate({
      search: queryToObject(queryString) as any,
    });
  }

  static getSorting(searchParams: Record<string, any>, namespace?: string) {
    const sortingKey = this.getKey('sorting', namespace);
    const sortingState: any = searchParams[sortingKey] || [];
    return dataTableSortSchema.parse(sortingState);
  }

  static onSortingChange(
    old: SortingState,
    navigate: ReturnType<typeof useNavigate>,
    searchParams: Record<string, any>,
    namespace?: string,
  ) {
    return (updater: Updater<SortingState>) => {
      if (typeof updater === 'function') {
        const sorting = updater(old);
        const sortingKey = this.getKey('sorting', namespace);

        const queryString = objectToQuery({
          ...searchParams,
          [sortingKey]: sorting,
        });
        navigate({
          search: queryToObject(queryString) as any,
        });
      }
    };
  }

  static getPagination(
    searchParams: Record<string, any>,
    defaultPageSize?: number,
    namespace?: string,
  ) {
    const paginationKey = this.getKey('pagination', namespace);
    const paginationState: any = searchParams[paginationKey] || {
      pageIndex: 0,
      pageSize: defaultPageSize ?? dataTableDefaults.pageSize,
    };

    return z
      .object({
        pageIndex: z.preprocess((val) => {
          const num = Number(val);
          return Number.isFinite(num) ? num : 0;
        }, z.number()),
        pageSize: z.preprocess((val) => {
          const num = Number(val);
          return Number.isFinite(num)
            ? num
            : (defaultPageSize ?? dataTableDefaults.pageSize);
        }, z.number()),
      })
      .parse(paginationState);
  }

  static onPaginationChange(
    old: PaginationState,
    navigate: ReturnType<typeof useNavigate>,
    searchParams: Record<string, any>,
    namespace?: string,
  ) {
    return (updater: Updater<PaginationState>) => {
      if (typeof updater === 'function') {
        const pagination = updater(old);
        const paginationKey = this.getKey('pagination', namespace);

        const queryString = objectToQuery({
          ...searchParams,
          [paginationKey]: pagination,
        });
        navigate({
          search: queryToObject(queryString) as any,
        });
      }
    };
  }
}
