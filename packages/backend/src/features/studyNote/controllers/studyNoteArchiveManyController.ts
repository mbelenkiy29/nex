import { AppContext } from '../../../shared/controller/appContext';
import { RouteConfig } from '../../../shared/openapi/routeToPath';
import { authGuardBackend } from '../../auth/authGuardBackend';
import { studyNoteArchiveManyInputSchema as studyNoteArchiveManyInputSchema } from '../studyNoteSchemas';
import { auditLogOperations } from '../../auditLog/auditLogOperations';
import { auditLogCreate } from '../../auditLog/auditLogCreate';
import { McpTool } from '../../mcp/mcpTypes';
import { toMcpJsonSchema } from '../../mcp/mcpSchemaConverter';
import { Dictionary } from '../../../translation/locales';
import { prisma } from '../../../prisma';

export const studyNoteArchiveManyApiDoc: RouteConfig = {
  method: 'put',
  path: '/api/study-note/archive',
  query: studyNoteArchiveManyInputSchema,
};

export const studyNoteArchiveManyMcpTool = (
  dictionary: Dictionary,
): McpTool => ({
  name: 'study-note_archive_many',
  description: dictionary.studyNote.mcpDescription.archive,
  requiredPermissions: { studyNote: ['archive'] },
  schema: toMcpJsonSchema(studyNoteArchiveManyInputSchema),
  handler: async (params, context) => {
    return await studyNoteArchiveManyController(params, context);
  },
});

export async function studyNoteArchiveManyController(
  query: unknown,
  context: AppContext,
) {
  const { currentMember, currentOrganization } = await authGuardBackend(
    {
      studyNote: ['archive'],
    },
    context,
  );

  const { ids } = studyNoteArchiveManyInputSchema.parse(query);

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
          archivedAt: new Date(),
          archivedByMemberId: currentMember.id,
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
