import { AppContext } from '../../../shared/controller/appContext';
import { RouteConfig } from '../../../shared/openapi/routeToPath';
import { filePopulateDownloadUrlInTree } from '../../file/fileService';
import { authGuardBackend } from '../../auth/authGuardBackend';
import { examTypeFindSchema } from '../examTypeSchemas';
import { McpTool } from '../../mcp/mcpTypes';
import { toMcpJsonSchema } from '../../mcp/mcpSchemaConverter';
import { Dictionary } from '../../../translation/locales';
import { prisma } from '../../../prisma';

export const examTypeFindApiDoc: RouteConfig = {
  method: 'get',
  path: '/api/exam-type/{id}',
  params: examTypeFindSchema,
  response: 'ExamType',
};

export const examTypeFindMcpTool = (dictionary: Dictionary): McpTool => ({
  name: 'examType_get',
  description: dictionary.examType.mcpDescription.get,
  requiredPermissions: { examType: ['read'] },
  schema: toMcpJsonSchema(examTypeFindSchema),
  handler: async (params, context) => {
    return await examTypeFindController(params, context);
  },
});

export async function examTypeFindController(
  params: unknown,
  context: AppContext,
) {
  const { currentOrganization } = await authGuardBackend(
    {
      examType: ['read'],
    },
    context,
  );

  const { id } = examTypeFindSchema.parse(params);

  return await prisma.$withRLS(
    { organization: currentOrganization },
    async (tx) => {
      let examType = await tx.examType.findUnique({
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
          examInstances: {
            select: {
              id: true,
              status: true,
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

      examType = await filePopulateDownloadUrlInTree(examType);

      return examType;
    },
  );
}
