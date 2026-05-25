import { cn } from '@/shared/lib/utils';
import { memberLabel } from '@project/backend/features/member/memberLabel';
import { MemberWithRelationships } from '@project/backend/features/member/memberSchemas';
import { Link } from '@tanstack/react-router';
import { useAuthStore } from '@/features/auth/authStore';

export function MemberLink({
  member,
  className,
}: {
  member?: Partial<MemberWithRelationships>;
  className?: string;
}) {
  const hasPermission = useAuthStore((state) => state.hasPermission);

  if (!member) {
    return '';
  }

  const hasPermissionToRead = hasPermission({
    member: ['read'],
  });

  if (!hasPermissionToRead) {
    return <span className={className}>{memberLabel(member)}</span>;
  }

  return (
    <Link
      to={`/member/${member.id}`}
      search={{
        referrer: window.location.pathname + window.location.search,
      }}
      className={cn(
        'text-blue-500 hover:text-blue-400 hover:underline focus:text-blue-400 dark:text-blue-400',
        className,
      )}
      preload="intent"
    >
      {memberLabel(member)}
    </Link>
  );
}
