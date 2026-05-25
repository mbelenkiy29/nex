import { z } from 'zod';
import { prismaRelationship } from '../../../prisma/prismaRelationship';
import { AppContext } from '../../../shared/controller/appContext';
import { Error400 } from '../../../shared/errors/Error400';
import { RouteConfig } from '../../../shared/openapi/routeToPath';
import { dictionaryFormat } from '../../../translation/dictionaryFormat';
import { authGuardBackend } from '../../auth/authGuardBackend';
import { filePopulateDownloadUrlInTree } from '../../file/fileService';
import { practiceQuestionCreateInputSchema } from '../practiceQuestionSchemas';
import { auditLogOperations } from '../../auditLog/auditLogOperations';
import { auditLogCreate } from '../../auditLog/auditLogCreate';
import { McpTool } from '../../mcp/mcpTypes';
import { toMcpJsonSchema } from '../../mcp/mcpSchemaConverter';
import { Dictionary } from '../../../translation/locales';
import { prisma } from '../../../prisma';
import { courseLegacyLinkValidate } from '../../course/courseLegacyLink';

export const practiceQuestionCreateApiDoc: RouteConfig = {
  method: 'post',
  path: '/api/practice-question',
  body: practiceQuestionCreateInputSchema,
  response: 'PracticeQuestion',
};

export const practiceQuestionCreateMcpTool = (
  dictionary: Dictionary,
): McpTool => ({
  name: 'practiceQuestion_create',
  description: dictionary.practiceQuestion.mcpDescription.create,
  requiredPermissions: { practiceQuestion: ['create'] },
  schema: toMcpJsonSchema(practiceQuestionCreateInputSchema),
  handler: async (params, context) => {
    return await practiceQuestionCreateController(params, context);
  },
});

export async function practiceQuestionCreateController(
  body: unknown,
  context: AppContext,
) {
  await authGuardBackend(
    {
      practiceQuestion: ['create'],
    },
    context,
  );
  return await practiceQuestionCreate(body, context);
}

export async function practiceQuestionCreate(
  body: unknown,
  context: AppContext,
) {
  const currentOrganization = context.currentOrganization!;

  const data = practiceQuestionCreateInputSchema.parse(body);

  return await prisma.$withRLS(
    { organization: currentOrganization },
    async (tx) => {
      await courseLegacyLinkValidate(data.course, context, tx);

      const newPracticeQuestion = await tx.practiceQuestion.create({
        data: {
          questionText: data.questionText,
          correctAnswerIndex: data.correctAnswerIndex,
          answerOptions: data.answerOptions || [],
          explanation: data.explanation,
          difficulty: data.difficulty,
          category: data.category,
          isActive: data.isActive,
          tags: data.tags,
          course: prismaRelationship.connectOne(data.course),
          chapter: prismaRelationship.connectOneOrThrow(data.chapter),
          concepts: prismaRelationship.connectMany(data.concepts),
          importHash: data.importHash,
          organization: prismaRelationship.connectOneOrThrow(
            context.currentOrganization!.id,
          ),
          createdByMember: prismaRelationship.connectOne(
            context.currentMember?.id,
          ),
          createdByUserId: context.currentUser?.id,
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
        entityId: newPracticeQuestion.id,
        entityName: 'PracticeQuestion',
        operation: auditLogOperations.create,
        context,
        newData: newPracticeQuestion,
        tx,
      });

      const practiceQuestion =
        await filePopulateDownloadUrlInTree(newPracticeQuestion);

      return practiceQuestion;
    },
  );
}
