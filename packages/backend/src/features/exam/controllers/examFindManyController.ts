import { Prisma } from '../../../prisma/generated/client';
import { AppContext } from '../../../shared/controller/appContext';
import { RouteConfig } from '../../../shared/openapi/routeToPath';
import { authGuardBackend } from '../../auth/authGuardBackend';
import { filePopulateDownloadUrlInTree } from '../../file/fileService';
import { examFindManyInputSchema } from '../examSchemas';
import { McpTool } from '../../mcp/mcpTypes';
import { Dictionary } from '../../../translation/locales';
import { toMcpJsonSchema } from '../../mcp/mcpSchemaConverter';
import { prisma } from '../../../prisma';

export const examFindManyApiDoc: RouteConfig = {
  method: 'get',
  path: '/api/exam',
  query: examFindManyInputSchema,
  response: '{ exams: Exam[], count: number }',
};

export const examFindManyMcpTool = (dictionary: Dictionary): McpTool => ({
  name: 'exam_list',
  description: dictionary.exam.mcpDescription.list,
  requiredPermissions: { exam: ['read'] },
  schema: toMcpJsonSchema(examFindManyInputSchema),
  handler: async (params, context) => {
    return await examFindManyController(params, context);
  },
});

export async function examFindManyController(
  query: unknown,
  context: AppContext,
) {
  const { currentOrganization } = await authGuardBackend(
    {
      exam: ['read'],
    },
    context,
  );

  const { filter, orderBy, skip, take } = examFindManyInputSchema.parse(query);

  return await prisma.$withRLS(
    { organization: currentOrganization },
    async (tx) => {
      const whereAnd: Array<Prisma.ExamWhereInput> = [];

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
      if (filter?.code != null) {
        whereAnd.push({
          code: { contains: filter?.code, mode: 'insensitive' },
        });
      }
      if (filter?.course != null) {
        whereAnd.push({
          course: {
            id: filter.course,
          },
        });
      }
      if (filter?.isActive != null) {
        whereAnd.push({
          isActive: filter.isActive === 'true',
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

      let exams = await tx.exam.findMany({
        where: {
          AND: whereAnd,
        },
        skip,
        take,
        orderBy,
        include: {
          course: true,
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

      const count = await tx.exam.count({
        where: {
          AND: whereAnd,
        },
      });

      exams = await filePopulateDownloadUrlInTree(exams);

      return { exams, count };
    },
  );
}
