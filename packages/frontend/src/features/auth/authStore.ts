import { MemberWithRelationships } from '@project/backend/features/member/memberSchemas';
import { UserWithMembers } from '@project/backend/features/user/userSchemas';
import {
  Subscription,
  Organization,
} from '@project/backend/prisma/prismaTypes';
import {
  getDictionary,
  dictionaries,
} from '@project/backend/translation/getDictionary';
import { applyDayjsTranslation } from '@project/backend/translation/applyDayjsTranslation';
import { getZodErrorMap } from '@/shared/lib/getZodErrorMap';
import {
  type Dictionary,
  type Locale,
  defaultLocale,
} from '@project/backend/translation/locales';
import { type ConfigPublic } from '@project/backend/features/config/configSchemas';
import { type PartialPermissions } from '@project/backend/features/permissions';
import { z } from 'zod';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { apiClient } from '@/shared/lib/apiClient';
import { authClient } from '@/features/auth/authClient';
import { handlePushTokenAfterAuth } from '@/shared/lib/nativeApp';
import { handleWebPushAfterAuth } from '@/shared/lib/webPush';
import { router } from '@/features/router';
import { objectToQuery } from '@/shared/lib/objectToQuery';
import { dashboardPersonaClear } from '@/features/dashboard/dashboardHome';

export type { Dictionary, Locale, PartialPermissions };
export type Theme = 'light' | 'dark' | 'system';

interface AuthState {
  locale: Locale;
  theme: Theme;
  dictionary: Dictionary;
  config: ConfigPublic | null;
  currentUser: UserWithMembers | null;
  currentOrganization: Organization | null;
  currentMember: MemberWithRelationships | null;
  currentSubscription: Subscription | null;
  isPlatformAdmin: boolean;
  isCreator: boolean;
  isVerifiedCreator: boolean;
  activeSubscriptions: Subscription[];
  isInitialized: boolean;
  isInitializing: boolean;
  hasPermission: (permissions: PartialPermissions) => boolean;
  setLocale: (locale: Locale) => void;
  setTheme: (theme: Theme) => void;
  setDictionary: (dictionary: Dictionary) => void;
  setCurrentUser: (
    user: any,
    activeSubscriptions?: Subscription[],
  ) => Promise<void>;
  setActiveOrganization: (organizationId: string) => Promise<void>;
  signOut: () => Promise<void>;
  loadDictionary: (locale: Locale) => Promise<void>;
  fetchConfig: () => Promise<void>;
  init: () => Promise<void>;
  fetchCurrentUser: () => Promise<void>;
}

