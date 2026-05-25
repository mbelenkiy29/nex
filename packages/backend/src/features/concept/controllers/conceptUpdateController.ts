import { z } from 'zod';
import { prismaRelationship } from '../../../prisma/prismaRelationship';
import { AppContext } from '../../../shared/controller/appContext';
import { Error400 } from '../../../shared/errors/Error400';
import { RouteConfig } from '../../../shared/openapi/routeToPath';
import { dictionaryFormat } from '../../../translation/dictionaryFormat';
import { authGuardBackend } from '../../auth/authGuardBackend';
import { filePopulateDownloadUrlInTree } from '../../file/fileService';
import {
  conceptUpdateBodyInputSchema,
  conceptUpdateParamsInputSchema,
} from '../conceptSchemas';
import { auditLogOperations } from '../../auditLog/auditLogOperations';
import { auditLogCreate } from '../../auditLog/auditLogCreate';
import { McpTool } from '../../mcp/mcpTypes';
import { toMcpJsonSchema } from '../../mcp/mcpSchemaConverter';
import { Dictionary } from '../../../translation/locales';
import { prisma } from '../../../prisma';
import { courseLegacyLinkValidate } from '../../course/courseLegacyLink';

export const conceptUpdateApiDoc: RouteConfig = {
  method: 'put',
  path: '/api/concept/{id}',
  params: conceptUpdateParamsInputSchema,
  body: conceptUpdateBodyInputSchema,
  response: 'Concept',
};

export const conceptUpdateMcpTool = (dictionary: Dictionary): McpTool => ({
  name: 'concept_update',
  description: dictionary.concept.mcpDescription.update,
  requiredPermissions: { concept: ['update'] },
  schema: toMcpJsonSchema(
    z.object({
      id: z.string(),
      data: conceptUpdateBodyInputSchema,
    }),
  ),
  handler: async (params, context) => {
    return await conceptUpdateController(
      { id: params.id },
      params.data,
      context,
    );
  },
});

export async function conceptUpdateController(
  params: unknown,
  body: unknown,
  context: AppContext,
) {
  const { currentOrganization } = await authGuardBackend(
    {
      concept: ['update'],
    },
    context,
  );

  const { id } = conceptUpdateParamsInputSchema.parse(params);

  const data = conceptUpdateBodyInputSchema.parse(body);

  let concept = await prisma.$withRLS(
    { organization: currentOrganization },
    async (tx) => {
      if (data.updatedAt) {
        const currentConcept = await tx.concept.findUnique({
          where: {
            id_organizationId: {
              id,
              organizationId: currentOrganization.id,
            },
          },
          select: { updatedAt: true },
        });

        if (currentConcept) {
          const currentUpdatedAt = currentConcept.updatedAt.toISOString();
          const providedUpdatedAt =
            data.updatedAt instanceof Date
              ? data.updatedAt.toISOString()
              : data.updatedAt;

          if (currentUpdatedAt !== providedUpdatedAt) {
            throw new Error400(context.dictionary.shared.errors.staleData);
          }
        }
      }
      const duplicatedConceptCode = await tx.concept.count({
        where: {
          conceptCode: {
            equals: data.conceptCode,
            mode: 'insensitive',
          },
          id: { not: id },
          organizationId: currentOrganization.id,
        },
      });

      if (duplicatedConceptCode) {
        throw new Error400(
          dictionaryFormat(
            context.dictionary.shared.errors.unique,
            context.dictionary.concept.fields.conceptCode,
          ),
        );
      }

      const oldConcept = await tx.concept.findUniqueOrThrow({
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
          practiceQuestions: {
            select: {
              id: true,
              questionText: true,
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

      await tx.concept.update({
        where: {
          id_organizationId: {
            id,
            organizationId: currentOrganization.id,
          },
        },
        data: {
          conceptName: data.conceptName,
          conceptCode: data.conceptCode,
          conceptDescription: data.conceptDescription,
          explanation: data.explanation,
          examDomain: data.examDomain,
          difficulty: data.difficulty,
          examWeight: data.examWeight,
          typicalMistakes: data.typicalMistakes,
          examTips: data.examTips,
          isActive: data.isActive,
          course: prismaRelationship.connectOrDisconnectOne(data.course),
          exam: prismaRelationship.connectOrDisconnectOne(data.exam),
          updatedByUserId: context.currentUser?.id,
          updatedByMember: prismaRelationship.connectOne(
            context.currentMember?.id,
          ),
        },
      });

      const updatedConcept = await tx.concept.findUniqueOrThrow({
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
          practiceQuestions: {
            select: {
              id: true,
              questionText: true,
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
        entityName: 'Concept',
        operation: auditLogOperations.update,
        context,
        oldData: oldConcept,
        newData: updatedConcept,
        tx,
      });

      return updatedConcept;
    },
  );

  concept = await filePopulateDownloadUrlInTree(concept);

  return concept;
}
