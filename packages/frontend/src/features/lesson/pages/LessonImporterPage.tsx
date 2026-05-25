import { createLazyRoute } from '@tanstack/react-router';
import { useAuthStore } from '@/features/auth/authStore';
import {
  lessonImportFileSchema,
  lessonImportInputSchema,
} from '@project/backend/features/lesson/lessonSchemas';
import { storage } from '@project/backend/features/permissions';
import { Importer } from '@/shared/components/importer/Importer';
import { apiClient } from '@/shared/lib/apiClient';

export const lessonImporterLazyRoute = createLazyRoute('/lesson/importer')({
  component: LessonImporterPage,
});

export function LessonImporterPage() {
  const dictionary = useAuthStore((state) => state.dictionary);

  return (
    <Importer
      keys={[
        'title',
        'lessonNumber',
        'content',
        'estimatedMinutes',
        'xpReward',
        'workflowStatus',
        'isPublished',
        'chapter',
        'studyNotes',
      ]}
      labels={dictionary.lesson.fields}
      validationSchema={lessonImportInputSchema}
      fileSchema={lessonImportFileSchema}
      importerFn={async (data: any) => {
        return await apiClient
          .post('api/lesson/importer', { json: data })
          .json();
      }}
      breadcrumbRoot={[dictionary.lesson.list.menu, '/lesson']}
      breadcrumbImporterMenu={dictionary.lesson.importer.menu}
      importerTitle={dictionary.lesson.importer.title}
      queryKeyToInvalidate={['lesson']}
    />
  );
}
