import { AppContext } from '../../../shared/controller/appContext';
import { RouteConfig } from '../../../shared/openapi/routeToPath';
import { authGuardBackend } from '../../auth/authGuardBackend';
import { examDeleteManyInputSchema } from '../examSchemas';
import { auditLogOperations } from '../../auditLog/auditLogOperations';
import { auditLogCreate } from '../../auditLog/auditLogCreate';
import { McpTool } from '../../mcp/mcpTypes';
import { toMcpJsonSchema } from '../../mcp/mcpSchemaConverter';
import { Dictionary } from '../../../translation/locales';
import { prisma } from '../../../prisma';

export const examDeleteManyApiDoc: RouteConfig = {
  method: 'delete',
  path: '/api/exam',
  query: examDeleteManyInputSchema,
};

export const examDeleteManyMcpTool = (dictionary: Dictionary): McpTool => ({
  name: 'exam_delete_many',
  description: dictionary.exam.mcpDescription.delete,
  requiredPermissions: { exam: ['delete'] },
  schema: toMcpJsonSchema(examDeleteManyInputSchema),
  handler: async (params, context) => {
    return await examDeleteManyController(params, context);
  },
});

export async function examDeleteManyController(
  query: unknown,
  context: AppContext,
) {
  const { currentOrganization } = await authGuardBackend(
    {
      exam: ['delete'],
    },
    context,
  );

  const { ids } = examDeleteManyInputSchema.parse(query);

  return await prisma.$withRLS(
    { organization: currentOrganization },
    async (tx) => {
      const examsToDelete = await tx.exam.findMany({
        where: {
          id: { in: ids },
          organizationId: currentOrganization.id,
        },
        include: {
          chapters: {
            select: {
              id: true,
              title: true,
            },
          },
          concepts: {
            select: {
              id: true,
              conceptName: true,
            },
          },
          examTypes: {
            select: {
              id: true,
              name: true,
            },
          },
          documentUploads: {
            select: {
              id: true,
              originalFilename: true,
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

      const result = await tx.exam.deleteMany({
        where: {
          id: { in: ids },
          organizationId: currentOrganization.id,
        },
      });

      for (const exam of examsToDelete) {
        await auditLogCreate({
          entityId: exam.id,
          entityName: 'Exam',
          operation: auditLogOperations.delete,
          context,
          oldData: exam,
          tx,
        });
      }

      return result;
    },
  );
}
