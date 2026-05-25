import { Link, useLocation } from '@tanstack/react-router';
import {
  LuBookOpenCheck,
  LuGraduationCap,
  LuShieldCheck,
} from 'react-icons/lu';
import { useAuthStore } from '@/features/auth/authStore';
import {
  dashboardActiveView,
  dashboardPersonaClear,
  dashboardPersonaSet,
  type DashboardView,
} from '@/features/dashboard/dashboardHome';
import { cn } from '@/shared/lib/utils';
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/shared/components/ui/sidebar';

type SuperAdminViewSwitcherProps = {
  variant: 'sidebar' | 'topbar';
  onNavigate?: () => void;
};

const viewItems = [
  {
    id: 'superAdmin',
    href: '/admin',
    Icon: LuShieldCheck,
  },
  {
    id: 'student',
    href: '/student',
    Icon: LuGraduationCap,
  },
  {
    id: 'creator',
    href: '/creator',
    Icon: LuBookOpenCheck,
  },
] as const satisfies Array<{
  id: DashboardView;
  href: '/admin' | '/student' | '/creator';
  Icon: typeof LuShieldCheck;
}>;

export function SuperAdminViewSwitcher({
  variant,
  onNavigate,
}: SuperAdminViewSwitcherProps) {
  const dictionary = useAuthStore((state) => state.dictionary);
  const isPlatformAdmin = useAuthStore((state) => state.isPlatformAdmin);
  const { pathname } = useLocation();

  if (!isPlatformAdmin) {
    return null;
  }

  // Highlight the pill matching the persona the admin is in, regardless of
  // whether they're on a dashboard-scoped URL or a "shared" route.
  const activeView = dashboardActiveView({ isPlatformAdmin, pathname });

  const labels = {
    superAdmin: dictionary.dashboard.viewSwitcher.superAdmin,
    student: dictionary.dashboard.viewSwitcher.student,
    creator: dictionary.dashboard.viewSwitcher.creator,
  };

  if (variant === 'topbar') {
    return (
      <div
        aria-label={dictionary.dashboard.viewSwitcher.title}
        className="border-nexexam-soft-blue hidden shrink-0 rounded-2xl border bg-white/76 p-1 shadow-sm md:flex dark:border-white/10 dark:bg-white/8"
      >
        {viewItems.map((item) => (
          <Link
            key={item.id}
            to={item.href}
            onClick={() => handleViewClick(item.id)}
            className={cn(
              'text-nexexam-muted hover:text-nexexam-primary inline-flex h-10 items-center gap-2 rounded-xl px-3 text-sm font-extrabold transition',
              activeView === item.id &&
                'bg-nexexam-primary/10 text-nexexam-primary shadow-sm dark:bg-white/10 dark:text-white',
            )}
          >
            <item.Icon className="size-4" />
            <span>{labels[item.id]}</span>
          </Link>
        ))}
      </div>
    );
  }

  return (
    <SidebarGroup>
      <SidebarGroupLabel>
        {dictionary.dashboard.viewSwitcher.title}
      </SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {viewItems.map((item) => (
            <SidebarMenuItem key={item.id}>
              <SidebarMenuButton
                render={
                  <Link
                    to={item.href}
                    onClick={() => {
                      handleViewClick(item.id);
                      onNavigate?.();
                    }}
                  />
                }
                isActive={activeView === item.id}
                tooltip={labels[item.id]}
              >
                <item.Icon className="h-4 w-4" />
                <span>{labels[item.id]}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}

function handleViewClick(view: DashboardView) {
  if (view === 'student' || view === 'creator') {
    dashboardPersonaSet(view);
    return;
  }

  dashboardPersonaClear();
}
