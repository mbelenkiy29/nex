import { LessonActions } from '@/features/lesson/components/LessonActions';
import { LessonLink } from '@/features/lesson/components/LessonLink';
import { FilesList } from '@/features/file/components/FilesList';
import { ImagesGallery } from '@/features/file/components/ImagesGallery';
import { MemberLink } from '@/features/member/components/MemberLink';
import { ChapterLink } from '@/features/chapter/components/ChapterLink';
import { StudyNoteLink } from '@/features/studyNote/components/StudyNoteLink';
import { CopyToClipboardButton } from '@/shared/components/CopyToClipboardButton';
import { PageHeader } from '@/shared/components/PageHeader';
import { apiClient } from '@/shared/lib/apiClient';
import { formatDate } from '@project/backend/shared/lib/formatDate';
import { formatDateTime } from '@project/backend/shared/lib/formatDateTime';
import { useAuthStore } from '@/features/auth/authStore';
import { lessonLabel } from '@project/backend/features/lesson/lessonLabel';
import { LessonWithRelationships } from '@project/backend/features/lesson/lessonSchemas';
import { memberLabel } from '@project/backend/features/member/memberLabel';
import { chapterLabel } from '@project/backend/features/chapter/chapterLabel';
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
import { lessonViewRoute } from '@/features/lesson/lessonRouter';

export const lessonViewLazyRoute = createLazyRoute('/lesson/$id')({
  component: LessonViewPage,
});

