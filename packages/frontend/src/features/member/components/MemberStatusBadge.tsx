import { useAuthStore } from '@/features/auth/authStore';
import type { MemberWithRelationships } from '@project/backend/features/member/memberSchemas';

export function MemberStatusBadge({
  member,
}: {
  member: MemberWithRelationships;
}) {
  const dictionary = useAuthStore((state) => state.dictionary);
  const isDisabled = member?.disabled;

  if (isDisabled) {
    return (
      <span className="inline-flex items-center rounded-md bg-gray-50 px-2 py-1 text-xs font-medium text-gray-600 ring-1 ring-gray-500/10 ring-inset dark:bg-gray-400/10 dark:text-gray-400 dark:ring-gray-400/20">
        {dictionary.member.enumerators.status.disabled}
      </span>
    );
  }

  return (
    <span className="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-green-600/20 ring-inset dark:bg-green-500/10 dark:text-green-400 dark:ring-green-500/20">
      {dictionary.member.enumerators.status.active}
    </span>
  );
}
