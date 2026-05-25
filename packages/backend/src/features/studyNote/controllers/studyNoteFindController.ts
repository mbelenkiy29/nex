import { AppContext } from '../../../shared/controller/appContext';
import { RouteConfig } from '../../../shared/openapi/routeToPath';
import { filePopulateDownloadUrlInTree } from '../../file/fileService';
import { authGuardBackend } from '../../auth/authGuardBackend';
import { studyNoteFindSchema } from '../studyNoteSchemas';
import { McpTool } from '../../mcp/mcpTypes';
import { toMcpJsonSchema } from '../../mcp/mcpSchemaConverter';
import { Dictionary } from '../../../translation/locales';
import { prisma } from '../../../prisma';

export const studyNoteFindApiDoc: RouteConfig = {
  method: 'get',
  path: '/api/study-note/{id}',
  params: studyNoteFindSchema,
  response: 'StudyNote',
};

export const studyNoteFindMcpTool = (dictionary: Dictionary): McpTool => ({
  name: 'studyNote_get',
  description: dictionary.studyNote.mcpDescription.get,
  requiredPermissions: { studyNote: ['read'] },
  schema: toMcpJsonSchema(studyNoteFindSchema),
  handler: async (params, context) => {
    return await studyNoteFindController(params, context);
  },
});

export async function studyNoteFindController(
  params: unknown,
  context: AppContext,
) {
  const { currentOrganization } = await authGuardBackend(
    {
      studyNote: ['read'],
    },
    context,
  );

  const { id } = studyNoteFindSchema.parse(params);

  return await prisma.$withRLS(
    { organization: currentOrganization },
    async (tx) => {
      let studyNote = await tx.studyNote.findUnique({
        where: {
          id_organizationId: {
            id,
            organizationId: currentOrganization.id,
          },
        },
        include: {
          course: {
            select: {
              id: true,
              title: true,
              slug: true,
            },
          },
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
          archivedByMember: {
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

      studyNote = await filePopulateDownloadUrlInTree(studyNote);

      return studyNote;
    },
  );
}
