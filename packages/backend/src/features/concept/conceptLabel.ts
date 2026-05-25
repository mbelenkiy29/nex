import { Dictionary, Locale } from '../../translation/locales';
import { ConceptWithRelationships } from './conceptSchemas';

export function conceptLabel(
  concept: Partial<ConceptWithRelationships> | null | undefined,
  dictionary: Dictionary,
  locale: Locale,
) {
  if (!concept?.conceptName) {
    return '';
  }

  const value = concept.conceptName;
  const _label = String(value);

  if (!concept?.archivedAt) {
    return _label;
  }

  return `${_label} (${dictionary.shared.archived})`;
}
