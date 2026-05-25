import { Prisma } from '../../../prisma/generated/client';
import { AppContext } from '../../../shared/controller/appContext';
import { RouteConfig } from '../../../shared/openapi/routeToPath';
import { authGuardBackend } from '../../auth/authGuardBackend';
import { filePopulateDownloadUrlInTree } from '../../file/fileService';
import { conceptFindManyInputSchema } from '../conceptSchemas';
import { McpTool } from '../../mcp/mcpTypes';
import { Dictionary } from '../../../translation/locales';
import { toMcpJsonSchema } from '../../mcp/mcpSchemaConverter';
import { prisma } from '../../../prisma';

export const conceptFindManyApiDoc: RouteConfig = {
  method: 'get',
  path: '/api/concept',
  query: conceptFindManyInputSchema,
  response: '{ concepts: Concept[], count: number }',
};

export const conceptFindManyMcpTool = (dictionary: Dictionary): McpTool => ({
  name: 'concept_list',
  description: dictionary.concept.mcpDescription.list,
  requiredPermissions: { concept: ['read'] },
  schema: toMcpJsonSchema(conceptFindManyInputSchema),
  handler: async (params, context) => {
    return await conceptFindManyController(params, context);
  },
});

export async function conceptFindManyController(
  query: unknown,
  context: AppContext,
) {
  const { currentOrganization } = await authGuardBackend(
    {
      concept: ['read'],
    },
    context,
  );

  const { filter, orderBy, skip, take } =
    conceptFindManyInputSchema.parse(query);

  return await prisma.$withRLS(
    { organization: currentOrganization },
    async (tx) => {
      const whereAnd: Array<Prisma.ConceptWhereInput> = [];

      whereAnd.push({
        organizationId: currentOrganization.id,
      });

      if (filter?.archived !== 'true') {
        whereAnd.push({ archivedAt: null });
      }
      if (filter?.conceptName != null) {
        whereAnd.push({
          conceptName: { contains: filter?.conceptName, mode: 'insensitive' },
        });
      }
      if (filter?.conceptCode != null) {
        whereAnd.push({
          conceptCode: { contains: filter?.conceptCode, mode: 'insensitive' },
        });
      }
      if (filter?.examDomain != null) {
        whereAnd.push({
          examDomain: { contains: filter?.examDomain, mode: 'insensitive' },
        });
      }
      if (filter?.difficulty != null) {
        whereAnd.push({
          difficulty: filter?.difficulty,
        });
      }
      if (filter?.examWeight != null) {
        whereAnd.push({
          examWeight: filter?.examWeight,
        });
      }
      if (filter?.isActive != null) {
        whereAnd.push({
          isActive: filter.isActive === 'true',
        });
      }
      if (filter?.course != null) {
        whereAnd.push({
          course: {
            id: filter.course,
          },
        });
      }
      if (filter?.exam != null) {
        whereAnd.push({
          exam: {
            id: filter.exam,
          },
        });
      }
      if (filter?.createdByMember != null) {
        whereAnd.push({
          createdByMember: {
            id: filter.createdByMember,
          },
        });
      }

      if (filter?.updatedByMember != null) {
        whereAnd.push({
          updatedByMember: {
            id: filter.updatedByMember,
          },
        });
      }

      if (filter?.createdAtRange?.length) {
        const start = filter.createdAtRange?.[0];
        const end = filter.createdAtRange?.[1];

        if (start != null) {
          whereAnd.push({
            createdAt: {
              gte: start,
            },
          });
        }

        if (end != null) {
          whereAnd.push({
            createdAt: {
              lte: end,
            },
          });
        }
      }

      if (filter?.updatedAtRange?.length) {
        const start = filter.updatedAtRange?.[0];
        const end = filter.updatedAtRange?.[1];

        if (start != null) {
          whereAnd.push({
            updatedAt: {
              gte: start,
            },
          });
        }

        if (end != null) {
          whereAnd.push({
            updatedAt: {
              lte: end,
            },
          });
        }
      }

      let concepts = await tx.concept.findMany({
        where: {
          AND: whereAnd,
        },
        skip,
        take,
        orderBy,
        include: {
          course: true,
          exam: true,
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
        },
      });

      const count = await tx.concept.count({
        where: {
          AND: whereAnd,
        },
      });

      concepts = await filePopulateDownloadUrlInTree(concepts);

      return { concepts, count };
    },
  );
}
