import { useNavigate } from '@tanstack/react-router';
import { useAuthStore } from '@/features/auth/authStore';
import { useShallow } from 'zustand/react/shallow';
import { AiTutorShell } from '@/features/aiTutor/components/AiTutorShell';
import { AiTutorHeader } from '@/features/aiTutor/components/AiTutorHeader';
import { AiTutorEmpty } from '@/features/aiTutor/components/AiTutorEmpty';
import { useAiTutorCreateConversation } from '@/features/aiTutor/hooks/useAiTutorCreateConversation';

// The /student/ai-tutor index — when no conversation is selected. Picking a
// suggestion or typing into a composer here creates a new conversation and
// navigates to its detail route in one step.
export function AiTutorLandingPage() {
  const { dictionary } = useAuthStore(
    useShallow((s) => ({ dictionary: s.dictionary })),
  );
  const navigate = useNavigate();
  const createMutation = useAiTutorCreateConversation();

  const handleSuggest = async (initialMessage: string) => {
    const result = await createMutation.mutateAsync({ initialMessage });
    navigate({
      to: '/student/ai-tutor/$conversationId',
      params: { conversationId: result.conversation.id },
      // We'll rely on `initialMessage` being persisted server-side when the
      // user sends their first turn from the conversation page; clicking a
      // suggestion creates an empty conversation and sends nothing yet.
    });
  };

  return (
    <AiTutorShell
      activeConversationId={null}
      renderMain={(openHistory) => (
        <AiTutorHeader
          title={dictionary.aiTutor.subtitle}
          onOpenHistory={openHistory}
        />
      )}
    >
      <div className="flex-1 overflow-y-auto pb-32">
        <AiTutorEmpty onSuggest={handleSuggest} />
      </div>
    </AiTutorShell>
  );
}
