import { Concept } from '../../prisma/generated/client';
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
import { conceptEnumerators } from './conceptEnumerators';
import { Exam } from '../../prisma/generated/client';
import { PracticeQuestion } from '../../prisma/generated/client';
import { Course } from '../../prisma/generated/client';

export const conceptFindSchema = z.object({
  id: z.string(),
});

export const conceptFilterInputSchema = z
  .object({
    conceptName: z.string(),
    conceptCode: z.string(),
    examDomain: z.string(),
    difficulty: z.enum(conceptEnumerators.difficulty).nullable().optional(),
    examWeight: z.enum(conceptEnumerators.examWeight).nullable().optional(),
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

export const conceptFindManyInputSchema = z.object({
  filter: conceptFilterInputSchema.partial().optional(),
  orderBy: orderBySchema.default({ updatedAt: 'desc' }),
  skip: z.coerce.number().optional(),
  take: z.coerce.number().optional(),
});

export const conceptDeleteManyInputSchema = z.object({
  ids: z.array(z.string()),
});

export const conceptArchiveManyInputSchema = z.object({
  ids: z.array(z.string()),
});

export const conceptRestoreManyInputSchema = z.object({
  ids: z.array(z.string()),
});

export const conceptAutocompleteInputSchema = z.object({
  search: z.string().trim().optional(),
  exclude: z.array(z.uuid()).optional(),
  take: z.coerce.number().optional(),
  orderBy: orderBySchema.default({ conceptName: 'asc' }),
  course: objectToUuidSchemaOptional,
});

export const conceptAutocompleteOutputSchema = z.object({
  id: z.string(),
  conceptName: z.string(),
});

export const conceptCreateInputSchema = z.object({
  conceptName: z.string().trim().min(1).min(2).max(200),
  conceptCode: z.string().trim().min(1).max(100),
  conceptDescription: z.string().trim().min(1).max(2000),
  explanation: z.string().trim().min(1),
  examDomain: z
    .string()
    .trim()
    .max(200)
    .or(z.string().trim().max(0))
    .nullable()
    .optional(),
  difficulty: z.enum(conceptEnumerators.difficulty).nullable().optional(),
  examWeight: z.enum(conceptEnumerators.examWeight).nullable().optional(),
  typicalMistakes: z.array(z.string()).max(15).optional(),
  examTips: z.array(z.string()).max(15).optional(),
  isActive: z.boolean().default(false),
  course: objectToUuidSchemaOptional,
  exam: objectToUuidSchema,
  importHash: z.string().optional(),
});

export const conceptImportInputSchema = conceptCreateInputSchema.extend(
  importerInputSchema.shape,
);

export const conceptImportFileSchema = z
  .object({
    conceptName: z.string(),
    conceptCode: z.string(),
    conceptDescription: z.string(),
    explanation: z.string(),
    examDomain: z.string(),
    difficulty: z.string(),
    examWeight: z.string(),
    typicalMistakes: z
      .string()
      .transform((val) => val?.split(' ')?.filter(Boolean) || []),
    examTips: z
      .string()
      .transform((val) => val?.split(' ')?.filter(Boolean) || []),
    isActive: z.string().transform((val) => val === 'true' || val === 'TRUE'),
    course: z.string(),
    exam: z.string(),
    practiceQuestions: z.string().transform((val) => val.split(' ')),
  })
  .partial();

export const conceptUpdateParamsInputSchema = z.object({
  id: z.string(),
});

export const conceptUpdateBodyInputSchema = conceptCreateInputSchema
  .partial()
  .extend({
    updatedAt: dateTimeOptionalSchema,
  });

export interface ConceptWithRelationships extends Concept {
  course?: Course;
  exam?: Exam;
  practiceQuestions?: PracticeQuestion[];
  createdByMember?: MemberWithRelationships;
  updatedByMember?: MemberWithRelationships;
  archivedByMember?: MemberWithRelationships;
}
