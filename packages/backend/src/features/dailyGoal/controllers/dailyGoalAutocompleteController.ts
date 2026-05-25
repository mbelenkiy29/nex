import { Prisma } from '../../../prisma/generated/client';
import { z } from 'zod';
import { AppContext } from '../../../shared/controller/appContext';
import { RouteConfig } from '../../../shared/openapi/routeToPath';
import { authGuardBackend } from '../../auth/authGuardBackend';
import {
  dailyGoalAutocompleteInputSchema,
  dailyGoalAutocompleteOutputSchema,
} from '../dailyGoalSchemas';
import { McpTool } from '../../mcp/mcpTypes';
import { toMcpJsonSchema } from '../../mcp/mcpSchemaConverter';
import { Dictionary } from '../../../translation/locales';
import { prisma } from '../../../prisma';

export const dailyGoalAutocompleteApiDoc: RouteConfig = {
  method: 'get',
  path: '/api/daily-goal/autocomplete',
  query: dailyGoalAutocompleteInputSchema,
  response: z.array(dailyGoalAutocompleteOutputSchema),
};

export const dailyGoalAutocompleteMcpTool = (
  dictionary: Dictionary,
): McpTool => ({
  name: 'dailyGoal_autocomplete',
  description: dictionary.dailyGoal.mcpDescription.autocomplete,
  requiredPermissions: { dailyGoal: ['autocomplete'] },
  schema: toMcpJsonSchema(dailyGoalAutocompleteInputSchema),
  handler: async (params, context) => {
    return await dailyGoalAutocompleteController(params, context);
  },
});

export async function dailyGoalAutocompleteController(
  query: unknown,
  context: AppContext,
) {
  const { currentOrganization } = await authGuardBackend(
    {
      dailyGoal: ['autocomplete'],
    },
    context,
  );

  const { search, exclude, take, orderBy } =
    dailyGoalAutocompleteInputSchema.parse(query);

  return await prisma.$withRLS(
    { organization: currentOrganization },
    async (tx) => {
      const whereAnd: Array<Prisma.DailyGoalWhereInput> = [];

      whereAnd.push({
        organizationId: currentOrganization.id,
      });

      whereAnd.push({ archivedAt: null });

      if (exclude) {
        whereAnd.push({
          id: {
            notIn: exclude,
          },
        });
      }

      if (search) {
        whereAnd.push({
          title: {
            contains: search,
            mode: 'insensitive',
          },
        });
      }

      const dailyGoals = await tx.dailyGoal.findMany({
        where: {
          AND: whereAnd,
        },
        take,
        orderBy,
      });

      return dailyGoals.map((dailyGoal) => ({
        id: dailyGoal.id,
        title: String(dailyGoal.title),
      }));
    },
  );
}
