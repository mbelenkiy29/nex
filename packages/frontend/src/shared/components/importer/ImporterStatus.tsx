import { IMPORTER_STATUS } from '@project/backend/shared/schemas/importerSchemas';
import { dictionaryFormat } from '@/shared/lib/dictionaryFormat';
import { useAuthStore } from '@/features/auth/authStore';
import { Alert, AlertDescription } from '@/shared/components/ui/alert';
import { Progress } from '@/shared/components/ui/progress';
import {
  LuLoader,
  LuCircleCheck,
  LuCircleX,
  LuTriangleAlert,
} from 'react-icons/lu';

export function ImporterStatus({
  rows,
  state,
}: {
  state: 'idle' | 'uploading' | 'importing' | 'paused' | 'completed';
  rows: { _status: IMPORTER_STATUS }[];
}) {
  const dictionary = useAuthStore((state) => state.dictionary);
  const allCount = rows.length;
  const pendingCount = rows.filter((row) => row._status === 'pending')?.length;
  const nonPendingCount = rows.filter(
    (row) => row._status !== 'pending',
  )?.length;
  const percent = Math.round(((allCount - pendingCount) / allCount) * 100);
  const isAllErrors = rows.every((row) => row._status === 'error');
  const isSomeErrors = rows.some((row) => row._status === 'error');
  const isAllSuccess = rows.every((row) => row._status === 'success');

  if (state === 'importing') {
    return (
      <Alert>
        <LuLoader className="h-4 w-4 animate-spin" />
        <AlertDescription>
          <div className="space-y-2">
            <div>
              {dictionaryFormat(
                dictionary.shared.importer.importedMessage,
                nonPendingCount,
                allCount,
              )}{' '}
              {dictionary.shared.importer.noNavigateAwayMessage}
            </div>
            <Progress value={percent} className="h-2" />
          </div>
        </AlertDescription>
      </Alert>
    );
  }

  if (state === 'completed' && isAllSuccess) {
    return (
      <Alert className="border-green-200 bg-green-50 text-green-900 dark:border-green-800 dark:bg-green-950 dark:text-green-100">
        <LuCircleCheck className="h-4 w-4 text-green-600 dark:text-green-400" />
        <AlertDescription>
          {dictionaryFormat(dictionary.shared.importer.completed.success)}
        </AlertDescription>
      </Alert>
    );
  }

  if (state === 'completed' && isAllErrors) {
    return (
      <Alert className="border-red-200 bg-red-50 text-red-900 dark:border-red-800 dark:bg-red-950 dark:text-red-100">
        <LuCircleX className="h-4 w-4 text-red-600 dark:text-red-400" />
        <AlertDescription>
          {dictionaryFormat(dictionary.shared.importer.completed.allErrors)}
        </AlertDescription>
      </Alert>
    );
  }

  if (state === 'completed' && isSomeErrors) {
    return (
      <Alert className="border-yellow-200 bg-yellow-50 text-yellow-900 dark:border-yellow-800 dark:bg-yellow-950 dark:text-yellow-100">
        <LuTriangleAlert className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
        <AlertDescription>
          {dictionaryFormat(dictionary.shared.importer.completed.someErrors)}
        </AlertDescription>
      </Alert>
    );
  }

  return null;
}
