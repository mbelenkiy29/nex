import { authGuardFrontend } from '@/features/auth/authGuardFrontend';
import { authenticatedRoute } from '@/features/auth/authRouter';
import { useAuthStore } from '@/features/auth/authStore';
import { buildPageTitle } from '@/shared/lib/buildPageTitle';
import { createRoute } from '@tanstack/react-router';

export const studyNoteListRoute = createRoute({
  getParentRoute: () => authenticatedRoute,
  path: '/study-note',
  head: () => ({
    meta: [
      {
        title: buildPageTitle(
          useAuthStore.getState().dictionary.studyNote.list.title,
        ),
      },
    ],
  }),
  beforeLoad: async ({ location }) => {
    const { currentUser, currentMember } = useAuthStore.getState();
    authGuardFrontend(
      { currentUser, currentMember },
      {
        studyNote: ['read'],
      },
      location.pathname,
    );
  },
}).lazy(() =>
  import('./pages/StudyNoteListPage').then((d) => d.studyNoteListLazyRoute),
);

export const studyNoteNewRoute = createRoute({
  getParentRoute: () => authenticatedRoute,
  path: '/study-note/new',
  head: () => ({
    meta: [
      {
        title: buildPageTitle(
          useAuthStore.getState().dictionary.studyNote.new.title,
        ),
      },
    ],
  }),
  beforeLoad: async ({ location }) => {
    const { currentUser, currentMember } = useAuthStore.getState();
    authGuardFrontend(
      { currentUser, currentMember },
      {
        studyNote: ['create'],
      },
      location.pathname,
    );
  },
}).lazy(() =>
  import('./pages/StudyNoteNewPage').then((d) => d.studyNoteNewLazyRoute),
);

export const studyNoteEditRoute = createRoute({
  getParentRoute: () => authenticatedRoute,
  path: '/study-note/$id/edit',
  head: () => ({
    meta: [
      {
        title: buildPageTitle(
          useAuthStore.getState().dictionary.studyNote.edit.title,
        ),
      },
    ],
  }),
  beforeLoad: async ({ location }) => {
    const { currentUser, currentMember } = useAuthStore.getState();
    authGuardFrontend(
      { currentUser, currentMember },
      {
        studyNote: ['update'],
      },
      location.pathname,
    );
  },
}).lazy(() =>
  import('./pages/StudyNoteEditPage').then((d) => d.studyNoteEditLazyRoute),
);

export const studyNoteViewRoute = createRoute({
  getParentRoute: () => authenticatedRoute,
  path: '/study-note/$id',
  head: () => ({
    meta: [
      {
        title: buildPageTitle(
          useAuthStore.getState().dictionary.studyNote.view.title,
        ),
      },
    ],
  }),
  beforeLoad: async ({ location }) => {
    const { currentUser, currentMember } = useAuthStore.getState();
    authGuardFrontend(
      { currentUser, currentMember },
      {
        studyNote: ['read'],
      },
      location.pathname,
    );
  },
}).lazy(() =>
  import('./pages/StudyNoteViewPage').then((d) => d.studyNoteViewLazyRoute),
);

export const studyNoteImporterRoute = createRoute({
  getParentRoute: () => authenticatedRoute,
  path: '/study-note/importer',
  head: () => ({
    meta: [
      {
        title: buildPageTitle(
          useAuthStore.getState().dictionary.studyNote.importer.title,
        ),
      },
    ],
  }),
  beforeLoad: async ({ location }) => {
    const { currentUser, currentMember } = useAuthStore.getState();
    authGuardFrontend(
      { currentUser, currentMember },
      {
        studyNote: ['import'],
      },
      location.pathname,
    );
  },
}).lazy(() =>
  import('./pages/StudyNoteImporterPage').then(
    (d) => d.studyNoteImporterLazyRoute,
  ),
);

export const studyNoteRouter = [
  studyNoteListRoute,
  studyNoteNewRoute,
  studyNoteEditRoute,
  studyNoteViewRoute,
  studyNoteImporterRoute,
];
