import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/shared/lib/apiClient';

export type CreatorPayoutStatus = 'pending' | 'paid' | 'cancelled';

export interface CreatorPayoutRow {
  id: string;
  amount: number;
  currency: string;
  status: CreatorPayoutStatus;
  description: string | null;
  createdAt: string;
  paidAt: string | null;
  cancelledAt: string | null;
  course: { id: string; title: string; slug: string } | null;
  organization: { id: string; name: string } | null;
}

const payoutsKey = (status?: CreatorPayoutStatus) =>
  ['creatorEarnings', 'payouts', status ?? 'all'] as const;
const methodKey = ['creatorEarnings', 'method'] as const;

export function useMyPayouts(status?: CreatorPayoutStatus) {
  return useQuery({
    queryKey: payoutsKey(status),
    queryFn: () =>
      apiClient
        .get('api/creator/earnings/payouts', {
          searchParams: status ? { status } : undefined,
        })
        .json<{ count: number; payouts: CreatorPayoutRow[] }>(),
  });
}

export function useMyPayoutMethod() {
  return useQuery({
    queryKey: methodKey,
    queryFn: () =>
      apiClient
        .get('api/creator/earnings/method')
        .json<{ payoutMethodNote: string | null }>(),
  });
}

export function useUpdateMyPayoutMethod() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payoutMethodNote: string | null) =>
      apiClient
        .put('api/creator/earnings/method', {
          json: { payoutMethodNote },
        })
        .json<{ payoutMethodNote: string | null }>(),
    onSuccess: () => qc.invalidateQueries({ queryKey: methodKey }),
  });
}
