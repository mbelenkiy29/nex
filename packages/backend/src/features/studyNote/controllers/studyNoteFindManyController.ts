import { Prisma } from '../../../prisma/generated/client';
import { AppContext } from '../../../shared/controller/appContext';
import { RouteConfig } from '../../../shared/openapi/routeToPath';
import { authGuardBackend } from '../../auth/authGuardBackend';
import { filePopulateDownloadUrlInTree } from '../../file/fileService';
import { studyNoteFindManyInputSchema } from '../studyNoteSchemas';
import { McpTool } from '../../mcp/mcpTypes';
import { Dictionary } from '../../../translation/locales';
import { toMcpJsonSchema } from '../../mcp/mcpSchemaConverter';
import { prisma } from '../../../prisma';

export const studyNoteFindManyApiDoc: RouteConfig = {
  method: 'get',
  path: '/api/study-note',
  query: studyNoteFindManyInputSchema,
  response: '{ studyNotes: StudyNote[], count: number }',
};

export const studyNoteFindManyMcpTool = (dictionary: Dictionary): McpTool => ({
  name: 'studyNote_list',
  description: dictionary.studyNote.mcpDescription.list,
  requiredPermissions: { studyNote: ['read'] },
  schema: toMcpJsonSchema(studyNoteFindManyInputSchema),
  handler: async (params, context) => {
    return await studyNoteFindManyController(params, context);
  },
});

export async function studyNoteFindManyController(
  query: unknown,
  context: AppContext,
) {
  const { currentOrganization } = await authGuardBackend(
    {
      studyNote: ['read'],
    },
    context,
  );

  const { filter, orderBy, skip, take } =
    studyNoteFindManyInputSchema.parse(query);

  return await prisma.$withRLS(
    { organization: currentOrganization },
    async (tx) => {
      const whereAnd: Array<Prisma.StudyNoteWhereInput> = [];

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
      if (filter?.content != null) {
        whereAnd.push({
          content: { contains: filter?.content, mode: 'insensitive' },
        });
      }
      if (filter?.isFavorite != null) {
        whereAnd.push({
          isFavorite: filter.isFavorite === 'true',
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
      if (filter?.lesson != null) {
        whereAnd.push({
          lesson: {
            id: filter.lesson,
          },
        });
      }
      if (filter?.author != null) {
        whereAnd.push({
          author: {
            id: filter.author,
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

      let studyNotes = await tx.studyNote.findMany({
        where: {
          AND: whereAnd,
        },
        skip,
        take,
        orderBy,
        include: {
          course: true,
          chapter: true,
          lesson: true,
          author: {
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

      const count = await tx.studyNote.count({
        where: {
          AND: whereAnd,
        },
      });

      studyNotes = await filePopulateDownloadUrlInTree(studyNotes);

      return { studyNotes, count };
    },
  );
}
