import { useAuthStore } from '@/features/auth/authStore';

export function ApiKeyStatus({ enabled }: { enabled: boolean }) {
  const dictionary = useAuthStore((state) => state.dictionary);

  if (enabled) {
    return (
      <span className="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-green-600/20 ring-inset dark:bg-green-500/10 dark:text-green-400 dark:ring-green-500/20">
        {dictionary.apiKey.enumerators.status.enabled}
      </span>
    );
  }

  return (
    <span className="inline-flex items-center rounded-md bg-red-50 px-2 py-1 text-xs font-medium text-red-700 ring-1 ring-red-600/20 ring-inset dark:bg-red-500/10 dark:text-red-400 dark:ring-red-500/20">
      {dictionary.apiKey.enumerators.status.disabled}
    </span>
  );
}
