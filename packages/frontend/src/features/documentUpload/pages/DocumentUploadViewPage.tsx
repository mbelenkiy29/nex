import { DocumentUploadActions } from '@/features/documentUpload/components/DocumentUploadActions';
import { DocumentUploadLink } from '@/features/documentUpload/components/DocumentUploadLink';
import { FilesList } from '@/features/file/components/FilesList';
import { ImagesGallery } from '@/features/file/components/ImagesGallery';
import { MemberLink } from '@/features/member/components/MemberLink';
import { ExamLink } from '@/features/exam/components/ExamLink';
import { CopyToClipboardButton } from '@/shared/components/CopyToClipboardButton';
import { PageHeader } from '@/shared/components/PageHeader';
import { apiClient } from '@/shared/lib/apiClient';
import { formatDate } from '@project/backend/shared/lib/formatDate';
import { formatDateTime } from '@project/backend/shared/lib/formatDateTime';
import { useAuthStore } from '@/features/auth/authStore';
import { documentUploadLabel } from '@project/backend/features/documentUpload/documentUploadLabel';
import { DocumentUploadWithRelationships } from '@project/backend/features/documentUpload/documentUploadSchemas';
import { memberLabel } from '@project/backend/features/member/memberLabel';
import { examLabel } from '@project/backend/features/exam/examLabel';
import { dictionaryEnumerator } from '@project/backend/translation/dictionaryEnumerator';
import { formatDecimal } from '@project/backend/shared/lib/formatDecimal';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import {
  createLazyRoute,
  useNavigate,
  useSearch,
} from '@tanstack/react-router';
import { toast } from 'sonner';
import { documentUploadViewRoute } from '@/features/documentUpload/documentUploadRouter';

export const documentUploadViewLazyRoute = createLazyRoute(
  '/documentUpload/$id',
)({
  component: DocumentUploadViewPage,
});

