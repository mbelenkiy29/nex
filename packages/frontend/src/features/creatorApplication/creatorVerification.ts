export type PayoutOnboardingStatus =
  | 'notStarted'
  | 'inProgress'
  | 'submitted'
  | 'actionRequired'
  | 'complete';

/**
 * Decides which payout-onboarding action a creator can take next, given the
 * current tracked status. Returns `null` when there is nothing for the creator
 * to do — no application yet, awaiting admin review, or already complete.
 *
 * Payout onboarding is status-tracking only (no Stripe Connect): the creator
 * drives `notStarted -> begin -> submit`, and an admin resolves the rest.
 */
export function payoutOnboardingAction(
  status: PayoutOnboardingStatus,
  hasApplication: boolean,
): 'begin' | 'submit' | null {
  if (!hasApplication) {
    return null;
  }

  if (status === 'notStarted') {
    return 'begin';
  }

  if (status === 'inProgress' || status === 'actionRequired') {
    return 'submit';
  }

  return null;
}
