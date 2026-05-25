import { useEffect, useRef } from 'react';
import { ScrollArea } from '@/shared/components/ui/scroll-area';
import { ChatbotMessage } from './ChatbotMessage';
import { ChatbotToolCall } from './ChatbotToolCall';
import type { ChatbotMessage as ChatbotMessageType } from '@project/backend/features/chatbot/chatbotSchemas';
import { Spinner } from '@/shared/components/ui/spinner';
import { useAuthStore } from '@/features/auth/authStore';

interface ChatbotMessagesProps {
  messages: ChatbotMessageType[];
  isLoading: boolean;
  currentToolUse: string | null;
  error: string | null;
}

export function ChatbotMessages({
  messages,
  isLoading,
  currentToolUse,
  error,
}: ChatbotMessagesProps) {
  const dictionary = useAuthStore((state) => state.dictionary);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollAreaRef.current) {
      // Find the viewport element inside ScrollArea
      const viewport = scrollAreaRef.current.querySelector(
        '[data-radix-scroll-area-viewport]',
      );

      if (viewport) {
        viewport.scrollTo({
          top: viewport.scrollHeight,
          behavior: 'smooth',
        });
      }
    }
  }, [messages, currentToolUse, isLoading]);

  return (
    <ScrollArea ref={scrollAreaRef} className="h-full px-4">
      <div className="py-4">
        {messages.map((message, index) => (
          <ChatbotMessage key={index} message={message} />
        ))}

        {/* Show tool usage indicator */}
        {currentToolUse && <ChatbotToolCall toolName={currentToolUse} />}

        {/* Show loading indicator */}
        {isLoading && !currentToolUse && (
          <div className="text-muted-foreground mb-4 flex items-center gap-3 text-sm">
            <Spinner className="h-4 w-4" />
            <span>{dictionary.chatbot.thinking}</span>
          </div>
        )}

        {/* Show error */}
        {error && (
          <div className="bg-destructive/10 text-destructive mb-4 rounded-lg p-3 text-sm">
            {error}
          </div>
        )}

        {/* Scroll anchor */}
        <div ref={messagesEndRef} />
      </div>
    </ScrollArea>
  );
}