export function DocumentUploadViewPage() {
  const { id } = documentUploadViewRoute.useParams();
  const searchParams = useSearch({ strict: false }) as Record<string, any>;
  const referrer = searchParams.referrer as string | undefined;
  const dictionary = useAuthStore((state) => state.dictionary);
  const locale = useAuthStore((state) => state.locale);
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const query = useQuery({
    queryKey: ['documentUpload', id],
    queryFn: async ({ signal }) => {
      return await apiClient
        .get(`api/document-upload/${id}`, { signal })
        .json<DocumentUploadWithRelationships>();
    },
    initialData: () =>
      (
        queryClient.getQueryData([
          'documentUpload',
        ]) as Array<DocumentUploadWithRelationships>
      )?.find((d) => d.id === id),
  });

  const documentUpload = query.data;

  if (query.isSuccess && !documentUpload) {
    if (referrer?.startsWith('/document-upload?')) {
      navigate({ to: referrer as any });
    } else {
      navigate({ to: '/document-upload' });
    }
    return null;
  }

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

  if (!documentUpload) {
    return null;
  }

  const documentUploadListPath = referrer?.startsWith('/document-upload?')
    ? referrer
    : '/document-upload';

  return (
    <div className="flex flex-1 flex-col p-6">
      <div className="flex items-center justify-between">
        <PageHeader
          items={[
            [dictionary.documentUpload.list.menu, documentUploadListPath],
            [documentUploadLabel(documentUpload, dictionary, locale)],
          ]}
        />
        <div className="flex gap-2">
          <DocumentUploadActions
            mode="view"
            documentUpload={documentUpload}
            referrer={referrer}
          />
        </div>
      </div>

      <div className="my-6 divide-y border-t">
        {Boolean(documentUpload.originalFilename) && (
          <div className="grid grid-cols-3 gap-4 py-4 text-sm lg:grid-cols-4">
            <div className="font-semibold">
              {dictionary.documentUpload.fields.originalFilename}
            </div>
            <div className="col-span-2 flex items-baseline gap-4 lg:col-span-3">
              <span>{documentUpload.originalFilename}</span>
              <CopyToClipboardButton text={documentUpload.originalFilename} />
            </div>
          </div>
        )}
        {documentUpload.status != null && (
          <div className="grid grid-cols-3 gap-4 py-4 text-sm lg:grid-cols-4">
            <div className="font-semibold">
              {dictionary.documentUpload.fields.status}
            </div>
            <div className="col-span-2 flex items-baseline gap-4 lg:col-span-3">
              <span>
                {dictionaryEnumerator(
                  dictionary.documentUpload.enumerators.status,
                  documentUpload.status,
                )}
              </span>
              <CopyToClipboardButton
                text={dictionaryEnumerator(
                  dictionary.documentUpload.enumerators.status,
                  documentUpload.status,
                )}
              />
            </div>
          </div>
        )}
        {documentUpload.pageCount != null && (
          <div className="grid grid-cols-3 gap-4 py-4 text-sm lg:grid-cols-4">
            <div className="font-semibold">
              {dictionary.documentUpload.fields.pageCount}
            </div>
            <div className="col-span-2 flex items-baseline gap-4 lg:col-span-3">
              <span>{documentUpload.pageCount}</span>
              <CopyToClipboardButton
                text={documentUpload.pageCount.toString()}
              />
            </div>
          </div>
        )}
        {documentUpload.wordCount != null && (
          <div className="grid grid-cols-3 gap-4 py-4 text-sm lg:grid-cols-4">
            <div className="font-semibold">
              {dictionary.documentUpload.fields.wordCount}
            </div>
            <div className="col-span-2 flex items-baseline gap-4 lg:col-span-3">
              <span>{documentUpload.wordCount}</span>
              <CopyToClipboardButton
                text={documentUpload.wordCount.toString()}
              />
            </div>
          </div>
        )}
        {Boolean(documentUpload.processingError) && (
          <div className="grid grid-cols-3 gap-4 py-4 text-sm lg:grid-cols-4">
            <div className="font-semibold">
              {dictionary.documentUpload.fields.processingError}
            </div>
            <div className="col-span-2 flex items-baseline gap-4 lg:col-span-3">
              <span>{documentUpload.processingError}</span>
              <CopyToClipboardButton text={documentUpload.processingError} />
            </div>
          </div>
        )}
        {Boolean((documentUpload.sourceFiles as Array<any>)?.length) && (
          <div className="grid grid-cols-3 gap-4 py-4 text-sm lg:grid-cols-4">
            <div className="font-semibold">
              {dictionary.documentUpload.fields.sourceFiles}
            </div>
            <div className="col-span-2">
              <FilesList files={documentUpload.sourceFiles as Array<any>} />
            </div>
          </div>
        )}
        {documentUpload.exam != null && (
          <div className="grid grid-cols-3 gap-4 py-4 text-sm lg:grid-cols-4">
            <div className="font-semibold">
              {dictionary.documentUpload.fields.exam}
            </div>
            <div className="col-span-2 flex items-baseline gap-4 lg:col-span-3">
              <ExamLink exam={documentUpload.exam} />
              <CopyToClipboardButton
                text={examLabel(documentUpload.exam, dictionary, locale)}
              />
            </div>
          </div>
        )}
        {documentUpload.uploadedBy != null && (
          <div className="grid grid-cols-3 gap-4 py-4 text-sm lg:grid-cols-4">
            <div className="font-semibold">
              {dictionary.documentUpload.fields.uploadedBy}
            </div>
            <div className="col-span-2 flex items-baseline gap-4 lg:col-span-3">
              <MemberLink member={documentUpload.uploadedBy} />
              <CopyToClipboardButton
                text={memberLabel(documentUpload.uploadedBy)}
              />
            </div>
          </div>
        )}

        {documentUpload.createdByMember != null && (
          <div className="grid grid-cols-3 gap-4 py-4 text-sm lg:grid-cols-4">
            <div className="font-semibold">
              {dictionary.documentUpload.fields.createdByMember}
            </div>
            <div className="col-span-2 flex items-baseline gap-4 lg:col-span-3">
              <MemberLink member={documentUpload.createdByMember} />
              <CopyToClipboardButton
                text={memberLabel(documentUpload.createdByMember)}
              />
            </div>
          </div>
        )}

        {documentUpload.createdAt != null && (
          <div className="grid grid-cols-3 gap-4 py-4 text-sm lg:grid-cols-4">
            <div className="font-semibold">
              {dictionary.documentUpload.fields.createdAt}
            </div>
            <div className="col-span-2 flex items-baseline gap-4 lg:col-span-3">
              <span>
                {formatDateTime(documentUpload.createdAt, dictionary)}
              </span>
              <CopyToClipboardButton
                text={formatDateTime(documentUpload.createdAt, dictionary)}
              />
            </div>
          </div>
        )}

        {documentUpload.updatedByMember != null && (
          <div className="grid grid-cols-3 gap-4 py-4 text-sm lg:grid-cols-4">
            <div className="font-semibold">
              {dictionary.documentUpload.fields.updatedByMember}
            </div>
            <div className="col-span-2 flex items-baseline gap-4 lg:col-span-3">
              <MemberLink member={documentUpload.updatedByMember} />
              <CopyToClipboardButton
                text={memberLabel(documentUpload.updatedByMember)}
              />
            </div>
          </div>
        )}

        {documentUpload.updatedAt != null && (
          <div className="grid grid-cols-3 gap-4 py-4 text-sm lg:grid-cols-4">
            <div className="font-semibold">
              {dictionary.documentUpload.fields.updatedAt}
            </div>
            <div className="col-span-2 flex items-baseline gap-4 lg:col-span-3">
              <span>
                {formatDateTime(documentUpload.updatedAt, dictionary)}
              </span>
              <CopyToClipboardButton
                text={formatDateTime(documentUpload.updatedAt, dictionary)}
              />
            </div>
          </div>
        )}

        {documentUpload.archivedByMember != null && (
          <div className="group grid grid-cols-3 gap-4 py-4 text-sm lg:grid-cols-4">
            <div className="font-semibold">
              {dictionary.documentUpload.fields.archivedByMember}
            </div>
            <div className="col-span-2 flex items-baseline gap-4 lg:col-span-3">
              <MemberLink member={documentUpload.archivedByMember} />
              <CopyToClipboardButton
                text={memberLabel(documentUpload.archivedByMember)}
              />
            </div>
          </div>
        )}

        {documentUpload.archivedAt != null && (
          <div className="group grid grid-cols-3 gap-4 py-4 text-sm lg:grid-cols-4">
            <div className="font-semibold">
              {dictionary.documentUpload.fields.archivedAt}
            </div>
            <div className="col-span-2 flex items-baseline gap-4 lg:col-span-3">
              <span>
                {formatDateTime(documentUpload.archivedAt, dictionary)}
              </span>
              <CopyToClipboardButton
                text={formatDateTime(documentUpload.archivedAt, dictionary)}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
