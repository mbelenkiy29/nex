import { PracticeQuestion } from '../../prisma/generated/client';
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
import { practiceQuestionEnumerators } from './practiceQuestionEnumerators';
import { Chapter } from '../../prisma/generated/client';
import { Concept } from '../../prisma/generated/client';
import { Course } from '../../prisma/generated/client';

export const practiceQuestionFindSchema = z.object({
  id: z.string(),
});

export const practiceQuestionFilterInputSchema = z
  .object({
    questionText: z.string(),
    difficulty: z
      .enum(practiceQuestionEnumerators.difficulty)
      .nullable()
      .optional(),
    category: z.string(),
    isActive: booleanStringOptionalSchema,
    tags: z.array(z.string()),
    course: objectToUuidSchemaOptional,
    chapter: objectToUuidSchemaOptional,
    concepts: z.array(objectToUuidSchemaOptional),
    createdByMember: objectToUuidSchemaOptional,
    updatedByMember: objectToUuidSchemaOptional,
    createdAtRange: z.array(dateTimeOptionalSchema).max(2),
    updatedAtRange: z.array(dateTimeOptionalSchema).max(2),
    archived: booleanStringOptionalSchema,
  })
  .partial();

export const practiceQuestionFindManyInputSchema = z.object({
  filter: practiceQuestionFilterInputSchema.partial().optional(),
  orderBy: orderBySchema.default({ updatedAt: 'desc' }),
  skip: z.coerce.number().optional(),
  take: z.coerce.number().optional(),
});

export const practiceQuestionDeleteManyInputSchema = z.object({
  ids: z.array(z.string()),
});

export const practiceQuestionArchiveManyInputSchema = z.object({
  ids: z.array(z.string()),
});

export const practiceQuestionRestoreManyInputSchema = z.object({
  ids: z.array(z.string()),
});

export const practiceQuestionAutocompleteInputSchema = z.object({
  search: z.string().trim().optional(),
  exclude: z.array(z.uuid()).optional(),
  take: z.coerce.number().optional(),
  orderBy: orderBySchema.default({ questionText: 'asc' }),
  course: objectToUuidSchemaOptional,
});

export const practiceQuestionAutocompleteOutputSchema = z.object({
  id: z.string(),
  questionText: z.string(),
});

export const practiceQuestionCreateInputSchema = z.object({
  questionText: z.string().trim().min(1).min(10).max(2000),
  correctAnswerIndex: numberSchema.pipe(z.int().min(0).max(10)),
  answerOptions: z.array(z.string().trim().min(1).max(500)).max(10).optional(),
  explanation: z
    .string()
    .trim()
    .max(5000)
    .or(z.string().trim().max(0))
    .nullable()
    .optional(),
  difficulty: z.enum(practiceQuestionEnumerators.difficulty),
  category: z
    .string()
    .trim()
    .max(100)
    .or(z.string().trim().max(0))
    .nullable()
    .optional(),
  isActive: z.boolean().default(false),
  tags: z.array(z.string()).max(10).optional(),
  course: objectToUuidSchemaOptional,
  chapter: objectToUuidSchema,
  concepts: z.array(objectToUuidSchema).optional(),
  importHash: z.string().optional(),
});

export const practiceQuestionImportInputSchema =
  practiceQuestionCreateInputSchema.extend(importerInputSchema.shape);

export const practiceQuestionImportFileSchema = z
  .object({
    questionText: z.string(),
    correctAnswerIndex: z.string(),
    answerOptions: z
      .string()
      .transform((val) => val?.split('\n')?.filter(Boolean) || []),
    explanation: z.string(),
    difficulty: z.string(),
    category: z.string(),
    isActive: z.string().transform((val) => val === 'true' || val === 'TRUE'),
    tags: z.string().transform((val) => val?.split(' ')?.filter(Boolean) || []),
    course: z.string(),
    chapter: z.string(),
    concepts: z.string().transform((val) => val.split(' ')),
  })
  .partial();

export const practiceQuestionUpdateParamsInputSchema = z.object({
  id: z.string(),
});

export const practiceQuestionUpdateBodyInputSchema =
  practiceQuestionCreateInputSchema.partial().extend({
    updatedAt: dateTimeOptionalSchema,
  });

export interface PracticeQuestionWithRelationships extends PracticeQuestion {
  course?: Course;
  chapter?: Chapter;
  concepts?: Concept[];
  createdByMember?: MemberWithRelationships;
  updatedByMember?: MemberWithRelationships;
  archivedByMember?: MemberWithRelationships;
}
