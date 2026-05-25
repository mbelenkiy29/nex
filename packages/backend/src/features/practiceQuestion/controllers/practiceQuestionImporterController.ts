import { z } from 'zod';
import { AppContext } from '../../../shared/controller/appContext';
import { Error400 } from '../../../shared/errors/Error400';
import { RouteConfig } from '../../../shared/openapi/routeToPath';
import { importerOutputSchema } from '../../../shared/schemas/importerSchemas';
import { authGuardBackend } from '../../auth/authGuardBackend';
import { practiceQuestionImportInputSchema } from '../practiceQuestionSchemas';
import { practiceQuestionCreate } from './practiceQuestionCreateController';
import { McpTool } from '../../mcp/mcpTypes';
import { toMcpJsonSchema } from '../../mcp/mcpSchemaConverter';
import { Dictionary } from '../../../translation/locales';
import { prisma } from '../../../prisma';

export const practiceQuestionImportApiDoc: RouteConfig = {
  method: 'post',
  path: '/api/practice-question/importer',
  body: z.array(practiceQuestionImportInputSchema),
  response: importerOutputSchema,
};

export const practiceQuestionImporterMcpTool = (
  dictionary: Dictionary,
): McpTool => ({
  name: 'practiceQuestion_import',
  description:
    dictionary.practiceQuestion.importer?.title || 'Import practiceQuestions',
  requiredPermissions: { practiceQuestion: ['import'] },
  schema: toMcpJsonSchema(z.array(practiceQuestionImportInputSchema)),
  handler: async (params, context) => {
    return await practiceQuestionImporterController(params, context);
  },
});

export async function practiceQuestionImporterController(
  body: unknown,
  context: AppContext,
) {
  const { currentOrganization } = await authGuardBackend(
    {
      practiceQuestion: ['import'],
    },
    context,
  );

  const bodyAsArray = Array.isArray(body) ? body : [body];
  const output: z.output<typeof importerOutputSchema> = [];

  for (const row of bodyAsArray) {
    try {
      const data = practiceQuestionImportInputSchema.parse(row);

      const isImportHashExistent = await prisma.$withRLS(
        { organization: currentOrganization },
        async (tx) => {
          return Boolean(
            await tx.practiceQuestion.count({
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

      await practiceQuestionCreate(row, context);

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
