import { cn } from '@/shared/lib/utils';
import { useAuthStore } from '@/features/auth/authStore';
import { Loader2Icon } from 'lucide-react';

function Spinner({ className, ...props }: React.ComponentProps<'svg'>) {
  const dictionary = useAuthStore((state) => state.dictionary);
  return (
    <Loader2Icon
      role="status"
      aria-label={dictionary.shared.loading}
      className={cn('size-4 animate-spin', className)}
      {...props}
    />
  );
}

export { Spinner };
