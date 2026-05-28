import { Context } from 'hono';
import { AppContext } from '../../shared/controller/appContext';
import { env } from '../../env';
import { Error400 } from '../../shared/errors/Error400';
import { Error403 } from '../../shared/errors/Error403';
import { Error404 } from '../../shared/errors/Error404';
import { prisma } from '../../prisma';
import { auditLogCreate } from '../auditLog/auditLogCreate';
import { auditLogOperations } from '../auditLog/auditLogOperations';
import {
  oneOnOneAvailabilityPutSchema,
  oneOnOneSessionTypeInputSchema,
  oneOnOneSessionTypeUpdateSchema,
} from './oneOnOneSchemas';
import { requireOneOnOneUser } from './oneOnOneService';

// Returns the current user's recurring availability windows + the session
// types they offer. Any signed-in user can have availability — it only
// becomes bookable on courses they create.
export async function oneOnOneGetAvailabilityController(
  context: AppContext,
  c: Context,
) {
  const { userId } = requireOneOnOneUser(context);
  const [windows, sessionTypes] = await Promise.all([
    prisma.instructorAvailability.findMany({
      where: { instructorUserId: userId },
      orderBy: [{ dayOfWeek: 'asc' }, { startMinute: 'asc' }],
    }),
    prisma.oneOnOneSessionType.findMany({
      where: { instructorUserId: userId, isActive: true },
      orderBy: { createdAt: 'asc' },
    }),
  ]);
  return c.json({ windows, sessionTypes });
}

// Replaces the instructor's full set of recurring availability windows. A PUT
// (not PATCH) because the editor sends the whole grid every save — same as a
// Calendly-style scheduler.
export async function oneOnOnePutAvailabilityController(
  body: unknown,
  context: AppContext,
  c: Context,
) {
  const data = oneOnOneAvailabilityPutSchema.parse(body);
  const { userId } = requireOneOnOneUser(context);

  const windows = await prisma.$transaction(async (tx) => {
    await tx.instructorAvailability.deleteMany({
      where: { instructorUserId: userId },
    });
    if (data.windows.length === 0) {
      return [];
    }
    await tx.instructorAvailability.createMany({
      data: data.windows.map((w) => ({
        instructorUserId: userId,
        dayOfWeek: w.dayOfWeek,
        startMinute: w.startMinute,
        endMinute: w.endMinute,
        timezone: w.timezone,
        isActive: w.isActive ?? true,
      })),
    });
    return tx.instructorAvailability.findMany({
      where: { instructorUserId: userId },
      orderBy: [{ dayOfWeek: 'asc' }, { startMinute: 'asc' }],
    });
  });

  await auditLogCreate({
    entityId: userId,
    entityName: 'InstructorAvailability',
    operation: auditLogOperations.update,
    organizationId: null,
    userId,
    newData: { windowCount: windows.length },
  });

  return c.json({ windows });
}

// Creates a bookable session type for the current user. Paid types are
// available when Stripe Checkout is configured.
export async function oneOnOneCreateSessionTypeController(
  body: unknown,
  context: AppContext,
  c: Context,
) {
  const data = oneOnOneSessionTypeInputSchema.parse(body);
  const { userId } = requireOneOnOneUser(context);
  const t = context.dictionary.oneOnOneCall.errors;

  // Without Stripe there is no payment-confirmation path, so paid types stay
  // blocked while free 1:1s remain available.
  if (!data.isFree && !env.STRIPE_SECRET_KEY) {
    throw new Error400(t.paidNotAvailable);
  }

  // A course-scoped session type must belong to a course the user owns.
  if (data.courseId) {
    const course = await prisma.course.findUnique({
      where: { id: data.courseId },
      select: { id: true, creatorUserId: true },
    });
    if (!course) {
      throw new Error404();
    }
    if (course.creatorUserId !== userId) {
      throw new Error403();
    }
  }

  const sessionType = await prisma.oneOnOneSessionType.create({
    data: {
      instructorUserId: userId,
      courseId: data.courseId ?? null,
      title: data.title,
      description: data.description ?? null,
      durationMinutes: data.durationMinutes,
      isFree: data.isFree,
      priceCents: data.isFree ? null : (data.priceCents ?? null),
      currency: data.currency ?? 'USD',
      bufferMinutes: data.bufferMinutes,
      minNoticeHours: data.minNoticeHours,
    },
  });

  await auditLogCreate({
    entityId: sessionType.id,
    entityName: 'OneOnOneSessionType',
    operation: auditLogOperations.create,
    organizationId: null,
    userId,
    newData: sessionType,
  });

  return c.json({ sessionType });
}

export async function oneOnOneUpdateSessionTypeController(
  id: string,
  body: unknown,
  context: AppContext,
  c: Context,
) {
  const data = oneOnOneSessionTypeUpdateSchema.parse(body);
  const { userId } = requireOneOnOneUser(context);
  const t = context.dictionary.oneOnOneCall.errors;

  const existing = await prisma.oneOnOneSessionType.findUnique({
    where: { id },
  });
  if (!existing) {
    throw new Error404();
  }
  if (existing.instructorUserId !== userId) {
    throw new Error403();
  }
  if (data.isFree === false && !env.STRIPE_SECRET_KEY) {
    throw new Error400(t.paidNotAvailable);
  }

  const updated = await prisma.oneOnOneSessionType.update({
    where: { id },
    data: {
      title: data.title ?? undefined,
      description:
        data.description === undefined ? undefined : data.description,
      durationMinutes: data.durationMinutes ?? undefined,
      isFree: data.isFree ?? undefined,
      priceCents: data.priceCents === undefined ? undefined : data.priceCents,
      currency: data.currency ?? undefined,
      bufferMinutes: data.bufferMinutes ?? undefined,
      minNoticeHours: data.minNoticeHours ?? undefined,
      isActive: data.isActive ?? undefined,
    },
  });

  await auditLogCreate({
    entityId: updated.id,
    entityName: 'OneOnOneSessionType',
    operation: auditLogOperations.update,
    organizationId: null,
    userId,
    oldData: existing,
    newData: updated,
  });

  return c.json({ sessionType: updated });
}

// Soft-disable rather than hard-delete so existing sessions keep their FK.
export async function oneOnOneDeleteSessionTypeController(
  id: string,
  context: AppContext,
  c: Context,
) {
  const { userId } = requireOneOnOneUser(context);
  const existing = await prisma.oneOnOneSessionType.findUnique({
    where: { id },
  });
  if (!existing) {
    throw new Error404();
  }
  if (existing.instructorUserId !== userId) {
    throw new Error403();
  }
  const updated = await prisma.oneOnOneSessionType.update({
    where: { id },
    data: { isActive: false },
  });
  await auditLogCreate({
    entityId: updated.id,
    entityName: 'OneOnOneSessionType',
    operation: auditLogOperations.update,
    organizationId: null,
    userId,
    oldData: existing,
    newData: updated,
  });
  return c.json({ sessionType: updated });
}
