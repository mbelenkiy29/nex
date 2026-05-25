import { z } from 'zod';
import { prismaRelationship } from '../../../prisma/prismaRelationship';
import { AppContext } from '../../../shared/controller/appContext';
import { Error400 } from '../../../shared/errors/Error400';
import { RouteConfig } from '../../../shared/openapi/routeToPath';
import { dictionaryFormat } from '../../../translation/dictionaryFormat';
import { authGuardBackend } from '../../auth/authGuardBackend';
import { filePopulateDownloadUrlInTree } from '../../file/fileService';
import { examCreateInputSchema } from '../examSchemas';
import { auditLogOperations } from '../../auditLog/auditLogOperations';
import { auditLogCreate } from '../../auditLog/auditLogCreate';
import { McpTool } from '../../mcp/mcpTypes';
import { toMcpJsonSchema } from '../../mcp/mcpSchemaConverter';
import { Dictionary } from '../../../translation/locales';
import { prisma } from '../../../prisma';
import { courseLegacyLinkValidate } from '../../course/courseLegacyLink';

export const examCreateApiDoc: RouteConfig = {
  method: 'post',
  path: '/api/exam',
  body: examCreateInputSchema,
  response: 'Exam',
};

export const examCreateMcpTool = (dictionary: Dictionary): McpTool => ({
  name: 'exam_create',
  description: dictionary.exam.mcpDescription.create,
  requiredPermissions: { exam: ['create'] },
  schema: toMcpJsonSchema(examCreateInputSchema),
  handler: async (params, context) => {
    return await examCreateController(params, context);
  },
});

export async function examCreateController(body: unknown, context: AppContext) {
  await authGuardBackend(
    {
      exam: ['create'],
    },
    context,
  );
  return await examCreate(body, context);
}

export async function examCreate(body: unknown, context: AppContext) {
  const currentOrganization = context.currentOrganization!;

  const data = examCreateInputSchema.parse(body);

  return await prisma.$withRLS(
    { organization: currentOrganization },
    async (tx) => {
      await courseLegacyLinkValidate(data.course, context, tx);

      const duplicatedCode = await tx.exam.count({
        where: {
          code: {
            equals: data.code,
            mode: 'insensitive',
          },
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

      const newExam = await tx.exam.create({
        data: {
          name: data.name,
          code: data.code,
          description: data.description,
          iconUrl: data.iconUrl,
          course: prismaRelationship.connectOne(data.course),
          isActive: data.isActive,
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
        entityId: newExam.id,
        entityName: 'Exam',
        operation: auditLogOperations.create,
        context,
        newData: newExam,
        tx,
      });

      const exam = await filePopulateDownloadUrlInTree(newExam);

      return exam;
    },
  );
}
