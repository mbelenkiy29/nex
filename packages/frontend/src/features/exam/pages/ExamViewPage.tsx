import { ExamActions } from '@/features/exam/components/ExamActions';
import { ExamLink } from '@/features/exam/components/ExamLink';
import { FilesList } from '@/features/file/components/FilesList';
import { ImagesGallery } from '@/features/file/components/ImagesGallery';
import { MemberLink } from '@/features/member/components/MemberLink';
import { ChapterLink } from '@/features/chapter/components/ChapterLink';
import { ConceptLink } from '@/features/concept/components/ConceptLink';
import { ExamTypeLink } from '@/features/examType/components/ExamTypeLink';
import { DocumentUploadLink } from '@/features/documentUpload/components/DocumentUploadLink';
import { CopyToClipboardButton } from '@/shared/components/CopyToClipboardButton';
import { PageHeader } from '@/shared/components/PageHeader';
import { apiClient } from '@/shared/lib/apiClient';
import { formatDate } from '@project/backend/shared/lib/formatDate';
import { formatDateTime } from '@project/backend/shared/lib/formatDateTime';
import { useAuthStore } from '@/features/auth/authStore';
import { examLabel } from '@project/backend/features/exam/examLabel';
import { ExamWithRelationships } from '@project/backend/features/exam/examSchemas';
import { memberLabel } from '@project/backend/features/member/memberLabel';
import { chapterLabel } from '@project/backend/features/chapter/chapterLabel';
import { conceptLabel } from '@project/backend/features/concept/conceptLabel';
import { examTypeLabel } from '@project/backend/features/examType/examTypeLabel';
import { documentUploadLabel } from '@project/backend/features/documentUpload/documentUploadLabel';
import { dictionaryEnumerator } from '@project/backend/translation/dictionaryEnumerator';
import { formatDecimal } from '@project/backend/shared/lib/formatDecimal';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import {
  createLazyRoute,
  useNavigate,
  useSearch,
} from '@tanstack/react-router';
import { toast } from 'sonner';
import { examViewRoute } from '@/features/exam/examRouter';

export const examViewLazyRoute = createLazyRoute('/exam/$id')({
  component: ExamViewPage,
});

