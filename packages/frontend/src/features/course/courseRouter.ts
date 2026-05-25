import { createRoute, redirect } from '@tanstack/react-router';
import { buildPageTitle } from '@/shared/lib/buildPageTitle';
import { authenticatedRoute } from '@/features/auth/authRouter';
import { useAuthStore } from '@/features/auth/authStore';
import { authGuardFrontend } from '@/features/auth/authGuardFrontend';
import { dashboardPersonaSet } from '@/features/dashboard/dashboardHome';

// Creator-only gate for the Course Builder routes. Read access (list/edit) is
// allowed for any creator; verified-creator write enforcement is on the API.
async function ensureCreatorAccess(pathname: string) {
  const state = useAuthStore.getState();
  authGuardFrontend(
    { currentUser: state.currentUser, currentMember: state.currentMember },
    undefined,
    pathname,
  );
  let { isCreator } = useAuthStore.getState();
  if (!isCreator) {
    await useAuthStore.getState().fetchCurrentUser();
    isCreator = useAuthStore.getState().isCreator;
  }
  if (!isCreator) {
    throw redirect({ to: '/creator-application' });
  }
  // Platform admins keep whichever persona they chose via the view switcher.
  // Only flip non-admins into 'creator' on creator-write routes — admins
  // viewing a builder while in Student persona shouldn't be silently rebranded.
  if (!state.isPlatformAdmin) {
    dashboardPersonaSet('creator');
  }
}

export const courseCatalogRoute = createRoute({
  getParentRoute: () => authenticatedRoute,
  path: '/course',
  head: () => ({
    meta: [
      {
        title: buildPageTitle(
          useAuthStore.getState().dictionary.course.list.title,
        ),
      },
    ],
  }),
  beforeLoad: async ({ location }) => {
    const { currentUser, currentMember } = useAuthStore.getState();
    authGuardFrontend(
      { currentUser, currentMember },
      { course: ['read'] },
      location.pathname,
    );
  },
}).lazy(() =>
  import('./pages/CourseCatalogPage').then((d) => d.courseCatalogLazyRoute),
);

export const courseDetailRoute = createRoute({
  getParentRoute: () => authenticatedRoute,
  path: '/course/$slug',
  head: () => ({
    meta: [
      {
        title: buildPageTitle(
          useAuthStore.getState().dictionary.course.detail.title,
        ),
      },
    ],
  }),
  beforeLoad: async ({ location }) => {
    const { currentUser, currentMember } = useAuthStore.getState();
    authGuardFrontend(
      { currentUser, currentMember },
      { course: ['read'] },
      location.pathname,
    );
  },
}).lazy(() =>
  import('./pages/CourseDetailPage').then((d) => d.courseDetailLazyRoute),
);

export const courseCompareRoute = createRoute({
  getParentRoute: () => authenticatedRoute,
  path: '/course/compare',
  head: () => ({
    meta: [
      {
        title: buildPageTitle(
          useAuthStore.getState().dictionary.course.marketplace.compare,
        ),
      },
    ],
  }),
  beforeLoad: async ({ location }) => {
    const { currentUser, currentMember } = useAuthStore.getState();
    authGuardFrontend(
      { currentUser, currentMember },
      { course: ['read'] },
      location.pathname,
    );
  },
}).lazy(() =>
  import('./pages/CourseComparePage').then((d) => d.courseCompareLazyRoute),
);

export const courseCertificateRoute = createRoute({
  getParentRoute: () => authenticatedRoute,
  path: '/course/$id/certificate',
  head: () => ({
    meta: [
      {
        title: buildPageTitle(
          useAuthStore.getState().dictionary.course.certificate.title,
        ),
      },
    ],
  }),
  beforeLoad: async ({ location }) => {
    const { currentUser, currentMember } = useAuthStore.getState();
    authGuardFrontend(
      { currentUser, currentMember },
      { course: ['read'] },
      location.pathname,
    );
  },
}).lazy(() =>
  import('./pages/CourseCertificatePage').then(
    (d) => d.courseCertificateLazyRoute,
  ),
);

