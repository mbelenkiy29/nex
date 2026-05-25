import { AppContext } from '../../../shared/controller/appContext';
import { RouteConfig } from '../../../shared/openapi/routeToPath';
import { authGuardBackend } from '../../auth/authGuardBackend';
import { documentUploadDeleteManyInputSchema } from '../documentUploadSchemas';
import { auditLogOperations } from '../../auditLog/auditLogOperations';
import { auditLogCreate } from '../../auditLog/auditLogCreate';
import { McpTool } from '../../mcp/mcpTypes';
import { toMcpJsonSchema } from '../../mcp/mcpSchemaConverter';
import { Dictionary } from '../../../translation/locales';
import { prisma } from '../../../prisma';

export const documentUploadDeleteManyApiDoc: RouteConfig = {
  method: 'delete',
  path: '/api/document-upload',
  query: documentUploadDeleteManyInputSchema,
};

export const documentUploadDeleteManyMcpTool = (
  dictionary: Dictionary,
): McpTool => ({
  name: 'documentUpload_delete_many',
  description: dictionary.documentUpload.mcpDescription.delete,
  requiredPermissions: { documentUpload: ['delete'] },
  schema: toMcpJsonSchema(documentUploadDeleteManyInputSchema),
  handler: async (params, context) => {
    return await documentUploadDeleteManyController(params, context);
  },
});

export async function documentUploadDeleteManyController(
  query: unknown,
  context: AppContext,
) {
  const { currentOrganization } = await authGuardBackend(
    {
      documentUpload: ['delete'],
    },
    context,
  );

  const { ids } = documentUploadDeleteManyInputSchema.parse(query);

  return await prisma.$withRLS(
    { organization: currentOrganization },
    async (tx) => {
      const documentUploadsToDelete = await tx.documentUpload.findMany({
        where: {
          id: { in: ids },
          organizationId: currentOrganization.id,
        },
        include: {
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

      const result = await tx.documentUpload.deleteMany({
        where: {
          id: { in: ids },
          organizationId: currentOrganization.id,
        },
      });

      for (const documentUpload of documentUploadsToDelete) {
        await auditLogCreate({
          entityId: documentUpload.id,
          entityName: 'DocumentUpload',
          operation: auditLogOperations.delete,
          context,
          oldData: documentUpload,
          tx,
        });
      }

      return result;
    },
  );
}
