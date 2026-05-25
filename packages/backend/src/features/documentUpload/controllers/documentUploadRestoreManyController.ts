import { AppContext } from '../../../shared/controller/appContext';
import { RouteConfig } from '../../../shared/openapi/routeToPath';
import { authGuardBackend } from '../../auth/authGuardBackend';
import { documentUploadRestoreManyInputSchema } from '../documentUploadSchemas';
import { auditLogOperations } from '../../auditLog/auditLogOperations';
import { auditLogCreate } from '../../auditLog/auditLogCreate';
import { McpTool } from '../../mcp/mcpTypes';
import { toMcpJsonSchema } from '../../mcp/mcpSchemaConverter';
import { Dictionary } from '../../../translation/locales';
import { prisma } from '../../../prisma';

export const documentUploadRestoreManyApiDoc: RouteConfig = {
  method: 'put',
  path: '/api/document-upload/restore',
  query: documentUploadRestoreManyInputSchema,
};

export const documentUploadRestoreManyMcpTool = (
  dictionary: Dictionary,
): McpTool => ({
  name: 'document-upload_restore_many',
  description: dictionary.documentUpload.mcpDescription.restore,
  requiredPermissions: { documentUpload: ['restore'] },
  schema: toMcpJsonSchema(documentUploadRestoreManyInputSchema),
  handler: async (params, context) => {
    return await documentUploadRestoreManyController(params, context);
  },
});

export async function documentUploadRestoreManyController(
  query: unknown,
  context: AppContext,
) {
  const { currentOrganization } = await authGuardBackend(
    {
      documentUpload: ['restore'],
    },
    context,
  );

  const { ids } = documentUploadRestoreManyInputSchema.parse(query);

  return await prisma.$withRLS(
    { organization: currentOrganization },
    async (tx) => {
      const oldDocumentUploads = await tx.documentUpload.findMany({
        where: {
          id: { in: ids },
          organizationId: currentOrganization.id,
        },
        select: {
          id: true,
          archivedAt: true,
          archivedByMemberId: true,
        },
      });

      const result = await tx.documentUpload.updateMany({
        where: {
          id: { in: ids },
          organizationId: currentOrganization.id,
        },
        data: {
          archivedAt: null,
          archivedByMemberId: null,
        },
      });

      const newDocumentUploads = await tx.documentUpload.findMany({
        where: {
          id: { in: ids },
          organizationId: currentOrganization.id,
        },
        select: {
          id: true,
          archivedAt: true,
          archivedByMemberId: true,
        },
      });

      for (const oldDocumentUpload of oldDocumentUploads) {
        const newDocumentUpload = newDocumentUploads.find(
          (c) => c.id === oldDocumentUpload.id,
        );
        await auditLogCreate({
          entityId: oldDocumentUpload.id,
          entityName: 'DocumentUpload',
          operation: auditLogOperations.update,
          context,
          oldData: oldDocumentUpload,
          newData: newDocumentUpload,
          tx,
        });
      }

      return result;
    },
  );
}
