import { z } from 'zod';
import { prismaRelationship } from '../../../prisma/prismaRelationship';
import { AppContext } from '../../../shared/controller/appContext';
import { Error400 } from '../../../shared/errors/Error400';
import { RouteConfig } from '../../../shared/openapi/routeToPath';
import { dictionaryFormat } from '../../../translation/dictionaryFormat';
import { authGuardBackend } from '../../auth/authGuardBackend';
import { filePopulateDownloadUrlInTree } from '../../file/fileService';
import { documentUploadCreateInputSchema } from '../documentUploadSchemas';
import { auditLogOperations } from '../../auditLog/auditLogOperations';
import { auditLogCreate } from '../../auditLog/auditLogCreate';
import { McpTool } from '../../mcp/mcpTypes';
import { toMcpJsonSchema } from '../../mcp/mcpSchemaConverter';
import { Dictionary } from '../../../translation/locales';
import { prisma } from '../../../prisma';
import { courseLegacyLinkValidate } from '../../course/courseLegacyLink';

export const documentUploadCreateApiDoc: RouteConfig = {
  method: 'post',
  path: '/api/document-upload',
  body: documentUploadCreateInputSchema,
  response: 'DocumentUpload',
};

export const documentUploadCreateMcpTool = (
  dictionary: Dictionary,
): McpTool => ({
  name: 'documentUpload_create',
  description: dictionary.documentUpload.mcpDescription.create,
  requiredPermissions: { documentUpload: ['create'] },
  schema: toMcpJsonSchema(documentUploadCreateInputSchema),
  handler: async (params, context) => {
    return await documentUploadCreateController(params, context);
  },
});

export async function documentUploadCreateController(
  body: unknown,
  context: AppContext,
) {
  await authGuardBackend(
    {
      documentUpload: ['create'],
    },
    context,
  );
  return await documentUploadCreate(body, context);
}

export async function documentUploadCreate(body: unknown, context: AppContext) {
  const currentOrganization = context.currentOrganization!;

  const data = documentUploadCreateInputSchema.parse(body);

  return await prisma.$withRLS(
    { organization: currentOrganization },
    async (tx) => {
      await courseLegacyLinkValidate(data.course, context, tx);

      const newDocumentUpload = await tx.documentUpload.create({
        data: {
          originalFilename: data.originalFilename,
          status: data.status,
          pageCount: data.pageCount,
          wordCount: data.wordCount,
          processingError: data.processingError,
          sourceFiles: data.sourceFiles,
          course: prismaRelationship.connectOne(data.course),
          exam: prismaRelationship.connectOneOrThrow(data.exam),
          uploadedBy: prismaRelationship.connectOne(data.uploadedBy),
          importHash: data.importHash,
          organization: prismaRelationship.connectOneOrThrow(
            context.currentOrganization!.id,
          ),
          createdByMember: prismaRelationship.connectOne(
            context.currentMember?.id,
          ),
          createdByUserId: context.currentUser?.id,
        },
        include: {
          course: {
            select: {
              id: true,
              title: true,
              slug: true,
            },
          },
          exam: {
            select: {
              id: true,
              name: true,
            },
          },
          uploadedBy: {
            select: {
              id: true,
              fullName: true,
              user: {
                select: {
                  email: true,
                },
              },
            },
          },
          createdByMember: {
            select: {
              id: true,
              fullName: true,
              user: {
                select: {
                  email: true,
                },
              },
            },
          },
          updatedByMember: {
            select: {
              id: true,
              fullName: true,
              user: {
                select: {
                  email: true,
                },
              },
            },
          },
          archivedByMember: {
            select: {
              id: true,
              fullName: true,
              user: {
                select: {
                  email: true,
                },
              },
            },
          },
        },
      });

      await auditLogCreate({
        entityId: newDocumentUpload.id,
        entityName: 'DocumentUpload',
        operation: auditLogOperations.create,
        context,
        newData: newDocumentUpload,
        tx,
      });

      const documentUpload =
        await filePopulateDownloadUrlInTree(newDocumentUpload);

      return documentUpload;
    },
  );
}
