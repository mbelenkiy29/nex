import { apiDocsRouter } from '@/features/apiDocs/apiDocsRouter';
import { apiKeyRouter } from '@/features/apiKey/apiKeyRouter';
import { mcpRouter } from '@/features/mcp/mcpRouter';
import { auditLogRouter } from '@/features/auditLog/auditLogRouter';
import {
  authenticatedRoute,
  authAuthenticatedRouter,
  authRouter,
} from '@/features/auth/authRouter';
import { examRouter } from '@/features/exam/examRouter';
import { chapterRouter } from '@/features/chapter/chapterRouter';
import { lessonRouter } from '@/features/lesson/lessonRouter';
import { practiceQuestionRouter } from '@/features/practiceQuestion/practiceQuestionRouter';
import { conceptRouter } from '@/features/concept/conceptRouter';
import { examTypeRouter } from '@/features/examType/examTypeRouter';
import { examInstanceRouter } from '@/features/examInstance/examInstanceRouter';
import { dailyGoalRouter } from '@/features/dailyGoal/dailyGoalRouter';
import { studyNoteRouter } from '@/features/studyNote/studyNoteRouter';
import { documentUploadRouter } from '@/features/documentUpload/documentUploadRouter';
import { dashboardRouter } from '@/features/dashboard/dashboardRouter';
import { memberRouter } from '@/features/member/memberRouter';
import { notificationRouter } from '@/features/notification/notificationRouter';
import { organizationRouter } from '@/features/organization/organizationRouter';
import { subscriptionRouter } from '@/features/subscription/subscriptionRouter';
import { platformAdminRouter } from '@/features/platformAdmin/platformAdminRouter';
import { courseRouter } from '@/features/course/courseRouter';
import { oneOnOneCallRouter } from '@/features/oneOnOneCall/oneOnOneCallRouter';
import { creatorEarningsRouter } from '@/features/creatorEarnings/creatorEarningsRouter';
import { studentExperienceRouter } from '@/features/studentExperience/studentExperienceRouter';
import { aiTutorRouter } from '@/features/aiTutor/aiTutorRouter';
import { legalRouter } from '@/features/legal/legalRouter';
import {
  userAccountAuthenticatedRouter,
  userAccountPublicRouter,
} from '@/features/userAccount/userAccountRouter';
import { AppSkeletonLoader } from '@/shared/components/AppSkeletonLoader';
import { RootLayout } from '@/shared/layouts/RootLayout';
import { buildPageTitle } from '@/shared/lib/buildPageTitle';
import { QueryClient } from '@tanstack/react-query';
import { createRootRoute, createRouter } from '@tanstack/react-router';

export const rootRoute = createRootRoute({
  component: RootLayout,
  head: () => ({
    meta: [
      {
        title: buildPageTitle(),
      },
    ],
  }),
});

const queryClient = new QueryClient();

const routeTree = rootRoute.addChildren([
  ...authRouter,
  ...legalRouter,
  ...userAccountPublicRouter,
  authenticatedRoute.addChildren([
    ...userAccountAuthenticatedRouter,
    ...dashboardRouter,
    ...studentExperienceRouter,
    ...courseRouter,
    ...oneOnOneCallRouter,
    ...creatorEarningsRouter,
    ...aiTutorRouter,
    ...authAuthenticatedRouter,
    ...apiDocsRouter,
    ...mcpRouter,
    ...apiKeyRouter,
    ...auditLogRouter,
    ...examRouter,
    ...chapterRouter,
    ...lessonRouter,
    ...practiceQuestionRouter,
    ...conceptRouter,
    ...examTypeRouter,
    ...examInstanceRouter,
    ...dailyGoalRouter,
    ...studyNoteRouter,
    ...documentUploadRouter,
    ...memberRouter,
    ...notificationRouter,
    ...subscriptionRouter,
    ...platformAdminRouter,
    ...organizationRouter,
  ]),
]);

export const router = createRouter({
  routeTree,
  context: { queryClient },
  defaultPreload: 'intent',
  defaultPendingComponent: AppSkeletonLoader,
});
