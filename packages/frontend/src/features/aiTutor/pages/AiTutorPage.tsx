import { useEffect } from 'react';
import { useParams } from '@tanstack/react-router';
import { AiTutorShell } from '@/features/aiTutor/components/AiTutorShell';
import { AiTutorHeader } from '@/features/aiTutor/components/AiTutorHeader';
import { AiTutorThread } from '@/features/aiTutor/components/AiTutorThread';
import { AiTutorComposer } from '@/features/aiTutor/components/AiTutorComposer';
import { AiTutorEmpty } from '@/features/aiTutor/components/AiTutorEmpty';
import { useAiTutorConversationQuery } from '@/features/aiTutor/hooks/useAiTutorConversation';
import { useAiTutorSendMessage } from '@/features/aiTutor/hooks/useAiTutorSendMessage';

export function AiTutorPage() {
  const { conversationId } = useParams({
    from: '/authenticated/student/ai-tutor/$conversationId',
  }) as { conversationId: string };

  const conversationQuery = useAiTutorConversationQuery(conversationId);
  const {
    sendMessage,
    cancelRequest,
    isLoading,
    currentToolUse,
    alerts,
    dismissAlert,
  } = useAiTutorSendMessage(conversationId);

  // The hook returns when conversation loads; if a suggestion is clicked
  // from the empty hero we send it directly.
  useEffect(() => {
    return () => {
      cancelRequest();
    };
  }, [cancelRequest, conversationId]);

  const conversation = conversationQuery.data?.conversation;
  const messages = conversationQuery.data?.messages ?? [];
  const courseTitle = conversation?.courseId ? null : null;

  return (
    <AiTutorShell
      activeConversationId={conversationId}
      renderMain={(openHistory) => (
        <AiTutorHeader
          title={conversation?.title || ''}
          courseTitle={courseTitle}
          onOpenHistory={openHistory}
        />
      )}
    >
      {conversationQuery.isLoading ? (
        <div className="flex flex-1 items-center justify-center text-sm text-muted-foreground">
          …
        </div>
      ) : messages.length === 0 ? (
        <div className="flex-1 overflow-y-auto">
          <AiTutorEmpty onSuggest={(s) => sendMessage(s)} />
        </div>
      ) : (
        <AiTutorThread
          messages={messages}
          currentToolUse={currentToolUse}
          alerts={alerts}
          onDismissAlert={dismissAlert}
        />
      )}
      <AiTutorComposer
        isLoading={isLoading}
        onSend={sendMessage}
        onStop={cancelRequest}
      />
    </AiTutorShell>
  );
}
