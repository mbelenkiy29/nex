import { SidebarInset, SidebarProvider } from '@/shared/components/ui/sidebar';
import { PlatformPromotionDisplay } from '@/features/platformPromotion/components/PlatformPromotionDisplay';
import { AppSidebar } from '@/shared/layouts/AppSidebar';
import { AppTopbar } from '@/shared/layouts/AppTopbar';
import { Outlet } from '@tanstack/react-router';

export function AppLayout() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="min-w-0 overflow-x-hidden bg-transparent">
        <AppTopbar />
        <PlatformPromotionDisplay />
        <main className="min-h-[calc(100svh-73px)]">
          <Outlet />
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
