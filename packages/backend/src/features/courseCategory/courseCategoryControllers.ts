import { Context } from 'hono';
import { AppContext } from '../../shared/controller/appContext';
import { Error400 } from '../../shared/errors/Error400';
import { Error404 } from '../../shared/errors/Error404';
import { prisma } from '../../prisma';
import { auditLogCreate } from '../auditLog/auditLogCreate';
import { auditLogOperations } from '../auditLog/auditLogOperations';
import { authGuardPlatformAdminBackend } from '../platformAdmin/platformAdminGuard';
import {
  courseCategoryCreateInputSchema,
  courseCategoryListQuerySchema,
  courseCategoryUpdateInputSchema,
} from './courseCategorySchemas';

const CATEGORY_SELECT = {
  id: true,
  createdAt: true,
  updatedAt: true,
  slug: true,
  name: true,
  description: true,
  iconName: true,
  displayOrder: true,
  isActive: true,
} as const;

// Slugify identical to other slug derivations in this repo (course slug,
// backfill SQL). Stable + deterministic so re-runs converge on the same row.
function slugifyCategoryName(value: string) {
  const slug = value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

  return slug || 'category';
}

async function categoryUniqueSlug(name: string, currentId?: string) {
  const base = slugifyCategoryName(name);
  let slug = base;
  let suffix = 2;

  while (true) {
    const existing = await prisma.courseCategory.findUnique({
      where: { slug },
      select: { id: true },
    });

    if (!existing || existing.id === currentId) {
      return slug;
    }

    slug = `${base}-${suffix}`;
    suffix += 1;
  }
}

/**
 * Public list — active categories only, ordered for chip-row display.
 * Drives `useCourseCategoriesQuery()` on the frontend (catalog filter +
 * creator builder dropdown).
 */
export async function courseCategoryListController(
  query: unknown,
  context: AppContext,
  c: Context,
) {
  const { search } = courseCategoryListQuerySchema.parse(query);
  const categories = await prisma.courseCategory.findMany({
    where: {
      isActive: true,
      ...(search
        ? {
            OR: [
              { name: { contains: search, mode: 'insensitive' } },
              { slug: { contains: search, mode: 'insensitive' } },
            ],
          }
        : {}),
    },
    select: CATEGORY_SELECT,
    orderBy: [{ displayOrder: 'asc' }, { name: 'asc' }],
  });

  return c.json({ categories });
}

/**
 * Admin list — includes inactive rows. Used by the platformAdmin
 * CategoryAdminCard table.
 */
export async function platformAdminCourseCategoryListController(
  _query: unknown,
  context: AppContext,
  c: Context,
) {
  authGuardPlatformAdminBackend(context);

  const categories = await prisma.courseCategory.findMany({
    select: CATEGORY_SELECT,
    orderBy: [{ displayOrder: 'asc' }, { name: 'asc' }],
  });

  return c.json({ categories });
}

/**
 * Admin create. Slugifies the name (and disambiguates collisions). Audit-
 * logged as a `Create` against entityName `CourseCategory`.
 */
export async function platformAdminCourseCategoryCreateController(
  body: unknown,
  context: AppContext,
  c: Context,
) {
  authGuardPlatformAdminBackend(context);
  const data = courseCategoryCreateInputSchema.parse(body);
  const slug = await categoryUniqueSlug(data.name);

  const category = await prisma.courseCategory.create({
    data: {
      slug,
      name: data.name,
      description: data.description ?? null,
      iconName: data.iconName ?? null,
      displayOrder: data.displayOrder,
      isActive: data.isActive,
    },
    select: CATEGORY_SELECT,
  });

  await auditLogCreate({
    entityId: category.id,
    entityName: 'CourseCategory',
    operation: auditLogOperations.create,
    context,
    oldData: null,
    newData: category,
  });

  return c.json({ category });
}

/**
 * Admin update. If `name` changes, slug is **not** recomputed (slugs are URL-
 * stable identifiers; rename a category by deactivating + creating fresh if a
 * slug change is needed).
 */
export async function platformAdminCourseCategoryUpdateController(
  params: { id: string },
  body: unknown,
  context: AppContext,
  c: Context,
) {
  authGuardPlatformAdminBackend(context);
  const data = courseCategoryUpdateInputSchema.parse(body);

  const before = await prisma.courseCategory.findUnique({
    where: { id: params.id },
    select: CATEGORY_SELECT,
  });
  if (!before) {
    throw new Error404();
  }

  const updatePayload: Record<string, unknown> = {};
  if (data.name !== undefined) updatePayload.name = data.name;
  if (data.description !== undefined)
    updatePayload.description = data.description;
  if (data.iconName !== undefined) updatePayload.iconName = data.iconName;
  if (data.displayOrder !== undefined)
    updatePayload.displayOrder = data.displayOrder;
  if (data.isActive !== undefined) updatePayload.isActive = data.isActive;

  const updated = await prisma.courseCategory.update({
    where: { id: params.id },
    data: updatePayload,
    select: CATEGORY_SELECT,
  });

  await auditLogCreate({
    entityId: updated.id,
    entityName: 'CourseCategory',
    operation: auditLogOperations.update,
    context,
    oldData: before,
    newData: updated,
  });

  return c.json({ category: updated });
}

/**
 * Admin disable. Soft-only so existing courses keep their categoryId and
 * historical catalog grouping. Pass `isActive` in the body to toggle either way.
 */
export async function platformAdminCourseCategoryDisableController(
  params: { id: string },
  body: unknown,
  context: AppContext,
  c: Context,
) {
  authGuardPlatformAdminBackend(context);
  const data = courseCategoryUpdateInputSchema.parse(body);
  if (data.isActive === undefined) {
    throw new Error400(
      context.dictionary.adminCourseCategories.errors.statusRequired,
    );
  }

  const before = await prisma.courseCategory.findUnique({
    where: { id: params.id },
    select: CATEGORY_SELECT,
  });
  if (!before) {
    throw new Error404();
  }

  const updated = await prisma.courseCategory.update({
    where: { id: params.id },
    data: { isActive: data.isActive },
    select: CATEGORY_SELECT,
  });

  await auditLogCreate({
    entityId: updated.id,
    entityName: 'CourseCategory',
    operation: auditLogOperations.update,
    context,
    oldData: { isActive: before.isActive },
    newData: { isActive: updated.isActive },
  });

  return c.json({ category: updated });
}
