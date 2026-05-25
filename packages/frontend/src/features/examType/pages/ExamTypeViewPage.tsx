import { ExamTypeActions } from '@/features/examType/components/ExamTypeActions';
import { ExamTypeLink } from '@/features/examType/components/ExamTypeLink';
import { FilesList } from '@/features/file/components/FilesList';
import { ImagesGallery } from '@/features/file/components/ImagesGallery';
import { MemberLink } from '@/features/member/components/MemberLink';
import { ExamLink } from '@/features/exam/components/ExamLink';
import { ExamInstanceLink } from '@/features/examInstance/components/ExamInstanceLink';
import { CopyToClipboardButton } from '@/shared/components/CopyToClipboardButton';
import { PageHeader } from '@/shared/components/PageHeader';
import { apiClient } from '@/shared/lib/apiClient';
import { formatDate } from '@project/backend/shared/lib/formatDate';
import { formatDateTime } from '@project/backend/shared/lib/formatDateTime';
import { useAuthStore } from '@/features/auth/authStore';
import { examTypeLabel } from '@project/backend/features/examType/examTypeLabel';
import { ExamTypeWithRelationships } from '@project/backend/features/examType/examTypeSchemas';
import { memberLabel } from '@project/backend/features/member/memberLabel';
import { examLabel } from '@project/backend/features/exam/examLabel';
import { examInstanceLabel } from '@project/backend/features/examInstance/examInstanceLabel';
import { dictionaryEnumerator } from '@project/backend/translation/dictionaryEnumerator';
import { formatDecimal } from '@project/backend/shared/lib/formatDecimal';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import {
  createLazyRoute,
  useNavigate,
  useSearch,
} from '@tanstack/react-router';
import { toast } from 'sonner';
import { examTypeViewRoute } from '@/features/examType/examTypeRouter';

export const examTypeViewLazyRoute = createLazyRoute('/examType/$id')({
  component: ExamTypeViewPage,
});

