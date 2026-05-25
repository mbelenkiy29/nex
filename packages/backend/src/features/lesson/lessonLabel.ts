import { Dictionary, Locale } from '../../translation/locales';
import { LessonWithRelationships } from './lessonSchemas';

export function lessonLabel(
  lesson: Partial<LessonWithRelationships> | null | undefined,
  dictionary: Dictionary,
  locale: Locale,
) {
  if (!lesson?.title) {
    return '';
  }

  const value = lesson.title;
  const _label = String(value);

  if (!lesson?.archivedAt) {
    return _label;
  }

  return `${_label} (${dictionary.shared.archived})`;
}
