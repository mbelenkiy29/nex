import { Context } from 'hono';
import Stripe from 'stripe';
import { AppContext } from '../../shared/controller/appContext';
import { Error400 } from '../../shared/errors/Error400';
import { Error403 } from '../../shared/errors/Error403';
import { Error404 } from '../../shared/errors/Error404';
import { Prisma } from '../../prisma/generated/client';
import { prisma } from '../../prisma';
import { env } from '../../env';
import { auditLogCreate } from '../auditLog/auditLogCreate';
import { auditLogOperations } from '../auditLog/auditLogOperations';
import { courseEnsureLearningAccess } from '../course/courseControllers';
import { platformAdminIsUserAllowed } from '../platformAdmin/platformAdminGuard';
import { STRIPE_API_VERSION } from '../subscription/stripeApiVersion';
import { dictionaryFormat } from '../../translation/dictionaryFormat';
import { getFrontendUrl } from '../../shared/lib/getFrontendUrl';
import {
  oneOnOneBookingInputSchema,
  oneOnOneCancelInputSchema,
  oneOnOneNoteInputSchema,
  oneOnOneNoteUpdateSchema,
  oneOnOneSessionsQuerySchema,
  oneOnOneSlotsQuerySchema,
} from './oneOnOneSchemas';
import {
  formatSessionWhen,
  loadInstructorBookedIntervals,
  notifyOneOnOneUser,
  oneOnOneDisplayName,
  refundOneOnOneSession,
  requireOneOnOneUser,
  scheduleOneOnOneReminders,
  toAvailabilityWindow,
} from './oneOnOneService';
import { expandAvailabilityToSlots } from './oneOnOneSlotExpansion';
import { evaluateCancellation } from './oneOnOneCancellationPolicy';
import { generateJitsiRoom } from './oneOnOneJitsi';
import {
  trustSafetyRequireCreatorEnabled,
  trustSafetyRequirePolicyAcceptance,
} from '../trustSafety/trustSafetyService';
import { checkoutTrustSessionOptions } from '../checkout/checkoutTrust';

// Hard cap on the slot-listing window so a single request can't expand a
// year's worth of slots.
const SLOTS_MAX_RANGE_DAYS = 62;

// One-minute window centred on a requested slot start — wide enough to catch
// the exact instant, narrow enough that expansion emits at most that slot.
const BOOKING_VALIDATION_WINDOW_MS = 60_000;

// ----------------------------------------------------------------------------
// Slot listing & booking (student-side)
// ----------------------------------------------------------------------------

/** Session types bookable on a given course (course-scoped + instructor-wide). */
export async function oneOnOneListCourseSessionTypesController(
  courseId: string,
  context: AppContext,
  c: Context,
) {
  const { course } = await courseEnsureLearningAccess(courseId, context);
  const instructorUserId = course.creatorUserId;
  if (!instructorUserId) {
    return c.json({ sessionTypes: [] });
  }
  await trustSafetyRequireCreatorEnabled(instructorUserId, context);
  const sessionTypes = await prisma.oneOnOneSessionType.findMany({
    where: {
      instructorUserId,
      isActive: true,
      OR: [{ courseId: null }, { courseId }],
    },
    orderBy: { createdAt: 'asc' },
  });
  return c.json({ sessionTypes });
}

/** Open bookable slots for a course's instructor in a UTC date range. */
export async function oneOnOneListSlotsController(
  courseId: string,
  query: unknown,
  context: AppContext,
  c: Context,
) {
  const data = oneOnOneSlotsQuerySchema.parse(query);
  const { course } = await courseEnsureLearningAccess(courseId, context);
  const t = context.dictionary.oneOnOneCall.errors;
  const instructorUserId = course.creatorUserId;
  if (!instructorUserId) {
    throw new Error400(t.noInstructor);
  }
  await trustSafetyRequireCreatorEnabled(instructorUserId, context);

  const rangeStartUtc = new Date(data.from);
  const rangeEndUtc = new Date(data.to);
  const days = (rangeEndUtc.getTime() - rangeStartUtc.getTime()) / 86_400_000;
  if (days <= 0 || days > SLOTS_MAX_RANGE_DAYS) {
    throw new Error400(t.rangeTooLarge);
  }

  const sessionType = await prisma.oneOnOneSessionType.findUnique({
    where: { id: data.sessionTypeId },
  });
  if (
    !sessionType ||
    !sessionType.isActive ||
    sessionType.instructorUserId !== instructorUserId ||
    (sessionType.courseId !== null && sessionType.courseId !== courseId)
  ) {
    throw new Error404();
  }

  const [availability, booked] = await Promise.all([
    prisma.instructorAvailability.findMany({
      where: { instructorUserId, isActive: true },
    }),
    loadInstructorBookedIntervals(instructorUserId, rangeStartUtc, rangeEndUtc),
  ]);

  const slots = expandAvailabilityToSlots({
    availability: availability.map(toAvailabilityWindow),
    sessionType: {
      durationMinutes: sessionType.durationMinutes,
      bufferMinutes: sessionType.bufferMinutes,
      minNoticeHours: sessionType.minNoticeHours,
    },
    rangeStartUtc,
    rangeEndUtc,
    bookedSlots: booked,
    now: new Date(),
  });

  return c.json({
    slots: slots.map((s) => ({
      startUtc: s.startUtc.toISOString(),
      endUtc: s.endUtc.toISOString(),
    })),
  });
}

