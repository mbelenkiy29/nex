import { createRoute } from '@tanstack/react-router';
import { buildPageTitle } from '@/shared/lib/buildPageTitle';
import { authenticatedRoute } from '@/features/auth/authRouter';
import { useAuthStore } from '@/features/auth/authStore';
import { authGuardFrontend } from '@/features/auth/authGuardFrontend';

export const memberListRoute = createRoute({
  getParentRoute: () => authenticatedRoute,
  path: '/member',
  head: () => ({
    meta: [
      {
        title: buildPageTitle(
          useAuthStore.getState().dictionary.member.list.title,
        ),
      },
    ],
  }),
  beforeLoad: async ({ location }) => {
    const { currentUser, currentMember } = useAuthStore.getState();
    authGuardFrontend(
      { currentUser, currentMember },
      {
        member: ['read'],
      },
      location.pathname,
    );
  },
}).lazy(() =>
  import('./pages/MemberListPage').then((d) => d.memberListLazyRoute),
);

export const memberNewRoute = createRoute({
  getParentRoute: () => authenticatedRoute,
  path: '/member/new',
  head: () => ({
    meta: [
      {
        title: buildPageTitle(
          useAuthStore.getState().dictionary.member.new.title,
        ),
      },
    ],
  }),
  beforeLoad: async ({ location }) => {
    const { currentUser, currentMember } = useAuthStore.getState();
    authGuardFrontend(
      { currentUser, currentMember },
      {
        member: ['create'],
      },
      location.pathname,
    );
  },
}).lazy(() =>
  import('./pages/MemberNewPage').then((d) => d.memberNewLazyRoute),
);

export const memberEditRoute = createRoute({
  getParentRoute: () => authenticatedRoute,
  path: '/member/$id/edit',
  head: () => ({
    meta: [
      {
        title: buildPageTitle(
          useAuthStore.getState().dictionary.member.edit.title,
        ),
      },
    ],
  }),
  beforeLoad: async ({ location }) => {
    const { currentUser, currentMember } = useAuthStore.getState();
    authGuardFrontend(
      { currentUser, currentMember },
      {
        member: ['update'],
      },
      location.pathname,
    );
  },
}).lazy(() =>
  import('./pages/MemberEditPage').then((d) => d.memberEditLazyRoute),
);

export const memberViewRoute = createRoute({
  getParentRoute: () => authenticatedRoute,
  path: '/member/$id',
  head: () => ({
    meta: [
      {
        title: buildPageTitle(
          useAuthStore.getState().dictionary.member.view.title,
        ),
      },
    ],
  }),
  beforeLoad: async ({ location }) => {
    const { currentUser, currentMember } = useAuthStore.getState();
    authGuardFrontend(
      { currentUser, currentMember },
      {
        member: ['read'],
      },
      location.pathname,
    );
  },
}).lazy(() =>
  import('./pages/MemberViewPage').then((d) => d.memberViewLazyRoute),
);

export const memberImporterRoute = createRoute({
  getParentRoute: () => authenticatedRoute,
  path: '/member/importer',
  head: () => ({
    meta: [
      {
        title: buildPageTitle(
          useAuthStore.getState().dictionary.member.importer.title,
        ),
      },
    ],
  }),
  beforeLoad: async ({ location }) => {
    const { currentUser, currentMember } = useAuthStore.getState();
    authGuardFrontend(
      { currentUser, currentMember },
      {
        member: ['import'],
      },
      location.pathname,
    );
  },
}).lazy(() =>
  import('./pages/MemberImporterPage').then((d) => d.memberImporterLazyRoute),
);

export const invitationViewRoute = createRoute({
  getParentRoute: () => authenticatedRoute,
  path: '/member/invitation/$id',
  head: () => ({
    meta: [
      {
        title: buildPageTitle(
          useAuthStore.getState().dictionary.invitation.view.title,
        ),
      },
    ],
  }),
  beforeLoad: async ({ location }) => {
    const { currentUser, currentMember } = useAuthStore.getState();
    authGuardFrontend(
      { currentUser, currentMember },
      {
        invitation: ['read'],
      },
      location.pathname,
    );
  },
}).lazy(() =>
  import('./pages/InvitationViewPage').then((d) => d.invitationViewLazyRoute),
);

export const memberRouter = [
  memberListRoute,
  memberNewRoute,
  memberEditRoute,
  memberViewRoute,
  memberImporterRoute,
  invitationViewRoute,
];
