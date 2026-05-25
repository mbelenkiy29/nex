import { cn } from '@/shared/lib/utils';
import { useAuthStore } from '@/features/auth/authStore';
import { studyNoteLabel } from '@project/backend/features/studyNote/studyNoteLabel';
import { StudyNoteWithRelationships } from '@project/backend/features/studyNote/studyNoteSchemas';
import { Link } from '@tanstack/react-router';

export function StudyNoteLink({
  studyNote,
  className,
}: {
  studyNote?: Partial<StudyNoteWithRelationships>;
  className?: string;
}) {
  const dictionary = useAuthStore((state) => state.dictionary);
  const locale = useAuthStore((state) => state.locale);
  const hasPermission = useAuthStore((state) => state.hasPermission);

  if (!studyNote) {
    return '';
  }

  const hasPermissionToRead = hasPermission({
    studyNote: ['read'],
  });

  if (!hasPermissionToRead) {
    return (
      <span className={className}>
        {studyNoteLabel(studyNote, dictionary, locale)}
      </span>
    );
  }

  return (
    <Link
      to={`/study-note/$id`}
      params={{ id: studyNote.id! }}
      search={{
        referrer: window.location.pathname + window.location.search,
      }}
      className={cn(
        'text-blue-500 hover:text-blue-400 hover:underline focus:text-blue-400 dark:text-blue-400',
        className,
      )}
    >
      {studyNoteLabel(studyNote, dictionary, locale)}
    </Link>
  );
}
