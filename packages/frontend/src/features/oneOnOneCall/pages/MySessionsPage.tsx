import { useEffect } from 'react';
import {
  createLazyRoute,
  useNavigate,
  useSearch,
} from '@tanstack/react-router';
import { toast } from 'sonner';
import { useAuthStore } from '@/features/auth/authStore';
import { MySessionsList } from '../MySessionsList';

/**
 * Student-facing list of upcoming/past 1:1 sessions. Routed at `/sessions`.
 * Toggle the "As instructor" tab to see the sessions you teach.
 */
export function MySessionsPage() {
  const dictionary = useAuthStore((state) => state.dictionary);
  const navigate = useNavigate();
  const search = useSearch({ strict: false }) as {
    payment?: 'success' | 'cancelled';
  };

  useEffect(() => {
    if (!search.payment) {
      return;
    }

    if (search.payment === 'success') {
      toast.success(dictionary.checkoutTrust.sessionPaymentSuccess);
    } else {
      toast.info(dictionary.checkoutTrust.checkoutCancelled);
    }

    navigate({ to: '/sessions', search: {}, replace: true });
  }, [dictionary, navigate, search.payment]);

  return (
    <div className="mx-auto w-full max-w-3xl p-5">
      <MySessionsList />
    </div>
  );
}

export const mySessionsLazyRoute = createLazyRoute('/sessions')({
  component: MySessionsPage,
});
