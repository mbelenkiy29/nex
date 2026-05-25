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
import { authPasswordResetConfirmFormSchema } from '@project/backend/features/auth/authSchemas';
import { dictionaryEnumerator } from '@project/backend/translation/dictionaryEnumerator';
import { Locale } from '@project/backend/translation/locales';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useNavigate, useSearch } from '@tanstack/react-router';
import * as React from 'react';
import {
  GoogleReCaptchaProvider,
  useGoogleReCaptcha,
} from 'react-google-recaptcha-v3';
import { Controller, useForm } from 'react-hook-form';
import { LuLoader } from 'react-icons/lu';
import { toast } from 'sonner';
import { z } from 'zod';

interface PasswordResetConfirmFormProps {
  locale: Locale;
}

function PasswordResetConfirmForm(_props: PasswordResetConfirmFormProps) {
  const dictionary = useAuthStore((state) => state.dictionary);
  const config = useAuthStore((state) => state.config);
  const navigate = useNavigate();
  const searchParams = useSearch({ from: '/auth/password-reset/confirm' });
  const token = searchParams.token;

  React.useEffect(() => {
    if (!token) {
      navigate({ to: '/auth/password-reset/request' });
    }
  }, [token, navigate]);

  const { executeRecaptcha } = useGoogleReCaptcha();

  const form = useForm({
    resolver: zodResolver(authPasswordResetConfirmFormSchema),
    defaultValues: {
      password: '',
      recaptchaToken: '',
    },
  });

  const mutation = useMutation({
    mutationFn: async (
      data: z.output<typeof authPasswordResetConfirmFormSchema> & {
        recaptchaToken?: string;
      },
    ) => {
      if (!token) {
        throw new Error(dictionary.auth.errors.invalidPasswordResetToken);
      }

      const result = await authClient.resetPassword({
        newPassword: data.password,
        token,
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
      toast.success(dictionary.auth.passwordResetConfirm.success);
    },
    onError: (error: Error) => {
      toast.error(error.message || dictionary.shared.errors.unknown);
    },
  });

  const onSubmit = async (
    value: z.output<typeof authPasswordResetConfirmFormSchema>,
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
            <FieldLabel htmlFor="password" className="required">
              {dictionary.auth.passwordResetConfirm.password}
            </FieldLabel>
            <Controller
              control={form.control}
              name="password"
              render={({ field, fieldState }) => (
                <>
                  <Input
                    id="password"
                    {...field}
                    type="password"
                    disabled={mutation.isPending || mutation.isSuccess}
                    autoFocus
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
          >
            {(mutation.isPending || mutation.isSuccess) && (
              <LuLoader className="mr-2 h-4 w-4 animate-spin" />
            )}
            {dictionary.auth.passwordResetConfirm.button}
          </Button>
        </FieldGroup>
      </form>
    </div>
  );
}

export function PasswordResetConfirmFormWithRecaptcha(
  props: PasswordResetConfirmFormProps,
) {
  const config = useAuthStore((state) => state.config);

  if (!config?.recaptchaSiteKey) {
    return <PasswordResetConfirmForm {...props} />;
  }

  return (
    <GoogleReCaptchaProvider reCaptchaKey={config.recaptchaSiteKey}>
      <PasswordResetConfirmForm {...props} />
    </GoogleReCaptchaProvider>
  );
}
