import { AppContext } from '../../../shared/controller/appContext';
import { RouteConfig } from '../../../shared/openapi/routeToPath';
import { filePopulateDownloadUrlInTree } from '../../file/fileService';
import { authGuardBackend } from '../../auth/authGuardBackend';
import { dailyGoalFindSchema } from '../dailyGoalSchemas';
import { McpTool } from '../../mcp/mcpTypes';
import { toMcpJsonSchema } from '../../mcp/mcpSchemaConverter';
import { Dictionary } from '../../../translation/locales';
import { prisma } from '../../../prisma';

export const dailyGoalFindApiDoc: RouteConfig = {
  method: 'get',
  path: '/api/daily-goal/{id}',
  params: dailyGoalFindSchema,
  response: 'DailyGoal',
};

export const dailyGoalFindMcpTool = (dictionary: Dictionary): McpTool => ({
  name: 'dailyGoal_get',
  description: dictionary.dailyGoal.mcpDescription.get,
  requiredPermissions: { dailyGoal: ['read'] },
  schema: toMcpJsonSchema(dailyGoalFindSchema),
  handler: async (params, context) => {
    return await dailyGoalFindController(params, context);
  },
});

export async function dailyGoalFindController(
  params: unknown,
  context: AppContext,
) {
  const { currentOrganization } = await authGuardBackend(
    {
      dailyGoal: ['read'],
    },
    context,
  );

  const { id } = dailyGoalFindSchema.parse(params);

  return await prisma.$withRLS(
    { organization: currentOrganization },
    async (tx) => {
      let dailyGoal = await tx.dailyGoal.findUnique({
        where: {
          id_organizationId: {
            id,
            organizationId: currentOrganization.id,
          },
        },
        include: {
          owner: {
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

      dailyGoal = await filePopulateDownloadUrlInTree(dailyGoal);

      return dailyGoal;
    },
  );
}
