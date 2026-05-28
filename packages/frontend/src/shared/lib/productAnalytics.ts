import type {
  ProductAnalyticsEventInput,
  ProductAnalyticsEventName,
} from '@project/backend/features/productAnalytics/productAnalyticsSchemas';
import { useAuthStore } from '@/features/auth/authStore';
import { useCookieConsentStore } from '@/features/cookies/cookieConsentStore';
import { apiClient } from './apiClient';

const analyticsSessionKey = 'nex.analytics.sessionId';
const analyticsAnonymousKey = 'nex.analytics.anonymousId';
const analyticsSeenKey = 'nex.analytics.seenEvents';

function createId() {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function getSessionId() {
  const existing = sessionStorage.getItem(analyticsSessionKey);
  if (existing) {
    return existing;
  }

  const next = createId();
  sessionStorage.setItem(analyticsSessionKey, next);
  return next;
}

function getAnonymousId() {
  const existing = localStorage.getItem(analyticsAnonymousKey);
  if (existing) {
    return existing;
  }

  const next = createId();
  localStorage.setItem(analyticsAnonymousKey, next);
  return next;
}

function canTrackBrowserEvent() {
  const currentUser = useAuthStore.getState().currentUser;
  if (currentUser) {
    return true;
  }

  return useCookieConsentStore.getState().consent?.analytics === true;
}

function readSeenEvents() {
  try {
    return JSON.parse(
      sessionStorage.getItem(analyticsSeenKey) || '{}',
    ) as Record<string, true>;
  } catch {
    return {};
  }
}

function writeSeenEvents(seen: Record<string, true>) {
  sessionStorage.setItem(analyticsSeenKey, JSON.stringify(seen));
}

export function productAnalyticsTrack(input: ProductAnalyticsEventInput) {
  if (typeof window === 'undefined' || !canTrackBrowserEvent()) {
    return;
  }

  const payload: ProductAnalyticsEventInput = {
    ...input,
    sessionId: input.sessionId || getSessionId(),
    anonymousId: input.anonymousId || getAnonymousId(),
    currentPath:
      input.currentPath ||
      `${window.location.pathname}${window.location.search}`,
    referrerPath: input.referrerPath || document.referrer || null,
  };

  void apiClient
    .post('api/product-analytics/events', { json: payload })
    .catch(() => undefined);
}

export function productAnalyticsTrackOnce(
  key: string,
  input: ProductAnalyticsEventInput & { eventName: ProductAnalyticsEventName },
) {
  if (typeof window === 'undefined' || !canTrackBrowserEvent()) {
    return;
  }

  const seen = readSeenEvents();
  if (seen[key]) {
    return;
  }

  seen[key] = true;
  writeSeenEvents(seen);
  const sessionId = getSessionId();
  productAnalyticsTrack({
    ...input,
    sessionId: input.sessionId || sessionId,
    dedupeKey: input.dedupeKey || `frontend:${sessionId}:${key}`,
  });
}
