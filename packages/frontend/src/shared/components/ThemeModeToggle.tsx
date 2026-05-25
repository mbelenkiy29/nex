'use client';

import { useTheme } from 'next-themes';
import { LuLaptop, LuMoon, LuSunMedium } from 'react-icons/lu';
import { Button } from '@/shared/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/shared/components/ui/dropdown-menu';
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/shared/components/ui/sidebar';
import { useAuthStore } from '@/features/auth/authStore';

export function ThemeModeToggle({ isSidebar }: { isSidebar?: boolean }) {
  const { setTheme } = useTheme();
  const dictionary = useAuthStore((state) => state.dictionary);

  if (isSidebar) {
    return (
      <SidebarMenu>
        <SidebarMenuItem>
          <DropdownMenu>
            <DropdownMenuTrigger render={<SidebarMenuButton />}>
              <LuSunMedium className="h-4 w-4 dark:hidden" />
              <LuMoon className="hidden h-4 w-4 dark:inline" />
              <span>{dictionary?.shared?.theme?.toggle || 'Toggle theme'}</span>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setTheme('light')}>
                <LuSunMedium className="mr-2 h-4 w-4" />
                <span>{dictionary?.shared?.theme?.light || 'Light'}</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme('dark')}>
                <LuMoon className="mr-2 h-4 w-4" />
                <span>{dictionary?.shared?.theme?.dark || 'Dark'}</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme('system')}>
                <LuLaptop className="mr-2 h-4 w-4" />
                <span>{dictionary?.shared?.theme?.system || 'System'}</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarMenuItem>
      </SidebarMenu>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={<Button variant="ghost" size="sm" className="w-9 p-0 px-1" />}
      >
        <LuSunMedium className="text-muted-foreground h-4 w-4 dark:hidden" />
        <LuMoon className="text-muted-foreground hidden h-4 w-4 dark:inline" />
        <span className="sr-only">
          {dictionary?.shared?.theme?.toggle || 'Toggle theme'}
        </span>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setTheme('light')}>
          <LuSunMedium className="mr-2 h-4 w-4" />
          <span>{dictionary?.shared?.theme?.light || 'Light'}</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme('dark')}>
          <LuMoon className="mr-2 h-4 w-4" />
          <span>{dictionary?.shared?.theme?.dark || 'Dark'}</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme('system')}>
          <LuLaptop className="mr-2 h-4 w-4" />
          <span>{dictionary?.shared?.theme?.system || 'System'}</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
