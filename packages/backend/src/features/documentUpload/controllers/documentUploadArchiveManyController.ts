import { AppContext } from '../../../shared/controller/appContext';
import { RouteConfig } from '../../../shared/openapi/routeToPath';
import { authGuardBackend } from '../../auth/authGuardBackend';
import { documentUploadArchiveManyInputSchema as documentUploadArchiveManyInputSchema } from '../documentUploadSchemas';
import { auditLogOperations } from '../../auditLog/auditLogOperations';
import { auditLogCreate } from '../../auditLog/auditLogCreate';
import { McpTool } from '../../mcp/mcpTypes';
import { toMcpJsonSchema } from '../../mcp/mcpSchemaConverter';
import { Dictionary } from '../../../translation/locales';
import { prisma } from '../../../prisma';

export const documentUploadArchiveManyApiDoc: RouteConfig = {
  method: 'put',
  path: '/api/document-upload/archive',
  query: documentUploadArchiveManyInputSchema,
};

export const documentUploadArchiveManyMcpTool = (
  dictionary: Dictionary,
): McpTool => ({
  name: 'document-upload_archive_many',
  description: dictionary.documentUpload.mcpDescription.archive,
  requiredPermissions: { documentUpload: ['archive'] },
  schema: toMcpJsonSchema(documentUploadArchiveManyInputSchema),
  handler: async (params, context) => {
    return await documentUploadArchiveManyController(params, context);
  },
});

export async function documentUploadArchiveManyController(
  query: unknown,
  context: AppContext,
) {
  const { currentMember, currentOrganization } = await authGuardBackend(
    {
      documentUpload: ['archive'],
    },
    context,
  );

  const { ids } = documentUploadArchiveManyInputSchema.parse(query);

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
          archivedAt: new Date(),
          archivedByMemberId: currentMember.id,
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
