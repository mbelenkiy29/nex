import { useAuthStore } from '@/features/auth/authStore';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useRouter } from '@tanstack/react-router';

export function SignOutButton({
  text,
  disabled,
  className,
}: {
  className: string;
  text: string;
  disabled?: boolean;
}) {
  const signOut = useAuthStore((state) => state.signOut);
  const dictionary = useAuthStore((state) => state.dictionary);
  const router = useRouter();

  const signOutMutation = useMutation({
    mutationFn: async () => {
      await signOut();
    },
    onSuccess: async () => {
      await router.invalidate();
      router.navigate({ to: '/' });
    },
    onError: (error: Error) => {
      toast.error(error.message || dictionary.shared.errors.unknown);
    },
  });

  return (
    <button
      onClick={() => signOutMutation.mutateAsync()}
      className={className}
      disabled={disabled || signOutMutation.isPending}
    >
      {text}
    </button>
  );
}
