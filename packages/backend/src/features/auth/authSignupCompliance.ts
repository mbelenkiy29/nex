import { APIError } from 'better-auth/api';
import {
  CURRENT_PRIVACY_VERSION,
  CURRENT_TERMS_VERSION,
  MINIMUM_SIGNUP_AGE,
} from '../userAccount/userAccountSchemas';

type SignupComplianceBody = {
  dateOfBirth?: string;
  termsAccepted?: boolean;
  privacyAccepted?: boolean;
};

/**
 * Throws an APIError if the signup body fails the compliance gate. The
 * Better-Auth APIError surfaces as a 400 on the client side with the
 * supplied error body, which the frontend can map to a friendly message
 * via `dictionary.signup.*`.
 */
export async function assertSignupComplianceFields(
  body: SignupComplianceBody,
): Promise<void> {
  if (!body.dateOfBirth || typeof body.dateOfBirth !== 'string') {
    throw new APIError('BAD_REQUEST', {
      code: 'dobRequired',
      message: 'Date of birth is required.',
    });
  }

  const dob = new Date(body.dateOfBirth);
  if (Number.isNaN(dob.getTime())) {
    throw new APIError('BAD_REQUEST', {
      code: 'dobRequired',
      message: 'Date of birth is invalid.',
    });
  }

  const ageInYears = ageFromDateOfBirth(dob);
  if (ageInYears < MINIMUM_SIGNUP_AGE) {
    throw new APIError('BAD_REQUEST', {
      code: 'coppaBlocked',
      message: `Accounts require an age of ${MINIMUM_SIGNUP_AGE} or older.`,
    });
  }

  if (body.termsAccepted !== true) {
    throw new APIError('BAD_REQUEST', {
      code: 'termsRequired',
      message: 'You must accept the Terms of Service to continue.',
    });
  }
  if (body.privacyAccepted !== true) {
    throw new APIError('BAD_REQUEST', {
      code: 'privacyRequired',
      message: 'You must accept the Privacy Policy to continue.',
    });
  }
}

/**
 * Maps the validated body into the `User` columns Better-Auth will persist
 * during the `create.before` hook. All four columns are real schema fields
 * (added in the legal/compliance subsystem) so Better-Auth will write them
 * through without `additionalFields` config.
 */
export function buildSignupComplianceFields(body: SignupComplianceBody) {
  const now = new Date();
  return {
    dateOfBirth: new Date(body.dateOfBirth as string),
    termsAcceptedAt: now,
    termsAcceptedVersion: CURRENT_TERMS_VERSION,
    privacyAcceptedAt: now,
    privacyAcceptedVersion: CURRENT_PRIVACY_VERSION,
  };
}

function ageFromDateOfBirth(dob: Date): number {
  const now = new Date();
  let age = now.getUTCFullYear() - dob.getUTCFullYear();
  const m = now.getUTCMonth() - dob.getUTCMonth();
  if (m < 0 || (m === 0 && now.getUTCDate() < dob.getUTCDate())) {
    age--;
  }
  return age;
}
