import { AppContext } from '../../../shared/controller/appContext';
import { RouteConfig } from '../../../shared/openapi/routeToPath';
import { authGuardBackend } from '../../auth/authGuardBackend';
import { practiceQuestionDeleteManyInputSchema } from '../practiceQuestionSchemas';
import { auditLogOperations } from '../../auditLog/auditLogOperations';
import { auditLogCreate } from '../../auditLog/auditLogCreate';
import { McpTool } from '../../mcp/mcpTypes';
import { toMcpJsonSchema } from '../../mcp/mcpSchemaConverter';
import { Dictionary } from '../../../translation/locales';
import { prisma } from '../../../prisma';

export const practiceQuestionDeleteManyApiDoc: RouteConfig = {
  method: 'delete',
  path: '/api/practice-question',
  query: practiceQuestionDeleteManyInputSchema,
};

export const practiceQuestionDeleteManyMcpTool = (
  dictionary: Dictionary,
): McpTool => ({
  name: 'practiceQuestion_delete_many',
  description: dictionary.practiceQuestion.mcpDescription.delete,
  requiredPermissions: { practiceQuestion: ['delete'] },
  schema: toMcpJsonSchema(practiceQuestionDeleteManyInputSchema),
  handler: async (params, context) => {
    return await practiceQuestionDeleteManyController(params, context);
  },
});

export async function practiceQuestionDeleteManyController(
  query: unknown,
  context: AppContext,
) {
  const { currentOrganization } = await authGuardBackend(
    {
      practiceQuestion: ['delete'],
    },
    context,
  );

  const { ids } = practiceQuestionDeleteManyInputSchema.parse(query);

  return await prisma.$withRLS(
    { organization: currentOrganization },
    async (tx) => {
      const practiceQuestionsToDelete = await tx.practiceQuestion.findMany({
        where: {
          id: { in: ids },
          organizationId: currentOrganization.id,
        },
        include: {
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

      const result = await tx.practiceQuestion.deleteMany({
        where: {
          id: { in: ids },
          organizationId: currentOrganization.id,
        },
      });

      for (const practiceQuestion of practiceQuestionsToDelete) {
        await auditLogCreate({
          entityId: practiceQuestion.id,
          entityName: 'PracticeQuestion',
          operation: auditLogOperations.delete,
          context,
          oldData: practiceQuestion,
          tx,
        });
      }

      return result;
    },
  );
}
