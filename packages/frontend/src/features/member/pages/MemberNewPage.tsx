import { MemberNewForm } from '@/features/member/components/MemberNewForm';
import { useAuthStore } from '@/features/auth/authStore';
import {
  createLazyRoute,
  useNavigate,
  useSearch,
} from '@tanstack/react-router';
import { PageHeader } from '@/shared/components/PageHeader';

export const memberNewLazyRoute = createLazyRoute('/member/new')({
  component: MemberNewPage,
});

export function MemberNewPage() {
  const dictionary = useAuthStore((state) => state.dictionary);
  const navigate = useNavigate();
  const searchParams = useSearch({ strict: false }) as Record<string, any>;
  const referrer = searchParams.referrer as string | undefined;

  if (!dictionary) {
    return null;
  }

  const defaultMemberSearch = {
    invitationFilter: {
      statuses: ['pending'],
    },
  };

  return (
    <div className="flex flex-1 flex-col p-6">
      <PageHeader
        items={
          referrer?.startsWith('/member?')
            ? [
                [dictionary.member.list.menu, referrer],
                [dictionary.member.new.menu],
              ]
            : [
                [dictionary.member.list.menu, '/member', defaultMemberSearch],
                [dictionary.member.new.menu],
              ]
        }
      />

      <div className="my-6">
        <MemberNewForm
          onSuccess={() =>
            navigate({
              to: `/member`,
              search: referrer ? { referrer } : defaultMemberSearch,
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
