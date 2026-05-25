import { useMutation } from '@tanstack/react-query';
import { useEffect } from 'react';
import { toast } from 'sonner';
import { useAuthStore } from '@/features/auth/authStore';
import { useRouter } from '@tanstack/react-router';

export function SignOut() {
  const dictionary = useAuthStore((state) => state.dictionary);
  const signOut = useAuthStore((state) => state.signOut);
  const router = useRouter();

  const signOutMutation = useMutation({
    mutationFn: async () => {
      await signOut();
    },
    onSuccess: async () => {
      await router.invalidate();
      router.navigate({ to: '/' });
    },
    onError: (error: any) => {
      toast.error(error.message || dictionary.shared.errors.unknown);
    },
  });

  useEffect(() => {
    signOutMutation.mutateAsync();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="mt-4 flex flex-col items-center">
      <p className="text-center text-neutral-600 dark:text-neutral-300">
        {dictionary.auth.signOut.loading}
      </p>
    </div>
  );
}
