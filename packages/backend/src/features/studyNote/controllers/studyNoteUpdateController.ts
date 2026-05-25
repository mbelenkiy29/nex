import { z } from 'zod';
import { prismaRelationship } from '../../../prisma/prismaRelationship';
import { AppContext } from '../../../shared/controller/appContext';
import { Error400 } from '../../../shared/errors/Error400';
import { RouteConfig } from '../../../shared/openapi/routeToPath';
import { dictionaryFormat } from '../../../translation/dictionaryFormat';
import { authGuardBackend } from '../../auth/authGuardBackend';
import { filePopulateDownloadUrlInTree } from '../../file/fileService';
import {
  studyNoteUpdateBodyInputSchema,
  studyNoteUpdateParamsInputSchema,
} from '../studyNoteSchemas';
import { auditLogOperations } from '../../auditLog/auditLogOperations';
import { auditLogCreate } from '../../auditLog/auditLogCreate';
import { McpTool } from '../../mcp/mcpTypes';
import { toMcpJsonSchema } from '../../mcp/mcpSchemaConverter';
import { Dictionary } from '../../../translation/locales';
import { prisma } from '../../../prisma';
import { courseLegacyLinkValidate } from '../../course/courseLegacyLink';

export const studyNoteUpdateApiDoc: RouteConfig = {
  method: 'put',
  path: '/api/study-note/{id}',
  params: studyNoteUpdateParamsInputSchema,
  body: studyNoteUpdateBodyInputSchema,
  response: 'StudyNote',
};

export const studyNoteUpdateMcpTool = (dictionary: Dictionary): McpTool => ({
  name: 'studyNote_update',
  description: dictionary.studyNote.mcpDescription.update,
  requiredPermissions: { studyNote: ['update'] },
  schema: toMcpJsonSchema(
    z.object({
      id: z.string(),
      data: studyNoteUpdateBodyInputSchema,
    }),
  ),
  handler: async (params, context) => {
    return await studyNoteUpdateController(
      { id: params.id },
      params.data,
      context,
    );
  },
});

export async function studyNoteUpdateController(
  params: unknown,
  body: unknown,
  context: AppContext,
) {
  const { currentOrganization } = await authGuardBackend(
    {
      studyNote: ['update'],
    },
    context,
  );

  const { id } = studyNoteUpdateParamsInputSchema.parse(params);

  const data = studyNoteUpdateBodyInputSchema.parse(body);

  let studyNote = await prisma.$withRLS(
    { organization: currentOrganization },
    async (tx) => {
      if (data.updatedAt) {
        const currentStudyNote = await tx.studyNote.findUnique({
          where: {
            id_organizationId: {
              id,
              organizationId: currentOrganization.id,
            },
          },
          select: { updatedAt: true },
        });

        if (currentStudyNote) {
          const currentUpdatedAt = currentStudyNote.updatedAt.toISOString();
          const providedUpdatedAt =
            data.updatedAt instanceof Date
              ? data.updatedAt.toISOString()
              : data.updatedAt;

          if (currentUpdatedAt !== providedUpdatedAt) {
            throw new Error400(context.dictionary.shared.errors.staleData);
          }
        }
      }

      const oldStudyNote = await tx.studyNote.findUniqueOrThrow({
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

      await courseLegacyLinkValidate(data.course, context, tx);

      await tx.studyNote.update({
        where: {
          id_organizationId: {
            id,
            organizationId: currentOrganization.id,
          },
        },
        data: {
          title: data.title,
          content: data.content,
          isFavorite: data.isFavorite,
          tags: data.tags,
          course: prismaRelationship.connectOrDisconnectOne(data.course),
          chapter: prismaRelationship.connectOrDisconnectOne(data.chapter),
          lesson: prismaRelationship.connectOrDisconnectOne(data.lesson),
          author: prismaRelationship.connectOrDisconnectOne(data.author),
          updatedByUserId: context.currentUser?.id,
          updatedByMember: prismaRelationship.connectOne(
            context.currentMember?.id,
          ),
        },
      });

      const updatedStudyNote = await tx.studyNote.findUniqueOrThrow({
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
        entityId: id,
        entityName: 'StudyNote',
        operation: auditLogOperations.update,
        context,
        oldData: oldStudyNote,
        newData: updatedStudyNote,
        tx,
      });

      return updatedStudyNote;
    },
  );

  studyNote = await filePopulateDownloadUrlInTree(studyNote);

  return studyNote;
}
