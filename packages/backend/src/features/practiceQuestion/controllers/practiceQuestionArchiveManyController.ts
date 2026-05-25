import { AppContext } from '../../../shared/controller/appContext';
import { RouteConfig } from '../../../shared/openapi/routeToPath';
import { authGuardBackend } from '../../auth/authGuardBackend';
import { practiceQuestionArchiveManyInputSchema as practiceQuestionArchiveManyInputSchema } from '../practiceQuestionSchemas';
import { auditLogOperations } from '../../auditLog/auditLogOperations';
import { auditLogCreate } from '../../auditLog/auditLogCreate';
import { McpTool } from '../../mcp/mcpTypes';
import { toMcpJsonSchema } from '../../mcp/mcpSchemaConverter';
import { Dictionary } from '../../../translation/locales';
import { prisma } from '../../../prisma';

export const practiceQuestionArchiveManyApiDoc: RouteConfig = {
  method: 'put',
  path: '/api/practice-question/archive',
  query: practiceQuestionArchiveManyInputSchema,
};

export const practiceQuestionArchiveManyMcpTool = (
  dictionary: Dictionary,
): McpTool => ({
  name: 'practice-question_archive_many',
  description: dictionary.practiceQuestion.mcpDescription.archive,
  requiredPermissions: { practiceQuestion: ['archive'] },
  schema: toMcpJsonSchema(practiceQuestionArchiveManyInputSchema),
  handler: async (params, context) => {
    return await practiceQuestionArchiveManyController(params, context);
  },
});

export async function practiceQuestionArchiveManyController(
  query: unknown,
  context: AppContext,
) {
  const { currentMember, currentOrganization } = await authGuardBackend(
    {
      practiceQuestion: ['archive'],
    },
    context,
  );

  const { ids } = practiceQuestionArchiveManyInputSchema.parse(query);

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
          archivedAt: new Date(),
          archivedByMemberId: currentMember.id,
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
