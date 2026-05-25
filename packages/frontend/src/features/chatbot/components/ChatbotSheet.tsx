import { Button } from '@/shared/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/shared/components/ui/sheet';
import { useAuthStore } from '@/features/auth/authStore';
import { useChatbotStore } from '@/features/chatbot/chatbotStore';
import { IoClose, IoTrashOutline } from 'react-icons/io5';
import { LuExternalLink } from 'react-icons/lu';
import { useNavigate } from '@tanstack/react-router';
import { useChatbot } from '../hooks/useChatbot';
import { ChatbotInput } from './ChatbotInput';
import { ChatbotMessages } from './ChatbotMessages';
import { useAiTutorCreateConversation } from '@/features/aiTutor/hooks/useAiTutorCreateConversation';

interface ChatbotSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ChatbotSheet({ open, onOpenChange }: ChatbotSheetProps) {
  const dictionary = useAuthStore((state) => state.dictionary);
  const activeContext = useChatbotStore((state) => state.context);
  const navigate = useNavigate();
  const createConversation = useAiTutorCreateConversation();
  const {
    messages,
    isLoading,
    error,
    currentToolUse,
    sendMessage,
    cancelRequest,
    clearConversation,
  } = useChatbot();

  // Bridge to the new full-page AI Tutor — creates a course-scoped (or
  // free-form) conversation that mirrors the modal's current context and
  // navigates the user there. v2 deprecates this modal entirely.
  const handleOpenFullTutor = async () => {
    const result = await createConversation.mutateAsync({
      courseId: activeContext?.courseId ?? null,
      lessonId: activeContext?.lessonId ?? null,
    });
    onOpenChange(false);
    await navigate({
      to: '/student/ai-tutor/$conversationId',
      params: { conversationId: result.conversation.id },
    });
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        showCloseButton={false}
        className="border-l-border flex h-full w-full flex-col p-0 sm:max-w-[500px] [&>.sheet-close]:hidden"
      >
        <SheetHeader className="shrink-0 border-b px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <SheetTitle>{dictionary.chatbot.title}</SheetTitle>
              {activeContext?.courseTitle && (
                <p className="text-muted-foreground mt-1 text-xs">
                  {activeContext.courseTitle}
                </p>
              )}
            </div>
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                onClick={handleOpenFullTutor}
                disabled={createConversation.isPending}
                title={dictionary.aiTutor.title}
              >
                <LuExternalLink className="h-5 w-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={clearConversation}
                disabled={isLoading}
                title={dictionary.chatbot.clearConversation}
              >
                <IoTrashOutline className="h-5 w-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onOpenChange(false)}
                title={dictionary.shared.close}
              >
                <IoClose className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </SheetHeader>

        <div className="flex-1 overflow-hidden">
          <ChatbotMessages
            messages={messages}
            isLoading={isLoading}
            currentToolUse={currentToolUse}
            error={error}
          />
        </div>

        <div className="shrink-0">
          <ChatbotInput
            onSendMessage={sendMessage}
            onCancel={cancelRequest}
            isLoading={isLoading}
          />
        </div>
      </SheetContent>
    </Sheet>
  );
}
