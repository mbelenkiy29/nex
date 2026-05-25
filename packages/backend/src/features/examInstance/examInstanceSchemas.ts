import { ExamInstance } from '../../prisma/generated/client';
import { z } from 'zod';
import { booleanStringOptionalSchema } from '../../shared/schemas/booleanStringSchema';
import { dateOptionalSchema } from '../../shared/schemas/dateSchema';
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
import { examInstanceEnumerators } from './examInstanceEnumerators';
import { ExamType } from '../../prisma/generated/client';
import { Course } from '../../prisma/generated/client';

export const examInstanceFindSchema = z.object({
  id: z.string(),
});

export const examInstanceFilterInputSchema = z
  .object({
    status: z.enum(examInstanceEnumerators.status).nullable().optional(),
    scoreRange: z.array(numberOptionalSchema).max(2),
    passed: booleanStringOptionalSchema,
    startedAtRange: z.array(dateTimeOptionalSchema).max(2),
    completedAtRange: z.array(dateTimeOptionalSchema).max(2),
    timeSpentSecondsRange: z.array(numberOptionalSchema).max(2),
    course: objectToUuidSchemaOptional,
    examType: objectToUuidSchemaOptional,
    student: objectToUuidSchemaOptional,
    createdByMember: objectToUuidSchemaOptional,
    updatedByMember: objectToUuidSchemaOptional,
    createdAtRange: z.array(dateTimeOptionalSchema).max(2),
    updatedAtRange: z.array(dateTimeOptionalSchema).max(2),
    archived: booleanStringOptionalSchema,
  })
  .partial();

export const examInstanceFindManyInputSchema = z.object({
  filter: examInstanceFilterInputSchema.partial().optional(),
  orderBy: orderBySchema.default({ updatedAt: 'desc' }),
  skip: z.coerce.number().optional(),
  take: z.coerce.number().optional(),
});

export const examInstanceDeleteManyInputSchema = z.object({
  ids: z.array(z.string()),
});

export const examInstanceArchiveManyInputSchema = z.object({
  ids: z.array(z.string()),
});

export const examInstanceRestoreManyInputSchema = z.object({
  ids: z.array(z.string()),
});

export const examInstanceAutocompleteInputSchema = z.object({
  search: z.string().trim().optional(),
  exclude: z.array(z.uuid()).optional(),
  take: z.coerce.number().optional(),
  orderBy: orderBySchema.default({ status: 'asc' }),
  course: objectToUuidSchemaOptional,
});

export const examInstanceAutocompleteOutputSchema = z.object({
  id: z.string(),
  status: z.string(),
});

export const examInstanceCreateInputSchema = z.object({
  status: z.enum(examInstanceEnumerators.status),
  score: numberOptionalSchema.pipe(
    z.number().min(0).max(100).nullable().optional(),
  ),
  passed: z.boolean().default(false),
  startedAt: dateTimeOptionalSchema,
  completedAt: dateTimeOptionalSchema,
  timeSpentSeconds: numberOptionalSchema.pipe(
    z.int().positive().min(0).nullable().optional(),
  ),
  course: objectToUuidSchemaOptional,
  examType: objectToUuidSchema,
  student: objectToUuidSchema,
  importHash: z.string().optional(),
});

export const examInstanceImportInputSchema =
  examInstanceCreateInputSchema.extend(importerInputSchema.shape);

export const examInstanceImportFileSchema = z
  .object({
    status: z.string(),
    score: z.string(),
    passed: z.string().transform((val) => val === 'true' || val === 'TRUE'),
    startedAt: z.string(),
    completedAt: z.string(),
    timeSpentSeconds: z.string(),
    course: z.string(),
    examType: z.string(),
    student: z.string(),
  })
  .partial();

export const examInstanceUpdateParamsInputSchema = z.object({
  id: z.string(),
});

export const examInstanceUpdateBodyInputSchema = examInstanceCreateInputSchema
  .partial()
  .extend({
    updatedAt: dateTimeOptionalSchema,
  });

export interface ExamInstanceWithRelationships extends ExamInstance {
  course?: Course;
  examType?: ExamType;
  student?: MemberWithRelationships;
  createdByMember?: MemberWithRelationships;
  updatedByMember?: MemberWithRelationships;
  archivedByMember?: MemberWithRelationships;
}
