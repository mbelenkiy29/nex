import { z } from 'zod';
import { prismaRelationship } from '../../../prisma/prismaRelationship';
import { AppContext } from '../../../shared/controller/appContext';
import { Error400 } from '../../../shared/errors/Error400';
import { RouteConfig } from '../../../shared/openapi/routeToPath';
import { dictionaryFormat } from '../../../translation/dictionaryFormat';
import { authGuardBackend } from '../../auth/authGuardBackend';
import { filePopulateDownloadUrlInTree } from '../../file/fileService';
import { studyNoteCreateInputSchema } from '../studyNoteSchemas';
import { auditLogOperations } from '../../auditLog/auditLogOperations';
import { auditLogCreate } from '../../auditLog/auditLogCreate';
import { McpTool } from '../../mcp/mcpTypes';
import { toMcpJsonSchema } from '../../mcp/mcpSchemaConverter';
import { Dictionary } from '../../../translation/locales';
import { prisma } from '../../../prisma';
import { courseLegacyLinkValidate } from '../../course/courseLegacyLink';

export const studyNoteCreateApiDoc: RouteConfig = {
  method: 'post',
  path: '/api/study-note',
  body: studyNoteCreateInputSchema,
  response: 'StudyNote',
};

export const studyNoteCreateMcpTool = (dictionary: Dictionary): McpTool => ({
  name: 'studyNote_create',
  description: dictionary.studyNote.mcpDescription.create,
  requiredPermissions: { studyNote: ['create'] },
  schema: toMcpJsonSchema(studyNoteCreateInputSchema),
  handler: async (params, context) => {
    return await studyNoteCreateController(params, context);
  },
});

export async function studyNoteCreateController(
  body: unknown,
  context: AppContext,
) {
  await authGuardBackend(
    {
      studyNote: ['create'],
    },
    context,
  );
  return await studyNoteCreate(body, context);
}

export async function studyNoteCreate(body: unknown, context: AppContext) {
  const currentOrganization = context.currentOrganization!;

  const data = studyNoteCreateInputSchema.parse(body);

  return await prisma.$withRLS(
    { organization: currentOrganization },
    async (tx) => {
      await courseLegacyLinkValidate(data.course, context, tx);

      const newStudyNote = await tx.studyNote.create({
        data: {
          title: data.title,
          content: data.content,
          isFavorite: data.isFavorite,
          tags: data.tags,
          course: prismaRelationship.connectOne(data.course),
          chapter: prismaRelationship.connectOne(data.chapter),
          lesson: prismaRelationship.connectOne(data.lesson),
          author: prismaRelationship.connectOneOrThrow(data.author),
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
          lesson: {
            select: {
              id: true,
              title: true,
            },
          },
          author: {
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
        entityId: newStudyNote.id,
        entityName: 'StudyNote',
        operation: auditLogOperations.create,
        context,
        newData: newStudyNote,
        tx,
      });

      const studyNote = await filePopulateDownloadUrlInTree(newStudyNote);

      return studyNote;
    },
  );
}
