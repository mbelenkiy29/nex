import { Link } from '@tanstack/react-router';
import { Button } from '@/shared/components/ui/button';
import { useAuthStore } from '@/features/auth/authStore';
import { LuMail } from 'react-icons/lu';

export function MemberNewButton() {
  const dictionary = useAuthStore((state) => state.dictionary);
  const hasPermission = useAuthStore((state) => state.hasPermission);
  const hasPermissionToCreate = hasPermission({
    member: ['create'],
  });

  if (!hasPermissionToCreate) {
    return null;
  }

  return (
    <Button
      nativeButton={false}
      render={
        <Link
          to="/member/new"
          search={{
            referrer: window.location.pathname + window.location.search,
          }}
          preload="intent"
        />
      }
    >
      <LuMail className="mr-2 h-4 w-4" />
      {dictionary.member.new.menu}
    </Button>
  );
}
