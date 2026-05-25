import { Dictionary, Locale } from '../../translation/locales';
import { ExamWithRelationships } from './examSchemas';

export function examLabel(
  exam: Partial<ExamWithRelationships> | null | undefined,
  dictionary: Dictionary,
  locale: Locale,
) {
  if (!exam?.name) {
    return '';
  }

  const value = exam.name;
  const _label = String(value);

  if (!exam?.archivedAt) {
    return _label;
  }

  return `${_label} (${dictionary.shared.archived})`;
}
