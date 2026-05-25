import { z } from 'zod';
import { prismaRelationship } from '../../../prisma/prismaRelationship';
import { AppContext } from '../../../shared/controller/appContext';
import { Error400 } from '../../../shared/errors/Error400';
import { RouteConfig } from '../../../shared/openapi/routeToPath';
import { dictionaryFormat } from '../../../translation/dictionaryFormat';
import { authGuardBackend } from '../../auth/authGuardBackend';
import { filePopulateDownloadUrlInTree } from '../../file/fileService';
import {
  practiceQuestionUpdateBodyInputSchema,
  practiceQuestionUpdateParamsInputSchema,
} from '../practiceQuestionSchemas';
import { auditLogOperations } from '../../auditLog/auditLogOperations';
import { auditLogCreate } from '../../auditLog/auditLogCreate';
import { McpTool } from '../../mcp/mcpTypes';
import { toMcpJsonSchema } from '../../mcp/mcpSchemaConverter';
import { Dictionary } from '../../../translation/locales';
import { prisma } from '../../../prisma';
import { courseLegacyLinkValidate } from '../../course/courseLegacyLink';

export const practiceQuestionUpdateApiDoc: RouteConfig = {
  method: 'put',
  path: '/api/practice-question/{id}',
  params: practiceQuestionUpdateParamsInputSchema,
  body: practiceQuestionUpdateBodyInputSchema,
  response: 'PracticeQuestion',
};

export const practiceQuestionUpdateMcpTool = (
  dictionary: Dictionary,
): McpTool => ({
  name: 'practiceQuestion_update',
  description: dictionary.practiceQuestion.mcpDescription.update,
  requiredPermissions: { practiceQuestion: ['update'] },
  schema: toMcpJsonSchema(
    z.object({
      id: z.string(),
      data: practiceQuestionUpdateBodyInputSchema,
    }),
  ),
  handler: async (params, context) => {
    return await practiceQuestionUpdateController(
      { id: params.id },
      params.data,
      context,
    );
  },
});

export async function practiceQuestionUpdateController(
  params: unknown,
  body: unknown,
  context: AppContext,
) {
  const { currentOrganization } = await authGuardBackend(
    {
      practiceQuestion: ['update'],
    },
    context,
  );

  const { id } = practiceQuestionUpdateParamsInputSchema.parse(params);

  const data = practiceQuestionUpdateBodyInputSchema.parse(body);

  let practiceQuestion = await prisma.$withRLS(
    { organization: currentOrganization },
    async (tx) => {
      if (data.updatedAt) {
        const currentPracticeQuestion = await tx.practiceQuestion.findUnique({
          where: {
            id_organizationId: {
              id,
              organizationId: currentOrganization.id,
            },
          },
          select: { updatedAt: true },
        });

        if (currentPracticeQuestion) {
          const currentUpdatedAt =
            currentPracticeQuestion.updatedAt.toISOString();
          const providedUpdatedAt =
            data.updatedAt instanceof Date
              ? data.updatedAt.toISOString()
              : data.updatedAt;

          if (currentUpdatedAt !== providedUpdatedAt) {
            throw new Error400(context.dictionary.shared.errors.staleData);
          }
        }
      }

      const oldPracticeQuestion = await tx.practiceQuestion.findUniqueOrThrow({
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
          chapter: {
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

      await tx.practiceQuestion.update({
        where: {
          id_organizationId: {
            id,
            organizationId: currentOrganization.id,
          },
        },
        data: {
          questionText: data.questionText,
          correctAnswerIndex: data.correctAnswerIndex,
          answerOptions: data.answerOptions,
          explanation: data.explanation,
          difficulty: data.difficulty,
          category: data.category,
          isActive: data.isActive,
          tags: data.tags,
          course: prismaRelationship.connectOrDisconnectOne(data.course),
          chapter: prismaRelationship.connectOrDisconnectOne(data.chapter),
          concepts: prismaRelationship.setMany(data.concepts),
          updatedByUserId: context.currentUser?.id,
          updatedByMember: prismaRelationship.connectOne(
            context.currentMember?.id,
          ),
        },
      });

      const updatedPracticeQuestion =
        await tx.practiceQuestion.findUniqueOrThrow({
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
          chapter: {
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
        entityName: 'PracticeQuestion',
        operation: auditLogOperations.update,
        context,
        oldData: oldPracticeQuestion,
        newData: updatedPracticeQuestion,
        tx,
      });

      return updatedPracticeQuestion;
    },
  );

  practiceQuestion = await filePopulateDownloadUrlInTree(practiceQuestion);

  return practiceQuestion;
}
