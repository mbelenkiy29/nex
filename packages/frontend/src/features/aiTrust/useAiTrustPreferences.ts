import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type {
  AiTrustPreferences,
  AiTrustPreferencesInput,
} from '@project/backend/features/aiTrust/aiTrustSchemas';
import { apiClient } from '@/shared/lib/apiClient';

export const aiTrustPreferencesKey = ['aiTrust', 'preferences'] as const;

export function useAiTrustPreferences() {
  return useQuery({
    queryKey: aiTrustPreferencesKey,
    queryFn: () =>
      apiClient
        .get('api/ai-trust/preferences')
        .json<{ preferences: AiTrustPreferences }>(),
  });
}

export function useUpdateAiTrustPreferences() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: AiTrustPreferencesInput) =>
      apiClient
        .put('api/ai-trust/preferences', { json: input })
        .json<{ preferences: AiTrustPreferences }>(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: aiTrustPreferencesKey });
      queryClient.invalidateQueries({ queryKey: ['courseStudyAi'] });
      queryClient.invalidateQueries({ queryKey: ['aiTutor'] });
    },
  });
}
