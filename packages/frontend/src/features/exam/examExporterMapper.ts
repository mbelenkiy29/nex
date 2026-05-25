import { examLabel } from '@project/backend/features/exam/examLabel';
import { ExamWithRelationships } from '@project/backend/features/exam/examSchemas';
import { memberLabel } from '@project/backend/features/member/memberLabel';
import { dictionaryEnumerator } from '@project/backend/translation/dictionaryEnumerator';
import { formatDecimal } from '@project/backend/shared/lib/formatDecimal';
import { Dictionary, Locale } from '@project/backend/translation/locales';

export function examExporterMapper(
  exams: ExamWithRelationships[],
  context: { dictionary: Dictionary; locale: Locale },
): Record<string, string | null | undefined>[] {
  return exams.map((exam) => {
    return {
      id: exam.id,
      name: exam.name,
      code: exam.code,
      description: exam.description,
      iconUrl: exam.iconUrl,
      isActive: exam.isActive
        ? context.dictionary.shared.yes
        : context.dictionary.shared.no,
      createdByMember: memberLabel(exam.createdByMember),
      createdAt: String(exam.createdAt),
      updatedByMember: memberLabel(exam.updatedByMember),
      updatedAt: String(exam.updatedAt),
      archivedByMember: memberLabel(exam.archivedByMember),
      archivedAt: String(exam.archivedAt),
    };
  });
}
