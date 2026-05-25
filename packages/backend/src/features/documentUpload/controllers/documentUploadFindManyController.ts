import { Prisma } from '../../../prisma/generated/client';
import { AppContext } from '../../../shared/controller/appContext';
import { RouteConfig } from '../../../shared/openapi/routeToPath';
import { authGuardBackend } from '../../auth/authGuardBackend';
import { filePopulateDownloadUrlInTree } from '../../file/fileService';
import { documentUploadFindManyInputSchema } from '../documentUploadSchemas';
import { McpTool } from '../../mcp/mcpTypes';
import { Dictionary } from '../../../translation/locales';
import { toMcpJsonSchema } from '../../mcp/mcpSchemaConverter';
import { prisma } from '../../../prisma';

export const documentUploadFindManyApiDoc: RouteConfig = {
  method: 'get',
  path: '/api/document-upload',
  query: documentUploadFindManyInputSchema,
  response: '{ documentUploads: DocumentUpload[], count: number }',
};

export const documentUploadFindManyMcpTool = (
  dictionary: Dictionary,
): McpTool => ({
  name: 'documentUpload_list',
  description: dictionary.documentUpload.mcpDescription.list,
  requiredPermissions: { documentUpload: ['read'] },
  schema: toMcpJsonSchema(documentUploadFindManyInputSchema),
  handler: async (params, context) => {
    return await documentUploadFindManyController(params, context);
  },
});

export async function documentUploadFindManyController(
  query: unknown,
  context: AppContext,
) {
  const { currentOrganization } = await authGuardBackend(
    {
      documentUpload: ['read'],
    },
    context,
  );

  const { filter, orderBy, skip, take } =
    documentUploadFindManyInputSchema.parse(query);

  return await prisma.$withRLS(
    { organization: currentOrganization },
    async (tx) => {
      const whereAnd: Array<Prisma.DocumentUploadWhereInput> = [];

      whereAnd.push({
        organizationId: currentOrganization.id,
      });

      if (filter?.archived !== 'true') {
        whereAnd.push({ archivedAt: null });
      }
      if (filter?.originalFilename != null) {
        whereAnd.push({
          originalFilename: {
            contains: filter?.originalFilename,
            mode: 'insensitive',
          },
        });
      }
      if (filter?.status != null) {
        whereAnd.push({
          status: filter?.status,
        });
      }
      if (filter?.pageCountRange?.length) {
        const start = filter.pageCountRange?.[0];
        const end = filter.pageCountRange?.[1];

        if (start != null) {
          whereAnd.push({
            pageCount: { gte: start },
          });
        }

        if (end != null) {
          whereAnd.push({
            pageCount: { lte: end },
          });
        }
      }
      if (filter?.wordCountRange?.length) {
        const start = filter.wordCountRange?.[0];
        const end = filter.wordCountRange?.[1];

        if (start != null) {
          whereAnd.push({
            wordCount: { gte: start },
          });
        }

        if (end != null) {
          whereAnd.push({
            wordCount: { lte: end },
          });
        }
      }
      if (filter?.course != null) {
        whereAnd.push({
          course: {
            id: filter.course,
          },
        });
      }
      if (filter?.exam != null) {
        whereAnd.push({
          exam: {
            id: filter.exam,
          },
        });
      }
      if (filter?.uploadedBy != null) {
        whereAnd.push({
          uploadedBy: {
            id: filter.uploadedBy,
          },
        });
      }
      if (filter?.createdByMember != null) {
        whereAnd.push({
          createdByMember: {
            id: filter.createdByMember,
          },
        });
      }

      if (filter?.updatedByMember != null) {
        whereAnd.push({
          updatedByMember: {
            id: filter.updatedByMember,
          },
        });
      }

      if (filter?.createdAtRange?.length) {
        const start = filter.createdAtRange?.[0];
        const end = filter.createdAtRange?.[1];

        if (start != null) {
          whereAnd.push({
            createdAt: {
              gte: start,
            },
          });
        }

        if (end != null) {
          whereAnd.push({
            createdAt: {
              lte: end,
            },
          });
        }
      }

      if (filter?.updatedAtRange?.length) {
        const start = filter.updatedAtRange?.[0];
        const end = filter.updatedAtRange?.[1];

        if (start != null) {
          whereAnd.push({
            updatedAt: {
              gte: start,
            },
          });
        }

        if (end != null) {
          whereAnd.push({
            updatedAt: {
              lte: end,
            },
          });
        }
      }

      let documentUploads = await tx.documentUpload.findMany({
        where: {
          AND: whereAnd,
        },
        skip,
        take,
        orderBy,
        include: {
          course: true,
          exam: true,
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
        },
      });

      const count = await tx.documentUpload.count({
        where: {
          AND: whereAnd,
        },
      });

      documentUploads = await filePopulateDownloadUrlInTree(documentUploads);

      return { documentUploads, count };
    },
  );
}
