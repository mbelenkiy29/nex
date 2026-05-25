import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/shared/lib/apiClient';
import type {
  OneOnOneDisputeStatus,
  OneOnOneSessionRow,
  SessionDispute,
} from './useOneOnOneCall';

// A list / detail row enriches the dispute with the joined session + parties
// so the admin console can render the full triage view without fan-out.
export interface AdminDisputeRow extends SessionDispute {
  session: OneOnOneSessionRow & {
    sessionType: { id: string; title: string; durationMinutes: number };
    course: { id: string; title: string; slug: string };
    instructorUser: { id: string; name: string | null; email: string };
    studentUser: { id: string; name: string | null; email: string };
  };
  openedByUser: { id: string; name: string | null; email: string };
}

const disputesKey = (status?: string) =>
  ['oneOnOneCall', 'adminDisputes', status ?? 'all'] as const;
const disputeKey = (id: string) =>
  ['oneOnOneCall', 'adminDispute', id] as const;

export function useAdminDisputes(status?: OneOnOneDisputeStatus) {
  return useQuery({
    queryKey: disputesKey(status),
    queryFn: () =>
      apiClient
        .get('api/platform-admin/one-on-one/disputes', {
          searchParams: status ? { status } : undefined,
        })
        .json<{ disputes: AdminDisputeRow[] }>(),
  });
}

export function useAdminDispute(id: string | null) {
  return useQuery({
    queryKey: disputeKey(id ?? ''),
    queryFn: () =>
      apiClient
        .get(`api/platform-admin/one-on-one/disputes/${id}`)
        .json<{ dispute: AdminDisputeRow }>(),
    enabled: Boolean(id),
  });
}

export interface ResolveDisputeInput {
  id: string;
  resolution: 'refund' | 'noRefund';
  refundCents?: number;
  resolutionNotes?: string;
}

export function useResolveDispute() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...body }: ResolveDisputeInput) =>
      apiClient
        .post(`api/platform-admin/one-on-one/disputes/${id}/resolve`, {
          json: body,
        })
        .json<{
          dispute: AdminDisputeRow;
          session: OneOnOneSessionRow | null;
        }>(),
    onSuccess: (_, vars) => {
      qc.invalidateQueries({ queryKey: ['oneOnOneCall', 'adminDisputes'] });
      qc.invalidateQueries({ queryKey: disputeKey(vars.id) });
    },
  });
}
