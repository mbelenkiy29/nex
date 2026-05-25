import { Prisma } from '../../../prisma/generated/client';
import { z } from 'zod';
import { AppContext } from '../../../shared/controller/appContext';
import { RouteConfig } from '../../../shared/openapi/routeToPath';
import { authGuardBackend } from '../../auth/authGuardBackend';
import {
  documentUploadAutocompleteInputSchema,
  documentUploadAutocompleteOutputSchema,
} from '../documentUploadSchemas';
import { McpTool } from '../../mcp/mcpTypes';
import { toMcpJsonSchema } from '../../mcp/mcpSchemaConverter';
import { Dictionary } from '../../../translation/locales';
import { prisma } from '../../../prisma';

export const documentUploadAutocompleteApiDoc: RouteConfig = {
  method: 'get',
  path: '/api/document-upload/autocomplete',
  query: documentUploadAutocompleteInputSchema,
  response: z.array(documentUploadAutocompleteOutputSchema),
};

export const documentUploadAutocompleteMcpTool = (
  dictionary: Dictionary,
): McpTool => ({
  name: 'documentUpload_autocomplete',
  description: dictionary.documentUpload.mcpDescription.autocomplete,
  requiredPermissions: { documentUpload: ['autocomplete'] },
  schema: toMcpJsonSchema(documentUploadAutocompleteInputSchema),
  handler: async (params, context) => {
    return await documentUploadAutocompleteController(params, context);
  },
});

export async function documentUploadAutocompleteController(
  query: unknown,
  context: AppContext,
) {
  const { currentOrganization } = await authGuardBackend(
    {
      documentUpload: ['autocomplete'],
    },
    context,
  );

  const { search, exclude, take, orderBy, course } =
    documentUploadAutocompleteInputSchema.parse(query);

  return await prisma.$withRLS(
    { organization: currentOrganization },
    async (tx) => {
      const whereAnd: Array<Prisma.DocumentUploadWhereInput> = [];

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

      if (course) {
        whereAnd.push({ courseId: course });
      }

      if (search) {
        whereAnd.push({
          originalFilename: {
            contains: search,
            mode: 'insensitive',
          },
        });
      }

      const documentUploads = await tx.documentUpload.findMany({
        where: {
          AND: whereAnd,
        },
        take,
        orderBy,
      });

      return documentUploads.map((documentUpload) => ({
        id: documentUpload.id,
        originalFilename: String(documentUpload.originalFilename),
      }));
    },
  );
}