export const creatorProfileRoute = createRoute({
  getParentRoute: () => authenticatedRoute,
  path: '/creator/$creatorId',
  head: () => ({
    meta: [
      {
        title: buildPageTitle(
          useAuthStore.getState().dictionary.course.marketplace.creatorProfile,
        ),
      },
    ],
  }),
  beforeLoad: async ({ location }) => {
    const { currentUser, currentMember } = useAuthStore.getState();
    authGuardFrontend(
      { currentUser, currentMember },
      { course: ['read'] },
      location.pathname,
    );
  },
}).lazy(() =>
  import('./pages/CreatorProfilePage').then((d) => d.creatorProfileLazyRoute),
);

export const courseLearnRoute = createRoute({
  getParentRoute: () => authenticatedRoute,
  path: '/course/$id/learn',
  head: () => ({
    meta: [
      {
        title: buildPageTitle(
          useAuthStore.getState().dictionary.course.learn.title,
        ),
      },
    ],
  }),
  beforeLoad: async ({ location }) => {
    const { currentUser, currentMember } = useAuthStore.getState();
    authGuardFrontend(
      { currentUser, currentMember },
      { course: ['read'] },
      location.pathname,
    );
  },
}).lazy(() =>
  import('./pages/CourseLearnPage').then((d) => d.courseLearnLazyRoute),
);

export const creatorApplicationRoute = createRoute({
  getParentRoute: () => authenticatedRoute,
  path: '/creator-application',
  head: () => ({
    meta: [
      {
        title: buildPageTitle(
          useAuthStore.getState().dictionary.creatorApplication.title,
        ),
      },
    ],
  }),
  beforeLoad: async ({ location }) => {
    const { currentUser, currentMember, isPlatformAdmin } =
      useAuthStore.getState();
    authGuardFrontend(
      { currentUser, currentMember },
      { creatorApplication: ['create'] },
      location.pathname,
    );
    // Same rule as ensureCreatorAccess — admins keep their chosen persona.
    if (!isPlatformAdmin) {
      dashboardPersonaSet('creator');
    }
  },
}).lazy(() =>
  import('./pages/CreatorApplicationPage').then(
    (d) => d.creatorApplicationLazyRoute,
  ),
);

export const creatorCoursesRoute = createRoute({
  getParentRoute: () => authenticatedRoute,
  path: '/creator/courses',
  head: () => ({
    meta: [
      {
        title: buildPageTitle(
          useAuthStore.getState().dictionary.course.builder.menu,
        ),
      },
    ],
  }),
  beforeLoad: async ({ location }) => {
    await ensureCreatorAccess(location.pathname);
  },
}).lazy(() =>
  import('./pages/CreatorCoursesPage').then((d) => d.creatorCoursesLazyRoute),
);

export const courseBuilderNewRoute = createRoute({
  getParentRoute: () => authenticatedRoute,
  path: '/creator/courses/new',
  head: () => ({
    meta: [
      {
        title: buildPageTitle(
          useAuthStore.getState().dictionary.course.builder.title,
        ),
      },
    ],
  }),
  beforeLoad: async ({ location }) => {
    await ensureCreatorAccess(location.pathname);
  },
}).lazy(() =>
  import('./builder/screens/CourseCreatePage').then(
    (d) => d.courseCreateLazyRoute,
  ),
);

// The course builder is a layout route: the shell (top bar + sidebar) stays
// mounted while the creator moves between section sub-routes, so form state
// and autosave survive section navigation.
const courseBuilderEditLayoutRoute = createRoute({
  getParentRoute: () => authenticatedRoute,
  path: '/creator/courses/$courseId/edit',
  head: () => ({
    meta: [
      {
        title: buildPageTitle(
          useAuthStore.getState().dictionary.course.builder.title,
        ),
      },
    ],
  }),
  beforeLoad: async ({ location }) => {
    await ensureCreatorAccess(location.pathname);
  },
}).lazy(() =>
  import('./builder/BuilderShell').then((d) => d.builderShellLazyRoute),
);

