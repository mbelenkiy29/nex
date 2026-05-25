import { ExamType } from '../../prisma/generated/client';
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
import { examTypeEnumerators } from './examTypeEnumerators';
import { Exam } from '../../prisma/generated/client';
import { ExamInstance } from '../../prisma/generated/client';
import { Course } from '../../prisma/generated/client';

export const examTypeFindSchema = z.object({
  id: z.string(),
});

export const examTypeFilterInputSchema = z
  .object({
    name: z.string(),
    type: z.enum(examTypeEnumerators.type).nullable().optional(),
    questionCountRange: z.array(numberOptionalSchema).max(2),
    timeLimitMinutesRange: z.array(numberOptionalSchema).max(2),
    passingScoreRange: z.array(numberOptionalSchema).max(2),
    maxAttemptsRange: z.array(numberOptionalSchema).max(2),
    shuffleQuestions: booleanStringOptionalSchema,
    showAnswersImmediately: booleanStringOptionalSchema,
    isActive: booleanStringOptionalSchema,
    course: objectToUuidSchemaOptional,
    exam: objectToUuidSchemaOptional,
    createdByMember: objectToUuidSchemaOptional,
    updatedByMember: objectToUuidSchemaOptional,
    createdAtRange: z.array(dateTimeOptionalSchema).max(2),
    updatedAtRange: z.array(dateTimeOptionalSchema).max(2),
    archived: booleanStringOptionalSchema,
  })
  .partial();

export const examTypeFindManyInputSchema = z.object({
  filter: examTypeFilterInputSchema.partial().optional(),
  orderBy: orderBySchema.default({ updatedAt: 'desc' }),
  skip: z.coerce.number().optional(),
  take: z.coerce.number().optional(),
});

export const examTypeDeleteManyInputSchema = z.object({
  ids: z.array(z.string()),
});

export const examTypeArchiveManyInputSchema = z.object({
  ids: z.array(z.string()),
});

export const examTypeRestoreManyInputSchema = z.object({
  ids: z.array(z.string()),
});

export const examTypeAutocompleteInputSchema = z.object({
  search: z.string().trim().optional(),
  exclude: z.array(z.uuid()).optional(),
  take: z.coerce.number().optional(),
  orderBy: orderBySchema.default({ name: 'asc' }),
  course: objectToUuidSchemaOptional,
});

export const examTypeAutocompleteOutputSchema = z.object({
  id: z.string(),
  name: z.string(),
});

export const examTypeCreateInputSchema = z.object({
  name: z.string().trim().min(1).min(2).max(200),
  description: z
    .string()
    .trim()
    .max(1000)
    .or(z.string().trim().max(0))
    .nullable()
    .optional(),
  type: z.enum(examTypeEnumerators.type),
  questionCount: numberSchema.pipe(z.int().positive().min(1).max(500)),
  timeLimitMinutes: numberOptionalSchema.pipe(
    z.int().positive().min(1).max(600).nullable().optional(),
  ),
  passingScore: numberOptionalSchema.pipe(
    z.int().positive().min(0).max(100).nullable().optional(),
  ),
  maxAttempts: numberOptionalSchema.pipe(
    z.int().positive().min(1).max(100).nullable().optional(),
  ),
  shuffleQuestions: z.boolean().default(false),
  showAnswersImmediately: z.boolean().default(false),
  isActive: z.boolean().default(false),
  course: objectToUuidSchemaOptional,
  exam: objectToUuidSchema,
  importHash: z.string().optional(),
});

export const examTypeImportInputSchema = examTypeCreateInputSchema.extend(
  importerInputSchema.shape,
);

export const examTypeImportFileSchema = z
  .object({
    name: z.string(),
    description: z.string(),
    type: z.string(),
    questionCount: z.string(),
    timeLimitMinutes: z.string(),
    passingScore: z.string(),
    maxAttempts: z.string(),
    shuffleQuestions: z
      .string()
      .transform((val) => val === 'true' || val === 'TRUE'),
    showAnswersImmediately: z
      .string()
      .transform((val) => val === 'true' || val === 'TRUE'),
    isActive: z.string().transform((val) => val === 'true' || val === 'TRUE'),
    course: z.string(),
    exam: z.string(),
    examInstances: z.string().transform((val) => val.split(' ')),
  })
  .partial();

export const examTypeUpdateParamsInputSchema = z.object({
  id: z.string(),
});

export const examTypeUpdateBodyInputSchema = examTypeCreateInputSchema
  .partial()
  .extend({
    updatedAt: dateTimeOptionalSchema,
  });

export interface ExamTypeWithRelationships extends ExamType {
  course?: Course;
  exam?: Exam;
  examInstances?: ExamInstance[];
  createdByMember?: MemberWithRelationships;
  updatedByMember?: MemberWithRelationships;
  archivedByMember?: MemberWithRelationships;
}
