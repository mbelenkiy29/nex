import {
  createLazyRoute,
  useNavigate,
  useSearch,
} from '@tanstack/react-router';
import { useAuthStore } from '@/features/auth/authStore';
import { StudyNoteForm } from '@/features/studyNote/components/StudyNoteForm';
import { PageHeader } from '@/shared/components/PageHeader';
import { StudyNoteWithRelationships } from '@project/backend/features/studyNote/studyNoteSchemas';

export const studyNoteNewLazyRoute = createLazyRoute('/study-note/new')({
  component: StudyNoteNewPage,
});

export function StudyNoteNewPage() {
  const dictionary = useAuthStore((state) => state.dictionary);
  const navigate = useNavigate();
  const searchParams = useSearch({ strict: false }) as Record<string, any>;
  const referrer = searchParams.referrer as string | undefined;

  const studyNoteListPath = referrer?.startsWith('/study-note?')
    ? referrer
    : '/study-note';

  return (
    <div className="flex flex-1 flex-col p-6">
      <PageHeader
        items={[
          [dictionary.studyNote.list.menu, studyNoteListPath],
          [dictionary.studyNote.new.menu],
        ]}
      />
      <div className="my-10">
        <StudyNoteForm
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
