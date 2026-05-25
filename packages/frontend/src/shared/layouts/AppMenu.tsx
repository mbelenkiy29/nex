import { Link, useLocation } from '@tanstack/react-router';
import { LuPlus } from 'react-icons/lu';
import { menus } from '@/features/menus';
import type { AppMenuItem } from '@/features/menus';
import { useAuthStore } from '@/features/auth/authStore';
import { dashboardActiveView } from '@/features/dashboard/dashboardHome';
import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuAction,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from '@/shared/components/ui/sidebar';

export function AppMenu({ onMenuClick }: { onMenuClick?: () => void }) {
  const { pathname } = useLocation();
  const dictionary = useAuthStore((state) => state.dictionary);
  const hasPermission = useAuthStore((state) => state.hasPermission);
  const isPlatformAdmin = useAuthStore((state) => state.isPlatformAdmin);
  const isCreator = useAuthStore((state) => state.isCreator);
  // `activeView` honors the persona admins picked even on "shared" URLs like
  // /course or /auth/profile. Before, the menu reverted to admin every time
  // the URL wasn't a /student* or /creator* path.
  const activeView = dashboardActiveView({ isPlatformAdmin, pathname });
  const shouldUseAdminMenu =
    isPlatformAdmin && activeView === 'superAdmin';
  // Non-admins see the nav for their real role; a platform admin using the
  // view switcher sees the nav for whichever persona they switched into.
  const menuIsCreator = isPlatformAdmin
    ? activeView === 'creator'
    : isCreator;

  return (
    <SidebarGroup>
      <SidebarMenu>
        {menus(dictionary, hasPermission, {
          isPlatformAdmin: shouldUseAdminMenu,
          isCreator: menuIsCreator,
        }).map((menu) => (
          <SidebarMenuItem key={menu.id}>
            <SidebarMenuButton
              render={
                <Link
                  to={menu.href}
                  search={menu.search}
                  onClick={onMenuClick}
                />
              }
              isActive={isMenuActive(menu, pathname)}
              tooltip={menu.label}
            >
              <menu.Icon className="h-4 w-4" />
              <span>{menu.label}</span>
            </SidebarMenuButton>
            {menu.createHref && (
              <SidebarMenuAction
                render={
                  <Link
                    title={dictionary.shared.new}
                    to={menu.createHref}
                    onClick={onMenuClick}
                  />
                }
                showOnHover
              >
                <LuPlus className="h-3 w-3" />
                <span className="sr-only">{dictionary.shared.new}</span>
              </SidebarMenuAction>
            )}
            {menu.children?.length ? (
              <SidebarMenuSub>
                {menu.children.map((child) => (
                  <SidebarMenuSubItem
                    key={child.id}
                    className="group/menu-item"
                  >
                    <SidebarMenuSubButton
                      render={
                        <Link
                          to={child.href}
                          search={child.search}
                          onClick={onMenuClick}
                        />
                      }
                      isActive={isActive(child.href, pathname, child.isExact)}
                      className={
                        child.createHref ? 'peer/menu-button pr-7' : ''
                      }
                    >
                      <child.Icon className="h-4 w-4" />
                      <span>{child.label}</span>
                    </SidebarMenuSubButton>
                    {child.createHref && (
                      <SidebarMenuAction
                        render={
                          <Link
                            title={dictionary.shared.new}
                            to={child.createHref}
                            onClick={onMenuClick}
                          />
                        }
                        showOnHover
                      >
                        <LuPlus className="h-3 w-3" />
                        <span className="sr-only">{dictionary.shared.new}</span>
                      </SidebarMenuAction>
                    )}
                  </SidebarMenuSubItem>
                ))}
              </SidebarMenuSub>
            ) : null}
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}

function isActive(path: string, currentPath: string, isExact?: boolean) {
  if (isExact) {
    return currentPath === path;
  }

  return currentPath === path || currentPath.startsWith(path + '/');
}

function isMenuActive(menu: AppMenuItem, pathname: string) {
  return (
    isActive(menu.href, pathname, menu.isExact) ||
    hasActiveChild(menu, pathname)
  );
}

function hasActiveChild(menu: AppMenuItem, pathname: string) {
  return Boolean(
    menu.children?.some((child) =>
      isActive(child.href, pathname, child.isExact),
    ),
  );
}
