import { StudyNoteActions } from '@/features/studyNote/components/StudyNoteActions';
import { StudyNoteLink } from '@/features/studyNote/components/StudyNoteLink';
import { FilesList } from '@/features/file/components/FilesList';
import { ImagesGallery } from '@/features/file/components/ImagesGallery';
import { MemberLink } from '@/features/member/components/MemberLink';
import { ChapterLink } from '@/features/chapter/components/ChapterLink';
import { LessonLink } from '@/features/lesson/components/LessonLink';
import { CopyToClipboardButton } from '@/shared/components/CopyToClipboardButton';
import { PageHeader } from '@/shared/components/PageHeader';
import { apiClient } from '@/shared/lib/apiClient';
import { formatDate } from '@project/backend/shared/lib/formatDate';
import { formatDateTime } from '@project/backend/shared/lib/formatDateTime';
import { useAuthStore } from '@/features/auth/authStore';
import { studyNoteLabel } from '@project/backend/features/studyNote/studyNoteLabel';
import { StudyNoteWithRelationships } from '@project/backend/features/studyNote/studyNoteSchemas';
import { memberLabel } from '@project/backend/features/member/memberLabel';
import { chapterLabel } from '@project/backend/features/chapter/chapterLabel';
import { lessonLabel } from '@project/backend/features/lesson/lessonLabel';
import { dictionaryEnumerator } from '@project/backend/translation/dictionaryEnumerator';
import { formatDecimal } from '@project/backend/shared/lib/formatDecimal';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import {
  createLazyRoute,
  useNavigate,
  useSearch,
} from '@tanstack/react-router';
import { toast } from 'sonner';
import { studyNoteViewRoute } from '@/features/studyNote/studyNoteRouter';

export const studyNoteViewLazyRoute = createLazyRoute('/studyNote/$id')({
  component: StudyNoteViewPage,
});

