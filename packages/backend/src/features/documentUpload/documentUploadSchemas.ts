import { DocumentUpload } from '../../prisma/generated/client';
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
import { fileUploadedSchema } from '../file/fileSchemas';
import { MemberWithRelationships } from '../member/memberSchemas';
import { documentUploadEnumerators } from './documentUploadEnumerators';
import { Exam } from '../../prisma/generated/client';
import { Course } from '../../prisma/generated/client';

export const documentUploadFindSchema = z.object({
  id: z.string(),
});

export const documentUploadFilterInputSchema = z
  .object({
    originalFilename: z.string(),
    status: z.enum(documentUploadEnumerators.status).nullable().optional(),
    pageCountRange: z.array(numberOptionalSchema).max(2),
    wordCountRange: z.array(numberOptionalSchema).max(2),
    course: objectToUuidSchemaOptional,
    exam: objectToUuidSchemaOptional,
    uploadedBy: objectToUuidSchemaOptional,
    createdByMember: objectToUuidSchemaOptional,
    updatedByMember: objectToUuidSchemaOptional,
    createdAtRange: z.array(dateTimeOptionalSchema).max(2),
    updatedAtRange: z.array(dateTimeOptionalSchema).max(2),
    archived: booleanStringOptionalSchema,
  })
  .partial();

export const documentUploadFindManyInputSchema = z.object({
  filter: documentUploadFilterInputSchema.partial().optional(),
  orderBy: orderBySchema.default({ updatedAt: 'desc' }),
  skip: z.coerce.number().optional(),
  take: z.coerce.number().optional(),
});

export const documentUploadDeleteManyInputSchema = z.object({
  ids: z.array(z.string()),
});

export const documentUploadArchiveManyInputSchema = z.object({
  ids: z.array(z.string()),
});

export const documentUploadRestoreManyInputSchema = z.object({
  ids: z.array(z.string()),
});

export const documentUploadAutocompleteInputSchema = z.object({
  search: z.string().trim().optional(),
  exclude: z.array(z.uuid()).optional(),
  take: z.coerce.number().optional(),
  orderBy: orderBySchema.default({ originalFilename: 'asc' }),
  course: objectToUuidSchemaOptional,
});

export const documentUploadAutocompleteOutputSchema = z.object({
  id: z.string(),
  originalFilename: z.string(),
});

export const documentUploadCreateInputSchema = z.object({
  originalFilename: z.string().trim().min(1).min(1).max(500),
  status: z.enum(documentUploadEnumerators.status),
  pageCount: numberOptionalSchema.pipe(
    z.int().positive().min(0).nullable().optional(),
  ),
  wordCount: numberOptionalSchema.pipe(
    z.int().positive().min(0).nullable().optional(),
  ),
  processingError: z
    .string()
    .trim()
    .max(2000)
    .or(z.string().trim().max(0))
    .nullable()
    .optional(),
  sourceFiles: z.array(fileUploadedSchema).min(1).max(5),
  course: objectToUuidSchemaOptional,
  exam: objectToUuidSchema,
  uploadedBy: objectToUuidSchemaOptional,
  importHash: z.string().optional(),
});

export const documentUploadImportInputSchema = documentUploadCreateInputSchema
  .extend(importerInputSchema.shape)
  .extend({
    sourceFiles: z
      .union([z.array(fileUploadedSchema), z.array(z.string())])
      .transform((val) => {
        if (val.length > 0 && typeof val[0] === 'string') {
          return val;
        }
        return val;
      }),
  });

export const documentUploadImportFileSchema = z
  .object({
    originalFilename: z.string(),
    status: z.string(),
    pageCount: z.string(),
    wordCount: z.string(),
    processingError: z.string(),
    sourceFiles: z
      .string()
      .transform((val) => val?.split(' ')?.filter(Boolean) || []),
    course: z.string(),
    exam: z.string(),
    uploadedBy: z.string(),
  })
  .partial();

export const documentUploadUpdateParamsInputSchema = z.object({
  id: z.string(),
});

export const documentUploadUpdateBodyInputSchema =
  documentUploadCreateInputSchema.partial().extend({
    updatedAt: dateTimeOptionalSchema,
  });

export interface DocumentUploadWithRelationships extends DocumentUpload {
  course?: Course;
  exam?: Exam;
  uploadedBy?: MemberWithRelationships;
  createdByMember?: MemberWithRelationships;
  updatedByMember?: MemberWithRelationships;
  archivedByMember?: MemberWithRelationships;
}
