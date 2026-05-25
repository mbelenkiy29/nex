import { Prisma } from '../../../prisma/generated/client';
import { AppContext } from '../../../shared/controller/appContext';
import { RouteConfig } from '../../../shared/openapi/routeToPath';
import { authGuardBackend } from '../../auth/authGuardBackend';
import { filePopulateDownloadUrlInTree } from '../../file/fileService';
import { chapterFindManyInputSchema } from '../chapterSchemas';
import { McpTool } from '../../mcp/mcpTypes';
import { Dictionary } from '../../../translation/locales';
import { toMcpJsonSchema } from '../../mcp/mcpSchemaConverter';
import { prisma } from '../../../prisma';

export const chapterFindManyApiDoc: RouteConfig = {
  method: 'get',
  path: '/api/chapter',
  query: chapterFindManyInputSchema,
  response: '{ chapters: Chapter[], count: number }',
};

export const chapterFindManyMcpTool = (dictionary: Dictionary): McpTool => ({
  name: 'chapter_list',
  description: dictionary.chapter.mcpDescription.list,
  requiredPermissions: { chapter: ['read'] },
  schema: toMcpJsonSchema(chapterFindManyInputSchema),
  handler: async (params, context) => {
    return await chapterFindManyController(params, context);
  },
});

export async function chapterFindManyController(
  query: unknown,
  context: AppContext,
) {
  const { currentOrganization } = await authGuardBackend(
    {
      chapter: ['read'],
    },
    context,
  );

  const { filter, orderBy, skip, take } =
    chapterFindManyInputSchema.parse(query);

  return await prisma.$withRLS(
    { organization: currentOrganization },
    async (tx) => {
      const whereAnd: Array<Prisma.ChapterWhereInput> = [];

      whereAnd.push({
        organizationId: currentOrganization.id,
      });

      if (filter?.archived !== 'true') {
        whereAnd.push({ archivedAt: null });
      }
      if (filter?.title != null) {
        whereAnd.push({
          title: { contains: filter?.title, mode: 'insensitive' },
        });
      }
      if (filter?.chapterNumberRange?.length) {
        const start = filter.chapterNumberRange?.[0];
        const end = filter.chapterNumberRange?.[1];

        if (start != null) {
          whereAnd.push({
            chapterNumber: { gte: start },
          });
        }

        if (end != null) {
          whereAnd.push({
            chapterNumber: { lte: end },
          });
        }
      }
      if (filter?.xpRewardRange?.length) {
        const start = filter.xpRewardRange?.[0];
        const end = filter.xpRewardRange?.[1];

        if (start != null) {
          whereAnd.push({
            xpReward: { gte: start },
          });
        }

        if (end != null) {
          whereAnd.push({
            xpReward: { lte: end },
          });
        }
      }
      if (filter?.orderIndexRange?.length) {
        const start = filter.orderIndexRange?.[0];
        const end = filter.orderIndexRange?.[1];

        if (start != null) {
          whereAnd.push({
            orderIndex: { gte: start },
          });
        }

        if (end != null) {
          whereAnd.push({
            orderIndex: { lte: end },
          });
        }
      }
      if (filter?.workflowStatus != null) {
        whereAnd.push({
          workflowStatus: filter?.workflowStatus,
        });
      }
      if (filter?.isPublished != null) {
        whereAnd.push({
          isPublished: filter.isPublished === 'true',
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

      let chapters = await tx.chapter.findMany({
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

      const count = await tx.chapter.count({
        where: {
          AND: whereAnd,
        },
      });

      chapters = await filePopulateDownloadUrlInTree(chapters);

      return { chapters, count };
    },
  );
}
