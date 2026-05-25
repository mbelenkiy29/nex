import { Prisma } from '../../../prisma/generated/client';
import { z } from 'zod';
import { AppContext } from '../../../shared/controller/appContext';
import { RouteConfig } from '../../../shared/openapi/routeToPath';
import { authGuardBackend } from '../../auth/authGuardBackend';
import {
  examAutocompleteInputSchema,
  examAutocompleteOutputSchema,
} from '../examSchemas';
import { McpTool } from '../../mcp/mcpTypes';
import { toMcpJsonSchema } from '../../mcp/mcpSchemaConverter';
import { Dictionary } from '../../../translation/locales';
import { prisma } from '../../../prisma';

export const examAutocompleteApiDoc: RouteConfig = {
  method: 'get',
  path: '/api/exam/autocomplete',
  query: examAutocompleteInputSchema,
  response: z.array(examAutocompleteOutputSchema),
};

export const examAutocompleteMcpTool = (dictionary: Dictionary): McpTool => ({
  name: 'exam_autocomplete',
  description: dictionary.exam.mcpDescription.autocomplete,
  requiredPermissions: { exam: ['autocomplete'] },
  schema: toMcpJsonSchema(examAutocompleteInputSchema),
  handler: async (params, context) => {
    return await examAutocompleteController(params, context);
  },
});

export async function examAutocompleteController(
  query: unknown,
  context: AppContext,
) {
  const { currentOrganization } = await authGuardBackend(
    {
      exam: ['autocomplete'],
    },
    context,
  );

  const { search, exclude, take, orderBy, course } =
    examAutocompleteInputSchema.parse(query);

  return await prisma.$withRLS(
    { organization: currentOrganization },
    async (tx) => {
      const whereAnd: Array<Prisma.ExamWhereInput> = [];

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
          name: {
            contains: search,
            mode: 'insensitive',
          },
        });
      }

      const exams = await tx.exam.findMany({
        where: {
          AND: whereAnd,
        },
        take,
        orderBy,
      });

      return exams.map((exam) => ({
        id: exam.id,
        name: String(exam.name),
      }));
    },
  );
}
