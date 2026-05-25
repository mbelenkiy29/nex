import { z } from 'zod';
import { AppContext } from '../../../shared/controller/appContext';
import { Error400 } from '../../../shared/errors/Error400';
import { RouteConfig } from '../../../shared/openapi/routeToPath';
import { importerOutputSchema } from '../../../shared/schemas/importerSchemas';
import { authGuardBackend } from '../../auth/authGuardBackend';
import { dailyGoalImportInputSchema } from '../dailyGoalSchemas';
import { dailyGoalCreate } from './dailyGoalCreateController';
import { McpTool } from '../../mcp/mcpTypes';
import { toMcpJsonSchema } from '../../mcp/mcpSchemaConverter';
import { Dictionary } from '../../../translation/locales';
import { prisma } from '../../../prisma';

export const dailyGoalImportApiDoc: RouteConfig = {
  method: 'post',
  path: '/api/daily-goal/importer',
  body: z.array(dailyGoalImportInputSchema),
  response: importerOutputSchema,
};

export const dailyGoalImporterMcpTool = (dictionary: Dictionary): McpTool => ({
  name: 'dailyGoal_import',
  description: dictionary.dailyGoal.importer?.title || 'Import dailyGoals',
  requiredPermissions: { dailyGoal: ['import'] },
  schema: toMcpJsonSchema(z.array(dailyGoalImportInputSchema)),
  handler: async (params, context) => {
    return await dailyGoalImporterController(params, context);
  },
});

export async function dailyGoalImporterController(
  body: unknown,
  context: AppContext,
) {
  const { currentOrganization } = await authGuardBackend(
    {
      dailyGoal: ['import'],
    },
    context,
  );

  const bodyAsArray = Array.isArray(body) ? body : [body];
  const output: z.output<typeof importerOutputSchema> = [];

  for (const row of bodyAsArray) {
    try {
      const data = dailyGoalImportInputSchema.parse(row);

      const isImportHashExistent = await prisma.$withRLS(
        { organization: currentOrganization },
        async (tx) => {
          return Boolean(
            await tx.dailyGoal.count({
              where: {
                importHash: data.importHash,
                organizationId: currentOrganization.id,
              },
            }),
          );
        },
      );

      if (isImportHashExistent) {
        throw new Error400(
          context.dictionary.shared.importer.importHashAlreadyExists,
        );
      }

      await dailyGoalCreate(row, context);

      output.push({
        _status: 'success',
        _line: (row as any)._line,
      });
    } catch (error: any) {
      output.push({
        _status: 'error',
        _line: (row as any)._line,
        _errorMessages: [error.message],
      });
    }
  }

  return output;
}
