import Stripe from 'stripe';
// bypass-RLS: 1:1 calls span instructor + student who may be in different
// orgs (marketplace pattern). Ownership filters by participant userIds
// remain explicit in every query.
// eslint-disable-next-line no-restricted-syntax
import { prisma, prismaDangerouslyBypassRLS } from '../../prisma';
import { getPgBoss } from '../../shared/jobs/pgBoss';
import { AppContext } from '../../shared/controller/appContext';
import { Error401 } from '../../shared/errors/Error401';
import { env } from '../../env';
import { STRIPE_API_VERSION } from '../subscription/stripeApiVersion';
import {
  ONE_ON_ONE_QUEUE,
  type OneOnOneJobKind,
} from './oneOnOneJobSchemas';
import type {
  InstructorAvailability,
  OneOnOneSession,
} from '../../prisma/generated/client';
import type {
  AvailabilityWindow,
  BookedInterval,
} from './oneOnOneSlotExpansion';

// Per-user notification — now lives in shared/notification/notifyUserDirect.ts
// because the same per-user (cross-org) pattern is reused by creator payouts
// and any future cross-tenant flow. Re-exported here for backwards
// compatibility with existing 1:1 imports.
export {
  notifyUserDirect as notifyOneOnOneUser,
  type DirectUserNotice as OneOnOneNotice,
} from '../../shared/notification/notifyUserDirect';

// A signed-in user is required for every 1:1 endpoint.
export function requireOneOnOneUser(context: AppContext): { userId: string } {
  if (!context.currentUser) {
    throw new Error401();
  }
  return { userId: context.currentUser.id };
}

// Maps a stored availability row to the pure slot-expansion input shape.
export function toAvailabilityWindow(
  row: InstructorAvailability,
): AvailabilityWindow {
  return {
    dayOfWeek: row.dayOfWeek,
    startMinute: row.startMinute,
    endMinute: row.endMinute,
    timezone: row.timezone,
    isActive: row.isActive,
  };
}

/**
 * Loads the instructor's confirmed / payment-pending sessions overlapping a
 * window, as intervals the slot expander excludes. Cancelled / expired
 * sessions are skipped — they no longer hold their slot.
 */
export async function loadInstructorBookedIntervals(
  instructorUserId: string,
  fromUtc: Date,
  toUtc: Date,
): Promise<BookedInterval[]> {
  const sessions = await prisma.oneOnOneSession.findMany({
    where: {
      instructorUserId,
      status: { in: ['confirmed', 'pendingPayment'] },
      scheduledStartAt: { lt: toUtc },
      scheduledEndAt: { gt: fromUtc },
    },
    select: { scheduledStartAt: true, scheduledEndAt: true },
  });
  return sessions.map((s) => ({
    startUtc: s.scheduledStartAt,
    endUtc: s.scheduledEndAt,
  }));
}

// A friendly display name for a user, falling back to the email local part.
export function oneOnOneDisplayName(user: {
  name?: string | null;
  email?: string | null;
}): string {
  const name = user.name?.trim();
  if (name) {
    return name;
  }
  return user.email?.split('@')[0] || 'A user';
}

// A compact, unambiguous UTC rendering for notification text.
export function formatSessionWhen(date: Date): string {
  return date.toUTCString();
}

/**
 * Refunds a paid 1:1 session via Stripe and flips the local row to refunded.
 * Idempotent: if the session is already refunded (or wasn't paid in the first
 * place), this is a no-op. Cancels any still-`pending` CreatorPayout so the
 * instructor doesn't earn on a refunded session.
 */
export async function refundOneOnOneSession(
  session: OneOnOneSession,
  refundCents?: number,
): Promise<OneOnOneSession> {
  // Free / unpaid sessions have nothing to refund.
  if (!session.paidAt || !session.stripePaymentIntentId || !session.priceCents) {
    return session;
  }
  if (session.status === 'refunded' || session.refundedAt) {
    return session;
  }
  if (!env.STRIPE_SECRET_KEY) {
    console.warn(
      `Cannot refund session ${session.id}: STRIPE_SECRET_KEY not configured`,
    );
    return session;
  }

  const amount = Math.max(0, Math.min(refundCents ?? session.priceCents, session.priceCents));
  if (amount <= 0) {
    return session;
  }

  const stripe = new Stripe(env.STRIPE_SECRET_KEY, {
    apiVersion: STRIPE_API_VERSION,
  });

  await stripe.refunds.create(
    {
      payment_intent: session.stripePaymentIntentId,
      amount,
    },
    { idempotencyKey: `oneOnOne-refund:${session.id}` },
  );

  return prismaDangerouslyBypassRLS.$transaction(async (tx) => {
    if (session.payoutId) {
      const payout = await tx.creatorPayout.findUnique({
        where: { id: session.payoutId },
      });
      if (payout && payout.status === 'pending') {
        await tx.creatorPayout.update({
          where: { id: payout.id },
          data: { status: 'cancelled', cancelledAt: new Date() },
        });
      }
    }
    return tx.oneOnOneSession.update({
      where: { id: session.id },
      data: {
        status: 'refunded',
        refundedAt: new Date(),
        refundCents: amount,
      },
    });
  });
}

const REMINDER_OFFSETS: Array<{ kind: OneOnOneJobKind; msBefore: number }> = [
  { kind: 'reminder24h', msBefore: 24 * 60 * 60_000 },
  { kind: 'reminder1h', msBefore: 60 * 60_000 },
];

/**
 * Enqueues per-session reminder jobs at booking confirmation. pg-boss
 * `startAfter` accepts a Date; jobs scheduled in the past are skipped (a
 * booking made less than 24h before start gets only the 1h reminder).
 * Best-effort — pg-boss errors never block a booking.
 */
export async function scheduleOneOnOneReminders(
  sessionId: string,
  scheduledStartAt: Date,
  locale: string,
): Promise<void> {
  try {
    const boss = await getPgBoss();
    const now = Date.now();
    for (const { kind, msBefore } of REMINDER_OFFSETS) {
      const fireAt = new Date(scheduledStartAt.getTime() - msBefore);
      if (fireAt.getTime() <= now) continue;
      await boss.send(
        ONE_ON_ONE_QUEUE,
        { kind, sessionId, locale },
        { startAfter: fireAt },
      );
    }
  } catch (error) {
    console.error('Failed to schedule 1:1 reminders:', error);
  }
}
