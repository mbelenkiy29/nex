import { describe, expect, it } from 'vitest';
import { expandAvailabilityToSlots } from '../oneOnOneSlotExpansion';
import type { AvailabilityWindow } from '../oneOnOneSlotExpansion';
import {
  LATE_CANCEL_HOURS,
  evaluateCancellation,
} from '../oneOnOneCancellationPolicy';
import type { CancellationSession } from '../oneOnOneCancellationPolicy';
import {
  DEFAULT_REVENUE_SHARE_BPS,
  computeCreatorPayout,
} from '../oneOnOnePayoutSplit';

// 2026-06-01 is a Monday (dayOfWeek 1); 2026-01-05 is also a Monday.
const utcWindow = (over: Partial<AvailabilityWindow> = {}): AvailabilityWindow => ({
  dayOfWeek: 1,
  startMinute: 9 * 60, // 09:00
  endMinute: 11 * 60, // 11:00
  timezone: 'UTC',
  isActive: true,
  ...over,
});

const longAgo = new Date('2020-01-01T00:00:00Z');
const sixtyMin = { durationMinutes: 60, bufferMinutes: 0, minNoticeHours: 0 };

describe('expandAvailabilityToSlots', () => {
  it('returns nothing when there is no availability', () => {
    const slots = expandAvailabilityToSlots({
      availability: [],
      sessionType: sixtyMin,
      rangeStartUtc: new Date('2026-06-01T00:00:00Z'),
      rangeEndUtc: new Date('2026-06-02T00:00:00Z'),
      bookedSlots: [],
      now: longAgo,
    });
    expect(slots).toEqual([]);
  });

  it('tiles a window into back-to-back slots', () => {
    const slots = expandAvailabilityToSlots({
      availability: [utcWindow()],
      sessionType: sixtyMin,
      rangeStartUtc: new Date('2026-06-01T00:00:00Z'),
      rangeEndUtc: new Date('2026-06-02T00:00:00Z'),
      bookedSlots: [],
      now: longAgo,
    });
    expect(slots.map((s) => s.startUtc.toISOString())).toEqual([
      '2026-06-01T09:00:00.000Z',
      '2026-06-01T10:00:00.000Z',
    ]);
  });

  it('respects the buffer between slots', () => {
    const slots = expandAvailabilityToSlots({
      availability: [utcWindow({ endMinute: 12 * 60 })], // 09:00-12:00
      sessionType: { durationMinutes: 60, bufferMinutes: 30, minNoticeHours: 0 },
      rangeStartUtc: new Date('2026-06-01T00:00:00Z'),
      rangeEndUtc: new Date('2026-06-02T00:00:00Z'),
      bookedSlots: [],
      now: longAgo,
    });
    expect(slots.map((s) => s.startUtc.toISOString())).toEqual([
      '2026-06-01T09:00:00.000Z',
      '2026-06-01T10:30:00.000Z',
    ]);
  });

  it('drops slots inside the minimum-notice window', () => {
    const slots = expandAvailabilityToSlots({
      availability: [utcWindow()],
      sessionType: { durationMinutes: 60, bufferMinutes: 0, minNoticeHours: 1 },
      rangeStartUtc: new Date('2026-06-01T00:00:00Z'),
      rangeEndUtc: new Date('2026-06-02T00:00:00Z'),
      bookedSlots: [],
      now: new Date('2026-06-01T08:30:00Z'), // earliest start 09:30Z
    });
    expect(slots.map((s) => s.startUtc.toISOString())).toEqual([
      '2026-06-01T10:00:00.000Z',
    ]);
  });

  it('excludes slots overlapping an existing booking', () => {
    const slots = expandAvailabilityToSlots({
      availability: [utcWindow()],
      sessionType: sixtyMin,
      rangeStartUtc: new Date('2026-06-01T00:00:00Z'),
      rangeEndUtc: new Date('2026-06-02T00:00:00Z'),
      bookedSlots: [
        {
          startUtc: new Date('2026-06-01T09:00:00Z'),
          endUtc: new Date('2026-06-01T10:00:00Z'),
        },
      ],
      now: longAgo,
    });
    expect(slots.map((s) => s.startUtc.toISOString())).toEqual([
      '2026-06-01T10:00:00.000Z',
    ]);
  });

  it('de-duplicates overlapping availability windows', () => {
    const slots = expandAvailabilityToSlots({
      availability: [utcWindow(), utcWindow()],
      sessionType: sixtyMin,
      rangeStartUtc: new Date('2026-06-01T00:00:00Z'),
      rangeEndUtc: new Date('2026-06-02T00:00:00Z'),
      bookedSlots: [],
      now: longAgo,
    });
    expect(slots).toHaveLength(2);
  });

  it('skips inactive windows', () => {
    const slots = expandAvailabilityToSlots({
      availability: [utcWindow({ isActive: false })],
      sessionType: sixtyMin,
      rangeStartUtc: new Date('2026-06-01T00:00:00Z'),
      rangeEndUtc: new Date('2026-06-02T00:00:00Z'),
      bookedSlots: [],
      now: longAgo,
    });
    expect(slots).toEqual([]);
  });

  it('converts a tz-local window to UTC, DST-aware', () => {
    // 09:00 New York. Winter date -> EST (UTC-5) -> 14:00Z.
    const winter = expandAvailabilityToSlots({
      availability: [
        utcWindow({ timezone: 'America/New_York', endMinute: 10 * 60 }),
      ],
      sessionType: sixtyMin,
      rangeStartUtc: new Date('2026-01-05T00:00:00Z'),
      rangeEndUtc: new Date('2026-01-06T00:00:00Z'),
      bookedSlots: [],
      now: longAgo,
    });
    expect(winter.map((s) => s.startUtc.toISOString())).toEqual([
      '2026-01-05T14:00:00.000Z',
    ]);

    // Same window, summer date -> EDT (UTC-4) -> 13:00Z.
    const summer = expandAvailabilityToSlots({
      availability: [
        utcWindow({ timezone: 'America/New_York', endMinute: 10 * 60 }),
      ],
      sessionType: sixtyMin,
      rangeStartUtc: new Date('2026-06-01T00:00:00Z'),
      rangeEndUtc: new Date('2026-06-02T00:00:00Z'),
      bookedSlots: [],
      now: longAgo,
    });
    expect(summer.map((s) => s.startUtc.toISOString())).toEqual([
      '2026-06-01T13:00:00.000Z',
    ]);
  });
});

