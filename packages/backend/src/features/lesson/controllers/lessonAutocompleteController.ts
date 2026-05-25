import { Prisma } from '../../../prisma/generated/client';
import { z } from 'zod';
import { AppContext } from '../../../shared/controller/appContext';
import { RouteConfig } from '../../../shared/openapi/routeToPath';
import { authGuardBackend } from '../../auth/authGuardBackend';
import {
  lessonAutocompleteInputSchema,
  lessonAutocompleteOutputSchema,
} from '../lessonSchemas';
import { McpTool } from '../../mcp/mcpTypes';
import { toMcpJsonSchema } from '../../mcp/mcpSchemaConverter';
import { Dictionary } from '../../../translation/locales';
import { prisma } from '../../../prisma';

export const lessonAutocompleteApiDoc: RouteConfig = {
  method: 'get',
  path: '/api/lesson/autocomplete',
  query: lessonAutocompleteInputSchema,
  response: z.array(lessonAutocompleteOutputSchema),
};

export const lessonAutocompleteMcpTool = (dictionary: Dictionary): McpTool => ({
  name: 'lesson_autocomplete',
  description: dictionary.lesson.mcpDescription.autocomplete,
  requiredPermissions: { lesson: ['autocomplete'] },
  schema: toMcpJsonSchema(lessonAutocompleteInputSchema),
  handler: async (params, context) => {
    return await lessonAutocompleteController(params, context);
  },
});

export async function lessonAutocompleteController(
  query: unknown,
  context: AppContext,
) {
  const { currentOrganization } = await authGuardBackend(
    {
      lesson: ['autocomplete'],
    },
    context,
  );

  const { search, exclude, take, orderBy, course } =
    lessonAutocompleteInputSchema.parse(query);

  return await prisma.$withRLS(
    { organization: currentOrganization },
    async (tx) => {
      const whereAnd: Array<Prisma.LessonWhereInput> = [];

      whereAnd.push({
        organizationId: currentOrganization.id,
      });

      whereAnd.push({ archivedAt: null });

      if (exclude) {
        whereAnd.push({
          id: {
            notIn: exclude,
          },
        });
      }

      if (course) {
        whereAnd.push({ courseId: course });
      }

      if (search) {
        whereAnd.push({
          title: {
            contains: search,
            mode: 'insensitive',
          },
        });
      }

      const lessons = await tx.lesson.findMany({
        where: {
          AND: whereAnd,
        },
        take,
        orderBy,
      });

      return lessons.map((lesson) => ({
        id: lesson.id,
        title: String(lesson.title),
      }));
    },
  );
}
