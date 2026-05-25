import { cn } from '@/shared/lib/utils';
import { useAuthStore } from '@/features/auth/authStore';
import { lessonLabel } from '@project/backend/features/lesson/lessonLabel';
import { LessonWithRelationships } from '@project/backend/features/lesson/lessonSchemas';
import { Link } from '@tanstack/react-router';

export function LessonLink({
  lesson,
  className,
}: {
  lesson?: Partial<LessonWithRelationships>;
  className?: string;
}) {
  const dictionary = useAuthStore((state) => state.dictionary);
  const locale = useAuthStore((state) => state.locale);
  const hasPermission = useAuthStore((state) => state.hasPermission);

  if (!lesson) {
    return '';
  }

  const hasPermissionToRead = hasPermission({
    lesson: ['read'],
  });

  if (!hasPermissionToRead) {
    return (
      <span className={className}>
        {lessonLabel(lesson, dictionary, locale)}
      </span>
    );
  }

  return (
    <Link
      to={`/lesson/$id`}
      params={{ id: lesson.id! }}
      search={{
        referrer: window.location.pathname + window.location.search,
      }}
      className={cn(
        'text-blue-500 hover:text-blue-400 hover:underline focus:text-blue-400 dark:text-blue-400',
        className,
      )}
    >
      {lessonLabel(lesson, dictionary, locale)}
    </Link>
  );
}
