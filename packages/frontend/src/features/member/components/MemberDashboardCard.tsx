import { LuUsers } from 'react-icons/lu';
import { DashboardCountCard } from '@/features/dashboard/components/DashboardCountCard';
import { useAuthStore } from '@/features/auth/authStore';
import { apiClient } from '@/shared/lib/apiClient';
import { objectToQuery } from '@/shared/lib/objectToQuery';
import { MemberWithRelationships } from '@project/backend/features/member/memberSchemas';

export function MemberDashboardCard() {
  const dictionary = useAuthStore((state) => state.dictionary);
  const hasPermission = useAuthStore((state) => state.hasPermission);
  const hasPermissionToRead = hasPermission({
    member: ['read'],
  });

  if (!hasPermissionToRead) {
    return null;
  }

  return (
    <DashboardCountCard
      queryFn={async (signal?: AbortSignal) => {
        const { count } = await apiClient
          .get(
            `api/member?${objectToQuery({
              take: 1,
              orderBy: {
                createdAt: 'desc',
              },
            })}`,
            { signal },
          )
          .json<{
            count: number;
            members: MemberWithRelationships[];
          }>();

        return count;
      }}
      queryKey={['member', 'count']}
      title={dictionary.member.dashboardCard.title}
      Icon={LuUsers}
      href="/member"
    />
  );
}
