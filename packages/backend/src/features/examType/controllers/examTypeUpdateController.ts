import { z } from 'zod';
import { prismaRelationship } from '../../../prisma/prismaRelationship';
import { AppContext } from '../../../shared/controller/appContext';
import { Error400 } from '../../../shared/errors/Error400';
import { RouteConfig } from '../../../shared/openapi/routeToPath';
import { dictionaryFormat } from '../../../translation/dictionaryFormat';
import { authGuardBackend } from '../../auth/authGuardBackend';
import { filePopulateDownloadUrlInTree } from '../../file/fileService';
import {
  examTypeUpdateBodyInputSchema,
  examTypeUpdateParamsInputSchema,
} from '../examTypeSchemas';
import { auditLogOperations } from '../../auditLog/auditLogOperations';
import { auditLogCreate } from '../../auditLog/auditLogCreate';
import { McpTool } from '../../mcp/mcpTypes';
import { toMcpJsonSchema } from '../../mcp/mcpSchemaConverter';
import { Dictionary } from '../../../translation/locales';
import { prisma } from '../../../prisma';
import { courseLegacyLinkValidate } from '../../course/courseLegacyLink';

export const examTypeUpdateApiDoc: RouteConfig = {
  method: 'put',
  path: '/api/exam-type/{id}',
  params: examTypeUpdateParamsInputSchema,
  body: examTypeUpdateBodyInputSchema,
  response: 'ExamType',
};

export const examTypeUpdateMcpTool = (dictionary: Dictionary): McpTool => ({
  name: 'examType_update',
  description: dictionary.examType.mcpDescription.update,
  requiredPermissions: { examType: ['update'] },
  schema: toMcpJsonSchema(
    z.object({
      id: z.string(),
      data: examTypeUpdateBodyInputSchema,
    }),
  ),
  handler: async (params, context) => {
    return await examTypeUpdateController(
      { id: params.id },
      params.data,
      context,
    );
  },
});

export async function examTypeUpdateController(
  params: unknown,
  body: unknown,
  context: AppContext,
) {
  const { currentOrganization } = await authGuardBackend(
    {
      examType: ['update'],
    },
    context,
  );

  const { id } = examTypeUpdateParamsInputSchema.parse(params);

  const data = examTypeUpdateBodyInputSchema.parse(body);

  let examType = await prisma.$withRLS(
    { organization: currentOrganization },
    async (tx) => {
      if (data.updatedAt) {
        const currentExamType = await tx.examType.findUnique({
          where: {
            id_organizationId: {
              id,
              organizationId: currentOrganization.id,
            },
          },
          select: { updatedAt: true },
        });

        if (currentExamType) {
          const currentUpdatedAt = currentExamType.updatedAt.toISOString();
          const providedUpdatedAt =
            data.updatedAt instanceof Date
              ? data.updatedAt.toISOString()
              : data.updatedAt;

          if (currentUpdatedAt !== providedUpdatedAt) {
            throw new Error400(context.dictionary.shared.errors.staleData);
          }
        }
      }

      const oldExamType = await tx.examType.findUniqueOrThrow({
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

      await courseLegacyLinkValidate(data.course, context, tx);

      await tx.examType.update({
        where: {
          id_organizationId: {
            id,
            organizationId: currentOrganization.id,
          },
        },
        data: {
          name: data.name,
          description: data.description,
          type: data.type,
          questionCount: data.questionCount,
          timeLimitMinutes: data.timeLimitMinutes,
          passingScore: data.passingScore,
          maxAttempts: data.maxAttempts,
          shuffleQuestions: data.shuffleQuestions,
          showAnswersImmediately: data.showAnswersImmediately,
          isActive: data.isActive,
          course: prismaRelationship.connectOrDisconnectOne(data.course),
          exam: prismaRelationship.connectOrDisconnectOne(data.exam),
          updatedByUserId: context.currentUser?.id,
          updatedByMember: prismaRelationship.connectOne(
            context.currentMember?.id,
          ),
        },
      });

      const updatedExamType = await tx.examType.findUniqueOrThrow({
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

      await auditLogCreate({
        entityId: id,
        entityName: 'ExamType',
        operation: auditLogOperations.update,
        context,
        oldData: oldExamType,
        newData: updatedExamType,
        tx,
      });

      return updatedExamType;
    },
  );

  examType = await filePopulateDownloadUrlInTree(examType);

  return examType;
}
