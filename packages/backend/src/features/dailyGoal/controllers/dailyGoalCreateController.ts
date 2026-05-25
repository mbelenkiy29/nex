import { z } from 'zod';
import { prismaRelationship } from '../../../prisma/prismaRelationship';
import { AppContext } from '../../../shared/controller/appContext';
import { Error400 } from '../../../shared/errors/Error400';
import { RouteConfig } from '../../../shared/openapi/routeToPath';
import { dictionaryFormat } from '../../../translation/dictionaryFormat';
import { authGuardBackend } from '../../auth/authGuardBackend';
import { filePopulateDownloadUrlInTree } from '../../file/fileService';
import { dailyGoalCreateInputSchema } from '../dailyGoalSchemas';
import { auditLogOperations } from '../../auditLog/auditLogOperations';
import { auditLogCreate } from '../../auditLog/auditLogCreate';
import { McpTool } from '../../mcp/mcpTypes';
import { toMcpJsonSchema } from '../../mcp/mcpSchemaConverter';
import { Dictionary } from '../../../translation/locales';
import { prisma } from '../../../prisma';

export const dailyGoalCreateApiDoc: RouteConfig = {
  method: 'post',
  path: '/api/daily-goal',
  body: dailyGoalCreateInputSchema,
  response: 'DailyGoal',
};

export const dailyGoalCreateMcpTool = (dictionary: Dictionary): McpTool => ({
  name: 'dailyGoal_create',
  description: dictionary.dailyGoal.mcpDescription.create,
  requiredPermissions: { dailyGoal: ['create'] },
  schema: toMcpJsonSchema(dailyGoalCreateInputSchema),
  handler: async (params, context) => {
    return await dailyGoalCreateController(params, context);
  },
});

export async function dailyGoalCreateController(
  body: unknown,
  context: AppContext,
) {
  await authGuardBackend(
    {
      dailyGoal: ['create'],
    },
    context,
  );
  return await dailyGoalCreate(body, context);
}

export async function dailyGoalCreate(body: unknown, context: AppContext) {
  const currentOrganization = context.currentOrganization!;

  const data = dailyGoalCreateInputSchema.parse(body);

  return await prisma.$withRLS(
    { organization: currentOrganization },
    async (tx) => {
      const newDailyGoal = await tx.dailyGoal.create({
        data: {
          title: data.title,
          goalType: data.goalType,
          targetValue: data.targetValue,
          currentValue: data.currentValue,
          xpReward: data.xpReward,
          goalDate: data.goalDate,
          completedAt: data.completedAt,
          owner: prismaRelationship.connectOneOrThrow(data.owner),
          importHash: data.importHash,
          organization: prismaRelationship.connectOneOrThrow(
            context.currentOrganization!.id,
          ),
          createdByMember: prismaRelationship.connectOne(
            context.currentMember?.id,
          ),
          createdByUserId: context.currentUser?.id,
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
        entityId: newDailyGoal.id,
        entityName: 'DailyGoal',
        operation: auditLogOperations.create,
        context,
        newData: newDailyGoal,
        tx,
      });

      const dailyGoal = await filePopulateDownloadUrlInTree(newDailyGoal);

      return dailyGoal;
    },
  );
}
