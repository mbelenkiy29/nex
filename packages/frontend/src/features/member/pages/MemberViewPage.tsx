import { useQuery, useQueryClient } from '@tanstack/react-query';
import {
  createLazyRoute,
  useNavigate,
  useSearch,
} from '@tanstack/react-router';
import { MemberActions } from '@/features/member/components/MemberActions';
import { MemberLink } from '@/features/member/components/MemberLink';
import { memberLabel } from '@project/backend/features/member/memberLabel';
import { MemberWithRelationships } from '@project/backend/features/member/memberSchemas';
import { PageHeader } from '@/shared/components/PageHeader';
import { CopyToClipboardButton } from '@/shared/components/CopyToClipboardButton';
import { toast } from 'sonner';
import { useAuthStore } from '@/features/auth/authStore';
import { dictionaryEnumerator } from '@project/backend/translation/dictionaryEnumerator';
import { ImagesGallery } from '@/features/file/components';
import { formatDateTime } from '@project/backend/shared/lib/formatDateTime';
import { apiClient } from '@/shared/lib/apiClient';
import { memberViewRoute } from '@/features/member/memberRouter';

export const memberViewLazyRoute = createLazyRoute('/member/$id')({
  component: MemberViewPage,
});

export function MemberViewPage() {
  const { id } = memberViewRoute.useParams();
  const searchParams = useSearch({ strict: false }) as Record<string, any>;
  const referrer = searchParams.referrer as string | undefined;
  const dictionary = useAuthStore((state) => state.dictionary);
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const query = useQuery({
    queryKey: ['member', id],
    queryFn: async ({ signal }) => {
      return await apiClient
        .get(`api/member/${id}`, { signal })
        .json<MemberWithRelationships>();
    },
    initialData: () =>
      (
        queryClient.getQueryData(['member']) as Array<MemberWithRelationships>
      )?.find((d) => d.id === id),
  });

  const member = query.data;

  const defaultMemberSearch = {
    invitationFilter: {
      statuses: ['pending'],
    },
  };

  if (query.isSuccess && !member) {
    if (referrer?.startsWith('/member?')) {
      navigate({ to: referrer as any });
    } else {
      navigate({ to: '/member', search: defaultMemberSearch });
    }
    return null;
  }

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

  if (!member) {
    return null;
  }

  return (
    <div className="flex flex-1 flex-col p-6">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <PageHeader
          items={
            referrer?.startsWith('/member?')
              ? [[dictionary.member.list.menu, referrer], [memberLabel(member)]]
              : [
                  [dictionary.member.list.menu, '/member', defaultMemberSearch],
                  [memberLabel(member)],
                ]
          }
        />

        <div className="flex gap-2">
          <MemberActions mode="view" member={member} referrer={referrer} />
        </div>
      </div>

      <div className="my-6 divide-y border-t">
        {Boolean(member.user?.email) && (
          <div className="grid grid-cols-3 gap-4 py-4 text-sm lg:grid-cols-4">
            <div className="font-semibold">
              {dictionary.member.fields.email}
            </div>
            <div className="col-span-2 flex items-baseline gap-4 lg:col-span-3">
              <span>{member.user?.email}</span>
              <CopyToClipboardButton text={member.user?.email} />
            </div>
          </div>
        )}

        <div className="grid grid-cols-3 gap-4 py-4 text-sm lg:grid-cols-4">
          <div className="font-semibold">{dictionary.member.fields.role}</div>
          <div className="col-span-2 flex flex-col gap-1">
            <div className="flex items-center gap-4">
              <span>
                {dictionaryEnumerator(
                  dictionary.member.enumerators.roles,
                  member.role,
                )}
              </span>
              <CopyToClipboardButton
                text={dictionaryEnumerator(
                  dictionary.member.enumerators.roles,
                  member.role,
                )}
              />
            </div>
          </div>
        </div>

        {Boolean(member.firstName) && (
          <div className="grid grid-cols-3 gap-4 py-4 text-sm lg:grid-cols-4">
            <div className="font-semibold">
              {dictionary.member.fields.firstName}
            </div>
            <div className="col-span-2 flex items-baseline gap-4 lg:col-span-3">
              <span>{member.firstName}</span>
              <CopyToClipboardButton text={member.firstName} />
            </div>
          </div>
        )}

        {Boolean(member.lastName) && (
          <div className="grid grid-cols-3 gap-4 py-4 text-sm lg:grid-cols-4">
            <div className="font-semibold">
              {dictionary.member.fields.lastName}
            </div>
            <div className="col-span-2 flex items-baseline gap-4 lg:col-span-3">
              <span>{member.lastName}</span>
              <CopyToClipboardButton text={member.lastName} />
            </div>
          </div>
        )}

        {Boolean((member.avatars as Array<any>)?.length) && (
          <div className="grid grid-cols-3 gap-4 py-4 text-sm lg:grid-cols-4">
            <div className="font-semibold">
              {dictionary.member.fields.avatars}
            </div>
            <div className="col-span-2">
              <ImagesGallery value={member.avatars as any} />
            </div>
          </div>
        )}

        {Boolean(member.fullName) && (
          <div className="grid grid-cols-3 gap-4 py-4 text-sm lg:grid-cols-4">
            <div className="font-semibold">
              {dictionary.member.fields.fullName}
            </div>
            <div className="col-span-2 flex items-baseline gap-4 lg:col-span-3">
              <span>{member.fullName}</span>
              <CopyToClipboardButton text={member.fullName} />
            </div>
          </div>
        )}

        {member.createdByMember != null && (
          <div className="grid grid-cols-3 gap-4 py-4 text-sm lg:grid-cols-4">
            <div className="font-semibold">
              {dictionary.member.fields.createdByMember}
            </div>
            <div className="col-span-2 flex items-baseline gap-4 lg:col-span-3">
              <MemberLink member={member.createdByMember} />
              <CopyToClipboardButton
                text={memberLabel(member.createdByMember)}
              />
            </div>
          </div>
        )}

        {member.createdAt != null && (
          <div className="grid grid-cols-3 gap-4 py-4 text-sm lg:grid-cols-4">
            <div className="font-semibold">
              {dictionary.member.fields.createdAt}
            </div>
            <div className="col-span-2 flex items-baseline gap-4 lg:col-span-3">
              <span>{formatDateTime(member.createdAt, dictionary)}</span>
              <CopyToClipboardButton
                text={formatDateTime(member.createdAt, dictionary)}
              />
            </div>
          </div>
        )}

        {member.updatedByMember != null && (
          <div className="grid grid-cols-3 gap-4 py-4 text-sm lg:grid-cols-4">
            <div className="font-semibold">
              {dictionary.member.fields.updatedByMember}
            </div>
            <div className="col-span-2 flex items-baseline gap-4 lg:col-span-3">
              <MemberLink member={member.updatedByMember} />
              <CopyToClipboardButton
                text={memberLabel(member.updatedByMember)}
              />
            </div>
          </div>
        )}

        {member.updatedAt != null && (
          <div className="grid grid-cols-3 gap-4 py-4 text-sm lg:grid-cols-4">
            <div className="font-semibold">
              {dictionary.member.fields.updatedAt}
            </div>
            <div className="col-span-2 flex items-baseline gap-4 lg:col-span-3">
              <span>{formatDateTime(member.updatedAt, dictionary)}</span>
              <CopyToClipboardButton
                text={formatDateTime(member.updatedAt, dictionary)}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
