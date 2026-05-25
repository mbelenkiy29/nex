import { z } from 'zod';

// Public list query — kept tiny on purpose. The frontend never asks for
// inactive rows; admins use the admin endpoint.
export const courseCategoryListQuerySchema = z.object({
  search: z.string().trim().optional(),
});

// Slug is derived server-side from `name`, so it isn't part of the input.
// `iconName` is a Lucide icon key (e.g. `LuBookOpen`) — opaque to the backend.
export const courseCategoryCreateInputSchema = z.object({
  name: z.string().trim().min(1).max(120),
  description: z.string().trim().max(500).optional().nullable(),
  iconName: z.string().trim().max(60).optional().nullable(),
  displayOrder: z.coerce.number().int().min(0).max(100000).default(1000),
  isActive: z.boolean().default(true),
});

// Every field optional — patch semantics, only present keys are written.
export const courseCategoryUpdateInputSchema = z.object({
  name: z.string().trim().min(1).max(120).optional(),
  description: z.string().trim().max(500).optional().nullable(),
  iconName: z.string().trim().max(60).optional().nullable(),
  displayOrder: z.coerce.number().int().min(0).max(100000).optional(),
  isActive: z.boolean().optional(),
});

export type CourseCategoryCreateInput = z.input<
  typeof courseCategoryCreateInputSchema
>;
export type CourseCategoryUpdateInput = z.input<
  typeof courseCategoryUpdateInputSchema
>;
