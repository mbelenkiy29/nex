import { createLazyRoute } from '@tanstack/react-router';
import { useAuthStore } from '@/features/auth/authStore';
import {
  documentUploadImportFileSchema,
  documentUploadImportInputSchema,
} from '@project/backend/features/documentUpload/documentUploadSchemas';
import { storage } from '@project/backend/features/permissions';
import { Importer } from '@/shared/components/importer/Importer';
import { apiClient } from '@/shared/lib/apiClient';

export const documentUploadImporterLazyRoute = createLazyRoute(
  '/document-upload/importer',
)({
  component: DocumentUploadImporterPage,
});

export function DocumentUploadImporterPage() {
  const dictionary = useAuthStore((state) => state.dictionary);

  return (
    <Importer
      keys={[
        'originalFilename',
        'status',
        'pageCount',
        'wordCount',
        'processingError',
        'sourceFiles',
        'exam',
        'uploadedBy',
      ]}
      labels={dictionary.documentUpload.fields}
      validationSchema={documentUploadImportInputSchema}
      fileSchema={documentUploadImportFileSchema}
      importerFn={async (data: any) => {
        return await apiClient
          .post('api/document-upload/importer', { json: data })
          .json();
      }}
      breadcrumbRoot={[dictionary.documentUpload.list.menu, '/document-upload']}
      breadcrumbImporterMenu={dictionary.documentUpload.importer.menu}
      importerTitle={dictionary.documentUpload.importer.title}
      queryKeyToInvalidate={['documentUpload']}
      fileFields={[
        {
          field: 'sourceFiles',
          storage: storage.documentUploadSourceFiles,
          multiple: true,
          required: false,
        },
      ]}
    />
  );
}
