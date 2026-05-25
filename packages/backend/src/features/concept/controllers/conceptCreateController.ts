import { z } from 'zod';
import { prismaRelationship } from '../../../prisma/prismaRelationship';
import { AppContext } from '../../../shared/controller/appContext';
import { Error400 } from '../../../shared/errors/Error400';
import { RouteConfig } from '../../../shared/openapi/routeToPath';
import { dictionaryFormat } from '../../../translation/dictionaryFormat';
import { authGuardBackend } from '../../auth/authGuardBackend';
import { filePopulateDownloadUrlInTree } from '../../file/fileService';
import { conceptCreateInputSchema } from '../conceptSchemas';
import { auditLogOperations } from '../../auditLog/auditLogOperations';
import { auditLogCreate } from '../../auditLog/auditLogCreate';
import { McpTool } from '../../mcp/mcpTypes';
import { toMcpJsonSchema } from '../../mcp/mcpSchemaConverter';
import { Dictionary } from '../../../translation/locales';
import { prisma } from '../../../prisma';
import { courseLegacyLinkValidate } from '../../course/courseLegacyLink';

export const conceptCreateApiDoc: RouteConfig = {
  method: 'post',
  path: '/api/concept',
  body: conceptCreateInputSchema,
  response: 'Concept',
};

export const conceptCreateMcpTool = (dictionary: Dictionary): McpTool => ({
  name: 'concept_create',
  description: dictionary.concept.mcpDescription.create,
  requiredPermissions: { concept: ['create'] },
  schema: toMcpJsonSchema(conceptCreateInputSchema),
  handler: async (params, context) => {
    return await conceptCreateController(params, context);
  },
});

export async function conceptCreateController(
  body: unknown,
  context: AppContext,
) {
  await authGuardBackend(
    {
      concept: ['create'],
    },
    context,
  );
  return await conceptCreate(body, context);
}

export async function conceptCreate(body: unknown, context: AppContext) {
  const currentOrganization = context.currentOrganization!;

  const data = conceptCreateInputSchema.parse(body);

  return await prisma.$withRLS(
    { organization: currentOrganization },
    async (tx) => {
      await courseLegacyLinkValidate(data.course, context, tx);

      const duplicatedConceptCode = await tx.concept.count({
        where: {
          conceptCode: {
            equals: data.conceptCode,
            mode: 'insensitive',
          },
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

      const newConcept = await tx.concept.create({
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
        entityId: newConcept.id,
        entityName: 'Concept',
        operation: auditLogOperations.create,
        context,
        newData: newConcept,
        tx,
      });

      const concept = await filePopulateDownloadUrlInTree(newConcept);

      return concept;
    },
  );
}
