import { z } from 'zod';
import { prismaRelationship } from '../../../prisma/prismaRelationship';
import { AppContext } from '../../../shared/controller/appContext';
import { Error400 } from '../../../shared/errors/Error400';
import { RouteConfig } from '../../../shared/openapi/routeToPath';
import { dictionaryFormat } from '../../../translation/dictionaryFormat';
import { authGuardBackend } from '../../auth/authGuardBackend';
import { filePopulateDownloadUrlInTree } from '../../file/fileService';
import {
  examInstanceUpdateBodyInputSchema,
  examInstanceUpdateParamsInputSchema,
} from '../examInstanceSchemas';
import { auditLogOperations } from '../../auditLog/auditLogOperations';
import { auditLogCreate } from '../../auditLog/auditLogCreate';
import { McpTool } from '../../mcp/mcpTypes';
import { toMcpJsonSchema } from '../../mcp/mcpSchemaConverter';
import { Dictionary } from '../../../translation/locales';
import { prisma } from '../../../prisma';
import { courseLegacyLinkValidate } from '../../course/courseLegacyLink';

export const examInstanceUpdateApiDoc: RouteConfig = {
  method: 'put',
  path: '/api/exam-instance/{id}',
  params: examInstanceUpdateParamsInputSchema,
  body: examInstanceUpdateBodyInputSchema,
  response: 'ExamInstance',
};

export const examInstanceUpdateMcpTool = (dictionary: Dictionary): McpTool => ({
  name: 'examInstance_update',
  description: dictionary.examInstance.mcpDescription.update,
  requiredPermissions: { examInstance: ['update'] },
  schema: toMcpJsonSchema(
    z.object({
      id: z.string(),
      data: examInstanceUpdateBodyInputSchema,
    }),
  ),
  handler: async (params, context) => {
    return await examInstanceUpdateController(
      { id: params.id },
      params.data,
      context,
    );
  },
});

export async function examInstanceUpdateController(
  params: unknown,
  body: unknown,
  context: AppContext,
) {
  const { currentOrganization } = await authGuardBackend(
    {
      examInstance: ['update'],
    },
    context,
  );

  const { id } = examInstanceUpdateParamsInputSchema.parse(params);

  const data = examInstanceUpdateBodyInputSchema.parse(body);

  let examInstance = await prisma.$withRLS(
    { organization: currentOrganization },
    async (tx) => {
      if (data.updatedAt) {
        const currentExamInstance = await tx.examInstance.findUnique({
          where: {
            id_organizationId: {
              id,
              organizationId: currentOrganization.id,
            },
          },
          select: { updatedAt: true },
        });

        if (currentExamInstance) {
          const currentUpdatedAt = currentExamInstance.updatedAt.toISOString();
          const providedUpdatedAt =
            data.updatedAt instanceof Date
              ? data.updatedAt.toISOString()
              : data.updatedAt;

          if (currentUpdatedAt !== providedUpdatedAt) {
            throw new Error400(context.dictionary.shared.errors.staleData);
          }
        }
      }

      const oldExamInstance = await tx.examInstance.findUniqueOrThrow({
        where: {
          id_organizationId: {
            id,
            organizationId: currentOrganization.id,
          },
        },
        include: {
          course: {
            select: {
              id: true,
              title: true,
              slug: true,
            },
          },
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

      await courseLegacyLinkValidate(data.course, context, tx);

      await tx.examInstance.update({
        where: {
          id_organizationId: {
            id,
            organizationId: currentOrganization.id,
          },
        },
        data: {
          status: data.status,
          score: data.score,
          passed: data.passed,
          startedAt: data.startedAt,
          completedAt: data.completedAt,
          timeSpentSeconds: data.timeSpentSeconds,
          course: prismaRelationship.connectOrDisconnectOne(data.course),
          examType: prismaRelationship.connectOrDisconnectOne(data.examType),
          student: prismaRelationship.connectOrDisconnectOne(data.student),
          updatedByUserId: context.currentUser?.id,
          updatedByMember: prismaRelationship.connectOne(
            context.currentMember?.id,
          ),
        },
      });

      const updatedExamInstance = await tx.examInstance.findUniqueOrThrow({
        where: {
          id_organizationId: {
            id,
            organizationId: currentOrganization.id,
          },
        },
        include: {
          course: {
            select: {
              id: true,
              title: true,
              slug: true,
            },
          },
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

      await auditLogCreate({
        entityId: id,
        entityName: 'ExamInstance',
        operation: auditLogOperations.update,
        context,
        oldData: oldExamInstance,
        newData: updatedExamInstance,
        tx,
      });

      return updatedExamInstance;
    },
  );

  examInstance = await filePopulateDownloadUrlInTree(examInstance);

  return examInstance;
}
