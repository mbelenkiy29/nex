import { Prisma } from '../../../prisma/generated/client';
import { AppContext } from '../../../shared/controller/appContext';
import { RouteConfig } from '../../../shared/openapi/routeToPath';
import { authGuardBackend } from '../../auth/authGuardBackend';
import { filePopulateDownloadUrlInTree } from '../../file/fileService';
import { examTypeFindManyInputSchema } from '../examTypeSchemas';
import { McpTool } from '../../mcp/mcpTypes';
import { Dictionary } from '../../../translation/locales';
import { toMcpJsonSchema } from '../../mcp/mcpSchemaConverter';
import { prisma } from '../../../prisma';

export const examTypeFindManyApiDoc: RouteConfig = {
  method: 'get',
  path: '/api/exam-type',
  query: examTypeFindManyInputSchema,
  response: '{ examTypes: ExamType[], count: number }',
};

export const examTypeFindManyMcpTool = (dictionary: Dictionary): McpTool => ({
  name: 'examType_list',
  description: dictionary.examType.mcpDescription.list,
  requiredPermissions: { examType: ['read'] },
  schema: toMcpJsonSchema(examTypeFindManyInputSchema),
  handler: async (params, context) => {
    return await examTypeFindManyController(params, context);
  },
});

export async function examTypeFindManyController(
  query: unknown,
  context: AppContext,
) {
  const { currentOrganization } = await authGuardBackend(
    {
      examType: ['read'],
    },
    context,
  );

  const { filter, orderBy, skip, take } =
    examTypeFindManyInputSchema.parse(query);

  return await prisma.$withRLS(
    { organization: currentOrganization },
    async (tx) => {
      const whereAnd: Array<Prisma.ExamTypeWhereInput> = [];

      whereAnd.push({
        organizationId: currentOrganization.id,
      });

      if (filter?.archived !== 'true') {
        whereAnd.push({ archivedAt: null });
      }
      if (filter?.name != null) {
        whereAnd.push({
          name: { contains: filter?.name, mode: 'insensitive' },
        });
      }
      if (filter?.type != null) {
        whereAnd.push({
          type: filter?.type,
        });
      }
      if (filter?.questionCountRange?.length) {
        const start = filter.questionCountRange?.[0];
        const end = filter.questionCountRange?.[1];

        if (start != null) {
          whereAnd.push({
            questionCount: { gte: start },
          });
        }

        if (end != null) {
          whereAnd.push({
            questionCount: { lte: end },
          });
        }
      }
      if (filter?.timeLimitMinutesRange?.length) {
        const start = filter.timeLimitMinutesRange?.[0];
        const end = filter.timeLimitMinutesRange?.[1];

        if (start != null) {
          whereAnd.push({
            timeLimitMinutes: { gte: start },
          });
        }

        if (end != null) {
          whereAnd.push({
            timeLimitMinutes: { lte: end },
          });
        }
      }
      if (filter?.passingScoreRange?.length) {
        const start = filter.passingScoreRange?.[0];
        const end = filter.passingScoreRange?.[1];

        if (start != null) {
          whereAnd.push({
            passingScore: { gte: start },
          });
        }

        if (end != null) {
          whereAnd.push({
            passingScore: { lte: end },
          });
        }
      }
      if (filter?.maxAttemptsRange?.length) {
        const start = filter.maxAttemptsRange?.[0];
        const end = filter.maxAttemptsRange?.[1];

        if (start != null) {
          whereAnd.push({
            maxAttempts: { gte: start },
          });
        }

        if (end != null) {
          whereAnd.push({
            maxAttempts: { lte: end },
          });
        }
      }
      if (filter?.shuffleQuestions != null) {
        whereAnd.push({
          shuffleQuestions: filter.shuffleQuestions === 'true',
        });
      }
      if (filter?.showAnswersImmediately != null) {
        whereAnd.push({
          showAnswersImmediately: filter.showAnswersImmediately === 'true',
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

      let examTypes = await tx.examType.findMany({
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

      const count = await tx.examType.count({
        where: {
          AND: whereAnd,
        },
      });

      examTypes = await filePopulateDownloadUrlInTree(examTypes);

      return { examTypes, count };
    },
  );
}
