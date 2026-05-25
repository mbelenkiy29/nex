import { Button } from '@/shared/components/ui/button';
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/shared/components/ui/field';
import { Input } from '@/shared/components/ui/input';
import { authClient } from '@/features/auth/authClient';
import { cn } from '@/shared/lib/utils';
import { getRedirectPath } from '@/shared/lib/getRedirectPath';
import { useAuthStore } from '@/features/auth/authStore';
import { zodResolver } from '@hookform/resolvers/zod';
import { authSignInFormSchema } from '@project/backend/features/auth/authSchemas';
import { dictionaryEnumerator } from '@project/backend/translation/dictionaryEnumerator';
import { Locale } from '@project/backend/translation/locales';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Link, useNavigate, useSearch } from '@tanstack/react-router';
import { useShallow } from 'zustand/react/shallow';
import * as React from 'react';
import {
  GoogleReCaptchaProvider,
  useGoogleReCaptcha,
} from 'react-google-recaptcha-v3';
import { Controller, useForm } from 'react-hook-form';
import { ArrowRight, Loader2 } from 'lucide-react';
import { FaGoogle } from 'react-icons/fa';
import { toast } from 'sonner';
import { z } from 'zod';

interface SignInFormProps {
  locale: Locale;
}

function SignInForm(_props: SignInFormProps) {
  const { dictionary, config, fetchCurrentUser } = useAuthStore(
    useShallow((state) => ({
      dictionary: state.dictionary,
      config: state.config,
      fetchCurrentUser: state.fetchCurrentUser,
    })),
  );
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const search = useSearch({ from: '/auth/sign-in' }) as {
    redirect?: string;
    oauthError?: string;
    invitationToken?: string;
    email?: string;
  };
  const { redirect, oauthError, invitationToken, email } = search;

  React.useEffect(() => {
    if (oauthError) {
      navigate({ to: '/auth/sign-in', replace: true });
      toast.error(dictionary.auth.signIn.oauthError);
    }
  }, [oauthError, navigate, dictionary]);

  const mutation = useMutation({
    mutationFn: async (
      data: z.output<typeof authSignInFormSchema> & { recaptchaToken?: string },
    ) => {
      const result = await authClient.signIn.email({
        email: data.email,
        password: data.password,
        fetchOptions: data.recaptchaToken
          ? {
              headers: {
                'x-captcha-response': data.recaptchaToken,
              },
            }
          : undefined,
      });

      if (result.error) {
        const errorCode = result.error.code || '';
        if (errorCode === 'EMAIL_NOT_VERIFIED') {
          const customError: any = new Error(
            dictionaryEnumerator(dictionary.auth.errors, result.error.code) ||
              dictionary.shared.errors.unknown,
          );
          customError.code = 'EMAIL_NOT_VERIFIED';
          customError.email = data.email;
          throw customError;
        }
        throw new Error(
          dictionaryEnumerator(dictionary.auth.errors, result.error.code) ||
            dictionary.shared.errors.unknown,
        );
      }

      return result.data;
    },
    onSuccess: async () => {
      await fetchCurrentUser();
      queryClient.invalidateQueries();

      const validRedirect = getRedirectPath(redirect);

      if (invitationToken) {
        const finalRedirect = validRedirect !== '/' ? validRedirect : undefined;
        navigate({
          to: '/auth/invitation',
          search: { token: invitationToken, email, redirect: finalRedirect },
        });
        return;
      }

      navigate({ to: validRedirect });
      toast.success(dictionary.auth.signIn.success);
    },
    onError: (error: any) => {
      if (error.code === 'EMAIL_NOT_VERIFIED' && error.email) {
        navigate({
          to: '/auth/verify-email/request',
          search: redirect
            ? { email: error.email, redirect }
            : { email: error.email },
        });
        toast.error(error.message);
      } else {
        toast.error(error.message || dictionary.shared.errors.unknown);
      }
    },
  });

  const { executeRecaptcha } = useGoogleReCaptcha();

  const form = useForm({
    resolver: zodResolver(authSignInFormSchema),
    defaultValues: {
      email: email || '',
      password: '',
      recaptchaToken: '',
    },
  });

  const onSubmit = async (values: z.output<typeof authSignInFormSchema>) => {
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
              {dictionary.auth.signIn.email}
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
                    disabled={mutation.isPending || mutation.isSuccess}
                    autoFocus={!email}
                    data-testid="auth-signin-email-input"
                  />
                  {fieldState.error && (
                    <FieldError>{fieldState.error.message}</FieldError>
                  )}
                </>
              )}
            />
          </Field>
          <Field className="gap-2">
            <div className="flex items-end justify-between">
              <FieldLabel
                htmlFor="password"
                className="text-sm font-semibold text-[#0f172a] dark:text-white"
              >
                {dictionary.auth.signIn.password}
              </FieldLabel>
              <Link
                to="/auth/password-reset/request"
                className="text-nexexam-primary hover:text-nexexam-primary/80 text-sm font-semibold transition-colors"
                tabIndex={1}
                preload="intent"
              >
                {dictionary.auth.signIn.passwordResetRequestLink}
              </Link>
            </div>
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
                    data-testid="auth-signin-password-input"
                  />
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
            data-testid="auth-signin-submit-button"
          >
            {(mutation.isPending || mutation.isSuccess) && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            {dictionary.auth.signIn.button}
            {!mutation.isPending && !mutation.isSuccess && (
              <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
            )}
          </Button>
        </FieldGroup>
      </form>

      <div className="relative flex items-center gap-4 opacity-70">
        <div className="h-px flex-1 bg-slate-300 dark:bg-white/20" />
        <div className="text-xs font-bold tracking-widest text-slate-400 uppercase">
          {dictionary.auth.signIn.socialHeader}
        </div>
        <div className="h-px flex-1 bg-slate-300 dark:bg-white/20" />
      </div>

      <div className="flex flex-col gap-2">
        <Button
          className="h-[52px] rounded-[16px] border-white/60 bg-white/50 font-semibold text-[#0f172a] shadow-sm backdrop-blur-md transition-all hover:bg-white/80 dark:border-white/10 dark:bg-white/10 dark:text-white dark:hover:bg-white/15"
          variant="outline"
          type="button"
          disabled={mutation.isPending || mutation.isSuccess}
          onClick={async () => {
            const callbackPath = redirect
              ? `/auth/callback?redirect=${encodeURIComponent(redirect)}`
              : '/auth/callback';
            const callbackURL = `${window.location.origin}${callbackPath}`;
            await authClient.signIn.social({
              provider: 'google',
              callbackURL,
            });
          }}
        >
          <FaGoogle className="mr-2 h-4 w-4" />
          {dictionary.auth.signIn.google}
        </Button>
      </div>
    </div>
  );
}

export function SignInFormWithRecaptcha(props: SignInFormProps) {
  const config = useAuthStore((state) => state.config);

  if (!config?.recaptchaSiteKey) {
    return <SignInForm {...props} />;
  }

  return (
    <GoogleReCaptchaProvider reCaptchaKey={config.recaptchaSiteKey}>
      <SignInForm {...props} />
    </GoogleReCaptchaProvider>
  );
}
