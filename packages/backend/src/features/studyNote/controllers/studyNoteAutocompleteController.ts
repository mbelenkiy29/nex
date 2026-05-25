import { Prisma } from '../../../prisma/generated/client';
import { z } from 'zod';
import { AppContext } from '../../../shared/controller/appContext';
import { RouteConfig } from '../../../shared/openapi/routeToPath';
import { authGuardBackend } from '../../auth/authGuardBackend';
import {
  studyNoteAutocompleteInputSchema,
  studyNoteAutocompleteOutputSchema,
} from '../studyNoteSchemas';
import { McpTool } from '../../mcp/mcpTypes';
import { toMcpJsonSchema } from '../../mcp/mcpSchemaConverter';
import { Dictionary } from '../../../translation/locales';
import { prisma } from '../../../prisma';

export const studyNoteAutocompleteApiDoc: RouteConfig = {
  method: 'get',
  path: '/api/study-note/autocomplete',
  query: studyNoteAutocompleteInputSchema,
  response: z.array(studyNoteAutocompleteOutputSchema),
};

export const studyNoteAutocompleteMcpTool = (
  dictionary: Dictionary,
): McpTool => ({
  name: 'studyNote_autocomplete',
  description: dictionary.studyNote.mcpDescription.autocomplete,
  requiredPermissions: { studyNote: ['autocomplete'] },
  schema: toMcpJsonSchema(studyNoteAutocompleteInputSchema),
  handler: async (params, context) => {
    return await studyNoteAutocompleteController(params, context);
  },
});

export async function studyNoteAutocompleteController(
  query: unknown,
  context: AppContext,
) {
  const { currentOrganization } = await authGuardBackend(
    {
      studyNote: ['autocomplete'],
    },
    context,
  );

  const { search, exclude, take, orderBy, course } =
    studyNoteAutocompleteInputSchema.parse(query);

  return await prisma.$withRLS(
    { organization: currentOrganization },
    async (tx) => {
      const whereAnd: Array<Prisma.StudyNoteWhereInput> = [];

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

      const studyNotes = await tx.studyNote.findMany({
        where: {
          AND: whereAnd,
        },
        take,
        orderBy,
      });

      return studyNotes.map((studyNote) => ({
        id: studyNote.id,
        title: String(studyNote.title),
      }));
    },
  );
}
