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
import { useAuthStore } from '@/features/auth/authStore';
import { authPasswordResetRequestFormSchema } from '@project/backend/features/auth/authSchemas';
import { dictionaryEnumerator } from '@project/backend/translation/dictionaryEnumerator';
import { Locale } from '@project/backend/translation/locales';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import {
  GoogleReCaptchaProvider,
  useGoogleReCaptcha,
} from 'react-google-recaptcha-v3';
import { Controller, useForm } from 'react-hook-form';
import { LuLoader } from 'react-icons/lu';
import { toast } from 'sonner';
import { z } from 'zod';

interface PasswordResetRequestFormProps {
  locale: Locale;
}

function PasswordResetRequestForm(_props: PasswordResetRequestFormProps) {
  const dictionary = useAuthStore((state) => state.dictionary);
  const config = useAuthStore((state) => state.config);
  const navigate = useNavigate();

  const { executeRecaptcha } = useGoogleReCaptcha();

  const form = useForm({
    resolver: zodResolver(authPasswordResetRequestFormSchema),
    defaultValues: {
      email: '',
      recaptchaToken: '',
    },
  });

  const mutation = useMutation({
    mutationFn: async (
      data: z.output<typeof authPasswordResetRequestFormSchema> & {
        recaptchaToken?: string;
      },
    ) => {
      const result = await authClient.requestPasswordReset({
        email: data.email,
        redirectTo: `${window.location.origin}/auth/password-reset/confirm`,
        fetchOptions: data.recaptchaToken
          ? {
              headers: {
                'x-captcha-response': data.recaptchaToken,
              },
            }
          : undefined,
      });

      if (result.error) {
        throw new Error(
          dictionaryEnumerator(dictionary.auth.errors, result.error.code) ||
            dictionary.shared.errors.unknown,
        );
      }

      return result.data;
    },
    onSuccess: () => {
      navigate({ to: '/' });
      toast.success(dictionary.auth.passwordResetRequest.success);
    },
    onError: (error: Error) => {
      toast.error(error.message || dictionary.shared.errors.unknown);
    },
  });

  const onSubmit = async (
    value: z.output<typeof authPasswordResetRequestFormSchema>,
  ) => {
    const isRecaptchaEnabled = Boolean(config?.recaptchaSiteKey);

    let dataToSubmit = value;

    if (isRecaptchaEnabled && executeRecaptcha) {
      const token = await executeRecaptcha();
      dataToSubmit = { ...value, recaptchaToken: token };
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
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="email" className="required">
              {dictionary.auth.passwordResetRequest.email}
            </FieldLabel>
            <Controller
              control={form.control}
              name="email"
              render={({ field, fieldState }) => (
                <>
                  <Input
                    id="email"
                    {...field}
                    type="email"
                    autoCapitalize="none"
                    autoComplete="email"
                    autoCorrect="off"
                    disabled={mutation.isPending || mutation.isSuccess}
                    autoFocus
                    data-testid="auth-password-reset-email-input"
                  />
                  {fieldState.error && (
                    <FieldError>{fieldState.error.message}</FieldError>
                  )}
                </>
              )}
            />
          </Field>
          <Button
            className="mt-2"
            disabled={mutation.isPending || mutation.isSuccess}
            type="submit"
            data-testid="auth-password-reset-submit-button"
          >
            {(mutation.isPending || mutation.isSuccess) && (
              <LuLoader className="mr-2 h-4 w-4 animate-spin" />
            )}
            {dictionary.auth.passwordResetRequest.button}
          </Button>
        </FieldGroup>
      </form>
    </div>
  );
}

export function PasswordResetRequestFormWithRecaptcha(
  props: PasswordResetRequestFormProps,
) {
  const config = useAuthStore((state) => state.config);

  if (!config?.recaptchaSiteKey) {
    return <PasswordResetRequestForm {...props} />;
  }

  return (
    <GoogleReCaptchaProvider reCaptchaKey={config.recaptchaSiteKey}>
      <PasswordResetRequestForm {...props} />
    </GoogleReCaptchaProvider>
  );
}
