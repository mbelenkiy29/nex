import { Context } from 'hono';
import { AppContext } from '../../shared/controller/appContext';
import { Error401 } from '../../shared/errors/Error401';
import { prisma } from '../../prisma';
import { auditLogCreate } from '../auditLog/auditLogCreate';
import { auditLogOperations } from '../auditLog/auditLogOperations';
import { serializePayout } from '../platformAdmin/controllers/platformAdminControllers';
import {
  creatorEarningsListQuerySchema,
  creatorEarningsPayoutMethodInputSchema,
} from './creatorEarningsSchemas';

function requireSignedInUser(context: AppContext): { userId: string } {
  if (!context.currentUser) {
    throw new Error401();
  }
  return { userId: context.currentUser.id };
}

const PAYOUT_INCLUDE = {
  course: { select: { id: true, title: true, slug: true } },
  organization: { select: { id: true, name: true } },
} as const;

const DEFAULT_TAKE = 50;

/**
 * Creator-side: list the current user's payouts. Filter by status, paginate.
 * Newest first. The result rows are `serializePayout`-shaped so the frontend
 * sees `amount: number` (Decimal would arrive as a JSON-incompatible object).
 */
export async function creatorEarningsListPayoutsController(
  query: unknown,
  context: AppContext,
  c: Context,
) {
  const data = creatorEarningsListQuerySchema.parse(query);
  const { userId } = requireSignedInUser(context);
  const take = data.take ?? DEFAULT_TAKE;
  const skip = data.skip ?? 0;

  const where = {
    creatorUserId: userId,
    ...(data.status ? { status: data.status } : {}),
  };

  const [count, payouts] = await Promise.all([
    prisma.creatorPayout.count({ where }),
    prisma.creatorPayout.findMany({
      where,
      include: PAYOUT_INCLUDE,
      orderBy: { createdAt: 'desc' },
      take,
      skip,
    }),
  ]);

  return c.json({ count, payouts: payouts.map(serializePayout) });
}

/** Read the current user's payout-method note. */
export async function creatorEarningsGetPayoutMethodController(
  context: AppContext,
  c: Context,
) {
  const { userId } = requireSignedInUser(context);
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { payoutMethodNote: true },
  });
  return c.json({ payoutMethodNote: user?.payoutMethodNote ?? null });
}

/** Update the current user's payout-method note (`null` clears it). */
export async function creatorEarningsUpdatePayoutMethodController(
  body: unknown,
  context: AppContext,
  c: Context,
) {
  const data = creatorEarningsPayoutMethodInputSchema.parse(body);
  const { userId } = requireSignedInUser(context);

  const before = await prisma.user.findUnique({
    where: { id: userId },
    select: { payoutMethodNote: true },
  });

  const updated = await prisma.user.update({
    where: { id: userId },
    data: { payoutMethodNote: data.payoutMethodNote },
    select: { payoutMethodNote: true },
  });

  await auditLogCreate({
    entityId: userId,
    entityName: 'User',
    operation: auditLogOperations.update,
    organizationId: null,
    userId,
    // Only this single field is in scope — keep the audit payload narrow.
    oldData: { payoutMethodNote: before?.payoutMethodNote ?? null },
    newData: { payoutMethodNote: updated.payoutMethodNote },
  });

  return c.json({ payoutMethodNote: updated.payoutMethodNote });
}
