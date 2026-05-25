import { documentUploadLabel } from '@project/backend/features/documentUpload/documentUploadLabel';
import { DocumentUploadWithRelationships } from '@project/backend/features/documentUpload/documentUploadSchemas';
import { examLabel } from '@project/backend/features/exam/examLabel';
import { memberLabel } from '@project/backend/features/member/memberLabel';
import { dictionaryEnumerator } from '@project/backend/translation/dictionaryEnumerator';
import { formatDecimal } from '@project/backend/shared/lib/formatDecimal';
import { Dictionary, Locale } from '@project/backend/translation/locales';

export function documentUploadExporterMapper(
  documentUploads: DocumentUploadWithRelationships[],
  context: { dictionary: Dictionary; locale: Locale },
): Record<string, string | null | undefined>[] {
  return documentUploads.map((documentUpload) => {
    return {
      id: documentUpload.id,
      originalFilename: documentUpload.originalFilename,
      status: dictionaryEnumerator(
        context.dictionary.documentUpload.enumerators.status,
        documentUpload.status,
      ),
      pageCount: documentUpload.pageCount?.toString(),
      wordCount: documentUpload.wordCount?.toString(),
      processingError: documentUpload.processingError,
      exam: examLabel(documentUpload.exam, context.dictionary, context.locale),
      uploadedBy: memberLabel(documentUpload.uploadedBy),
      createdByMember: memberLabel(documentUpload.createdByMember),
      createdAt: String(documentUpload.createdAt),
      updatedByMember: memberLabel(documentUpload.updatedByMember),
      updatedAt: String(documentUpload.updatedAt),
      archivedByMember: memberLabel(documentUpload.archivedByMember),
      archivedAt: String(documentUpload.archivedAt),
    };
  });
}
