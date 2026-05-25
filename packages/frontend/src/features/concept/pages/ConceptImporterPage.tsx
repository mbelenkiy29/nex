import { createLazyRoute } from '@tanstack/react-router';
import { useAuthStore } from '@/features/auth/authStore';
import {
  conceptImportFileSchema,
  conceptImportInputSchema,
} from '@project/backend/features/concept/conceptSchemas';
import { storage } from '@project/backend/features/permissions';
import { Importer } from '@/shared/components/importer/Importer';
import { apiClient } from '@/shared/lib/apiClient';

export const conceptImporterLazyRoute = createLazyRoute('/concept/importer')({
  component: ConceptImporterPage,
});

export function ConceptImporterPage() {
  const dictionary = useAuthStore((state) => state.dictionary);

  return (
    <Importer
      keys={[
        'conceptName',
        'conceptCode',
        'conceptDescription',
        'explanation',
        'examDomain',
        'difficulty',
        'examWeight',
        'typicalMistakes',
        'examTips',
        'isActive',
        'exam',
        'practiceQuestions',
      ]}
      labels={dictionary.concept.fields}
      validationSchema={conceptImportInputSchema}
      fileSchema={conceptImportFileSchema}
      importerFn={async (data: any) => {
        return await apiClient
          .post('api/concept/importer', { json: data })
          .json();
      }}
      breadcrumbRoot={[dictionary.concept.list.menu, '/concept']}
      breadcrumbImporterMenu={dictionary.concept.importer.menu}
      importerTitle={dictionary.concept.importer.title}
      queryKeyToInvalidate={['concept']}
    />
  );
}
