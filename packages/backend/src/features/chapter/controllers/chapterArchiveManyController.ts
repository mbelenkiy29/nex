import { AppContext } from '../../../shared/controller/appContext';
import { RouteConfig } from '../../../shared/openapi/routeToPath';
import { authGuardBackend } from '../../auth/authGuardBackend';
import { chapterArchiveManyInputSchema as chapterArchiveManyInputSchema } from '../chapterSchemas';
import { auditLogOperations } from '../../auditLog/auditLogOperations';
import { auditLogCreate } from '../../auditLog/auditLogCreate';
import { McpTool } from '../../mcp/mcpTypes';
import { toMcpJsonSchema } from '../../mcp/mcpSchemaConverter';
import { Dictionary } from '../../../translation/locales';
import { prisma } from '../../../prisma';

export const chapterArchiveManyApiDoc: RouteConfig = {
  method: 'put',
  path: '/api/chapter/archive',
  query: chapterArchiveManyInputSchema,
};

export const chapterArchiveManyMcpTool = (dictionary: Dictionary): McpTool => ({
  name: 'chapter_archive_many',
  description: dictionary.chapter.mcpDescription.archive,
  requiredPermissions: { chapter: ['archive'] },
  schema: toMcpJsonSchema(chapterArchiveManyInputSchema),
  handler: async (params, context) => {
    return await chapterArchiveManyController(params, context);
  },
});

export async function chapterArchiveManyController(
  query: unknown,
  context: AppContext,
) {
  const { currentMember, currentOrganization } = await authGuardBackend(
    {
      chapter: ['archive'],
    },
    context,
  );

  const { ids } = chapterArchiveManyInputSchema.parse(query);

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
          archivedAt: new Date(),
          archivedByMemberId: currentMember.id,
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
