import { useAuthStore } from '@/features/auth/authStore';
import ky, { HTTPError } from 'ky';

/**
 * Pre-configured ky instance for API calls
 * Includes base URL, credentials configuration, locale header, and organization header
 */
export const apiClient = ky.create({
  prefixUrl: `${import.meta.env.VITE_BACKEND_URL || window.location.origin}`,
  credentials: 'include',
  headers: {
    'Content-Type': 'application/json',
  },
  hooks: {
    beforeRequest: [
      (request) => {
        const store = useAuthStore.getState();

        const locale = store.locale;
        if (locale) {
          request.headers.set('Accept-Language', locale);
        }

        if (store.config?.organizationForBranding) {
          request.headers.set(
            'x-organization-id',
            store.config?.organizationForBranding?.id,
          );
        }
      },
    ],
    beforeError: [
      async (error) => {
        const { response } = error;

        if (response && (response.status === 401 || response.status === 403)) {
          const store = useAuthStore.getState();
          await store.signOut();
        }

        if (response && response.body) {
          try {
            const body = (await response.json()) as {
              errors?: { message?: string }[];
            };
            error.message = body.errors?.[0]?.message || error.message;
          } catch {
            // Keep original error message if parsing fails
          }
        }
        return error;
      },
    ],
  },
});

export { HTTPError };
