import { AppContext } from '../../../shared/controller/appContext';
import { RouteConfig } from '../../../shared/openapi/routeToPath';
import { authGuardBackend } from '../../auth/authGuardBackend';
import { conceptRestoreManyInputSchema } from '../conceptSchemas';
import { auditLogOperations } from '../../auditLog/auditLogOperations';
import { auditLogCreate } from '../../auditLog/auditLogCreate';
import { McpTool } from '../../mcp/mcpTypes';
import { toMcpJsonSchema } from '../../mcp/mcpSchemaConverter';
import { Dictionary } from '../../../translation/locales';
import { prisma } from '../../../prisma';

export const conceptRestoreManyApiDoc: RouteConfig = {
  method: 'put',
  path: '/api/concept/restore',
  query: conceptRestoreManyInputSchema,
};

export const conceptRestoreManyMcpTool = (dictionary: Dictionary): McpTool => ({
  name: 'concept_restore_many',
  description: dictionary.concept.mcpDescription.restore,
  requiredPermissions: { concept: ['restore'] },
  schema: toMcpJsonSchema(conceptRestoreManyInputSchema),
  handler: async (params, context) => {
    return await conceptRestoreManyController(params, context);
  },
});

export async function conceptRestoreManyController(
  query: unknown,
  context: AppContext,
) {
  const { currentOrganization } = await authGuardBackend(
    {
      concept: ['restore'],
    },
    context,
  );

  const { ids } = conceptRestoreManyInputSchema.parse(query);

  return await prisma.$withRLS(
    { organization: currentOrganization },
    async (tx) => {
      const oldConcepts = await tx.concept.findMany({
        where: {
          id: { in: ids },
          organizationId: currentOrganization.id,
        },
        select: {
          id: true,
          archivedAt: true,
          archivedByMemberId: true,
        },
      });

      const result = await tx.concept.updateMany({
        where: {
          id: { in: ids },
          organizationId: currentOrganization.id,
        },
        data: {
          archivedAt: null,
          archivedByMemberId: null,
        },
      });

      const newConcepts = await tx.concept.findMany({
        where: {
          id: { in: ids },
          organizationId: currentOrganization.id,
        },
        select: {
          id: true,
          archivedAt: true,
          archivedByMemberId: true,
        },
      });

      for (const oldConcept of oldConcepts) {
        const newConcept = newConcepts.find((c) => c.id === oldConcept.id);
        await auditLogCreate({
          entityId: oldConcept.id,
          entityName: 'Concept',
          operation: auditLogOperations.update,
          context,
          oldData: oldConcept,
          newData: newConcept,
          tx,
        });
      }

      return result;
    },
  );
}
