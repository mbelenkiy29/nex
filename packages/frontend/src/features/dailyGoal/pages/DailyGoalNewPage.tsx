import {
  createLazyRoute,
  useNavigate,
  useSearch,
} from '@tanstack/react-router';
import { useAuthStore } from '@/features/auth/authStore';
import { DailyGoalForm } from '@/features/dailyGoal/components/DailyGoalForm';
import { PageHeader } from '@/shared/components/PageHeader';
import { DailyGoalWithRelationships } from '@project/backend/features/dailyGoal/dailyGoalSchemas';

export const dailyGoalNewLazyRoute = createLazyRoute('/daily-goal/new')({
  component: DailyGoalNewPage,
});

export function DailyGoalNewPage() {
  const dictionary = useAuthStore((state) => state.dictionary);
  const navigate = useNavigate();
  const searchParams = useSearch({ strict: false }) as Record<string, any>;
  const referrer = searchParams.referrer as string | undefined;

  const dailyGoalListPath = referrer?.startsWith('/daily-goal?')
    ? referrer
    : '/daily-goal';

  return (
    <div className="flex flex-1 flex-col p-6">
      <PageHeader
        items={[
          [dictionary.dailyGoal.list.menu, dailyGoalListPath],
          [dictionary.dailyGoal.new.menu],
        ]}
      />
      <div className="my-10">
        <DailyGoalForm
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
