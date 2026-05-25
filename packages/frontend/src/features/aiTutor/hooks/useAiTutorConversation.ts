import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/shared/lib/apiClient';
import type {
  AiTutorConversationDetail,
  AiTutorMessage,
} from '@/features/aiTutor/aiTutorTypes';

export const aiTutorConversationKey = (id: string) =>
  ['aiTutor', 'conversation', id] as const;

export function useAiTutorConversationQuery(
  conversationId: string | undefined,
  options: { enabled?: boolean } = {},
) {
  return useQuery({
    queryKey: conversationId
      ? aiTutorConversationKey(conversationId)
      : ['aiTutor', 'conversation', '__none__'],
    queryFn: () =>
      apiClient
        .get(`api/chatbot/conversations/${conversationId}`)
        .json<{
          conversation: AiTutorConversationDetail;
          messages: AiTutorMessage[];
        }>(),
    enabled: !!conversationId && (options.enabled ?? true),
    // Don't aggressively refetch — the SSE hook writes into this cache.
    staleTime: 60_000,
  });
}
