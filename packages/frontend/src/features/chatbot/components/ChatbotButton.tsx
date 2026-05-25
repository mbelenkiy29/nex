import { Link } from '@tanstack/react-router';
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/shared/components/ui/sidebar';
import { useAuthStore } from '@/features/auth/authStore';
import { LuSparkles } from 'react-icons/lu';
import { useShallow } from 'zustand/react/shallow';

// Sidebar entry for the AI Tutor. Routes to the full-page experience at
// `/student/ai-tutor`. The legacy `ChatbotSheet` modal is no longer mounted
// in any live surface (CourseLearnPage was rewired to navigate to the new
// page too); the Sheet component file stays as v2 will repurpose it.
export function ChatbotButton({ isSidebar }: { isSidebar?: boolean }) {
  const { dictionary, hasPermission, config } = useAuthStore(
    useShallow((state) => ({
      dictionary: state.dictionary,
      hasPermission: state.hasPermission,
      config: state.config,
    })),
  );

  if (!config?.isChatbotEnabled) {
    return null;
  }

  const hasChatbotPermission = hasPermission({
    chatbot: ['use'],
  });

  if (!hasChatbotPermission) {
    return null;
  }

  if (isSidebar) {
    return (
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton
            render={<Link to="/student/ai-tutor" />}
            tooltip={dictionary.aiTutor.title}
          >
            <LuSparkles className="h-4 w-4" />
            <span className="truncate">{dictionary.aiTutor.title}</span>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    );
  }

  // Non-sidebar version (if needed in the future)
  return (
    <Link
      to="/student/ai-tutor"
      className="flex items-center gap-2 text-sm"
    >
      <LuSparkles className="h-4 w-4" />
      <span>{dictionary.aiTutor.title}</span>
    </Link>
  );
}
