import { beforeEach, describe, expect, it, vi } from 'vitest';
import { env } from '../../../env';
import { Error400 } from '../../../shared/errors/Error400';
import {
  createTestCourseSeed,
  createTestEnrolledStudent,
  createTestVerifiedCreator,
} from '../../../test/testFactories';
import { testPrismaClient } from '../../../test/testPrismaClient';
import { oneOnOneCreateSessionTypeController } from '../oneOnOneAvailabilityControllers';
import { oneOnOneCreateBookingController } from '../oneOnOneBookingControllers';

const mockCheckoutSessionsCreate = vi.hoisted(() => vi.fn());
const mockNotifyUserDirect = vi.hoisted(() => vi.fn());
const mockBossSend = vi.hoisted(() => vi.fn());
const mockGetPgBoss = vi.hoisted(() => vi.fn());

vi.mock('stripe', () => ({
  default: class MockStripe {
    checkout = {
      sessions: {
        create: mockCheckoutSessionsCreate,
      },
    };
  },
}));

vi.mock('../../../shared/notification/notifyUserDirect', () => ({
  notifyUserDirect: mockNotifyUserDirect,
}));

vi.mock('../../../shared/jobs/pgBoss', () => ({
  getPgBoss: mockGetPgBoss,
}));

function jsonContext() {
  return {
    json: vi.fn((payload) => payload),
  } as any;
}

function futureUtcSlot(): Date {
  const startUtc = new Date(Date.now() + 14 * 24 * 60 * 60_000);
  startUtc.setUTCHours(9, 0, 0, 0);
  return startUtc;
}

async function createBookableSessionType(input: {
  isFree: boolean;
  priceCents?: number;
}) {
  const creator = await createTestVerifiedCreator();
  const { course } = await createTestCourseSeed({ creator });
  const student = await createTestEnrolledStudent(course.id);
  const startUtc = futureUtcSlot();

  await testPrismaClient().instructorAvailability.create({
    data: {
      instructorUserId: creator.user.id,
      dayOfWeek: startUtc.getUTCDay(),
      startMinute: 9 * 60,
      endMinute: 12 * 60,
      timezone: 'UTC',
    },
  });

  const result = (await oneOnOneCreateSessionTypeController(
    {
      courseId: course.id,
      title: input.isFree ? 'Office hours' : 'Paid coaching',
      durationMinutes: 60,
      isFree: input.isFree,
      priceCents: input.isFree ? null : input.priceCents,
      currency: 'USD',
      bufferMinutes: 0,
      minNoticeHours: 0,
    },
    creator.context,
    jsonContext(),
  )) as any;

  return {
    course,
    student,
    startUtc,
    sessionType: result.sessionType,
  };
}

describe('one-on-one paid booking lifecycle', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    env.STRIPE_SECRET_KEY = 'sk_test_mock';
    mockCheckoutSessionsCreate.mockResolvedValue({
      id: 'cs_one_on_one_1',
      url: 'https://checkout.stripe.test/one-on-one',
    });
    mockGetPgBoss.mockResolvedValue({
      send: mockBossSend,
    });
  });

  it('allows paid session types when Stripe is configured', async () => {
    const { sessionType } = await createBookableSessionType({
      isFree: false,
      priceCents: 2500,
    });

    expect(sessionType).toMatchObject({
      isFree: false,
      priceCents: 2500,
      currency: 'USD',
    });
  });

  it('blocks paid session types when Stripe is not configured', async () => {
    env.STRIPE_SECRET_KEY = undefined as any;
    const creator = await createTestVerifiedCreator();
    const { course } = await createTestCourseSeed({ creator });

    await expect(
      oneOnOneCreateSessionTypeController(
        {
          courseId: course.id,
          title: 'Paid coaching',
          durationMinutes: 60,
          isFree: false,
          priceCents: 2500,
          currency: 'USD',
          bufferMinutes: 0,
          minNoticeHours: 0,
        },
        creator.context,
        jsonContext(),
      ),
    ).rejects.toBeInstanceOf(Error400);
  });

  it('creates a pending paid booking and returns a Stripe Checkout URL', async () => {
    const { course, student, startUtc, sessionType } =
      await createBookableSessionType({
        isFree: false,
        priceCents: 2500,
      });

    const result = (await oneOnOneCreateBookingController(
      course.id,
      {
        sessionTypeId: sessionType.id,
        startUtc: startUtc.toISOString(),
      },
      student.context,
      jsonContext(),
    )) as any;
    const [payload, options] = mockCheckoutSessionsCreate.mock.calls[0];

    expect(result.checkoutUrl).toBe('https://checkout.stripe.test/one-on-one');
    expect(result.session).toMatchObject({
      status: 'pendingPayment',
      priceCents: 2500,
      currency: 'USD',
      stripeCheckoutSessionId: 'cs_one_on_one_1',
    });
    expect(result.session.paymentExpiresAt).toBeTruthy();
    expect(payload.line_items[0].price_data).toMatchObject({
      currency: 'usd',
      unit_amount: 2500,
    });
    expect(payload.line_items[0].price_data.product_data.name).toBe(
      `1:1 with ${course.title}: Paid coaching`,
    );
    expect(payload.metadata).toMatchObject({
      kind: 'oneOnOneSession',
      oneOnOneSessionId: result.session.id,
    });
    expect(options.idempotencyKey).toBe(
      `oneOnOne-checkout:${result.session.id}`,
    );
    expect(mockNotifyUserDirect).not.toHaveBeenCalled();
  });

  it('confirms free bookings without creating Stripe Checkout', async () => {
    const { course, student, startUtc, sessionType } =
      await createBookableSessionType({
        isFree: true,
      });

    const result = (await oneOnOneCreateBookingController(
      course.id,
      {
        sessionTypeId: sessionType.id,
        startUtc: startUtc.toISOString(),
      },
      student.context,
      jsonContext(),
    )) as any;

    expect(result.checkoutUrl).toBeUndefined();
    expect(result.session).toMatchObject({
      status: 'confirmed',
      priceCents: null,
      currency: 'USD',
    });
    expect(mockCheckoutSessionsCreate).not.toHaveBeenCalled();
    expect(mockNotifyUserDirect).toHaveBeenCalledTimes(2);
    expect(mockBossSend).toHaveBeenCalled();
  });
});
