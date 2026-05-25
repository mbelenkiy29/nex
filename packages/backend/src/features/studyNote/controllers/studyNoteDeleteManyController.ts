import { AppContext } from '../../../shared/controller/appContext';
import { RouteConfig } from '../../../shared/openapi/routeToPath';
import { authGuardBackend } from '../../auth/authGuardBackend';
import { studyNoteDeleteManyInputSchema } from '../studyNoteSchemas';
import { auditLogOperations } from '../../auditLog/auditLogOperations';
import { auditLogCreate } from '../../auditLog/auditLogCreate';
import { McpTool } from '../../mcp/mcpTypes';
import { toMcpJsonSchema } from '../../mcp/mcpSchemaConverter';
import { Dictionary } from '../../../translation/locales';
import { prisma } from '../../../prisma';

export const studyNoteDeleteManyApiDoc: RouteConfig = {
  method: 'delete',
  path: '/api/study-note',
  query: studyNoteDeleteManyInputSchema,
};

export const studyNoteDeleteManyMcpTool = (
  dictionary: Dictionary,
): McpTool => ({
  name: 'studyNote_delete_many',
  description: dictionary.studyNote.mcpDescription.delete,
  requiredPermissions: { studyNote: ['delete'] },
  schema: toMcpJsonSchema(studyNoteDeleteManyInputSchema),
  handler: async (params, context) => {
    return await studyNoteDeleteManyController(params, context);
  },
});

export async function studyNoteDeleteManyController(
  query: unknown,
  context: AppContext,
) {
  const { currentOrganization } = await authGuardBackend(
    {
      studyNote: ['delete'],
    },
    context,
  );

  const { ids } = studyNoteDeleteManyInputSchema.parse(query);

  return await prisma.$withRLS(
    { organization: currentOrganization },
    async (tx) => {
      const studyNotesToDelete = await tx.studyNote.findMany({
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
          lesson: {
            select: {
              id: true,
              title: true,
            },
          },
          author: {
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

      const result = await tx.studyNote.deleteMany({
        where: {
          id: { in: ids },
          organizationId: currentOrganization.id,
        },
      });

      for (const studyNote of studyNotesToDelete) {
        await auditLogCreate({
          entityId: studyNote.id,
          entityName: 'StudyNote',
          operation: auditLogOperations.delete,
          context,
          oldData: studyNote,
          tx,
        });
      }

      return result;
    },
  );
}
