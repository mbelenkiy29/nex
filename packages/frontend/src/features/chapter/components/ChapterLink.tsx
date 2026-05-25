import { cn } from '@/shared/lib/utils';
import { useAuthStore } from '@/features/auth/authStore';
import { chapterLabel } from '@project/backend/features/chapter/chapterLabel';
import { ChapterWithRelationships } from '@project/backend/features/chapter/chapterSchemas';
import { Link } from '@tanstack/react-router';

export function ChapterLink({
  chapter,
  className,
}: {
  chapter?: Partial<ChapterWithRelationships>;
  className?: string;
}) {
  const dictionary = useAuthStore((state) => state.dictionary);
  const locale = useAuthStore((state) => state.locale);
  const hasPermission = useAuthStore((state) => state.hasPermission);

  if (!chapter) {
    return '';
  }

  const hasPermissionToRead = hasPermission({
    chapter: ['read'],
  });

  if (!hasPermissionToRead) {
    return (
      <span className={className}>
        {chapterLabel(chapter, dictionary, locale)}
      </span>
    );
  }

  return (
    <Link
      to={`/chapter/$id`}
      params={{ id: chapter.id! }}
      search={{
        referrer: window.location.pathname + window.location.search,
      }}
      className={cn(
        'text-blue-500 hover:text-blue-400 hover:underline focus:text-blue-400 dark:text-blue-400',
        className,
      )}
    >
      {chapterLabel(chapter, dictionary, locale)}
    </Link>
  );
}
