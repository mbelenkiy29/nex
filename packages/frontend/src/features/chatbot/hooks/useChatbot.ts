import { useState, useCallback, useRef, useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '@/features/auth/authStore';
import { useShallow } from 'zustand/react/shallow';
import { useChatbotStore } from '@/features/chatbot/chatbotStore';
import { aiTutorConversationKey } from '@/features/aiTutor/hooks/useAiTutorConversation';
import { aiTutorListKey } from '@/features/aiTutor/hooks/useAiTutorConversationList';
import type { ChatbotMessage } from '@project/backend/features/chatbot/chatbotSchemas';

export interface ChatbotStreamChunk {
  type: 'text' | 'tool_use' | 'tool_result' | 'error' | 'done' | 'usage';
  content?: string;
  toolName?: string;
  toolInput?: any;
  usage?: {
    inputTokens: number;
    outputTokens: number;
  };
}

export interface ChatbotLimitExceededError {
  error: 'limit_exceeded';
  limitType: 'user' | 'organization' | 'global';
  current: number;
  limit: number;
  message: string;
}

export interface ChatbotConcurrentRequestError {
  error: 'concurrent_request';
  message: string;
}

interface ChatbotConversationCreateResponse {
  conversation: {
    id: string;
  };
}

export function useChatbot() {
  const queryClient = useQueryClient();
  const { dictionary, locale } = useAuthStore(
    useShallow((state) => ({
      dictionary: state.dictionary,
      locale: state.locale,
    })),
  );
  const messages = useChatbotStore((state) => state.messages);
  const addMessage = useChatbotStore((state) => state.addMessage);
  const updateLastMessage = useChatbotStore((state) => state.updateLastMessage);
  const setMessages = useChatbotStore((state) => state.setMessages);
  const conversationId = useChatbotStore((state) => state.conversationId);
  const setConversationId = useChatbotStore((state) => state.setConversationId);
  const activeContext = useChatbotStore((state) => state.context);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentToolUse, setCurrentToolUse] = useState<string | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    if (messages.length === 0) {
      setMessages([
        {
          role: 'assistant',
          content: dictionary.chatbot.welcome,
        },
      ]);
    }
  }, [messages.length, dictionary.chatbot.welcome, setMessages]);

  const sendMessage = useCallback(
    async (userMessage: string) => {
      if (!userMessage.trim() || isLoading) {
        return;
      }

      const newUserMessage: ChatbotMessage = {
        role: 'user',
        content: userMessage.trim(),
      };

      addMessage(newUserMessage);
      setIsLoading(true);
      setError(null);
      setCurrentToolUse(null);
      let activeConversationId = conversationId;

      try {
        const abortController = new AbortController();
        abortControllerRef.current = abortController;

        const backendUrl = import.meta.env.VITE_BACKEND_URL || '';

        if (!activeConversationId) {
          const createResponse = await fetch(
            `${backendUrl}/api/chatbot/conversations`,
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Accept-Language': locale,
              },
              body: JSON.stringify({
                courseId: activeContext?.courseId ?? null,
                lessonId: activeContext?.lessonId ?? null,
                initialMessage: userMessage.trim(),
              }),
              credentials: 'include',
              signal: abortController.signal,
            },
          );

          if (!createResponse.ok) {
            throw new Error(dictionary.chatbot.error);
          }

          const createData =
            (await createResponse.json()) as ChatbotConversationCreateResponse;
          activeConversationId = createData.conversation.id;
          setConversationId(activeConversationId);
          queryClient.invalidateQueries({ queryKey: aiTutorListKey(false) });
        }

        if (!activeConversationId) {
          throw new Error(dictionary.chatbot.error);
        }

        const url = `${backendUrl}/api/chatbot/conversations/${activeConversationId}/message`;

        const response = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept-Language': locale,
          },
          body: JSON.stringify({ message: userMessage.trim() }),
          credentials: 'include',
          signal: abortController.signal,
        });

        if (response.status === 429) {
          const errorData =
            (await response.json()) as ChatbotLimitExceededError;

          addMessage({
            role: 'assistant',
            content: `__LIMIT_EXCEEDED__:${errorData.limitType}:${errorData.message}`,
          });

          setIsLoading(false);
          return;
        }

        if (response.status === 409) {
          const errorData =
            (await response.json()) as ChatbotConcurrentRequestError;

          addMessage({
            role: 'assistant',
            content: `__CONCURRENT_REQUEST__:${errorData.message}`,
          });

          setIsLoading(false);
          return;
        }

        if (!response.ok) {
          throw new Error(dictionary.chatbot.error);
        }

        if (!response.body) {
          throw new Error(dictionary.chatbot.error);
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let assistantMessage = '';
        let buffer = '';

        while (true) {
          const { done, value } = await reader.read();

          if (done) {
            break;
          }

          buffer += decoder.decode(value, { stream: true });

          const lines = buffer.split('\n\n');
          buffer = lines.pop() || '';

          for (const line of lines) {
            if (!line.trim()) continue;

            const dataMatch = line.match(/data: (.+)/);

            if (!dataMatch) continue;

            try {
              const chunk = JSON.parse(dataMatch[1]) as ChatbotStreamChunk;

              if (chunk.type === 'text' && chunk.content) {
                assistantMessage += chunk.content;
                updateLastMessage(assistantMessage);
              } else if (chunk.type === 'tool_use' && chunk.toolName) {
                setCurrentToolUse(chunk.toolName);
              } else if (chunk.type === 'error') {
                setError(chunk.content || dictionary.chatbot.error);
                break;
              } else if (chunk.type === 'done') {
                break;
              }
            } catch (e) {
              console.error('Failed to parse SSE chunk:', e);
            }
          }
        }

        setCurrentToolUse(null);
      } catch (err: any) {
        if (err.name === 'AbortError') {
          return;
        }

        console.error('Chatbot error:', err);
        setError(err.message || dictionary.chatbot.error);
      } finally {
        if (activeConversationId) {
          queryClient.invalidateQueries({
            queryKey: aiTutorConversationKey(activeConversationId),
          });
          queryClient.invalidateQueries({ queryKey: aiTutorListKey(false) });
        }
        setIsLoading(false);
        abortControllerRef.current = null;
      }
    },
    [
      isLoading,
      dictionary,
      locale,
      conversationId,
      setConversationId,
      queryClient,
      activeContext,
      addMessage,
      updateLastMessage,
    ],
  );

  const cancelRequest = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      setIsLoading(false);
      setCurrentToolUse(null);
    }
  }, []);

  const clearConversation = useCallback(() => {
    setMessages([
      {
        role: 'assistant',
        content: dictionary.chatbot.welcome,
      },
    ]);
    setConversationId(null);
    setError(null);
    setCurrentToolUse(null);
  }, [dictionary, setConversationId, setMessages]);

  return {
    messages,
    isLoading,
    error,
    currentToolUse,
    sendMessage,
    cancelRequest,
    clearConversation,
  };
}
