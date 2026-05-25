import { AppContext } from '../../../shared/controller/appContext';
import { RouteConfig } from '../../../shared/openapi/routeToPath';
import { authGuardBackend } from '../../auth/authGuardBackend';
import { dailyGoalDeleteManyInputSchema } from '../dailyGoalSchemas';
import { auditLogOperations } from '../../auditLog/auditLogOperations';
import { auditLogCreate } from '../../auditLog/auditLogCreate';
import { McpTool } from '../../mcp/mcpTypes';
import { toMcpJsonSchema } from '../../mcp/mcpSchemaConverter';
import { Dictionary } from '../../../translation/locales';
import { prisma } from '../../../prisma';

export const dailyGoalDeleteManyApiDoc: RouteConfig = {
  method: 'delete',
  path: '/api/daily-goal',
  query: dailyGoalDeleteManyInputSchema,
};

export const dailyGoalDeleteManyMcpTool = (
  dictionary: Dictionary,
): McpTool => ({
  name: 'dailyGoal_delete_many',
  description: dictionary.dailyGoal.mcpDescription.delete,
  requiredPermissions: { dailyGoal: ['delete'] },
  schema: toMcpJsonSchema(dailyGoalDeleteManyInputSchema),
  handler: async (params, context) => {
    return await dailyGoalDeleteManyController(params, context);
  },
});

export async function dailyGoalDeleteManyController(
  query: unknown,
  context: AppContext,
) {
  const { currentOrganization } = await authGuardBackend(
    {
      dailyGoal: ['delete'],
    },
    context,
  );

  const { ids } = dailyGoalDeleteManyInputSchema.parse(query);

  return await prisma.$withRLS(
    { organization: currentOrganization },
    async (tx) => {
      const dailyGoalsToDelete = await tx.dailyGoal.findMany({
        where: {
          id: { in: ids },
          organizationId: currentOrganization.id,
        },
        include: {
          owner: {
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

      const result = await tx.dailyGoal.deleteMany({
        where: {
          id: { in: ids },
          organizationId: currentOrganization.id,
        },
      });

      for (const dailyGoal of dailyGoalsToDelete) {
        await auditLogCreate({
          entityId: dailyGoal.id,
          entityName: 'DailyGoal',
          operation: auditLogOperations.delete,
          context,
          oldData: dailyGoal,
          tx,
        });
      }

      return result;
    },
  );
}
