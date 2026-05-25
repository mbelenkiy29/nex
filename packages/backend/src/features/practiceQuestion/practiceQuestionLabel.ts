import { Dictionary, Locale } from '../../translation/locales';
import { PracticeQuestionWithRelationships } from './practiceQuestionSchemas';

export function practiceQuestionLabel(
  practiceQuestion:
    | Partial<PracticeQuestionWithRelationships>
    | null
    | undefined,
  dictionary: Dictionary,
  locale: Locale,
) {
  if (!practiceQuestion?.questionText) {
    return '';
  }

  const value = practiceQuestion.questionText;
  const _label = String(value);

  if (!practiceQuestion?.archivedAt) {
    return _label;
  }

  return `${_label} (${dictionary.shared.archived})`;
}
