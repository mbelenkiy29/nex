import { Dictionary, Locale } from '../../translation/locales';
import { DailyGoalWithRelationships } from './dailyGoalSchemas';

export function dailyGoalLabel(
  dailyGoal: Partial<DailyGoalWithRelationships> | null | undefined,
  dictionary: Dictionary,
  locale: Locale,
) {
  if (!dailyGoal?.title) {
    return '';
  }

  const value = dailyGoal.title;
  const _label = String(value);

  if (!dailyGoal?.archivedAt) {
    return _label;
  }

  return `${_label} (${dictionary.shared.archived})`;
}
