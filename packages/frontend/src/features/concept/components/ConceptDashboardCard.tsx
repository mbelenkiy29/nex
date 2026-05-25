import { DashboardCountCard } from '@/features/dashboard/components/DashboardCountCard';
import { featureIcons } from '@/features/featureIcons';
import { apiClient } from '@/shared/lib/apiClient';
import { objectToQuery } from '@/shared/lib/objectToQuery';
import { useAuthStore } from '@/features/auth/authStore';

export function ConceptDashboardCard() {
  const dictionary = useAuthStore((state) => state.dictionary);
  const hasPermission = useAuthStore((state) => state.hasPermission);

  const hasPermissionToRead = hasPermission({
    concept: ['read'],
  });

  if (!hasPermissionToRead) {
    return null;
  }

  return (
    <DashboardCountCard
      queryFn={async (signal?: AbortSignal) => {
        const { count } = await apiClient
          .get(
            `api/concept?${objectToQuery({
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
      queryKey={['concept', 'count']}
      title={dictionary.concept.dashboardCard.title}
      Icon={featureIcons.concept}
      href="/concept"
    />
  );
}
