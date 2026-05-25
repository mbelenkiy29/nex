import { AppContext } from '../../../shared/controller/appContext';
import { RouteConfig } from '../../../shared/openapi/routeToPath';
import { authGuardBackend } from '../../auth/authGuardBackend';
import { examInstanceArchiveManyInputSchema as examInstanceArchiveManyInputSchema } from '../examInstanceSchemas';
import { auditLogOperations } from '../../auditLog/auditLogOperations';
import { auditLogCreate } from '../../auditLog/auditLogCreate';
import { McpTool } from '../../mcp/mcpTypes';
import { toMcpJsonSchema } from '../../mcp/mcpSchemaConverter';
import { Dictionary } from '../../../translation/locales';
import { prisma } from '../../../prisma';

export const examInstanceArchiveManyApiDoc: RouteConfig = {
  method: 'put',
  path: '/api/exam-instance/archive',
  query: examInstanceArchiveManyInputSchema,
};

export const examInstanceArchiveManyMcpTool = (
  dictionary: Dictionary,
): McpTool => ({
  name: 'exam-instance_archive_many',
  description: dictionary.examInstance.mcpDescription.archive,
  requiredPermissions: { examInstance: ['archive'] },
  schema: toMcpJsonSchema(examInstanceArchiveManyInputSchema),
  handler: async (params, context) => {
    return await examInstanceArchiveManyController(params, context);
  },
});

export async function examInstanceArchiveManyController(
  query: unknown,
  context: AppContext,
) {
  const { currentMember, currentOrganization } = await authGuardBackend(
    {
      examInstance: ['archive'],
    },
    context,
  );

  const { ids } = examInstanceArchiveManyInputSchema.parse(query);

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
          archivedAt: new Date(),
          archivedByMemberId: currentMember.id,
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
