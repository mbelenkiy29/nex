import { ExamInstanceActions } from '@/features/examInstance/components/ExamInstanceActions';
import { ExamInstanceLink } from '@/features/examInstance/components/ExamInstanceLink';
import { FilesList } from '@/features/file/components/FilesList';
import { ImagesGallery } from '@/features/file/components/ImagesGallery';
import { MemberLink } from '@/features/member/components/MemberLink';
import { ExamTypeLink } from '@/features/examType/components/ExamTypeLink';
import { CopyToClipboardButton } from '@/shared/components/CopyToClipboardButton';
import { PageHeader } from '@/shared/components/PageHeader';
import { apiClient } from '@/shared/lib/apiClient';
import { formatDate } from '@project/backend/shared/lib/formatDate';
import { formatDateTime } from '@project/backend/shared/lib/formatDateTime';
import { useAuthStore } from '@/features/auth/authStore';
import { examInstanceLabel } from '@project/backend/features/examInstance/examInstanceLabel';
import { ExamInstanceWithRelationships } from '@project/backend/features/examInstance/examInstanceSchemas';
import { memberLabel } from '@project/backend/features/member/memberLabel';
import { examTypeLabel } from '@project/backend/features/examType/examTypeLabel';
import { dictionaryEnumerator } from '@project/backend/translation/dictionaryEnumerator';
import { formatDecimal } from '@project/backend/shared/lib/formatDecimal';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import {
  createLazyRoute,
  useNavigate,
  useSearch,
} from '@tanstack/react-router';
import { toast } from 'sonner';
import { examInstanceViewRoute } from '@/features/examInstance/examInstanceRouter';

export const examInstanceViewLazyRoute = createLazyRoute('/examInstance/$id')({
  component: ExamInstanceViewPage,
});

