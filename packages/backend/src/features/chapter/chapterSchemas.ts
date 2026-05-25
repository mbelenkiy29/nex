import { Chapter } from '../../prisma/generated/client';
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
import { chapterEnumerators } from './chapterEnumerators';
import { Exam } from '../../prisma/generated/client';
import { Lesson } from '../../prisma/generated/client';
import { PracticeQuestion } from '../../prisma/generated/client';
import { StudyNote } from '../../prisma/generated/client';
import { Course } from '../../prisma/generated/client';

export const chapterFindSchema = z.object({
  id: z.string(),
});

export const chapterFilterInputSchema = z
  .object({
    title: z.string(),
    chapterNumberRange: z.array(numberOptionalSchema).max(2),
    xpRewardRange: z.array(numberOptionalSchema).max(2),
    orderIndexRange: z.array(numberOptionalSchema).max(2),
    workflowStatus: z
      .enum(chapterEnumerators.workflowStatus)
      .nullable()
      .optional(),
    isPublished: booleanStringOptionalSchema,
    course: objectToUuidSchemaOptional,
    exam: objectToUuidSchemaOptional,
    createdByMember: objectToUuidSchemaOptional,
    updatedByMember: objectToUuidSchemaOptional,
    createdAtRange: z.array(dateTimeOptionalSchema).max(2),
    updatedAtRange: z.array(dateTimeOptionalSchema).max(2),
    archived: booleanStringOptionalSchema,
  })
  .partial();

export const chapterFindManyInputSchema = z.object({
  filter: chapterFilterInputSchema.partial().optional(),
  orderBy: orderBySchema.default({ updatedAt: 'desc' }),
  skip: z.coerce.number().optional(),
  take: z.coerce.number().optional(),
});

export const chapterDeleteManyInputSchema = z.object({
  ids: z.array(z.string()),
});

export const chapterArchiveManyInputSchema = z.object({
  ids: z.array(z.string()),
});

export const chapterRestoreManyInputSchema = z.object({
  ids: z.array(z.string()),
});

export const chapterAutocompleteInputSchema = z.object({
  search: z.string().trim().optional(),
  exclude: z.array(z.uuid()).optional(),
  take: z.coerce.number().optional(),
  orderBy: orderBySchema.default({ title: 'asc' }),
  course: objectToUuidSchemaOptional,
});

export const chapterAutocompleteOutputSchema = z.object({
  id: z.string(),
  title: z.string(),
});

export const chapterCreateInputSchema = z.object({
  title: z.string().trim().min(1).min(2).max(200),
  chapterNumber: numberSchema.pipe(z.int().positive().min(1)),
  description: z
    .string()
    .trim()
    .max(2000)
    .or(z.string().trim().max(0))
    .nullable()
    .optional(),
  aiTutorPrompt: z
    .string()
    .trim()
    .max(5000)
    .or(z.string().trim().max(0))
    .nullable()
    .optional(),
  xpReward: numberOptionalSchema.pipe(
    z.int().positive().min(0).nullable().optional(),
  ),
  orderIndex: numberSchema.pipe(z.int().positive().min(0)),
  workflowStatus: z.enum(chapterEnumerators.workflowStatus),
  isPublished: z.boolean().default(false),
  version: numberOptionalSchema.pipe(
    z.int().positive().min(1).nullable().optional(),
  ),
  objectives: z.array(z.string()).max(20).optional(),
  course: objectToUuidSchemaOptional,
  exam: objectToUuidSchema,
  importHash: z.string().optional(),
});

export const chapterImportInputSchema = chapterCreateInputSchema.extend(
  importerInputSchema.shape,
);

export const chapterImportFileSchema = z
  .object({
    title: z.string(),
    chapterNumber: z.string(),
    description: z.string(),
    aiTutorPrompt: z.string(),
    xpReward: z.string(),
    orderIndex: z.string(),
    workflowStatus: z.string(),
    isPublished: z
      .string()
      .transform((val) => val === 'true' || val === 'TRUE'),
    version: z.string(),
    objectives: z
      .string()
      .transform((val) => val?.split(' ')?.filter(Boolean) || []),
    course: z.string(),
    exam: z.string(),
    lessons: z.string().transform((val) => val.split(' ')),
    practiceQuestions: z.string().transform((val) => val.split(' ')),
    studyNotes: z.string().transform((val) => val.split(' ')),
  })
  .partial();

export const chapterUpdateParamsInputSchema = z.object({
  id: z.string(),
});

export const chapterUpdateBodyInputSchema = chapterCreateInputSchema
  .partial()
  .extend({
    updatedAt: dateTimeOptionalSchema,
  });

export interface ChapterWithRelationships extends Chapter {
  course?: Course;
  exam?: Exam;
  lessons?: Lesson[];
  practiceQuestions?: PracticeQuestion[];
  studyNotes?: StudyNote[];
  createdByMember?: MemberWithRelationships;
  updatedByMember?: MemberWithRelationships;
  archivedByMember?: MemberWithRelationships;
}
