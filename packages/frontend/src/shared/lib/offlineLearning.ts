import { useEffect, useMemo, useState } from 'react';
import { apiClient } from './apiClient';
import {
  nativeBridgeReportCacheStatus,
  nativeBridgeReportSyncStatus,
} from './nativeApp';

const databaseName = 'nexexam-mobile-learning';
const databaseVersion = 1;
const cacheStoreName = 'course-cache';
const mutationStoreName = 'mutation-queue';
const offlineStatusEvent = 'offline-learning-status';

export type OfflineLearningStatus =
  | 'online'
  | 'offline'
  | 'syncing'
  | 'synced'
  | 'failed';

export type CachedCourseLearningPayload = {
  courseId: string;
  payload: unknown;
  cachedAt: string;
};

export type QueuedMutation =
  | {
      id: string;
      type: 'lessonComplete';
      courseId: string;
      lessonId: string;
      createdAt: string;
    }
  | {
      id: string;
      type: 'noteCreate';
      courseId: string;
      lessonId?: string | null;
      title: string;
      content: string;
      tags?: string[];
      createdAt: string;
    }
  | {
      id: string;
      type: 'practiceAnswer';
      courseId: string;
      attemptId: string;
      questionId: string;
      selectedAnswerIndex: number;
      createdAt: string;
    }
  | {
      id: string;
      type: 'studyPlanUpdate';
      courseId: string;
      itemId: string;
      status: 'todo' | 'complete';
      createdAt: string;
    }
  | {
      id: string;
      type: 'resumeUpdate';
      courseId: string;
      resume: {
        lessonId?: string | null;
        practiceAttemptId?: string | null;
        lastRoute?: string | null;
        lastPositionSeconds?: number | null;
        lastScrollPercent?: number | null;
        deviceType?: 'web' | 'mobileWeb' | 'ios' | 'android' | null;
        metadata?: Record<string, unknown>;
      };
      createdAt: string;
    };

type QueuedMutationInput = QueuedMutation extends infer Mutation
  ? Mutation extends QueuedMutation
    ? Omit<Mutation, 'id' | 'createdAt'> &
        Partial<Pick<Mutation, 'id' | 'createdAt'>>
    : never
  : never;

let status: OfflineLearningStatus =
  typeof navigator !== 'undefined' && !navigator.onLine ? 'offline' : 'online';

function setOfflineStatus(next: OfflineLearningStatus) {
  status = next;
  nativeBridgeReportSyncStatus(next);
  window.dispatchEvent(
    new CustomEvent(offlineStatusEvent, {
      detail: next,
    }),
  );
}

function openOfflineDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(databaseName, databaseVersion);

    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(cacheStoreName)) {
        db.createObjectStore(cacheStoreName, { keyPath: 'courseId' });
      }
      if (!db.objectStoreNames.contains(mutationStoreName)) {
        db.createObjectStore(mutationStoreName, { keyPath: 'id' });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function withStore<T>(
  storeName: string,
  mode: IDBTransactionMode,
  operation: (store: IDBObjectStore) => IDBRequest<T>,
) {
  const db = await openOfflineDb();

  return await new Promise<T>((resolve, reject) => {
    const transaction = db.transaction(storeName, mode);
    const request = operation(transaction.objectStore(storeName));
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
    transaction.oncomplete = () => db.close();
    transaction.onerror = () => {
      db.close();
      reject(transaction.error);
    };
  });
}

export async function offlineLearningCacheGet(courseId: string) {
  if (typeof indexedDB === 'undefined') {
    return null;
  }

  const cached = await withStore<CachedCourseLearningPayload | undefined>(
    cacheStoreName,
    'readonly',
    (store) => store.get(courseId),
  );

  return cached || null;
}

export async function offlineLearningCachePut(
  payload: CachedCourseLearningPayload,
) {
  if (typeof indexedDB === 'undefined') {
    return;
  }

  await withStore<IDBValidKey>(cacheStoreName, 'readwrite', (store) =>
    store.put(payload),
  );
  nativeBridgeReportCacheStatus('cached');
}

export async function offlineQueueMutation(mutation: QueuedMutationInput) {
  const queued = {
    ...mutation,
    id: mutation.id || crypto.randomUUID(),
    createdAt: mutation.createdAt || new Date().toISOString(),
  } as QueuedMutation;

  await withStore<IDBValidKey>(mutationStoreName, 'readwrite', (store) =>
    store.put(queued),
  );
  setOfflineStatus('offline');
  return queued;
}

export async function offlineQueuedMutationsGet() {
  if (typeof indexedDB === 'undefined') {
    return [];
  }

  const items = await withStore<QueuedMutation[]>(
    mutationStoreName,
    'readonly',
    (store) => store.getAll(),
  );

  return items.sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
  );
}

export async function offlineSyncPendingMutations(courseId?: string) {
  if (typeof navigator !== 'undefined' && !navigator.onLine) {
    setOfflineStatus('offline');
    return { synced: 0, failed: 0 };
  }

  const queued = await offlineQueuedMutationsGet();
  const mutations = courseId
    ? queued.filter((mutation) => mutation.courseId === courseId)
    : queued;

  if (!mutations.length) {
    setOfflineStatus('synced');
    return { synced: 0, failed: 0 };
  }

  setOfflineStatus('syncing');

  try {
    const response = await apiClient
      .post('api/student/sync', {
        json: { mutations },
      })
      .json<{
        results: Array<{ id: string; status: 'synced' | 'failed' }>;
      }>();
    const syncedIds = new Set(
      response.results
        .filter((result) => result.status === 'synced')
        .map((result) => result.id),
    );

    for (const id of syncedIds) {
      await withStore<undefined>(mutationStoreName, 'readwrite', (store) =>
        store.delete(id),
      );
    }

    const failed = response.results.length - syncedIds.size;
    setOfflineStatus(failed ? 'failed' : 'synced');
    return { synced: syncedIds.size, failed };
  } catch {
    setOfflineStatus('failed');
    return { synced: 0, failed: mutations.length };
  }
}

export function useOfflineLearningStatus(courseId?: string) {
  const [currentStatus, setCurrentStatus] =
    useState<OfflineLearningStatus>(status);

  useEffect(() => {
    const handleStatus = (event: Event) => {
      setCurrentStatus((event as CustomEvent<OfflineLearningStatus>).detail);
    };
    const handleOnline = () => {
      setOfflineStatus('online');
      offlineSyncPendingMutations(courseId);
    };
    const handleOffline = () => setOfflineStatus('offline');

    window.addEventListener(offlineStatusEvent, handleStatus);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    if (navigator.onLine) {
      offlineSyncPendingMutations(courseId);
    } else {
      setOfflineStatus('offline');
    }

    return () => {
      window.removeEventListener(offlineStatusEvent, handleStatus);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [courseId]);

  return useMemo(
    () => ({
      status: currentStatus,
      isOffline: currentStatus === 'offline',
      isSyncing: currentStatus === 'syncing',
      syncNow: () => offlineSyncPendingMutations(courseId),
    }),
    [courseId, currentStatus],
  );
}
