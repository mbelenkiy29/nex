import { chapterLabel } from '@project/backend/features/chapter/chapterLabel';
import { ChapterWithRelationships } from '@project/backend/features/chapter/chapterSchemas';
import { examLabel } from '@project/backend/features/exam/examLabel';
import { memberLabel } from '@project/backend/features/member/memberLabel';
import { dictionaryEnumerator } from '@project/backend/translation/dictionaryEnumerator';
import { formatDecimal } from '@project/backend/shared/lib/formatDecimal';
import { Dictionary, Locale } from '@project/backend/translation/locales';

export function chapterExporterMapper(
  chapters: ChapterWithRelationships[],
  context: { dictionary: Dictionary; locale: Locale },
): Record<string, string | null | undefined>[] {
  return chapters.map((chapter) => {
    return {
      id: chapter.id,
      title: chapter.title,
      chapterNumber: chapter.chapterNumber?.toString(),
      description: chapter.description,
      aiTutorPrompt: chapter.aiTutorPrompt,
      xpReward: chapter.xpReward?.toString(),
      orderIndex: chapter.orderIndex?.toString(),
      workflowStatus: dictionaryEnumerator(
        context.dictionary.chapter.enumerators.workflowStatus,
        chapter.workflowStatus,
      ),
      isPublished: chapter.isPublished
        ? context.dictionary.shared.yes
        : context.dictionary.shared.no,
      version: chapter.version?.toString(),
      objectives: chapter.objectives?.join(', '),
      exam: examLabel(chapter.exam, context.dictionary, context.locale),
      createdByMember: memberLabel(chapter.createdByMember),
      createdAt: String(chapter.createdAt),
      updatedByMember: memberLabel(chapter.updatedByMember),
      updatedAt: String(chapter.updatedAt),
      archivedByMember: memberLabel(chapter.archivedByMember),
      archivedAt: String(chapter.archivedAt),
    };
  });
}
