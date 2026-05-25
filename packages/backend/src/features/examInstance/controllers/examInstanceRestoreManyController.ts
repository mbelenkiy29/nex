import { AppContext } from '../../../shared/controller/appContext';
import { RouteConfig } from '../../../shared/openapi/routeToPath';
import { authGuardBackend } from '../../auth/authGuardBackend';
import { examInstanceRestoreManyInputSchema } from '../examInstanceSchemas';
import { auditLogOperations } from '../../auditLog/auditLogOperations';
import { auditLogCreate } from '../../auditLog/auditLogCreate';
import { McpTool } from '../../mcp/mcpTypes';
import { toMcpJsonSchema } from '../../mcp/mcpSchemaConverter';
import { Dictionary } from '../../../translation/locales';
import { prisma } from '../../../prisma';

export const examInstanceRestoreManyApiDoc: RouteConfig = {
  method: 'put',
  path: '/api/exam-instance/restore',
  query: examInstanceRestoreManyInputSchema,
};

export const examInstanceRestoreManyMcpTool = (
  dictionary: Dictionary,
): McpTool => ({
  name: 'exam-instance_restore_many',
  description: dictionary.examInstance.mcpDescription.restore,
  requiredPermissions: { examInstance: ['restore'] },
  schema: toMcpJsonSchema(examInstanceRestoreManyInputSchema),
  handler: async (params, context) => {
    return await examInstanceRestoreManyController(params, context);
  },
});

export async function examInstanceRestoreManyController(
  query: unknown,
  context: AppContext,
) {
  const { currentOrganization } = await authGuardBackend(
    {
      examInstance: ['restore'],
    },
    context,
  );

  const { ids } = examInstanceRestoreManyInputSchema.parse(query);

  return await prisma.$withRLS(
    { organization: currentOrganization },
    async (tx) => {
      const oldExamInstances = await tx.examInstance.findMany({
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

      const result = await tx.examInstance.updateMany({
        where: {
          id: { in: ids },
          organizationId: currentOrganization.id,
        },
        data: {
          archivedAt: null,
          archivedByMemberId: null,
        },
      });

      const newExamInstances = await tx.examInstance.findMany({
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

      for (const oldExamInstance of oldExamInstances) {
        const newExamInstance = newExamInstances.find(
          (c) => c.id === oldExamInstance.id,
        );
        await auditLogCreate({
          entityId: oldExamInstance.id,
          entityName: 'ExamInstance',
          operation: auditLogOperations.update,
          context,
          oldData: oldExamInstance,
          newData: newExamInstance,
          tx,
        });
      }

      return result;
    },
  );
}
