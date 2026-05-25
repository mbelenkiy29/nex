import { Prisma } from '../../../prisma/generated/client';
import { z } from 'zod';
import { AppContext } from '../../../shared/controller/appContext';
import { RouteConfig } from '../../../shared/openapi/routeToPath';
import { authGuardBackend } from '../../auth/authGuardBackend';
import {
  practiceQuestionAutocompleteInputSchema,
  practiceQuestionAutocompleteOutputSchema,
} from '../practiceQuestionSchemas';
import { McpTool } from '../../mcp/mcpTypes';
import { toMcpJsonSchema } from '../../mcp/mcpSchemaConverter';
import { Dictionary } from '../../../translation/locales';
import { prisma } from '../../../prisma';

export const practiceQuestionAutocompleteApiDoc: RouteConfig = {
  method: 'get',
  path: '/api/practice-question/autocomplete',
  query: practiceQuestionAutocompleteInputSchema,
  response: z.array(practiceQuestionAutocompleteOutputSchema),
};

export const practiceQuestionAutocompleteMcpTool = (
  dictionary: Dictionary,
): McpTool => ({
  name: 'practiceQuestion_autocomplete',
  description: dictionary.practiceQuestion.mcpDescription.autocomplete,
  requiredPermissions: { practiceQuestion: ['autocomplete'] },
  schema: toMcpJsonSchema(practiceQuestionAutocompleteInputSchema),
  handler: async (params, context) => {
    return await practiceQuestionAutocompleteController(params, context);
  },
});

export async function practiceQuestionAutocompleteController(
  query: unknown,
  context: AppContext,
) {
  const { currentOrganization } = await authGuardBackend(
    {
      practiceQuestion: ['autocomplete'],
    },
    context,
  );

  const { search, exclude, take, orderBy, course } =
    practiceQuestionAutocompleteInputSchema.parse(query);

  return await prisma.$withRLS(
    { organization: currentOrganization },
    async (tx) => {
      const whereAnd: Array<Prisma.PracticeQuestionWhereInput> = [];

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
          questionText: {
            contains: search,
            mode: 'insensitive',
          },
        });
      }

      const practiceQuestions = await tx.practiceQuestion.findMany({
        where: {
          AND: whereAnd,
        },
        take,
        orderBy,
      });

      return practiceQuestions.map((practiceQuestion) => ({
        id: practiceQuestion.id,
        questionText: String(practiceQuestion.questionText),
      }));
    },
  );
}
