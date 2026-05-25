import { createLazyRoute } from '@tanstack/react-router';
import { useAuthStore } from '@/features/auth/authStore';
import {
  studyNoteImportFileSchema,
  studyNoteImportInputSchema,
} from '@project/backend/features/studyNote/studyNoteSchemas';
import { storage } from '@project/backend/features/permissions';
import { Importer } from '@/shared/components/importer/Importer';
import { apiClient } from '@/shared/lib/apiClient';

export const studyNoteImporterLazyRoute = createLazyRoute(
  '/study-note/importer',
)({
  component: StudyNoteImporterPage,
});

export function StudyNoteImporterPage() {
  const dictionary = useAuthStore((state) => state.dictionary);

  return (
    <Importer
      keys={[
        'title',
        'content',
        'isFavorite',
        'tags',
        'chapter',
        'lesson',
        'author',
      ]}
      labels={dictionary.studyNote.fields}
      validationSchema={studyNoteImportInputSchema}
      fileSchema={studyNoteImportFileSchema}
      importerFn={async (data: any) => {
        return await apiClient
          .post('api/study-note/importer', { json: data })
          .json();
      }}
      breadcrumbRoot={[dictionary.studyNote.list.menu, '/study-note']}
      breadcrumbImporterMenu={dictionary.studyNote.importer.menu}
      importerTitle={dictionary.studyNote.importer.title}
      queryKeyToInvalidate={['studyNote']}
    />
  );
}
