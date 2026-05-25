import { AppContext } from '../../../shared/controller/appContext';
import { RouteConfig } from '../../../shared/openapi/routeToPath';
import { filePopulateDownloadUrlInTree } from '../../file/fileService';
import { authGuardBackend } from '../../auth/authGuardBackend';
import { practiceQuestionFindSchema } from '../practiceQuestionSchemas';
import { McpTool } from '../../mcp/mcpTypes';
import { toMcpJsonSchema } from '../../mcp/mcpSchemaConverter';
import { Dictionary } from '../../../translation/locales';
import { prisma } from '../../../prisma';

export const practiceQuestionFindApiDoc: RouteConfig = {
  method: 'get',
  path: '/api/practice-question/{id}',
  params: practiceQuestionFindSchema,
  response: 'PracticeQuestion',
};

export const practiceQuestionFindMcpTool = (
  dictionary: Dictionary,
): McpTool => ({
  name: 'practiceQuestion_get',
  description: dictionary.practiceQuestion.mcpDescription.get,
  requiredPermissions: { practiceQuestion: ['read'] },
  schema: toMcpJsonSchema(practiceQuestionFindSchema),
  handler: async (params, context) => {
    return await practiceQuestionFindController(params, context);
  },
});

export async function practiceQuestionFindController(
  params: unknown,
  context: AppContext,
) {
  const { currentOrganization } = await authGuardBackend(
    {
      practiceQuestion: ['read'],
    },
    context,
  );

  const { id } = practiceQuestionFindSchema.parse(params);

  return await prisma.$withRLS(
    { organization: currentOrganization },
    async (tx) => {
      let practiceQuestion = await tx.practiceQuestion.findUnique({
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
          chapter: {
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

      practiceQuestion = await filePopulateDownloadUrlInTree(practiceQuestion);

      return practiceQuestion;
    },
  );
}