export function ExamInstanceViewPage() {
  const { id } = examInstanceViewRoute.useParams();
  const searchParams = useSearch({ strict: false }) as Record<string, any>;
  const referrer = searchParams.referrer as string | undefined;
  const dictionary = useAuthStore((state) => state.dictionary);
  const locale = useAuthStore((state) => state.locale);
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const query = useQuery({
    queryKey: ['examInstance', id],
    queryFn: async ({ signal }) => {
      return await apiClient
        .get(`api/exam-instance/${id}`, { signal })
        .json<ExamInstanceWithRelationships>();
    },
    initialData: () =>
      (
        queryClient.getQueryData([
          'examInstance',
        ]) as Array<ExamInstanceWithRelationships>
      )?.find((d) => d.id === id),
  });

  const examInstance = query.data;

  if (query.isSuccess && !examInstance) {
    if (referrer?.startsWith('/exam-instance?')) {
      navigate({ to: referrer as any });
    } else {
      navigate({ to: '/exam-instance' });
    }
    return null;
  }

  if (query.isError) {
    toast.error(
      (query.error as any).message || dictionary.shared.errors.unknown,
    );
    if (referrer?.startsWith('/exam-instance?')) {
      navigate({ to: referrer as any });
    } else {
      navigate({ to: '/exam-instance' });
    }
    return null;
  }

  if (!examInstance) {
    return null;
  }

  const examInstanceListPath = referrer?.startsWith('/exam-instance?')
    ? referrer
    : '/exam-instance';

  return (
    <div className="flex flex-1 flex-col p-6">
      <div className="flex items-center justify-between">
        <PageHeader
          items={[
            [dictionary.examInstance.list.menu, examInstanceListPath],
            [examInstanceLabel(examInstance, dictionary, locale)],
          ]}
        />
        <div className="flex gap-2">
          <ExamInstanceActions
            mode="view"
            examInstance={examInstance}
            referrer={referrer}
          />
        </div>
      </div>

      <div className="my-6 divide-y border-t">
        {examInstance.status != null && (
          <div className="grid grid-cols-3 gap-4 py-4 text-sm lg:grid-cols-4">
            <div className="font-semibold">
              {dictionary.examInstance.fields.status}
            </div>
            <div className="col-span-2 flex items-baseline gap-4 lg:col-span-3">
              <span>
                {dictionaryEnumerator(
                  dictionary.examInstance.enumerators.status,
                  examInstance.status,
                )}
              </span>
              <CopyToClipboardButton
                text={dictionaryEnumerator(
                  dictionary.examInstance.enumerators.status,
                  examInstance.status,
                )}
              />
            </div>
          </div>
        )}
        {examInstance.score != null && (
          <div className="grid grid-cols-3 gap-4 py-4 text-sm lg:grid-cols-4">
            <div className="font-semibold">
              {dictionary.examInstance.fields.score}
            </div>
            <div className="col-span-2 flex items-baseline gap-4 lg:col-span-3">
              <span>
                {formatDecimal(examInstance.score?.toString(), locale, 2)}
              </span>
              <CopyToClipboardButton
                text={formatDecimal(examInstance.score?.toString(), locale, 2)}
              />
            </div>
          </div>
        )}
        {examInstance.passed != null && (
          <div className="grid grid-cols-3 gap-4 py-4 text-sm lg:grid-cols-4">
            <div className="font-semibold">
              {dictionary.examInstance.fields.passed}
            </div>
            <div className="col-span-2 flex items-baseline gap-4 lg:col-span-3">
              <span>
                {examInstance.passed
                  ? dictionary.shared.yes
                  : dictionary.shared.no}
              </span>
              <CopyToClipboardButton
                text={
                  examInstance.passed
                    ? dictionary.shared.yes
                    : dictionary.shared.no
                }
              />
            </div>
          </div>
        )}
        {examInstance.startedAt != null && (
          <div className="grid grid-cols-3 gap-4 py-4 text-sm lg:grid-cols-4">
            <div className="font-semibold">
              {dictionary.examInstance.fields.startedAt}
            </div>
            <div className="col-span-2 flex items-baseline gap-4 lg:col-span-3">
              <span>{formatDateTime(examInstance.startedAt, dictionary)}</span>
              <CopyToClipboardButton
                text={formatDateTime(examInstance.startedAt, dictionary)}
              />
            </div>
          </div>
        )}
        {examInstance.completedAt != null && (
          <div className="grid grid-cols-3 gap-4 py-4 text-sm lg:grid-cols-4">
            <div className="font-semibold">
              {dictionary.examInstance.fields.completedAt}
            </div>
            <div className="col-span-2 flex items-baseline gap-4 lg:col-span-3">
              <span>
                {formatDateTime(examInstance.completedAt, dictionary)}
              </span>
              <CopyToClipboardButton
                text={formatDateTime(examInstance.completedAt, dictionary)}
              />
            </div>
          </div>
        )}
        {examInstance.timeSpentSeconds != null && (
          <div className="grid grid-cols-3 gap-4 py-4 text-sm lg:grid-cols-4">
            <div className="font-semibold">
              {dictionary.examInstance.fields.timeSpentSeconds}
            </div>
            <div className="col-span-2 flex items-baseline gap-4 lg:col-span-3">
              <span>{examInstance.timeSpentSeconds}</span>
              <CopyToClipboardButton
                text={examInstance.timeSpentSeconds.toString()}
              />
            </div>
          </div>
        )}
        {examInstance.examType != null && (
          <div className="grid grid-cols-3 gap-4 py-4 text-sm lg:grid-cols-4">
            <div className="font-semibold">
              {dictionary.examInstance.fields.examType}
            </div>
            <div className="col-span-2 flex items-baseline gap-4 lg:col-span-3">
              <ExamTypeLink examType={examInstance.examType} />
              <CopyToClipboardButton
                text={examTypeLabel(examInstance.examType, dictionary, locale)}
              />
            </div>
          </div>
        )}
        {examInstance.student != null && (
          <div className="grid grid-cols-3 gap-4 py-4 text-sm lg:grid-cols-4">
            <div className="font-semibold">
              {dictionary.examInstance.fields.student}
            </div>
            <div className="col-span-2 flex items-baseline gap-4 lg:col-span-3">
              <MemberLink member={examInstance.student} />
              <CopyToClipboardButton text={memberLabel(examInstance.student)} />
            </div>
          </div>
        )}

        {examInstance.createdByMember != null && (
          <div className="grid grid-cols-3 gap-4 py-4 text-sm lg:grid-cols-4">
            <div className="font-semibold">
              {dictionary.examInstance.fields.createdByMember}
            </div>
            <div className="col-span-2 flex items-baseline gap-4 lg:col-span-3">
              <MemberLink member={examInstance.createdByMember} />
              <CopyToClipboardButton
                text={memberLabel(examInstance.createdByMember)}
              />
            </div>
          </div>
        )}

        {examInstance.createdAt != null && (
          <div className="grid grid-cols-3 gap-4 py-4 text-sm lg:grid-cols-4">
            <div className="font-semibold">
              {dictionary.examInstance.fields.createdAt}
            </div>
            <div className="col-span-2 flex items-baseline gap-4 lg:col-span-3">
              <span>{formatDateTime(examInstance.createdAt, dictionary)}</span>
              <CopyToClipboardButton
                text={formatDateTime(examInstance.createdAt, dictionary)}
              />
            </div>
          </div>
        )}

        {examInstance.updatedByMember != null && (
          <div className="grid grid-cols-3 gap-4 py-4 text-sm lg:grid-cols-4">
            <div className="font-semibold">
              {dictionary.examInstance.fields.updatedByMember}
            </div>
            <div className="col-span-2 flex items-baseline gap-4 lg:col-span-3">
              <MemberLink member={examInstance.updatedByMember} />
              <CopyToClipboardButton
                text={memberLabel(examInstance.updatedByMember)}
              />
            </div>
          </div>
        )}

        {examInstance.updatedAt != null && (
          <div className="grid grid-cols-3 gap-4 py-4 text-sm lg:grid-cols-4">
            <div className="font-semibold">
              {dictionary.examInstance.fields.updatedAt}
            </div>
            <div className="col-span-2 flex items-baseline gap-4 lg:col-span-3">
              <span>{formatDateTime(examInstance.updatedAt, dictionary)}</span>
              <CopyToClipboardButton
                text={formatDateTime(examInstance.updatedAt, dictionary)}
              />
            </div>
          </div>
        )}

        {examInstance.archivedByMember != null && (
          <div className="group grid grid-cols-3 gap-4 py-4 text-sm lg:grid-cols-4">
            <div className="font-semibold">
              {dictionary.examInstance.fields.archivedByMember}
            </div>
            <div className="col-span-2 flex items-baseline gap-4 lg:col-span-3">
              <MemberLink member={examInstance.archivedByMember} />
              <CopyToClipboardButton
                text={memberLabel(examInstance.archivedByMember)}
              />
            </div>
          </div>
        )}

        {examInstance.archivedAt != null && (
          <div className="group grid grid-cols-3 gap-4 py-4 text-sm lg:grid-cols-4">
            <div className="font-semibold">
              {dictionary.examInstance.fields.archivedAt}
            </div>
            <div className="col-span-2 flex items-baseline gap-4 lg:col-span-3">
              <span>{formatDateTime(examInstance.archivedAt, dictionary)}</span>
              <CopyToClipboardButton
                text={formatDateTime(examInstance.archivedAt, dictionary)}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
