import { Prisma } from '../../../prisma/generated/client';
import { AppContext } from '../../../shared/controller/appContext';
import { RouteConfig } from '../../../shared/openapi/routeToPath';
import { authGuardBackend } from '../../auth/authGuardBackend';
import { filePopulateDownloadUrlInTree } from '../../file/fileService';
import { dailyGoalFindManyInputSchema } from '../dailyGoalSchemas';
import { McpTool } from '../../mcp/mcpTypes';
import { Dictionary } from '../../../translation/locales';
import { toMcpJsonSchema } from '../../mcp/mcpSchemaConverter';
import { prisma } from '../../../prisma';

export const dailyGoalFindManyApiDoc: RouteConfig = {
  method: 'get',
  path: '/api/daily-goal',
  query: dailyGoalFindManyInputSchema,
  response: '{ dailyGoals: DailyGoal[], count: number }',
};

export const dailyGoalFindManyMcpTool = (dictionary: Dictionary): McpTool => ({
  name: 'dailyGoal_list',
  description: dictionary.dailyGoal.mcpDescription.list,
  requiredPermissions: { dailyGoal: ['read'] },
  schema: toMcpJsonSchema(dailyGoalFindManyInputSchema),
  handler: async (params, context) => {
    return await dailyGoalFindManyController(params, context);
  },
});

export async function dailyGoalFindManyController(
  query: unknown,
  context: AppContext,
) {
  const { currentOrganization } = await authGuardBackend(
    {
      dailyGoal: ['read'],
    },
    context,
  );

  const { filter, orderBy, skip, take } =
    dailyGoalFindManyInputSchema.parse(query);

  return await prisma.$withRLS(
    { organization: currentOrganization },
    async (tx) => {
      const whereAnd: Array<Prisma.DailyGoalWhereInput> = [];

      whereAnd.push({
        organizationId: currentOrganization.id,
      });

      if (filter?.archived !== 'true') {
        whereAnd.push({ archivedAt: null });
      }
      if (filter?.title != null) {
        whereAnd.push({
          title: { contains: filter?.title, mode: 'insensitive' },
        });
      }
      if (filter?.goalType != null) {
        whereAnd.push({
          goalType: filter?.goalType,
        });
      }
      if (filter?.targetValueRange?.length) {
        const start = filter.targetValueRange?.[0];
        const end = filter.targetValueRange?.[1];

        if (start != null) {
          whereAnd.push({
            targetValue: { gte: start },
          });
        }

        if (end != null) {
          whereAnd.push({
            targetValue: { lte: end },
          });
        }
      }
      if (filter?.currentValueRange?.length) {
        const start = filter.currentValueRange?.[0];
        const end = filter.currentValueRange?.[1];

        if (start != null) {
          whereAnd.push({
            currentValue: { gte: start },
          });
        }

        if (end != null) {
          whereAnd.push({
            currentValue: { lte: end },
          });
        }
      }
      if (filter?.goalDateRange?.length) {
        const start = filter.goalDateRange?.[0];
        const end = filter.goalDateRange?.[1];

        if (start != null) {
          whereAnd.push({
            goalDate: {
              gte: start,
            },
          });
        }

        if (end != null) {
          whereAnd.push({
            goalDate: {
              lte: end,
            },
          });
        }
      }
      if (filter?.completedAtRange?.length) {
        const start = filter.completedAtRange?.[0];
        const end = filter.completedAtRange?.[1];

        if (start != null) {
          whereAnd.push({
            completedAt: {
              gte: start,
            },
          });
        }

        if (end != null) {
          whereAnd.push({
            completedAt: {
              lte: end,
            },
          });
        }
      }
      if (filter?.owner != null) {
        whereAnd.push({
          owner: {
            id: filter.owner,
          },
        });
      }
      if (filter?.createdByMember != null) {
        whereAnd.push({
          createdByMember: {
            id: filter.createdByMember,
          },
        });
      }

      if (filter?.updatedByMember != null) {
        whereAnd.push({
          updatedByMember: {
            id: filter.updatedByMember,
          },
        });
      }

      if (filter?.createdAtRange?.length) {
        const start = filter.createdAtRange?.[0];
        const end = filter.createdAtRange?.[1];

        if (start != null) {
          whereAnd.push({
            createdAt: {
              gte: start,
            },
          });
        }

        if (end != null) {
          whereAnd.push({
            createdAt: {
              lte: end,
            },
          });
        }
      }

      if (filter?.updatedAtRange?.length) {
        const start = filter.updatedAtRange?.[0];
        const end = filter.updatedAtRange?.[1];

        if (start != null) {
          whereAnd.push({
            updatedAt: {
              gte: start,
            },
          });
        }

        if (end != null) {
          whereAnd.push({
            updatedAt: {
              lte: end,
            },
          });
        }
      }

      let dailyGoals = await tx.dailyGoal.findMany({
        where: {
          AND: whereAnd,
        },
        skip,
        take,
        orderBy,
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
        },
      });

      const count = await tx.dailyGoal.count({
        where: {
          AND: whereAnd,
        },
      });

      dailyGoals = await filePopulateDownloadUrlInTree(dailyGoals);

      return { dailyGoals, count };
    },
  );
}
