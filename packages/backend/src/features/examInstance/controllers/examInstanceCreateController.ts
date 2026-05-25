import { z } from 'zod';
import { prismaRelationship } from '../../../prisma/prismaRelationship';
import { AppContext } from '../../../shared/controller/appContext';
import { Error400 } from '../../../shared/errors/Error400';
import { RouteConfig } from '../../../shared/openapi/routeToPath';
import { dictionaryFormat } from '../../../translation/dictionaryFormat';
import { authGuardBackend } from '../../auth/authGuardBackend';
import { filePopulateDownloadUrlInTree } from '../../file/fileService';
import { examInstanceCreateInputSchema } from '../examInstanceSchemas';
import { auditLogOperations } from '../../auditLog/auditLogOperations';
import { auditLogCreate } from '../../auditLog/auditLogCreate';
import { McpTool } from '../../mcp/mcpTypes';
import { toMcpJsonSchema } from '../../mcp/mcpSchemaConverter';
import { Dictionary } from '../../../translation/locales';
import { prisma } from '../../../prisma';
import { courseLegacyLinkValidate } from '../../course/courseLegacyLink';

export const examInstanceCreateApiDoc: RouteConfig = {
  method: 'post',
  path: '/api/exam-instance',
  body: examInstanceCreateInputSchema,
  response: 'ExamInstance',
};

export const examInstanceCreateMcpTool = (dictionary: Dictionary): McpTool => ({
  name: 'examInstance_create',
  description: dictionary.examInstance.mcpDescription.create,
  requiredPermissions: { examInstance: ['create'] },
  schema: toMcpJsonSchema(examInstanceCreateInputSchema),
  handler: async (params, context) => {
    return await examInstanceCreateController(params, context);
  },
});

export async function examInstanceCreateController(
  body: unknown,
  context: AppContext,
) {
  await authGuardBackend(
    {
      examInstance: ['create'],
    },
    context,
  );
  return await examInstanceCreate(body, context);
}

export async function examInstanceCreate(body: unknown, context: AppContext) {
  const currentOrganization = context.currentOrganization!;

  const data = examInstanceCreateInputSchema.parse(body);

  return await prisma.$withRLS(
    { organization: currentOrganization },
    async (tx) => {
      await courseLegacyLinkValidate(data.course, context, tx);

      const newExamInstance = await tx.examInstance.create({
        data: {
          status: data.status,
          score: data.score,
          passed: data.passed,
          startedAt: data.startedAt,
          completedAt: data.completedAt,
          timeSpentSeconds: data.timeSpentSeconds,
          course: prismaRelationship.connectOne(data.course),
          examType: prismaRelationship.connectOneOrThrow(data.examType),
          student: prismaRelationship.connectOneOrThrow(data.student),
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
        entityId: newExamInstance.id,
        entityName: 'ExamInstance',
        operation: auditLogOperations.create,
        context,
        newData: newExamInstance,
        tx,
      });

      const examInstance = await filePopulateDownloadUrlInTree(newExamInstance);

      return examInstance;
    },
  );
}
