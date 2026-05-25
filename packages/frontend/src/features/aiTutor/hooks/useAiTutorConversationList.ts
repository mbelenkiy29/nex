import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/shared/lib/apiClient';
import type { AiTutorConversationSummary } from '@/features/aiTutor/aiTutorTypes';

export const aiTutorListKey = (archived: boolean) =>
  ['aiTutor', 'conversations', { archived }] as const;

export function useAiTutorConversationListQuery(
  options: { archived?: boolean; enabled?: boolean } = {},
) {
  const archived = options.archived === true;
  return useQuery({
    queryKey: aiTutorListKey(archived),
    queryFn: () =>
      apiClient
        .get('api/chatbot/conversations', {
          searchParams: archived ? { archived: 'true' } : {},
        })
        .json<{
          conversations: AiTutorConversationSummary[];
          total: number;
        }>(),
    staleTime: 30_000,
    enabled: options.enabled ?? true,
  });
}
