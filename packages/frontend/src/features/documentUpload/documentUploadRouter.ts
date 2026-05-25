import { authGuardFrontend } from '@/features/auth/authGuardFrontend';
import { authenticatedRoute } from '@/features/auth/authRouter';
import { useAuthStore } from '@/features/auth/authStore';
import { buildPageTitle } from '@/shared/lib/buildPageTitle';
import { createRoute } from '@tanstack/react-router';

export const documentUploadListRoute = createRoute({
  getParentRoute: () => authenticatedRoute,
  path: '/document-upload',
  head: () => ({
    meta: [
      {
        title: buildPageTitle(
          useAuthStore.getState().dictionary.documentUpload.list.title,
        ),
      },
    ],
  }),
  beforeLoad: async ({ location }) => {
    const { currentUser, currentMember } = useAuthStore.getState();
    authGuardFrontend(
      { currentUser, currentMember },
      {
        documentUpload: ['read'],
      },
      location.pathname,
    );
  },
}).lazy(() =>
  import('./pages/DocumentUploadListPage').then(
    (d) => d.documentUploadListLazyRoute,
  ),
);

export const documentUploadNewRoute = createRoute({
  getParentRoute: () => authenticatedRoute,
  path: '/document-upload/new',
  head: () => ({
    meta: [
      {
        title: buildPageTitle(
          useAuthStore.getState().dictionary.documentUpload.new.title,
        ),
      },
    ],
  }),
  beforeLoad: async ({ location }) => {
    const { currentUser, currentMember } = useAuthStore.getState();
    authGuardFrontend(
      { currentUser, currentMember },
      {
        documentUpload: ['create'],
      },
      location.pathname,
    );
  },
}).lazy(() =>
  import('./pages/DocumentUploadNewPage').then(
    (d) => d.documentUploadNewLazyRoute,
  ),
);

export const documentUploadEditRoute = createRoute({
  getParentRoute: () => authenticatedRoute,
  path: '/document-upload/$id/edit',
  head: () => ({
    meta: [
      {
        title: buildPageTitle(
          useAuthStore.getState().dictionary.documentUpload.edit.title,
        ),
      },
    ],
  }),
  beforeLoad: async ({ location }) => {
    const { currentUser, currentMember } = useAuthStore.getState();
    authGuardFrontend(
      { currentUser, currentMember },
      {
        documentUpload: ['update'],
      },
      location.pathname,
    );
  },
}).lazy(() =>
  import('./pages/DocumentUploadEditPage').then(
    (d) => d.documentUploadEditLazyRoute,
  ),
);

export const documentUploadViewRoute = createRoute({
  getParentRoute: () => authenticatedRoute,
  path: '/document-upload/$id',
  head: () => ({
    meta: [
      {
        title: buildPageTitle(
          useAuthStore.getState().dictionary.documentUpload.view.title,
        ),
      },
    ],
  }),
  beforeLoad: async ({ location }) => {
    const { currentUser, currentMember } = useAuthStore.getState();
    authGuardFrontend(
      { currentUser, currentMember },
      {
        documentUpload: ['read'],
      },
      location.pathname,
    );
  },
}).lazy(() =>
  import('./pages/DocumentUploadViewPage').then(
    (d) => d.documentUploadViewLazyRoute,
  ),
);

export const documentUploadImporterRoute = createRoute({
  getParentRoute: () => authenticatedRoute,
  path: '/document-upload/importer',
  head: () => ({
    meta: [
      {
        title: buildPageTitle(
          useAuthStore.getState().dictionary.documentUpload.importer.title,
        ),
      },
    ],
  }),
  beforeLoad: async ({ location }) => {
    const { currentUser, currentMember } = useAuthStore.getState();
    authGuardFrontend(
      { currentUser, currentMember },
      {
        documentUpload: ['import'],
      },
      location.pathname,
    );
  },
}).lazy(() =>
  import('./pages/DocumentUploadImporterPage').then(
    (d) => d.documentUploadImporterLazyRoute,
  ),
);

export const documentUploadRouter = [
  documentUploadListRoute,
  documentUploadNewRoute,
  documentUploadEditRoute,
  documentUploadViewRoute,
  documentUploadImporterRoute,
];
