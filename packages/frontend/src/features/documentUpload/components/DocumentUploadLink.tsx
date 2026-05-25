import { cn } from '@/shared/lib/utils';
import { useAuthStore } from '@/features/auth/authStore';
import { documentUploadLabel } from '@project/backend/features/documentUpload/documentUploadLabel';
import { DocumentUploadWithRelationships } from '@project/backend/features/documentUpload/documentUploadSchemas';
import { Link } from '@tanstack/react-router';

export function DocumentUploadLink({
  documentUpload,
  className,
}: {
  documentUpload?: Partial<DocumentUploadWithRelationships>;
  className?: string;
}) {
  const dictionary = useAuthStore((state) => state.dictionary);
  const locale = useAuthStore((state) => state.locale);
  const hasPermission = useAuthStore((state) => state.hasPermission);

  if (!documentUpload) {
    return '';
  }

  const hasPermissionToRead = hasPermission({
    documentUpload: ['read'],
  });

  if (!hasPermissionToRead) {
    return (
      <span className={className}>
        {documentUploadLabel(documentUpload, dictionary, locale)}
      </span>
    );
  }

  return (
    <Link
      to={`/document-upload/$id`}
      params={{ id: documentUpload.id! }}
      search={{
        referrer: window.location.pathname + window.location.search,
      }}
      className={cn(
        'text-blue-500 hover:text-blue-400 hover:underline focus:text-blue-400 dark:text-blue-400',
        className,
      )}
    >
      {documentUploadLabel(documentUpload, dictionary, locale)}
    </Link>
  );
}
