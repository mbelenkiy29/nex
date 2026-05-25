import { ChapterActions } from '@/features/chapter/components/ChapterActions';
import { ChapterLink } from '@/features/chapter/components/ChapterLink';
import { FilesList } from '@/features/file/components/FilesList';
import { ImagesGallery } from '@/features/file/components/ImagesGallery';
import { MemberLink } from '@/features/member/components/MemberLink';
import { ExamLink } from '@/features/exam/components/ExamLink';
import { LessonLink } from '@/features/lesson/components/LessonLink';
import { PracticeQuestionLink } from '@/features/practiceQuestion/components/PracticeQuestionLink';
import { StudyNoteLink } from '@/features/studyNote/components/StudyNoteLink';
import { CopyToClipboardButton } from '@/shared/components/CopyToClipboardButton';
import { PageHeader } from '@/shared/components/PageHeader';
import { apiClient } from '@/shared/lib/apiClient';
import { formatDate } from '@project/backend/shared/lib/formatDate';
import { formatDateTime } from '@project/backend/shared/lib/formatDateTime';
import { useAuthStore } from '@/features/auth/authStore';
import { chapterLabel } from '@project/backend/features/chapter/chapterLabel';
import { ChapterWithRelationships } from '@project/backend/features/chapter/chapterSchemas';
import { memberLabel } from '@project/backend/features/member/memberLabel';
import { examLabel } from '@project/backend/features/exam/examLabel';
import { lessonLabel } from '@project/backend/features/lesson/lessonLabel';
import { practiceQuestionLabel } from '@project/backend/features/practiceQuestion/practiceQuestionLabel';
import { studyNoteLabel } from '@project/backend/features/studyNote/studyNoteLabel';
import { dictionaryEnumerator } from '@project/backend/translation/dictionaryEnumerator';
import { formatDecimal } from '@project/backend/shared/lib/formatDecimal';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import {
  createLazyRoute,
  useNavigate,
  useSearch,
} from '@tanstack/react-router';
import { toast } from 'sonner';
import { chapterViewRoute } from '@/features/chapter/chapterRouter';

export const chapterViewLazyRoute = createLazyRoute('/chapter/$id')({
  component: ChapterViewPage,
});

