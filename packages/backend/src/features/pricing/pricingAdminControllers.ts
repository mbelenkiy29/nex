// bypass-RLS: platform admins manage global pricing controls.
// eslint-disable-next-line no-restricted-syntax
import { prismaDangerouslyBypassRLS } from '../../prisma';
import { AppContext } from '../../shared/controller/appContext';
import { Error404 } from '../../shared/errors/Error404';
import { auditLogCreate } from '../auditLog/auditLogCreate';
import { auditLogOperations } from '../auditLog/auditLogOperations';
import { authGuardPlatformAdminBackend } from '../platformAdmin/platformAdminGuard';
import {
  pricingExperimentManageInputSchema,
  pricingExperimentUpdateInputSchema,
} from './pricingSchemas';

export async function platformAdminPricingExperimentListController(
  context: AppContext,
) {
  authGuardPlatformAdminBackend(context);
  const experiments =
    await prismaDangerouslyBypassRLS.pricingExperiment.findMany({
      include: {
        variants: { orderBy: [{ orderIndex: 'asc' }, { createdAt: 'asc' }] },
        _count: { select: { exposures: true } },
      },
      orderBy: [{ status: 'asc' }, { createdAt: 'desc' }],
      take: 100,
    });

  return { experiments };
}

export async function platformAdminPricingExperimentCreateController(
  body: unknown,
  context: AppContext,
) {
  const { currentUser } = authGuardPlatformAdminBackend(context);
  const data = pricingExperimentManageInputSchema.parse(body);

  const experiment = await prismaDangerouslyBypassRLS.pricingExperiment.create({
    data: {
      key: data.key,
      name: data.name,
      status: data.status,
      surface: data.surface,
      trafficPercent: data.trafficPercent,
      startsAt: data.startsAt,
      endsAt: data.endsAt,
      metadata: data.metadata,
      createdByUserId: currentUser.id,
      variants: {
        create: data.variants.map((variant) => ({
          key: variant.key,
          name: variant.name,
          allocationBps: variant.allocationBps,
          isControl: variant.isControl,
          orderIndex: variant.orderIndex,
          packageConfig: variant.packageConfig,
        })),
      },
    },
    include: { variants: true },
  });

  await auditLogCreate({
    entityId: experiment.id,
    entityName: 'PricingExperiment',
    operation: auditLogOperations.create,
    organizationId: null,
    userId: currentUser.id,
    newData: experiment,
  });

  return { experiment };
}

export async function platformAdminPricingExperimentUpdateController(
  params: { id: string },
  body: unknown,
  context: AppContext,
) {
  const { currentUser } = authGuardPlatformAdminBackend(context);
  const data = pricingExperimentUpdateInputSchema.parse(body);
  const oldData = await prismaDangerouslyBypassRLS.pricingExperiment.findUnique(
    {
      where: { id: params.id },
      include: { variants: true },
    },
  );

  if (!oldData) {
    throw new Error404();
  }

  const experiment = await prismaDangerouslyBypassRLS.$transaction(
    async (tx) => {
      await tx.pricingExperiment.update({
        where: { id: params.id },
        data: {
          ...(data.key ? { key: data.key } : {}),
          ...(data.name ? { name: data.name } : {}),
          ...(data.status ? { status: data.status } : {}),
          ...(data.surface ? { surface: data.surface } : {}),
          ...(data.trafficPercent != null
            ? { trafficPercent: data.trafficPercent }
            : {}),
          ...(data.startsAt !== undefined ? { startsAt: data.startsAt } : {}),
          ...(data.endsAt !== undefined ? { endsAt: data.endsAt } : {}),
          ...(data.metadata ? { metadata: data.metadata } : {}),
        },
      });

      if (data.variants) {
        const incomingIds = data.variants
          .map((variant) => variant.id)
          .filter((id): id is string => Boolean(id));

        await tx.pricingVariant.deleteMany({
          where: { experimentId: params.id, id: { notIn: incomingIds } },
        });

        for (const variant of data.variants) {
          if (variant.id) {
            await tx.pricingVariant.update({
              where: { id: variant.id },
              data: {
                key: variant.key,
                name: variant.name,
                allocationBps: variant.allocationBps,
                isControl: variant.isControl,
                orderIndex: variant.orderIndex,
                packageConfig: variant.packageConfig,
              },
            });
          } else {
            await tx.pricingVariant.create({
              data: {
                experimentId: params.id,
                key: variant.key,
                name: variant.name,
                allocationBps: variant.allocationBps,
                isControl: variant.isControl,
                orderIndex: variant.orderIndex,
                packageConfig: variant.packageConfig,
              },
            });
          }
        }
      }

      return tx.pricingExperiment.findUniqueOrThrow({
        where: { id: params.id },
        include: { variants: true },
      });
    },
  );

  await auditLogCreate({
    entityId: experiment.id,
    entityName: 'PricingExperiment',
    operation: auditLogOperations.update,
    organizationId: null,
    userId: currentUser.id,
    oldData,
    newData: experiment,
  });

  return { experiment };
}
