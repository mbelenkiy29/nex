import { DashboardCountCard } from '@/features/dashboard/components/DashboardCountCard';
import { featureIcons } from '@/features/featureIcons';
import { apiClient } from '@/shared/lib/apiClient';
import { objectToQuery } from '@/shared/lib/objectToQuery';
import { useAuthStore } from '@/features/auth/authStore';

export function ChapterDashboardCard() {
  const dictionary = useAuthStore((state) => state.dictionary);
  const hasPermission = useAuthStore((state) => state.hasPermission);

  const hasPermissionToRead = hasPermission({
    chapter: ['read'],
  });

  if (!hasPermissionToRead) {
    return null;
  }

  return (
    <DashboardCountCard
      queryFn={async (signal?: AbortSignal) => {
        const { count } = await apiClient
          .get(
            `api/chapter?${objectToQuery({
              take: 1,
              orderBy: {
                createdAt: 'desc',
              },
            })}`,
            { signal },
          )
          .json<{ count: number }>();

        return count;
      }}
      queryKey={['chapter', 'count']}
      title={dictionary.chapter.dashboardCard.title}
      Icon={featureIcons.chapter}
      href="/chapter"
    />
  );
}
