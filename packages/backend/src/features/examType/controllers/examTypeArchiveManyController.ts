import { AppContext } from '../../../shared/controller/appContext';
import { RouteConfig } from '../../../shared/openapi/routeToPath';
import { authGuardBackend } from '../../auth/authGuardBackend';
import { examTypeArchiveManyInputSchema as examTypeArchiveManyInputSchema } from '../examTypeSchemas';
import { auditLogOperations } from '../../auditLog/auditLogOperations';
import { auditLogCreate } from '../../auditLog/auditLogCreate';
import { McpTool } from '../../mcp/mcpTypes';
import { toMcpJsonSchema } from '../../mcp/mcpSchemaConverter';
import { Dictionary } from '../../../translation/locales';
import { prisma } from '../../../prisma';

export const examTypeArchiveManyApiDoc: RouteConfig = {
  method: 'put',
  path: '/api/exam-type/archive',
  query: examTypeArchiveManyInputSchema,
};

export const examTypeArchiveManyMcpTool = (
  dictionary: Dictionary,
): McpTool => ({
  name: 'exam-type_archive_many',
  description: dictionary.examType.mcpDescription.archive,
  requiredPermissions: { examType: ['archive'] },
  schema: toMcpJsonSchema(examTypeArchiveManyInputSchema),
  handler: async (params, context) => {
    return await examTypeArchiveManyController(params, context);
  },
});

export async function examTypeArchiveManyController(
  query: unknown,
  context: AppContext,
) {
  const { currentMember, currentOrganization } = await authGuardBackend(
    {
      examType: ['archive'],
    },
    context,
  );

  const { ids } = examTypeArchiveManyInputSchema.parse(query);

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
          archivedAt: new Date(),
          archivedByMemberId: currentMember.id,
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