describe('evaluateCancellation', () => {
  const baseSession = (over: Partial<CancellationSession> = {}): CancellationSession => ({
    status: 'confirmed',
    scheduledStartAt: new Date('2026-06-10T12:00:00Z'),
    instructorUserId: 'instructor-1',
    studentUserId: 'student-1',
    priceCents: 5000,
    paidAt: new Date('2026-06-01T00:00:00Z'),
    ...over,
  });

  it('lets the instructor cancel any time with a full refund', () => {
    const out = evaluateCancellation({
      session: baseSession(),
      cancellingUserId: 'instructor-1',
      now: new Date('2026-06-10T11:30:00Z'), // 30 min before start
    });
    expect(out).toMatchObject({
      allowed: true,
      byInstructor: true,
      isLateCancel: false,
      refundCents: 5000,
      newStatus: 'cancelledByInstructor',
    });
  });

  it('refunds a student who cancels 24h+ before start', () => {
    const out = evaluateCancellation({
      session: baseSession(),
      cancellingUserId: 'student-1',
      now: new Date('2026-06-09T11:00:00Z'), // ~25h before
    });
    expect(out).toMatchObject({
      allowed: true,
      isLateCancel: false,
      refundCents: 5000,
      newStatus: 'cancelledByStudent',
    });
  });

  it('treats a student cancel under 24h as a late cancel with no refund', () => {
    const out = evaluateCancellation({
      session: baseSession(),
      cancellingUserId: 'student-1',
      now: new Date('2026-06-09T13:00:00Z'), // 23h before
    });
    expect(out.allowed).toBe(true);
    expect(out.isLateCancel).toBe(true);
    expect(out.refundCents).toBe(0);
  });

  it('never refunds a free session', () => {
    const out = evaluateCancellation({
      session: baseSession({ priceCents: null, paidAt: null }),
      cancellingUserId: 'student-1',
      now: new Date('2026-06-09T11:00:00Z'),
    });
    expect(out.allowed).toBe(true);
    expect(out.refundCents).toBe(0);
  });

  it('refunds nothing for an unpaid pending booking', () => {
    const out = evaluateCancellation({
      session: baseSession({ status: 'pendingPayment', paidAt: null }),
      cancellingUserId: 'student-1',
      now: new Date('2026-06-01T00:00:00Z'),
    });
    expect(out.allowed).toBe(true);
    expect(out.refundCents).toBe(0);
    expect(out.newStatus).toBe('cancelledByStudent');
  });

  it('rejects a non-participant', () => {
    const out = evaluateCancellation({
      session: baseSession(),
      cancellingUserId: 'someone-else',
      now: new Date('2026-06-01T00:00:00Z'),
    });
    expect(out.allowed).toBe(false);
    expect(out.reason).toBe('notParticipant');
  });

  it('rejects cancelling an already-terminal session', () => {
    const out = evaluateCancellation({
      session: baseSession({ status: 'completed' }),
      cancellingUserId: 'student-1',
      now: new Date('2026-06-01T00:00:00Z'),
    });
    expect(out.allowed).toBe(false);
    expect(out.reason).toBe('alreadyTerminal');
  });

  it('uses a 24-hour late-cancel threshold', () => {
    expect(LATE_CANCEL_HOURS).toBe(24);
  });
});

describe('computeCreatorPayout', () => {
  it('applies the default 70% revenue share', () => {
    expect(computeCreatorPayout(2000, 'USD')).toEqual({
      amount: 14,
      currency: 'USD',
    });
    expect(DEFAULT_REVENUE_SHARE_BPS).toBe(7000);
  });

  it('rounds to whole cents', () => {
    // 999 * 7000 / 10000 = 699.3 cents -> 699 -> $6.99
    expect(computeCreatorPayout(999, 'USD', 7000).amount).toBe(6.99);
  });

  it('honours a custom revenue share', () => {
    expect(computeCreatorPayout(10000, 'EUR', 8500)).toEqual({
      amount: 85,
      currency: 'EUR',
    });
  });

  it('returns zero for a zero price', () => {
    expect(computeCreatorPayout(0, 'USD').amount).toBe(0);
  });

  it('clamps an out-of-range revenue share', () => {
    expect(computeCreatorPayout(1000, 'USD', 99999).amount).toBe(10);
    expect(computeCreatorPayout(1000, 'USD', -50).amount).toBe(0);
  });
});
