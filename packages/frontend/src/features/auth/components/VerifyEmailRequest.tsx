import { Button } from '@/shared/components/ui/button';
import { authClient } from '@/features/auth/authClient';
import { dictionaryFormatBold } from '@/shared/lib/dictionaryFormatBold';
import { useAuthStore } from '@/features/auth/authStore';
import { dictionaryEnumerator } from '@project/backend/translation/dictionaryEnumerator';
import { useMutation } from '@tanstack/react-query';
import {
  GoogleReCaptchaProvider,
  useGoogleReCaptcha,
} from 'react-google-recaptcha-v3';
import { LuLoader, LuMail } from 'react-icons/lu';
import { toast } from 'sonner';
import { Link } from '@tanstack/react-router';

export function VerifyEmailRequestWithRecaptcha(props: {
  email: string;
  redirect?: string;
}) {
  const config = useAuthStore((state) => state.config);

  if (!config?.recaptchaSiteKey) {
    return <VerifyEmailRequest {...props} />;
  }

  return (
    <GoogleReCaptchaProvider reCaptchaKey={config.recaptchaSiteKey}>
      <VerifyEmailRequest {...props} />
    </GoogleReCaptchaProvider>
  );
}

function VerifyEmailRequest({
  email,
  redirect,
}: {
  email: string;
  redirect?: string;
}) {
  const dictionary = useAuthStore((state) => state.dictionary);
  const { executeRecaptcha } = useGoogleReCaptcha();
  const config = useAuthStore((state) => state.config);
  const verifyEmailRequestMutation = useMutation({
    mutationFn: async (recaptchaToken?: string) => {
      const result = await authClient.sendVerificationEmail({
        email: email,
        callbackURL: `${window.location.origin}/auth/verify-email/confirm${
          redirect ? `?redirect=${encodeURIComponent(redirect)}` : ''
        }`,
        fetchOptions: recaptchaToken
          ? {
              headers: {
                'x-captcha-response': recaptchaToken,
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
      toast.success(dictionary.auth.verifyEmailRequest.success);
    },
    onError: (error: Error) => {
      toast.error(error.message || dictionary.shared.errors.unknown);
    },
  });

  const onSubmit = async () => {
    const isRecaptchaEnabled = Boolean(config?.recaptchaSiteKey);

    let recaptchaToken: string | undefined;
    if (isRecaptchaEnabled && executeRecaptcha) {
      recaptchaToken = await executeRecaptcha();
    }

    verifyEmailRequestMutation.mutateAsync(recaptchaToken);
  };

  return (
    <div className="mt-4 flex flex-col items-center">
      <p className="text-center text-neutral-600 dark:text-neutral-300">
        {dictionaryFormatBold(dictionary.auth.verifyEmailRequest.message, email)}
      </p>

      <Button
        className="mt-6"
        onClick={onSubmit}
        disabled={
          verifyEmailRequestMutation.isPending ||
          verifyEmailRequestMutation.isSuccess
        }
      >
        {verifyEmailRequestMutation.isPending ? (
          <LuLoader className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <LuMail className="mr-2 h-4 w-4" />
        )}
        {verifyEmailRequestMutation.isSuccess
          ? dictionary.auth.verifyEmailRequest.success
          : dictionary.auth.verifyEmailRequest.button}
      </Button>

      <Link
        className="mt-8 block text-center text-sm font-medium text-neutral-800 hover:underline dark:text-neutral-200"
        to="/auth/sign-in"
        preload="intent"
      >
        {dictionary.auth.signIn.title}
      </Link>
    </div>
  );
}
