import { z } from 'zod';
import { prismaRelationship } from '../../../prisma/prismaRelationship';
import { AppContext } from '../../../shared/controller/appContext';
import { Error400 } from '../../../shared/errors/Error400';
import { RouteConfig } from '../../../shared/openapi/routeToPath';
import { dictionaryFormat } from '../../../translation/dictionaryFormat';
import { authGuardBackend } from '../../auth/authGuardBackend';
import { filePopulateDownloadUrlInTree } from '../../file/fileService';
import {
  examUpdateBodyInputSchema,
  examUpdateParamsInputSchema,
} from '../examSchemas';
import { auditLogOperations } from '../../auditLog/auditLogOperations';
import { auditLogCreate } from '../../auditLog/auditLogCreate';
import { McpTool } from '../../mcp/mcpTypes';
import { toMcpJsonSchema } from '../../mcp/mcpSchemaConverter';
import { Dictionary } from '../../../translation/locales';
import { prisma } from '../../../prisma';
import { courseLegacyLinkValidate } from '../../course/courseLegacyLink';

export const examUpdateApiDoc: RouteConfig = {
  method: 'put',
  path: '/api/exam/{id}',
  params: examUpdateParamsInputSchema,
  body: examUpdateBodyInputSchema,
  response: 'Exam',
};

export const examUpdateMcpTool = (dictionary: Dictionary): McpTool => ({
  name: 'exam_update',
  description: dictionary.exam.mcpDescription.update,
  requiredPermissions: { exam: ['update'] },
  schema: toMcpJsonSchema(
    z.object({
      id: z.string(),
      data: examUpdateBodyInputSchema,
    }),
  ),
  handler: async (params, context) => {
    return await examUpdateController({ id: params.id }, params.data, context);
  },
});

export async function examUpdateController(
  params: unknown,
  body: unknown,
  context: AppContext,
) {
  const { currentOrganization } = await authGuardBackend(
    {
      exam: ['update'],
    },
    context,
  );

  const { id } = examUpdateParamsInputSchema.parse(params);

  const data = examUpdateBodyInputSchema.parse(body);

  let exam = await prisma.$withRLS(
    { organization: currentOrganization },
    async (tx) => {
      if (data.updatedAt) {
        const currentExam = await tx.exam.findUnique({
          where: {
            id_organizationId: {
              id,
              organizationId: currentOrganization.id,
            },
          },
          select: { updatedAt: true },
        });

        if (currentExam) {
          const currentUpdatedAt = currentExam.updatedAt.toISOString();
          const providedUpdatedAt =
            data.updatedAt instanceof Date
              ? data.updatedAt.toISOString()
              : data.updatedAt;

          if (currentUpdatedAt !== providedUpdatedAt) {
            throw new Error400(context.dictionary.shared.errors.staleData);
          }
        }
      }
      const duplicatedCode = await tx.exam.count({
        where: {
          code: {
            equals: data.code,
            mode: 'insensitive',
          },
          id: { not: id },
          organizationId: currentOrganization.id,
        },
      });

      if (duplicatedCode) {
        throw new Error400(
          dictionaryFormat(
            context.dictionary.shared.errors.unique,
            context.dictionary.exam.fields.code,
          ),
        );
      }

      await courseLegacyLinkValidate(data.course, context, tx);

      const oldExam = await tx.exam.findUniqueOrThrow({
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
          chapters: {
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
          examTypes: {
            select: {
              id: true,
              name: true,
            },
          },
          documentUploads: {
            select: {
              id: true,
              originalFilename: true,
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

      await tx.exam.update({
        where: {
          id_organizationId: {
            id,
            organizationId: currentOrganization.id,
          },
        },
        data: {
          name: data.name,
          code: data.code,
          description: data.description,
          iconUrl: data.iconUrl,
          course: prismaRelationship.connectOrDisconnectOne(data.course),
          isActive: data.isActive,
          updatedByUserId: context.currentUser?.id,
          updatedByMember: prismaRelationship.connectOne(
            context.currentMember?.id,
          ),
        },
      });

      const updatedExam = await tx.exam.findUniqueOrThrow({
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
          chapters: {
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
          examTypes: {
            select: {
              id: true,
              name: true,
            },
          },
          documentUploads: {
            select: {
              id: true,
              originalFilename: true,
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
        entityName: 'Exam',
        operation: auditLogOperations.update,
        context,
        oldData: oldExam,
        newData: updatedExam,
        tx,
      });

      return updatedExam;
    },
  );

  exam = await filePopulateDownloadUrlInTree(exam);

  return exam;
}
