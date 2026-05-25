import { describe, it, expect } from 'vitest';
import { payoutOnboardingAction } from './creatorVerification';

describe('payoutOnboardingAction', () => {
  it('offers nothing until an application exists', () => {
    expect(payoutOnboardingAction('notStarted', false)).toBeNull();
  });

  it('offers "begin" when payout onboarding has not started', () => {
    expect(payoutOnboardingAction('notStarted', true)).toBe('begin');
  });

  it('offers "submit" while in progress or when changes are requested', () => {
    expect(payoutOnboardingAction('inProgress', true)).toBe('submit');
    expect(payoutOnboardingAction('actionRequired', true)).toBe('submit');
  });

  it('offers nothing once submitted or complete', () => {
    expect(payoutOnboardingAction('submitted', true)).toBeNull();
    expect(payoutOnboardingAction('complete', true)).toBeNull();
  });
});
