import { Dictionary, Locale } from '../../translation/locales';
import { ExamInstanceWithRelationships } from './examInstanceSchemas';
import { dictionaryEnumerator } from '../../translation/dictionaryEnumerator';

export function examInstanceLabel(
  examInstance: Partial<ExamInstanceWithRelationships> | null | undefined,
  dictionary: Dictionary,
  locale: Locale,
) {
  if (!examInstance?.status) {
    return '';
  }

  const value = examInstance.status;
  const _label = dictionaryEnumerator(
    dictionary.examInstance.enumerators.status,
    value as string,
  );

  if (!examInstance?.archivedAt) {
    return _label;
  }

  return `${_label} (${dictionary.shared.archived})`;
}
