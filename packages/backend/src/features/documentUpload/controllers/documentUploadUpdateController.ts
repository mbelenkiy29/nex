import { z } from 'zod';
import { prismaRelationship } from '../../../prisma/prismaRelationship';
import { AppContext } from '../../../shared/controller/appContext';
import { Error400 } from '../../../shared/errors/Error400';
import { RouteConfig } from '../../../shared/openapi/routeToPath';
import { dictionaryFormat } from '../../../translation/dictionaryFormat';
import { authGuardBackend } from '../../auth/authGuardBackend';
import { filePopulateDownloadUrlInTree } from '../../file/fileService';
import {
  documentUploadUpdateBodyInputSchema,
  documentUploadUpdateParamsInputSchema,
} from '../documentUploadSchemas';
import { auditLogOperations } from '../../auditLog/auditLogOperations';
import { auditLogCreate } from '../../auditLog/auditLogCreate';
import { McpTool } from '../../mcp/mcpTypes';
import { toMcpJsonSchema } from '../../mcp/mcpSchemaConverter';
import { Dictionary } from '../../../translation/locales';
import { prisma } from '../../../prisma';
import { courseLegacyLinkValidate } from '../../course/courseLegacyLink';

export const documentUploadUpdateApiDoc: RouteConfig = {
  method: 'put',
  path: '/api/document-upload/{id}',
  params: documentUploadUpdateParamsInputSchema,
  body: documentUploadUpdateBodyInputSchema,
  response: 'DocumentUpload',
};

export const documentUploadUpdateMcpTool = (
  dictionary: Dictionary,
): McpTool => ({
  name: 'documentUpload_update',
  description: dictionary.documentUpload.mcpDescription.update,
  requiredPermissions: { documentUpload: ['update'] },
  schema: toMcpJsonSchema(
    z.object({
      id: z.string(),
      data: documentUploadUpdateBodyInputSchema,
    }),
  ),
  handler: async (params, context) => {
    return await documentUploadUpdateController(
      { id: params.id },
      params.data,
      context,
    );
  },
});

export async function documentUploadUpdateController(
  params: unknown,
  body: unknown,
  context: AppContext,
) {
  const { currentOrganization } = await authGuardBackend(
    {
      documentUpload: ['update'],
    },
    context,
  );

  const { id } = documentUploadUpdateParamsInputSchema.parse(params);

  const data = documentUploadUpdateBodyInputSchema.parse(body);

  let documentUpload = await prisma.$withRLS(
    { organization: currentOrganization },
    async (tx) => {
      if (data.updatedAt) {
        const currentDocumentUpload = await tx.documentUpload.findUnique({
          where: {
            id_organizationId: {
              id,
              organizationId: currentOrganization.id,
            },
          },
          select: { updatedAt: true },
        });

        if (currentDocumentUpload) {
          const currentUpdatedAt =
            currentDocumentUpload.updatedAt.toISOString();
          const providedUpdatedAt =
            data.updatedAt instanceof Date
              ? data.updatedAt.toISOString()
              : data.updatedAt;

          if (currentUpdatedAt !== providedUpdatedAt) {
            throw new Error400(context.dictionary.shared.errors.staleData);
          }
        }
      }

      const oldDocumentUpload = await tx.documentUpload.findUniqueOrThrow({
        where: {
          id_organizationId: {
            id,
            organizationId: currentOrganization.id,
          },
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

      await courseLegacyLinkValidate(data.course, context, tx);

      await tx.documentUpload.update({
        where: {
          id_organizationId: {
            id,
            organizationId: currentOrganization.id,
          },
        },
        data: {
          originalFilename: data.originalFilename,
          status: data.status,
          pageCount: data.pageCount,
          wordCount: data.wordCount,
          processingError: data.processingError,
          sourceFiles: data.sourceFiles,
          course: prismaRelationship.connectOrDisconnectOne(data.course),
          exam: prismaRelationship.connectOrDisconnectOne(data.exam),
          uploadedBy: prismaRelationship.connectOrDisconnectOne(
            data.uploadedBy,
          ),
          updatedByUserId: context.currentUser?.id,
          updatedByMember: prismaRelationship.connectOne(
            context.currentMember?.id,
          ),
        },
      });

      const updatedDocumentUpload = await tx.documentUpload.findUniqueOrThrow({
        where: {
          id_organizationId: {
            id,
            organizationId: currentOrganization.id,
          },
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
        entityId: id,
        entityName: 'DocumentUpload',
        operation: auditLogOperations.update,
        context,
        oldData: oldDocumentUpload,
        newData: updatedDocumentUpload,
        tx,
      });

      return updatedDocumentUpload;
    },
  );

  documentUpload = await filePopulateDownloadUrlInTree(documentUpload);

  return documentUpload;
}
