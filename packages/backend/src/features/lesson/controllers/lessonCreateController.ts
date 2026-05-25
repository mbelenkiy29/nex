import { z } from 'zod';
import { prismaRelationship } from '../../../prisma/prismaRelationship';
import { AppContext } from '../../../shared/controller/appContext';
import { Error400 } from '../../../shared/errors/Error400';
import { RouteConfig } from '../../../shared/openapi/routeToPath';
import { dictionaryFormat } from '../../../translation/dictionaryFormat';
import { authGuardBackend } from '../../auth/authGuardBackend';
import { filePopulateDownloadUrlInTree } from '../../file/fileService';
import { lessonCreateInputSchema } from '../lessonSchemas';
import { auditLogOperations } from '../../auditLog/auditLogOperations';
import { auditLogCreate } from '../../auditLog/auditLogCreate';
import { McpTool } from '../../mcp/mcpTypes';
import { toMcpJsonSchema } from '../../mcp/mcpSchemaConverter';
import { Dictionary } from '../../../translation/locales';
import { prisma } from '../../../prisma';
import { courseLegacyLinkValidate } from '../../course/courseLegacyLink';

export const lessonCreateApiDoc: RouteConfig = {
  method: 'post',
  path: '/api/lesson',
  body: lessonCreateInputSchema,
  response: 'Lesson',
};

export const lessonCreateMcpTool = (dictionary: Dictionary): McpTool => ({
  name: 'lesson_create',
  description: dictionary.lesson.mcpDescription.create,
  requiredPermissions: { lesson: ['create'] },
  schema: toMcpJsonSchema(lessonCreateInputSchema),
  handler: async (params, context) => {
    return await lessonCreateController(params, context);
  },
});

export async function lessonCreateController(
  body: unknown,
  context: AppContext,
) {
  await authGuardBackend(
    {
      lesson: ['create'],
    },
    context,
  );
  return await lessonCreate(body, context);
}

export async function lessonCreate(body: unknown, context: AppContext) {
  const currentOrganization = context.currentOrganization!;

  const data = lessonCreateInputSchema.parse(body);

  return await prisma.$withRLS(
    { organization: currentOrganization },
    async (tx) => {
      await courseLegacyLinkValidate(data.course, context, tx);

      const newLesson = await tx.lesson.create({
        data: {
          title: data.title,
          lessonNumber: data.lessonNumber,
          content: data.content,
          estimatedMinutes: data.estimatedMinutes,
          xpReward: data.xpReward,
          workflowStatus: data.workflowStatus,
          isPublished: data.isPublished,
          course: prismaRelationship.connectOne(data.course),
          chapter: prismaRelationship.connectOneOrThrow(data.chapter),
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
          studyNotes: {
            select: {
              id: true,
              title: true,
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
        entityId: newLesson.id,
        entityName: 'Lesson',
        operation: auditLogOperations.create,
        context,
        newData: newLesson,
        tx,
      });

      const lesson = await filePopulateDownloadUrlInTree(newLesson);

      return lesson;
    },
  );
}
