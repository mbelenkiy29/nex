import { AppContext } from '../../../shared/controller/appContext';
import { RouteConfig } from '../../../shared/openapi/routeToPath';
import { authGuardBackend } from '../../auth/authGuardBackend';
import { examTypeDeleteManyInputSchema } from '../examTypeSchemas';
import { auditLogOperations } from '../../auditLog/auditLogOperations';
import { auditLogCreate } from '../../auditLog/auditLogCreate';
import { McpTool } from '../../mcp/mcpTypes';
import { toMcpJsonSchema } from '../../mcp/mcpSchemaConverter';
import { Dictionary } from '../../../translation/locales';
import { prisma } from '../../../prisma';

export const examTypeDeleteManyApiDoc: RouteConfig = {
  method: 'delete',
  path: '/api/exam-type',
  query: examTypeDeleteManyInputSchema,
};

export const examTypeDeleteManyMcpTool = (dictionary: Dictionary): McpTool => ({
  name: 'examType_delete_many',
  description: dictionary.examType.mcpDescription.delete,
  requiredPermissions: { examType: ['delete'] },
  schema: toMcpJsonSchema(examTypeDeleteManyInputSchema),
  handler: async (params, context) => {
    return await examTypeDeleteManyController(params, context);
  },
});

export async function examTypeDeleteManyController(
  query: unknown,
  context: AppContext,
) {
  const { currentOrganization } = await authGuardBackend(
    {
      examType: ['delete'],
    },
    context,
  );

  const { ids } = examTypeDeleteManyInputSchema.parse(query);

  return await prisma.$withRLS(
    { organization: currentOrganization },
    async (tx) => {
      const examTypesToDelete = await tx.examType.findMany({
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
          examInstances: {
            select: {
              id: true,
              status: true,
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

      const result = await tx.examType.deleteMany({
        where: {
          id: { in: ids },
          organizationId: currentOrganization.id,
        },
      });

      for (const examType of examTypesToDelete) {
        await auditLogCreate({
          entityId: examType.id,
          entityName: 'ExamType',
          operation: auditLogOperations.delete,
          context,
          oldData: examType,
          tx,
        });
      }

      return result;
    },
  );
}