export function ExamTypeViewPage() {
  const { id } = examTypeViewRoute.useParams();
  const searchParams = useSearch({ strict: false }) as Record<string, any>;
  const referrer = searchParams.referrer as string | undefined;
  const dictionary = useAuthStore((state) => state.dictionary);
  const locale = useAuthStore((state) => state.locale);
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const query = useQuery({
    queryKey: ['examType', id],
    queryFn: async ({ signal }) => {
      return await apiClient
        .get(`api/exam-type/${id}`, { signal })
        .json<ExamTypeWithRelationships>();
    },
    initialData: () =>
      (
        queryClient.getQueryData([
          'examType',
        ]) as Array<ExamTypeWithRelationships>
      )?.find((d) => d.id === id),
  });

  const examType = query.data;

  if (query.isSuccess && !examType) {
    if (referrer?.startsWith('/exam-type?')) {
      navigate({ to: referrer as any });
    } else {
      navigate({ to: '/exam-type' });
    }
    return null;
  }

  if (query.isError) {
    toast.error(
      (query.error as any).message || dictionary.shared.errors.unknown,
    );
    if (referrer?.startsWith('/exam-type?')) {
      navigate({ to: referrer as any });
    } else {
      navigate({ to: '/exam-type' });
    }
    return null;
  }

  if (!examType) {
    return null;
  }

  const examTypeListPath = referrer?.startsWith('/exam-type?')
    ? referrer
    : '/exam-type';

  return (
    <div className="flex flex-1 flex-col p-6">
      <div className="flex items-center justify-between">
        <PageHeader
          items={[
            [dictionary.examType.list.menu, examTypeListPath],
            [examTypeLabel(examType, dictionary, locale)],
          ]}
        />
        <div className="flex gap-2">
          <ExamTypeActions
            mode="view"
            examType={examType}
            referrer={referrer}
          />
        </div>
      </div>

      <div className="my-6 divide-y border-t">
        {Boolean(examType.name) && (
          <div className="grid grid-cols-3 gap-4 py-4 text-sm lg:grid-cols-4">
            <div className="font-semibold">
              {dictionary.examType.fields.name}
            </div>
            <div className="col-span-2 flex items-baseline gap-4 lg:col-span-3">
              <span>{examType.name}</span>
              <CopyToClipboardButton text={examType.name} />
            </div>
          </div>
        )}
        {Boolean(examType.description) && (
          <div className="grid grid-cols-3 gap-4 py-4 text-sm lg:grid-cols-4">
            <div className="font-semibold">
              {dictionary.examType.fields.description}
            </div>
            <div className="col-span-2 flex items-baseline gap-4 lg:col-span-3">
              <span>{examType.description}</span>
              <CopyToClipboardButton text={examType.description} />
            </div>
          </div>
        )}
        {examType.type != null && (
          <div className="grid grid-cols-3 gap-4 py-4 text-sm lg:grid-cols-4">
            <div className="font-semibold">
              {dictionary.examType.fields.type}
            </div>
            <div className="col-span-2 flex items-baseline gap-4 lg:col-span-3">
              <span>
                {dictionaryEnumerator(
                  dictionary.examType.enumerators.type,
                  examType.type,
                )}
              </span>
              <CopyToClipboardButton
                text={dictionaryEnumerator(
                  dictionary.examType.enumerators.type,
                  examType.type,
                )}
              />
            </div>
          </div>
        )}
        {examType.questionCount != null && (
          <div className="grid grid-cols-3 gap-4 py-4 text-sm lg:grid-cols-4">
            <div className="font-semibold">
              {dictionary.examType.fields.questionCount}
            </div>
            <div className="col-span-2 flex items-baseline gap-4 lg:col-span-3">
              <span>{examType.questionCount}</span>
              <CopyToClipboardButton text={examType.questionCount.toString()} />
            </div>
          </div>
        )}
        {examType.timeLimitMinutes != null && (
          <div className="grid grid-cols-3 gap-4 py-4 text-sm lg:grid-cols-4">
            <div className="font-semibold">
              {dictionary.examType.fields.timeLimitMinutes}
            </div>
            <div className="col-span-2 flex items-baseline gap-4 lg:col-span-3">
              <span>{examType.timeLimitMinutes}</span>
              <CopyToClipboardButton
                text={examType.timeLimitMinutes.toString()}
              />
            </div>
          </div>
        )}
        {examType.passingScore != null && (
          <div className="grid grid-cols-3 gap-4 py-4 text-sm lg:grid-cols-4">
            <div className="font-semibold">
              {dictionary.examType.fields.passingScore}
            </div>
            <div className="col-span-2 flex items-baseline gap-4 lg:col-span-3">
              <span>{examType.passingScore}</span>
              <CopyToClipboardButton text={examType.passingScore.toString()} />
            </div>
          </div>
        )}
        {examType.maxAttempts != null && (
          <div className="grid grid-cols-3 gap-4 py-4 text-sm lg:grid-cols-4">
            <div className="font-semibold">
              {dictionary.examType.fields.maxAttempts}
            </div>
            <div className="col-span-2 flex items-baseline gap-4 lg:col-span-3">
              <span>{examType.maxAttempts}</span>
              <CopyToClipboardButton text={examType.maxAttempts.toString()} />
            </div>
          </div>
        )}
        {examType.shuffleQuestions != null && (
          <div className="grid grid-cols-3 gap-4 py-4 text-sm lg:grid-cols-4">
            <div className="font-semibold">
              {dictionary.examType.fields.shuffleQuestions}
            </div>
            <div className="col-span-2 flex items-baseline gap-4 lg:col-span-3">
              <span>
                {examType.shuffleQuestions
                  ? dictionary.shared.yes
                  : dictionary.shared.no}
              </span>
              <CopyToClipboardButton
                text={
                  examType.shuffleQuestions
                    ? dictionary.shared.yes
                    : dictionary.shared.no
                }
              />
            </div>
          </div>
        )}
        {examType.showAnswersImmediately != null && (
          <div className="grid grid-cols-3 gap-4 py-4 text-sm lg:grid-cols-4">
            <div className="font-semibold">
              {dictionary.examType.fields.showAnswersImmediately}
            </div>
            <div className="col-span-2 flex items-baseline gap-4 lg:col-span-3">
              <span>
                {examType.showAnswersImmediately
                  ? dictionary.shared.yes
                  : dictionary.shared.no}
              </span>
              <CopyToClipboardButton
                text={
                  examType.showAnswersImmediately
                    ? dictionary.shared.yes
                    : dictionary.shared.no
                }
              />
            </div>
          </div>
        )}
        {examType.isActive != null && (
          <div className="grid grid-cols-3 gap-4 py-4 text-sm lg:grid-cols-4">
            <div className="font-semibold">
              {dictionary.examType.fields.isActive}
            </div>
            <div className="col-span-2 flex items-baseline gap-4 lg:col-span-3">
              <span>
                {examType.isActive
                  ? dictionary.shared.yes
                  : dictionary.shared.no}
              </span>
              <CopyToClipboardButton
                text={
                  examType.isActive
                    ? dictionary.shared.yes
                    : dictionary.shared.no
                }
              />
            </div>
          </div>
        )}
        {examType.exam != null && (
          <div className="grid grid-cols-3 gap-4 py-4 text-sm lg:grid-cols-4">
            <div className="font-semibold">
              {dictionary.examType.fields.exam}
            </div>
            <div className="col-span-2 flex items-baseline gap-4 lg:col-span-3">
              <ExamLink exam={examType.exam} />
              <CopyToClipboardButton
                text={examLabel(examType.exam, dictionary, locale)}
              />
            </div>
          </div>
        )}
        {examType.examInstances?.length ? (
          <div className="grid grid-cols-3 gap-4 py-4 text-sm lg:grid-cols-4">
            <div className="font-semibold">
              {dictionary.examType.fields.examInstances}
            </div>
            <div className="col-span-2 flex flex-col gap-1">
              {examType.examInstances?.map((item) => {
                return (
                  <div key={item?.id} className="flex items-center gap-4">
                    <ExamInstanceLink
                      examInstance={item}
                      className="whitespace-nowrap"
                    />
                    <CopyToClipboardButton
                      text={examInstanceLabel(item, dictionary, locale)}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        ) : null}

        {examType.createdByMember != null && (
          <div className="grid grid-cols-3 gap-4 py-4 text-sm lg:grid-cols-4">
            <div className="font-semibold">
              {dictionary.examType.fields.createdByMember}
            </div>
            <div className="col-span-2 flex items-baseline gap-4 lg:col-span-3">
              <MemberLink member={examType.createdByMember} />
              <CopyToClipboardButton
                text={memberLabel(examType.createdByMember)}
              />
            </div>
          </div>
        )}

        {examType.createdAt != null && (
          <div className="grid grid-cols-3 gap-4 py-4 text-sm lg:grid-cols-4">
            <div className="font-semibold">
              {dictionary.examType.fields.createdAt}
            </div>
            <div className="col-span-2 flex items-baseline gap-4 lg:col-span-3">
              <span>{formatDateTime(examType.createdAt, dictionary)}</span>
              <CopyToClipboardButton
                text={formatDateTime(examType.createdAt, dictionary)}
              />
            </div>
          </div>
        )}

        {examType.updatedByMember != null && (
          <div className="grid grid-cols-3 gap-4 py-4 text-sm lg:grid-cols-4">
            <div className="font-semibold">
              {dictionary.examType.fields.updatedByMember}
            </div>
            <div className="col-span-2 flex items-baseline gap-4 lg:col-span-3">
              <MemberLink member={examType.updatedByMember} />
              <CopyToClipboardButton
                text={memberLabel(examType.updatedByMember)}
              />
            </div>
          </div>
        )}

        {examType.updatedAt != null && (
          <div className="grid grid-cols-3 gap-4 py-4 text-sm lg:grid-cols-4">
            <div className="font-semibold">
              {dictionary.examType.fields.updatedAt}
            </div>
            <div className="col-span-2 flex items-baseline gap-4 lg:col-span-3">
              <span>{formatDateTime(examType.updatedAt, dictionary)}</span>
              <CopyToClipboardButton
                text={formatDateTime(examType.updatedAt, dictionary)}
              />
            </div>
          </div>
        )}

        {examType.archivedByMember != null && (
          <div className="group grid grid-cols-3 gap-4 py-4 text-sm lg:grid-cols-4">
            <div className="font-semibold">
              {dictionary.examType.fields.archivedByMember}
            </div>
            <div className="col-span-2 flex items-baseline gap-4 lg:col-span-3">
              <MemberLink member={examType.archivedByMember} />
              <CopyToClipboardButton
                text={memberLabel(examType.archivedByMember)}
              />
            </div>
          </div>
        )}

        {examType.archivedAt != null && (
          <div className="group grid grid-cols-3 gap-4 py-4 text-sm lg:grid-cols-4">
            <div className="font-semibold">
              {dictionary.examType.fields.archivedAt}
            </div>
            <div className="col-span-2 flex items-baseline gap-4 lg:col-span-3">
              <span>{formatDateTime(examType.archivedAt, dictionary)}</span>
              <CopyToClipboardButton
                text={formatDateTime(examType.archivedAt, dictionary)}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
