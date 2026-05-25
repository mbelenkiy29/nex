import { useCallback, useEffect, useRef, useState } from 'react';
import { useAuthStore } from '@/features/auth/authStore';
import type { CourseStudyAiStreamChunk } from '@project/backend/features/courseStudyAi/courseStudyAiSchemas';

export type StudyAiStreamStatus = 'idle' | 'streaming' | 'done' | 'error';
export type StudyAiStreamErrorCode = 'limit' | 'busy' | 'generic';

export type StudyAiStreamMode = 'explain' | 'summarize';

interface StartOptions {
  courseId: string;
  lessonId: string;
  mode: StudyAiStreamMode;
}

const ENDPOINT_BY_MODE: Record<StudyAiStreamMode, string> = {
  explain: 'explain-lesson',
  summarize: 'summarize-lesson',
};

/**
 * Consumes the course study AI SSE endpoints (explain / summarize). Mirrors the
 * chatbot's streaming pattern: a raw fetch + ReadableStream reader with manual
 * `data:` line parsing (ky does not stream responses).
 */
export function useCourseStudyAiStream() {
  const locale = useAuthStore((state) => state.locale);
  const [text, setText] = useState('');
  const [status, setStatus] = useState<StudyAiStreamStatus>('idle');
  const [error, setError] = useState<StudyAiStreamErrorCode | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const cancel = useCallback(() => {
    abortRef.current?.abort();
    abortRef.current = null;
  }, []);

  // Abort any in-flight stream when the consumer unmounts.
  useEffect(() => cancel, [cancel]);

  const start = useCallback(
    async ({ courseId, lessonId, mode }: StartOptions) => {
      cancel();
      setText('');
      setError(null);
      setStatus('streaming');

      const abortController = new AbortController();
      abortRef.current = abortController;

      const backendUrl = import.meta.env.VITE_BACKEND_URL || '';
      const url = `${backendUrl}/api/course-study-ai/${courseId}/${ENDPOINT_BY_MODE[mode]}`;

      try {
        const response = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept-Language': locale,
          },
          body: JSON.stringify({ lessonId }),
          credentials: 'include',
          signal: abortController.signal,
        });

        if (response.status === 429) {
          setError('limit');
          setStatus('error');
          return;
        }
        if (response.status === 409) {
          setError('busy');
          setStatus('error');
          return;
        }
        if (!response.ok || !response.body) {
          setError('generic');
          setStatus('error');
          return;
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let accumulated = '';
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
            if (!line.trim()) {
              continue;
            }
            const dataMatch = line.match(/data: (.+)/);
            if (!dataMatch) {
              continue;
            }
            try {
              const chunk = JSON.parse(dataMatch[1]) as CourseStudyAiStreamChunk;
              if (chunk.type === 'text' && chunk.content) {
                accumulated += chunk.content;
                setText(accumulated);
              } else if (chunk.type === 'error') {
                setError('generic');
                setStatus('error');
                return;
              } else if (chunk.type === 'done') {
                setStatus('done');
                return;
              }
            } catch {
              // Ignore malformed SSE fragments.
            }
          }
        }

        // Stream closed without an explicit `done` event.
        setStatus((current) => (current === 'streaming' ? 'done' : current));
      } catch (err: any) {
        if (err?.name === 'AbortError') {
          return;
        }
        console.error('Course study AI stream error:', err);
        setError('generic');
        setStatus('error');
      } finally {
        abortRef.current = null;
      }
    },
    [cancel, locale],
  );

  return { text, status, error, start, cancel };
}