const defaultDictionary: Dictionary = dictionaries[defaultLocale];

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      locale: defaultLocale,
      theme: 'system',
      dictionary: defaultDictionary,
      config: null,
      currentUser: null,
      currentOrganization: null,
      currentMember: null,
      currentSubscription: null,
      isPlatformAdmin: false,
      isCreator: false,
      isVerifiedCreator: false,
      activeSubscriptions: [],
      isInitialized: false,
      isInitializing: false,

      hasPermission: (permissions) => {
        const currentMember = get().currentMember;

        if (!currentMember) {
          return false;
        }

        return authClient.organization.checkRolePermission({
          permissions: permissions as any,
          role: currentMember.role,
        });
      },

      setLocale: (locale) => {
        set({ locale });
        get().loadDictionary(locale);
        z.config(getZodErrorMap(locale)());
        applyDayjsTranslation(locale);
      },

      setTheme: (theme) => set({ theme }),

      setDictionary: (dictionary) => set({ dictionary }),

      setCurrentUser: async (currentUser, activeSubscriptions) => {
        const state = get();
        let currentMember = null;
        let currentOrganization = null;
        let currentSubscription = null;

        const subscriptions =
          activeSubscriptions !== undefined
            ? activeSubscriptions
            : state.activeSubscriptions;

        if (currentUser) {
          const activeMemberResult =
            await authClient.organization.getActiveMember();
          if (activeMemberResult?.data) {
            const activeMember = activeMemberResult.data;
            currentMember =
              currentUser.members?.find((m: any) => m.id === activeMember.id) ||
              null;
            currentOrganization = currentMember?.organization || null;
          }

          // Auto-switch to config organization if specified
          const config = state.config;
          if (config?.organizationForBranding) {
            const requiredOrgId = config.organizationForBranding.id;
            const currentOrgId = currentOrganization?.id;

            if (requiredOrgId !== currentOrgId) {
              try {
                await state.setActiveOrganization(requiredOrgId);
                return;
              } catch (error) {
                // Proceed, as the user may not belong to the required org
                // and should be stuck on no permissions page
                console.error(
                  'Failed to switch to required organization from config:',
                  error,
                );
              }
            }
          }
        }

        if (subscriptions?.length) {
          const activeStatuses = ['trialing', 'active'];
          if (currentOrganization?.id) {
            currentSubscription = subscriptions.find(
              (sub) =>
                sub.organizationId === currentOrganization.id &&
                activeStatuses.includes(sub.status),
            );
          }
          if (!currentSubscription) {
            currentSubscription =
              subscriptions.find(
                (sub) =>
                  !sub.organizationId && activeStatuses.includes(sub.status),
              ) || null;
          }
        }

        set({
          currentUser,
          currentOrganization,
          currentMember,
          currentSubscription,
          isPlatformAdmin: currentUser ? state.isPlatformAdmin : false,
          isCreator: currentUser ? state.isCreator : false,
          isVerifiedCreator: currentUser ? state.isVerifiedCreator : false,
          activeSubscriptions: subscriptions,
        });

        if (currentUser) {
          handlePushTokenAfterAuth();
          handleWebPushAfterAuth();
        }
      },

      setActiveOrganization: async (organizationId: string) => {
        try {
          await apiClient
            .post(`api/organization/${organizationId}/set-active`)
            .json();

          await get().fetchCurrentUser();
        } catch (error) {
          console.error('Failed to set active organization:', error);
          throw error;
        }
      },

      signOut: async () => {
        try {
          await authClient.signOut();
        } catch (error) {
          console.error('Sign out failed:', error);
        } finally {
          set({
            currentUser: null,
            currentOrganization: null,
            currentMember: null,
            currentSubscription: null,
            isPlatformAdmin: false,
            isCreator: false,
            isVerifiedCreator: false,
            activeSubscriptions: [],
          });
          dashboardPersonaClear();
          await router.invalidate();
          router.navigate({ to: '/auth/sign-in' });
        }
      },

      loadDictionary: async (locale) => {
        set({ dictionary: await getDictionary(locale) });
      },

      fetchConfig: async () => {
        try {
          const domain = window.location.hostname;

          const config = await apiClient
            .get(`api/config/public?${objectToQuery({ domain })}`)
            .json<ConfigPublic>();
          set({ config });
        } catch (error) {
          console.error('Failed to fetch config:', error);
          const state = get();
          if (!state.config) {
            set({
              config: {
                organizationMode: 'multi',
                subscriptionMode: 'disabled',
                isChatbotEnabled: false,
                isPushNotificationsEnabled: false,
              },
            });
          }
        }
      },

      fetchCurrentUser: async () => {
        try {
          const { data: session, error } = await authClient.getSession({
            query: {
              disableCookieCache: true,
            },
          });

          if (error || !session?.user) {
            set({
              currentUser: null,
              currentOrganization: null,
              currentMember: null,
              currentSubscription: null,
              isPlatformAdmin: false,
              isCreator: false,
              isVerifiedCreator: false,
              activeSubscriptions: [],
            });
            return;
          }

          const additionalData = await apiClient.get('api/user/me').json<{
            members: any[];
            activeSubscriptions: any[];
            isPlatformAdmin: boolean;
            isCreator: boolean;
            isVerifiedCreator: boolean;
          }>();

          const userWithMembers = {
            ...session.user,
            members: additionalData.members || [],
          };

          await get().setCurrentUser(
            userWithMembers,
            additionalData.activeSubscriptions || [],
          );
          set({
            isPlatformAdmin: additionalData.isPlatformAdmin,
            isCreator: additionalData.isCreator,
            isVerifiedCreator: additionalData.isVerifiedCreator,
          });
        } catch (error) {
          // A genuine auth failure (401/403) is already handled by the
          // apiClient `beforeError` hook, which signs the user out. Any error
          // reaching here is transient (network/timeout/5xx) and must NOT end
          // the session — otherwise a brief network blip logs the user out.
          console.error('Failed to fetch current user:', error);
        }
      },

      init: async () => {
        const state = get();
        if (state.isInitialized || state.isInitializing) {
          return;
        }

        set({ isInitializing: true });

        try {
          await state.fetchConfig();

          await Promise.all([
            state.setLocale(state.locale),
            state.fetchCurrentUser(),
          ]);
        } catch (error) {
          console.error('Failed to initialize app context:', error);
        } finally {
          set({ isInitialized: true, isInitializing: false });
        }
      },
    }),
    {
      name: 'app-context-storage',
      // Only UI preferences and non-sensitive app config are persisted.
      // Auth state (currentUser/currentMember/currentOrganization/
      // subscriptions) is intentionally NOT persisted — it is always
      // re-fetched from the server during `init()`, so a stale localStorage
      // copy can never produce a flash of authenticated UI on reload.
      partialize: (state) => ({
        locale: state.locale,
        theme: state.theme,
        config: state.config,
      }),
      onRehydrateStorage: () => {
        return (state) => {
          if (state) {
            // Synchronously restore the dictionary from the persisted locale
            // to avoid UI language flicker during HMR or page reload
            const dictionary =
              dictionaries[state.locale] || dictionaries[defaultLocale];
            state.setDictionary(dictionary);
            z.config(getZodErrorMap(state.locale)());
            applyDayjsTranslation(state.locale);
          }
        };
      },
    },
  ),
);
