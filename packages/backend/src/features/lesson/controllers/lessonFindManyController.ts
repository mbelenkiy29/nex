import { Prisma } from '../../../prisma/generated/client';
import { AppContext } from '../../../shared/controller/appContext';
import { RouteConfig } from '../../../shared/openapi/routeToPath';
import { authGuardBackend } from '../../auth/authGuardBackend';
import { filePopulateDownloadUrlInTree } from '../../file/fileService';
import { lessonFindManyInputSchema } from '../lessonSchemas';
import { McpTool } from '../../mcp/mcpTypes';
import { Dictionary } from '../../../translation/locales';
import { toMcpJsonSchema } from '../../mcp/mcpSchemaConverter';
import { prisma } from '../../../prisma';

export const lessonFindManyApiDoc: RouteConfig = {
  method: 'get',
  path: '/api/lesson',
  query: lessonFindManyInputSchema,
  response: '{ lessons: Lesson[], count: number }',
};

export const lessonFindManyMcpTool = (dictionary: Dictionary): McpTool => ({
  name: 'lesson_list',
  description: dictionary.lesson.mcpDescription.list,
  requiredPermissions: { lesson: ['read'] },
  schema: toMcpJsonSchema(lessonFindManyInputSchema),
  handler: async (params, context) => {
    return await lessonFindManyController(params, context);
  },
});

export async function lessonFindManyController(
  query: unknown,
  context: AppContext,
) {
  const { currentOrganization } = await authGuardBackend(
    {
      lesson: ['read'],
    },
    context,
  );

  const { filter, orderBy, skip, take } =
    lessonFindManyInputSchema.parse(query);

  return await prisma.$withRLS(
    { organization: currentOrganization },
    async (tx) => {
      const whereAnd: Array<Prisma.LessonWhereInput> = [];

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
      if (filter?.lessonNumberRange?.length) {
        const start = filter.lessonNumberRange?.[0];
        const end = filter.lessonNumberRange?.[1];

        if (start != null) {
          whereAnd.push({
            lessonNumber: { gte: start },
          });
        }

        if (end != null) {
          whereAnd.push({
            lessonNumber: { lte: end },
          });
        }
      }
      if (filter?.estimatedMinutesRange?.length) {
        const start = filter.estimatedMinutesRange?.[0];
        const end = filter.estimatedMinutesRange?.[1];

        if (start != null) {
          whereAnd.push({
            estimatedMinutes: { gte: start },
          });
        }

        if (end != null) {
          whereAnd.push({
            estimatedMinutes: { lte: end },
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
      if (filter?.chapter != null) {
        whereAnd.push({
          chapter: {
            id: filter.chapter,
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

      let lessons = await tx.lesson.findMany({
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

      const count = await tx.lesson.count({
        where: {
          AND: whereAnd,
        },
      });

      lessons = await filePopulateDownloadUrlInTree(lessons);

      return { lessons, count };
    },
  );
}