// A bare `.../edit` URL has no section — send it to the curriculum.
const courseBuilderEditIndexRoute = createRoute({
  getParentRoute: () => courseBuilderEditLayoutRoute,
  path: '/',
  beforeLoad: ({ params }) => {
    throw redirect({
      to: '/creator/courses/$courseId/edit/curriculum',
      params: { courseId: (params as { courseId: string }).courseId },
    });
  },
});

const courseBuilderGoalsRoute = createRoute({
  getParentRoute: () => courseBuilderEditLayoutRoute,
  path: 'goals',
}).lazy(() =>
  import('./builder/screens/GoalsScreen').then((d) => d.builderGoalsLazyRoute),
);

const courseBuilderLandingRoute = createRoute({
  getParentRoute: () => courseBuilderEditLayoutRoute,
  path: 'landing-page',
}).lazy(() =>
  import('./builder/screens/LandingPageScreen').then(
    (d) => d.builderLandingLazyRoute,
  ),
);

const courseBuilderCurriculumRoute = createRoute({
  getParentRoute: () => courseBuilderEditLayoutRoute,
  path: 'curriculum',
}).lazy(() =>
  import('./builder/screens/CurriculumScreen').then(
    (d) => d.builderCurriculumLazyRoute,
  ),
);

const courseBuilderPracticeExamsRoute = createRoute({
  getParentRoute: () => courseBuilderEditLayoutRoute,
  path: 'practice-exams',
}).lazy(() =>
  import('./builder/screens/PracticeExamsScreen').then(
    (d) => d.builderPracticeExamsLazyRoute,
  ),
);

const courseBuilderFlashcardsRoute = createRoute({
  getParentRoute: () => courseBuilderEditLayoutRoute,
  path: 'flashcards',
}).lazy(() =>
  import('./builder/screens/FlashcardsScreen').then(
    (d) => d.builderFlashcardsLazyRoute,
  ),
);

const courseBuilderAiRoute = createRoute({
  getParentRoute: () => courseBuilderEditLayoutRoute,
  path: 'ai-assistant',
}).lazy(() =>
  import('./builder/screens/AiAssistantScreen').then(
    (d) => d.builderAiLazyRoute,
  ),
);

const courseBuilderSubmitRoute = createRoute({
  getParentRoute: () => courseBuilderEditLayoutRoute,
  path: 'submit',
}).lazy(() =>
  import('./builder/screens/PublishChecklistScreen').then(
    (d) => d.builderSubmitLazyRoute,
  ),
);

export const courseBuilderEditRoute = courseBuilderEditLayoutRoute.addChildren([
  courseBuilderEditIndexRoute,
  courseBuilderGoalsRoute,
  courseBuilderLandingRoute,
  courseBuilderCurriculumRoute,
  courseBuilderPracticeExamsRoute,
  courseBuilderFlashcardsRoute,
  courseBuilderAiRoute,
  courseBuilderSubmitRoute,
]);

export const courseBuilderPreviewRoute = createRoute({
  getParentRoute: () => authenticatedRoute,
  path: '/creator/courses/$courseId/preview',
  head: () => ({
    meta: [
      {
        title: buildPageTitle(
          useAuthStore.getState().dictionary.course.builder.actions.preview,
        ),
      },
    ],
  }),
  beforeLoad: async ({ location }) => {
    await ensureCreatorAccess(location.pathname);
  },
}).lazy(() =>
  import('./pages/CourseBuilderPreviewPage').then(
    (d) => d.courseBuilderPreviewLazyRoute,
  ),
);

export const courseRouter = [
  courseCatalogRoute,
  courseCompareRoute,
  courseCertificateRoute,
  courseLearnRoute,
  courseDetailRoute,
  creatorProfileRoute,
  creatorApplicationRoute,
  creatorCoursesRoute,
  courseBuilderNewRoute,
  courseBuilderEditRoute,
  courseBuilderPreviewRoute,
];
