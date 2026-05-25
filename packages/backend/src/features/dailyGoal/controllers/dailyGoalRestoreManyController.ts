import { AppContext } from '../../../shared/controller/appContext';
import { RouteConfig } from '../../../shared/openapi/routeToPath';
import { authGuardBackend } from '../../auth/authGuardBackend';
import { dailyGoalRestoreManyInputSchema } from '../dailyGoalSchemas';
import { auditLogOperations } from '../../auditLog/auditLogOperations';
import { auditLogCreate } from '../../auditLog/auditLogCreate';
import { McpTool } from '../../mcp/mcpTypes';
import { toMcpJsonSchema } from '../../mcp/mcpSchemaConverter';
import { Dictionary } from '../../../translation/locales';
import { prisma } from '../../../prisma';

export const dailyGoalRestoreManyApiDoc: RouteConfig = {
  method: 'put',
  path: '/api/daily-goal/restore',
  query: dailyGoalRestoreManyInputSchema,
};

export const dailyGoalRestoreManyMcpTool = (
  dictionary: Dictionary,
): McpTool => ({
  name: 'daily-goal_restore_many',
  description: dictionary.dailyGoal.mcpDescription.restore,
  requiredPermissions: { dailyGoal: ['restore'] },
  schema: toMcpJsonSchema(dailyGoalRestoreManyInputSchema),
  handler: async (params, context) => {
    return await dailyGoalRestoreManyController(params, context);
  },
});

export async function dailyGoalRestoreManyController(
  query: unknown,
  context: AppContext,
) {
  const { currentOrganization } = await authGuardBackend(
    {
      dailyGoal: ['restore'],
    },
    context,
  );

  const { ids } = dailyGoalRestoreManyInputSchema.parse(query);

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
          archivedAt: null,
          archivedByMemberId: null,
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
