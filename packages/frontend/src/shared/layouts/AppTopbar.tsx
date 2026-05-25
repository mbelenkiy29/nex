import { LuBell, LuSearch } from 'react-icons/lu';
import { useAuthStore } from '@/features/auth/authStore';
import { SuperAdminViewSwitcher } from '@/shared/layouts/SuperAdminViewSwitcher';
import { SidebarTrigger } from '@/shared/components/ui/sidebar';

export function AppTopbar() {
  const dictionary = useAuthStore((state) => state.dictionary);

  return (
    <header className="dark:bg-nexexam-surface sticky top-0 z-20 border-b border-white/60 bg-white/76 px-4 py-3 shadow-[0_10px_30px_rgb(15_23_42/0.04)] backdrop-blur-xl lg:px-7 dark:border-white/10">
      <div className="flex items-center gap-3">
        <SidebarTrigger className="md:hidden" />
        <label className="relative min-w-0 flex-1 md:max-w-xl">
          <span className="sr-only">{dictionary.dashboard.searchLabel}</span>
          <LuSearch className="text-muted-foreground pointer-events-none absolute top-1/2 left-4 size-5 -translate-y-1/2" />
          <input
            className="nex-focus-ring bg-nexexam-soft h-12 w-full rounded-2xl border border-transparent pr-4 pl-12 text-sm transition outline-none focus:bg-white dark:bg-white/8 dark:focus:bg-white/10"
            placeholder={dictionary.dashboard.searchPlaceholder}
            type="search"
          />
        </label>
        <button
          className="nex-icon-button hover:text-primary text-nexexam-muted relative size-11 shrink-0 bg-white/80 shadow-sm transition hover:shadow-md dark:border-white/10 dark:bg-white/8 dark:text-white"
          type="button"
          aria-label={dictionary.dashboard.notifications}
        >
          <LuBell className="size-5" />
          <span className="bg-primary dark:ring-nexexam-surface absolute top-2.5 right-2.5 size-2.5 rounded-full ring-2 ring-white" />
        </button>
        {/* The canonical user profile control lives in the sidebar
            (AppUserNav isSidebar) — having a second one here was redundant. */}
        <SuperAdminViewSwitcher variant="topbar" />
      </div>
    </header>
  );
}
