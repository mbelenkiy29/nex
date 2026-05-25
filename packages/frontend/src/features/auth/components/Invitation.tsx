import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate, useSearch } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { SignOutButton } from '@/features/auth/components/SignOutButton';
import { useAuthStore } from '@/features/auth/authStore';
import { apiClient } from '@/shared/lib/apiClient';
import { getRedirectPath } from '@/shared/lib/getRedirectPath';

export function Invitation() {
  const dictionary = useAuthStore((state) => state.dictionary);
  const currentUser = useAuthStore((state) => state.currentUser);
  const fetchCurrentUser = useAuthStore((state) => state.fetchCurrentUser);
  const navigate = useNavigate();
  const [warningMessage, setWarningMessage] = useState<string>();
  const searchParams = useSearch({ strict: false }) as Record<string, any>;
  const token = searchParams.token;
  const redirect = searchParams.redirect;
  const queryClient = useQueryClient();

  useEffect(() => {
    if (token) {
      invitationMutation.mutateAsync({ token });
    } else {
      navigate({ to: '/' });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const invitationMutation = useMutation({
    mutationFn: async ({ token }: { token: string }) => {
      // Accept invitation using backend API (also sets organization as active)
      const result = await apiClient
        .post(`api/member/invitation/${token}/accept`)
        .json<any>();

      return result;
    },

    onSuccess: async () => {
      queryClient.invalidateQueries({
        queryKey: ['member'],
      });
      setWarningMessage('');
      await fetchCurrentUser();
      const validRedirect = getRedirectPath(redirect);
      navigate({ to: validRedirect });
    },
  });

  return (
    <div className="mb-4 flex flex-col items-center">
      {!invitationMutation.isSuccess && !invitationMutation.isError && (
        <p className="text-center text-neutral-600 dark:text-neutral-300">
          {dictionary.auth.invitation.loadingMessage}
        </p>
      )}

      {!invitationMutation.isPending && Boolean(warningMessage) && (
        <>
          <p className="mb-4 text-center font-medium text-neutral-800 dark:text-neutral-200">
            {warningMessage}
          </p>
        </>
      )}

      {invitationMutation.isError && (
        <div className="text-center">
          <p className="mb-2 text-red-600 dark:text-red-300">
            {dictionary.auth.invitation.invalidToken}
          </p>
        </div>
      )}

      {invitationMutation.isSuccess && !warningMessage && (
        <p className="text-center text-neutral-600 dark:text-neutral-300">
          {dictionary.auth.invitation.success}
        </p>
      )}

      {currentUser && (
        <SignOutButton
          className="mt-8 block text-center text-sm font-medium text-neutral-800 hover:underline dark:text-neutral-200"
          text={dictionary.auth.signOut.button}
        />
      )}
    </div>
  );
}
