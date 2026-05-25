import { AppContext } from '../../../shared/controller/appContext';
import { RouteConfig } from '../../../shared/openapi/routeToPath';
import { authGuardBackend } from '../../auth/authGuardBackend';
import { conceptArchiveManyInputSchema as conceptArchiveManyInputSchema } from '../conceptSchemas';
import { auditLogOperations } from '../../auditLog/auditLogOperations';
import { auditLogCreate } from '../../auditLog/auditLogCreate';
import { McpTool } from '../../mcp/mcpTypes';
import { toMcpJsonSchema } from '../../mcp/mcpSchemaConverter';
import { Dictionary } from '../../../translation/locales';
import { prisma } from '../../../prisma';

export const conceptArchiveManyApiDoc: RouteConfig = {
  method: 'put',
  path: '/api/concept/archive',
  query: conceptArchiveManyInputSchema,
};

export const conceptArchiveManyMcpTool = (dictionary: Dictionary): McpTool => ({
  name: 'concept_archive_many',
  description: dictionary.concept.mcpDescription.archive,
  requiredPermissions: { concept: ['archive'] },
  schema: toMcpJsonSchema(conceptArchiveManyInputSchema),
  handler: async (params, context) => {
    return await conceptArchiveManyController(params, context);
  },
});

export async function conceptArchiveManyController(
  query: unknown,
  context: AppContext,
) {
  const { currentMember, currentOrganization } = await authGuardBackend(
    {
      concept: ['archive'],
    },
    context,
  );

  const { ids } = conceptArchiveManyInputSchema.parse(query);

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
          archivedAt: new Date(),
          archivedByMemberId: currentMember.id,
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
