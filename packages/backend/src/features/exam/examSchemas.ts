import { Exam } from '../../prisma/generated/client';
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
import { Chapter } from '../../prisma/generated/client';
import { Concept } from '../../prisma/generated/client';
import { ExamType } from '../../prisma/generated/client';
import { DocumentUpload } from '../../prisma/generated/client';
import { Course } from '../../prisma/generated/client';

export const examFindSchema = z.object({
  id: z.string(),
});

export const examFilterInputSchema = z
  .object({
    name: z.string(),
    code: z.string(),
    course: objectToUuidSchemaOptional,
    isActive: booleanStringOptionalSchema,
    createdByMember: objectToUuidSchemaOptional,
    updatedByMember: objectToUuidSchemaOptional,
    createdAtRange: z.array(dateTimeOptionalSchema).max(2),
    updatedAtRange: z.array(dateTimeOptionalSchema).max(2),
    archived: booleanStringOptionalSchema,
  })
  .partial();

export const examFindManyInputSchema = z.object({
  filter: examFilterInputSchema.partial().optional(),
  orderBy: orderBySchema.default({ updatedAt: 'desc' }),
  skip: z.coerce.number().optional(),
  take: z.coerce.number().optional(),
});

export const examDeleteManyInputSchema = z.object({
  ids: z.array(z.string()),
});

export const examArchiveManyInputSchema = z.object({
  ids: z.array(z.string()),
});

export const examRestoreManyInputSchema = z.object({
  ids: z.array(z.string()),
});

export const examAutocompleteInputSchema = z.object({
  search: z.string().trim().optional(),
  exclude: z.array(z.uuid()).optional(),
  take: z.coerce.number().optional(),
  orderBy: orderBySchema.default({ name: 'asc' }),
  course: objectToUuidSchemaOptional,
});

export const examAutocompleteOutputSchema = z.object({
  id: z.string(),
  name: z.string(),
});

export const examCreateInputSchema = z.object({
  name: z.string().trim().min(1).min(2).max(200),
  code: z
    .string()
    .trim()
    .max(50)
    .toUpperCase()
    .or(z.string().trim().max(0))
    .nullable()
    .optional(),
  description: z
    .string()
    .trim()
    .max(2000)
    .or(z.string().trim().max(0))
    .nullable()
    .optional(),
  iconUrl: z
    .string()
    .trim()
    .url()
    .or(z.string().trim().max(0))
    .nullable()
    .optional(),
  course: objectToUuidSchemaOptional,
  isActive: z.boolean().default(false),
  importHash: z.string().optional(),
});

export const examImportInputSchema = examCreateInputSchema.extend(
  importerInputSchema.shape,
);

export const examImportFileSchema = z
  .object({
    name: z.string(),
    code: z.string(),
    description: z.string(),
    iconUrl: z.string(),
    course: z.string(),
    isActive: z.string().transform((val) => val === 'true' || val === 'TRUE'),
    chapters: z.string().transform((val) => val.split(' ')),
    concepts: z.string().transform((val) => val.split(' ')),
    examTypes: z.string().transform((val) => val.split(' ')),
    documentUploads: z.string().transform((val) => val.split(' ')),
  })
  .partial();

export const examUpdateParamsInputSchema = z.object({
  id: z.string(),
});

export const examUpdateBodyInputSchema = examCreateInputSchema
  .partial()
  .extend({
    updatedAt: dateTimeOptionalSchema,
  });

export interface ExamWithRelationships extends Exam {
  course?: Course;
  chapters?: Chapter[];
  concepts?: Concept[];
  examTypes?: ExamType[];
  documentUploads?: DocumentUpload[];
  createdByMember?: MemberWithRelationships;
  updatedByMember?: MemberWithRelationships;
  archivedByMember?: MemberWithRelationships;
}
