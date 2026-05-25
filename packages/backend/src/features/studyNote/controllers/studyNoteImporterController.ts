import { z } from 'zod';
import { AppContext } from '../../../shared/controller/appContext';
import { Error400 } from '../../../shared/errors/Error400';
import { RouteConfig } from '../../../shared/openapi/routeToPath';
import { importerOutputSchema } from '../../../shared/schemas/importerSchemas';
import { authGuardBackend } from '../../auth/authGuardBackend';
import { studyNoteImportInputSchema } from '../studyNoteSchemas';
import { studyNoteCreate } from './studyNoteCreateController';
import { McpTool } from '../../mcp/mcpTypes';
import { toMcpJsonSchema } from '../../mcp/mcpSchemaConverter';
import { Dictionary } from '../../../translation/locales';
import { prisma } from '../../../prisma';

export const studyNoteImportApiDoc: RouteConfig = {
  method: 'post',
  path: '/api/study-note/importer',
  body: z.array(studyNoteImportInputSchema),
  response: importerOutputSchema,
};

export const studyNoteImporterMcpTool = (dictionary: Dictionary): McpTool => ({
  name: 'studyNote_import',
  description: dictionary.studyNote.importer?.title || 'Import studyNotes',
  requiredPermissions: { studyNote: ['import'] },
  schema: toMcpJsonSchema(z.array(studyNoteImportInputSchema)),
  handler: async (params, context) => {
    return await studyNoteImporterController(params, context);
  },
});

export async function studyNoteImporterController(
  body: unknown,
  context: AppContext,
) {
  const { currentOrganization } = await authGuardBackend(
    {
      studyNote: ['import'],
    },
    context,
  );

  const bodyAsArray = Array.isArray(body) ? body : [body];
  const output: z.output<typeof importerOutputSchema> = [];

  for (const row of bodyAsArray) {
    try {
      const data = studyNoteImportInputSchema.parse(row);

      const isImportHashExistent = await prisma.$withRLS(
        { organization: currentOrganization },
        async (tx) => {
          return Boolean(
            await tx.studyNote.count({
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

      await studyNoteCreate(row, context);

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
