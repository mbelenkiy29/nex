import { Prisma } from '../../../prisma/generated/client';
import { z } from 'zod';
import { AppContext } from '../../../shared/controller/appContext';
import { RouteConfig } from '../../../shared/openapi/routeToPath';
import { authGuardBackend } from '../../auth/authGuardBackend';
import {
  chapterAutocompleteInputSchema,
  chapterAutocompleteOutputSchema,
} from '../chapterSchemas';
import { McpTool } from '../../mcp/mcpTypes';
import { toMcpJsonSchema } from '../../mcp/mcpSchemaConverter';
import { Dictionary } from '../../../translation/locales';
import { prisma } from '../../../prisma';

export const chapterAutocompleteApiDoc: RouteConfig = {
  method: 'get',
  path: '/api/chapter/autocomplete',
  query: chapterAutocompleteInputSchema,
  response: z.array(chapterAutocompleteOutputSchema),
};

export const chapterAutocompleteMcpTool = (
  dictionary: Dictionary,
): McpTool => ({
  name: 'chapter_autocomplete',
  description: dictionary.chapter.mcpDescription.autocomplete,
  requiredPermissions: { chapter: ['autocomplete'] },
  schema: toMcpJsonSchema(chapterAutocompleteInputSchema),
  handler: async (params, context) => {
    return await chapterAutocompleteController(params, context);
  },
});

export async function chapterAutocompleteController(
  query: unknown,
  context: AppContext,
) {
  const { currentOrganization } = await authGuardBackend(
    {
      chapter: ['autocomplete'],
    },
    context,
  );

  const { search, exclude, take, orderBy, course } =
    chapterAutocompleteInputSchema.parse(query);

  return await prisma.$withRLS(
    { organization: currentOrganization },
    async (tx) => {
      const whereAnd: Array<Prisma.ChapterWhereInput> = [];

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

      const chapters = await tx.chapter.findMany({
        where: {
          AND: whereAnd,
        },
        take,
        orderBy,
      });

      return chapters.map((chapter) => ({
        id: chapter.id,
        title: String(chapter.title),
      }));
    },
  );
}
