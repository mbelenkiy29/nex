import { createLazyRoute } from '@tanstack/react-router';
import { useAuthStore } from '@/features/auth/authStore';
import {
  examImportFileSchema,
  examImportInputSchema,
} from '@project/backend/features/exam/examSchemas';
import { storage } from '@project/backend/features/permissions';
import { Importer } from '@/shared/components/importer/Importer';
import { apiClient } from '@/shared/lib/apiClient';

export const examImporterLazyRoute = createLazyRoute('/exam/importer')({
  component: ExamImporterPage,
});

export function ExamImporterPage() {
  const dictionary = useAuthStore((state) => state.dictionary);

  return (
    <Importer
      keys={[
        'name',
        'code',
        'description',
        'iconUrl',
        'isActive',
        'chapters',
        'concepts',
        'examTypes',
        'documentUploads',
      ]}
      labels={dictionary.exam.fields}
      validationSchema={examImportInputSchema}
      fileSchema={examImportFileSchema}
      importerFn={async (data: any) => {
        return await apiClient.post('api/exam/importer', { json: data }).json();
      }}
      breadcrumbRoot={[dictionary.exam.list.menu, '/exam']}
      breadcrumbImporterMenu={dictionary.exam.importer.menu}
      importerTitle={dictionary.exam.importer.title}
      queryKeyToInvalidate={['exam']}
    />
  );
}
