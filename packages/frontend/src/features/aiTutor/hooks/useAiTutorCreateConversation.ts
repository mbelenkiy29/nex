import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/shared/lib/apiClient';
import type { AiTutorConversationSummary } from '@/features/aiTutor/aiTutorTypes';
import { aiTutorListKey } from './useAiTutorConversationList';

export interface AiTutorCreateConversationInput {
  courseId?: string | null;
  lessonId?: string | null;
  initialMessage?: string;
}

export function useAiTutorCreateConversation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: AiTutorCreateConversationInput) =>
      apiClient
        .post('api/chatbot/conversations', { json: input })
        .json<{ conversation: AiTutorConversationSummary }>(),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: aiTutorListKey(false) });
    },
  });
}
