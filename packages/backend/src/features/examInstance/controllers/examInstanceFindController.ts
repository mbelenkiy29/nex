import { AppContext } from '../../../shared/controller/appContext';
import { RouteConfig } from '../../../shared/openapi/routeToPath';
import { filePopulateDownloadUrlInTree } from '../../file/fileService';
import { authGuardBackend } from '../../auth/authGuardBackend';
import { examInstanceFindSchema } from '../examInstanceSchemas';
import { McpTool } from '../../mcp/mcpTypes';
import { toMcpJsonSchema } from '../../mcp/mcpSchemaConverter';
import { Dictionary } from '../../../translation/locales';
import { prisma } from '../../../prisma';

export const examInstanceFindApiDoc: RouteConfig = {
  method: 'get',
  path: '/api/exam-instance/{id}',
  params: examInstanceFindSchema,
  response: 'ExamInstance',
};

export const examInstanceFindMcpTool = (dictionary: Dictionary): McpTool => ({
  name: 'examInstance_get',
  description: dictionary.examInstance.mcpDescription.get,
  requiredPermissions: { examInstance: ['read'] },
  schema: toMcpJsonSchema(examInstanceFindSchema),
  handler: async (params, context) => {
    return await examInstanceFindController(params, context);
  },
});

export async function examInstanceFindController(
  params: unknown,
  context: AppContext,
) {
  const { currentOrganization } = await authGuardBackend(
    {
      examInstance: ['read'],
    },
    context,
  );

  const { id } = examInstanceFindSchema.parse(params);

  return await prisma.$withRLS(
    { organization: currentOrganization },
    async (tx) => {
      let examInstance = await tx.examInstance.findUnique({
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
          examType: {
            select: {
              id: true,
              name: true,
            },
          },
          student: {
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

      examInstance = await filePopulateDownloadUrlInTree(examInstance);

      return examInstance;
    },
  );
}
