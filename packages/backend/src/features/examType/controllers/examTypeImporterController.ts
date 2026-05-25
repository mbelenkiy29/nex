import { z } from 'zod';
import { AppContext } from '../../../shared/controller/appContext';
import { Error400 } from '../../../shared/errors/Error400';
import { RouteConfig } from '../../../shared/openapi/routeToPath';
import { importerOutputSchema } from '../../../shared/schemas/importerSchemas';
import { authGuardBackend } from '../../auth/authGuardBackend';
import { examTypeImportInputSchema } from '../examTypeSchemas';
import { examTypeCreate } from './examTypeCreateController';
import { McpTool } from '../../mcp/mcpTypes';
import { toMcpJsonSchema } from '../../mcp/mcpSchemaConverter';
import { Dictionary } from '../../../translation/locales';
import { prisma } from '../../../prisma';

export const examTypeImportApiDoc: RouteConfig = {
  method: 'post',
  path: '/api/exam-type/importer',
  body: z.array(examTypeImportInputSchema),
  response: importerOutputSchema,
};

export const examTypeImporterMcpTool = (dictionary: Dictionary): McpTool => ({
  name: 'examType_import',
  description: dictionary.examType.importer?.title || 'Import examTypes',
  requiredPermissions: { examType: ['import'] },
  schema: toMcpJsonSchema(z.array(examTypeImportInputSchema)),
  handler: async (params, context) => {
    return await examTypeImporterController(params, context);
  },
});

export async function examTypeImporterController(
  body: unknown,
  context: AppContext,
) {
  const { currentOrganization } = await authGuardBackend(
    {
      examType: ['import'],
    },
    context,
  );

  const bodyAsArray = Array.isArray(body) ? body : [body];
  const output: z.output<typeof importerOutputSchema> = [];

  for (const row of bodyAsArray) {
    try {
      const data = examTypeImportInputSchema.parse(row);

      const isImportHashExistent = await prisma.$withRLS(
        { organization: currentOrganization },
        async (tx) => {
          return Boolean(
            await tx.examType.count({
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

      await examTypeCreate(row, context);

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
