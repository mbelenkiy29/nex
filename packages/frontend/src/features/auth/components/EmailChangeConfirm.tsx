import { authClient } from '@/features/auth/authClient';
import { dictionaryFormatBold } from '@/shared/lib/dictionaryFormatBold';
import { useAuthStore } from '@/features/auth/authStore';
import { UserWithMembers } from '@project/backend/features/user/userSchemas';
import { Link, useSearch } from '@tanstack/react-router';
import { useEffect, useRef, useState } from 'react';
import {
  GoogleReCaptchaProvider,
  useGoogleReCaptcha,
} from 'react-google-recaptcha-v3';
import { LuLoader, LuMail } from 'react-icons/lu';

export function EmailChangeConfirmWithRecaptcha(props: {
  currentUser?: UserWithMembers | null;
}) {
  const config = useAuthStore((state) => state.config);

  if (!config?.recaptchaSiteKey) {
    return <EmailChangeConfirm {...props} />;
  }

  return (
    <GoogleReCaptchaProvider reCaptchaKey={config.recaptchaSiteKey}>
      <EmailChangeConfirm {...props} />
    </GoogleReCaptchaProvider>
  );
}

export function EmailChangeConfirm({
  currentUser,
}: {
  currentUser?: UserWithMembers | null;
}) {
  const dictionary = useAuthStore((state) => state.dictionary);
  const config = useAuthStore((state) => state.config);
  const { executeRecaptcha } = useGoogleReCaptcha();
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [hasResent, setHasResent] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>();
  const hasRunRef = useRef(false);
  const searchParams = useSearch({ from: '/auth/email-change/confirm' }) as {
    token?: string;
    newEmail?: string;
    redirect?: string;
  };
  const { token, newEmail } = searchParams;

  const callVerifyEmail = async () => {
    if (!token || !config) return;

    let recaptchaToken: string | undefined;

    if (config?.recaptchaSiteKey && executeRecaptcha) {
      try {
        recaptchaToken = await executeRecaptcha('emailChangeConfirm');
      } catch (error) {
        console.error('reCAPTCHA execution failed:', error);
      }
    }

    return authClient.verifyEmail({
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
  };

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

    const confirmEmailChange = async () => {
      try {
        if (!config) {
          return;
        }

        const result = await callVerifyEmail();

        if (result?.error) {
          console.error('Email change confirmation error:', result.error);
          setErrorMessage(dictionary.auth.errors.invalidVerifyEmailToken);
        } else {
          setIsConfirmed(true);
        }
      } catch (error) {
        console.error('Email change confirmation failed:', error);
        setErrorMessage(dictionary.shared.errors.unknown);
      }
    };

    confirmEmailChange();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, dictionary, executeRecaptcha, config]);

  const onResend = async () => {
    setIsResending(true);
    try {
      const result = await callVerifyEmail();
      if (result?.error) {
        setErrorMessage(dictionary.auth.errors.invalidVerifyEmailToken);
      } else {
        setHasResent(true);
      }
    } catch {
      setErrorMessage(dictionary.shared.errors.unknown);
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="mt-4 flex flex-col items-center">
      {!isConfirmed && !errorMessage && (
        <p className="text-center text-neutral-600 dark:text-neutral-300">
          {dictionary.auth.emailChange.loadingMessage}
        </p>
      )}

      {errorMessage && !isConfirmed && (
        <p className="text-center text-red-600 dark:text-red-300">
          {errorMessage}
        </p>
      )}

      {isConfirmed && newEmail && (
        <p className="text-center text-neutral-600 dark:text-neutral-300">
          {dictionaryFormatBold(
            dictionary.auth.emailChange.confirmStepTwo,
            newEmail,
          )}
        </p>
      )}

      {isConfirmed && !newEmail && (
        <p className="text-center text-neutral-600 dark:text-neutral-300">
          {dictionary.auth.emailChange.confirmSuccess}
        </p>
      )}

      {isConfirmed && (
        <button
          className="mt-6 inline-flex items-center text-sm font-medium text-neutral-800 hover:underline disabled:opacity-50 dark:text-neutral-200"
          onClick={onResend}
          disabled={isResending || hasResent}
        >
          {isResending ? (
            <LuLoader className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <LuMail className="mr-2 h-4 w-4" />
          )}
          {hasResent
            ? dictionary.auth.verifyEmailRequest.success
            : dictionary.auth.verifyEmailRequest.button}
        </button>
      )}

      {errorMessage ? (
        <Link
          className="mt-6 block text-center text-sm font-medium text-neutral-800 hover:underline dark:text-neutral-200"
          to={currentUser ? '/' : '/auth/sign-in'}
          preload="intent"
        >
          {dictionary.auth.emailChange.cancel}
        </Link>
      ) : null}
    </div>
  );
}
