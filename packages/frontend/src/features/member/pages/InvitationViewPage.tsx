import { useQuery, useQueryClient } from '@tanstack/react-query';
import {
  createLazyRoute,
  useNavigate,
  useSearch,
} from '@tanstack/react-router';
import { InvitationActions } from '@/features/member/components/InvitationActions';
import {
  InvitationStatusBadge,
  InvitationExpiresAt,
} from '@/features/member/components/InvitationStatusBadge';
import { InvitationWithRelationships } from '@project/backend/features/invitation/invitationSchemas';
import { PageHeader } from '@/shared/components/PageHeader';
import { CopyToClipboardButton } from '@/shared/components/CopyToClipboardButton';
import { toast } from 'sonner';
import { useAuthStore } from '@/features/auth/authStore';
import { dictionaryEnumerator } from '@project/backend/translation/dictionaryEnumerator';
import { apiClient } from '@/shared/lib/apiClient';
import { formatDateTime } from '@project/backend/shared/lib/formatDateTime';

export const invitationViewLazyRoute = createLazyRoute(
  '/member/invitation/$id',
)({
  component: InvitationViewPage,
});
import { invitationViewRoute } from '@/features/member/memberRouter';

export function InvitationViewPage() {
  const { id } = invitationViewRoute.useParams();
  const searchParams = useSearch({ strict: false }) as Record<string, any>;
  const referrer = searchParams.referrer as string | undefined;
  const dictionary = useAuthStore((state) => state.dictionary);
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const query = useQuery({
    queryKey: ['invitation', id],
    queryFn: async ({ signal }) => {
      return await apiClient
        .get(`api/member/invitation/${id}`, { signal })
        .json<InvitationWithRelationships>();
    },
    initialData: () =>
      (
        queryClient.getQueryData(['invitation']) as
          | Array<InvitationWithRelationships>
          | undefined
      )?.find((d) => d.id === id),
  });

  const invitation = query.data;

  const defaultInvitationSearch = {
    invitationFilter: {
      statuses: ['pending'],
    },
  };

  if (query.isSuccess && !invitation) {
    if (referrer?.startsWith('/member?')) {
      navigate({ to: referrer as any });
    } else {
      navigate({ to: '/member', search: defaultInvitationSearch });
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
      navigate({ to: '/member', search: defaultInvitationSearch });
    }
    return null;
  }

  if (!invitation) {
    return null;
  }

  return (
    <div className="flex flex-1 flex-col p-6">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <PageHeader
          items={
            referrer?.startsWith('/member?')
              ? [
                  [dictionary.invitation.list.title, referrer],
                  [invitation.email],
                ]
              : [
                  [
                    dictionary.invitation.list.title,
                    '/member',
                    defaultInvitationSearch,
                  ],
                  [invitation.email],
                ]
          }
        />

        <div className="flex gap-2">
          <InvitationActions invitation={invitation} />
        </div>
      </div>

      <div className="my-6 divide-y border-t">
        <div className="grid grid-cols-3 gap-4 py-4 text-sm lg:grid-cols-4">
          <div className="font-semibold">
            {dictionary.invitation.fields.email}
          </div>
          <div className="col-span-2 flex items-baseline gap-4 lg:col-span-3">
            <span>{invitation.email}</span>
            <CopyToClipboardButton text={invitation.email} />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 py-4 text-sm lg:grid-cols-4">
          <div className="font-semibold">
            {dictionary.invitation.fields.role}
          </div>
          <div className="col-span-2 flex flex-col gap-1">
            <div className="flex items-center gap-4">
              <span>
                {dictionaryEnumerator(
                  dictionary.member.enumerators.roles,
                  invitation.role,
                )}
              </span>
              <CopyToClipboardButton
                text={dictionaryEnumerator(
                  dictionary.member.enumerators.roles,
                  invitation.role,
                )}
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 py-4 text-sm lg:grid-cols-4">
          <div className="font-semibold">
            {dictionary.invitation.fields.status}
          </div>
          <div className="col-span-2 flex items-baseline gap-4 lg:col-span-3">
            <InvitationStatusBadge invitation={invitation} />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 py-4 text-sm lg:grid-cols-4">
          <div className="font-semibold">
            {dictionary.invitation.fields.expiresAt}
          </div>
          <div className="col-span-2 flex items-baseline gap-4 lg:col-span-3">
            <InvitationExpiresAt invitation={invitation} />
          </div>
        </div>

        {invitation.inviter && (
          <div className="grid grid-cols-3 gap-4 py-4 text-sm lg:grid-cols-4">
            <div className="font-semibold">
              {dictionary.invitation.fields.invitedBy}
            </div>
            <div className="col-span-2 flex items-baseline gap-4 lg:col-span-3">
              <span>{invitation.inviter.name || invitation.inviter.email}</span>
              <CopyToClipboardButton
                text={invitation.inviter.name || invitation.inviter.email || ''}
              />
            </div>
          </div>
        )}

        <div className="grid grid-cols-3 gap-4 py-4 text-sm lg:grid-cols-4">
          <div className="font-semibold">
            {dictionary.invitation.fields.createdAt}
          </div>
          <div className="col-span-2 flex items-baseline gap-4 lg:col-span-3">
            <span>{formatDateTime(invitation.createdAt, dictionary)}</span>
            <CopyToClipboardButton
              text={formatDateTime(invitation.createdAt, dictionary)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
