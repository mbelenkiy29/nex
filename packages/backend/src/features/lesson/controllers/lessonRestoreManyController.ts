import { AppContext } from '../../../shared/controller/appContext';
import { RouteConfig } from '../../../shared/openapi/routeToPath';
import { authGuardBackend } from '../../auth/authGuardBackend';
import { lessonRestoreManyInputSchema } from '../lessonSchemas';
import { auditLogOperations } from '../../auditLog/auditLogOperations';
import { auditLogCreate } from '../../auditLog/auditLogCreate';
import { McpTool } from '../../mcp/mcpTypes';
import { toMcpJsonSchema } from '../../mcp/mcpSchemaConverter';
import { Dictionary } from '../../../translation/locales';
import { prisma } from '../../../prisma';

export const lessonRestoreManyApiDoc: RouteConfig = {
  method: 'put',
  path: '/api/lesson/restore',
  query: lessonRestoreManyInputSchema,
};

export const lessonRestoreManyMcpTool = (dictionary: Dictionary): McpTool => ({
  name: 'lesson_restore_many',
  description: dictionary.lesson.mcpDescription.restore,
  requiredPermissions: { lesson: ['restore'] },
  schema: toMcpJsonSchema(lessonRestoreManyInputSchema),
  handler: async (params, context) => {
    return await lessonRestoreManyController(params, context);
  },
});

export async function lessonRestoreManyController(
  query: unknown,
  context: AppContext,
) {
  const { currentOrganization } = await authGuardBackend(
    {
      lesson: ['restore'],
    },
    context,
  );

  const { ids } = lessonRestoreManyInputSchema.parse(query);

  return await prisma.$withRLS(
    { organization: currentOrganization },
    async (tx) => {
      const oldLessons = await tx.lesson.findMany({
        where: {
          id: { in: ids },
          organizationId: currentOrganization.id,
        },
        select: {
          id: true,
          archivedAt: true,
          archivedByMemberId: true,
        },
      });

      const result = await tx.lesson.updateMany({
        where: {
          id: { in: ids },
          organizationId: currentOrganization.id,
        },
        data: {
          archivedAt: null,
          archivedByMemberId: null,
        },
      });

      const newLessons = await tx.lesson.findMany({
        where: {
          id: { in: ids },
          organizationId: currentOrganization.id,
        },
        select: {
          id: true,
          archivedAt: true,
          archivedByMemberId: true,
        },
      });

      for (const oldLesson of oldLessons) {
        const newLesson = newLessons.find((c) => c.id === oldLesson.id);
        await auditLogCreate({
          entityId: oldLesson.id,
          entityName: 'Lesson',
          operation: auditLogOperations.update,
          context,
          oldData: oldLesson,
          newData: newLesson,
          tx,
        });
      }

      return result;
    },
  );
}
