import { PracticeQuestionActions } from '@/features/practiceQuestion/components/PracticeQuestionActions';
import { PracticeQuestionLink } from '@/features/practiceQuestion/components/PracticeQuestionLink';
import { FilesList } from '@/features/file/components/FilesList';
import { ImagesGallery } from '@/features/file/components/ImagesGallery';
import { MemberLink } from '@/features/member/components/MemberLink';
import { ChapterLink } from '@/features/chapter/components/ChapterLink';
import { ConceptLink } from '@/features/concept/components/ConceptLink';
import { CopyToClipboardButton } from '@/shared/components/CopyToClipboardButton';
import { PageHeader } from '@/shared/components/PageHeader';
import { apiClient } from '@/shared/lib/apiClient';
import { formatDate } from '@project/backend/shared/lib/formatDate';
import { formatDateTime } from '@project/backend/shared/lib/formatDateTime';
import { useAuthStore } from '@/features/auth/authStore';
import { practiceQuestionLabel } from '@project/backend/features/practiceQuestion/practiceQuestionLabel';
import { PracticeQuestionWithRelationships } from '@project/backend/features/practiceQuestion/practiceQuestionSchemas';
import { memberLabel } from '@project/backend/features/member/memberLabel';
import { chapterLabel } from '@project/backend/features/chapter/chapterLabel';
import { conceptLabel } from '@project/backend/features/concept/conceptLabel';
import { dictionaryEnumerator } from '@project/backend/translation/dictionaryEnumerator';
import { formatDecimal } from '@project/backend/shared/lib/formatDecimal';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import {
  createLazyRoute,
  useNavigate,
  useSearch,
} from '@tanstack/react-router';
import { toast } from 'sonner';
import { practiceQuestionViewRoute } from '@/features/practiceQuestion/practiceQuestionRouter';

export const practiceQuestionViewLazyRoute = createLazyRoute(
  '/practiceQuestion/$id',
)({
  component: PracticeQuestionViewPage,
});