export function ExamViewPage() {
  const { id } = examViewRoute.useParams();
  const searchParams = useSearch({ strict: false }) as Record<string, any>;
  const referrer = searchParams.referrer as string | undefined;
  const dictionary = useAuthStore((state) => state.dictionary);
  const locale = useAuthStore((state) => state.locale);
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const query = useQuery({
    queryKey: ['exam', id],
    queryFn: async ({ signal }) => {
      return await apiClient
        .get(`api/exam/${id}`, { signal })
        .json<ExamWithRelationships>();
    },
    initialData: () =>
      (
        queryClient.getQueryData(['exam']) as Array<ExamWithRelationships>
      )?.find((d) => d.id === id),
  });

  const exam = query.data;

  if (query.isSuccess && !exam) {
    if (referrer?.startsWith('/exam?')) {
      navigate({ to: referrer as any });
    } else {
      navigate({ to: '/exam' });
    }
    return null;
  }

  if (query.isError) {
    toast.error(
      (query.error as any).message || dictionary.shared.errors.unknown,
    );
    if (referrer?.startsWith('/exam?')) {
      navigate({ to: referrer as any });
    } else {
      navigate({ to: '/exam' });
    }
    return null;
  }

  if (!exam) {
    return null;
  }

  const examListPath = referrer?.startsWith('/exam?') ? referrer : '/exam';

  return (
    <div className="flex flex-1 flex-col p-6">
      <div className="flex items-center justify-between">
        <PageHeader
          items={[
            [dictionary.exam.list.menu, examListPath],
            [examLabel(exam, dictionary, locale)],
          ]}
        />
        <div className="flex gap-2">
          <ExamActions mode="view" exam={exam} referrer={referrer} />
        </div>
      </div>

      <div className="my-6 divide-y border-t">
        {Boolean(exam.name) && (
          <div className="grid grid-cols-3 gap-4 py-4 text-sm lg:grid-cols-4">
            <div className="font-semibold">{dictionary.exam.fields.name}</div>
            <div className="col-span-2 flex items-baseline gap-4 lg:col-span-3">
              <span>{exam.name}</span>
              <CopyToClipboardButton text={exam.name} />
            </div>
          </div>
        )}
        {Boolean(exam.code) && (
          <div className="grid grid-cols-3 gap-4 py-4 text-sm lg:grid-cols-4">
            <div className="font-semibold">{dictionary.exam.fields.code}</div>
            <div className="col-span-2 flex items-baseline gap-4 lg:col-span-3">
              <span>{exam.code}</span>
              <CopyToClipboardButton text={exam.code} />
            </div>
          </div>
        )}
        {Boolean(exam.description) && (
          <div className="grid grid-cols-3 gap-4 py-4 text-sm lg:grid-cols-4">
            <div className="font-semibold">
              {dictionary.exam.fields.description}
            </div>
            <div className="col-span-2 flex items-baseline gap-4 lg:col-span-3">
              <span>{exam.description}</span>
              <CopyToClipboardButton text={exam.description} />
            </div>
          </div>
        )}
        {Boolean(exam.iconUrl) && (
          <div className="grid grid-cols-3 gap-4 py-4 text-sm lg:grid-cols-4">
            <div className="font-semibold">
              {dictionary.exam.fields.iconUrl}
            </div>
            <div className="col-span-2 flex items-baseline gap-4 lg:col-span-3">
              <span>{exam.iconUrl}</span>
              <CopyToClipboardButton text={exam.iconUrl} />
            </div>
          </div>
        )}
        {exam.isActive != null && (
          <div className="grid grid-cols-3 gap-4 py-4 text-sm lg:grid-cols-4">
            <div className="font-semibold">
              {dictionary.exam.fields.isActive}
            </div>
            <div className="col-span-2 flex items-baseline gap-4 lg:col-span-3">
              <span>
                {exam.isActive ? dictionary.shared.yes : dictionary.shared.no}
              </span>
              <CopyToClipboardButton
                text={
                  exam.isActive ? dictionary.shared.yes : dictionary.shared.no
                }
              />
            </div>
          </div>
        )}
        {exam.chapters?.length ? (
          <div className="grid grid-cols-3 gap-4 py-4 text-sm lg:grid-cols-4">
            <div className="font-semibold">
              {dictionary.exam.fields.chapters}
            </div>
            <div className="col-span-2 flex flex-col gap-1">
              {exam.chapters?.map((item) => {
                return (
                  <div key={item?.id} className="flex items-center gap-4">
                    <ChapterLink chapter={item} className="whitespace-nowrap" />
                    <CopyToClipboardButton
                      text={chapterLabel(item, dictionary, locale)}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        ) : null}
        {exam.concepts?.length ? (
          <div className="grid grid-cols-3 gap-4 py-4 text-sm lg:grid-cols-4">
            <div className="font-semibold">
              {dictionary.exam.fields.concepts}
            </div>
            <div className="col-span-2 flex flex-col gap-1">
              {exam.concepts?.map((item) => {
                return (
                  <div key={item?.id} className="flex items-center gap-4">
                    <ConceptLink concept={item} className="whitespace-nowrap" />
                    <CopyToClipboardButton
                      text={conceptLabel(item, dictionary, locale)}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        ) : null}
        {exam.examTypes?.length ? (
          <div className="grid grid-cols-3 gap-4 py-4 text-sm lg:grid-cols-4">
            <div className="font-semibold">
              {dictionary.exam.fields.examTypes}
            </div>
            <div className="col-span-2 flex flex-col gap-1">
              {exam.examTypes?.map((item) => {
                return (
                  <div key={item?.id} className="flex items-center gap-4">
                    <ExamTypeLink
                      examType={item}
                      className="whitespace-nowrap"
                    />
                    <CopyToClipboardButton
                      text={examTypeLabel(item, dictionary, locale)}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        ) : null}
        {exam.documentUploads?.length ? (
          <div className="grid grid-cols-3 gap-4 py-4 text-sm lg:grid-cols-4">
            <div className="font-semibold">
              {dictionary.exam.fields.documentUploads}
            </div>
            <div className="col-span-2 flex flex-col gap-1">
              {exam.documentUploads?.map((item) => {
                return (
                  <div key={item?.id} className="flex items-center gap-4">
                    <DocumentUploadLink
                      documentUpload={item}
                      className="whitespace-nowrap"
                    />
                    <CopyToClipboardButton
                      text={documentUploadLabel(item, dictionary, locale)}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        ) : null}

        {exam.createdByMember != null && (
          <div className="grid grid-cols-3 gap-4 py-4 text-sm lg:grid-cols-4">
            <div className="font-semibold">
              {dictionary.exam.fields.createdByMember}
            </div>
            <div className="col-span-2 flex items-baseline gap-4 lg:col-span-3">
              <MemberLink member={exam.createdByMember} />
              <CopyToClipboardButton text={memberLabel(exam.createdByMember)} />
            </div>
          </div>
        )}

        {exam.createdAt != null && (
          <div className="grid grid-cols-3 gap-4 py-4 text-sm lg:grid-cols-4">
            <div className="font-semibold">
              {dictionary.exam.fields.createdAt}
            </div>
            <div className="col-span-2 flex items-baseline gap-4 lg:col-span-3">
              <span>{formatDateTime(exam.createdAt, dictionary)}</span>
              <CopyToClipboardButton
                text={formatDateTime(exam.createdAt, dictionary)}
              />
            </div>
          </div>
        )}

        {exam.updatedByMember != null && (
          <div className="grid grid-cols-3 gap-4 py-4 text-sm lg:grid-cols-4">
            <div className="font-semibold">
              {dictionary.exam.fields.updatedByMember}
            </div>
            <div className="col-span-2 flex items-baseline gap-4 lg:col-span-3">
              <MemberLink member={exam.updatedByMember} />
              <CopyToClipboardButton text={memberLabel(exam.updatedByMember)} />
            </div>
          </div>
        )}

        {exam.updatedAt != null && (
          <div className="grid grid-cols-3 gap-4 py-4 text-sm lg:grid-cols-4">
            <div className="font-semibold">
              {dictionary.exam.fields.updatedAt}
            </div>
            <div className="col-span-2 flex items-baseline gap-4 lg:col-span-3">
              <span>{formatDateTime(exam.updatedAt, dictionary)}</span>
              <CopyToClipboardButton
                text={formatDateTime(exam.updatedAt, dictionary)}
              />
            </div>
          </div>
        )}

        {exam.archivedByMember != null && (
          <div className="group grid grid-cols-3 gap-4 py-4 text-sm lg:grid-cols-4">
            <div className="font-semibold">
              {dictionary.exam.fields.archivedByMember}
            </div>
            <div className="col-span-2 flex items-baseline gap-4 lg:col-span-3">
              <MemberLink member={exam.archivedByMember} />
              <CopyToClipboardButton
                text={memberLabel(exam.archivedByMember)}
              />
            </div>
          </div>
        )}

        {exam.archivedAt != null && (
          <div className="group grid grid-cols-3 gap-4 py-4 text-sm lg:grid-cols-4">
            <div className="font-semibold">
              {dictionary.exam.fields.archivedAt}
            </div>
            <div className="col-span-2 flex items-baseline gap-4 lg:col-span-3">
              <span>{formatDateTime(exam.archivedAt, dictionary)}</span>
              <CopyToClipboardButton
                text={formatDateTime(exam.archivedAt, dictionary)}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
