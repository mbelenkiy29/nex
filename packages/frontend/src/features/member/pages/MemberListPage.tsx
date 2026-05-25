import { createLazyRoute } from '@tanstack/react-router';
import { MemberList } from '@/features/member/components/MemberList';
import { InvitationList } from '@/features/member/components/InvitationList';

export const memberListLazyRoute = createLazyRoute('/member')({
  component: MemberListPage,
});

export function MemberListPage() {
  return (
    <div className="mb-4 flex w-full flex-col gap-4 p-6">
      <MemberList />
      <InvitationList />
    </div>
  );
}
