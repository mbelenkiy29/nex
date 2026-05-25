import { ConceptActions } from '@/features/concept/components/ConceptActions';
import { ConceptLink } from '@/features/concept/components/ConceptLink';
import { FilesList } from '@/features/file/components/FilesList';
import { ImagesGallery } from '@/features/file/components/ImagesGallery';
import { MemberLink } from '@/features/member/components/MemberLink';
import { ExamLink } from '@/features/exam/components/ExamLink';
import { PracticeQuestionLink } from '@/features/practiceQuestion/components/PracticeQuestionLink';
import { CopyToClipboardButton } from '@/shared/components/CopyToClipboardButton';
import { PageHeader } from '@/shared/components/PageHeader';
import { apiClient } from '@/shared/lib/apiClient';
import { formatDate } from '@project/backend/shared/lib/formatDate';
import { formatDateTime } from '@project/backend/shared/lib/formatDateTime';
import { useAuthStore } from '@/features/auth/authStore';
import { conceptLabel } from '@project/backend/features/concept/conceptLabel';
import { ConceptWithRelationships } from '@project/backend/features/concept/conceptSchemas';
import { memberLabel } from '@project/backend/features/member/memberLabel';
import { examLabel } from '@project/backend/features/exam/examLabel';
import { practiceQuestionLabel } from '@project/backend/features/practiceQuestion/practiceQuestionLabel';
import { dictionaryEnumerator } from '@project/backend/translation/dictionaryEnumerator';
import { formatDecimal } from '@project/backend/shared/lib/formatDecimal';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import {
  createLazyRoute,
  useNavigate,
  useSearch,
} from '@tanstack/react-router';
import { toast } from 'sonner';
import { conceptViewRoute } from '@/features/concept/conceptRouter';

export const conceptViewLazyRoute = createLazyRoute('/concept/$id')({
  component: ConceptViewPage,
});

