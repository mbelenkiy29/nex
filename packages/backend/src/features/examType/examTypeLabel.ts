import { Dictionary, Locale } from '../../translation/locales';
import { ExamTypeWithRelationships } from './examTypeSchemas';

export function examTypeLabel(
  examType: Partial<ExamTypeWithRelationships> | null | undefined,
  dictionary: Dictionary,
  locale: Locale,
) {
  if (!examType?.name) {
    return '';
  }

  const value = examType.name;
  const _label = String(value);

  if (!examType?.archivedAt) {
    return _label;
  }

  return `${_label} (${dictionary.shared.archived})`;
}
