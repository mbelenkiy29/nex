import { practiceQuestionLabel } from '@project/backend/features/practiceQuestion/practiceQuestionLabel';
import { PracticeQuestionWithRelationships } from '@project/backend/features/practiceQuestion/practiceQuestionSchemas';
import { chapterLabel } from '@project/backend/features/chapter/chapterLabel';
import { conceptLabel } from '@project/backend/features/concept/conceptLabel';
import { memberLabel } from '@project/backend/features/member/memberLabel';
import { dictionaryEnumerator } from '@project/backend/translation/dictionaryEnumerator';
import { formatDecimal } from '@project/backend/shared/lib/formatDecimal';
import { Dictionary, Locale } from '@project/backend/translation/locales';

export function practiceQuestionExporterMapper(
  practiceQuestions: PracticeQuestionWithRelationships[],
  context: { dictionary: Dictionary; locale: Locale },
): Record<string, string | null | undefined>[] {
  return practiceQuestions.map((practiceQuestion) => {
    return {
      id: practiceQuestion.id,
      questionText: practiceQuestion.questionText,
      correctAnswerIndex: practiceQuestion.correctAnswerIndex?.toString(),
      answerOptions: practiceQuestion.answerOptions?.join('\n'),
      explanation: practiceQuestion.explanation,
      difficulty: dictionaryEnumerator(
        context.dictionary.practiceQuestion.enumerators.difficulty,
        practiceQuestion.difficulty,
      ),
      category: practiceQuestion.category,
      isActive: practiceQuestion.isActive
        ? context.dictionary.shared.yes
        : context.dictionary.shared.no,
      tags: practiceQuestion.tags?.join(', '),
      chapter: chapterLabel(
        practiceQuestion.chapter,
        context.dictionary,
        context.locale,
      ),
      concepts: practiceQuestion.concepts
        ?.map((current) =>
          conceptLabel(current, context.dictionary, context.locale),
        )
        .join(', '),
      createdByMember: memberLabel(practiceQuestion.createdByMember),
      createdAt: String(practiceQuestion.createdAt),
      updatedByMember: memberLabel(practiceQuestion.updatedByMember),
      updatedAt: String(practiceQuestion.updatedAt),
      archivedByMember: memberLabel(practiceQuestion.archivedByMember),
      archivedAt: String(practiceQuestion.archivedAt),
    };
  });
}
