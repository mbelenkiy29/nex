import { examInstanceLabel } from '@project/backend/features/examInstance/examInstanceLabel';
import { ExamInstanceWithRelationships } from '@project/backend/features/examInstance/examInstanceSchemas';
import { examTypeLabel } from '@project/backend/features/examType/examTypeLabel';
import { memberLabel } from '@project/backend/features/member/memberLabel';
import { dictionaryEnumerator } from '@project/backend/translation/dictionaryEnumerator';
import { formatDecimal } from '@project/backend/shared/lib/formatDecimal';
import { Dictionary, Locale } from '@project/backend/translation/locales';

export function examInstanceExporterMapper(
  examInstances: ExamInstanceWithRelationships[],
  context: { dictionary: Dictionary; locale: Locale },
): Record<string, string | null | undefined>[] {
  return examInstances.map((examInstance) => {
    return {
      id: examInstance.id,
      status: dictionaryEnumerator(
        context.dictionary.examInstance.enumerators.status,
        examInstance.status,
      ),
      score: formatDecimal(examInstance.score?.toString(), context.locale, 2),
      passed: examInstance.passed
        ? context.dictionary.shared.yes
        : context.dictionary.shared.no,
      startedAt: examInstance.startedAt
        ? String(examInstance.startedAt)
        : undefined,
      completedAt: examInstance.completedAt
        ? String(examInstance.completedAt)
        : undefined,
      timeSpentSeconds: examInstance.timeSpentSeconds?.toString(),
      examType: examTypeLabel(
        examInstance.examType,
        context.dictionary,
        context.locale,
      ),
      student: memberLabel(examInstance.student),
      createdByMember: memberLabel(examInstance.createdByMember),
      createdAt: String(examInstance.createdAt),
      updatedByMember: memberLabel(examInstance.updatedByMember),
      updatedAt: String(examInstance.updatedAt),
    };
  });
}
