import { Dictionary, Locale } from '../../translation/locales';
import { StudyNoteWithRelationships } from './studyNoteSchemas';

export function studyNoteLabel(
  studyNote: Partial<StudyNoteWithRelationships> | null | undefined,
  dictionary: Dictionary,
  locale: Locale,
) {
  if (!studyNote?.title) {
    return '';
  }

  const value = studyNote.title;
  const _label = String(value);

  if (!studyNote?.archivedAt) {
    return _label;
  }

  return `${_label} (${dictionary.shared.archived})`;
}
