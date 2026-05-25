import { AppContext } from '../../../shared/controller/appContext';
import { RouteConfig } from '../../../shared/openapi/routeToPath';
import { filePopulateDownloadUrlInTree } from '../../file/fileService';
import { authGuardBackend } from '../../auth/authGuardBackend';
import { chapterFindSchema } from '../chapterSchemas';
import { McpTool } from '../../mcp/mcpTypes';
import { toMcpJsonSchema } from '../../mcp/mcpSchemaConverter';
import { Dictionary } from '../../../translation/locales';
import { prisma } from '../../../prisma';

export const chapterFindApiDoc: RouteConfig = {
  method: 'get',
  path: '/api/chapter/{id}',
  params: chapterFindSchema,
  response: 'Chapter',
};

export const chapterFindMcpTool = (dictionary: Dictionary): McpTool => ({
  name: 'chapter_get',
  description: dictionary.chapter.mcpDescription.get,
  requiredPermissions: { chapter: ['read'] },
  schema: toMcpJsonSchema(chapterFindSchema),
  handler: async (params, context) => {
    return await chapterFindController(params, context);
  },
});

export async function chapterFindController(
  params: unknown,
  context: AppContext,
) {
  const { currentOrganization } = await authGuardBackend(
    {
      chapter: ['read'],
    },
    context,
  );

  const { id } = chapterFindSchema.parse(params);

  return await prisma.$withRLS(
    { organization: currentOrganization },
    async (tx) => {
      let chapter = await tx.chapter.findUnique({
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

      chapter = await filePopulateDownloadUrlInTree(chapter);

      return chapter;
    },
  );
}
