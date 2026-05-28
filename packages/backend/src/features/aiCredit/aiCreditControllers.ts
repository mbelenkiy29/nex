// bypass-RLS: platform-admin credit packs are global products.
// eslint-disable-next-line no-restricted-syntax
import { prismaDangerouslyBypassRLS } from '../../prisma';
import { AppContext } from '../../shared/controller/appContext';
import { Error404 } from '../../shared/errors/Error404';
import { auditLogCreate } from '../auditLog/auditLogCreate';
import { auditLogOperations } from '../auditLog/auditLogOperations';
import { authGuardPlatformAdminBackend } from '../platformAdmin/platformAdminGuard';
import {
  aiCreditPackManageInputSchema,
  aiCreditPackUpdateInputSchema,
} from './aiCreditSchemas';
import { aiCreditBalance, aiCreditCheckoutController } from './aiCreditService';

export { aiCreditCheckoutController };

export async function aiCreditBalanceController(context: AppContext) {
  if (!context.currentUser) {
    return { balance: 0 };
  }

  return { balance: await aiCreditBalance(context.currentUser.id) };
}

export async function platformAdminAiCreditPackListController(
  context: AppContext,
) {
  authGuardPlatformAdminBackend(context);
  const packs = await prismaDangerouslyBypassRLS.aiCreditPack.findMany({
    orderBy: [{ displayOrder: 'asc' }, { createdAt: 'desc' }],
    take: 100,
  });

  return { packs };
}

export async function platformAdminAiCreditPackCreateController(
  body: unknown,
  context: AppContext,
) {
  const { currentUser } = authGuardPlatformAdminBackend(context);
  const data = aiCreditPackManageInputSchema.parse(body);
  const pack = await prismaDangerouslyBypassRLS.aiCreditPack.create({
    data,
  });

  await auditLogCreate({
    entityId: pack.id,
    entityName: 'AiCreditPack',
    operation: auditLogOperations.create,
    organizationId: null,
    userId: currentUser.id,
    newData: pack,
  });

  return { pack };
}

export async function platformAdminAiCreditPackUpdateController(
  params: { id: string },
  body: unknown,
  context: AppContext,
) {
  const { currentUser } = authGuardPlatformAdminBackend(context);
  const data = aiCreditPackUpdateInputSchema.parse(body);
  const oldData = await prismaDangerouslyBypassRLS.aiCreditPack.findUnique({
    where: { id: params.id },
  });

  if (!oldData) {
    throw new Error404();
  }

  const pack = await prismaDangerouslyBypassRLS.aiCreditPack.update({
    where: { id: params.id },
    data,
  });

  await auditLogCreate({
    entityId: pack.id,
    entityName: 'AiCreditPack',
    operation: auditLogOperations.update,
    organizationId: null,
    userId: currentUser.id,
    oldData,
    newData: pack,
  });

  return { pack };
}
