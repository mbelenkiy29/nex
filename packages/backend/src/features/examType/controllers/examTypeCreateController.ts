import { z } from 'zod';
import { prismaRelationship } from '../../../prisma/prismaRelationship';
import { AppContext } from '../../../shared/controller/appContext';
import { Error400 } from '../../../shared/errors/Error400';
import { RouteConfig } from '../../../shared/openapi/routeToPath';
import { dictionaryFormat } from '../../../translation/dictionaryFormat';
import { authGuardBackend } from '../../auth/authGuardBackend';
import { filePopulateDownloadUrlInTree } from '../../file/fileService';
import { examTypeCreateInputSchema } from '../examTypeSchemas';
import { auditLogOperations } from '../../auditLog/auditLogOperations';
import { auditLogCreate } from '../../auditLog/auditLogCreate';
import { McpTool } from '../../mcp/mcpTypes';
import { toMcpJsonSchema } from '../../mcp/mcpSchemaConverter';
import { Dictionary } from '../../../translation/locales';
import { prisma } from '../../../prisma';
import { courseLegacyLinkValidate } from '../../course/courseLegacyLink';

export const examTypeCreateApiDoc: RouteConfig = {
  method: 'post',
  path: '/api/exam-type',
  body: examTypeCreateInputSchema,
  response: 'ExamType',
};

export const examTypeCreateMcpTool = (dictionary: Dictionary): McpTool => ({
  name: 'examType_create',
  description: dictionary.examType.mcpDescription.create,
  requiredPermissions: { examType: ['create'] },
  schema: toMcpJsonSchema(examTypeCreateInputSchema),
  handler: async (params, context) => {
    return await examTypeCreateController(params, context);
  },
});

export async function examTypeCreateController(
  body: unknown,
  context: AppContext,
) {
  await authGuardBackend(
    {
      examType: ['create'],
    },
    context,
  );
  return await examTypeCreate(body, context);
}

export async function examTypeCreate(body: unknown, context: AppContext) {
  const currentOrganization = context.currentOrganization!;

  const data = examTypeCreateInputSchema.parse(body);

  return await prisma.$withRLS(
    { organization: currentOrganization },
    async (tx) => {
      await courseLegacyLinkValidate(data.course, context, tx);

      const newExamType = await tx.examType.create({
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
          course: prismaRelationship.connectOne(data.course),
          exam: prismaRelationship.connectOneOrThrow(data.exam),
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
        entityId: newExamType.id,
        entityName: 'ExamType',
        operation: auditLogOperations.create,
        context,
        newData: newExamType,
        tx,
      });

      const examType = await filePopulateDownloadUrlInTree(newExamType);

      return examType;
    },
  );
}
