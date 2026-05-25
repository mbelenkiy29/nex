// Hours before the scheduled start under which a student cancellation counts
// as a "late cancel" (no refund for paid sessions).
export const LATE_CANCEL_HOURS = 24;

// A session can only be cancelled while it is still upcoming.
const CANCELLABLE_STATUSES = ['pendingPayment', 'confirmed'] as const;

export type CancellableStatus = (typeof CANCELLABLE_STATUSES)[number];

export interface CancellationSession {
  status: string;
  scheduledStartAt: Date;
  instructorUserId: string;
  studentUserId: string;
  priceCents: number | null;
  paidAt: Date | null;
}

export interface CancellationInput {
  session: CancellationSession;
  cancellingUserId: string;
  now: Date;
}

export interface CancellationOutcome {
  allowed: boolean;
  reason?: 'alreadyTerminal' | 'notParticipant';
  byInstructor: boolean;
  isLateCancel: boolean;
  // How much to refund the student, in cents. 0 for free sessions, unpaid
  // bookings, and late student cancellations.
  refundCents: number;
  // The status to move the session to — null when the cancel is not allowed.
  newStatus: 'cancelledByStudent' | 'cancelledByInstructor' | null;
}

/**
 * Decides whether a 1:1 session may be cancelled and what the refund outcome
 * is. Pure — the controller persists the result and triggers any Stripe
 * refund. Policy:
 *  - Instructor cancels (any time): always allowed, full refund if paid.
 *  - Student cancels >= 24h before start: allowed, full refund if paid.
 *  - Student cancels < 24h before start: allowed (late cancel), no refund.
 *  - Already-terminal sessions cannot be cancelled.
 * Free / unpaid sessions always refund 0; the slot is released either way.
 */
export function evaluateCancellation(
  input: CancellationInput,
): CancellationOutcome {
  const { session, cancellingUserId, now } = input;

  const byInstructor = cancellingUserId === session.instructorUserId;
  const byStudent = cancellingUserId === session.studentUserId;

  if (!byInstructor && !byStudent) {
    return {
      allowed: false,
      reason: 'notParticipant',
      byInstructor: false,
      isLateCancel: false,
      refundCents: 0,
      newStatus: null,
    };
  }

  if (!CANCELLABLE_STATUSES.includes(session.status as CancellableStatus)) {
    return {
      allowed: false,
      reason: 'alreadyTerminal',
      byInstructor,
      isLateCancel: false,
      refundCents: 0,
      newStatus: null,
    };
  }

  // A session is "paid" only once Stripe confirmed it (paidAt set).
  const paidCents =
    session.paidAt && session.priceCents ? session.priceCents : 0;

  if (byInstructor) {
    return {
      allowed: true,
      byInstructor: true,
      isLateCancel: false,
      refundCents: paidCents,
      newStatus: 'cancelledByInstructor',
    };
  }

  const hoursUntilStart =
    (session.scheduledStartAt.getTime() - now.getTime()) / 3_600_000;
  const isLateCancel = hoursUntilStart < LATE_CANCEL_HOURS;

  return {
    allowed: true,
    byInstructor: false,
    isLateCancel,
    refundCents: isLateCancel ? 0 : paidCents,
    newStatus: 'cancelledByStudent',
  };
}
