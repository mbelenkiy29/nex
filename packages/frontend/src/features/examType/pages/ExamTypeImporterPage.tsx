import { createLazyRoute } from '@tanstack/react-router';
import { useAuthStore } from '@/features/auth/authStore';
import {
  examTypeImportFileSchema,
  examTypeImportInputSchema,
} from '@project/backend/features/examType/examTypeSchemas';
import { storage } from '@project/backend/features/permissions';
import { Importer } from '@/shared/components/importer/Importer';
import { apiClient } from '@/shared/lib/apiClient';

export const examTypeImporterLazyRoute = createLazyRoute('/exam-type/importer')(
  {
    component: ExamTypeImporterPage,
  },
);

export function ExamTypeImporterPage() {
  const dictionary = useAuthStore((state) => state.dictionary);

  return (
    <Importer
      keys={[
        'name',
        'description',
        'type',
        'questionCount',
        'timeLimitMinutes',
        'passingScore',
        'maxAttempts',
        'shuffleQuestions',
        'showAnswersImmediately',
        'isActive',
        'exam',
        'examInstances',
      ]}
      labels={dictionary.examType.fields}
      validationSchema={examTypeImportInputSchema}
      fileSchema={examTypeImportFileSchema}
      importerFn={async (data: any) => {
        return await apiClient
          .post('api/exam-type/importer', { json: data })
          .json();
      }}
      breadcrumbRoot={[dictionary.examType.list.menu, '/exam-type']}
      breadcrumbImporterMenu={dictionary.examType.importer.menu}
      importerTitle={dictionary.examType.importer.title}
      queryKeyToInvalidate={['examType']}
    />
  );
}