/** Books free sessions immediately and paid sessions through Stripe Checkout. */
export async function oneOnOneCreateBookingController(
  courseId: string,
  body: unknown,
  context: AppContext,
  c: Context,
) {
  const data = oneOnOneBookingInputSchema.parse(body);
  const { userId } = requireOneOnOneUser(context);
  const { course } = await courseEnsureLearningAccess(courseId, context);
  const t = context.dictionary.oneOnOneCall;
  const errors = t.errors;

  const instructorUserId = course.creatorUserId;
  if (!instructorUserId) {
    throw new Error400(errors.noInstructor);
  }
  if (instructorUserId === userId) {
    throw new Error400(errors.cannotBookSelf);
  }
  await trustSafetyRequireCreatorEnabled(instructorUserId, context);

  const sessionType = await prisma.oneOnOneSessionType.findUnique({
    where: { id: data.sessionTypeId },
  });
  if (
    !sessionType ||
    !sessionType.isActive ||
    sessionType.instructorUserId !== instructorUserId ||
    (sessionType.courseId !== null && sessionType.courseId !== courseId)
  ) {
    throw new Error404();
  }
  if (!sessionType.isFree && !env.STRIPE_SECRET_KEY) {
    throw new Error400(errors.paidNotAvailable);
  }

  const startUtc = new Date(data.startUtc);
  if (Number.isNaN(startUtc.getTime())) {
    throw new Error400(errors.slotUnavailable);
  }
  const endUtc = new Date(
    startUtc.getTime() + sessionType.durationMinutes * 60_000,
  );

  // Validate the requested instant is on the instructor's published grid and
  // not yet booked. The DB unique constraint is the authoritative guard;
  // this catches obvious misuse before the insert.
  const [availability, booked] = await Promise.all([
    prisma.instructorAvailability.findMany({
      where: { instructorUserId, isActive: true },
    }),
    loadInstructorBookedIntervals(
      instructorUserId,
      new Date(startUtc.getTime() - 24 * 60 * 60_000),
      new Date(endUtc.getTime() + 24 * 60 * 60_000),
    ),
  ]);
  const candidateSlots = expandAvailabilityToSlots({
    availability: availability.map(toAvailabilityWindow),
    sessionType: {
      durationMinutes: sessionType.durationMinutes,
      bufferMinutes: sessionType.bufferMinutes,
      minNoticeHours: sessionType.minNoticeHours,
    },
    rangeStartUtc: startUtc,
    rangeEndUtc: new Date(startUtc.getTime() + BOOKING_VALIDATION_WINDOW_MS),
    bookedSlots: booked,
    now: new Date(),
  });
  const matches = candidateSlots.some(
    (s) => s.startUtc.getTime() === startUtc.getTime(),
  );
  if (!matches) {
    throw new Error400(errors.slotUnavailable);
  }

  // Generate the Jitsi room up front for both free and paid bookings: the
  // room only exists on jit.si once someone joins, so reserving the name on a
  // pending row is harmless and keeps the schema simple (jitsiRoomName stays
  // NOT NULL).
  const room = generateJitsiRoom();
  const isPaid = !sessionType.isFree && (sessionType.priceCents ?? 0) > 0;

  if (isPaid) {
    await trustSafetyRequirePolicyAcceptance('refundPolicy', context);
  }

  let session;
  try {
    session = await prisma.oneOnOneSession.create({
      data: {
        sessionTypeId: sessionType.id,
        courseId,
        instructorUserId,
        studentUserId: userId,
        scheduledStartAt: startUtc,
        scheduledEndAt: endUtc,
        // slotKey holds the slot whether the booking is free (confirmed) or
        // paid (pendingPayment). The hold is released — by nulling slotKey —
        // on cancel/expiry.
        slotKey: startUtc,
        status: isPaid ? 'pendingPayment' : 'confirmed',
        jitsiRoomName: room.roomName,
        jitsiUrl: room.url,
        priceCents: isPaid ? sessionType.priceCents : null,
        currency: sessionType.currency,
        paymentExpiresAt: isPaid ? new Date(Date.now() + 30 * 60_000) : null,
      },
    });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === 'P2002'
    ) {
      throw new Error400(errors.slotTaken);
    }
    throw error;
  }

  // Paid path: open a Stripe Checkout session and return its URL. On any
  // failure we delete the held row so the slot frees immediately — the
  // releaseExpiredHold cron is a fallback, not the primary path.
  if (isPaid) {
    try {
      const stripe = new Stripe(env.STRIPE_SECRET_KEY!, {
        apiVersion: STRIPE_API_VERSION,
      });
      const frontendUrl = getFrontendUrl(context.currentOrganization?.slug);
      const checkout = await stripe.checkout.sessions.create(
        {
          ...checkoutTrustSessionOptions(context, 'oneOnOneSession'),
          mode: 'payment',
          submit_type: 'book',
          line_items: [
            {
              quantity: 1,
              price_data: {
                currency: sessionType.currency.toLowerCase(),
                unit_amount: sessionType.priceCents!,
                product_data: {
                  name: dictionaryFormat(
                    t.booking.stripeProductName,
                    course.title,
                    sessionType.title,
                  ),
                },
              },
            },
          ],
          metadata: {
            oneOnOneSessionId: session.id,
            kind: 'oneOnOneSession',
          },
          payment_intent_data: {
            metadata: {
              oneOnOneSessionId: session.id,
              kind: 'oneOnOneSession',
            },
          },
          success_url: `${frontendUrl}/sessions?payment=success`,
          cancel_url: `${frontendUrl}/sessions?payment=cancelled`,
          customer_email: context.currentUser?.email,
          expires_at: Math.floor(
            (
              session.paymentExpiresAt ?? new Date(Date.now() + 30 * 60_000)
            ).getTime() / 1000,
          ),
        },
        { idempotencyKey: `oneOnOne-checkout:${session.id}` },
      );
      const updated = await prisma.oneOnOneSession.update({
        where: { id: session.id },
        data: { stripeCheckoutSessionId: checkout.id },
      });
      await auditLogCreate({
        entityId: updated.id,
        entityName: 'OneOnOneSession',
        operation: auditLogOperations.create,
        organizationId: null,
        userId,
        newData: updated,
      });
      return c.json({ session: updated, checkoutUrl: checkout.url });
    } catch (error) {
      await prisma.oneOnOneSession
        .delete({ where: { id: session.id } })
        .catch(() => {});
      throw error;
    }
  }

  // Free path: notify both parties immediately.
  await auditLogCreate({
    entityId: session.id,
    entityName: 'OneOnOneSession',
    operation: auditLogOperations.create,
    organizationId: null,
    userId,
    newData: session,
  });

  const [instructor, student] = await Promise.all([
    prisma.user.findUnique({
      where: { id: instructorUserId },
      select: { name: true, email: true },
    }),
    prisma.user.findUnique({
      where: { id: userId },
      select: { name: true, email: true },
    }),
  ]);
  const when = formatSessionWhen(startUtc);
  const courseTitle = course.title;
  await Promise.all([
    notifyOneOnOneUser(userId, {
      title: t.notify.bookingConfirmedTitle,
      message: dictionaryFormat(
        t.notify.bookingConfirmedStudentBody,
        courseTitle,
        when,
      ),
    }),
    notifyOneOnOneUser(instructorUserId, {
      title: t.notify.bookingConfirmedTitle,
      message: dictionaryFormat(
        t.notify.bookingConfirmedInstructorBody,
        oneOnOneDisplayName(student ?? {}),
        courseTitle,
        when,
      ),
    }),
  ]);
  // instructor name is rendered on the student-side message via course.title;
  // kept here in case a future copy change wants the instructor's name.
  void instructor;

  await scheduleOneOnOneReminders(session.id, startUtc, context.locale);

  return c.json({ session });
}

