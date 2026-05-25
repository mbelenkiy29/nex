import { studyNoteLabel } from '@project/backend/features/studyNote/studyNoteLabel';
import { StudyNoteWithRelationships } from '@project/backend/features/studyNote/studyNoteSchemas';
import { chapterLabel } from '@project/backend/features/chapter/chapterLabel';
import { lessonLabel } from '@project/backend/features/lesson/lessonLabel';
import { memberLabel } from '@project/backend/features/member/memberLabel';
import { dictionaryEnumerator } from '@project/backend/translation/dictionaryEnumerator';
import { formatDecimal } from '@project/backend/shared/lib/formatDecimal';
import { Dictionary, Locale } from '@project/backend/translation/locales';

export function studyNoteExporterMapper(
  studyNotes: StudyNoteWithRelationships[],
  context: { dictionary: Dictionary; locale: Locale },
): Record<string, string | null | undefined>[] {
  return studyNotes.map((studyNote) => {
    return {
      id: studyNote.id,
      title: studyNote.title,
      content: studyNote.content,
      isFavorite: studyNote.isFavorite
        ? context.dictionary.shared.yes
        : context.dictionary.shared.no,
      tags: studyNote.tags?.join(', '),
      chapter: chapterLabel(
        studyNote.chapter,
        context.dictionary,
        context.locale,
      ),
      lesson: lessonLabel(studyNote.lesson, context.dictionary, context.locale),
      author: memberLabel(studyNote.author),
      createdByMember: memberLabel(studyNote.createdByMember),
      createdAt: String(studyNote.createdAt),
      updatedByMember: memberLabel(studyNote.updatedByMember),
      updatedAt: String(studyNote.updatedAt),
      archivedByMember: memberLabel(studyNote.archivedByMember),
      archivedAt: String(studyNote.archivedAt),
    };
  });
}
