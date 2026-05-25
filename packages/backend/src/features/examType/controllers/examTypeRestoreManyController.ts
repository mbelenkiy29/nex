import { AppContext } from '../../../shared/controller/appContext';
import { RouteConfig } from '../../../shared/openapi/routeToPath';
import { authGuardBackend } from '../../auth/authGuardBackend';
import { examTypeRestoreManyInputSchema } from '../examTypeSchemas';
import { auditLogOperations } from '../../auditLog/auditLogOperations';
import { auditLogCreate } from '../../auditLog/auditLogCreate';
import { McpTool } from '../../mcp/mcpTypes';
import { toMcpJsonSchema } from '../../mcp/mcpSchemaConverter';
import { Dictionary } from '../../../translation/locales';
import { prisma } from '../../../prisma';

export const examTypeRestoreManyApiDoc: RouteConfig = {
  method: 'put',
  path: '/api/exam-type/restore',
  query: examTypeRestoreManyInputSchema,
};

export const examTypeRestoreManyMcpTool = (
  dictionary: Dictionary,
): McpTool => ({
  name: 'exam-type_restore_many',
  description: dictionary.examType.mcpDescription.restore,
  requiredPermissions: { examType: ['restore'] },
  schema: toMcpJsonSchema(examTypeRestoreManyInputSchema),
  handler: async (params, context) => {
    return await examTypeRestoreManyController(params, context);
  },
});

export async function examTypeRestoreManyController(
  query: unknown,
  context: AppContext,
) {
  const { currentOrganization } = await authGuardBackend(
    {
      examType: ['restore'],
    },
    context,
  );

  const { ids } = examTypeRestoreManyInputSchema.parse(query);

  return await prisma.$withRLS(
    { organization: currentOrganization },
    async (tx) => {
      const oldExamTypes = await tx.examType.findMany({
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

      const result = await tx.examType.updateMany({
        where: {
          id: { in: ids },
          organizationId: currentOrganization.id,
        },
        data: {
          archivedAt: null,
          archivedByMemberId: null,
        },
      });

      const newExamTypes = await tx.examType.findMany({
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

      for (const oldExamType of oldExamTypes) {
        const newExamType = newExamTypes.find((c) => c.id === oldExamType.id);
        await auditLogCreate({
          entityId: oldExamType.id,
          entityName: 'ExamType',
          operation: auditLogOperations.update,
          context,
          oldData: oldExamType,
          newData: newExamType,
          tx,
        });
      }

      return result;
    },
  );
}