// ----------------------------------------------------------------------------
// Session listing & detail
// ----------------------------------------------------------------------------

export async function oneOnOneListSessionsController(
  query: unknown,
  context: AppContext,
  c: Context,
) {
  const data = oneOnOneSessionsQuerySchema.parse(query);
  const { userId } = requireOneOnOneUser(context);

  const baseWhere: Prisma.OneOnOneSessionWhereInput =
    data.role === 'instructor'
      ? { instructorUserId: userId }
      : { studentUserId: userId };

  const now = new Date();
  if (data.scope === 'upcoming') {
    baseWhere.status = { in: ['confirmed', 'pendingPayment'] };
    baseWhere.scheduledStartAt = { gte: now };
  } else if (data.scope === 'past') {
    baseWhere.OR = [
      { status: { notIn: ['confirmed', 'pendingPayment'] } },
      { scheduledStartAt: { lt: now } },
    ];
  }

  const sessions = await prisma.oneOnOneSession.findMany({
    where: baseWhere,
    orderBy: { scheduledStartAt: data.scope === 'past' ? 'desc' : 'asc' },
    include: {
      course: { select: { id: true, title: true, slug: true } },
      sessionType: {
        select: { id: true, title: true, durationMinutes: true },
      },
      instructorUser: { select: { id: true, name: true, email: true } },
      studentUser: { select: { id: true, name: true, email: true } },
    },
    take: 200,
  });

  // Strip the join link from list rows — it's only handed out on the detail
  // endpoint (and only inside the join window — frontend gates display).
  const stripped = sessions.map((s) => ({
    ...s,
    jitsiUrl: undefined,
  }));
  return c.json({ sessions: stripped });
}

