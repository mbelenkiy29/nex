import { Lesson } from '../../prisma/generated/client';
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
import { lessonEnumerators } from './lessonEnumerators';
import { Chapter } from '../../prisma/generated/client';
import { StudyNote } from '../../prisma/generated/client';
import { Course } from '../../prisma/generated/client';

export const lessonFindSchema = z.object({
  id: z.string(),
});

export const lessonFilterInputSchema = z
  .object({
    title: z.string(),
    lessonNumberRange: z.array(numberOptionalSchema).max(2),
    estimatedMinutesRange: z.array(numberOptionalSchema).max(2),
    xpRewardRange: z.array(numberOptionalSchema).max(2),
    workflowStatus: z
      .enum(lessonEnumerators.workflowStatus)
      .nullable()
      .optional(),
    isPublished: booleanStringOptionalSchema,
    course: objectToUuidSchemaOptional,
    chapter: objectToUuidSchemaOptional,
    createdByMember: objectToUuidSchemaOptional,
    updatedByMember: objectToUuidSchemaOptional,
    createdAtRange: z.array(dateTimeOptionalSchema).max(2),
    updatedAtRange: z.array(dateTimeOptionalSchema).max(2),
    archived: booleanStringOptionalSchema,
  })
  .partial();

export const lessonFindManyInputSchema = z.object({
  filter: lessonFilterInputSchema.partial().optional(),
  orderBy: orderBySchema.default({ updatedAt: 'desc' }),
  skip: z.coerce.number().optional(),
  take: z.coerce.number().optional(),
});

export const lessonDeleteManyInputSchema = z.object({
  ids: z.array(z.string()),
});

export const lessonArchiveManyInputSchema = z.object({
  ids: z.array(z.string()),
});

export const lessonRestoreManyInputSchema = z.object({
  ids: z.array(z.string()),
});

export const lessonAutocompleteInputSchema = z.object({
  search: z.string().trim().optional(),
  exclude: z.array(z.uuid()).optional(),
  take: z.coerce.number().optional(),
  orderBy: orderBySchema.default({ title: 'asc' }),
  course: objectToUuidSchemaOptional,
});

export const lessonAutocompleteOutputSchema = z.object({
  id: z.string(),
  title: z.string(),
});

export const lessonCreateInputSchema = z.object({
  title: z.string().trim().min(1).min(2).max(200),
  lessonNumber: numberSchema.pipe(z.int().positive().min(1)),
  content: z.string().trim().or(z.string().trim().max(0)).nullable().optional(),
  estimatedMinutes: numberOptionalSchema.pipe(
    z.int().positive().min(1).max(300).nullable().optional(),
  ),
  xpReward: numberOptionalSchema.pipe(
    z.int().positive().min(0).nullable().optional(),
  ),
  workflowStatus: z.enum(lessonEnumerators.workflowStatus),
  isPublished: z.boolean().default(false),
  course: objectToUuidSchemaOptional,
  chapter: objectToUuidSchema,
  importHash: z.string().optional(),
});

export const lessonImportInputSchema = lessonCreateInputSchema.extend(
  importerInputSchema.shape,
);

export const lessonImportFileSchema = z
  .object({
    title: z.string(),
    lessonNumber: z.string(),
    content: z.string(),
    estimatedMinutes: z.string(),
    xpReward: z.string(),
    workflowStatus: z.string(),
    isPublished: z
      .string()
      .transform((val) => val === 'true' || val === 'TRUE'),
    course: z.string(),
    chapter: z.string(),
    studyNotes: z.string().transform((val) => val.split(' ')),
  })
  .partial();

export const lessonUpdateParamsInputSchema = z.object({
  id: z.string(),
});

export const lessonUpdateBodyInputSchema = lessonCreateInputSchema
  .partial()
  .extend({
    updatedAt: dateTimeOptionalSchema,
  });

export interface LessonWithRelationships extends Lesson {
  course?: Course;
  chapter?: Chapter;
  studyNotes?: StudyNote[];
  createdByMember?: MemberWithRelationships;
  updatedByMember?: MemberWithRelationships;
  archivedByMember?: MemberWithRelationships;
}
