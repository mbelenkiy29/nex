import { z } from 'zod';
import { prismaRelationship } from '../../../prisma/prismaRelationship';
import { AppContext } from '../../../shared/controller/appContext';
import { Error400 } from '../../../shared/errors/Error400';
import { RouteConfig } from '../../../shared/openapi/routeToPath';
import { dictionaryFormat } from '../../../translation/dictionaryFormat';
import { authGuardBackend } from '../../auth/authGuardBackend';
import { filePopulateDownloadUrlInTree } from '../../file/fileService';
import { chapterCreateInputSchema } from '../chapterSchemas';
import { auditLogOperations } from '../../auditLog/auditLogOperations';
import { auditLogCreate } from '../../auditLog/auditLogCreate';
import { McpTool } from '../../mcp/mcpTypes';
import { toMcpJsonSchema } from '../../mcp/mcpSchemaConverter';
import { Dictionary } from '../../../translation/locales';
import { prisma } from '../../../prisma';
import { courseLegacyLinkValidate } from '../../course/courseLegacyLink';

export const chapterCreateApiDoc: RouteConfig = {
  method: 'post',
  path: '/api/chapter',
  body: chapterCreateInputSchema,
  response: 'Chapter',
};

export const chapterCreateMcpTool = (dictionary: Dictionary): McpTool => ({
  name: 'chapter_create',
  description: dictionary.chapter.mcpDescription.create,
  requiredPermissions: { chapter: ['create'] },
  schema: toMcpJsonSchema(chapterCreateInputSchema),
  handler: async (params, context) => {
    return await chapterCreateController(params, context);
  },
});

export async function chapterCreateController(
  body: unknown,
  context: AppContext,
) {
  await authGuardBackend(
    {
      chapter: ['create'],
    },
    context,
  );
  return await chapterCreate(body, context);
}

export async function chapterCreate(body: unknown, context: AppContext) {
  const currentOrganization = context.currentOrganization!;

  const data = chapterCreateInputSchema.parse(body);

  return await prisma.$withRLS(
    { organization: currentOrganization },
    async (tx) => {
      await courseLegacyLinkValidate(data.course, context, tx);

      const newChapter = await tx.chapter.create({
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
        entityId: newChapter.id,
        entityName: 'Chapter',
        operation: auditLogOperations.create,
        context,
        newData: newChapter,
        tx,
      });

      const chapter = await filePopulateDownloadUrlInTree(newChapter);

      return chapter;
    },
  );
}
