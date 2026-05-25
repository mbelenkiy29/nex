import { AppContext } from '../../../shared/controller/appContext';
import { RouteConfig } from '../../../shared/openapi/routeToPath';
import { filePopulateDownloadUrlInTree } from '../../file/fileService';
import { authGuardBackend } from '../../auth/authGuardBackend';
import { lessonFindSchema } from '../lessonSchemas';
import { McpTool } from '../../mcp/mcpTypes';
import { toMcpJsonSchema } from '../../mcp/mcpSchemaConverter';
import { Dictionary } from '../../../translation/locales';
import { prisma } from '../../../prisma';

export const lessonFindApiDoc: RouteConfig = {
  method: 'get',
  path: '/api/lesson/{id}',
  params: lessonFindSchema,
  response: 'Lesson',
};

export const lessonFindMcpTool = (dictionary: Dictionary): McpTool => ({
  name: 'lesson_get',
  description: dictionary.lesson.mcpDescription.get,
  requiredPermissions: { lesson: ['read'] },
  schema: toMcpJsonSchema(lessonFindSchema),
  handler: async (params, context) => {
    return await lessonFindController(params, context);
  },
});

export async function lessonFindController(
  params: unknown,
  context: AppContext,
) {
  const { currentOrganization } = await authGuardBackend(
    {
      lesson: ['read'],
    },
    context,
  );

  const { id } = lessonFindSchema.parse(params);

  return await prisma.$withRLS(
    { organization: currentOrganization },
    async (tx) => {
      let lesson = await tx.lesson.findUnique({
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

      lesson = await filePopulateDownloadUrlInTree(lesson);

      return lesson;
    },
  );
}
