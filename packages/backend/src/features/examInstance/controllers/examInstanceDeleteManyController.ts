import { AppContext } from '../../../shared/controller/appContext';
import { RouteConfig } from '../../../shared/openapi/routeToPath';
import { authGuardBackend } from '../../auth/authGuardBackend';
import { examInstanceDeleteManyInputSchema } from '../examInstanceSchemas';
import { auditLogOperations } from '../../auditLog/auditLogOperations';
import { auditLogCreate } from '../../auditLog/auditLogCreate';
import { McpTool } from '../../mcp/mcpTypes';
import { toMcpJsonSchema } from '../../mcp/mcpSchemaConverter';
import { Dictionary } from '../../../translation/locales';
import { prisma } from '../../../prisma';

export const examInstanceDeleteManyApiDoc: RouteConfig = {
  method: 'delete',
  path: '/api/exam-instance',
  query: examInstanceDeleteManyInputSchema,
};

export const examInstanceDeleteManyMcpTool = (
  dictionary: Dictionary,
): McpTool => ({
  name: 'examInstance_delete_many',
  description: dictionary.examInstance.mcpDescription.delete,
  requiredPermissions: { examInstance: ['delete'] },
  schema: toMcpJsonSchema(examInstanceDeleteManyInputSchema),
  handler: async (params, context) => {
    return await examInstanceDeleteManyController(params, context);
  },
});

export async function examInstanceDeleteManyController(
  query: unknown,
  context: AppContext,
) {
  const { currentOrganization } = await authGuardBackend(
    {
      examInstance: ['delete'],
    },
    context,
  );

  const { ids } = examInstanceDeleteManyInputSchema.parse(query);

  return await prisma.$withRLS(
    { organization: currentOrganization },
    async (tx) => {
      const examInstancesToDelete = await tx.examInstance.findMany({
        where: {
          id: { in: ids },
          organizationId: currentOrganization.id,
        },
        include: {
          examType: {
            select: {
              id: true,
              name: true,
            },
          },
          student: {
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

      const result = await tx.examInstance.deleteMany({
        where: {
          id: { in: ids },
          organizationId: currentOrganization.id,
        },
      });

      for (const examInstance of examInstancesToDelete) {
        await auditLogCreate({
          entityId: examInstance.id,
          entityName: 'ExamInstance',
          operation: auditLogOperations.delete,
          context,
          oldData: examInstance,
          tx,
        });
      }

      return result;
    },
  );
}
