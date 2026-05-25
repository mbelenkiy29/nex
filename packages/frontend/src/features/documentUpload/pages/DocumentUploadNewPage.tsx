import {
  createLazyRoute,
  useNavigate,
  useSearch,
} from '@tanstack/react-router';
import { useAuthStore } from '@/features/auth/authStore';
import { DocumentUploadForm } from '@/features/documentUpload/components/DocumentUploadForm';
import { PageHeader } from '@/shared/components/PageHeader';
import { DocumentUploadWithRelationships } from '@project/backend/features/documentUpload/documentUploadSchemas';

export const documentUploadNewLazyRoute = createLazyRoute(
  '/document-upload/new',
)({
  component: DocumentUploadNewPage,
});

export function DocumentUploadNewPage() {
  const dictionary = useAuthStore((state) => state.dictionary);
  const navigate = useNavigate();
  const searchParams = useSearch({ strict: false }) as Record<string, any>;
  const referrer = searchParams.referrer as string | undefined;

  const documentUploadListPath = referrer?.startsWith('/document-upload?')
    ? referrer
    : '/document-upload';

  return (
    <div className="flex flex-1 flex-col p-6">
      <PageHeader
        items={[
          [dictionary.documentUpload.list.menu, documentUploadListPath],
          [dictionary.documentUpload.new.menu],
        ]}
      />
      <div className="my-10">
        <DocumentUploadForm
          onSuccess={(documentUpload: DocumentUploadWithRelationships) =>
            navigate({
              to: `/document-upload/${documentUpload.id}`,
              search: referrer ? { referrer } : undefined,
            })
          }
          onCancel={() =>
            referrer?.startsWith('/document-upload?')
              ? navigate({ to: referrer as any })
              : navigate({ to: '/document-upload' })
          }
        />
      </div>
    </div>
  );
}
