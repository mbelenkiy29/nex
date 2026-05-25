import { AppContext } from '../../../shared/controller/appContext';
import { RouteConfig } from '../../../shared/openapi/routeToPath';
import { authGuardBackend } from '../../auth/authGuardBackend';
import { lessonDeleteManyInputSchema } from '../lessonSchemas';
import { auditLogOperations } from '../../auditLog/auditLogOperations';
import { auditLogCreate } from '../../auditLog/auditLogCreate';
import { McpTool } from '../../mcp/mcpTypes';
import { toMcpJsonSchema } from '../../mcp/mcpSchemaConverter';
import { Dictionary } from '../../../translation/locales';
import { prisma } from '../../../prisma';

export const lessonDeleteManyApiDoc: RouteConfig = {
  method: 'delete',
  path: '/api/lesson',
  query: lessonDeleteManyInputSchema,
};

export const lessonDeleteManyMcpTool = (dictionary: Dictionary): McpTool => ({
  name: 'lesson_delete_many',
  description: dictionary.lesson.mcpDescription.delete,
  requiredPermissions: { lesson: ['delete'] },
  schema: toMcpJsonSchema(lessonDeleteManyInputSchema),
  handler: async (params, context) => {
    return await lessonDeleteManyController(params, context);
  },
});

export async function lessonDeleteManyController(
  query: unknown,
  context: AppContext,
) {
  const { currentOrganization } = await authGuardBackend(
    {
      lesson: ['delete'],
    },
    context,
  );

  const { ids } = lessonDeleteManyInputSchema.parse(query);

  return await prisma.$withRLS(
    { organization: currentOrganization },
    async (tx) => {
      const lessonsToDelete = await tx.lesson.findMany({
        where: {
          id: { in: ids },
          organizationId: currentOrganization.id,
        },
        include: {
          chapter: {
            select: {
              id: true,
              title: true,
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

      const result = await tx.lesson.deleteMany({
        where: {
          id: { in: ids },
          organizationId: currentOrganization.id,
        },
      });

      for (const lesson of lessonsToDelete) {
        await auditLogCreate({
          entityId: lesson.id,
          entityName: 'Lesson',
          operation: auditLogOperations.delete,
          context,
          oldData: lesson,
          tx,
        });
      }

      return result;
    },
  );
}