export function LessonViewPage() {
  const { id } = lessonViewRoute.useParams();
  const searchParams = useSearch({ strict: false }) as Record<string, any>;
  const referrer = searchParams.referrer as string | undefined;
  const dictionary = useAuthStore((state) => state.dictionary);
  const locale = useAuthStore((state) => state.locale);
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const query = useQuery({
    queryKey: ['lesson', id],
    queryFn: async ({ signal }) => {
      return await apiClient
        .get(`api/lesson/${id}`, { signal })
        .json<LessonWithRelationships>();
    },
    initialData: () =>
      (
        queryClient.getQueryData(['lesson']) as Array<LessonWithRelationships>
      )?.find((d) => d.id === id),
  });

  const lesson = query.data;

  if (query.isSuccess && !lesson) {
    if (referrer?.startsWith('/lesson?')) {
      navigate({ to: referrer as any });
    } else {
      navigate({ to: '/lesson' });
    }
    return null;
  }

  if (query.isError) {
    toast.error(
      (query.error as any).message || dictionary.shared.errors.unknown,
    );
    if (referrer?.startsWith('/lesson?')) {
      navigate({ to: referrer as any });
    } else {
      navigate({ to: '/lesson' });
    }
    return null;
  }

  if (!lesson) {
    return null;
  }

  const lessonListPath = referrer?.startsWith('/lesson?')
    ? referrer
    : '/lesson';

  return (
    <div className="flex flex-1 flex-col p-6">
      <div className="flex items-center justify-between">
        <PageHeader
          items={[
            [dictionary.lesson.list.menu, lessonListPath],
            [lessonLabel(lesson, dictionary, locale)],
          ]}
        />
        <div className="flex gap-2">
          <LessonActions mode="view" lesson={lesson} referrer={referrer} />
        </div>
      </div>

      <div className="my-6 divide-y border-t">
        {Boolean(lesson.title) && (
          <div className="grid grid-cols-3 gap-4 py-4 text-sm lg:grid-cols-4">
            <div className="font-semibold">
              {dictionary.lesson.fields.title}
            </div>
            <div className="col-span-2 flex items-baseline gap-4 lg:col-span-3">
              <span>{lesson.title}</span>
              <CopyToClipboardButton text={lesson.title} />
            </div>
          </div>
        )}
        {lesson.lessonNumber != null && (
          <div className="grid grid-cols-3 gap-4 py-4 text-sm lg:grid-cols-4">
            <div className="font-semibold">
              {dictionary.lesson.fields.lessonNumber}
            </div>
            <div className="col-span-2 flex items-baseline gap-4 lg:col-span-3">
              <span>{lesson.lessonNumber}</span>
              <CopyToClipboardButton text={lesson.lessonNumber.toString()} />
            </div>
          </div>
        )}
        {Boolean(lesson.content) && (
          <div className="grid grid-cols-3 gap-4 py-4 text-sm lg:grid-cols-4">
            <div className="font-semibold">
              {dictionary.lesson.fields.content}
            </div>
            <div className="col-span-2 flex items-baseline gap-4 lg:col-span-3">
              <span>{lesson.content}</span>
              <CopyToClipboardButton text={lesson.content} />
            </div>
          </div>
        )}
        {lesson.estimatedMinutes != null && (
          <div className="grid grid-cols-3 gap-4 py-4 text-sm lg:grid-cols-4">
            <div className="font-semibold">
              {dictionary.lesson.fields.estimatedMinutes}
            </div>
            <div className="col-span-2 flex items-baseline gap-4 lg:col-span-3">
              <span>{lesson.estimatedMinutes}</span>
              <CopyToClipboardButton
                text={lesson.estimatedMinutes.toString()}
              />
            </div>
          </div>
        )}
        {lesson.xpReward != null && (
          <div className="grid grid-cols-3 gap-4 py-4 text-sm lg:grid-cols-4">
            <div className="font-semibold">
              {dictionary.lesson.fields.xpReward}
            </div>
            <div className="col-span-2 flex items-baseline gap-4 lg:col-span-3">
              <span>{lesson.xpReward}</span>
              <CopyToClipboardButton text={lesson.xpReward.toString()} />
            </div>
          </div>
        )}
        {lesson.workflowStatus != null && (
          <div className="grid grid-cols-3 gap-4 py-4 text-sm lg:grid-cols-4">
            <div className="font-semibold">
              {dictionary.lesson.fields.workflowStatus}
            </div>
            <div className="col-span-2 flex items-baseline gap-4 lg:col-span-3">
              <span>
                {dictionaryEnumerator(
                  dictionary.lesson.enumerators.workflowStatus,
                  lesson.workflowStatus,
                )}
              </span>
              <CopyToClipboardButton
                text={dictionaryEnumerator(
                  dictionary.lesson.enumerators.workflowStatus,
                  lesson.workflowStatus,
                )}
              />
            </div>
          </div>
        )}
        {lesson.isPublished != null && (
          <div className="grid grid-cols-3 gap-4 py-4 text-sm lg:grid-cols-4">
            <div className="font-semibold">
              {dictionary.lesson.fields.isPublished}
            </div>
            <div className="col-span-2 flex items-baseline gap-4 lg:col-span-3">
              <span>
                {lesson.isPublished
                  ? dictionary.shared.yes
                  : dictionary.shared.no}
              </span>
              <CopyToClipboardButton
                text={
                  lesson.isPublished
                    ? dictionary.shared.yes
                    : dictionary.shared.no
                }
              />
            </div>
          </div>
        )}
        {lesson.chapter != null && (
          <div className="grid grid-cols-3 gap-4 py-4 text-sm lg:grid-cols-4">
            <div className="font-semibold">
              {dictionary.lesson.fields.chapter}
            </div>
            <div className="col-span-2 flex items-baseline gap-4 lg:col-span-3">
              <ChapterLink chapter={lesson.chapter} />
              <CopyToClipboardButton
                text={chapterLabel(lesson.chapter, dictionary, locale)}
              />
            </div>
          </div>
        )}
        {lesson.studyNotes?.length ? (
          <div className="grid grid-cols-3 gap-4 py-4 text-sm lg:grid-cols-4">
            <div className="font-semibold">
              {dictionary.lesson.fields.studyNotes}
            </div>
            <div className="col-span-2 flex flex-col gap-1">
              {lesson.studyNotes?.map((item) => {
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

        {lesson.createdByMember != null && (
          <div className="grid grid-cols-3 gap-4 py-4 text-sm lg:grid-cols-4">
            <div className="font-semibold">
              {dictionary.lesson.fields.createdByMember}
            </div>
            <div className="col-span-2 flex items-baseline gap-4 lg:col-span-3">
              <MemberLink member={lesson.createdByMember} />
              <CopyToClipboardButton
                text={memberLabel(lesson.createdByMember)}
              />
            </div>
          </div>
        )}

        {lesson.createdAt != null && (
          <div className="grid grid-cols-3 gap-4 py-4 text-sm lg:grid-cols-4">
            <div className="font-semibold">
              {dictionary.lesson.fields.createdAt}
            </div>
            <div className="col-span-2 flex items-baseline gap-4 lg:col-span-3">
              <span>{formatDateTime(lesson.createdAt, dictionary)}</span>
              <CopyToClipboardButton
                text={formatDateTime(lesson.createdAt, dictionary)}
              />
            </div>
          </div>
        )}

        {lesson.updatedByMember != null && (
          <div className="grid grid-cols-3 gap-4 py-4 text-sm lg:grid-cols-4">
            <div className="font-semibold">
              {dictionary.lesson.fields.updatedByMember}
            </div>
            <div className="col-span-2 flex items-baseline gap-4 lg:col-span-3">
              <MemberLink member={lesson.updatedByMember} />
              <CopyToClipboardButton
                text={memberLabel(lesson.updatedByMember)}
              />
            </div>
          </div>
        )}

        {lesson.updatedAt != null && (
          <div className="grid grid-cols-3 gap-4 py-4 text-sm lg:grid-cols-4">
            <div className="font-semibold">
              {dictionary.lesson.fields.updatedAt}
            </div>
            <div className="col-span-2 flex items-baseline gap-4 lg:col-span-3">
              <span>{formatDateTime(lesson.updatedAt, dictionary)}</span>
              <CopyToClipboardButton
                text={formatDateTime(lesson.updatedAt, dictionary)}
              />
            </div>
          </div>
        )}

        {lesson.archivedByMember != null && (
          <div className="group grid grid-cols-3 gap-4 py-4 text-sm lg:grid-cols-4">
            <div className="font-semibold">
              {dictionary.lesson.fields.archivedByMember}
            </div>
            <div className="col-span-2 flex items-baseline gap-4 lg:col-span-3">
              <MemberLink member={lesson.archivedByMember} />
              <CopyToClipboardButton
                text={memberLabel(lesson.archivedByMember)}
              />
            </div>
          </div>
        )}

        {lesson.archivedAt != null && (
          <div className="group grid grid-cols-3 gap-4 py-4 text-sm lg:grid-cols-4">
            <div className="font-semibold">
              {dictionary.lesson.fields.archivedAt}
            </div>
            <div className="col-span-2 flex items-baseline gap-4 lg:col-span-3">
              <span>{formatDateTime(lesson.archivedAt, dictionary)}</span>
              <CopyToClipboardButton
                text={formatDateTime(lesson.archivedAt, dictionary)}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
