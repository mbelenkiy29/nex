import { Dictionary, Locale } from '../../translation/locales';
import { ChapterWithRelationships } from './chapterSchemas';

export function chapterLabel(
  chapter: Partial<ChapterWithRelationships> | null | undefined,
  dictionary: Dictionary,
  locale: Locale,
) {
  if (!chapter?.title) {
    return '';
  }

  const value = chapter.title;
  const _label = String(value);

  if (!chapter?.archivedAt) {
    return _label;
  }

  return `${_label} (${dictionary.shared.archived})`;
}
