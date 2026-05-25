import Stripe from 'stripe';
import { env } from '../../env';
// bypass-RLS: paid-checkout flow runs PRE-enrollment — the student may
// not yet be a member of the seller's org. CoursePurchase + Course are
// marketplace-scoped, not org-scoped.
// eslint-disable-next-line no-restricted-syntax
import { prismaDangerouslyBypassRLS } from '../../prisma';
import { AppContext } from '../../shared/controller/appContext';
import { Error400 } from '../../shared/errors/Error400';
import { Error404 } from '../../shared/errors/Error404';
import { auditLogCreate } from '../auditLog/auditLogCreate';
import { auditLogOperations } from '../auditLog/auditLogOperations';
import { STRIPE_API_VERSION } from '../subscription/stripeApiVersion';

// Set on every Stripe Product/Price provisioned for a course, so a webhook
// or admin can scan back and tell which Stripe object belongs to which
// course. Distinct from the checkout-session `kind` (see coursePaymentWebhook).
export const COURSE_STRIPE_PRODUCT_METADATA_KIND = 'course';

interface EnsureStripePriceResult {
  stripeProductId: string;
  stripePriceId: string;
}

function newStripe(): Stripe {
  return new Stripe(env.STRIPE_SECRET_KEY!, {
    apiVersion: STRIPE_API_VERSION,
  });
}

/**
 * Idempotently provisions (or rotates) the Stripe Price that backs a paid
 * course. Returns the current active priceId after the call.
 *
 * Rotation flow (priceCents or currency changed):
 *   1. Acquire pg_advisory_xact_lock(hashtext(courseId)) so two concurrent
 *      admins editing the price cannot race and create two active rows.
 *   2. Find an existing CourseStripePrice row matching the current
 *      (priceCents, currency). If found AND `Course.stripePriceId` points
 *      at it, no-op.
 *   3. Otherwise: archive the previously-active row (Stripe + DB), find or
 *      create the Stripe Product, create a new Stripe Price, insert a new
 *      CourseStripePrice row, update `Course.stripePriceId`.
 *   4. Audit-log the rotation.
 */
