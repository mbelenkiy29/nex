import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type CookieConsentState = {
  essential: true;
  analytics: boolean;
  marketing: boolean;
  acceptedAt: string | null;
};

type CookieConsentStore = {
  consent: CookieConsentState | null;
  setConsent: (next: { analytics: boolean; marketing: boolean }) => void;
  /**
   * Returns `true` if the user has made an explicit choice (or accepted the
   * default 'essential only'). When `false` the banner should render.
   */
  hasDecided: () => boolean;
};

/**
 * Client-side source of truth for the cookie banner. Persisted to
 * localStorage under `nex.cookies.consent` so the banner never re-shows
 * for the same browser. Signed-in users get this synced to the backend
 * (`User.cookieConsent` Json) via `useCookieConsentMutation` so it
 * survives device changes.
 */
export const useCookieConsentStore = create<CookieConsentStore>()(
  persist(
    (set, get) => ({
      consent: null,
      setConsent: (next) =>
        set({
          consent: {
            essential: true,
            analytics: next.analytics,
            marketing: next.marketing,
            acceptedAt: new Date().toISOString(),
          },
        }),
      hasDecided: () => get().consent !== null,
    }),
    {
      name: 'nex.cookies.consent',
      version: 1,
    },
  ),
);
