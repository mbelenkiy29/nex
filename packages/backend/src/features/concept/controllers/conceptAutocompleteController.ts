import { Prisma } from '../../../prisma/generated/client';
import { z } from 'zod';
import { AppContext } from '../../../shared/controller/appContext';
import { RouteConfig } from '../../../shared/openapi/routeToPath';
import { authGuardBackend } from '../../auth/authGuardBackend';
import {
  conceptAutocompleteInputSchema,
  conceptAutocompleteOutputSchema,
} from '../conceptSchemas';
import { McpTool } from '../../mcp/mcpTypes';
import { toMcpJsonSchema } from '../../mcp/mcpSchemaConverter';
import { Dictionary } from '../../../translation/locales';
import { prisma } from '../../../prisma';

export const conceptAutocompleteApiDoc: RouteConfig = {
  method: 'get',
  path: '/api/concept/autocomplete',
  query: conceptAutocompleteInputSchema,
  response: z.array(conceptAutocompleteOutputSchema),
};

export const conceptAutocompleteMcpTool = (
  dictionary: Dictionary,
): McpTool => ({
  name: 'concept_autocomplete',
  description: dictionary.concept.mcpDescription.autocomplete,
  requiredPermissions: { concept: ['autocomplete'] },
  schema: toMcpJsonSchema(conceptAutocompleteInputSchema),
  handler: async (params, context) => {
    return await conceptAutocompleteController(params, context);
  },
});

export async function conceptAutocompleteController(
  query: unknown,
  context: AppContext,
) {
  const { currentOrganization } = await authGuardBackend(
    {
      concept: ['autocomplete'],
    },
    context,
  );

  const { search, exclude, take, orderBy, course } =
    conceptAutocompleteInputSchema.parse(query);

  return await prisma.$withRLS(
    { organization: currentOrganization },
    async (tx) => {
      const whereAnd: Array<Prisma.ConceptWhereInput> = [];

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
          conceptName: {
            contains: search,
            mode: 'insensitive',
          },
        });
      }

      const concepts = await tx.concept.findMany({
        where: {
          AND: whereAnd,
        },
        take,
        orderBy,
      });

      return concepts.map((concept) => ({
        id: concept.id,
        conceptName: String(concept.conceptName),
      }));
    },
  );
}
