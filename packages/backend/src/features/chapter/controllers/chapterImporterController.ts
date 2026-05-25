import { z } from 'zod';
import { AppContext } from '../../../shared/controller/appContext';
import { Error400 } from '../../../shared/errors/Error400';
import { RouteConfig } from '../../../shared/openapi/routeToPath';
import { importerOutputSchema } from '../../../shared/schemas/importerSchemas';
import { authGuardBackend } from '../../auth/authGuardBackend';
import { chapterImportInputSchema } from '../chapterSchemas';
import { chapterCreate } from './chapterCreateController';
import { McpTool } from '../../mcp/mcpTypes';
import { toMcpJsonSchema } from '../../mcp/mcpSchemaConverter';
import { Dictionary } from '../../../translation/locales';
import { prisma } from '../../../prisma';

export const chapterImportApiDoc: RouteConfig = {
  method: 'post',
  path: '/api/chapter/importer',
  body: z.array(chapterImportInputSchema),
  response: importerOutputSchema,
};

export const chapterImporterMcpTool = (dictionary: Dictionary): McpTool => ({
  name: 'chapter_import',
  description: dictionary.chapter.importer?.title || 'Import chapters',
  requiredPermissions: { chapter: ['import'] },
  schema: toMcpJsonSchema(z.array(chapterImportInputSchema)),
  handler: async (params, context) => {
    return await chapterImporterController(params, context);
  },
});

export async function chapterImporterController(
  body: unknown,
  context: AppContext,
) {
  const { currentOrganization } = await authGuardBackend(
    {
      chapter: ['import'],
    },
    context,
  );

  const bodyAsArray = Array.isArray(body) ? body : [body];
  const output: z.output<typeof importerOutputSchema> = [];

  for (const row of bodyAsArray) {
    try {
      const data = chapterImportInputSchema.parse(row);

      const isImportHashExistent = await prisma.$withRLS(
        { organization: currentOrganization },
        async (tx) => {
          return Boolean(
            await tx.chapter.count({
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

      await chapterCreate(row, context);

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
