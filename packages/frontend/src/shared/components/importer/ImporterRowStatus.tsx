import { IMPORTER_STATUS } from '@project/backend/shared/schemas/importerSchemas';
import { useAuthStore } from '@/features/auth/authStore';

export function ImporterRowStatus({
  _status,
  _errorMessages,
}: {
  _status: IMPORTER_STATUS;
  _errorMessages?: string[];
}) {
  const dictionary = useAuthStore((state) => state.dictionary);

  if (_status === 'pending') {
    return (
      <span className="inline-flex items-center rounded-md bg-gray-50 px-2 py-1 text-xs font-medium text-gray-600 ring-1 ring-gray-500/10 ring-inset dark:bg-gray-400/10 dark:text-gray-400 dark:ring-gray-400/20">
        {dictionary.shared.importer.pending}
      </span>
    );
  }

  if (_status === 'success') {
    return (
      <span className="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-green-600/20 ring-inset dark:bg-green-500/10 dark:text-green-400 dark:ring-green-500/20">
        {dictionary.shared.importer.success}
      </span>
    );
  }

  if (_status === 'error') {
    return (
      <>
        <span className="inline-flex items-center rounded-md bg-red-50 px-2 py-1 text-xs font-medium text-red-700 ring-1 ring-red-600/20 ring-inset dark:bg-red-500/10 dark:text-red-400 dark:ring-red-500/20">
          {dictionary.shared.importer.error}
        </span>
        {_errorMessages && _errorMessages.length > 0 && (
          <div className="mt-2 space-y-1 text-xs text-red-600 dark:text-red-400">
            {_errorMessages.map((message, index) => (
              <div key={index} className="break-words">
                {message}
              </div>
            ))}
          </div>
        )}
      </>
    );
  }

  return null;
}
