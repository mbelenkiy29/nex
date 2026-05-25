import { createLazyRoute } from '@tanstack/react-router';
import { useAuthStore } from '@/features/auth/authStore';
import {
  examInstanceImportFileSchema,
  examInstanceImportInputSchema,
} from '@project/backend/features/examInstance/examInstanceSchemas';
import { storage } from '@project/backend/features/permissions';
import { Importer } from '@/shared/components/importer/Importer';
import { apiClient } from '@/shared/lib/apiClient';

export const examInstanceImporterLazyRoute = createLazyRoute(
  '/exam-instance/importer',
)({
  component: ExamInstanceImporterPage,
});

export function ExamInstanceImporterPage() {
  const dictionary = useAuthStore((state) => state.dictionary);

  return (
    <Importer
      keys={[
        'status',
        'score',
        'passed',
        'startedAt',
        'completedAt',
        'timeSpentSeconds',
        'examType',
        'student',
      ]}
      labels={dictionary.examInstance.fields}
      validationSchema={examInstanceImportInputSchema}
      fileSchema={examInstanceImportFileSchema}
      importerFn={async (data: any) => {
        return await apiClient
          .post('api/exam-instance/importer', { json: data })
          .json();
      }}
      breadcrumbRoot={[dictionary.examInstance.list.menu, '/exam-instance']}
      breadcrumbImporterMenu={dictionary.examInstance.importer.menu}
      importerTitle={dictionary.examInstance.importer.title}
      queryKeyToInvalidate={['examInstance']}
    />
  );
}
