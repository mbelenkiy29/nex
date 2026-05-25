import { cn } from '@/shared/lib/utils';
import { useAuthStore } from '@/features/auth/authStore';
import { examInstanceLabel } from '@project/backend/features/examInstance/examInstanceLabel';
import { ExamInstanceWithRelationships } from '@project/backend/features/examInstance/examInstanceSchemas';
import { Link } from '@tanstack/react-router';

export function ExamInstanceLink({
  examInstance,
  className,
}: {
  examInstance?: Partial<ExamInstanceWithRelationships>;
  className?: string;
}) {
  const dictionary = useAuthStore((state) => state.dictionary);
  const locale = useAuthStore((state) => state.locale);
  const hasPermission = useAuthStore((state) => state.hasPermission);

  if (!examInstance) {
    return '';
  }

  const hasPermissionToRead = hasPermission({
    examInstance: ['read'],
  });

  if (!hasPermissionToRead) {
    return (
      <span className={className}>
        {examInstanceLabel(examInstance, dictionary, locale)}
      </span>
    );
  }

  return (
    <Link
      to={`/exam-instance/$id`}
      params={{ id: examInstance.id! }}
      search={{
        referrer: window.location.pathname + window.location.search,
      }}
      className={cn(
        'text-blue-500 hover:text-blue-400 hover:underline focus:text-blue-400 dark:text-blue-400',
        className,
      )}
    >
      {examInstanceLabel(examInstance, dictionary, locale)}
    </Link>
  );
}
