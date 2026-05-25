import { RouterProvider } from '@tanstack/react-router';
import { ThemeProvider } from 'next-themes';
import { Toaster } from 'sonner';
import { router } from './features/router';
import { useAuthStore } from '@/features/auth/authStore';
import { AppSkeletonLoader } from '@/shared/components/AppSkeletonLoader';

export function App() {
  // Auth state is no longer persisted to localStorage, so the router (and its
  // route guards) must not mount until `init()` has loaded the current user.
  // Otherwise a logged-in user would be briefly treated as logged out on
  // reload and bounced to the sign-in page.
  const isInitialized = useAuthStore((state) => state.isInitialized);

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      {isInitialized ? (
        <RouterProvider router={router} />
      ) : (
        <AppSkeletonLoader />
      )}
      <Toaster closeButton />
    </ThemeProvider>
  );
}
