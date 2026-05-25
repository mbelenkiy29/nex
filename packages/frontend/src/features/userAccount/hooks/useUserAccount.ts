import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/shared/lib/apiClient';
import type {
  DataExportRow,
  EmailChannel,
  UserAccountMe,
} from '../userAccountTypes';

export const userAccountMeKey = ['userAccount', 'me'] as const;
export const dataExportListKey = ['userAccount', 'dataExport', 'list'] as const;

export function useUserAccountMeQuery(enabled = true) {
  return useQuery({
    queryKey: userAccountMeKey,
    queryFn: () =>
      apiClient.get('api/user-account/me').json<UserAccountMe>(),
    enabled,
    staleTime: 60_000,
  });
}

export function useUserAccountDeletionRequestMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () =>
      apiClient
        .post('api/user-account/deletion', { json: {} })
        .json<{ scheduledFor: string }>(),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: userAccountMeKey });
    },
  });
}

export function useUserAccountDeletionCancelMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () =>
      apiClient
        .delete('api/user-account/deletion')
        .json<{ cancelled: boolean }>(),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: userAccountMeKey });
    },
  });
}

export function useUserAccountDeletionConfirmMutation() {
  return useMutation({
    mutationFn: (token: string) =>
      apiClient
        .post('api/user-account/deletion/confirm', { json: { token } })
        .json<{ confirmed: boolean; scheduledFor: string | null }>(),
  });
}

export function useDataExportListQuery() {
  return useQuery({
    queryKey: dataExportListKey,
    queryFn: () =>
      apiClient
        .get('api/user-account/data-export')
        .json<{ items: DataExportRow[] }>(),
    staleTime: 15_000,
  });
}

export function useDataExportRequestMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () =>
      apiClient
        .post('api/user-account/data-export', { json: {} })
        .json<{ id: string; status: 'queued' }>(),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: dataExportListKey });
    },
  });
}

export function useDataExportDownloadMutation() {
  return useMutation({
    mutationFn: (id: string) =>
      apiClient
        .get(`api/user-account/data-export/${id}/download`)
        .json<{ downloadUrl: string }>(),
  });
}

export function useEmailPreferencesMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (preferences: {
      marketing?: boolean;
      digest?: boolean;
      productUpdates?: boolean;
    }) =>
      apiClient
        .patch('api/user-account/email-preferences', { json: preferences })
        .json<{ emailUnsubscribedChannels: EmailChannel[] }>(),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: userAccountMeKey });
    },
  });
}

export function useCookieConsentMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: { analytics: boolean; marketing: boolean }) =>
      apiClient
        .post('api/user-account/cookie-consent', { json: input })
        .json<{ cookieConsent: UserAccountMe['cookieConsent'] }>(),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: userAccountMeKey });
    },
  });
}
