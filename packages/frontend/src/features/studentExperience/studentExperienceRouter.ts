import { createRoute, redirect } from '@tanstack/react-router';
import { buildPageTitle } from '@/shared/lib/buildPageTitle';
import { authenticatedRoute } from '@/features/auth/authRouter';
import { authGuardFrontend } from '@/features/auth/authGuardFrontend';
import { useAuthStore } from '@/features/auth/authStore';
import { dashboardPersonaSet } from '@/features/dashboard/dashboardHome';

function studentBeforeLoad(pathname: string) {
  const { currentUser, currentMember, isPlatformAdmin, isCreator } =
    useAuthStore.getState();
  authGuardFrontend(
    { currentUser, currentMember },
    { course: ['read'] },
    pathname,
  );

  // Teachers (users with a creator application) cannot view the student
  // experience; send them to their own dashboard instead.
  if (!isPlatformAdmin && isCreator) {
    throw redirect({ to: '/creator' });
  }

  dashboardPersonaSet('student');
}

export const studentMyCoursesRoute = createRoute({
  getParentRoute: () => authenticatedRoute,
  path: '/student/my-courses',
  head: () => ({
    meta: [
      {
        title: buildPageTitle(
          useAuthStore.getState().dictionary.studentExperience.menu.myCourses,
        ),
      },
    ],
  }),
  beforeLoad: async ({ location }) => studentBeforeLoad(location.pathname),
}).lazy(() =>
  import('./pages/StudentDashboardPage').then(
    (d) => d.studentMyCoursesLazyRoute,
  ),
);

export const studentPracticeHomeRoute = createRoute({
  getParentRoute: () => authenticatedRoute,
  path: '/student/practice',
  head: () => ({
    meta: [
      {
        title: buildPageTitle(
          useAuthStore.getState().dictionary.studentExperience.menu.practice,
        ),
      },
    ],
  }),
  beforeLoad: async ({ location }) => studentBeforeLoad(location.pathname),
}).lazy(() =>
  import('./pages/StudentDashboardPage').then(
    (d) => d.studentPracticeHomeLazyRoute,
  ),
);

export const studentNotesHomeRoute = createRoute({
  getParentRoute: () => authenticatedRoute,
  path: '/student/notes',
  head: () => ({
    meta: [
      {
        title: buildPageTitle(
          useAuthStore.getState().dictionary.studentExperience.menu
            .notesStudyPlan,
        ),
      },
    ],
  }),
  beforeLoad: async ({ location }) => studentBeforeLoad(location.pathname),
}).lazy(() =>
  import('./pages/StudentDashboardPage').then(
    (d) => d.studentNotesHomeLazyRoute,
  ),
);

export const studentMasteryMapRoute = createRoute({
  getParentRoute: () => authenticatedRoute,
  path: '/student/mastery-map',
  head: () => ({
    meta: [
      {
        title: buildPageTitle(
          useAuthStore.getState().dictionary.studentExperience.menu.masteryMap,
        ),
      },
    ],
  }),
  beforeLoad: async ({ location }) => studentBeforeLoad(location.pathname),
}).lazy(() =>
  import('./pages/StudentMasteryMapPage').then(
    (d) => d.studentMasteryMapLazyRoute,
  ),
);

export const studentCourseOverviewRoute = createRoute({
  getParentRoute: () => authenticatedRoute,
  path: '/student/course/$courseId',
  head: () => ({
    meta: [
      {
        title: buildPageTitle(
          useAuthStore.getState().dictionary.studentExperience.menu
            .courseOverview,
        ),
      },
    ],
  }),
  beforeLoad: async ({ location }) => studentBeforeLoad(location.pathname),
}).lazy(() =>
  import('./pages/StudentCourseOverviewPage').then(
    (d) => d.studentCourseOverviewLazyRoute,
  ),
);

export const studentCoursePracticeRoute = createRoute({
  getParentRoute: () => authenticatedRoute,
  path: '/student/course/$courseId/practice',
  head: () => ({
    meta: [
      {
        title: buildPageTitle(
          useAuthStore.getState().dictionary.studentExperience.menu.practice,
        ),
      },
    ],
  }),
  beforeLoad: async ({ location }) => studentBeforeLoad(location.pathname),
}).lazy(() =>
  import('./pages/StudentPracticePage').then(
    (d) => d.studentCoursePracticeLazyRoute,
  ),
);

export const studentExperienceRouter = [
  studentMyCoursesRoute,
  studentPracticeHomeRoute,
  studentNotesHomeRoute,
  studentMasteryMapRoute,
  studentCoursePracticeRoute,
  studentCourseOverviewRoute,
];
