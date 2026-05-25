import { LuReceipt } from 'react-icons/lu';
import { useAuthStore } from '@/features/auth/authStore';
import { Badge } from '@/shared/components/ui/badge';
import { Card, CardContent } from '@/shared/components/ui/card';
import { Spinner } from '@/shared/components/ui/spinner';
import {
  useMyPayouts,
  type CreatorPayoutRow,
} from './hooks/useCreatorEarnings';

function formatWhen(iso: string): string {
  return new Date(iso).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

interface RowProps {
  payout: CreatorPayoutRow;
  statusLabel: string;
}

function PayoutRow({ payout, statusLabel }: RowProps) {
  return (
    <li className="flex items-center justify-between gap-3 rounded-xl border p-3 text-sm">
      <div className="min-w-0">
        <div className="font-semibold">
          {payout.amount.toFixed(2)} {payout.currency}
        </div>
        <div className="text-muted-foreground mt-0.5 truncate text-xs">
          {payout.description ?? payout.course?.title ?? '—'} ·{' '}
          {formatWhen(payout.createdAt)}
        </div>
      </div>
      <Badge variant="secondary">{statusLabel}</Badge>
    </li>
  );
}

export function MyPayoutsList() {
  const t = useAuthStore((s) => s.dictionary.creatorEarnings.list);
  const query = useMyPayouts();
  const payouts = query.data?.payouts ?? [];

  return (
    <Card className="nex-glass-card rounded-3xl border-white/70 p-0 dark:border-white/10">
      <CardContent className="space-y-4 p-5">
        <h2 className="flex items-center gap-2 font-extrabold">
          <LuReceipt className="text-primary size-5" />
          {t.title}
        </h2>
        {query.isLoading ? (
          <Spinner className="size-4" />
        ) : payouts.length === 0 ? (
          <p className="text-muted-foreground text-sm">{t.empty}</p>
        ) : (
          <ul className="space-y-2">
            {payouts.map((p) => (
              <PayoutRow
                key={p.id}
                payout={p}
                statusLabel={t.status[p.status]}
              />
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
