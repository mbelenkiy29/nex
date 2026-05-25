import { AppContext } from '../../../shared/controller/appContext';
import { RouteConfig } from '../../../shared/openapi/routeToPath';
import { authGuardBackend } from '../../auth/authGuardBackend';
import { chapterRestoreManyInputSchema } from '../chapterSchemas';
import { auditLogOperations } from '../../auditLog/auditLogOperations';
import { auditLogCreate } from '../../auditLog/auditLogCreate';
import { McpTool } from '../../mcp/mcpTypes';
import { toMcpJsonSchema } from '../../mcp/mcpSchemaConverter';
import { Dictionary } from '../../../translation/locales';
import { prisma } from '../../../prisma';

export const chapterRestoreManyApiDoc: RouteConfig = {
  method: 'put',
  path: '/api/chapter/restore',
  query: chapterRestoreManyInputSchema,
};

export const chapterRestoreManyMcpTool = (dictionary: Dictionary): McpTool => ({
  name: 'chapter_restore_many',
  description: dictionary.chapter.mcpDescription.restore,
  requiredPermissions: { chapter: ['restore'] },
  schema: toMcpJsonSchema(chapterRestoreManyInputSchema),
  handler: async (params, context) => {
    return await chapterRestoreManyController(params, context);
  },
});

export async function chapterRestoreManyController(
  query: unknown,
  context: AppContext,
) {
  const { currentOrganization } = await authGuardBackend(
    {
      chapter: ['restore'],
    },
    context,
  );

  const { ids } = chapterRestoreManyInputSchema.parse(query);

  return await prisma.$withRLS(
    { organization: currentOrganization },
    async (tx) => {
      const oldChapters = await tx.chapter.findMany({
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

      const result = await tx.chapter.updateMany({
        where: {
          id: { in: ids },
          organizationId: currentOrganization.id,
        },
        data: {
          archivedAt: null,
          archivedByMemberId: null,
        },
      });

      const newChapters = await tx.chapter.findMany({
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

      for (const oldChapter of oldChapters) {
        const newChapter = newChapters.find((c) => c.id === oldChapter.id);
        await auditLogCreate({
          entityId: oldChapter.id,
          entityName: 'Chapter',
          operation: auditLogOperations.update,
          context,
          oldData: oldChapter,
          newData: newChapter,
          tx,
        });
      }

      return result;
    },
  );
}
