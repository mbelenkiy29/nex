// Default creator revenue share, mirroring Course.creatorRevenueShareBps
// (7000 bps = 70% to the creator, 30% platform).
export const DEFAULT_REVENUE_SHARE_BPS = 7000;

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
  const bps = Math.min(10000, Math.max(0, Math.round(revenueShareBps)));
  const payoutCents = Math.round((cents * bps) / 10000);
  return {
    amount: payoutCents / 100,
    currency: currency || 'USD',
  };
}
