import { createRoute } from '@tanstack/react-router';
import { authenticatedRoute } from '@/features/auth/authRouter';
import { useAuthStore } from '@/features/auth/authStore';
import { authGuardFrontend } from '@/features/auth/authGuardFrontend';
import { buildPageTitle } from '@/shared/lib/buildPageTitle';
import { AiTutorLandingPage } from './pages/AiTutorLandingPage';
import { AiTutorPage } from './pages/AiTutorPage';

export const aiTutorIndexRoute = createRoute({
  getParentRoute: () => authenticatedRoute,
  path: '/student/ai-tutor',
  component: AiTutorLandingPage,
  head: () => ({
    meta: [
      {
        title: buildPageTitle(
          useAuthStore.getState().dictionary.aiTutor.title,
        ),
      },
    ],
  }),
  beforeLoad: async ({ location }) => {
    const { currentUser, currentMember } = useAuthStore.getState();
    authGuardFrontend(
      { currentUser, currentMember },
      { chatbot: ['use'] },
      location.pathname,
    );
  },
});

export const aiTutorConversationRoute = createRoute({
  getParentRoute: () => authenticatedRoute,
  path: '/student/ai-tutor/$conversationId',
  component: AiTutorPage,
  head: () => ({
    meta: [
      {
        title: buildPageTitle(
          useAuthStore.getState().dictionary.aiTutor.title,
        ),
      },
    ],
  }),
  beforeLoad: async ({ location }) => {
    const { currentUser, currentMember } = useAuthStore.getState();
    authGuardFrontend(
      { currentUser, currentMember },
      { chatbot: ['use'] },
      location.pathname,
    );
  },
});

export const aiTutorRouter = [aiTutorIndexRoute, aiTutorConversationRoute];
