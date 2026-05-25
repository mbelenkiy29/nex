import { LuTriangleAlert } from 'react-icons/lu';
import { toast } from 'sonner';
import { useAuthStore } from '@/features/auth/authStore';
import { dictionaryFormat } from '@/shared/lib/dictionaryFormat';
import { Button } from '@/shared/components/ui/button';
import {
  useUserAccountDeletionCancelMutation,
  useUserAccountMeQuery,
} from '../hooks/useUserAccount';

/**
 * Sticky banner shown at the top of profile / settings pages whenever
 * `deletionRequestedAt` is non-null. One-click cancel restores the account.
 * Hidden when there's no pending request (most common state) so it's a
 * no-cost mount.
 */
export function DeletionScheduledBanner() {
  const dictionary = useAuthStore((s) => s.dictionary);
  const meQuery = useUserAccountMeQuery();
  const cancel = useUserAccountDeletionCancelMutation();
  const me = meQuery.data;
  if (!me?.deletionRequestedAt || !me.deletionScheduledFor) return null;

  const scheduledFor = new Date(me.deletionScheduledFor).toLocaleDateString();
  const t = dictionary.account.delete;

  return (
    <div className="border-destructive/30 bg-destructive/5 mx-auto mb-6 flex max-w-3xl items-start gap-3 rounded-2xl border px-4 py-3 sm:px-6">
      <LuTriangleAlert className="text-destructive mt-0.5 size-5 shrink-0" />
      <div className="flex-1 text-sm">
        <p className="text-foreground font-semibold">
          {dictionaryFormat(t.cancelBannerTitle, scheduledFor)}
        </p>
      </div>
      <Button
        size="sm"
        variant="outline"
        disabled={cancel.isPending}
        onClick={() =>
          cancel.mutate(undefined, {
            onSuccess: () => toast.success(t.cancelledToast),
            onError: (e: any) =>
              toast.error(
                e?.message || dictionary.shared.errors?.unknown || 'Error',
              ),
          })
        }
      >
        {t.cancelBannerAction}
      </Button>
    </div>
  );
}
