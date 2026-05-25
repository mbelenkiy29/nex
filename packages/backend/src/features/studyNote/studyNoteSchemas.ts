import { StudyNote } from '../../prisma/generated/client';
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
import { Lesson } from '../../prisma/generated/client';
import { Course } from '../../prisma/generated/client';

export const studyNoteFindSchema = z.object({
  id: z.string(),
});

export const studyNoteFilterInputSchema = z
  .object({
    title: z.string(),
    content: z.string(),
    isFavorite: booleanStringOptionalSchema,
    tags: z.array(z.string()),
    course: objectToUuidSchemaOptional,
    chapter: objectToUuidSchemaOptional,
    lesson: objectToUuidSchemaOptional,
    author: objectToUuidSchemaOptional,
    createdByMember: objectToUuidSchemaOptional,
    updatedByMember: objectToUuidSchemaOptional,
    createdAtRange: z.array(dateTimeOptionalSchema).max(2),
    updatedAtRange: z.array(dateTimeOptionalSchema).max(2),
    archived: booleanStringOptionalSchema,
  })
  .partial();

export const studyNoteFindManyInputSchema = z.object({
  filter: studyNoteFilterInputSchema.partial().optional(),
  orderBy: orderBySchema.default({ updatedAt: 'desc' }),
  skip: z.coerce.number().optional(),
  take: z.coerce.number().optional(),
});

export const studyNoteDeleteManyInputSchema = z.object({
  ids: z.array(z.string()),
});

export const studyNoteArchiveManyInputSchema = z.object({
  ids: z.array(z.string()),
});

export const studyNoteRestoreManyInputSchema = z.object({
  ids: z.array(z.string()),
});

export const studyNoteAutocompleteInputSchema = z.object({
  search: z.string().trim().optional(),
  exclude: z.array(z.uuid()).optional(),
  take: z.coerce.number().optional(),
  orderBy: orderBySchema.default({ title: 'asc' }),
  course: objectToUuidSchemaOptional,
});

export const studyNoteAutocompleteOutputSchema = z.object({
  id: z.string(),
  title: z.string(),
});

export const studyNoteCreateInputSchema = z.object({
  title: z.string().trim().min(1).min(1).max(200),
  content: z.string().trim().min(1).min(1),
  isFavorite: z.boolean().default(false),
  tags: z.array(z.string()).max(15).optional(),
  course: objectToUuidSchemaOptional,
  chapter: objectToUuidSchemaOptional,
  lesson: objectToUuidSchemaOptional,
  author: objectToUuidSchema,
  importHash: z.string().optional(),
});

export const studyNoteImportInputSchema = studyNoteCreateInputSchema.extend(
  importerInputSchema.shape,
);

export const studyNoteImportFileSchema = z
  .object({
    title: z.string(),
    content: z.string(),
    isFavorite: z.string().transform((val) => val === 'true' || val === 'TRUE'),
    tags: z.string().transform((val) => val?.split(' ')?.filter(Boolean) || []),
    course: z.string(),
    chapter: z.string(),
    lesson: z.string(),
    author: z.string(),
  })
  .partial();

export const studyNoteUpdateParamsInputSchema = z.object({
  id: z.string(),
});

export const studyNoteUpdateBodyInputSchema = studyNoteCreateInputSchema
  .partial()
  .extend({
    updatedAt: dateTimeOptionalSchema,
  });

export interface StudyNoteWithRelationships extends StudyNote {
  course?: Course;
  chapter?: Chapter;
  lesson?: Lesson;
  author?: MemberWithRelationships;
  createdByMember?: MemberWithRelationships;
  updatedByMember?: MemberWithRelationships;
  archivedByMember?: MemberWithRelationships;
}
