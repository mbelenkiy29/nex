import {
  createLazyRoute,
  useNavigate,
  useSearch,
} from '@tanstack/react-router';
import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '@/features/auth/authStore';
import { MemberEditForm } from '@/features/member/components/MemberEditForm';
import { PageHeader } from '@/shared/components/PageHeader';
import { apiClient } from '@/shared/lib/apiClient';
import { MemberWithRelationships } from '@project/backend/features/member/memberSchemas';
import { memberLabel } from '@project/backend/features/member/memberLabel';
import { memberEditRoute } from '@/features/member/memberRouter';
import { toast } from 'sonner';

export const memberEditLazyRoute = createLazyRoute('/member/$id/edit')({
  component: MemberEditPage,
});

export function MemberEditPage() {
  const dictionary = useAuthStore((state) => state.dictionary);
  const navigate = useNavigate();
  const { id } = memberEditRoute.useParams();
  const searchParams = useSearch({ strict: false }) as Record<string, any>;
  const referrer = searchParams.referrer as string | undefined;

  const defaultMemberSearch = {
    invitationFilter: {
      statuses: ['pending'],
    },
  };

  const query = useQuery({
    queryKey: ['member', id],
    queryFn: async ({ signal }) => {
      return await apiClient
        .get(`api/member/${id}`, { signal })
        .json<MemberWithRelationships>();
    },
    staleTime: 0,
    gcTime: 0,
    refetchOnMount: 'always',
  });

  if (query.isError) {
    toast.error(
      (query.error as any).message || dictionary.shared.errors.unknown,
    );
    if (referrer?.startsWith('/member?')) {
      navigate({ to: referrer as any });
    } else {
      navigate({ to: '/member', search: defaultMemberSearch });
    }
    return null;
  }

  if (!query.data) {
    return null;
  }

  const member = query.data;
  const memberListPath = referrer?.startsWith('/member?')
    ? referrer
    : '/member';

  return (
    <div className="flex flex-1 flex-col p-6">
      <PageHeader
        items={[
          [
            dictionary.member.list.menu,
            memberListPath,
            !referrer?.startsWith('/member?') ? defaultMemberSearch : undefined,
          ],
          [
            memberLabel(member),
            `/member/${member?.id}${referrer ? `?referrer=${encodeURIComponent(referrer)}` : ''}`,
          ],
          [dictionary.member.edit.menu],
        ]}
      />
      <div className="my-10">
        <MemberEditForm
          member={member}
          onSuccess={(member: MemberWithRelationships) =>
            navigate({
              to: `/member/${member.id}`,
              search: referrer ? { referrer } : undefined,
            })
          }
          onCancel={() =>
            referrer?.startsWith('/member?')
              ? navigate({ to: referrer as any })
              : navigate({ to: '/member', search: defaultMemberSearch })
          }
        />
      </div>
    </div>
  );
}
