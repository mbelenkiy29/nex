import { AppContext } from '../../../shared/controller/appContext';
import { RouteConfig } from '../../../shared/openapi/routeToPath';
import { filePopulateDownloadUrlInTree } from '../../file/fileService';
import { authGuardBackend } from '../../auth/authGuardBackend';
import { conceptFindSchema } from '../conceptSchemas';
import { McpTool } from '../../mcp/mcpTypes';
import { toMcpJsonSchema } from '../../mcp/mcpSchemaConverter';
import { Dictionary } from '../../../translation/locales';
import { prisma } from '../../../prisma';

export const conceptFindApiDoc: RouteConfig = {
  method: 'get',
  path: '/api/concept/{id}',
  params: conceptFindSchema,
  response: 'Concept',
};

export const conceptFindMcpTool = (dictionary: Dictionary): McpTool => ({
  name: 'concept_get',
  description: dictionary.concept.mcpDescription.get,
  requiredPermissions: { concept: ['read'] },
  schema: toMcpJsonSchema(conceptFindSchema),
  handler: async (params, context) => {
    return await conceptFindController(params, context);
  },
});

export async function conceptFindController(
  params: unknown,
  context: AppContext,
) {
  const { currentOrganization } = await authGuardBackend(
    {
      concept: ['read'],
    },
    context,
  );

  const { id } = conceptFindSchema.parse(params);

  return await prisma.$withRLS(
    { organization: currentOrganization },
    async (tx) => {
      let concept = await tx.concept.findUnique({
        where: {
          id_organizationId: {
            id,
            organizationId: currentOrganization.id,
          },
        },
        include: {
          course: {
            select: {
              id: true,
              title: true,
              slug: true,
            },
          },
          exam: {
            select: {
              id: true,
              name: true,
            },
          },
          practiceQuestions: {
            select: {
              id: true,
              questionText: true,
            },
          },
          createdByMember: {
            include: {
              user: {
                select: {
                  id: true,
                  email: true,
                },
              },
            },
          },
          updatedByMember: {
            include: {
              user: {
                select: {
                  id: true,
                  email: true,
                },
              },
            },
          },
          archivedByMember: {
            include: {
              user: {
                select: {
                  id: true,
                  email: true,
                },
              },
            },
          },
        },
      });

      concept = await filePopulateDownloadUrlInTree(concept);

      return concept;
    },
  );
}
