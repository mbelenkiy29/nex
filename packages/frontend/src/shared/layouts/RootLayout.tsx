import { ThemeProvider } from '@/shared/components/ThemeProvider';
import { CookieBanner } from '@/features/cookies/CookieBanner';
import { queryClient } from '@/shared/lib/queryClient';
import { QueryClientProvider } from '@tanstack/react-query';
import { HeadContent, Outlet } from '@tanstack/react-router';
import { Toaster } from 'sonner';

export function RootLayout() {
  return (
    <>
      <HeadContent />
      <QueryClientProvider client={queryClient}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <div className="bg-background relative flex min-h-screen flex-col overflow-x-hidden font-sans antialiased">
            <div className="flex-1">
              <Outlet />
            </div>
            <CookieBanner />
          </div>
        </ThemeProvider>
      </QueryClientProvider>
    </>
  );
}
