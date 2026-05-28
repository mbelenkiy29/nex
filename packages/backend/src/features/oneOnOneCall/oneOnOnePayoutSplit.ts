import {
  COURSE_DEFAULT_CREATOR_REVENUE_SHARE_BPS,
  COURSE_REVENUE_SHARE_TOTAL_BPS,
} from '../course/courseRevenueShare';

export const DEFAULT_REVENUE_SHARE_BPS =
  COURSE_DEFAULT_CREATOR_REVENUE_SHARE_BPS;

export interface CreatorPayoutSplit {
  // Payout amount in major currency units (e.g. dollars), 2-dp rounded —
  // ready to write straight onto a CreatorPayout.amount Decimal column.
  amount: number;
  currency: string;
}

/**
 * Splits a paid 1:1 session price into the instructor's payout using the
 * course revenue-share basis points. Pure — the controller wraps the result
 * in a CreatorPayout row. Defensive against out-of-range inputs.
 */
export function computeCreatorPayout(
  priceCents: number,
  currency: string,
  revenueShareBps: number = DEFAULT_REVENUE_SHARE_BPS,
): CreatorPayoutSplit {
  const cents = Math.max(0, Math.round(priceCents || 0));
  const bps = Math.min(
    COURSE_REVENUE_SHARE_TOTAL_BPS,
    Math.max(0, Math.round(revenueShareBps)),
  );
  const payoutCents = Math.round(
    (cents * bps) / COURSE_REVENUE_SHARE_TOTAL_BPS,
  );
  return {
    amount: payoutCents / 100,
    currency: currency || 'USD',
  };
}
