import { cn } from '@/shared/lib/utils';
import { useAuthStore } from '@/features/auth/authStore';
import { examTypeLabel } from '@project/backend/features/examType/examTypeLabel';
import { ExamTypeWithRelationships } from '@project/backend/features/examType/examTypeSchemas';
import { Link } from '@tanstack/react-router';

export function ExamTypeLink({
  examType,
  className,
}: {
  examType?: Partial<ExamTypeWithRelationships>;
  className?: string;
}) {
  const dictionary = useAuthStore((state) => state.dictionary);
  const locale = useAuthStore((state) => state.locale);
  const hasPermission = useAuthStore((state) => state.hasPermission);

  if (!examType) {
    return '';
  }

  const hasPermissionToRead = hasPermission({
    examType: ['read'],
  });

  if (!hasPermissionToRead) {
    return (
      <span className={className}>
        {examTypeLabel(examType, dictionary, locale)}
      </span>
    );
  }

  return (
    <Link
      to={`/exam-type/$id`}
      params={{ id: examType.id! }}
      search={{
        referrer: window.location.pathname + window.location.search,
      }}
      className={cn(
        'text-blue-500 hover:text-blue-400 hover:underline focus:text-blue-400 dark:text-blue-400',
        className,
      )}
    >
      {examTypeLabel(examType, dictionary, locale)}
    </Link>
  );
}
