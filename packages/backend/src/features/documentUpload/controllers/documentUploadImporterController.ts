import { z } from 'zod';
import { AppContext } from '../../../shared/controller/appContext';
import { Error400 } from '../../../shared/errors/Error400';
import { RouteConfig } from '../../../shared/openapi/routeToPath';
import { importerOutputSchema } from '../../../shared/schemas/importerSchemas';
import { authGuardBackend } from '../../auth/authGuardBackend';
import { documentUploadImportInputSchema } from '../documentUploadSchemas';
import { documentUploadCreate } from './documentUploadCreateController';
import { McpTool } from '../../mcp/mcpTypes';
import { toMcpJsonSchema } from '../../mcp/mcpSchemaConverter';
import { Dictionary } from '../../../translation/locales';
import { prisma } from '../../../prisma';

export const documentUploadImportApiDoc: RouteConfig = {
  method: 'post',
  path: '/api/document-upload/importer',
  body: z.array(documentUploadImportInputSchema),
  response: importerOutputSchema,
};

export const documentUploadImporterMcpTool = (
  dictionary: Dictionary,
): McpTool => ({
  name: 'documentUpload_import',
  description:
    dictionary.documentUpload.importer?.title || 'Import documentUploads',
  requiredPermissions: { documentUpload: ['import'] },
  schema: toMcpJsonSchema(z.array(documentUploadImportInputSchema)),
  handler: async (params, context) => {
    return await documentUploadImporterController(params, context);
  },
});

export async function documentUploadImporterController(
  body: unknown,
  context: AppContext,
) {
  const { currentOrganization } = await authGuardBackend(
    {
      documentUpload: ['import'],
    },
    context,
  );

  const bodyAsArray = Array.isArray(body) ? body : [body];
  const output: z.output<typeof importerOutputSchema> = [];

  for (const row of bodyAsArray) {
    try {
      const data = documentUploadImportInputSchema.parse(row);

      const isImportHashExistent = await prisma.$withRLS(
        { organization: currentOrganization },
        async (tx) => {
          return Boolean(
            await tx.documentUpload.count({
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

      await documentUploadCreate(row, context);

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
