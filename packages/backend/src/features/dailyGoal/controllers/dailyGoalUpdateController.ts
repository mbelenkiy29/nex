import { z } from 'zod';
import { prismaRelationship } from '../../../prisma/prismaRelationship';
import { AppContext } from '../../../shared/controller/appContext';
import { Error400 } from '../../../shared/errors/Error400';
import { RouteConfig } from '../../../shared/openapi/routeToPath';
import { dictionaryFormat } from '../../../translation/dictionaryFormat';
import { authGuardBackend } from '../../auth/authGuardBackend';
import { filePopulateDownloadUrlInTree } from '../../file/fileService';
import {
  dailyGoalUpdateBodyInputSchema,
  dailyGoalUpdateParamsInputSchema,
} from '../dailyGoalSchemas';
import { auditLogOperations } from '../../auditLog/auditLogOperations';
import { auditLogCreate } from '../../auditLog/auditLogCreate';
import { McpTool } from '../../mcp/mcpTypes';
import { toMcpJsonSchema } from '../../mcp/mcpSchemaConverter';
import { Dictionary } from '../../../translation/locales';
import { prisma } from '../../../prisma';

export const dailyGoalUpdateApiDoc: RouteConfig = {
  method: 'put',
  path: '/api/daily-goal/{id}',
  params: dailyGoalUpdateParamsInputSchema,
  body: dailyGoalUpdateBodyInputSchema,
  response: 'DailyGoal',
};

export const dailyGoalUpdateMcpTool = (dictionary: Dictionary): McpTool => ({
  name: 'dailyGoal_update',
  description: dictionary.dailyGoal.mcpDescription.update,
  requiredPermissions: { dailyGoal: ['update'] },
  schema: toMcpJsonSchema(
    z.object({
      id: z.string(),
      data: dailyGoalUpdateBodyInputSchema,
    }),
  ),
  handler: async (params, context) => {
    return await dailyGoalUpdateController(
      { id: params.id },
      params.data,
      context,
    );
  },
});

export async function dailyGoalUpdateController(
  params: unknown,
  body: unknown,
  context: AppContext,
) {
  const { currentOrganization } = await authGuardBackend(
    {
      dailyGoal: ['update'],
    },
    context,
  );

  const { id } = dailyGoalUpdateParamsInputSchema.parse(params);

  const data = dailyGoalUpdateBodyInputSchema.parse(body);

  let dailyGoal = await prisma.$withRLS(
    { organization: currentOrganization },
    async (tx) => {
      if (data.updatedAt) {
        const currentDailyGoal = await tx.dailyGoal.findUnique({
          where: {
            id_organizationId: {
              id,
              organizationId: currentOrganization.id,
            },
          },
          select: { updatedAt: true },
        });

        if (currentDailyGoal) {
          const currentUpdatedAt = currentDailyGoal.updatedAt.toISOString();
          const providedUpdatedAt =
            data.updatedAt instanceof Date
              ? data.updatedAt.toISOString()
              : data.updatedAt;

          if (currentUpdatedAt !== providedUpdatedAt) {
            throw new Error400(context.dictionary.shared.errors.staleData);
          }
        }
      }

      const oldDailyGoal = await tx.dailyGoal.findUniqueOrThrow({
        where: {
          id_organizationId: {
            id,
            organizationId: currentOrganization.id,
          },
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

      await tx.dailyGoal.update({
        where: {
          id_organizationId: {
            id,
            organizationId: currentOrganization.id,
          },
        },
        data: {
          title: data.title,
          goalType: data.goalType,
          targetValue: data.targetValue,
          currentValue: data.currentValue,
          xpReward: data.xpReward,
          goalDate: data.goalDate,
          completedAt: data.completedAt,
          owner: prismaRelationship.connectOrDisconnectOne(data.owner),
          updatedByUserId: context.currentUser?.id,
          updatedByMember: prismaRelationship.connectOne(
            context.currentMember?.id,
          ),
        },
      });

      const updatedDailyGoal = await tx.dailyGoal.findUniqueOrThrow({
        where: {
          id_organizationId: {
            id,
            organizationId: currentOrganization.id,
          },
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

      await auditLogCreate({
        entityId: id,
        entityName: 'DailyGoal',
        operation: auditLogOperations.update,
        context,
        oldData: oldDailyGoal,
        newData: updatedDailyGoal,
        tx,
      });

      return updatedDailyGoal;
    },
  );

  dailyGoal = await filePopulateDownloadUrlInTree(dailyGoal);

  return dailyGoal;
}
