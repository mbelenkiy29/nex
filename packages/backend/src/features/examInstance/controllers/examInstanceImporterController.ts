import { z } from 'zod';
import { AppContext } from '../../../shared/controller/appContext';
import { Error400 } from '../../../shared/errors/Error400';
import { RouteConfig } from '../../../shared/openapi/routeToPath';
import { importerOutputSchema } from '../../../shared/schemas/importerSchemas';
import { authGuardBackend } from '../../auth/authGuardBackend';
import { examInstanceImportInputSchema } from '../examInstanceSchemas';
import { examInstanceCreate } from './examInstanceCreateController';
import { McpTool } from '../../mcp/mcpTypes';
import { toMcpJsonSchema } from '../../mcp/mcpSchemaConverter';
import { Dictionary } from '../../../translation/locales';
import { prisma } from '../../../prisma';

export const examInstanceImportApiDoc: RouteConfig = {
  method: 'post',
  path: '/api/exam-instance/importer',
  body: z.array(examInstanceImportInputSchema),
  response: importerOutputSchema,
};

export const examInstanceImporterMcpTool = (
  dictionary: Dictionary,
): McpTool => ({
  name: 'examInstance_import',
  description:
    dictionary.examInstance.importer?.title || 'Import examInstances',
  requiredPermissions: { examInstance: ['import'] },
  schema: toMcpJsonSchema(z.array(examInstanceImportInputSchema)),
  handler: async (params, context) => {
    return await examInstanceImporterController(params, context);
  },
});

export async function examInstanceImporterController(
  body: unknown,
  context: AppContext,
) {
  const { currentOrganization } = await authGuardBackend(
    {
      examInstance: ['import'],
    },
    context,
  );

  const bodyAsArray = Array.isArray(body) ? body : [body];
  const output: z.output<typeof importerOutputSchema> = [];

  for (const row of bodyAsArray) {
    try {
      const data = examInstanceImportInputSchema.parse(row);

      const isImportHashExistent = await prisma.$withRLS(
        { organization: currentOrganization },
        async (tx) => {
          return Boolean(
            await tx.examInstance.count({
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

      await examInstanceCreate(row, context);

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
