import { AppContext } from '../../../shared/controller/appContext';
import { RouteConfig } from '../../../shared/openapi/routeToPath';
import { authGuardBackend } from '../../auth/authGuardBackend';
import { conceptDeleteManyInputSchema } from '../conceptSchemas';
import { auditLogOperations } from '../../auditLog/auditLogOperations';
import { auditLogCreate } from '../../auditLog/auditLogCreate';
import { McpTool } from '../../mcp/mcpTypes';
import { toMcpJsonSchema } from '../../mcp/mcpSchemaConverter';
import { Dictionary } from '../../../translation/locales';
import { prisma } from '../../../prisma';

export const conceptDeleteManyApiDoc: RouteConfig = {
  method: 'delete',
  path: '/api/concept',
  query: conceptDeleteManyInputSchema,
};

export const conceptDeleteManyMcpTool = (dictionary: Dictionary): McpTool => ({
  name: 'concept_delete_many',
  description: dictionary.concept.mcpDescription.delete,
  requiredPermissions: { concept: ['delete'] },
  schema: toMcpJsonSchema(conceptDeleteManyInputSchema),
  handler: async (params, context) => {
    return await conceptDeleteManyController(params, context);
  },
});

export async function conceptDeleteManyController(
  query: unknown,
  context: AppContext,
) {
  const { currentOrganization } = await authGuardBackend(
    {
      concept: ['delete'],
    },
    context,
  );

  const { ids } = conceptDeleteManyInputSchema.parse(query);

  return await prisma.$withRLS(
    { organization: currentOrganization },
    async (tx) => {
      const conceptsToDelete = await tx.concept.findMany({
        where: {
          id: { in: ids },
          organizationId: currentOrganization.id,
        },
        include: {
          exam: {
            select: {
              id: true,
              name: true,
            },
          },
          practiceQuestions: {
            select: {
              id: true,
              questionText: true,
            },
          },
          createdByMember: {
            select: {
              id: true,
              fullName: true,
              user: {
                select: {
                  email: true,
                },
              },
            },
          },
          updatedByMember: {
            select: {
              id: true,
              fullName: true,
              user: {
                select: {
                  email: true,
                },
              },
            },
          },
          archivedByMember: {
            select: {
              id: true,
              fullName: true,
              user: {
                select: {
                  email: true,
                },
              },
            },
          },
        },
      });

      const result = await tx.concept.deleteMany({
        where: {
          id: { in: ids },
          organizationId: currentOrganization.id,
        },
      });

      for (const concept of conceptsToDelete) {
        await auditLogCreate({
          entityId: concept.id,
          entityName: 'Concept',
          operation: auditLogOperations.delete,
          context,
          oldData: concept,
          tx,
        });
      }

      return result;
    },
  );
}
