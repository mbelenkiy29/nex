import { createLazyRoute } from '@tanstack/react-router';
import { useAuthStore } from '@/features/auth/authStore';
import {
  dailyGoalImportFileSchema,
  dailyGoalImportInputSchema,
} from '@project/backend/features/dailyGoal/dailyGoalSchemas';
import { storage } from '@project/backend/features/permissions';
import { Importer } from '@/shared/components/importer/Importer';
import { apiClient } from '@/shared/lib/apiClient';

export const dailyGoalImporterLazyRoute = createLazyRoute(
  '/daily-goal/importer',
)({
  component: DailyGoalImporterPage,
});

export function DailyGoalImporterPage() {
  const dictionary = useAuthStore((state) => state.dictionary);

  return (
    <Importer
      keys={[
        'title',
        'goalType',
        'targetValue',
        'currentValue',
        'xpReward',
        'goalDate',
        'completedAt',
        'owner',
      ]}
      labels={dictionary.dailyGoal.fields}
      validationSchema={dailyGoalImportInputSchema}
      fileSchema={dailyGoalImportFileSchema}
      importerFn={async (data: any) => {
        return await apiClient
          .post('api/daily-goal/importer', { json: data })
          .json();
      }}
      breadcrumbRoot={[dictionary.dailyGoal.list.menu, '/daily-goal']}
      breadcrumbImporterMenu={dictionary.dailyGoal.importer.menu}
      importerTitle={dictionary.dailyGoal.importer.title}
      queryKeyToInvalidate={['dailyGoal']}
    />
  );
}