export function PracticeQuestionViewPage() {
  const { id } = practiceQuestionViewRoute.useParams();
  const searchParams = useSearch({ strict: false }) as Record<string, any>;
  const referrer = searchParams.referrer as string | undefined;
  const dictionary = useAuthStore((state) => state.dictionary);
  const locale = useAuthStore((state) => state.locale);
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const query = useQuery({
    queryKey: ['practiceQuestion', id],
    queryFn: async ({ signal }) => {
      return await apiClient
        .get(`api/practice-question/${id}`, { signal })
        .json<PracticeQuestionWithRelationships>();
    },
    initialData: () =>
      (
        queryClient.getQueryData([
          'practiceQuestion',
        ]) as Array<PracticeQuestionWithRelationships>
      )?.find((d) => d.id === id),
  });

  const practiceQuestion = query.data;

  if (query.isSuccess && !practiceQuestion) {
    if (referrer?.startsWith('/practice-question?')) {
      navigate({ to: referrer as any });
    } else {
      navigate({ to: '/practice-question' });
    }
    return null;
  }

  if (query.isError) {
    toast.error(
      (query.error as any).message || dictionary.shared.errors.unknown,
    );
    if (referrer?.startsWith('/practice-question?')) {
      navigate({ to: referrer as any });
    } else {
      navigate({ to: '/practice-question' });
    }
    return null;
  }

  if (!practiceQuestion) {
    return null;
  }

  const practiceQuestionListPath = referrer?.startsWith('/practice-question?')
    ? referrer
    : '/practice-question';

  return (
    <div className="flex flex-1 flex-col p-6">
      <div className="flex items-center justify-between">
        <PageHeader
          items={[
            [dictionary.practiceQuestion.list.menu, practiceQuestionListPath],
            [practiceQuestionLabel(practiceQuestion, dictionary, locale)],
          ]}
        />
        <div className="flex gap-2">
          <PracticeQuestionActions
            mode="view"
            practiceQuestion={practiceQuestion}
            referrer={referrer}
          />
        </div>
      </div>

      <div className="my-6 divide-y border-t">
        {Boolean(practiceQuestion.questionText) && (
          <div className="grid grid-cols-3 gap-4 py-4 text-sm lg:grid-cols-4">
            <div className="font-semibold">
              {dictionary.practiceQuestion.fields.questionText}
            </div>
            <div className="col-span-2 flex items-baseline gap-4 lg:col-span-3">
              <span>{practiceQuestion.questionText}</span>
              <CopyToClipboardButton text={practiceQuestion.questionText} />
            </div>
          </div>
        )}
        {practiceQuestion.correctAnswerIndex != null && (
          <div className="grid grid-cols-3 gap-4 py-4 text-sm lg:grid-cols-4">
            <div className="font-semibold">
              {dictionary.practiceQuestion.fields.correctAnswerIndex}
            </div>
            <div className="col-span-2 flex items-baseline gap-4 lg:col-span-3">
              <span>{practiceQuestion.correctAnswerIndex}</span>
              <CopyToClipboardButton
                text={practiceQuestion.correctAnswerIndex.toString()}
              />
            </div>
          </div>
        )}
        {Boolean(practiceQuestion.answerOptions?.length) && (
          <div className="grid grid-cols-3 gap-4 py-4 text-sm lg:grid-cols-4">
            <div className="font-semibold">
              {dictionary.practiceQuestion.fields.answerOptions}
            </div>
            <div className="col-span-2 flex items-baseline gap-4 lg:col-span-3">
              <span>{practiceQuestion.answerOptions?.join(', ')}</span>
              <CopyToClipboardButton
                text={practiceQuestion.answerOptions?.join('\n') || ''}
              />
            </div>
          </div>
        )}
        {Boolean(practiceQuestion.explanation) && (
          <div className="grid grid-cols-3 gap-4 py-4 text-sm lg:grid-cols-4">
            <div className="font-semibold">
              {dictionary.practiceQuestion.fields.explanation}
            </div>
            <div className="col-span-2 flex items-baseline gap-4 lg:col-span-3">
              <span>{practiceQuestion.explanation}</span>
              <CopyToClipboardButton text={practiceQuestion.explanation} />
            </div>
          </div>
        )}
        {practiceQuestion.difficulty != null && (
          <div className="grid grid-cols-3 gap-4 py-4 text-sm lg:grid-cols-4">
            <div className="font-semibold">
              {dictionary.practiceQuestion.fields.difficulty}
            </div>
            <div className="col-span-2 flex items-baseline gap-4 lg:col-span-3">
              <span>
                {dictionaryEnumerator(
                  dictionary.practiceQuestion.enumerators.difficulty,
                  practiceQuestion.difficulty,
                )}
              </span>
              <CopyToClipboardButton
                text={dictionaryEnumerator(
                  dictionary.practiceQuestion.enumerators.difficulty,
                  practiceQuestion.difficulty,
                )}
              />
            </div>
          </div>
        )}
        {Boolean(practiceQuestion.category) && (
          <div className="grid grid-cols-3 gap-4 py-4 text-sm lg:grid-cols-4">
            <div className="font-semibold">
              {dictionary.practiceQuestion.fields.category}
            </div>
            <div className="col-span-2 flex items-baseline gap-4 lg:col-span-3">
              <span>{practiceQuestion.category}</span>
              <CopyToClipboardButton text={practiceQuestion.category} />
            </div>
          </div>
        )}
        {practiceQuestion.isActive != null && (
          <div className="grid grid-cols-3 gap-4 py-4 text-sm lg:grid-cols-4">
            <div className="font-semibold">
              {dictionary.practiceQuestion.fields.isActive}
            </div>
            <div className="col-span-2 flex items-baseline gap-4 lg:col-span-3">
              <span>
                {practiceQuestion.isActive
                  ? dictionary.shared.yes
                  : dictionary.shared.no}
              </span>
              <CopyToClipboardButton
                text={
                  practiceQuestion.isActive
                    ? dictionary.shared.yes
                    : dictionary.shared.no
                }
              />
            </div>
          </div>
        )}
        {practiceQuestion.tags?.length ? (
          <div className="grid grid-cols-3 gap-4 py-4 text-sm lg:grid-cols-4">
            <div className="font-semibold">
              {dictionary.practiceQuestion.fields.tags}
            </div>
            <div className="col-span-2 flex flex-col gap-1">
              {practiceQuestion.tags.map((value) => {
                return (
                  <div key={value} className="flex items-center gap-4">
                    <span>{value}</span>
                    <CopyToClipboardButton text={value} />
                  </div>
                );
              })}
            </div>
          </div>
        ) : null}
        {practiceQuestion.chapter != null && (
          <div className="grid grid-cols-3 gap-4 py-4 text-sm lg:grid-cols-4">
            <div className="font-semibold">
              {dictionary.practiceQuestion.fields.chapter}
            </div>
            <div className="col-span-2 flex items-baseline gap-4 lg:col-span-3">
              <ChapterLink chapter={practiceQuestion.chapter} />
              <CopyToClipboardButton
                text={chapterLabel(
                  practiceQuestion.chapter,
                  dictionary,
                  locale,
                )}
              />
            </div>
          </div>
        )}
        {practiceQuestion.concepts?.length ? (
          <div className="grid grid-cols-3 gap-4 py-4 text-sm lg:grid-cols-4">
            <div className="font-semibold">
              {dictionary.practiceQuestion.fields.concepts}
            </div>
            <div className="col-span-2 flex flex-col gap-1">
              {practiceQuestion.concepts?.map((item) => {
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

        {practiceQuestion.createdByMember != null && (
          <div className="grid grid-cols-3 gap-4 py-4 text-sm lg:grid-cols-4">
            <div className="font-semibold">
              {dictionary.practiceQuestion.fields.createdByMember}
            </div>
            <div className="col-span-2 flex items-baseline gap-4 lg:col-span-3">
              <MemberLink member={practiceQuestion.createdByMember} />
              <CopyToClipboardButton
                text={memberLabel(practiceQuestion.createdByMember)}
              />
            </div>
          </div>
        )}

        {practiceQuestion.createdAt != null && (
          <div className="grid grid-cols-3 gap-4 py-4 text-sm lg:grid-cols-4">
            <div className="font-semibold">
              {dictionary.practiceQuestion.fields.createdAt}
            </div>
            <div className="col-span-2 flex items-baseline gap-4 lg:col-span-3">
              <span>
                {formatDateTime(practiceQuestion.createdAt, dictionary)}
              </span>
              <CopyToClipboardButton
                text={formatDateTime(practiceQuestion.createdAt, dictionary)}
              />
            </div>
          </div>
        )}

        {practiceQuestion.updatedByMember != null && (
          <div className="grid grid-cols-3 gap-4 py-4 text-sm lg:grid-cols-4">
            <div className="font-semibold">
              {dictionary.practiceQuestion.fields.updatedByMember}
            </div>
            <div className="col-span-2 flex items-baseline gap-4 lg:col-span-3">
              <MemberLink member={practiceQuestion.updatedByMember} />
              <CopyToClipboardButton
                text={memberLabel(practiceQuestion.updatedByMember)}
              />
            </div>
          </div>
        )}

        {practiceQuestion.updatedAt != null && (
          <div className="grid grid-cols-3 gap-4 py-4 text-sm lg:grid-cols-4">
            <div className="font-semibold">
              {dictionary.practiceQuestion.fields.updatedAt}
            </div>
            <div className="col-span-2 flex items-baseline gap-4 lg:col-span-3">
              <span>
                {formatDateTime(practiceQuestion.updatedAt, dictionary)}
              </span>
              <CopyToClipboardButton
                text={formatDateTime(practiceQuestion.updatedAt, dictionary)}
              />
            </div>
          </div>
        )}

        {practiceQuestion.archivedByMember != null && (
          <div className="group grid grid-cols-3 gap-4 py-4 text-sm lg:grid-cols-4">
            <div className="font-semibold">
              {dictionary.practiceQuestion.fields.archivedByMember}
            </div>
            <div className="col-span-2 flex items-baseline gap-4 lg:col-span-3">
              <MemberLink member={practiceQuestion.archivedByMember} />
              <CopyToClipboardButton
                text={memberLabel(practiceQuestion.archivedByMember)}
              />
            </div>
          </div>
        )}

        {practiceQuestion.archivedAt != null && (
          <div className="group grid grid-cols-3 gap-4 py-4 text-sm lg:grid-cols-4">
            <div className="font-semibold">
              {dictionary.practiceQuestion.fields.archivedAt}
            </div>
            <div className="col-span-2 flex items-baseline gap-4 lg:col-span-3">
              <span>
                {formatDateTime(practiceQuestion.archivedAt, dictionary)}
              </span>
              <CopyToClipboardButton
                text={formatDateTime(practiceQuestion.archivedAt, dictionary)}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
