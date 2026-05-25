import { useEffect, useState } from 'react';
import { useNavigate, useSearch } from '@tanstack/react-router';
import { LuCircleCheck, LuTriangleAlert } from 'react-icons/lu';
import { useAuthStore } from '@/features/auth/authStore';
import { dictionaryFormat } from '@/shared/lib/dictionaryFormat';
import { Button } from '@/shared/components/ui/button';
import { Spinner } from '@/shared/components/ui/spinner';
import { useUserAccountDeletionConfirmMutation } from '../hooks/useUserAccount';

/**
 * Landing page hit by the link in the deletion-request confirmation email.
 * Pulls the token from `?token=…`, POSTs it once on mount, then renders
 * the success / expired branch.
 */
export function AccountDeletionConfirmPage() {
  const dictionary = useAuthStore((s) => s.dictionary);
  const t = dictionary.account.delete;
  const navigate = useNavigate();
  const { token } = useSearch({ strict: false }) as { token?: string };
  const confirm = useUserAccountDeletionConfirmMutation();
  const [result, setResult] = useState<
    | { kind: 'idle' }
    | { kind: 'success'; scheduledFor: string | null }
    | { kind: 'expired' }
  >({ kind: 'idle' });

  useEffect(() => {
    if (!token || confirm.isPending || confirm.isSuccess || confirm.isError) {
      return;
    }
    confirm
      .mutateAsync(token)
      .then((r) =>
        setResult(
          r.confirmed
            ? { kind: 'success', scheduledFor: r.scheduledFor }
            : { kind: 'expired' },
        ),
      )
      .catch(() => setResult({ kind: 'expired' }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const isLoading =
    !token || (confirm.isPending && result.kind === 'idle');

  return (
    <div className="bg-background flex min-h-[100dvh] items-center justify-center px-4">
      <div className="bg-card ring-foreground/10 w-full max-w-md rounded-2xl p-8 shadow-sm ring-1">
        {isLoading ? (
          <div className="flex flex-col items-center gap-4 py-6">
            <Spinner />
            <p className="text-muted-foreground text-sm">
              {dictionary.shared.loading}
            </p>
          </div>
        ) : result.kind === 'success' ? (
          <div className="flex flex-col items-center gap-4">
            <div className="rounded-full bg-emerald-100 p-3 dark:bg-emerald-950">
              <LuCircleCheck className="size-6 text-emerald-600 dark:text-emerald-400" />
            </div>
            <h1 className="text-foreground text-xl font-extrabold">
              {t.confirmedSuccessTitle}
            </h1>
            <p className="text-muted-foreground text-center text-sm">
              {dictionaryFormat(
                t.confirmedSuccessBody,
                result.scheduledFor
                  ? new Date(result.scheduledFor).toLocaleDateString()
                  : '',
              )}
            </p>
            <Button onClick={() => navigate({ to: '/account' })}>
              {dictionary.account.privacyTabLabel}
            </Button>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-4">
            <div className="bg-destructive/10 rounded-full p-3">
              <LuTriangleAlert className="text-destructive size-6" />
            </div>
            <h1 className="text-foreground text-xl font-extrabold">
              {t.confirmedExpiredTitle}
            </h1>
            <p className="text-muted-foreground text-center text-sm">
              {t.confirmedExpiredBody}
            </p>
            <Button variant="outline" onClick={() => navigate({ to: '/account' })}>
              {dictionary.account.privacyTabLabel}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
