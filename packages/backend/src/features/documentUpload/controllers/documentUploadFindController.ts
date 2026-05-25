import { AppContext } from '../../../shared/controller/appContext';
import { RouteConfig } from '../../../shared/openapi/routeToPath';
import { filePopulateDownloadUrlInTree } from '../../file/fileService';
import { authGuardBackend } from '../../auth/authGuardBackend';
import { documentUploadFindSchema } from '../documentUploadSchemas';
import { McpTool } from '../../mcp/mcpTypes';
import { toMcpJsonSchema } from '../../mcp/mcpSchemaConverter';
import { Dictionary } from '../../../translation/locales';
import { prisma } from '../../../prisma';

export const documentUploadFindApiDoc: RouteConfig = {
  method: 'get',
  path: '/api/document-upload/{id}',
  params: documentUploadFindSchema,
  response: 'DocumentUpload',
};

export const documentUploadFindMcpTool = (dictionary: Dictionary): McpTool => ({
  name: 'documentUpload_get',
  description: dictionary.documentUpload.mcpDescription.get,
  requiredPermissions: { documentUpload: ['read'] },
  schema: toMcpJsonSchema(documentUploadFindSchema),
  handler: async (params, context) => {
    return await documentUploadFindController(params, context);
  },
});

export async function documentUploadFindController(
  params: unknown,
  context: AppContext,
) {
  const { currentOrganization } = await authGuardBackend(
    {
      documentUpload: ['read'],
    },
    context,
  );

  const { id } = documentUploadFindSchema.parse(params);

  return await prisma.$withRLS(
    { organization: currentOrganization },
    async (tx) => {
      let documentUpload = await tx.documentUpload.findUnique({
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
            include: {
              user: {
                select: {
                  id: true,
                  email: true,
                },
              },
            },
          },
          createdByMember: {
            include: {
              user: {
                select: {
                  id: true,
                  email: true,
                },
              },
            },
          },
          updatedByMember: {
            include: {
              user: {
                select: {
                  id: true,
                  email: true,
                },
              },
            },
          },
          archivedByMember: {
            include: {
              user: {
                select: {
                  id: true,
                  email: true,
                },
              },
            },
          },
        },
      });

      documentUpload = await filePopulateDownloadUrlInTree(documentUpload);

      return documentUpload;
    },
  );
}