async function loadSessionForParticipant(
  sessionId: string,
  context: AppContext,
) {
  const { userId } = requireOneOnOneUser(context);
  const isAdmin = platformAdminIsUserAllowed(context.currentUser?.email);
  const session = await prisma.oneOnOneSession.findUnique({
    where: { id: sessionId },
    include: {
      course: { select: { id: true, title: true, slug: true } },
      sessionType: true,
      instructorUser: { select: { id: true, name: true, email: true } },
      studentUser: { select: { id: true, name: true, email: true } },
      // Exposes whether the student has already opened a dispute — used by
      // the frontend to suppress the "Dispute this session" button after
      // submission, and to render the dispute summary inline.
      dispute: {
        select: {
          id: true,
          status: true,
          reason: true,
          createdAt: true,
          resolvedAt: true,
          resolutionNotes: true,
        },
      },
    },
  });
  if (!session) {
    throw new Error404();
  }
  const isInstructor = session.instructorUserId === userId;
  const isStudent = session.studentUserId === userId;
  if (!isInstructor && !isStudent && !isAdmin) {
    throw new Error403();
  }
  return { session, userId, isInstructor, isStudent, isAdmin };
}

export async function oneOnOneGetSessionController(
  sessionId: string,
  context: AppContext,
  c: Context,
) {
  const { session, userId, isAdmin } = await loadSessionForParticipant(
    sessionId,
    context,
  );

  const rawNotes = await prisma.oneOnOneSessionNote.findMany({
    where: { sessionId },
    orderBy: { createdAt: 'asc' },
    include: {
      authorUser: { select: { id: true, name: true, email: true } },
    },
  });
  const notes = isAdmin
    ? rawNotes
    : rawNotes.filter((n) => n.isShared || n.authorUserId === userId);

  return c.json({ session, notes });
}

// ----------------------------------------------------------------------------
// Cancellation
// ----------------------------------------------------------------------------

