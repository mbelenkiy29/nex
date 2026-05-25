import { DailyGoal } from '../../prisma/generated/client';
import { z } from 'zod';
import { booleanStringOptionalSchema } from '../../shared/schemas/booleanStringSchema';
import {
  dateOptionalSchema,
  dateSchema,
} from '../../shared/schemas/dateSchema';
import { dateTimeOptionalSchema } from '../../shared/schemas/dateTimeSchema';
import { importerInputSchema } from '../../shared/schemas/importerSchemas';
import {
  numberOptionalSchema,
  numberSchema,
} from '../../shared/schemas/numberSchema';
import {
  objectToUuidSchema,
  objectToUuidSchemaOptional,
} from '../../shared/schemas/objectToUuidSchema';
import { orderBySchema } from '../../shared/schemas/orderBySchema';
import { MemberWithRelationships } from '../member/memberSchemas';
import { dailyGoalEnumerators } from './dailyGoalEnumerators';

export const dailyGoalFindSchema = z.object({
  id: z.string(),
});

export const dailyGoalFilterInputSchema = z
  .object({
    title: z.string(),
    goalType: z.enum(dailyGoalEnumerators.goalType).nullable().optional(),
    targetValueRange: z.array(numberOptionalSchema).max(2),
    currentValueRange: z.array(numberOptionalSchema).max(2),
    goalDateRange: z.array(dateOptionalSchema).max(2),
    completedAtRange: z.array(dateTimeOptionalSchema).max(2),
    owner: objectToUuidSchemaOptional,
    createdByMember: objectToUuidSchemaOptional,
    updatedByMember: objectToUuidSchemaOptional,
    createdAtRange: z.array(dateTimeOptionalSchema).max(2),
    updatedAtRange: z.array(dateTimeOptionalSchema).max(2),
    archived: booleanStringOptionalSchema,
  })
  .partial();

export const dailyGoalFindManyInputSchema = z.object({
  filter: dailyGoalFilterInputSchema.partial().optional(),
  orderBy: orderBySchema.default({ updatedAt: 'desc' }),
  skip: z.coerce.number().optional(),
  take: z.coerce.number().optional(),
});

export const dailyGoalDeleteManyInputSchema = z.object({
  ids: z.array(z.string()),
});

export const dailyGoalArchiveManyInputSchema = z.object({
  ids: z.array(z.string()),
});

export const dailyGoalRestoreManyInputSchema = z.object({
  ids: z.array(z.string()),
});

export const dailyGoalAutocompleteInputSchema = z.object({
  search: z.string().trim().optional(),
  exclude: z.array(z.uuid()).optional(),
  take: z.coerce.number().optional(),
  orderBy: orderBySchema.default({ title: 'asc' }),
});

export const dailyGoalAutocompleteOutputSchema = z.object({
  id: z.string(),
  title: z.string(),
});

export const dailyGoalCreateInputSchema = z.object({
  title: z.string().trim().min(1).min(2).max(200),
  goalType: z.enum(dailyGoalEnumerators.goalType),
  targetValue: numberSchema.pipe(z.int().positive().min(1)),
  currentValue: numberOptionalSchema.pipe(
    z.int().positive().min(0).nullable().optional(),
  ),
  xpReward: numberOptionalSchema.pipe(
    z.int().positive().min(0).nullable().optional(),
  ),
  goalDate: dateSchema,
  completedAt: dateTimeOptionalSchema,
  owner: objectToUuidSchema,
  importHash: z.string().optional(),
});

export const dailyGoalImportInputSchema = dailyGoalCreateInputSchema.extend(
  importerInputSchema.shape,
);

export const dailyGoalImportFileSchema = z
  .object({
    title: z.string(),
    goalType: z.string(),
    targetValue: z.string(),
    currentValue: z.string(),
    xpReward: z.string(),
    goalDate: z.string(),
    completedAt: z.string(),
    owner: z.string(),
  })
  .partial();

export const dailyGoalUpdateParamsInputSchema = z.object({
  id: z.string(),
});

export const dailyGoalUpdateBodyInputSchema = dailyGoalCreateInputSchema
  .partial()
  .extend({
    updatedAt: dateTimeOptionalSchema,
  });

export interface DailyGoalWithRelationships extends DailyGoal {
  owner?: MemberWithRelationships;
  createdByMember?: MemberWithRelationships;
  updatedByMember?: MemberWithRelationships;
  archivedByMember?: MemberWithRelationships;
}
