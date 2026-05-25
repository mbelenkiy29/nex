import { createLazyRoute } from '@tanstack/react-router';
import { useAuthStore } from '@/features/auth/authStore';
import { MyEarningsSummary } from '../MyEarningsSummary';
import { MyPayoutsList } from '../MyPayoutsList';
import { PayoutMethodCard } from '../PayoutMethodCard';

/**
 * Creator-facing earnings page. Three cards stacked, each with a single job
 * (per DESIGN.md): summary stats, payout list, payout-method-on-file.
 * Routed at `/creator/earnings`, gated by the same `ensureCreatorAccess`
 * pattern as `/creator/availability`.
 */
export function MyEarningsPage() {
  const t = useAuthStore((s) => s.dictionary.creatorEarnings);
  return (
    <div className="mx-auto w-full max-w-3xl space-y-5 p-5">
      <h1 className="text-xl font-extrabold">{t.title}</h1>
      <MyEarningsSummary />
      <MyPayoutsList />
      <PayoutMethodCard />
    </div>
  );
}

export const myEarningsLazyRoute = createLazyRoute('/creator/earnings')({
  component: MyEarningsPage,
});
