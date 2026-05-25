import { OrganizationNewForm } from '@/features/auth/components/OrganizationNewForm';
import { OrganizationSelect } from '@/features/auth/components/OrganizationSelect';
import { Button } from '@/shared/components/ui/button';
import { useAuthStore } from '@/features/auth/authStore';
import { useState, useEffect } from 'react';
import { useSearch } from '@tanstack/react-router';
import { useShallow } from 'zustand/react/shallow';
import { apiClient } from '@/shared/lib/apiClient';
import { useQuery } from '@tanstack/react-query';
import { Spinner } from '@/shared/components/ui/spinner';

export function Organization() {
  const { dictionary, currentUser, locale } = useAuthStore(
    useShallow((state) => ({
      dictionary: state.dictionary,
      currentUser: state.currentUser,
      locale: state.locale,
    })),
  );

  const search = useSearch({ from: '/auth/organization' }) as {
    redirect?: string;
  };

  // Fetch pending invitations with organization names from backend
  const invitationsQuery = useQuery({
    queryKey: ['invitations', 'my'],
    queryFn: async ({ signal }) => {
      const response = await apiClient
        .get('api/member/invitation/my', { signal })
        .json<{ invitations: Array<any> }>();
      return response.invitations || [];
    },
  });

  const members = currentUser?.members;
  const invitations = invitationsQuery.data || [];

  const activeMembers = members?.filter((member) => !member.disabled) || [];

  // Show select mode if user has active members OR pending invitations
  const [mode, setMode] = useState(
    activeMembers.length || invitations.length ? 'select' : 'new',
  );

  useEffect(() => {
    if (
      invitationsQuery.data &&
      invitations.length > 0 &&
      !activeMembers.length &&
      mode === 'new'
    ) {
      setMode('select');
    }
  }, [invitationsQuery.data, invitations.length, activeMembers.length, mode]);

  if (!dictionary) {
    return null;
  }

  if (!invitationsQuery.isSuccess) {
    return (
      <div className="flex items-center justify-center py-8">
        <Spinner />
      </div>
    );
  }

  const hasOrganizationsOrInvitations =
    activeMembers.length + invitations.length > 0;

  return (
    <>
      {mode === 'new' ? (
        <>
          <OrganizationNewForm locale={locale} redirect={search.redirect} />
          {hasOrganizationsOrInvitations ? (
            <Button
              onClick={() => setMode('select')}
              className="mt-2 w-full"
              variant={'secondary'}
            >
              {dictionary.auth.organization.select.select}
            </Button>
          ) : null}
        </>
      ) : (
        <>
          <OrganizationSelect
            members={activeMembers}
            invitations={invitations}
            locale={locale}
            redirect={search.redirect}
            onNoOptionsAvailable={() => setMode('new')}
          />
          <Button
            onClick={() => setMode('new')}
            className="mt-2 w-full"
            variant={'secondary'}
          >
            {dictionary.auth.organization.create.button}
          </Button>
        </>
      )}
    </>
  );
}
