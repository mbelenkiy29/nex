import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/shared/lib/apiClient';

// Public-facing shape (catalog chip row + builder dropdown).
export interface CourseCategoryPublicRow {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  iconName: string | null;
  displayOrder: number;
}

// Admin shape adds isActive + audit timestamps.
export interface CourseCategoryAdminRow extends CourseCategoryPublicRow {
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

const publicKey = ['courseCategory', 'list'] as const;
const adminKey = ['courseCategory', 'admin', 'list'] as const;

/**
 * Public read — active rows only. Drives the marketplace chip row and the
 * creator builder dropdown. Falls through to a cached empty array on error
 * to avoid surfacing a "categories failed to load" banner on the catalog;
 * the chip row simply hides.
 */
export function useCourseCategoriesQuery() {
  return useQuery({
    queryKey: publicKey,
    queryFn: () =>
      apiClient
        .get('api/course-categories')
        .json<{ categories: CourseCategoryPublicRow[] }>(),
    staleTime: 60_000,
  });
}

/** Admin list — includes inactive rows + audit timestamps. */
export function useAdminCourseCategoriesQuery() {
  return useQuery({
    queryKey: adminKey,
    queryFn: () =>
      apiClient
        .get('api/platform-admin/course-categories')
        .json<{ categories: CourseCategoryAdminRow[] }>(),
  });
}

export interface CourseCategoryCreateInput {
  name: string;
  description?: string | null;
  iconName?: string | null;
  displayOrder?: number;
  isActive?: boolean;
}

export interface CourseCategoryUpdateInput {
  name?: string;
  description?: string | null;
  iconName?: string | null;
  displayOrder?: number;
  isActive?: boolean;
}

export function useCreateCourseCategory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: CourseCategoryCreateInput) =>
      apiClient
        .post('api/platform-admin/course-categories', { json: input })
        .json<{ category: CourseCategoryAdminRow }>(),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: adminKey });
      qc.invalidateQueries({ queryKey: publicKey });
    },
  });
}

export function useUpdateCourseCategory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: CourseCategoryUpdateInput }) =>
      apiClient
        .put(`api/platform-admin/course-categories/${id}`, { json: input })
        .json<{ category: CourseCategoryAdminRow }>(),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: adminKey });
      qc.invalidateQueries({ queryKey: publicKey });
    },
  });
}

export function useSetCourseCategoryActive() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, isActive }: { id: string; isActive: boolean }) =>
      apiClient
        .patch(`api/platform-admin/course-categories/${id}/status`, {
          json: { isActive },
        })
        .json<{ category: CourseCategoryAdminRow }>(),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: adminKey });
      qc.invalidateQueries({ queryKey: publicKey });
    },
  });
}
