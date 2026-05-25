import { conceptLabel } from '@project/backend/features/concept/conceptLabel';
import { ConceptWithRelationships } from '@project/backend/features/concept/conceptSchemas';
import { examLabel } from '@project/backend/features/exam/examLabel';
import { memberLabel } from '@project/backend/features/member/memberLabel';
import { dictionaryEnumerator } from '@project/backend/translation/dictionaryEnumerator';
import { formatDecimal } from '@project/backend/shared/lib/formatDecimal';
import { Dictionary, Locale } from '@project/backend/translation/locales';

export function conceptExporterMapper(
  concepts: ConceptWithRelationships[],
  context: { dictionary: Dictionary; locale: Locale },
): Record<string, string | null | undefined>[] {
  return concepts.map((concept) => {
    return {
      id: concept.id,
      conceptName: concept.conceptName,
      conceptCode: concept.conceptCode,
      conceptDescription: concept.conceptDescription,
      explanation: concept.explanation,
      examDomain: concept.examDomain,
      difficulty: dictionaryEnumerator(
        context.dictionary.concept.enumerators.difficulty,
        concept.difficulty,
      ),
      examWeight: dictionaryEnumerator(
        context.dictionary.concept.enumerators.examWeight,
        concept.examWeight,
      ),
      typicalMistakes: concept.typicalMistakes?.join(', '),
      examTips: concept.examTips?.join(', '),
      isActive: concept.isActive
        ? context.dictionary.shared.yes
        : context.dictionary.shared.no,
      exam: examLabel(concept.exam, context.dictionary, context.locale),
      createdByMember: memberLabel(concept.createdByMember),
      createdAt: String(concept.createdAt),
      updatedByMember: memberLabel(concept.updatedByMember),
      updatedAt: String(concept.updatedAt),
      archivedByMember: memberLabel(concept.archivedByMember),
      archivedAt: String(concept.archivedAt),
    };
  });
}
