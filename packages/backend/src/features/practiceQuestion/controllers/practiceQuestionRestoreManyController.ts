import { AppContext } from '../../../shared/controller/appContext';
import { RouteConfig } from '../../../shared/openapi/routeToPath';
import { authGuardBackend } from '../../auth/authGuardBackend';
import { practiceQuestionRestoreManyInputSchema } from '../practiceQuestionSchemas';
import { auditLogOperations } from '../../auditLog/auditLogOperations';
import { auditLogCreate } from '../../auditLog/auditLogCreate';
import { McpTool } from '../../mcp/mcpTypes';
import { toMcpJsonSchema } from '../../mcp/mcpSchemaConverter';
import { Dictionary } from '../../../translation/locales';
import { prisma } from '../../../prisma';

export const practiceQuestionRestoreManyApiDoc: RouteConfig = {
  method: 'put',
  path: '/api/practice-question/restore',
  query: practiceQuestionRestoreManyInputSchema,
};

export const practiceQuestionRestoreManyMcpTool = (
  dictionary: Dictionary,
): McpTool => ({
  name: 'practice-question_restore_many',
  description: dictionary.practiceQuestion.mcpDescription.restore,
  requiredPermissions: { practiceQuestion: ['restore'] },
  schema: toMcpJsonSchema(practiceQuestionRestoreManyInputSchema),
  handler: async (params, context) => {
    return await practiceQuestionRestoreManyController(params, context);
  },
});

export async function practiceQuestionRestoreManyController(
  query: unknown,
  context: AppContext,
) {
  const { currentOrganization } = await authGuardBackend(
    {
      practiceQuestion: ['restore'],
    },
    context,
  );

  const { ids } = practiceQuestionRestoreManyInputSchema.parse(query);

  return await prisma.$withRLS(
    { organization: currentOrganization },
    async (tx) => {
      const oldPracticeQuestions = await tx.practiceQuestion.findMany({
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

      const result = await tx.practiceQuestion.updateMany({
        where: {
          id: { in: ids },
          organizationId: currentOrganization.id,
        },
        data: {
          archivedAt: null,
          archivedByMemberId: null,
        },
      });

      const newPracticeQuestions = await tx.practiceQuestion.findMany({
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

      for (const oldPracticeQuestion of oldPracticeQuestions) {
        const newPracticeQuestion = newPracticeQuestions.find(
          (c) => c.id === oldPracticeQuestion.id,
        );
        await auditLogCreate({
          entityId: oldPracticeQuestion.id,
          entityName: 'PracticeQuestion',
          operation: auditLogOperations.update,
          context,
          oldData: oldPracticeQuestion,
          newData: newPracticeQuestion,
          tx,
        });
      }

      return result;
    },
  );
}
