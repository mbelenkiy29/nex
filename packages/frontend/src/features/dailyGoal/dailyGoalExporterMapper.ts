import { dailyGoalLabel } from '@project/backend/features/dailyGoal/dailyGoalLabel';
import { DailyGoalWithRelationships } from '@project/backend/features/dailyGoal/dailyGoalSchemas';
import { memberLabel } from '@project/backend/features/member/memberLabel';
import { dictionaryEnumerator } from '@project/backend/translation/dictionaryEnumerator';
import { formatDecimal } from '@project/backend/shared/lib/formatDecimal';
import { Dictionary, Locale } from '@project/backend/translation/locales';

export function dailyGoalExporterMapper(
  dailyGoals: DailyGoalWithRelationships[],
  context: { dictionary: Dictionary; locale: Locale },
): Record<string, string | null | undefined>[] {
  return dailyGoals.map((dailyGoal) => {
    return {
      id: dailyGoal.id,
      title: dailyGoal.title,
      goalType: dictionaryEnumerator(
        context.dictionary.dailyGoal.enumerators.goalType,
        dailyGoal.goalType,
      ),
      targetValue: dailyGoal.targetValue?.toString(),
      currentValue: dailyGoal.currentValue?.toString(),
      xpReward: dailyGoal.xpReward?.toString(),
      goalDate: dailyGoal.goalDate
        ? String(dailyGoal.goalDate).split('T')[0]
        : undefined,
      completedAt: dailyGoal.completedAt
        ? String(dailyGoal.completedAt)
        : undefined,
      owner: memberLabel(dailyGoal.owner),
      createdByMember: memberLabel(dailyGoal.createdByMember),
      createdAt: String(dailyGoal.createdAt),
      updatedByMember: memberLabel(dailyGoal.updatedByMember),
      updatedAt: String(dailyGoal.updatedAt),
    };
  });
}
