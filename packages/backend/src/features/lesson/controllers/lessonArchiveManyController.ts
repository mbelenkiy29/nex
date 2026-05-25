import { AppContext } from '../../../shared/controller/appContext';
import { RouteConfig } from '../../../shared/openapi/routeToPath';
import { authGuardBackend } from '../../auth/authGuardBackend';
import { lessonArchiveManyInputSchema as lessonArchiveManyInputSchema } from '../lessonSchemas';
import { auditLogOperations } from '../../auditLog/auditLogOperations';
import { auditLogCreate } from '../../auditLog/auditLogCreate';
import { McpTool } from '../../mcp/mcpTypes';
import { toMcpJsonSchema } from '../../mcp/mcpSchemaConverter';
import { Dictionary } from '../../../translation/locales';
import { prisma } from '../../../prisma';

export const lessonArchiveManyApiDoc: RouteConfig = {
  method: 'put',
  path: '/api/lesson/archive',
  query: lessonArchiveManyInputSchema,
};

export const lessonArchiveManyMcpTool = (dictionary: Dictionary): McpTool => ({
  name: 'lesson_archive_many',
  description: dictionary.lesson.mcpDescription.archive,
  requiredPermissions: { lesson: ['archive'] },
  schema: toMcpJsonSchema(lessonArchiveManyInputSchema),
  handler: async (params, context) => {
    return await lessonArchiveManyController(params, context);
  },
});

export async function lessonArchiveManyController(
  query: unknown,
  context: AppContext,
) {
  const { currentMember, currentOrganization } = await authGuardBackend(
    {
      lesson: ['archive'],
    },
    context,
  );

  const { ids } = lessonArchiveManyInputSchema.parse(query);

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
          archivedAt: new Date(),
          archivedByMemberId: currentMember.id,
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
