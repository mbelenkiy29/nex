import { cn } from '@/shared/lib/utils';
import { useAuthStore } from '@/features/auth/authStore';
import { practiceQuestionLabel } from '@project/backend/features/practiceQuestion/practiceQuestionLabel';
import { PracticeQuestionWithRelationships } from '@project/backend/features/practiceQuestion/practiceQuestionSchemas';
import { Link } from '@tanstack/react-router';

export function PracticeQuestionLink({
  practiceQuestion,
  className,
}: {
  practiceQuestion?: Partial<PracticeQuestionWithRelationships>;
  className?: string;
}) {
  const dictionary = useAuthStore((state) => state.dictionary);
  const locale = useAuthStore((state) => state.locale);
  const hasPermission = useAuthStore((state) => state.hasPermission);

  if (!practiceQuestion) {
    return '';
  }

  const hasPermissionToRead = hasPermission({
    practiceQuestion: ['read'],
  });

  if (!hasPermissionToRead) {
    return (
      <span className={className}>
        {practiceQuestionLabel(practiceQuestion, dictionary, locale)}
      </span>
    );
  }

  return (
    <Link
      to={`/practice-question/$id`}
      params={{ id: practiceQuestion.id! }}
      search={{
        referrer: window.location.pathname + window.location.search,
      }}
      className={cn(
        'text-blue-500 hover:text-blue-400 hover:underline focus:text-blue-400 dark:text-blue-400',
        className,
      )}
    >
      {practiceQuestionLabel(practiceQuestion, dictionary, locale)}
    </Link>
  );
}
