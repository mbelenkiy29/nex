import { cn } from '@/shared/lib/utils';
import { useAuthStore } from '@/features/auth/authStore';
import { conceptLabel } from '@project/backend/features/concept/conceptLabel';
import { ConceptWithRelationships } from '@project/backend/features/concept/conceptSchemas';
import { Link } from '@tanstack/react-router';

export function ConceptLink({
  concept,
  className,
}: {
  concept?: Partial<ConceptWithRelationships>;
  className?: string;
}) {
  const dictionary = useAuthStore((state) => state.dictionary);
  const locale = useAuthStore((state) => state.locale);
  const hasPermission = useAuthStore((state) => state.hasPermission);

  if (!concept) {
    return '';
  }

  const hasPermissionToRead = hasPermission({
    concept: ['read'],
  });

  if (!hasPermissionToRead) {
    return (
      <span className={className}>
        {conceptLabel(concept, dictionary, locale)}
      </span>
    );
  }

  return (
    <Link
      to={`/concept/$id`}
      params={{ id: concept.id! }}
      search={{
        referrer: window.location.pathname + window.location.search,
      }}
      className={cn(
        'text-blue-500 hover:text-blue-400 hover:underline focus:text-blue-400 dark:text-blue-400',
        className,
      )}
    >
      {conceptLabel(concept, dictionary, locale)}
    </Link>
  );
}
