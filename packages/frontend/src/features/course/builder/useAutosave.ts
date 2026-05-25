import { useCallback, useEffect, useRef, useState } from 'react';
import {
  builderFormToPayload,
  type CourseBuilderForm,
} from '@/features/course/courseBuilderUtils';
import { apiClient } from '@/shared/lib/apiClient';

export type SaveStatus = 'idle' | 'saving' | 'saved' | 'error';

const DEBOUNCE_MS = 1200;

/**
 * Debounced autosave for the course builder. Watches `editTick` (bumped only on
 * real user edits, never on the initial server-seeded form) and PUTs the whole
 * course document — the backend sync is idempotent, so a full-document save is
 * safe. Saves are serialised: a change made mid-flight is coalesced into one
 * follow-up save. `saveNow` flushes immediately (used before submit / on leave).
 */
export function useAutosave({
  courseId,
  form,
  editTick,
  enabled,
  onSaved,
  onCheckpointSaved,
}: {
  courseId: string;
  form: CourseBuilderForm;
  editTick: number;
  enabled: boolean;
  onSaved?: () => void;
  onCheckpointSaved?: () => void;
}) {
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('idle');
  const [lastSavedAt, setLastSavedAt] = useState<number | null>(null);

  const formRef = useRef(form);
  formRef.current = form;
  const editTickRef = useRef(editTick);
  editTickRef.current = editTick;
  const enabledRef = useRef(enabled);
  enabledRef.current = enabled;

  // The highest editTick whose form has been persisted. `editTick > savedTick`
  // means there are unsaved changes.
  const savedTickRef = useRef(0);
  const savingRef = useRef(false);
  const pendingRef = useRef(false);

  const flush = useCallback(async (): Promise<boolean> => {
    if (!enabledRef.current) {
      return true;
    }
    if (editTickRef.current === savedTickRef.current) {
      return true; // already in sync
    }
    if (savingRef.current) {
      pendingRef.current = true; // coalesce — re-run when the in-flight save ends
      return true;
    }
    const tickAtStart = editTickRef.current;
    savingRef.current = true;
    setSaveStatus('saving');
    let ok = true;
    try {
      const payload = builderFormToPayload(formRef.current);
      await apiClient
        .post(`api/course-builder/${courseId}/checkpoints`, {
          json: {
            source: 'autosave',
            payload,
          },
        })
        .json();
      onCheckpointSaved?.();
      await apiClient
        .put(`api/course-builder/${courseId}`, {
          json: payload,
        })
        .json();
      savedTickRef.current = tickAtStart;
      setSaveStatus('saved');
      setLastSavedAt(Date.now());
      if (editTickRef.current === tickAtStart) {
        onSaved?.();
      }
    } catch {
      ok = false;
      setSaveStatus('error');
    } finally {
      savingRef.current = false;
    }
    if (pendingRef.current && enabledRef.current) {
      pendingRef.current = false;
      return flush();
    }
    return ok;
  }, [courseId, onCheckpointSaved, onSaved]);

  // Debounce: schedule a save whenever the form changes (editTick > 0).
  useEffect(() => {
    if (!enabled || editTick === 0) {
      return;
    }
    const timer = setTimeout(() => {
      void flush();
    }, DEBOUNCE_MS);
    return () => clearTimeout(timer);
  }, [editTick, enabled, flush]);

  // Flush any unsaved changes when the builder unmounts (leaving /edit). The
  // request outlives the component — fire and forget.
  useEffect(() => {
    return () => {
      if (
        enabledRef.current &&
        editTickRef.current !== savedTickRef.current
      ) {
        void flush();
      }
    };
  }, [flush]);

  // Warn on hard browser navigation while changes are unsaved.
  useEffect(() => {
    const handler = (event: BeforeUnloadEvent) => {
      if (editTickRef.current !== savedTickRef.current) {
        event.preventDefault();
        event.returnValue = '';
      }
    };
    window.addEventListener('beforeunload', handler);
    return () => window.removeEventListener('beforeunload', handler);
  }, []);

  const saveNow = useCallback(() => flush(), [flush]);
  const retry = useCallback(() => {
    void flush();
  }, [flush]);

  return { saveStatus, lastSavedAt, saveNow, retry };
}
