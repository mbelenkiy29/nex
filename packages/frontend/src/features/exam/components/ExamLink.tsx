import { cn } from '@/shared/lib/utils';
import { useAuthStore } from '@/features/auth/authStore';
import { examLabel } from '@project/backend/features/exam/examLabel';
import { ExamWithRelationships } from '@project/backend/features/exam/examSchemas';
import { Link } from '@tanstack/react-router';

export function ExamLink({
  exam,
  className,
}: {
  exam?: Partial<ExamWithRelationships>;
  className?: string;
}) {
  const dictionary = useAuthStore((state) => state.dictionary);
  const locale = useAuthStore((state) => state.locale);
  const hasPermission = useAuthStore((state) => state.hasPermission);

  if (!exam) {
    return '';
  }

  const hasPermissionToRead = hasPermission({
    exam: ['read'],
  });

  if (!hasPermissionToRead) {
    return (
      <span className={className}>{examLabel(exam, dictionary, locale)}</span>
    );
  }

  return (
    <Link
      to={`/exam/$id`}
      params={{ id: exam.id! }}
      search={{
        referrer: window.location.pathname + window.location.search,
      }}
      className={cn(
        'text-blue-500 hover:text-blue-400 hover:underline focus:text-blue-400 dark:text-blue-400',
        className,
      )}
    >
      {examLabel(exam, dictionary, locale)}
    </Link>
  );
}
