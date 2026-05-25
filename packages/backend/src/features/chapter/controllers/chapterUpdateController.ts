import { z } from 'zod';
import { prismaRelationship } from '../../../prisma/prismaRelationship';
import { AppContext } from '../../../shared/controller/appContext';
import { Error400 } from '../../../shared/errors/Error400';
import { RouteConfig } from '../../../shared/openapi/routeToPath';
import { dictionaryFormat } from '../../../translation/dictionaryFormat';
import { authGuardBackend } from '../../auth/authGuardBackend';
import { filePopulateDownloadUrlInTree } from '../../file/fileService';
import {
  chapterUpdateBodyInputSchema,
  chapterUpdateParamsInputSchema,
} from '../chapterSchemas';
import { auditLogOperations } from '../../auditLog/auditLogOperations';
import { auditLogCreate } from '../../auditLog/auditLogCreate';
import { McpTool } from '../../mcp/mcpTypes';
import { toMcpJsonSchema } from '../../mcp/mcpSchemaConverter';
import { Dictionary } from '../../../translation/locales';
import { prisma } from '../../../prisma';
import { courseLegacyLinkValidate } from '../../course/courseLegacyLink';

export const chapterUpdateApiDoc: RouteConfig = {
  method: 'put',
  path: '/api/chapter/{id}',
  params: chapterUpdateParamsInputSchema,
  body: chapterUpdateBodyInputSchema,
  response: 'Chapter',
};

export const chapterUpdateMcpTool = (dictionary: Dictionary): McpTool => ({
  name: 'chapter_update',
  description: dictionary.chapter.mcpDescription.update,
  requiredPermissions: { chapter: ['update'] },
  schema: toMcpJsonSchema(
    z.object({
      id: z.string(),
      data: chapterUpdateBodyInputSchema,
    }),
  ),
  handler: async (params, context) => {
    return await chapterUpdateController(
      { id: params.id },
      params.data,
      context,
    );
  },
});

export async function chapterUpdateController(
  params: unknown,
  body: unknown,
  context: AppContext,
) {
  const { currentOrganization } = await authGuardBackend(
    {
      chapter: ['update'],
    },
    context,
  );

  const { id } = chapterUpdateParamsInputSchema.parse(params);

  const data = chapterUpdateBodyInputSchema.parse(body);

  let chapter = await prisma.$withRLS(
    { organization: currentOrganization },
    async (tx) => {
      if (data.updatedAt) {
        const currentChapter = await tx.chapter.findUnique({
          where: {
            id_organizationId: {
              id,
              organizationId: currentOrganization.id,
            },
          },
          select: { updatedAt: true },
        });

        if (currentChapter) {
          const currentUpdatedAt = currentChapter.updatedAt.toISOString();
          const providedUpdatedAt =
            data.updatedAt instanceof Date
              ? data.updatedAt.toISOString()
              : data.updatedAt;

          if (currentUpdatedAt !== providedUpdatedAt) {
            throw new Error400(context.dictionary.shared.errors.staleData);
          }
        }
      }

      const oldChapter = await tx.chapter.findUniqueOrThrow({
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
          lessons: {
            select: {
              id: true,
              title: true,
            },
          },
          practiceQuestions: {
            select: {
              id: true,
              questionText: true,
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

      await tx.chapter.update({
        where: {
          id_organizationId: {
            id,
            organizationId: currentOrganization.id,
          },
        },
        data: {
          title: data.title,
          chapterNumber: data.chapterNumber,
          description: data.description,
          aiTutorPrompt: data.aiTutorPrompt,
          xpReward: data.xpReward,
          orderIndex: data.orderIndex,
          workflowStatus: data.workflowStatus,
          isPublished: data.isPublished,
          version: data.version,
          objectives: data.objectives,
          course: prismaRelationship.connectOrDisconnectOne(data.course),
          exam: prismaRelationship.connectOrDisconnectOne(data.exam),
          updatedByUserId: context.currentUser?.id,
          updatedByMember: prismaRelationship.connectOne(
            context.currentMember?.id,
          ),
        },
      });

      const updatedChapter = await tx.chapter.findUniqueOrThrow({
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
          lessons: {
            select: {
              id: true,
              title: true,
            },
          },
          practiceQuestions: {
            select: {
              id: true,
              questionText: true,
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
        entityName: 'Chapter',
        operation: auditLogOperations.update,
        context,
        oldData: oldChapter,
        newData: updatedChapter,
        tx,
      });

      return updatedChapter;
    },
  );

  chapter = await filePopulateDownloadUrlInTree(chapter);

  return chapter;
}
