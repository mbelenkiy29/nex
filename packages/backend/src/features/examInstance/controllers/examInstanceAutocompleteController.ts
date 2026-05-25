import { Prisma } from '../../../prisma/generated/client';
import { z } from 'zod';
import { AppContext } from '../../../shared/controller/appContext';
import { RouteConfig } from '../../../shared/openapi/routeToPath';
import { authGuardBackend } from '../../auth/authGuardBackend';
import {
  examInstanceAutocompleteInputSchema,
  examInstanceAutocompleteOutputSchema,
} from '../examInstanceSchemas';
import { McpTool } from '../../mcp/mcpTypes';
import { toMcpJsonSchema } from '../../mcp/mcpSchemaConverter';
import { Dictionary } from '../../../translation/locales';
import { prisma } from '../../../prisma';

export const examInstanceAutocompleteApiDoc: RouteConfig = {
  method: 'get',
  path: '/api/exam-instance/autocomplete',
  query: examInstanceAutocompleteInputSchema,
  response: z.array(examInstanceAutocompleteOutputSchema),
};

export const examInstanceAutocompleteMcpTool = (
  dictionary: Dictionary,
): McpTool => ({
  name: 'examInstance_autocomplete',
  description: dictionary.examInstance.mcpDescription.autocomplete,
  requiredPermissions: { examInstance: ['autocomplete'] },
  schema: toMcpJsonSchema(examInstanceAutocompleteInputSchema),
  handler: async (params, context) => {
    return await examInstanceAutocompleteController(params, context);
  },
});

export async function examInstanceAutocompleteController(
  query: unknown,
  context: AppContext,
) {
  const { currentOrganization } = await authGuardBackend(
    {
      examInstance: ['autocomplete'],
    },
    context,
  );

  const { search, exclude, take, orderBy, course } =
    examInstanceAutocompleteInputSchema.parse(query);

  return await prisma.$withRLS(
    { organization: currentOrganization },
    async (tx) => {
      const whereAnd: Array<Prisma.ExamInstanceWhereInput> = [];

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
          status: {
            contains: search,
            mode: 'insensitive',
          },
        });
      }

      const examInstances = await tx.examInstance.findMany({
        where: {
          AND: whereAnd,
        },
        take,
        orderBy,
      });

      return examInstances.map((examInstance) => ({
        id: examInstance.id,
        status: String(examInstance.status),
      }));
    },
  );
}
