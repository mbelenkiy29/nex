import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/shared/lib/apiClient';
import { aiTutorListKey } from './useAiTutorConversationList';
import { aiTutorConversationKey } from './useAiTutorConversation';

export function useAiTutorRenameConversation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, title }: { id: string; title: string }) =>
      apiClient
        .patch(`api/chatbot/conversations/${id}`, { json: { title } })
        .json<{ conversation: { id: string; title: string } }>(),
    onSuccess: (_data, vars) => {
      qc.invalidateQueries({ queryKey: aiTutorListKey(false) });
      qc.invalidateQueries({ queryKey: aiTutorConversationKey(vars.id) });
    },
  });
}
