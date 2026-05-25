import {
  createLazyRoute,
  useNavigate,
  useSearch,
} from '@tanstack/react-router';
import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '@/features/auth/authStore';
import { useShallow } from 'zustand/react/shallow';
import { DocumentUploadForm } from '@/features/documentUpload/components/DocumentUploadForm';
import { PageHeader } from '@/shared/components/PageHeader';
import { apiClient } from '@/shared/lib/apiClient';
import { DocumentUploadWithRelationships } from '@project/backend/features/documentUpload/documentUploadSchemas';
import { documentUploadLabel } from '@project/backend/features/documentUpload/documentUploadLabel';
import { toast } from 'sonner';
import { documentUploadEditRoute } from '@/features/documentUpload/documentUploadRouter';

export const documentUploadEditLazyRoute = createLazyRoute(
  '/document-upload/$id/edit',
)({
  component: DocumentUploadEditPage,
});

export function DocumentUploadEditPage() {
  const { dictionary, locale } = useAuthStore(
    useShallow((state) => ({
      dictionary: state.dictionary,
      locale: state.locale,
    })),
  );
  const navigate = useNavigate();
  const { id } = documentUploadEditRoute.useParams();
  const searchParams = useSearch({ strict: false }) as Record<string, any>;
  const referrer = searchParams.referrer as string | undefined;

  const query = useQuery({
    queryKey: ['document-upload', id],
    queryFn: async ({ signal }) => {
      return await apiClient
        .get(`api/document-upload/${id}`, { signal })
        .json<DocumentUploadWithRelationships>();
    },
    staleTime: 0,
    gcTime: 0,
    refetchOnMount: 'always',
  });

  if (query.isError) {
    toast.error(
      (query.error as any).message || dictionary.shared.errors.unknown,
    );
    if (referrer?.startsWith('/document-upload?')) {
      navigate({ to: referrer as any });
    } else {
      navigate({ to: '/document-upload' });
    }
    return null;
  }

  if (!query.data) {
    return null;
  }

  const documentUpload = query.data;
  const documentUploadListPath = referrer?.startsWith('/document-upload?')
    ? referrer
    : '/document-upload';

  return (
    <div className="flex flex-1 flex-col p-6">
      <PageHeader
        items={[
          [dictionary.documentUpload.list.menu, documentUploadListPath],
          [
            documentUploadLabel(documentUpload, dictionary, locale),
            `/document-upload/${documentUpload?.id}${referrer ? `?referrer=${encodeURIComponent(referrer)}` : ''}`,
          ],
          [dictionary.documentUpload.edit.menu],
        ]}
      />
      <div className="my-10">
        <DocumentUploadForm
          documentUpload={documentUpload}
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
