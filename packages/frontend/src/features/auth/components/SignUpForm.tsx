import { Link } from '@tanstack/react-router';
import { Button } from '@/shared/components/ui/button';
import { Checkbox } from '@/shared/components/ui/checkbox';
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/shared/components/ui/field';
import { Input } from '@/shared/components/ui/input';
import { authClient } from '@/features/auth/authClient';
import {
  type DashboardPersona,
  dashboardPersonaSet,
} from '@/features/dashboard/dashboardHome';
import { cn } from '@/shared/lib/utils';
import { getRedirectPath } from '@/shared/lib/getRedirectPath';
import { useAuthStore } from '@/features/auth/authStore';
import { authSignUpFormSchema } from '@project/backend/features/auth/authSchemas';
import { dictionaryEnumerator } from '@project/backend/translation/dictionaryEnumerator';
import { Locale } from '@project/backend/translation/locales';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate, useSearch } from '@tanstack/react-router';
import { useShallow } from 'zustand/react/shallow';
import {
  GoogleReCaptchaProvider,
  useGoogleReCaptcha,
} from 'react-google-recaptcha-v3';
import { Controller, useForm } from 'react-hook-form';
import { ArrowRight, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { z } from 'zod';

interface SignUpFormProps {
  locale: Locale;
  accountType?: DashboardPersona;
}

function SignUpForm({ accountType = 'student' }: SignUpFormProps) {
  const { dictionary, config, fetchCurrentUser } = useAuthStore(
    useShallow((state) => ({
      dictionary: state.dictionary,
      config: state.config,
      fetchCurrentUser: state.fetchCurrentUser,
    })),
  );
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const search = useSearch({ strict: false }) as {
    invitationToken?: string;
    email?: string;
    redirect?: string;
  };
  const { email, invitationToken, redirect } = search;
  const defaultRedirect = accountType === 'creator' ? '/creator' : '/student';

  const mutation = useMutation({
    mutationFn: async (
      data: z.output<typeof authSignUpFormSchema> & { recaptchaToken?: string },
    ) => {
      const headers: Record<string, string> = {};
      if (data.recaptchaToken) {
        headers['x-captcha-response'] = data.recaptchaToken;
      }
      if (invitationToken) {
        headers['x-invitation-token'] = invitationToken;
      }

      const result = await authClient.signUp.email({
        email: data.email,
        password: data.password,
        name: data.email,
        callbackURL: defaultRedirect,
        // The three compliance fields are read by the Better-Auth
        // `user.create.before` hook in `authBackend.ts` from `ctx.body`.
        // They're ignored by Better-Auth's typed signature; passing as
        // `unknown` extras keeps TS quiet while the body still carries them.
        ...({
          dateOfBirth: data.dateOfBirth,
          termsAccepted: data.termsAccepted,
          privacyAccepted: data.privacyAccepted,
        } as object),
        fetchOptions: { headers },
      });

      if (result.error) {
        throw new Error(
          dictionaryEnumerator(dictionary.auth.errors, result.error.code) ||
            dictionary.shared.errors.unknown,
        );
      }

      return { data: result.data, email: data.email, password: data.password };
    },
    onSuccess: async ({ data, email, password }) => {
      const validRedirect = getRedirectPath(redirect, defaultRedirect);
      const emailVerified = Boolean((data as any)?.user?.emailVerified);
      dashboardPersonaSet(accountType);

      if (config?.bypassEmailVerification || emailVerified) {
        if (emailVerified && !config?.bypassEmailVerification) {
          await authClient.signIn.email({ email, password });
        }
        await fetchCurrentUser();

        queryClient.invalidateQueries();

        if (invitationToken) {
          const finalRedirect =
            validRedirect !== '/' ? validRedirect : undefined;
          navigate({
            to: '/auth/invitation',
            search: { token: invitationToken, email, redirect: finalRedirect },
          });
        } else {
          navigate({ to: validRedirect });
          toast.success(dictionary.auth.signUp.success);
        }
      } else {
        navigate({
          to: '/auth/verify-email/request',
          search: { email, redirect: validRedirect },
        });
      }
    },
    onError: (error: Error) => {
      toast.error(error.message || dictionary.shared.errors.unknown);
    },
  });

  const { executeRecaptcha } = useGoogleReCaptcha();

  const form = useForm({
    resolver: zodResolver(authSignUpFormSchema),
    defaultValues: {
      email: email || '',
      password: '',
      dateOfBirth: '',
      termsAccepted: false as unknown as true, // zod uses `literal(true)` — RHF default has to allow false
      privacyAccepted: false as unknown as true,
      recaptchaToken: '',
    },
  });

  const onSubmit = async (values: z.output<typeof authSignUpFormSchema>) => {
    const isRecaptchaEnabled = Boolean(config?.recaptchaSiteKey);

    let dataToSubmit = values;

    if (isRecaptchaEnabled && executeRecaptcha) {
      const token = await executeRecaptcha();
      dataToSubmit = { ...values, recaptchaToken: token };
    }

    mutation.mutateAsync(dataToSubmit);
  };

  return (
    <div className={cn('grid gap-6')}>
      <form
        onSubmit={(e) => {
          e.stopPropagation();
          form.handleSubmit(onSubmit)(e);
        }}
      >
        <FieldGroup className="gap-4">
          <Field className="gap-2">
            <FieldLabel
              htmlFor="email"
              className="text-sm font-semibold text-[#0f172a] dark:text-white"
            >
              {dictionary.auth.signUp.email}
            </FieldLabel>
            <Controller
              control={form.control}
              name="email"
              render={({ field, fieldState }) => (
                <>
                  <Input
                    id="email"
                    className="focus-visible:ring-nexexam-primary/30 h-14 rounded-[20px] border-white/60 bg-white/50 px-5 text-base font-medium text-[#0f172a] shadow-sm backdrop-blur-md transition-all placeholder:text-slate-400 focus-visible:bg-white/80 dark:border-white/10 dark:bg-white/10 dark:text-white dark:focus-visible:bg-white/15"
                    {...field}
                    type="email"
                    autoCapitalize="none"
                    autoComplete="email"
                    autoCorrect="off"
                    disabled={
                      mutation.isPending ||
                      mutation.isSuccess ||
                      Boolean(invitationToken)
                    }
                    autoFocus={!email}
                    data-testid="auth-signup-email-input"
                  />
                  {invitationToken && (
                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-300">
                      {dictionary.auth.signUp.invitationEmailLocked}
                    </p>
                  )}
                  {fieldState.error && (
                    <FieldError>{fieldState.error.message}</FieldError>
                  )}
                </>
              )}
            />
          </Field>
          <Field className="gap-2">
            <FieldLabel
              htmlFor="password"
              className="text-sm font-semibold text-[#0f172a] dark:text-white"
            >
              {dictionary.auth.signUp.password}
            </FieldLabel>
            <Controller
              control={form.control}
              name="password"
              render={({ field, fieldState }) => (
                <>
                  <Input
                    id="password"
                    className="focus-visible:ring-nexexam-primary/30 h-14 rounded-[20px] border-white/60 bg-white/50 px-5 text-base font-medium text-[#0f172a] shadow-sm backdrop-blur-md transition-all placeholder:text-slate-400 focus-visible:bg-white/80 dark:border-white/10 dark:bg-white/10 dark:text-white dark:focus-visible:bg-white/15"
                    {...field}
                    type="password"
                    disabled={mutation.isPending || mutation.isSuccess}
                    autoFocus={Boolean(email)}
                    data-testid="auth-signup-password-input"
                  />
                  {fieldState.error && (
                    <FieldError>{fieldState.error.message}</FieldError>
                  )}
                </>
              )}
            />
          </Field>

          {/* Date of birth — COPPA gate. Server-side validation also enforces
              age >= 13; this field is required so the submit button can lock
              before the round-trip. */}
          <Field className="gap-2">
            <FieldLabel
              htmlFor="dateOfBirth"
              className="text-sm font-semibold text-[#0f172a] dark:text-white"
            >
              {dictionary.signup.dateOfBirthLabel}
            </FieldLabel>
            <Controller
              control={form.control}
              name="dateOfBirth"
              render={({ field, fieldState }) => (
                <>
                  <Input
                    id="dateOfBirth"
                    className="focus-visible:ring-nexexam-primary/30 h-14 rounded-[20px] border-white/60 bg-white/50 px-5 text-base font-medium text-[#0f172a] shadow-sm backdrop-blur-md transition-all placeholder:text-slate-400 focus-visible:bg-white/80 dark:border-white/10 dark:bg-white/10 dark:text-white dark:focus-visible:bg-white/15"
                    {...field}
                    type="date"
                    disabled={mutation.isPending || mutation.isSuccess}
                    data-testid="auth-signup-dob-input"
                  />
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {dictionary.signup.dateOfBirthHint}
                  </p>
                  {fieldState.error && (
                    <FieldError>{fieldState.error.message}</FieldError>
                  )}
                </>
              )}
            />
          </Field>

          {/* Single "I agree to ToS and Privacy" checkbox. Splitting them into
              two checkboxes adds friction without a meaningful legal benefit —
              the user goes to one place to accept both. Schema still requires
              `termsAccepted` and `privacyAccepted` to both be true, so we set
              them in lockstep. */}
          <Field className="gap-2">
            <Controller
              control={form.control}
              name="termsAccepted"
              render={({ field, fieldState }) => (
                <>
                  <label className="flex items-start gap-3 text-sm text-slate-700 dark:text-slate-200">
                    <Checkbox
                      checked={field.value === true}
                      onCheckedChange={(checked) => {
                        const next = checked === true;
                        field.onChange(next);
                        form.setValue(
                          'privacyAccepted',
                          next as unknown as true,
                          {
                            shouldValidate: true,
                          },
                        );
                      }}
                      disabled={mutation.isPending || mutation.isSuccess}
                      data-testid="auth-signup-terms-checkbox"
                    />
                    <span>
                      I agree to the{' '}
                      <Link
                        to="/terms"
                        target="_blank"
                        className="font-semibold underline underline-offset-2"
                      >
                        {dictionary.legal.terms.title}
                      </Link>{' '}
                      and{' '}
                      <Link
                        to="/privacy"
                        target="_blank"
                        className="font-semibold underline underline-offset-2"
                      >
                        {dictionary.legal.privacy.title}
                      </Link>
                      .
                    </span>
                  </label>
                  {fieldState.error && (
                    <FieldError>{fieldState.error.message}</FieldError>
                  )}
                </>
              )}
            />
          </Field>

          <Button
            className="group relative mt-2 h-14 overflow-hidden rounded-[20px] border border-white/10 bg-[linear-gradient(180deg,#6d6ef7_0%,#5b5cf6_100%)] text-base font-semibold text-white shadow-[0_8px_20px_-6px_rgba(91,92,246,0.5)] transition-all hover:shadow-[0_12px_24px_-8px_rgba(91,92,246,0.6)]"
            disabled={mutation.isPending || mutation.isSuccess}
            type="submit"
            data-testid="auth-signup-submit-button"
          >
            {(mutation.isPending || mutation.isSuccess) && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            {dictionary.auth.signUp.button}
            {!mutation.isPending && !mutation.isSuccess && (
              <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
            )}
          </Button>
        </FieldGroup>
      </form>
    </div>
  );
}

export function SignUpFormWithRecaptcha(props: SignUpFormProps) {
  const config = useAuthStore((state) => state.config);

  if (!config?.recaptchaSiteKey) {
    return <SignUpForm {...props} />;
  }

  return (
    <GoogleReCaptchaProvider reCaptchaKey={config.recaptchaSiteKey}>
      <SignUpForm {...props} />
    </GoogleReCaptchaProvider>
  );
}
