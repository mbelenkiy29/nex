import { AppContext } from '../../../shared/controller/appContext';
import { RouteConfig } from '../../../shared/openapi/routeToPath';
import { authGuardBackend } from '../../auth/authGuardBackend';
import { dailyGoalArchiveManyInputSchema as dailyGoalArchiveManyInputSchema } from '../dailyGoalSchemas';
import { auditLogOperations } from '../../auditLog/auditLogOperations';
import { auditLogCreate } from '../../auditLog/auditLogCreate';
import { McpTool } from '../../mcp/mcpTypes';
import { toMcpJsonSchema } from '../../mcp/mcpSchemaConverter';
import { Dictionary } from '../../../translation/locales';
import { prisma } from '../../../prisma';

export const dailyGoalArchiveManyApiDoc: RouteConfig = {
  method: 'put',
  path: '/api/daily-goal/archive',
  query: dailyGoalArchiveManyInputSchema,
};

export const dailyGoalArchiveManyMcpTool = (
  dictionary: Dictionary,
): McpTool => ({
  name: 'daily-goal_archive_many',
  description: dictionary.dailyGoal.mcpDescription.archive,
  requiredPermissions: { dailyGoal: ['archive'] },
  schema: toMcpJsonSchema(dailyGoalArchiveManyInputSchema),
  handler: async (params, context) => {
    return await dailyGoalArchiveManyController(params, context);
  },
});

export async function dailyGoalArchiveManyController(
  query: unknown,
  context: AppContext,
) {
  const { currentMember, currentOrganization } = await authGuardBackend(
    {
      dailyGoal: ['archive'],
    },
    context,
  );

  const { ids } = dailyGoalArchiveManyInputSchema.parse(query);

  return await prisma.$withRLS(
    { organization: currentOrganization },
    async (tx) => {
      const oldDailyGoals = await tx.dailyGoal.findMany({
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

      const result = await tx.dailyGoal.updateMany({
        where: {
          id: { in: ids },
          organizationId: currentOrganization.id,
        },
        data: {
          archivedAt: new Date(),
          archivedByMemberId: currentMember.id,
        },
      });

      const newDailyGoals = await tx.dailyGoal.findMany({
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

      for (const oldDailyGoal of oldDailyGoals) {
        const newDailyGoal = newDailyGoals.find(
          (c) => c.id === oldDailyGoal.id,
        );
        await auditLogCreate({
          entityId: oldDailyGoal.id,
          entityName: 'DailyGoal',
          operation: auditLogOperations.update,
          context,
          oldData: oldDailyGoal,
          newData: newDailyGoal,
          tx,
        });
      }

      return result;
    },
  );
}