export function ChapterViewPage() {
  const { id } = chapterViewRoute.useParams();
  const searchParams = useSearch({ strict: false }) as Record<string, any>;
  const referrer = searchParams.referrer as string | undefined;
  const dictionary = useAuthStore((state) => state.dictionary);
  const locale = useAuthStore((state) => state.locale);
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const query = useQuery({
    queryKey: ['chapter', id],
    queryFn: async ({ signal }) => {
      return await apiClient
        .get(`api/chapter/${id}`, { signal })
        .json<ChapterWithRelationships>();
    },
    initialData: () =>
      (
        queryClient.getQueryData(['chapter']) as Array<ChapterWithRelationships>
      )?.find((d) => d.id === id),
  });

  const chapter = query.data;

  if (query.isSuccess && !chapter) {
    if (referrer?.startsWith('/chapter?')) {
      navigate({ to: referrer as any });
    } else {
      navigate({ to: '/chapter' });
    }
    return null;
  }

  if (query.isError) {
    toast.error(
      (query.error as any).message || dictionary.shared.errors.unknown,
    );
    if (referrer?.startsWith('/chapter?')) {
      navigate({ to: referrer as any });
    } else {
      navigate({ to: '/chapter' });
    }
    return null;
  }

  if (!chapter) {
    return null;
  }

  const chapterListPath = referrer?.startsWith('/chapter?')
    ? referrer
    : '/chapter';

  return (
    <div className="flex flex-1 flex-col p-6">
      <div className="flex items-center justify-between">
        <PageHeader
          items={[
            [dictionary.chapter.list.menu, chapterListPath],
            [chapterLabel(chapter, dictionary, locale)],
          ]}
        />
        <div className="flex gap-2">
          <ChapterActions mode="view" chapter={chapter} referrer={referrer} />
        </div>
      </div>

      <div className="my-6 divide-y border-t">
        {Boolean(chapter.title) && (
          <div className="grid grid-cols-3 gap-4 py-4 text-sm lg:grid-cols-4">
            <div className="font-semibold">
              {dictionary.chapter.fields.title}
            </div>
            <div className="col-span-2 flex items-baseline gap-4 lg:col-span-3">
              <span>{chapter.title}</span>
              <CopyToClipboardButton text={chapter.title} />
            </div>
          </div>
        )}
        {chapter.chapterNumber != null && (
          <div className="grid grid-cols-3 gap-4 py-4 text-sm lg:grid-cols-4">
            <div className="font-semibold">
              {dictionary.chapter.fields.chapterNumber}
            </div>
            <div className="col-span-2 flex items-baseline gap-4 lg:col-span-3">
              <span>{chapter.chapterNumber}</span>
              <CopyToClipboardButton text={chapter.chapterNumber.toString()} />
            </div>
          </div>
        )}
        {Boolean(chapter.description) && (
          <div className="grid grid-cols-3 gap-4 py-4 text-sm lg:grid-cols-4">
            <div className="font-semibold">
              {dictionary.chapter.fields.description}
            </div>
            <div className="col-span-2 flex items-baseline gap-4 lg:col-span-3">
              <span>{chapter.description}</span>
              <CopyToClipboardButton text={chapter.description} />
            </div>
          </div>
        )}
        {Boolean(chapter.aiTutorPrompt) && (
          <div className="grid grid-cols-3 gap-4 py-4 text-sm lg:grid-cols-4">
            <div className="font-semibold">
              {dictionary.chapter.fields.aiTutorPrompt}
            </div>
            <div className="col-span-2 flex items-baseline gap-4 lg:col-span-3">
              <span>{chapter.aiTutorPrompt}</span>
              <CopyToClipboardButton text={chapter.aiTutorPrompt} />
            </div>
          </div>
        )}
        {chapter.xpReward != null && (
          <div className="grid grid-cols-3 gap-4 py-4 text-sm lg:grid-cols-4">
            <div className="font-semibold">
              {dictionary.chapter.fields.xpReward}
            </div>
            <div className="col-span-2 flex items-baseline gap-4 lg:col-span-3">
              <span>{chapter.xpReward}</span>
              <CopyToClipboardButton text={chapter.xpReward.toString()} />
            </div>
          </div>
        )}
        {chapter.orderIndex != null && (
          <div className="grid grid-cols-3 gap-4 py-4 text-sm lg:grid-cols-4">
            <div className="font-semibold">
              {dictionary.chapter.fields.orderIndex}
            </div>
            <div className="col-span-2 flex items-baseline gap-4 lg:col-span-3">
              <span>{chapter.orderIndex}</span>
              <CopyToClipboardButton text={chapter.orderIndex.toString()} />
            </div>
          </div>
        )}
        {chapter.workflowStatus != null && (
          <div className="grid grid-cols-3 gap-4 py-4 text-sm lg:grid-cols-4">
            <div className="font-semibold">
              {dictionary.chapter.fields.workflowStatus}
            </div>
            <div className="col-span-2 flex items-baseline gap-4 lg:col-span-3">
              <span>
                {dictionaryEnumerator(
                  dictionary.chapter.enumerators.workflowStatus,
                  chapter.workflowStatus,
                )}
              </span>
              <CopyToClipboardButton
                text={dictionaryEnumerator(
                  dictionary.chapter.enumerators.workflowStatus,
                  chapter.workflowStatus,
                )}
              />
            </div>
          </div>
        )}
        {chapter.isPublished != null && (
          <div className="grid grid-cols-3 gap-4 py-4 text-sm lg:grid-cols-4">
            <div className="font-semibold">
              {dictionary.chapter.fields.isPublished}
            </div>
            <div className="col-span-2 flex items-baseline gap-4 lg:col-span-3">
              <span>
                {chapter.isPublished
                  ? dictionary.shared.yes
                  : dictionary.shared.no}
              </span>
              <CopyToClipboardButton
                text={
                  chapter.isPublished
                    ? dictionary.shared.yes
                    : dictionary.shared.no
                }
              />
            </div>
          </div>
        )}
        {chapter.version != null && (
          <div className="grid grid-cols-3 gap-4 py-4 text-sm lg:grid-cols-4">
            <div className="font-semibold">
              {dictionary.chapter.fields.version}
            </div>
            <div className="col-span-2 flex items-baseline gap-4 lg:col-span-3">
              <span>{chapter.version}</span>
              <CopyToClipboardButton text={chapter.version.toString()} />
            </div>
          </div>
        )}
        {chapter.objectives?.length ? (
          <div className="grid grid-cols-3 gap-4 py-4 text-sm lg:grid-cols-4">
            <div className="font-semibold">
              {dictionary.chapter.fields.objectives}
            </div>
            <div className="col-span-2 flex flex-col gap-1">
              {chapter.objectives.map((value) => {
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
        {chapter.exam != null && (
          <div className="grid grid-cols-3 gap-4 py-4 text-sm lg:grid-cols-4">
            <div className="font-semibold">
              {dictionary.chapter.fields.exam}
            </div>
            <div className="col-span-2 flex items-baseline gap-4 lg:col-span-3">
              <ExamLink exam={chapter.exam} />
              <CopyToClipboardButton
                text={examLabel(chapter.exam, dictionary, locale)}
              />
            </div>
          </div>
        )}
        {chapter.lessons?.length ? (
          <div className="grid grid-cols-3 gap-4 py-4 text-sm lg:grid-cols-4">
            <div className="font-semibold">
              {dictionary.chapter.fields.lessons}
            </div>
            <div className="col-span-2 flex flex-col gap-1">
              {chapter.lessons?.map((item) => {
                return (
                  <div key={item?.id} className="flex items-center gap-4">
                    <LessonLink lesson={item} className="whitespace-nowrap" />
                    <CopyToClipboardButton
                      text={lessonLabel(item, dictionary, locale)}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        ) : null}
        {chapter.practiceQuestions?.length ? (
          <div className="grid grid-cols-3 gap-4 py-4 text-sm lg:grid-cols-4">
            <div className="font-semibold">
              {dictionary.chapter.fields.practiceQuestions}
            </div>
            <div className="col-span-2 flex flex-col gap-1">
              {chapter.practiceQuestions?.map((item) => {
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
        {chapter.studyNotes?.length ? (
          <div className="grid grid-cols-3 gap-4 py-4 text-sm lg:grid-cols-4">
            <div className="font-semibold">
              {dictionary.chapter.fields.studyNotes}
            </div>
            <div className="col-span-2 flex flex-col gap-1">
              {chapter.studyNotes?.map((item) => {
                return (
                  <div key={item?.id} className="flex items-center gap-4">
                    <StudyNoteLink
                      studyNote={item}
                      className="whitespace-nowrap"
                    />
                    <CopyToClipboardButton
                      text={studyNoteLabel(item, dictionary, locale)}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        ) : null}

        {chapter.createdByMember != null && (
          <div className="grid grid-cols-3 gap-4 py-4 text-sm lg:grid-cols-4">
            <div className="font-semibold">
              {dictionary.chapter.fields.createdByMember}
            </div>
            <div className="col-span-2 flex items-baseline gap-4 lg:col-span-3">
              <MemberLink member={chapter.createdByMember} />
              <CopyToClipboardButton
                text={memberLabel(chapter.createdByMember)}
              />
            </div>
          </div>
        )}

        {chapter.createdAt != null && (
          <div className="grid grid-cols-3 gap-4 py-4 text-sm lg:grid-cols-4">
            <div className="font-semibold">
              {dictionary.chapter.fields.createdAt}
            </div>
            <div className="col-span-2 flex items-baseline gap-4 lg:col-span-3">
              <span>{formatDateTime(chapter.createdAt, dictionary)}</span>
              <CopyToClipboardButton
                text={formatDateTime(chapter.createdAt, dictionary)}
              />
            </div>
          </div>
        )}

        {chapter.updatedByMember != null && (
          <div className="grid grid-cols-3 gap-4 py-4 text-sm lg:grid-cols-4">
            <div className="font-semibold">
              {dictionary.chapter.fields.updatedByMember}
            </div>
            <div className="col-span-2 flex items-baseline gap-4 lg:col-span-3">
              <MemberLink member={chapter.updatedByMember} />
              <CopyToClipboardButton
                text={memberLabel(chapter.updatedByMember)}
              />
            </div>
          </div>
        )}

        {chapter.updatedAt != null && (
          <div className="grid grid-cols-3 gap-4 py-4 text-sm lg:grid-cols-4">
            <div className="font-semibold">
              {dictionary.chapter.fields.updatedAt}
            </div>
            <div className="col-span-2 flex items-baseline gap-4 lg:col-span-3">
              <span>{formatDateTime(chapter.updatedAt, dictionary)}</span>
              <CopyToClipboardButton
                text={formatDateTime(chapter.updatedAt, dictionary)}
              />
            </div>
          </div>
        )}

        {chapter.archivedByMember != null && (
          <div className="group grid grid-cols-3 gap-4 py-4 text-sm lg:grid-cols-4">
            <div className="font-semibold">
              {dictionary.chapter.fields.archivedByMember}
            </div>
            <div className="col-span-2 flex items-baseline gap-4 lg:col-span-3">
              <MemberLink member={chapter.archivedByMember} />
              <CopyToClipboardButton
                text={memberLabel(chapter.archivedByMember)}
              />
            </div>
          </div>
        )}

        {chapter.archivedAt != null && (
          <div className="group grid grid-cols-3 gap-4 py-4 text-sm lg:grid-cols-4">
            <div className="font-semibold">
              {dictionary.chapter.fields.archivedAt}
            </div>
            <div className="col-span-2 flex items-baseline gap-4 lg:col-span-3">
              <span>{formatDateTime(chapter.archivedAt, dictionary)}</span>
              <CopyToClipboardButton
                text={formatDateTime(chapter.archivedAt, dictionary)}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
