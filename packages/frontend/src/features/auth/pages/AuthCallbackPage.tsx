import { authClient } from '@/features/auth/authClient';
import { useAuthStore } from '@/features/auth/authStore';
import { useNavigate, useSearch } from '@tanstack/react-router';
import { useQueryClient } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { LuLoader } from 'react-icons/lu';
import { toast } from 'sonner';

export function AuthCallbackPage() {
  const dictionary = useAuthStore((state) => state.dictionary);
  const fetchCurrentUser = useAuthStore((state) => state.fetchCurrentUser);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const search = useSearch({ from: '/auth/callback' }) as {
    redirect?: string;
    error?: string;
    error_description?: string;
  };
  const [isProcessing, setIsProcessing] = useState(true);

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Check if there's an error in the URL params (from OAuth provider)
        if (search.error) {
          const errorMessage = search.error_description || search.error;
          toast.error(dictionary.auth.signIn.oauthError);
          console.error('OAuth error:', errorMessage);
          navigate({ to: '/auth/sign-in', replace: true });
          return;
        }

        // Check if we have a valid session after OAuth callback
        const session = await authClient.getSession();

        if (!session.data?.session) {
          toast.error(dictionary.auth.signIn.oauthError);
          navigate({ to: '/auth/sign-in', replace: true });
          return;
        }

        await fetchCurrentUser();
        queryClient.invalidateQueries();

        if (search.redirect) {
          navigate({ to: search.redirect, replace: true });
        } else {
          navigate({ to: '/', replace: true });
        }
      } catch (error) {
        console.error('Auth callback error:', error);
        toast.error(dictionary.shared.errors.unknown);
        navigate({ to: '/auth/sign-in', replace: true });
      } finally {
        setIsProcessing(false);
      }
    };

    handleCallback();
  }, []);

  if (!isProcessing) {
    return null;
  }

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <LuLoader className="mx-auto mb-4 h-8 w-8 animate-spin" />
        <p className="text-muted-foreground">
          {dictionary.auth.signIn.signingIn}
        </p>
      </div>
    </div>
  );
}
