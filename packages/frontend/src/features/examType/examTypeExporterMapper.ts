import { examTypeLabel } from '@project/backend/features/examType/examTypeLabel';
import { ExamTypeWithRelationships } from '@project/backend/features/examType/examTypeSchemas';
import { examLabel } from '@project/backend/features/exam/examLabel';
import { memberLabel } from '@project/backend/features/member/memberLabel';
import { dictionaryEnumerator } from '@project/backend/translation/dictionaryEnumerator';
import { formatDecimal } from '@project/backend/shared/lib/formatDecimal';
import { Dictionary, Locale } from '@project/backend/translation/locales';

export function examTypeExporterMapper(
  examTypes: ExamTypeWithRelationships[],
  context: { dictionary: Dictionary; locale: Locale },
): Record<string, string | null | undefined>[] {
  return examTypes.map((examType) => {
    return {
      id: examType.id,
      name: examType.name,
      description: examType.description,
      type: dictionaryEnumerator(
        context.dictionary.examType.enumerators.type,
        examType.type,
      ),
      questionCount: examType.questionCount?.toString(),
      timeLimitMinutes: examType.timeLimitMinutes?.toString(),
      passingScore: examType.passingScore?.toString(),
      maxAttempts: examType.maxAttempts?.toString(),
      shuffleQuestions: examType.shuffleQuestions
        ? context.dictionary.shared.yes
        : context.dictionary.shared.no,
      showAnswersImmediately: examType.showAnswersImmediately
        ? context.dictionary.shared.yes
        : context.dictionary.shared.no,
      isActive: examType.isActive
        ? context.dictionary.shared.yes
        : context.dictionary.shared.no,
      exam: examLabel(examType.exam, context.dictionary, context.locale),
      createdByMember: memberLabel(examType.createdByMember),
      createdAt: String(examType.createdAt),
      updatedByMember: memberLabel(examType.updatedByMember),
      updatedAt: String(examType.updatedAt),
      archivedByMember: memberLabel(examType.archivedByMember),
      archivedAt: String(examType.archivedAt),
    };
  });
}
