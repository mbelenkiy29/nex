import { AppContext } from '../../../shared/controller/appContext';
import { RouteConfig } from '../../../shared/openapi/routeToPath';
import { authGuardBackend } from '../../auth/authGuardBackend';
import { examRestoreManyInputSchema } from '../examSchemas';
import { auditLogOperations } from '../../auditLog/auditLogOperations';
import { auditLogCreate } from '../../auditLog/auditLogCreate';
import { McpTool } from '../../mcp/mcpTypes';
import { toMcpJsonSchema } from '../../mcp/mcpSchemaConverter';
import { Dictionary } from '../../../translation/locales';
import { prisma } from '../../../prisma';

export const examRestoreManyApiDoc: RouteConfig = {
  method: 'put',
  path: '/api/exam/restore',
  query: examRestoreManyInputSchema,
};

export const examRestoreManyMcpTool = (dictionary: Dictionary): McpTool => ({
  name: 'exam_restore_many',
  description: dictionary.exam.mcpDescription.restore,
  requiredPermissions: { exam: ['restore'] },
  schema: toMcpJsonSchema(examRestoreManyInputSchema),
  handler: async (params, context) => {
    return await examRestoreManyController(params, context);
  },
});

export async function examRestoreManyController(
  query: unknown,
  context: AppContext,
) {
  const { currentOrganization } = await authGuardBackend(
    {
      exam: ['restore'],
    },
    context,
  );

  const { ids } = examRestoreManyInputSchema.parse(query);

  return await prisma.$withRLS(
    { organization: currentOrganization },
    async (tx) => {
      const oldExams = await tx.exam.findMany({
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

      const result = await tx.exam.updateMany({
        where: {
          id: { in: ids },
          organizationId: currentOrganization.id,
        },
        data: {
          archivedAt: null,
          archivedByMemberId: null,
        },
      });

      const newExams = await tx.exam.findMany({
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

      for (const oldExam of oldExams) {
        const newExam = newExams.find((c) => c.id === oldExam.id);
        await auditLogCreate({
          entityId: oldExam.id,
          entityName: 'Exam',
          operation: auditLogOperations.update,
          context,
          oldData: oldExam,
          newData: newExam,
          tx,
        });
      }

      return result;
    },
  );
}
