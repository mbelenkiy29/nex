import { AppContext } from '../../../shared/controller/appContext';
import { RouteConfig } from '../../../shared/openapi/routeToPath';
import { authGuardBackend } from '../../auth/authGuardBackend';
import { chapterDeleteManyInputSchema } from '../chapterSchemas';
import { auditLogOperations } from '../../auditLog/auditLogOperations';
import { auditLogCreate } from '../../auditLog/auditLogCreate';
import { McpTool } from '../../mcp/mcpTypes';
import { toMcpJsonSchema } from '../../mcp/mcpSchemaConverter';
import { Dictionary } from '../../../translation/locales';
import { prisma } from '../../../prisma';

export const chapterDeleteManyApiDoc: RouteConfig = {
  method: 'delete',
  path: '/api/chapter',
  query: chapterDeleteManyInputSchema,
};

export const chapterDeleteManyMcpTool = (dictionary: Dictionary): McpTool => ({
  name: 'chapter_delete_many',
  description: dictionary.chapter.mcpDescription.delete,
  requiredPermissions: { chapter: ['delete'] },
  schema: toMcpJsonSchema(chapterDeleteManyInputSchema),
  handler: async (params, context) => {
    return await chapterDeleteManyController(params, context);
  },
});

export async function chapterDeleteManyController(
  query: unknown,
  context: AppContext,
) {
  const { currentOrganization } = await authGuardBackend(
    {
      chapter: ['delete'],
    },
    context,
  );

  const { ids } = chapterDeleteManyInputSchema.parse(query);

  return await prisma.$withRLS(
    { organization: currentOrganization },
    async (tx) => {
      const chaptersToDelete = await tx.chapter.findMany({
        where: {
          id: { in: ids },
          organizationId: currentOrganization.id,
        },
        include: {
          exam: {
            select: {
              id: true,
              name: true,
            },
          },
          lessons: {
            select: {
              id: true,
              title: true,
            },
          },
          practiceQuestions: {
            select: {
              id: true,
              questionText: true,
            },
          },
          studyNotes: {
            select: {
              id: true,
              title: true,
            },
          },
          createdByMember: {
            select: {
              id: true,
              fullName: true,
              user: {
                select: {
                  email: true,
                },
              },
            },
          },
          updatedByMember: {
            select: {
              id: true,
              fullName: true,
              user: {
                select: {
                  email: true,
                },
              },
            },
          },
          archivedByMember: {
            select: {
              id: true,
              fullName: true,
              user: {
                select: {
                  email: true,
                },
              },
            },
          },
        },
      });

      const result = await tx.chapter.deleteMany({
        where: {
          id: { in: ids },
          organizationId: currentOrganization.id,
        },
      });

      for (const chapter of chaptersToDelete) {
        await auditLogCreate({
          entityId: chapter.id,
          entityName: 'Chapter',
          operation: auditLogOperations.delete,
          context,
          oldData: chapter,
          tx,
        });
      }

      return result;
    },
  );
}
