import { Prisma } from '../../../prisma/generated/client';
import { z } from 'zod';
import { AppContext } from '../../../shared/controller/appContext';
import { RouteConfig } from '../../../shared/openapi/routeToPath';
import { authGuardBackend } from '../../auth/authGuardBackend';
import {
  examTypeAutocompleteInputSchema,
  examTypeAutocompleteOutputSchema,
} from '../examTypeSchemas';
import { McpTool } from '../../mcp/mcpTypes';
import { toMcpJsonSchema } from '../../mcp/mcpSchemaConverter';
import { Dictionary } from '../../../translation/locales';
import { prisma } from '../../../prisma';

export const examTypeAutocompleteApiDoc: RouteConfig = {
  method: 'get',
  path: '/api/exam-type/autocomplete',
  query: examTypeAutocompleteInputSchema,
  response: z.array(examTypeAutocompleteOutputSchema),
};

export const examTypeAutocompleteMcpTool = (
  dictionary: Dictionary,
): McpTool => ({
  name: 'examType_autocomplete',
  description: dictionary.examType.mcpDescription.autocomplete,
  requiredPermissions: { examType: ['autocomplete'] },
  schema: toMcpJsonSchema(examTypeAutocompleteInputSchema),
  handler: async (params, context) => {
    return await examTypeAutocompleteController(params, context);
  },
});

export async function examTypeAutocompleteController(
  query: unknown,
  context: AppContext,
) {
  const { currentOrganization } = await authGuardBackend(
    {
      examType: ['autocomplete'],
    },
    context,
  );

  const { search, exclude, take, orderBy, course } =
    examTypeAutocompleteInputSchema.parse(query);

  return await prisma.$withRLS(
    { organization: currentOrganization },
    async (tx) => {
      const whereAnd: Array<Prisma.ExamTypeWhereInput> = [];

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

      const examTypes = await tx.examType.findMany({
        where: {
          AND: whereAnd,
        },
        take,
        orderBy,
      });

      return examTypes.map((examType) => ({
        id: examType.id,
        name: String(examType.name),
      }));
    },
  );
}
