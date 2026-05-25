import { describe, expect, it } from 'vitest';
import {
  assertSignupComplianceFields,
  buildSignupComplianceFields,
} from '../../auth/authSignupCompliance';
import { mintToken } from '../userAccountTokens';
import {
  CURRENT_PRIVACY_VERSION,
  CURRENT_TERMS_VERSION,
  MINIMUM_SIGNUP_AGE,
} from '../userAccountSchemas';
import {
  EMAIL_CHANNELS,
  isUnsubscribable,
  type EmailChannel,
} from '../../../shared/email/emailSchemas';

describe('assertSignupComplianceFields', () => {
  const yearsAgo = (years: number): string => {
    const d = new Date();
    d.setUTCFullYear(d.getUTCFullYear() - years);
    return d.toISOString().slice(0, 10);
  };

  it('accepts a 13-year-old with both consents', async () => {
    await expect(
      assertSignupComplianceFields({
        dateOfBirth: yearsAgo(13),
        termsAccepted: true,
        privacyAccepted: true,
      }),
    ).resolves.toBeUndefined();
  });

  it('rejects an under-13 account', async () => {
    await expect(
      assertSignupComplianceFields({
        dateOfBirth: yearsAgo(12),
        termsAccepted: true,
        privacyAccepted: true,
      }),
    ).rejects.toMatchObject({ body: { code: 'coppaBlocked' } });
  });

  it('rejects a missing DOB', async () => {
    await expect(
      assertSignupComplianceFields({
        termsAccepted: true,
        privacyAccepted: true,
      }),
    ).rejects.toMatchObject({ body: { code: 'dobRequired' } });
  });

  it('rejects an unparseable DOB', async () => {
    await expect(
      assertSignupComplianceFields({
        dateOfBirth: 'not-a-date',
        termsAccepted: true,
        privacyAccepted: true,
      }),
    ).rejects.toMatchObject({ body: { code: 'dobRequired' } });
  });

  it('rejects when ToS not accepted', async () => {
    await expect(
      assertSignupComplianceFields({
        dateOfBirth: yearsAgo(20),
        termsAccepted: false,
        privacyAccepted: true,
      }),
    ).rejects.toMatchObject({ body: { code: 'termsRequired' } });
  });

  it('rejects when Privacy not accepted', async () => {
    await expect(
      assertSignupComplianceFields({
        dateOfBirth: yearsAgo(20),
        termsAccepted: true,
        privacyAccepted: false,
      }),
    ).rejects.toMatchObject({ body: { code: 'privacyRequired' } });
  });

  it('enforces the MINIMUM_SIGNUP_AGE constant boundary exactly', async () => {
    // One day under 13 is rejected
    const justUnder = new Date();
    justUnder.setUTCFullYear(justUnder.getUTCFullYear() - MINIMUM_SIGNUP_AGE);
    justUnder.setUTCDate(justUnder.getUTCDate() + 1);
    await expect(
      assertSignupComplianceFields({
        dateOfBirth: justUnder.toISOString().slice(0, 10),
        termsAccepted: true,
        privacyAccepted: true,
      }),
    ).rejects.toMatchObject({ body: { code: 'coppaBlocked' } });
  });
});

describe('buildSignupComplianceFields', () => {
  it('persists the current ToS + Privacy version stamps', () => {
    const out = buildSignupComplianceFields({
      dateOfBirth: '2000-01-15',
      termsAccepted: true,
      privacyAccepted: true,
    });
    expect(out.termsAcceptedVersion).toBe(CURRENT_TERMS_VERSION);
    expect(out.privacyAcceptedVersion).toBe(CURRENT_PRIVACY_VERSION);
    expect(out.termsAcceptedAt).toBeInstanceOf(Date);
    expect(out.privacyAcceptedAt).toBeInstanceOf(Date);
    expect(out.dateOfBirth.toISOString().slice(0, 10)).toBe('2000-01-15');
  });
});

describe('mintToken', () => {
  it('emits a base64url string that survives URL encoding', () => {
    const t = mintToken();
    expect(t.length).toBeGreaterThanOrEqual(40); // 32 bytes → ~43 chars base64url
    expect(t).toMatch(/^[A-Za-z0-9_-]+$/);
    expect(encodeURIComponent(t)).toBe(t);
  });

  it('returns unique tokens across calls', () => {
    const seen = new Set<string>();
    for (let i = 0; i < 32; i++) seen.add(mintToken());
    expect(seen.size).toBe(32);
  });
});

describe('email channel classification', () => {
  it('lists all five channels', () => {
    expect(EMAIL_CHANNELS).toEqual([
      'auth',
      'transactional',
      'marketing',
      'digest',
      'productUpdates',
    ]);
  });

  it('auth + transactional are always-send', () => {
    expect(isUnsubscribable('auth')).toBe(false);
    expect(isUnsubscribable('transactional')).toBe(false);
  });

  it('marketing / digest / productUpdates honor unsubscribe', () => {
    const checks: EmailChannel[] = ['marketing', 'digest', 'productUpdates'];
    for (const c of checks) {
      expect(isUnsubscribable(c)).toBe(true);
    }
  });
});