export function StudyNoteViewPage() {
  const { id } = studyNoteViewRoute.useParams();
  const searchParams = useSearch({ strict: false }) as Record<string, any>;
  const referrer = searchParams.referrer as string | undefined;
  const dictionary = useAuthStore((state) => state.dictionary);
  const locale = useAuthStore((state) => state.locale);
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const query = useQuery({
    queryKey: ['studyNote', id],
    queryFn: async ({ signal }) => {
      return await apiClient
        .get(`api/study-note/${id}`, { signal })
        .json<StudyNoteWithRelationships>();
    },
    initialData: () =>
      (
        queryClient.getQueryData([
          'studyNote',
        ]) as Array<StudyNoteWithRelationships>
      )?.find((d) => d.id === id),
  });

  const studyNote = query.data;

  if (query.isSuccess && !studyNote) {
    if (referrer?.startsWith('/study-note?')) {
      navigate({ to: referrer as any });
    } else {
      navigate({ to: '/study-note' });
    }
    return null;
  }

  if (query.isError) {
    toast.error(
      (query.error as any).message || dictionary.shared.errors.unknown,
    );
    if (referrer?.startsWith('/study-note?')) {
      navigate({ to: referrer as any });
    } else {
      navigate({ to: '/study-note' });
    }
    return null;
  }

  if (!studyNote) {
    return null;
  }

  const studyNoteListPath = referrer?.startsWith('/study-note?')
    ? referrer
    : '/study-note';

  return (
    <div className="flex flex-1 flex-col p-6">
      <div className="flex items-center justify-between">
        <PageHeader
          items={[
            [dictionary.studyNote.list.menu, studyNoteListPath],
            [studyNoteLabel(studyNote, dictionary, locale)],
          ]}
        />
        <div className="flex gap-2">
          <StudyNoteActions
            mode="view"
            studyNote={studyNote}
            referrer={referrer}
          />
        </div>
      </div>

      <div className="my-6 divide-y border-t">
        {Boolean(studyNote.title) && (
          <div className="grid grid-cols-3 gap-4 py-4 text-sm lg:grid-cols-4">
            <div className="font-semibold">
              {dictionary.studyNote.fields.title}
            </div>
            <div className="col-span-2 flex items-baseline gap-4 lg:col-span-3">
              <span>{studyNote.title}</span>
              <CopyToClipboardButton text={studyNote.title} />
            </div>
          </div>
        )}
        {Boolean(studyNote.content) && (
          <div className="grid grid-cols-3 gap-4 py-4 text-sm lg:grid-cols-4">
            <div className="font-semibold">
              {dictionary.studyNote.fields.content}
            </div>
            <div className="col-span-2 flex items-baseline gap-4 lg:col-span-3">
              <span>{studyNote.content}</span>
              <CopyToClipboardButton text={studyNote.content} />
            </div>
          </div>
        )}
        {studyNote.isFavorite != null && (
          <div className="grid grid-cols-3 gap-4 py-4 text-sm lg:grid-cols-4">
            <div className="font-semibold">
              {dictionary.studyNote.fields.isFavorite}
            </div>
            <div className="col-span-2 flex items-baseline gap-4 lg:col-span-3">
              <span>
                {studyNote.isFavorite
                  ? dictionary.shared.yes
                  : dictionary.shared.no}
              </span>
              <CopyToClipboardButton
                text={
                  studyNote.isFavorite
                    ? dictionary.shared.yes
                    : dictionary.shared.no
                }
              />
            </div>
          </div>
        )}
        {studyNote.tags?.length ? (
          <div className="grid grid-cols-3 gap-4 py-4 text-sm lg:grid-cols-4">
            <div className="font-semibold">
              {dictionary.studyNote.fields.tags}
            </div>
            <div className="col-span-2 flex flex-col gap-1">
              {studyNote.tags.map((value) => {
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
        {studyNote.chapter != null && (
          <div className="grid grid-cols-3 gap-4 py-4 text-sm lg:grid-cols-4">
            <div className="font-semibold">
              {dictionary.studyNote.fields.chapter}
            </div>
            <div className="col-span-2 flex items-baseline gap-4 lg:col-span-3">
              <ChapterLink chapter={studyNote.chapter} />
              <CopyToClipboardButton
                text={chapterLabel(studyNote.chapter, dictionary, locale)}
              />
            </div>
          </div>
        )}
        {studyNote.lesson != null && (
          <div className="grid grid-cols-3 gap-4 py-4 text-sm lg:grid-cols-4">
            <div className="font-semibold">
              {dictionary.studyNote.fields.lesson}
            </div>
            <div className="col-span-2 flex items-baseline gap-4 lg:col-span-3">
              <LessonLink lesson={studyNote.lesson} />
              <CopyToClipboardButton
                text={lessonLabel(studyNote.lesson, dictionary, locale)}
              />
            </div>
          </div>
        )}
        {studyNote.author != null && (
          <div className="grid grid-cols-3 gap-4 py-4 text-sm lg:grid-cols-4">
            <div className="font-semibold">
              {dictionary.studyNote.fields.author}
            </div>
            <div className="col-span-2 flex items-baseline gap-4 lg:col-span-3">
              <MemberLink member={studyNote.author} />
              <CopyToClipboardButton text={memberLabel(studyNote.author)} />
            </div>
          </div>
        )}

        {studyNote.createdByMember != null && (
          <div className="grid grid-cols-3 gap-4 py-4 text-sm lg:grid-cols-4">
            <div className="font-semibold">
              {dictionary.studyNote.fields.createdByMember}
            </div>
            <div className="col-span-2 flex items-baseline gap-4 lg:col-span-3">
              <MemberLink member={studyNote.createdByMember} />
              <CopyToClipboardButton
                text={memberLabel(studyNote.createdByMember)}
              />
            </div>
          </div>
        )}

        {studyNote.createdAt != null && (
          <div className="grid grid-cols-3 gap-4 py-4 text-sm lg:grid-cols-4">
            <div className="font-semibold">
              {dictionary.studyNote.fields.createdAt}
            </div>
            <div className="col-span-2 flex items-baseline gap-4 lg:col-span-3">
              <span>{formatDateTime(studyNote.createdAt, dictionary)}</span>
              <CopyToClipboardButton
                text={formatDateTime(studyNote.createdAt, dictionary)}
              />
            </div>
          </div>
        )}

        {studyNote.updatedByMember != null && (
          <div className="grid grid-cols-3 gap-4 py-4 text-sm lg:grid-cols-4">
            <div className="font-semibold">
              {dictionary.studyNote.fields.updatedByMember}
            </div>
            <div className="col-span-2 flex items-baseline gap-4 lg:col-span-3">
              <MemberLink member={studyNote.updatedByMember} />
              <CopyToClipboardButton
                text={memberLabel(studyNote.updatedByMember)}
              />
            </div>
          </div>
        )}

        {studyNote.updatedAt != null && (
          <div className="grid grid-cols-3 gap-4 py-4 text-sm lg:grid-cols-4">
            <div className="font-semibold">
              {dictionary.studyNote.fields.updatedAt}
            </div>
            <div className="col-span-2 flex items-baseline gap-4 lg:col-span-3">
              <span>{formatDateTime(studyNote.updatedAt, dictionary)}</span>
              <CopyToClipboardButton
                text={formatDateTime(studyNote.updatedAt, dictionary)}
              />
            </div>
          </div>
        )}

        {studyNote.archivedByMember != null && (
          <div className="group grid grid-cols-3 gap-4 py-4 text-sm lg:grid-cols-4">
            <div className="font-semibold">
              {dictionary.studyNote.fields.archivedByMember}
            </div>
            <div className="col-span-2 flex items-baseline gap-4 lg:col-span-3">
              <MemberLink member={studyNote.archivedByMember} />
              <CopyToClipboardButton
                text={memberLabel(studyNote.archivedByMember)}
              />
            </div>
          </div>
        )}

        {studyNote.archivedAt != null && (
          <div className="group grid grid-cols-3 gap-4 py-4 text-sm lg:grid-cols-4">
            <div className="font-semibold">
              {dictionary.studyNote.fields.archivedAt}
            </div>
            <div className="col-span-2 flex items-baseline gap-4 lg:col-span-3">
              <span>{formatDateTime(studyNote.archivedAt, dictionary)}</span>
              <CopyToClipboardButton
                text={formatDateTime(studyNote.archivedAt, dictionary)}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
