import { Prisma } from '../../../prisma/generated/client';
import { AppContext } from '../../../shared/controller/appContext';
import { RouteConfig } from '../../../shared/openapi/routeToPath';
import { authGuardBackend } from '../../auth/authGuardBackend';
import { filePopulateDownloadUrlInTree } from '../../file/fileService';
import { practiceQuestionFindManyInputSchema } from '../practiceQuestionSchemas';
import { McpTool } from '../../mcp/mcpTypes';
import { Dictionary } from '../../../translation/locales';
import { toMcpJsonSchema } from '../../mcp/mcpSchemaConverter';
import { prisma } from '../../../prisma';

export const practiceQuestionFindManyApiDoc: RouteConfig = {
  method: 'get',
  path: '/api/practice-question',
  query: practiceQuestionFindManyInputSchema,
  response: '{ practiceQuestions: PracticeQuestion[], count: number }',
};

export const practiceQuestionFindManyMcpTool = (
  dictionary: Dictionary,
): McpTool => ({
  name: 'practiceQuestion_list',
  description: dictionary.practiceQuestion.mcpDescription.list,
  requiredPermissions: { practiceQuestion: ['read'] },
  schema: toMcpJsonSchema(practiceQuestionFindManyInputSchema),
  handler: async (params, context) => {
    return await practiceQuestionFindManyController(params, context);
  },
});

export async function practiceQuestionFindManyController(
  query: unknown,
  context: AppContext,
) {
  const { currentOrganization } = await authGuardBackend(
    {
      practiceQuestion: ['read'],
    },
    context,
  );

  const { filter, orderBy, skip, take } =
    practiceQuestionFindManyInputSchema.parse(query);

  return await prisma.$withRLS(
    { organization: currentOrganization },
    async (tx) => {
      const whereAnd: Array<Prisma.PracticeQuestionWhereInput> = [];

      whereAnd.push({
        organizationId: currentOrganization.id,
      });

      if (filter?.archived !== 'true') {
        whereAnd.push({ archivedAt: null });
      }
      if (filter?.questionText != null) {
        whereAnd.push({
          questionText: { contains: filter?.questionText, mode: 'insensitive' },
        });
      }
      if (filter?.difficulty != null) {
        whereAnd.push({
          difficulty: filter?.difficulty,
        });
      }
      if (filter?.category != null) {
        whereAnd.push({
          category: { contains: filter?.category, mode: 'insensitive' },
        });
      }
      if (filter?.isActive != null) {
        whereAnd.push({
          isActive: filter.isActive === 'true',
        });
      }
      if (filter?.tags?.length) {
        whereAnd.push({
          tags: {
            hasSome: filter.tags,
          },
        });
      }
      if (filter?.course != null) {
        whereAnd.push({
          course: {
            id: filter.course,
          },
        });
      }
      if (filter?.chapter != null) {
        whereAnd.push({
          chapter: {
            id: filter.chapter,
          },
        });
      }
      if (filter?.concepts?.length) {
        whereAnd.push({
          concepts: {
            some: {
              id: {
                in: filter.concepts.filter(Boolean),
              },
            },
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

      let practiceQuestions = await tx.practiceQuestion.findMany({
        where: {
          AND: whereAnd,
        },
        skip,
        take,
        orderBy,
        include: {
          course: true,
          chapter: true,
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

      const count = await tx.practiceQuestion.count({
        where: {
          AND: whereAnd,
        },
      });

      practiceQuestions =
        await filePopulateDownloadUrlInTree(practiceQuestions);

      return { practiceQuestions, count };
    },
  );
}
