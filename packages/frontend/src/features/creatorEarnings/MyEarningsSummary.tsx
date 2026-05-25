import { useMemo } from 'react';
import { LuWallet } from 'react-icons/lu';
import { useAuthStore } from '@/features/auth/authStore';
import { Card, CardContent } from '@/shared/components/ui/card';
import { Spinner } from '@/shared/components/ui/spinner';
import {
  useMyPayouts,
  type CreatorPayoutRow,
} from './hooks/useCreatorEarnings';

function isInCurrentMonth(iso: string | null): boolean {
  if (!iso) return false;
  const date = new Date(iso);
  const now = new Date();
  return (
    date.getUTCFullYear() === now.getUTCFullYear() &&
    date.getUTCMonth() === now.getUTCMonth()
  );
}

function sumPaid(payouts: CreatorPayoutRow[]): number {
  return payouts
    .filter((p) => p.status === 'paid')
    .reduce((acc, p) => acc + p.amount, 0);
}

function sumPending(payouts: CreatorPayoutRow[]): number {
  return payouts
    .filter((p) => p.status === 'pending')
    .reduce((acc, p) => acc + p.amount, 0);
}

function sumPaidThisMonth(payouts: CreatorPayoutRow[]): number {
  return payouts
    .filter((p) => p.status === 'paid' && isInCurrentMonth(p.paidAt))
    .reduce((acc, p) => acc + p.amount, 0);
}

/**
 * Three-number summary card. One job per card per DESIGN.md.
 * Currency is taken from the first payout; mixed-currency creators see the
 * dominant one — a fancier multi-currency split is future work.
 */
export function MyEarningsSummary() {
  const t = useAuthStore((s) => s.dictionary.creatorEarnings.summary);
  const query = useMyPayouts();
  const payouts = query.data?.payouts ?? [];

  const stats = useMemo(
    () => ({
      totalPaid: sumPaid(payouts),
      pending: sumPending(payouts),
      paidThisMonth: sumPaidThisMonth(payouts),
      currency: payouts[0]?.currency ?? 'USD',
    }),
    [payouts],
  );

  return (
    <Card className="nex-glass-card rounded-3xl border-white/70 p-0 dark:border-white/10">
      <CardContent className="space-y-4 p-5">
        <h2 className="flex items-center gap-2 font-extrabold">
          <LuWallet className="text-primary size-5" />
          {t.title}
        </h2>
        {query.isLoading ? (
          <Spinner className="size-4" />
        ) : (
          <dl className="grid grid-cols-3 gap-3">
            <Stat label={t.totalEarned} amount={stats.totalPaid} currency={stats.currency} />
            <Stat label={t.pending} amount={stats.pending} currency={stats.currency} />
            <Stat
              label={t.paidThisMonth}
              amount={stats.paidThisMonth}
              currency={stats.currency}
            />
          </dl>
        )}
      </CardContent>
    </Card>
  );
}

function Stat({
  label,
  amount,
  currency,
}: {
  label: string;
  amount: number;
  currency: string;
}) {
  return (
    <div className="space-y-1">
      <dt className="text-muted-foreground text-xs">{label}</dt>
      <dd className="text-lg font-extrabold">
        {amount.toFixed(2)} {currency}
      </dd>
    </div>
  );
}
