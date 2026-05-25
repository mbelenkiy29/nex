import { z } from 'zod';
import { AppContext } from '../../../shared/controller/appContext';
import { Error400 } from '../../../shared/errors/Error400';
import { RouteConfig } from '../../../shared/openapi/routeToPath';
import { importerOutputSchema } from '../../../shared/schemas/importerSchemas';
import { authGuardBackend } from '../../auth/authGuardBackend';
import { lessonImportInputSchema } from '../lessonSchemas';
import { lessonCreate } from './lessonCreateController';
import { McpTool } from '../../mcp/mcpTypes';
import { toMcpJsonSchema } from '../../mcp/mcpSchemaConverter';
import { Dictionary } from '../../../translation/locales';
import { prisma } from '../../../prisma';

export const lessonImportApiDoc: RouteConfig = {
  method: 'post',
  path: '/api/lesson/importer',
  body: z.array(lessonImportInputSchema),
  response: importerOutputSchema,
};

export const lessonImporterMcpTool = (dictionary: Dictionary): McpTool => ({
  name: 'lesson_import',
  description: dictionary.lesson.importer?.title || 'Import lessons',
  requiredPermissions: { lesson: ['import'] },
  schema: toMcpJsonSchema(z.array(lessonImportInputSchema)),
  handler: async (params, context) => {
    return await lessonImporterController(params, context);
  },
});

export async function lessonImporterController(
  body: unknown,
  context: AppContext,
) {
  const { currentOrganization } = await authGuardBackend(
    {
      lesson: ['import'],
    },
    context,
  );

  const bodyAsArray = Array.isArray(body) ? body : [body];
  const output: z.output<typeof importerOutputSchema> = [];

  for (const row of bodyAsArray) {
    try {
      const data = lessonImportInputSchema.parse(row);

      const isImportHashExistent = await prisma.$withRLS(
        { organization: currentOrganization },
        async (tx) => {
          return Boolean(
            await tx.lesson.count({
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

      await lessonCreate(row, context);

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
