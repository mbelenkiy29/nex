import {
  createLazyRoute,
  useNavigate,
  useSearch,
} from '@tanstack/react-router';
import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '@/features/auth/authStore';
import { useShallow } from 'zustand/react/shallow';
import { StudyNoteForm } from '@/features/studyNote/components/StudyNoteForm';
import { PageHeader } from '@/shared/components/PageHeader';
import { apiClient } from '@/shared/lib/apiClient';
import { StudyNoteWithRelationships } from '@project/backend/features/studyNote/studyNoteSchemas';
import { studyNoteLabel } from '@project/backend/features/studyNote/studyNoteLabel';
import { toast } from 'sonner';
import { studyNoteEditRoute } from '@/features/studyNote/studyNoteRouter';

export const studyNoteEditLazyRoute = createLazyRoute('/study-note/$id/edit')({
  component: StudyNoteEditPage,
});

export function StudyNoteEditPage() {
  const { dictionary, locale } = useAuthStore(
    useShallow((state) => ({
      dictionary: state.dictionary,
      locale: state.locale,
    })),
  );
  const navigate = useNavigate();
  const { id } = studyNoteEditRoute.useParams();
  const searchParams = useSearch({ strict: false }) as Record<string, any>;
  const referrer = searchParams.referrer as string | undefined;

  const query = useQuery({
    queryKey: ['study-note', id],
    queryFn: async ({ signal }) => {
      return await apiClient
        .get(`api/study-note/${id}`, { signal })
        .json<StudyNoteWithRelationships>();
    },
    staleTime: 0,
    gcTime: 0,
    refetchOnMount: 'always',
  });

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

  if (!query.data) {
    return null;
  }

  const studyNote = query.data;
  const studyNoteListPath = referrer?.startsWith('/study-note?')
    ? referrer
    : '/study-note';

  return (
    <div className="flex flex-1 flex-col p-6">
      <PageHeader
        items={[
          [dictionary.studyNote.list.menu, studyNoteListPath],
          [
            studyNoteLabel(studyNote, dictionary, locale),
            `/study-note/${studyNote?.id}${referrer ? `?referrer=${encodeURIComponent(referrer)}` : ''}`,
          ],
          [dictionary.studyNote.edit.menu],
        ]}
      />
      <div className="my-10">
        <StudyNoteForm
          studyNote={studyNote}
          onSuccess={(studyNote: StudyNoteWithRelationships) =>
            navigate({
              to: `/study-note/${studyNote.id}`,
              search: referrer ? { referrer } : undefined,
            })
          }
          onCancel={() =>
            referrer?.startsWith('/study-note?')
              ? navigate({ to: referrer as any })
              : navigate({ to: '/study-note' })
          }
        />
      </div>
    </div>
  );
}
