import { AppContext } from '../../../shared/controller/appContext';
import { RouteConfig } from '../../../shared/openapi/routeToPath';
import { authGuardBackend } from '../../auth/authGuardBackend';
import { studyNoteRestoreManyInputSchema } from '../studyNoteSchemas';
import { auditLogOperations } from '../../auditLog/auditLogOperations';
import { auditLogCreate } from '../../auditLog/auditLogCreate';
import { McpTool } from '../../mcp/mcpTypes';
import { toMcpJsonSchema } from '../../mcp/mcpSchemaConverter';
import { Dictionary } from '../../../translation/locales';
import { prisma } from '../../../prisma';

export const studyNoteRestoreManyApiDoc: RouteConfig = {
  method: 'put',
  path: '/api/study-note/restore',
  query: studyNoteRestoreManyInputSchema,
};

export const studyNoteRestoreManyMcpTool = (
  dictionary: Dictionary,
): McpTool => ({
  name: 'study-note_restore_many',
  description: dictionary.studyNote.mcpDescription.restore,
  requiredPermissions: { studyNote: ['restore'] },
  schema: toMcpJsonSchema(studyNoteRestoreManyInputSchema),
  handler: async (params, context) => {
    return await studyNoteRestoreManyController(params, context);
  },
});

export async function studyNoteRestoreManyController(
  query: unknown,
  context: AppContext,
) {
  const { currentOrganization } = await authGuardBackend(
    {
      studyNote: ['restore'],
    },
    context,
  );

  const { ids } = studyNoteRestoreManyInputSchema.parse(query);

  return await prisma.$withRLS(
    { organization: currentOrganization },
    async (tx) => {
      const oldStudyNotes = await tx.studyNote.findMany({
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

      const result = await tx.studyNote.updateMany({
        where: {
          id: { in: ids },
          organizationId: currentOrganization.id,
        },
        data: {
          archivedAt: null,
          archivedByMemberId: null,
        },
      });

      const newStudyNotes = await tx.studyNote.findMany({
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

      for (const oldStudyNote of oldStudyNotes) {
        const newStudyNote = newStudyNotes.find(
          (c) => c.id === oldStudyNote.id,
        );
        await auditLogCreate({
          entityId: oldStudyNote.id,
          entityName: 'StudyNote',
          operation: auditLogOperations.update,
          context,
          oldData: oldStudyNote,
          newData: newStudyNote,
          tx,
        });
      }

      return result;
    },
  );
}
