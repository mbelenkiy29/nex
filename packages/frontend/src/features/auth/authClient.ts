import { createAuthClient } from 'better-auth/react';
import { organizationClient } from 'better-auth/client/plugins';
import { apiKeyClient } from '@better-auth/api-key/client';
import { accessControl, roles } from '@project/backend/features/permissions';
import { useAuthStore } from '@/features/auth/authStore';

export const authClient = createAuthClient({
  baseURL: import.meta.env.VITE_BACKEND_URL || '',

  plugins: [
    organizationClient({
      ac: accessControl as any,
      roles: roles as any,
      schema: {
        organization: {
          additionalFields: {
            updatedAt: { type: 'date' },
            createdByUserId: { type: 'string' },
            updatedByUserId: { type: 'string' },
          },
        },
        member: {
          additionalFields: {
            firstName: { type: 'string' },
            lastName: { type: 'string' },
            fullName: { type: 'string' },
            avatars: { type: 'json' },
            status: { type: 'string' },
            importHash: { type: 'string' },
            updatedAt: { type: 'date' },
            createdByUserId: { type: 'string' },
            createdByMemberId: { type: 'string' },
            updatedByUserId: { type: 'string' },
            updatedByMemberId: { type: 'string' },
          },
        },
      },
    }),

    apiKeyClient(),
  ],

  fetchOptions: {
    onRequest(context) {
      const store = useAuthStore.getState();

      const locale = store.locale;
      if (locale) {
        context.headers.set('Accept-Language', locale);
      }

      if (store.config?.organizationForBranding) {
        context.headers.set(
          'x-organization-id',
          store.config.organizationForBranding.id,
        );
      }
    },
  },
});

export const { useSession } = authClient;
