import { z } from 'zod';
import { prismaRelationship } from '../../../prisma/prismaRelationship';
import { AppContext } from '../../../shared/controller/appContext';
import { Error400 } from '../../../shared/errors/Error400';
import { RouteConfig } from '../../../shared/openapi/routeToPath';
import { dictionaryFormat } from '../../../translation/dictionaryFormat';
import { authGuardBackend } from '../../auth/authGuardBackend';
import { filePopulateDownloadUrlInTree } from '../../file/fileService';
import {
  lessonUpdateBodyInputSchema,
  lessonUpdateParamsInputSchema,
} from '../lessonSchemas';
import { auditLogOperations } from '../../auditLog/auditLogOperations';
import { auditLogCreate } from '../../auditLog/auditLogCreate';
import { McpTool } from '../../mcp/mcpTypes';
import { toMcpJsonSchema } from '../../mcp/mcpSchemaConverter';
import { Dictionary } from '../../../translation/locales';
import { prisma } from '../../../prisma';
import { courseLegacyLinkValidate } from '../../course/courseLegacyLink';

export const lessonUpdateApiDoc: RouteConfig = {
  method: 'put',
  path: '/api/lesson/{id}',
  params: lessonUpdateParamsInputSchema,
  body: lessonUpdateBodyInputSchema,
  response: 'Lesson',
};

export const lessonUpdateMcpTool = (dictionary: Dictionary): McpTool => ({
  name: 'lesson_update',
  description: dictionary.lesson.mcpDescription.update,
  requiredPermissions: { lesson: ['update'] },
  schema: toMcpJsonSchema(
    z.object({
      id: z.string(),
      data: lessonUpdateBodyInputSchema,
    }),
  ),
  handler: async (params, context) => {
    return await lessonUpdateController(
      { id: params.id },
      params.data,
      context,
    );
  },
});

export async function lessonUpdateController(
  params: unknown,
  body: unknown,
  context: AppContext,
) {
  const { currentOrganization } = await authGuardBackend(
    {
      lesson: ['update'],
    },
    context,
  );

  const { id } = lessonUpdateParamsInputSchema.parse(params);

  const data = lessonUpdateBodyInputSchema.parse(body);

  let lesson = await prisma.$withRLS(
    { organization: currentOrganization },
    async (tx) => {
      if (data.updatedAt) {
        const currentLesson = await tx.lesson.findUnique({
          where: {
            id_organizationId: {
              id,
              organizationId: currentOrganization.id,
            },
          },
          select: { updatedAt: true },
        });

        if (currentLesson) {
          const currentUpdatedAt = currentLesson.updatedAt.toISOString();
          const providedUpdatedAt =
            data.updatedAt instanceof Date
              ? data.updatedAt.toISOString()
              : data.updatedAt;

          if (currentUpdatedAt !== providedUpdatedAt) {
            throw new Error400(context.dictionary.shared.errors.staleData);
          }
        }
      }

      const oldLesson = await tx.lesson.findUniqueOrThrow({
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

      await courseLegacyLinkValidate(data.course, context, tx);

      await tx.lesson.update({
        where: {
          id_organizationId: {
            id,
            organizationId: currentOrganization.id,
          },
        },
        data: {
          title: data.title,
          lessonNumber: data.lessonNumber,
          content: data.content,
          estimatedMinutes: data.estimatedMinutes,
          xpReward: data.xpReward,
          workflowStatus: data.workflowStatus,
          isPublished: data.isPublished,
          course: prismaRelationship.connectOrDisconnectOne(data.course),
          chapter: prismaRelationship.connectOrDisconnectOne(data.chapter),
          updatedByUserId: context.currentUser?.id,
          updatedByMember: prismaRelationship.connectOne(
            context.currentMember?.id,
          ),
        },
      });

      const updatedLesson = await tx.lesson.findUniqueOrThrow({
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
        entityId: id,
        entityName: 'Lesson',
        operation: auditLogOperations.update,
        context,
        oldData: oldLesson,
        newData: updatedLesson,
        tx,
      });

      return updatedLesson;
    },
  );

  lesson = await filePopulateDownloadUrlInTree(lesson);

  return lesson;
}
