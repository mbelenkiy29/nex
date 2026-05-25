import { createLazyRoute } from '@tanstack/react-router';
import { useAuthStore } from '@/features/auth/authStore';
import {
  chapterImportFileSchema,
  chapterImportInputSchema,
} from '@project/backend/features/chapter/chapterSchemas';
import { storage } from '@project/backend/features/permissions';
import { Importer } from '@/shared/components/importer/Importer';
import { apiClient } from '@/shared/lib/apiClient';

export const chapterImporterLazyRoute = createLazyRoute('/chapter/importer')({
  component: ChapterImporterPage,
});

export function ChapterImporterPage() {
  const dictionary = useAuthStore((state) => state.dictionary);

  return (
    <Importer
      keys={[
        'title',
        'chapterNumber',
        'description',
        'aiTutorPrompt',
        'xpReward',
        'orderIndex',
        'workflowStatus',
        'isPublished',
        'version',
        'objectives',
        'exam',
        'lessons',
        'practiceQuestions',
        'studyNotes',
      ]}
      labels={dictionary.chapter.fields}
      validationSchema={chapterImportInputSchema}
      fileSchema={chapterImportFileSchema}
      importerFn={async (data: any) => {
        return await apiClient
          .post('api/chapter/importer', { json: data })
          .json();
      }}
      breadcrumbRoot={[dictionary.chapter.list.menu, '/chapter']}
      breadcrumbImporterMenu={dictionary.chapter.importer.menu}
      importerTitle={dictionary.chapter.importer.title}
      queryKeyToInvalidate={['chapter']}
    />
  );
}
