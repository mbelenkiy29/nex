import { lessonLabel } from '@project/backend/features/lesson/lessonLabel';
import { LessonWithRelationships } from '@project/backend/features/lesson/lessonSchemas';
import { chapterLabel } from '@project/backend/features/chapter/chapterLabel';
import { memberLabel } from '@project/backend/features/member/memberLabel';
import { dictionaryEnumerator } from '@project/backend/translation/dictionaryEnumerator';
import { formatDecimal } from '@project/backend/shared/lib/formatDecimal';
import { Dictionary, Locale } from '@project/backend/translation/locales';

export function lessonExporterMapper(
  lessons: LessonWithRelationships[],
  context: { dictionary: Dictionary; locale: Locale },
): Record<string, string | null | undefined>[] {
  return lessons.map((lesson) => {
    return {
      id: lesson.id,
      title: lesson.title,
      lessonNumber: lesson.lessonNumber?.toString(),
      content: lesson.content,
      estimatedMinutes: lesson.estimatedMinutes?.toString(),
      xpReward: lesson.xpReward?.toString(),
      workflowStatus: dictionaryEnumerator(
        context.dictionary.lesson.enumerators.workflowStatus,
        lesson.workflowStatus,
      ),
      isPublished: lesson.isPublished
        ? context.dictionary.shared.yes
        : context.dictionary.shared.no,
      chapter: chapterLabel(lesson.chapter, context.dictionary, context.locale),
      createdByMember: memberLabel(lesson.createdByMember),
      createdAt: String(lesson.createdAt),
      updatedByMember: memberLabel(lesson.updatedByMember),
      updatedAt: String(lesson.updatedAt),
      archivedByMember: memberLabel(lesson.archivedByMember),
      archivedAt: String(lesson.archivedAt),
    };
  });
}
