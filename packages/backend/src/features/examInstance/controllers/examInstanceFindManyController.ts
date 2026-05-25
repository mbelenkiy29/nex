import { Prisma } from '../../../prisma/generated/client';
import { AppContext } from '../../../shared/controller/appContext';
import { RouteConfig } from '../../../shared/openapi/routeToPath';
import { authGuardBackend } from '../../auth/authGuardBackend';
import { filePopulateDownloadUrlInTree } from '../../file/fileService';
import { examInstanceFindManyInputSchema } from '../examInstanceSchemas';
import { McpTool } from '../../mcp/mcpTypes';
import { Dictionary } from '../../../translation/locales';
import { toMcpJsonSchema } from '../../mcp/mcpSchemaConverter';
import { prisma } from '../../../prisma';

export const examInstanceFindManyApiDoc: RouteConfig = {
  method: 'get',
  path: '/api/exam-instance',
  query: examInstanceFindManyInputSchema,
  response: '{ examInstances: ExamInstance[], count: number }',
};

export const examInstanceFindManyMcpTool = (
  dictionary: Dictionary,
): McpTool => ({
  name: 'examInstance_list',
  description: dictionary.examInstance.mcpDescription.list,
  requiredPermissions: { examInstance: ['read'] },
  schema: toMcpJsonSchema(examInstanceFindManyInputSchema),
  handler: async (params, context) => {
    return await examInstanceFindManyController(params, context);
  },
});

export async function examInstanceFindManyController(
  query: unknown,
  context: AppContext,
) {
  const { currentOrganization } = await authGuardBackend(
    {
      examInstance: ['read'],
    },
    context,
  );

  const { filter, orderBy, skip, take } =
    examInstanceFindManyInputSchema.parse(query);

  return await prisma.$withRLS(
    { organization: currentOrganization },
    async (tx) => {
      const whereAnd: Array<Prisma.ExamInstanceWhereInput> = [];

      whereAnd.push({
        organizationId: currentOrganization.id,
      });

      if (filter?.archived !== 'true') {
        whereAnd.push({ archivedAt: null });
      }
      if (filter?.status != null) {
        whereAnd.push({
          status: filter?.status,
        });
      }
      if (filter?.scoreRange?.length) {
        const start = filter.scoreRange?.[0];
        const end = filter.scoreRange?.[1];

        if (start != null) {
          whereAnd.push({
            score: { gte: start },
          });
        }

        if (end != null) {
          whereAnd.push({
            score: { lte: end },
          });
        }
      }
      if (filter?.passed != null) {
        whereAnd.push({
          passed: filter.passed === 'true',
        });
      }
      if (filter?.startedAtRange?.length) {
        const start = filter.startedAtRange?.[0];
        const end = filter.startedAtRange?.[1];

        if (start != null) {
          whereAnd.push({
            startedAt: {
              gte: start,
            },
          });
        }

        if (end != null) {
          whereAnd.push({
            startedAt: {
              lte: end,
            },
          });
        }
      }
      if (filter?.completedAtRange?.length) {
        const start = filter.completedAtRange?.[0];
        const end = filter.completedAtRange?.[1];

        if (start != null) {
          whereAnd.push({
            completedAt: {
              gte: start,
            },
          });
        }

        if (end != null) {
          whereAnd.push({
            completedAt: {
              lte: end,
            },
          });
        }
      }
      if (filter?.timeSpentSecondsRange?.length) {
        const start = filter.timeSpentSecondsRange?.[0];
        const end = filter.timeSpentSecondsRange?.[1];

        if (start != null) {
          whereAnd.push({
            timeSpentSeconds: { gte: start },
          });
        }

        if (end != null) {
          whereAnd.push({
            timeSpentSeconds: { lte: end },
          });
        }
      }
      if (filter?.course != null) {
        whereAnd.push({
          course: {
            id: filter.course,
          },
        });
      }
      if (filter?.examType != null) {
        whereAnd.push({
          examType: {
            id: filter.examType,
          },
        });
      }
      if (filter?.student != null) {
        whereAnd.push({
          student: {
            id: filter.student,
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

      let examInstances = await tx.examInstance.findMany({
        where: {
          AND: whereAnd,
        },
        skip,
        take,
        orderBy,
        include: {
          course: true,
          examType: true,
          student: {
            include: {
              user: {
                select: {
                  id: true,
                  email: true,
                },
              },
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
        },
      });

      const count = await tx.examInstance.count({
        where: {
          AND: whereAnd,
        },
      });

      examInstances = await filePopulateDownloadUrlInTree(examInstances);

      return { examInstances, count };
    },
  );
}