export async function coursePaymentEnsureStripePrice(
  courseId: string,
  context: AppContext,
): Promise<EnsureStripePriceResult> {
  const stripe = newStripe();

  return await prismaDangerouslyBypassRLS.$transaction(async (tx) => {
    // Serialize concurrent rotations on the same course. Postgres
    // advisory locks scope to the transaction and release on commit/rollback.
    await tx.$queryRaw`SELECT pg_advisory_xact_lock(hashtext(${courseId}))`;

    const course = await tx.course.findUnique({
      where: { id: courseId },
      select: {
        id: true,
        title: true,
        accessType: true,
        priceCents: true,
        currency: true,
        stripePriceId: true,
      },
    });
    if (!course) {
      throw new Error404();
    }
    if (course.accessType !== 'paid') {
      throw new Error400(
        context.dictionary.course.errors.coursePaymentNotConfigured,
      );
    }
    if (!course.priceCents || course.priceCents <= 0) {
      throw new Error400(
        context.dictionary.course.errors.coursePaymentNotConfigured,
      );
    }
    const targetPriceCents = course.priceCents;
    const targetCurrency = (course.currency || 'USD').toLowerCase();

    // Fast path: an active row already matches the current price & currency
    // AND the course points at it. No Stripe round-trips needed.
    const active = await tx.courseStripePrice.findFirst({
      where: { courseId, isActive: true },
      select: {
        id: true,
        stripeProductId: true,
        stripePriceId: true,
        priceCents: true,
        currency: true,
      },
    });
    if (
      active &&
      active.priceCents === targetPriceCents &&
      active.currency.toLowerCase() === targetCurrency &&
      course.stripePriceId === active.stripePriceId
    ) {
      return {
        stripeProductId: active.stripeProductId,
        stripePriceId: active.stripePriceId,
      };
    }

    // Find-or-create the Stripe Product. The Product is per-course, the
    // Price rotates within it. Search by metadata so a re-run after the
    // local row was dropped still reattaches to the same Product.
    let stripeProductId = active?.stripeProductId ?? null;
    if (!stripeProductId) {
      const found = await stripe.products.search({
        query: `metadata['courseId']:'${courseId}' AND metadata['kind']:'${COURSE_STRIPE_PRODUCT_METADATA_KIND}'`,
      });
      stripeProductId = found.data[0]?.id ?? null;
    }
    if (!stripeProductId) {
      const product = await stripe.products.create({
        name: course.title,
        metadata: {
          kind: COURSE_STRIPE_PRODUCT_METADATA_KIND,
          courseId,
        },
      });
      stripeProductId = product.id;
    }

    // Archive the prior active Price (Stripe + DB) before creating a new one.
    if (active) {
      try {
        await stripe.prices.update(active.stripePriceId, { active: false });
      } catch (e) {
        // The Price may already be archived on Stripe (manual cleanup, prior
        // failed rotation). Don't block the rotation on that.
        console.warn(
          `coursePaymentEnsureStripePrice: failed to archive ${active.stripePriceId}`,
          e,
        );
      }
      await tx.courseStripePrice.update({
        where: { id: active.id },
        data: { isActive: false, archivedAt: new Date() },
      });
    }

    // Create the new Stripe Price.
    const stripePrice = await stripe.prices.create({
      unit_amount: targetPriceCents,
      currency: targetCurrency,
      product: stripeProductId,
      metadata: {
        kind: COURSE_STRIPE_PRODUCT_METADATA_KIND,
        courseId,
      },
    });

    await tx.courseStripePrice.create({
      data: {
        courseId,
        stripeProductId,
        stripePriceId: stripePrice.id,
        priceCents: targetPriceCents,
        currency: targetCurrency.toUpperCase(),
        isActive: true,
      },
    });

    await tx.course.update({
      where: { id: courseId },
      data: { stripePriceId: stripePrice.id },
    });

    await auditLogCreate({
      entityId: courseId,
      entityName: 'Course',
      operation: auditLogOperations.update,
      context,
      tx,
      oldData: { stripePriceId: course.stripePriceId },
      newData: {
        stripePriceId: stripePrice.id,
        archivedStripePriceId: active?.stripePriceId ?? null,
        priceCents: targetPriceCents,
        currency: targetCurrency.toUpperCase(),
      },
    });

    return {
      stripeProductId,
      stripePriceId: stripePrice.id,
    };
  });
}

/**
 * Archives the currently-active Stripe Price for a course (e.g. when a
 * course is withdrawn from sale). Leaves `Course.stripePriceId` populated
 * so existing CoursePurchase rows can still resolve their source price for
 * accounting. Stripe rejects new purchases against an archived Price, which
 * is the correct end-state.
 */
export async function coursePaymentArchiveStripePrice(
  courseId: string,
  context: AppContext,
): Promise<void> {
  const stripe = newStripe();
  await prismaDangerouslyBypassRLS.$transaction(async (tx) => {
    await tx.$queryRaw`SELECT pg_advisory_xact_lock(hashtext(${courseId}))`;
    const active = await tx.courseStripePrice.findFirst({
      where: { courseId, isActive: true },
      select: { id: true, stripePriceId: true },
    });
    if (!active) return;
    try {
      await stripe.prices.update(active.stripePriceId, { active: false });
    } catch (e) {
      console.warn(
        `coursePaymentArchiveStripePrice: failed to archive ${active.stripePriceId}`,
        e,
      );
    }
    await tx.courseStripePrice.update({
      where: { id: active.id },
      data: { isActive: false, archivedAt: new Date() },
    });
    await auditLogCreate({
      entityId: courseId,
      entityName: 'Course',
      operation: auditLogOperations.update,
      context,
      tx,
      oldData: { stripePriceId: active.stripePriceId },
      newData: { stripePriceId: null, archivedStripePriceId: active.stripePriceId },
    });
  });
}