export async function oneOnOneCancelSessionController(
  sessionId: string,
  body: unknown,
  context: AppContext,
  c: Context,
) {
  const data = oneOnOneCancelInputSchema.parse(body ?? {});
  const { session, userId, isInstructor, isStudent } =
    await loadSessionForParticipant(sessionId, context);
  const t = context.dictionary.oneOnOneCall;

  if (!isInstructor && !isStudent) {
    throw new Error403();
  }

  const outcome = evaluateCancellation({
    session: {
      status: session.status,
      scheduledStartAt: session.scheduledStartAt,
      instructorUserId: session.instructorUserId,
      studentUserId: session.studentUserId,
      priceCents: session.priceCents,
      paidAt: session.paidAt,
    },
    cancellingUserId: userId,
    now: new Date(),
  });
  if (!outcome.allowed || !outcome.newStatus) {
    throw new Error400(t.errors.cannotCancel);
  }

  const updated = await prisma.oneOnOneSession.update({
    where: { id: session.id },
    data: {
      status: outcome.newStatus,
      // Null the slotKey so the slot frees up immediately.
      slotKey: null,
      cancelledAt: new Date(),
      cancelledByUserId: userId,
      cancellationReason: data.reason ?? null,
      isLateCancel: outcome.isLateCancel,
    },
  });

  // If the policy says a refund is owed for a paid session, issue it now.
  // refundOneOnOneSession is idempotent + a no-op for free / unpaid rows; on
  // success it flips the status to 'refunded'. A Stripe failure must not
  // unwind the cancellation — we'd rather have the session cancelled and the
  // refund retried than leave a confirmed paid session in place.
  let final = updated;
  if (outcome.refundCents > 0) {
    try {
      final = await refundOneOnOneSession(updated, outcome.refundCents);
    } catch (error) {
      console.error(`Refund failed for OneOnOneSession ${updated.id}:`, error);
    }
  }

  await auditLogCreate({
    entityId: final.id,
    entityName: 'OneOnOneSession',
    operation: auditLogOperations.update,
    organizationId: null,
    userId,
    oldData: session,
    newData: final,
  });

  // Notify the *other* party.
  const otherUserId = outcome.byInstructor
    ? session.studentUserId
    : session.instructorUserId;
  const canceller = outcome.byInstructor
    ? session.instructorUser
    : session.studentUser;
  const courseTitle = session.course.title;
  const when = formatSessionWhen(session.scheduledStartAt);
  const body2 = outcome.byInstructor
    ? dictionaryFormat(
        t.notify.cancelledByInstructorBody,
        oneOnOneDisplayName(canceller),
        courseTitle,
        when,
      )
    : dictionaryFormat(
        t.notify.cancelledByStudentBody,
        oneOnOneDisplayName(canceller),
        courseTitle,
        when,
      );
  await notifyOneOnOneUser(otherUserId, {
    title: t.notify.cancelledTitle,
    message: body2,
  });

  return c.json({
    session: final,
    outcome: {
      isLateCancel: outcome.isLateCancel,
      refundCents: outcome.refundCents,
    },
  });
}

// ----------------------------------------------------------------------------
// Session notes
// ----------------------------------------------------------------------------

export async function oneOnOneCreateNoteController(
  sessionId: string,
  body: unknown,
  context: AppContext,
  c: Context,
) {
  const data = oneOnOneNoteInputSchema.parse(body);
  const { userId, isInstructor, isStudent } = await loadSessionForParticipant(
    sessionId,
    context,
  );
  if (!isInstructor && !isStudent) {
    throw new Error403();
  }
  const note = await prisma.oneOnOneSessionNote.create({
    data: {
      sessionId,
      authorUserId: userId,
      body: data.body,
      isShared: data.isShared,
    },
  });
  return c.json({ note });
}

export async function oneOnOneUpdateNoteController(
  sessionId: string,
  noteId: string,
  body: unknown,
  context: AppContext,
  c: Context,
) {
  const data = oneOnOneNoteUpdateSchema.parse(body);
  const { userId } = requireOneOnOneUser(context);
  const note = await prisma.oneOnOneSessionNote.findUnique({
    where: { id: noteId },
  });
  if (!note || note.sessionId !== sessionId) {
    throw new Error404();
  }
  if (note.authorUserId !== userId) {
    throw new Error403();
  }
  const updated = await prisma.oneOnOneSessionNote.update({
    where: { id: noteId },
    data: {
      body: data.body ?? undefined,
      isShared: data.isShared ?? undefined,
    },
  });
  return c.json({ note: updated });
}

export async function oneOnOneDeleteNoteController(
  sessionId: string,
  noteId: string,
  context: AppContext,
  c: Context,
) {
  const { userId } = requireOneOnOneUser(context);
  const note = await prisma.oneOnOneSessionNote.findUnique({
    where: { id: noteId },
  });
  if (!note || note.sessionId !== sessionId) {
    throw new Error404();
  }
  if (note.authorUserId !== userId) {
    throw new Error403();
  }
  await prisma.oneOnOneSessionNote.delete({ where: { id: noteId } });
  return c.json({ ok: true });
}
