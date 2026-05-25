import { Link, useLocation } from '@tanstack/react-router';
import { LuLogIn, LuUserPlus } from 'react-icons/lu';
import { dashboardActiveView } from '@/features/dashboard/dashboardHome';
import { AppMenu } from '@/shared/layouts/AppMenu';
import { AppUserNav } from '@/shared/layouts/AppUserNav';
import { SuperAdminViewSwitcher } from '@/shared/layouts/SuperAdminViewSwitcher';
import { ThemeModeToggle } from '@/shared/components/ThemeModeToggle';
import { LanguageSwitcher } from '@/shared/components/LanguageSwitcher';
import { ChatbotButton } from '@/features/chatbot/components/ChatbotButton';
import { NotificationButton } from '@/features/notification/components/NotificationButton';
import { featureIcons } from '@/features/featureIcons';
import { BrandMark } from '@/shared/components/BrandMark';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  useSidebar,
} from '@/shared/components/ui/sidebar';
import { useAuthStore } from '@/features/auth/authStore';

export function AppSidebar() {
  const currentUser = useAuthStore((state) => state.currentUser);
  const dictionary = useAuthStore((state) => state.dictionary);
  const hasPermission = useAuthStore((state) => state.hasPermission);
  const isPlatformAdmin = useAuthStore((state) => state.isPlatformAdmin);
  const { setOpenMobile } = useSidebar();
  const { pathname } = useLocation();
  const AuditLogIcon = featureIcons.auditLog;
  const activeView = dashboardActiveView({ isPlatformAdmin, pathname });
  const shouldShowAdminFooterLinks =
    isPlatformAdmin && activeView === 'superAdmin';

  const closeMobileSidebar = () => setOpenMobile(false);

  return (
    <Sidebar
      collapsible="icon"
      className="dark:bg-nexexam-surface border-r border-white/70 bg-white/72 backdrop-blur-xl dark:border-white/10"
    >
      <SidebarHeader>
        <div className="px-2 py-3">
          <BrandMark label={dictionary.projectName} />
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SuperAdminViewSwitcher
          variant="sidebar"
          onNavigate={closeMobileSidebar}
        />
        <AppMenu onMenuClick={closeMobileSidebar} />
      </SidebarContent>
      <SidebarFooter>
        <div className="space-y-1">
          <ChatbotButton isSidebar />
          {currentUser && <NotificationButton isSidebar />}
          {shouldShowAdminFooterLinks &&
            hasPermission({ auditLog: ['read'] }) && (
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    render={
                      <Link to="/audit-log" onClick={closeMobileSidebar} />
                    }
                    tooltip={dictionary.auditLog.list.menu}
                  >
                    <AuditLogIcon className="h-4 w-4" />
                    <span>{dictionary.auditLog.list.menu}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            )}
          <LanguageSwitcher isSidebar />
          <ThemeModeToggle isSidebar />
          {currentUser ? (
            <AppUserNav isSidebar />
          ) : (
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  render={
                    <Link to="/auth/sign-in" onClick={closeMobileSidebar} />
                  }
                  tooltip={dictionary.auth.signIn.menu}
                >
                  <LuLogIn className="h-4 w-4" />
                  <span>{dictionary.auth.signIn.menu}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  render={
                    <Link
                      to="/auth/student-sign-up"
                      onClick={closeMobileSidebar}
                    />
                  }
                  tooltip={dictionary.auth.signUp.studentMenu}
                >
                  <LuUserPlus className="h-4 w-4" />
                  <span>{dictionary.auth.signUp.studentMenu}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  render={
                    <Link
                      to="/auth/creator-sign-up"
                      onClick={closeMobileSidebar}
                    />
                  }
                  tooltip={dictionary.auth.signUp.creatorMenu}
                >
                  <LuUserPlus className="h-4 w-4" />
                  <span>{dictionary.auth.signUp.creatorMenu}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          )}
        </div>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
