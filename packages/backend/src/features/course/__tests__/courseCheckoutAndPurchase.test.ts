import { beforeEach, describe, expect, it, vi } from 'vitest';
import { courseCheckoutController } from '../courseCheckoutController';
import { coursePaymentWebhookHandler } from '../coursePaymentWebhook';
import { platformAdminCoursePurchaseRefundController } from '../coursePurchaseAdminController';
import {
  createTestCourseSeed,
  createTestEnrolledStudent,
  createTestPlatformAdmin,
  createTestVerifiedCreator,
} from '../../../test/testFactories';
import { testPrismaClient } from '../../../test/testPrismaClient';
import { env } from '../../../env';
import { Error400 } from '../../../shared/errors/Error400';

const mockCheckoutSessionsCreate = vi.hoisted(() => vi.fn());
const mockNotifyUserDirect = vi.hoisted(() => vi.fn());

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

function jsonContext() {
  return {
    json: vi.fn((payload) => payload),
  } as any;
}

describe('course checkout and purchase lifecycle', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    env.STRIPE_SECRET_KEY = 'sk_test_mock';
  });

  it('creates a discounted paid-course Stripe checkout session with coupon metadata', async () => {
    const creator = await createTestVerifiedCreator();
    const student = await createTestEnrolledStudent(
      (await createTestCourseSeed()).course.id,
    );
    const { course } = await createTestCourseSeed({
      accessType: 'paid',
      priceCents: 10000,
      creator,
    });
    const coupon = await testPrismaClient().courseCoupon.create({
      data: {
        code: 'SAVE25',
        discountType: 'percent',
        percentOff: 25,
        maxRedemptionsPerUser: 1,
        courseId: course.id,
        creatorUserId: creator.user.id,
      },
    });
    mockCheckoutSessionsCreate.mockResolvedValue({
      url: 'https://checkout.stripe.test/session',
    });

    const result = await courseCheckoutController(
      { id: course.id },
      { couponCode: 'save25' },
      student.context,
    );
    const [payload, options] = mockCheckoutSessionsCreate.mock.calls[0];

    expect(result.url).toBe('https://checkout.stripe.test/session');
    expect(payload.line_items[0].price_data.unit_amount).toBe(7500);
    expect(payload.metadata).toMatchObject({
      kind: 'coursePurchase',
      courseId: course.id,
      userId: student.user.id,
      couponId: coupon.id,
      discountCents: '2500',
    });
    expect(payload.payment_intent_data.metadata.couponId).toBe(coupon.id);
    expect(options.idempotencyKey).toBe(
      `course-checkout:${course.id}:${student.user.id}`,
    );
  });

  it('blocks active-enrollment repurchase but allows refunded students to start checkout again', async () => {
    const { course } = await createTestCourseSeed({
      accessType: 'paid',
      priceCents: 4900,
      stripePriceId: 'price_course_test',
    });
    const student = await createTestEnrolledStudent(course.id);
    mockCheckoutSessionsCreate.mockResolvedValue({
      url: 'https://checkout.stripe.test/rebuy',
    });

    await expect(
      courseCheckoutController({ id: course.id }, {}, student.context),
    ).rejects.toBeInstanceOf(Error400);
    expect(mockCheckoutSessionsCreate).not.toHaveBeenCalled();

    await testPrismaClient().courseEnrollment.update({
      where: {
        courseId_userId: { courseId: course.id, userId: student.user.id },
      },
      data: { status: 'refunded' },
    });

    const result = await courseCheckoutController(
      { id: course.id },
      {},
      student.context,
    );

    expect(result.url).toBe('https://checkout.stripe.test/rebuy');
    expect(mockCheckoutSessionsCreate).toHaveBeenCalledTimes(1);
  });

  it('handles successful payment webhooks idempotently, enrolls the buyer, redeems coupons, and creates payout', async () => {
    const creator = await createTestVerifiedCreator();
    const student = await createTestEnrolledStudent(
      (await createTestCourseSeed()).course.id,
    );
    const { course } = await createTestCourseSeed({
      accessType: 'paid',
      priceCents: 10000,
      creator,
    });
    const coupon = await testPrismaClient().courseCoupon.create({
      data: {
        code: 'WEBHOOK25',
        discountType: 'percent',
        percentOff: 25,
        maxRedemptionsPerUser: 1,
        courseId: course.id,
        creatorUserId: creator.user.id,
      },
    });
    const session = {
      id: 'cs_course_purchase_1',
      amount_total: 7500,
      currency: 'usd',
      payment_intent: 'pi_course_purchase_1',
      metadata: {
        kind: 'coursePurchase',
        courseId: course.id,
        userId: student.user.id,
        memberId: student.member.id,
        organizationId: student.organization.id,
        couponId: coupon.id,
        discountCents: '2500',
      },
    } as any;

    await coursePaymentWebhookHandler(
      {} as any,
      session as any,
      student.context,
    );
    await coursePaymentWebhookHandler(
      {} as any,
      session as any,
      student.context,
    );

    const [purchaseCount, enrollment, updatedCoupon, redemptions, payout] =
      await Promise.all([
        testPrismaClient().coursePurchase.count({
          where: { stripeCheckoutSessionId: session.id },
        }),
        testPrismaClient().courseEnrollment.findUnique({
          where: {
            courseId_userId: { courseId: course.id, userId: student.user.id },
          },
        }),
        testPrismaClient().courseCoupon.findUnique({
          where: { id: coupon.id },
        }),
        testPrismaClient().courseCouponRedemption.findMany({
          where: { couponId: coupon.id, userId: student.user.id },
        }),
        testPrismaClient().creatorPayout.findFirst({
          where: { courseId: course.id, creatorUserId: creator.user.id },
        }),
      ]);

    expect(purchaseCount).toBe(1);
    expect(enrollment?.status).toBe('active');
    expect(updatedCoupon?.redeemedCount).toBe(1);
    expect(redemptions).toHaveLength(1);
    expect(redemptions[0].discountCents).toBe(2500);
    expect(Number(payout?.amount)).toBe(52.5);
    expect(mockNotifyUserDirect).toHaveBeenCalledTimes(1);
  });

  it('marks a course purchase refunded, revokes access, and cancels the linked payout', async () => {
    const creator = await createTestVerifiedCreator();
    const admin = await createTestPlatformAdmin('course-refund-admin@test.dev');
    const { course } = await createTestCourseSeed({
      accessType: 'paid',
      priceCents: 6000,
      creator,
    });
    const student = await createTestEnrolledStudent(course.id);
    const payout = await testPrismaClient().creatorPayout.create({
      data: {
        amount: 42,
        currency: 'USD',
        status: 'pending',
        creatorUserId: creator.user.id,
        creatorMemberId: creator.member.id,
        courseId: course.id,
      },
    });
    const purchase = await testPrismaClient().coursePurchase.create({
      data: {
        courseId: course.id,
        userId: student.user.id,
        memberId: student.member.id,
        organizationId: student.organization.id,
        stripeCheckoutSessionId: 'cs_refund_1',
        stripePaymentIntentId: 'pi_refund_1',
        priceCents: 6000,
        currency: 'USD',
        payoutId: payout.id,
      },
    });

    const result = (await platformAdminCoursePurchaseRefundController(
      { id: purchase.id },
      { refundReason: 'Refund issued in Stripe.' },
      admin.context,
      jsonContext(),
    )) as any;
    const [enrollment, cancelledPayout] = await Promise.all([
      testPrismaClient().courseEnrollment.findUnique({
        where: {
          courseId_userId: { courseId: course.id, userId: student.user.id },
        },
      }),
      testPrismaClient().creatorPayout.findUnique({
        where: { id: payout.id },
      }),
    ]);

    expect(result.purchase.refundedAt).toBeTruthy();
    expect(result.purchase.refundedByUserId).toBe(admin.user.id);
    expect(enrollment?.status).toBe('refunded');
    expect(cancelledPayout?.status).toBe('cancelled');
    await expect(
      platformAdminCoursePurchaseRefundController(
        { id: purchase.id },
        {},
        admin.context,
        jsonContext(),
      ),
    ).rejects.toBeInstanceOf(Error400);
  });
});
