import {
  createLazyRoute,
  useNavigate,
  useSearch,
} from '@tanstack/react-router';
import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '@/features/auth/authStore';
import { useShallow } from 'zustand/react/shallow';
import { DailyGoalForm } from '@/features/dailyGoal/components/DailyGoalForm';
import { PageHeader } from '@/shared/components/PageHeader';
import { apiClient } from '@/shared/lib/apiClient';
import { DailyGoalWithRelationships } from '@project/backend/features/dailyGoal/dailyGoalSchemas';
import { dailyGoalLabel } from '@project/backend/features/dailyGoal/dailyGoalLabel';
import { toast } from 'sonner';
import { dailyGoalEditRoute } from '@/features/dailyGoal/dailyGoalRouter';

export const dailyGoalEditLazyRoute = createLazyRoute('/daily-goal/$id/edit')({
  component: DailyGoalEditPage,
});

export function DailyGoalEditPage() {
  const { dictionary, locale } = useAuthStore(
    useShallow((state) => ({
      dictionary: state.dictionary,
      locale: state.locale,
    })),
  );
  const navigate = useNavigate();
  const { id } = dailyGoalEditRoute.useParams();
  const searchParams = useSearch({ strict: false }) as Record<string, any>;
  const referrer = searchParams.referrer as string | undefined;

  const query = useQuery({
    queryKey: ['daily-goal', id],
    queryFn: async ({ signal }) => {
      return await apiClient
        .get(`api/daily-goal/${id}`, { signal })
        .json<DailyGoalWithRelationships>();
    },
    staleTime: 0,
    gcTime: 0,
    refetchOnMount: 'always',
  });

  if (query.isError) {
    toast.error(
      (query.error as any).message || dictionary.shared.errors.unknown,
    );
    if (referrer?.startsWith('/daily-goal?')) {
      navigate({ to: referrer as any });
    } else {
      navigate({ to: '/daily-goal' });
    }
    return null;
  }

  if (!query.data) {
    return null;
  }

  const dailyGoal = query.data;
  const dailyGoalListPath = referrer?.startsWith('/daily-goal?')
    ? referrer
    : '/daily-goal';

  return (
    <div className="flex flex-1 flex-col p-6">
      <PageHeader
        items={[
          [dictionary.dailyGoal.list.menu, dailyGoalListPath],
          [
            dailyGoalLabel(dailyGoal, dictionary, locale),
            `/daily-goal/${dailyGoal?.id}${referrer ? `?referrer=${encodeURIComponent(referrer)}` : ''}`,
          ],
          [dictionary.dailyGoal.edit.menu],
        ]}
      />
      <div className="my-10">
        <DailyGoalForm
          dailyGoal={dailyGoal}
          onSuccess={(dailyGoal: DailyGoalWithRelationships) =>
            navigate({
              to: `/daily-goal/${dailyGoal.id}`,
              search: referrer ? { referrer } : undefined,
            })
          }
          onCancel={() =>
            referrer?.startsWith('/daily-goal?')
              ? navigate({ to: referrer as any })
              : navigate({ to: '/daily-goal' })
          }
        />
      </div>
    </div>
  );
}
