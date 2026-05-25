import { SignOutButton } from '@/features/auth/components/SignOutButton';
import { authClient } from '@/features/auth/authClient';
import { getRedirectPath } from '@/shared/lib/getRedirectPath';
import { useAuthStore } from '@/features/auth/authStore';
import { useShallow } from 'zustand/react/shallow';
import { dictionaryEnumerator } from '@project/backend/translation/dictionaryEnumerator';
import { UserWithMembers } from '@project/backend/features/user/userSchemas';
import { useNavigate, useSearch } from '@tanstack/react-router';
import { useEffect, useRef, useState } from 'react';
import {
  GoogleReCaptchaProvider,
  useGoogleReCaptcha,
} from 'react-google-recaptcha-v3';

export function VerifyEmailConfirmWithRecaptcha(props: {
  currentUser?: UserWithMembers | null;
}) {
  const config = useAuthStore((state) => state.config);

  if (!config?.recaptchaSiteKey) {
    return <VerifyEmailConfirm {...props} />;
  }

  return (
    <GoogleReCaptchaProvider reCaptchaKey={config.recaptchaSiteKey}>
      <VerifyEmailConfirm {...props} />
    </GoogleReCaptchaProvider>
  );
}

export function VerifyEmailConfirm({
  currentUser,
}: {
  currentUser?: UserWithMembers | null;
}) {
  const dictionary = useAuthStore((state) => state.dictionary);
  const navigate = useNavigate();
  const { fetchCurrentUser, config } = useAuthStore(
    useShallow((state) => ({
      fetchCurrentUser: state.fetchCurrentUser,
      config: state.config,
    })),
  );
  const { executeRecaptcha } = useGoogleReCaptcha();
  const [isVerified, setIsVerified] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>();
  const hasRunRef = useRef(false);
  const searchParams = useSearch({ from: '/auth/verify-email/confirm' }) as {
    token?: string;
    redirect?: string;
  };
  const { token, redirect } = searchParams;

  useEffect(() => {
    if (!token) {
      setErrorMessage(dictionary.auth.errors.invalidVerifyEmailToken);
      return;
    }

    if (config?.recaptchaSiteKey && !executeRecaptcha) {
      return;
    }

    if (hasRunRef.current) {
      return;
    }
    hasRunRef.current = true;

    const verifyEmail = async () => {
      try {
        let recaptchaToken: string | undefined;

        if (config?.recaptchaSiteKey && executeRecaptcha) {
          try {
            recaptchaToken = await executeRecaptcha('verifyEmail');
          } catch (error) {
            console.error('reCAPTCHA execution failed:', error);
          }
        }

        const result = await authClient.verifyEmail({
          query: {
            token: token,
          },
          fetchOptions: recaptchaToken
            ? {
                headers: {
                  'x-captcha-response': recaptchaToken,
                },
              }
            : undefined,
        });

        if (result.error) {
          setErrorMessage(
            dictionaryEnumerator(dictionary.auth.errors, result.error.code) ||
              dictionary.auth.errors.invalidVerifyEmailToken,
          );
        } else {
          setIsVerified(true);
          await fetchCurrentUser();
          const validRedirect = getRedirectPath(redirect);
          setTimeout(() => {
            navigate({ to: validRedirect });
          }, 2000);
        }
      } catch (error) {
        setErrorMessage(dictionary.shared.errors.unknown);
      }
    };

    verifyEmail();
  }, [
    token,
    dictionary,
    navigate,
    fetchCurrentUser,
    executeRecaptcha,
    config,
    redirect,
  ]);

  return (
    <div className="mb-4 flex flex-col items-center">
      {!isVerified && !errorMessage && (
        <p className="text-center text-neutral-600 dark:text-neutral-300">
          {dictionary.auth.verifyEmailConfirm.loadingMessage}
        </p>
      )}

      {errorMessage && (
        <p className="text-center text-red-600 dark:text-red-300">
          {errorMessage}
        </p>
      )}

      {isVerified && (
        <p className="text-center text-neutral-600 dark:text-neutral-300">
          {dictionary.auth.verifyEmailConfirm.success}
        </p>
      )}

      {currentUser && (
        <SignOutButton
          className="mt-8 block text-center text-sm font-medium text-neutral-800 hover:underline dark:text-neutral-200"
          text={dictionary.auth.signOut.button}
        />
      )}
    </div>
  );
}
