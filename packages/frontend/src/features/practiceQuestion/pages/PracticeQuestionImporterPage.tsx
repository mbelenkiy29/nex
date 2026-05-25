import { createLazyRoute } from '@tanstack/react-router';
import { useAuthStore } from '@/features/auth/authStore';
import {
  practiceQuestionImportFileSchema,
  practiceQuestionImportInputSchema,
} from '@project/backend/features/practiceQuestion/practiceQuestionSchemas';
import { storage } from '@project/backend/features/permissions';
import { Importer } from '@/shared/components/importer/Importer';
import { apiClient } from '@/shared/lib/apiClient';

export const practiceQuestionImporterLazyRoute = createLazyRoute(
  '/practice-question/importer',
)({
  component: PracticeQuestionImporterPage,
});

export function PracticeQuestionImporterPage() {
  const dictionary = useAuthStore((state) => state.dictionary);

  return (
    <Importer
      keys={[
        'questionText',
        'correctAnswerIndex',
        'answerOptions',
        'explanation',
        'difficulty',
        'category',
        'isActive',
        'tags',
        'course',
        'chapter',
        'concepts',
      ]}
      labels={dictionary.practiceQuestion.fields}
      validationSchema={practiceQuestionImportInputSchema}
      fileSchema={practiceQuestionImportFileSchema}
      importerFn={async (data: any) => {
        return await apiClient
          .post('api/practice-question/importer', { json: data })
          .json();
      }}
      breadcrumbRoot={[
        dictionary.practiceQuestion.list.menu,
        '/practice-question',
      ]}
      breadcrumbImporterMenu={dictionary.practiceQuestion.importer.menu}
      importerTitle={dictionary.practiceQuestion.importer.title}
      queryKeyToInvalidate={['practiceQuestion']}
    />
  );
}
