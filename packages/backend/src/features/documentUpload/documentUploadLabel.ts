import { Dictionary, Locale } from '../../translation/locales';
import { DocumentUploadWithRelationships } from './documentUploadSchemas';

export function documentUploadLabel(
  documentUpload: Partial<DocumentUploadWithRelationships> | null | undefined,
  dictionary: Dictionary,
  locale: Locale,
) {
  if (!documentUpload?.originalFilename) {
    return '';
  }

  const value = documentUpload.originalFilename;
  const _label = String(value);

  if (!documentUpload?.archivedAt) {
    return _label;
  }

  return `${_label} (${dictionary.shared.archived})`;
}
