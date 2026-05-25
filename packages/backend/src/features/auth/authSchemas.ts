import { z } from 'zod';

export const authSignInFormSchema = z.object({
  email: z.email().min(1).trim(),
  password: z.string().min(8),
  recaptchaToken: z.string().optional(),
});

// Compliance fields (DOB + ToS + Privacy) live alongside the auth fields so
// the existing recaptcha + redirect plumbing in SignUpForm doesn't need to
// fork. They're enforced server-side by the Better-Auth `user.create.before`
// hook (see `authSignupCompliance.ts`); the zod schema here is purely a
// client-side correctness check that lets us disable the submit button
// before the round-trip.
export const authSignUpFormSchema = z.object({
  email: z.email().min(1).trim(),
  password: z.string().min(8),
  dateOfBirth: z.string().min(1, { message: 'Date of birth is required' }),
  termsAccepted: z.literal(true, {
    message:
      'You must accept the Terms of Service and Privacy Policy to continue.',
  }),
  privacyAccepted: z.literal(true, {
    message: 'You must accept the Privacy Policy to continue.',
  }),
  recaptchaToken: z.string().optional(),
});

export const authPasswordResetRequestFormSchema = z.object({
  email: z.email().min(1).trim(),
  recaptchaToken: z.string().optional(),
});

export const authPasswordResetConfirmFormSchema = z.object({
  password: z.string().min(8),
  recaptchaToken: z.string().optional(),
});
