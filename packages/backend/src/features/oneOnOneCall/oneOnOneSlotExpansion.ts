import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone.js';
import utc from 'dayjs/plugin/utc.js';

dayjs.extend(utc);
dayjs.extend(timezone);

// One recurring weekly availability window, expressed in the instructor's tz.
export interface AvailabilityWindow {
  dayOfWeek: number; // 0 = Sunday .. 6 = Saturday
  startMinute: number; // minutes from local midnight, inclusive
  endMinute: number; // minutes from local midnight, exclusive
  timezone: string; // IANA timezone the window is expressed in
  isActive?: boolean; // inactive windows are skipped
}

export interface SlotSessionType {
  durationMinutes: number;
  bufferMinutes: number;
  minNoticeHours: number;
}

export interface BookedInterval {
  startUtc: Date;
  endUtc: Date;
}

export interface BookableSlot {
  startUtc: Date;
  endUtc: Date;
}

export interface ExpandAvailabilityInput {
  availability: AvailabilityWindow[];
  sessionType: SlotSessionType;
  rangeStartUtc: Date; // inclusive
  rangeEndUtc: Date; // exclusive
  bookedSlots: BookedInterval[]; // confirmed / pending sessions to exclude
  now: Date;
}

const MS_PER_HOUR = 3_600_000;

/**
 * Expands recurring weekly availability windows into concrete bookable slots
 * for a UTC date range, dropping slots that are too soon (min-notice) or that
 * overlap an existing booking. Pure and timezone-correct (DST handled by
 * dayjs-timezone) — the slot returned is authoritative only up to the DB
 * unique constraint, which is the real double-booking guard.
 */
export function expandAvailabilityToSlots(
  input: ExpandAvailabilityInput,
): BookableSlot[] {
  const { availability, sessionType, rangeStartUtc, rangeEndUtc, bookedSlots } =
    input;
  const { durationMinutes, bufferMinutes, minNoticeHours } = sessionType;

  if (
    durationMinutes <= 0 ||
    rangeEndUtc.getTime() <= rangeStartUtc.getTime()
  ) {
    return [];
  }

  const earliestStartMs =
    input.now.getTime() + Math.max(0, minNoticeHours) * MS_PER_HOUR;
  const stepMinutes = durationMinutes + Math.max(0, bufferMinutes);
  const activeWindows = availability.filter((w) => w.isActive !== false);
  if (activeWindows.length === 0) {
    return [];
  }

  // Slots keyed by epoch ms so overlapping windows can't emit a duplicate.
  const slotByMs = new Map<number, BookableSlot>();

  // Walk calendar days from one day before the range to one day after, so a
  // window whose local date differs from the UTC date is still covered.
  const lastDay = dayjs.utc(rangeEndUtc).add(1, 'day').startOf('day');
  let day = dayjs.utc(rangeStartUtc).subtract(1, 'day').startOf('day');

  while (!day.isAfter(lastDay)) {
    const localDateStr = day.format('YYYY-MM-DD');

    for (const window of activeWindows) {
      if (window.endMinute <= window.startMinute) {
        continue;
      }

      // Interpret this calendar date as local midnight in the window's tz.
      const localMidnight = dayjs.tz(localDateStr, window.timezone);
      if (localMidnight.day() !== window.dayOfWeek) {
        continue;
      }

      const windowStart = localMidnight.add(window.startMinute, 'minute');
      const windowEnd = localMidnight.add(window.endMinute, 'minute');

      let slotStart = windowStart;
      while (true) {
        const slotEnd = slotStart.add(durationMinutes, 'minute');
        if (slotEnd.isAfter(windowEnd)) {
          break;
        }

        const startUtc = slotStart.toDate();
        const startMs = startUtc.getTime();
        if (
          startMs >= rangeStartUtc.getTime() &&
          startMs < rangeEndUtc.getTime() &&
          startMs >= earliestStartMs
        ) {
          slotByMs.set(startMs, { startUtc, endUtc: slotEnd.toDate() });
        }

        slotStart = slotStart.add(stepMinutes, 'minute');
      }
    }

    day = day.add(1, 'day');
  }

  const slots = [...slotByMs.values()].filter((slot) => {
    return !bookedSlots.some(
      (booked) =>
        slot.startUtc.getTime() < booked.endUtc.getTime() &&
        booked.startUtc.getTime() < slot.endUtc.getTime(),
    );
  });

  slots.sort((a, b) => a.startUtc.getTime() - b.startUtc.getTime());
  return slots;
}
