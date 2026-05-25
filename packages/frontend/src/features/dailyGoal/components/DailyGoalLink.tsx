import { cn } from '@/shared/lib/utils';
import { useAuthStore } from '@/features/auth/authStore';
import { dailyGoalLabel } from '@project/backend/features/dailyGoal/dailyGoalLabel';
import { DailyGoalWithRelationships } from '@project/backend/features/dailyGoal/dailyGoalSchemas';
import { Link } from '@tanstack/react-router';

export function DailyGoalLink({
  dailyGoal,
  className,
}: {
  dailyGoal?: Partial<DailyGoalWithRelationships>;
  className?: string;
}) {
  const dictionary = useAuthStore((state) => state.dictionary);
  const locale = useAuthStore((state) => state.locale);
  const hasPermission = useAuthStore((state) => state.hasPermission);

  if (!dailyGoal) {
    return '';
  }

  const hasPermissionToRead = hasPermission({
    dailyGoal: ['read'],
  });

  if (!hasPermissionToRead) {
    return (
      <span className={className}>
        {dailyGoalLabel(dailyGoal, dictionary, locale)}
      </span>
    );
  }

  return (
    <Link
      to={`/daily-goal/$id`}
      params={{ id: dailyGoal.id! }}
      search={{
        referrer: window.location.pathname + window.location.search,
      }}
      className={cn(
        'text-blue-500 hover:text-blue-400 hover:underline focus:text-blue-400 dark:text-blue-400',
        className,
      )}
    >
      {dailyGoalLabel(dailyGoal, dictionary, locale)}
    </Link>
  );
}
