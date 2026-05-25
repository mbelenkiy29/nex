import { AppContext } from '../../../shared/controller/appContext';
import { RouteConfig } from '../../../shared/openapi/routeToPath';
import { filePopulateDownloadUrlInTree } from '../../file/fileService';
import { authGuardBackend } from '../../auth/authGuardBackend';
import { examFindSchema } from '../examSchemas';
import { McpTool } from '../../mcp/mcpTypes';
import { toMcpJsonSchema } from '../../mcp/mcpSchemaConverter';
import { Dictionary } from '../../../translation/locales';
import { prisma } from '../../../prisma';

export const examFindApiDoc: RouteConfig = {
  method: 'get',
  path: '/api/exam/{id}',
  params: examFindSchema,
  response: 'Exam',
};

export const examFindMcpTool = (dictionary: Dictionary): McpTool => ({
  name: 'exam_get',
  description: dictionary.exam.mcpDescription.get,
  requiredPermissions: { exam: ['read'] },
  schema: toMcpJsonSchema(examFindSchema),
  handler: async (params, context) => {
    return await examFindController(params, context);
  },
});

export async function examFindController(params: unknown, context: AppContext) {
  const { currentOrganization } = await authGuardBackend(
    {
      exam: ['read'],
    },
    context,
  );

  const { id } = examFindSchema.parse(params);

  return await prisma.$withRLS(
    { organization: currentOrganization },
    async (tx) => {
      let exam = await tx.exam.findUnique({
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
          chapters: {
            select: {
              id: true,
              title: true,
            },
          },
          concepts: {
            select: {
              id: true,
              conceptName: true,
            },
          },
          examTypes: {
            select: {
              id: true,
              name: true,
            },
          },
          documentUploads: {
            select: {
              id: true,
              originalFilename: true,
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

      exam = await filePopulateDownloadUrlInTree(exam);

      return exam;
    },
  );
}