export function ConceptViewPage() {
  const { id } = conceptViewRoute.useParams();
  const searchParams = useSearch({ strict: false }) as Record<string, any>;
  const referrer = searchParams.referrer as string | undefined;
  const dictionary = useAuthStore((state) => state.dictionary);
  const locale = useAuthStore((state) => state.locale);
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const query = useQuery({
    queryKey: ['concept', id],
    queryFn: async ({ signal }) => {
      return await apiClient
        .get(`api/concept/${id}`, { signal })
        .json<ConceptWithRelationships>();
    },
    initialData: () =>
      (
        queryClient.getQueryData(['concept']) as Array<ConceptWithRelationships>
      )?.find((d) => d.id === id),
  });

  const concept = query.data;

  if (query.isSuccess && !concept) {
    if (referrer?.startsWith('/concept?')) {
      navigate({ to: referrer as any });
    } else {
      navigate({ to: '/concept' });
    }
    return null;
  }

  if (query.isError) {
    toast.error(
      (query.error as any).message || dictionary.shared.errors.unknown,
    );
    if (referrer?.startsWith('/concept?')) {
      navigate({ to: referrer as any });
    } else {
      navigate({ to: '/concept' });
    }
    return null;
  }

  if (!concept) {
    return null;
  }

  const conceptListPath = referrer?.startsWith('/concept?')
    ? referrer
    : '/concept';

  return (
    <div className="flex flex-1 flex-col p-6">
      <div className="flex items-center justify-between">
        <PageHeader
          items={[
            [dictionary.concept.list.menu, conceptListPath],
            [conceptLabel(concept, dictionary, locale)],
          ]}
        />
        <div className="flex gap-2">
          <ConceptActions mode="view" concept={concept} referrer={referrer} />
        </div>
      </div>

      <div className="my-6 divide-y border-t">
        {Boolean(concept.conceptName) && (
          <div className="grid grid-cols-3 gap-4 py-4 text-sm lg:grid-cols-4">
            <div className="font-semibold">
              {dictionary.concept.fields.conceptName}
            </div>
            <div className="col-span-2 flex items-baseline gap-4 lg:col-span-3">
              <span>{concept.conceptName}</span>
              <CopyToClipboardButton text={concept.conceptName} />
            </div>
          </div>
        )}
        {Boolean(concept.conceptCode) && (
          <div className="grid grid-cols-3 gap-4 py-4 text-sm lg:grid-cols-4">
            <div className="font-semibold">
              {dictionary.concept.fields.conceptCode}
            </div>
            <div className="col-span-2 flex items-baseline gap-4 lg:col-span-3">
              <span>{concept.conceptCode}</span>
              <CopyToClipboardButton text={concept.conceptCode} />
            </div>
          </div>
        )}
        {Boolean(concept.conceptDescription) && (
          <div className="grid grid-cols-3 gap-4 py-4 text-sm lg:grid-cols-4">
            <div className="font-semibold">
              {dictionary.concept.fields.conceptDescription}
            </div>
            <div className="col-span-2 flex items-baseline gap-4 lg:col-span-3">
              <span>{concept.conceptDescription}</span>
              <CopyToClipboardButton text={concept.conceptDescription} />
            </div>
          </div>
        )}
        {Boolean(concept.explanation) && (
          <div className="grid grid-cols-3 gap-4 py-4 text-sm lg:grid-cols-4">
            <div className="font-semibold">
              {dictionary.concept.fields.explanation}
            </div>
            <div className="col-span-2 flex items-baseline gap-4 lg:col-span-3">
              <span>{concept.explanation}</span>
              <CopyToClipboardButton text={concept.explanation} />
            </div>
          </div>
        )}
        {Boolean(concept.examDomain) && (
          <div className="grid grid-cols-3 gap-4 py-4 text-sm lg:grid-cols-4">
            <div className="font-semibold">
              {dictionary.concept.fields.examDomain}
            </div>
            <div className="col-span-2 flex items-baseline gap-4 lg:col-span-3">
              <span>{concept.examDomain}</span>
              <CopyToClipboardButton text={concept.examDomain} />
            </div>
          </div>
        )}
        {concept.difficulty != null && (
          <div className="grid grid-cols-3 gap-4 py-4 text-sm lg:grid-cols-4">
            <div className="font-semibold">
              {dictionary.concept.fields.difficulty}
            </div>
            <div className="col-span-2 flex items-baseline gap-4 lg:col-span-3">
              <span>
                {dictionaryEnumerator(
                  dictionary.concept.enumerators.difficulty,
                  concept.difficulty,
                )}
              </span>
              <CopyToClipboardButton
                text={dictionaryEnumerator(
                  dictionary.concept.enumerators.difficulty,
                  concept.difficulty,
                )}
              />
            </div>
          </div>
        )}
        {concept.examWeight != null && (
          <div className="grid grid-cols-3 gap-4 py-4 text-sm lg:grid-cols-4">
            <div className="font-semibold">
              {dictionary.concept.fields.examWeight}
            </div>
            <div className="col-span-2 flex items-baseline gap-4 lg:col-span-3">
              <span>
                {dictionaryEnumerator(
                  dictionary.concept.enumerators.examWeight,
                  concept.examWeight,
                )}
              </span>
              <CopyToClipboardButton
                text={dictionaryEnumerator(
                  dictionary.concept.enumerators.examWeight,
                  concept.examWeight,
                )}
              />
            </div>
          </div>
        )}
        {concept.typicalMistakes?.length ? (
          <div className="grid grid-cols-3 gap-4 py-4 text-sm lg:grid-cols-4">
            <div className="font-semibold">
              {dictionary.concept.fields.typicalMistakes}
            </div>
            <div className="col-span-2 flex flex-col gap-1">
              {concept.typicalMistakes.map((value) => {
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
        {concept.examTips?.length ? (
          <div className="grid grid-cols-3 gap-4 py-4 text-sm lg:grid-cols-4">
            <div className="font-semibold">
              {dictionary.concept.fields.examTips}
            </div>
            <div className="col-span-2 flex flex-col gap-1">
              {concept.examTips.map((value) => {
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
        {concept.isActive != null && (
          <div className="grid grid-cols-3 gap-4 py-4 text-sm lg:grid-cols-4">
            <div className="font-semibold">
              {dictionary.concept.fields.isActive}
            </div>
            <div className="col-span-2 flex items-baseline gap-4 lg:col-span-3">
              <span>
                {concept.isActive
                  ? dictionary.shared.yes
                  : dictionary.shared.no}
              </span>
              <CopyToClipboardButton
                text={
                  concept.isActive
                    ? dictionary.shared.yes
                    : dictionary.shared.no
                }
              />
            </div>
          </div>
        )}
        {concept.exam != null && (
          <div className="grid grid-cols-3 gap-4 py-4 text-sm lg:grid-cols-4">
            <div className="font-semibold">
              {dictionary.concept.fields.exam}
            </div>
            <div className="col-span-2 flex items-baseline gap-4 lg:col-span-3">
              <ExamLink exam={concept.exam} />
              <CopyToClipboardButton
                text={examLabel(concept.exam, dictionary, locale)}
              />
            </div>
          </div>
        )}
        {concept.practiceQuestions?.length ? (
          <div className="grid grid-cols-3 gap-4 py-4 text-sm lg:grid-cols-4">
            <div className="font-semibold">
              {dictionary.concept.fields.practiceQuestions}
            </div>
            <div className="col-span-2 flex flex-col gap-1">
              {concept.practiceQuestions?.map((item) => {
                return (
                  <div key={item?.id} className="flex items-center gap-4">
                    <PracticeQuestionLink
                      practiceQuestion={item}
                      className="whitespace-nowrap"
                    />
                    <CopyToClipboardButton
                      text={practiceQuestionLabel(item, dictionary, locale)}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        ) : null}

        {concept.createdByMember != null && (
          <div className="grid grid-cols-3 gap-4 py-4 text-sm lg:grid-cols-4">
            <div className="font-semibold">
              {dictionary.concept.fields.createdByMember}
            </div>
            <div className="col-span-2 flex items-baseline gap-4 lg:col-span-3">
              <MemberLink member={concept.createdByMember} />
              <CopyToClipboardButton
                text={memberLabel(concept.createdByMember)}
              />
            </div>
          </div>
        )}

        {concept.createdAt != null && (
          <div className="grid grid-cols-3 gap-4 py-4 text-sm lg:grid-cols-4">
            <div className="font-semibold">
              {dictionary.concept.fields.createdAt}
            </div>
            <div className="col-span-2 flex items-baseline gap-4 lg:col-span-3">
              <span>{formatDateTime(concept.createdAt, dictionary)}</span>
              <CopyToClipboardButton
                text={formatDateTime(concept.createdAt, dictionary)}
              />
            </div>
          </div>
        )}

        {concept.updatedByMember != null && (
          <div className="grid grid-cols-3 gap-4 py-4 text-sm lg:grid-cols-4">
            <div className="font-semibold">
              {dictionary.concept.fields.updatedByMember}
            </div>
            <div className="col-span-2 flex items-baseline gap-4 lg:col-span-3">
              <MemberLink member={concept.updatedByMember} />
              <CopyToClipboardButton
                text={memberLabel(concept.updatedByMember)}
              />
            </div>
          </div>
        )}

        {concept.updatedAt != null && (
          <div className="grid grid-cols-3 gap-4 py-4 text-sm lg:grid-cols-4">
            <div className="font-semibold">
              {dictionary.concept.fields.updatedAt}
            </div>
            <div className="col-span-2 flex items-baseline gap-4 lg:col-span-3">
              <span>{formatDateTime(concept.updatedAt, dictionary)}</span>
              <CopyToClipboardButton
                text={formatDateTime(concept.updatedAt, dictionary)}
              />
            </div>
          </div>
        )}

        {concept.archivedByMember != null && (
          <div className="group grid grid-cols-3 gap-4 py-4 text-sm lg:grid-cols-4">
            <div className="font-semibold">
              {dictionary.concept.fields.archivedByMember}
            </div>
            <div className="col-span-2 flex items-baseline gap-4 lg:col-span-3">
              <MemberLink member={concept.archivedByMember} />
              <CopyToClipboardButton
                text={memberLabel(concept.archivedByMember)}
              />
            </div>
          </div>
        )}

        {concept.archivedAt != null && (
          <div className="group grid grid-cols-3 gap-4 py-4 text-sm lg:grid-cols-4">
            <div className="font-semibold">
              {dictionary.concept.fields.archivedAt}
            </div>
            <div className="col-span-2 flex items-baseline gap-4 lg:col-span-3">
              <span>{formatDateTime(concept.archivedAt, dictionary)}</span>
              <CopyToClipboardButton
                text={formatDateTime(concept.archivedAt, dictionary)}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
