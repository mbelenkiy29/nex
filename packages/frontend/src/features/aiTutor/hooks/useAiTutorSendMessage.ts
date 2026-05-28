import { useCallback, useRef, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '@/features/auth/authStore';
import { useShallow } from 'zustand/react/shallow';
import { aiTutorConversationKey } from './useAiTutorConversation';
import { aiTutorListKey } from './useAiTutorConversationList';
import type {
  AiTutorAlertRow,
  AiTutorAttachment,
  AiTutorConversationDetail,
  AiTutorMessage,
  AiTutorWidget,
} from '@/features/aiTutor/aiTutorTypes';

interface AiTutorStreamChunk {
  type: 'text' | 'tool_use' | 'tool_result' | 'error' | 'done' | 'usage';
  content?: string;
  toolName?: string;
  toolInput?: unknown;
  widget?: AiTutorWidget;
}

const VITE_BACKEND_URL = import.meta.env.VITE_BACKEND_URL || '';

// Synthesizes a deterministic stream-time message id so the optimistic
// user/assistant pair render before the server roundtrip writes them.
function tempId(prefix: 'u' | 'a') {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

// Appends a single ephemeral assistant message into the TanStack cache for the
// conversation. Used by every streaming chunk.
function patchAssistant(
  qc: ReturnType<typeof useQueryClient>,
  conversationId: string,
  patch: (msg: AiTutorMessage) => AiTutorMessage,
) {
  qc.setQueryData<{
    conversation: AiTutorConversationDetail;
    messages: AiTutorMessage[];
  }>(aiTutorConversationKey(conversationId), (data) => {
    if (!data) return data;
    const messages = data.messages.slice();
    const lastIndex = messages.length - 1;
    if (lastIndex < 0 || messages[lastIndex].role !== 'assistant') return data;
    messages[lastIndex] = patch(messages[lastIndex]);
    return { ...data, messages };
  });
}

export function useAiTutorSendMessage(conversationId: string | undefined) {
  const qc = useQueryClient();
  const { dictionary, locale } = useAuthStore(
    useShallow((s) => ({ dictionary: s.dictionary, locale: s.locale })),
  );

  const [isLoading, setIsLoading] = useState(false);
  const [currentToolUse, setCurrentToolUse] = useState<string | null>(null);
  const [alerts, setAlerts] = useState<AiTutorAlertRow[]>([]);
  const abortControllerRef = useRef<AbortController | null>(null);

  const sendMessage = useCallback(
    async (rawMessage: string, attachments: AiTutorAttachment[] = []) => {
      if (!conversationId) return;
      const message = rawMessage.trim();
      if (!message || isLoading) return;

      setIsLoading(true);
      setCurrentToolUse(null);
      setAlerts([]);

      // 1) Optimistic user + empty assistant rows in the TanStack cache so the
      //    thread renders immediately. The server overwrites these via the
      //    final query invalidation on `done`.
      const userTempId = tempId('u');
      const assistantTempId = tempId('a');
      const now = new Date().toISOString();

      qc.setQueryData<{
        conversation: AiTutorConversationDetail;
        messages: AiTutorMessage[];
      }>(aiTutorConversationKey(conversationId), (data) => {
        if (!data) return data;
        return {
          ...data,
          messages: [
            ...data.messages,
            {
              id: userTempId,
              createdAt: now,
              role: 'user',
              content: message,
              attachments,
              widgets: null,
              trustSignals: null,
            },
            {
              id: assistantTempId,
              createdAt: now,
              role: 'assistant',
              content: '',
              attachments: null,
              widgets: null,
              trustSignals: null,
            },
          ],
        };
      });

      const abortController = new AbortController();
      abortControllerRef.current = abortController;

      try {
        const url = `${VITE_BACKEND_URL || window.location.origin}/api/chatbot/conversations/${conversationId}/message`;
        const response = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept-Language': locale,
          },
          credentials: 'include',
          body: JSON.stringify({ message, attachments }),
          signal: abortController.signal,
        });

        if (response.status === 429) {
          const body = (await response.json()) as {
            limitType?: 'user' | 'organization' | 'global';
            message?: string;
          };
          const limitMap = {
            user: 'limitDaily' as const,
            organization: 'limitOrg' as const,
            global: 'limitGlobal' as const,
          };
          setAlerts((prev) => [
            ...prev,
            {
              id: tempId('a'),
              kind: limitMap[body.limitType ?? 'user'] ?? 'limitDaily',
              message: body.message,
            },
          ]);
          return;
        }
        if (response.status === 409) {
          const body = (await response.json()) as { message?: string };
          setAlerts((prev) => [
            ...prev,
            {
              id: tempId('a'),
              kind: 'concurrentRequest',
              message: body.message,
            },
          ]);
          return;
        }
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }
        if (!response.body) throw new Error('No response body');

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let buffer = '';
        let accumulated = '';
        const seenWidgets: AiTutorWidget[] = [];

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split('\n\n');
          buffer = lines.pop() || '';

          for (const line of lines) {
            if (!line.trim()) continue;
            const dataMatch = line.match(/data: (.+)/);
            if (!dataMatch) continue;
            let chunk: AiTutorStreamChunk;
            try {
              chunk = JSON.parse(dataMatch[1]) as AiTutorStreamChunk;
            } catch {
              continue;
            }

            if (chunk.type === 'text' && chunk.content) {
              accumulated += chunk.content;
              patchAssistant(qc, conversationId, (m) => ({
                ...m,
                content: accumulated,
              }));
            } else if (chunk.type === 'tool_use' && chunk.toolName) {
              setCurrentToolUse(chunk.toolName);
            } else if (chunk.type === 'tool_result') {
              setCurrentToolUse(null);
              if (chunk.widget) {
                seenWidgets.push(chunk.widget);
                patchAssistant(qc, conversationId, (m) => ({
                  ...m,
                  widgets: [...(m.widgets ?? []), chunk.widget!],
                }));
              }
            } else if (chunk.type === 'error') {
              setAlerts((prev) => [
                ...prev,
                {
                  id: tempId('a'),
                  kind: 'networkError',
                  message: chunk.content,
                },
              ]);
            }
            // chunk.type === 'usage' / 'done' — server persists; we ignore here.
          }
        }
      } catch (err: unknown) {
        if (err instanceof DOMException && err.name === 'AbortError') {
          // User stopped — keep accumulated text in the cache.
        } else {
          setAlerts((prev) => [
            ...prev,
            {
              id: tempId('a'),
              kind: 'networkError',
              message: dictionary.aiTutor.alerts.networkError,
            },
          ]);
        }
      } finally {
        setIsLoading(false);
        setCurrentToolUse(null);
        abortControllerRef.current = null;
        // Refresh from authoritative server state — replaces optimistic rows.
        qc.invalidateQueries({
          queryKey: aiTutorConversationKey(conversationId),
        });
        qc.invalidateQueries({ queryKey: aiTutorListKey(false) });
      }
    },
    [conversationId, isLoading, qc, locale, dictionary],
  );

  const cancelRequest = useCallback(() => {
    abortControllerRef.current?.abort();
    abortControllerRef.current = null;
    setIsLoading(false);
    setCurrentToolUse(null);
  }, []);

  const dismissAlert = useCallback((id: string) => {
    setAlerts((prev) => prev.filter((a) => a.id !== id));
  }, []);

  return {
    sendMessage,
    cancelRequest,
    isLoading,
    currentToolUse,
    alerts,
    dismissAlert,
  };
}
