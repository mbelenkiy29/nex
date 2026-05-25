import { AppContext } from '../../../shared/controller/appContext';
import { RouteConfig } from '../../../shared/openapi/routeToPath';
import { authGuardBackend } from '../../auth/authGuardBackend';
import { examArchiveManyInputSchema as examArchiveManyInputSchema } from '../examSchemas';
import { auditLogOperations } from '../../auditLog/auditLogOperations';
import { auditLogCreate } from '../../auditLog/auditLogCreate';
import { McpTool } from '../../mcp/mcpTypes';
import { toMcpJsonSchema } from '../../mcp/mcpSchemaConverter';
import { Dictionary } from '../../../translation/locales';
import { prisma } from '../../../prisma';

export const examArchiveManyApiDoc: RouteConfig = {
  method: 'put',
  path: '/api/exam/archive',
  query: examArchiveManyInputSchema,
};

export const examArchiveManyMcpTool = (dictionary: Dictionary): McpTool => ({
  name: 'exam_archive_many',
  description: dictionary.exam.mcpDescription.archive,
  requiredPermissions: { exam: ['archive'] },
  schema: toMcpJsonSchema(examArchiveManyInputSchema),
  handler: async (params, context) => {
    return await examArchiveManyController(params, context);
  },
});

export async function examArchiveManyController(
  query: unknown,
  context: AppContext,
) {
  const { currentMember, currentOrganization } = await authGuardBackend(
    {
      exam: ['archive'],
    },
    context,
  );

  const { ids } = examArchiveManyInputSchema.parse(query);

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
          archivedAt: new Date(),
          archivedByMemberId: currentMember.id,
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
