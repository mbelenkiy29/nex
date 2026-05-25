import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/shared/lib/apiClient';
import { aiTutorListKey } from './useAiTutorConversationList';

export function useAiTutorArchiveConversation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) =>
      apiClient.delete(`api/chatbot/conversations/${id}`).json<{ ok: true }>(),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: aiTutorListKey(false) });
      qc.invalidateQueries({ queryKey: aiTutorListKey(true) });
    },
  });
}
